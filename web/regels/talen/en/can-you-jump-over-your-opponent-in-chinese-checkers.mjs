// Korte antwoordpagina: Can you jump over your opponent in Chinese checkers? (taak 315, feature 311). Alleen Engels (zie paginas.mjs).
// Regels uit crates/halma-core (game.rs): `jumps` eist een steen op het tussenvak, van welke Speler ook, en een leeg landingsvak;
// `make_move` verzet alleen de eigen steen (niets geslagen) en neemt ook een stap aan als er een Sprong kan; `resign` haalt de stenen van die Speler weg.
// Plaatje en controles: crates/halma-core/examples/regelplaatjes.rs, blok "Taak 315", plaatje answer-opponent.svg. Zie docs/plan.md, taak 315.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="regel">
      <h2 id="regel">The rule</h2>
      <p>A jump goes over one piece next to yours and lands on the empty spot right behind it, in a straight line. The color of that piece does not matter: it can be your opponent's, your own, or that of any other player. After a jump, the same piece may jump again, so one move can go over several of your opponent's pieces.</p>
${plaatje({
  bestand: "answer-opponent.svg",
  max: "20rem",
  alt: "A red piece with a white ring jumps over a blue piece, then over a second blue piece in the same line. The two landing spots are numbered 1 and 2.",
  tekst: "One move: red jumps over two blue pieces. Both blue pieces stay on the board.",
})}
    </section>

    <section aria-labelledby="dammen">
      <h2 id="dammen">Not like checkers</h2>
      <p>If you know checkers, two things work differently.</p>
      <ul>
        <li><strong>Nothing is captured:</strong> a jump moves only your own piece. The piece you jump over stays on its spot, and every player keeps all their pieces. In Leapstone a piece only leaves the board when its player gives up.</li>
        <li><strong>Jumping is never required:</strong> when you can jump, you may still make a step, or move another piece.</li>
      </ul>
      <p>You do not win by taking pieces. You win by being the first to get all 10 of your pieces into the point across the board, or by being the last player left when everyone else gives up.</p>
    </section>

    <section aria-labelledby="andersom">
      <h2 id="andersom">Your opponent can do the same</h2>
      <p>The rule works both ways: your opponent may jump over your pieces. A piece of yours with an empty spot behind it is a stepping stone for them. No piece can jump two pieces in a row, of any color, in one jump: the spot behind the first one is taken, so there is nowhere to land.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Try it</h2>
      <p><a href="/play/">Play Leapstone in your browser</a> against the computer, or get the app with the buttons at the top of this page. For all the rules, read <a href="/rules/chinese-checkers">Chinese checkers: how to play</a>. Related questions: <a href="/rules/can-you-jump-your-own-piece-in-chinese-checkers">can you jump your own piece?</a> and <a href="/rules/can-you-move-backwards-in-chinese-checkers">can you move backwards?</a></p>
    </section>`;

export default {
  nav: "Can you jump over your opponent?",
  titel: "Can You Jump Over Opponents in Chinese Checkers? | Leapstone",
  beschrijving: "Yes, you can jump over your opponent's pieces in Chinese checkers, and nothing is captured. The rule, a picture, and how it differs from checkers.",
  h1: "Can you jump over your opponent in Chinese checkers?",
  intro: "Yes, you can jump over your opponent's pieces in Chinese checkers. Unlike in checkers, the piece you jump over is not captured: it stays where it is.",
  inhoud,
};
