// De spelregelpagina Chinese checkers (taak 116). Elke regel hier is nagelopen tegen crates/halma-core
// (zie docs/plan.md, taak 116). De plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} players`,
      alt:
        {
          2: "The star board with 10 red pieces in the bottom point and 10 blue pieces in the top point",
          3: "The star board with red pieces at the bottom, blue at the top left and green at the top right",
          4: "The star board with pieces in four points: red at the bottom, green at the top, blue at the bottom left and yellow at the top right",
          6: "The star board with pieces in all six points, in six colors",
        }[n],
    }),
  )
  .join("\n        ");

// Het plaatje bovenaan (taak 316): het bord met de stenen op de plek waar ze beginnen. Niet lui laden: het staat in het eerste scherm.
const bordBovenaan = `    <figure class="enkel voorplaat" style="--max: 20rem"><img src="/rules/img/setup-2.svg" width="308" height="349" alt="The Chinese checkers star board with 10 red pieces in the bottom point and 10 blue pieces in the top point" decoding="async" /><figcaption>The star board at the start of a 2-player game. Each player aims for the point across.</figcaption></figure>

`;

const inhoud = bordBovenaan + `    <section aria-labelledby="bord">
      <h2 id="bord">The board</h2>
      <p>Chinese checkers is played on a star with six points. The board has 121 spots, and every point has 10 of them. Inside the board, each spot has six neighbors.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">How the pieces start</h2>
      <p>Every player has 10 pieces and starts with them in one point of the star. The point across from yours is your goal.</p>
      <ul>
        <li><strong>2 players:</strong> the two points across from each other.</li>
        <li><strong>3 players:</strong> every other point. The three goals start empty.</li>
        <li><strong>4 players:</strong> two pairs of points that sit next to each other. Every player has another player across.</li>
        <li><strong>6 players:</strong> all six points.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Taking turns</h2>
      <p>Player 1 goes first. Then the turns go in order, Player 2, Player 3 and so on, and after the last player it is Player 1 again. In Leapstone the colors go with the numbers: red, blue, green, yellow, purple and silver.</p>
      <p>On your turn you move one piece, once. Nothing is captured: pieces stay on the board until their player resigns.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">A step</h2>
      <p>Move a piece to an empty spot next to it.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "A red piece with a white ring around it. Three of its six neighbors are empty and marked; the other three hold pieces.",
  tekst: "The red piece can step to the three marked spots. The other three neighbors are taken.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">A jump</h2>
      <p>Jump over one piece next to yours, of any color, and land on the empty spot right behind it, in a straight line. You can jump in any of the six directions, also backwards. Three short answers: <a href="/rules/can-you-move-backwards-in-chinese-checkers">can you move backwards?</a>, <a href="/rules/can-you-jump-your-own-piece-in-chinese-checkers">can you jump your own piece?</a> and <a href="/rules/can-you-jump-over-your-opponent-in-chinese-checkers">can you jump over your opponent?</a></p>
      <ul>
        <li>The spot you land on must be empty.</li>
        <li>You cannot jump over two pieces in a row, or over an empty spot.</li>
        <li>The piece you jump over stays where it is.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "A red piece jumps over a blue piece to the empty spot behind it, shown with an arrow.",
  tekst: "The red piece jumps over the blue piece.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">A chain of jumps</h2>
      <p>After a jump, the same piece may jump again, as many times as it can and in any direction. You decide where to stop. All the jumps together are one move.</p>
      <ul>
        <li>In one move you cannot land on the same spot twice.</li>
        <li>A move is one step, or one or more jumps. You cannot step after a jump.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "A red piece makes three jumps in one move, over a blue, a green and another blue piece. The three landing spots are numbered 1, 2 and 3.",
  tekst: "One move with three jumps, in the order of the numbers.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">The goal</h2>
      <p>You win by moving all 10 of your pieces into the point across from where you started. All 10 spots of that point must hold your own pieces. While a piece of another player sits there, you cannot finish.</p>
      <p>You may land on any empty spot, also in the points of other players.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "A star board for three players. Red starts at the bottom; the empty point at the top, marked with dashed circles, is red's goal.",
  tekst: "With 3 players, red starts at the bottom. Red's goal is the empty point at the top.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">With 2, 3, 4 or 6 players</h2>
      <ul>
        <li><strong>2 players:</strong> the first player to fill the goal wins, and the game is over.</li>
        <li><strong>3, 4 or 6 players:</strong> the first player to fill the goal wins. The others play on for the next places, and a player who is done is skipped. The game is over when only one player is still playing.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Resigning</h2>
      <p>When you resign, your pieces leave the board, so they do not block anyone. With 2 players, the other player wins. With more players the game goes on without you, and if everyone but one player resigns, the last player wins.</p>
      <p>In an online game every move has a time limit. The player who starts the game sets it, and in a quick game it is 30 seconds. When your time runs out, your turn is skipped. If you miss 3 turns in a row, you resign. Games against the computer and on one phone have no time limit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Build ladders.</strong> Put pieces in a line with one empty spot between them, pointing at your goal. One piece can then jump along the whole line in a single move.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Four pieces in a diagonal line with an empty spot between each. A red piece at one end jumps over all four, with four numbered landing spots.",
  tekst: "Four pieces in a line: the red piece at the top crosses the board in one move, with four jumps.",
})}
        </li>
        <li><strong>Any piece is a ladder.</strong> You can jump over every color, so the pieces of the other players help you too. And your own ladders help them: look at what you leave behind.</li>
        <li><strong>Do not forget the stragglers.</strong> You need all 10 pieces home. A piece far behind, with nothing to jump over, moves one spot per turn. Bring it along while the other pieces are still around it.</li>
        <li><strong>Your start is their goal.</strong> With 2, 4 or 6 players, your start point is the goal of the player across from you, and they cannot finish while one of your pieces is still there. The same goes for you.</li>
      </ul>
      <p>More tips, with pictures, are in the <a href="/guides/chinese-checkers-strategy">Chinese checkers strategy</a> guide. For a game with two, read <a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>, and for a game with three, <a href="/guides/chinese-checkers-3-players">Chinese checkers for 3 players</a>. Wondering how it differs from the square board? Read <a href="/guides/halma-vs-chinese-checkers">Halma vs Chinese checkers</a>. Want to know how many spots the board has, or the longest chain of jumps? Read <a href="/guides/chinese-checkers-by-the-numbers">Chinese checkers by the numbers</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Questions</h2>
      <h3>How many people can play Chinese checkers?</h3>
      <p>Two, three, four or six. Every player starts in one point of the star. With 2, 3 or 4 players, some points stay empty.</p>
      <h3>How many marbles does each player have?</h3>
      <p>Every player has 10 marbles, or pieces. The board has 121 spots: 10 in each of the six points and 61 in the middle.</p>
      <h3>Can you jump over your own pieces, or backwards?</h3>
      <p>Yes. You can jump over a piece of any color, your own too, in any of the six directions, also backwards. The piece you jump over stays where it is.</p>
      <h3>Do you capture pieces in Chinese checkers?</h3>
      <p>No. Nothing is captured. A piece only leaves the board when its player resigns.</p>
      <h3>Is Chinese checkers from China?</h3>
      <p>No. The game appeared in Germany in 1892 as Stern-Halma, based on the older game Halma. The name Chinese checkers comes from the United States, in 1928. Read more in <a href="/rules/sternhalma">Sternhalma</a>.</p>
      <h3>Where can you play Chinese checkers online with friends for free?</h3>
      <p>In Leapstone, in your browser or in the app from the App Store. Send a friend an invite link: they join your game without an account, email address or password. You can also play the computer, or a quick game against another player. Leapstone is free, with no ads.</p>
    </section>`;

export default {
  nav: "Chinese checkers rules",
  titel: "How to play Chinese checkers: the rules | Leapstone",
  beschrijving: "How to play Chinese checkers: move all 10 pieces to the opposite point with steps and jumps. Rules for 2, 3, 4 or 6 players, with pictures. Play free.",
  h1: "Chinese checkers rules: how to play",
  intro: "Chinese checkers is a game for 2, 3, 4 or 6 players. The goal is to move all 10 of your pieces across the star board to the opposite point before anyone else. On your turn you move one piece, by a step to an empty spot next to it or by jumping over a piece to the empty spot behind it, and you may keep jumping. The first player to fill the opposite point wins.",
  inhoud,
};
