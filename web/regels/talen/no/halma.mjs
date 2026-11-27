// Den norske regelsiden Halma, oppgave 134. Innhold: den engelske siden ../en/halma.mjs (kontrollert mot crates/halma-core,
// se docs/plan.md, oppgave 117), setning for setning på norsk. Endrer man en regel, endrer man begge.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 spillere: 19 brikker hver",
    alt: "Det firkantede brettet med 19 røde brikker i hjørnet øverst til venstre og 19 blå brikker i hjørnet nederst til høyre",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 spillere: 13 brikker hver",
    alt: "Det firkantede brettet med 13 brikker i hvert av de fire hjørnene: rød øverst til venstre, blå øverst til høyre, grønn nederst til høyre og gul nederst til venstre",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brettet</h2>
      <p>Halma spilles på et firkantet brett på 16 ganger 16 felt, 256 til sammen. Hvert felt har opptil åtte nabofelt: de fire rette og de fire diagonale. Et felt i kanten har færre, og et hjørne har tre.</p>
      <p>Dette er Firkantet brett i Leapstone. Hvis du kjenner spillet fra stjernebrettet, kan du lese om <a href="/no/regler/hva-er-sternhalma">Sternhalma</a> og <a href="/no/regler/kinasjakk">reglene for kinasjakk</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Slik starter brikkene</h2>
      <p>Halma er for 2 eller 4 spillere. Hver spiller starter med brikkene i en leir i et hjørne av brettet. Leiren i det motsatte hjørnet er målet ditt.</p>
      <ul>
        <li><strong>2 spillere:</strong> 19 brikker hver, i to hjørner overfor hverandre. Leiren er fem rader med 5, 5, 4, 3 og 2 felt.</li>
        <li><strong>4 spillere:</strong> 13 brikker hver, én leir i hvert hjørne. Leiren er fire rader med 4, 4, 3 og 2 felt. Målet ditt er hjørnet på den andre siden av brettet, på tvers av diagonalen.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Etter tur</h2>
      <p>Spiller 1 går først. Deretter går turen videre i rekkefølge, og etter den siste spilleren er det spiller 1 igjen. I Leapstone hører fargene til numrene: rød, blå, grønn og gul.</p>
      <p>Når det er din tur, flytter du én brikke, én gang. Ingenting blir slått: Brikkene blir på brettet til spilleren deres gir opp.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Et steg</h2>
      <p>Flytt en brikke til et tomt felt ved siden av den, i en av de åtte retningene: rett fram eller diagonalt.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "En rød brikke med en hvit ring rundt. Fem av de åtte nabofeltene er tomme og markerte; på de tre andre står det en brikke.",
  tekst: "Den røde brikken kan gå til de fem markerte feltene. De tre andre nabofeltene er opptatt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Et hopp</h2>
      <p>Hopp over en brikke ved siden av din, uansett farge, og land på det tomme feltet rett bak den, i en rett linje. Du kan hoppe i alle åtte retninger, også diagonalt og bakover.</p>
      <ul>
        <li>Feltet du lander på, må være tomt.</li>
        <li>Du kan ikke hoppe over to brikker på rad eller over et tomt felt.</li>
        <li>Brikken du hopper over, blir der den er.</li>
        <li>Du kan ikke hoppe ut over kanten av brettet.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "En rød brikke hopper diagonalt over en blå brikke til det tomme feltet bak, vist med en pil.",
  tekst: "Den røde brikken hopper diagonalt over den blå brikken.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kjede av hopp</h2>
      <p>Etter et hopp kan den samme brikken hoppe igjen, så mange ganger den kan, i alle retninger, rett fram eller diagonalt. Du bestemmer hvor du stopper. Alle hoppene til sammen er ett trekk.</p>
      <ul>
        <li>I ett trekk kan du ikke lande på det samme feltet to ganger.</li>
        <li>Et trekk er ett steg eller ett eller flere hopp. Du kan ikke ta et steg etter et hopp.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "En rød brikke tar tre hopp i ett trekk: diagonalt over en blå brikke, rett fram over en annen blå brikke og diagonalt over en rød brikke. De tre landingsfeltene er nummerert 1, 2 og 3.",
  tekst: "Ett trekk med tre hopp, i rekkefølgen til tallene.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinner ved å flytte alle brikkene dine inn i leiren overfor der du startet. Hvert felt i den leiren må ha dine egne brikker: 19 med 2 spillere, 13 med 4 spillere. Så lenge en brikke fra en annen spiller står der, kan du ikke bli ferdig.</p>
      <p>Du kan lande på et hvilket som helst tomt felt, også i leirene til de andre spillerne. En brikke som står i målet ditt, kan gå ut igjen; ingenting låser den.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Det firkantede brettet for to spillere. Rød starter øverst til venstre; leiren nederst til høyre, markert med stiplede sirkler og med blå brikker i, er målet til rød.",
  tekst: "Med 2 spillere er målet til rød leiren der blå starter.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2 eller 4 spillere</h2>
      <ul>
        <li><strong>2 spillere:</strong> Den første spilleren som har fylt målet, vinner, og spillet er over.</li>
        <li><strong>4 spillere:</strong> Den første spilleren som har fylt målet, vinner. De andre spiller videre om de neste plassene, og en spiller som er ferdig, blir hoppet over. Spillet er over når bare én spiller fortsatt spiller.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Å gi opp</h2>
      <p>Når du gir opp, forsvinner brikkene dine fra brettet, slik at de ikke blokkerer noen. Med 2 spillere vinner den andre spilleren. Med 4 spillere fortsetter spillet uten deg, og hvis alle unntatt én spiller gir opp, vinner den siste spilleren.</p>
      <p>I et spill på nett har hvert trekk en tidsgrense. Spilleren som starter spillet, velger den. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp. Spill mot datamaskinen og på én telefon har ingen tidsgrense.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bygg stiger.</strong> Sett brikker på en rad med ett tomt felt imellom, rett fram eller diagonalt, i retning av målet ditt. Én brikke kan da hoppe langs hele raden i ett trekk.</li>
        <li><strong>Enhver brikke er en stige.</strong> Du kan hoppe over alle farger, så brikkene til de andre spillerne hjelper deg også. Og dine egne stiger hjelper dem: Se på hva du etterlater.</li>
        <li><strong>Bruk diagonalene.</strong> Målet ligger i det motsatte hjørnet, så en diagonal rad med brikker er den raskeste veien over.</li>
        <li><strong>Ikke glem etternølerne.</strong> Du trenger alle brikkene dine hjem. En brikke som ligger langt bak og ikke har noe å hoppe over, flytter seg ett felt per tur. Hent den med mens de andre brikkene fortsatt står rundt den.</li>
        <li><strong>Starten din er målet deres.</strong> Med 2 spillere er leiren din målet til den andre spilleren, og vedkommende kan ikke bli ferdig så lenge en av brikkene dine fortsatt står der. Leapstone lar deg beholde en brikke hjemme, så du kan blokkere på den måten. Det samme gjelder for deg.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Spørsmål</h2>
      <h3>Hvor mange kan spille Halma?</h3>
      <p>To eller fire. Halma spilles på et firkantet brett på 16 ganger 16 felt, og hver spiller starter i et hjørne.</p>
      <h3>Hvor mange brikker har hver spiller i Halma?</h3>
      <p>19 brikker hver med 2 spillere, og 13 brikker hver med 4 spillere.</p>
      <h3>Hvem fant opp Halma?</h3>
      <p>George Howard Monks, en amerikansk kirurg, i 1883 eller 1884. Navnet er gresk for &laquo;hopp&raquo;. Les mer i <a href="/no/regler/hva-er-sternhalma">Sternhalma</a>.</p>
      <h3>Hva er forskjellen på Halma og kinasjakk?</h3>
      <p>Halma bruker et firkantet brett, med steg og hopp i åtte retninger og 19 eller 13 brikker hver. Kinasjakk bruker et stjerneformet brett, med seks retninger og 10 brikker hver, for 2, 3, 4 eller 6 spillere.</p>
      <h3>Kan man spille Halma på nett gratis?</h3>
      <p>Ja, i Leapstone, i nettleseren eller i appen fra App Store. Velg en måte å spille på, for eksempel mot datamaskinen eller på nett med venner, og deretter Firkantet brett. Leapstone er gratis, uten reklame.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Spill det</h2>
      <p>Knappen Spill nå åpner et spill mot datamaskinen på <a href="/no/regler/kinasjakk">stjernebrettet</a>. For å spille Halma trykker du på tilbakepilen øverst, velger deretter Spill på denne telefonen, Spill mot datamaskinen eller Spill på nett med venner, og trykker på Firkantet brett.</p>
    </section>`;

export default {
  nav: "Regler for Halma",
  titel: "Regler og tips for Halma | Leapstone",
  beschrijving: "Slik spiller du Halma på det firkantede brettet på 16 ganger 16: start, steg, hopp, kjeder av hopp, hvordan du vinner, og tips. Spill gratis i nettleseren.",
  h1: "Regler for Halma",
  intro: "Flytt alle brikkene dine over det firkantede brettet til det motsatte hjørnet før noen andre gjør det. Reglene kort, med bilder, og noen tips.",
  inhoud,
};
