// Gids met feiten over de borden: Chinese checkers by the numbers (taak 320, feature 313). Engels is de bron; taak 321 vertaalde hem in elke taal.
// Elk getal komt via f() uit web/regels/cijfers.json (zie ../../cijfers.mjs). Berekening en opzet van elk feit: docs/plan.md, taak 319.
// Plaatjes: regelplaatjes.rs, blok 23.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Spots and pieces</h2>
      <p>Counted on the two boards of Leapstone, in the starting position of a game.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "The star board with all six points full: ten pieces in each of six colors, around an empty middle.",
  tekst: "The star board at the start of a game for six players.",
})}
      <ul class="tips">
        <li><strong>The star board has ${f("sterbord_vakken")} spots.</strong> Each player starts with ${f("sterbord_stenen_per_speler")} pieces. So a game for two players has ${f("sterbord_stenen_2_spelers")} pieces on the board, a game for three has ${f("sterbord_stenen_3_spelers")}, for four ${f("sterbord_stenen_4_spelers")} and for six ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>The square Halma board has ${f("vierkant_vakken")} spots.</strong> In a game for two players, each player starts with ${f("vierkant_stenen_per_speler_2_spelers")} pieces, ${f("vierkant_stenen_2_spelers")} in all. In a game for four, each starts with ${f("vierkant_stenen_per_speler_4_spelers")} pieces, ${f("vierkant_stenen_4_spelers")} in all.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">The longest chain of jumps: ${f("langste_sprongketen")}</h2>
      <p>On the star board, one piece can make <strong>${f("langste_sprongketen")} jumps in a single move</strong>, and under the rules of Leapstone no move can have more. To reach that number, the other pieces are placed freely: one on every spot the piece jumps over.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "A star board with one red piece and many blue pieces. White arrows show the red piece jumping over one blue piece after another, along a long winding path.",
  tekst: "The longest chain: the red piece jumps over every blue piece, one after another.",
})}
      <p><strong>How it is counted.</strong> A jump always lands two spots away in a straight line. So a piece that keeps jumping can only reach some of the spots: the board splits into four such groups, and the largest has ${f("grootste_klasse_vakken")} spots. In Leapstone, a piece may not land on the same spot twice in one move, or on the spot where it started, so a chain lands at most once on each of the other spots in its group. The program searched that group and found a path that visits all ${f("grootste_klasse_vakken")} spots, so no chain can be longer: ${f("langste_sprongketen")} jumps. A test then plays that move with the rules of Leapstone.</p>
      <p><strong>Not a real game.</strong> This chain needs ${f("langste_sprongketen")} other pieces, each on exactly the right spot. A game for two or three players has only ${f("sterbord_stenen_2_spelers")} or ${f("sterbord_stenen_3_spelers")} pieces, which is too few. A game for four or six players has ${f("sterbord_stenen_4_spelers")} or ${f("sterbord_stenen_6_spelers")}, which is enough. But in a real game nobody places pieces freely, so do not expect this chain at the table. It shows what the board allows, not what happens in play.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">The shortest crossing: ${f("oversteek_zetten")} moves</h2>
      <p>One player alone on the star board, with no opponents, needs <strong>${f("oversteek_zetten")} moves</strong> to bring all ${f("sterbord_stenen_per_speler")} pieces from one point to the point across, and cannot do it in fewer. A whole chain of jumps counts as one move.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "A star board with only ten red pieces, in the bottom point. The top point, where they have to go, has a dashed outline.",
  tekst: "One player alone: ten pieces in the bottom point, and the top point is the goal.",
})}
      <p><strong>How it is counted.</strong> A test plays a crossing of ${f("oversteek_zetten")} moves with the rules of Leapstone, with no other pieces on the board. To show that ${f("geen_oversteek_in_zetten")} moves or fewer cannot work, a search follows the method of G. I. Bell (<em>Integers</em> 9, 2009). Every move can be played backwards, and turning the board half a turn swaps the start and the goal. So if a crossing of ${f("geen_oversteek_in_zetten")} moves or fewer existed, some position halfway would be at most ${f("zoekdiepte_zetten")} moves from the start, and so would the same position turned half a turn. The search went through every position within ${f("zoekdiepte_zetten")} moves of the start, counted a position and its mirror image once, left out the ones that provably cannot get far enough in time, and found no such pair. It ran for ${f("gemeten_rekentijd_seconden")} seconds on a machine with ${f("gemeten_kernen")} cores, and its largest step held ${f("gemeten_grootste_laag_miljoen_standen")} million positions in ${f("gemeten_geheugen_gb")} GB of memory. The number was worked out again for Leapstone's own board.</p>
      <p><strong>Not a lower limit for a real game.</strong> In a real game, the pieces of other players are on the board too, and your pieces can jump over them. So ${f("oversteek_zetten")} is not the least a real game can take: it is only proven for one player alone.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Try it</h2>
      <p><a href="/play/">Play Leapstone in your browser</a> against the computer, or get the app with the buttons at the top of this page. For the rules, read <a href="/rules/chinese-checkers">Chinese checkers: how to play</a> or the <a href="/rules/halma">rules of Halma</a>. For ways to use chains of jumps in a game, read the <a href="/guides/chinese-checkers-strategy">strategy tips</a>.</p>
    </section>`;

export default {
  nav: "By the numbers",
  titel: "Chinese Checkers by the Numbers | Leapstone",
  beschrijving: `The star board has ${c.sterbord_vakken} spots. One move can hold at most ${c.langste_sprongketen} jumps, and a player alone needs ${c.oversteek_zetten} moves to cross. How each number is worked out.`,
  h1: "Chinese checkers by the numbers",
  intro: `The star board of Chinese checkers has ${f("sterbord_vakken")} spots, and each player starts with ${f("sterbord_stenen_per_speler")} pieces. In Leapstone, one move can never have more than ${f("langste_sprongketen")} jumps. A player alone on the board, with no opponents, needs ${f("oversteek_zetten")} moves to cross it. Below you can see how each number is counted, and what it does and does not tell you about a real game.`,
  inhoud,
};
