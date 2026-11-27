//! De beweging van een Zet: de steen hupt in een boog van vak naar vak, langs het pad uit
//! de spelregels (`zet_pad` in halma-core). Alleen om te tonen.
//!
//! Gewoon rekenwerk zonder Bevy. Plekken in de 3D-wereld (x, z), tijd in seconden.

use glam::Vec2;
use std::f32::consts::PI;

/// Hoe hoog een steen komt bij een Sprong over een andere steen, en bij een Stap naar een buurvak.
pub const SPRONG_HOOGTE: f32 = 1.05;
pub const STAP_HOOGTE: f32 = 0.32;

/// Hoeveel seconden de klok van een hup hooguit loopt per beeld.
pub const MAX_BEELD: f32 = 0.05;

/// De klok van een hup (seconden) na een beeld waarvan Bevy zegt dat het `delta` seconden duurde.
///
/// `Time<Real>` loopt in de browser een beeld achter: het beeld waarin een Zet binnenkomt na een stilstaand bord (en wakker
/// wordt na ruim een halve seconde rust) krijgt een kleine `delta`, en het beeld daarna krijgt de hele rusttijd erbij. Op de
/// ruwe tijd was een hup van 0,25 s dan al klaar in het tweede beeld: de steen sprong van zijn vak naar het doelvak. Daarom
/// loopt de klok per beeld hooguit `MAX_BEELD` verder, ook als een beeld echt haperde.
pub fn klok_loopt(klok: f64, delta: f32) -> f64 {
    klok + f64::from(delta.clamp(0.0, MAX_BEELD))
}

/// Een steen onderweg.
#[derive(Debug, Clone, PartialEq)]
pub struct Huppel {
    /// De vakken van het pad, van het startvak tot het eindvak.
    punten: Vec<Vec2>,
    /// Hoe lang één hup duurt.
    hup_duur: f32,
}

/// Waar de steen is: boven welk punt van het bord en hoe hoog boven zijn rustplek.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Plek {
    pub over: Vec2,
    pub hoogte: f32,
}

impl Huppel {
    /// `None` als er geen pad is (minder dan twee punten) of de duur niet klopt.
    pub fn nieuw(punten: Vec<Vec2>, hup_duur: f32) -> Option<Huppel> {
        (punten.len() >= 2 && hup_duur > 0.0).then_some(Huppel { punten, hup_duur })
    }

    pub fn hups(&self) -> usize {
        self.punten.len() - 1
    }

    pub fn duur(&self) -> f32 {
        self.hups() as f32 * self.hup_duur
    }

    pub fn klaar(&self, t: f32) -> bool {
        t >= self.duur()
    }

    /// Waar de steen is na `t` seconden. Elke hup: zacht op gang en zacht neer over het bord,
    /// en tegelijk een boog omhoog. Een Sprong (twee vakken ver) gaat hoger dan een Stap.
    pub fn plek(&self, t: f32) -> Plek {
        let laatste = *self.punten.last().unwrap();
        if t >= self.duur() {
            return Plek {
                over: laatste,
                hoogte: 0.0,
            };
        }
        let t = t.max(0.0) / self.hup_duur;
        let i = (t.floor() as usize).min(self.hups() - 1);
        let f = t - i as f32;
        let (a, b) = (self.punten[i], self.punten[i + 1]);
        let langs = 0.5 - 0.5 * (PI * f).cos();
        let hoog = if a.distance(b) > 1.5 {
            SPRONG_HOOGTE
        } else {
            STAP_HOOGTE
        };
        Plek {
            over: a.lerp(b, langs),
            hoogte: hoog * (PI * f).sin(),
        }
    }
}

/// De schaduw van een steen op het bord: hoe groot en hoe donker, bij `hoogte` boven zijn rustplek.
/// Hoe hoger de steen, hoe groter en zachter de schaduw.
pub fn schaduw(hoogte: f32) -> (f32, f32) {
    let h = hoogte.max(0.0);
    (1.0 + 0.55 * h, 1.0 / (1.0 + 1.4 * h))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn keten() -> Huppel {
        // Een Sprong, nog een Sprong, dan klaar (zoals een Sprongketen).
        Huppel::nieuw(
            vec![
                Vec2::new(0.0, 0.0),
                Vec2::new(2.0, 0.0),
                Vec2::new(3.0, 1.732),
            ],
            0.25,
        )
        .unwrap()
    }

    #[test]
    fn begint_op_het_startvak_en_eindigt_op_het_eindvak() {
        let h = keten();
        assert_eq!(h.duur(), 0.5);
        assert_eq!(
            h.plek(0.0),
            Plek {
                over: Vec2::ZERO,
                hoogte: 0.0
            }
        );
        let eind = h.plek(0.5);
        assert_eq!(eind.over, Vec2::new(3.0, 1.732));
        assert_eq!(eind.hoogte, 0.0);
        assert!(h.klaar(0.5) && !h.klaar(0.49));
    }

    #[test]
    fn elke_hup_landt_op_een_vak_en_is_halverwege_het_hoogst() {
        let h = keten();
        let tussen = h.plek(0.25);
        assert!(tussen.over.distance(Vec2::new(2.0, 0.0)) < 1e-4);
        assert!(tussen.hoogte.abs() < 1e-4);
        let top = h.plek(0.125);
        assert!(top.over.distance(Vec2::new(1.0, 0.0)) < 1e-4);
        assert!((top.hoogte - SPRONG_HOOGTE).abs() < 1e-4);
        for k in 0..50 {
            let t = k as f32 / 50.0 * 0.25;
            assert!(h.plek(t).hoogte <= top.hoogte + 1e-5);
        }
    }

    #[test]
    fn beweegt_zonder_sprongen() {
        let h = keten();
        let mut vorig = h.plek(0.0);
        for k in 1..=200 {
            let p = h.plek(k as f32 / 200.0 * h.duur());
            assert!(p.over.distance(vorig.over) < 0.06, "{k}");
            assert!((p.hoogte - vorig.hoogte).abs() < 0.06, "{k}");
            vorig = p;
        }
    }

    #[test]
    fn een_stap_gaat_minder_hoog_dan_een_sprong() {
        let stap = Huppel::nieuw(vec![Vec2::ZERO, Vec2::new(1.0, 0.0)], 0.2).unwrap();
        assert!((stap.plek(0.1).hoogte - STAP_HOOGTE).abs() < 1e-4);
        const { assert!(STAP_HOOGTE < SPRONG_HOOGTE) };
    }

    /// De beelden na een Zet op een stilstaand bord, zoals gemeten in de filmstroken (12 november 2026): beeld 1 heeft een
    /// kleine `delta`, beeld 2 de hele rusttijd van ruim een halve seconde, daarna om de 17 ms.
    fn beelden_na_rust() -> Vec<f32> {
        let mut d = vec![0.001, 0.536];
        d.extend([0.017; 40]);
        d
    }

    #[test]
    fn na_een_stilstaand_bord_verspringt_de_steen_niet() {
        // Een Sprong (twee vakken ver) van 0,25 s.
        let h = Huppel::nieuw(vec![Vec2::ZERO, Vec2::new(2.0, 0.0)], 0.25).unwrap();
        let mut klok = 10.0;
        let begin = klok_loopt(klok, 0.001); // beeld 1: de Zet komt binnen, de hup begint
        klok = begin;
        let mut vorig = h.plek(0.0);
        let mut beelden = 0;
        for delta in beelden_na_rust().into_iter().skip(1) {
            klok = klok_loopt(klok, delta);
            let t = (klok - begin) as f32;
            if h.klaar(t) {
                break;
            }
            let p = h.plek(t);
            beelden += 1;
            assert!(
                p.over.distance(vorig.over) < 0.5,
                "beeld {beelden}: de steen sprong {} vak",
                p.over.distance(vorig.over)
            );
            vorig = p;
        }
        // Een hup van 0,25 s is op 17 ms per beeld meer dan tien beelden te zien, niet één.
        assert!(beelden >= 10, "maar {beelden} beelden onderweg");
    }

    #[test]
    fn een_haperend_beeld_slaat_niet_de_halve_hup_over() {
        assert_eq!(klok_loopt(1.0, 0.536), 1.0 + f64::from(MAX_BEELD));
        assert_eq!(klok_loopt(1.0, 0.017), 1.0 + f64::from(0.017_f32));
        assert_eq!(klok_loopt(1.0, -0.2), 1.0);
    }

    #[test]
    fn zonder_pad_geen_beweging() {
        assert!(Huppel::nieuw(vec![Vec2::ZERO], 0.2).is_none());
        assert!(Huppel::nieuw(vec![Vec2::ZERO, Vec2::X], 0.0).is_none());
    }

    #[test]
    fn schaduw_wordt_groter_en_lichter_in_de_lucht() {
        assert_eq!(schaduw(0.0), (1.0, 1.0));
        let (maat, donker) = schaduw(0.9);
        assert!(maat > 1.0 && donker < 1.0);
    }
}
