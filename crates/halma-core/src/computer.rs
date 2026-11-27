//! De Computerspeler: kiest een Zet voor de Speler die aan de beurt is.
//!
//! Hij gebruikt alleen de algemene regels (`Board`, `Game`), dus hij werkt op
//! elk bord. Voortgang van een Steen is de afstand over het bord vanaf het
//! startpunt van de Speler. Hoe verder, hoe beter.

use crate::board::Board;
use crate::game::{Game, PlayerState, destinations_on};

/// Hoe sterk de Computerspeler speelt.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Level {
    /// De beste van een paar willekeurige Zetten.
    Easy,
    /// De Zet met de meeste voortgang.
    Normal,
    /// Kijkt ook naar de antwoorden van de tegenstanders en de eigen volgende Zet.
    Hard,
}

impl Level {
    /// 0 = makkelijk, 1 = normaal, 2 of hoger = moeilijk.
    pub fn from_number(n: u32) -> Level {
        match n {
            0 => Level::Easy,
            1 => Level::Normal,
            _ => Level::Hard,
        }
    }
}

/// Een kleine, snelle toevalsgenerator (xorshift). Geen extra pakket nodig.
#[derive(Debug, Clone)]
pub struct Rng(u64);

impl Rng {
    pub fn new(seed: u64) -> Rng {
        Rng(seed.wrapping_mul(0x9E37_79B9_7F4A_7C15) | 1)
    }

    fn next(&mut self) -> u64 {
        let mut x = self.0;
        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;
        self.0 = x;
        x
    }

    /// Een getal van 0 tot `n` (niet inbegrepen).
    fn below(&mut self, n: usize) -> usize {
        (self.next() % n as u64) as usize
    }

    /// Een klein getal van 0 tot 1, voor het breken van gelijke scores.
    fn noise(&mut self) -> f64 {
        (self.next() >> 11) as f64 / (1u64 << 53) as f64
    }
}

#[derive(Clone, Copy)]
struct Move {
    from: usize,
    to: usize,
    score: f64,
}

/// Per Speler de voortgang van elk vak: hoe ver het vak van het startpunt en hoe dicht bij het doel ligt.
struct Progress {
    per_player: Vec<Vec<f64>>,
    max: Vec<f64>,
}

impl Progress {
    fn new(game: &Game) -> Progress {
        let board = game.board();
        let mut per_player = Vec::new();
        let mut max = Vec::new();
        for p in 0..game.player_count() {
            // Vooral de afstand tot het doel, met een beetje afstand vanaf het startpunt.
            // Alleen de afstand vanaf het startpunt geeft vlakke stukken op het
            // Vierkant bord (schuine stappen), waar achterblijvers dan blijven staan.
            let from_start = distances(board, game.start_cells(p));
            let to_goal = distances(board, game.goal_cells(p));
            let d: Vec<f64> = from_start
                .iter()
                .zip(&to_goal)
                .map(|(a, b)| 0.3 * a - b)
                .collect();
            // Het doel is het verste stuk van het bord: neem de grootste afstand binnen het doel.
            let top = game.goal_cells(p).iter().map(|&c| d[c]).fold(0.0, f64::max);
            per_player.push(d);
            max.push(top);
        }
        Progress { per_player, max }
    }
}

/// Afstand in stappen over de buren, vanaf een groep vakken.
fn distances(board: &Board, sources: &[usize]) -> Vec<f64> {
    let mut dist = vec![f64::INFINITY; board.len()];
    let mut queue = std::collections::VecDeque::new();
    for &s in sources {
        dist[s] = 0.0;
        queue.push_back(s);
    }
    while let Some(at) = queue.pop_front() {
        for dir in 0..board.directions() {
            if let Some(n) = board.neighbor(at, dir) {
                if dist[n] == f64::INFINITY {
                    dist[n] = dist[at] + 1.0;
                    queue.push_back(n);
                }
            }
        }
    }
    dist
}

/// Alle Zetten van een Speler in een stand, met hun score.
fn moves_for(game: &Game, prog: &Progress, stones: &[Option<usize>], player: usize) -> Vec<Move> {
    let p = &prog.per_player[player];
    let in_goal = game.goal_cells(player);
    let mut moves = Vec::new();
    let trapped_before = trapped(game, stones, player);
    for from in 0..stones.len() {
        if stones[from] != Some(player) {
            continue;
        }
        // Wie achterblijft moet vooruit: kleine bonus voor het verzetten van achterste Stenen.
        let lag = 0.05 * (prog.max[player] - p[from]).max(0.0);
        for to in destinations_on(game.board(), stones, from) {
            let mut score = p[to] - p[from] + lag;
            // Een Steen die al in het doel staat, verlaat dat niet voor een kleine winst.
            if in_goal.contains(&from) && !in_goal.contains(&to) {
                score -= 2.0;
            }
            // Sluit de Zet een tegenstander op in mijn doel? Dan kan hij nooit weg en geraken we vast.
            // Maakt de Zet er juist een vrij, dan is dat een beetje goed.
            if trapped_before > 0 || p[to] > p[from] - 1.0 {
                let mut after = stones.to_vec();
                after[from] = None;
                after[to] = Some(player);
                // Opsluiten kost meer dan vrijlaten oplevert, anders gaat hij heen en weer.
                let change = trapped(game, &after, player) as f64 - trapped_before as f64;
                score -= if change > 0.0 {
                    3.0 * change
                } else {
                    1.0 * change
                };
            }
            moves.push(Move { from, to, score });
        }
    }
    moves
}

/// Het aantal Stenen van tegenstanders in het doel van `player` dat niet meer kan bewegen.
fn trapped(game: &Game, stones: &[Option<usize>], player: usize) -> usize {
    game.goal_cells(player)
        .iter()
        .filter(|&&c| stones[c].is_some_and(|o| o != player))
        .filter(|&&c| destinations_on(game.board(), stones, c).is_empty())
        .count()
}

fn best_score(moves: &[Move]) -> f64 {
    moves
        .iter()
        .map(|m| m.score)
        .fold(f64::NEG_INFINITY, f64::max)
}

fn apply(stones: &mut [Option<usize>], m: &Move, player: usize) {
    stones[m.from] = None;
    stones[m.to] = Some(player);
}

/// Kies een Zet voor de Speler die aan de beurt is: `(van, naar)`.
/// Geeft `None` als het Potje is afgelopen of de Speler niet kan zetten.
pub fn choose_move(game: &Game, level: Level, rng: &mut Rng) -> Option<(usize, usize)> {
    if game.is_over() {
        return None;
    }
    let me = game.current_player();
    let stones: Vec<Option<usize>> = (0..game.board().len()).map(|c| game.stone_at(c)).collect();
    let prog = Progress::new(game);
    let mut moves = moves_for(game, &prog, &stones, me);
    if moves.is_empty() {
        return None;
    }
    // Kleine ruis: gelijke Zetten worden willekeurig gekozen, zodat de Computerspeler niet heen en weer blijft gaan.
    for m in &mut moves {
        m.score += rng.noise() * 0.01;
    }
    let chosen = match level {
        Level::Easy => {
            let mut best: Option<Move> = None;
            for _ in 0..3 {
                let m = moves[rng.below(moves.len())];
                if best.is_none_or(|b| m.score > b.score) {
                    best = Some(m);
                }
            }
            best?
        }
        Level::Normal => *moves.iter().max_by(|a, b| a.score.total_cmp(&b.score))?,
        Level::Hard => hard(game, &prog, &stones, me, &mut moves),
    };
    Some((chosen.from, chosen.to))
}

/// Moeilijk: van de beste Zetten kijkt hij hoe de tegenstanders antwoorden
/// en wat zijn eigen volgende Zet dan oplevert.
fn hard(
    game: &Game,
    prog: &Progress,
    stones: &[Option<usize>],
    me: usize,
    moves: &mut [Move],
) -> Move {
    const CANDIDATES: usize = 16;
    moves.sort_by(|a, b| b.score.total_cmp(&a.score));
    let others: Vec<usize> = (1..game.player_count())
        .map(|i| (me + i) % game.player_count())
        .filter(|&p| game.player_state(p) == Some(PlayerState::Playing))
        .collect();
    let mut best = moves[0];
    let mut best_value = f64::NEG_INFINITY;
    for &m in moves.iter().take(CANDIDATES) {
        let mut s = stones.to_vec();
        apply(&mut s, &m, me);
        let mut value = m.score;
        for &o in &others {
            let replies = moves_for(game, prog, &s, o);
            if let Some(r) = replies.iter().max_by(|a, b| a.score.total_cmp(&b.score)) {
                value -= 0.3 * r.score.max(0.0);
                apply(&mut s, r, o);
            }
        }
        let next = moves_for(game, prog, &s, me);
        if !next.is_empty() {
            value += 0.5 * best_score(&next).max(0.0);
        }
        if value > best_value {
            best_value = value;
            best = m;
        }
    }
    best
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;

    /// Speelt een heel Potje; geeft (winnaar, aantal Zetten, langste tijd per Zet in ms).
    fn play(
        players: usize,
        levels: &[Level],
        seed: u64,
        max_moves: usize,
    ) -> (Option<usize>, usize, f64) {
        let mut game = Game::new_star(players).unwrap();
        let mut rng = Rng::new(seed);
        let mut moves = 0;
        let mut slowest = 0.0f64;
        // De winnaar staat vast zodra de eerste Speler klaar is.
        while game.winner().is_none() && moves < max_moves {
            let level = levels[game.current_player() % levels.len()];
            let t = Instant::now();
            let (from, to) = choose_move(&game, level, &mut rng).expect("er is een Zet");
            slowest = slowest.max(t.elapsed().as_secs_f64() * 1000.0);
            game.make_move(from, to).expect("de Zet is geldig");
            moves += 1;
        }
        (game.winner(), moves, slowest)
    }

    #[test]
    fn altijd_een_geldige_zet_bij_2_3_4_en_6_spelers() {
        for players in [2, 3, 4, 6] {
            for level in [Level::Easy, Level::Normal, Level::Hard] {
                let mut game = Game::new_star(players).unwrap();
                let mut rng = Rng::new(7);
                for _ in 0..players * 15 {
                    let (from, to) = choose_move(&game, level, &mut rng).unwrap();
                    game.make_move(from, to).unwrap();
                }
            }
        }
    }

    #[test]
    fn geen_zet_na_afloop() {
        let mut game = Game::new_star(2).unwrap();
        game.resign(1).unwrap();
        assert!(choose_move(&game, Level::Normal, &mut Rng::new(1)).is_none());
    }

    #[test]
    fn potje_van_computerspelers_eindigt_met_een_winnaar() {
        for players in [2, 3, 4, 6] {
            let (winner, moves, _) = play(players, &[Level::Normal], 11, 1500 * players);
            assert!(
                winner.is_some(),
                "{players} spelers: geen winnaar na {moves} zetten"
            );
        }
        let (winner, moves, _) = play(2, &[Level::Hard], 5, 3000);
        assert!(winner.is_some(), "moeilijk: geen winnaar na {moves} zetten");
    }

    /// Aantal winsten van `strong` tegen `weak` in `games` potjes (om en om beginnen).
    fn wins(strong: Level, weak: Level, games: u64) -> u64 {
        (0..games)
            .filter(|&i| {
                let levels = if i % 2 == 0 {
                    [strong, weak]
                } else {
                    [weak, strong]
                };
                let (winner, _, _) = play(2, &levels, 100 + i, 3000);
                winner == Some((i % 2) as usize)
            })
            .count() as u64
    }

    #[test]
    fn normaal_wint_van_makkelijk_in_de_meeste_van_20_potjes() {
        let won = wins(Level::Normal, Level::Easy, 20);
        println!("normaal tegen makkelijk: {won}/20");
        assert!(won >= 15, "normaal won maar {won} van 20");
    }

    #[test]
    fn moeilijk_wint_van_normaal_in_de_meeste_potjes() {
        let won = wins(Level::Hard, Level::Normal, 10);
        println!("moeilijk tegen normaal: {won}/10");
        assert!(won >= 6, "moeilijk won maar {won} van 10");
    }

    #[test]
    #[ignore = "meet echte tijd en faalt op een drukke machine; scripts/volledige-check.sh draait hem apart"]
    fn zet_kiezen_kost_weinig_tijd() {
        // Zes Spelers is het zwaarst; de grens is ruim, want deze test draait ook in een debug-build.
        let (_, _, slowest) = play(6, &[Level::Hard], 3, 120);
        println!("langste zet (moeilijk, 6 spelers): {slowest:.2} ms");
        assert!(slowest < 500.0, "een zet duurde {slowest} ms");
    }

    #[test]
    fn computerspelers_maken_een_potje_op_het_vierkante_bord_af() {
        for (players, level, seed) in [
            (2, Level::Normal, 3),
            (2, Level::Normal, 21),
            (2, Level::Hard, 5),
            (4, Level::Normal, 3),
        ] {
            let mut game = Game::new_square(players).unwrap();
            let mut rng = Rng::new(seed);
            let mut moves = 0;
            while !game.is_over() && game.winner().is_none() && moves < 3000 * players {
                let (from, to) = choose_move(&game, level, &mut rng).expect("er is een Zet");
                game.make_move(from, to).expect("de Zet is geldig");
                moves += 1;
            }
            assert!(
                game.winner().is_some(),
                "{players} spelers: geen winnaar na {moves} zetten"
            );
        }
    }
}
