//! Het bord: vakken, buren en de punten waar stenen beginnen.
//!
//! De spelregels in `game.rs` kennen alleen vakken, richtingen en punten.
//! Het Vierkant bord (`Board::square()`) is een tweede constructor naast
//! `Board::star()`; de spelregels blijven dezelfde.

/// De zes richtingen op een zeshoekig raster (axiale coördinaten).
const STAR_DIRECTIONS: [(i32, i32); 6] = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, -1), (-1, 1)];

/// De acht richtingen op een vierkant raster (kolom, rij): recht en schuin.
const SQUARE_DIRECTIONS: [(i32, i32); 8] = [
    (1, 0),
    (-1, 0),
    (0, 1),
    (0, -1),
    (1, 1),
    (-1, -1),
    (1, -1),
    (-1, 1),
];

/// Zijde van het Vierkant bord.
const SQUARE_SIZE: i32 = 16;

/// Rijlengtes van een kamp: 19 stenen bij 2 Spelers, 13 bij 4 Spelers.
const CAMP_19: [i32; 5] = [5, 5, 4, 3, 2];
const CAMP_13: [i32; 4] = [4, 4, 3, 2];

/// Een bord met vakken, buren en startpunten.
#[derive(Debug, Clone)]
pub struct Board {
    /// Plek van elk vak als (kolom, rij), voor het tekenen.
    coords: Vec<(i32, i32)>,
    /// `neighbors[vak][richting]`: het vak ernaast in die richting, als dat bestaat.
    /// Een Sprong gaat twee keer in dezelfde richting.
    neighbors: Vec<Vec<Option<usize>>>,
    /// De punten waar stenen beginnen. Het tegenoverliggende punt is `opposite[i]`.
    points: Vec<Vec<usize>>,
    opposite: Vec<usize>,
    /// Welke punten bij welk aantal spelers horen: `(aantal spelers, punten)`.
    seatings: Vec<(usize, Vec<usize>)>,
}

impl Board {
    /// Het Sterbord: 121 vakken, zes punten van 10 vakken.
    pub fn star() -> Board {
        // Zespuntige ster = twee driehoeken. Met s = -q-r zijn dat
        // alle vakken met q, r, s >= -4, plus alle vakken met q, r, s <= 4.
        let in_star = |q: i32, r: i32| {
            let s = -q - r;
            [q, r, s].iter().all(|&x| x >= -4) || [q, r, s].iter().all(|&x| x <= 4)
        };
        let mut coords = Vec::new();
        for r in -8..=8 {
            for q in -8..=8 {
                if in_star(q, r) {
                    coords.push((q, r));
                }
            }
        }
        let index = |q: i32, r: i32| coords.iter().position(|&c| c == (q, r));
        let neighbors = coords
            .iter()
            .map(|&(q, r)| {
                STAR_DIRECTIONS
                    .iter()
                    .map(|&(dq, dr)| index(q + dq, r + dr))
                    .collect()
            })
            .collect();

        // De zes punten, in volgorde rond de ster. Punt i staat tegenover punt i + 3.
        let point_tests: [fn(i32, i32, i32) -> bool; 6] = [
            |q, _, _| q >= 5,
            |_, _, s| s <= -5,
            |_, r, _| r >= 5,
            |q, _, _| q <= -5,
            |_, _, s| s >= 5,
            |_, r, _| r <= -5,
        ];
        let points = point_tests
            .iter()
            .map(|test| {
                (0..coords.len())
                    .filter(|&i| {
                        let (q, r) = coords[i];
                        test(q, r, -q - r)
                    })
                    .collect()
            })
            .collect();

        Board {
            coords,
            neighbors,
            points,
            opposite: vec![3, 4, 5, 0, 1, 2],
            seatings: vec![
                (2, vec![0, 3]),
                (3, vec![0, 2, 4]),
                (4, vec![0, 1, 3, 4]),
                (6, vec![0, 1, 2, 3, 4, 5]),
            ],
        }
    }

    /// Het Vierkant bord: 16 bij 16 vakken, acht richtingen.
    /// Punten 0 tot 3 zijn de grote kampen (19 vakken) linksboven, rechtsboven,
    /// rechtsonder en linksonder, voor 2 Spelers. Punten 4 tot 7 zijn de kleine
    /// kampen (13 vakken) op dezelfde hoeken, voor 4 Spelers.
    /// Het tegenoverliggende punt ligt in de diagonaal tegenoverliggende hoek.
    pub fn square() -> Board {
        let n = SQUARE_SIZE;
        let mut coords = Vec::new();
        for r in 0..n {
            for c in 0..n {
                coords.push((c, r));
            }
        }
        let neighbors = coords
            .iter()
            .map(|&(c, r)| {
                SQUARE_DIRECTIONS
                    .iter()
                    .map(|&(dc, dr)| {
                        let (nc, nr) = (c + dc, r + dr);
                        ((0..n).contains(&nc) && (0..n).contains(&nr))
                            .then(|| (nr * n + nc) as usize)
                    })
                    .collect()
            })
            .collect();

        // Een kamp in een hoek: rij `i` heeft `rows[i]` vakken, vanaf de hoek.
        let camp = |rows: &[i32], flip_c: bool, flip_r: bool| -> Vec<usize> {
            let mut cells = Vec::new();
            for (r, &len) in rows.iter().enumerate() {
                for c in 0..len {
                    let col = if flip_c { n - 1 - c } else { c };
                    let row = if flip_r { n - 1 - r as i32 } else { r as i32 };
                    cells.push((row * n + col) as usize);
                }
            }
            cells.sort_unstable();
            cells
        };
        let corners = [(false, false), (true, false), (true, true), (false, true)];
        let mut points: Vec<Vec<usize>> = corners
            .iter()
            .map(|&(fc, fr)| camp(&CAMP_19, fc, fr))
            .collect();
        points.extend(corners.iter().map(|&(fc, fr)| camp(&CAMP_13, fc, fr)));

        Board {
            coords,
            neighbors,
            points,
            opposite: vec![2, 3, 0, 1, 6, 7, 4, 5],
            seatings: vec![(2, vec![0, 2]), (4, vec![4, 5, 6, 7])],
        }
    }

    /// Aantal vakken.
    pub fn len(&self) -> usize {
        self.coords.len()
    }

    pub fn is_empty(&self) -> bool {
        self.coords.is_empty()
    }

    /// Plek van een vak als (kolom, rij).
    pub fn coords(&self, cell: usize) -> (i32, i32) {
        self.coords[cell]
    }

    /// Aantal richtingen waarin een vak buren kan hebben.
    pub fn directions(&self) -> usize {
        self.neighbors.first().map_or(0, Vec::len)
    }

    /// Het vak naast `cell` in richting `dir`, als dat bestaat.
    pub fn neighbor(&self, cell: usize, dir: usize) -> Option<usize> {
        self.neighbors[cell][dir]
    }

    /// De vakken van een punt.
    pub fn point(&self, point: usize) -> &[usize] {
        &self.points[point]
    }

    /// Het punt tegenover `point`: het doel van de Speler die daar begint.
    pub fn opposite_point(&self, point: usize) -> usize {
        self.opposite[point]
    }

    /// De startpunten voor dit aantal spelers, als het aantal bestaat.
    pub fn start_points(&self, players: usize) -> Option<&[usize]> {
        self.seatings
            .iter()
            .find(|(n, _)| *n == players)
            .map(|(_, p)| p.as_slice())
    }
}
