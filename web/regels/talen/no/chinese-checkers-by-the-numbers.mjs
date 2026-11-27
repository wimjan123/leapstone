// Leapstone i tall, Noors (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Felt og brikker</h2>
      <p>Telt på de to brettene i Leapstone, i startstillingen for et parti.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Stjernebrettet med alle seks spissene fulle: ti brikker i hver av seks farger, rundt en tom midte.",
  tekst: "Stjernebrettet i starten av et parti for seks spillere.",
})}
      <ul class="tips">
        <li><strong>Stjernebrettet har ${f("sterbord_vakken")} felt.</strong> Hver spiller starter med ${f("sterbord_stenen_per_speler")} brikker. Et parti for to spillere har altså ${f("sterbord_stenen_2_spelers")} brikker på brettet, et for tre har ${f("sterbord_stenen_3_spelers")}, for fire ${f("sterbord_stenen_4_spelers")} og for seks ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Det firkantede Halma-brettet har ${f("vierkant_vakken")} felt.</strong> I et parti for to spillere starter hver spiller med ${f("vierkant_stenen_per_speler_2_spelers")} brikker, ${f("vierkant_stenen_2_spelers")} til sammen. I et parti for fire starter hver med ${f("vierkant_stenen_per_speler_4_spelers")} brikker, ${f("vierkant_stenen_4_spelers")} til sammen.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Den lengste hoppekjeden: ${f("langste_sprongketen")}</h2>
      <p>På stjernebrettet kan én brikke gjøre <strong>${f("langste_sprongketen")} hopp i ett eneste trekk</strong>, og etter reglene i Leapstone kan ingen trekk ha flere. For å nå det tallet er de andre brikkene satt fritt ut: én på hvert felt som brikken hopper over.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Et stjernebrett med én rød brikke og mange blå brikker. Hvite piler viser den røde brikken som hopper over den ene blå brikken etter den andre, langs en lang og svingete vei.",
  tekst: "Den lengste kjeden: den røde brikken hopper over hver blå brikke, én etter én.",
})}
      <p><strong>Slik er det telt.</strong> Et hopp lander alltid to felt unna, i rett linje. En brikke som fortsetter å hoppe, når derfor bare en del av feltene: brettet deler seg i fire slike grupper, og den største har ${f("grootste_klasse_vakken")} felt. I Leapstone kan en brikke ikke lande to ganger på samme felt i ett trekk, og heller ikke på feltet den startet fra. En kjede lander altså høyst én gang på hvert av de andre feltene i gruppen sin. Programmet søkte gjennom den gruppen og fant en vei gjennom alle ${f("grootste_klasse_vakken")} feltene, så ingen kjede kan være lengre: ${f("langste_sprongketen")} hopp. En test spiller deretter det trekket med reglene i Leapstone.</p>
      <p><strong>Ikke et ekte parti.</strong> Denne kjeden trenger ${f("langste_sprongketen")} andre brikker, hver på nøyaktig riktig felt. Et parti for to eller tre spillere har bare ${f("sterbord_stenen_2_spelers")} eller ${f("sterbord_stenen_3_spelers")} brikker, og det er for få. Et parti for fire eller seks spillere har ${f("sterbord_stenen_4_spelers")} eller ${f("sterbord_stenen_6_spelers")}, og det er nok. Men i et ekte parti setter ingen ut brikker fritt, så ikke regn med denne kjeden ved bordet. Den viser hva brettet tillater, ikke hva som skjer i spillet.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Den korteste overfarten: ${f("oversteek_zetten")} trekk</h2>
      <p>Én spiller alene på stjernebrettet, uten motstandere, trenger <strong>${f("oversteek_zetten")} trekk</strong> for å flytte alle ${f("sterbord_stenen_per_speler")} brikkene fra én spiss til spissen rett overfor, og klarer det ikke på færre. En hel hoppekjede teller som ett trekk.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Et stjernebrett med bare ti røde brikker, i den nederste spissen. Den øverste spissen, dit de skal, har en stiplet kant.",
  tekst: "Én spiller alene: ti brikker i den nederste spissen, og den øverste spissen er målet.",
})}
      <p><strong>Slik er det telt.</strong> En test spiller en overfart på ${f("oversteek_zetten")} trekk med reglene i Leapstone, uten andre brikker på brettet. For å vise at ${f("geen_oversteek_in_zetten")} trekk eller færre ikke går, følger et søk metoden til G. I. Bell (<em>Integers</em> 9, 2009). Hvert trekk kan spilles baklengs, og en halv omdreining av brettet bytter start og mål. Hvis det fantes en overfart på ${f("geen_oversteek_in_zetten")} trekk eller færre, ville altså en stilling halvveis ligge høyst ${f("zoekdiepte_zetten")} trekk fra starten, og den samme stillingen dreid en halv omdreining også. Søket gikk gjennom hver stilling innenfor ${f("zoekdiepte_zetten")} trekk fra starten, telte en stilling og speilbildet av den én gang, utelot dem som beviselig ikke kan komme langt nok i tide, og fant ikke noe slikt par. Det kjørte i ${f("gemeten_rekentijd_seconden")} sekunder på en maskin med ${f("gemeten_kernen")} kjerner, og det største steget holdt ${f("gemeten_grootste_laag_miljoen_standen")} millioner stillinger i ${f("gemeten_geheugen_gb")} GB minne. Tallet ble regnet ut på nytt for Leapstones eget brett.</p>
      <p><strong>Ikke en nedre grense for et ekte parti.</strong> I et ekte parti står også de andre spillernes brikker på brettet, og brikkene dine kan hoppe over dem. ${f("oversteek_zetten")} er altså ikke det minste et ekte parti kan ta: det er bare bevist for én spiller alene.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Prøv selv</h2>
      <p><a href="/play/">Spill Leapstone i nettleseren</a> mot datamaskinen, eller hent appen med knappene øverst på siden. Reglene står i <a href="/no/regler/kinasjakk">Regler for kinasjakk</a> og i <a href="/no/regler/halma">reglene for Halma</a>. Hvordan du bruker hoppekjeder i et parti, kan du lese i <a href="/no/guider/kinasjakk-strategi">strategitipsene</a>.</p>
    </section>`;

export default {
  nav: "Kinasjakk i tall",
  titel: "Kinasjakk i tall | Leapstone",
  beschrijving: `Stjernebrettet har ${c.sterbord_vakken} felt. Ett trekk har høyst ${c.langste_sprongketen} hopp, og en spiller alene trenger ${c.oversteek_zetten} trekk for å krysse det. Slik regnes hvert tall ut.`,
  h1: "Kinasjakk i tall",
  intro: `Stjernebrettet i kinasjakk har ${f("sterbord_vakken")} felt, og hver spiller starter med ${f("sterbord_stenen_per_speler")} brikker. I Leapstone kan ett trekk aldri ha flere enn ${f("langste_sprongketen")} hopp. Én spiller alene på brettet, uten motstandere, trenger ${f("oversteek_zetten")} trekk for å krysse det. Nedenfor ser du hvordan hvert tall er telt, og hva det sier og ikke sier om et ekte parti.`,
  inhoud,
};
