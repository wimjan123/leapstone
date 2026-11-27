//! Live verbinding, Denktijd en Meldingen, los van Cloudflare.
//!
//! De live verbinding is een WebSocket die het Durable Object laat slapen (hibernation). De app
//! stuurt eerst `{"sleutel": "..."}`; daarna stuurt de server elk bericht als
//! `{"soort": "stand" | "bericht", "data": ...}`. De app stuurt zelf alleen `ping` (antwoord `pong`).

use halma_opslag::{Abonnement, ApnsToken, Bericht, Db, Fout, Opslag, Stand};
use halma_push::BeurtMelding;
use serde::Deserialize;
use serde_json::json;

/// Wat de app stuurt om de verbinding wakker te houden, en het antwoord. Cloudflare antwoordt zelf,
/// zonder het Durable Object te wekken.
pub const PING: &str = "ping";
pub const PONG: &str = "pong";

/// Titel van elke Melding.
pub const TITEL: &str = "Leapstone";

/// Iets dat naar de live verbindingen van een Potje gaat.
#[derive(Debug, Clone, PartialEq)]
pub enum Gebeurtenis {
    /// Een nieuwe stand. `beurt_door`: wie de beurt liet wisselen (Zet, opgave, het Potje vol maken,
    /// of -1 als de Denktijd op was). Leeg als er geen nieuwe beurt is: dan geen Melding.
    Stand { stand: Stand, beurt_door: Option<i64> },
    /// Een Bericht. `leden`: de Spelers van het Potje toen het werd gestuurd; alleen hun verbindingen krijgen het.
    /// `blokkeerders`: de Spelers die de afzender blokkeerden; naar hun verbindingen gaat het niet.
    Bericht { potje_id: i64, bericht: Bericht, leden: Vec<i64>, blokkeerders: Vec<i64> },
    /// Een nieuw Vriendverzoek (taak 162): alleen een Melding voor `aan`, niets naar live verbindingen.
    Vriendverzoek { aan: i64, van_naam: String },
    /// Een nieuwe Uitdaging (taak 163): alleen een Melding voor `aan`; de app van de uitgedaagde ziet haar in Friends.
    Uitdaging { aan: i64, van_naam: String },
}

impl Gebeurtenis {
    /// Het Potje waar de live verbindingen bij horen; een Vriendverzoek of Uitdaging hoort bij geen Potje.
    pub fn potje_id(&self) -> Option<i64> {
        match self {
            Gebeurtenis::Stand { stand, .. } => Some(stand.potje_id),
            Gebeurtenis::Bericht { potje_id, .. } => Some(*potje_id),
            Gebeurtenis::Vriendverzoek { .. } | Gebeurtenis::Uitdaging { .. } => None,
        }
    }

    /// Mag deze gebeurtenis naar de live verbinding van deze Speler? Alleen als hij nu in het Potje zit: een
    /// verbinding hoort bij een Potje-id, en een verwijderd Potje kan zijn id doorgeven aan een nieuw Potje van anderen.
    pub fn voor(&self, speler_id: i64) -> bool {
        match self {
            Gebeurtenis::Stand { stand, .. } => stand.spelers.iter().any(|s| s.speler.speler_id == speler_id),
            Gebeurtenis::Bericht { leden, blokkeerders, .. } => leden.contains(&speler_id) && !blokkeerders.contains(&speler_id),
            Gebeurtenis::Vriendverzoek { .. } | Gebeurtenis::Uitdaging { .. } => false,
        }
    }

    /// Het bericht op de live verbinding.
    pub fn json(&self) -> String {
        match self {
            Gebeurtenis::Stand { stand, .. } => json!({ "soort": "stand", "data": stand }),
            Gebeurtenis::Bericht { bericht, .. } => json!({ "soort": "bericht", "data": bericht }),
            Gebeurtenis::Vriendverzoek { .. } => json!({ "soort": "vriendverzoek" }),
            Gebeurtenis::Uitdaging { .. } => json!({ "soort": "uitdaging" }),
        }
        .to_string()
    }
}

/// De tag van alle live verbindingen van een Potje.
pub fn tag(potje_id: i64) -> String {
    format!("potje:{potje_id}")
}

/// Het Potje bij `/potjes/{id}/live` (het pad na `/api`).
pub fn live_potje(pad: &str) -> Option<i64> {
    match pad.trim_matches('/').split('/').collect::<Vec<_>>().as_slice() {
        ["potjes", id, "live"] => id.parse().ok(),
        _ => None,
    }
}

/// Wat bij een live verbinding bewaard blijft, ook als het Durable Object slaapt.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, Deserialize)]
pub struct Aangemeld {
    pub speler_id: i64,
    /// Wanneer de Speler zich aanmeldde; 0 bij een verbinding van vóór taak 282 (die telt als oudste). Een andere naam dan
    /// `Wacht::sinds_ms`: anders leest een aangemelde verbinding ook als wachtend en sluit het alarm hem.
    #[serde(default)]
    pub aangemeld_ms: i64,
}

/// Zoveel live verbindingen mag één Speler tegelijk hebben, over alle Potjes samen (taak 282). De app opent er één per
/// open Potjescherm per toestel; daarboven gaat de oudste dicht.
pub const MAX_LIVE_PER_SPELER: usize = 10;
/// Sluitcode voor de oudste verbinding van een Speler met te veel verbindingen.
pub const SLUITCODE_TE_VEEL: u16 = 4429;
/// Sluitcode als de app na het aanmelden iets anders stuurt dan `ping`, of een binair bericht stuurt.
pub const SLUITCODE_ONVERWACHT: u16 = 1008;

/// Wat het Durable Object doet met een bericht van de app op de live verbinding.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OpBericht {
    /// Het eerste bericht: de sleutel.
    Aanmelden,
    /// Iets dat de app nooit stuurt. `ping` komt hier niet: dat beantwoordt Cloudflare zonder het object te wekken.
    /// Zo kost een verbinding het object hooguit twee keer werk: het aanmelden en het bericht waarop hij dichtgaat.
    Sluiten,
}

/// Beslist over een bericht: `aangemeld` is of de verbinding al is aangemeld, `tekst` of het een tekstbericht is.
pub fn op_bericht(aangemeld: bool, tekst: bool) -> OpBericht {
    if tekst && !aangemeld { OpBericht::Aanmelden } else { OpBericht::Sluiten }
}

/// Welke verbindingen (op plek in `verbindingen`) dichtgaan omdat deze Speler er meer dan [`MAX_LIVE_PER_SPELER`] heeft.
/// De nieuwste blijven open; bij gelijke tijd blijft de laatste in de lijst.
pub fn te_veel_van_speler(verbindingen: &[Option<Aangemeld>], speler_id: i64) -> Vec<usize> {
    let mut van_speler: Vec<(i64, usize)> = verbindingen
        .iter()
        .enumerate()
        .filter_map(|(i, a)| a.filter(|a| a.speler_id == speler_id).map(|a| (a.aangemeld_ms, i)))
        .collect();
    let teveel = van_speler.len().saturating_sub(MAX_LIVE_PER_SPELER);
    van_speler.sort();
    let mut dicht: Vec<usize> = van_speler.into_iter().take(teveel).map(|(_, i)| i).collect();
    dicht.sort();
    dicht
}

/// Hoe lang een nieuwe verbinding de tijd heeft om in te loggen.
pub const INLOG_TERMIJN_MS: i64 = 10_000;
/// Sluitcode als de verbinding niet op tijd inlogde.
pub const SLUITCODE_INLOG_TE_LAAT: u16 = 4408;
/// Sluitcode als de sleutel niet meer telt (herstel of account verwijderd): zoals een ongeldige sleutel.
pub const SLUITCODE_SLEUTEL_WEG: u16 = 4401;

/// Bewaard bij een verbinding die nog niet is ingelogd: sinds wanneer hij openstaat.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, Deserialize)]
pub struct Wacht {
    pub sinds_ms: i64,
}

impl Wacht {
    /// Is de inlogtermijn voorbij?
    pub fn verlopen(&self, nu_ms: i64) -> bool {
        nu_ms >= self.sinds_ms + INLOG_TERMIJN_MS
    }
}

/// Welke verbindingen (op plek in `verbindingen`) sluiten omdat de sleutel van deze Speler niet meer telt.
/// `None`: nog niet ingelogd, die hoort bij niemand.
pub fn te_sluiten_van_speler(verbindingen: &[Option<Aangemeld>], speler_id: i64) -> Vec<usize> {
    verbindingen
        .iter()
        .enumerate()
        .filter(|(_, a)| a.is_some_and(|a| a.speler_id == speler_id))
        .map(|(i, _)| i)
        .collect()
}

/// Welke nog niet ingelogde verbindingen sluiten omdat de termijn voorbij is.
pub fn te_sluiten_zonder_inlog(wachtend: &[Wacht], nu_ms: i64) -> Vec<usize> {
    wachtend.iter().enumerate().filter(|(_, w)| w.verlopen(nu_ms)).map(|(i, _)| i).collect()
}

/// Wanneer het alarm moet afgaan: de eerste van de Denktijd-deadline en de eerste inlogtermijn.
/// Zonder beide: geen alarm (het gratis tegoed blijft heel).
pub fn alarm_tijd(denktijd_ms: Option<i64>, wachtend: &[Wacht]) -> Option<i64> {
    wachtend.iter().map(|w| w.sinds_ms + INLOG_TERMIJN_MS).chain(denktijd_ms).min()
}

#[derive(Deserialize)]
struct Aanmelding {
    sleutel: String,
}

/// Het eerste bericht van de app: de sleutel. Geeft de Speler en het eerste bericht (de stand).
pub fn meld_aan<D: Db>(o: &Opslag<D>, potje_id: i64, tekst: &str) -> Result<(Aangemeld, String), Fout> {
    let a: Aanmelding = serde_json::from_str(tekst).map_err(|_| Fout::NietIngelogd)?;
    let speler_id = o.speler_van_sleutel(&a.sleutel)?;
    let stand = o.stand(speler_id, potje_id)?;
    Ok((Aangemeld { speler_id, aangemeld_ms: o.nu_ms() }, Gebeurtenis::Stand { stand, beurt_door: None }.json()))
}

/// De sluitcode van de WebSocket bij een fout: 4000 plus de HTTP-status (4401, 4403, 4404).
pub fn sluitcode(f: &Fout) -> u16 {
    4000 + f.antwoord().0
}

/// Slaat verlopen beurten over (het alarm van het Durable Object). Geeft de nieuwe standen.
pub fn tik<D: Db>(o: &mut Opslag<D>) -> Result<Vec<Gebeurtenis>, Fout> {
    Ok(o.sla_verlopen_beurten_over()?
        .into_iter()
        .map(|stand| Gebeurtenis::Stand { stand, beurt_door: Some(-1) })
        .collect())
}

/// Zet een Computerspeler in een Potje dat nog niet vol is (zie `Opslag::voeg_computerspeler_toe`).
/// Geeft de nieuwe stand voor de live verbindingen. Doet de Computerspeler daarna een Zet, dan komt die
/// vanzelf uit [`tik`] (het alarm van het Durable Object staat op zijn wachttijd, zie `volgende_deadline`).
pub fn voeg_computerspeler_toe<D: Db>(o: &mut Opslag<D>, potje_id: i64) -> Result<Vec<Gebeurtenis>, Fout> {
    let stand = o.voeg_computerspeler_toe(potje_id)?;
    // De Computerspeler nam de laatste plek: hij liet de beurt "wisselen" door het Potje vol te maken.
    let door = stand.spelers.last().map(|s| s.speler.speler_id);
    Ok(vec![Gebeurtenis::Stand { stand, beurt_door: door }])
}

/// Eén Melding voor één toestel: via web push of via Apple (APNs, de iPhone-app).
#[derive(Debug, Clone, PartialEq)]
pub enum Melding {
    Web { abonnement: Abonnement, inhoud: String },
    Apns { token: ApnsToken, melding: BeurtMelding },
}

/// De Meldingen na deze gebeurtenissen: voor de Speler aan de beurt (en voor wie een Vriendverzoek of Uitdaging kreeg), als die de app niet open
/// heeft (`is_live(potje_id, speler_id)`) en de beurt niet zelf liet wisselen. `web` en `apns`:
/// welke soorten aan staan.
pub fn meldingen<D: Db>(
    o: &Opslag<D>,
    gebeurtenissen: &[Gebeurtenis],
    is_live: impl Fn(i64, i64) -> bool,
    web: bool,
    apns: bool,
) -> Vec<Melding> {
    let mut lijst = Vec::new();
    for g in gebeurtenissen {
        let m = match g {
            Gebeurtenis::Stand { stand, beurt_door: Some(door) } => halma_push::beurt_melding(
                stand,
                *door,
                TITEL,
                |id| is_live(stand.potje_id, id),
                |id| o.taal_van(id).ok().flatten(),
            ),
            // Een Vriendverzoek: altijd een Melding, in de taal van de ontvanger.
            Gebeurtenis::Vriendverzoek { aan, van_naam } => {
                Some(halma_push::vriendverzoek_melding(*aan, TITEL, van_naam, o.taal_van(*aan).ok().flatten().as_deref()))
            }
            // Een Uitdaging: altijd een Melding, in de taal van de ontvanger.
            Gebeurtenis::Uitdaging { aan, van_naam } => {
                Some(halma_push::uitdaging_melding(*aan, TITEL, van_naam, o.taal_van(*aan).ok().flatten().as_deref()))
            }
            _ => None,
        };
        let Some(m) = m else { continue };
        // Een mislukte opzoeking mag een Zet nooit hinderen: dan geen Melding.
        if web {
            let inhoud = m.web_inhoud();
            for abonnement in o.abonnementen_van(m.speler_id).unwrap_or_default() {
                lijst.push(Melding::Web { abonnement, inhoud: inhoud.clone() });
            }
        }
        if apns {
            for token in o.apns_tokens_van(m.speler_id).unwrap_or_default() {
                lijst.push(Melding::Apns { token, melding: m.clone() });
            }
        }
    }
    lijst
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;
    use std::sync::atomic::{AtomicI64, Ordering};

    use super::*;
    use crate::api::{Verzoek, behandel};
    use halma_core::Game;
    use halma_opslag::{Klok, Sleutels, SqliteOpslag};
    use serde_json::Value;

    struct TestKlok(Arc<AtomicI64>);
    impl Klok for TestKlok {
        fn nu_ms(&self) -> i64 {
            self.0.load(Ordering::SeqCst)
        }
    }

    struct Test {
        o: SqliteOpslag,
        nu: Arc<AtomicI64>,
    }

    impl Test {
        fn nieuw() -> Test {
            let mut o = SqliteOpslag::in_geheugen().unwrap();
            let nu = Arc::new(AtomicI64::new(1_700_000_000_000));
            o.zet_klok(Arc::new(TestKlok(nu.clone())));
            Test { o, nu }
        }

        fn vraag(&mut self, methode: &str, pad: &str, sleutel: Option<&str>, body: Option<Value>) -> (u16, Value, Vec<Gebeurtenis>) {
            let autorisatie = sleutel.map(|s| format!("Bearer {s}"));
            let body = body.map(|b| b.to_string()).unwrap_or_default();
            let a = behandel(
                &mut self.o,
                &Verzoek { methode, pad, autorisatie: autorisatie.as_deref(), body: body.as_bytes() },
                None,
                false,
            );
            (a.status, a.json.unwrap_or(Value::Null), a.gebeurtenissen)
        }

        fn speler(&mut self, naam: &str) -> (String, i64) {
            let (_, j, _) = self.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": naam })));
            (j["sleutel"].as_str().unwrap().to_string(), j["speler_id"].as_i64().unwrap())
        }

        /// Ann en Bob in een vol Potje op het sterbord.
        fn potje(&mut self, denktijd_s: Option<i64>) -> (String, String, i64, i64) {
            let (ann, _) = self.speler("Ann");
            let (bob, bob_id) = self.speler("Bob");
            let (_, p, _) = self.vraag(
                "POST",
                "/potjes",
                Some(&ann),
                Some(json!({ "bord": "ster", "aantal_spelers": 2, "denktijd_s": denktijd_s })),
            );
            let code = p["uitnodiging"].as_str().unwrap().to_string();
            let (s, _, g) = self.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);
            assert_eq!(s, 200);
            assert!(matches!(&g[..], [Gebeurtenis::Stand { beurt_door: Some(id), .. }] if *id == bob_id));
            (ann, bob, p["potje_id"].as_i64().unwrap(), bob_id)
        }
    }

    fn eerste_zet() -> Value {
        let g = Game::new_star(2).unwrap();
        let (van, naar) = g.start_cells(0).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap();
        json!({ "van": van, "naar": naar })
    }

    fn abonnement() -> Abonnement {
        // Een geldige publieke sleutel (RFC 8291, bijlage A).
        Abonnement {
            endpoint: "https://fcm.googleapis.com/bob".into(),
            keys: Sleutels {
                p256dh: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4".into(),
                auth: "BTBZMqHH6r4Tts7J_aSIgg".into(),
            },
        }
    }

    #[test]
    fn aanmelden_op_de_live_verbinding() {
        let mut t = Test::nieuw();
        let (ann, _, id, _) = t.potje(None);
        let (carl, _) = t.speler("Carl");

        let (a, eerste) = meld_aan(&t.o, id, &json!({ "sleutel": ann }).to_string()).unwrap();
        let eerste: Value = serde_json::from_str(&eerste).unwrap();
        assert_eq!(eerste["soort"], "stand");
        assert_eq!(eerste["data"]["potje_id"], id);
        assert_eq!(a.speler_id, t.o.speler_van_sleutel(&ann).unwrap());

        let fout = |tekst: &str, potje| sluitcode(&meld_aan(&t.o, potje, tekst).unwrap_err());
        assert_eq!(fout("geen json", id), 4401);
        assert_eq!(fout(&json!({ "sleutel": "fout" }).to_string(), id), 4401);
        assert_eq!(fout(&json!({ "sleutel": carl }).to_string(), id), 4403);
        assert_eq!(fout(&json!({ "sleutel": ann }).to_string(), 999), 4404);

        assert_eq!(live_potje("/potjes/12/live"), Some(12));
        assert_eq!(live_potje("/potjes/12"), None);
        assert_eq!(live_potje("/potjes/x/live"), None);
    }

    #[test]
    fn een_live_verbinding_van_een_gestopt_snel_potje_krijgt_niets_van_een_nieuw_potje_met_hetzelfde_id() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (_, wacht, _) = t.vraag("POST", "/snel", Some(&ann), None);
        let oud = wacht["potje_id"].as_i64().unwrap();
        // Ann's live verbinding meldt zich aan en blijft open; daarna stopt Ann met zoeken.
        let (a, _) = meld_aan(&t.o, oud, &json!({ "sleutel": ann }).to_string()).unwrap();
        assert_eq!(t.vraag("DELETE", &format!("/snel/{oud}"), Some(&ann), None).0, 204);
        // Bob en Carl maken een eigen Potje; het krijgt hetzelfde id (de tag van Ann's verbinding).
        let (bob, bob_id) = t.speler("Bob");
        let (carl, _) = t.speler("Carl");
        let (_, p, _) = t.vraag("POST", "/potjes", Some(&bob), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        assert_eq!(p["potje_id"].as_i64(), Some(oud), "SQLite geeft het id opnieuw uit");
        let code = p["uitnodiging"].as_str().unwrap().to_string();
        let (_, _, g) = t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&carl), None);
        let [stand] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert_eq!(stand.potje_id(), Some(oud));
        assert!(!stand.voor(a.speler_id), "de stand van Bob en Carl gaat niet naar Ann");
        assert!(stand.voor(bob_id));
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{oud}/berichten"), Some(&bob), Some(json!({ "tekst": "hi Carl" })));
        assert!(!g[0].voor(ann_id), "het Bericht ook niet");
        assert!(g[0].voor(bob_id));
    }

    #[test]
    fn zetten_en_berichten_gaan_naar_de_live_verbinding() {
        let mut t = Test::nieuw();
        let (ann, bob, id, _) = t.potje(None);
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();

        let (s, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert_eq!(s, 200);
        let [Gebeurtenis::Stand { stand, beurt_door }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert_eq!((stand.versie, stand.aan_de_beurt, *beurt_door), (1, Some(2), Some(ann_id)));
        assert_eq!(serde_json::from_str::<Value>(&g[0].json()).unwrap()["data"]["versie"], 1);

        let (s, _, g) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&bob), Some(json!({ "tekst": "Hi" })));
        assert_eq!(s, 201);
        let bericht: Value = serde_json::from_str(&g[0].json()).unwrap();
        assert_eq!((bericht["soort"].as_str(), bericht["data"]["tekst"].as_str()), (Some("bericht"), Some("Hi")));
        assert_eq!(g[0].potje_id(), Some(id));

        // Een mislukte Zet en een gewone vraag sturen niets.
        let (s, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert_eq!((s, g.len()), (409, 0));
        assert!(t.vraag("GET", &format!("/potjes/{id}"), Some(&ann), None).2.is_empty());

        let (s, _, g) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&bob), None);
        assert_eq!(s, 200);
        assert!(matches!(&g[..], [Gebeurtenis::Stand { stand, .. }] if stand.afgelopen));
    }

    #[test]
    fn een_bericht_gaat_niet_naar_wie_de_afzender_blokkeerde() {
        let mut t = Test::nieuw();
        let (ann, bob, id, bob_id) = t.potje(None);
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let (s, _, _) = t.vraag("POST", "/blokkades", Some(&ann), Some(json!({ "speler_id": bob_id })));
        assert_eq!(s, 204);

        let (s, _, g) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&bob), Some(json!({ "tekst": "rude" })));
        assert_eq!(s, 201);
        let [bericht @ Gebeurtenis::Bericht { blokkeerders, .. }] = &g[..] else { panic!("verwacht één Bericht: {g:?}") };
        assert_eq!(blokkeerders, &[ann_id]);
        // Per verbinding: Ann krijgt het niet, Bob wel. Een stand gaat naar iedereen.
        assert!(!bericht.voor(ann_id));
        assert!(bericht.voor(bob_id));
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert!(g[0].voor(ann_id) && g[0].voor(bob_id));

        // Andersom (Ann stuurt, Bob blokkeerde niemand) gaat het naar allebei.
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&ann), Some(json!({ "tekst": "hi" })));
        assert!(g[0].voor(ann_id) && g[0].voor(bob_id));
        // Na deblokkeren krijgt Ann Bob's Berichten weer.
        assert_eq!(t.vraag("DELETE", &format!("/blokkades/{bob_id}"), Some(&ann), None).0, 204);
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/berichten"), Some(&bob), Some(json!({ "tekst": "sorry" })));
        assert!(g[0].voor(ann_id));
    }

    #[test]
    fn verlopen_denktijd_slaat_de_beurt_over() {
        let mut t = Test::nieuw();
        let (_, _, id, _) = t.potje(Some(30));
        let start = t.nu.load(Ordering::SeqCst);
        assert_eq!(t.o.volgende_deadline().unwrap(), Some(start + 30_000));

        t.nu.store(start + 29_999, Ordering::SeqCst);
        assert!(tik(&mut t.o).unwrap().is_empty(), "de tijd is nog niet op");

        t.nu.store(start + 30_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, beurt_door: Some(-1) }] = &g[..] else { panic!("verwacht één overgeslagen beurt: {g:?}") };
        assert_eq!(stand.potje_id, id);
        assert_eq!(stand.aan_de_beurt, Some(2));
        assert_eq!(stand.laatste_zet.as_ref().map(|z| z.soort), Some("overgeslagen"));
        // Het alarm gaat opnieuw af als Bob's beurt op is.
        assert_eq!(t.o.volgende_deadline().unwrap(), Some(start + 60_000));
        assert!(tik(&mut t.o).unwrap().is_empty(), "één keer overslaan");
    }

    #[test]
    fn opgeven_komt_als_einde_op_de_live_verbinding() {
        let mut t = Test::nieuw();
        let (ann, bob, id, bob_id) = t.potje(None);
        let ann_id = t.o.speler_van_sleutel(&ann).unwrap();
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&bob), None);
        let [Gebeurtenis::Stand { stand, beurt_door }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert!(stand.afgelopen);
        assert_eq!(stand.laatste_zet.as_ref().map(|z| z.soort), Some("opgeven"));
        assert_eq!(stand.winnaar, Some(1));
        assert_eq!(*beurt_door, Some(bob_id));
        assert!(g[0].voor(ann_id));
        let json: Value = serde_json::from_str(&g[0].json()).unwrap();
        assert_eq!((json["soort"].as_str(), json["data"]["afgelopen"].as_bool()), (Some("stand"), Some(true)));
    }

    #[test]
    fn de_wachtkamer_krijgt_live_dat_het_potje_begint_na_meedoen_met_een_uitnodiging() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        let (_, p, _) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2 })));
        let id = p["potje_id"].as_i64().unwrap();
        let code = p["uitnodiging"].as_str().unwrap().to_string();

        // Ann zit in de Wachtkamer met een live verbinding: het Potje is nog niet begonnen.
        let (_, eerste) = meld_aan(&t.o, id, &json!({ "sleutel": ann }).to_string()).unwrap();
        let eerste: Value = serde_json::from_str(&eerste).unwrap();
        assert_eq!(eerste["data"]["gestart"], false);

        let (s, _, g) = t.vraag("POST", &format!("/uitnodigingen/{code}/meedoen"), Some(&bob), None);
        assert_eq!(s, 200);
        let [Gebeurtenis::Stand { stand, beurt_door }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert!(stand.gestart);
        assert_eq!((stand.potje_id, stand.aan_de_beurt, *beurt_door), (id, Some(1), Some(bob_id)));
        assert_eq!(g[0].potje_id(), Some(id));
        assert!(g[0].voor(ann_id), "de Wachtkamer van Ann krijgt de stand");
        let json: Value = serde_json::from_str(&g[0].json()).unwrap();
        assert_eq!((json["soort"].as_str(), json["data"]["gestart"].as_bool()), (Some("stand"), Some(true)));
    }

    #[test]
    fn na_het_sluiten_van_de_live_verbinding_krijgt_de_speler_weer_een_melding() {
        let mut t = Test::nieuw();
        let (ann, _, id, bob_id) = t.potje(None);
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));

        // Bob heeft het Potje open: de verbindingen van het Potje, zoals het Durable Object ze bijhoudt.
        let mut verbindingen = vec![Some(Aangemeld { speler_id: bob_id, aangemeld_ms: 0 })];
        let live = |v: &[Option<Aangemeld>], p: i64, s: i64| p == id && v.iter().flatten().any(|a| a.speler_id == s);
        assert!(meldingen(&t.o, &g, |p, s| live(&verbindingen, p, s), true, true).is_empty());

        // Bob sluit de app: dezelfde Stand geeft nu wel een Melding.
        verbindingen[0] = None;
        let m = meldingen(&t.o, &g, |p, s| live(&verbindingen, p, s), true, true);
        assert!(matches!(&m[..], [Melding::Web { .. }]), "{m:?}");
    }

    #[test]
    fn na_twee_keer_overslaan_is_de_beurt_terug_bij_de_eerste_speler() {
        let mut t = Test::nieuw();
        let (_, _, id, _) = t.potje(Some(30));
        let start = t.nu.load(Ordering::SeqCst);

        t.nu.store(start + 30_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        assert!(matches!(&g[..], [Gebeurtenis::Stand { stand, beurt_door: Some(-1) }] if stand.aan_de_beurt == Some(2)));

        t.nu.store(start + 60_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, beurt_door: Some(-1) }] = &g[..] else { panic!("verwacht een tweede overslag: {g:?}") };
        assert_eq!((stand.potje_id, stand.aan_de_beurt), (id, Some(1)));
        assert_eq!(stand.laatste_zet.as_ref().map(|z| z.soort), Some("overgeslagen"));
        assert_eq!(t.o.volgende_deadline().unwrap(), Some(start + 90_000));
    }

    #[test]
    fn de_stand_en_mijn_potjes_noemen_de_denktijd_de_deadline_en_de_servertijd() {
        let mut t = Test::nieuw();
        let (ann, _, id, _) = t.potje(Some(30));
        let start = t.nu.load(Ordering::SeqCst);
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{id}"), Some(&ann), None);
        assert_eq!((&v["denktijd_s"], &v["deadline_ms"], &v["server_tijd_ms"]), (&json!(30), &json!(start + 30_000), &json!(start)));
        // De deadline blijft staan terwijl de servertijd doortelt.
        t.nu.store(start + 10_000, Ordering::SeqCst);
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{id}"), Some(&ann), None);
        assert_eq!((&v["deadline_ms"], &v["server_tijd_ms"]), (&json!(start + 30_000), &json!(start + 10_000)));
        let (_, lijst, _) = t.vraag("GET", "/mijn-potjes", Some(&ann), None);
        assert_eq!(lijst[0]["denktijd_s"], 30);
    }

    #[test]
    fn een_zet_vlak_voor_de_deadline_telt_en_zet_een_nieuwe_deadline() {
        let mut t = Test::nieuw();
        let (ann, bob, id, _) = t.potje(Some(30));
        let start = t.nu.load(Ordering::SeqCst);
        t.nu.store(start + 29_000, Ordering::SeqCst);
        let (s, v, _) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert_eq!((s, &v["laatste_zet"]["soort"], &v["deadline_ms"]), (200, &json!("zet"), &json!(start + 59_000)));
        // De oude deadline (start + 30 s) verstrijkt: er gebeurt niets.
        t.nu.store(start + 34_000, Ordering::SeqCst);
        assert!(tik(&mut t.o).unwrap().is_empty());
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{id}"), Some(&bob), None);
        assert_eq!((&v["versie"], &v["laatste_zet"]["soort"]), (&json!(1), &json!("zet")));
        // Bob is pas na 30 s eigen tijd te laat.
        t.nu.store(start + 59_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, .. }] = &g[..] else { panic!("verwacht één overgeslagen beurt: {g:?}") };
        assert_eq!((stand.laatste_zet.as_ref().map(|z| z.soort), stand.aan_de_beurt), (Some("overgeslagen"), Some(1)));
    }

    #[test]
    fn zonder_denktijd_slaat_het_alarm_nooit_een_beurt_over() {
        let mut t = Test::nieuw();
        let (ann, _, id, _) = t.potje(None);
        let start = t.nu.load(Ordering::SeqCst);
        assert_eq!(t.o.volgende_deadline().unwrap(), None);
        t.nu.store(start + 24 * 3_600_000, Ordering::SeqCst);
        assert!(tik(&mut t.o).unwrap().is_empty());
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{id}"), Some(&ann), None);
        assert_eq!((&v["versie"], &v["denktijd_s"], &v["deadline_ms"], &v["aan_de_beurt"]), (&json!(0), &Value::Null, &Value::Null, &json!(1)));
    }

    #[test]
    fn een_potje_dat_nog_niet_gestart_of_al_afgelopen_is_heeft_geen_deadline() {
        let mut t = Test::nieuw();
        let (ann, _) = t.speler("Ann");
        let (_, p, _) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2, "denktijd_s": 15 })));
        let wacht_id = p["potje_id"].as_i64().unwrap();
        let start = t.nu.load(Ordering::SeqCst);
        t.nu.store(start + 60_000, Ordering::SeqCst);
        assert_eq!(t.o.volgende_deadline().unwrap(), None);
        assert!(tik(&mut t.o).unwrap().is_empty());
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{wacht_id}"), Some(&ann), None);
        assert_eq!((&v["gestart"], &v["deadline_ms"], &v["denktijd_s"]), (&json!(false), &Value::Null, &json!(15)));

        // Een afgelopen Potje heeft geen deadline meer.
        let (_, bob, id, _) = t.potje(Some(15));
        let (s, v, _) = t.vraag("POST", &format!("/potjes/{id}/opgeven"), Some(&bob), None);
        assert_eq!((s, &v["afgelopen"], &v["deadline_ms"]), (200, &json!(true), &Value::Null));
        assert_eq!(t.o.volgende_deadline().unwrap(), None);
    }

    #[test]
    fn een_alarm_dat_een_uur_te_laat_komt_slaat_een_keer_over() {
        let mut t = Test::nieuw();
        let (ann, _, id, _) = t.potje(Some(30));
        let start = t.nu.load(Ordering::SeqCst);
        t.nu.store(start + 3_600_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, .. }] = &g[..] else { panic!("verwacht één overgeslagen beurt: {g:?}") };
        assert_eq!((stand.versie, stand.aan_de_beurt), (1, Some(2)));
        assert!(tik(&mut t.o).unwrap().is_empty(), "niet honderd keer");
        let (_, v, _) = t.vraag("GET", &format!("/potjes/{id}"), Some(&ann), None);
        assert_eq!(v["laatste_zet"]["soort"], "overgeslagen");
        assert_eq!(v["versie"], 1);
        assert!(v["deadline_ms"].as_i64().unwrap() > v["server_tijd_ms"].as_i64().unwrap());
    }

    #[test]
    fn play_online_koppelt_twee_spelers_en_stoppen_verlaat_de_wachtrij() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");

        let (s, stand, g) = t.vraag("POST", "/snel", Some(&ann), None);
        assert_eq!((s, stand["snel"].as_bool(), stand["gestart"].as_bool(), stand["denktijd_s"].as_i64()), (200, Some(true), Some(false), Some(30)));
        assert_eq!((stand["bord"].as_str(), stand["aantal_spelers"].as_i64(), stand["uitnodiging"].as_str()), (Some("ster"), Some(2), Some("")));
        // Het antwoord is ook een gebeurtenis: het alarm van het Durable Object wordt gezet op het einde van de zoektijd.
        assert!(matches!(&g[..], [Gebeurtenis::Stand { beurt_door: None, .. }]));
        let nu = t.nu.load(Ordering::SeqCst);
        assert_eq!(t.o.volgende_deadline().unwrap(), Some(nu + 20_000));
        let id = stand["potje_id"].as_i64().unwrap();

        // Ann stopt: weg uit de wachtrij, geen alarm meer, en Bob wacht apart.
        assert_eq!(t.vraag("DELETE", &format!("/snel/{id}"), Some(&bob), None).0, 403);
        assert_eq!(t.vraag("DELETE", &format!("/snel/{id}"), Some(&ann), None).0, 204);
        assert_eq!(t.o.volgende_deadline().unwrap(), None);
        let (_, b1, _) = t.vraag("POST", "/snel", Some(&bob), None);
        assert_eq!((b1["gestart"].as_bool(), b1["spelers"].as_array().map(Vec::len)), (Some(false), Some(1)));
        assert_eq!(t.vraag("DELETE", &format!("/snel/{}", b1["potje_id"]), Some(&bob), None).0, 204);

        // Ann en Bob zoeken allebei: gekoppeld, de eerste beurt is van Ann.
        let (_, a, _) = t.vraag("POST", "/snel", Some(&ann), None);
        let (_, b, g) = t.vraag("POST", "/snel", Some(&bob), None);
        assert_eq!(a["potje_id"], b["potje_id"]);
        assert_eq!((b["gestart"].as_bool(), b["aan_de_beurt"].as_u64()), (Some(true), Some(1)));
        let [Gebeurtenis::Stand { beurt_door: Some(door), .. }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert_eq!(*door, bob_id);
        let potje = b["potje_id"].as_i64().unwrap();
        // Begonnen: stoppen kan niet meer, Zetten gaan zoals altijd, vrije tekst wordt geweigerd en een Vaste zin gaat door.
        assert_eq!(t.vraag("DELETE", &format!("/snel/{potje}"), Some(&ann), None).0, 409);
        assert_eq!(t.vraag("POST", &format!("/potjes/{potje}/zetten"), Some(&ann), Some(eerste_zet())).0, 200);
        assert_eq!(t.vraag("POST", &format!("/potjes/{potje}/berichten"), Some(&bob), Some(json!({ "tekst": "hi" }))).0, 400);
        let (status, b, _) = t.vraag("POST", &format!("/potjes/{potje}/berichten"), Some(&bob), Some(json!({ "tekst": "Good game" })));
        assert_eq!((status, b["tekst"].as_str()), (201, Some("Good game")));
        let (status, zinnen, _) = t.vraag("GET", "/vaste-zinnen", None, None);
        assert_eq!(status, 200);
        assert!(zinnen.as_array().unwrap().contains(&json!("Good game")));
        let (_, mijn, _) = t.vraag("GET", "/mijn-potjes", Some(&ann), None);
        assert_eq!(mijn[0]["snel"].as_bool(), Some(true));
        let _ = ann_id;
    }

    #[test]
    fn stoppen_in_een_snel_potje_voor_vier_laat_de_anderen_live_wachten() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        let (_, stand, _) = t.vraag("POST", "/snel", Some(&ann), Some(json!({ "meer": true })));
        t.vraag("POST", "/snel", Some(&bob), Some(json!({ "meer": true })));
        let id = stand["potje_id"].as_i64().unwrap();
        // Ann stopt: Bob wacht nog en ziet live dat Ann weg is; de stand gaat niet meer naar Ann.
        let (s, _, g) = t.vraag("DELETE", &format!("/snel/{id}"), Some(&ann), None);
        let [nieuw @ Gebeurtenis::Stand { beurt_door: None, .. }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert_eq!(s, 204);
        assert!(nieuw.voor(bob_id) && !nieuw.voor(ann_id));
        // Bob stopt als laatste: het Potje verdwijnt en er gaat niets live.
        let (s, _, g) = t.vraag("DELETE", &format!("/snel/{id}"), Some(&bob), None);
        assert_eq!((s, g.len()), (204, 0));
    }

    #[test]
    fn play_online_vult_na_20_seconden_een_computerspeler_via_het_alarm() {
        let mut t = Test::nieuw();
        let (ann, _) = t.speler("Ann");
        let (_, stand, _) = t.vraag("POST", "/snel", Some(&ann), None);
        let id = stand["potje_id"].as_i64().unwrap();
        let start = t.nu.load(Ordering::SeqCst);

        t.nu.store(start + 19_999, Ordering::SeqCst);
        assert!(tik(&mut t.o).unwrap().is_empty());
        t.nu.store(start + 20_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, .. }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert_eq!((stand.potje_id, stand.gestart, stand.spelers.len()), (id, true, 2));
        assert!(!g[0].json().to_lowercase().contains("computer"), "de Speler ziet niet of het een Computerspeler is");

        // Het alarm staat nu op de Denktijd van 30 s; daarna speelt het Potje gewoon.
        assert_eq!(t.o.volgende_deadline().unwrap(), Some(start + 20_000 + 30_000));
        assert_eq!(t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet())).0, 200);
    }

    #[test]
    fn play_online_met_meer_spelers_vult_na_20_seconden_alle_plekken_via_het_alarm() {
        let mut t = Test::nieuw();
        let (ann, _) = t.speler("Ann");
        let (bob, _) = t.speler("Bob");
        let (_, stand, _) = t.vraag("POST", "/snel", Some(&ann), Some(json!({ "meer": true })));
        assert_eq!(stand["aantal_spelers"].as_i64(), Some(4));
        let id = stand["potje_id"].as_i64().unwrap();
        // Een zoekopdracht voor 2 Spelers sluit niet aan bij dit Potje.
        let (_, twee, _) = t.vraag("POST", "/snel", Some(&bob), None);
        assert_ne!(twee["potje_id"].as_i64(), Some(id));
        let start = t.nu.load(Ordering::SeqCst);
        t.nu.store(start + 20_000, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        // Beide wachtende Potjes zijn gevuld, het Potje voor 4 met 3 Computerspelers.
        let vol: Vec<_> = g.iter().filter_map(|x| if let Gebeurtenis::Stand { stand, .. } = x { Some((stand.potje_id, stand.spelers.len())) } else { None }).collect();
        assert!(vol.contains(&(id, 4)), "{vol:?}");
        assert!(!g.iter().any(|x| x.json().to_lowercase().contains("computer")));
    }

    #[test]
    fn computerspeler_speelt_via_het_alarm_mee_en_geeft_de_speler_een_melding() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (_, p, _) = t.vraag("POST", "/potjes", Some(&ann), Some(json!({ "bord": "ster", "aantal_spelers": 2, "denktijd_s": 30 })));
        let id = p["potje_id"].as_i64().unwrap();

        let g = voeg_computerspeler_toe(&mut t.o, id).unwrap();
        let [Gebeurtenis::Stand { stand, .. }] = &g[..] else { panic!("verwacht één stand: {g:?}") };
        assert!(stand.gestart);
        assert_eq!(stand.aan_de_beurt, Some(1));
        let computer_naam = stand.spelers[1].speler.spelersnaam.clone();
        assert!(!g[0].json().to_lowercase().contains("computer"), "anderen zien geen verschil");

        // Ann zet; de Computerspeler is aan de beurt en het alarm staat op zijn wachttijd, ruim voor de Denktijd.
        let (s, _, _) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert_eq!(s, 200);
        let nu = t.nu.load(Ordering::SeqCst);
        let alarm = t.o.volgende_deadline().unwrap().unwrap();
        assert!(alarm > nu && alarm <= nu + 15_000, "alarm {alarm} nu {nu}");
        assert!(tik(&mut t.o).unwrap().is_empty(), "nog niet");

        t.nu.store(alarm, Ordering::SeqCst);
        let g = tik(&mut t.o).unwrap();
        let [Gebeurtenis::Stand { stand, beurt_door: Some(-1) }] = &g[..] else { panic!("verwacht één Zet: {g:?}") };
        assert_eq!(stand.laatste_zet.as_ref().map(|z| (z.plek, z.soort)), Some((2, "zet")));
        assert_eq!(stand.aan_de_beurt, Some(1));

        // Ann heeft de app dicht: ze krijgt een gewone Melding met de naam van de tegenstander.
        t.o.bewaar_abonnement(ann_id, &abonnement()).unwrap();
        let m = meldingen(&t.o, &g, |_, _| false, true, false);
        let [Melding::Web { inhoud, .. }] = &m[..] else { panic!("verwacht één Melding: {m:?}") };
        let inhoud: Value = serde_json::from_str(inhoud).unwrap();
        assert_eq!(inhoud["tekst"], format!("Your turn against {computer_naam}"));
    }

    #[test]
    fn verlaten_potje_eindigt_na_drie_gemiste_beurten_als_gewone_opgave() {
        let mut t = Test::nieuw();
        let (_, _, id, bob_id) = t.potje(Some(15));
        let mut laatste = Vec::new();
        for _ in 0..5 {
            let nu = t.nu.load(Ordering::SeqCst);
            t.nu.store(nu + 15_000, Ordering::SeqCst);
            laatste = tik(&mut t.o).unwrap();
        }
        let [Gebeurtenis::Stand { stand, beurt_door: Some(-1) }] = &laatste[..] else { panic!("verwacht één stand: {laatste:?}") };
        assert_eq!(stand.potje_id, id);
        assert!(stand.afgelopen);
        assert_eq!(stand.laatste_zet.as_ref().map(|z| (z.plek, z.soort)), Some((1, "opgeven")));
        assert_eq!(stand.aan_de_beurt, None);
        assert_eq!(t.o.volgende_deadline().unwrap(), None);
        assert!(tik(&mut t.o).unwrap().is_empty(), "de wekker is klaar");
        // Een afgelopen Potje stuurt geen beurt-Melding.
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();
        assert!(meldingen(&t.o, &laatste, |_, _| false, true, true).is_empty());
    }

    #[test]
    fn melding_voor_wie_aan_de_beurt_is_en_de_app_dicht_heeft() {
        let mut t = Test::nieuw();
        let (ann, _, id, bob_id) = t.potje(None);
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();

        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        let token = ApnsToken { token: "ab".repeat(32), omgeving: halma_opslag::ApnsOmgeving::Production };
        t.o.bewaar_apns_token(bob_id, &token).unwrap();
        let m = meldingen(&t.o, &g, |_, _| false, true, true);
        assert_eq!(m.len(), 2);
        let Melding::Web { abonnement, inhoud } = &m[0] else { panic!("eerst web push: {m:?}") };
        assert_eq!(abonnement.endpoint, "https://fcm.googleapis.com/bob");
        let inhoud: Value = serde_json::from_str(inhoud).unwrap();
        assert_eq!(inhoud, json!({ "titel": "Leapstone", "tekst": "Your turn against Ann", "url": format!("/potje/{id}") }));
        let Melding::Apns { token: t2, melding } = &m[1] else { panic!("daarna APNs: {m:?}") };
        assert_eq!(t2, &token);
        assert_eq!(melding.tekst, "Your turn against Ann");
        // Alleen de soorten die aan staan.
        assert!(matches!(&meldingen(&t.o, &g, |_, _| false, false, true)[..], [Melding::Apns { .. }]));
        assert!(matches!(&meldingen(&t.o, &g, |_, _| false, true, false)[..], [Melding::Web { .. }]));

        // Bob heeft het Potje open: geen Melding.
        assert!(meldingen(&t.o, &g, |p, s| p == id && s == bob_id, true, true).is_empty());
        // Een Bericht geeft nooit een Melding.
        let bericht = vec![Gebeurtenis::Bericht {
            potje_id: id,
            bericht: Bericht { id: 1, plek: 1, speler_id: 1, spelersnaam: "Ann".into(), tekst: "Hi".into(), tijd: 0 },
            leden: vec![1, bob_id],
            blokkeerders: Vec::new(),
        }];
        assert!(meldingen(&t.o, &bericht, |_, _| false, true, true).is_empty());
    }

    #[test]
    fn vriend_toevoegen_via_de_api_geeft_een_melding_in_de_taal_van_de_ontvanger() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();
        t.vraag("POST", "/taal", Some(&bob), Some(json!({ "taal": "nl" })));
        let code = t.vraag("GET", "/vrienden", Some(&bob), None).1["vriendcode"].as_str().unwrap().to_string();

        // Zonder sleutel, onbekende en eigen code.
        assert_eq!(t.vraag("GET", &format!("/vrienden/code/{code}"), None, None).0, 401);
        assert_eq!(t.vraag("GET", "/vrienden/code/00000000x", Some(&ann), None).0, 404);
        let eigen = t.vraag("GET", "/vrienden", Some(&ann), None).1["vriendcode"].as_str().unwrap().to_string();
        assert_eq!(t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": eigen }))).0, 400);

        // Opzoeken: je ziet de Spelersnaam.
        let (s, j, g) = t.vraag("GET", &format!("/vrienden/code/{code}"), Some(&ann), None);
        assert_eq!((s, &j["spelersnaam"], &j["vrienden"], g.len()), (200, &json!("Bob"), &json!(false), 0));
        // Het verzoek: één Melding, in het Nederlands, voor Bob.
        let (s, j, g) = t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": code })));
        assert_eq!((s, j), (200, json!({ "spelersnaam": "Bob", "vrienden": false })));
        assert_eq!(g, vec![Gebeurtenis::Vriendverzoek { aan: bob_id, van_naam: "Ann".into() }]);
        let m = meldingen(&t.o, &g, |_, _| false, true, false);
        let [Melding::Web { inhoud, .. }] = &m[..] else { panic!("{m:?}") };
        assert_eq!(serde_json::from_str::<Value>(inhoud).unwrap()["tekst"], "Ann wil je vriend worden");
        // Een herhaling geeft geen tweede Melding.
        let (_, _, g) = t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": code })));
        assert!(g.is_empty());

        // Bob ziet het verzoek en keurt goed.
        let (_, l, _) = t.vraag("GET", "/vrienden", Some(&bob), None);
        assert_eq!(l["verzoeken"][0]["spelersnaam"], "Ann");
        assert_eq!(t.vraag("POST", "/vrienden/verzoeken/abc/goedkeuren", Some(&bob), None).0, 400);
        assert_eq!(t.vraag("POST", &format!("/vrienden/verzoeken/{}/goedkeuren", ann_id + 50), Some(&bob), None).0, 404);
        assert_eq!(t.vraag("POST", &format!("/vrienden/verzoeken/{ann_id}/goedkeuren"), Some(&bob), None).0, 204);
        for (wie, naam) in [(&ann, "Bob"), (&bob, "Ann")] {
            let (_, l, _) = t.vraag("GET", "/vrienden", Some(wie), None);
            assert_eq!((&l["vrienden"][0]["spelersnaam"], &l["verzoeken"]), (&json!(naam), &json!([])));
        }
    }

    /// Ann en Bob zijn vrienden (Ann vroeg, Bob keurde goed).
    fn vrienden(t: &mut Test, ann: &str, bob: &str, ann_id: i64) {
        let code = t.vraag("GET", "/vrienden", Some(bob), None).1["vriendcode"].as_str().unwrap().to_string();
        t.vraag("POST", "/vrienden/verzoeken", Some(ann), Some(json!({ "vriendcode": code })));
        assert_eq!(t.vraag("POST", &format!("/vrienden/verzoeken/{ann_id}/goedkeuren"), Some(bob), None).0, 204);
    }

    #[test]
    fn een_vriend_uitdagen_via_de_api_geeft_een_melding_en_accept_start_het_potje() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        let (cas, cas_id) = t.speler("Cas");
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();
        t.vraag("POST", "/taal", Some(&bob), Some(json!({ "taal": "nl" })));
        vrienden(&mut t, &ann, &bob, ann_id);
        let uitdaging = json!({ "vriend_id": bob_id, "bord": "ster", "denktijd_s": 30 });

        // Zonder sleutel, een niet-vriend en een ongeldige keuze mislukken.
        assert_eq!(t.vraag("POST", "/uitdagingen", None, Some(uitdaging.clone())).0, 401);
        assert_eq!(t.vraag("POST", "/uitdagingen", Some(&ann), Some(json!({ "vriend_id": cas_id, "bord": "ster" }))).0, 404);
        assert_eq!(t.vraag("POST", "/uitdagingen", Some(&cas), Some(uitdaging.clone())).0, 404);
        assert_eq!(t.vraag("POST", "/uitdagingen", Some(&ann), Some(json!({ "vriend_id": bob_id, "bord": "ster", "denktijd_s": 7 }))).0, 400);

        // De Uitdaging: één Melding in het Nederlands voor Bob, en daarna kan Ann hem niet nog eens uitdagen.
        let (s, j, g) = t.vraag("POST", "/uitdagingen", Some(&ann), Some(uitdaging.clone()));
        assert_eq!((s, &j["spelersnaam"]), (200, &json!("Bob")));
        let id = j["id"].as_i64().unwrap();
        assert_eq!(g, vec![Gebeurtenis::Uitdaging { aan: bob_id, van_naam: "Ann".into() }]);
        let m = meldingen(&t.o, &g, |_, _| false, true, false);
        let [Melding::Web { inhoud, .. }] = &m[..] else { panic!("{m:?}") };
        assert_eq!(serde_json::from_str::<Value>(inhoud).unwrap()["tekst"], "Ann daagt je uit");
        let (s, _, g) = t.vraag("POST", "/uitdagingen", Some(&ann), Some(uitdaging));
        assert_eq!((s, g.len()), (409, 0));

        // Bob ziet de Uitdaging in Friends; Ann ziet dat hij nog antwoordt.
        let (_, l, _) = t.vraag("GET", "/vrienden", Some(&bob), None);
        assert_eq!((&l["uitdagingen"][0]["spelersnaam"], &l["uitdagingen"][0]["denktijd_s"]), (&json!("Ann"), &json!(30)));
        let stand = t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None).1;
        assert_eq!((&stand["status"], &stand["potje"], &stand["aantal_spelers"]), (&json!("open"), &json!(null), &json!(2)));
        // De uitgedaagde volgt zijn eigen kant van de Uitdaging; een vreemde ziet niets.
        assert_eq!(t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&bob), None).1["status"], "open");
        let (vreemd, _) = t.speler("Cas");
        assert_eq!(t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&vreemd), None).0, 404);
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{id}/accepteren"), Some(&ann), None).0, 404);
        assert_eq!(t.vraag("POST", "/uitdagingen/abc/accepteren", Some(&bob), None).0, 404);

        // Accept: het Potje is vol en begonnen; Ann ziet het bij haar Uitdaging.
        let (s, antwoord, g) = t.vraag("POST", &format!("/uitdagingen/{id}/accepteren"), Some(&bob), None);
        let info = antwoord["potje"].clone();
        assert_eq!((s, &info["vol"], &info["denktijd_s"]), (200, &json!(true), &json!(30)));
        assert!(matches!(&g[..], [Gebeurtenis::Stand { beurt_door: Some(door), .. }] if *door == bob_id));
        let (_, stand, _) = t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None);
        assert_eq!((&stand["status"], &stand["potje"]["potje_id"]), (&json!("accepted"), &info["potje_id"]));
        let potje_id = info["potje_id"].as_i64().unwrap();
        assert_eq!(t.vraag("GET", &format!("/potjes/{potje_id}"), Some(&ann), None).1["gestart"], json!(true));
    }

    #[test]
    fn meer_vrienden_uitdagen_geeft_elk_een_melding_en_na_een_decline_kiest_de_uitdager() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        let (cas, cas_id) = t.speler("Cas");
        let (dre, dre_id) = t.speler("Dre");
        for (wie, id) in [(&bob, bob_id), (&cas, cas_id), (&dre, dre_id)] {
            vrienden(&mut t, &ann, wie, ann_id);
            let _ = id;
        }
        // Een Potje van vier op het sterbord: elke vriend krijgt zijn eigen Melding.
        let (s, j, g) = t.vraag("POST", "/uitdagingen", Some(&ann), Some(json!({ "vriend_ids": [bob_id, cas_id, dre_id], "bord": "ster" })));
        assert_eq!((s, &j["spelersnaam"]), (200, &json!("Bob, Cas, Dre")));
        let id = j["id"].as_i64().unwrap();
        assert_eq!(
            g,
            [bob_id, cas_id, dre_id].map(|aan| Gebeurtenis::Uitdaging { aan, van_naam: "Ann".into() }).to_vec()
        );
        // Een Potje van vijf kent geen bord.
        let vijf = json!({ "vriend_ids": [bob_id, cas_id, dre_id, ann_id], "bord": "ster" });
        assert_eq!(t.vraag("POST", "/uitdagingen", Some(&ann), Some(vijf)).0, 400);
        let mijn = |t: &mut Test, wie: &str| t.vraag("GET", "/vrienden", Some(wie), None).1["uitdagingen"][0]["id"].as_i64().unwrap();
        let (b, c, d) = (mijn(&mut t, &bob), mijn(&mut t, &cas), mijn(&mut t, &dre));
        // Bob accepteert: nog geen Potje. Cas zegt nee; Ann kiest.
        let (s, antwoord, g) = t.vraag("POST", &format!("/uitdagingen/{b}/accepteren"), Some(&bob), None);
        assert_eq!((s, &antwoord["potje"], g.len()), (200, &json!(null), 0));
        assert_eq!(t.vraag("DELETE", &format!("/uitdagingen/{c}"), Some(&cas), None).0, 204);
        let stand = t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None).1;
        assert_eq!((&stand["status"], &stand["geaccepteerd"], &stand["geweigerd"], &stand["wachtend"]), (&json!("choice"), &json!(["Bob"]), &json!(1), &json!(1)));
        // Alleen de uitdager kiest, en de keuze moet een van de twee zijn.
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{id}/start"), Some(&bob), Some(json!({ "keuze": "computer" }))).0, 404);
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{id}/start"), Some(&ann), Some(json!({ "keuze": "x" }))).0, 400);
        // Vullen: vier Spelers, een Computerspeler op de lege plek; Dre doet niet mee omdat hij te laat is.
        let (s, info, g) = t.vraag("POST", &format!("/uitdagingen/{id}/start"), Some(&ann), Some(json!({ "keuze": "computer" })));
        assert_eq!((s, &info["aantal_spelers"], &info["vol"]), (200, &json!(4), &json!(true)));
        assert!(matches!(&g[..], [Gebeurtenis::Stand { beurt_door: Some(door), .. }] if *door == ann_id));
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{d}/accepteren"), Some(&dre), None).0, 404);
        let (_, stand, _) = t.vraag("GET", &format!("/uitdagingen/{b}"), Some(&bob), None);
        assert_eq!((&stand["status"], &stand["potje"]["potje_id"]), (&json!("accepted"), &info["potje_id"]));
    }

    #[test]
    fn een_uitdaging_weigeren_of_laten_verlopen_geeft_not_now() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        vrienden(&mut t, &ann, &bob, ann_id);
        let uitdaging = json!({ "vriend_id": bob_id, "bord": "vierkant" });
        let id = t.vraag("POST", "/uitdagingen", Some(&ann), Some(uitdaging.clone())).1["id"].as_i64().unwrap();
        assert_eq!(t.vraag("DELETE", &format!("/uitdagingen/{id}"), Some(&bob), None).0, 204);
        assert_eq!(t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None).1["status"], "declined");
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{id}/accepteren"), Some(&bob), None).0, 404);
        // Opnieuw uitdagen kan nu; zonder antwoord vervalt het na 5 minuten.
        let id = t.vraag("POST", "/uitdagingen", Some(&ann), Some(uitdaging)).1["id"].as_i64().unwrap();
        t.nu.fetch_add(halma_opslag::UITDAGING_GELDIG_MS - 1, Ordering::SeqCst);
        assert_eq!(t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None).1["status"], "open");
        t.nu.fetch_add(1, Ordering::SeqCst);
        assert_eq!(t.vraag("GET", &format!("/uitdagingen/{id}"), Some(&ann), None).1["status"], "expired");
        assert_eq!(t.vraag("POST", &format!("/uitdagingen/{id}/accepteren"), Some(&bob), None).0, 404);
        assert_eq!(t.vraag("GET", "/vrienden", Some(&bob), None).1["uitdagingen"], json!([]));
    }

    #[test]
    fn vriendverzoek_weigeren_via_de_api_laat_de_aanvrager_niets_merken() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (bob, _) = t.speler("Bob");
        let code = t.vraag("GET", "/vrienden", Some(&bob), None).1["vriendcode"].as_str().unwrap().to_string();
        let eerste = t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": code }))).1;
        assert_eq!(t.vraag("DELETE", &format!("/vrienden/verzoeken/{ann_id}"), Some(&bob), None).0, 204);
        let (_, l, _) = t.vraag("GET", "/vrienden", Some(&bob), None);
        assert_eq!(l["verzoeken"], json!([]));
        let (s, j, g) = t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": code })));
        assert_eq!((s, j, g.len()), (200, eerste, 0));
        let (_, l, _) = t.vraag("GET", "/vrienden", Some(&ann), None);
        assert_eq!((&l["vrienden"], &l["verzoeken"]), (&json!([]), &json!([])));
    }

    #[test]
    fn geblokkeerde_spelers_kunnen_elkaar_niet_toevoegen_via_de_api() {
        let mut t = Test::nieuw();
        let (ann, _) = t.speler("Ann");
        let (bob, bob_id) = t.speler("Bob");
        let code_van = |t: &mut Test, sleutel: &str| t.vraag("GET", "/vrienden", Some(sleutel), None).1["vriendcode"].as_str().unwrap().to_string();
        let (ann_code, bob_code) = (code_van(&mut t, &ann), code_van(&mut t, &bob));
        // Blokkeren kan alleen een medespeler: eerst samen een Snel potje.
        t.vraag("POST", "/snel", Some(&ann), None);
        assert_eq!(t.vraag("POST", "/snel", Some(&bob), None).1["gestart"], true);
        assert_eq!(t.vraag("POST", "/blokkades", Some(&ann), Some(json!({ "speler_id": bob_id }))).0, 204);
        let (s, j, g) = t.vraag("POST", "/vrienden/verzoeken", Some(&ann), Some(json!({ "vriendcode": bob_code })));
        assert_eq!((s, j["fout"].as_str(), g.len()), (404, Some("Unknown friend code"), 0));
        let (s, j, g) = t.vraag("POST", "/vrienden/verzoeken", Some(&bob), Some(json!({ "vriendcode": ann_code })));
        assert_eq!((s, j["fout"].as_str(), g.len()), (404, Some("Unknown friend code"), 0));
    }

    #[test]
    fn melding_en_foutmelding_in_de_taal_van_de_speler() {
        let mut t = Test::nieuw();
        let (ann, bob, id, bob_id) = t.potje(None);
        t.o.bewaar_abonnement(bob_id, &abonnement()).unwrap();
        let (_, _, g) = t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        let tekst = |t: &Test, g: &[Gebeurtenis]| {
            let m = meldingen(&t.o, g, |_, _| false, true, false);
            let Some(Melding::Web { inhoud, .. }) = m.first() else { panic!("{m:?}") };
            serde_json::from_str::<Value>(inhoud).unwrap()["tekst"].as_str().unwrap().to_string()
        };
        // Zonder taal: Engels.
        assert_eq!(tekst(&t, &g), "Your turn against Ann");
        // Duits: een Duitse Melding.
        assert_eq!(t.vraag("POST", "/taal", Some(&bob), Some(json!({ "taal": "de" }))).0, 204);
        assert_eq!(tekst(&t, &g), "Du bist dran gegen Ann");
        // Engels gekozen: Engels.
        assert_eq!(t.vraag("POST", "/taal", Some(&bob), Some(json!({ "taal": "en" }))).0, 204);
        assert_eq!(tekst(&t, &g), "Your turn against Ann");

        // Foutmeldingen: Ann zette net, dus Ann is niet aan de beurt.
        let zet_ann = |t: &mut Test| t.vraag("POST", &format!("/potjes/{id}/zetten"), Some(&ann), Some(eerste_zet()));
        assert_eq!(zet_ann(&mut t).1["fout"], "It is not your turn");
        t.vraag("POST", "/taal", Some(&ann), Some(json!({ "taal": "nl" })));
        let (status, j, _) = zet_ann(&mut t);
        assert_eq!((status, j["fout"].as_str()), (409, Some("Je bent niet aan de beurt")));
        t.vraag("POST", "/taal", Some(&ann), Some(json!({ "taal": "de-AT" })));
        assert_eq!(zet_ann(&mut t).1["fout"], "Du bist nicht dran");
        // Een taal die we niet kennen: Engels. Een ongeldige code wordt geweigerd.
        t.vraag("POST", "/taal", Some(&ann), Some(json!({ "taal": "xx" })));
        assert_eq!(zet_ann(&mut t).1["fout"], "It is not your turn");
        assert_eq!(t.vraag("POST", "/taal", Some(&ann), Some(json!({ "taal": "<b>" }))).0, 400);
        assert_eq!(t.vraag("POST", "/taal", None, Some(json!({ "taal": "nl" }))).0, 401);
        // Zonder bekende sleutel is er geen taal: Engels.
        assert_eq!(t.vraag("GET", "/mijn-potjes", Some("onbekend"), None).1["fout"], "Unknown key. Choose your player name again.");
    }

    #[test]
    fn push_aanmelden_met_en_zonder_sleutels() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let vapid = halma_push::Vapid::nieuw();
        let abo = json!({ "endpoint": "https://fcm.googleapis.com/ann", "keys": { "p256dh": abonnement().keys.p256dh, "auth": abonnement().keys.auth } });
        let vraag = |t: &mut Test, methode, pad, body: Option<Value>, v: Option<&halma_push::Vapid>| {
            let body = body.map(|b| b.to_string()).unwrap_or_default();
            let auth = format!("Bearer {ann}");
            let a = behandel(&mut t.o, &Verzoek { methode, pad, autorisatie: Some(&auth), body: body.as_bytes() }, v, v.is_some());
            (a.status, a.json)
        };

        assert_eq!(vraag(&mut t, "GET", "/push/sleutel", None, None).0, 404);
        assert_eq!(vraag(&mut t, "GET", "/push/sleutel", None, Some(&vapid)), (200, Some(json!({ "sleutel": vapid.publiek_b64() }))));
        assert_eq!(vraag(&mut t, "POST", "/push/abonnement", Some(abo.clone()), Some(&vapid)).0, 204);
        assert_eq!(t.o.abonnementen_van(ann_id).unwrap().len(), 1);
        let http = json!({ "endpoint": "http://push.example/ann", "keys": abo["keys"] });
        assert_eq!(vraag(&mut t, "POST", "/push/abonnement", Some(http), Some(&vapid)).0, 400);
        assert_eq!(vraag(&mut t, "DELETE", "/push/abonnement", Some(json!({ "endpoint": "https://fcm.googleapis.com/ann" })), Some(&vapid)).0, 204);
        assert!(t.o.abonnementen_van(ann_id).unwrap().is_empty());

        // APNs-token van de iPhone-app: alleen als APNs aan staat.
        let iphone = json!({ "token": "ab".repeat(32), "omgeving": "sandbox" });
        assert_eq!(vraag(&mut t, "POST", "/push/apns", Some(iphone.clone()), None).0, 404);
        assert_eq!(vraag(&mut t, "POST", "/push/apns", Some(iphone), Some(&vapid)).0, 204);
        assert_eq!(t.o.apns_tokens_van(ann_id).unwrap().len(), 1);
        assert_eq!(vraag(&mut t, "POST", "/push/apns", Some(json!({ "token": "x", "omgeving": "sandbox" })), Some(&vapid)).0, 400);
        assert_eq!(vraag(&mut t, "DELETE", "/push/apns", Some(json!({ "token": "ab".repeat(32) })), None).0, 204);
        assert!(t.o.apns_tokens_van(ann_id).unwrap().is_empty());
    }

    #[test]
    fn na_herstel_sluiten_alleen_de_verbindingen_van_die_speler() {
        let mut t = Test::nieuw();
        let (_, nieuw, _) = t.vraag("POST", "/spelers", None, Some(json!({ "spelersnaam": "Ann" })));
        let ann_id = nieuw["speler_id"].as_i64().unwrap();
        let (bob, bob_id) = t.speler("Bob");
        let _ = bob;
        let code = nieuw["herstelcode"].as_str().unwrap().to_string();
        let a = behandel(
            &mut t.o,
            &Verzoek { methode: "POST", pad: "/herstel", autorisatie: None, body: json!({ "herstelcode": code }).to_string().as_bytes() },
            None,
            false,
        );
        assert_eq!(a.sluit_speler, Some(ann_id));
        // Twee toestellen van Ann, een van Bob en een die nog niet inlogde.
        let open = [Some(Aangemeld { speler_id: ann_id, aangemeld_ms: 0 }), Some(Aangemeld { speler_id: bob_id, aangemeld_ms: 0 }), None, Some(Aangemeld { speler_id: ann_id, aangemeld_ms: 0 })];
        assert_eq!(te_sluiten_van_speler(&open, ann_id), vec![0, 3]);
        // Een mislukt herstel sluit niets.
        let fout = behandel(
            &mut t.o,
            &Verzoek { methode: "POST", pad: "/herstel", autorisatie: None, body: json!({ "herstelcode": "AAAA-AAAA" }).to_string().as_bytes() },
            None,
            false,
        );
        assert_eq!(fout.sluit_speler, None);
    }

    #[test]
    fn na_verwijderen_sluiten_de_verbindingen_van_die_speler() {
        let mut t = Test::nieuw();
        let (ann, ann_id) = t.speler("Ann");
        let (_, bob_id) = t.speler("Bob");
        let auth = format!("Bearer {ann}");
        let a = behandel(&mut t.o, &Verzoek { methode: "DELETE", pad: "/spelers/mij", autorisatie: Some(&auth), body: b"" }, None, false);
        assert_eq!((a.status, a.sluit_speler), (204, Some(ann_id)));
        let open = [Some(Aangemeld { speler_id: bob_id, aangemeld_ms: 0 }), Some(Aangemeld { speler_id: ann_id, aangemeld_ms: 0 })];
        assert_eq!(te_sluiten_van_speler(&open, ann_id), vec![1]);
        // Zonder geldige sleutel sluit niets.
        let a = behandel(&mut t.o, &Verzoek { methode: "DELETE", pad: "/spelers/mij", autorisatie: Some(&auth), body: b"" }, None, false);
        assert_eq!((a.status, a.sluit_speler), (401, None));
    }

    #[test]
    fn verbinding_zonder_inlog_sluit_na_de_termijn() {
        let wachtend = [Wacht { sinds_ms: 1_000 }, Wacht { sinds_ms: 8_000 }];
        assert!(te_sluiten_zonder_inlog(&wachtend, 10_999).is_empty());
        assert_eq!(te_sluiten_zonder_inlog(&wachtend, 11_000), vec![0]);
        assert_eq!(te_sluiten_zonder_inlog(&wachtend, 18_000), vec![0, 1]);
        assert_eq!(SLUITCODE_INLOG_TE_LAAT, 4408);
        assert_eq!(SLUITCODE_SLEUTEL_WEG, sluitcode(&Fout::NietIngelogd));
    }

    #[test]
    fn alarm_combineert_denktijd_en_inlogtermijn() {
        let w = [Wacht { sinds_ms: 5_000 }, Wacht { sinds_ms: 2_000 }];
        // Niets te doen: geen alarm.
        assert_eq!(alarm_tijd(None, &[]), None);
        assert_eq!(alarm_tijd(Some(50_000), &[]), Some(50_000));
        assert_eq!(alarm_tijd(None, &w), Some(12_000));
        assert_eq!(alarm_tijd(Some(9_000), &w), Some(9_000));
        assert_eq!(alarm_tijd(Some(60_000), &w), Some(12_000));
    }

    #[test]
    fn na_het_aanmelden_sluit_elk_ander_bericht_de_verbinding() {
        assert_eq!(op_bericht(false, true), OpBericht::Aanmelden);
        assert_eq!(op_bericht(true, true), OpBericht::Sluiten);
        assert_eq!(op_bericht(false, false), OpBericht::Sluiten, "binair: de app stuurt alleen tekst");
        assert_eq!(op_bericht(true, false), OpBericht::Sluiten);
    }

    #[test]
    fn een_speler_houdt_hooguit_tien_live_verbindingen_en_de_oudste_gaat_dicht() {
        let ann = |aangemeld_ms| Some(Aangemeld { speler_id: 1, aangemeld_ms });
        let bob = |aangemeld_ms| Some(Aangemeld { speler_id: 2, aangemeld_ms });
        // Precies op de grens, met verbindingen van Bob en nog niet aangemelde ertussen: niets dicht.
        let mut open: Vec<Option<Aangemeld>> = (0..MAX_LIVE_PER_SPELER as i64).map(|i| ann(100 + i)).collect();
        open.extend([bob(1), None, bob(2)]);
        assert!(te_veel_van_speler(&open, 1).is_empty());
        // Twee nieuwe van Ann (de laatste net aangemeld): haar twee oudste gaan dicht, Bob blijft.
        open.insert(3, ann(500));
        open.push(ann(600));
        assert_eq!(te_veel_van_speler(&open, 1), vec![0, 1]);
        assert!(te_veel_van_speler(&open, 2).is_empty());
        // Een verbinding van vóór de grens (zonder tijd) telt als oudste.
        open[5] = ann(0);
        assert_eq!(te_veel_van_speler(&open, 1), vec![0, 5]);
    }

    #[test]
    fn een_aangemelde_verbinding_leest_nooit_als_wachtend_en_andersom() {
        // Het Durable Object herkent een verbinding aan wat erbij bewaard is. Leest een aangemelde verbinding als `Wacht`,
        // dan sluit het alarm hem na de inlogtermijn.
        let aangemeld = serde_json::to_string(&Aangemeld { speler_id: 3, aangemeld_ms: 5 }).unwrap();
        let wacht = serde_json::to_string(&Wacht { sinds_ms: 5 }).unwrap();
        assert!(serde_json::from_str::<Wacht>(&aangemeld).is_err());
        assert!(serde_json::from_str::<Aangemeld>(&wacht).is_err());
        // Een verbinding van vóór taak 282 (zonder tijd) blijft aangemeld.
        assert_eq!(serde_json::from_str::<Aangemeld>(r#"{"speler_id":3}"#).unwrap(), Aangemeld { speler_id: 3, aangemeld_ms: 0 });
    }
}
