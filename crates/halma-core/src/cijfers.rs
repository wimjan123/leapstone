//! Leapstone in cijfers (feature 313): feiten over de borden, uitgerekend met de regels van
//! deze crate. Elk getal heeft een test onderaan die het opnieuw uitrekent.
//!
//! - **Vakken en Stenen**: geteld op `Board` en in de beginstand van `Game`.
//! - **Langste Sprongketen** ([`langste_sprongketen`]): een Sprong gaat twee vakken in één
//!   richting, dus een springende Steen blijft op de vakken waarvan beide coördinaten dezelfde rest
//!   bij delen door 2 hebben als zijn startvak (vier klassen). Een Sprongketen is een pad zonder
//!   herhaling door de Sprong-graaf van zo'n klasse. Staat op elk middenvak van het pad een Steen en
//!   is de rest van de klasse leeg, dan kan de Steen dat hele pad in één Zet springen. De langste
//!   Sprongketen is dus het langste pad in die graaf; dat zoeken we exact.
//! - **Kortste oversteek** ([`Oversteek`]): het kleinste aantal Zetten waarmee één Speler alleen op
//!   het Sterbord alle 10 Stenen van zijn punt naar de tegenoverliggende punt brengt. Methode van
//!   G. I. Bell ("The shortest game of Chinese Checkers and related problems", Integers 9, 2009),
//!   maar op het volle Sterbord van 121 vakken (of Bell op het volle bord rekende, is niet nagelezen; de site noemt het daarom niet):
//!   - Zetten zijn omkeerbaar en de puntspiegeling door het midden van het bord ruilt begin en doel.
//!     Een oplossing van hooguit `2n` Zetten bestaat dus precies als er een stand `M` is die met
//!     zijn spiegelbeeld allebei binnen `n` Zetten van het begin ligt.
//!   - We zoeken breedte-eerst vanaf het begin. Standen die elkaars spiegelbeeld zijn over de
//!     middellijn van begin naar doel tellen als één (het begin is symmetrisch).
//!   - Voortgang: `p = -q` per Steen (het begin heeft `p` van -8 tot -5, het doel 5 tot 8), en
//!     `som` is de som over de Stenen (-60 aan het begin, +60 in het doel). Is `C` de hoogste `som`
//!     binnen `n` Zetten, dan heeft een ontmoeting `som >= -C`. Een stand die dat binnen de
//!     resterende Zetten niet meer kan halen ([`Oversteek::grens`], bewijs bij die functie) valt af.
//!   - `C` is pas na het zoeken bekend. Daarom zoeken we met een gekozen drempel `T`. Een weggesnoeide
//!     stand haalt hooguit `T - 1`, dus `C <= max(gevonden som, T - 1)`. We controleren achteraf
//!     `T <= -max(gevonden som, T - 1)` ([`Zoekuitslag::sluitend`]); anders zoeken we opnieuw met die
//!     grens als nieuwe `T`.

use crate::board::Board;
use crate::puzzel::{Raster, StandHash};
use std::collections::HashSet;
use std::hash::BuildHasherDefault;

// ---------------------------------------------------------------------------------------------
// Langste Sprongketen
// ---------------------------------------------------------------------------------------------

/// Het vak tussen `a` en `b` als `b` met één Sprong vanaf `a` te halen is (het middenvak).
pub fn middenvak(board: &Board, a: usize, b: usize) -> Option<usize> {
    (0..board.directions()).find_map(|d| {
        let m = board.neighbor(a, d)?;
        (board.neighbor(m, d)? == b).then_some(m)
    })
}

/// De langste Sprongketen in één Zet op `board`, als rij vakken: het startvak van de Steen en dan
/// elk vak waar hij landt. Het aantal Sprongen is de lengte min 1. Opzet: de andere Stenen mag je
/// overal neerzetten, één op elk middenvak. Exact: diepte-eerst over alle paden, met als
/// bovengrens het aantal vakken dat vanaf de huidige plek nog te bereiken is.
pub fn langste_sprongketen(board: &Board) -> Vec<usize> {
    let n = board.len();
    let sprongen: Vec<Vec<usize>> = (0..n)
        .map(|a| {
            (0..n)
                .filter(|&b| middenvak(board, a, b).is_some())
                .collect()
        })
        .collect();

    /// Het aantal onbezochte vakken dat vanaf `op` met Sprongen te bereiken is.
    fn bereikbaar(sprongen: &[Vec<usize>], bezocht: &[bool], op: usize) -> usize {
        let mut gezien = bezocht.to_vec();
        let mut stapel = vec![op];
        let mut aantal = 0;
        while let Some(v) = stapel.pop() {
            for &w in &sprongen[v] {
                if !gezien[w] {
                    gezien[w] = true;
                    aantal += 1;
                    stapel.push(w);
                }
            }
        }
        aantal
    }

    fn zoek(
        sprongen: &[Vec<usize>],
        pad: &mut Vec<usize>,
        bezocht: &mut Vec<bool>,
        beste: &mut Vec<usize>,
    ) {
        if pad.len() > beste.len() {
            *beste = pad.clone();
        }
        let op = *pad.last().unwrap();
        if pad.len() + bereikbaar(sprongen, bezocht, op) <= beste.len() {
            return;
        }
        for &w in &sprongen[op] {
            if !bezocht[w] {
                bezocht[w] = true;
                pad.push(w);
                zoek(sprongen, pad, bezocht, beste);
                pad.pop();
                bezocht[w] = false;
            }
        }
    }

    let mut beste = Vec::new();
    for start in 0..n {
        let mut bezocht = vec![false; n];
        bezocht[start] = true;
        // Meer dan alle vakken die vanaf hier te bereiken zijn kan niet.
        if bereikbaar(&sprongen, &bezocht, start) < beste.len() {
            continue;
        }
        zoek(&sprongen, &mut vec![start], &mut bezocht, &mut beste);
    }
    beste
}

// ---------------------------------------------------------------------------------------------
// Kortste oversteek
// ---------------------------------------------------------------------------------------------

const VAKKEN: usize = 121;
/// Het hoogste `p` van een vak is 8; `p + 8` is de rij, van 0 tot 16.
const RIJEN: usize = 17;
/// Het aantal Stenen van één Speler op het Sterbord.
const STENEN: usize = 10;

type Verzameling = HashSet<u128, BuildHasherDefault<StandHash>>;

/// Wat [`Oversteek::zoek`] vond.
#[derive(Debug, Clone)]
pub struct Zoekuitslag {
    /// De drempel `T` waarmee gezocht is.
    pub drempel: i32,
    /// De hoogste `som` van een bewaarde stand binnen `n` Zetten. Gelijk aan `C` als de zoektocht
    /// [sluitend](Zoekuitslag::sluitend) is.
    pub hoogste_som: i32,
    /// Een kortste oplossing van hooguit `2n` Zetten, als die er is.
    pub even: Option<Vec<(usize, usize)>>,
    /// Een oplossing van `2n + 1` Zetten (of korter), als de gevonden standen er een geven.
    /// Niet volledig: alleen bedoeld om een oplossing te vinden, niet om iets uit te sluiten.
    pub oneven: Option<Vec<(usize, usize)>>,
    /// Het aantal standen per laag.
    pub lagen: Vec<usize>,
}

impl Zoekuitslag {
    /// Waar als de drempel klopt met de echte hoogste `C`, zodat `even` bewijst wat het zegt.
    /// De zoektocht ziet alleen standen boven de drempel. De echte hoogste som is dus de gevonden som,
    /// of een weggesnoeide stand met hooguit `drempel - 1`. Reken met de grootste van die twee,
    /// anders slaagt de controle ten onrechte als de drempel te hoog stond (council 2026-11-18).
    pub fn sluitend(&self) -> bool {
        self.drempel <= -self.hoogste_som.max(self.drempel - 1)
    }
}

/// Het Sterbord als bitsets, met de spiegelingen en de voortgang van elk vak.
pub struct Oversteek {
    raster: Raster,
    /// Spiegeling over de lijn van begin naar doel: `(q, r) -> (q, -q - r)`.
    spiegel: [u8; VAKKEN],
    /// Puntspiegeling door het midden: `(q, r) -> (-q, -r)`. Ruilt begin en doel.
    omkeer: [u8; VAKKEN],
    /// De vakken per rij `p + 8`.
    rij: [u128; RIJEN],
    /// `plafond[j]`: het `j`-de hoogste `p` van een vak op het bord (8, 7, 7, 6, ...).
    plafond: [i32; STENEN],
    /// De beginstand: punt 0, waar Speler 0 in een Potje van 2 begint.
    pub begin: u128,
    /// Het doel: punt 3, de tegenoverliggende punt.
    pub doel: u128,
}

impl Default for Oversteek {
    fn default() -> Self {
        Oversteek::nieuw()
    }
}

impl Oversteek {
    pub fn nieuw() -> Oversteek {
        let raster = Raster::nieuw();
        let board = Board::star();
        assert_eq!(board.len(), VAKKEN);
        let vak = |q: i32, r: i32| {
            (0..VAKKEN)
                .find(|&v| board.coords(v) == (q, r))
                .expect("spiegelbeeld ligt op het bord") as u8
        };
        let mut spiegel = [0u8; VAKKEN];
        let mut omkeer = [0u8; VAKKEN];
        let mut rij = [0u128; RIJEN];
        let mut ps = Vec::new();
        for v in 0..VAKKEN {
            let (q, r) = board.coords(v);
            spiegel[v] = vak(q, -q - r);
            omkeer[v] = vak(-q, -r);
            rij[(8 - q) as usize] |= 1u128 << v;
            ps.push(-q);
        }
        ps.sort_unstable_by(|a, b| b.cmp(a));
        let mut plafond = [0i32; STENEN];
        plafond.copy_from_slice(&ps[..STENEN]);
        let punt = |p: usize| board.point(p).iter().fold(0u128, |m, &v| m | 1u128 << v);
        let begin = punt(0);
        let doel = punt(board.opposite_point(0));
        assert_eq!(begin.count_ones() as usize, STENEN);
        Oversteek {
            raster,
            spiegel,
            omkeer,
            rij,
            plafond,
            begin,
            doel,
        }
    }

    fn beeld(x: u128, tabel: &[u8; VAKKEN]) -> u128 {
        let mut uit = 0u128;
        let mut rest = x;
        while rest != 0 {
            let v = rest.trailing_zeros() as usize;
            rest &= rest - 1;
            uit |= 1u128 << tabel[v];
        }
        uit
    }

    /// De vaste vorm van een stand: de kleinste van de stand en zijn spiegelbeeld.
    fn vast(&self, x: u128) -> u128 {
        x.min(Self::beeld(x, &self.spiegel))
    }

    /// De stand na een puntspiegeling: begin wordt doel.
    pub fn omgekeerd(&self, x: u128) -> u128 {
        Self::beeld(x, &self.omkeer)
    }

    /// De som van `p` over de Stenen: -60 aan het begin, +60 in het doel.
    pub fn som(&self, x: u128) -> i32 {
        (0..RIJEN)
            .map(|i| (i as i32 - 8) * (x & self.rij[i]).count_ones() as i32)
            .sum()
    }

    /// Hoeveel de `som` in `k` Zetten hooguit kan stijgen.
    ///
    /// Bewijs. Een Zet landt op hooguit `pmax + 1`, met `pmax` de voorste Steen op dat moment: een
    /// stap gaat één rij vooruit, en de laatste Sprong landt één rij voorbij de Steen waar hij
    /// overheen gaat. Dus de voorste Steen staat na `t` Zetten op hooguit `pmax0 + t`. Neem de
    /// Stenen die bewegen, met als eind-`p` van hoog naar laag `f_0 >= f_1 >= ...`. De bovenste
    /// `j + 1` Stenen hebben elk een andere laatste Zet; de vroegste daarvan is uiterlijk Zet
    /// `k - 1 - j` (geteld vanaf 0), dus `f_j <= pmax0 + 1 + (k - 1 - j)`. Ook ligt `f_j` niet hoger
    /// dan het `j`-de hoogste vak van het bord. De begin-`p` van `m` bewegende Stenen is samen
    /// minstens de som van de `m` laagste. De termen dalen, dus we tellen ze op zolang ze positief zijn.
    pub fn grens(&self, x: u128, k: usize) -> i32 {
        let mut laag = [0i32; STENEN];
        let mut n = 0;
        let mut pmax = -8;
        for (i, &rij) in self.rij.iter().enumerate() {
            let aantal = (x & rij).count_ones() as usize;
            for _ in 0..aantal {
                if n < STENEN {
                    laag[n] = i as i32 - 8;
                    n += 1;
                }
            }
            if aantal > 0 {
                pmax = i as i32 - 8;
            }
        }
        let mut totaal = 0;
        for j in 0..k.min(n) {
            let eind = (pmax + k as i32 - j as i32).min(self.plafond[j]);
            let winst = eind - laag[j];
            if winst <= 0 {
                break;
            }
            totaal += winst;
        }
        totaal
    }

    /// Alle standen na één Zet vanuit `x`.
    fn zetten(&self, x: u128, mut doe: impl FnMut(u128)) {
        let mut stenen = x;
        while stenen != 0 {
            let van = stenen.trailing_zeros() as usize;
            stenen &= stenen - 1;
            let mut naar = self.raster.bestemmingen(x, van);
            while naar != 0 {
                let n = naar.trailing_zeros();
                naar &= naar - 1;
                doe(x ^ (1u128 << van) ^ (1u128 << n));
            }
        }
    }

    /// Breedte-eerst vanaf het begin, `n` lagen, in vaste vorm en gesorteerd. Een stand valt af als
    /// hij in de Zetten tot laag `n` geen `som >= drempel` meer kan halen.
    fn lagen(&self, n: usize, drempel: i32) -> Vec<Vec<u128>> {
        let mut lagen: Vec<Vec<u128>> = vec![vec![self.vast(self.begin)]];
        let draden = std::thread::available_parallelism().map_or(1, |d| d.get());
        for i in 0..n {
            let rest = n - i - 1;
            let deze = &lagen[i];
            let leeg = Vec::new();
            let vorige = if i > 0 { &lagen[i - 1] } else { &leeg };
            let stuk = deze.len().div_ceil(draden).max(1);
            let delen: Vec<Vec<u128>> = std::thread::scope(|s| {
                let taken: Vec<_> = deze
                    .chunks(stuk)
                    .map(|deel| {
                        s.spawn(move || {
                            let mut gezien = Verzameling::default();
                            for &x in deel {
                                self.zetten(x, |y| {
                                    if self.som(y) + self.grens(y, rest) < drempel {
                                        return;
                                    }
                                    let y = self.vast(y);
                                    if deze.binary_search(&y).is_err()
                                        && vorige.binary_search(&y).is_err()
                                    {
                                        gezien.insert(y);
                                    }
                                });
                            }
                            gezien.into_iter().collect::<Vec<u128>>()
                        })
                    })
                    .collect();
                taken.into_iter().map(|t| t.join().unwrap()).collect()
            });
            let mut nieuw: Vec<u128> = delen.into_iter().flatten().collect();
            nieuw.sort_unstable();
            nieuw.dedup();
            lagen.push(nieuw);
        }
        lagen
    }

    /// De rij standen van het begin naar `x`, als de vaste vorm van `x` in laag `i` staat.
    fn pad_naar(&self, lagen: &[Vec<u128>], x: u128, i: usize) -> Vec<u128> {
        let mut pad = vec![x];
        let mut nu = x;
        for laag in lagen[..i].iter().rev() {
            let mut vorige = None;
            self.zetten(nu, |y| {
                if vorige.is_none() && laag.binary_search(&self.vast(y)).is_ok() {
                    vorige = Some(y);
                }
            });
            nu = vorige.expect("elke stand komt uit de laag ervoor");
            pad.push(nu);
        }
        assert_eq!(nu, self.begin);
        pad.reverse();
        pad
    }

    fn laag_van(lagen: &[Vec<u128>], x: u128) -> Option<usize> {
        lagen.iter().position(|l| l.binary_search(&x).is_ok())
    }

    /// De Zetten van een oplossing die van het begin via `m` en `m2` (een Zet verder, of `m` zelf)
    /// naar het doel gaat. `m` staat in laag `i`, het spiegelbeeld van `m2` in laag `j`.
    fn oplossing(
        &self,
        lagen: &[Vec<u128>],
        m: u128,
        i: usize,
        m2: u128,
        j: usize,
    ) -> Vec<(usize, usize)> {
        let mut standen = self.pad_naar(lagen, m, i);
        let terug = self.pad_naar(lagen, self.omgekeerd(m2), j);
        if m2 != m {
            standen.push(m2);
        }
        standen.extend(terug.iter().rev().skip(1).map(|&x| self.omgekeerd(x)));
        assert_eq!(*standen.last().unwrap(), self.doel);
        standen
            .windows(2)
            .map(|w| {
                let van = (w[0] & !w[1]).trailing_zeros() as usize;
                let naar = (w[1] & !w[0]).trailing_zeros() as usize;
                (van, naar)
            })
            .collect()
    }

    /// Zoekt oplossingen van hooguit `2n` en `2n + 1` Zetten met drempel `drempel`.
    /// `even` is betrouwbaar als [`Zoekuitslag::sluitend`]: dan bewijst `None` dat er geen
    /// oplossing van `2n` Zetten of minder is.
    pub fn zoek(&self, n: usize, drempel: i32) -> Zoekuitslag {
        let lagen = self.lagen(n, drempel);
        let hoogste_som = lagen.iter().flatten().map(|&x| self.som(x)).max().unwrap();
        let kandidaten = || {
            lagen
                .iter()
                .enumerate()
                .flat_map(|(i, l)| l.iter().map(move |&x| (i, x)))
        };

        // Even: `m` en zijn spiegelbeeld liggen allebei binnen `n` Zetten. Kies de kortste.
        let mut even: Option<(usize, u128, usize)> = None;
        for (i, m) in kandidaten() {
            if self.som(m) < -hoogste_som {
                continue;
            }
            let terug = self.vast(self.omgekeerd(m));
            if let Some(j) = Self::laag_van(&lagen, terug)
                && even.is_none_or(|(t, _, _)| i + j < t)
            {
                even = Some((i + j, m, i));
            }
        }
        let even = even.map(|(t, m, i)| self.oplossing(&lagen, m, i, m, t - i));

        // Oneven: `m` en het spiegelbeeld van een stand één Zet verder.
        let mut oneven = None;
        'buiten: for (i, m) in kandidaten() {
            let mut raak = None;
            self.zetten(m, |m2| {
                if raak.is_none()
                    && let Some(j) = Self::laag_van(&lagen, self.vast(self.omgekeerd(m2)))
                {
                    raak = Some((m2, j));
                }
            });
            if let Some((m2, j)) = raak {
                oneven = Some(self.oplossing(&lagen, m, i, m2, j));
                break 'buiten;
            }
        }

        Zoekuitslag {
            drempel,
            hoogste_som,
            even,
            oneven,
            lagen: lagen.iter().map(Vec::len).collect(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::game::Game;

    /// Het aantal Stenen per Speler in de beginstand van een Potje.
    fn stenen_per_speler(game: &Game) -> Vec<usize> {
        (0..game.player_count())
            .map(|p| {
                (0..game.board().len())
                    .filter(|&v| game.stone_at(v) == Some(p))
                    .count()
            })
            .collect()
    }

    #[test]
    fn vakken_en_stenen_per_bord() {
        assert_eq!(Board::star().len(), 121);
        assert_eq!(Board::square().len(), 256);
        for spelers in [2, 3, 4, 6] {
            let game = Game::new_star(spelers).unwrap();
            assert_eq!(stenen_per_speler(&game), vec![10; spelers]);
        }
        assert_eq!(
            stenen_per_speler(&Game::new_square(2).unwrap()),
            vec![19; 2]
        );
        assert_eq!(
            stenen_per_speler(&Game::new_square(4).unwrap()),
            vec![13; 4]
        );
    }

    #[test]
    fn langste_sprongketen_op_het_sterbord_is_36_sprongen() {
        let board = Board::star();
        let pad = langste_sprongketen(&board);
        assert_eq!(pad.len() - 1, 36);

        // Speel de keten na in een Potje: één Steen op het startvak, een Steen van de ander op
        // elk middenvak, en de rest leeg.
        let mut stenen = vec![None; board.len()];
        stenen[pad[0]] = Some(0);
        for w in pad.windows(2) {
            stenen[middenvak(&board, w[0], w[1]).unwrap()] = Some(1);
        }
        assert_eq!(stenen.iter().flatten().count(), 1 + 36);
        let game = Game::from_position(board, 6, stenen, 0).unwrap();
        let mut bezocht = Vec::new();
        for w in pad.windows(2) {
            assert!(game.next_jumps(pad[0], w[0], &bezocht).contains(&w[1]));
            bezocht.push(w[1]);
        }
        assert!(game.destinations(pad[0]).contains(pad.last().unwrap()));
    }

    #[test]
    fn langste_sprongketen_haalt_de_bovengrens_op_het_vierkant_bord() {
        // Controle van de zoeker op een bord waar het antwoord vaststaat: op het Vierkant bord is
        // elke klasse een raster van 8 bij 8 met acht richtingen, en daarin gaat een slang langs
        // alle 64 vakken. Langer kan niet. (Geen feit voor de pagina: die keten vraagt meer
        // Stenen dan een Potje op het Vierkant bord heeft.)
        let pad = langste_sprongketen(&Board::square());
        assert_eq!(pad.len(), 64);
    }

    /// De hoogste `som` die van `x` uit binnen `k` Zetten te halen is, door alles te proberen.
    fn hoogste_som(o: &Oversteek, x: u128, k: usize) -> i32 {
        let mut laag = vec![x];
        let mut beste = o.som(x);
        let mut gezien: Verzameling = laag.iter().copied().collect();
        for _ in 0..k {
            let mut volgende = Vec::new();
            for &y in &laag {
                o.zetten(y, |z| {
                    if gezien.insert(z) {
                        beste = beste.max(o.som(z));
                        volgende.push(z);
                    }
                });
            }
            laag = volgende;
        }
        beste
    }

    #[test]
    fn grens_is_nooit_lager_dan_wat_echt_kan() {
        let o = Oversteek::nieuw();
        // Het begin, en standen die er een paar Zetten vandaan liggen.
        let mut standen = vec![o.begin];
        let mut laag = vec![o.begin];
        for _ in 0..2 {
            let mut volgende = Vec::new();
            for &x in &laag {
                o.zetten(x, |y| volgende.push(y));
            }
            volgende.sort_unstable();
            volgende.dedup();
            standen.extend(volgende.iter().step_by(97));
            laag = volgende;
        }
        for &x in &standen {
            for k in 1..=3 {
                assert!(
                    hoogste_som(&o, x, k) - o.som(x) <= o.grens(x, k),
                    "grens te laag voor {x:#x} in {k} Zetten"
                );
            }
        }
    }

    #[test]
    fn zoeken_met_snoeien_vindt_dezelfde_hoogste_som_als_alles_proberen() {
        let o = Oversteek::nieuw();
        let n = 3;
        let echt = hoogste_som(&o, o.begin, n);
        let uitslag = o.zoek(n, echt);
        assert_eq!(uitslag.hoogste_som, echt);
        // In 6 of 7 Zetten kan het niet: de eerste Steen heeft al minstens 10 Zetten nodig.
        assert!(uitslag.even.is_none());
        assert!(uitslag.oneven.is_none());
    }

    /// De diepte (in Zetten vanaf het begin) van de zoektocht die 26 Zetten uitsluit.
    const ZOEKDIEPTE: usize = 13;

    /// Een oversteek van 27 Zetten, gevonden door `geen_oversteek_in_26_zetten`: (van, naar).
    const OVERSTEEK_27: [(usize, usize); 27] = [
        (32, 31),
        (55, 30),
        (45, 41),
        (41, 51),
        (22, 60),
        (20, 41),
        (19, 59),
        (59, 58),
        (34, 32),
        (44, 57),
        (21, 59),
        (31, 66),
        (66, 76),
        (33, 87),
        (32, 31),
        (31, 66),
        (51, 86),
        (30, 88),
        (76, 101),
        (41, 51),
        (51, 65),
        (58, 100),
        (60, 98),
        (59, 58),
        (58, 75),
        (57, 99),
        (66, 76),
    ];

    #[test]
    fn oversteek_alleen_in_27_zetten() {
        // Speler 0 alleen op het Sterbord; Speler 1 heeft geen Stenen en slaat elke beurt over.
        let o = Oversteek::nieuw();
        let board = Board::star();
        let stenen = (0..board.len())
            .map(|v| (o.begin >> v & 1 == 1).then_some(0))
            .collect();
        let mut game = Game::from_position(board, 2, stenen, 0).unwrap();
        for (i, &(van, naar)) in OVERSTEEK_27.iter().enumerate() {
            assert!(!game.is_over(), "al klaar na {i} Zetten");
            game.make_move(van, naar).unwrap();
            if !game.is_over() {
                game.skip_turn().unwrap();
            }
        }
        assert!(game.is_over());
        assert_eq!(game.winner(), Some(0));
    }

    /// Het getal bij `sleutel` in `web/regels/cijfers.json`, de getallen van /guides/chinese-checkers-by-the-numbers.
    fn pagina_getal(sleutel: &str) -> String {
        let json = include_str!("../../../web/regels/cijfers.json");
        let na = json
            .split(&format!("\"{sleutel}\":"))
            .nth(1)
            .unwrap_or_else(|| panic!("{sleutel} staat niet in cijfers.json"));
        na.split([',', '\n']).next().unwrap().trim().to_string()
    }

    #[test]
    fn cijfers_json_klopt() {
        // De getallen op de pagina komen uit web/regels/cijfers.json; hier staan ze naast wat de regels uitrekenen.
        let eis = |sleutel: &str, waarde: usize| {
            assert_eq!(pagina_getal(sleutel), waarde.to_string(), "{sleutel}");
        };
        eis("sterbord_vakken", Board::star().len());
        eis("vierkant_vakken", Board::square().len());
        eis("sterbord_stenen_per_speler", stenen_per_speler(&Game::new_star(2).unwrap())[0]);
        for spelers in [2, 3, 4, 6] {
            let totaal: usize = stenen_per_speler(&Game::new_star(spelers).unwrap()).iter().sum();
            eis(&format!("sterbord_stenen_{spelers}_spelers"), totaal);
        }
        for spelers in [2, 4] {
            let per_speler = stenen_per_speler(&Game::new_square(spelers).unwrap());
            eis(&format!("vierkant_stenen_per_speler_{spelers}_spelers"), per_speler[0]);
            eis(&format!("vierkant_stenen_{spelers}_spelers"), per_speler.iter().sum());
        }
        let pad = langste_sprongketen(&Board::star());
        eis("langste_sprongketen", pad.len() - 1);
        // De grootste klasse vakken waar een springende Steen op blijft (zelfde rest van beide coördinaten
        // bij delen door 2), zelf geteld; de keten gaat langs al die vakken (council 2026-11-18).
        let ster = Board::star();
        let mut klassen = [0usize; 4];
        for vak in 0..ster.len() {
            let (q, r) = ster.coords(vak);
            klassen[(q.rem_euclid(2) * 2 + r.rem_euclid(2)) as usize] += 1;
        }
        let grootste = *klassen.iter().max().unwrap();
        assert_eq!(pad.len(), grootste, "de langste keten gaat langs alle vakken van de grootste klasse");
        eis("grootste_klasse_vakken", grootste);
        // De oversteek van 27 Zetten wordt nagespeeld in `oversteek_alleen_in_27_zetten`; dat het niet in 26 kan bewijst
        // `geen_oversteek_in_26_zetten` (zwaar, `#[ignore]`).
        eis("oversteek_zetten", OVERSTEEK_27.len());
        eis("geen_oversteek_in_zetten", OVERSTEEK_27.len() - 1);
        // De zoektocht van `geen_oversteek_in_26_zetten` gaat ZOEKDIEPTE Zetten diep vanaf het begin: een oversteek in 2n Zetten raakt n.
        eis("zoekdiepte_zetten", ZOEKDIEPTE);
        assert_eq!(2 * ZOEKDIEPTE, OVERSTEEK_27.len() - 1);
    }

    /// Bewijst dat 26 Zetten niet genoeg is, en vindt een oplossing van 27. Zwaar: draai via boat
    /// (`cargo test -p halma-core --release geen_oversteek_in_26_zetten -- --ignored --nocapture`).
    #[test]
    #[ignore]
    fn geen_oversteek_in_26_zetten() {
        let o = Oversteek::nieuw();
        let mut drempel: i32 = std::env::var("OVERSTEEK_DREMPEL")
            .ok()
            .and_then(|t| t.parse().ok())
            .unwrap_or(-8);
        let n: usize = std::env::var("OVERSTEEK_N")
            .ok()
            .and_then(|t| t.parse().ok())
            .unwrap_or(ZOEKDIEPTE);
        let uitslag = loop {
            let begin = std::time::Instant::now();
            let uitslag = o.zoek(n, drempel);
            println!(
                "drempel {drempel}: hoogste som {}, lagen {:?}, {:?}",
                uitslag.hoogste_som,
                uitslag.lagen,
                begin.elapsed()
            );
            if uitslag.sluitend() {
                break uitslag;
            }
            // Zelfde bovengrens als in `sluitend()`, zodat de drempel bij elke mislukte poging daalt.
            drempel = -uitslag.hoogste_som.max(drempel - 1);
        };
        assert_eq!(uitslag.even, None, "een oversteek van 26 Zetten of minder");
        let oplossing = uitslag.oneven.expect("een oversteek van 27 Zetten");
        println!("oplossing: {oplossing:?}");
        assert_eq!(oplossing.len(), 27);
    }
}
