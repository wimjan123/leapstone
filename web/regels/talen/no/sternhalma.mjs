// Den norske siden "Hva er Sternhalma?" (oppgave 134): navnet og forholdet til Halma og kinasjakk.
// Innhold og kilder: den engelske siden ../en/sternhalma.mjs (Wikipedia Halma og Chinese checkers, se der). Setning for setning på norsk.
// Bevisst utelatt, som på engelsk: hvem som ga ut Stern-Halma i 1892 (kildene er uenige) og patentår.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Hva navnet betyr</h2>
      <p>Sternhalma er det tyske navnet på Halma spilt på et stjerneformet brett. <em>Stern</em> er tysk for stjerne. Navnet Chinese checkers (kinasjakk) er det samme spillet under et navn som ble gitt senere i USA.</p>
      <p>I Leapstone er dette <strong>stjernebrettet</strong>: brettet i <a href="/no/regler/kinasjakk">reglene for kinasjakk (Chinese checkers)</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Hvor det kommer fra</h2>
      <ul>
        <li><strong>Halma</strong> ble oppfunnet i 1883 eller 1884 av George Howard Monks, en amerikansk kirurg. Navnet er gresk for &laquo;hopp&raquo;. Det spilles på et firkantet brett. <a href="/no/regler/halma">Les reglene for Halma</a>.</li>
        <li><strong>Stern-Halma</strong> kom ut i Tyskland i 1892: den samme ideen på et brett formet som en stjerne med seks spisser.</li>
        <li><strong>Chinese checkers</strong> er navnet Bill og Jack Pressman ga spillet i USA i 1928, først som &laquo;Hop Ching checkers&raquo;. Spillet har ingen historisk forbindelse til Kina, og det er ikke et damspill.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan spillene er forskjellige</h2>
      <ul>
        <li><strong>Halma:</strong> et firkantet brett på 16 ganger 16 felt, for 2 eller 4 spillere. En brikke har åtte nabofelt, rette og diagonale. Med 2 spillere har hver 19 brikker, med 4 spillere 13.</li>
        <li><strong>Sternhalma og kinasjakk:</strong> et stjernebrett med 121 felt, for 2, 3, 4 eller 6 spillere. En brikke har seks nabofelt. Alle har 10 brikker.</li>
        <li><strong>Resten er likt:</strong> et steg til et ledig nabofelt eller et hopp over én brikke, med kjeder av hopp. Den første spilleren som fyller leiren på den andre siden av brettet, vinner.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianter, og hva Leapstone gjør</h2>
      <p>Halma har vært spilt på mer enn én måte. Slik skiller Leapstone seg fra variantene vi fant i kildene våre:</p>
      <ul>
        <li><strong>Brettstørrelse.</strong> Halma spilles også på brett på 8 ganger 8 og 10 ganger 10. Leapstone har bare brettet på 16 ganger 16.</li>
        <li><strong>Å forlate målet.</strong> I én Halma-regel kan en brikke som har kommet inn i leiren til motstanderen, ikke forlate den igjen. Leapstone har ikke denne regelen: Du kan flytte en slik brikke igjen.</li>
        <li><strong>Tre spillere på en stjerne.</strong> Et gammelt Halma for tre spillere på et stjernebrett beskrives med 15 brikker hver. Leapstone spiller 3 spillere på stjernebrettet med 10 brikker hver.</li>
        <li><strong>Hopp er ditt valg.</strong> Du må aldri hoppe. Du velger selv feltet der trekket ditt slutter.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Spill det i Leapstone</h2>
      <p>Spill nå åpner et spill på stjernebrettet mot datamaskinen. For det firkantede brettet trykker du på tilbakepilen øverst og velger Firkantet brett i menyen.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjernebrettet med 10 røde brikker i den nederste spissen og 10 blå brikker i den øverste spissen",
  tekst: "Stjernebrettet for 2 spillere.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Hva er Sternhalma? Halma på et stjernebrett | Leapstone",
  beschrijving: "Sternhalma er det tyske navnet på Halma på et stjernebrett. Hvordan det henger sammen med Halma og kinasjakk, og hvordan du spiller det gratis.",
  h1: "Sternhalma, Halma og kinasjakk",
  intro: "Tre navn på nært beslektede spill. Hva hvert av dem betyr, hvor de kommer fra, og hvordan de er forskjellige.",
  inhoud,
};
