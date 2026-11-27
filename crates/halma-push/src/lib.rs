//! Meldingen via web push: VAPID (RFC 8292) en versleuteling met aes128gcm (RFC 8291).
//!
//! Alleen rekenwerk, geen netwerk: de Cloudflare Worker verstuurt met
//! zijn eigen `fetch`. De inhoud van een Melding is versleuteld voor het toestel van de Speler.
//! De pushdienst ziet alleen de versleutelde bytes.

use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes128Gcm, Key};
use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64;
use hkdf::Hkdf;
use p256::ecdsa::signature::Signer;
use p256::ecdsa::{Signature, SigningKey};
use p256::{PublicKey, SecretKey, ecdh};
use sha2::Sha256;

pub mod apns;

pub use halma_opslag::{Abonnement, ApnsOmgeving, ApnsToken, Sleutels};
use halma_opslag::Stand;

/// Wat de pushdienst terugzegt.
#[derive(Debug, PartialEq)]
pub enum Uitkomst {
    Gelukt,
    /// 404 of 410: het abonnement bestaat niet meer en moet worden opgeruimd.
    Verlopen,
    Mislukt(String),
}

impl Uitkomst {
    /// De uitkomst bij een HTTP-status van de pushdienst.
    pub fn van_status(status: u16) -> Uitkomst {
        match status {
            200..=299 => Uitkomst::Gelukt,
            404 | 410 => Uitkomst::Verlopen,
            s => Uitkomst::Mislukt(format!("pushdienst antwoordde {s}")),
        }
    }
}

/// Waar een verstuurde Melding heen ging, zodat het juiste ding wordt opgeruimd.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Doel<'a> {
    /// Het `endpoint` van een web push-Abonnement.
    Abonnement(&'a str),
    /// Een APNs-token.
    ApnsToken(&'a str),
}

/// Wat de Opslag moet kunnen om een verlopen Abonnement of token te wissen.
pub trait Opruimer {
    fn ruim_abonnement_op(&mut self, endpoint: &str);
    fn ruim_apns_token_op(&mut self, token: &str);
}

/// Wat er met een Melding gebeurde nadat de pushdienst antwoordde.
#[derive(Debug, PartialEq)]
pub enum Gevolg {
    Verstuurd,
    /// Het Abonnement of token bestaat niet meer en is gewist.
    Opgeruimd,
    /// Mislukt: er wordt niets gewist en niets anders gehinderd; de tekst is voor het log.
    Mislukt(String),
}

/// Kiest wat er bij de `uitkomst` gebeurt: bij `Verlopen` wissen we het `doel`, bij `Mislukt` niets.
pub fn verwerk_uitkomst(uitkomst: Uitkomst, doel: Doel<'_>, opruimer: &mut impl Opruimer) -> Gevolg {
    match uitkomst {
        Uitkomst::Gelukt => Gevolg::Verstuurd,
        Uitkomst::Verlopen => {
            match doel {
                Doel::Abonnement(endpoint) => opruimer.ruim_abonnement_op(endpoint),
                Doel::ApnsToken(token) => opruimer.ruim_apns_token_op(token),
            }
            Gevolg::Opgeruimd
        }
        Uitkomst::Mislukt(e) => Gevolg::Mislukt(e),
    }
}

/// Het VAPID-sleutelpaar van de server.
pub struct Vapid {
    geheim: SecretKey,
    publiek: Vec<u8>,
}

fn willekeurig<const N: usize>() -> [u8; N] {
    let mut b = [0u8; N];
    getrandom::fill(&mut b).expect("systeem geeft geen willekeurige bytes");
    b
}

fn nieuwe_geheime_sleutel() -> SecretKey {
    loop {
        if let Ok(k) = SecretKey::from_slice(&willekeurig::<32>()) {
            return k;
        }
    }
}

fn decodeer(tekst: &str) -> Option<Vec<u8>> {
    B64.decode(tekst.trim().trim_end_matches('=')).ok()
}

impl Vapid {
    fn van(geheim: SecretKey) -> Vapid {
        let publiek = geheim.public_key().to_sec1_bytes().to_vec();
        Vapid { geheim, publiek }
    }

    /// Een nieuw sleutelpaar.
    pub fn nieuw() -> Vapid {
        Self::van(nieuwe_geheime_sleutel())
    }

    /// Het sleutelpaar bij een geheime sleutel als base64url (32 bytes).
    pub fn van_geheim_b64(tekst: &str) -> Result<Vapid, String> {
        let bytes = decodeer(tekst).ok_or("the VAPID key is not base64url")?;
        SecretKey::from_slice(&bytes).map(Self::van).map_err(|e| e.to_string())
    }

    /// De geheime sleutel als base64url, om te bewaren. Nooit tonen of loggen.
    pub fn geheim_b64(&self) -> String {
        B64.encode(self.geheim.to_bytes())
    }

    /// De publieke sleutel als base64url, voor `applicationServerKey` in de app.
    pub fn publiek_b64(&self) -> String {
        B64.encode(&self.publiek)
    }

    /// De header `Authorization` voor een push-bericht naar `endpoint`, 12 uur geldig vanaf `nu_s`.
    pub fn header(&self, endpoint: &str, subject: &str, nu_s: u64) -> Result<String, String> {
        let url = url::Url::parse(endpoint).map_err(|e| e.to_string())?;
        let aud = format!("{}://{}", url.scheme(), url.host_str().ok_or("endpoint has no host")?);
        let aud = match url.port() {
            Some(p) => format!("{aud}:{p}"),
            None => aud,
        };
        let exp = nu_s + 12 * 3600;
        let kop = B64.encode(r#"{"typ":"JWT","alg":"ES256"}"#);
        let claims = B64.encode(serde_json::json!({ "aud": aud, "exp": exp, "sub": subject }).to_string());
        let data = format!("{kop}.{claims}");
        let sig: Signature = SigningKey::from(&self.geheim).sign(data.as_bytes());
        Ok(format!("vapid t={data}.{}, k={}", B64.encode(sig.to_bytes()), self.publiek_b64()))
    }
}

/// De domeinen van de bekende web push-diensten (Chrome/FCM, Firefox, Safari, Edge/WNS).
/// Een host hoort erbij als hij gelijk is aan een domein of eindigt op `.domein`.
const PUSHDIENSTEN: &[&str] = &[
    "fcm.googleapis.com",
    "android.googleapis.com",
    "push.services.mozilla.com",
    "push.apple.com",
    "notify.windows.com",
];

fn bekende_pushdienst(host: &str) -> bool {
    let host = host.to_ascii_lowercase();
    PUSHDIENSTEN.iter().any(|d| host == *d || host.strip_suffix(d).is_some_and(|k| k.ends_with('.')))
}

/// Controleert een abonnement voor het wordt bewaard. Met `alleen_https` (de echte server) moet het
/// adres ook van een bekende pushdienst zijn; zonder (tests met een nepdienst) is elk adres goed.
pub fn controleer(a: &Abonnement, alleen_https: bool) -> Result<(), &'static str> {
    let url = url::Url::parse(&a.endpoint).map_err(|_| "the endpoint is not a valid URL")?;
    let schema_ok = url.scheme() == "https" || (!alleen_https && url.scheme() == "http");
    if !schema_ok || url.host_str().is_none() || a.endpoint.len() > 1000 {
        return Err("the endpoint must be an https address");
    }
    if alleen_https && !url.host_str().is_some_and(bekende_pushdienst) {
        return Err("the endpoint is not a known push service");
    }
    let p = decodeer(&a.keys.p256dh).ok_or("p256dh is not base64url")?;
    PublicKey::from_sec1_bytes(&p).map_err(|_| "p256dh is not a valid key")?;
    if decodeer(&a.keys.auth).is_none_or(|v| v.len() != 16) {
        return Err("auth must be 16 bytes");
    }
    Ok(())
}

/// Versleutelt `inhoud` voor een toestel (RFC 8291, aes128gcm). Geeft de body van het push-bericht.
pub fn versleutel(p256dh: &str, auth: &str, inhoud: &[u8]) -> Result<Vec<u8>, String> {
    versleutel_met(p256dh, auth, inhoud, &nieuwe_geheime_sleutel(), willekeurig::<16>())
}

fn versleutel_met(p256dh: &str, auth: &str, inhoud: &[u8], eigen: &SecretKey, salt: [u8; 16]) -> Result<Vec<u8>, String> {
    let ua_bytes = decodeer(p256dh).ok_or("p256dh is not base64url")?;
    let ua_pub = PublicKey::from_sec1_bytes(&ua_bytes).map_err(|e| e.to_string())?;
    let auth = decodeer(auth).ok_or("auth is not base64url")?;
    let as_pub = eigen.public_key().to_sec1_bytes();

    let gedeeld = ecdh::diffie_hellman(eigen.to_nonzero_scalar(), ua_pub.as_affine());
    let mut key_info = b"WebPush: info\0".to_vec();
    key_info.extend_from_slice(&ua_bytes);
    key_info.extend_from_slice(&as_pub);
    let mut ikm = [0u8; 32];
    Hkdf::<Sha256>::new(Some(&auth), gedeeld.raw_secret_bytes())
        .expand(&key_info, &mut ikm)
        .map_err(|e| e.to_string())?;

    let hk = Hkdf::<Sha256>::new(Some(&salt), &ikm);
    let mut cek = [0u8; 16];
    let mut nonce = [0u8; 12];
    hk.expand(b"Content-Encoding: aes128gcm\0", &mut cek).map_err(|e| e.to_string())?;
    hk.expand(b"Content-Encoding: nonce\0", &mut nonce).map_err(|e| e.to_string())?;

    // Eén record: de inhoud plus het sluitteken 0x02.
    let mut klaar = inhoud.to_vec();
    klaar.push(2);
    let versleuteld = Aes128Gcm::new(&Key::<Aes128Gcm>::from(cek))
        .encrypt(&nonce.into(), klaar.as_slice())
        .map_err(|e| e.to_string())?;

    let mut body = salt.to_vec();
    body.extend_from_slice(&4096u32.to_be_bytes());
    body.push(as_pub.len() as u8);
    body.extend_from_slice(&as_pub);
    body.extend_from_slice(&versleuteld);
    Ok(body)
}

/// Eén push-bericht, klaar om te versturen met `POST` naar `endpoint`.
pub struct PushVerzoek {
    pub endpoint: String,
    pub koppen: Vec<(&'static str, String)>,
    pub body: Vec<u8>,
}

/// Versleutelt `inhoud` voor abonnement `a` en maakt het push-bericht. `nu_s`: seconden sinds 1970.
pub fn push_verzoek(vapid: &Vapid, subject: &str, a: &Abonnement, inhoud: &[u8], nu_s: u64) -> Result<PushVerzoek, String> {
    let body = versleutel(&a.keys.p256dh, &a.keys.auth, inhoud)?;
    let autorisatie = vapid.header(&a.endpoint, subject, nu_s)?;
    Ok(PushVerzoek {
        endpoint: a.endpoint.clone(),
        koppen: vec![
            ("Authorization", autorisatie),
            ("Content-Encoding", "aes128gcm".into()),
            ("Content-Type", "application/octet-stream".into()),
            ("TTL", "86400".into()),
            ("Urgency", "high".into()),
        ],
        body,
    })
}

/// Een Melding "jij bent aan de beurt", voor web push en voor APNs.
#[derive(Debug, Clone, PartialEq)]
pub struct BeurtMelding {
    pub speler_id: i64,
    pub titel: String,
    pub tekst: String,
    /// Het adres van het Potje in de app, zoals `/potje/3`.
    pub url: String,
}

impl BeurtMelding {
    /// De inhoud voor web push (de service worker leest `titel`, `tekst` en `url`).
    pub fn web_inhoud(&self) -> String {
        serde_json::json!({ "titel": self.titel, "tekst": self.tekst, "url": self.url }).to_string()
    }
}

/// Wie na deze stand een Melding krijgt en wat erin staat: de Speler aan de beurt, behalve als die
/// zelf de actie deed (`actie_speler`) of de app open heeft (`is_live`). De tekst staat in de taal van die
/// Speler (`taal_van`; geen taal of Engels is Engels).
pub fn beurt_melding(
    stand: &Stand,
    actie_speler: i64,
    titel: &str,
    is_live: impl Fn(i64) -> bool,
    taal_van: impl Fn(i64) -> Option<String>,
) -> Option<BeurtMelding> {
    if !stand.gestart || stand.afgelopen {
        return None;
    }
    let plek = stand.aan_de_beurt?;
    let aan = stand.spelers.iter().find(|s| s.speler.plek == plek)?;
    let speler_id = aan.speler.speler_id;
    if speler_id == actie_speler || is_live(speler_id) {
        return None;
    }
    let anderen: Vec<&str> =
        stand.spelers.iter().filter(|s| s.speler.speler_id != speler_id).map(|s| s.speler.spelersnaam.as_str()).collect();
    let tekst = halma_opslag::taal::beurt_tekst(taal_van(speler_id).as_deref(), &anderen);
    Some(BeurtMelding {
        speler_id,
        titel: titel.to_string(),
        tekst,
        url: format!("/potje/{}", stand.potje_id),
    })
}

/// De Melding "Vriendverzoek" voor `speler_id`, in zijn taal (`taal`; geen taal of Engels is Engels). Hij opent de app zelf;
/// de Speler vindt het verzoek in Friends.
pub fn vriendverzoek_melding(speler_id: i64, titel: &str, van_naam: &str, taal: Option<&str>) -> BeurtMelding {
    BeurtMelding {
        speler_id,
        titel: titel.to_string(),
        tekst: halma_opslag::taal::vriendverzoek_tekst(taal, van_naam),
        url: "/play/".to_string(),
    }
}

/// De Melding "Uitdaging" voor `speler_id`, in zijn taal. Hij opent de app zelf; de Speler kiest Accept of Decline in Friends.
pub fn uitdaging_melding(speler_id: i64, titel: &str, van_naam: &str, taal: Option<&str>) -> BeurtMelding {
    BeurtMelding {
        speler_id,
        titel: titel.to_string(),
        tekst: halma_opslag::taal::uitdaging_tekst(taal, van_naam),
        url: "/play/".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Default)]
    struct Spion {
        abonnementen: Vec<String>,
        tokens: Vec<String>,
    }
    impl Opruimer for Spion {
        fn ruim_abonnement_op(&mut self, endpoint: &str) {
            self.abonnementen.push(endpoint.into());
        }
        fn ruim_apns_token_op(&mut self, token: &str) {
            self.tokens.push(token.into());
        }
    }

    #[test]
    fn verlopen_abonnement_wordt_opgeruimd_en_een_ander_niet() {
        let mut s = Spion::default();
        let doel = Doel::Abonnement("https://push.example/a");
        assert_eq!(verwerk_uitkomst(Uitkomst::van_status(410), doel, &mut s), Gevolg::Opgeruimd);
        assert_eq!(verwerk_uitkomst(Uitkomst::van_status(404), doel, &mut s), Gevolg::Opgeruimd);
        assert_eq!(s.abonnementen, ["https://push.example/a", "https://push.example/a"]);
        assert!(s.tokens.is_empty());
        // Gelukt en mislukt (ook 500 of 429) laten het Abonnement staan.
        for status in [201, 429, 500] {
            verwerk_uitkomst(Uitkomst::van_status(status), doel, &mut s);
        }
        assert_eq!(s.abonnementen.len(), 2);
    }

    #[test]
    fn token_dat_apple_weigert_wordt_opgeruimd_en_een_andere_fout_houdt_het_token() {
        let mut s = Spion::default();
        let doel = Doel::ApnsToken("abc");
        let verlopen = apns::uitkomst(400, r#"{"reason":"BadDeviceToken"}"#);
        assert_eq!(verwerk_uitkomst(verlopen, doel, &mut s), Gevolg::Opgeruimd);
        assert_eq!(verwerk_uitkomst(apns::uitkomst(410, ""), doel, &mut s), Gevolg::Opgeruimd);
        assert_eq!(s.tokens, ["abc", "abc"]);
        assert!(s.abonnementen.is_empty());

        assert_eq!(verwerk_uitkomst(apns::uitkomst(200, ""), doel, &mut s), Gevolg::Verstuurd);
        let fout = verwerk_uitkomst(apns::uitkomst(403, r#"{"reason":"InvalidProviderToken"}"#), doel, &mut s);
        assert!(matches!(fout, Gevolg::Mislukt(ref e) if e.contains("InvalidProviderToken")));
        assert_eq!(s.tokens.len(), 2);
    }

    /// Ontsleutelt een push-body zoals de browser dat doet (RFC 8291).
    fn ontsleutel(geheim: &SecretKey, auth: &[u8], body: &[u8]) -> Vec<u8> {
        let (salt, idlen) = (&body[..16], body[20] as usize);
        let (as_pub, data) = (&body[21..21 + idlen], &body[21 + idlen..]);
        let gedeeld = ecdh::diffie_hellman(geheim.to_nonzero_scalar(), PublicKey::from_sec1_bytes(as_pub).unwrap().as_affine());
        let mut info = b"WebPush: info\0".to_vec();
        info.extend_from_slice(&geheim.public_key().to_sec1_bytes());
        info.extend_from_slice(as_pub);
        let mut ikm = [0u8; 32];
        Hkdf::<Sha256>::new(Some(auth), gedeeld.raw_secret_bytes()).expand(&info, &mut ikm).unwrap();
        let hk = Hkdf::<Sha256>::new(Some(salt), &ikm);
        let (mut cek, mut nonce) = ([0u8; 16], [0u8; 12]);
        hk.expand(b"Content-Encoding: aes128gcm\0", &mut cek).unwrap();
        hk.expand(b"Content-Encoding: nonce\0", &mut nonce).unwrap();
        let mut klaar = Aes128Gcm::new(&Key::<Aes128Gcm>::from(cek)).decrypt(&nonce.into(), data).expect("ontsleutelen mislukt");
        assert_eq!(klaar.pop(), Some(2));
        klaar
    }

    #[test]
    fn push_verzoek_is_versleuteld_voor_alleen_dat_toestel() {
        let (wim, kees) = (nieuwe_geheime_sleutel(), nieuwe_geheime_sleutel());
        let (wim_auth, kees_auth) = (willekeurig::<16>(), willekeurig::<16>());
        let abo = Abonnement {
            endpoint: "https://push.example/wim".into(),
            keys: Sleutels { p256dh: B64.encode(wim.public_key().to_sec1_bytes()), auth: B64.encode(wim_auth) },
        };
        let melding = vriendverzoek_melding(7, "Leapstone", "Kees", Some("en"));
        let inhoud = melding.web_inhoud();
        let v = push_verzoek(&Vapid::nieuw(), "https://leapstone.example", &abo, inhoud.as_bytes(), 1000).unwrap();

        assert_eq!(v.endpoint, "https://push.example/wim");
        let kop = |naam: &str| v.koppen.iter().find(|(n, _)| n.eq_ignore_ascii_case(naam)).map(|(_, w)| w.as_str()).unwrap();
        assert_eq!(kop("content-encoding"), "aes128gcm");
        assert!(kop("authorization").starts_with("vapid t="));
        for woord in ["Leapstone", "friend", "Kees"] {
            assert!(!v.body.windows(woord.len()).any(|w| w == woord.as_bytes()), "{woord} staat leesbaar in de body");
        }
        assert_eq!(ontsleutel(&wim, &wim_auth, &v.body), inhoud.as_bytes());
        // Een ander toestel kan het niet lezen.
        let r = std::panic::catch_unwind(|| ontsleutel(&kees, &kees_auth, &v.body));
        assert!(r.is_err());
    }

    #[test]
    fn uitdaging_melding_staat_in_de_taal_van_de_ontvanger() {
        let m = uitdaging_melding(7, "Leapstone", "Ann", Some("nl"));
        assert_eq!((m.speler_id, m.tekst.as_str(), m.url.as_str()), (7, "Ann daagt je uit", "/play/"));
        assert_eq!(uitdaging_melding(7, "Leapstone", "Ann", None).tekst, "Ann challenges you");
        assert!(m.web_inhoud().contains("Ann daagt je uit"));
    }

    #[test]
    fn vriendverzoek_melding_staat_in_de_taal_van_de_ontvanger() {
        let m = vriendverzoek_melding(7, "Leapstone", "Ann", Some("nl"));
        assert_eq!((m.speler_id, m.tekst.as_str(), m.url.as_str()), (7, "Ann wil je vriend worden", "/play/"));
        assert_eq!(vriendverzoek_melding(7, "Leapstone", "Ann", None).tekst, "Ann wants to be your friend");
        assert_eq!(vriendverzoek_melding(7, "Leapstone", "Ann", Some("xx")).tekst, "Ann wants to be your friend");
        assert!(m.web_inhoud().contains("Ann wil je vriend worden"));
    }

    #[test]
    fn alleen_bekende_pushdiensten_met_alleen_https() {
        let sleutel = Vapid::nieuw().publiek_b64();
        let abo = |endpoint: &str| Abonnement {
            endpoint: endpoint.into(),
            keys: Sleutels { p256dh: sleutel.clone(), auth: B64.encode([0u8; 16]) },
        };
        for ok in [
            "https://fcm.googleapis.com/fcm/send/abc",
            "https://updates.push.services.mozilla.com/wpush/v2/abc",
            "https://web.push.apple.com/abc",
            "https://db5p.notify.windows.com/?token=abc",
        ] {
            assert_eq!(controleer(&abo(ok), true), Ok(()), "{ok}");
        }
        for fout in [
            "https://evil.example/abc",
            "https://fcm.googleapis.com.evil.example/abc",
            "https://notfcm.googleapis.com.nl/abc",
            "https://xpush.apple.com/abc",
            "https://127.0.0.1/abc",
            "http://fcm.googleapis.com/abc",
        ] {
            assert!(controleer(&abo(fout), true).is_err(), "{fout}");
        }
        // Zonder `alleen_https` (tests met een nepdienst) is elk adres goed.
        assert_eq!(controleer(&abo("http://127.0.0.1:9000/abc"), false), Ok(()));
    }

    /// Testvector uit RFC 8291, paragraaf 5 en bijlage A.
    #[test]
    fn versleuteling_klopt_met_testvector_uit_rfc_8291() {
        let eigen = SecretKey::from_slice(&B64.decode("yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw").unwrap()).unwrap();
        let salt: [u8; 16] = B64.decode("DGv6ra1nlYgDCS1FRnbzlw").unwrap().try_into().unwrap();
        let body = versleutel_met(
            "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4",
            "BTBZMqHH6r4Tts7J_aSIgg",
            b"When I grow up, I want to be a watermelon",
            &eigen,
            salt,
        )
        .unwrap();
        assert_eq!(
            B64.encode(body),
            "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN"
        );
    }

    #[test]
    fn geheime_sleutel_gaat_heen_en_terug() {
        let v = Vapid::nieuw();
        let terug = Vapid::van_geheim_b64(&v.geheim_b64()).unwrap();
        assert_eq!(terug.publiek_b64(), v.publiek_b64());
        assert!(Vapid::van_geheim_b64("geen sleutel").is_err());
    }

    #[test]
    fn header_heeft_de_oorsprong_van_de_pushdienst() {
        let v = Vapid::nieuw();
        let h = v.header("https://push.example:8443/abc", "https://leapstone.example", 1000).unwrap();
        let t = h.strip_prefix("vapid t=").unwrap().split(", k=").next().unwrap();
        let claims: serde_json::Value = serde_json::from_slice(&B64.decode(t.split('.').nth(1).unwrap()).unwrap()).unwrap();
        assert_eq!(claims["aud"], "https://push.example:8443");
        assert_eq!(claims["exp"], 1000 + 12 * 3600);
        assert!(h.ends_with(&format!("k={}", v.publiek_b64())));
    }

    #[test]
    fn status_van_de_pushdienst() {
        assert_eq!(Uitkomst::van_status(201), Uitkomst::Gelukt);
        assert_eq!(Uitkomst::van_status(410), Uitkomst::Verlopen);
        assert!(matches!(Uitkomst::van_status(500), Uitkomst::Mislukt(_)));
    }
}
