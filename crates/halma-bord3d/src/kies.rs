//! Welke pion een vinger op het scherm bedoelt.
//!
//! Een pion is hoog en de camera kijkt schuin. Een vinger op de kop ligt daarom op het scherm
//! een flink stuk boven het gaatje van de pion; een plek op het bord onder de vinger wijst dan
//! het vak erachter aan. Daarom meet dit op het scherm, tegen de omtrek van de pion zelf: van
//! de voet tot de kop, zoals hij nu staat (ook opgetild).
//!
//! - `eigen`: een pion van de Speler aan de beurt, met een ruime marge (een dikke vinger). Staat
//!   de vinger op een pion, dan die (de voorste als er meer zijn); anders de pion waarvan de as
//!   (voet tot kop) het dichtst bij de vinger is.
//! - `geraakt`: welke pion de vinger echt raakt, van welke Speler ook, met een kleine marge.
//!
//! Gewoon rekenwerk zonder Bevy. Schermplekken in CSS-pixels.

use crate::camera::Camera;
use crate::pion;
use glam::{Vec2, Vec3};

/// `geraakt`: een vinger staat pas echt op een pion als hij minstens dit deel van zijn straal (op het scherm) binnen de
/// omtrek staat. Op de rand bedoelt de Speler meestal het gat dat de pion half bedekt (taak 168: met een gekozen Steen
/// ging een tik net naast een leeg doelvak verloren aan de kop van een Steen ervoor). Een tik midden op een pion staat
/// ongeveer 0,9 straal erin.
pub const RAAK_DIEP: f32 = 0.4;


/// Een pion zoals hij nu staat.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Pion {
    pub vak: usize,
    pub speler: i32,
    /// Het midden van de onderkant, in de wereld.
    pub voet: Vec3,
}

/// Hoe een vinger tegenover een pion ligt.
#[derive(Debug, Clone, Copy)]
struct Maat {
    /// Hoe ver de vinger buiten de omtrek op het scherm ligt (px); negatief: op de pion.
    buiten: f32,
    /// Afstand van de vinger tot de as van voet tot kop op het scherm (px).
    as_afstand: f32,
    /// Afstand van de camera tot het midden van de pion: de kleinste staat vooraan.
    diepte: f32,
    /// De straal van de pion op het scherm (px), op halve hoogte.
    straal_px: f32,
}

/// De omtrek van een pion als stapel ronde plakken (hoogte, straal) langs zijn as.
#[derive(Debug, Clone)]
pub struct Wijzer {
    plakken: Vec<(f32, f32)>,
}

impl Default for Wijzer {
    fn default() -> Self {
        Self::nieuw()
    }
}

impl Wijzer {
    pub fn nieuw() -> Wijzer {
        let profiel = pion::profiel();
        const N: usize = 48;
        let plakken = (0..=N)
            .map(|i| {
                let y = pion::HOOGTE * i as f32 / N as f32;
                (y, pion::straal_op(&profiel, y))
            })
            .filter(|(_, r)| *r > 1e-3)
            .collect();
        Wijzer { plakken }
    }

    /// Hoe de vinger op `punt` tegenover de pion met deze voet ligt. Een ronde plak ziet er
    /// schuin bekeken uit als een ellips: zo breed als hij is, en platter naarmate de camera
    /// lager kijkt. Samen vormen de ellipsen de omtrek van de pion op het scherm.
    fn meet(&self, cam: &Camera, voet: Vec3, punt: Vec2) -> Option<Maat> {
        let oog = cam.oog();
        let onder = cam.naar_scherm(voet)?;
        let boven = cam.naar_scherm(voet + Vec3::Y * pion::HOOGTE)?;
        let langs = (boven - onder).try_normalize().unwrap_or(Vec2::NEG_Y);
        let dwars = langs.perp();
        let mut buiten = f32::INFINITY;
        for &(y, r) in &self.plakken {
            let c = voet + Vec3::Y * y;
            let (s, maat) = cam.naar_scherm_maat(c)?;
            let plat = (c - oog).normalize_or_zero().y.abs().max(0.05);
            let (a, b) = (r * maat, r * maat * plat);
            let d = punt - s;
            let l = d.length();
            let rand = if l < 1e-4 {
                l + b
            } else {
                let (x, z) = (d.dot(dwars) / l, d.dot(langs) / l);
                1.0 / ((x / a).powi(2) + (z / b).powi(2)).sqrt()
            };
            buiten = buiten.min(l - rand);
        }
        let as_afstand = {
            let ab = boven - onder;
            let t = ((punt - onder).dot(ab) / ab.length_squared().max(1e-6)).clamp(0.0, 1.0);
            punt.distance(onder + ab * t)
        };
        let midden = voet + Vec3::Y * (pion::HOOGTE / 2.0);
        let diepte = oog.distance(midden);
        let straal_px = pion::STRAAL * cam.naar_scherm_maat(midden)?.1;
        Some(Maat {
            buiten,
            as_afstand,
            diepte,
            straal_px,
        })
    }

    /// De pion die de vinger bedoelt uit `pionnen`, met `ruimte` pixels marge rond de omtrek.
    fn beste<'a>(
        &self,
        cam: &Camera,
        pionnen: impl Iterator<Item = &'a Pion>,
        punt: Vec2,
        ruimte: f32,
    ) -> Option<usize> {
        if !punt.is_finite() {
            return None;
        }
        let mut erop: Option<(f32, usize)> = None;
        let mut bij: Option<(f32, usize)> = None;
        for p in pionnen {
            let Some(m) = self.meet(cam, p.voet, punt) else {
                continue;
            };
            if m.buiten <= 0.0 {
                if erop.is_none_or(|(d, _)| m.diepte < d) {
                    erop = Some((m.diepte, p.vak));
                }
            } else if m.buiten <= ruimte && bij.is_none_or(|(d, _)| m.as_afstand < d) {
                bij = Some((m.as_afstand, p.vak));
            }
        }
        erop.or(bij).map(|(_, vak)| vak)
    }

    /// De pion van `speler` die een vinger op `punt` pakt, met `ruimte` pixels marge.
    pub fn eigen(
        &self,
        cam: &Camera,
        pionnen: &[Pion],
        punt: Vec2,
        speler: i32,
        ruimte: f32,
    ) -> Option<usize> {
        self.beste(
            cam,
            pionnen.iter().filter(|p| p.speler == speler),
            punt,
            ruimte,
        )
    }

    /// De pion (van wie ook) waar de vinger op `punt` echt op staat: minstens `RAAK_DIEP` van zijn straal binnen de
    /// omtrek, de voorste als het er meer zijn. Een vinger op de rand raakt geen pion; dan zegt het vak onder de vinger
    /// wat de Speler bedoelt (`kiesGewezen` in de web-app).
    pub fn geraakt(&self, cam: &Camera, pionnen: &[Pion], punt: Vec2) -> Option<usize> {
        if !punt.is_finite() {
            return None;
        }
        pionnen
            .iter()
            .filter_map(|p| self.meet(cam, p.voet, punt).map(|m| (m, p.vak)))
            .filter(|(m, _)| m.buiten <= -RAAK_DIEP * m.straal_px)
            .min_by(|(a, _), (b, _)| a.diepte.total_cmp(&b.diepte))
            .map(|(_, vak)| vak)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::camera::{AFSTAND_MIN, Venster};
    use crate::hand::OPTILLEN;
    use crate::vakken::Indeling;
    /// Een tik telt hier op ongeveer het midden van een Steen boven het bord.
    const MIK_HOOGTE: f32 = 0.2;
    const ZIT_DIEPTE: f32 = pion::ZAKT;

    const TELEFOON: Vec2 = Vec2::new(390.0, 844.0);

    fn overzicht(bord: &Indeling) -> Camera {
        let venster = Venster::met_vlak(TELEFOON, Vec2::new(0.0, 96.0), Vec2::new(390.0, 640.0));
        Camera::overzicht(venster, 0.0, &bord.rand(), bord.vierkant)
    }

    /// Helemaal ingezoomd boven het vak `vak`: de camera kijkt het schuinst.
    fn ingezoomd(bord: &Indeling, vak: usize) -> Camera {
        let mut cam = overzicht(bord);
        cam.afstand = AFSTAND_MIN;
        cam.doel = bord.vakken[vak];
        assert!(cam.zoom() > 0.99);
        cam
    }

    fn gedraaid(bord: &Indeling) -> Camera {
        let mut cam = overzicht(bord);
        cam.knijp(TELEFOON / 2.0, 2.0, 0.9);
        cam
    }

    /// De vakken van een kamp: de `n` vakken het dichtst bij `punt`.
    fn kamp(bord: &Indeling, punt: Vec2, n: usize) -> Vec<usize> {
        let mut v: Vec<usize> = (0..bord.vakken.len()).collect();
        v.sort_by(|a, b| {
            bord.vakken[*a]
                .distance(punt)
                .total_cmp(&bord.vakken[*b].distance(punt))
        });
        v.truncate(n);
        v
    }

    fn pion(bord: &Indeling, vak: usize, speler: i32, til: f32) -> Pion {
        let p = bord.vakken[vak];
        Pion {
            vak,
            speler,
            voet: Vec3::new(p.x, til - ZIT_DIEPTE, p.y),
        }
    }

    /// Een Sterbord met Speler 0 vooraan (dicht bij de camera) en Speler 1 achteraan.
    fn begin(bord: &Indeling) -> Vec<Pion> {
        let voor = kamp(bord, Vec2::new(0.0, 7.0), 10);
        let achter = kamp(bord, Vec2::new(0.0, -7.0), 10);
        voor.iter()
            .map(|&v| pion(bord, v, 0, 0.0))
            .chain(achter.iter().map(|&v| pion(bord, v, 1, 0.0)))
            .collect()
    }

    fn kop(cam: &Camera, p: &Pion) -> Vec2 {
        cam.naar_scherm(p.voet + Vec3::Y * (pion::HOOGTE - 0.1))
            .unwrap()
    }

    fn lijf(cam: &Camera, p: &Pion) -> Vec2 {
        cam.naar_scherm(p.voet + Vec3::Y * 0.3).unwrap()
    }

    #[test]
    fn de_kop_of_het_lijf_van_een_pion_pakt_die_pion_bij_elke_camera() {
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let stenen = begin(&bord);
        let midden = kamp(&bord, Vec2::new(0.0, 6.0), 1)[0];
        for (nr, cam) in [overzicht(&bord), ingezoomd(&bord, midden), gedraaid(&bord)]
            .into_iter()
            .enumerate()
        {
            for p in stenen.iter().filter(|p| p.speler == 0) {
                // Ingezoomd (42 graden) staat het lijf van een pion achter de pion ervoor: alleen de kop is te zien.
                let lijf = (nr != 1).then(|| lijf(&cam, p));
                for punt in [Some(kop(&cam, p)), lijf].into_iter().flatten() {
                    assert_eq!(w.eigen(&cam, &stenen, punt, 0, 24.0), Some(p.vak));
                    assert_eq!(w.geraakt(&cam, &stenen, punt), Some(p.vak));
                }
            }
        }
    }

    #[test]
    fn de_kop_van_een_opgetilde_pion_pakt_hem_ook_waar_het_bord_eronder_een_ander_vak_is() {
        // Zo ging het mis: een vinger op de kop van de gekozen (opgetilde) pion, naar het bord
        // gerekend, wees het vak erachter aan. Dan deed een tik een poging in plaats van loslaten.
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let vak = kamp(&bord, Vec2::ZERO, 1)[0];
        let cam = ingezoomd(&bord, vak);
        let p = pion(&bord, vak, 0, OPTILLEN);
        let punt = kop(&cam, &p);
        let onder = cam.grondpunt(punt, MIK_HOOGTE).unwrap();
        let dichtst = kamp(&bord, onder, 1)[0];
        assert_ne!(dichtst, vak, "de oude manier wees dit vak toch aan");
        assert_eq!(w.geraakt(&cam, &[p], punt), Some(vak));
        assert_eq!(w.eigen(&cam, &[p], punt, 0, 24.0), Some(vak));
    }

    #[test]
    fn een_vinger_een_paar_millimeter_naast_een_pion_pakt_hem_nog() {
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let vak = kamp(&bord, Vec2::ZERO, 1)[0];
        for cam in [overzicht(&bord), ingezoomd(&bord, vak)] {
            let p = pion(&bord, vak, 0, 0.0);
            // Rechts naast de breedste plek (de buik), 20 px verder.
            let buik = Vec3::Y * (pion::ZAKT + 0.19);
            let voet = cam.naar_scherm(p.voet + buik).unwrap();
            let rand = cam
                .naar_scherm(p.voet + buik + Vec3::X * pion::STRAAL)
                .unwrap();
            let naast = voet + (rand - voet) + (rand - voet).normalize() * 20.0;
            assert_eq!(w.eigen(&cam, &[p], naast, 0, 24.0), Some(vak));
            assert_eq!(w.eigen(&cam, &[p], naast, 0, 12.0), None);
            assert_eq!(w.geraakt(&cam, &[p], naast), None);
            // Ver weg: niets.
            let ver = voet + Vec2::new(0.0, 200.0);
            assert_eq!(w.eigen(&cam, &[p], ver, 0, 24.0), None);
        }
    }

    #[test]
    fn op_de_kop_van_een_pion_van_een_ander_ervoor_pakt_de_eigen_pion_erachter() {
        // Het Vierkant bord: twee buren op een lijn van de camera af, de ander vooraan.
        let bord = Indeling::nieuw(true);
        let w = Wijzer::nieuw();
        let achter = kamp(&bord, Vec2::new(0.5, 0.5), 1)[0];
        let voor = kamp(&bord, bord.vakken[achter] + Vec2::new(0.0, 1.0), 1)[0];
        let cam = ingezoomd(&bord, achter);
        let stenen = [pion(&bord, voor, 1, 0.0), pion(&bord, achter, 0, 0.0)];
        // Een punt op de kop van de voorste, aan de kant van de achterste: binnen 24 px van de achterste.
        let punt = cam
            .naar_scherm(stenen[0].voet + Vec3::new(0.0, pion::HOOGTE - 0.02, -0.25))
            .unwrap();
        // Dat punt ligt op de rand van de voorste (taak 168): `geraakt` telt hem niet, het vak onder de vinger beslist.
        assert_eq!(w.geraakt(&cam, &stenen, punt), None);
        assert_eq!(w.eigen(&cam, &stenen, punt, 0, 24.0), Some(achter));
        // Zijn beide van de Speler, dan de voorste: die zie je onder de vinger.
        let beide = [pion(&bord, voor, 0, 0.0), pion(&bord, achter, 0, 0.0)];
        assert_eq!(w.eigen(&cam, &beide, punt, 0, 24.0), Some(voor));
    }

    #[test]
    fn half_achter_een_andere_pion_pakt_de_vinger_de_pion_die_hij_ziet() {
        let bord = Indeling::nieuw(true);
        let w = Wijzer::nieuw();
        let achter = kamp(&bord, Vec2::new(0.5, 0.5), 1)[0];
        let voor = kamp(&bord, bord.vakken[achter] + Vec2::new(0.0, 1.0), 1)[0];
        let cam = ingezoomd(&bord, achter);
        let stenen = [pion(&bord, voor, 0, 0.0), pion(&bord, achter, 0, 0.0)];
        // De kop van de achterste steekt boven de voorste uit.
        let punt = cam
            .naar_scherm(stenen[1].voet + Vec3::Y * (pion::HOOGTE - 0.03))
            .unwrap();
        assert_eq!(w.eigen(&cam, &stenen, punt, 0, 24.0), Some(achter));
    }

    #[test]
    fn in_het_overzicht_tussen_twee_pionnen_wint_de_dichtste_as() {
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let a = kamp(&bord, Vec2::ZERO, 1)[0];
        let b = kamp(&bord, bord.vakken[a] + Vec2::new(1.0, 0.0), 1)[0];
        let cam = overzicht(&bord);
        let stenen = [pion(&bord, a, 0, 0.0), pion(&bord, b, 0, 0.0)];
        let (sa, sb) = (lijf(&cam, &stenen[0]), lijf(&cam, &stenen[1]));
        // Net naast het midden tussen de twee, onder de pionnen (niet erop).
        let onder = Vec2::new(0.0, 14.0);
        let dichter_bij_a = sa + (sb - sa) * 0.4 + onder;
        let dichter_bij_b = sa + (sb - sa) * 0.6 + onder;
        assert_eq!(w.eigen(&cam, &stenen, dichter_bij_a, 0, 24.0), Some(a));
        assert_eq!(w.eigen(&cam, &stenen, dichter_bij_b, 0, 24.0), Some(b));
    }

    #[test]
    fn een_leeg_vak_naast_een_pion_is_geen_raak() {
        // Met een gekozen pion moet een tik op het lege vak ernaast een poging blijven.
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let vak = kamp(&bord, Vec2::ZERO, 1)[0];
        let buur = kamp(&bord, bord.vakken[vak] + Vec2::new(1.0, 0.0), 1)[0];
        for cam in [overzicht(&bord), ingezoomd(&bord, vak)] {
            let p = pion(&bord, vak, 0, 0.0);
            let gat = bord.vakken[buur];
            let punt = cam.naar_scherm(Vec3::new(gat.x, 0.0, gat.y)).unwrap();
            assert_eq!(w.geraakt(&cam, &[p], punt), None);
        }
    }

    #[test]
    fn een_tik_op_een_leeg_gat_dat_een_pion_half_bedekt_raakt_die_pion_niet() {
        // Taak 168: een pion vóór het gat (dichter bij de camera) bedekt met zijn kop het onderste deel van
        // het gat op het scherm, nog meer als hij opgetild is (de gekozen Steen). Een vinger 30 tot 45 procent
        // van het gat richting die pion staat op de rand van de pion: dan bedoelt de Speler het gat.
        // Midden op het lijf of de kop blijft het de pion.
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let gat = kamp(&bord, Vec2::ZERO, 1)[0];
        let g = bord.vakken[gat];
        for (buur, til) in [(Vec2::new(0.5, 0.87), 0.0), (Vec2::new(0.5, 0.87), OPTILLEN), (Vec2::new(0.5, -0.87), 0.0)] {
            let vak = kamp(&bord, g + buur, 1)[0];
            for cam in [overzicht(&bord), ingezoomd(&bord, gat)] {
                let p = pion(&bord, vak, 0, til);
                let gs = cam.naar_scherm(Vec3::new(g.x, 0.0, g.y)).unwrap();
                let q = bord.vakken[vak];
                let qs = cam.naar_scherm(Vec3::new(q.x, 0.0, q.y)).unwrap();
                for f in [0.0, 0.3, 0.45] {
                    assert_eq!(w.geraakt(&cam, &[p], gs + (qs - gs) * f), None, "buur {buur} til {til} f {f}");
                }
                assert_eq!(w.geraakt(&cam, &[p], lijf(&cam, &p)), Some(vak));
                assert_eq!(w.geraakt(&cam, &[p], kop(&cam, &p)), Some(vak));
            }
        }
    }

    #[test]
    fn naast_het_scherm_of_nan_is_niets() {
        let bord = Indeling::nieuw(false);
        let w = Wijzer::nieuw();
        let stenen = begin(&bord);
        let cam = overzicht(&bord);
        assert_eq!(w.eigen(&cam, &stenen, Vec2::NAN, 0, 24.0), None);
        assert_eq!(w.geraakt(&cam, &stenen, Vec2::new(-500.0, -500.0)), None);
    }
}
