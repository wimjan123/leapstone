// De gids Chinese checkers opening moves (taak 303, feature 294): /guides/chinese-checkers-opening-moves.
// Elk getal en elke zet is nagelopen tegen crates/halma-core; de plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs (sectie
// "taak 303"), dat met assert! stopt als iets niet klopt met de regels. Welke regel waar is gecontroleerd: docs/plan.md, taak 303.
// Een "rij" is alle vakken met dezelfde afstand tot je eigen punt; een stap schuift 1 rij op, een Sprong 2. Geen verzonnen "experts" of geschiedenis.
// Alleen cijfers in de tekst (geen getalwoorden): regelstalen.test.ts eist dezelfde getallen in elke taal.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Your first move: 14 choices</h2>
      <p>At the start your 10 pieces fill a triangle in rows of 4, 3, 2 and 1, and the front row faces the middle of the board. There is no empty spot inside the triangle, so a piece can only go to the row just in front of it. That leaves 14 first moves: each of the 4 pieces in the front row can step to 2 spots (8 steps), and each of the 3 pieces in the second row can jump over a front piece to 2 spots (6 jumps). The other 3 pieces cannot move yet.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "The red point at the bottom with its 10 pieces, and in the row just in front of it 5 empty spots marked with a ring.",
  tekst: "Every first move ends in one of these 5 spots.",
})}
      <p>In this guide a row is a line of spots across your point, parallel to its front edge, and we count progress in rows. A step takes a piece forward 1 row and a jump takes it 2 rows. Every player has the same 14 first moves, with 2, 3, 4 or 6 players and from any point of the star, because every point looks the same from the inside.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Opening 1: jump out, then free the tip</h2>
      <p>The piece in the tip of your point is the farthest from your goal, and it cannot move at the start: it can only jump over a piece if the spot behind that piece is empty. A jump from the second row makes exactly such a spot.</p>
      <ol>
        <li><strong>Move 1:</strong> the piece at the right end of your second row jumps over the piece in front of it. It lands in the row in front of your point and gains 2 rows.</li>
        <li><strong>Move 2:</strong> the piece in the tip jumps twice in one move: first into the spot that move 1 emptied, then over a piece of the second row. It gains 4 rows.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "The red point after move 1. The piece in the tip has a ring, and 2 arrows with the numbers 1 and 2 show its jumps through the emptied spot to the row in front of the point.",
  tekst: "After move 1 the tip piece jumps out in 2 jumps.",
})}
      <p>That is 6 rows in 2 moves. We tried every way to play 2 moves, and 6 is the most you can gain. Only 4 pairs of moves reach it: the piece at either end of the second row jumps, in either of its 2 directions, and the tip piece follows. The piece in the middle of the second row does not work, because it keeps the tip shut in.</p>
      <p>Both pieces now stand in the row in front of your point with an empty spot between them. That is the first step of a ladder.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Opening 2: 4 moves with 4 different pieces</h2>
      <p>Over 4 moves the most you can gain is 13 rows, and you only get there when every move uses a different piece. This line does it:</p>
      <ol>
        <li><strong>Move 1:</strong> the piece at the right end of the front row steps forward. It gains 1 row.</li>
        <li><strong>Move 2:</strong> the piece at the right end of the third row jumps twice. It gains 4 rows.</li>
        <li><strong>Move 3:</strong> the piece at the left end of the second row jumps twice. It gains 4 rows.</li>
        <li><strong>Move 4:</strong> the piece in the tip jumps twice. It gains 4 rows.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "The red point at the start. The 4 pieces that will move have a number from 1 to 4, in the order of the moves.",
          tekst: "Before: the pieces that move, in order.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "The red point after 4 moves, with the 4 spots where the numbered pieces landed in the rows in front of the point, and 4 holes left behind in the point.",
          tekst: "After: where they landed.",
        })}
      </div>
      <p>Each move prepares the next one. Moves 2 and 3 end with a jump over the piece that moved just before, and move 4 starts through the hole that move 3 left. All 4 pieces land in your own half of the board.</p>
      <p>There are more lines that reach 13. What they share is the idea: look for the move that leaves a hole or a stepping stone for the next move, and let the tip piece out by move 4 at the latest.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Mistakes in the first moves</h2>
      <ul class="tips">
        <li><strong>Moving the same piece every turn.</strong> A piece that runs alone gains 5 rows in 4 moves, against 13 for 4 different pieces. It also leaves the rest of your pieces where they were.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "The red point at the start. One piece from the second row makes 4 moves in a row along one line, with arrows and the numbers 1 to 4, and ends alone near the middle of the board.",
  tekst: "One piece, 4 moves, 5 rows.",
})}
      <ul class="tips">
        <li><strong>Only stepping with the front row.</strong> 4 steps gain 4 rows. After them the piece in the tip still cannot move, so it stays at the back while the rest goes ahead.</li>
        <li><strong>Stepping sideways.</strong> A step along a row gains 0 rows. After move 1 of opening 1 the piece in front can step to the spot next to it, and it looks like progress, but the move is wasted.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Keep going</h2>
      <p>After about 4 moves the two armies come close, and the openings above give way to the middle of the game. You do not need to remember the lines: remember that every move should prepare the next.</p>
      <ul>
        <li><a href="/play/">Play the computer in your browser</a> and try opening 1 or 2.</li>
        <li><a href="/guides/chinese-checkers-strategy">Chinese checkers strategy</a>: ladders, keeping your pieces together and filling your goal.</li>
        <li><a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>: how a game for two works.</li>
        <li><a href="/rules/chinese-checkers">Chinese checkers rules</a>, with pictures of steps, jumps and chains.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinese checkers opening moves",
  titel: "Chinese checkers opening moves: 2 openings | Leapstone",
  beschrijving: "Chinese checkers opening moves: how to jump out of your point, free the tip piece by move 2 and gain 13 rows in 4 moves, and the mistakes to avoid.",
  h1: "Chinese checkers opening moves",
  intro: "A good opening in Chinese checkers jumps out of the second row, uses a different piece every turn, and lets the piece in your tip out by move 2 or 4. Two openings with pictures, and the mistakes to avoid.",
  inhoud,
};
