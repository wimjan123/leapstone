// De spelregelpagina Sternhalma (taak 117): de naam, de relatie met Halma en Chinese checkers.
// Bronnen (opgezocht 2026-11-08), alleen wat daar staat:
// - https://en.wikipedia.org/wiki/Halma : Halma is "invented in 1883 or 1884 by George Howard Monks", een Amerikaanse
//   chirurg; de naam komt van Grieks "hálma", "leap"; borden van 16x16 (standaard), 10x10 en 8x8; 19 stenen per kamp bij
//   2 Spelers en 13 bij 4 Spelers op 16x16; acht richtingen; een steen die in het kamp van de tegenstander is, mag er niet meer uit;
//   een versie voor drie Spelers op een zespuntige ster met vijftien stenen per Speler; Chinese checkers is "originally
//   published in 1892 as Stern-Halma", later hernoemd voor de Amerikaanse markt, en "has no historical connection with China".
// - https://en.wikipedia.org/wiki/Chinese_checkers : "invented in Germany in 1892 under the name Stern-Halma"; "Stern" is
//   Duits voor "star"; de naam "Chinese checkers" kwam in de Verenigde Staten van Bill en Jack Pressman in 1928, eerst
//   "Hop Ching checkers"; het standaardbord heeft 121 vakken.
// - Tweede bron voor Monks (1883/1884) en 1892 Duitsland: https://chinesecheckers.vegard2.net/history.html en
//   https://www.thunderbaymuseum.com/exhibits/virtual/toys-of-our-past/chinese-checkers/ (alleen gezocht, de hoofdlijn komt overeen).
// Bewust weggelaten: wie Stern-Halma in 1892 uitgaf (bronnen verschillen), en wat jaartallen van patenten.
// Wat Leapstone doet staat in crates/halma-core (Board::star, Board::square, Game).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">What the name means</h2>
      <p>Sternhalma is the German name of Halma played on a star-shaped board. <em>Stern</em> is German for star. The name Chinese checkers is the same game under a name given later in the United States.</p>
      <p>In Leapstone this is the <strong>star board</strong>: the board of the <a href="/rules/chinese-checkers">Chinese checkers rules</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Where it comes from</h2>
      <ul>
        <li><strong>Halma</strong> was invented in 1883 or 1884 by George Howard Monks, an American surgeon. The name is Greek for &ldquo;leap&rdquo;. It is played on a square board. <a href="/rules/halma">Read the Halma rules</a>.</li>
        <li><strong>Stern-Halma</strong> appeared in Germany in 1892: the same idea on a board shaped like a six-pointed star.</li>
        <li><strong>Chinese checkers</strong> is the name Bill and Jack Pressman gave the game in the United States in 1928, at first as &ldquo;Hop Ching checkers&rdquo;. The game has no historical link with China, and it is not a checkers game.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">How the games differ</h2>
      <ul>
        <li><strong>Halma:</strong> a square board of 16 by 16 spots, for 2 or 4 players. A piece has eight neighbors, straight and diagonal. With 2 players each has 19 pieces, with 4 players 13.</li>
        <li><strong>Sternhalma and Chinese checkers:</strong> a star board of 121 spots, for 2, 3, 4 or 6 players. A piece has six neighbors. Everyone has 10 pieces.</li>
        <li><strong>The rest is the same:</strong> a step to a free neighbor, or a jump over one piece, with chains of jumps. The first player to fill the camp across the board wins.</li>
      </ul>
      <p>The guide <a href="/guides/halma-vs-chinese-checkers">Halma vs Chinese checkers</a> compares the two boards with pictures.</p>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variants, and what Leapstone does</h2>
      <p>Halma has been played in more than one way. This is how Leapstone compares with the variants we found in our sources:</p>
      <ul>
        <li><strong>Board size.</strong> Halma is also played on 8 by 8 and 10 by 10 boards. Leapstone has only the 16 by 16 board.</li>
        <li><strong>Leaving the goal.</strong> In one Halma rule, a piece that has entered the camp of the opponent may not leave it again. Leapstone does not have this rule: you can move such a piece again.</li>
        <li><strong>Three players on a star.</strong> An old three-player Halma on a star board is described with 15 pieces each. Leapstone plays 3 players on the star board with 10 pieces each.</li>
        <li><strong>Jumps are your choice.</strong> You never have to jump. You pick the spot where your move ends.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Play it in Leapstone</h2>
      <p>Play now opens a game on the star board against the computer. For the square board, tap the back arrow at the top and pick the Square board in the menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "The star board with 10 red pieces in the bottom point and 10 blue pieces in the top point",
  tekst: "The star board for 2 players.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "What is Sternhalma? Halma on a star board | Leapstone",
  beschrijving: "Sternhalma is the German name of Halma on a star board. How it relates to Halma and Chinese checkers, and how to play it free in your browser.",
  h1: "Sternhalma, Halma and Chinese checkers",
  intro: "Three names for closely related games. What each one means, where they come from, and how they differ.",
  inhoud,
};
