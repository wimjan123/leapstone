//! De Dagelijkse puzzel op het Sterbord: een paar Stenen van de Speler, een paar grijze Stenen
//! die niet bewegen, en het doel is de punt bovenaan. Het Streefgetal is het aantal Zetten van
//! de beste oplossing, en die oplossing vindt de computer zelf.
//!
//! - Dezelfde datum geeft overal en altijd dezelfde puzzel (geen klok, geen internet, geen
//!   toeval buiten de datum). Wie het maakproces verandert, verandert de puzzels van alle
//!   komende dagen; zie "Techniek" in `docs/plan.md`.
//! - Een puzzel wordt gemaakt door van een opgeloste stand terug te spelen met willekeurige
//!   Zetten (elke Zet kan terug, dus de puzzel is op te lossen) en daarna de kortste oplossing
//!   te zoeken. Dat zoeken is breedte-eerst van twee kanten tegelijk. Het Streefgetal is wat de
//!   zoeker vindt, niet het aantal teruggespeelde Zetten.
//!   Een kandidaat telt alleen als de Stenen ver van de punt beginnen, de kortste oplossing over een
//!   grijze Steen springt en stap voor stap duidelijk meer Zetten kost dan het Streefgetal.
//! - De regels van een Zet zijn dezelfde als in een gewoon Potje (stap of Sprongketen over elke
//!   steen); een grijze Steen telt mee als steen om overheen te springen, maar beweegt nooit.
//!   Een test vergelijkt ze met `game::destinations_on`.
//! - Een stand is een bitset in een `u128`: bit `v` is vak `v` van het Sterbord (121 vakken).

use crate::board::Board;
use std::collections::HashMap;
use std::hash::{BuildHasherDefault, Hasher};

/// Geen buur in deze richting.
const GEEN: u8 = u8::MAX;
/// Het aantal vakken van het Sterbord.
const VAKKEN: usize = 121;
/// Het aantal richtingen op het Sterbord.
const RICHTINGEN: usize = 6;
/// Het punt waar de Speler begint (onderaan, het punt van Speler 1 in een Potje van 2).
const START_PUNT: usize = 0;

/// Hoe moeilijk een puzzel is. De dagen wisselen: de ene dag makkelijk, de volgende moeilijk.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Moeilijkheid {
    Makkelijk,
    Moeilijk,
}

/// Waarom een Zet in de puzzel is geweigerd.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PuzzelFout {
    /// De puzzel is al opgelost.
    Opgelost,
    /// Dat vak bestaat niet.
    GeenVak,
    /// Op het startvak staat geen Steen van de Speler (leeg, of een grijze Steen).
    GeenEigenSteen,
    /// De Steen kan niet naar dat vak met een stap of Sprong.
    OngeldigeBestemming,
}

impl std::fmt::Display for PuzzelFout {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            PuzzelFout::Opgelost => "de puzzel is al opgelost",
            PuzzelFout::GeenVak => "dat vak bestaat niet",
            PuzzelFout::GeenEigenSteen => "op dat vak staat geen steen van de speler",
            PuzzelFout::OngeldigeBestemming => "de steen kan niet naar dat vak",
        })
    }
}

impl std::error::Error for PuzzelFout {}

// ---------------------------------------------------------------------------------------------
// Regels op bitsets
// ---------------------------------------------------------------------------------------------

/// De buren van het Sterbord als getallen, voor snelle Zetten op bitsets.
/// Ook gebruikt door `cijfers` voor de kortste oversteek.
pub(crate) struct Raster {
    buur: [[u8; RICHTINGEN]; VAKKEN],
    board: Board,
}

impl Raster {
    pub(crate) fn nieuw() -> Raster {
        let board = Board::star();
        let mut buur = [[GEEN; RICHTINGEN]; VAKKEN];
        for (v, rij) in buur.iter_mut().enumerate() {
            for (d, plek) in rij.iter_mut().enumerate() {
                if let Some(n) = board.neighbor(v, d) {
                    *plek = n as u8;
                }
            }
        }
        Raster { buur, board }
    }

    /// De vakken waar de Steen op `van` heen kan: een stap of een Sprongketen.
    /// `bezet` zijn alle Stenen op het bord, ook de Steen op `van` zelf.
    pub(crate) fn bestemmingen(&self, bezet: u128, van: usize) -> u128 {
        // De Steen die zet is weg van zijn vak: hij springt niet over zichzelf.
        let bezet = bezet & !(1u128 << van);
        let mut resultaat = 0u128;
        for &n in &self.buur[van] {
            if n != GEEN && bezet >> n & 1 == 0 {
                resultaat |= 1u128 << n;
            }
        }
        let mut bezocht = 1u128 << van;
        let mut stapel = [0u8; VAKKEN];
        let mut hoogte = 1;
        stapel[0] = van as u8;
        while hoogte > 0 {
            hoogte -= 1;
            let op = stapel[hoogte] as usize;
            for d in 0..RICHTINGEN {
                let over = self.buur[op][d];
                if over == GEEN || bezet >> over & 1 == 0 {
                    continue;
                }
                let land = self.buur[over as usize][d];
                if land == GEEN || bezet >> land & 1 != 0 || bezocht >> land & 1 != 0 {
                    continue;
                }
                bezocht |= 1u128 << land;
                resultaat |= 1u128 << land;
                stapel[hoogte] = land;
                hoogte += 1;
            }
        }
        resultaat
    }

    /// De vakken waar `van` met één Sprong heen kan vanaf `op`, zonder de vakken in `bezocht`.
    fn volgende_sprongen(&self, bezet: u128, van: usize, op: usize, bezocht: u128) -> u128 {
        let bezet = bezet & !(1u128 << van);
        let bezocht = bezocht | 1u128 << van;
        let mut resultaat = 0u128;
        for d in 0..RICHTINGEN {
            let over = self.buur[op][d];
            if over == GEEN || bezet >> over & 1 == 0 {
                continue;
            }
            let land = self.buur[over as usize][d];
            if land != GEEN && bezet >> land & 1 == 0 && bezocht >> land & 1 == 0 {
                resultaat |= 1u128 << land;
            }
        }
        resultaat
    }

    /// De vakken van een punt als bitset.
    fn punt(&self, punt: usize) -> u128 {
        self.board
            .point(punt)
            .iter()
            .fold(0u128, |m, &v| m | 1u128 << v)
    }
}

// ---------------------------------------------------------------------------------------------
// De oplosser: breedte-eerst van twee kanten
// ---------------------------------------------------------------------------------------------

/// Een snelle vaste hash voor stand-sleutels. Geen toeval: dezelfde invoer geeft overal
/// hetzelfde gedrag, en het is veel sneller dan de standaard hash voor `u128`.
#[derive(Default)]
pub(crate) struct StandHash(u64);

impl Hasher for StandHash {
    fn finish(&self) -> u64 {
        let h = self.0;
        h ^ (h >> 29)
    }
    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0.rotate_left(5) ^ b as u64).wrapping_mul(0x517c_c1b7_2722_0a95);
        }
    }
    fn write_u128(&mut self, i: u128) {
        let (laag, hoog) = (i as u64, (i >> 64) as u64);
        self.0 = (laag ^ hoog.rotate_left(31)).wrapping_mul(0x9E37_79B9_7F4A_7C15);
    }
}

type Kaart = HashMap<u128, (u128, u8), BuildHasherDefault<StandHash>>;

/// Alle manieren om `n` Stenen op de vakken van `doel` te zetten, als bitsets.
fn doelstanden(doel: u128, n: u32) -> Vec<u128> {
    let vakken: Vec<u32> = (0..VAKKEN as u32).filter(|&v| doel >> v & 1 == 1).collect();
    let mut uit = Vec::new();
    fn kies(vakken: &[u32], van: usize, nog: u32, nu: u128, uit: &mut Vec<u128>) {
        if nog == 0 {
            uit.push(nu);
            return;
        }
        for i in van..vakken.len() {
            if vakken.len() - i < nog as usize {
                break;
            }
            kies(vakken, i + 1, nog - 1, nu | 1u128 << vakken[i], uit);
        }
    }
    kies(&vakken, 0, n, 0, &mut uit);
    uit
}

/// Breidt een laag uit met alle Zetten van alle Stenen. Geeft de nieuwe laag en, als een
/// stand ook in `andere` staat, de kortste totale lengte met die stand.
fn breid_uit(
    raster: &Raster,
    grijs: u128,
    laag: &[u128],
    diepte: u8,
    deze: &mut Kaart,
    andere: &Kaart,
) -> (Vec<u128>, Option<(u32, u128)>) {
    let mut nieuw = Vec::new();
    let mut raak: Option<(u32, u128)> = None;
    for &stand in laag {
        let bezet = stand | grijs;
        let mut stenen = stand;
        while stenen != 0 {
            let van = stenen.trailing_zeros() as usize;
            stenen &= stenen - 1;
            let mut naar = raster.bestemmingen(bezet, van);
            while naar != 0 {
                let n = naar.trailing_zeros();
                naar &= naar - 1;
                let volgende = stand ^ (1u128 << van) ^ (1u128 << n);
                if deze.contains_key(&volgende) {
                    continue;
                }
                deze.insert(volgende, (stand, diepte + 1));
                nieuw.push(volgende);
                if let Some(&(_, d)) = andere.get(&volgende) {
                    let totaal = diepte as u32 + 1 + d as u32;
                    if raak.is_none_or(|(t, _)| totaal < t) {
                        raak = Some((totaal, volgende));
                    }
                }
            }
        }
    }
    (nieuw, raak)
}

/// De kortste oplossing van een stand, als die in hooguit `max_zetten` Zetten kan.
/// Elke Zet is `(van, naar)`. Een stand die al klaar is, geeft een lege lijst.
fn los_op(
    raster: &Raster,
    start: u128,
    grijs: u128,
    doel: u128,
    max_zetten: u32,
) -> Option<Vec<(u8, u8)>> {
    let n = start.count_ones();
    if start & doel != start && n > doel.count_ones() {
        return None;
    }
    let eind = doelstanden(doel, n);
    let mut heen: Kaart = Kaart::default();
    let mut terug: Kaart = Kaart::default();
    heen.insert(start, (start, 0));
    for &e in &eind {
        terug.insert(e, (e, 0));
    }
    if terug.contains_key(&start) {
        return Some(Vec::new());
    }
    let mut laag_heen = vec![start];
    let mut laag_terug = eind;
    let (mut d_heen, mut d_terug) = (0u32, 0u32);
    while d_heen + d_terug < max_zetten {
        let heen_uitbreiden = laag_heen.len() <= laag_terug.len();
        let raak = if heen_uitbreiden {
            let (nieuw, raak) =
                breid_uit(raster, grijs, &laag_heen, d_heen as u8, &mut heen, &terug);
            laag_heen = nieuw;
            d_heen += 1;
            raak
        } else {
            let (nieuw, raak) =
                breid_uit(raster, grijs, &laag_terug, d_terug as u8, &mut terug, &heen);
            laag_terug = nieuw;
            d_terug += 1;
            raak
        };
        if let Some((_, midden)) = raak {
            return Some(pad(start, midden, &heen, &terug));
        }
        if laag_heen.is_empty() || laag_terug.is_empty() {
            return None;
        }
    }
    None
}

/// Bouwt de Zetten van `start` via `midden` naar een opgeloste stand.
fn pad(start: u128, midden: u128, heen: &Kaart, terug: &Kaart) -> Vec<(u8, u8)> {
    let mut standen = vec![midden];
    let mut nu = midden;
    while nu != start {
        nu = heen[&nu].0;
        standen.push(nu);
    }
    standen.reverse();
    nu = midden;
    while terug[&nu].1 > 0 {
        nu = terug[&nu].0;
        standen.push(nu);
    }
    standen
        .windows(2)
        .map(|w| {
            let weg = w[0] & !w[1];
            let aan = w[1] & !w[0];
            (weg.trailing_zeros() as u8, aan.trailing_zeros() as u8)
        })
        .collect()
}

// ---------------------------------------------------------------------------------------------
// Het maken van een puzzel
// ---------------------------------------------------------------------------------------------

/// Een kleine vaste toevalsgenerator (splitmix64). Eigen code, zodat de puzzel van een datum
/// nooit verandert door een nieuwe versie van een pakket.
struct Toeval(u64);

impl Toeval {
    fn volgende(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }

    /// Een getal van 0 tot `n` (niet inbegrepen).
    fn onder(&mut self, n: usize) -> usize {
        (self.volgende() % n as u64) as usize
    }
}

/// Instellingen per moeilijkheid.
struct Instelling {
    /// Aantal Stenen van de Speler.
    stenen: usize,
    /// Aantal grijze Stenen.
    grijs: usize,
    /// Aantal willekeurige Zetten terug vanaf de opgeloste stand.
    terugzetten: u32,
    /// Het Streefgetal moet hierbinnen vallen (van, tot en met).
    streef: (u32, u32),
    /// Bij elke Zet terug: uit zoveel willekeurige bestemmingen kiest de verste.
    keuzes: usize,
    /// Elke Steen begint minstens zoveel vakken van de top van het doel af.
    afstand: i32,
    /// Stap voor stap kost minstens zoveel Zetten meer dan het Streefgetal.
    naief_extra: u32,
    /// Een Zet van de kortste oplossing is een Sprongketen van minstens zoveel Sprongen.
    keten: u32,
}

const MAKKELIJK: Instelling = Instelling {
    stenen: 3,
    grijs: 3,
    terugzetten: 6,
    streef: (4, 6),
    keuzes: 4,
    afstand: 6,
    naief_extra: 4,
    keten: 2,
};

const MOEILIJK: Instelling = Instelling {
    stenen: 3,
    grijs: 4,
    terugzetten: 10,
    streef: (7, 10),
    keuzes: 4,
    afstand: 6,
    naief_extra: 6,
    keten: 3,
};

/// Dagnummer van een datum (dagen sinds 1 januari 1970), of `None` als de datum niet bestaat.
pub fn dagnummer(jaar: i32, maand: u32, dag: u32) -> Option<i64> {
    if !(1..=9999).contains(&jaar) || !(1..=12).contains(&maand) || dag == 0 {
        return None;
    }
    let schrikkel = jaar % 4 == 0 && (jaar % 100 != 0 || jaar % 400 == 0);
    let lengte = match maand {
        2 if schrikkel => 29,
        2 => 28,
        4 | 6 | 9 | 11 => 30,
        _ => 31,
    };
    if dag > lengte {
        return None;
    }
    // Dagen sinds 1970-01-01 (algoritme van Howard Hinnant).
    let (j, m) = (jaar as i64 - (maand <= 2) as i64, maand as i64);
    let tijdperk = j.div_euclid(400);
    let jaar_van_tijdperk = j - tijdperk * 400;
    let dag_van_jaar = (153 * (if m > 2 { m - 3 } else { m + 9 }) + 2) / 5 + dag as i64 - 1;
    let dag_van_tijdperk =
        jaar_van_tijdperk * 365 + jaar_van_tijdperk / 4 - jaar_van_tijdperk / 100 + dag_van_jaar;
    Some(tijdperk * 146_097 + dag_van_tijdperk - 719_468)
}

/// Een Dagelijkse puzzel: de stand om mee te beginnen, de stand nu en het Streefgetal.
#[derive(Debug, Clone)]
pub struct Puzzel {
    moeilijkheid: Moeilijkheid,
    /// Stenen van de Speler bij het begin en nu, als bitset.
    start: u128,
    speler: u128,
    grijs: u128,
    doel: u128,
    streefgetal: u32,
    oplossing: Vec<(u8, u8)>,
    zetten: u32,
}

impl Puzzel {
    /// De Dagelijkse puzzel van een datum. `None` als de datum niet bestaat.
    /// Dezelfde datum geeft altijd dezelfde puzzel.
    pub fn voor_datum(jaar: i32, maand: u32, dag: u32) -> Option<Puzzel> {
        let nummer = dagnummer(jaar, maand, dag)?;
        let moeilijkheid = if nummer.rem_euclid(2) == 0 {
            Moeilijkheid::Makkelijk
        } else {
            Moeilijkheid::Moeilijk
        };
        Some(maak(nummer, moeilijkheid))
    }

    pub fn moeilijkheid(&self) -> Moeilijkheid {
        self.moeilijkheid
    }

    /// Het aantal Zetten van de beste oplossing die de computer vond.
    pub fn streefgetal(&self) -> u32 {
        self.streefgetal
    }

    /// Een oplossing met precies `streefgetal()` Zetten, als `(van, naar)`.
    pub fn oplossing(&self) -> Vec<(usize, usize)> {
        self.oplossing
            .iter()
            .map(|&(a, b)| (a as usize, b as usize))
            .collect()
    }

    /// De stand nu: per vak `Some(0)` voor een Steen van de Speler, `Some(1)` voor een grijze
    /// Steen, of `None`.
    pub fn stand(&self) -> Vec<Option<usize>> {
        (0..VAKKEN)
            .map(|v| {
                if self.speler >> v & 1 == 1 {
                    Some(0)
                } else if self.grijs >> v & 1 == 1 {
                    Some(1)
                } else {
                    None
                }
            })
            .collect()
    }

    /// De vakken van het doel (de punt bovenaan).
    pub fn doelvakken(&self) -> Vec<usize> {
        (0..VAKKEN).filter(|&v| self.doel >> v & 1 == 1).collect()
    }

    /// De grijze Stenen: ze staan vast.
    pub fn grijze_vakken(&self) -> Vec<usize> {
        (0..VAKKEN).filter(|&v| self.grijs >> v & 1 == 1).collect()
    }

    /// Het aantal Zetten dat de Speler nu heeft gedaan.
    pub fn zetten(&self) -> u32 {
        self.zetten
    }

    /// Staan alle Stenen van de Speler in het doel?
    pub fn is_opgelost(&self) -> bool {
        self.speler & !self.doel == 0
    }

    /// Terug naar het begin: de teller gaat op 0.
    pub fn opnieuw(&mut self) {
        self.speler = self.start;
        self.zetten = 0;
    }

    /// De vakken waar de Steen van de Speler op `van` heen kan. Leeg bij een leeg vak of een
    /// grijze Steen.
    pub fn bestemmingen(&self, van: usize) -> Vec<usize> {
        if van >= VAKKEN || self.speler >> van & 1 == 0 {
            return Vec::new();
        }
        let raster = Raster::nieuw();
        bits(raster.bestemmingen(self.speler | self.grijs, van))
    }

    /// De vakken waar de Steen op `van` met een stap heen kan (de lege buurvakken).
    pub fn stappen(&self, van: usize) -> Vec<usize> {
        if van >= VAKKEN || self.speler >> van & 1 == 0 {
            return Vec::new();
        }
        let raster = Raster::nieuw();
        let bezet = self.speler | self.grijs;
        bits(
            raster.buur[van]
                .iter()
                .filter(|&&n| n != GEEN && bezet >> n & 1 == 0)
                .fold(0u128, |m, &n| m | 1u128 << n),
        )
    }

    /// Sprong voor Sprong, zoals `Game::next_jumps`: de vakken waar de Steen die deze Zet op
    /// `van` begon, vanaf `huidige` met één Sprong kan landen, zonder de vakken in `bezocht`.
    pub fn volgende_sprongen(&self, van: usize, huidige: usize, bezocht: &[usize]) -> Vec<usize> {
        if van >= VAKKEN || huidige >= VAKKEN || self.speler >> van & 1 == 0 {
            return Vec::new();
        }
        let raster = Raster::nieuw();
        let bezocht = bezocht
            .iter()
            .filter(|&&v| v < VAKKEN)
            .fold(0u128, |m, &v| m | 1u128 << v);
        bits(raster.volgende_sprongen(self.speler | self.grijs, van, huidige, bezocht))
    }

    /// De Speler verzet een Steen van `van` naar `naar`. Een grijze Steen kan nooit zetten.
    pub fn zet(&mut self, van: usize, naar: usize) -> Result<(), PuzzelFout> {
        if self.is_opgelost() {
            return Err(PuzzelFout::Opgelost);
        }
        if van >= VAKKEN || naar >= VAKKEN {
            return Err(PuzzelFout::GeenVak);
        }
        if self.speler >> van & 1 == 0 {
            return Err(PuzzelFout::GeenEigenSteen);
        }
        let raster = Raster::nieuw();
        if raster.bestemmingen(self.speler | self.grijs, van) >> naar & 1 == 0 {
            return Err(PuzzelFout::OngeldigeBestemming);
        }
        self.speler ^= 1u128 << van | 1u128 << naar;
        self.zetten += 1;
        Ok(())
    }
}

/// De nummers van de gezette bits, van laag naar hoog.
fn bits(mut m: u128) -> Vec<usize> {
    let mut uit = Vec::new();
    while m != 0 {
        uit.push(m.trailing_zeros() as usize);
        m &= m - 1;
    }
    uit
}

/// Maakt de puzzel van een dagnummer. Probeert opeenvolgende kandidaten uit één vaste reeks
/// toeval tot het Streefgetal in het bereik van de moeilijkheid valt.
fn maak(nummer: i64, moeilijkheid: Moeilijkheid) -> Puzzel {
    let instelling = match moeilijkheid {
        Moeilijkheid::Makkelijk => &MAKKELIJK,
        Moeilijkheid::Moeilijk => &MOEILIJK,
    };
    maak_met(nummer, moeilijkheid, instelling)
}

fn maak_met(nummer: i64, moeilijkheid: Moeilijkheid, instelling: &Instelling) -> Puzzel {
    maak_telt(nummer, moeilijkheid, instelling).0
}

/// Maakt de puzzel en geeft ook het aantal kandidaten dat nodig was.
fn maak_telt(nummer: i64, moeilijkheid: Moeilijkheid, instelling: &Instelling) -> (Puzzel, u32) {
    let raster = Raster::nieuw();
    let doel = raster.punt(raster.board.opposite_point(START_PUNT));
    let doel_vakken = bits(doel);
    // De top van het doel, voor de afstand: de punt van de ster.
    let doel_hoek = *doel_vakken
        .iter()
        .max_by_key(|&&v| hex_afstand(raster.board.coords(v), (0, 0)))
        .expect("het doel heeft vakken");
    let hoek = raster.board.coords(doel_hoek);
    // Grijze Stenen staan in het midden van het bord (de zeshoek tussen de punten).
    let midden: Vec<usize> = (0..VAKKEN)
        .filter(|&v| hex_afstand(raster.board.coords(v), (0, 0)) <= 4)
        .collect();

    let mut toeval =
        Toeval((nummer as u64).wrapping_mul(0xD1B5_4A32_D192_ED03) ^ 0x4C45_4150_5354_4F4E);
    for poging in 1u32.. {
        // Grijze Stenen.
        let mut grijs = 0u128;
        while (grijs.count_ones() as usize) < instelling.grijs {
            grijs |= 1u128 << midden[toeval.onder(midden.len())];
        }
        // Stenen van de Speler in het doel.
        let mut speler = 0u128;
        while (speler.count_ones() as usize) < instelling.stenen {
            speler |= 1u128 << doel_vakken[toeval.onder(doel_vakken.len())];
        }
        // Terugspelen: steeds een Steen verzetten, liefst weg van het doel. Een Steen die nog te
        // dicht bij de top van het doel staat, komt eerst aan de beurt.
        let mut zetten_gedaan = 0;
        while zetten_gedaan < instelling.terugzetten {
            let dichtbij = bits(speler)
                .into_iter()
                .filter(|&v| hex_afstand(raster.board.coords(v), hoek) < instelling.afstand)
                .collect::<Vec<_>>();
            let kandidaten = if dichtbij.is_empty() {
                bits(speler)
            } else {
                dichtbij
            };
            let van = kandidaten[toeval.onder(kandidaten.len())];
            let naar = bits(raster.bestemmingen(speler | grijs, van));
            if naar.is_empty() {
                continue;
            }
            let mut kies = naar[toeval.onder(naar.len())];
            for _ in 1..instelling.keuzes {
                let ander = naar[toeval.onder(naar.len())];
                if hex_afstand(raster.board.coords(ander), hoek)
                    > hex_afstand(raster.board.coords(kies), hoek)
                {
                    kies = ander;
                }
            }
            speler ^= 1u128 << van | 1u128 << kies;
            zetten_gedaan += 1;
        }
        // Goedkope controles eerst, de zoeker als laatste.
        let ver_genoeg = bits(speler)
            .iter()
            .all(|&v| hex_afstand(raster.board.coords(v), hoek) >= instelling.afstand);
        if !ver_genoeg || speler & doel != 0 {
            continue;
        }
        let stappen = naief(&raster, speler, doel);
        if stappen < instelling.streef.0 + instelling.naief_extra {
            continue;
        }
        // Door het terugspelen bestaat er een oplossing van hooguit `terugzetten` Zetten.
        let Some(oplossing) = los_op(&raster, speler, grijs, doel, instelling.terugzetten) else {
            continue;
        };
        let streefgetal = oplossing.len() as u32;
        if !(instelling.streef.0..=instelling.streef.1).contains(&streefgetal)
            || stappen < streefgetal + instelling.naief_extra
        {
            continue;
        }
        let a = analyseer(&raster, speler, grijs, &oplossing);
        if !a.over_grijs || a.langste_keten < instelling.keten {
            continue;
        }
        return (
            Puzzel {
                moeilijkheid,
                start: speler,
                speler,
                grijs,
                doel,
                streefgetal,
                oplossing,
                zetten: 0,
            },
            poging,
        );
    }
    unreachable!("de reeks pogingen is oneindig")
}

/// Wat een oplossing doet: Sprongen en grijze Stenen.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Analyse {
    /// Het aantal Zetten dat een Sprong is (en dus geen stap).
    sprongzetten: u32,
    /// Springt een Zet over een grijze Steen?
    over_grijs: bool,
    /// Het grootste aantal Sprongen dat een Zet minstens nodig heeft.
    langste_keten: u32,
}

/// Een zoektocht naar Sprongketens van `van` naar `naar`.
struct Ketens<'a> {
    raster: &'a Raster,
    /// Alle Stenen behalve die op `van`.
    bezet: u128,
    grijs: u128,
    naar: usize,
    /// Het minste aantal Sprongen, en het minste als de keten over een grijze Steen gaat.
    kortste: Option<u32>,
    kortste_over_grijs: Option<u32>,
}

impl Ketens<'_> {
    fn zoek(&mut self, op: usize, bezocht: u128, over_grijs: bool, lengte: u32) {
        for d in 0..RICHTINGEN {
            let over = self.raster.buur[op][d];
            if over == GEEN || self.bezet >> over & 1 == 0 {
                continue;
            }
            let land = self.raster.buur[over as usize][d];
            if land == GEEN || self.bezet >> land & 1 != 0 || bezocht >> land & 1 != 0 {
                continue;
            }
            let nu_grijs = over_grijs || self.grijs >> over & 1 == 1;
            if land as usize == self.naar {
                let kort = |o: Option<u32>| Some(o.map_or(lengte + 1, |x| x.min(lengte + 1)));
                self.kortste = kort(self.kortste);
                if nu_grijs {
                    self.kortste_over_grijs = kort(self.kortste_over_grijs);
                }
            }
            self.zoek(land as usize, bezocht | 1u128 << land, nu_grijs, lengte + 1);
        }
    }
}

/// Het minste aantal Sprongen waarmee `van` op `naar` komt, en hoeveel als de keten over minstens
/// een grijze Steen moet gaan. `bezet` zijn alle Stenen, ook die op `van`.
fn ketens(
    raster: &Raster,
    bezet: u128,
    grijs: u128,
    van: usize,
    naar: usize,
) -> (Option<u32>, Option<u32>) {
    let mut k = Ketens {
        raster,
        bezet: bezet & !(1u128 << van),
        grijs,
        naar,
        kortste: None,
        kortste_over_grijs: None,
    };
    k.zoek(van, 1u128 << van, false, 0);
    (k.kortste, k.kortste_over_grijs)
}

/// Speelt een oplossing na en kijkt wat de Zetten doen.
fn analyseer(raster: &Raster, start: u128, grijs: u128, oplossing: &[(u8, u8)]) -> Analyse {
    let mut speler = start;
    let mut a = Analyse {
        sprongzetten: 0,
        over_grijs: false,
        langste_keten: 0,
    };
    for &(van, naar) in oplossing {
        let (van, naar) = (van as usize, naar as usize);
        let is_stap = raster.buur[van].iter().any(|&n| n as usize == naar);
        if !is_stap {
            a.sprongzetten += 1;
            let (alle, over) = ketens(raster, speler | grijs, grijs, van, naar);
            a.over_grijs |= over.is_some();
            a.langste_keten = a.langste_keten.max(alle.unwrap_or(0));
        }
        speler ^= 1u128 << van | 1u128 << naar;
    }
    a
}

/// Een ondergrens voor het aantal Zetten als je elke Steen stap voor stap naar het doel zet:
/// de kortste totale afstand als je de Stenen aan doelvakken koppelt. Grijze Stenen en andere
/// Stenen in de weg maken het alleen langer.
fn naief(raster: &Raster, speler: u128, doel: u128) -> u32 {
    let stenen = bits(speler);
    let vakken = bits(doel);
    fn koppel(
        raster: &Raster,
        stenen: &[usize],
        vakken: &[usize],
        gebruikt: u32,
        som: u32,
        beste: &mut u32,
    ) {
        let Some((&steen, rest)) = stenen.split_first() else {
            *beste = (*beste).min(som);
            return;
        };
        for (i, &vak) in vakken.iter().enumerate() {
            if gebruikt >> i & 1 == 1 {
                continue;
            }
            let d = hex_afstand(raster.board.coords(steen), raster.board.coords(vak)) as u32;
            if som + d < *beste {
                koppel(raster, rest, vakken, gebruikt | 1 << i, som + d, beste);
            }
        }
    }
    let mut beste = u32::MAX;
    koppel(raster, &stenen, &vakken, 0, 0, &mut beste);
    beste
}

/// Afstand tussen twee vakken op het zeshoekige raster (axiale coördinaten).
fn hex_afstand(a: (i32, i32), b: (i32, i32)) -> i32 {
    let (dq, dr) = (a.0 - b.0, a.1 - b.1);
    (dq.abs() + dr.abs() + (dq + dr).abs()) / 2
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::game::destinations_on;

    /// De komende 365 dagen vanaf 2026-11-12, met schrikkelgrens en jaarwissel.
    fn datums(aantal: i64) -> Vec<(i32, u32, u32)> {
        let begin = dagnummer(2026, 11, 12).unwrap();
        let mut uit = Vec::new();
        let (mut j, mut m, mut d) = (2026, 11, 12);
        for i in 0..aantal {
            assert_eq!(dagnummer(j, m, d), Some(begin + i));
            uit.push((j, m, d));
            let lengte = match m {
                2 if (j % 4 == 0 && j % 100 != 0) || j % 400 == 0 => 29,
                2 => 28,
                4 | 6 | 9 | 11 => 30,
                _ => 31,
            };
            if d < lengte {
                d += 1;
            } else if m < 12 {
                (m, d) = (m + 1, 1);
            } else {
                (j, m, d) = (j + 1, 1, 1);
            }
        }
        uit
    }

    /// De puzzels van de komende 365 dagen, eenmaal gemaakt voor alle tests samen.
    fn jaar() -> &'static Vec<((i32, u32, u32), Puzzel)> {
        static JAAR: std::sync::OnceLock<Vec<((i32, u32, u32), Puzzel)>> =
            std::sync::OnceLock::new();
        JAAR.get_or_init(|| {
            datums(365)
                .into_iter()
                .map(|(j, m, d)| ((j, m, d), Puzzel::voor_datum(j, m, d).unwrap()))
                .collect()
        })
    }

    #[test]
    fn dagnummer_klopt_en_weigert_onbestaande_datums() {
        assert_eq!(dagnummer(1970, 1, 1), Some(0));
        assert_eq!(dagnummer(1970, 1, 2), Some(1));
        assert_eq!(dagnummer(2000, 3, 1), Some(11_017));
        assert_eq!(dagnummer(2026, 11, 12), Some(20_769));
        assert_eq!(dagnummer(2024, 2, 29).map(|n| n + 1), dagnummer(2024, 3, 1));
        assert_eq!(dagnummer(2025, 2, 29), None);
        assert_eq!(dagnummer(2100, 2, 29), None);
        assert_eq!(dagnummer(2026, 13, 1), None);
        assert_eq!(dagnummer(2026, 0, 1), None);
        assert_eq!(dagnummer(2026, 4, 31), None);
        assert_eq!(dagnummer(2026, 4, 0), None);
        assert!(Puzzel::voor_datum(2026, 2, 30).is_none());
    }

    #[test]
    fn dezelfde_datum_geeft_dezelfde_puzzel() {
        for (j, m, d) in datums(20) {
            let a = Puzzel::voor_datum(j, m, d).unwrap();
            let b = Puzzel::voor_datum(j, m, d).unwrap();
            assert_eq!(a.stand(), b.stand());
            assert_eq!(a.streefgetal(), b.streefgetal());
            assert_eq!(a.oplossing(), b.oplossing());
            assert_eq!(a.moeilijkheid(), b.moeilijkheid());
        }
        // Een puzzel heeft een paar Stenen van de Speler.
        let p = Puzzel::voor_datum(2026, 11, 12).unwrap();
        assert!(p.stand().iter().flatten().filter(|&&s| s == 0).count() >= 3);
        // Verschillende dagen geven verschillende puzzels.
        let a = Puzzel::voor_datum(2026, 11, 12).unwrap().stand();
        let b = Puzzel::voor_datum(2026, 11, 14).unwrap().stand();
        assert_ne!(a, b);
    }

    #[test]
    fn elke_puzzel_van_het_komende_jaar_is_op_te_lossen_binnen_het_streefgetal() {
        for &((j, m, d), ref p) in jaar() {
            let mut p = p.clone();
            let doel = p.streefgetal();
            assert!(doel >= 1, "{j}-{m}-{d}");
            assert!(!p.is_opgelost(), "{j}-{m}-{d} begint al opgelost");
            let oplossing = p.oplossing();
            assert_eq!(oplossing.len() as u32, doel, "{j}-{m}-{d}");
            // Speel de oplossing van de computer na met de gewone regels van de puzzel.
            for (van, naar) in oplossing {
                p.zet(van, naar)
                    .unwrap_or_else(|e| panic!("{j}-{m}-{d}: {e}"));
            }
            assert!(p.is_opgelost(), "{j}-{m}-{d}");
            assert_eq!(p.zetten(), doel);
        }
    }

    #[test]
    fn het_streefgetal_is_het_kortste_aantal_zetten() {
        // Zoek op een andere manier (alleen vooruit, breedte-eerst) of er een kortere
        // oplossing is voor de makkelijke puzzels. Het Streefgetal is dan echt het minimum.
        let raster = Raster::nieuw();
        for (j, m, d) in datums(14) {
            let p = Puzzel::voor_datum(j, m, d).unwrap();
            if p.moeilijkheid() != Moeilijkheid::Makkelijk {
                continue;
            }
            let korter = los_op(&raster, p.start, p.grijs, p.doel, p.streefgetal() - 1);
            assert!(korter.is_none(), "{j}-{m}-{d} heeft een kortere oplossing");
            let precies = los_op(&raster, p.start, p.grijs, p.doel, p.streefgetal());
            assert_eq!(precies.map(|o| o.len() as u32), Some(p.streefgetal()));
        }
    }

    #[test]
    fn opeenvolgende_dagen_wisselen_tussen_makkelijk_en_moeilijk() {
        let mut vorige: Option<Moeilijkheid> = None;
        let (mut hoogste_makkelijk, mut laagste_moeilijk) = (0, u32::MAX);
        for &((j, m, d), ref p) in jaar() {
            if let Some(v) = vorige {
                assert_ne!(v, p.moeilijkheid(), "{j}-{m}-{d}");
            }
            vorige = Some(p.moeilijkheid());
            match p.moeilijkheid() {
                Moeilijkheid::Makkelijk => {
                    hoogste_makkelijk = hoogste_makkelijk.max(p.streefgetal())
                }
                Moeilijkheid::Moeilijk => laagste_moeilijk = laagste_moeilijk.min(p.streefgetal()),
            }
        }
        // Een moeilijke puzzel heeft echt een hoger Streefgetal dan een makkelijke.
        assert!(
            hoogste_makkelijk < laagste_moeilijk,
            "makkelijk tot {hoogste_makkelijk}, moeilijk vanaf {laagste_moeilijk}"
        );
    }

    #[test]
    fn grijze_stenen_bewegen_niet() {
        let mut p = Puzzel::voor_datum(2026, 11, 12).unwrap();
        let grijs = p.grijze_vakken();
        assert!(grijs.len() >= 2);
        let stand_voor = p.stand();
        for &g in &grijs {
            assert!(p.bestemmingen(g).is_empty());
            assert!(p.stappen(g).is_empty());
            for naar in 0..VAKKEN {
                assert_eq!(p.zet(g, naar), Err(PuzzelFout::GeenEigenSteen));
            }
        }
        assert_eq!(p.stand(), stand_voor);
        assert_eq!(p.zetten(), 0);
        // Na elke Zet van de oplossing staan de grijze Stenen nog op dezelfde plek.
        for (van, naar) in p.oplossing() {
            p.zet(van, naar).unwrap();
            assert_eq!(p.grijze_vakken(), grijs);
        }
        // Over een grijze Steen springen mag wel, en een Steen kan er niet op landen.
        let q = Puzzel::voor_datum(2026, 11, 13).unwrap();
        for van in 0..VAKKEN {
            for naar in q.bestemmingen(van) {
                assert!(!q.grijze_vakken().contains(&naar));
            }
        }
    }

    #[test]
    fn zetten_volgen_de_gewone_regels_van_een_potje() {
        // Op willekeurige standen geven de regels van de puzzel dezelfde bestemmingen als
        // `destinations_on` van een gewoon Potje.
        let raster = Raster::nieuw();
        let mut toeval = Toeval(7);
        for _ in 0..300 {
            let mut bezet = 0u128;
            let aantal = 8 + toeval.onder(30);
            while (bezet.count_ones() as usize) < aantal {
                bezet |= 1u128 << toeval.onder(VAKKEN);
            }
            let stenen: Vec<Option<usize>> = (0..VAKKEN)
                .map(|v| (bezet >> v & 1 == 1).then_some(0))
                .collect();
            for van in bits(bezet) {
                assert_eq!(
                    bits(raster.bestemmingen(bezet, van)),
                    destinations_on(&raster.board, &stenen, van),
                    "vak {van}"
                );
            }
        }
        // Stap, Sprong en Sprongketen op een kleine stand, met een grijze Steen als brug.
        let mut p = Puzzel::voor_datum(2026, 11, 12).unwrap();
        p.speler = 1u128 << 0;
        p.start = p.speler;
        p.grijs = 0;
        let buren: Vec<usize> = (0..6).filter_map(|d| raster.board.neighbor(0, d)).collect();
        assert_eq!(p.stappen(0), {
            let mut b = buren.clone();
            b.sort_unstable();
            b
        });
        // Een grijze Steen naast de Steen: springen kan, stappen naar dat vak niet.
        let over = buren[0];
        let dir = (0..6)
            .find(|&d| raster.board.neighbor(0, d) == Some(over))
            .unwrap();
        let land = raster.board.neighbor(over, dir).unwrap();
        p.grijs = 1u128 << over;
        assert!(!p.stappen(0).contains(&over));
        assert!(p.bestemmingen(0).contains(&land));
        assert_eq!(p.zet(0, over), Err(PuzzelFout::OngeldigeBestemming));
        assert_eq!(p.zet(0, 500), Err(PuzzelFout::GeenVak));
        assert_eq!(p.volgende_sprongen(0, 0, &[]), vec![land]);
        assert_eq!(p.volgende_sprongen(0, 0, &[land]), Vec::<usize>::new());
        p.zet(0, land).unwrap();
        assert_eq!(p.zetten(), 1);
        // Terug naar het begin zet de teller op 0.
        p.opnieuw();
        assert_eq!((p.zetten(), p.speler), (0, 1));
    }

    #[test]
    fn opgelost_is_alleen_als_alle_stenen_in_de_punt_bovenaan_staan() {
        let mut p = Puzzel::voor_datum(2026, 11, 12).unwrap();
        assert!(!p.is_opgelost());
        let doel = p.doelvakken();
        assert_eq!(doel.len(), 10);
        // De punt bovenaan is tegenover het punt waar een Potje van 2 Spelers begint.
        let potje = crate::Game::new_star(2).unwrap();
        assert_eq!(doel, {
            let mut v = potje.goal_cells(0).to_vec();
            v.sort_unstable();
            v
        });
        p.speler = doel.iter().take(3).fold(0u128, |m, &v| m | 1u128 << v);
        assert!(p.is_opgelost());
        assert_eq!(p.zet(doel[0], doel[5]), Err(PuzzelFout::Opgelost));
        p.speler = (1u128 << doel[0]) | (1u128 << 0);
        assert!(!p.is_opgelost());
    }

    #[test]
    fn maken_en_oplossen_van_een_puzzel_duurt_kort() {
        // Meting: hoeveel tijd maken plus oplossen van één puzzel kost. Het is een grove
        // bovengrens voor een trage machine; een debug-build is zelf al veel trager dan release.
        // In een release-build alle 365 dagen, in een debug-build een steekproef (tien keer zo traag).
        let stap = if cfg!(debug_assertions) { 12 } else { 1 };
        let dagen: Vec<_> = datums(365).into_iter().step_by(stap).collect();
        let start = std::time::Instant::now();
        let mut langste = std::time::Duration::ZERO;
        for (j, m, d) in &dagen {
            let t = std::time::Instant::now();
            let p = Puzzel::voor_datum(*j, *m, *d).unwrap();
            assert!(p.streefgetal() >= 1);
            langste = langste.max(t.elapsed());
        }
        let totaal = start.elapsed();
        println!(
            "puzzel maken en oplossen: gemiddeld {:?}, langste {:?} ({} puzzels)",
            totaal / dagen.len() as u32,
            langste,
            dagen.len()
        );
        // Onder een halve seconde in een release-build (op deze machine; een telefoon is trager,
        // zie "Techniek" in `docs/plan.md`), ruimer in een debug-build.
        let grens = if cfg!(debug_assertions) {
            std::time::Duration::from_secs(5)
        } else {
            std::time::Duration::from_millis(500)
        };
        assert!(langste < grens, "langste {langste:?}");
    }

    /// Hoeveel Zetten het kost als je elke Steen stap voor stap naar het doel zet: breedte-eerst
    /// zoeken met alleen stappen (geen Sprongen), de echte waarde in plaats van de ondergrens.
    fn alleen_stappen(raster: &Raster, start: u128, grijs: u128, doel: u128) -> Option<u32> {
        let mut gezien: HashMap<u128, u32> = HashMap::new();
        gezien.insert(start, 0);
        let mut laag = vec![start];
        let mut diepte = 0;
        while !laag.is_empty() {
            let mut nieuw = Vec::new();
            for stand in laag {
                if stand & !doel == 0 {
                    return Some(diepte);
                }
                for van in bits(stand) {
                    for &n in &raster.buur[van] {
                        if n == GEEN || (stand | grijs) >> n & 1 == 1 {
                            continue;
                        }
                        let volgende = stand ^ (1u128 << van) ^ (1u128 << n);
                        if gezien.insert(volgende, diepte + 1).is_none() {
                            nieuw.push(volgende);
                        }
                    }
                }
            }
            laag = nieuw;
            diepte += 1;
        }
        None
    }

    #[test]
    fn het_streefgetal_past_bij_de_moeilijkheid() {
        // Makkelijk is goed te doen (4 tot 6), moeilijk vraagt een lange oplossing (7 tot 10).
        for &((j, m, d), ref p) in jaar() {
            let streef = p.streefgetal();
            let bereik = match p.moeilijkheid() {
                Moeilijkheid::Makkelijk => 4..=6,
                Moeilijkheid::Moeilijk => 7..=10,
            };
            assert!(bereik.contains(&streef), "{j}-{m}-{d}: {streef}");
        }
    }

    #[test]
    fn de_kortste_oplossing_springt_ook_over_grijze_stenen() {
        let raster = Raster::nieuw();
        for &((j, m, d), ref p) in jaar() {
            let a = analyseer(&raster, p.start, p.grijs, &p.oplossing);
            assert!(a.sprongzetten >= 1, "{j}-{m}-{d} heeft geen Sprong");
            assert!(
                a.over_grijs,
                "{j}-{m}-{d} springt nergens over een grijze Steen"
            );
            let keten = match p.moeilijkheid() {
                Moeilijkheid::Makkelijk => MAKKELIJK.keten,
                Moeilijkheid::Moeilijk => MOEILIJK.keten,
            };
            assert!(
                a.langste_keten >= keten,
                "{j}-{m}-{d}: keten {}",
                a.langste_keten
            );
        }
    }

    #[test]
    fn de_stenen_beginnen_een_eind_van_de_punt_en_stap_voor_stap_kost_duidelijk_meer() {
        let raster = Raster::nieuw();
        let top = *bits(raster.punt(raster.board.opposite_point(START_PUNT)))
            .iter()
            .max_by_key(|&&v| hex_afstand(raster.board.coords(v), (0, 0)))
            .unwrap();
        for &((j, m, d), ref p) in jaar() {
            let ins = match p.moeilijkheid() {
                Moeilijkheid::Makkelijk => &MAKKELIJK,
                Moeilijkheid::Moeilijk => &MOEILIJK,
            };
            for v in bits(p.start) {
                let afstand = hex_afstand(raster.board.coords(v), raster.board.coords(top));
                assert!(
                    afstand >= ins.afstand,
                    "{j}-{m}-{d}: Steen op afstand {afstand}"
                );
            }
            assert_eq!(p.start & p.doel, 0, "{j}-{m}-{d}");
            let stap = naief(&raster, p.start, p.doel);
            assert!(
                stap >= p.streefgetal() + ins.naief_extra,
                "{j}-{m}-{d}: stap voor stap {stap}, Streefgetal {}",
                p.streefgetal()
            );
        }
        // Een echte zoektocht met alleen stappen (grijze Stenen in de weg) geeft minstens de
        // ondergrens, dus ook echt meer Zetten dan het Streefgetal.
        let stap = if cfg!(debug_assertions) { 90 } else { 30 };
        for (j, m, d) in datums(365).into_iter().step_by(stap) {
            let p = Puzzel::voor_datum(j, m, d).unwrap();
            let echt = alleen_stappen(&raster, p.start, p.grijs, p.doel).expect("stappen kunnen");
            assert!(echt >= naief(&raster, p.start, p.doel), "{j}-{m}-{d}");
            assert!(
                echt > p.streefgetal() + 2,
                "{j}-{m}-{d}: {echt} tegen {}",
                p.streefgetal()
            );
        }
    }
}
