// Leapstone i tal, Deens (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Felter og brikker</h2>
      <p>Talt på Leapstones to brætter, i startstillingen for et spil.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Stjernebrættet med alle seks spidser fulde: ti brikker i hver af seks farver, rundt om en tom midte.",
  tekst: "Stjernebrættet i starten af et spil for seks spillere.",
})}
      <ul class="tips">
        <li><strong>Stjernebrættet har ${f("sterbord_vakken")} felter.</strong> Hver spiller starter med ${f("sterbord_stenen_per_speler")} brikker. Et spil for to spillere har altså ${f("sterbord_stenen_2_spelers")} brikker på brættet, et for tre har ${f("sterbord_stenen_3_spelers")}, for fire ${f("sterbord_stenen_4_spelers")} og for seks ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Det firkantede Halmabræt har ${f("vierkant_vakken")} felter.</strong> I et spil for to spillere starter hver spiller med ${f("vierkant_stenen_per_speler_2_spelers")} brikker, ${f("vierkant_stenen_2_spelers")} i alt. I et spil for fire starter hver med ${f("vierkant_stenen_per_speler_4_spelers")} brikker, ${f("vierkant_stenen_4_spelers")} i alt.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Den længste hopkæde: ${f("langste_sprongketen")}</h2>
      <p>På stjernebrættet kan én brik lave <strong>${f("langste_sprongketen")} hop i ét enkelt træk</strong>, og efter Leapstones regler kan intet træk have flere. For at nå det tal er de andre brikker sat frit op: én på hvert felt, som brikken hopper over.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Et stjernebræt med én rød brik og mange blå brikker. Hvide pile viser den røde brik hoppe over den ene blå brik efter den anden, ad en lang, snoet vej.",
  tekst: "Den længste kæde: den røde brik hopper over hver blå brik, én efter én.",
})}
      <p><strong>Sådan er det talt.</strong> Et hop lander altid to felter væk, i lige linje. En brik, der bliver ved med at hoppe, når derfor kun en del af felterne: brættet deler sig i fire sådanne grupper, og den største har ${f("grootste_klasse_vakken")} felter. I Leapstone må en brik ikke lande to gange på det samme felt i ét træk, og heller ikke på det felt, den startede fra. En kæde lander altså højst én gang på hvert af de andre felter i sin gruppe. Programmet gennemsøgte den gruppe og fandt en vej gennem alle ${f("grootste_klasse_vakken")} felter, så ingen kæde kan være længere: ${f("langste_sprongketen")} hop. En test spiller derefter det træk med Leapstones regler.</p>
      <p><strong>Ikke et rigtigt spil.</strong> Denne kæde kræver ${f("langste_sprongketen")} andre brikker, hver på præcis det rigtige felt. Et spil for to eller tre spillere har kun ${f("sterbord_stenen_2_spelers")} eller ${f("sterbord_stenen_3_spelers")} brikker, og det er for få. Et spil for fire eller seks spillere har ${f("sterbord_stenen_4_spelers")} eller ${f("sterbord_stenen_6_spelers")}, og det er nok. Men i et rigtigt spil sætter ingen brikker frit op, så regn ikke med denne kæde ved bordet. Den viser, hvad brættet tillader, ikke hvad der sker i spillet.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Den korteste overfart: ${f("oversteek_zetten")} træk</h2>
      <p>Én spiller alene på stjernebrættet, uden modstandere, skal bruge <strong>${f("oversteek_zetten")} træk</strong> for at flytte alle ${f("sterbord_stenen_per_speler")} brikker fra én spids til spidsen overfor, og kan ikke gøre det i færre. En hel hopkæde tæller som ét træk.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Et stjernebræt med kun ti røde brikker, i den nederste spids. Den øverste spids, hvor de skal hen, har en stiplet kant.",
  tekst: "Én spiller alene: ti brikker i den nederste spids, og den øverste spids er målet.",
})}
      <p><strong>Sådan er det talt.</strong> En test spiller en overfart på ${f("oversteek_zetten")} træk med Leapstones regler, uden andre brikker på brættet. For at vise, at ${f("geen_oversteek_in_zetten")} træk eller færre ikke kan lade sig gøre, følger en søgning G. I. Bells metode (<em>Integers</em> 9, 2009). Hvert træk kan spilles baglæns, og en halv omgang af brættet bytter start og mål. Hvis der fandtes en overfart på ${f("geen_oversteek_in_zetten")} træk eller færre, ville en stilling halvvejs altså ligge højst ${f("zoekdiepte_zetten")} træk fra starten, og den samme stilling drejet en halv omgang også. Søgningen gik hver stilling inden for ${f("zoekdiepte_zetten")} træk fra starten igennem, talte en stilling og dens spejlbillede én gang, udelod dem, der beviseligt ikke kan nå langt nok i tide, og fandt intet sådant par. Den kørte i ${f("gemeten_rekentijd_seconden")} sekunder på en maskine med ${f("gemeten_kernen")} kerner, og dens største trin rummede ${f("gemeten_grootste_laag_miljoen_standen")} millioner stillinger i ${f("gemeten_geheugen_gb")} GB hukommelse. Tallet blev regnet ud igen for Leapstones eget bræt.</p>
      <p><strong>Ikke en nedre grænse for et rigtigt spil.</strong> I et rigtigt spil står de andre spilleres brikker også på brættet, og dine brikker kan hoppe over dem. ${f("oversteek_zetten")} er altså ikke det mindste, et rigtigt spil kan tage: det er kun bevist for én spiller alene.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Prøv det</h2>
      <p><a href="/play/">Spil Leapstone i din browser</a> mod computeren, eller hent appen med knapperne øverst på siden. Reglerne står i <a href="/da/regler/kinaskak">Regler for kinaskak</a> og i <a href="/da/regler/halma">reglerne for Halma</a>. Hvordan du bruger hopkæder i et spil, kan du læse i <a href="/da/guider/kinaskak-strategi">strategitipsene</a>.</p>
    </section>`;

export default {
  nav: "Kinaskak i tal",
  titel: "Kinaskak i tal | Leapstone",
  beschrijving: `Stjernebrættet har ${c.sterbord_vakken} felter. Ét træk har højst ${c.langste_sprongketen} hop, og en spiller alene skal bruge ${c.oversteek_zetten} træk for at krydse det. Sådan regnes hvert tal ud.`,
  h1: "Kinaskak i tal",
  intro: `Stjernebrættet i kinaskak har ${f("sterbord_vakken")} felter, og hver spiller starter med ${f("sterbord_stenen_per_speler")} brikker. I Leapstone kan ét træk aldrig have flere end ${f("langste_sprongketen")} hop. Én spiller alene på brættet, uden modstandere, skal bruge ${f("oversteek_zetten")} træk for at krydse det. Herunder kan du se, hvordan hvert tal er talt, og hvad det siger og ikke siger om et rigtigt spil.`,
  inhoud,
};
