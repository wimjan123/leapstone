// De gids Halma vs Chinese checkers (taak 139, feature 136): /guides/halma-vs-chinese-checkers. Alleen Engels (zie paginas.mjs).
// Elke bewering is nagelopen tegen crates/halma-core (Board::star, Board::square, Game); de plaatjes komen uit
// crates/halma-core/examples/regelplaatjes.rs, dat met assert! stopt als iets niet klopt (blok 19: borden, richtingen, aantallen,
// kampen, doelen, winst). Welke functie bij welke bewering hoort: docs/plan.md, taak 139.
// Geen geschiedenis hier: die staat op de pagina Sternhalma (met bronnen). Wat de app laat zien komt uit web/src/Startmenu.svelte.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Chinese checkers: the star board, 121 spots",
    alt: "The star board with 10 red pieces in the bottom point and 10 blue pieces in the top point",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: the square board, 256 spots",
    alt: "The square board with 19 red pieces in the top left corner and 19 blue pieces in the bottom right corner",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Star board: six neighbors, three of them empty here",
    alt: "A red piece with a white ring around it. Three of its six neighbors are empty and marked; the other three hold pieces.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Square board: eight neighbors, five of them empty here",
    alt: "A red piece with a white ring around it. Five of its eight neighbors are empty and marked; the other three hold pieces.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">The short answer</h2>
      <p>Halma is played on a square board and Chinese checkers on a board shaped like a six-pointed star. In both games you move your pieces by steps and jumps across the board, and the first player to fill the camp on the other side wins.</p>
      <p>What differs is the board, the directions you move in, how many people can play, and how many pieces each of them has. <a href="/rules/sternhalma">Sternhalma</a> is the name for Halma on a star board, so it is the same game as Chinese checkers.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">The boards</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Chinese checkers</strong> uses the star board: 121 spots, with a point of 10 spots at each of the six tips. A point is a triangle of rows of 4, 3, 2 and 1 spots.</li>
        <li><strong>Halma</strong> uses the square board: 16 by 16 spots, 256 in all. A camp sits in a corner. A big camp has rows of 5, 5, 4, 3 and 2 spots, a small camp rows of 4, 4, 3 and 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Directions: six or eight</h2>
      <p>On the star board a spot has six neighbors. On the square board it has eight, because the diagonals count too. A step goes to an empty neighbor. A jump goes over one piece next to yours, in a straight line, to the empty spot behind it, in any of those directions and also backwards.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>A spot at the edge has fewer neighbors, and a corner of the square board has three. Six directions make three lines through a spot on the star board. Eight directions make four lines on the square board: across, up and down, and two diagonals.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Players and pieces</h2>
      <ul>
        <li><strong>Chinese checkers:</strong> 2, 3, 4 or 6 players. Everyone has 10 pieces, so the board holds 20, 30, 40 or 60 pieces.</li>
        <li><strong>Halma:</strong> 2 or 4 players. With 2 players each has 19 pieces, 38 in all. With 4 players each has 13 pieces, 52 in all.</li>
      </ul>
      <p>The square board has no game for 3 or 6 players in Leapstone. For a game with three, read <a href="/guides/chinese-checkers-3-players">Chinese checkers for 3 players</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">What is the same</h2>
      <ul>
        <li><strong>A move:</strong> one step, or a chain of jumps with one piece. You decide where the chain ends, and you cannot step after a jump.</li>
        <li><strong>Any color:</strong> you jump over a piece of any color, also your own. The piece you jump over stays where it is. Nothing is captured.</li>
        <li><strong>The goal:</strong> the camp across from where you started. All its spots must hold your own pieces. While a piece of another player sits there, you cannot finish.</li>
        <li><strong>Winning:</strong> the first player to fill the goal wins. With 2 players the game is over then. With more players the others play on for the next places, and a player who is done is skipped.</li>
        <li><strong>Resigning and time:</strong> when you resign, your pieces leave the board. In an online game every move has a time limit, and if you miss 3 turns in a row you resign.</li>
      </ul>
      <p>Read the full rules of <a href="/rules/chinese-checkers">Chinese checkers</a> and <a href="/rules/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Which board to pick in Leapstone</h2>
      <ul>
        <li><strong>3 or 6 players:</strong> only the star board has them.</li>
        <li><strong>More pieces each:</strong> the square board, with 19 pieces each for 2 players or 13 for 4, against 10 on the star board.</li>
        <li><strong>Play online:</strong> a quick game is played on the star board. With friends, and against the computer, you can pick either board.</li>
      </ul>
      <p>The Play now button opens a game against the computer on the star board. To play on the square board, tap the back arrow at the top and pick the Square board in the menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Keep going</h2>
      <ul>
        <li><a href="/play/">Play in your browser</a> and try both boards.</li>
        <li><a href="/guides/chinese-checkers-strategy">Chinese checkers strategy</a>: six tips with pictures.</li>
        <li><a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>: how a game for two works.</li>
      </ul>
      <p><a href="/guides/play-chinese-checkers-online-with-friends">Chinese checkers online with friends</a></p>
    </section>`;

export default {
  nav: "Halma vs Chinese checkers",
  titel: "Halma vs Chinese checkers: the differences | Leapstone",
  beschrijving: "Halma or Chinese checkers? The square and the star board, six or eight directions, players and pieces, and what is the same.",
  h1: "Halma vs Chinese checkers",
  intro: "Two games with one idea: bring all your pieces across the board to the other side. What differs, what is the same, and where to play both.",
  inhoud,
};
