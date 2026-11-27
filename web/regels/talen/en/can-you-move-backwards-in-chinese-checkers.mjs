// Korte antwoordpagina: Can you move backwards in Chinese checkers? (taak 314, feature 311). Alleen Engels (zie paginas.mjs).
// Regel uit crates/halma-core: `step_destinations` en `jumps` (game.rs) kijken naar alle zes de buren, nooit naar een richting.
// Plaatje en controles: crates/halma-core/examples/regelplaatjes.rs, blok "Taak 314", plaatje answer-backward.svg. Zie docs/plan.md, taak 314.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="regel">
      <h2 id="regel">The rule</h2>
      <p>A piece can step to any empty spot next to it, or jump over any piece next to it to the empty spot right behind it. Both work in all six directions. The rules do not name a front or a back, so a step or a jump that goes away from your goal is a move like any other.</p>
      <p>The limits are the same in every direction: the spot you land on must be empty, and you cannot jump over an empty spot or over two pieces in a row. In a chain of jumps, a piece also never lands on a spot it already visited in that move, including the spot it started from.</p>
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">A jump backwards can start a long move</h2>
      <p>A step backwards moves you away from your goal, so it rarely helps. A jump is different, because several jumps with one piece count as one move. A jump backwards can be the first link of a chain that ends far ahead of where the piece began.</p>
${plaatje({
  bestand: "answer-backward.svg",
  max: "20rem",
  alt: "A red piece with a white ring jumps backwards over a blue piece, then forwards over two more blue pieces. The three landing spots are numbered 1, 2 and 3.",
  tekst: "One move: red jumps back over a blue piece, then forward over two more. It ends two rows ahead of where it began.",
})}
      <p>Without the first jump, backwards, this piece could not reach the last spot in one move. All three jumps are one move, and the pieces it jumped over stay where they are.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Try it</h2>
      <p><a href="/play/">Play Leapstone in your browser</a> against the computer, or get the app with the buttons at the top of this page. For all the rules, read <a href="/rules/chinese-checkers">Chinese checkers: how to play</a>. For ways to use jumps, read the <a href="/guides/chinese-checkers-strategy">strategy tips</a>. Related questions: <a href="/rules/can-you-jump-your-own-piece-in-chinese-checkers">can you jump your own piece?</a> and <a href="/rules/can-you-jump-over-your-opponent-in-chinese-checkers">can you jump over your opponent?</a></p>
    </section>`;

export default {
  nav: "Can you move backwards?",
  titel: "Can You Move Backwards in Chinese Checkers? | Leapstone",
  beschrijving: "Yes, you can move backwards in Chinese checkers, with a step or a jump. The rule, a picture of a backward jump, and why it can still help.",
  h1: "Can you move backwards in Chinese checkers?",
  intro: "Yes, you can move backwards in Chinese checkers: a piece may step or jump in any of its six directions, forwards, sideways or back.",
  inhoud,
};
