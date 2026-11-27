// De gids Chinese checkers for 3 players (taak 139, feature 136): /guides/chinese-checkers-3-players. Alleen Engels (zie paginas.mjs).
// Regels uit crates/halma-core (Board::star met start_points(3) = de punten 0, 2 en 4, Game::new_star(3), make_move, skip_turn,
// resign, ranking) en uit "Techniek" voor de tijdslimiet (taak 80) en Snel potje (taak 97, 99). De plaatjes en de controles
// staan in crates/halma-core/examples/regelplaatjes.rs (blok 20). Wat de app laat zien komt uit web/src/Startmenu.svelte,
// ComputerKeuze.svelte, PlekKeuze.svelte en Online.svelte. Docs/plan.md, taak 139, heeft de controle per bewering.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">How the game starts</h2>
      <p>Each player has 10 pieces, so 30 pieces stand on the board of 121 spots. They start in every other point of the star: red at the bottom, blue at the top left and green at the top right. The three points in between are empty.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "The star board with 10 red pieces in the bottom point, 10 blue pieces in the top left point and 10 green pieces in the top right point",
  tekst: "Red at the bottom, blue at the top left, green at the top right.",
})}
      <p>Player 1, red, moves first. Then blue is Player 2, green is Player 3, and after green it is red again. A move is one step or a chain of jumps with one piece. See the <a href="/rules/chinese-checkers">Chinese checkers rules</a> for steps and jumps.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Three goals, all empty at the start</h2>
      <p>Your goal is the point across from where you started, and with 3 players it begins empty. It is the empty point between the starts of the other two players: red's goal is at the top, blue's at the bottom right and green's at the bottom left.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "The star board for three players. Dashed circles in the color of each player mark the three empty goals: red at the top, blue at the bottom right, green at the bottom left.",
  tekst: "Each goal has the color of its player.",
})}
      <p>You win by moving all 10 of your pieces into your goal. All 10 spots must hold your own pieces. Nobody starts in your goal, but you may stop on any empty spot, so a piece of another player can land there later. While it sits there, you cannot finish.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winning, and what happens after</h2>
      <ul>
        <li><strong>Win:</strong> the first player to fill the goal wins. The game does not stop there: the other two play on for the next places, and the player who is done is skipped. The game is over when only one player is still playing.</li>
        <li><strong>Resign:</strong> your pieces leave the board and the other two play on. If a second player resigns before anyone has finished, the last player left wins.</li>
        <li><strong>Time (online):</strong> in an online game every move has a time limit, set by the player who starts the game. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign, and the game goes on without you.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">How it differs from a game for 2</h2>
      <ul>
        <li><strong>More pieces:</strong> 30 on the board, against 20 with 2 players.</li>
        <li><strong>Empty goals:</strong> with 2 players your goal starts full of the pieces of the other player. With 3 it starts empty.</li>
        <li><strong>Two opponents:</strong> after your move, two other players move before you are up again. The pieces of both are stepping stones for you, and yours for them. A ladder you build can be used by both, and the player after you gets the first go.</li>
        <li><strong>The game goes on:</strong> with 2 players the game ends when one of you is done. With 3, it goes on for the second and third place.</li>
      </ul>
      <p>For the game with two, read <a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>. The <a href="/guides/chinese-checkers-strategy">strategy tips</a> are about steps and jumps, which are the same with 3 players.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Where to play with 3 players in Leapstone</h2>
      <ul>
        <li><strong>Against the computer, right now:</strong> open <a href="/play/">Leapstone in your browser</a>, tap Computer, choose the star board and 2 computers. You are Player 1, so you move first. You choose Easy, Normal or Hard for the computers.</li>
        <li><strong>On one phone:</strong> tap On this phone, choose the star board and 3 players, then tap a piece to switch that place between a person and a computer.</li>
        <li><strong>Online with friends:</strong> tap Friends, choose the star board, 3 players and the time per move, and send the invite link. The game starts when all 3 places are taken.</li>
        <li><strong>Quick games:</strong> Play online finds games for 2 or 4 players, so there is no quick game for 3.</li>
      </ul>
      <p><a href="/guides/play-chinese-checkers-online-with-friends">Chinese checkers online with friends</a></p>
    </section>`;

export default {
  nav: "Chinese checkers for 3 players",
  titel: "Chinese checkers for 3 players: setup and rules | Leapstone",
  beschrijving: "How Chinese checkers works with 3 players: where the 30 pieces start, which empty point is each goal, who moves first, and how you win.",
  h1: "Chinese checkers for 3 players",
  intro: "How a game for three works on the star board: the setup, the three goals, who moves first, how you win, and where you can play it.",
  inhoud,
};
