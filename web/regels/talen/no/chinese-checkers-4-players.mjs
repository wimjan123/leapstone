// Den norske guiden Kinasjakk for 4 spillere (oppgave 301): /no/guider/kinasjakk-for-fire-spillere.
// Innhold: den engelske guiden ../en/chinese-checkers-4-players.mjs, setning for setning på norsk.
// Ordene for knappene i appen kommer fra web/src/talen/no.ts.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Slik er brettet delt</h2>
      <p>Hver spiller har 10 brikker, så 40 brikker står på et brett med 121 felt. De fire startspissene er to par med spisser som ligger ved siden av hverandre: rød nederst og blå nede til venstre, grønn øverst og gul oppe til høyre.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Stjernebrettet med 10 røde brikker i den nederste spissen, 10 blå brikker i spissen nede til venstre, 10 grønne brikker i den øverste spissen og 10 gule brikker i spissen oppe til høyre. Spissene oppe til venstre og nede til høyre er tomme.",
  tekst: "Rød nederst, blå nede til venstre, grønn øverst, gul oppe til høyre.",
})}
      <p>Spiller 1, rød, går først. Etter det er blå spiller 2, grønn er spiller 3, gul er spiller 4, og etter gul er det rød igjen. Et trekk er ett steg eller en kjede av hopp med én brikke. Se <a href="/no/regler/kinasjakk">reglene for kinasjakk</a> for steg og hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hvem som står mot hvem</h2>
      <p>Spissene danner par på tvers av brettet: rød står mot grønn, og blå står mot gul. Målet ditt er spissen rett overfor deg. Rød skal dit grønn starter, grønn dit rød starter, blå dit gul starter og gul dit blå starter.</p>
      <p>Som i et spill for 2 er hvert mål i starten fullt av brikkene til spilleren som står mot deg, så du kan bare lande der etter at de har forlatt det. Med 3 spillere er målene tomme i starten, så med 4 kan ingen bli ferdig med en gang. De fire målene er fire ulike spisser, så ingen andre vil ha målet ditt: en spiller som er ferdig, blokkerer aldri noen.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">De to tomme spissene</h2>
      <p>Spissene oppe til venstre og nede til høyre har ingen brikker. De er ingens start og ingens mål. Spissen oppe til venstre ligger mellom blå og grønn, og spissen nede til høyre mellom gul og rød.</p>
      <p>Du kan gå eller hoppe til et hvilket som helst tomt felt, så du kan krysse disse spissene eller stoppe i dem. En brikke der er likevel ikke i et mål ennå. Det er ingenting å hoppe over i en tom spiss før noen har satt brikker der.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Hva som endrer seg i taktikken</h2>
      <ul>
        <li><strong>To kryssinger samtidig:</strong> rød og grønn krysser brettet mot hverandre, og det samme gjør blå og gul. Begge linjene går gjennom midten, så det er travlere i midten enn i et spill for 2, der bare én linje krysser.</li>
        <li><strong>Tre spillere flytter mellom turene dine:</strong> brettet endrer seg mer mellom to av trekkene dine enn i et spill for 2. Se på det på nytt i starten av hver tur, og planlegg kjeden av hopp da. Spilleren som går etter deg, er aldri den som står mot deg.</li>
        <li><strong>Brikker hjelper alle:</strong> hver brikke til de tre andre er en trinnstein for deg, og dine er trinnsteiner for dem. Brikkene til spilleren som står mot deg, beveger seg motsatt vei, som i et spill for 2.</li>
        <li><strong>Plass til å gå utenom:</strong> hvis midten er full, er de tomme spissene åpent rom ved siden av leirene. En rute gjennom en av dem kan være en vei utenom trengselen.</li>
        <li><strong>En spiller som gir opp, frigjør målet ditt:</strong> når spilleren som står mot deg gir opp, forlater brikkene deres brettet, så målet ditt er tomt med en gang.</li>
      </ul>
      <p><a href="/no/guider/kinasjakk-strategi">Strategitipsene</a> om stiger, etternølere og å fylle målet bakfra gjelder likt med 4 spillere.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Å vinne, og hva som skjer etterpå</h2>
      <ul>
        <li><strong>Vinne:</strong> Den første spilleren som fyller målet med alle 10 brikkene, vinner. Spillet stopper ikke der: de tre andre spiller videre om de neste plassene, og spilleren som er ferdig, blir hoppet over. Brikkene til den spilleren blir stående på brettet. Spillet er over når bare én spiller fortsatt spiller.</li>
        <li><strong>Gi opp:</strong> Brikkene dine forlater brettet, og de tre andre spiller videre. Hvis de andre også gir opp, vinner den siste spilleren som er igjen.</li>
        <li><strong>Tid (på nett):</strong> I et spill på nett har hvert trekk en tidsgrense. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp, og spillet fortsetter uten deg.</li>
      </ul>
      <p>For spillene med færre spillere kan du lese <a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>. <a href="/no/regler/kinasjakk">Regelsiden</a> har bilder av alle startene.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 4 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mot datamaskinen, akkurat nå:</strong> Åpne <a href="/play/">Leapstone i nettleseren</a>, trykk på Datamaskin, velg stjernebrettet og 3 datamaskiner. Du er spiller 1, så du går først. Du velger Lett, Normal eller Vanskelig for datamaskinene.</li>
        <li><strong>På én telefon:</strong> trykk på Spill, velg stjernebrettet og 4 spillere, og trykk så på en brikke for å bytte plassen mellom en person og en datamaskin.</li>
        <li><strong>På nett med venner:</strong> trykk på Venner, velg stjernebrettet, 4 spillere og tiden per trekk, og send invitasjonslenken. Spillet starter når alle 4 plassene er tatt.</li>
        <li><strong>Raskt spill, i appen:</strong> trykk på Spill på nett. Mens appen leter etter et spill for 2, trykker du på Finn 4 eller 6 spillere for å lete etter et spill for 4 i stedet. Hvert trekk har 30 sekunder. Hvis ikke nok spillere blir med innen 20 sekunder, fyller datamaskinspillere de tomme plassene, så noen motstandere kan være datamaskinspillere.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinasjakk for 4 spillere",
  titel: "Kinasjakk for 4 spillere: oppsett og tips | Leapstone",
  beschrijving: "Slik fungerer kinasjakk med 4 spillere: hvordan brettet deles, hvilke 2 spisser som er tomme, hvem som står mot hvem, taktikken og hvor du kan spille.",
  h1: "Kinasjakk for 4 spillere",
  intro: "Med 4 spillere starter hver av dere i en av fire spisser av stjernen, og to spisser er tomme. Rød står mot grønn og blå står mot gul: målet ditt er spissen rett overfor deg, full av brikkene til den spilleren. Her er oppsettet, de tomme spissene, taktikken og hvor du kan spille det.",
  inhoud,
};
