//! Meldingen in de iPhone-app via Apple (APNs), met een token-sleutel (JWT, ES256).
//!
//! Alleen rekenwerk, geen netwerk: de Cloudflare
//! Worker verstuurt met zijn eigen `fetch` (in productie HTTP/2). APNs werkt alleen over HTTP/2.

use std::sync::Mutex;

use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64;
use p256::SecretKey;
use p256::ecdsa::signature::Signer;
use p256::ecdsa::{Signature, SigningKey};
use p256::pkcs8::DecodePrivateKey;

use crate::{ApnsOmgeving, BeurtMelding, PushVerzoek, Uitkomst};

pub const PRODUCTIE: &str = "https://api.push.apple.com";
pub const SANDBOX: &str = "https://api.sandbox.push.apple.com";

/// Apple wil een nieuwe JWT hoogstens elke 20 minuten en minstens elk uur. Wij maken er elke 40 minuten een.
const JWT_GELDIG_S: u64 = 40 * 60;

/// De APNs-sleutel van het Apple-team, met de laatst gemaakte JWT.
pub struct Apns {
    sleutel: SigningKey,
    key_id: String,
    team: String,
    /// Het `apns-topic`: de bundel-id van de app.
    topic: String,
    /// Basisadressen per omgeving; tests zetten hier een nep-APNs.
    sandbox: String,
    productie: String,
    jwt: Mutex<Option<(u64, String)>>,
}

impl Apns {
    /// De sleutel uit het `.p8`-bestand van Apple (PKCS#8 PEM). Nooit tonen of loggen.
    pub fn van_pem(key_id: &str, team: &str, topic: &str, pem: &str) -> Result<Apns, String> {
        // Een secret uit een omgevingsvariabele heeft soms `\n` als tekst in plaats van regeleinden.
        let pem = pem.trim().replace("\\n", "\n");
        let geheim = SecretKey::from_pkcs8_pem(&pem).map_err(|_| "the APNs key is not a PKCS#8 P-256 key".to_string())?;
        let key_id = key_id.trim();
        if key_id.is_empty() || team.trim().is_empty() {
            return Err("the APNs key id or team is empty".into());
        }
        Ok(Apns {
            sleutel: SigningKey::from(&geheim),
            key_id: key_id.into(),
            team: team.trim().into(),
            topic: topic.into(),
            sandbox: SANDBOX.into(),
            productie: PRODUCTIE.into(),
            jwt: Mutex::new(None),
        })
    }

    /// Stuurt beide omgevingen naar een ander adres (een nep-APNs in tests).
    pub fn met_adres(mut self, adres: &str) -> Apns {
        let adres = adres.trim_end_matches('/');
        self.sandbox = adres.into();
        self.productie = adres.into();
        self
    }

    fn basis(&self, omgeving: ApnsOmgeving) -> &str {
        match omgeving {
            ApnsOmgeving::Sandbox => &self.sandbox,
            ApnsOmgeving::Production => &self.productie,
        }
    }

    /// De JWT voor de header `authorization`. Hergebruikt de vorige zolang die jonger is dan 40 minuten.
    pub fn jwt(&self, nu_s: u64) -> String {
        let mut slot = self.jwt.lock().unwrap_or_else(|e| e.into_inner());
        if let Some((iat, jwt)) = slot.as_ref()
            && nu_s >= *iat
            && nu_s - iat < JWT_GELDIG_S
        {
            return jwt.clone();
        }
        let kop = B64.encode(serde_json::json!({ "alg": "ES256", "kid": self.key_id }).to_string());
        let claims = B64.encode(serde_json::json!({ "iss": self.team, "iat": nu_s }).to_string());
        let data = format!("{kop}.{claims}");
        let sig: Signature = self.sleutel.sign(data.as_bytes());
        let jwt = format!("{data}.{}", B64.encode(sig.to_bytes()));
        *slot = Some((nu_s, jwt.clone()));
        jwt
    }

    /// De Melding als APNs-verzoek (`POST`) naar het toestel met dit token.
    pub fn verzoek(&self, token: &str, omgeving: ApnsOmgeving, m: &BeurtMelding, nu_s: u64) -> PushVerzoek {
        PushVerzoek {
            endpoint: format!("{}/3/device/{token}", self.basis(omgeving)),
            koppen: vec![
                ("authorization", format!("bearer {}", self.jwt(nu_s))),
                ("apns-topic", self.topic.clone()),
                ("apns-push-type", "alert".into()),
                ("apns-priority", "10".into()),
                // Een dag bewaren als het toestel uit staat, net als de TTL van web push.
                ("apns-expiration", (nu_s + 86400).to_string()),
                // Een nieuwe beurt in hetzelfde Potje vervangt de oude Melding.
                ("apns-collapse-id", m.url.clone()),
                ("content-type", "application/json".into()),
            ],
            body: inhoud(m).into_bytes(),
        }
    }
}

/// De inhoud van een APNs-Melding: alleen wie aan de beurt is, zoals bij web push.
pub fn inhoud(m: &BeurtMelding) -> String {
    serde_json::json!({
        "aps": { "alert": { "title": m.titel, "body": m.tekst }, "sound": "default" },
        "url": m.url,
    })
    .to_string()
}

/// Wat APNs terugzegt. 410 of 400 `BadDeviceToken`: het token bestaat niet (meer) en moet weg.
pub fn uitkomst(status: u16, body: &str) -> Uitkomst {
    let reden = serde_json::from_str::<serde_json::Value>(body)
        .ok()
        .and_then(|j| j["reason"].as_str().map(str::to_string))
        .unwrap_or_default();
    match (status, reden.as_str()) {
        (200, _) => Uitkomst::Gelukt,
        (410, _) | (400, "BadDeviceToken") => Uitkomst::Verlopen,
        (s, r) => Uitkomst::Mislukt(format!("APNs antwoordde {s} {r}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use p256::ecdsa::VerifyingKey;
    use p256::ecdsa::signature::Verifier;
    use p256::pkcs8::{EncodePrivateKey, LineEnding};

    fn proefsleutel() -> (Apns, VerifyingKey) {
        let geheim = SecretKey::from_slice(&[7u8; 32]).unwrap();
        let pem = geheim.to_pkcs8_pem(LineEnding::LF).unwrap();
        let apns = Apns::van_pem("ABC123DEFG", "S9DZ7L5BVD", "nl.leapstone.app", &pem).unwrap();
        (apns, VerifyingKey::from(&SigningKey::from(&geheim)))
    }

    fn melding() -> BeurtMelding {
        BeurtMelding { speler_id: 2, titel: "Leapstone".into(), tekst: "Your turn against Ann".into(), url: "/potje/3".into() }
    }

    #[test]
    fn jwt_is_getekend_met_team_en_sleutel_id() {
        let (apns, publiek) = proefsleutel();
        let jwt = apns.jwt(1_000_000);
        let delen: Vec<&str> = jwt.split('.').collect();
        let kop: serde_json::Value = serde_json::from_slice(&B64.decode(delen[0]).unwrap()).unwrap();
        let claims: serde_json::Value = serde_json::from_slice(&B64.decode(delen[1]).unwrap()).unwrap();
        assert_eq!(kop, serde_json::json!({ "alg": "ES256", "kid": "ABC123DEFG" }));
        assert_eq!(claims, serde_json::json!({ "iss": "S9DZ7L5BVD", "iat": 1_000_000 }));
        let sig = Signature::from_slice(&B64.decode(delen[2]).unwrap()).unwrap();
        publiek.verify(format!("{}.{}", delen[0], delen[1]).as_bytes(), &sig).unwrap();
        // Binnen 40 minuten dezelfde JWT, daarna een nieuwe.
        assert_eq!(apns.jwt(1_000_000 + 39 * 60), jwt);
        assert_ne!(apns.jwt(1_000_000 + 40 * 60), jwt);
    }

    #[test]
    fn sleutel_met_regeleinden_als_tekst_werkt_ook() {
        let geheim = SecretKey::from_slice(&[9u8; 32]).unwrap();
        let pem = geheim.to_pkcs8_pem(LineEnding::LF).unwrap().replace('\n', "\\n");
        assert!(Apns::van_pem("K", "T", "nl.leapstone.app", &pem).is_ok());
        assert!(Apns::van_pem("K", "T", "nl.leapstone.app", "geen sleutel").is_err());
    }

    #[test]
    fn verzoek_gaat_naar_de_omgeving_van_het_token() {
        let (apns, _) = proefsleutel();
        let v = apns.verzoek("abcd", ApnsOmgeving::Sandbox, &melding(), 100);
        assert_eq!(v.endpoint, "https://api.sandbox.push.apple.com/3/device/abcd");
        let p = apns.verzoek("abcd", ApnsOmgeving::Production, &melding(), 100);
        assert_eq!(p.endpoint, "https://api.push.apple.com/3/device/abcd");
        let kop = |n: &str| v.koppen.iter().find(|(k, _)| *k == n).map(|(_, w)| w.clone()).unwrap();
        assert_eq!(kop("apns-topic"), "nl.leapstone.app");
        assert_eq!(kop("apns-push-type"), "alert");
        assert!(kop("authorization").starts_with("bearer ey"));
        let body: serde_json::Value = serde_json::from_slice(&v.body).unwrap();
        assert_eq!(body["aps"]["alert"], serde_json::json!({ "title": "Leapstone", "body": "Your turn against Ann" }));
        assert_eq!(body["url"], "/potje/3");
    }

    #[test]
    fn uitkomst_van_apns() {
        assert_eq!(uitkomst(200, ""), Uitkomst::Gelukt);
        assert_eq!(uitkomst(410, r#"{"reason":"Unregistered"}"#), Uitkomst::Verlopen);
        assert_eq!(uitkomst(400, r#"{"reason":"BadDeviceToken"}"#), Uitkomst::Verlopen);
        assert_eq!(uitkomst(403, r#"{"reason":"InvalidProviderToken"}"#), Uitkomst::Mislukt("APNs antwoordde 403 InvalidProviderToken".into()));
    }
}
