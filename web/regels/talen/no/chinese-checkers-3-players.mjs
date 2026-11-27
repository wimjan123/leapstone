// Den norske guiden Kinasjakk for 3 spillere (oppgave 299): /no/guider/kinasjakk-for-tre-spillere.
// Innhold: den engelske guiden ../en/chinese-checkers-3-players.mjs, setning for setning på norsk. Reglene er kontrollert mot crates/halma-core (se den engelske filen).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Slik starter spillet</h2>
      <p>Hver spiller har 10 brikker, så 30 brikker står på et brett med 121 felt. De starter i annenhver spiss av stjernen: rød nederst, blå øverst til venstre og grønn øverst til høyre. De tre spissene imellom er tomme.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Stjernebrettet med 10 røde brikker i den nederste spissen, 10 blå brikker i spissen øverst til venstre og 10 grønne brikker i spissen øverst til høyre",
  tekst: "Rød nederst, blå øverst til venstre, grønn øverst til høyre.",
})}
      <p>Spiller 1, rød, går først. Deretter er blå spiller 2 og grønn spiller 3, og etter grønn er det rød igjen. Et trekk er ett steg eller en kjede av hopp med én brikke. Se <a href="/no/regler/kinasjakk">reglene for kinasjakk</a> for steg og hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tre mål, alle tomme i starten</h2>
      <p>Målet ditt er spissen rett overfor der du startet, og med 3 spillere er den tom i starten. Det er den tomme spissen mellom startene til de to andre spillerne: målet til rød er øverst, til blå nederst til høyre og til grønn nederst til venstre.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Stjernebrettet for tre spillere. Stiplede sirkler i fargen til hver spiller markerer de tre tomme målene: rød øverst, blå nederst til høyre, grønn nederst til venstre.",
  tekst: "Hvert mål har fargen til spilleren sin.",
})}
      <p>Du vinner ved å flytte alle 10 brikkene dine inn i målet. Alle 10 feltene må ha dine egne brikker. Ingen starter i målet ditt, men du kan stoppe på hvilket som helst tomt felt, så en brikke fra en annen spiller kan lande der senere. Så lenge den står der, kan du ikke bli ferdig.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Å vinne, og hva som skjer etterpå</h2>
      <ul>
        <li><strong>Vinne:</strong> Den første spilleren som fyller målet, vinner. Spillet stopper ikke der: de to andre spiller videre om de neste plassene, og spilleren som er ferdig, blir hoppet over. Spillet er over når bare én spiller fortsatt spiller.</li>
        <li><strong>Gi opp:</strong> Brikkene dine forlater brettet, og de to andre spiller videre. Hvis en andre spiller gir opp før noen er ferdig, vinner den siste spilleren som er igjen.</li>
        <li><strong>Tid (på nett):</strong> I et spill på nett har hvert trekk en tidsgrense, som spilleren som starter spillet, bestemmer. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp, og spillet fortsetter uten deg.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan det er annerledes enn et spill for 2</h2>
      <ul>
        <li><strong>Flere brikker:</strong> 30 på brettet, mot 20 med 2 spillere.</li>
        <li><strong>Tomme mål:</strong> med 2 spillere starter målet ditt fullt av brikkene til den andre spilleren. Med 3 starter det tomt.</li>
        <li><strong>To motstandere:</strong> etter trekket ditt flytter to andre spillere før det er din tur igjen. Brikkene til begge er trinnsteiner for deg, og dine for dem. En stige du bygger, kan brukes av begge, og spilleren etter deg får det første hoppet.</li>
        <li><strong>Spillet fortsetter:</strong> med 2 spillere er spillet over når en av dere er ferdig. Med 3 fortsetter det om andre og tredje plass.</li>
      </ul>
      <p>For spillet med to, les <a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>. <a href="/no/guider/kinasjakk-strategi">Strategitipsene</a> handler om steg og hopp, som er like med 3 spillere.</p>
      <p><a href="/no/guider/kinasjakk-online-med-venner">Kinasjakk på nett med venner</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 3 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mot datamaskinen, akkurat nå:</strong> Åpne <a href="/play/">Leapstone i nettleseren</a>, trykk på Datamaskin, og velg stjernebrettet og 2 datamaskiner. Du er spiller 1, så du går først. Du velger Lett, Normal eller Vanskelig for datamaskinene.</li>
        <li><strong>På én telefon:</strong> trykk på «På denne telefonen», velg stjernebrettet og 3 spillere, og trykk så på en brikke for å bytte den plassen mellom en person og en datamaskin.</li>
        <li><strong>På nett med venner:</strong> trykk på Venner, velg stjernebrettet, 3 spillere og tiden per trekk, og send invitasjonslenken. Spillet starter når alle 3 plassene er tatt.</li>
        <li><strong>Raske spill:</strong> Spill på nett finner spill for 2 eller 4 spillere, så det finnes ikke noe raskt spill for 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinasjakk for 3 spillere",
  titel: "Kinasjakk for 3 spillere: oppsett og regler | Leapstone",
  beschrijving: "Slik fungerer kinasjakk med 3 spillere: hvor de 30 brikkene starter, hvilken tom spiss som er hvert mål, hvem som går først, og hvordan du vinner.",
  h1: "Kinasjakk for 3 spillere",
  intro: "Slik fungerer et spill for tre på stjernebrettet: oppsettet, de tre målene, hvem som går først, hvordan du vinner, og hvor du kan spille det.",
  inhoud,
};
