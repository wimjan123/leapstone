// Leapstone i siffror, Zweeds (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Platser och pjäser</h2>
      <p>Räknade på Leapstones två brädor, i startställningen för ett parti.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Stjärnbrädet med alla sex spetsar fulla: tio pjäser i var och en av sex färger, runt en tom mitt.",
  tekst: "Stjärnbrädet i början av ett parti för sex spelare.",
})}
      <ul class="tips">
        <li><strong>Stjärnbrädet har ${f("sterbord_vakken")} platser.</strong> Varje spelare börjar med ${f("sterbord_stenen_per_speler")} pjäser. Ett parti för två spelare har alltså ${f("sterbord_stenen_2_spelers")} pjäser på brädet, ett för tre har ${f("sterbord_stenen_3_spelers")}, för fyra ${f("sterbord_stenen_4_spelers")} och för sex ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Det fyrkantiga Halmabrädet har ${f("vierkant_vakken")} platser.</strong> I ett parti för två spelare börjar varje spelare med ${f("vierkant_stenen_per_speler_2_spelers")} pjäser, ${f("vierkant_stenen_2_spelers")} sammanlagt. I ett parti för fyra börjar var och en med ${f("vierkant_stenen_per_speler_4_spelers")} pjäser, ${f("vierkant_stenen_4_spelers")} sammanlagt.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Den längsta hoppkedjan: ${f("langste_sprongketen")}</h2>
      <p>På stjärnbrädet kan en pjäs göra <strong>${f("langste_sprongketen")} hopp i ett enda drag</strong>, och enligt Leapstones regler kan inget drag ha fler. För att nå det antalet är de andra pjäserna fritt utplacerade: en på varje plats som pjäsen hoppar över.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Ett stjärnbräde med en röd pjäs och många blå pjäser. Vita pilar visar hur den röda pjäsen hoppar över den ena blå pjäsen efter den andra, längs en lång och slingrande väg.",
  tekst: "Den längsta kedjan: den röda pjäsen hoppar över varje blå pjäs, en efter en.",
})}
      <p><strong>Så räknas det.</strong> Ett hopp landar alltid två platser bort, i rak linje. En pjäs som fortsätter hoppa når därför bara en del av platserna: brädet delas upp i fyra sådana grupper, och den största har ${f("grootste_klasse_vakken")} platser. I Leapstone får en pjäs inte landa två gånger på samma plats i ett drag, och inte heller på platsen där den började. En kedja landar alltså högst en gång på var och en av de andra platserna i sin grupp. Programmet sökte igenom den gruppen och hittade en väg som går genom alla ${f("grootste_klasse_vakken")} platser, så ingen kedja kan vara längre: ${f("langste_sprongketen")} hopp. Ett test spelar sedan det draget med Leapstones regler.</p>
      <p><strong>Inget riktigt parti.</strong> Den här kedjan behöver ${f("langste_sprongketen")} andra pjäser, var och en på precis rätt plats. Ett parti för två eller tre spelare har bara ${f("sterbord_stenen_2_spelers")} eller ${f("sterbord_stenen_3_spelers")} pjäser, och det är för få. Ett parti för fyra eller sex spelare har ${f("sterbord_stenen_4_spelers")} eller ${f("sterbord_stenen_6_spelers")}, och det räcker. Men i ett riktigt parti placerar ingen ut pjäser fritt, så räkna inte med den här kedjan vid bordet. Den visar vad brädet tillåter, inte vad som händer i spel.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Den kortaste överfarten: ${f("oversteek_zetten")} drag</h2>
      <p>En spelare ensam på stjärnbrädet, utan motståndare, behöver <strong>${f("oversteek_zetten")} drag</strong> för att flytta alla ${f("sterbord_stenen_per_speler")} pjäser från en spets till spetsen mittemot, och klarar det inte på färre. En hel hoppkedja räknas som ett drag.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Ett stjärnbräde med bara tio röda pjäser, i den nedre spetsen. Den övre spetsen, dit de ska, har en streckad kant.",
  tekst: "En spelare ensam: tio pjäser i den nedre spetsen, och den övre spetsen är målet.",
})}
      <p><strong>Så räknas det.</strong> Ett test spelar en överfart på ${f("oversteek_zetten")} drag med Leapstones regler, utan andra pjäser på brädet. För att visa att ${f("geen_oversteek_in_zetten")} drag eller färre inte går, följer en sökning G. I. Bells metod (<em>Integers</em> 9, 2009). Varje drag kan spelas baklänges, och ett halvt varv av brädet byter plats på start och mål. Om det fanns en överfart på ${f("geen_oversteek_in_zetten")} drag eller färre, skulle alltså någon ställning halvvägs ligga högst ${f("zoekdiepte_zetten")} drag från starten, och samma ställning vriden ett halvt varv också. Sökningen gick igenom varje ställning inom ${f("zoekdiepte_zetten")} drag från starten, räknade en ställning och dess spegelbild en gång, lämnade bort dem som bevisligen inte hinner tillräckligt långt i tid, och hittade inget sådant par. Den körde i ${f("gemeten_rekentijd_seconden")} sekunder på en maskin med ${f("gemeten_kernen")} kärnor, och dess största steg rymde ${f("gemeten_grootste_laag_miljoen_standen")} miljoner ställningar i ${f("gemeten_geheugen_gb")} GB minne. Talet räknades fram på nytt för Leapstones eget bräde.</p>
      <p><strong>Ingen nedre gräns för ett riktigt parti.</strong> I ett riktigt parti står även de andra spelarnas pjäser på brädet, och dina pjäser kan hoppa över dem. ${f("oversteek_zetten")} är alltså inte det minsta ett riktigt parti kan ta: det är bara bevisat för en spelare ensam.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Prova själv</h2>
      <p><a href="/play/">Spela Leapstone i webbläsaren</a> mot datorn, eller hämta appen med knapparna högst upp på sidan. Reglerna finns i <a href="/sv/regler/kinaschack">Regler för kinaschack</a> och i <a href="/sv/regler/halma">reglerna för Halma</a>. Hur du använder hoppkedjor i ett parti läser du i <a href="/sv/guider/kinaschack-strategi">strategitipsen</a>.</p>
    </section>`;

export default {
  nav: "Kinaschack i siffror",
  titel: "Kinaschack i siffror | Leapstone",
  beschrijving: `Stjärnbrädet har ${c.sterbord_vakken} platser. Ett drag har högst ${c.langste_sprongketen} hopp, och en spelare ensam behöver ${c.oversteek_zetten} drag för att ta sig över. Så räknas varje tal ut.`,
  h1: "Kinaschack i siffror",
  intro: `Stjärnbrädet i kinaschack har ${f("sterbord_vakken")} platser, och varje spelare börjar med ${f("sterbord_stenen_per_speler")} pjäser. I Leapstone kan ett drag aldrig ha fler än ${f("langste_sprongketen")} hopp. En spelare ensam på brädet, utan motståndare, behöver ${f("oversteek_zetten")} drag för att ta sig över. Här nedanför ser du hur varje tal räknas, och vad det säger och inte säger om ett riktigt parti.`,
  inhoud,
};
