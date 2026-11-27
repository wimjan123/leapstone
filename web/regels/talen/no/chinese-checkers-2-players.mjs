// Den norske guiden Kinasjakk for 2 spillere (oppgave 134): /no/guider/kinasjakk-for-to-spillere.
// Reglene kommer fra crates/halma-core (Board::star, Game::new_star(2), make_move, resign) og fra "Regels" og oppgave 80 for tidsgrensen.
// Nivåene til datamaskinspilleren kommer fra crates/halma-core/src/computer.rs (Level, choose_move).
// Hva appen viser kommer fra web/src/Startmenu.svelte og landingssiden. Innhold: den engelske guiden ../en/chinese-checkers-2-players.mjs, setning for setning på norsk.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Slik starter spillet</h2>
      <p>Hver spiller har 10 brikker. De starter i to spisser av stjernen som vender mot hverandre: rød nederst, blå øverst. De 20 brikkene står på et brett med 121 felt.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjernebrettet med 10 røde brikker i den nederste spissen og 10 blå brikker i den øverste spissen",
  tekst: "Rød starter nederst, blå øverst.",
})}
      <p>Spiller 1, rød, går først. Etter det bytter dere på å flytte, ett trekk hver. Et trekk er ett steg eller en kjede av hopp med én brikke. Se <a href="/no/regler/kinasjakk">reglene for kinasjakk</a> for steg og hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet ditt er starten til den andre</h2>
      <p>Du vinner ved å flytte alle 10 brikkene dine inn i spissen der den andre spilleren startet. Den spissen er i starten full av brikkene deres, og din er full av dine. For rød er det den øverste spissen på bildet ovenfor.</p>
      <p>Du kan bare lande på et tomt felt, så dere må begge forlate egen spiss før den andre kan fylle den. Ingen av dere kan bli ferdig så lenge en brikke fra den andre blir stående i målet. Og siden dere krysser den samme midten i hver sin retning, er brikkene til den andre spilleren trinnsteiner for deg, og dine for dem. Les <a href="/no/guider/kinasjakk-strategi">strategitipsene</a> for hva du kan gjøre med det.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Å vinne og gi opp</h2>
      <ul>
        <li><strong>Vinne:</strong> Den første spilleren som fyller målet med alle 10 brikkene, vinner, og spillet er over med en gang. Den andre spilleren spiller ikke videre.</li>
        <li><strong>Gi opp:</strong> Brikkene dine forlater brettet, og den andre spilleren vinner.</li>
        <li><strong>Tid (på nett):</strong> I et spill på nett har hvert trekk en tidsgrense. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan 3, 4 og 6 spillere er annerledes</h2>
      <ul>
        <li><strong>3 spillere:</strong> Brikkene starter i annenhver spiss, og de tre målene er tomme i starten. Den første spilleren som blir ferdig, vinner; de andre spiller videre om de neste plassene, og en spiller som er ferdig, blir hoppet over.</li>
        <li><strong>4 spillere:</strong> to par med spisser ved siden av hverandre. Målet ditt er i starten fullt av brikkene til en annen spiller. Spillet fortsetter etter den første som blir ferdig, som med 3.</li>
        <li><strong>6 spillere:</strong> alle seks spissene. Brettet rommer 60 brikker mot 20 med 2 spillere.</li>
      </ul>
      <p>Med bare 20 brikker på brettet er det færre brikker å hoppe over, så stigene du bygger selv, betyr mer. <a href="/no/regler/kinasjakk">Regelsiden</a> har bilder av alle startene.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 2 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mot datamaskinen, akkurat nå:</strong> Åpne <a href="/play/">Leapstone i nettleseren</a>, trykk på Datamaskin og velg stjernebrettet. Én datamaskin er standard, så det er et spill for 2. Du velger Lett, Normal eller Vanskelig, og du er spiller 1, så du går først. Lett velger det beste av tre tilfeldige trekk. Normal velger trekket som gir mest framgang mot målet. Vanskelig ser også på hvordan motstanderne kan svare, og på sitt eget neste trekk.</li>
        <li><strong>Spill på nett, i appen:</strong> et raskt spill på stjernebrettet for 2 spillere, mot en annen spiller på ditt nivå, med 30 sekunder per trekk. Noen motstandere på nett kan være datamaskinspillere.</li>
        <li><strong>Med en venn:</strong> send en invitasjonslenke, og bestem selv tiden per trekk. Eller send én telefon fram og tilbake.</li>
      </ul>
      <p><a href="/no/guider/kinasjakk-online-med-venner">Kinasjakk på nett med venner</a></p>
      <p><a href="/no/guider/kinasjakk-for-tre-spillere">Kinasjakk for 3 spillere</a></p>
    </section>`;

export default {
  nav: "Kinasjakk for 2 spillere",
  titel: "Kinasjakk for 2 spillere: oppsett og regler | Leapstone",
  beschrijving: "Slik fungerer kinasjakk med 2 spillere: hvor de 10 brikkene starter, hvem som går først, hvordan du vinner eller gir opp, og hvor du spiller gratis.",
  h1: "Kinasjakk for 2 spillere",
  intro: "Slik fungerer et spill for to på stjernebrettet: oppsettet, hvem som går først, hvordan du vinner, og hvor du kan spille det.",
  inhoud,
};
