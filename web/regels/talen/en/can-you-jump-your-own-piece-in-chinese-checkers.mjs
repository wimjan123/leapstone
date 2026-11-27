// Korte antwoordpagina: Can you jump your own piece in Chinese checkers? (taak 314, feature 311). Alleen Engels (zie paginas.mjs).
// Regel uit crates/halma-core: `jumps` in game.rs eist een steen op het tussenvak (`stones[over].is_some()`), van welke Speler ook, en een leeg landingsvak.
// Plaatje en controles: crates/halma-core/examples/regelplaatjes.rs, blok "Taak 314", plaatje answer-own-piece.svg. Zie docs/plan.md, taak 314.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="regel">
      <h2 id="regel">The rule</h2>
      <p>You may jump over any piece next to yours, whoever it belongs to. What counts is only that there is a piece to jump over and that the spot right behind it is empty. A piece of your own is a piece like any other.</p>
${plaatje({
  bestand: "answer-own-piece.svg",
  max: "20rem",
  alt: "A red piece with a white ring jumps over another red piece, then over a blue piece. The two landing spots are numbered 1 and 2.",
  tekst: "One move: red jumps over its own piece, then over a blue piece.",
})}
    </section>

    <section aria-labelledby="grenzen">
      <h2 id="grenzen">What stays the same</h2>
      <ul>
        <li><strong>Nothing is captured:</strong> the piece you jump over stays where it is, also when it is yours.</li>
        <li><strong>Two in a row:</strong> you cannot jump over two of your own pieces standing next to each other, because the spot behind the first one is taken.</li>
        <li><strong>A chain:</strong> after a jump, the same piece may jump again, over your pieces or those of others. All the jumps are one move.</li>
      </ul>
    </section>

    <section aria-labelledby="nut">
      <h2 id="nut">Why it matters</h2>
      <p>Your own pieces are stepping stones. A line of pieces with one empty spot between each of them, and an empty spot after the last one, lets a piece right before the first one jump the whole line in a single move, and it does not matter whose pieces they are. Building such a ladder is the main idea of the game, and the <a href="/guides/chinese-checkers-strategy">strategy tips</a> show how.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Try it</h2>
      <p><a href="/play/">Play Leapstone in your browser</a> against the computer, or get the app with the buttons at the top of this page. For all the rules, read <a href="/rules/chinese-checkers">Chinese checkers: how to play</a>. Related questions: <a href="/rules/can-you-move-backwards-in-chinese-checkers">can you move backwards?</a> and <a href="/rules/can-you-jump-over-your-opponent-in-chinese-checkers">can you jump over your opponent?</a></p>
    </section>`;

export default {
  nav: "Can you jump your own piece?",
  titel: "Can You Jump Your Own Piece in Chinese Checkers? | Leapstone",
  beschrijving: "Yes, you can jump your own piece in Chinese checkers. You may jump over any piece if the spot behind it is empty. The rule and a picture.",
  h1: "Can you jump your own piece in Chinese checkers?",
  intro: "Yes, you can jump your own piece in Chinese checkers: you may jump over any piece next to yours, of any color, as long as the spot right behind it is empty.",
  inhoud,
};
