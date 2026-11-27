// Den norske guiden Kinasjakk for 6 spillere (oppgave 302). Teksten følger ../en/chinese-checkers-6-players.mjs setning for setning.
// Reglene kommer fra crates/halma-core (Board::star med start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) og tidsgrensen fra "Techniek".
// Se docs/plan.md, oppgave 302, for kontrollen per påstand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Slik starter spillet</h2>
      <p>Hver spiller har 10 brikker, og alle 6 spissene på stjernen er i bruk. Det gir 60 brikker på et brett med 121 felt. De 61 feltene i midten er tomme i starten.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Stjernebrettet med 10 brikker i hver av de 6 spissene, i 6 farger",
  tekst: "6 spillere, 6 spisser, 60 brikker.",
})}
      <p>Spiller 1, rød, går først, fra den nederste spissen. Deretter går turen fra Spiller 1 til Spiller 6, og etter Spiller 6 er det Spiller 1 igjen. Spillerne er nummerert i rekkefølgen til spissene sine rundt stjernen, så spilleren etter deg alltid starter i spissen ved siden av din. Et trekk er ett steg eller en kjede av hopp med én brikke. Se <a href="/no/regler/kinasjakk">reglene for kinasjakk</a> for steg og hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hvert mål er fullt i starten</h2>
      <p>Du vinner ved å flytte alle 10 brikkene dine inn i spissen på den andre siden av brettet. Med 6 spillere er det spissen der spilleren rett overfor deg starter, så ingen mål er tomme: hvert mål er i starten fullt av brikkene til en annen spiller. For rød er målet den øverste spissen, der Spiller 4 starter.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Stjernebrettet med 6 fulle spisser. En stiplet ring markerer den øverste spissen, målet til den røde spilleren, som rommer brikkene til spilleren overfor.",
  tekst: "Målet til rød er spissen overfor, full av brikkene til Spiller 4.",
})}
      <p>Du kan bare lande på et tomt felt, så spilleren overfor må forlate spissen sin før du kan fylle den, og du må forlate din før de kan fylle sin. I et spill for 2 er det alt som skal til. Med 6 må begge dessuten komme seg gjennom mylderet av de 4 andre.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">En overfylt midte</h2>
      <p>Hvert mål ligger på den andre siden av brettet, og spissene henger bare sammen gjennom midten, så alle 60 brikkene må krysse de samme 61 feltene. I starten har ingen krysset ennå, og midten fylles raskt.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "En rød brikke hopper tre ganger i ett trekk: over en blå brikke, så en grønn brikke og så en lilla brikke. Tallene 1, 2 og 3 markerer landingsfeltene.",
  tekst: "Brikker i alle farger er trinnsteiner.",
})}
      <p>Du kan hoppe over en brikke i hvilken som helst farge. Brikker fra 5 andre spillere er trinnsteiner for deg, og dine er trinnsteiner for alle 5. En rekke med brikker som du lar stå i midten, er en stige for alle som kan nå den, og spilleren etter deg får første sjanse.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokkere med 5 motstandere</h2>
      <ul>
        <li><strong>Fyll landingsfeltet:</strong> Et hopp krever et tomt felt rett bak brikken. Når du flytter en brikke dit, er hoppet borte for alle spillere som ville bruke det.</li>
        <li><strong>Pass på stigene du bygger:</strong> Etter trekket ditt flytter de andre 5 spillerne før det er din tur igjen. En stige hjelper dem alle.</li>
        <li><strong>Hvem som helst kan blokkere et mål:</strong> En brikke fra en hvilken som helst annen spiller i målet ditt hindrer deg i å bli ferdig, ikke bare en brikke fra spilleren overfor. Alle 10 feltene i målet må rumme dine egne brikker.</li>
      </ul>
      <p><a href="/no/guider/kinasjakk-strategi">Strategitipsene</a> viser hvordan et blokkert hopp ser ut, og hvordan du unngår å sperre en annen spillers brikke inne i ditt eget mål.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Hvor lenge et spill varer</h2>
      <p>I et spill for 6 er det 60 brikker å flytte, og mellom ett trekk av deg og det neste rekker de andre 5 spillerne å flytte én gang hver. Spillet er heller ikke over når den første spilleren blir ferdig.</p>
      <ul>
        <li><strong>Vinn, og spill videre:</strong> Den første spilleren som fyller målet, vinner, og de andre spiller videre om de neste plassene. Spilleren som er ferdig, blir hoppet over, og brikkene til den spilleren blir stående på brettet som trinnsteiner. Spillet er over når bare én spiller fortsatt spiller.</li>
        <li><strong>Gi opp:</strong> Brikkene dine forlater brettet, så de verken blokkerer eller hjelper noen lenger, og de andre spiller videre.</li>
        <li><strong>Tid (på nett):</strong> I et spill på nett har hvert trekk en tidsgrense, som spilleren som starter spillet, bestemmer: 15 sekunder, 30 sekunder, 1 minutt, 2 minutter eller ingen grense. En runde med 6 trekk tar høyst 6 ganger grensen, så med 30 sekunder er det høyst 3 minutter. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp, og spillet fortsetter uten deg.</li>
      </ul>
      <p>For et spill med færre spillere kan du lese <a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 6 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mot datamaskinen, akkurat nå:</strong> Åpne <a href="/play/">Leapstone i nettleseren</a>, trykk på Datamaskin, og velg stjernebrettet og 5 datamaskiner. Du er Spiller 1, så du går først. Datamaskinene flytter etter hverandre, hver med en kort pause, så du kan følge hvert trekk. Du velger Lett, Normal eller Vanskelig for datamaskinene.</li>
        <li><strong>På én telefon:</strong> Trykk på Spill, velg stjernebrettet og 6 spillere, og trykk deretter på en brikke for å bytte den plassen mellom en person og en datamaskin.</li>
        <li><strong>På nett med venner:</strong> Trykk på Venner, velg stjernebrettet, 6 spillere og tiden per trekk, og send invitasjonslenken. Spillet starter når alle 6 plassene er tatt.</li>
        <li><strong>Raske spill:</strong> Spill på nett finner spill for 2 eller 4 spillere, så det finnes ikke noe raskt spill for 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinasjakk for 6 spillere",
  titel: "Kinasjakk for 6 spillere: hele brettet | Leapstone",
  beschrijving: "Slik fungerer kinasjakk med 6 spillere: en full stjerne med 60 brikker, en overfylt midte, blokkering, hvor lenge et spill varer og hvor du spiller.",
  h1: "Kinasjakk for 6 spillere",
  intro: "Slik fungerer et spill for 6: alle 6 spissene er fulle, du kjemper om spissen overfor, og spillet fortsetter etter at den første spilleren er ferdig.",
  inhoud,
};
