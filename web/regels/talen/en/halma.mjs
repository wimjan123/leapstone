// De spelregelpagina Halma (taak 117). Elke regel hier is nagelopen tegen crates/halma-core
// (zie docs/plan.md, taak 117). De plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs.
// Bronnen voor de geschiedenis: zie sternhalma.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 players: 19 pieces each",
    alt: "The square board with 19 red pieces in the top left corner and 19 blue pieces in the bottom right corner",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 players: 13 pieces each",
    alt: "The square board with 13 pieces in each of the four corners: red top left, blue top right, green bottom right and yellow bottom left",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">The board</h2>
      <p>Halma is played on a square board of 16 by 16 spots, 256 in all. Every spot has up to eight neighbors: the four straight ones and the four diagonal ones. A spot on the edge has fewer, and a corner has three.</p>
      <p>This is the Square board in Leapstone. If you know the game on the star board, read about <a href="/rules/sternhalma">Sternhalma</a> and the <a href="/rules/chinese-checkers">Chinese checkers rules</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">How the pieces start</h2>
      <p>Halma is for 2 or 4 players. Every player starts with the pieces in a camp in a corner of the board. The camp in the opposite corner is your goal.</p>
      <ul>
        <li><strong>2 players:</strong> 19 pieces each, in two corners across from each other. The camp is five rows of 5, 5, 4, 3 and 2 spots.</li>
        <li><strong>4 players:</strong> 13 pieces each, one camp in every corner. The camp is four rows of 4, 4, 3 and 2 spots. Your goal is the corner across the board, diagonally.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Taking turns</h2>
      <p>Player 1 goes first. Then the turns go in order, and after the last player it is Player 1 again. In Leapstone the colors go with the numbers: red, blue, green and yellow.</p>
      <p>On your turn you move one piece, once. Nothing is captured: pieces stay on the board until their player resigns.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">A step</h2>
      <p>Move a piece to an empty spot next to it, in any of the eight directions: straight or diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "A red piece with a white ring around it. Five of its eight neighbors are empty and marked; the other three hold pieces.",
  tekst: "The red piece can step to the five marked spots. The other three neighbors are taken.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">A jump</h2>
      <p>Jump over one piece next to yours, of any color, and land on the empty spot right behind it, in a straight line. You can jump in all eight directions, also diagonally and backwards.</p>
      <ul>
        <li>The spot you land on must be empty.</li>
        <li>You cannot jump over two pieces in a row, or over an empty spot.</li>
        <li>The piece you jump over stays where it is.</li>
        <li>You cannot jump over the edge of the board.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "A red piece jumps diagonally over a blue piece to the empty spot behind it, shown with an arrow.",
  tekst: "The red piece jumps diagonally over the blue piece.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">A chain of jumps</h2>
      <p>After a jump, the same piece may jump again, as many times as it can, in any direction, straight or diagonal. You decide where to stop. All the jumps together are one move.</p>
      <ul>
        <li>In one move you cannot land on the same spot twice.</li>
        <li>A move is one step, or one or more jumps. You cannot step after a jump.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "A red piece makes three jumps in one move: diagonally over a blue piece, straight over another blue piece, and diagonally over a red piece. The three landing spots are numbered 1, 2 and 3.",
  tekst: "One move with three jumps, in the order of the numbers.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">The goal</h2>
      <p>You win by moving all your pieces into the camp across from where you started. Every spot of that camp must hold your own pieces: 19 with 2 players, 13 with 4 players. While a piece of another player sits there, you cannot finish.</p>
      <p>You may land on any empty spot, also in the camps of other players. A piece that is in your goal may leave again; nothing locks it.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "The square board for two players. Red starts in the top left; the bottom right camp, marked with dashed circles and holding blue pieces, is red's goal.",
  tekst: "With 2 players, red's goal is the camp where blue starts.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">With 2 or 4 players</h2>
      <ul>
        <li><strong>2 players:</strong> the first player to fill the goal wins, and the game is over.</li>
        <li><strong>4 players:</strong> the first player to fill the goal wins. The others play on for the next places, and a player who is done is skipped. The game is over when only one player is still playing.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Resigning</h2>
      <p>When you resign, your pieces leave the board, so they do not block anyone. With 2 players, the other player wins. With 4 players the game goes on without you, and if everyone but one player resigns, the last player wins.</p>
      <p>In an online game every move has a time limit. The player who starts the game sets it. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign. Games against the computer and on one phone have no time limit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Build ladders.</strong> Put pieces in a line with one empty spot between them, straight or diagonal, pointing at your goal. One piece can then jump along the whole line in a single move.</li>
        <li><strong>Any piece is a ladder.</strong> You can jump over every color, so the pieces of the other players help you too. And your own ladders help them: look at what you leave behind.</li>
        <li><strong>Use the diagonals.</strong> The goal is in the opposite corner, so a diagonal line of pieces is the fastest way across.</li>
        <li><strong>Do not forget the stragglers.</strong> You need all your pieces home. A piece far behind, with nothing to jump over, moves one spot per turn. Bring it along while the other pieces are still around it.</li>
        <li><strong>Your start is their goal.</strong> With 2 players, your camp is the goal of the other player, and they cannot finish while one of your pieces is still there. Leapstone lets you keep a piece at home, so you can block this way. The same goes for you.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Questions</h2>
      <h3>How many people can play Halma?</h3>
      <p>Two or four. Halma is played on a square board of 16 by 16 spots, and every player starts in a corner.</p>
      <h3>How many pieces does each player have in Halma?</h3>
      <p>19 pieces each with 2 players, and 13 pieces each with 4 players.</p>
      <h3>Who invented Halma?</h3>
      <p>George Howard Monks, an American surgeon, in 1883 or 1884. The name is Greek for &ldquo;leap&rdquo;. Read more in <a href="/rules/sternhalma">Sternhalma</a>.</p>
      <h3>What is the difference between Halma and Chinese checkers?</h3>
      <p>Halma uses a square board, with steps and jumps in eight directions and 19 or 13 pieces each. Chinese checkers uses a star board, with six directions and 10 pieces each, for 2, 3, 4 or 6 players. See <a href="/guides/halma-vs-chinese-checkers">Halma vs Chinese checkers</a>.</p>
      <h3>Can you play Halma online for free?</h3>
      <p>Yes, in Leapstone, in your browser or in the app from the App Store. Choose a way to play, such as against the computer or online with friends, and then the Square board. Leapstone is free, with no ads.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Play it</h2>
      <p>The Play now button opens a game against the computer on the <a href="/rules/chinese-checkers">star board</a>. To play Halma, tap the back arrow at the top, then choose Play on this phone, Play against the computer or Play online with friends, and tap the Square board.</p>
      <p>Know the star board already? <a href="/guides/halma-vs-chinese-checkers">Halma vs Chinese checkers</a> lists what is different, and <a href="/guides/chinese-checkers-by-the-numbers">Chinese checkers by the numbers</a> counts the spots and pieces of both boards.</p>
    </section>`;

export default {
  nav: "Halma rules",
  titel: "Halma rules and tips | Leapstone",
  beschrijving: "How to play Halma on the 16 by 16 square board: start, steps, jumps, chains of jumps, how to win, and tips. Play free in your browser.",
  h1: "Halma rules",
  intro: "Move all your pieces across the square board to the opposite corner before anyone else does. The rules in short, with pictures, and a few tips.",
  inhoud,
};
