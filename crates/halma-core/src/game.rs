//! Een Potje: stand, beurten, Zetten, opgeven en winst.

use crate::board::Board;
use std::fmt;

/// Wat een Speler op dit moment doet.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PlayerState {
    /// Speelt nog mee.
    Playing,
    /// Heeft alle stenen in de doelpunt.
    Finished,
    /// Heeft opgegeven.
    Resigned,
}

/// Waarom een Zet of actie is geweigerd.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MoveError {
    GameOver,
    NoSuchCell,
    NoSuchPlayer,
    /// Op het startvak staat geen steen van de Speler die aan de beurt is.
    NotYourStone,
    /// De steen kan niet naar dat vak met een stap of Sprong.
    InvalidDestination,
    /// De Speler speelt niet meer mee.
    NotPlaying,
}

impl fmt::Display for MoveError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let text = match self {
            MoveError::GameOver => "het potje is afgelopen",
            MoveError::NoSuchCell => "dat vak bestaat niet",
            MoveError::NoSuchPlayer => "die speler bestaat niet",
            MoveError::NotYourStone => "dat is geen steen van de speler aan de beurt",
            MoveError::InvalidDestination => "de steen kan niet naar dat vak",
            MoveError::NotPlaying => "de speler speelt niet meer mee",
        };
        f.write_str(text)
    }
}

impl std::error::Error for MoveError {}

/// Een Potje op een bord. Spelers hebben nummer 0, 1, 2, ... in beurtvolgorde.
#[derive(Debug, Clone)]
pub struct Game {
    board: Board,
    /// Per Speler: het startpunt.
    start_points: Vec<usize>,
    /// Per vak: de Speler wiens steen er staat.
    stones: Vec<Option<usize>>,
    state: Vec<PlayerState>,
    current: usize,
    /// Spelers in volgorde van winst. Zie `ranking`.
    ranking: Vec<usize>,
    over: bool,
}

impl Game {
    /// Start een Potje op het Sterbord voor 2, 3, 4 of 6 Spelers.
    pub fn new_star(players: usize) -> Option<Game> {
        Game::new(Board::star(), players)
    }

    /// Start een Potje op het Vierkant bord voor 2 of 4 Spelers.
    pub fn new_square(players: usize) -> Option<Game> {
        Game::new(Board::square(), players)
    }

    /// Start een Potje op een bord, als het bord dit aantal Spelers kent.
    pub fn new(board: Board, players: usize) -> Option<Game> {
        let start_points = board.start_points(players)?.to_vec();
        let mut stones = vec![None; board.len()];
        for (player, &point) in start_points.iter().enumerate() {
            for &cell in board.point(point) {
                stones[cell] = Some(player);
            }
        }
        Some(Game {
            board,
            start_points,
            stones,
            state: vec![PlayerState::Playing; players],
            current: 0,
            ranking: Vec::new(),
            over: false,
        })
    }

    /// Een Potje vanuit een bekende stand, om de geldige Zetten van die stand te tonen.
    /// `stones` heeft per vak de Speler met een steen. Alle Spelers spelen nog mee.
    /// Geeft niets terug als de stand niet bij het bord en het aantal Spelers past.
    pub fn from_position(
        board: Board,
        players: usize,
        stones: Vec<Option<usize>>,
        current: usize,
    ) -> Option<Game> {
        let mut game = Game::new(board, players)?;
        if stones.len() != game.board.len()
            || current >= players
            || stones.iter().flatten().any(|&p| p >= players)
        {
            return None;
        }
        game.stones = stones;
        game.current = current;
        Some(game)
    }

    pub fn board(&self) -> &Board {
        &self.board
    }

    pub fn player_count(&self) -> usize {
        self.state.len()
    }

    /// De Speler wiens steen op `cell` staat.
    pub fn stone_at(&self, cell: usize) -> Option<usize> {
        self.stones.get(cell).copied().flatten()
    }

    /// De vakken van het doel van een Speler.
    pub fn goal_cells(&self, player: usize) -> &[usize] {
        let point = self.board.opposite_point(self.start_points[player]);
        self.board.point(point)
    }

    /// De vakken waar een Speler begon.
    pub fn start_cells(&self, player: usize) -> &[usize] {
        self.board.point(self.start_points[player])
    }

    pub fn player_state(&self, player: usize) -> Option<PlayerState> {
        self.state.get(player).copied()
    }

    /// De Speler die aan de beurt is. Na afloop: de laatst aan de beurt geweest.
    pub fn current_player(&self) -> usize {
        self.current
    }

    pub fn is_over(&self) -> bool {
        self.over
    }

    /// Spelers in volgorde van winst. Eerst wie als eerste alle stenen in de
    /// doelpunt kreeg. Blijft er één Speler over zonder de doelpunt te halen
    /// (de anderen gaven op), dan komt die achteraan, of vooraan als er nog niemand is.
    /// Zo is `ranking()[0]` na afloop altijd de winnaar.
    pub fn ranking(&self) -> &[usize] {
        &self.ranking
    }

    /// De winnaar. Bij 3 of meer Spelers staat de winnaar al vast
    /// zodra de eerste Speler klaar is, ook als de rest nog doorspeelt.
    pub fn winner(&self) -> Option<usize> {
        self.ranking.first().copied()
    }

    /// De vakken waar de steen op `cell` heen kan: een stap of een Sprongketen.
    /// Geeft niets terug als er geen steen staat. Controleert niet wie aan de beurt is.
    pub fn destinations(&self, cell: usize) -> Vec<usize> {
        destinations_on(&self.board, &self.stones, cell)
    }

    /// De vakken waar de steen op `cell` met een Stap heen kan: de lege buurvakken.
    /// Geeft niets terug als er geen steen staat.
    pub fn step_destinations(&self, cell: usize) -> Vec<usize> {
        step_destinations_on(&self.board, &self.stones, cell)
    }

    /// De vakken waar een steen die deze Zet op `start` begon, vanaf `at` met precies
    /// één Sprong kan landen, zonder een vak in `visited` (het startvak telt altijd als bezocht).
    /// Zo kan de app een Sprongketen Sprong voor Sprong spelen. Elk eindvak van zo'n keten
    /// is ook een geldige bestemming van `destinations(start)`.
    pub fn next_jumps(&self, start: usize, at: usize, visited: &[usize]) -> Vec<usize> {
        if self.stones.get(start).copied().flatten().is_none() || at >= self.board.len() {
            return Vec::new();
        }
        let mut result: Vec<usize> = jumps(&self.board, &self.stones, start, at)
            .filter(|&land| land != start && !visited.contains(&land))
            .collect();
        result.sort_unstable();
        result.dedup();
        result
    }

    /// De Speler die aan de beurt is verzet de steen van `from` naar `to`.
    pub fn make_move(&mut self, from: usize, to: usize) -> Result<(), MoveError> {
        if self.over {
            return Err(MoveError::GameOver);
        }
        if from >= self.board.len() || to >= self.board.len() {
            return Err(MoveError::NoSuchCell);
        }
        if self.stones[from] != Some(self.current) {
            return Err(MoveError::NotYourStone);
        }
        if !self.destinations(from).contains(&to) {
            return Err(MoveError::InvalidDestination);
        }
        self.stones[from] = None;
        self.stones[to] = Some(self.current);

        let player = self.current;
        if self
            .goal_cells(player)
            .iter()
            .all(|&c| self.stones[c] == Some(player))
        {
            self.state[player] = PlayerState::Finished;
            self.ranking.push(player);
        }
        self.after_turn(true);
        Ok(())
    }

    /// Een Speler geeft op. Zijn stenen gaan van het bord, zodat ze niemand blokkeren.
    /// Mag ook buiten de eigen beurt.
    pub fn resign(&mut self, player: usize) -> Result<(), MoveError> {
        if self.over {
            return Err(MoveError::GameOver);
        }
        match self.state.get(player) {
            None => return Err(MoveError::NoSuchPlayer),
            Some(PlayerState::Playing) => {}
            Some(_) => return Err(MoveError::NotPlaying),
        }
        self.state[player] = PlayerState::Resigned;
        for stone in self.stones.iter_mut().filter(|s| **s == Some(player)) {
            *stone = None;
        }
        self.after_turn(false);
        Ok(())
    }

    /// De Speler aan de beurt slaat de beurt over (denktijd op). Er verandert niets op het bord.
    /// De beurt gaat naar de volgende Speler die nog meespeelt.
    pub fn skip_turn(&mut self) -> Result<(), MoveError> {
        if self.over {
            return Err(MoveError::GameOver);
        }
        self.after_turn(true);
        Ok(())
    }

    /// De hele stand als korte tekst, om te bewaren zonder de Zetten opnieuw af te spelen.
    /// Terug te lezen met [`Game::from_snapshot`] op hetzelfde bord en aantal Spelers.
    /// Vorm: `1|beurt|afgelopen|toestand per Speler|eindvolgorde|steen per vak`.
    pub fn snapshot(&self) -> String {
        let state: String = self
            .state
            .iter()
            .map(|s| match s {
                PlayerState::Playing => 'p',
                PlayerState::Finished => 'f',
                PlayerState::Resigned => 'r',
            })
            .collect();
        let ranking: Vec<String> = self.ranking.iter().map(|p| p.to_string()).collect();
        let stones: String = self
            .stones
            .iter()
            .map(|s| s.map_or('.', |p| char::from(b'0' + p as u8)))
            .collect();
        format!(
            "1|{}|{}|{state}|{}|{stones}",
            self.current,
            u8::from(self.over),
            ranking.join(",")
        )
    }

    /// Een Potje uit een tekst van [`Game::snapshot`]. Geeft niets terug als de tekst niet
    /// bij het bord en het aantal Spelers past.
    pub fn from_snapshot(board: Board, players: usize, text: &str) -> Option<Game> {
        let mut game = Game::new(board, players)?;
        let parts: Vec<&str> = text.split('|').collect();
        let ["1", current, over, state, ranking, stones] = parts.as_slice() else {
            return None;
        };
        let current: usize = current.parse().ok()?;
        let over = match *over {
            "0" => false,
            "1" => true,
            _ => return None,
        };
        let state: Vec<PlayerState> = state
            .chars()
            .map(|c| match c {
                'p' => Some(PlayerState::Playing),
                'f' => Some(PlayerState::Finished),
                'r' => Some(PlayerState::Resigned),
                _ => None,
            })
            .collect::<Option<_>>()?;
        let ranking: Vec<usize> = if ranking.is_empty() {
            Vec::new()
        } else {
            ranking
                .split(',')
                .map(|p| p.parse().ok().filter(|&p| p < players))
                .collect::<Option<_>>()?
        };
        let stones: Vec<Option<usize>> = stones
            .chars()
            .map(|c| match c {
                '.' => Some(None),
                _ => c
                    .to_digit(10)
                    .map(|d| d as usize)
                    .filter(|&d| d < players)
                    .map(Some),
            })
            .collect::<Option<_>>()?;
        if current >= players
            || state.len() != players
            || stones.len() != game.board.len()
            || ranking.len() > players
        {
            return None;
        }
        game.current = current;
        game.over = over;
        game.state = state;
        game.ranking = ranking;
        game.stones = stones;
        Some(game)
    }

    /// Kijkt of het Potje is afgelopen. Geeft de beurt door als `advance` waar is
    /// of als de Speler aan de beurt niet meer meespeelt.
    fn after_turn(&mut self, advance: bool) {
        let playing: Vec<usize> = (0..self.state.len())
            .filter(|&p| self.state[p] == PlayerState::Playing)
            .collect();
        if playing.len() <= 1 {
            self.over = true;
            // De laatste Speler die overblijft staat achteraan, of als winnaar
            // als niemand de doelpunt haalde.
            self.ranking.extend(playing);
            return;
        }
        if advance || self.state[self.current] != PlayerState::Playing {
            let n = self.state.len();
            let mut next = (self.current + 1) % n;
            while self.state[next] != PlayerState::Playing {
                next = (next + 1) % n;
            }
            self.current = next;
        }
    }
}

/// De lege buurvakken van de steen op `cell`.
fn step_destinations_on(board: &Board, stones: &[Option<usize>], cell: usize) -> Vec<usize> {
    if stones.get(cell).copied().flatten().is_none() {
        return Vec::new();
    }
    let mut result: Vec<usize> = (0..board.directions())
        .filter_map(|dir| board.neighbor(cell, dir))
        .filter(|&n| stones[n].is_none())
        .collect();
    result.sort_unstable();
    result.dedup();
    result
}

/// De vakken waar de steen op `cell` heen kan, gegeven een bord en een stand.
/// Gedeeld met de Computerspeler, die zo Zetten kan proberen zonder een Potje te kopiëren.
pub(crate) fn destinations_on(board: &Board, stones: &[Option<usize>], cell: usize) -> Vec<usize> {
    if stones.get(cell).copied().flatten().is_none() {
        return Vec::new();
    }
    let mut result = step_destinations_on(board, stones, cell);
    // Sprongen: een keten, waarbij geen vak twee keer wordt bezocht.
    // Het startvak telt als bezocht.
    let mut visited = vec![false; board.len()];
    visited[cell] = true;
    let mut stack = vec![cell];
    while let Some(at) = stack.pop() {
        for land in jumps(board, stones, cell, at) {
            if !visited[land] {
                visited[land] = true;
                result.push(land);
                stack.push(land);
            }
        }
    }
    result.sort_unstable();
    result.dedup();
    result
}

/// De vakken waar een steen die op `start` begon vanaf `at` met één Sprong kan landen.
fn jumps<'a>(
    board: &'a Board,
    stones: &'a [Option<usize>],
    start: usize,
    at: usize,
) -> impl Iterator<Item = usize> + 'a {
    (0..board.directions()).filter_map(move |dir| {
        let over = board.neighbor(at, dir)?;
        let land = board.neighbor(over, dir)?;
        // Het startvak is leeg zodra de steen weg is, maar `over` kan het niet zijn:
        // dan zou de steen over zichzelf springen. Daarom `over != start`.
        (over != start && stones[over].is_some() && stones[land].is_none()).then_some(land)
    })
}

/// Het pad van een Zet, alleen om te tonen: `[from, to]` voor een stap, of elk vak
/// van een Sprongketen (de kortste). `None` als de Zet niet kan.
pub fn move_path(
    board: &Board,
    stones: &[Option<usize>],
    from: usize,
    to: usize,
) -> Option<Vec<usize>> {
    if stones.len() != board.len()
        || to >= board.len()
        || stones.get(from).copied().flatten().is_none()
    {
        return None;
    }
    if stones[to].is_some() {
        return None;
    }
    if (0..board.directions()).any(|dir| board.neighbor(from, dir) == Some(to)) {
        return Some(vec![from, to]);
    }
    // Zoek breed, zodat het pad zo min mogelijk Sprongen heeft.
    let mut came_from: Vec<Option<usize>> = vec![None; board.len()];
    let mut queue = std::collections::VecDeque::from([from]);
    came_from[from] = Some(from);
    while let Some(at) = queue.pop_front() {
        for land in jumps(board, stones, from, at) {
            if came_from[land].is_some() {
                continue;
            }
            came_from[land] = Some(at);
            if land == to {
                let mut path = vec![to];
                let mut c = to;
                while c != from {
                    c = came_from[c]?;
                    path.push(c);
                }
                path.reverse();
                return Some(path);
            }
            queue.push_back(land);
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Vak-nummer van een plek (kolom, rij).
    fn cell(game: &Game, q: i32, r: i32) -> usize {
        (0..game.board.len())
            .find(|&i| game.board.coords(i) == (q, r))
            .unwrap()
    }

    /// Een leeg bord met twee Spelers; daarna zet de test stenen neer.
    fn empty_game() -> Game {
        let mut game = Game::new_star(2).unwrap();
        game.stones.iter_mut().for_each(|s| *s = None);
        game
    }

    fn put(game: &mut Game, q: i32, r: i32, player: usize) -> usize {
        let c = cell(game, q, r);
        game.stones[c] = Some(player);
        c
    }

    #[test]
    fn beurt_overslaan_geeft_de_beurt_door_zonder_het_bord_te_veranderen() {
        let mut game = Game::new_star(3).unwrap();
        let voor: Vec<_> = (0..game.board().len()).map(|c| game.stone_at(c)).collect();
        game.skip_turn().unwrap();
        assert_eq!(game.current_player(), 1);
        game.resign(2).unwrap();
        game.skip_turn().unwrap();
        // Speler 3 is opgegeven en wordt overgeslagen: Speler 1 is weer aan de beurt.
        assert_eq!(game.current_player(), 0);
        let na: Vec<_> = (0..game.board().len()).map(|c| game.stone_at(c)).collect();
        assert_eq!(na.iter().filter(|s| **s == Some(0)).count(), 10);
        assert_eq!(voor.iter().filter(|s| **s == Some(1)).count(), na.iter().filter(|s| **s == Some(1)).count());
        game.resign(1).unwrap();
        assert!(game.is_over());
        assert_eq!(game.skip_turn(), Err(MoveError::GameOver));
    }

    #[test]
    fn sterbord_heeft_121_vakken_en_zes_punten_van_10() {
        let board = Board::star();
        assert_eq!(board.len(), 121);
        for p in 0..6 {
            assert_eq!(board.point(p).len(), 10);
            assert_eq!(board.opposite_point(board.opposite_point(p)), p);
        }
    }

    #[test]
    fn startopstelling_per_spelersaantal() {
        for players in [2, 3, 4, 6] {
            let game = Game::new_star(players).unwrap();
            assert_eq!(game.player_count(), players);
            for p in 0..players {
                let own: Vec<usize> = (0..121).filter(|&c| game.stone_at(c) == Some(p)).collect();
                assert_eq!(own.len(), 10, "{players} spelers, speler {p}");
                assert_eq!(own, game.start_cells(p));
                // Het doel is leeg of van een tegenstander, en nooit het eigen punt.
                assert!(game.goal_cells(p).iter().all(|c| !own.contains(c)));
            }
            let total = (0..121).filter(|&c| game.stone_at(c).is_some()).count();
            assert_eq!(total, players * 10);
        }
        assert!(Game::new_star(5).is_none());
        assert!(Game::new_star(1).is_none());
    }

    #[test]
    fn bij_twee_spelers_is_het_doel_het_startpunt_van_de_ander() {
        let game = Game::new_star(2).unwrap();
        assert_eq!(game.goal_cells(0), game.start_cells(1));
        assert_eq!(game.goal_cells(1), game.start_cells(0));
    }

    #[test]
    fn stap_naar_leeg_buurvak() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 4, -4, 1); // ver weg
        let dest = game.destinations(from);
        assert_eq!(dest.len(), 6);
        let to = cell(&game, 1, 0);
        game.make_move(from, to).unwrap();
        assert_eq!(game.stone_at(to), Some(0));
        assert_eq!(game.stone_at(from), None);
        assert_eq!(game.current_player(), 1);
    }

    #[test]
    fn stap_naar_bezet_vak_kan_niet() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        let next = put(&mut game, 1, 0, 1);
        assert!(!game.destinations(from).contains(&next));
        assert_eq!(
            game.make_move(from, next),
            Err(MoveError::InvalidDestination)
        );
    }

    #[test]
    fn enkele_sprong() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 1, 0, 1);
        let to = cell(&game, 2, 0);
        assert!(game.destinations(from).contains(&to));
        game.make_move(from, to).unwrap();
        assert_eq!(game.stone_at(to), Some(0));
        // De gesprongen steen blijft staan.
        assert_eq!(game.stone_at(cell(&game, 1, 0)), Some(1));
    }

    #[test]
    fn sprong_over_twee_stenen_of_naar_bezet_vak_kan_niet() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 1, 0, 1);
        put(&mut game, 2, 0, 1);
        assert!(!game.destinations(from).contains(&cell(&game, 3, 0)));
        assert!(!game.destinations(from).contains(&cell(&game, 2, 0)));
    }

    #[test]
    fn sprongketen() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 1, 0, 1);
        put(&mut game, 3, 0, 1);
        let mid = cell(&game, 2, 0);
        let end = cell(&game, 4, 0);
        let dest = game.destinations(from);
        assert!(dest.contains(&mid));
        assert!(dest.contains(&end));
        game.make_move(from, end).unwrap();
        assert_eq!(game.stone_at(end), Some(0));
    }

    #[test]
    fn pad_van_een_zet_volgt_elke_sprong() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 1, 0, 1);
        put(&mut game, 3, 0, 1);
        let mid = cell(&game, 2, 0);
        let end = cell(&game, 4, 0);
        let step = cell(&game, 0, 1);
        let board = game.board().clone();
        assert_eq!(
            move_path(&board, &game.stones, from, end),
            Some(vec![from, mid, end])
        );
        assert_eq!(
            move_path(&board, &game.stones, from, mid),
            Some(vec![from, mid])
        );
        assert_eq!(
            move_path(&board, &game.stones, from, step),
            Some(vec![from, step])
        );
        // Geen Zet: te ver, een bezet vak of geen steen.
        assert_eq!(
            move_path(&board, &game.stones, from, cell(&game, 0, 3)),
            None
        );
        assert_eq!(
            move_path(&board, &game.stones, from, cell(&game, 1, 0)),
            None
        );
        assert_eq!(move_path(&board, &game.stones, mid, end), None);
        // Elk vak van het pad is ook een geldige bestemming.
        for c in move_path(&board, &game.stones, from, end)
            .unwrap()
            .into_iter()
            .skip(1)
        {
            assert!(game.destinations(from).contains(&c));
        }
    }

    #[test]
    fn sprongketen_komen_niet_terug_naar_bezochte_vakken() {
        // Een cirkel van stenen rond het startvak: de ketens moeten eindigen.
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        for (q, r) in [(1, 0), (-1, 0), (0, 1), (0, -1), (1, -1), (-1, 1)] {
            put(&mut game, q, r, 1);
        }
        let dest = game.destinations(from);
        // Landen kan op (2,0), (-2,0), (0,2), (0,-2), (2,-2), (-2,2); nooit op (0,0).
        assert_eq!(dest.len(), 6);
        assert!(!dest.contains(&from));
    }

    #[test]
    fn geen_stap_na_een_sprong() {
        let mut game = empty_game();
        let from = put(&mut game, 0, 0, 0);
        put(&mut game, 1, 0, 1);
        let landing = cell(&game, 2, 0);
        // Vak (3,0) is leeg en grenst aan de landing, maar is niet bereikbaar:
        // dat zou een Sprong gevolgd door een stap zijn.
        let step_after_jump = cell(&game, 3, 0);
        let dest = game.destinations(from);
        assert!(dest.contains(&landing));
        assert!(!dest.contains(&step_after_jump));
    }

    #[test]
    fn ongeldige_zet_wordt_geweigerd_en_verandert_niets() {
        let mut game = Game::new_star(2).unwrap();
        let before = game.stones.clone();
        let own = game.start_cells(0)[0];
        let far = game.goal_cells(0)[0];
        let theirs = game.start_cells(1)[0];
        assert_eq!(game.make_move(own, far), Err(MoveError::InvalidDestination));
        assert_eq!(game.make_move(theirs, own), Err(MoveError::NotYourStone));
        assert_eq!(game.make_move(500, 0), Err(MoveError::NoSuchCell));
        let empty = (0..121).find(|&c| game.stone_at(c).is_none()).unwrap();
        assert_eq!(game.make_move(empty, own), Err(MoveError::NotYourStone));
        assert_eq!(game.stones, before);
        assert_eq!(game.current_player(), 0);
    }

    #[test]
    fn beurten_gaan_in_volgorde() {
        let mut game = Game::new_star(3).unwrap();
        for expected in [0, 1, 2, 0] {
            assert_eq!(game.current_player(), expected);
            // Zoek een steen van de huidige Speler met een zet.
            let from = (0..121)
                .find(|&c| game.stone_at(c) == Some(expected) && !game.destinations(c).is_empty())
                .unwrap();
            let to = game.destinations(from)[0];
            game.make_move(from, to).unwrap();
        }
        assert_eq!(game.current_player(), 1);
    }

    /// Zet Speler 0 negen stenen in zijn doel en één stap ervoor.
    fn almost_won(players: usize) -> (Game, usize, usize) {
        let mut game = Game::new_star(players).unwrap();
        game.stones.iter_mut().for_each(|s| *s = None);
        let goal = game.goal_cells(0).to_vec();
        for &c in &goal[1..] {
            game.stones[c] = Some(0);
        }
        // Een buurvak van het laatste doelvak dat buiten het doel ligt.
        let last = goal[0];
        let before = (0..game.board.directions())
            .filter_map(|d| game.board.neighbor(last, d))
            .find(|n| !goal.contains(n))
            .unwrap();
        game.stones[before] = Some(0);
        // Andere Spelers krijgen een steen in het midden, buiten het doel van Speler 0.
        for p in 1..players {
            let c = cell(&game, 0, p as i32 - 1);
            game.stones[c] = Some(p);
        }
        (game, before, last)
    }

    #[test]
    fn winst_bij_twee_spelers() {
        let (mut game, from, last) = almost_won(2);
        assert_eq!(game.winner(), None);
        game.make_move(from, last).unwrap();
        assert!(game.is_over());
        assert_eq!(game.winner(), Some(0));
        assert_eq!(game.ranking(), &[0, 1]);
        assert_eq!(game.make_move(0, 0), Err(MoveError::GameOver));
    }

    #[test]
    fn bij_drie_spelers_speelt_de_rest_door() {
        let (mut game, from, last) = almost_won(3);
        game.make_move(from, last).unwrap();
        assert!(!game.is_over());
        assert_eq!(game.winner(), Some(0));
        assert_eq!(game.player_state(0), Some(PlayerState::Finished));
        // Speler 1 en 2 zijn om de beurt; speler 0 wordt overgeslagen.
        assert_eq!(game.current_player(), 1);
        let a = cell(&game, 0, 0);
        let to = game.destinations(a)[0];
        game.make_move(a, to).unwrap();
        assert_eq!(game.current_player(), 2);
        let b = cell(&game, 0, 1);
        let to = game.destinations(b)[0];
        game.make_move(b, to).unwrap();
        assert_eq!(game.current_player(), 1);
    }

    #[test]
    fn opgeven_geeft_de_beurt_door_en_haalt_stenen_weg() {
        let mut game = Game::new_star(3).unwrap();
        game.resign(0).unwrap();
        assert_eq!(game.player_state(0), Some(PlayerState::Resigned));
        assert_eq!(game.current_player(), 1);
        assert!((0..121).all(|c| game.stone_at(c) != Some(0)));
        assert!(!game.is_over());
        assert_eq!(game.resign(0), Err(MoveError::NotPlaying));
        assert_eq!(game.resign(9), Err(MoveError::NoSuchPlayer));
    }

    #[test]
    fn opgeven_buiten_eigen_beurt_houdt_de_beurt_bij_dezelfde_speler() {
        let mut game = Game::new_star(3).unwrap();
        game.resign(2).unwrap();
        assert_eq!(game.current_player(), 0);
    }

    #[test]
    fn laatste_speler_wint_als_de_rest_opgeeft() {
        let mut game = Game::new_star(2).unwrap();
        game.resign(0).unwrap();
        assert!(game.is_over());
        assert_eq!(game.winner(), Some(1));
        assert_eq!(game.resign(1), Err(MoveError::GameOver));

        let mut game = Game::new_star(3).unwrap();
        game.resign(1).unwrap();
        game.resign(2).unwrap();
        assert!(game.is_over());
        assert_eq!(game.winner(), Some(0));
    }

    // --- Vierkant bord ---

    fn square_empty(players: usize) -> Game {
        let mut game = Game::new_square(players).unwrap();
        game.stones.iter_mut().for_each(|s| *s = None);
        game
    }

    #[test]
    fn vierkant_startopstelling_voor_2_en_4_spelers() {
        assert_eq!(Board::square().len(), 256);
        assert!(Game::new_square(3).is_none());
        for (players, stones) in [(2, 19), (4, 13)] {
            let game = Game::new_square(players).unwrap();
            for p in 0..players {
                let own: Vec<usize> = (0..256).filter(|&c| game.stone_at(c) == Some(p)).collect();
                assert_eq!(own.len(), stones, "{players} spelers, speler {p}");
                assert_eq!(own, game.start_cells(p));
                assert_eq!(game.goal_cells(p).len(), stones);
                assert!(game.goal_cells(p).iter().all(|c| !own.contains(c)));
            }
        }
        // 2 Spelers: hoek (0,0) tegenover hoek (15,15), rijen van 5, 5, 4, 3, 2.
        let game = Game::new_square(2).unwrap();
        let rows: Vec<usize> = (0..5)
            .map(|r| game.start_cells(0).iter().filter(|&&c| c / 16 == r).count())
            .collect();
        assert_eq!(rows, [5, 5, 4, 3, 2]);
        assert!(game.goal_cells(0).contains(&255));
        // 4 Spelers: rijen van 4, 4, 3, 2 en het doel is de tegenoverliggende hoek.
        let game = Game::new_square(4).unwrap();
        let rows: Vec<usize> = (0..4)
            .map(|r| game.start_cells(0).iter().filter(|&&c| c / 16 == r).count())
            .collect();
        assert_eq!(rows, [4, 4, 3, 2]);
        assert_eq!(game.goal_cells(0), game.start_cells(2));
        assert_eq!(game.goal_cells(1), game.start_cells(3));
    }

    #[test]
    fn vierkant_schuine_stap() {
        let mut game = square_empty(2);
        let from = 5 * 16 + 5;
        game.stones[from] = Some(0);
        game.stones[15 * 16] = Some(1);
        assert_eq!(game.destinations(from).len(), 8);
        let to = 6 * 16 + 6;
        game.make_move(from, to).unwrap();
        assert_eq!(game.stone_at(to), Some(0));
    }

    #[test]
    fn vierkant_hoek_heeft_drie_buren_en_geen_sprong_van_de_rand() {
        let mut game = square_empty(2);
        game.stones[0] = Some(0);
        assert_eq!(game.destinations(0).len(), 3);
        game.stones[1] = Some(1);
        game.stones[17] = Some(1);
        game.stones[16] = Some(1);
        // Alleen schuin over (1,1) naar (2,2) is niet mogelijk zonder steen; (2,0) en (0,2) en (2,2) wel.
        let dest = game.destinations(0);
        assert_eq!(dest, vec![2, 32, 34]);
    }

    #[test]
    fn vierkant_schuine_sprong() {
        let mut game = square_empty(2);
        let from = 5 * 16 + 5;
        game.stones[from] = Some(0);
        game.stones[6 * 16 + 6] = Some(1);
        let to = 7 * 16 + 7;
        assert!(game.destinations(from).contains(&to));
        game.make_move(from, to).unwrap();
        assert_eq!(game.stone_at(to), Some(0));
        assert_eq!(game.stone_at(6 * 16 + 6), Some(1));
    }

    #[test]
    fn vierkant_sprongketen_met_schuine_en_rechte_sprongen() {
        let mut game = square_empty(2);
        let from = 2 * 16 + 2;
        game.stones[from] = Some(0);
        game.stones[3 * 16 + 3] = Some(1); // schuin naar (4,4)
        game.stones[4 * 16 + 5] = Some(1); // recht naar (4,6)
        game.stones[5 * 16 + 6] = Some(1); // schuin terug naar (6,4)... via (5,5)? zie hieronder
        let dest = game.destinations(from);
        assert!(dest.contains(&(4 * 16 + 4)));
        // Vanaf (4,4): over (5,4) naar (6,4).
        assert!(dest.contains(&(4 * 16 + 6)));
        game.make_move(from, 4 * 16 + 6).unwrap();
        assert_eq!(game.stone_at(4 * 16 + 6), Some(0));
    }

    #[test]
    fn vierkant_winst_als_het_doel_vol_is() {
        let mut game = square_empty(2);
        let goal: Vec<usize> = game.goal_cells(0).to_vec();
        // Alle doelvakken vol, behalve het laatste; speler 0 zet daar de laatste steen.
        for &c in &goal[1..] {
            game.stones[c] = Some(0);
        }
        let from = goal[0] - 17; // schuin ernaast, buiten het doel
        game.stones[from] = Some(0);
        game.stones[0] = Some(1);
        assert_eq!(game.winner(), None);
        game.make_move(from, goal[0]).unwrap();
        assert_eq!(game.winner(), Some(0));
        assert!(game.is_over());
    }

    /// Alles wat een Potje bepaalt, om twee Potjes te vergelijken.
    fn alles(g: &Game) -> (Vec<Option<usize>>, Vec<PlayerState>, usize, Vec<usize>, bool) {
        (g.stones.clone(), g.state.clone(), g.current, g.ranking.clone(), g.over)
    }

    #[test]
    fn een_bewaarde_stand_geeft_hetzelfde_potje_terug() {
        // Drie Spelers: een paar Zetten, een opgave, een overgeslagen beurt, en daarna verder spelen.
        let mut game = Game::new_star(3).unwrap();
        for _ in 0..7 {
            let p = game.current_player();
            let (van, naar) = game
                .start_cells(p)
                .iter()
                .find_map(|&v| game.destinations(v).first().map(|&n| (v, n)))
                .unwrap();
            game.make_move(van, naar).unwrap();
        }
        game.resign(1).unwrap();
        game.skip_turn().unwrap();
        let terug = Game::from_snapshot(Board::star(), 3, &game.snapshot()).unwrap();
        assert_eq!(alles(&terug), alles(&game));
        // Verder spelen vanaf de bewaarde stand gaat net zo als vanaf het origineel.
        let (mut a, mut b) = (game.clone(), terug);
        a.resign(0).unwrap();
        b.resign(0).unwrap();
        assert!(a.is_over() && b.is_over());
        assert_eq!(alles(&a), alles(&b));
        assert_eq!(Game::from_snapshot(Board::star(), 3, &a.snapshot()).map(|g| alles(&g)), Some(alles(&a)));
    }

    #[test]
    fn een_stand_die_niet_past_wordt_geweigerd() {
        let tekst = Game::new_star(2).unwrap().snapshot();
        assert!(Game::from_snapshot(Board::star(), 2, &tekst).is_some());
        // Ander aantal Spelers, ander bord, of kapotte tekst: niets.
        assert!(Game::from_snapshot(Board::star(), 3, &tekst).is_none());
        assert!(Game::from_snapshot(Board::square(), 2, &tekst).is_none());
        for kapot in ["", "2|0|0|pp||", &tekst.replacen("1|0|", "1|5|", 1), &tekst.replace('1', "7")] {
            assert!(Game::from_snapshot(Board::star(), 2, kapot).is_none(), "{kapot}");
        }
    }
}
