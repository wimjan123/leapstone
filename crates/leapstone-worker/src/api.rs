//! De JSON-API onder `/api`.
//!
//! Gewone Rust zonder Worker-types: de Worker geeft het verzoek door, de tests draaien
//! dezelfde code over SQLite. De regels zelf staan in `halma-opslag`.

use halma_opslag::{Abonnement, ApnsToken, Db, Fout, NieuwRapport, Opslag, SNEL_AANTAL, SNEL_MEER_AANTAL};
use halma_push::Vapid;
use serde::Deserialize;
use serde::de::DeserializeOwned;
use serde_json::{Value, json};

use crate::live::Gebeurtenis;

/// Een verzoek aan de API.
pub struct Verzoek<'a> {
    pub methode: &'a str,
    /// Het pad na `/api`, zoals `/potjes/3/zetten`.
    pub pad: &'a str,
    /// De header `Authorization`, als die er is.
    pub autorisatie: Option<&'a str>,
    pub body: &'a [u8],
}

/// Het antwoord van de API: een status en eventueel JSON.
#[derive(Debug, PartialEq)]
pub struct Antwoord {
    pub status: u16,
    pub json: Option<Value>,
    /// Een interne fout voor het log van de Worker; nooit naar de Speler.
    pub log: Option<String>,
    /// Wat naar de live verbindingen gaat (en eventueel een Melding geeft).
    pub gebeurtenissen: Vec<Gebeurtenis>,
    /// De Speler wiens open live verbindingen dicht moeten (na herstel en na verwijderen: de oude sleutel telt niet meer).
    pub sluit_speler: Option<i64>,
}

impl Antwoord {
    fn json(status: u16, waarde: impl serde::Serialize) -> Result<Antwoord, Fout> {
        let json = serde_json::to_value(waarde).map_err(|e| Fout::Intern(e.to_string()))?;
        Ok(Antwoord { status, json: Some(json), log: None, gebeurtenissen: Vec::new(), sluit_speler: None })
    }

    fn leeg(status: u16) -> Antwoord {
        Antwoord { status, json: None, log: None, gebeurtenissen: Vec::new(), sluit_speler: None }
    }

    fn met(mut self, g: Gebeurtenis) -> Antwoord {
        self.gebeurtenissen.push(g);
        self
    }

    fn fout(f: &Fout, taal: Option<&str>) -> Antwoord {
        let (status, tekst) = f.antwoord_in(taal);
        let log = match f {
            Fout::Intern(t) => Some(t.clone()),
            _ => None,
        };
        Antwoord { status, json: Some(json!({ "fout": tekst })), log, gebeurtenissen: Vec::new(), sluit_speler: None }
    }
}

#[derive(Deserialize)]
struct MaakSpeler {
    spelersnaam: String,
    /// Een Test-Speler telt niet mee op de beheerpagina. Zonder veld: een echte Speler.
    #[serde(default)]
    test: bool,
}

#[derive(Deserialize)]
struct Herstel {
    herstelcode: String,
}

#[derive(Deserialize, Default)]
struct ZoekBody {
    #[serde(default)]
    meer: bool,
}

#[derive(Deserialize)]
struct MaakPotje {
    bord: String,
    aantal_spelers: u32,
    /// Seconden per Zet: 15, 30, 60 of 120. Leeg of weg is geen limiet.
    #[serde(default)]
    denktijd_s: Option<i64>,
}

#[derive(Deserialize)]
struct ZetBody {
    van: usize,
    naar: usize,
}

#[derive(Deserialize)]
struct BerichtBody {
    tekst: String,
}

#[derive(Deserialize)]
struct BlokkeerBody {
    speler_id: i64,
}

#[derive(Deserialize)]
struct VriendcodeBody {
    vriendcode: String,
}

#[derive(Deserialize)]
struct UitdagingBody {
    /// Eén vriend, of
    #[serde(default)]
    vriend_id: Option<i64>,
    /// twee tot vijf vrienden tegelijk (taak 164).
    #[serde(default)]
    vriend_ids: Vec<i64>,
    bord: String,
    #[serde(default)]
    denktijd_s: Option<i64>,
}

#[derive(Deserialize)]
struct UitdagingKeuzeBody {
    keuze: halma_opslag::UitdagingKeuze,
}

#[derive(Deserialize)]
struct Afmelden {
    endpoint: String,
}

#[derive(Deserialize)]
struct TaalBody {
    taal: String,
}

#[derive(Deserialize)]
struct PuzzeldagBody {
    datum: String,
}

#[derive(Deserialize)]
struct ApnsAfmelden {
    token: String,
}

/// De precieze teller voor nieuwe Spelers en herstel (`POST /spelers` en `POST /herstel`, pad zonder
/// `/api`): 5 per 60 s per internetadres, samen. Geeft `Some(antwoord)` als het verzoek niet verder
/// mag (429, of 500 als de teller stuk is); er wordt dan niets aangemaakt. Andere verzoeken: `None`.
pub fn begrens<D: Db>(o: &mut Opslag<D>, methode: &str, pad: &str, ip: Option<&str>) -> Option<Antwoord> {
    let delen: Vec<&str> = pad.trim_matches('/').split('/').collect();
    if !matches!((methode, delen.as_slice()), ("POST", ["spelers"]) | ("POST", ["herstel"])) {
        return None;
    }
    match o.tel_aanvraag(ip) {
        Ok(true) => None,
        Ok(false) => Some(Antwoord::json(429, json!({ "fout": crate::grens::TE_VEEL })).unwrap_or_else(|f| Antwoord::fout(&f, None))),
        Err(f) => Some(Antwoord::fout(&f, None)),
    }
}

/// Behandelt één verzoek aan de API. Zonder `vapid` staat web push uit, zonder `apns` staan
/// Meldingen in de iPhone-app uit.
pub fn behandel<D: Db>(o: &mut Opslag<D>, v: &Verzoek, vapid: Option<&Vapid>, apns: bool) -> Antwoord {
    // Een foutmelding komt in de taal van de Speler die het verzoek deed (Engels zonder sleutel of taal).
    route(o, v, vapid, apns).unwrap_or_else(|f| {
        let taal = v.autorisatie.and_then(|a| a.strip_prefix("Bearer ")).and_then(|k| o.taal_van_sleutel(k));
        Antwoord::fout(&f, taal.as_deref())
    })
}

fn speler_nummer(tekst: &str) -> Result<i64, Fout> {
    tekst.parse().map_err(|_| Fout::Ongeldig("Unknown player number"))
}

fn uitdaging_nummer(tekst: &str) -> Result<i64, Fout> {
    tekst.parse().map_err(|_| Fout::Onbekend("Unknown challenge"))
}

fn route<D: Db>(o: &mut Opslag<D>, v: &Verzoek, vapid: Option<&Vapid>, apns: bool) -> Result<Antwoord, Fout> {
    let delen: Vec<&str> = v.pad.trim_matches('/').split('/').collect();
    match (v.methode, delen.as_slice()) {
        ("POST", ["spelers"]) => {
            let b: MaakSpeler = lees(v)?;
            Antwoord::json(201, o.maak_speler_als(&b.spelersnaam, b.test)?)
        }
        ("DELETE", ["spelers", "mij"]) => {
            let id = speler(o, v)?;
            // De Speler geeft op in lopende Potjes; de anderen zien dat live en krijgen zo nodig een Melding.
            let mut a = Antwoord::leeg(204);
            a.sluit_speler = Some(id);
            for stand in o.verwijder_speler(id)? {
                a = a.met(Gebeurtenis::Stand { stand, beurt_door: Some(id) });
            }
            Ok(a)
        }
        ("POST", ["herstel"]) => {
            let b: Herstel = lees(v)?;
            let nieuw = o.herstel(&b.herstelcode)?;
            let speler_id = nieuw.speler_id;
            let mut a = Antwoord::json(200, nieuw)?;
            a.sluit_speler = Some(speler_id);
            Ok(a)
        }
        ("POST", ["potjes"]) => {
            let b: MaakPotje = lees(v)?;
            let id = speler(o, v)?;
            Antwoord::json(201, o.maak_potje(id, &b.bord, b.aantal_spelers, b.denktijd_s)?)
        }
        // Play online (Snel potje): zoeken koppelt aan wie het eerst wacht, of wacht op een tegenstander. De live
        // verbinding (en het alarm van het Durable Object, 20 s) doen de rest; de app hoeft niet te pollen.
        ("POST", ["snel"]) => {
            let id = speler(o, v)?;
            // Zonder inhoud: een Snel potje met 2 Spelers. `{"meer": true}`: "4 or 6 players".
            let b: ZoekBody = if v.body.is_empty() { ZoekBody::default() } else { lees(v)? };
            let stand = o.zoek_snel_potje_met(id, if b.meer { SNEL_MEER_AANTAL } else { SNEL_AANTAL })?;
            // Is de Speler net als tweede gekoppeld, dan begint de eerste beurt: de wachtende Speler krijgt een Melding als de app dicht is.
            let beurt_door = (stand.gestart && stand.spelers.last().is_some_and(|s| s.speler.speler_id == id)).then_some(id);
            Ok(Antwoord::json(200, &stand)?.met(Gebeurtenis::Stand { stand, beurt_door }))
        }
        ("DELETE", ["snel", potje]) => {
            let id = speler(o, v)?;
            // Wachten er anderen (Snel potje voor meer Spelers), dan zien zij live dat er een plek vrijkwam.
            let mut a = Antwoord::leeg(204);
            if let Some(stand) = o.stop_zoeken(id, potje_id(potje)?)? {
                a = a.met(Gebeurtenis::Stand { stand, beurt_door: None });
            }
            Ok(a)
        }
        ("GET", ["mijn-potjes"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.mijn_potjes(id)?)
        }
        ("GET", ["ranglijst"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.ranglijst(id)?)
        }
        ("GET", ["statistieken"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.statistieken(id)?)
        }
        ("GET", ["prestaties"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.prestaties(id)?)
        }
        ("GET", ["vrienden"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.vriendenlijst(id)?)
        }
        // Vriend toevoegen (taak 162): eerst de Spelersnaam bij de Vriendcode, dan het Vriendverzoek, dan keurt de ander goed of weigert.
        // Deze routes hebben een strakkere grens (`Teller::Vriend` in `grens.rs`) tegen het raden van codes.
        ("GET", ["vrienden", "code", code]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.zoek_vriendcode(id, code)?)
        }
        ("POST", ["vrienden", "verzoeken"]) => {
            let b: VriendcodeBody = lees(v)?;
            let id = speler(o, v)?;
            let uitkomst = o.vraag_vriend(id, &b.vriendcode)?;
            let mut a = Antwoord::json(200, &uitkomst)?;
            // Alleen een nieuw verzoek geeft een Melding aan de ander; een herhaling of een weigering niet.
            if uitkomst.melding {
                a = a.met(Gebeurtenis::Vriendverzoek { aan: uitkomst.aan, van_naam: uitkomst.van_naam });
            }
            Ok(a)
        }
        ("POST", ["vrienden", "verzoeken", van, "goedkeuren"]) => {
            let id = speler(o, v)?;
            o.keur_vriendverzoek_goed(id, speler_nummer(van)?)?;
            Ok(Antwoord::leeg(204))
        }
        ("DELETE", ["vrienden", "verzoeken", van]) => {
            let id = speler(o, v)?;
            o.weiger_vriendverzoek(id, speler_nummer(van)?)?;
            Ok(Antwoord::leeg(204))
        }
        ("DELETE", ["vrienden", vriend]) => {
            let id = speler(o, v)?;
            let vriend = vriend.parse().map_err(|_| Fout::Ongeldig("Unknown player number"))?;
            o.verwijder_vriend(id, vriend)?;
            Ok(Antwoord::leeg(204))
        }
        // Eén vriend uitdagen (taak 163). Maken telt mee voor `Teller::Vriend` (`grens.rs`), zodat niemand vrienden met Meldingen bestookt.
        // De uitdager volgt zijn Uitdaging met GET; de uitgedaagde kiest Accept (maakt het Potje) of Decline.
        ("POST", ["uitdagingen"]) => {
            let b: UitdagingBody = lees(v)?;
            let id = speler(o, v)?;
            let vrienden: Vec<i64> = b.vriend_id.into_iter().chain(b.vriend_ids).collect();
            let uitkomst = o.daag_vrienden_uit(id, &vrienden, &b.bord, b.denktijd_s)?;
            let mut a = Antwoord::json(200, &uitkomst)?;
            for &aan in &uitkomst.aan {
                a = a.met(Gebeurtenis::Uitdaging { aan, van_naam: uitkomst.van_naam.clone() });
            }
            Ok(a)
        }
        ("GET", ["uitdagingen", uitdaging]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.uitdaging_stand(id, uitdaging_nummer(uitdaging)?)?)
        }
        ("POST", ["uitdagingen", uitdaging, "accepteren"]) => {
            let id = speler(o, v)?;
            // Het Potje is er pas als iedereen die is uitgedaagd accepteerde (taak 164).
            let info = o.accepteer_uitdaging(id, uitdaging_nummer(uitdaging)?)?;
            let Some(info) = info else {
                return Antwoord::json(200, serde_json::json!({ "potje": null }));
            };
            // Het Potje is vol: de eerste beurt begint nu (en met een Denktijd moet het alarm zijn tijd weten).
            let stand = o.stand_zonder_lid(info.potje_id)?;
            Ok(Antwoord::json(200, serde_json::json!({ "potje": info }))?.met(Gebeurtenis::Stand { stand, beurt_door: Some(id) }))
        }
        // De uitdager kiest na een Decline of na 5 minuten: beginnen met wie accepteerde, of vullen met Computerspelers.
        ("POST", ["uitdagingen", uitdaging, "start"]) => {
            let b: UitdagingKeuzeBody = lees(v)?;
            let id = speler(o, v)?;
            let info = o.start_uitdaging(id, uitdaging_nummer(uitdaging)?, b.keuze)?;
            let stand = o.stand_zonder_lid(info.potje_id)?;
            Ok(Antwoord::json(200, info)?.met(Gebeurtenis::Stand { stand, beurt_door: Some(id) }))
        }
        ("DELETE", ["uitdagingen", uitdaging]) => {
            let id = speler(o, v)?;
            o.weiger_uitdaging(id, uitdaging_nummer(uitdaging)?)?;
            Ok(Antwoord::leeg(204))
        }
        ("GET", ["potjes", potje]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.stand(id, potje_id(potje)?)?)
        }
        ("POST", ["potjes", potje, "zetten"]) => {
            let b: ZetBody = lees(v)?;
            let id = speler(o, v)?;
            let stand = o.doe_zet(id, potje_id(potje)?, b.van, b.naar)?;
            Ok(Antwoord::json(200, &stand)?.met(Gebeurtenis::Stand { stand, beurt_door: Some(id) }))
        }
        ("POST", ["potjes", potje, "opgeven"]) => {
            let id = speler(o, v)?;
            let stand = o.geef_op(id, potje_id(potje)?)?;
            Ok(Antwoord::json(200, &stand)?.met(Gebeurtenis::Stand { stand, beurt_door: Some(id) }))
        }
        // De live verbinding is een WebSocket (zie `live.rs`); het Durable Object neemt die eerder aan.
        ("GET", ["potjes", _, "live"]) => Ok(Antwoord {
            status: 426,
            json: Some(json!({ "fout": "Live updates need a WebSocket" })),
            log: None,
            gebeurtenissen: Vec::new(),
            sluit_speler: None,
        }),
        // De Vaste zinnen van een Snel potje: één lijst, in `halma-opslag`. Zonder sleutel; er staat niets persoonlijks in.
        ("GET", ["vaste-zinnen"]) => Antwoord::json(200, halma_opslag::VASTE_ZINNEN),
        ("GET", ["potjes", potje, "berichten"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.berichten(id, potje_id(potje)?)?)
        }
        ("POST", ["potjes", potje, "berichten"]) => {
            let b: BerichtBody = lees(v)?;
            let id = speler(o, v)?;
            let potje_id = potje_id(potje)?;
            let bericht = o.stuur_bericht(id, potje_id, &b.tekst)?;
            // Geen Melding voor Berichten. Wie de afzender blokkeerde, krijgt het niet live.
            let blokkeerders = o.blokkeerders_van(id)?;
            let leden = o.leden(potje_id)?;
            Ok(Antwoord::json(201, &bericht)?.met(Gebeurtenis::Bericht { potje_id, bericht, leden, blokkeerders }))
        }
        ("POST", ["potjes", potje, "rapporten"]) => {
            let b: NieuwRapport = lees(v)?;
            let id = speler(o, v)?;
            o.rapporteer(id, potje_id(potje)?, b)?;
            Ok(Antwoord::leeg(201))
        }
        ("GET", ["blokkades"]) => {
            let id = speler(o, v)?;
            Antwoord::json(200, o.blokkades(id)?)
        }
        ("POST", ["blokkades"]) => {
            let b: BlokkeerBody = lees(v)?;
            let id = speler(o, v)?;
            o.blokkeer(id, b.speler_id)?;
            Ok(Antwoord::leeg(204))
        }
        ("DELETE", ["blokkades", ander]) => {
            let id = speler(o, v)?;
            let ander = ander.parse().map_err(|_| Fout::Ongeldig("Unknown player number"))?;
            o.deblokkeer(id, ander)?;
            Ok(Antwoord::leeg(204))
        }
        ("GET", ["uitnodigingen", code]) => Antwoord::json(200, o.potje_bij_uitnodiging(code)?),
        ("POST", ["uitnodigingen", code, "meedoen"]) => {
            let id = speler(o, v)?;
            let was_vol = o.potje_bij_uitnodiging(code)?.vol;
            let info = o.doe_mee(id, code)?;
            // Wie in de Wachtkamer wacht, ziet direct wie er bij komt; vol is de eerste beurt.
            let stand = o.stand_zonder_lid(info.potje_id)?;
            let beurt_door = (!was_vol && info.vol).then_some(id);
            Ok(Antwoord::json(200, info)?.met(Gebeurtenis::Stand { stand, beurt_door }))
        }
        ("GET", ["push", "sleutel"]) => {
            let vapid = vapid.ok_or(Fout::Onbekend("Notifications are off"))?;
            Antwoord::json(200, json!({ "sleutel": vapid.publiek_b64() }))
        }
        ("POST", ["push", "abonnement"]) => {
            vapid.ok_or(Fout::Onbekend("Notifications are off"))?;
            let a: Abonnement = lees(v)?;
            halma_push::controleer(&a, true).map_err(Fout::Ongeldig)?;
            let id = speler(o, v)?;
            o.bewaar_abonnement(id, &a)?;
            Ok(Antwoord::leeg(204))
        }
        ("DELETE", ["push", "abonnement"]) => {
            let b: Afmelden = lees(v)?;
            let id = speler(o, v)?;
            o.verwijder_abonnement(id, &b.endpoint)?;
            Ok(Antwoord::leeg(204))
        }
        ("POST", ["push", "apns"]) => {
            if !apns {
                return Err(Fout::Onbekend("Notifications are off"));
            }
            let t: ApnsToken = lees(v)?;
            let id = speler(o, v)?;
            o.bewaar_apns_token(id, &t)?;
            Ok(Antwoord::leeg(204))
        }
        ("DELETE", ["push", "apns"]) => {
            let b: ApnsAfmelden = lees(v)?;
            let id = speler(o, v)?;
            o.verwijder_apns_token(id, &b.token)?;
            Ok(Antwoord::leeg(204))
        }
        ("POST", ["taal"]) => {
            let b: TaalBody = lees(v)?;
            let id = speler(o, v)?;
            o.zet_taal(id, &b.taal)?;
            Ok(Antwoord::leeg(204))
        }
        ("POST", ["puzzeldagen"]) => {
            let b: PuzzeldagBody = lees(v)?;
            let id = speler(o, v)?;
            o.bewaar_puzzeldag(id, &b.datum)?;
            Ok(Antwoord::leeg(204))
        }
        ("GET", ["gezond"]) => Antwoord::json(200, json!({ "ok": true })),
        _ => Err(Fout::Onbekend("Unknown address")),
    }
}

fn speler<D: Db>(o: &Opslag<D>, v: &Verzoek) -> Result<i64, Fout> {
    let sleutel = v.autorisatie.and_then(|a| a.strip_prefix("Bearer ")).ok_or(Fout::NietIngelogd)?;
    o.speler_van_sleutel(sleutel)
}

fn potje_id(tekst: &str) -> Result<i64, Fout> {
    tekst.parse().map_err(|_| Fout::Ongeldig("Unknown game number"))
}

fn lees<T: DeserializeOwned>(v: &Verzoek) -> Result<T, Fout> {
    serde_json::from_slice(v.body).map_err(|_| Fout::Ongeldig("The request is not valid JSON for this address"))
}

/// De oorsprongen van de native app (Tauri-webview): Android, Android met https-schema, iOS.
pub const APP_ORIGINS: [&str; 3] = ["http://tauri.localhost", "https://tauri.localhost", "tauri://localhost"];

/// CORS-koppen voor een antwoord van `/api`. Alleen de app mag de API vanuit een andere oorsprong
/// aanroepen; een andere website kan dat vanuit de browser niet. `vooraf` is het OPTIONS-verzoek
/// dat de browser vooraf stuurt.
pub fn cors_koppen(origin: Option<&str>, vooraf: bool) -> Vec<(&'static str, String)> {
    let mut koppen = vec![("Vary", "origin, access-control-request-method, access-control-request-headers".to_string())];
    if let Some(o) = origin.filter(|o| APP_ORIGINS.contains(o)) {
        koppen.push(("Access-Control-Allow-Origin", o.to_string()));
        if vooraf {
            koppen.push(("Access-Control-Allow-Methods", "GET,POST,DELETE".into()));
            koppen.push(("Access-Control-Allow-Headers", "authorization,content-type,accept".into()));
            koppen.push(("Access-Control-Max-Age", "600".into()));
        }
    }
    koppen
}

#[cfg(test)]
mod tests {
    use super::*;
    use halma_core::Game;
    use halma_opslag::SqliteOpslag;

    struct Test {
        o: SqliteOpslag,
    }

    impl Test {
        fn nieuw() -> Test {
            Test { o: SqliteOpslag::in_geheugen().unwrap() }
        }

        fn vraag(&mut self, methode: &str, pad: &str, sleutel: Option<&str>, body: Option<Value>) -> (u16, Value) {
            self.vraag_met_push(methode, pad, sleutel, body, None)
        }

        /// Zoals `vraag`, met web push (en Meldingen in de iPhone-app) aan als er een `vapid` is.
        fn vraag_met_push(&mut self, methode: &str, pad: &str, sleutel: Option<&str>, body: Option<Value>, vapid: Option<&Vapid>) -> (u16, Value) {
            let autorisatie = sleutel.map(|s| format!("Bearer {s}"));
            let body = body.map(|b| b.to_string()).unwrap_or_default();
            let a = behandel(
                &mut self.o,
                &Verzoek { methode, pad, autorisatie: autorisatie.as_deref(), body: body.as_bytes() },
                vapid,
                vapid.is_some(),
            );
            (a.status, a.json.unwrap_or(Value::Null))
        }

        fn speler(&mut self, naam: &str) -> String {
            let (s, j) = self.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": naam })));
            assert_eq!(s, 201);
            j["sleutel"].as_str().unwrap().to_string()
        }

        /// Een vol Potje met een Speler per naam; plek 1 is de eerste naam. Geeft het Potje en de sleutels in volgorde van plek.
        fn vol_potje(&mut self, bord: &str, namen: &[&str]) -> (i64, Vec<String>) {
            let sleutels: Vec<String> = namen.iter().map(|n| self.speler(n)).collect();
            let (s, p) = self.vraag("POST", "/potjes", Some(&sleutels[0]), Some(json!({ "bord": bord, "aantal_spelers": namen.len() })));
            assert_eq!(s, 201, "{p}");
            let code = p["uitnodiging"].as_str().unwrap().to_string();
            for sleutel in &sleutels[1..] {
                assert_eq!(self.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(sleutel), None).0, 200);
            }
            (p["potje_id"].as_i64().unwrap(), sleutels)
        }

        /// Een Zet van de Speler aan de beurt in `spiegel`, die daarna dezelfde Zet doet.
        fn zet(&mut self, id: i64, sleutels: &[String], spiegel: &mut Game) -> Value {
            let wie = spiegel.current_player();
            let van = (0..spiegel.board().len()).find(|&v| spiegel.stone_at(v) == Some(wie) && !spiegel.destinations(v).is_empty()).unwrap();
            let naar = spiegel.destinations(van)[0];
            let (s, v) = self.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&sleutels[wie]), Some(json!({ "van": van, "naar": naar })));
            assert_eq!(s, 200, "{v}");
            spiegel.make_move(van, naar).unwrap();
            v
        }
    }

    fn abonnement_json(endpoint: &str) -> Value {
        // Een geldige publieke sleutel (RFC 8291, bijlage A).
        json!({
            "endpoint": endpoint,
            "keys": { "p256dh": "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4", "auth": "BTBZMqHH6r4Tts7J_aSIgg" }
        })
    }

    /// Een geldige eerste Zet voor Speler 1 op een nieuw sterbord voor twee.
    fn eerste_zet() -> (usize, usize) {
        let g = Game::new_star(2).unwrap();
        g.start_cells(0).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap()
    }

    #[test]
    fn de_zesde_herstelpoging_binnen_een_minuut_krijgt_429() {
        let mut t = Test::nieuw();
        let ip = Some("203.0.113.7");
        let body = json!({ "herstelcode": "AAAA-AAAA-AAAA-AAAA-AAAA" }).to_string();
        let v = Verzoek { methode: "POST", pad: "/herstel", autorisatie: None, body: body.as_bytes() };
        for _ in 0..5 {
            assert!(begrens(&mut t.o, "POST", "/herstel", ip).is_none());
            // Een onbekende Herstelcode geeft een gewone fout, geen 429.
            assert_ne!(behandel(&mut t.o, &v, None, false).status, 429);
        }
        let a = begrens(&mut t.o, "POST", "/herstel", ip).expect("de 6e wordt geweigerd");
        assert_eq!(a.status, 429);
        assert_eq!(a.json, Some(json!({ "fout": "Slow down. Try again in a moment." })));
        // Samen met nieuwe Spelers, per internetadres; andere routes en adressen tellen niet mee.
        assert_eq!(begrens(&mut t.o, "POST", "/spelers", ip).unwrap().status, 429);
        assert!(begrens(&mut t.o, "GET", "/ranglijst", ip).is_none());
        assert!(begrens(&mut t.o, "POST", "/herstel", Some("198.51.100.1")).is_none());
    }

    #[test]
    fn een_potje_via_een_uitnodiging_spelen() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let bob = t.speler("Bob");

        let (s, potje) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        assert_eq!(s, 201);
        let id = potje["potje_id"].as_i64().unwrap();
        let code = potje["uitnodiging"].as_str().unwrap().to_string();

        let (s, info) = t.vraag("GET", &format!("/uitnodigingen/{code}"), None, None);
        assert_eq!((s, info["vol"].as_bool()), (200, Some(false)));
        assert_eq!(t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), None, None).0, 401, "zonder sleutel kan niemand meedoen");
        let (s, info) = t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);
        assert_eq!((s, info["vol"].as_bool()), (200, Some(true)));

        let (van, naar) = eerste_zet();
        let zet = json!({ "van": van, "naar": naar });
        let (s, _) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&bob), Some(zet.clone()));
        assert_eq!(s, 409, "Bob is niet aan de beurt");
        let (s, stand) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(zet));
        assert_eq!(s, 200);
        assert_eq!(stand["versie"], 1);
        assert_eq!(stand["aan_de_beurt"], 2);
        assert_eq!((&stand["laatste_zet"]["van"], &stand["laatste_zet"]["naar"]), (&json!(van), &json!(naar)));

        let (s, bobs_stand) = t.vraag("GET", &format!("/potjes/{id}"), Some(&bob), None);
        assert_eq!((s, bobs_stand["stand"][naar].as_u64()), (200, Some(1)));
        // De andere Speler ziet dezelfde stand (de servertijd verschilt per vraag).
        let zonder_klok = |mut v: Value| {
            v.as_object_mut().unwrap().remove("server_tijd_ms");
            v
        };
        assert_eq!(zonder_klok(bobs_stand), zonder_klok(stand));

        let (s, b) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&bob), Some(json!({ "tekst": " Nice move " })));
        assert_eq!((s, b["tekst"].as_str()), (201, Some("Nice move")));
        assert_eq!((&b["plek"], &b["spelersnaam"]), (&json!(2), &json!("Bob")));
        let (_, lijst) = t.vraag("GET", &format!("/potjes/{id}/berichten"), Some(&ann), None);
        assert_eq!(lijst.as_array().unwrap().len(), 1);

        let (s, mijn) = t.vraag("GET", "/mijn-potjes", Some(&ann), None);
        assert_eq!((s, mijn[0]["potje_id"].as_i64()), (200, Some(id)));

        let (s, stand) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&bob), None);
        assert_eq!((s, stand["afgelopen"].as_bool(), stand["winnaar"].as_u64()), (200, Some(true), Some(1)));
        let (s, lijst) = t.vraag("GET", "/ranglijst", Some(&bob), None);
        assert_eq!((s, lijst[0]["spelersnaam"].as_str()), (200, Some("Ann")));

        let (s, stat) = t.vraag("GET", "/statistieken", Some(&ann), None);
        assert_eq!((s, stat["gespeeld"].as_u64(), stat["gewonnen"].as_u64(), stat["verloren"].as_u64()), (200, Some(1), Some(1), Some(0)));
        let (_, stat) = t.vraag("GET", "/statistieken", Some(&bob), None);
        assert_eq!((stat["gewonnen"].as_u64(), stat["verloren"].as_u64()), (Some(0), Some(1)));
        assert_eq!(t.vraag("GET", "/statistieken", None, None).0, 401);

        // Prestaties: alleen de eigen, alle tien, en zonder login 401.
        let behaald = |lijst: &Value, id: &str| lijst.as_array().unwrap().iter().find(|p| p["id"] == id).unwrap()["behaald_ms"].as_i64();
        let (s, lijst) = t.vraag("GET", "/prestaties", Some(&ann), None);
        assert_eq!((s, lijst.as_array().map(|l| l.len())), (200, Some(10)));
        assert!(behaald(&lijst, "first_win").is_some());
        assert_eq!(behaald(&lijst, "wins_10"), None);
        let (_, lijst) = t.vraag("GET", "/prestaties", Some(&bob), None);
        assert_eq!(behaald(&lijst, "first_win"), None, "Bob verloor: geen Prestatie, en die van Ann zijn niet van hem");
        assert_eq!(t.vraag("GET", "/prestaties", None, None).0, 401);
        // Geen route geeft de Prestaties van een ander.
        for pad in ["/prestaties/1", "/spelers/1/prestaties", "/prestaties?speler_id=1"] {
            let (s, lijst) = t.vraag("GET", pad, Some(&bob), None);
            assert!(s == 404 || lijst.as_array().is_none_or(|l| l.iter().all(|p| p["behaald_ms"].is_null())), "{pad}");
        }
    }

    #[test]
    fn puzzeldagen_vragen_een_sleutel_en_een_echte_datum() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        assert_eq!(t.vraag("POST", "/puzzeldagen", None, Some(json!({ "datum": "2024-01-10" }))).0, 401);
        assert_eq!(t.vraag("POST", "/puzzeldagen", Some(&ann), Some(json!({ "datum": "morgen" }))).0, 400);
        assert_eq!(t.vraag("POST", "/puzzeldagen", Some(&ann), Some(json!({ "datum": "2024-02-30" }))).0, 400);
    }

    #[test]
    fn fouten_geven_de_juiste_status_en_engelse_tekst() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let (s, j) = t.vraag("GET", "/mijn-potjes", None, None);
        assert_eq!((s, j["fout"].as_str()), (401, Some("Unknown key. Choose your player name again.")));
        assert_eq!(t.vraag("GET", "/mijn-potjes", Some("fout"), None).0, 401);
        assert_eq!(t.vraag("GET", "/potjes/999", Some(&ann), None).0, 404);
        assert_eq!(t.vraag("GET", "/potjes/abc", Some(&ann), None).0, 400);
        assert_eq!(t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "rond", "aantal_spelers": 2 }))).0, 400);
        assert_eq!(t.vraag("POST", "/spelers", None, None).0, 400);
        let (s, j) = t.vraag("GET", "/bestaat-niet", None, None);
        assert_eq!((s, j["fout"].as_str()), (404, Some("Unknown address")));
        assert_eq!(t.vraag("GET", "/push/sleutel", None, None).0, 404);
        assert_eq!(t.vraag("GET", "/potjes/1/live", Some(&ann), None).0, 426);
        assert_eq!(t.vraag("GET", "/gezond", None, None), (200, json!({ "ok": true })));
    }

    #[test]
    fn herstelcode_geeft_een_nieuwe_sleutel() {
        let mut t = Test::nieuw();
        let (_, nieuw) = t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "Ann" })));
        let code = nieuw["herstelcode"].as_str().unwrap().to_lowercase();
        let (s, terug) = t.vraag("POST", "/herstel", None, Some(json!({ "herstelcode": code })));
        assert_eq!((s, &terug["speler_id"]), (200, &nieuw["speler_id"]));
        assert_eq!(t.vraag("GET", "/mijn-potjes", nieuw["sleutel"].as_str(), None).0, 401);
        assert_eq!(t.vraag("GET", "/mijn-potjes", terug["sleutel"].as_str(), None).0, 200);
        // Mensen tikken spaties in plaats van streepjes; een onbekende code is 404.
        let getikt = nieuw["herstelcode"].as_str().unwrap().to_lowercase().replace('-', " ");
        let (s, v) = t.vraag("POST", "/herstel", None, Some(json!({ "herstelcode": getikt })));
        assert_eq!((s, &v["speler_id"]), (200, &nieuw["speler_id"]));
        assert_eq!(t.vraag("POST", "/herstel", None, Some(json!({ "herstelcode": "AAAA-BBBB" }))).0, 404);
    }

    #[test]
    fn account_verwijderen_via_de_api() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let bob = t.speler("Bob");
        let (_, potje) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let id = potje["potje_id"].as_i64().unwrap();
        let code = potje["uitnodiging"].as_str().unwrap().to_string();
        t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);

        // Een token van de iPhone-app gaat mee weg met het account.
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let vapid = Vapid::nieuw();
        let token = json!({ "token": "ab".repeat(32), "omgeving": "sandbox" });
        assert_eq!(t.vraag_met_push("POST", "/push/apns", Some(&ann), Some(token), Some(&vapid)).0, 204);
        assert_eq!(t.o.apns_tokens_van(ann_id).unwrap().len(), 1);

        assert_eq!(t.vraag("DELETE", "/spelers/mij", None, None).0, 401);
        assert_eq!(t.vraag("DELETE", "/spelers/mij", Some(&ann), None).0, 204);
        assert!(t.o.apns_tokens_van(ann_id).unwrap().is_empty());
        assert_eq!(t.vraag("DELETE", "/spelers/mij", Some(&ann), None).0, 401, "de sleutel werkt niet meer");
        assert_eq!(t.vraag("GET", "/mijn-potjes", Some(&ann), None).0, 401);

        // Bob ziet "Deleted player", wint doordat Ann opgaf, en de Ranglijst heeft alleen Bob.
        let (s, stand) = t.vraag("GET", &format!("/potjes/{id}"), Some(&bob), None);
        assert_eq!((s, stand["spelers"][0]["spelersnaam"].as_str(), stand["winnaar"].as_u64()), (200, Some("Deleted player"), Some(2)));
        let (_, lijst) = t.vraag("GET", "/ranglijst", Some(&bob), None);
        assert_eq!(lijst.as_array().unwrap().len(), 1);
    }

    #[test]
    fn vriendenlijst_via_de_api() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let bob = t.speler("Bob");
        assert_eq!(t.vraag("GET", "/vrienden", None, None).0, 401);
        let (s, l) = t.vraag("GET", "/vrienden", Some(&ann), None);
        assert_eq!(s, 200);
        assert_eq!(l["vriendcode"].as_str().unwrap().len(), 8);
        assert_eq!(l["vrienden"], json!([]));
        let (_, potje) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let code = potje["uitnodiging"].as_str().unwrap().to_string();
        t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);
        let (_, l) = t.vraag("GET", "/vrienden", Some(&ann), None);
        assert_eq!(l["vrienden"][0]["spelersnaam"], "Bob");
        let bob_id = l["vrienden"][0]["speler_id"].as_i64().unwrap();
        assert_eq!(t.vraag("DELETE", "/vrienden/abc", Some(&ann), None).0, 400);
        assert_eq!(t.vraag("DELETE", &format!("/vrienden/{bob_id}"), Some(&ann), None).0, 204);
        let (_, l) = t.vraag("GET", "/vrienden", Some(&ann), None);
        assert_eq!(l["vrienden"], json!([]));
    }

    #[test]
    fn rapporteren_en_blokkeren_via_de_api() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let bob = t.speler("Bob");
        let (_, potje) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let id = potje["potje_id"].as_i64().unwrap();
        let code = potje["uitnodiging"].as_str().unwrap().to_string();
        t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);
        let (_, b) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&bob), Some(json!({ "tekst": "rude" })));
        let bob_id = b["speler_id"].as_i64().unwrap();

        let rapport = json!({ "bericht_id": b["id"] });
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/rapporten"), None, Some(rapport.clone())).0, 401);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/rapporten"), Some(&ann), Some(rapport)).0, 201);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/rapporten"), Some(&ann), Some(json!({}))).0, 400);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/rapporten"), Some(&ann), Some(json!({ "speler_id": bob_id }))).0, 201);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/rapporten"), Some(&ann), Some(json!({ "bericht_id": 999 }))).0, 404);
        let open = t.o.open_rapporten().unwrap();
        assert_eq!(open.len(), 2, "een over het Bericht, een over de Speler");
        assert!(open.iter().any(|r| r.tekst.as_deref() == Some("rude")));

        assert_eq!(t.vraag("POST", "/blokkades", Some(&ann), Some(json!({ "speler_id": bob_id }))).0, 204);
        let (s, lijst) = t.vraag("GET", "/blokkades", Some(&ann), None);
        assert_eq!((s, lijst), (200, json!([{ "speler_id": bob_id, "spelersnaam": "Bob" }])));
        let (_, berichten) = t.vraag("GET", &format!("/potjes/{id}/berichten"), Some(&ann), None);
        assert_eq!(berichten, json!([]));
        assert_eq!(t.vraag("DELETE", &format!("/blokkades/{bob_id}"), Some(&ann), None).0, 204);
        assert_eq!(t.vraag("DELETE", "/blokkades/abc", Some(&ann), None).0, 400);
        let (_, berichten) = t.vraag("GET", &format!("/potjes/{id}/berichten"), Some(&ann), None);
        assert_eq!(berichten.as_array().unwrap().len(), 1);
    }

    #[test]
    fn speler_aanmaken_trimt_de_naam_en_geeft_sleutel_en_herstelcode() {
        let mut t = Test::nieuw();
        let (s, v) = t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "  Wim  " })));
        assert_eq!((s, v["spelersnaam"].as_str()), (201, Some("Wim")));
        assert!(v["sleutel"].as_str().unwrap().len() >= 32);
        assert!(v["herstelcode"].as_str().unwrap().contains('-'));
        assert_eq!(t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": " " }))).0, 400);
    }

    #[test]
    fn een_speler_met_test_true_is_een_test_speler_en_zonder_veld_een_echte() {
        let mut t = Test::nieuw();
        assert_eq!(t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "Echt" }))).0, 201);
        assert_eq!(t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "Proef", "test": true }))).0, 201);
        assert_eq!(t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "Ook echt", "test": false }))).0, 201);
        let vlaggen: Vec<(String, bool)> = t.o.speler_regels().unwrap().into_iter().map(|s| (s.spelersnaam, s.test)).collect();
        assert_eq!(vlaggen, [("Proef".to_string(), true), ("Ook echt".to_string(), false), ("Echt".to_string(), false)]);
    }

    #[test]
    fn een_vol_potje_en_een_onbekende_uitnodiging_weigeren_meedoen() {
        let mut t = Test::nieuw();
        let wim = t.speler("Wim");
        let kees = t.speler("Kees");
        let piet = t.speler("Piet");
        let (_, p) = t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let pad = format!("/uitnodigingen/{}/meedoen", p["uitnodiging"].as_str().unwrap());
        assert_eq!(t.vraag("POST", &pad, Some(&kees), None).0, 200);
        // Kees nog een keer: geen tweede plek.
        let (s, v) = t.vraag("POST", &pad, Some(&kees), None);
        assert_eq!((s, v["spelers"].as_array().map(|l| l.len())), (200, Some(2)));
        assert_eq!(t.vraag("POST", &pad, Some(&piet), None).0, 409);
        assert_eq!(t.vraag("GET", "/uitnodigingen/NIETBESTAAND123", None, None).0, 404);
        assert_eq!(t.vraag("POST", "/uitnodigingen/NIETBESTAAND123/meedoen", Some(&piet), None).0, 404);
        assert_eq!(t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 5 }))).0, 400);
    }

    #[test]
    fn een_ongeldige_zet_wordt_geweigerd_en_verandert_niets() {
        let mut t = Test::nieuw();
        let (id, k) = t.vol_potje("ster", &["Wim", "Kees"]);
        let spiegel = Game::new_star(2).unwrap();
        let (van, _) = eerste_zet();
        let zet = |t: &mut Test, van: usize, naar: usize| t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&k[0]), Some(json!({ "van": van, "naar": naar }))).0;
        // Naar het vak waar de steen al staat, naar een vak dat niet bestaat, en een steen van de tegenstander.
        assert_eq!(zet(&mut t, van, van), 400);
        assert_eq!(zet(&mut t, van, 99_999), 400);
        let andere = (0..spiegel.board().len()).find(|&v| spiegel.stone_at(v) == Some(1)).unwrap();
        assert_eq!(zet(&mut t, andere, van), 400);
        let (_, v) = t.vraag("GET", &format!("/potjes/{id}"), Some(&k[0]), None);
        assert_eq!(v["versie"], 0);
    }

    #[test]
    fn een_buitenstaander_en_een_onbekende_sleutel_komen_niet_in_een_potje() {
        let mut t = Test::nieuw();
        let (id, k) = t.vol_potje("ster", &["Wim", "Kees"]);
        let piet = t.speler("Piet");
        let (van, naar) = eerste_zet();
        let zet = Some(json!({ "van": van, "naar": naar }));
        let pad = format!("/potjes/{id}");
        assert_eq!(t.vraag("POST", &format!("{pad}/zetten"), Some(&piet), zet.clone()).0, 403);
        assert_eq!(t.vraag("POST", &format!("{pad}/opgeven"), Some(&piet), None).0, 403);
        assert_eq!(t.vraag("GET", &pad, Some(&piet), None).0, 403);
        assert_eq!(t.vraag("POST", &format!("{pad}/zetten"), None, zet).0, 401);
        assert_eq!(t.vraag("GET", &pad, Some("nep"), None).0, 401);
        assert_eq!(t.vraag("GET", &format!("/potjes/{}", id + 99), Some(&piet), None).0, 404);
        // De live verbinding is een WebSocket; wie meedoet checkt `live::meld_aan` (403, 401, 404).
        assert_eq!(t.vraag("GET", &format!("{pad}/live"), Some(&piet), None).0, 426);
        let (_, v) = t.vraag("GET", &pad, Some(&k[0]), None);
        assert_eq!(v["versie"], 0);
    }

    #[test]
    fn een_zet_in_een_potje_dat_nog_niet_vol_is_geeft_409() {
        let mut t = Test::nieuw();
        let wim = t.speler("Wim");
        let (_, p) = t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let id = p["potje_id"].as_i64().unwrap();
        let (van, naar) = eerste_zet();
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&wim), Some(json!({ "van": van, "naar": naar }))).0, 409);
        let (s, v) = t.vraag("GET", &format!("/potjes/{id}"), Some(&wim), None);
        assert_eq!((s, &v["gestart"], &v["aan_de_beurt"]), (200, &json!(false), &Value::Null));
    }

    #[test]
    fn opgeven_geeft_de_winnaar_en_sluit_het_potje() {
        let mut t = Test::nieuw();
        let (id, k) = t.vol_potje("ster", &["Wim", "Kees"]);
        let mut spiegel = Game::new_star(2).unwrap();
        t.zet(id, &k, &mut spiegel);
        let (s, v) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&k[1]), None);
        assert_eq!(s, 200, "{v}");
        assert_eq!((&v["afgelopen"], &v["winnaar"], &v["ranglijst"]), (&json!(true), &json!(1), &json!([1])));
        assert_eq!(v["spelers"][1]["status"], "opgegeven");
        assert_eq!((&v["laatste_zet"]["soort"], &v["laatste_zet"]["plek"], &v["versie"]), (&json!("opgeven"), &json!(2), &json!(2)));
        // Na afloop kan niemand meer iets.
        let (van, naar) = eerste_zet();
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&k[0]), Some(json!({ "van": van, "naar": naar }))).0, 409);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&k[0]), None).0, 409);
    }

    #[test]
    fn opgeven_buiten_de_eigen_beurt_laat_een_potje_van_drie_doorlopen_tot_er_een_over_is() {
        let mut t = Test::nieuw();
        let (id, k) = t.vol_potje("ster", &["Wim", "Kees", "Piet"]);
        // Piet is niet aan de beurt en geeft toch op: het Potje loopt door.
        let (s, v) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&k[2]), None);
        assert_eq!((s, &v["afgelopen"], &v["aan_de_beurt"]), (200, &json!(false), &json!(1)));
        assert!(v["stand"].as_array().unwrap().iter().all(|p| p != 3));
        let (s, v) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&k[0]), None);
        assert_eq!((s, &v["afgelopen"], &v["winnaar"]), (200, &json!(true), &json!(2)));
    }

    #[test]
    fn het_vierkante_bord_kent_alleen_2_en_4_spelers_en_het_ronde_bord_bestaat_niet() {
        let mut t = Test::nieuw();
        let wim = t.speler("Wim");
        let maak = |t: &mut Test, bord: &str, n: u32| t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": bord, "aantal_spelers": n }))).0;
        assert_eq!(maak(&mut t, "vierkant", 3), 400);
        assert_eq!(maak(&mut t, "vierkant", 4), 201);
        assert_eq!(maak(&mut t, "rond", 2), 400);

        let (id, k) = t.vol_potje("vierkant", &["Ann", "Bob"]);
        let mut spiegel = Game::new_square(2).unwrap();
        let v = t.zet(id, &k, &mut spiegel);
        assert_eq!(v["bord"], "vierkant");
        assert_eq!(v["stand"].as_array().unwrap().len(), spiegel.board().len());
        assert_eq!(v["versie"], 1);
    }

    #[test]
    fn mijn_potjes_toont_alleen_eigen_potjes_met_beurt_en_winnaar() {
        let mut t = Test::nieuw();
        let (w, k, p) = (t.speler("Wim"), t.speler("Kees"), t.speler("Piet"));
        let maak = |t: &mut Test, sleutel: &str, bord: &str, n: u32| {
            let (s, p) = t.vraag("POST", "/potjes", Some(sleutel), Some(json!({ "bord": bord, "aantal_spelers": n })));
            assert_eq!(s, 201);
            p
        };
        let doe_mee = |t: &mut Test, potje: &Value, sleutel: &str| {
            let pad = format!("/uitnodigingen/{}/meedoen", potje["uitnodiging"].as_str().unwrap());
            assert_eq!(t.vraag("POST", &pad, Some(sleutel), None).0, 200);
        };

        // Potje 1: Wim en Kees, Wim zet, dus Kees is aan de beurt.
        let p1 = maak(&mut t, &w, "ster", 2);
        doe_mee(&mut t, &p1, &k);
        let id1 = p1["potje_id"].as_i64().unwrap();
        let (van, naar) = eerste_zet();
        assert_eq!(t.vraag("POST", &format!("/potjes/{id1}/zetten"), Some(&w), Some(json!({ "van": van, "naar": naar }))).0, 200);
        // Potje 2: Kees en Piet; Wim doet niet mee.
        let p2 = maak(&mut t, &k, "vierkant", 2);
        doe_mee(&mut t, &p2, &p);
        // Potje 3: Wim wacht op drie anderen in de Wachtkamer.
        let id3 = maak(&mut t, &w, "vierkant", 4)["potje_id"].as_i64().unwrap();
        // Potje 4: Kees geeft op, Wim wint.
        let p4 = maak(&mut t, &w, "ster", 2);
        doe_mee(&mut t, &p4, &k);
        let id4 = p4["potje_id"].as_i64().unwrap();
        assert_eq!(t.vraag("POST", &format!("/potjes/{id4}/opgeven"), Some(&k), None).0, 200);

        let (s, v) = t.vraag("GET", "/mijn-potjes", Some(&w), None);
        assert_eq!(s, 200);
        let lijst = v.as_array().unwrap();
        let mut ids: Vec<i64> = lijst.iter().map(|x| x["potje_id"].as_i64().unwrap()).collect();
        ids.sort();
        assert_eq!(ids, vec![id1, id3, id4], "Wim ziet alleen zijn eigen Potjes");
        let van_id = |id: i64| lijst.iter().find(|x| x["potje_id"] == id).unwrap();
        let l1 = van_id(id1);
        assert_eq!((&l1["gestart"], &l1["aan_de_beurt"], &l1["jouw_plek"], &l1["afgelopen"], &l1["winnaar"], &l1["bord"]), (&json!(true), &json!(2), &json!(1), &json!(false), &Value::Null, &json!("ster")));
        assert_eq!(l1["spelers"][1]["spelersnaam"], "Kees");
        let l3 = van_id(id3);
        assert_eq!((&l3["gestart"], &l3["aan_de_beurt"], &l3["aantal_spelers"], &l3["bord"]), (&json!(false), &Value::Null, &json!(4), &json!("vierkant")));
        assert_eq!(l3["spelers"].as_array().unwrap().len(), 1);
        let l4 = van_id(id4);
        assert_eq!((&l4["afgelopen"], &l4["winnaar"], &l4["aan_de_beurt"]), (&json!(true), &json!(1), &Value::Null));

        // Kees is in Potje 1, 2 en 4 en zit er op plek 2.
        let (_, v) = t.vraag("GET", "/mijn-potjes", Some(&k), None);
        let kees = v.as_array().unwrap();
        assert_eq!(kees.len(), 3);
        let k1 = kees.iter().find(|x| x["potje_id"] == id1).unwrap();
        assert_eq!((&k1["jouw_plek"], &k1["aan_de_beurt"]), (&json!(2), &json!(2)));
        let k4 = kees.iter().find(|x| x["potje_id"] == id4).unwrap();
        assert_eq!((&k4["jouw_plek"], &k4["winnaar"]), (&json!(2), &json!(1)));

        // Piet ziet alleen Potje 2; wie niets speelde krijgt een lege lijst.
        let (_, v) = t.vraag("GET", "/mijn-potjes", Some(&p), None);
        assert_eq!((v.as_array().map(|l| l.len()), &v[0]["potje_id"]), (Some(1), &p2["potje_id"]));
        let els = t.speler("Els");
        assert_eq!(t.vraag("GET", "/mijn-potjes", Some(&els), None).1, json!([]));
        assert_eq!(t.vraag("GET", "/mijn-potjes", None, None).0, 401);
        assert_eq!(t.vraag("GET", "/mijn-potjes", Some("onzin"), None).0, 401);
    }

    #[test]
    fn een_bericht_van_een_buitenstaander_of_met_een_ongeldige_tekst_wordt_geweigerd() {
        let mut t = Test::nieuw();
        let (id, k) = t.vol_potje("ster", &["Wim", "Kees"]);
        let piet = t.speler("Piet");
        let pad = format!("/potjes/{id}/berichten");
        let hoi = || Some(json!({ "tekst": "hoi" }));
        assert_eq!(t.vraag("POST", &pad, Some(&piet), hoi()).0, 403);
        assert_eq!(t.vraag("GET", &pad, Some(&piet), None).0, 403);
        assert_eq!(t.vraag("POST", &pad, None, hoi()).0, 401);
        assert_eq!(t.vraag("GET", &pad, Some("nep"), None).0, 401);
        let wim = Some(k[0].as_str());
        assert_eq!(t.vraag("POST", &pad, wim, Some(json!({ "tekst": "   " }))).0, 400);
        assert_eq!(t.vraag("POST", &pad, wim, Some(json!({ "tekst": "a".repeat(301) }))).0, 400);
        // De grens telt tekens, geen bytes: 300 tekens met accent mogen.
        assert_eq!(t.vraag("POST", &pad, wim, Some(json!({ "tekst": "é".repeat(300) }))).0, 201);
        let (_, lijst) = t.vraag("GET", &pad, wim, None);
        assert_eq!(lijst.as_array().unwrap().len(), 1);
    }

    #[test]
    fn berichten_mogen_in_de_wachtkamer_en_na_afloop() {
        let mut t = Test::nieuw();
        let wim = t.speler("Wim");
        let kees = t.speler("Kees");
        let (_, p) = t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let id = p["potje_id"].as_i64().unwrap();
        let pad = format!("/potjes/{id}/berichten");
        assert_eq!(t.vraag("POST", &pad, Some(&wim), Some(json!({ "tekst": "wie komt er?" }))).0, 201);
        t.vraag("POST", &format!("/uitnodigingen/{}/meedoen", p["uitnodiging"].as_str().unwrap()), Some(&kees), None);
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&kees), None).0, 200);
        assert_eq!(t.vraag("POST", &pad, Some(&wim), Some(json!({ "tekst": "goed gespeeld" }))).0, 201);
        assert_eq!(t.vraag("GET", &pad, Some(&wim), None).1.as_array().unwrap().len(), 2);
    }

    #[test]
    fn de_ranglijst_telt_afgelopen_potjes_en_toont_alleen_spelers_met_wie_je_speelde() {
        let mut t = Test::nieuw();
        let (w, k, p, e) = (t.speler("Wim"), t.speler("Kees"), t.speler("Piet"), t.speler("Els"));
        // Een Potje voor twee waarin `opgever` meteen opgeeft; de ander wint.
        let potje_met_opgave = |t: &mut Test, eerste: &str, tweede: &str, opgever: &str| {
            let (_, pj) = t.vraag("POST", "/potjes", Some(eerste), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
            t.vraag("POST", &format!("/uitnodigingen/{}/meedoen", pj["uitnodiging"].as_str().unwrap()), Some(tweede), None);
            let id = pj["potje_id"].as_i64().unwrap();
            assert_eq!(t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(opgever), None).0, 200);
        };
        let namen = |v: &Value| -> Vec<(String, u64, u64)> {
            v.as_array().unwrap().iter().map(|x| (x["spelersnaam"].as_str().unwrap().into(), x["gewonnen"].as_u64().unwrap(), x["gespeeld"].as_u64().unwrap())).collect()
        };
        let rang = |t: &mut Test, sleutel: &str| {
            let (s, v) = t.vraag("GET", "/ranglijst", Some(sleutel), None);
            assert_eq!(s, 200);
            v
        };

        assert_eq!(rang(&mut t, &w), json!([]), "nog niets afgelopen");
        // Potje 1: Kees geeft op, Wim wint. Een Potje dat nog loopt telt niet mee.
        potje_met_opgave(&mut t, &w, &k, &k);
        let (_, loopt) = t.vraag("POST", "/potjes", Some(&w), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        t.vraag("POST", &format!("/uitnodigingen/{}/meedoen", loopt["uitnodiging"].as_str().unwrap()), Some(&k), None);
        let v = rang(&mut t, &w);
        assert_eq!(namen(&v), vec![("Wim".to_string(), 1, 1), ("Kees".to_string(), 0, 1)]);
        // Potje 2: Piet wint van Els. Wim speelde niet met hen en ziet ze niet.
        potje_met_opgave(&mut t, &p, &e, &e);
        let v = rang(&mut t, &w);
        assert_eq!(namen(&v), vec![("Wim".to_string(), 1, 1), ("Kees".to_string(), 0, 1)]);
        let v = rang(&mut t, &e);
        assert_eq!(namen(&v), vec![("Piet".to_string(), 1, 1), ("Els".to_string(), 0, 1)]);
        // Potje 3: Kees wint van Piet. Volgorde: meest gewonnen, dan minst gespeeld, dan naam.
        potje_met_opgave(&mut t, &k, &p, &p);
        let v = rang(&mut t, &k);
        assert_eq!(namen(&v), vec![("Wim".to_string(), 1, 1), ("Kees".to_string(), 1, 2), ("Piet".to_string(), 1, 2)]);
        assert_eq!(t.vraag("GET", "/ranglijst", None, None).0, 401);
        assert_eq!(t.vraag("GET", "/ranglijst", Some("onzin"), None).0, 401);
    }

    #[test]
    fn webpush_abonnementen_vragen_een_sleutel_en_dubbel_aanmelden_geeft_er_een() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let vapid = Vapid::nieuw();
        let abo = abonnement_json("https://fcm.googleapis.com/telefoon");
        let aanmelden = |t: &mut Test, sleutel: Option<&str>, body: &Value| t.vraag_met_push("POST", "/push/abonnement", sleutel, Some(body.clone()), Some(&vapid)).0;

        assert_eq!(aanmelden(&mut t, None, &abo), 401);
        assert_eq!(aanmelden(&mut t, Some(&ann), &abonnement_json("geen url")), 400);
        assert_eq!(aanmelden(&mut t, Some(&ann), &abo), 204);
        assert_eq!(aanmelden(&mut t, Some(&ann), &abo), 204);
        assert_eq!(t.o.abonnementen_van(ann_id).unwrap().len(), 1, "dubbel aanmelden is een upsert");
        assert_eq!(aanmelden(&mut t, Some(&ann), &abonnement_json("https://fcm.googleapis.com/tablet")), 204);
        assert_eq!(t.o.abonnementen_van(ann_id).unwrap().len(), 2);
    }

    #[test]
    fn een_andere_speler_kan_een_abonnement_niet_verwijderen() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let bob = t.speler("Bob");
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let vapid = Vapid::nieuw();
        let telefoon = "https://fcm.googleapis.com/telefoon";
        t.vraag_met_push("POST", "/push/abonnement", Some(&ann), Some(abonnement_json(telefoon)), Some(&vapid));
        t.vraag_met_push("POST", "/push/abonnement", Some(&ann), Some(abonnement_json("https://fcm.googleapis.com/tablet")), Some(&vapid));
        let weg = |t: &mut Test, sleutel: Option<&str>, endpoint: &str| t.vraag_met_push("DELETE", "/push/abonnement", sleutel, Some(json!({ "endpoint": endpoint })), Some(&vapid)).0;

        // Bob krijgt 204, maar het Abonnement van Ann blijft.
        assert_eq!(weg(&mut t, Some(&bob), telefoon), 204);
        assert_eq!(t.o.abonnementen_van(ann_id).unwrap().len(), 2);
        assert_eq!(weg(&mut t, None, telefoon), 401);
        assert_eq!(weg(&mut t, Some(&ann), "https://fcm.googleapis.com/tablet"), 204);
        let over = t.o.abonnementen_van(ann_id).unwrap();
        assert_eq!(over.iter().map(|a| a.endpoint.as_str()).collect::<Vec<_>>(), vec![telefoon]);
    }

    #[test]
    fn apns_tokens_vragen_een_sleutel_een_bekende_omgeving_en_dubbel_aanmelden_geeft_er_een() {
        let mut t = Test::nieuw();
        let ann = t.speler("Ann");
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let vapid = Vapid::nieuw();
        let token = |teken: &str| format!("a{teken}").repeat(32);
        let aanmelden = |t: &mut Test, sleutel: Option<&str>, token: &str, omgeving: &str| {
            t.vraag_met_push("POST", "/push/apns", sleutel, Some(json!({ "token": token, "omgeving": omgeving })), Some(&vapid)).0
        };

        assert_eq!(aanmelden(&mut t, None, &token("b"), "sandbox"), 401);
        assert_eq!(aanmelden(&mut t, Some(&ann), "kort", "sandbox"), 400);
        assert!((400..500).contains(&aanmelden(&mut t, Some(&ann), &token("b"), "test")), "een onbekende omgeving is een fout van de aanroeper");
        assert_eq!(aanmelden(&mut t, Some(&ann), &token("b"), "sandbox"), 204);
        assert_eq!(aanmelden(&mut t, Some(&ann), &token("b"), "sandbox"), 204);
        assert_eq!(t.o.apns_tokens_van(ann_id).unwrap().len(), 1, "twee keer aanmelden geeft één token");
        assert_eq!(aanmelden(&mut t, Some(&ann), &token("c"), "sandbox"), 204);
        let weg = t.vraag_met_push("DELETE", "/push/apns", Some(&ann), Some(json!({ "token": token("c") })), Some(&vapid)).0;
        assert_eq!(weg, 204);
        assert_eq!(t.o.apns_tokens_van(ann_id).unwrap().len(), 1);
    }

    #[test]
    fn een_denktijd_van_15_30_60_of_120_seconden_mag_en_alles_anders_niet() {
        let mut t = Test::nieuw();
        let wim = t.speler("Wim");
        let maak = |t: &mut Test, denktijd: Value| t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 2, "denktijd_s": denktijd })));
        for slecht in [json!(45), json!(0), json!(-5), json!(3600)] {
            assert_eq!(maak(&mut t, slecht.clone()).0, 400, "{slecht}");
        }
        for goed in [15, 30, 60, 120] {
            assert_eq!(maak(&mut t, json!(goed)).0, 201);
        }
        // Zonder veld is er geen limiet.
        let (s, p) = t.vraag("POST", "/potjes", Some(&wim), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        assert_eq!((s, &p["denktijd_s"]), (201, &Value::Null));
    }

    #[test]
    fn cors_alleen_voor_de_app() {
        let app = cors_koppen(Some("tauri://localhost"), true);
        assert!(app.contains(&("Access-Control-Allow-Origin", "tauri://localhost".into())));
        assert!(app.iter().any(|(k, _)| *k == "Access-Control-Allow-Methods"));
        // De Preflight mag de kop `authorization` meesturen; een gewoon verzoek heeft die koppen niet nodig.
        assert!(app.iter().any(|(k, v)| *k == "Access-Control-Allow-Headers" && v.contains("authorization")));
        assert!(!cors_koppen(Some("tauri://localhost"), false).iter().any(|(k, _)| *k == "Access-Control-Allow-Headers"));
        let ander = cors_koppen(Some("https://example.com"), true);
        assert!(!ander.iter().any(|(k, _)| k.starts_with("Access-Control")));
        assert!(!cors_koppen(None, false).iter().any(|(k, _)| k.starts_with("Access-Control")));
    }
}
