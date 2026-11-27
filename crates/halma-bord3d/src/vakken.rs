//! Waar de vakken van het Sterbord en het Vierkant bord liggen in de 3D-wereld.
//!
//! Eén eenheid is de afstand tussen twee buurvakken. Het bord ligt plat in het
//! xz-vlak, y wijst omhoog. Het midden van het bord is (0, 0).
//!
//! De web-app rekent met dezelfde eenheden (`schermPunt` in `spelers.ts`), maar met het
//! nulpunt ergens anders: `Indeling::midden` is waar het midden van het 3D-bord in de
//! web-app ligt. Zo komt een tik terug als plek op het bord van de web-app.

use glam::Vec2;
use halma_core::Board;
use std::f32::consts::{FRAC_PI_2, TAU};

/// Halve wortel 3: de afstand tussen twee rijen van het zeshoekige raster.
pub const RIJ: f32 = 0.866_025_4;

/// Aantal vakken per rij van het Vierkant bord.
pub const VIERKANT: i32 = 16;

/// Een vak (kolom, rij) van het Sterbord naar (x, z), zoals `schermPunt` in de web-app.
pub fn plek(kolom: i32, rij: i32) -> Vec2 {
    Vec2::new(kolom as f32 + rij as f32 / 2.0, rij as f32 * RIJ)
}

/// De plekken van alle vakken van het Sterbord, op vaknummer.
pub fn sterbord() -> Vec<Vec2> {
    let board = Board::star();
    (0..board.len())
        .map(|vak| {
            let (kolom, rij) = board.coords(vak);
            plek(kolom, rij)
        })
        .collect()
}

/// De plekken van alle vakken van het Vierkant bord, op vaknummer, rond het midden.
pub fn vierkant_bord() -> Vec<Vec2> {
    let board = Board::square();
    let half = (VIERKANT - 1) as f32 / 2.0;
    (0..board.len())
        .map(|vak| {
            let (kolom, rij) = board.coords(vak);
            Vec2::new(kolom as f32 - half, rij as f32 - half)
        })
        .collect()
}

/// Een bord: welke vorm, waar de vakken liggen, en waar het midden in de web-app ligt.
#[derive(Debug, Clone)]
pub struct Indeling {
    pub vierkant: bool,
    pub vakken: Vec<Vec2>,
    pub midden: Vec2,
}

impl Indeling {
    pub fn nieuw(vierkant: bool) -> Indeling {
        if vierkant {
            let half = (VIERKANT - 1) as f32 / 2.0;
            Indeling {
                vierkant,
                vakken: vierkant_bord(),
                midden: Vec2::splat(half),
            }
        } else {
            Indeling {
                vierkant,
                vakken: sterbord(),
                midden: Vec2::ZERO,
            }
        }
    }

    /// Een plek in de web-app naar de 3D-wereld.
    pub fn naar_3d(&self, p: Vec2) -> Vec2 {
        p - self.midden
    }

    /// Een plek in de 3D-wereld naar de web-app.
    pub fn naar_app(&self, p: Vec2) -> Vec2 {
        p + self.midden
    }

    /// De draaiing van de camera om naar `doel` te kijken (een plek in de 3D-wereld,
    /// bijvoorbeeld het midden van het doel van de Speler): de camera staat aan de
    /// andere kant, dus het doel ligt bovenaan het scherm.
    /// Het Vierkant bord kijkt recht langs een rand, niet schuin over een hoek.
    pub fn kijkhoek(&self, doel: Vec2) -> f32 {
        if doel.length() < 1e-3 {
            return 0.0;
        }
        let hoek = (-doel.x).atan2(-doel.y);
        if self.vierkant {
            // Een klein beetje erbij, zodat een hoek precies op 45 graden steeds dezelfde kant op valt.
            ((hoek + 1e-3) / FRAC_PI_2).round() * FRAC_PI_2
        } else {
            hoek.rem_euclid(TAU)
        }
    }

    /// Wat er bij overzicht in beeld moet passen: het bord tot net binnen de buitenkant van de rand
    /// (ontwerp 1b). Zoals in het prototype vult het bord zo de breedte; de voet en het messing beslag
    /// komen tot de rand van het scherm.
    pub fn rand(&self) -> Vec<Vec2> {
        crate::lak::veelhoek(
            self.vierkant,
            crate::lak::buitenkant_rand(self.vierkant) - 0.1,
        )
    }

    /// De buitenrand van het bord (voor de schaduw op de tafel).
    pub fn plank(&self) -> Vec<Vec2> {
        crate::lak::buitenrand(self.vierkant)
    }

    /// Het aantal Spelers dat bij een stand hoort: het kleinste aantal dat kan op dit bord en
    /// waar elke Speler in de stand bij past. `minstens`: wat er eerder al gezien is (een Speler
    /// die opgeeft, verdwijnt uit de stand). `None` zonder stenen.
    pub fn spelers(&self, stand: &[i32], minstens: usize) -> Option<usize> {
        let hoogste = stand.iter().copied().max().filter(|&s| s >= 0)? as usize + 1;
        let board = if self.vierkant {
            Board::square()
        } else {
            Board::star()
        };
        [2, 3, 4, 6]
            .into_iter()
            .find(|&n| n >= hoogste.max(minstens) && board.start_points(n).is_some())
    }

    /// Per Speler (vanaf 0) de plekken van zijn startvakken, bij `spelers` Spelers.
    pub fn thuis(&self, spelers: usize) -> Vec<Vec<Vec2>> {
        let board = if self.vierkant {
            Board::square()
        } else {
            Board::star()
        };
        board
            .start_points(spelers)
            .unwrap_or(&[])
            .iter()
            .map(|&punt| board.point(punt).iter().map(|&v| self.vakken[v]).collect())
            .collect()
    }
}

/// Het vak dat oplicht bij `zet_doel`: alleen een enkel doelvak (het doelvakje van een oefening in
/// de Speluitleg, taak 184). Het doel van een Potje (meer vakken) licht nooit op: dat zou een hint zijn.
/// `n`: het aantal vakken van het bord.
pub fn doelvakje(vakken: &[u32], n: usize) -> Option<usize> {
    match vakken {
        [v] => Some(*v as usize).filter(|v| *v < n),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sterbord_heeft_121_vakken_rond_het_midden() {
        let p = sterbord();
        assert_eq!(p.len(), 121);
        let som: Vec2 = p.iter().copied().sum();
        assert!(som.length() < 1e-3);
        // De punten van de ster liggen 4 wortel 3 van het midden.
        let verst = p.iter().map(|v| v.length()).fold(0.0, f32::max);
        assert!((verst - 4.0 * 3f32.sqrt()).abs() < 1e-3);
    }

    #[test]
    fn vierkant_bord_heeft_256_vakken_rond_het_midden() {
        let p = vierkant_bord();
        assert_eq!(p.len(), 256);
        let som: Vec2 = p.iter().copied().sum();
        assert!(som.length() < 1e-3);
        assert_eq!(p[0], Vec2::new(-7.5, -7.5));
        assert_eq!(p[255], Vec2::new(7.5, 7.5));
    }

    #[test]
    fn buurvakken_liggen_een_eenheid_uit_elkaar() {
        assert!((plek(0, 0).distance(plek(1, 0)) - 1.0).abs() < 1e-5);
        assert!((plek(0, 0).distance(plek(0, 1)) - 1.0).abs() < 1e-5);
        assert!((plek(0, 0).distance(plek(1, -1)) - 1.0).abs() < 1e-5);
    }

    #[test]
    fn spelers_en_hun_startvakken() {
        let ster = Indeling::nieuw(false);
        let mut stand = vec![-1; 121];
        assert_eq!(ster.spelers(&stand, 0), None);
        stand[0] = 1;
        assert_eq!(ster.spelers(&stand, 0), Some(2));
        stand[1] = 2;
        assert_eq!(ster.spelers(&stand, 0), Some(3));
        stand[2] = 4;
        assert_eq!(ster.spelers(&stand, 0), Some(6));
        // Wie eerder meedeed, telt nog mee.
        assert_eq!(ster.spelers(&[0, -1], 4), Some(4));
        // Het Vierkant bord kent alleen 2 of 4.
        let vierkant = Indeling::nieuw(true);
        assert_eq!(vierkant.spelers(&[2], 0), Some(4));
        // Startvakken: tien per Speler op het Sterbord, elk in een andere punt.
        let thuis = ster.thuis(6);
        assert_eq!(thuis.len(), 6);
        assert!(thuis.iter().all(|t| t.len() == 10));
        assert!(thuis[0][0].distance(thuis[1][0]) > 3.0);
        assert!(vierkant.thuis(2).iter().all(|t| t.len() == 19));
        assert!(vierkant.thuis(4).iter().all(|t| t.len() == 13));
    }

    #[test]
    fn plek_in_de_app_en_terug() {
        let bord = Indeling::nieuw(true);
        // Vak 17 is kolom 1, rij 1: in de web-app (1, 1).
        assert_eq!(bord.naar_app(bord.vakken[17]), Vec2::new(1.0, 1.0));
        assert_eq!(bord.naar_3d(Vec2::new(1.0, 1.0)), bord.vakken[17]);
    }

    #[test]
    fn kijkhoek_zet_het_doel_bovenaan() {
        let ster = Indeling::nieuw(false);
        // Doel bovenaan (kleine z): de camera staat aan de kant van +z, draaiing 0.
        assert!(ster.kijkhoek(Vec2::new(0.0, -5.0)).abs() < 1e-5);
        // Doel rechts (+x): de camera staat links.
        let h = ster.kijkhoek(Vec2::new(5.0, 0.0));
        assert!((h.sin() + 1.0).abs() < 1e-5, "{h}");
        // Vierkant bord: altijd een veelvoud van een kwartslag.
        let vierkant = Indeling::nieuw(true);
        for doel in [
            Vec2::new(-6.0, -6.0),
            Vec2::new(6.0, 6.0),
            Vec2::new(6.0, -6.0),
        ] {
            let h = vierkant.kijkhoek(doel);
            let kwart = h / FRAC_PI_2;
            assert!((kwart - kwart.round()).abs() < 1e-5, "{h}");
            // Het doel ligt aan de verre kant (niet aan de kant van de camera).
            let camera = Vec2::new(h.sin(), h.cos());
            assert!(camera.dot(doel) < 0.0, "{doel} {h}");
        }
    }

    #[test]
    fn alleen_een_enkel_doelvakje_licht_op() {
        assert_eq!(doelvakje(&[7], 121), Some(7));
        // Het doel van een Potje: tien vakken, niets licht op.
        assert_eq!(doelvakje(&[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 121), None);
        assert_eq!(doelvakje(&[], 121), None);
        // Een vak dat niet op dit bord bestaat.
        assert_eq!(doelvakje(&[121], 121), None);
    }
}
