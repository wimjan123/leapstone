// De gids Chinese checkers strategy (taak 122, feature 118): /guides/chinese-checkers-strategy.
// Elke tip is nagelopen tegen crates/halma-core; de plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs,
// dat met assert! stopt als een plaatje niet klopt met de regels. Welke functie of test bij welke tip hoort: docs/plan.md, taak 122.
// Geen verzonnen "experts", cijfers of geschiedenis. Het enige getal is 16 (stappen van punt tot punt), dat het voorbeeld natelt.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">What these tips rest on</h2>
      <p>The tips follow from the <a href="/rules/chinese-checkers">rules of Chinese checkers</a> as Leapstone plays them: one move is one step or a chain of jumps, and you can jump over a piece of any color. They are not a proof of best play. Playing against the computer is the quickest way to try them.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Build ladders</h2>
      <p>A ladder is a line of pieces with one empty spot between each of them. The pieces can be yours or not (<a href="/rules/can-you-jump-your-own-piece-in-chinese-checkers">can you jump your own piece?</a>). A piece at one end jumps over the whole line in a single move, so it crosses the board in one turn instead of one spot per turn.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Four pieces in a diagonal line with an empty spot between each. A red piece at one end jumps over all four, with four numbered landing spots.",
  tekst: "Four jumps in one move. The same piece could only step one spot at a time.",
})}
      <p>A jump works in all six directions, also backwards (<a href="/rules/can-you-move-backwards-in-chinese-checkers">can you move backwards?</a>), so a ladder does not have to start in your own point. Any line of pieces with gaps between them will do.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Keep your pieces together</h2>
      <p>You need all 10 pieces in your goal, so your last piece decides when you finish. A piece with no piece next to it has nothing to jump over, and can only step.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "A star board with a red piece alone in the bottom point. Only its two empty neighbors are marked. Other red and blue pieces stand in the middle.",
  tekst: "This piece has no neighbor, so it can only step to the two marked spots.",
})}
      <p>From the tip of your own point to the tip of the goal across the board is 16 steps. That is 16 turns for one piece on its own, while a ladder crosses in one. Move the pieces at the back while there are still pieces around them to jump over. The computer in Leapstone does this too: it scores moves of its rearmost pieces a little higher.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Use the middle</h2>
      <p>A piece in the middle of the board has six neighbors, so it can step or jump in all six directions. A piece at the edge has fewer. The piece at the edge in the picture has four.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "A star board with one red piece in the middle with six marked neighbors, and one red piece near the top left edge with four marked neighbors.",
  tekst: "Six ways to step in the middle, four at the edge.",
})}
      <p>Pieces in the middle also give the other pieces something to jump over on their way across.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Fill the goal from the back</h2>
      <p>Your goal is a triangle of 10 spots, in rows of 4, 3, 2 and 1. The spots at the back can only be reached through the spots in front of them. If you fill the front first, the last piece may have no way in.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "The goal point at the top with nine red pieces and one empty spot at the very back, marked with dashes. A tenth red piece, with a white ring, stands below the front row.",
  tekst: "Nine pieces are home, and the spot at the back is empty. The tenth piece has no move into it.",
})}
      <p>Put the first pieces into the back spots and work toward the front, so the front stays open for the pieces that arrive last.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Do not wall in a piece in your goal</h2>
      <p>You may stop in the point of another player, so a piece of the other player can end up in your goal. You win only when all 10 spots of your goal hold your own pieces. If that piece has no move, nobody can move it, and you cannot win until a spot next to it opens.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "The goal point at the top with nine red pieces and one blue piece at the very back, marked with a white ring. The blue piece is surrounded by red pieces.",
  tekst: "The blue piece at the back has no move, and red cannot fill the goal.",
})}
      <p>Keep a spot next to such a piece open, so it can leave. The computer in Leapstone counts this: a move that traps a piece of another player in its goal scores lower. The rules do not make anyone leave your goal, so the other player can also park a piece there on purpose.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Block a jump, or leave it</h2>
      <p>A jump needs an empty spot to land on. Fill that spot and the jump is gone. Two pieces in a row cannot be jumped either.</p>
      <p>Your pieces are stepping stones for the other player too. In the left picture blue crosses two red pieces in one move. On the right, red moved one piece into the first landing spot, and blue can only step.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "A blue piece with two red pieces in a line, each with an empty spot behind it. Arrows show two jumps by the blue piece.",
          tekst: "Before: blue can make two jumps.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "The same line after red moved its far piece into the first landing spot. Blue's piece is followed by two red pieces in a row.",
          tekst: "After: red moved one piece. Blue has no jump.",
        })}
      </div>
      <p>A move spent blocking is a move not spent on your own progress, so block when the jump gives the other player more than your move would give you. It works the other way round when you build a ladder: after your move, the other player moves first, so a piece of theirs at one end uses your ladder before you do. On the hardest level, the computer looks at the best reply of each opponent before it chooses a move.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Keep going</h2>
      <ul>
        <li><a href="/play/">Play the computer in your browser</a> and try a ladder.</li>
        <li><a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>: how a game for two works.</li>
        <li><a href="/rules/chinese-checkers">Chinese checkers rules</a>, with pictures of steps, jumps and chains.</li>
      </ul>
      <p>Playing with three? Read <a href="/guides/chinese-checkers-3-players">Chinese checkers for 3 players</a>. Curious about the square board? Read <a href="/guides/halma-vs-chinese-checkers">Halma vs Chinese checkers</a>.</p>
      <p><a href="/guides/play-chinese-checkers-online-with-friends">Chinese checkers online with friends</a></p>
      <p>How long can a chain of jumps be? <a href="/guides/chinese-checkers-by-the-numbers">Chinese checkers by the numbers</a> has the answer, and how it is counted.</p>
    </section>`;

export default {
  nav: "Chinese checkers strategy",
  titel: "Chinese checkers strategy: 6 tips with pictures | Leapstone",
  beschrijving: "Chinese checkers strategy: build ladders, keep your pieces together, use the middle, fill your goal from the back, and know when to block a jump.",
  h1: "Chinese checkers strategy",
  intro: "Six tips for the star board, each with a picture from the real rules: ladders, stragglers, the middle, filling your goal, and blocking jumps.",
  inhoud,
};
