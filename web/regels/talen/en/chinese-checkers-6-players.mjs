// De gids Chinese checkers for 6 players (taak 302, feature 294): /guides/chinese-checkers-6-players.
// Regels uit crates/halma-core (Board::star met start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) en uit "Techniek"
// voor de tijdslimiet (taak 80: DENKTIJDEN in web/src/denktijd.ts, MAX_GEMISTE_BEURTEN) en Snel potje (SNEL_MEER_AANTAL). De plaatjes en de
// controles staan in crates/halma-core/examples/regelplaatjes.rs (blok 21). Wat de app laat zien komt uit web/src/spelers.ts
// (tegenstanders, COMPUTER_PAUZE_MS), Startmenu.svelte en Online.svelte. Docs/plan.md, taak 302, heeft de controle per bewering.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">How the game starts</h2>
      <p>Each player has 10 pieces, and all 6 points of the star are in use. That puts 60 pieces on the board of 121 spots. The 61 spots in the middle are empty at the start.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "The star board with 10 pieces in each of its 6 points, in 6 colors",
  tekst: "6 players, 6 points, 60 pieces.",
})}
      <p>Player 1, red, moves first, from the bottom point. The turn then goes from Player 1 to Player 6, and after Player 6 it is Player 1 again. The players are numbered in the order of their points around the star, so the player after you always starts in the point next to yours. A move is one step or a chain of jumps with one piece. See the <a href="/rules/chinese-checkers">Chinese checkers rules</a> for steps and jumps.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Every goal is full at the start</h2>
      <p>You win by moving all 10 of your pieces into the point across the board. With 6 players that point is where the player across from you starts, so no goal is empty: every goal begins full of the pieces of another player. For red, the goal is the top point, where Player 4 starts.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "The star board with 6 full points. A dashed ring marks the top point, the goal of the red player, which holds the pieces of the player across.",
  tekst: "Red's goal is the point across, full of the pieces of Player 4.",
})}
      <p>You can only land on an empty spot, so the player across has to leave their point before you can fill it, and you have to leave yours before they can fill theirs. In a game for 2 that is all there is to it. With 6, both players also have to get through the crowd of the 4 others.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">A crowded middle</h2>
      <p>Every goal is across the board, and the points only connect to each other through the middle, so all 60 pieces have to cross the same 61 spots. At the start nobody has crossed yet, and the middle fills up fast.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "A red piece jumps three times in one move: over a blue piece, then a green piece, then a purple piece. The numbers 1, 2 and 3 mark the landing spots.",
  tekst: "Pieces of every color are stepping stones.",
})}
      <p>You can jump over a piece of any color. Pieces of 5 other players are stepping stones for you, and yours are stepping stones for all 5 of them. A line of pieces that you leave in the middle is a ladder for anyone who can reach it, and the player after you gets the first go.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blocking with 5 opponents</h2>
      <ul>
        <li><strong>Fill the landing spot:</strong> a jump needs an empty spot right behind the piece. When you move a piece there, the jump is gone for every player who wanted it.</li>
        <li><strong>Mind the ladders you build:</strong> after your move, the other 5 players move before you are up again. A ladder helps all of them.</li>
        <li><strong>Anyone can block a goal:</strong> a piece of any other player in your goal keeps you from finishing, not only a piece of the player across. All 10 spots of the goal must hold your own pieces.</li>
      </ul>
      <p>The <a href="/guides/chinese-checkers-strategy">strategy tips</a> show how a blocked jump looks, and how not to lock a piece of another player in your own goal.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">How long a game takes</h2>
      <p>A game for 6 has 60 pieces to move, and between one of your moves and the next the other 5 players each make one. It also does not end when the first player finishes.</p>
      <ul>
        <li><strong>Win, and play on:</strong> the first player to fill the goal wins, and the others play on for the next places. The player who is done is skipped, and the pieces of that player stay on the board as stepping stones. The game is over when only one player is still playing.</li>
        <li><strong>Resign:</strong> your pieces leave the board, so they no longer block or help anyone, and the others play on.</li>
        <li><strong>Time (online):</strong> in an online game every move has a time limit, set by the player who starts the game: 15 seconds, 30 seconds, 1 minute, 2 minutes or no limit. A round of 6 moves takes at most 6 times the limit, so with 30 seconds that is 3 minutes at most. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign, and the game goes on without you.</li>
      </ul>
      <p>For a game with fewer players, read <a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Where to play with 6 players in Leapstone</h2>
      <ul>
        <li><strong>Against the computer, right now:</strong> open <a href="/play/">Leapstone in your browser</a>, tap Computer, choose the star board and 5 computers. You are Player 1, so you move first. The computers move one after the other, each with a short pause, so you can follow every move. You choose Easy, Normal or Hard for the computers.</li>
        <li><strong>On one phone:</strong> tap Play, choose the star board and 6 players, then tap a piece to switch that place between a person and a computer.</li>
        <li><strong>Online with friends:</strong> tap Friends, choose the star board, 6 players and the time per move, and send the invite link. The game starts when all 6 places are taken.</li>
        <li><strong>Quick games:</strong> Play online finds games for 2 or 4 players, so there is no quick game for 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinese checkers for 6 players",
  titel: "Chinese checkers for 6 players: the full board | Leapstone",
  beschrijving: "How Chinese checkers works with 6 players: a full star of 60 pieces, a crowded middle, blocking, how long a game takes, and where to play it.",
  h1: "Chinese checkers for 6 players",
  intro: "How a game for 6 works: all 6 points are full, you race to the point across the board, and the game goes on after the first player finishes.",
  inhoud,
};
