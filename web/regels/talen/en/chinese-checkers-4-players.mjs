// De gids Chinese checkers for 4 players (taak 301, feature 294): /guides/chinese-checkers-4-players. In alle talen (zie paginas.mjs).
// Regels uit crates/halma-core (Board::star met start_points(4) = de punten 0, 1, 3 en 4, Game::new_star(4), goal_cells, make_move,
// skip_turn, resign, ranking) en uit "Techniek" voor de tijdslimiet (taak 80) en Snel potje (taak 97, 99). De controles staan in
// crates/halma-core/examples/regelplaatjes.rs (blok 21); het plaatje is setup-4.svg. Wat de app laat zien komt uit
// web/src/Startmenu.svelte, ComputerKeuze.svelte, PlekKeuze.svelte en Online.svelte. Docs/plan.md, taak 301, heeft de controle per bewering.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">How the board is split</h2>
      <p>Each player has 10 pieces, so 40 pieces stand on the board of 121 spots. The four starting points are two pairs of points that sit next to each other: red at the bottom and blue at the bottom left, green at the top and yellow at the top right.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "The star board with 10 red pieces in the bottom point, 10 blue pieces in the bottom left point, 10 green pieces in the top point and 10 yellow pieces in the top right point. The top left and bottom right points are empty.",
  tekst: "Red at the bottom, blue at the bottom left, green at the top, yellow at the top right.",
})}
      <p>Player 1, red, moves first. Then blue is Player 2, green is Player 3, yellow is Player 4, and after yellow it is red again. A move is one step or a chain of jumps with one piece. See the <a href="/rules/chinese-checkers">Chinese checkers rules</a> for steps and jumps.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Who faces who</h2>
      <p>The points pair up across the board: red faces green, and blue faces yellow. Your goal is the point across from you. Red goes to where green starts, green to where red starts, blue to where yellow starts and yellow to where blue starts.</p>
      <p>As in a game for 2, every goal starts full of the pieces of the player who faces you, so you can only land there after they have left. With 3 players the goals start empty, so with 4 nobody can finish at once. The four goals are four different points, so nobody else wants your goal: a player who is done never blocks anyone.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">The two empty points</h2>
      <p>The top left and bottom right points hold no pieces. They are nobody's start and nobody's goal. The top left lies between blue and green, and the bottom right between yellow and red.</p>
      <p>You may step or jump onto any empty spot, so you can cross these points or stop in them. A piece there is not in a goal yet, though. There is nothing to jump over in an empty point until someone brings pieces there.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">What changes in your tactics</h2>
      <ul>
        <li><strong>Two crossings at once:</strong> red and green cross the board toward each other, and so do blue and yellow. Both lines run through the middle, so the middle is busier than in a game for 2, where only one line crosses.</li>
        <li><strong>Three players move between your turns:</strong> the board changes more between two of your moves than in a game for 2. Look at it again at the start of every turn, and plan your chain of jumps then. The player who moves after you is never the one across from you.</li>
        <li><strong>Pieces help everyone:</strong> every piece of the other three is a stepping stone for you, and yours are stepping stones for them. The pieces of the player across from you move the opposite way, as in a game for 2.</li>
        <li><strong>Room to go around:</strong> if the middle is full, the empty points are open space next to the camps. A route through one can be a way around the crowd.</li>
        <li><strong>A resigned player frees your goal:</strong> when the player across from you resigns, their pieces leave the board, so your goal is empty at once.</li>
      </ul>
      <p>The <a href="/guides/chinese-checkers-strategy">strategy tips</a> about ladders, stragglers and filling the goal from the back are the same with 4 players.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winning, and what happens after</h2>
      <ul>
        <li><strong>Win:</strong> the first player to fill the goal with all 10 pieces wins. The game does not stop there: the other three play on for the next places, and the player who is done is skipped. The pieces of that player stay on the board. The game is over when only one player is still playing.</li>
        <li><strong>Resign:</strong> your pieces leave the board and the other three play on. If the others resign too, the last player left wins.</li>
        <li><strong>Time (online):</strong> in an online game every move has a time limit. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign, and the game goes on without you.</li>
      </ul>
      <p>For the games with fewer players, read <a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>. The <a href="/rules/chinese-checkers">rules page</a> has pictures of every start.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Where to play with 4 players in Leapstone</h2>
      <ul>
        <li><strong>Against the computer, right now:</strong> open <a href="/play/">Leapstone in your browser</a>, tap Computer, choose the star board and 3 computers. You are Player 1, so you move first. You choose Easy, Normal or Hard for the computers.</li>
        <li><strong>On one phone:</strong> tap Play, choose the star board and 4 players, then tap a piece to switch that place between a person and a computer.</li>
        <li><strong>Online with friends:</strong> tap Friends, choose the star board, 4 players and the time per move, and send the invite link. The game starts when all 4 places are taken.</li>
        <li><strong>Quick game, in the app:</strong> tap Play online. While it searches for a game of 2, tap Find 4 or 6 players to look for a game of 4 instead. Every move has 30 seconds. If not enough players join within 20 seconds, computer players fill the empty places, so some opponents may be computer players.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinese checkers for 4 players",
  titel: "Chinese checkers for 4 players: setup and tips | Leapstone",
  beschrijving: "How Chinese checkers works with 4 players: how the board is split, which 2 points stay empty, who faces who, what changes in tactics, and where to play.",
  h1: "Chinese checkers for 4 players",
  intro: "With 4 players, each of you starts in one of four points of the star, and two points stay empty. Red faces green and blue faces yellow: your goal is the point across from you, full of that player's pieces. Here are the setup, the empty points, the tactics and where you can play it.",
  inhoud,
};
