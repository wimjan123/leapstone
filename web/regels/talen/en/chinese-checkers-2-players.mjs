// De gids Chinese checkers for 2 players (taak 122, feature 118): /guides/chinese-checkers-2-players.
// Regels uit crates/halma-core (Board::star, Game::new_star(2), make_move, resign) en uit "Regels" en taak 80 voor de tijdslimiet.
// De niveaus van de Computerspeler komen uit crates/halma-core/src/computer.rs (Level, choose_move).
// Wat de app laat zien komt uit web/src/Startmenu.svelte en de Landingspagina. Docs/plan.md, taak 122, heeft de controle per regel.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">How the game starts</h2>
      <p>Each player has 10 pieces. They start in two points of the star that face each other: red at the bottom, blue at the top. The 20 pieces stand on a board of 121 spots.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "The star board with 10 red pieces in the bottom point and 10 blue pieces in the top point",
  tekst: "Red starts at the bottom, blue at the top.",
})}
      <p>Player 1, red, moves first. After that you take turns, one move each. A move is one step or a chain of jumps with one piece. See the <a href="/rules/chinese-checkers">Chinese checkers rules</a> for steps and jumps.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Your goal is the other player's start</h2>
      <p>You win by moving all 10 of your pieces into the point where the other player started. That point starts full of their pieces, and yours is full of yours. For red, that is the top point in the picture above.</p>
      <p>You can only land on an empty spot, so each of you has to leave your own point before the other can fill it. Neither of you can finish while a piece of the other stays in the goal. And because you cross the same middle in opposite directions, the pieces of the other player are stepping stones for you, and yours for them. Read the <a href="/guides/chinese-checkers-strategy">strategy tips</a> for what to do with that.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winning and resigning</h2>
      <ul>
        <li><strong>Win:</strong> the first player to fill the goal with all 10 pieces wins, and the game is over at once. The other player does not play on.</li>
        <li><strong>Resign:</strong> your pieces leave the board and the other player wins.</li>
        <li><strong>Time (online):</strong> in an online game every move has a time limit. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">How 3, 4 and 6 players differ</h2>
      <ul>
        <li><strong>3 players:</strong> the pieces start in every other point, and the three goals start empty. The first player to finish wins; the others play on for the next places, and a player who is done is skipped.</li>
        <li><strong>4 players:</strong> two pairs of points next to each other. Your goal starts full of the pieces of another player. The game goes on after the first finisher, as with 3.</li>
        <li><strong>6 players:</strong> all six points. The board holds 60 pieces, against 20 with 2 players.</li>
      </ul>
      <p>With only 20 pieces on the board there are fewer pieces to jump over, so the ladders you build yourself matter more. The <a href="/rules/chinese-checkers">rules page</a> has pictures of every start, and <a href="/guides/chinese-checkers-3-players">Chinese checkers for 3 players</a> has a guide for three.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Where to play with 2 players in Leapstone</h2>
      <ul>
        <li><strong>Against the computer, right now:</strong> open <a href="/play/">Leapstone in your browser</a>, tap Computer and choose the star board. One computer is the default, so that is a game for 2. You choose Easy, Normal or Hard, and you are Player 1, so you move first. Easy picks the best of three random moves. Normal picks the move that makes the most progress toward its goal. Hard also looks at how its opponents can answer and at its own next move.</li>
        <li><strong>Play online, in the app:</strong> a quick game on the star board for 2 players, against another player of your level, with 30 seconds per move. Some online opponents may be computer players.</li>
        <li><strong>With a friend:</strong> send an invite link, and set the time per move yourself. Or pass one phone back and forth.</li>
      </ul>
      <p><a href="/guides/play-chinese-checkers-online-with-friends">Chinese checkers online with friends</a></p>
    </section>`;

export default {
  nav: "Chinese checkers for 2 players",
  titel: "Chinese checkers for 2 players: setup and rules | Leapstone",
  beschrijving: "How Chinese checkers works with 2 players: where the 10 pieces start, who moves first, how you win or resign, and where to play free.",
  h1: "Chinese checkers for 2 players",
  intro: "How a game for two works on the star board: the setup, who moves first, how you win, and where you can play it.",
  inhoud,
};
