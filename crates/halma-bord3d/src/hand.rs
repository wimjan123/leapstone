//! De hand van de Speler: een steen slepen, neerzetten, en terug als de Zet niet mag.
//!
//! Zoals op een echt bord: niets licht op. De Speler probeert een vak; mag het niet (dat zeggen
//! de spelregels in de web-app), dan schuift de steen naar de rand van dat vak en terug.
//! Alleen om te tonen: dit beslist niets.
//!
//! Gewoon rekenwerk zonder Bevy. Plekken op het bord (x, z), hoogtes boven de rustplek van een
//! steen in een gaatje, tijd in seconden.

use crate::beweging::Plek;
use crate::lak::GAT_STRAAL;
use crate::pion;
use glam::Vec2;
use std::f32::consts::{PI, TAU};

/// Zo ver gaat een gekozen steen omhoog (prototype 1b: 0,3; taak 235: 0,4, zodat je ziet welke gekozen is).
pub const OPTILLEN: f32 = 0.4;
/// Een steen die op het bord staat (niet in zijn zitje) staat zo hoog.
pub const OP_HET_BORD: f32 = pion::ZAKT;
/// Zo hoog hangt een gesleepte steen: ruim boven de koppen van de andere stenen (0,46 boven het
/// bord), zodat de landingsschaduw eronder te zien blijft (prototype 1b: 1,05).
pub const SLEEP_HOOGTE: f32 = 1.05;
/// Hoe hoog een steen gaat als hij over andere stenen heen moet.
const OVER_STENEN: f32 = 0.95;
/// Een poging naar een leeg vak stopt op deze afstand van het midden: de voet stoot net over
/// de rand van het gat.
const RAND_LEEG: f32 = GAT_STRAAL + 0.12;
/// Naar een vak met een steen: hij stopt met zijn voet tegen de voet van die steen.
const RAND_BEZET: f32 = 2.0 * pion::STRAAL + 0.02;
/// Het schudden na het terugrollen: hoe lang, hoe ver (in vakken) en hoe vaak heen en weer.
pub const SCHUDDEN: f32 = 0.15;
const SCHUD_MAAT: f32 = 0.045;
const SCHUD_KEER: f32 = 2.5;
/// Neerzetten na slepen: vallen, en een klein stuitertje.
const VAL_DUUR: f32 = 0.16;
const STUIT_DUUR: f32 = 0.09;
const STUIT_HOOGTE: f32 = 0.035;

/// Een losgelaten steen landt in het dichtstbijzijnde vak binnen zoveel vakken: `GAT_STRAAL` in
/// `web/src/tikken.ts`. Welk vak ook: wat mag, telt niet mee (geen hint).
pub const LANDING_STRAAL: f32 = 0.75;

/// Het vak (de plek van zijn gat) waar een steen valt die boven `plek` hangt: het dichtstbijzijnde
/// vak binnen `LANDING_STRAAL`, welk vak ook. `None`: naast het bord, daar valt hij nergens.
/// De landingsschaduw staat op dit gat; ze toont waar hij valt, nooit of de Zet mag.
pub fn landing_vak(vakken: &[Vec2], plek: Vec2) -> Option<Vec2> {
    vakken
        .iter()
        .map(|v| (v.distance(plek), *v))
        .filter(|(d, _)| *d <= LANDING_STRAAL)
        .min_by(|a, b| a.0.total_cmp(&b.0))
        .map(|(_, v)| v)
}

fn glad(t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

fn in_uit(t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    if t < 0.5 {
        4.0 * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(3) / 2.0
    }
}

fn uit(t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    1.0 - (1.0 - t).powi(3)
}

/// Een steen die niet mag en terug naar zijn gaatje gaat. Eindigt opgetild: hij blijft gekozen.
#[derive(Debug, Clone, PartialEq)]
pub struct Terug {
    begin: Vec2,
    begin_hoogte: f32,
    /// Waar hij omkeert (de rand van het vak), en hoe hoog hij daar is.
    keer: Vec2,
    keer_hoogte: f32,
    rust: Vec2,
    /// Heen (naar de rand) en terug, in seconden. Na slepen is er geen heen.
    heen: f32,
    terug: f32,
    /// Boog over andere stenen heen, heen en terug.
    boog: f32,
    /// Richting van het schudden (lengte 1).
    richting: Vec2,
}

impl Terug {
    /// Een tik op vak `doel` mag niet: de steen gaat van zijn gaatje op `rust` naar de rand van
    /// `doel` en rolt terug. `bezet`: er staat een steen op `doel`. `over_stenen`: er liggen
    /// stenen op de weg, dan gaat hij er in een boog overheen.
    pub fn poging(rust: Vec2, doel: Vec2, bezet: bool, over_stenen: bool) -> Terug {
        let afstand = rust.distance(doel);
        let richting = (doel - rust).normalize_or(Vec2::X);
        let stop = if bezet { RAND_BEZET } else { RAND_LEEG };
        // Altijd een klein stukje, ook als het vak vlakbij is. Tegen een steen aan minder: de Stenen
        // zijn breed (0,82 vak), dus tussen twee buren is maar 0,18 vak ruimte.
        let weg = (afstand - stop).max(if bezet { 0.12 } else { 0.22 });
        Terug {
            begin: rust,
            begin_hoogte: OPTILLEN,
            keer: rust + richting * weg,
            keer_hoogte: OP_HET_BORD,
            rust,
            heen: (0.08 + 0.05 * weg).clamp(0.11, 0.26),
            terug: (0.11 + 0.06 * weg).clamp(0.15, 0.32),
            boog: if over_stenen { OVER_STENEN } else { 0.0 },
            richting,
        }
    }

    /// Na slepen naar een vak dat niet mag (of naast het bord): van de vinger terug naar het gaatje.
    pub fn na_slepen(plek: Vec2, hoogte: f32, rust: Vec2) -> Terug {
        let afstand = plek.distance(rust);
        Terug {
            begin: plek,
            begin_hoogte: hoogte,
            keer: plek,
            keer_hoogte: hoogte,
            rust,
            heen: 0.0,
            terug: (0.16 + 0.05 * afstand).clamp(0.2, 0.42),
            boog: 0.0,
            richting: (rust - plek).normalize_or(Vec2::X),
        }
    }

    pub fn duur(&self) -> f32 {
        self.heen + self.terug + SCHUDDEN
    }

    pub fn klaar(&self, t: f32) -> bool {
        t >= self.duur()
    }

    /// Waar de steen is na `t` seconden. `hoogte` is boven de rustplek in het gaatje.
    pub fn plek(&self, t: f32) -> Plek {
        let t = t.max(0.0);
        if t >= self.duur() {
            return Plek {
                over: self.rust,
                hoogte: OPTILLEN,
            };
        }
        if t < self.heen {
            // Heen: snel weg, afremmen tegen de rand. Van opgetild naar op het bord.
            let u = t / self.heen;
            let over = self.begin.lerp(self.keer, uit(u));
            let hoogte = self.begin_hoogte
                + (self.keer_hoogte - self.begin_hoogte) * glad(u / 0.7)
                + self.boog * (PI * u).sin();
            return Plek { over, hoogte };
        }
        let t = t - self.heen;
        if t < self.terug {
            // Terug: rustig op gang, rustig het gaatje in. Pas aan het eind weer omhoog,
            // zodat hij niet door andere stenen gaat.
            let u = t / self.terug;
            let over = self.keer.lerp(self.rust, in_uit(u));
            let hoogte = self.keer_hoogte
                + (OPTILLEN - self.keer_hoogte) * glad((u - 0.55) / 0.45)
                + self.boog * (PI * u).sin();
            return Plek { over, hoogte };
        }
        // Even schudden in de richting van de poging, steeds minder.
        let u = ((t - self.terug) / SCHUDDEN).min(1.0);
        let uitslag = SCHUD_MAAT * (1.0 - u).powi(2) * (TAU * SCHUD_KEER * u).sin();
        Plek {
            over: self.rust + self.richting * uitslag,
            hoogte: OPTILLEN,
        }
    }
}

/// Een gesleepte steen die losgelaten wordt boven een vak: hij valt erin met een klein stuitertje.
#[derive(Debug, Clone, PartialEq)]
pub struct Val {
    begin: Vec2,
    hoogte: f32,
    naar: Vec2,
}

impl Val {
    pub fn nieuw(begin: Vec2, hoogte: f32, naar: Vec2) -> Val {
        Val {
            begin,
            hoogte,
            naar,
        }
    }

    pub fn duur(&self) -> f32 {
        VAL_DUUR + STUIT_DUUR
    }

    pub fn klaar(&self, t: f32) -> bool {
        t >= self.duur()
    }

    pub fn plek(&self, t: f32) -> Plek {
        let t = t.max(0.0);
        if t >= self.duur() {
            return Plek {
                over: self.naar,
                hoogte: 0.0,
            };
        }
        if t < VAL_DUUR {
            let u = t / VAL_DUUR;
            return Plek {
                over: self.begin.lerp(self.naar, uit(u)),
                // Vallen: steeds sneller.
                hoogte: self.hoogte * (1.0 - u * u),
            };
        }
        let u = ((t - VAL_DUUR) / STUIT_DUUR).min(1.0);
        Plek {
            over: self.naar,
            hoogte: STUIT_HOOGTE * (PI * u).sin(),
        }
    }
}

/// Wat de hand nu doet.
#[derive(Debug, Clone, PartialEq, Default)]
pub enum Hand {
    #[default]
    Leeg,
    /// De Speler sleept de steen van vak `vak`; `plek` is waar hij nu boven het bord hangt.
    Sleept { vak: usize, plek: Vec2 },
    /// Losgelaten boven vak `naar` (de spelregels vonden het goed): hij valt erin en blijft daar
    /// tot de stand de Zet laat zien. `sinds`: wanneer hij losgelaten werd.
    Valt {
        van: usize,
        naar: usize,
        /// Het gaatje van `van`: daarheen terug als de Zet toch niet doorgaat.
        rust: Vec2,
        val: Val,
        sinds: f64,
    },
    /// Terug naar zijn gaatje op `vak`.
    Rolt {
        vak: usize,
        terug: Terug,
        sinds: f64,
    },
}

impl Hand {
    /// Een hup langs `pad` hoeft niet: de steen ligt al op zijn plek (hij is daar neergezet).
    pub fn hup_overbodig(&self, pad: &[usize]) -> bool {
        match self {
            Hand::Valt { van, naar, .. } => pad.first() == Some(van) && pad.last() == Some(naar),
            _ => false,
        }
    }

    /// Welk vak de steen in de hand heeft in de stand `bezet` (is er een steen op dit vak?),
    /// en waar hij is op tijd `nu`. `None`: de hand doet niets.
    pub fn steen(&self, nu: f64, bezet: impl Fn(usize) -> bool) -> Option<(usize, Plek)> {
        match self {
            Hand::Leeg => None,
            Hand::Sleept { vak, plek } => Some((
                *vak,
                Plek {
                    over: *plek,
                    hoogte: SLEEP_HOOGTE,
                },
            )),
            Hand::Valt {
                van,
                naar,
                val,
                sinds,
                ..
            } => {
                // Zolang de stand de Zet nog niet laat zien, is het de steen op `van`.
                let vak = if bezet(*naar) && !bezet(*van) {
                    *naar
                } else {
                    *van
                };
                Some((vak, val.plek((nu - sinds) as f32)))
            }
            Hand::Rolt { vak, terug, sinds } => Some((*vak, terug.plek((nu - sinds) as f32))),
        }
    }

    /// Bijwerken na een beeld. `bezet`: de stand. `gekozen`: het gekozen vak.
    /// Een neergezette steen blijft op zijn nieuwe vak tot de stand de Zet laat zien.
    /// Laat de stand hem niet zien en is de steen niet meer gekozen (de server wees de Zet af),
    /// dan rolt hij terug. Geeft `true` zolang er iets beweegt.
    pub fn bij(&mut self, nu: f64, bezet: impl Fn(usize) -> bool, gekozen: Option<usize>) -> bool {
        match self {
            Hand::Leeg => false,
            Hand::Sleept { .. } => false,
            Hand::Valt {
                van,
                naar,
                rust,
                val,
                sinds,
            } => {
                let gezet = bezet(*naar) && !bezet(*van);
                let t = (nu - *sinds) as f32;
                if *van == *naar || gezet {
                    if val.klaar(t) {
                        *self = Hand::Leeg;
                        return false;
                    }
                    return true;
                }
                if gekozen != Some(*van) || !bezet(*van) {
                    // Afgewezen (of de stand is helemaal anders): terug van het nieuwe vak.
                    if bezet(*van) {
                        let p = val.plek(t);
                        *self = Hand::Rolt {
                            vak: *van,
                            terug: Terug::na_slepen(p.over, p.hoogte.max(OP_HET_BORD), *rust),
                            sinds: nu,
                        };
                        return true;
                    }
                    *self = Hand::Leeg;
                    return false;
                }
                !val.klaar(t)
            }
            Hand::Rolt { terug, sinds, .. } => {
                if terug.klaar((nu - *sinds) as f32) {
                    *self = Hand::Leeg;
                    return false;
                }
                true
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn stappen(duur: f32, plek: impl Fn(f32) -> Plek) -> Vec<Plek> {
        (0..=400).map(|k| plek(duur * k as f32 / 400.0)).collect()
    }

    fn zonder_sprongen(punten: &[Plek]) {
        for w in punten.windows(2) {
            assert!(w[0].over.distance(w[1].over) < 0.05, "{w:?}");
            assert!((w[0].hoogte - w[1].hoogte).abs() < 0.05, "{w:?}");
        }
    }

    #[test]
    fn een_poging_gaat_naar_de_rand_en_rolt_terug() {
        let rust = Vec2::ZERO;
        let doel = Vec2::new(2.0, 0.0);
        let p = Terug::poging(rust, doel, false, false);
        // Begint en eindigt opgetild in het eigen gaatje: de steen blijft gekozen.
        assert_eq!(
            p.plek(0.0),
            Plek {
                over: rust,
                hoogte: OPTILLEN
            }
        );
        assert_eq!(
            p.plek(p.duur()),
            Plek {
                over: rust,
                hoogte: OPTILLEN
            }
        );
        let punten = stappen(p.duur(), |t| p.plek(t));
        zonder_sprongen(&punten);
        // Hij komt tot de rand van het vak, maar niet erin.
        let dichtst = punten
            .iter()
            .map(|q| q.over.distance(doel))
            .fold(f32::MAX, f32::min);
        assert!((dichtst - RAND_LEEG).abs() < 1e-3, "{dichtst}");
        // Op het bord bij de rand.
        assert!((p.plek(p.heen).hoogte - OP_HET_BORD).abs() < 1e-3);
        // Heen en terug samen ongeveer 0,3 tot 0,45 seconde, dan kort schudden.
        assert!(
            (0.25..=0.45).contains(&(p.heen + p.terug)),
            "{}",
            p.heen + p.terug
        );
    }

    #[test]
    fn een_bezet_vak_stopt_tegen_de_steen_aan() {
        let doel = Vec2::new(1.0, 0.0);
        let p = Terug::poging(Vec2::ZERO, doel, true, false);
        let dichtst = stappen(p.duur(), |t| p.plek(t))
            .iter()
            .map(|q| q.over.distance(doel))
            .fold(f32::MAX, f32::min);
        assert!(dichtst >= 2.0 * pion::STRAAL - 1e-3, "{dichtst}");
        // Toch een klein stukje: je ziet dat er iets gebeurt.
        assert!(p.keer.length() > 0.12, "{}", p.keer.length());
    }

    #[test]
    fn over_andere_stenen_gaat_hij_in_een_boog() {
        let p = Terug::poging(Vec2::ZERO, Vec2::new(4.0, 0.0), false, true);
        let hoogst = stappen(p.duur(), |t| p.plek(t))
            .iter()
            .map(|q| q.hoogte)
            .fold(0.0, f32::max);
        assert!(hoogst > 0.9, "{hoogst}");
    }

    #[test]
    fn schudden_is_klein_en_houdt_op() {
        let p = Terug::poging(Vec2::ZERO, Vec2::new(1.0, 1.0), false, false);
        let begin = p.heen + p.terug;
        for k in 0..=50 {
            let q = p.plek(begin + SCHUDDEN * k as f32 / 50.0);
            assert!(q.over.length() <= SCHUD_MAAT + 1e-4);
        }
        assert!(p.klaar(p.duur()) && !p.klaar(begin));
    }

    #[test]
    fn na_slepen_terug_van_de_vinger_naar_het_gaatje() {
        let rust = Vec2::new(1.0, 2.0);
        let los = Vec2::new(3.5, -1.0);
        let p = Terug::na_slepen(los, SLEEP_HOOGTE, rust);
        assert_eq!(
            p.plek(0.0),
            Plek {
                over: los,
                hoogte: SLEEP_HOOGTE
            }
        );
        assert_eq!(
            p.plek(p.duur()),
            Plek {
                over: rust,
                hoogte: OPTILLEN
            }
        );
        let punten = stappen(p.duur(), |t| p.plek(t));
        zonder_sprongen(&punten);
        // Hoog genoeg boven de andere stenen tot hij bijna terug is.
        for q in &punten {
            if q.over.distance(rust) > 0.8 {
                assert!(q.hoogte > SLEEP_HOOGTE - 0.1, "{q:?}");
            }
        }
    }

    #[test]
    fn neerzetten_valt_in_het_gaatje() {
        let naar = Vec2::new(2.0, 0.0);
        let v = Val::nieuw(Vec2::new(1.8, 0.3), SLEEP_HOOGTE, naar);
        assert_eq!(v.plek(0.0).hoogte, SLEEP_HOOGTE);
        assert_eq!(
            v.plek(v.duur()),
            Plek {
                over: naar,
                hoogte: 0.0
            }
        );
        assert!(v.duur() < 0.3);
        zonder_sprongen(&stappen(v.duur(), |t| v.plek(t)));
    }

    #[test]
    fn de_landing_is_het_dichtstbijzijnde_vak_en_naast_het_bord_nergens() {
        let vakken = [
            Vec2::new(0.0, 0.0),
            Vec2::new(1.0, 0.0),
            Vec2::new(0.5, 0.866),
        ];
        // Tussen twee vakken: het dichtstbijzijnde, ook als het een ander vak is dan waar de steen vandaan komt.
        assert_eq!(landing_vak(&vakken, Vec2::new(0.4, 0.1)), Some(vakken[0]));
        assert_eq!(landing_vak(&vakken, Vec2::new(0.6, 0.05)), Some(vakken[1]));
        assert_eq!(landing_vak(&vakken, Vec2::new(0.45, 0.7)), Some(vakken[2]));
        // Binnen bereik (0,75), daarbuiten niets.
        assert_eq!(landing_vak(&vakken, Vec2::new(-0.7, 0.0)), Some(vakken[0]));
        assert_eq!(landing_vak(&vakken, Vec2::new(-0.8, 0.0)), None);
        assert_eq!(landing_vak(&vakken, Vec2::new(5.0, 5.0)), None);
        assert_eq!(landing_vak(&[], Vec2::ZERO), None);
    }

    /// Een stand als lijst: welke vakken bezet zijn.
    fn stand(bezet: &[usize]) -> impl Fn(usize) -> bool + '_ {
        move |v| bezet.contains(&v)
    }

    fn valt(van: usize, naar: usize) -> Hand {
        Hand::Valt {
            van,
            naar,
            rust: Vec2::ZERO,
            val: Val::nieuw(Vec2::new(1.9, 0.1), SLEEP_HOOGTE, Vec2::new(2.0, 0.0)),
            sinds: 0.0,
        }
    }

    #[test]
    fn neergezet_de_hup_van_dezelfde_zet_is_overbodig() {
        let h = valt(3, 7);
        assert!(h.hup_overbodig(&[3, 7]));
        assert!(h.hup_overbodig(&[3, 5, 7]));
        assert!(!h.hup_overbodig(&[4, 7]));
        assert!(!Hand::Leeg.hup_overbodig(&[3, 7]));
    }

    #[test]
    fn neergezet_eerst_de_oude_steen_en_na_de_stand_de_nieuwe() {
        let mut h = valt(3, 7);
        // De stand is nog niet bijgewerkt (online: de server denkt nog na).
        assert_eq!(h.steen(0.05, stand(&[3])).unwrap().0, 3);
        // Lang na het vallen blijft hij liggen zolang de stand niet verandert en hij gekozen is.
        assert!(!h.bij(5.0, stand(&[3]), Some(3)));
        assert!(matches!(h, Hand::Valt { .. }));
        assert_eq!(
            h.steen(5.0, stand(&[3])).unwrap().1.over,
            Vec2::new(2.0, 0.0)
        );
        // De server keurt goed: de stand laat de Zet zien, en dan is de hand leeg.
        assert_eq!(h.steen(5.0, stand(&[7])).unwrap().0, 7);
        assert!(!h.bij(5.1, stand(&[7]), None));
        assert_eq!(h, Hand::Leeg);
    }

    #[test]
    fn neergezet_maar_afgewezen_dan_rolt_hij_terug() {
        let mut h = valt(3, 7);
        assert!(!h.bij(1.0, stand(&[3]), Some(3)));
        // De keuze is weg maar de stand niet veranderd: afgewezen.
        assert!(h.bij(1.2, stand(&[3]), None));
        let Hand::Rolt { vak, terug, .. } = &h else {
            panic!("{h:?}");
        };
        assert_eq!(*vak, 3);
        assert_eq!(terug.plek(0.0).over, Vec2::new(2.0, 0.0));
        assert_eq!(terug.plek(terug.duur()).over, Vec2::ZERO);
    }

    #[test]
    fn terugrollen_houdt_op() {
        let mut h = Hand::Rolt {
            vak: 2,
            terug: Terug::poging(Vec2::ZERO, Vec2::X * 2.0, false, false),
            sinds: 1.0,
        };
        assert!(h.bij(1.1, stand(&[2]), Some(2)));
        assert_eq!(h.steen(1.1, stand(&[2])).unwrap().0, 2);
        assert!(!h.bij(3.0, stand(&[2]), Some(2)));
        assert_eq!(h, Hand::Leeg);
    }
}
