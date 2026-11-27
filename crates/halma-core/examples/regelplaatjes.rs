//! Maakt de plaatjes van de spelregelpagina's (`web/public/rules/img/*.svg`).
//!
//! Elk plaatje komt uit de echte spelregels: de beginopstelling uit `Game::new_star`, de
//! bestemmingen uit `Game::destinations` en `step_destinations`, en het pad van een Sprongketen
//! uit `move_path`. Staat een plaatje er anders uit dan de regels geven, dan stopt dit programma
//! met een fout (`assert!`). Er staat geen getekende gok in.
//!
//! Opnieuw maken: `npm --prefix web run regels` (dit programma en daarna de pagina's), of alleen
//! `cargo run -q -p halma-core --example regelplaatjes -- web/public/rules/img`.

use halma_core::game::move_path;
use halma_core::{Board, Game, PlayerState};
use std::fmt::Write as _;
use std::fs;
use std::path::PathBuf;

/// Kleuren van de Spelers, dezelfde als `SPELER_KLEUREN` in `web/src/spelers.ts`.
const KLEUREN: [(u8, u8, u8); 6] = [
    (0xc9, 0x3f, 0x2b), // Red
    (0x27, 0x53, 0xb8), // Blue
    (0x1f, 0x9e, 0x74), // Green
    (0xdc, 0xb5, 0x54), // Yellow
    (0xad, 0x94, 0xee), // Purple
    (0xdf, 0xe2, 0xe7), // Silver
];
const LICHT: &str = "#eceef1";
/// Hoeveel pixels een vak breed is in het plaatje.
const SCHAAL: f64 = 22.0;

type Punt = (f64, f64);

fn hex((r, g, b): (u8, u8, u8)) -> String {
    format!("#{r:02x}{g:02x}{b:02x}")
}

/// Meng met wit (t > 0) of zwart (t < 0).
fn meng((r, g, b): (u8, u8, u8), t: f64) -> (u8, u8, u8) {
    let doel = if t >= 0.0 { 255.0 } else { 0.0 };
    let t = t.abs();
    let m = |c: u8| (f64::from(c) + (doel - f64::from(c)) * t).round() as u8;
    (m(r), m(g), m(b))
}

/// Het rasterpunt (kolom, rij) van een vak op het scherm, zoals `schermPunt` in `web/src/spelers.ts`.
fn scherm(q: i32, r: i32) -> Punt {
    (f64::from(q) + f64::from(r) / 2.0, f64::from(r) * 0.866_025_403_784_438_6)
}

/// Een stand op het Sterbord met bestemmingen en pijlen die erbij horen.
struct Plaatje {
    game: Game,
    /// Het aantal Spelers dat de rand-kleuren bepaalt (Speler 0 zit onderaan).
    gekozen: Option<usize>,
    ringen: Vec<usize>,
    /// Genummerde landingen van een Sprongketen, in volgorde.
    landingen: Vec<usize>,
    pijlen: Vec<(usize, usize)>,
    /// Doelvakken met een streeplijn in de kleur van deze Speler.
    doel_van: Option<usize>,
    /// Doelvakken van meer Spelers tegelijk, elk met een streeplijn in de eigen kleur (taak 139).
    doelen: Vec<usize>,
    /// Doelvakken van deze Spelers met een streeplijn rond de steen die erin staat, ook als dat een steen van een ander is (taak 302).
    doel_rand: Vec<usize>,
    /// Alleen dit deel van het bord tonen: de vakken die in beeld moeten (met een marge).
    uitsnede: Vec<usize>,
    /// Pijlen (nummer in `pijlen`) die aan de andere kant buigen, zodat bogen elkaar niet kruisen.
    omkeren: Vec<usize>,
}

fn vak(game: &Game, q: i32, r: i32) -> usize {
    (0..game.board().len())
        .find(|&c| game.board().coords(c) == (q, r))
        .unwrap_or_else(|| panic!("vak ({q}, {r}) bestaat niet"))
}

fn stand(game_spelers: usize, stenen: &[(i32, i32, usize)], aan_de_beurt: usize) -> Game {
    stand_op(Board::star(), Game::new_star(game_spelers).unwrap(), game_spelers, stenen, aan_de_beurt)
}

fn stand_vierkant(game_spelers: usize, stenen: &[(i32, i32, usize)], aan_de_beurt: usize) -> Game {
    stand_op(Board::square(), Game::new_square(game_spelers).unwrap(), game_spelers, stenen, aan_de_beurt)
}

fn stand_op(board: Board, probe: Game, game_spelers: usize, stenen: &[(i32, i32, usize)], aan_de_beurt: usize) -> Game {
    let mut stand = vec![None; board.len()];
    for &(q, r, speler) in stenen {
        let c = vak(&probe, q, r);
        assert!(stand[c].is_none(), "twee stenen op ({q}, {r})");
        stand[c] = Some(speler);
    }
    Game::from_position(board, game_spelers, stand, aan_de_beurt).expect("stand past bij het bord")
}

fn teken(naam: &str, p: &Plaatje) -> String {
    let game = &p.game;
    let n = game.board().len();
    // Het Vierkant bord heeft acht richtingen en wordt niet gedraaid: kolom naar rechts, rij naar beneden.
    let vierkant = game.board().directions() == 8;

    // Draai het bord zoals het spel: het kamp van Speler 1 (nummer 0) zit onderaan.
    let ruw: Vec<Punt> = (0..n)
        .map(|c| {
            let (q, r) = game.board().coords(c);
            if vierkant { (f64::from(q), f64::from(r)) } else { scherm(q, r) }
        })
        .collect();
    let kamp: Vec<Punt> = game.start_cells(0).iter().map(|&c| ruw[c]).collect();
    let k = kamp.len() as f64;
    let (kx, ky) = (kamp.iter().map(|p| p.0).sum::<f64>() / k, kamp.iter().map(|p| p.1).sum::<f64>() / k);
    let hoek = ky.atan2(kx).to_degrees();
    // Kleinste draaiing (veelvoud van 60 graden) die dat kamp naar beneden (90 graden) zet.
    let draai = if vierkant { 0.0 } else { (0..6)
        .map(|i| f64::from(i) * 60.0)
        .min_by(|a, b| {
            let af = |d: &f64| (((hoek + d - 90.0) % 360.0 + 540.0) % 360.0 - 180.0).abs();
            af(a).total_cmp(&af(b))
        })
        .unwrap() }
        .to_radians();
    let pt: Vec<Punt> = ruw
        .iter()
        .map(|&(x, y)| (x * draai.cos() - y * draai.sin(), x * draai.sin() + y * draai.cos()))
        .collect();

    let rand = if p.uitsnede.is_empty() { 1.0 } else { 1.7 };
    let in_beeld: Vec<Punt> = if p.uitsnede.is_empty() { pt.clone() } else { p.uitsnede.iter().map(|&c| pt[c]).collect() };
    let (min_x, max_x) = in_beeld.iter().fold((f64::MAX, f64::MIN), |(a, b), p| (a.min(p.0), b.max(p.0)));
    let (min_y, max_y) = in_beeld.iter().fold((f64::MAX, f64::MIN), |(a, b), p| (a.min(p.1), b.max(p.1)));
    let (x0, y0) = (min_x - rand, min_y - rand);
    let (b, h) = (max_x - min_x + 2.0 * rand, max_y - min_y + 2.0 * rand);

    let mut s = String::new();
    let _ = writeln!(
        s,
        "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"{:.2} {:.2} {:.2} {:.2}\" width=\"{}\" height=\"{}\">",
        x0,
        y0,
        b,
        h,
        (b * SCHAAL).round(),
        (h * SCHAAL).round()
    );
    s.push_str("<defs>\n");
    for (i, &kl) in KLEUREN.iter().enumerate() {
        let _ = writeln!(
            s,
            "<radialGradient id=\"s{i}\" cx=\"0.36\" cy=\"0.3\" r=\"0.75\"><stop offset=\"0\" stop-color=\"{}\"/><stop offset=\"0.5\" stop-color=\"{}\"/><stop offset=\"1\" stop-color=\"{}\"/></radialGradient>",
            hex(meng(kl, 0.5)),
            hex(kl),
            hex(meng(kl, -0.45))
        );
    }
    s.push_str("<marker id=\"pijl\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"4\" markerHeight=\"4\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"");
    s.push_str(LICHT);
    s.push_str("\"/></marker>\n</defs>\n");

    // De plaat: twee driehoeken, iets groter dan de buitenste vakken. Eerst met rand, dan alleen vulling
    // erbovenop, zodat de rand binnenin de ster niet te zien is.
    let driehoek = |hoeken: [(i32, i32); 3]| -> String {
        let f = 8.9 / 8.0;
        let punten: Vec<String> = hoeken
            .iter()
            .map(|&(q, r)| {
                let (x, y) = scherm(q, r);
                let (x, y) = (x * f, y * f);
                let (x, y) = (x * draai.cos() - y * draai.sin(), x * draai.sin() + y * draai.cos());
                format!("{x:.2},{y:.2}")
            })
            .collect();
        punten.join(" ")
    };
    // (q, r) van de hoeken: s = -q - r. Eerste driehoek: q, r, s >= -4; tweede: q, r, s <= 4.
    let d1 = driehoek([(8, -4), (-4, 8), (-4, -4)]);
    let d2 = driehoek([(4, 4), (4, -8), (-8, 4)]);
    let plaat = format!("-0.75,-0.75 15.75,-0.75 15.75,15.75 -0.75,15.75");
    let (d1, d2) = if vierkant { (plaat.clone(), plaat) } else { (d1, d2) };
    for (vul, rand_breedte) in [("#191d23", 0.14), ("#191d23", 0.0)] {
        for d in [&d1, &d2] {
            if rand_breedte > 0.0 {
                let _ = writeln!(s, "<polygon points=\"{d}\" fill=\"{vul}\" stroke=\"#d6deeb\" stroke-opacity=\"0.35\" stroke-width=\"{rand_breedte}\" stroke-linejoin=\"round\"/>");
            } else {
                let _ = writeln!(s, "<polygon points=\"{d}\" fill=\"{vul}\" stroke=\"{vul}\" stroke-width=\"0.02\" stroke-linejoin=\"round\"/>");
            }
        }
    }

    // Gaatjes.
    s.push_str("<g fill=\"#0b0d10\" stroke=\"#d6deeb\" stroke-opacity=\"0.16\" stroke-width=\"0.04\">\n");
    for &(x, y) in &pt {
        let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.17\"/>");
    }
    s.push_str("</g>\n");

    // Doelvakken met een streeplijn.
    for speler in p.doel_van.into_iter().chain(p.doelen.iter().copied()) {
        let kl = hex(meng(KLEUREN[speler], 0.45));
        for &c in game.goal_cells(speler) {
            let (x, y) = pt[c];
            let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.34\" fill=\"{kl}\" fill-opacity=\"0.16\" stroke=\"{kl}\" stroke-width=\"0.1\" stroke-dasharray=\"0.2 0.12\"/>");
        }
    }

    // Stenen.
    for c in 0..n {
        if let Some(speler) = game.stone_at(c) {
            let (x, y) = pt[c];
            let _ = writeln!(
                s,
                "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.41\" fill=\"url(#s{speler})\" stroke=\"#000\" stroke-opacity=\"0.45\" stroke-width=\"0.04\"/>"
            );
        }
    }
    for &speler in &p.doel_rand {
        let kl = hex(meng(KLEUREN[speler], 0.45));
        for &c in game.goal_cells(speler) {
            let (x, y) = pt[c];
            let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.52\" fill=\"none\" stroke=\"{kl}\" stroke-width=\"0.1\" stroke-dasharray=\"0.25 0.15\"/>");
        }
    }
    if let Some(c) = p.gekozen {
        let (x, y) = pt[c];
        let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.52\" fill=\"none\" stroke=\"{LICHT}\" stroke-width=\"0.09\"/>");
    }

    // Stappen: een ring op elk leeg buurvak.
    for &c in &p.ringen {
        let (x, y) = pt[c];
        let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.33\" fill=\"{LICHT}\" fill-opacity=\"0.14\" stroke=\"{LICHT}\" stroke-width=\"0.09\"/>");
    }

    // Pijlen van een Sprongketen: een hupboog van boven op het ene vak naar boven op het volgende,
    // aan de linkerkant van de looprichting, zodat de boog over de gesprongen steen gaat.
    for (i, &(van, naar)) in p.pijlen.iter().enumerate() {
        let (a, z) = (pt[van], pt[naar]);
        let (dx, dy) = (z.0 - a.0, z.1 - a.1);
        let l = dx.hypot(dy);
        let (ex, ey) = (dx / l, dy / l);
        let teken = if p.omkeren.contains(&i) { -1.0 } else { 1.0 };
        let (nx, ny) = (ey * teken, -ex * teken);
        let punt = |basis: Punt, omhoog: f64, langs: f64| (basis.0 + nx * omhoog + ex * langs, basis.1 + ny * omhoog + ey * langs);
        let (b0, c1, c2, b1) = (punt(a, 0.5, 0.1), punt(a, 1.5, 0.35), punt(z, 1.5, -0.35), punt(z, 0.5, -0.1));
        let _ = writeln!(s, "<path d=\"M{:.2} {:.2}C{:.2} {:.2} {:.2} {:.2} {:.2} {:.2}\" fill=\"none\" stroke=\"{LICHT}\" stroke-width=\"0.09\" stroke-linecap=\"round\" marker-end=\"url(#pijl)\"/>", b0.0, b0.1, c1.0, c1.1, c2.0, c2.1, b1.0, b1.1);
    }

    // Genummerde landingen.
    for (i, &c) in p.landingen.iter().enumerate() {
        let (x, y) = pt[c];
        let _ = writeln!(s, "<circle cx=\"{x:.2}\" cy=\"{y:.2}\" r=\"0.38\" fill=\"#0b0d10\" fill-opacity=\"0.55\" stroke=\"{LICHT}\" stroke-width=\"0.09\"/>");
        let _ = writeln!(s, "<text x=\"{x:.2}\" y=\"{y:.2}\" fill=\"{LICHT}\" font-family=\"sans-serif\" font-size=\"0.55\" font-weight=\"600\" text-anchor=\"middle\" dominant-baseline=\"central\">{}</text>", i + 1);
    }

    s.push_str("</svg>\n");
    let _ = naam;
    s
}

fn leeg(game: Game) -> Plaatje {
    Plaatje { game, gekozen: None, ringen: Vec::new(), landingen: Vec::new(), pijlen: Vec::new(), doel_van: None, doelen: Vec::new(), doel_rand: Vec::new(), uitsnede: Vec::new(), omkeren: Vec::new() }
}

fn main() {
    let uit: PathBuf = std::env::args_os().nth(1).map(PathBuf::from).unwrap_or_else(|| PathBuf::from("web/public/rules/img"));
    fs::create_dir_all(&uit).expect("map maken");
    let mut klaar: Vec<(String, String)> = Vec::new();

    // 1. De beginopstelling bij 2, 3, 4 en 6 Spelers.
    for n in [2, 3, 4, 6] {
        let game = Game::new_star(n).unwrap();
        for p in 0..n {
            assert_eq!(game.start_cells(p).len(), 10, "elke Speler begint met 10 stenen");
        }
        let total = (0..game.board().len()).filter(|&c| game.stone_at(c).is_some()).count();
        assert_eq!(total, n * 10);
        klaar.push((format!("setup-{n}.svg"), teken("setup", &leeg(game))));
    }

    // 2. Een stap: een steen heeft zes buren; bezette vakken tellen niet mee.
    {
        let game = stand(2, &[(0, 1, 0), (1, 0, 1), (-1, 1, 0), (1, 1, 1)], 0);
        let start = vak(&game, 0, 1);
        let stap = game.step_destinations(start);
        let verwacht: Vec<usize> = [(0, 0), (-1, 2), (0, 2)].iter().map(|&(q, r)| vak(&game, q, r)).collect();
        let mut gesorteerd = verwacht.clone();
        gesorteerd.sort_unstable();
        assert_eq!(stap, gesorteerd, "een stap gaat alleen naar een leeg buurvak");
        let mut p = leeg(game);
        p.gekozen = Some(start);
        p.ringen = stap;
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(p.ringen.clone()).collect();
        klaar.push(("step.svg".into(), teken("step", &p)));
    }

    // 3. Een Sprong: over één steen (van wie dan ook) naar het lege vak erachter.
    {
        let game = stand(2, &[(0, 2, 0), (0, 1, 1)], 0);
        let (start, over, land) = (vak(&game, 0, 2), vak(&game, 0, 1), vak(&game, 0, 0));
        assert!(game.stone_at(over).is_some() && game.stone_at(land).is_none());
        assert!(game.destinations(start).contains(&land), "een Sprong over een steen naar een leeg vak mag");
        assert!(game.next_jumps(start, start, &[]).contains(&land));
        let mut p = leeg(game);
        p.gekozen = Some(start);
        p.pijlen = vec![(start, land)];
        p.uitsnede = vec![start, over, land];
        p.landingen = vec![land];
        klaar.push(("jump.svg".into(), teken("jump", &p)));
    }

    // 4. Een keten van drie Sprongen met één steen.
    {
        let game = stand(3, &[(0, 3, 0), (0, 2, 1), (1, 1, 2), (3, 0, 1)], 0);
        let route = [(0, 3), (0, 1), (2, 1), (4, -1)].map(|(q, r)| vak(&game, q, r));
        for w in route.windows(2) {
            assert!(game.next_jumps(route[0], w[0], &route[..1]).contains(&w[1]), "elke schakel is een Sprong");
        }
        let doel = route[3];
        assert!(game.destinations(route[0]).contains(&doel), "het eind van de keten is een geldige Zet");
        assert_eq!(move_path(game.board(), &stand_vec(&game), route[0], doel).unwrap(), route.to_vec(), "dit is de kortste keten");
        let mut p = leeg(game);
        p.gekozen = Some(route[0]);
        p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
        p.landingen = route[1..].to_vec();
        p.omkeren = vec![2];
        klaar.push(("chain.svg".into(), teken("chain", &p)));
    }

    // 5. Een ladder: stenen met één vak ertussen laten één steen in één Zet over het bord gaan.
    {
        let game = stand(2, &[(-4, 0, 0), (-3, 0, 0), (-1, 0, 1), (1, 0, 0), (3, 0, 1)], 0);
        let (start, eind) = (vak(&game, -4, 0), vak(&game, 4, 0));
        assert!(game.destinations(start).contains(&eind), "de ladder brengt de steen in één Zet naar de overkant");
        let tussen: Vec<usize> = [-2, 0, 2].iter().map(|&q| vak(&game, q, 0)).collect();
        let route = [vec![start], tussen, vec![eind]].concat();
        let pad = move_path(game.board(), &stand_vec(&game), start, eind).unwrap();
        assert_eq!(pad, route, "de ladder is één keten van vier Sprongen");
        let mut p = leeg(game);
        p.gekozen = Some(start);
        p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
        p.landingen = route[1..].to_vec();
        klaar.push(("ladder.svg".into(), teken("ladder", &p)));
    }

    // 6. Het doel: het tegenoverliggende punt. Hier is het leeg (bij 3 Spelers is het zo).
    {
        let game = Game::new_star(3).unwrap();
        assert!(game.goal_cells(0).iter().all(|&c| game.stone_at(c).is_none()), "bij 3 Spelers is het doel in het begin leeg");
        assert_eq!(game.goal_cells(0).len(), 10);
        let mut p = leeg(game);
        p.doel_van = Some(0);
        klaar.push(("goal.svg".into(), teken("goal", &p)));
    }

    // --- Het Vierkant bord (Halma) ---

    // 7. De beginopstelling: 2 Spelers met 19 stenen, 4 Spelers met 13 stenen.
    for (n, per_speler) in [(2, 19), (4, 13)] {
        let game = Game::new_square(n).unwrap();
        assert_eq!(game.board().len(), 256, "16 bij 16 vakken");
        for p in 0..n {
            assert_eq!(game.start_cells(p).len(), per_speler);
            assert_eq!(game.goal_cells(p).len(), per_speler);
        }
        klaar.push((format!("halma-setup-{n}.svg"), teken("halma-setup", &leeg(game))));
    }

    // 8. Een stap: acht buren, ook schuin.
    {
        let game = stand_vierkant(2, &[(7, 7, 0), (8, 7, 1), (6, 6, 0), (8, 8, 1)], 0);
        let start = vak(&game, 7, 7);
        let stap = game.step_destinations(start);
        let verwacht: Vec<usize> = [(7, 6), (8, 6), (6, 7), (6, 8), (7, 8)].iter().map(|&(q, r)| vak(&game, q, r)).collect();
        let mut gesorteerd = verwacht.clone();
        gesorteerd.sort_unstable();
        assert_eq!(stap, gesorteerd, "een stap gaat naar een leeg buurvak, ook schuin");
        let mut p = leeg(game);
        p.gekozen = Some(start);
        p.ringen = stap;
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(p.ringen.clone()).collect();
        klaar.push(("halma-step.svg".into(), teken("halma-step", &p)));
    }

    // 9. Een schuine Sprong.
    {
        let game = stand_vierkant(2, &[(6, 6, 0), (7, 7, 1)], 0);
        let (start, over, land) = (vak(&game, 6, 6), vak(&game, 7, 7), vak(&game, 8, 8));
        assert!(game.stone_at(over).is_some() && game.stone_at(land).is_none());
        assert!(game.destinations(start).contains(&land), "een schuine Sprong mag");
        assert!(game.next_jumps(start, start, &[]).contains(&land));
        let mut p = leeg(game);
        p.gekozen = Some(start);
        p.pijlen = vec![(start, land)];
        p.uitsnede = vec![start, over, land];
        p.landingen = vec![land];
        klaar.push(("halma-jump.svg".into(), teken("halma-jump", &p)));
    }

    // 10. Een keten met rechte en schuine Sprongen.
    {
        let game = stand_vierkant(2, &[(4, 4, 0), (5, 5, 1), (7, 6, 1), (7, 7, 0)], 0);
        let route = [(4, 4), (6, 6), (8, 6), (6, 8)].map(|(q, r)| vak(&game, q, r));
        for w in route.windows(2) {
            assert!(game.next_jumps(route[0], w[0], &route[..1]).contains(&w[1]), "elke schakel is een Sprong");
        }
        let doel = route[3];
        assert!(game.destinations(route[0]).contains(&doel), "het eind van de keten is een geldige Zet");
        assert_eq!(move_path(game.board(), &stand_vec(&game), route[0], doel).unwrap(), route.to_vec(), "dit is de kortste keten");
        let mut p = leeg(game);
        p.gekozen = Some(route[0]);
        p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
        p.landingen = route[1..].to_vec();
        klaar.push(("halma-chain.svg".into(), teken("halma-chain", &p)));
    }

    // 11. Het doel bij 2 Spelers: de hoek tegenover, met de stenen van de ander erin.
    {
        let game = Game::new_square(2).unwrap();
        assert_eq!(game.goal_cells(0), game.start_cells(1), "bij 2 Spelers is het doel het kamp van de ander");
        let mut p = leeg(game);
        p.doel_van = Some(0);
        klaar.push(("halma-goal.svg".into(), teken("halma-goal", &p)));
    }

    // --- De gidsen (taak 122): /guides/chinese-checkers-strategy en /guides/chinese-checkers-2-players ---

    // 12. Het doel bij 2 Spelers is het startpunt van de ander, en het is in het begin vol (gids voor 2 Spelers; geen plaatje, setup-2.svg toont het).
    {
        let game = Game::new_star(2).unwrap();
        assert_eq!(game.goal_cells(0), game.start_cells(1), "bij 2 Spelers is het doel het startpunt van de ander");
        assert_eq!(game.goal_cells(1), game.start_cells(0));
        assert!(game.goal_cells(0).iter().all(|&c| game.stone_at(c) == Some(1)), "het doel is in het begin vol stenen van de ander");
        assert_eq!((0..game.board().len()).filter(|&c| game.stone_at(c).is_some()).count(), 20, "20 stenen bij 2 Spelers");
        let zes = Game::new_star(6).unwrap();
        assert_eq!((0..zes.board().len()).filter(|&c| zes.stone_at(c).is_some()).count(), 60, "60 stenen bij 6 Spelers");
    }

    // 13. Een achterblijver: een steen zonder buur heeft niets om over te springen en kan alleen stappen.
    {
        let probe = Game::new_star(2).unwrap();
        let achter = vak(&probe, 8, -4);
        let verste = vak(&probe, -8, 4);
        let game = stand(2, &[(8, -4, 0), (0, 0, 0), (-1, 1, 0), (-2, 2, 0), (1, -1, 0), (-1, -2, 1), (2, 1, 1), (-2, -1, 1)], 0);
        assert_eq!(game.goal_cells(0).contains(&verste), true, "het verste doelvak ligt in het doel");
        let stap = game.step_destinations(achter);
        let alles = game.destinations(achter);
        assert_eq!(stap, alles, "zonder buur zijn er alleen stappen, geen Sprongen");
        // Van punt tot punt over het bord kost een steen die alleen stapt zoveel stappen:
        let mut afstand = vec![usize::MAX; game.board().len()];
        afstand[achter] = 0;
        let mut rij = std::collections::VecDeque::from([achter]);
        while let Some(c) = rij.pop_front() {
            for d in 0..game.board().directions() {
                if let Some(n) = game.board().neighbor(c, d) {
                    if afstand[n] == usize::MAX {
                        afstand[n] = afstand[c] + 1;
                        rij.push_back(n);
                    }
                }
            }
        }
        assert_eq!(afstand[verste], 16, "van de punt van het ene punt naar de punt van het andere punt zijn het 16 stappen");
        let mut p = leeg(game);
        p.gekozen = Some(achter);
        p.ringen = stap;
        klaar.push(("guide-straggler.svg".into(), teken("guide-straggler", &p)));
    }

    // 14. De middelste steen heeft zes buren, een steen aan de rand heeft er minder.
    {
        let probe = Game::new_star(2).unwrap();
        let (midden, rand) = (vak(&probe, 0, 0), vak(&probe, -4, 7));
        let game = stand(2, &[(0, 0, 0), (-4, 7, 0)], 0);
        let buren = |c: usize| (0..game.board().directions()).filter(|&d| game.board().neighbor(c, d).is_some()).count();
        assert_eq!(buren(midden), 6, "in het midden heeft een vak zes buren");
        assert_eq!(buren(rand), 4, "aan de rand van het bord heeft dit vak vier buren");
        assert_eq!(game.step_destinations(midden).len(), 6);
        assert_eq!(game.step_destinations(rand).len(), 4);
        let ringen = [game.step_destinations(midden), game.step_destinations(rand)].concat();
        let mut p = leeg(game);
        p.gekozen = Some(midden);
        p.ringen = ringen;
        klaar.push(("guide-middle.svg".into(), teken("guide-middle", &p)));
    }

    // 15 en 16. Het doel vullen: laat de achterste vakken niet voor het laatst. De laatste steen komt
    // niet langs een vol voorste rij naar de lege punt, en een steen van de ander in de punt kan niet weg.
    {
        let probe = Game::new_star(2).unwrap();
        let doel = probe.goal_cells(0).to_vec();
        let afstand = |c: usize| {
            let (q, r) = probe.board().coords(c);
            q.abs().max(r.abs()).max((q + r).abs())
        };
        let punt = *doel.iter().max_by_key(|&&c| afstand(c)).unwrap();
        assert_eq!(probe.board().coords(punt), (-8, 4));
        let buiten = vak(&probe, -4, 2);
        // De steen van buiten staat naast de voorste rij van het doel.
        assert!((0..6).filter_map(|d| probe.board().neighbor(buiten, d)).any(|n| doel.contains(&n)));
        let wie = |punt_speler: usize| -> Game {
            let mut stenen = vec![None; probe.board().len()];
            for &c in &doel {
                stenen[c] = Some(if c == punt { punt_speler } else { 0 });
            }
            if punt_speler == 0 {
                stenen[punt] = None;
            }
            stenen[buiten] = Some(0);
            Game::from_position(Board::star(), 2, stenen, 0).unwrap()
        };
        // 15: negen eigen stenen thuis, het achterste vak leeg, de tiende steen buiten.
        let leeg_gat = wie(0);
        assert_eq!(doel.iter().filter(|&&c| leeg_gat.stone_at(c) == Some(0)).count(), 9);
        let bestemmingen = leeg_gat.destinations(buiten);
        assert!(!bestemmingen.contains(&punt), "de laatste steen komt niet in het lege achterste vak");
        assert!(bestemmingen.iter().all(|c| !doel.contains(c)), "en ook niet in een ander vak van het doel: alles is vol");
        let mut p = leeg(leeg_gat);
        p.doel_van = Some(0);
        p.gekozen = Some(buiten);
        p.uitsnede = doel.iter().copied().chain([buiten]).collect();
        klaar.push(("guide-goal-gap.svg".into(), teken("guide-goal-gap", &p)));
        // 16: een steen van de ander in het achterste vak, ingesloten door eigen stenen.
        let vast = wie(1);
        assert!(vast.destinations(punt).is_empty(), "de steen van de ander kan geen kant op");
        assert!(doel.iter().any(|&c| vast.stone_at(c) != Some(0)), "het doel is niet vol van mijn stenen: ik kan niet winnen");
        assert!(vast.destinations(buiten).iter().all(|c| !doel.contains(c)), "mijn laatste steen kan het doel niet in");
        let mut p = leeg(vast);
        p.doel_van = Some(0);
        p.gekozen = Some(punt);
        p.uitsnede = doel.iter().copied().chain([buiten]).collect();
        klaar.push(("guide-goal-trapped.svg".into(), teken("guide-goal-trapped", &p)));
    }

    // 17 en 18. Een Sprong blokkeren: een Sprong heeft een leeg landingsvak nodig. Je eigen stenen zijn ook
    // een ladder voor de ander, en één Zet kan die ladder afbreken.
    {
        let voor = stand(2, &[(-2, 0, 1), (-1, 0, 0), (1, 0, 0)], 0);
        let (start, a, b) = (vak(&voor, -2, 0), vak(&voor, 0, 0), vak(&voor, 2, 0));
        assert!(voor.next_jumps(start, start, &[]).contains(&a), "blauw springt over rood");
        assert!(voor.next_jumps(start, a, &[start]).contains(&b), "en nog eens over rood");
        assert!(voor.destinations(start).contains(&b), "twee Sprongen in één Zet");
        assert_eq!(move_path(voor.board(), &stand_vec(&voor), start, b).unwrap(), vec![start, a, b]);
        let uitsnede: Vec<usize> = [-2, -1, 0, 1, 2].iter().map(|&q| vak(&voor, q, 0)).collect();
        let mut na = voor.clone();
        na.make_move(vak(&na, 1, 0), a).expect("rood vult het landingsvak");
        assert_eq!(na.current_player(), 1);
        assert!(!na.destinations(start).contains(&a), "de eerste Sprong is weg");
        assert!(!na.destinations(start).contains(&b), "de ladder is weg");
        assert_eq!(na.destinations(start), na.step_destinations(start), "blauw kan alleen stappen");
        let mut p = leeg(voor);
        p.gekozen = Some(start);
        p.pijlen = vec![(start, a), (a, b)];
        p.landingen = vec![a, b];
        p.uitsnede = uitsnede.clone();
        klaar.push(("guide-block-before.svg".into(), teken("guide-block-before", &p)));
        let mut p = leeg(na);
        p.uitsnede = uitsnede;
        klaar.push(("guide-block-after.svg".into(), teken("guide-block-after", &p)));
    }

    // --- De gidsen van taak 139: /guides/halma-vs-chinese-checkers en /guides/chinese-checkers-3-players ---

    // 19. Halma tegenover Chinese checkers: wat de gids zegt over de verschillen en over wat gelijk is, uit de echte regels.
    {
        let ster = Game::new_star(2).unwrap();
        let vierkant = Game::new_square(2).unwrap();
        let klein = Game::new_square(4).unwrap();
        // Het bord: 121 tegenover 256 vakken, zes tegenover acht richtingen.
        assert_eq!((ster.board().len(), ster.board().directions()), (121, 6));
        assert_eq!((vierkant.board().len(), vierkant.board().directions()), (256, 8));
        // Het aantal Spelers: ster 2, 3, 4 of 6; vierkant 2 of 4.
        for n in 1..=8 {
            assert_eq!(Game::new_star(n).is_some(), [2, 3, 4, 6].contains(&n), "ster met {n} Spelers");
            assert_eq!(Game::new_square(n).is_some(), [2, 4].contains(&n), "vierkant met {n} Spelers");
        }
        // Het aantal stenen en de vorm van het kamp.
        for (n, totaal) in [(2, 20), (3, 30), (4, 40), (6, 60)] {
            let g = Game::new_star(n).unwrap();
            assert_eq!(aantal_stenen(&g), totaal, "ster met {n} Spelers");
            assert!((0..n).all(|p| g.start_cells(p).len() == 10));
        }
        for (n, per_speler) in [(2, 19), (4, 13)] {
            let g = Game::new_square(n).unwrap();
            assert_eq!(aantal_stenen(&g), n * per_speler, "vierkant met {n} Spelers");
            assert!((0..n).all(|p| g.start_cells(p).len() == per_speler));
        }
        let rijen = |g: &Game, per: fn(i32, i32) -> i32| -> Vec<usize> {
            let mut tel = std::collections::BTreeMap::new();
            for &c in g.start_cells(0) {
                let (a, b) = g.board().coords(c);
                *tel.entry(per(a, b)).or_insert(0usize) += 1;
            }
            let mut v: Vec<usize> = tel.into_values().collect();
            v.sort_unstable_by(|a, b| b.cmp(a));
            v
        };
        // Het punt van Speler 1 op het Sterbord is q >= 5: een rij is alle vakken met dezelfde q. Op het Vierkant bord is een rij een rij van het bord.
        assert_eq!(rijen(&ster, |q, _| q), vec![4, 3, 2, 1], "een punt van het Sterbord heeft rijen van 4, 3, 2 en 1");
        assert_eq!(rijen(&vierkant, |_, r| r), vec![5, 5, 4, 3, 2], "het grote kamp heeft rijen van 5, 5, 4, 3 en 2");
        assert_eq!(rijen(&klein, |_, r| r), vec![4, 4, 3, 2], "het kleine kamp heeft rijen van 4, 4, 3 en 2");
        // Het doel is bij 2 Spelers op beide borden het startkamp van de ander; bij 4 Spelers op het Vierkant bord de hoek diagonaal tegenover.
        assert_eq!(ster.goal_cells(0), ster.start_cells(1));
        assert_eq!(vierkant.goal_cells(0), vierkant.start_cells(1));
        assert_eq!(klein.goal_cells(0), klein.board().point(6), "het kleine kamp linksboven heeft de hoek rechtsonder als doel");
        // De stap: zes tegenover acht buren (step.svg en halma-step.svg), en een hoek van het Vierkant bord heeft drie buren.
        let buren = |g: &Game, c: usize| (0..g.board().directions()).filter(|&d| g.board().neighbor(c, d).is_some()).count();
        let g = stand(2, &[(0, 1, 0), (1, 0, 1), (-1, 1, 0), (1, 1, 1)], 0);
        let c = vak(&g, 0, 1);
        assert_eq!((buren(&g, c), g.step_destinations(c).len()), (6, 3), "drie van de zes buren zijn leeg");
        let h = stand_vierkant(2, &[(7, 7, 0), (8, 7, 1), (6, 6, 0), (8, 8, 1)], 0);
        let c = vak(&h, 7, 7);
        assert_eq!((buren(&h, c), h.step_destinations(c).len()), (8, 5), "vijf van de acht buren zijn leeg");
        assert_eq!(buren(&h, vak(&h, 0, 0)), 3, "een hoek heeft drie buren");
        // Wat gelijk is: de eerste Speler die het tegenoverliggende kamp vult wint, en bij meer dan 2 Spelers spelen de anderen door.
        for (board, n) in [(Board::star(), 2), (Board::square(), 2), (Board::star(), 3), (Board::star(), 4), (Board::star(), 6), (Board::square(), 4)] {
            let (mut g, van, naar) = bijna_klaar(board, n);
            assert!(g.step_destinations(van).contains(&naar), "de laatste Zet is een stap");
            g.make_move(van, naar).unwrap();
            assert_eq!(g.winner(), Some(0), "de eerste Speler die het doel vult wint ({n} Spelers)");
            assert_eq!(g.is_over(), n == 2, "bij 2 Spelers is het Potje dan afgelopen, bij meer spelen de anderen door ({n} Spelers)");
        }
    }

    // 20. Chinese checkers met 3 Spelers: opstelling, doelen, beurten, winst, overslaan en opgeven.
    {
        let game = Game::new_star(3).unwrap();
        let bord = game.board();
        // Elke tweede punt van de ster (0, 2 en 4), 10 stenen per Speler, dus 30 stenen op 121 vakken.
        assert_eq!(bord.start_points(3).unwrap(), &[0, 2, 4]);
        assert_eq!((bord.len(), aantal_stenen(&game)), (121, 30));
        assert!((0..3).all(|p| game.start_cells(p).len() == 10 && game.goal_cells(p).len() == 10));
        // Elk doel is het punt tegenover het begin, is in het begin leeg, en ligt tussen de beginpunten van de twee anderen.
        let punten = [0usize, 2, 4];
        for (speler, &punt) in punten.iter().enumerate() {
            let doel = bord.opposite_point(punt);
            assert!(!punten.contains(&doel), "geen doel is een beginpunt");
            assert!(game.goal_cells(speler).iter().all(|&c| game.stone_at(c).is_none()), "het doel van Speler {speler} is in het begin leeg");
            let mut ernaast = vec![(doel + 1) % 6, (doel + 5) % 6];
            ernaast.sort_unstable();
            let anderen: Vec<usize> = punten.iter().copied().filter(|&q| q != punt).collect();
            assert_eq!(ernaast, anderen, "het doel ligt tussen de beginpunten van de andere twee");
        }
        // Speler 1 (rood) begint en de beurten gaan 1, 2, 3, 1.
        assert_eq!(game.current_player(), 0);
        let mut spel = game.clone();
        for verwacht in [1, 2, 0, 1] {
            let wie = spel.current_player();
            let (van, naar) = (0..spel.board().len())
                .filter(|&c| spel.stone_at(c) == Some(wie))
                .find_map(|c| spel.step_destinations(c).first().map(|&n| (c, n)))
                .expect("een Speler kan stappen");
            spel.make_move(van, naar).unwrap();
            assert_eq!(spel.current_player(), verwacht);
        }
        // Eén Speler klaar: hij wint, de andere twee spelen door en zijn beurt wordt overgeslagen. Gaat nog één van hen weg, dan is het Potje afgelopen.
        let (mut g, van, naar) = bijna_klaar(Board::star(), 3);
        g.make_move(van, naar).unwrap();
        assert_eq!((g.winner(), g.is_over(), g.current_player()), (Some(0), false, 1));
        assert_eq!(g.player_state(0), Some(PlayerState::Finished));
        g.skip_turn().unwrap();
        assert_eq!(g.current_player(), 2);
        g.skip_turn().unwrap();
        assert_eq!(g.current_player(), 1, "wie klaar is wordt overgeslagen");
        g.resign(1).unwrap();
        assert!(g.is_over(), "als nog maar één Speler meespeelt, is het Potje afgelopen");
        assert_eq!(g.ranking(), &[0, 2], "wie als eerste klaar was staat eerst, wie overblijft staat achteraan");
        // Opgeven bij 3 Spelers: de stenen gaan van het bord en de andere twee spelen door; geeft er nog één op, dan wint de laatste.
        let mut g = Game::new_star(3).unwrap();
        g.resign(0).unwrap();
        assert!((0..g.board().len()).all(|c| g.stone_at(c) != Some(0)), "de stenen van wie opgeeft gaan van het bord");
        assert!(!g.is_over());
        assert_eq!(g.current_player(), 1);
        g.resign(1).unwrap();
        assert!(g.is_over());
        assert_eq!(g.winner(), Some(2), "wie overblijft wint als niemand het doel haalde");
        // Het plaatje: alle drie de doelen, elk met een streeplijn in de kleur van de Speler.
        let mut p = leeg(Game::new_star(3).unwrap());
        p.doelen = vec![0, 1, 2];
        klaar.push(("setup-3-goals.svg".into(), teken("setup-3-goals", &p)));
    }

    // 21. Chinese checkers met 4 Spelers (gids chinese-checkers-4-players, taak 301): opstelling, twee lege punten, doelen, beurten, winst en opgeven. Geen eigen plaatje: setup-4.svg toont het.
    {
        let game = Game::new_star(4).unwrap();
        let bord = game.board();
        // Twee paren punten naast elkaar (0, 1 en 3, 4), 10 stenen per Speler, dus 40 stenen op 121 vakken.
        assert_eq!(bord.start_points(4).unwrap(), &[0, 1, 3, 4]);
        assert_eq!((bord.len(), aantal_stenen(&game)), (121, 40));
        assert!((0..4).all(|p| game.start_cells(p).len() == 10 && game.goal_cells(p).len() == 10));
        // Rood (0) en groen (2) staan tegenover elkaar, blauw (1) en geel (3) ook: het doel van de een is het beginpunt van de ander, dus in het begin vol.
        for p in 0..4 {
            assert_eq!(game.goal_cells(p), game.start_cells((p + 2) % 4), "het doel van Speler {p} is het beginpunt van de Speler tegenover");
            assert!(game.goal_cells(p).iter().all(|&c| game.stone_at(c) == Some((p + 2) % 4)), "het doel is in het begin vol stenen van de ander");
        }
        // De vier doelen zijn vier verschillende punten, dus een Speler die klaar is blokkeert niemand: niemand anders wil zijn doel.
        let doelpunten: Vec<usize> = [0usize, 1, 3, 4].iter().map(|&q| bord.opposite_point(q)).collect();
        let mut gesorteerd = doelpunten.clone();
        gesorteerd.sort_unstable();
        gesorteerd.dedup();
        assert_eq!(gesorteerd.len(), 4);
        // Punten 2 en 5 blijven leeg, zijn niemands beginpunt of doel, en liggen elk tussen twee beginpunten: 2 tussen blauw en groen, 5 tussen geel en rood.
        for leeg_punt in [2usize, 5] {
            assert!(bord.point(leeg_punt).iter().all(|&c| game.stone_at(c).is_none()), "punt {leeg_punt} is leeg");
            assert!(!doelpunten.contains(&leeg_punt) && ![0usize, 1, 3, 4].contains(&leeg_punt));
            assert_eq!(bord.point(leeg_punt).len(), 10);
            // Een Speler mag er stoppen: een leeg vak is een geldige bestemming van een stap of Sprong (zie bestemmingen hierboven); hier de eis dat het vak leeg is.
        }
        assert_eq!([(2 + 5) % 6, (2 + 1) % 6], [1, 3], "punt 2 ligt tussen de punten van blauw (1) en groen (3)");
        assert_eq!([(5 + 5) % 6, (5 + 1) % 6], [4, 0], "punt 5 ligt tussen de punten van geel (4) en rood (0)");
        // De twee paren kruisen elkaar in het midden: het midden van elk beginpunt en het doel erover ligt op (0, 0).
        for p in 0..2 {
            let som = |vakken: &[usize]| vakken.iter().fold((0, 0), |a, &c| (a.0 + bord.coords(c).0, a.1 + bord.coords(c).1));
            let (a, b) = (som(game.start_cells(p)), som(game.goal_cells(p)));
            assert_eq!((a.0 + b.0, a.1 + b.1), (0, 0), "begin en doel van Speler {p} liggen tegenover elkaar, om het midden");
        }
        assert!((0..bord.len()).any(|c| bord.coords(c) == (0, 0)), "het midden is een vak");
        // Speler 1 (rood) begint en de beurten gaan 1, 2, 3, 4, 1; wie na jou komt staat nooit tegenover jou.
        assert_eq!(game.current_player(), 0);
        let mut spel = game.clone();
        for verwacht in [1, 2, 3, 0, 1] {
            let wie = spel.current_player();
            assert_ne!(verwacht, (wie + 2) % 4, "de volgende Speler staat niet tegenover de huidige");
            let (van, naar) = (0..spel.board().len())
                .filter(|&c| spel.stone_at(c) == Some(wie))
                .find_map(|c| spel.step_destinations(c).first().map(|&n| (c, n)))
                .expect("een Speler kan stappen");
            spel.make_move(van, naar).unwrap();
            assert_eq!(spel.current_player(), verwacht);
        }
        // Eén Speler klaar: hij wint, zijn stenen blijven op het bord, de andere drie spelen door en zijn beurt wordt overgeslagen.
        let (mut g, van, naar) = bijna_klaar(Board::star(), 4);
        let voor = aantal_stenen(&g);
        g.make_move(van, naar).unwrap();
        assert_eq!((g.winner(), g.is_over(), g.current_player()), (Some(0), false, 1));
        assert_eq!(g.player_state(0), Some(PlayerState::Finished));
        assert_eq!(aantal_stenen(&g), voor, "de stenen van wie klaar is blijven op het bord");
        for verwacht in [2, 3, 1] {
            g.skip_turn().unwrap();
            assert_eq!(g.current_player(), verwacht, "wie klaar is wordt overgeslagen");
        }
        // Opgeven bij 4 Spelers: de stenen gaan van het bord, dus het doel van de Speler tegenover wordt leeg, en de andere drie spelen door.
        let mut g = Game::new_star(4).unwrap();
        g.resign(2).unwrap();
        assert!(g.goal_cells(0).iter().all(|&c| g.stone_at(c).is_none()), "als groen opgeeft is het doel van rood leeg");
        assert!((0..g.board().len()).all(|c| g.stone_at(c) != Some(2)));
        assert!(!g.is_over());
        g.resign(0).unwrap();
        assert!(!g.is_over(), "met nog twee Spelers gaat het Potje door");
        g.resign(1).unwrap();
        assert!(g.is_over());
        assert_eq!(g.winner(), Some(3), "wie overblijft wint als niemand het doel haalde");
    }

    // --- De gids van taak 302: /guides/chinese-checkers-6-players ---

    // 22. Chinese checkers met 6 Spelers: opstelling, doelen, het midden, beurten, winst, overslaan en opgeven.
    {
        let game = Game::new_star(6).unwrap();
        let bord = game.board();
        // Alle zes de punten zijn bezet, 10 stenen per Speler, dus 60 stenen op 121 vakken; het midden (de vakken buiten de punten) is leeg.
        assert_eq!(bord.start_points(6).unwrap(), &[0, 1, 2, 3, 4, 5]);
        assert_eq!((bord.len(), aantal_stenen(&game)), (121, 60));
        assert!((0..6).all(|p| game.start_cells(p).len() == 10 && game.goal_cells(p).len() == 10));
        let in_punt: Vec<usize> = (0..6).flat_map(|p| bord.point(p).to_vec()).collect();
        let midden: Vec<usize> = (0..bord.len()).filter(|c| !in_punt.contains(c)).collect();
        assert_eq!(midden.len(), 61, "het midden heeft 61 vakken");
        assert!(midden.iter().all(|&c| game.stone_at(c).is_none()), "het midden is in het begin leeg");
        // Zonder het midden zijn de punten niet met elkaar verbonden: elke steen die naar een ander punt wil, gaat door het midden.
        for punt in 0..6 {
            let mut gezien: Vec<usize> = bord.point(punt).to_vec();
            let mut wacht = gezien.clone();
            while let Some(c) = wacht.pop() {
                for d in 0..bord.directions() {
                    if let Some(b) = bord.neighbor(c, d) {
                        if !midden.contains(&b) && !gezien.contains(&b) {
                            gezien.push(b);
                            wacht.push(b);
                        }
                    }
                }
            }
            assert_eq!(gezien.len(), 10, "buiten het midden komt een steen niet uit zijn eigen punt");
        }
        // Elk doel is het beginpunt van de Speler tegenover, en is in het begin vol van diens stenen.
        for speler in 0..6 {
            let tegenover = (speler + 3) % 6;
            assert_eq!(game.goal_cells(speler), game.start_cells(tegenover), "het doel van Speler {speler} is het begin van de Speler tegenover");
            assert!(game.goal_cells(speler).iter().all(|&c| game.stone_at(c) == Some(tegenover)), "het doel is in het begin vol stenen van de ander");
        }
        // Speler 1 (rood) begint en de beurten gaan 1, 2, 3, 4, 5, 6, 1.
        assert_eq!(game.current_player(), 0);
        let mut spel = game.clone();
        for verwacht in [1, 2, 3, 4, 5, 0, 1] {
            let wie = spel.current_player();
            let (van, naar) = (0..spel.board().len())
                .filter(|&c| spel.stone_at(c) == Some(wie))
                .find_map(|c| spel.step_destinations(c).first().map(|&n| (c, n)))
                .expect("een Speler kan stappen");
            spel.make_move(van, naar).unwrap();
            assert_eq!(spel.current_player(), verwacht);
        }
        // Een Sprong gaat over een steen van elke kleur: hier over blauw, groen en paars in één Zet.
        let sprong = stand(6, &[(0, 3, 0), (0, 2, 1), (1, 1, 2), (3, 0, 4)], 0);
        let route = [(0, 3), (0, 1), (2, 1), (4, -1)].map(|(q, r)| vak(&sprong, q, r));
        for w in route.windows(2) {
            assert!(sprong.next_jumps(route[0], w[0], &route[..1]).contains(&w[1]), "elke schakel is een Sprong");
        }
        assert!(sprong.destinations(route[0]).contains(&route[3]), "het eind van de keten is een geldige Zet");
        assert_eq!(move_path(sprong.board(), &stand_vec(&sprong), route[0], route[3]).unwrap(), route.to_vec(), "dit is de kortste keten");
        let mut p = leeg(sprong);
        p.gekozen = Some(route[0]);
        p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
        p.landingen = route[1..].to_vec();
        p.omkeren = vec![2];
        klaar.push(("six-jump.svg".into(), teken("six-jump", &p)));
        // Een steen van een andere Speler in jouw doel houdt je tegen: je tiende steen kan er niet in en je wint niet.
        let (g, van, naar) = bijna_klaar(Board::star(), 6);
        let mut stenen = stand_vec(&g);
        stenen[naar] = Some(2);
        let geblokkeerd = Game::from_position(Board::star(), 6, stenen, 0).unwrap();
        assert!(!geblokkeerd.destinations(van).contains(&naar), "een bezet doelvak is geen bestemming");
        assert!(geblokkeerd.player_state(0) == Some(PlayerState::Playing) && geblokkeerd.winner().is_none());
        // Een lege plek in het doel van een ander mag je wel in stoppen (alleen een leeg vak telt).
        assert!(g.destinations(van).contains(&naar), "een leeg doelvak is een bestemming");
        // Eén Speler klaar: hij wint, zijn stenen blijven in het doel liggen, de andere vijf spelen door en zijn beurt wordt overgeslagen.
        let (mut g, van, naar) = bijna_klaar(Board::star(), 6);
        g.make_move(van, naar).unwrap();
        assert_eq!((g.winner(), g.is_over(), g.current_player()), (Some(0), false, 1));
        assert_eq!(g.player_state(0), Some(PlayerState::Finished));
        assert!(g.goal_cells(0).iter().all(|&c| g.stone_at(c) == Some(0)), "de stenen van wie klaar is blijven op het bord");
        for verwacht in [2, 3, 4, 5, 1] {
            g.skip_turn().unwrap();
            assert_eq!(g.current_player(), verwacht, "wie klaar is wordt overgeslagen");
        }
        for speler in 1..5 {
            assert!(!g.is_over(), "met meer dan één Speler is het Potje niet afgelopen");
            g.resign(speler).unwrap();
        }
        assert!(g.is_over(), "als nog maar één Speler meespeelt, is het Potje afgelopen");
        assert_eq!(g.ranking(), &[0, 5], "wie als eerste klaar was staat eerst, wie overblijft staat achteraan");
        // Opgeven bij 6 Spelers: de stenen gaan van het bord en de rest speelt door.
        let mut g = Game::new_star(6).unwrap();
        g.resign(0).unwrap();
        assert!((0..g.board().len()).all(|c| g.stone_at(c) != Some(0)), "de stenen van wie opgeeft gaan van het bord");
        assert!(!g.is_over());
        assert_eq!(g.current_player(), 1);
        // Het plaatje: het doel van Speler 1, vol met de stenen van Speler 4.
        let mut p = leeg(Game::new_star(6).unwrap());
        p.doel_van = Some(0);
        p.doel_rand = vec![0];
        klaar.push(("setup-6-goal.svg".into(), teken("setup-6-goal", &p)));
    }

    // --- De gids van taak 303: /guides/chinese-checkers-opening-moves ---
    // Alle getallen en alle zetten in die gids komen uit de regels hieronder. Rood is Speler 1 (nummer 0). Een "rij" is alle vakken met dezelfde q:
    // de rijen lopen evenwijdig aan de rand van het eigen punt, en elke stap of Sprong naar het doel toe gaat 1 of 2 rijen verder.
    {
        let basis = Game::new_star(2).unwrap();
        let rij = |g: &Game, c: usize| g.board().coords(c).0;
        assert!(basis.start_cells(0).iter().all(|&c| rij(&basis, c) >= 5), "het punt van Rood is de rij 5 tot en met 8");
        assert!(basis.goal_cells(0).iter().all(|&c| rij(&basis, c) <= -5), "het doel van Rood is de rij -5 tot en met -8");
        let op = |g: &Game, q: i32, r: i32| vak(g, q, r);
        let stand_van = |g: &Game| stand_vec(g);
        // Rijen die een Zet opschuift: positief is naar het doel toe.
        let winst = |g: &Game, van: usize, naar: usize| rij(g, van) - rij(g, naar);

        // a. De eerste Zet: 14 mogelijkheden, bij elk aantal Spelers en vanuit elk punt.
        for n in [2, 3, 4, 6] {
            let g = Game::new_star(n).unwrap();
            for p in 0..n {
                let stenen: Vec<usize> = g.start_cells(p).to_vec();
                let alles: usize = stenen.iter().map(|&c| g.destinations(c).len()).sum();
                let stappen: usize = stenen.iter().map(|&c| g.step_destinations(c).len()).sum();
                let kunnen = stenen.iter().filter(|&&c| !g.destinations(c).is_empty()).count();
                assert_eq!((alles, stappen, kunnen), (14, 8, 7), "{n} Spelers, punt van Speler {p}: 14 eerste Zetten, 8 stappen, 7 stenen die kunnen");
            }
        }
        {
            let rood: Vec<usize> = basis.start_cells(0).to_vec();
            let per_rij = |q: i32| rood.iter().filter(|&&c| rij(&basis, c) == q).count();
            assert_eq!((per_rij(5), per_rij(6), per_rij(7), per_rij(8)), (4, 3, 2, 1), "rijen van 4, 3, 2 en 1");
            let mut landingen: Vec<usize> = Vec::new();
            for &c in &rood {
                let rijen = rij(&basis, c);
                for d in basis.destinations(c) {
                    let stap = basis.step_destinations(c).contains(&d);
                    assert_eq!(winst(&basis, c, d), if stap { 1 } else { 2 }, "een stap schuift 1 rij op, een Sprong 2");
                    assert_eq!(stap, rijen == 5, "stappen doen de stenen van de voorste rij, Sprongen die van de tweede rij");
                    assert!(rijen == 5 || rijen == 6, "alleen de voorste twee rijen kunnen als eerste");
                    assert_eq!(rij(&basis, d), 4, "elke eerste Zet eindigt in de rij vlak voor je punt");
                    landingen.push(d);
                }
            }
            landingen.sort_unstable();
            landingen.dedup();
            assert_eq!(landingen.len(), 5, "vijf vakken in de rij vlak voor je punt");
            let tip = op(&basis, 8, -4);
            assert!(basis.destinations(tip).is_empty(), "de steen in de punt kan als eerste niet weg");
            assert_eq!(rij(&basis, tip), 8);
            let mut p = leeg(basis.clone());
            p.ringen = landingen.clone();
            p.uitsnede = rood.iter().copied().chain(landingen.iter().copied()).collect();
            klaar.push(("guide-opening-first.svg".into(), teken("guide-opening-first", &p)));
        }

        // b. Het meeste dat je met 1, 2, 3 en 4 Zetten kunt opschuiven: alle rijen Zetten van Rood doorgerekend (de ander wacht: de legers raken elkaar
        // in deze eerste Zetten niet, zie `speel`). `een_steen`: dezelfde steen doet elke Zet.
        fn zoek(g: &Game, diepte: usize, acc: i32, een_steen: Option<usize>, tel: &mut Vec<(i32, usize)>) {
            if diepte == 0 {
                tel.push((acc, 0));
                return;
            }
            for c in 0..g.board().len() {
                if g.stone_at(c) != Some(0) || een_steen.is_some_and(|s| s != c) {
                    continue;
                }
                for d in g.destinations(c) {
                    let mut st = stand_vec(g);
                    st[d] = st[c].take();
                    let n = Game::from_position(g.board().clone(), 2, st, 0).unwrap();
                    zoek(&n, diepte - 1, acc + g.board().coords(c).0 - g.board().coords(d).0, een_steen.map(|_| d), tel);
                }
            }
        }
        let meeste = |diepte: usize, een: bool| -> (i32, usize) {
            let mut tel = Vec::new();
            if een {
                for &s in basis.start_cells(0) {
                    zoek(&basis, diepte, 0, Some(s), &mut tel);
                }
            } else {
                zoek(&basis, diepte, 0, None, &mut tel);
            }
            let top = tel.iter().map(|t| t.0).max().unwrap();
            (top, tel.iter().filter(|t| t.0 == top).count())
        };
        assert_eq!([1, 2, 3, 4].map(|d| meeste(d, false).0), [2, 6, 9, 13], "meeste rijen met 1, 2, 3 en 4 Zetten");
        assert_eq!(meeste(2, false).1, 4, "vier paar Zetten halen die 6 rijen in twee Zetten");
        assert_eq!([1, 2, 3, 4].map(|d| meeste(d, true).0), [2, 3, 4, 5], "dezelfde steen elke beurt: 2, 3, 4 en 5 rijen");

        // Spelen met beide Spelers: Blauw spiegelt elke Zet van Rood (draaiing van het bord over 180 graden). Elke Zet moet een geldige Zet zijn
        // en schuift evenveel rijen op als de gids zegt.
        let speel = |g: &mut Game, zetten: &[((i32, i32), (i32, i32), i32)]| {
            for &((a, b), (c, d), verwacht) in zetten {
                let (van, naar) = (op(g, a, b), op(g, c, d));
                assert_eq!(g.current_player(), 0);
                assert_eq!(winst(g, van, naar), verwacht, "winst van de Zet");
                g.make_move(van, naar).unwrap_or_else(|e| panic!("Zet ({a},{b}) naar ({c},{d}): {e:?}"));
                let (bvan, bnaar) = (op(g, -a, -b), op(g, -c, -d));
                g.make_move(bvan, bnaar).expect("Blauw spiegelt de Zet");
            }
        };

        // c. Opening 1: spring uit de tweede rij en laat dan de steen uit de punt uit het gat komen. 2 Zetten, 6 rijen.
        {
            let mut g = basis.clone();
            speel(&mut g, &[((6, -4), (4, -4), 2)]);
            let tip = op(&g, 8, -4);
            let (midden, eind) = (op(&g, 6, -4), op(&g, 4, -2));
            assert!(g.destinations(tip).contains(&eind), "de steen uit de punt komt na de eerste Zet uit het gat");
            assert_eq!(move_path(g.board(), &stand_van(&g), tip, eind).unwrap(), vec![tip, midden, eind], "twee Sprongen, via het gat van de eerste Zet");
            assert_eq!(winst(&g, tip, eind), 4);
            let mut p = leeg(g.clone());
            p.gekozen = Some(tip);
            p.pijlen = vec![(tip, midden), (midden, eind)];
            p.landingen = vec![midden, eind];
            p.uitsnede = basis.start_cells(0).iter().copied().chain([op(&g, 4, -4), eind, midden]).collect();
            klaar.push(("guide-opening-tip.svg".into(), teken("guide-opening-tip", &p)));
            // De tweede Zet van de gids is een geldige Zet in het spel zelf, met 6 rijen in totaal.
            let mut g2 = basis.clone();
            speel(&mut g2, &[((6, -4), (4, -4), 2), ((8, -4), (4, -2), 4)]);
            // De twee voorste stenen staan nu met één leeg vak ertussen: de eerste trede van een ladder.
            assert_eq!((g2.stone_at(op(&g2, 4, -4)), g2.stone_at(op(&g2, 4, -3)), g2.stone_at(op(&g2, 4, -2))), (Some(0), None, Some(0)));
            // Zo'n opening van 6 rijen kan alleen met een Sprong in de eerste Zet.
            assert!(basis.step_destinations(op(&basis, 5, -4)).iter().all(|&d| winst(&basis, op(&basis, 5, -4), d) == 1));
        }

        // d. Opening 2: vier Zetten met vier verschillende stenen, 13 rijen. De steen uit de punt gaat in Zet 4.
        {
            let zetten = [((5, -4), (4, -3), 1), ((7, -4), (3, -2), 4), ((6, -2), (2, -2), 4), ((8, -4), (4, -2), 4)];
            let mut g = basis.clone();
            speel(&mut g, &zetten);
            assert_eq!(zetten.iter().map(|z| z.2).sum::<i32>(), 13, "13 rijen in vier Zetten: het meeste dat kan");
            // De gids zegt: Zet 2 en 3 eindigen met een Sprong over de steen die net verzet is, en Zet 4 begint door het vak dat Zet 3 leeg liet.
            let route = |van: (i32, i32), naar: (i32, i32), tussen: &[(i32, i32)], stand: &Game| {
                let r = move_path(stand.board(), &stand_vec(stand), op(stand, van.0, van.1), op(stand, naar.0, naar.1)).unwrap();
                assert_eq!(r, [vec![van], tussen.to_vec(), vec![naar]].concat().iter().map(|&(a, b)| op(stand, a, b)).collect::<Vec<_>>());
            };
            let mut loop_g = basis.clone();
            speel(&mut loop_g, &zetten[..1]);
            route((7, -4), (3, -2), &[(5, -4)], &loop_g);
            assert_eq!(loop_g.stone_at(op(&loop_g, 4, -3)), Some(0), "Zet 2 springt in zijn tweede Sprong over de steen van Zet 1");
            speel(&mut loop_g, &zetten[1..2]);
            route((6, -2), (2, -2), &[(4, -2)], &loop_g);
            assert_eq!(loop_g.stone_at(op(&loop_g, 3, -2)), Some(0), "Zet 3 springt in zijn tweede Sprong over de steen van Zet 2");
            speel(&mut loop_g, &zetten[2..3]);
            route((8, -4), (4, -2), &[(6, -2)], &loop_g);
            assert!(loop_g.stone_at(op(&loop_g, 6, -2)).is_none(), "Zet 4 begint door het vak dat Zet 3 leeg liet");
            assert!(zetten.iter().all(|z| rij(&basis, op(&basis, (z.1).0, (z.1).1)) >= 2), "de vier steenlandingen liggen in rij 2 tot en met 4: je eigen helft");
            let mut van: Vec<(i32, i32)> = zetten.iter().map(|z| z.0).collect();
            van.sort_unstable();
            van.dedup();
            assert_eq!(van.len(), 4, "vier verschillende stenen");
            // Twee plaatjes: de vier stenen die gaan (genummerd in de volgorde van de Zetten), en waar ze na vier Zetten staan.
            let starts: Vec<usize> = zetten.iter().map(|&((a, b), _, _)| op(&basis, a, b)).collect();
            let landingen: Vec<usize> = zetten.iter().map(|&(_, (c, d), _)| op(&basis, c, d)).collect();
            let uitsnede: Vec<usize> = basis.start_cells(0).iter().copied().chain(landingen.iter().copied()).collect();
            let mut voor = leeg(basis.clone());
            voor.landingen = starts;
            voor.uitsnede = uitsnede.clone();
            klaar.push(("guide-opening-four-before.svg".into(), teken("guide-opening-four-before", &voor)));
            let mut na = leeg(g.clone());
            na.landingen = landingen;
            na.uitsnede = uitsnede;
            klaar.push(("guide-opening-four-after.svg".into(), teken("guide-opening-four-after", &na)));
        }

        // e. Fout 1: elke beurt dezelfde steen. 4 Zetten, 5 rijen (tegen 13).
        {
            let zetten = [((6, -4), (4, -4), 2), ((4, -4), (3, -4), 1), ((3, -4), (2, -4), 1), ((2, -4), (1, -4), 1)];
            let mut g = basis.clone();
            speel(&mut g, &zetten);
            assert_eq!(zetten.iter().map(|z| z.2).sum::<i32>(), 5);
            let mut p = leeg(basis.clone());
            p.gekozen = Some(op(&basis, 6, -4));
            let pad: Vec<usize> = std::iter::once(zetten[0].0).chain(zetten.iter().map(|z| z.1)).map(|(a, b)| op(&basis, a, b)).collect();
            p.pijlen = pad.windows(2).map(|w| (w[0], w[1])).collect();
            p.landingen = pad[1..].to_vec();
            p.uitsnede = basis.start_cells(0).iter().copied().chain(pad.iter().copied()).collect();
            klaar.push(("guide-opening-runner.svg".into(), teken("guide-opening-runner", &p)));
        }

        // f. Fout 2: alleen stappen met de voorste rij. 4 Zetten, 4 rijen, en de steen in de punt kan daarna nog niet weg.
        {
            let mut g = basis.clone();
            speel(&mut g, &[((5, -4), (4, -4), 1), ((5, -3), (4, -3), 1), ((5, -2), (4, -2), 1), ((5, -1), (4, -1), 1)]);
            let tip = op(&g, 8, -4);
            assert!(g.destinations(tip).is_empty(), "de steen in de punt kan nog steeds niet weg");
        }

        // g. Fout 3: opzij stappen. Na de eerste Zet van opening 1 kan de steen vooraan één vak langs de rij stappen: 0 rijen.
        {
            let mut g = basis.clone();
            speel(&mut g, &[((6, -4), (4, -4), 2)]);
            let (van, opzij) = (op(&g, 4, -4), op(&g, 4, -3));
            assert!(g.step_destinations(van).contains(&opzij));
            assert_eq!(winst(&g, van, opzij), 0, "een stap langs de rij schuift niets op");
        }
    }

    // Taak 314 (feature 311): twee korte antwoordpagina's, /rules/can-you-move-backwards-in-chinese-checkers en
    // /rules/can-you-jump-your-own-piece-in-chinese-checkers. Een rij is alle vakken met dezelfde `q`; Rood (Speler 1) gaat van rij 5 tot 8
    // naar rij -5 tot -8, dus vooruit is een lagere `q` en achteruit een hogere.
    {
        let rij = |g: &Game, c: usize| g.board().coords(c).0;
        let basis = Game::new_star(2).unwrap();
        assert!(basis.start_cells(0).iter().all(|&c| rij(&basis, c) >= 5) && basis.goal_cells(0).iter().all(|&c| rij(&basis, c) <= -5));
        // Niets in `destinations`, `step_destinations` of `next_jumps` kijkt naar de richting: elke buur telt, voor een stap en voor een Sprong.
        // Een steen heeft zes buren (taak 116), dus ook de drie die achteruit of opzij liggen.

        // a. Achteruit: een Sprong achteruit is de eerste schakel van een keten die uiteindelijk ver vooruit komt.
        {
            let game = stand(2, &[(2, 0, 0), (3, -1, 1), (3, -2, 1), (1, -2, 1)], 0);
            let route = [(2, 0), (4, -2), (2, -2), (0, -2)].map(|(q, r)| vak(&game, q, r));
            let van = route[0];
            // Een stap achteruit mag ook: (3, 0) ligt in een hogere rij en is leeg.
            let stap = vak(&game, 3, 0);
            assert!(rij(&game, stap) > rij(&game, van) && game.step_destinations(van).contains(&stap), "een stap achteruit mag");
            // De eerste Sprong gaat achteruit: van rij 2 naar rij 4. De ketting daarna gaat vooruit.
            assert!(rij(&game, route[1]) > rij(&game, van), "de eerste Sprong gaat achteruit");
            assert!(game.next_jumps(van, van, &[]).contains(&route[1]), "een Sprong achteruit mag");
            for w in route.windows(2) {
                assert!(game.next_jumps(van, w[0], &route[..1]).contains(&w[1]), "elke schakel is een Sprong");
            }
            let doel = route[3];
            assert!(rij(&game, doel) < rij(&game, van), "het eind van de keten ligt twee rijen vooruit");
            assert!(game.destinations(van).contains(&doel));
            assert_eq!(move_path(game.board(), &stand_vec(&game), van, doel).unwrap(), route.to_vec(), "dit is de kortste keten");
            // Zonder die Sprong achteruit kom je daar niet: haal de steen weg waar je overheen springt, en het eind is niet meer te halen.
            let zonder = stand(2, &[(2, 0, 0), (3, -2, 1), (1, -2, 1)], 0);
            assert!(!zonder.destinations(vak(&zonder, 2, 0)).contains(&vak(&zonder, 0, -2)));
            // En het is een echte Zet van Rood, die de andere stenen laat staan.
            let mut speel = game.clone();
            speel.make_move(van, doel).expect("de keten is een geldige Zet");
            assert!(speel.stone_at(van).is_none() && speel.stone_at(doel) == Some(0) && speel.stone_at(route[1]).is_none());
            assert!([(3, -1), (3, -2), (1, -2)].iter().all(|&(q, r)| speel.stone_at(vak(&speel, q, r)) == Some(1)), "de stenen waar je overheen springt blijven staan");
            let mut p = leeg(game);
            p.gekozen = Some(van);
            p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
            p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
            p.landingen = route[1..].to_vec();
            p.omkeren = vec![0, 1];
            klaar.push(("answer-backward.svg".into(), teken("answer-backward", &p)));
        }

        // b. Je eigen steen: je springt over elke steen, van welke Speler ook, en een keten mag over eigen en andere stenen gaan.
        {
            let game = stand(2, &[(3, 0, 0), (2, 0, 0), (0, 1, 1)], 0);
            let route = [(3, 0), (1, 0), (-1, 2)].map(|(q, r)| vak(&game, q, r));
            let eigen = vak(&game, 2, 0);
            assert_eq!(game.stone_at(eigen), Some(0), "de steen waar je overheen springt is van jezelf");
            assert!(game.next_jumps(route[0], route[0], &[]).contains(&route[1]), "een Sprong over je eigen steen mag");
            assert!(game.next_jumps(route[0], route[1], &route[..1]).contains(&route[2]), "daarna een Sprong over een steen van de ander");
            assert!(game.destinations(route[0]).contains(&route[2]));
            assert_eq!(move_path(game.board(), &stand_vec(&game), route[0], route[2]).unwrap(), route.to_vec(), "dit is de kortste keten");
            // De eigen steen blijft staan.
            let mut speel = game.clone();
            speel.make_move(route[0], route[2]).expect("de keten is een geldige Zet");
            assert_eq!(speel.stone_at(eigen), Some(0), "de steen waar je overheen sprong blijft staan");
            assert!(speel.stone_at(route[0]).is_none() && speel.stone_at(route[2]) == Some(0));
            // Twee stenen achter elkaar kun je niet springen: er moet een leeg vak achter de steen zijn.
            let twee = stand(2, &[(3, 0, 0), (2, 0, 0), (1, 0, 0)], 0);
            let van = vak(&twee, 3, 0);
            assert!(twee.next_jumps(van, van, &[]).is_empty(), "twee eigen stenen achter elkaar: geen Sprong");
            // Zonder steen ernaast is er niets om overheen te springen.
            let alleen = stand(2, &[(3, 0, 0)], 0);
            assert!(alleen.next_jumps(vak(&alleen, 3, 0), vak(&alleen, 3, 0), &[]).is_empty());
            let mut p = leeg(game);
            p.gekozen = Some(route[0]);
            p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
            p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
            p.landingen = route[1..].to_vec();
            klaar.push(("answer-own-piece.svg".into(), teken("answer-own-piece", &p)));
        }
    }

    // Taak 315 (feature 311): /rules/can-you-jump-over-your-opponent-in-chinese-checkers. Vooruit is voor Rood een lagere `q`.
    // De pagina zegt: je springt over stenen van de ander (ook twee in één Zet), er wordt niets geslagen, je hoeft niet te springen,
    // stenen gaan alleen van het bord als hun Speler opgeeft, de ander springt net zo over jouw stenen, en twee stenen op een rij springt niemand.
    {
        let rij = |g: &Game, c: usize| g.board().coords(c).0;
        let game = stand(2, &[(3, -1, 0), (2, -1, 1), (0, -1, 1)], 0);
        let route = [(3, -1), (1, -1), (-1, -1)].map(|(q, r)| vak(&game, q, r));
        let blauw = [(2, -1), (0, -1)].map(|(q, r)| vak(&game, q, r));
        for w in route.windows(2) {
            assert!(game.next_jumps(route[0], w[0], &route[..1]).contains(&w[1]), "elke schakel is een Sprong over een steen van Blauw");
        }
        assert!(game.destinations(route[0]).contains(&route[2]));
        assert_eq!(move_path(game.board(), &stand_vec(&game), route[0], route[2]).unwrap(), route.to_vec(), "dit is de kortste keten");
        assert!(rij(&game, route[2]) == rij(&game, route[0]) - 4, "de keten komt vier rijen vooruit");
        // Niets wordt geslagen: na de Zet staan beide stenen van Blauw er nog, en elke Speler heeft evenveel stenen.
        let tel = |g: &Game, s: usize| (0..g.board().len()).filter(|&c| g.stone_at(c) == Some(s)).count();
        let mut speel = game.clone();
        speel.make_move(route[0], route[2]).expect("de keten is een geldige Zet");
        assert!(blauw.iter().all(|&c| speel.stone_at(c) == Some(1)), "de stenen van Blauw blijven staan");
        assert_eq!((tel(&speel, 0), tel(&speel, 1)), (tel(&game, 0), tel(&game, 1)), "niemand verliest een steen");
        // Springen hoeft niet: met dezelfde Sprong klaar staat een stap ook, en die is een geldige Zet.
        let stap = game.step_destinations(route[0])[0];
        game.clone().make_move(route[0], stap).expect("een stap mag, ook als er een Sprong kan");
        // Een steen gaat alleen van het bord als zijn Speler opgeeft: dan gaan al zijn stenen weg.
        let mut opgeven = game.clone();
        opgeven.resign(1).unwrap();
        assert_eq!(tel(&opgeven, 1), 0, "opgeven haalt de stenen van die Speler weg");
        // Het werkt ook andersom: Blauw springt over een steen van Rood.
        let andersom = stand(2, &[(0, 0, 1), (1, 0, 0)], 1);
        let van = vak(&andersom, 0, 0);
        assert!(andersom.next_jumps(van, van, &[]).contains(&vak(&andersom, 2, 0)), "Blauw springt over Rood");
        // Twee stenen op een rij, van welke kleur ook, springt niemand: het vak erachter is niet leeg.
        let rijtje = stand(2, &[(3, 0, 0), (2, 0, 1), (1, 0, 0)], 0);
        assert!(rijtje.next_jumps(vak(&rijtje, 3, 0), vak(&rijtje, 3, 0), &[]).is_empty(), "twee stenen op een rij: geen Sprong");
        let mut p = leeg(game);
        p.gekozen = Some(route[0]);
        p.pijlen = route.windows(2).map(|w| (w[0], w[1])).collect();
        p.uitsnede = (0..p.game.board().len()).filter(|&c| p.game.stone_at(c).is_some()).chain(route.iter().copied()).collect();
        p.landingen = route[1..].to_vec();
        klaar.push(("answer-opponent.svg".into(), teken("answer-opponent", &p)));
    }

    // 23. Leapstone in cijfers (taak 320, feature 313): /guides/chinese-checkers-by-the-numbers. De getallen komen uit
    // `halma_core::cijfers`; web/regels/cijfers.json bevat ze, en de Rust-test `cijfers_json_klopt` en web/src/regels.test.ts bewaken dat.
    {
        // a. De langste Sprongketen in één Zet: één Steen van Rood springt over 36 Stenen van een ander (één op elk middenvak).
        {
            let board = Board::star();
            let pad = halma_core::cijfers::langste_sprongketen(&board);
            assert_eq!(pad.len() - 1, 36, "de langste Sprongketen is 36 Sprongen");
            let mut stenen = vec![None; board.len()];
            stenen[pad[0]] = Some(0);
            for w in pad.windows(2) {
                stenen[halma_core::cijfers::middenvak(&board, w[0], w[1]).unwrap()] = Some(1);
            }
            assert_eq!(stenen.iter().flatten().count(), 37, "één Steen springt en 36 Stenen liggen eronder");
            let game = Game::from_position(board, 6, stenen, 0).unwrap();
            let mut bezocht = Vec::new();
            for w in pad.windows(2) {
                assert!(game.next_jumps(pad[0], w[0], &bezocht).contains(&w[1]), "elke schakel is een Sprong");
                bezocht.push(w[1]);
            }
            assert!(game.destinations(pad[0]).contains(pad.last().unwrap()));
            let mut p = leeg(game);
            p.gekozen = Some(pad[0]);
            p.pijlen = pad.windows(2).map(|w| (w[0], w[1])).collect();
            klaar.push(("numbers-longest-chain.svg".into(), teken("numbers-longest-chain", &p)));
        }

        // b. Eén Speler alleen op het Sterbord: zijn 10 Stenen in het begin en het punt waar ze naartoe moeten (27 Zetten).
        {
            let begin = Game::new_star(2).unwrap();
            let stenen = (0..begin.board().len()).map(|c| (begin.stone_at(c) == Some(0)).then_some(0)).collect();
            let game = Game::from_position(Board::star(), 2, stenen, 0).unwrap();
            assert_eq!(aantal_stenen(&game), 10, "één Speler alleen: 10 Stenen");
            let mut p = leeg(game);
            p.doel_van = Some(0);
            klaar.push(("numbers-alone.svg".into(), teken("numbers-alone", &p)));
        }
    }

    for (naam, svg) in klaar {
        fs::write(uit.join(&naam), svg).unwrap_or_else(|e| panic!("{naam}: {e}"));
        println!("{}", uit.join(&naam).display());
    }
}

fn aantal_stenen(game: &Game) -> usize {
    (0..game.board().len()).filter(|&c| game.stone_at(c).is_some()).count()
}

/// Een stand op een nieuw bord waarin Speler 1 nog één stap van het doel af is: alle doelvakken vol behalve één,
/// en de laatste steen staat ernaast, buiten het doel. De andere Spelers staan op hun beginpunt.
/// Geeft de stand, het vak van de laatste steen en het lege doelvak.
fn bijna_klaar(board: Board, n: usize) -> (Game, usize, usize) {
    let basis = Game::new(board.clone(), n).unwrap();
    let doel = basis.goal_cells(0).to_vec();
    let (leeg_vak, buiten) = doel
        .iter()
        .find_map(|&g| (0..board.directions()).filter_map(|d| board.neighbor(g, d)).find(|b| !doel.contains(b)).map(|b| (g, b)))
        .expect("een doelvak met een buurvak buiten het doel");
    let mut stenen = vec![None; board.len()];
    for p in 1..n {
        for &c in basis.start_cells(p) {
            stenen[c] = Some(p);
        }
    }
    for &c in &doel {
        stenen[c] = Some(0);
    }
    stenen[leeg_vak] = None;
    stenen[buiten] = Some(0);
    (Game::from_position(board, n, stenen, 0).unwrap(), buiten, leeg_vak)
}

fn stand_vec(game: &Game) -> Vec<Option<usize>> {
    (0..game.board().len()).map(|c| game.stone_at(c)).collect()
}
