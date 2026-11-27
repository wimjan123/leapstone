//! Spelregels van Halma. Alle regels staan hier, nergens anders.
//!
//! - `board`: vakken, buren en startpunten (Sterbord en Vierkant bord).
//! - `cijfers`: feiten over de borden voor "Leapstone in cijfers" (feature 313).
//! - `computer`: de Computerspeler.
//! - `game`: een Potje in gewoon Rust, voor de server.
//! - `puzzel`: de Dagelijkse puzzel op het Sterbord (maken, oplossen, Zetten controleren).
//! - Onderaan: `Potje` en `DagelijksePuzzel`, dunne lagen met simpele getallen en lijsten voor WebAssembly.

pub mod board;
pub mod cijfers;
pub mod computer;
pub mod game;
pub mod puzzel;

pub use board::Board;
pub use game::{Game, MoveError, PlayerState};

use wasm_bindgen::prelude::*;

/// Geeft het aantal vakken van het Sterbord.
#[wasm_bindgen]
pub fn sterbord_vakken() -> u32 {
    Board::star().len() as u32
}

/// Het pad van een Zet om te tonen, alleen voor de beweging op het scherm:
/// `[van, naar]` bij een stap, of elk vak van de Sprongketen. Leeg als de Zet niet kan.
/// `stand` is de stand vóór de Zet: per vak de Speler (vanaf 0) of -1. Keurt niets goed.
#[wasm_bindgen]
pub fn zet_pad(vierkant: bool, stand: Vec<i32>, van: u32, naar: u32) -> Vec<u32> {
    let board = if vierkant {
        Board::square()
    } else {
        Board::star()
    };
    let stenen: Vec<Option<usize>> = stand.into_iter().map(|p| usize::try_from(p).ok()).collect();
    game::move_path(&board, &stenen, van as usize, naar as usize)
        .unwrap_or_default()
        .into_iter()
        .map(|c| c as u32)
        .collect()
}

/// Een startgetal voor de Computerspeler, zodat elk Potje anders loopt.
#[cfg(target_arch = "wasm32")]
fn random_seed() -> u64 {
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = Math, js_name = random)]
        fn math_random() -> f64;
    }
    (math_random() * (u64::MAX as f64)) as u64
}

#[cfg(not(target_arch = "wasm32"))]
fn random_seed() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_or(1, |d| d.as_nanos() as u64)
}

/// Een Potje op het Sterbord of het Vierkant bord, voor gebruik vanuit JavaScript.
/// Spelers en vakken zijn gewone nummers (Spelers vanaf 0, vakken vanaf 0).
#[wasm_bindgen]
pub struct Potje {
    game: Game,
    rng: computer::Rng,
}

#[wasm_bindgen]
impl Potje {
    /// Start een Potje voor 2, 3, 4 of 6 Spelers. Gooit een fout bij een ander aantal.
    #[wasm_bindgen(constructor)]
    pub fn new(spelers: u32) -> Result<Potje, String> {
        Game::new_star(spelers as usize)
            .map(|game| Potje {
                game,
                rng: computer::Rng::new(random_seed()),
            })
            .ok_or_else(|| "een potje heeft 2, 3, 4 of 6 spelers".to_string())
    }

    /// Start een Potje op het Vierkant bord voor 2 of 4 Spelers.
    pub fn vierkant(spelers: u32) -> Result<Potje, String> {
        Game::new_square(spelers as usize)
            .map(|game| Potje {
                game,
                rng: computer::Rng::new(random_seed()),
            })
            .ok_or_else(|| "een potje op het vierkante bord heeft 2 of 4 spelers".to_string())
    }

    /// Een Potje vanuit een stand van de server, alleen om de geldige bestemmingen te tonen.
    /// `stand` heeft per vak de Speler met een steen (vanaf 0) of -1 als het vak leeg is.
    pub fn van_stand(
        vierkant: bool,
        spelers: u32,
        stand: Vec<i32>,
        aan_de_beurt: u32,
    ) -> Result<Potje, String> {
        let board = if vierkant {
            Board::square()
        } else {
            Board::star()
        };
        let stenen = stand.into_iter().map(|p| usize::try_from(p).ok()).collect();
        Game::from_position(board, spelers as usize, stenen, aan_de_beurt as usize)
            .map(|game| Potje {
                game,
                rng: computer::Rng::new(random_seed()),
            })
            .ok_or_else(|| "die stand past niet bij het bord".to_string())
    }

    /// Plek van elk vak om te tekenen: [kolom0, rij0, kolom1, rij1, ...].
    pub fn vak_plekken(&self) -> Vec<i32> {
        let board = self.game.board();
        (0..board.len())
            .flat_map(|c| {
                let (q, r) = board.coords(c);
                [q, r]
            })
            .collect()
    }

    /// Per vak de Speler met een steen erop, of -1 als het vak leeg is.
    pub fn stand(&self) -> Vec<i32> {
        (0..self.game.board().len())
            .map(|c| self.game.stone_at(c).map_or(-1, |p| p as i32))
            .collect()
    }

    /// De vakken waar de steen op dit vak heen kan.
    pub fn geldige_bestemmingen(&self, vak: u32) -> Vec<u32> {
        self.game
            .destinations(vak as usize)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// De vakken waar de steen op dit vak met een Stap heen kan (de lege buurvakken).
    pub fn stappen(&self, vak: u32) -> Vec<u32> {
        self.game
            .step_destinations(vak as usize)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// Sprong voor Sprong: de vakken waar de steen die deze Zet op `van` begon, vanaf `huidige`
    /// met één Sprong kan landen, zonder de vakken in `bezocht` (het startvak telt altijd mee).
    /// Een Stap is geen Sprong: die staat in `stappen`.
    pub fn volgende_sprongen(&self, van: u32, huidige: u32, bezocht: Vec<u32>) -> Vec<u32> {
        let bezocht: Vec<usize> = bezocht.into_iter().map(|c| c as usize).collect();
        self.game
            .next_jumps(van as usize, huidige as usize, &bezocht)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// De Speler die aan de beurt is een Zet: de steen van `van` naar `naar`.
    /// Gooit een fout als de Zet niet mag.
    pub fn zet(&mut self, van: u32, naar: u32) -> Result<(), String> {
        self.game
            .make_move(van as usize, naar as usize)
            .map_err(|e| e.to_string())
    }

    /// De Zet die de Computerspeler kiest voor de Speler aan de beurt: [van, naar].
    /// `niveau`: 0 makkelijk, 1 normaal, 2 moeilijk. Voert de Zet niet uit.
    /// Gooit een fout als het Potje is afgelopen.
    pub fn computer_zet(&mut self, niveau: u32) -> Result<Vec<u32>, String> {
        computer::choose_move(
            &self.game,
            computer::Level::from_number(niveau),
            &mut self.rng,
        )
        .map(|(van, naar)| vec![van as u32, naar as u32])
        .ok_or_else(|| "er is geen zet te kiezen".to_string())
    }

    /// Een Speler geeft op.
    pub fn geef_op(&mut self, speler: u32) -> Result<(), String> {
        self.game.resign(speler as usize).map_err(|e| e.to_string())
    }

    /// Het aantal Spelers.
    pub fn aantal_spelers(&self) -> u32 {
        self.game.player_count() as u32
    }

    /// De Speler die aan de beurt is.
    pub fn aan_de_beurt(&self) -> u32 {
        self.game.current_player() as u32
    }

    /// De vakken van het doel van een Speler.
    pub fn doelvakken(&self, speler: u32) -> Vec<u32> {
        self.game
            .goal_cells(speler as usize)
            .iter()
            .map(|&c| c as u32)
            .collect()
    }

    /// Is het Potje afgelopen?
    pub fn is_afgelopen(&self) -> bool {
        self.game.is_over()
    }

    /// De winnaar, of -1 als er nog niemand klaar is.
    pub fn winnaar(&self) -> i32 {
        self.game.winner().map_or(-1, |p| p as i32)
    }

    /// Spelers in volgorde van winst (de winnaar eerst).
    pub fn ranglijst(&self) -> Vec<u32> {
        self.game.ranking().iter().map(|&p| p as u32).collect()
    }
}

/// De Dagelijkse puzzel van een datum, voor gebruik vanuit JavaScript. Werkt zonder internet:
/// dezelfde datum geeft op elke telefoon dezelfde puzzel.
/// Vakken zijn gewone nummers (vanaf 0, zoals bij `Potje`). In `stand` is 0 een Steen van de
/// Speler en 1 een grijze Steen die niet beweegt; `zet_pad` werkt ook met deze `stand`.
#[wasm_bindgen]
pub struct DagelijksePuzzel {
    puzzel: puzzel::Puzzel,
}

#[wasm_bindgen]
impl DagelijksePuzzel {
    /// De puzzel van een datum (jaar, maand van 1 tot 12, dag van de maand), in de eigen tijd
    /// van de Speler. Gooit een fout als de datum niet bestaat.
    #[wasm_bindgen(constructor)]
    pub fn new(jaar: i32, maand: u32, dag: u32) -> Result<DagelijksePuzzel, String> {
        puzzel::Puzzel::voor_datum(jaar, maand, dag)
            .map(|puzzel| DagelijksePuzzel { puzzel })
            .ok_or_else(|| "die datum bestaat niet".to_string())
    }

    /// Plek van elk vak om te tekenen: [kolom0, rij0, kolom1, rij1, ...], zoals `Potje`.
    pub fn vak_plekken(&self) -> Vec<i32> {
        let board = Board::star();
        (0..board.len())
            .flat_map(|c| {
                let (q, r) = board.coords(c);
                [q, r]
            })
            .collect()
    }

    /// Het Streefgetal: het aantal Zetten van de beste oplossing die de computer vond.
    pub fn streefgetal(&self) -> u32 {
        self.puzzel.streefgetal()
    }

    /// 0 voor een makkelijke puzzel, 1 voor een moeilijke.
    pub fn moeilijkheid(&self) -> u32 {
        match self.puzzel.moeilijkheid() {
            puzzel::Moeilijkheid::Makkelijk => 0,
            puzzel::Moeilijkheid::Moeilijk => 1,
        }
    }

    /// Per vak: 0 voor een Steen van de Speler, 1 voor een grijze Steen, -1 als het vak leeg is.
    pub fn stand(&self) -> Vec<i32> {
        self.puzzel
            .stand()
            .into_iter()
            .map(|s| s.map_or(-1, |p| p as i32))
            .collect()
    }

    /// De vakken van het doel: de punt bovenaan.
    pub fn doelvakken(&self) -> Vec<u32> {
        self.puzzel
            .doelvakken()
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// De vakken met een grijze Steen.
    pub fn grijze_vakken(&self) -> Vec<u32> {
        self.puzzel
            .grijze_vakken()
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// De vakken waar de Steen op dit vak heen kan. Leeg voor een grijze Steen of een leeg vak.
    pub fn geldige_bestemmingen(&self, vak: u32) -> Vec<u32> {
        self.puzzel
            .bestemmingen(vak as usize)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// De vakken waar de Steen op dit vak met een Stap heen kan.
    pub fn stappen(&self, vak: u32) -> Vec<u32> {
        self.puzzel
            .stappen(vak as usize)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// Sprong voor Sprong, zoals bij `Potje`.
    pub fn volgende_sprongen(&self, van: u32, huidige: u32, bezocht: Vec<u32>) -> Vec<u32> {
        let bezocht: Vec<usize> = bezocht.into_iter().map(|c| c as usize).collect();
        self.puzzel
            .volgende_sprongen(van as usize, huidige as usize, &bezocht)
            .into_iter()
            .map(|c| c as u32)
            .collect()
    }

    /// Een Zet: de Steen van `van` naar `naar`. Gooit een fout als de Zet niet mag, bijvoorbeeld
    /// bij een grijze Steen of als de puzzel al is opgelost.
    pub fn zet(&mut self, van: u32, naar: u32) -> Result<(), String> {
        self.puzzel
            .zet(van as usize, naar as usize)
            .map_err(|e| e.to_string())
    }

    /// Het aantal Zetten dat de Speler nu heeft gedaan.
    pub fn zetten(&self) -> u32 {
        self.puzzel.zetten()
    }

    /// Staan alle Stenen van de Speler in het doel?
    pub fn is_opgelost(&self) -> bool {
        self.puzzel.is_opgelost()
    }

    /// Opnieuw beginnen: dezelfde puzzel, de teller op 0.
    pub fn opnieuw(&mut self) {
        self.puzzel.opnieuw();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn potje_voor_javascript_werkt_met_gewone_getallen() {
        let mut potje = Potje::new(2).unwrap();
        assert!(Potje::new(5).is_err());
        assert_eq!(potje.stand().len(), 121);
        assert_eq!(potje.vak_plekken().len(), 242);
        assert_eq!(potje.winnaar(), -1);
        let van = (0..121u32)
            .find(|&c| potje.stand()[c as usize] == 0 && !potje.geldige_bestemmingen(c).is_empty())
            .unwrap();
        let naar = potje.geldige_bestemmingen(van)[0];
        potje.zet(van, naar).unwrap();
        assert_eq!(potje.aan_de_beurt(), 1);
        assert!(potje.zet(van, naar).is_err());
        let zet = potje.computer_zet(1).unwrap();
        assert_eq!(zet.len(), 2);
        assert!(potje.geldige_bestemmingen(zet[0]).contains(&zet[1]));
        potje.geef_op(1).unwrap();
        assert!(potje.computer_zet(1).is_err());
        assert!(potje.is_afgelopen());
        assert_eq!(potje.winnaar(), 0);
    }

    #[test]
    fn potje_vanuit_een_stand_geeft_dezelfde_bestemmingen() {
        let mut potje = Potje::new(2).unwrap();
        let van = (0..121u32)
            .find(|&c| potje.stand()[c as usize] == 0 && !potje.geldige_bestemmingen(c).is_empty())
            .unwrap();
        let naar = potje.geldige_bestemmingen(van)[0];
        potje.zet(van, naar).unwrap();
        let kopie = Potje::van_stand(false, 2, potje.stand(), potje.aan_de_beurt()).unwrap();
        assert_eq!(kopie.stand(), potje.stand());
        assert_eq!(kopie.aan_de_beurt(), 1);
        for c in 0..121u32 {
            assert_eq!(kopie.geldige_bestemmingen(c), potje.geldige_bestemmingen(c));
        }
        assert!(Potje::van_stand(false, 2, vec![-1; 5], 0).is_err());
        assert!(Potje::van_stand(true, 2, vec![-1; 256], 2).is_err());
        assert!(Potje::van_stand(true, 2, vec![5; 256], 0).is_err());
    }

    #[test]
    fn sprong_voor_sprong_komt_overeen_met_de_hele_keten() {
        // Elk eindvak van een keten van losse Sprongen is een geldige bestemming,
        // en elke bestemming is een Stap of het eindvak van zo'n keten.
        let mut potje = Potje::vierkant(2).unwrap();
        // Speel een paar Zetten zodat er Sprongen ontstaan.
        for _ in 0..30 {
            let z = potje.computer_zet(1).unwrap();
            potje.zet(z[0], z[1]).unwrap();
        }
        let mut sprongen_gezien = 0;
        for van in 0..256u32 {
            let bestemmingen = potje.geldige_bestemmingen(van);
            let stappen = potje.stappen(van);
            let mut bereikt: Vec<u32> = stappen.clone();
            let mut stapel = vec![(van, vec![van])];
            while let Some((nu, bezocht)) = stapel.pop() {
                for land in potje.volgende_sprongen(van, nu, bezocht.clone()) {
                    assert!(!bezocht.contains(&land));
                    sprongen_gezien += 1;
                    if !bereikt.contains(&land) {
                        bereikt.push(land);
                    }
                    let mut b = bezocht.clone();
                    b.push(land);
                    stapel.push((land, b));
                }
            }
            bereikt.sort_unstable();
            assert_eq!(bereikt, bestemmingen, "vak {van}");
        }
        assert!(sprongen_gezien > 0);
    }

    #[test]
    fn volgende_sprongen_slaat_bezochte_vakken_en_het_startvak_over() {
        // Twee stenen in een rij op een leeg stuk: 0 springt over 1 naar 2, en over 3 naar 4.
        let mut stand = vec![-1; 256];
        stand[17] = 0; // (1,1)
        stand[18] = 1; // (2,1)
        stand[19] = -1; // (3,1) leeg
        stand[20] = 1; // (4,1)
        stand[21] = -1; // (5,1)
        // Een tweede steen waarover terug gesprongen kan worden naar het startvak.
        let potje = Potje::van_stand(true, 2, stand, 0).unwrap();
        assert_eq!(potje.volgende_sprongen(17, 17, vec![17]), vec![19]);
        assert_eq!(potje.volgende_sprongen(17, 19, vec![17, 19]), vec![21]);
        // Terug naar het startvak mag niet, ook niet als `bezocht` het niet noemt.
        assert!(!potje.volgende_sprongen(17, 19, vec![]).contains(&17));
        // Een bezocht vak komt niet nog eens.
        assert!(potje.volgende_sprongen(17, 19, vec![17, 21]).is_empty());
        // Een Stap is geen Sprong.
        assert!(!potje.volgende_sprongen(17, 17, vec![17]).contains(&16));
        assert!(potje.stappen(17).contains(&16));
        assert!(!potje.stappen(17).contains(&18));
        // Het eindvak van de hele keten blijft een geldige Zet.
        assert!(potje.geldige_bestemmingen(17).contains(&21));
        // Geen steen op het startvak: niets.
        assert!(potje.volgende_sprongen(0, 0, vec![0]).is_empty());
        assert!(potje.stappen(0).is_empty());
    }

    #[test]
    fn zet_pad_geeft_elke_sprong_van_een_zet() {
        let potje = Potje::vierkant(2).unwrap();
        let stand = potje.stand();
        // Elke geldige Zet van Speler 1 heeft een pad dat bij van begint en bij naar eindigt.
        for van in (0..256u32).filter(|&c| stand[c as usize] == 0) {
            for naar in potje.geldige_bestemmingen(van) {
                let pad = zet_pad(true, stand.clone(), van, naar);
                assert!(pad.len() >= 2);
                assert_eq!((pad[0], *pad.last().unwrap()), (van, naar));
            }
        }
        assert!(zet_pad(true, stand.clone(), 0, 200).is_empty());
        assert!(zet_pad(false, stand, 0, 1).is_empty());
    }

    #[test]
    fn potje_op_het_vierkante_bord_geeft_rasterplekken() {
        assert!(Potje::vierkant(3).is_err());
        let mut potje = Potje::vierkant(2).unwrap();
        assert_eq!(potje.stand().len(), 256);
        let plekken = potje.vak_plekken();
        assert_eq!(plekken.len(), 512);
        assert_eq!(&plekken[0..4], &[0, 0, 1, 0]);
        assert_eq!(&plekken[510..], &[15, 15]);
        let zet = potje.computer_zet(1).unwrap();
        potje.zet(zet[0], zet[1]).unwrap();
        assert_eq!(potje.aan_de_beurt(), 1);
    }

    #[test]
    fn dagelijkse_puzzel_voor_javascript_werkt_met_gewone_getallen() {
        assert!(DagelijksePuzzel::new(2026, 2, 30).is_err());
        let mut p = DagelijksePuzzel::new(2026, 11, 12).unwrap();
        assert_eq!(p.stand().len(), 121);
        assert_eq!(p.vak_plekken().len(), 242);
        assert_eq!(p.doelvakken().len(), 10);
        assert!(p.streefgetal() >= 3);
        assert_eq!(p.zetten(), 0);
        assert!(!p.is_opgelost());
        // Een grijze Steen kan niet zetten, een eigen Steen wel.
        let stand = p.stand();
        let grijs = p.grijze_vakken()[0];
        assert_eq!(stand[grijs as usize], 1);
        assert!(p.geldige_bestemmingen(grijs).is_empty());
        assert!(p.zet(grijs, 0).is_err());
        let eigen = (0..121u32).find(|&c| stand[c as usize] == 0).unwrap();
        let naar = p.geldige_bestemmingen(eigen)[0];
        assert_eq!(zet_pad(false, stand, eigen, naar).first(), Some(&eigen));
        p.zet(eigen, naar).unwrap();
        assert_eq!(p.zetten(), 1);
        p.opnieuw();
        assert_eq!(p.zetten(), 0);
        assert_eq!(p.stand()[eigen as usize], 0);
        // Makkelijk en moeilijk wisselen per dag.
        let morgen = DagelijksePuzzel::new(2026, 11, 13).unwrap();
        assert_ne!(morgen.moeilijkheid(), p.moeilijkheid());
    }
}
