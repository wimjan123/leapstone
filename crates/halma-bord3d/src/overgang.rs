//! Overgangen tussen schermen (UI-overgangen, 12 november 2026): een nieuwe lijst voorwerpen of een andere stand verandert niet
//! meer in één beeld. Oude voorwerpen zakken weg en krimpen, nieuwe komen een voor een omhoog; voorwerpen die in beide lijsten
//! gelijk liggen, blijven liggen. Stenen die erbij komen of weggaan, huppen in of uit hun vak, kamp na kamp. De camera glijdt naar
//! zijn nieuwe plek (`camera::Camera::tussen` met `camera::uitlopend`). Alles hier is rekenwerk zonder Bevy; `app` tekent het.
//!
//! Tijden in seconden. Alles samen duurt hooguit ongeveer 0,5 s; met "minder beweging" gebeurt alles meteen (zoals vroeger).

use glam::Vec2;

use crate::voorwerp::{Soort, Voorwerp};

/// Hoe lang een oud voorwerp wegzakt. Kort: weggaan hoort sneller dan komen.
pub const WEG: f32 = 0.16;
/// Na hoeveel tijd het eerste nieuwe voorwerp begint, als er oude wegzakken (anders meteen).
pub const KOMT_NA: f32 = 0.06;
/// Hoe lang één nieuw voorwerp omhoog komt.
pub const KOMT: f32 = 0.28;
/// De verspringing tussen twee nieuwe voorwerpen, van boven naar onder op het scherm, en hoe lang alle verspringing samen hooguit is.
pub const STAP: f32 = 0.03;
pub const STAP_MAX: f32 = 0.12;
/// Hoe lang de camera naar zijn nieuwe plek glijdt.
pub const CAMERA: f32 = 0.42;
/// Hoe lang hij erover doet als hij ook om het bord draait (het begin van een Potje: het bord draait naar de eigen Speler).
pub const CAMERA_DRAAI: f32 = 0.5;

/// Hoe ver de camera is, `t` seconden nadat hij begon te glijden (0 tot 1, met de curve erin), of `None` als hij er is.
/// Gewoon glijden: snel weg en rustig aankomen, zodat een tik meteen beweging geeft. Draait hij ook om het bord, dan rustig op
/// gang en rustig tot stilstand: een draai die meteen op volle snelheid begint, slingert.
pub fn camera_voortgang(t: f32, draait: bool) -> Option<f32> {
    let duur = if draait { CAMERA_DRAAI } else { CAMERA };
    if t >= duur {
        return None;
    }
    let k = (t / duur).clamp(0.0, 1.0);
    Some(if draait {
        k * k * k * (k * (6.0 * k - 15.0) + 10.0)
    } else {
        uit(k)
    })
}

/// Hoe lang een Steen in, uit of om hupt.
pub const HUP_IN: f32 = 0.26;
pub const HUP_UIT: f32 = 0.2;
pub const HUP_OM: f32 = 0.3;
/// Hoe hoog een hup gaat (in vakken; een Steen is 0,8 hoog).
pub const HUP_HOOGTE: f32 = 0.45;
/// De verspringing tussen twee kampen, en hoe lang die samen hooguit is.
pub const KAMP_STAP: f32 = 0.05;
pub const KAMP_STAP_MAX: f32 = 0.15;
/// Binnen een kamp: van de punt naar het bord toe, per Steen, en samen hooguit.
pub const RIJ_STAP: f32 = 0.01;
pub const RIJ_STAP_MAX: f32 = 0.06;

/// Hoe een voorwerp van een nieuwe lijst op de tafel komt.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Komst {
    /// Het lag in de oude lijst al op deze plek (zelfde soort, plek en maat): het blijft liggen. Het nummer in de oude lijst.
    Blijft(usize),
    /// Het komt omhoog, na `wacht` seconden.
    Komt { wacht: f32 },
}

/// Wat een nieuwe lijst voorwerpen met de oude doet.
#[derive(Debug, Clone, PartialEq)]
pub struct Wissel {
    /// Per voorwerp van de nieuwe lijst (`None`: geen voorwerp op dat nummer).
    pub nieuw: Vec<Option<Komst>>,
    /// De nummers in de oude lijst die wegzakken.
    pub weg: Vec<usize>,
}

/// Vergelijk de oude en de nieuwe lijst. Een voorwerp blijft liggen als er in de oude lijst een gelijk voorwerp lag (elk oud
/// voorwerp hooguit één keer). De rest komt omhoog, van boven naar onder op het scherm (z, dan x), met een kleine verspringing.
pub fn wissel(oud: &[Option<Voorwerp>], nieuw: &[Option<Voorwerp>]) -> Wissel {
    let mut gebruikt = vec![false; oud.len()];
    let mut uit: Vec<Option<Komst>> = nieuw
        .iter()
        .map(|v| {
            let v = v.as_ref()?;
            let j = oud
                .iter()
                .enumerate()
                .position(|(j, o)| !gebruikt[j] && o.as_ref() == Some(v));
            Some(match j {
                Some(j) => {
                    gebruikt[j] = true;
                    Komst::Blijft(j)
                }
                None => Komst::Komt { wacht: 0.0 },
            })
        })
        .collect();
    let weg: Vec<usize> = oud
        .iter()
        .enumerate()
        .filter(|(j, o)| o.is_some() && !gebruikt[*j])
        .map(|(j, _)| j)
        .collect();

    let mut komen: Vec<(usize, Vec2)> = nieuw
        .iter()
        .enumerate()
        .filter(|(i, _)| matches!(uit[*i], Some(Komst::Komt { .. })))
        .filter_map(|(i, v)| v.as_ref().map(|v| (i, v.midden)))
        .collect();
    komen.sort_by(|a, b| a.1.y.total_cmp(&b.1.y).then(a.1.x.total_cmp(&b.1.x)));
    let begin = if weg.is_empty() { 0.0 } else { KOMT_NA };
    let stap = verspringing(komen.len(), STAP, STAP_MAX);
    for (rang, (i, _)) in komen.iter().enumerate() {
        uit[*i] = Some(Komst::Komt {
            wacht: begin + rang as f32 * stap,
        });
    }
    Wissel { nieuw: uit, weg }
}

/// De verspringing tussen `n` dingen na elkaar: `stap`, of minder als ze samen langer dan `max` zouden duren.
fn verspringing(n: usize, stap: f32, max: f32) -> f32 {
    if n < 2 {
        return 0.0;
    }
    stap.min(max / (n - 1) as f32)
}

/// Hoe een voorwerp er tijdens een overgang bij ligt: hoeveel lager dan zijn plek (vakken) en hoe groot (1: gewoon).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Houding {
    pub omlaag: f32,
    pub schaal: f32,
}

/// Snel weg, rustig aankomen (ease-out, vierde macht).
fn uit(k: f32) -> f32 {
    1.0 - (1.0 - k.clamp(0.0, 1.0)).powi(4)
}

/// Rustig weg, snel verdwenen (ease-in).
fn in_(k: f32) -> f32 {
    let k = k.clamp(0.0, 1.0);
    k * k
}

/// Een nieuw voorwerp `t` seconden na zijn begin (negatief: het wacht nog en is er niet). `None`: het ligt op zijn plek.
/// Het groeit en komt omhoog uit de tafel.
pub fn komt(t: f32) -> Option<Houding> {
    if t >= KOMT {
        return None;
    }
    if t < 0.0 {
        return Some(Houding {
            omlaag: 0.6,
            schaal: 0.0,
        });
    }
    let e = uit(t / KOMT);
    Some(Houding {
        omlaag: 0.6 * (1.0 - e),
        schaal: 0.35 + 0.65 * e,
    })
}

/// Een oud voorwerp `t` seconden nadat het wegging. `None`: het is weg.
pub fn gaat(t: f32) -> Option<Houding> {
    if t >= WEG {
        return None;
    }
    let e = in_(t.max(0.0) / WEG);
    Some(Houding {
        omlaag: 0.5 * e,
        schaal: 1.0 - e,
    })
}

/// Wat een Steen doet als de stand verandert zonder Zet.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Hup {
    /// Er komt een Steen in een leeg vak.
    In,
    /// De Steen gaat weg: het vak wordt leeg.
    Uit,
    /// Er staat een Steen van een andere Speler: hij hupt op zijn plek en heeft bovenin de nieuwe kleur.
    Om,
}

/// Een Steen die hupt: op welk vak, hoe, en na hoeveel seconden.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct SteenHup {
    pub vak: usize,
    pub hup: Hup,
    pub wacht: f32,
}

/// De Stenen die huppen als de stand van `oud` naar `nieuw` gaat (per vak de Speler, of -1). Leeg als er niets te huppen is:
/// dezelfde stand, of precies één Zet (één Steen van een vak naar een ander; die beweegt al met zijn eigen hup of uit de hand).
/// Een net gebouwd bord hupt niet: dat staat nog niet in beeld (`app` vraagt het dan niet). `vakken`: de plekken van de vakken (x, z), voor de volgorde in een kamp.
///
/// Kamp na kamp (de Speler van de Steen: in een beginstand staan zijn Stenen in zijn kamp), en binnen een kamp van de punt naar
/// het midden van het bord.
pub fn stand_hup(oud: &[i32], nieuw: &[i32], vakken: &[Vec2]) -> Vec<SteenHup> {
    if oud.len() != nieuw.len() {
        return Vec::new();
    }
    let anders: Vec<(usize, i32, i32)> = oud
        .iter()
        .zip(nieuw)
        .enumerate()
        .filter(|(_, (a, b))| a != b)
        .map(|(v, (&a, &b))| (v, a, b))
        .collect();
    let een_zet = anders.len() == 2 && {
        let (a, b) = (anders[0], anders[1]);
        (a.1 >= 0 && a.2 < 0 && b.1 < 0 && b.2 == a.1)
            || (b.1 >= 0 && b.2 < 0 && a.1 < 0 && a.2 == b.1)
    };
    if een_zet {
        return Vec::new();
    }
    // Per kamp (de Speler die er staat of stond) de vakken, van de punt (ver van het midden) naar binnen.
    let mut kampen: Vec<(i32, Vec<(usize, Hup)>)> = Vec::new();
    for &(vak, a, b) in &anders {
        let (speler, hup) = match (a >= 0, b >= 0) {
            (false, true) => (b, Hup::In),
            (true, false) => (a, Hup::Uit),
            _ => (b, Hup::Om),
        };
        match kampen.iter_mut().find(|(s, _)| *s == speler) {
            Some((_, l)) => l.push((vak, hup)),
            None => kampen.push((speler, vec![(vak, hup)])),
        }
    }
    kampen.sort_by_key(|(s, _)| *s);
    let afstand = |v: usize| vakken.get(v).map_or(0.0, |p| p.length());
    let kamp_stap = verspringing(kampen.len(), KAMP_STAP, KAMP_STAP_MAX);
    let mut uit = Vec::with_capacity(anders.len());
    for (k, (_, mut lijst)) in kampen.into_iter().enumerate() {
        lijst.sort_by(|a, b| afstand(b.0).total_cmp(&afstand(a.0)).then(a.0.cmp(&b.0)));
        let rij_stap = verspringing(lijst.len(), RIJ_STAP, RIJ_STAP_MAX);
        for (r, (vak, hup)) in lijst.into_iter().enumerate() {
            uit.push(SteenHup {
                vak,
                hup,
                wacht: k as f32 * kamp_stap + r as f32 * rij_stap,
            });
        }
    }
    uit
}

/// Hoe een huppende Steen erbij staat: hoe hoog boven zijn vak, hoe groot, en of hij nog de oude kleur heeft (bij `Uit`: de
/// Steen die weggaat; bij `Om`: tot bovenin de hup).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct HupStand {
    pub hoogte: f32,
    pub schaal: f32,
    pub oud: bool,
}

/// Een huppende Steen `t` seconden na zijn begin (negatief: hij wacht nog). `None`: de hup is voorbij.
pub fn hup_stand(hup: Hup, t: f32) -> Option<HupStand> {
    let duur = match hup {
        Hup::In => HUP_IN,
        Hup::Uit => HUP_UIT,
        Hup::Om => HUP_OM,
    };
    if t >= duur {
        return None;
    }
    let k = t.max(0.0) / duur;
    // Een boog: omhoog en weer neer, het hoogst halverwege.
    let boog = |k: f32| 4.0 * HUP_HOOGTE * k * (1.0 - k);
    Some(match hup {
        // Nog niet begonnen: er staat niets (In) of nog de oude Steen (Uit, Om).
        Hup::In if t < 0.0 => HupStand {
            hoogte: 0.0,
            schaal: 0.0,
            oud: false,
        },
        _ if t < 0.0 => HupStand {
            hoogte: 0.0,
            schaal: 1.0,
            oud: true,
        },
        // Hij verschijnt al springend: snel groot, dan landen.
        Hup::In => HupStand {
            hoogte: boog(0.5 + 0.5 * k),
            schaal: uit(k * 2.0),
            oud: false,
        },
        // Hij springt op en krimpt weg.
        Hup::Uit => HupStand {
            hoogte: boog(0.5 * k),
            schaal: 1.0 - in_(k),
            oud: true,
        },
        Hup::Om => HupStand {
            hoogte: boog(k),
            schaal: 1.0,
            oud: k < 0.5,
        },
    })
}

/// Ingezoomd (taak 235) liggen de voorwerpen niet meer over het bord: ze zakken weg. Zoom (`Camera::zoom`, 0 is overzicht) vanaf
/// hier telt als ingezoomd, en pas onder `UITGEZOOMD` weer als overzicht, zodat een bibberende vinger ze niet laat flikkeren.
pub const INGEZOOMD: f32 = 0.06;
pub const UITGEZOOMD: f32 = 0.03;
/// Zo lang duurt het wegzakken en weer omhoog komen (seconden).
pub const ZAKT: f32 = 0.2;

/// Is de camera ingezoomd? `was`: of hij dat in het vorige beeld al was.
pub fn ingezoomd(zoom: f32, was: bool) -> bool {
    if was { zoom > UITGEZOOMD } else { zoom > INGEZOOMD }
}

/// Eén beeld verder (`dt` seconden) van hoe ver de voorwerpen weggezakt zijn: 0 op hun plek, 1 helemaal weg.
pub fn zak_stap(weg: f32, ingezoomd: bool, dt: f32) -> f32 {
    let doel = if ingezoomd { 1.0 } else { 0.0 };
    let stap = dt / ZAKT;
    if weg < doel {
        (weg + stap).min(doel)
    } else {
        (weg - stap).max(doel)
    }
}

/// Welke voorwerpen ingezoomd wegzakken (taak 235): de naamplaten, de kom en het zegel. Het blad met de knoppen en alles daarop
/// blijft liggen en tikbaar (het ligt aan de schermrand), en de jade aanwijzer blijft zichtbaar maar schuift weg van het bord
/// (`jade_plek`): zo kun je ingezoomd nog een reeks Sprongen afmaken met Done en zie je je beurt en je Denktijd.
pub fn zakt_weg(soort: Soort) -> bool {
    matches!(soort, Soort::Naamplaat | Soort::Kom | Soort::Zegel)
}

/// Een beetje ruimte tussen het blad en de jade aanwijzer eronder (vakken).
const JADE_LUCHT: f32 = 0.2;

/// Waar de jade aanwijzer ligt als de voorwerpen `weg` (0 tot 1) weggezakt zijn: hij schuift van zijn plek naar vlak onder het
/// blad met de knoppen (`blad`), buiten het bord, en komt bij uitzoomen terug. Zonder blad blijft hij liggen.
pub fn jade_plek(jade: &Voorwerp, blad: Option<&Voorwerp>, weg: f32) -> Vec2 {
    let Some(blad) = blad else {
        return jade.midden;
    };
    let doel = Vec2::new(
        jade.midden.x,
        blad.midden.y + blad.diepte / 2.0 + jade.diepte / 2.0 + JADE_LUCHT,
    );
    let e = weg.clamp(0.0, 1.0);
    jade.midden + (doel - jade.midden) * (e * e * (3.0 - 2.0 * e))
}

/// Hoe een voorwerp erbij ligt als het `weg` (0 tot 1) weggezakt is: zoals een voorwerp dat verdwijnt (`gaat`).
pub fn zakt(weg: f32) -> Houding {
    let e = in_(weg);
    Houding {
        omlaag: 0.5 * e,
        schaal: 1.0 - e,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::voorwerp::Soort;

    fn plaat(soort: Soort, x: f32, z: f32) -> Option<Voorwerp> {
        Some(Voorwerp {
            soort,
            midden: Vec2::new(x, z),
            breedte: 4.0,
            diepte: 2.7,
            hoogte: 0.5,
            spiegel: false,
        })
    }

    #[test]
    fn een_gelijk_voorwerp_blijft_liggen_en_de_rest_komt_van_boven_naar_onder() {
        let terug = plaat(Soort::Porselein, -5.0, -12.0);
        let oud = vec![
            terug.clone(),
            plaat(Soort::Naamplaat, 3.0, -12.0),
            plaat(Soort::Rood, 0.0, 12.0),
        ];
        let nieuw = vec![
            plaat(Soort::Porselein, 0.0, 15.0),
            terug,
            None,
            plaat(Soort::Porselein, 0.0, 10.0),
        ];
        let w = wissel(&oud, &nieuw);
        assert_eq!(w.nieuw[1], Some(Komst::Blijft(0)));
        assert_eq!(w.nieuw[2], None);
        assert_eq!(w.weg, vec![1, 2]);
        // Er zakken oude weg: het eerste nieuwe begint na KOMT_NA, het bovenste (z = 10) eerst.
        assert_eq!(w.nieuw[3], Some(Komst::Komt { wacht: KOMT_NA }));
        assert_eq!(
            w.nieuw[0],
            Some(Komst::Komt {
                wacht: KOMT_NA + STAP
            })
        );
    }

    #[test]
    fn een_andere_maat_of_soort_op_dezelfde_plek_komt_opnieuw() {
        let oud = vec![
            plaat(Soort::Porselein, 0.0, 10.0),
            plaat(Soort::Rood, 0.0, 14.0),
        ];
        let mut breder = plaat(Soort::Porselein, 0.0, 10.0);
        breder.as_mut().unwrap().breedte = 5.0;
        let nieuw = vec![breder, plaat(Soort::Zwart, 0.0, 14.0)];
        let w = wissel(&oud, &nieuw);
        assert_eq!(w.weg, vec![0, 1]);
        assert!(
            w.nieuw
                .iter()
                .all(|k| matches!(k, Some(Komst::Komt { .. })))
        );
    }

    #[test]
    fn zonder_oude_voorwerpen_begint_het_eerste_meteen_en_de_verspringing_blijft_kort() {
        let nieuw: Vec<_> = (0..13)
            .map(|i| plaat(Soort::Porselein, 0.0, i as f32))
            .collect();
        let w = wissel(&[], &nieuw);
        let wachten: Vec<f32> = w
            .nieuw
            .iter()
            .map(|k| match k {
                Some(Komst::Komt { wacht }) => *wacht,
                _ => panic!("komt niet"),
            })
            .collect();
        assert_eq!(wachten[0], 0.0);
        assert!((wachten[12] - STAP_MAX).abs() < 1e-5, "{wachten:?}");
        assert!(wachten.windows(2).all(|p| p[1] > p[0]));
    }

    #[test]
    fn de_camera_glijdt_zonder_terug_te_gaan_en_komt_aan() {
        for draait in [false, true] {
            let mut vorig = 0.0;
            for i in 0..=50 {
                let Some(k) = camera_voortgang(i as f32 * 0.01, draait) else {
                    assert!(i as f32 * 0.01 >= CAMERA - 1e-6);
                    continue;
                };
                assert!((0.0..=1.0).contains(&k) && k >= vorig, "{draait} {i} {k}");
                vorig = k;
            }
            assert!(vorig > 0.98);
            assert_eq!(camera_voortgang(0.6, draait), None);
        }
        // Gewoon glijden geeft meteen beweging: na 1 beeld (17 ms) al een flink stuk; een draai begint rustig.
        assert!(camera_voortgang(0.017, false).unwrap() > 0.1);
        assert!(camera_voortgang(0.017, true).unwrap() < 0.01);
    }

    #[test]
    fn een_nieuw_voorwerp_is_er_niet_tot_het_begint_en_ligt_daarna_op_zijn_plek() {
        assert_eq!(komt(-0.01).unwrap().schaal, 0.0);
        let begin = komt(0.0).unwrap();
        let half = komt(KOMT / 2.0).unwrap();
        assert!(begin.omlaag > half.omlaag && half.omlaag > 0.0);
        assert!(begin.schaal < half.schaal && half.schaal < 1.0);
        assert_eq!(komt(KOMT), None);
    }

    #[test]
    fn een_oud_voorwerp_krimpt_weg_en_is_dan_weg() {
        assert_eq!(
            gaat(0.0),
            Some(Houding {
                omlaag: 0.0,
                schaal: 1.0
            })
        );
        let bijna = gaat(WEG * 0.95).unwrap();
        assert!(bijna.schaal < 0.15 && bijna.omlaag > 0.4);
        assert_eq!(gaat(WEG), None);
    }

    /// Een klein bord: vak 0 en 1 in het kamp van Speler 0 (vak 0 verder van het midden), 2 en 3 van Speler 1, 4 en 5 leeg.
    fn vakken() -> Vec<Vec2> {
        vec![
            Vec2::new(0.0, 8.0),
            Vec2::new(0.0, 7.0),
            Vec2::new(0.0, -8.0),
            Vec2::new(0.0, -7.0),
            Vec2::new(1.0, 0.0),
            Vec2::new(-1.0, 0.0),
        ]
    }

    #[test]
    fn een_zet_of_dezelfde_stand_hupt_niet_een_leeg_bord_wel() {
        let oud = [0, 0, 1, 1, -1, -1];
        assert!(stand_hup(&oud, &[0, -1, 1, 1, 0, -1], &vakken()).is_empty());
        assert!(stand_hup(&oud, &[0, 0, 1, -1, -1, 1], &vakken()).is_empty());
        assert!(stand_hup(&oud, &oud, &vakken()).is_empty());
        // Twee Stenen van dezelfde Speler tegelijk verplaatst is geen Zet: die huppen.
        assert_eq!(stand_hup(&oud, &[-1, -1, 1, 1, 0, 0], &vakken()).len(), 4);
        // Van een leeg bord (het Startmenu na Mijn potjes) komen alle Stenen erin, en weer weg.
        assert_eq!(stand_hup(&[-1; 6], &oud, &vakken()).len(), 4);
        assert!(
            stand_hup(&oud, &[-1; 6], &vakken())
                .iter()
                .all(|h| h.hup == Hup::Uit)
        );
    }

    #[test]
    fn stenen_die_erbij_komen_weggaan_of_van_kleur_wisselen_huppen_kamp_na_kamp() {
        let oud = [0, 0, -1, -1, -1, -1];
        let nieuw = [2, 2, 1, 1, -1, -1];
        let h = stand_hup(&oud, &nieuw, &vakken());
        let van = |v: usize| *h.iter().find(|s| s.vak == v).unwrap();
        assert_eq!(van(0).hup, Hup::Om);
        assert_eq!(van(2).hup, Hup::In);
        // Kamp van Speler 1 eerst, dan Speler 2; in een kamp de punt (verder van het midden) eerst.
        assert_eq!(van(2).wacht, 0.0);
        assert_eq!(van(3).wacht, RIJ_STAP);
        assert_eq!(van(0).wacht, KAMP_STAP);
        assert_eq!(van(1).wacht, KAMP_STAP + RIJ_STAP);
        let weg = stand_hup(&nieuw, &[2, 2, -1, -1, -1, -1], &vakken());
        assert!(weg.iter().all(|s| s.hup == Hup::Uit) && weg.len() == 2);
    }

    #[test]
    fn een_hup_begint_en_eindigt_in_het_vak() {
        for hup in [Hup::In, Hup::Uit, Hup::Om] {
            let begin = hup_stand(hup, 0.0).unwrap();
            assert!(
                begin.hoogte.abs() < 1e-6 || hup == Hup::In,
                "{hup:?} {begin:?}"
            );
            assert_eq!(hup_stand(hup, 1.0), None);
        }
        // In: komt van boven in het vak en is aan het eind heel; Uit: is aan het eind (bijna) weg.
        let in_eind = hup_stand(Hup::In, HUP_IN * 0.99).unwrap();
        assert!(in_eind.hoogte < 0.02 && in_eind.schaal > 0.99);
        assert!(hup_stand(Hup::Uit, HUP_UIT * 0.99).unwrap().schaal < 0.05);
        // Om: de oude kleur tot bovenin, daarna de nieuwe.
        assert!(hup_stand(Hup::Om, HUP_OM * 0.4).unwrap().oud);
        assert!(!hup_stand(Hup::Om, HUP_OM * 0.6).unwrap().oud);
        assert!(hup_stand(Hup::Om, HUP_OM * 0.5).unwrap().hoogte > HUP_HOOGTE * 0.99);
        // Wachten: In is er nog niet, Uit en Om staan nog als de oude Steen.
        assert_eq!(hup_stand(Hup::In, -0.1).unwrap().schaal, 0.0);
        assert!(hup_stand(Hup::Uit, -0.1).unwrap().oud);
    }

    #[test]
    fn ingezoomd_met_een_marge_zodat_het_niet_flikkert() {
        assert!(!ingezoomd(0.0, false));
        assert!(!ingezoomd(0.05, false));
        assert!(ingezoomd(0.07, false));
        // Eenmaal ingezoomd blijft het zo tot de zoom bijna weg is.
        assert!(ingezoomd(0.05, true));
        assert!(!ingezoomd(0.02, true));
    }

    #[test]
    fn de_voorwerpen_zakken_weg_zolang_je_ingezoomd_bent_en_komen_terug() {
        let mut weg = 0.0;
        for _ in 0..30 {
            weg = zak_stap(weg, true, 0.01);
        }
        assert!((weg - 1.0).abs() < 1e-6, "{weg}");
        // Helemaal weg: onder de tafel en niet meer te zien.
        let h = zakt(weg);
        assert!(h.omlaag > 0.4 && h.schaal < 0.01);
        assert_eq!(zakt(0.0), Houding { omlaag: 0.0, schaal: 1.0 });
        for _ in 0..30 {
            weg = zak_stap(weg, false, 0.01);
        }
        assert_eq!(weg, 0.0);
        // Een traag beeld slaat het doel niet over.
        assert_eq!(zak_stap(0.9, true, 1.0), 1.0);
    }

    #[test]
    fn ingezoomd_blijven_het_blad_en_de_knoppen_liggen_en_zakken_naamplaten_weg() {
        for soort in [Soort::Naamplaat, Soort::Kom, Soort::Zegel] {
            assert!(zakt_weg(soort), "{soort:?}");
        }
        for soort in [Soort::Blad, Soort::Porselein, Soort::Rood, Soort::Messing, Soort::Jade, Soort::Lade, Soort::Zwart] {
            assert!(!zakt_weg(soort), "{soort:?}");
        }
    }

    #[test]
    fn de_jade_aanwijzer_schuift_ingezoomd_onder_het_blad_en_komt_terug() {
        let jade = plaat(Soort::Jade, -2.0, -9.9).unwrap();
        let blad = Voorwerp { diepte: 3.5, ..plaat(Soort::Blad, 0.0, 12.0).unwrap() };
        assert_eq!(jade_plek(&jade, Some(&blad), 0.0), jade.midden);
        let p = jade_plek(&jade, Some(&blad), 1.0);
        // Zijn x blijft; hij ligt helemaal onder het blad, niet erop en niet bij het bord.
        assert_eq!(p.x, jade.midden.x);
        assert!(p.y - jade.diepte / 2.0 >= blad.midden.y + blad.diepte / 2.0, "{p}");
        // Onderweg ligt hij ertussen.
        let m = jade_plek(&jade, Some(&blad), 0.5);
        assert!(m.y > jade.midden.y && m.y < p.y);
        // Zonder blad blijft hij liggen.
        assert_eq!(jade_plek(&jade, None, 1.0), jade.midden);
    }
}
