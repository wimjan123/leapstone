//! Tellers per week voor de beheerpagina: zien of echte Spelers online Potjes spelen (feature 272).
//!
//! Een week loopt van maandag 00:00 tot zondag 23:59:59 UTC. We tellen deze week en de zeven weken ervoor.
//! Een Potje telt mee als het minstens één echte Speler heeft: iemand die geen Computerspeler en geen
//! Test-Speler is. Een Potje met alleen Test-Spelers (en Computerspelers) telt niet. Per getal staat apart
//! hoeveel van die Potjes ook een Test-Speler hadden.
//!
//! De telling bevat alleen getallen en weekdata: geen Spelersnamen, geen id's, geen Berichten.

use serde::Serialize;

use crate::beheer::tijd_utc;
use crate::{Db, Fout, Opslag};

/// Zoveel weken tellen we: deze en de zeven ervoor.
pub const WEKEN: usize = 8;
const DAG_S: i64 = 86_400;
const WEEK_S: i64 = 7 * DAG_S;

/// Het begin van de week (maandag 00:00 UTC) waarin dit moment valt, in seconden sinds 1970.
/// Dag 0 (1 januari 1970) was een donderdag.
pub fn week_begin(s: i64) -> i64 {
    ((s.div_euclid(DAG_S) + 3).div_euclid(7) * 7 - 3) * DAG_S
}

/// Een telling van Potjes met minstens één echte Speler, en hoeveel daarvan ook een Test-Speler hadden.
#[derive(Debug, Default, Clone, Copy, PartialEq, Serialize)]
pub struct Tel {
    pub totaal: u32,
    pub waarvan_test: u32,
}

/// De vier getallen van één week.
#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct WeekTelling {
    /// De maandag van de week, `jjjj-mm-dd` (UTC).
    pub week_begin: String,
    /// Nieuwe Spelers, zonder Test-Spelers en Computerspelers.
    pub nieuwe_spelers: u32,
    /// Online Potjes die vol werden.
    pub gestart: Tel,
    /// Online Potjes met een winnaar door het doel te halen.
    pub uitgespeeld: Tel,
    /// Online Potjes die eindigden door opgeven of een verlopen Denktijd.
    pub gestopt: Tel,
}

/// Wat de telling van één Potje nodig heeft.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct PotjeRegel {
    /// Wanneer het Potje vol werd (seconden); leeg als het nog wacht op Spelers.
    pub start_s: Option<i64>,
    /// Wanneer het Potje eindigde (seconden); leeg als het nog loopt.
    pub eind_s: Option<i64>,
    /// Het laatste wat gebeurde was een gewone Zet (het doel gehaald), geen opgeven of overgeslagen beurt.
    pub uitgespeeld: bool,
    /// Minstens één echte Speler.
    pub echt: bool,
    /// Minstens één Test-Speler.
    pub test: bool,
}

/// Een Speler in de lijst op de beheerpagina.
#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct SpelerRegel {
    pub id: i64,
    pub spelersnaam: String,
    /// Seconden sinds 1970.
    pub sinds: i64,
    pub gespeeld: u32,
    pub uitgespeeld: u32,
    pub test: bool,
}

/// Zoveel Spelers staan hooguit in de lijst: eerst alle Test-Spelers, dan de nieuwste.
const MAX_LIJST: usize = 200;

/// Telt per week, nieuwste week eerst. `nieuwe_spelers` zijn de `aangemaakt`-tijden van echte Spelers.
pub fn tel_weken(nu_s: i64, nieuwe_spelers: &[i64], potjes: &[PotjeRegel]) -> Vec<WeekTelling> {
    let nu_week = week_begin(nu_s);
    let mut weken: Vec<WeekTelling> = (0..WEKEN as i64)
        .map(|i| WeekTelling {
            week_begin: tijd_utc(nu_week - i * WEEK_S)[..10].to_string(),
            nieuwe_spelers: 0,
            gestart: Tel::default(),
            uitgespeeld: Tel::default(),
            gestopt: Tel::default(),
        })
        .collect();
    let plek = |s: i64| -> Option<usize> {
        let i = (nu_week - week_begin(s)) / WEEK_S;
        (s < nu_week + WEEK_S && (0..WEKEN as i64).contains(&i)).then_some(i as usize)
    };
    let tel = |t: &mut Tel, p: &PotjeRegel| {
        t.totaal += 1;
        t.waarvan_test += u32::from(p.test);
    };
    for &s in nieuwe_spelers {
        if let Some(i) = plek(s) {
            weken[i].nieuwe_spelers += 1;
        }
    }
    for p in potjes.iter().filter(|p| p.echt) {
        if let Some(i) = p.start_s.and_then(plek) {
            tel(&mut weken[i].gestart, p);
        }
        if let Some(i) = p.eind_s.and_then(plek) {
            let t = if p.uitgespeeld { &mut weken[i].uitgespeeld } else { &mut weken[i].gestopt };
            tel(t, p);
        }
    }
    weken
}

/// Het soort van de laatste Zet van een Potje en het tijdstip ervan (seconden).
const LAATSTE_SOORT: &str = "(SELECT z.soort FROM zet z WHERE z.potje_id = p.id ORDER BY z.nummer DESC LIMIT 1)";
const LAATSTE_TIJD: &str = "(SELECT COALESCE(z.tijd_ms / 1000, z.tijd) FROM zet z WHERE z.potje_id = p.id ORDER BY z.nummer DESC LIMIT 1)";
/// Een Potje is gestart als alle plekken bezet zijn.
const IS_VOL: &str = "(SELECT COUNT(*) FROM potje_speler x WHERE x.potje_id = p.id) = p.aantal_spelers";

impl<D: Db> Opslag<D> {
    /// De tellers per week, nieuwste week eerst. Alleen getallen.
    pub fn tellers(&self) -> Result<Vec<WeekTelling>, Fout> {
        let nu_s = self.nu_ms().div_euclid(1000);
        let vanaf = week_begin(nu_s) - (WEKEN as i64 - 1) * WEEK_S;
        let nieuwe: Vec<i64> = self
            .db
            .rijen("SELECT aangemaakt FROM speler WHERE computer IS NULL AND test = 0 AND aangemaakt >= ?1", crate::p![vanaf])?
            .iter()
            .map(|r| r.i64(0))
            .collect::<Result<_, _>>()?;
        let sql = format!(
            "SELECT COALESCE(p.gestart_ms / 1000, p.aangemaakt), p.afgelopen, {LAATSTE_SOORT}, {LAATSTE_TIJD}, p.aangemaakt,
                    {IS_VOL},
                    EXISTS(SELECT 1 FROM potje_speler x JOIN speler s ON s.id = x.speler_id
                           WHERE x.potje_id = p.id AND s.computer IS NULL AND s.test = 0),
                    EXISTS(SELECT 1 FROM potje_speler x JOIN speler s ON s.id = x.speler_id
                           WHERE x.potje_id = p.id AND s.computer IS NULL AND s.test = 1)
             FROM potje p"
        );
        let potjes = self
            .db
            .rijen(&sql, &[])?
            .iter()
            .map(|r| {
                let (start, afgelopen, soort, laatste, aangemaakt, vol) =
                    (r.i64(0)?, r.bool(1)?, r.optie_tekst(2)?, r.optie_i64(3)?, r.i64(4)?, r.bool(5)?);
                Ok(PotjeRegel {
                    start_s: vol.then_some(start),
                    // Een oud Potje zonder tijd van de laatste Zet valt in de week van `aangemaakt`.
                    eind_s: afgelopen.then_some(laatste.unwrap_or(aangemaakt)),
                    uitgespeeld: soort.as_deref() == Some("zet"),
                    echt: r.bool(6)?,
                    test: r.bool(7)?,
                })
            })
            .collect::<Result<Vec<_>, Fout>>()?;
        Ok(tel_weken(nu_s, &nieuwe, &potjes))
    }

    /// De Spelers voor de lijst op de beheerpagina: eerst de Test-Spelers, dan de nieuwste Spelers.
    pub fn speler_regels(&self) -> Result<Vec<SpelerRegel>, Fout> {
        let gespeeld = format!("FROM potje_speler ps JOIN potje p ON p.id = ps.potje_id WHERE ps.speler_id = s.id AND {IS_VOL}");
        let sql = format!(
            "SELECT s.id, s.spelersnaam, s.aangemaakt, s.test,
                    (SELECT COUNT(*) {gespeeld}),
                    (SELECT COUNT(*) {gespeeld} AND p.afgelopen = 1 AND COALESCE({LAATSTE_SOORT}, '') = 'zet')
             FROM speler s WHERE s.computer IS NULL AND s.verwijderd = 0
             ORDER BY s.test DESC, s.id DESC LIMIT {MAX_LIJST}"
        );
        self.db
            .rijen(&sql, &[])?
            .iter()
            .map(|r| {
                Ok(SpelerRegel {
                    id: r.i64(0)?,
                    spelersnaam: r.tekst(1)?,
                    sinds: r.i64(2)?,
                    test: r.bool(3)?,
                    gespeeld: r.u32(4)?,
                    uitgespeeld: r.u32(5)?,
                })
            })
            .collect()
    }

    /// Zet de vlag "test" van een Speler aan of uit. Een Computerspeler heeft geen vlag.
    pub fn wissel_test(&mut self, speler_id: i64) -> Result<(), Fout> {
        self.db
            .rij("SELECT id FROM speler WHERE id = ?1 AND computer IS NULL", crate::p![speler_id])?
            .ok_or(Fout::Onbekend("Unknown player"))?;
        self.db.voer_uit("UPDATE speler SET test = 1 - test WHERE id = ?1", crate::p![speler_id])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Maandag 2026-11-09 00:00 UTC.
    const MA: i64 = 1_794_182_400;

    #[test]
    fn de_week_begint_op_maandag() {
        // 1970-01-05 was een maandag.
        assert_eq!(week_begin(4 * DAG_S), 4 * DAG_S);
        assert_eq!(week_begin(4 * DAG_S - 1), -3 * DAG_S);
        assert_eq!(week_begin(0), -3 * DAG_S);
        assert_eq!(tijd_utc(week_begin(MA + 3 * DAG_S + 500)), tijd_utc(week_begin(MA)));
        assert_eq!(week_begin(MA + 7 * DAG_S - 1), week_begin(MA));
        assert_eq!(week_begin(MA + 7 * DAG_S), MA + 7 * DAG_S);
    }

    fn potje(start: Option<i64>, eind: Option<i64>, uitgespeeld: bool, echt: bool, test: bool) -> PotjeRegel {
        PotjeRegel { start_s: start, eind_s: eind, uitgespeeld, echt, test }
    }

    #[test]
    fn zondag_en_maandag_vallen_in_verschillende_weken() {
        let week_na = MA + WEEK_S;
        let nu = week_na + 3600;
        let weken = tel_weken(nu, &[week_na - 1, week_na, week_na + 5], &[]);
        assert_eq!(weken.len(), WEKEN);
        assert_eq!(weken[0].week_begin, tijd_utc(week_na)[..10]);
        assert_eq!((weken[0].nieuwe_spelers, weken[1].nieuwe_spelers), (2, 1));
        // Te oud en in de toekomst telt niet.
        let ver = tel_weken(nu, &[week_na - 8 * WEEK_S, week_na - 7 * WEEK_S, week_na + WEEK_S], &[]);
        assert_eq!(ver.iter().map(|w| w.nieuwe_spelers).collect::<Vec<_>>(), [0, 0, 0, 0, 0, 0, 0, 1]);
    }

    #[test]
    fn een_potje_met_alleen_test_spelers_telt_niet_en_een_gemengd_potje_met_vermelding() {
        let nu = MA + 100;
        let potjes = [
            potje(Some(nu - 50), Some(nu - 10), true, true, false),
            potje(Some(nu - 50), Some(nu - 10), true, true, true),
            potje(Some(nu - 50), Some(nu - 10), true, false, true),
            potje(Some(nu - 50), None, false, true, true),
        ];
        let w = &tel_weken(nu, &[], &potjes)[0];
        assert_eq!(w.gestart, Tel { totaal: 3, waarvan_test: 2 });
        assert_eq!(w.uitgespeeld, Tel { totaal: 2, waarvan_test: 1 });
        assert_eq!(w.gestopt, Tel::default());
    }

    #[test]
    fn uitgespeeld_en_gestopt_tellen_apart_en_een_lopend_potje_alleen_als_gestart() {
        let nu = MA + 100;
        let potjes = [
            potje(Some(nu - 20), Some(nu - 5), true, true, false),
            potje(Some(nu - 20), Some(nu - 5), false, true, false),
            potje(Some(nu - 20), Some(nu - 5), false, true, true),
            potje(Some(nu - 20), None, false, true, false),
            potje(None, None, false, true, false),
        ];
        let w = &tel_weken(nu, &[], &potjes)[0];
        assert_eq!(w.gestart.totaal, 4);
        assert_eq!(w.uitgespeeld, Tel { totaal: 1, waarvan_test: 0 });
        assert_eq!(w.gestopt, Tel { totaal: 2, waarvan_test: 1 });
    }

    #[test]
    fn begin_en_eind_van_een_potje_kunnen_in_andere_weken_vallen() {
        let nu = MA + 2 * DAG_S;
        let w = tel_weken(nu, &[], &[potje(Some(MA - 60), Some(MA + 60), true, true, false)]);
        assert_eq!((w[1].gestart.totaal, w[1].uitgespeeld.totaal), (1, 0));
        assert_eq!((w[0].gestart.totaal, w[0].uitgespeeld.totaal), (0, 1));
    }

    #[cfg(feature = "rusqlite")]
    mod met_databank {
        use std::sync::Arc;
        use std::sync::atomic::{AtomicI64, Ordering};

        use halma_core::Game;
        use halma_core::computer::{Level, Rng, choose_move};

        use super::*;
        use crate::{Klok, SqliteOpslag};

        struct Nepklok(AtomicI64);
        impl Klok for Nepklok {
            fn nu_ms(&self) -> i64 {
                self.0.load(Ordering::SeqCst)
            }
        }

        fn opslag() -> (SqliteOpslag, Arc<Nepklok>) {
            let mut o = SqliteOpslag::in_geheugen().unwrap();
            let klok = Arc::new(Nepklok(AtomicI64::new(MA * 1000 + 3 * DAG_S * 1000)));
            o.zet_klok(klok.clone());
            (o, klok)
        }

        fn potje(o: &mut SqliteOpslag, a: i64, b: i64, denktijd: Option<i64>) -> i64 {
            let p = o.maak_potje(a, "ster", 2, denktijd).unwrap();
            o.doe_mee(b, &p.uitnodiging).unwrap();
            p.potje_id
        }

        /// Speelt het Potje uit tot iemand het doel haalt.
        fn speel_uit(o: &mut SqliteOpslag, potje: i64, ids: [i64; 2]) {
            let mut spiegel = Game::new_star(2).unwrap();
            let mut rng = Rng::new(3);
            while !spiegel.is_over() {
                let wie = spiegel.current_player();
                let (van, naar) = choose_move(&spiegel, Level::Normal, &mut rng).unwrap();
                o.doe_zet(ids[wie], potje, van, naar).unwrap();
                spiegel.make_move(van, naar).unwrap();
            }
        }

        #[test]
        fn test_spelers_tellen_niet_en_een_gemengd_potje_telt_mee_met_vermelding() {
            let (mut o, _) = opslag();
            let ann = o.maak_speler("Ann").unwrap().speler_id;
            let bob = o.maak_speler("Bob").unwrap().speler_id;
            let t1 = o.maak_speler_als("Test een", true).unwrap().speler_id;
            let t2 = o.maak_speler_als("Test twee", true).unwrap().speler_id;
            // Ann en Bob: Bob geeft op. Alleen Test-Spelers: Test twee geeft op. Ann met Test een: uitgespeeld.
            let echt = potje(&mut o, ann, bob, None);
            o.geef_op(bob, echt).unwrap();
            let alleen_test = potje(&mut o, t1, t2, None);
            o.geef_op(t2, alleen_test).unwrap();
            let gemengd = potje(&mut o, ann, t1, None);
            speel_uit(&mut o, gemengd, [ann, t1]);
            // Een Potje met een Computerspeler en een Test-Speler telt niet; met een echte Speler wel.
            let p = o.maak_potje(t1, "ster", 2, None).unwrap();
            o.voeg_computerspeler_toe(p.potje_id).unwrap();
            let met_computer = o.maak_potje(bob, "ster", 2, None).unwrap();
            o.voeg_computerspeler_toe(met_computer.potje_id).unwrap();
            // Een Potje dat nog wacht, telt niet als gestart.
            o.maak_potje(ann, "ster", 2, None).unwrap();

            let w = &o.tellers().unwrap()[0];
            assert_eq!(w.nieuwe_spelers, 2, "Test-Spelers zijn geen nieuwe Spelers");
            assert_eq!(w.gestart, Tel { totaal: 3, waarvan_test: 1 }, "{w:?}");
            assert_eq!(w.uitgespeeld, Tel { totaal: 1, waarvan_test: 1 });
            assert_eq!(w.gestopt, Tel { totaal: 1, waarvan_test: 0 });

            // Zet Test een uit: hij is nu een echte Speler. Het gemengde Potje telt zonder vermelding, en de twee Potjes
            // van Test een met Test twee en met de Computerspeler tellen nu mee.
            o.wissel_test(t1).unwrap();
            let w = &o.tellers().unwrap()[0];
            assert_eq!(w.gestart, Tel { totaal: 5, waarvan_test: 1 });
            assert_eq!(w.uitgespeeld, Tel { totaal: 1, waarvan_test: 0 });
            assert_eq!(w.gestopt, Tel { totaal: 2, waarvan_test: 1 });
            assert_eq!(w.nieuwe_spelers, 3);
            // En weer aan: terug naar het begin.
            o.wissel_test(t1).unwrap();
            assert_eq!(o.tellers().unwrap()[0].gestart, Tel { totaal: 3, waarvan_test: 1 });
        }

        #[test]
        fn uitgespeeld_verschilt_van_opgegeven_en_van_een_verlopen_denktijd() {
            let (mut o, klok) = opslag();
            let ann = o.maak_speler("Ann").unwrap().speler_id;
            let bob = o.maak_speler("Bob").unwrap().speler_id;
            let uit = potje(&mut o, ann, bob, None);
            speel_uit(&mut o, uit, [ann, bob]);
            let opgegeven = potje(&mut o, ann, bob, None);
            o.geef_op(ann, opgegeven).unwrap();
            // Niemand zet: na een paar verlopen beurten geeft Ann vanzelf op.
            let verlopen = potje(&mut o, ann, bob, Some(15));
            for _ in 0..5 {
                klok.0.fetch_add(15_000, Ordering::SeqCst);
                o.sla_verlopen_beurten_over().unwrap();
            }
            assert!(o.stand(ann, verlopen).unwrap().afgelopen);
            // Een lopend Potje is gestart, maar niet uitgespeeld of gestopt.
            potje(&mut o, ann, bob, None);

            let w = &o.tellers().unwrap()[0];
            assert_eq!((w.gestart.totaal, w.uitgespeeld.totaal, w.gestopt.totaal), (4, 1, 2), "{w:?}");
        }

        #[test]
        fn de_weekgrens_van_zondag_op_maandag_geldt_voor_het_einde_van_een_potje() {
            let (mut o, klok) = opslag();
            let ann = o.maak_speler("Ann").unwrap().speler_id;
            let bob = o.maak_speler("Bob").unwrap().speler_id;
            // Zondagavond 23:59:50 UTC: het Potje begint. Tien seconden later (maandag) geeft Bob op.
            klok.0.store((MA + WEEK_S - 10) * 1000, Ordering::SeqCst);
            let p = potje(&mut o, ann, bob, None);
            klok.0.store((MA + WEEK_S) * 1000, Ordering::SeqCst);
            o.zet_klok(klok.clone());
            // De zet-tijd komt uit de klok (`tijd_ms`); geef Bob op via een zet met die klok.
            o.geef_op(bob, p).unwrap();
            let weken = o.tellers().unwrap();
            assert_eq!(weken[0].week_begin, tijd_utc(MA + WEEK_S)[..10]);
            assert_eq!((weken[0].gestart.totaal, weken[0].gestopt.totaal), (0, 1));
            assert_eq!((weken[1].gestart.totaal, weken[1].gestopt.totaal), (1, 0));
        }

        #[test]
        fn de_lijst_met_spelers_telt_gespeeld_en_uitgespeeld_en_zet_test_spelers_eerst() {
            let (mut o, _) = opslag();
            let ann = o.maak_speler("Ann").unwrap().speler_id;
            let bob = o.maak_speler("Bob").unwrap().speler_id;
            let t = o.maak_speler_als("Tester", true).unwrap().speler_id;
            let uit = potje(&mut o, ann, bob, None);
            speel_uit(&mut o, uit, [ann, bob]);
            let opgegeven = potje(&mut o, ann, bob, None);
            o.geef_op(bob, opgegeven).unwrap();
            o.maak_potje(ann, "ster", 2, None).unwrap();
            let lijst = o.speler_regels().unwrap();
            assert_eq!(lijst.iter().map(|s| s.spelersnaam.as_str()).collect::<Vec<_>>(), ["Tester", "Bob", "Ann"]);
            assert!(lijst[0].test && !lijst[1].test);
            assert_eq!((lijst[2].gespeeld, lijst[2].uitgespeeld), (2, 1), "het wachtende Potje telt niet");
            assert_eq!((lijst[0].gespeeld, lijst[0].uitgespeeld), (0, 0));
            // Een Computerspeler staat niet in de lijst en heeft geen vlag.
            let p = o.maak_potje(t, "ster", 2, None).unwrap();
            o.voeg_computerspeler_toe(p.potje_id).unwrap();
            assert_eq!(o.speler_regels().unwrap().len(), 3);
            assert_eq!(o.wissel_test(9999).unwrap_err(), Fout::Onbekend("Unknown player"));
            let computer = o.db.rij("SELECT id FROM speler WHERE computer IS NOT NULL", &[]).unwrap().unwrap().i64(0).unwrap();
            assert!(o.wissel_test(computer).is_err());
        }
    }
}
