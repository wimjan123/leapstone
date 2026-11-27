// Den norske regelsiden Kinasjakk (Chinese checkers), oppgave 134. Innhold: den engelske siden ../en/chinese-checkers.mjs
// (kontrollert mot crates/halma-core, se docs/plan.md, oppgave 116), setning for setning på norsk.
// Hver regel her skal stemme med den engelske siden; endrer man en regel, endrer man begge.
// De samme bildene (uten språk: bare tall i SVG-en); alt-tekster og bildetekster er på norsk.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} spillere`,
      alt:
        {
          2: "Stjernebrettet med 10 røde brikker i den nederste spissen og 10 blå brikker i den øverste spissen",
          3: "Stjernebrettet med røde brikker nederst, blå øverst til venstre og grønne øverst til høyre",
          4: "Stjernebrettet med brikker i fire spisser: rød nederst, grønn øverst, blå nederst til venstre og gul øverst til høyre",
          6: "Stjernebrettet med brikker i alle seks spisser, i seks farger",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brettet</h2>
      <p>Kinasjakk (Chinese checkers) spilles på en stjerne med seks spisser. Brettet har 121 felt, og hver spiss har 10 av dem. Inne på brettet har hvert felt seks nabofelt.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Slik starter brikkene</h2>
      <p>Hver spiller har 10 brikker og starter med alle i én spiss av stjernen. Spissen rett overfor din egen er målet ditt.</p>
      <ul>
        <li><strong>2 spillere:</strong> de to spissene som ligger rett overfor hverandre.</li>
        <li><strong>3 spillere:</strong> annenhver spiss. De tre målene er tomme i starten.</li>
        <li><strong>4 spillere:</strong> to par med spisser som ligger ved siden av hverandre. Hver spiller har en annen spiller overfor seg.</li>
        <li><strong>6 spillere:</strong> alle seks spissene.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Etter tur</h2>
      <p>Spiller 1 går først. Deretter går turen videre i rekkefølge: spiller 2, spiller 3 og så videre, og etter den siste spilleren er det spiller 1 igjen. I Leapstone hører fargene til numrene: rød, blå, grønn, gul, lilla og sølv.</p>
      <p>Når det er din tur, flytter du én brikke, én gang. Ingenting blir slått: Brikkene blir på brettet til spilleren deres gir opp.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Et steg</h2>
      <p>Flytt en brikke til et tomt felt ved siden av den.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "En rød brikke med en hvit ring rundt. Tre av de seks nabofeltene er tomme og markerte; på de tre andre står det en brikke.",
  tekst: "Den røde brikken kan gå til de tre markerte feltene. De tre andre nabofeltene er opptatt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Et hopp</h2>
      <p>Hopp over en brikke ved siden av din, uansett farge, og land på det tomme feltet rett bak den, i en rett linje. Du kan hoppe i alle seks retninger, også bakover.</p>
      <ul>
        <li>Feltet du lander på, må være tomt.</li>
        <li>Du kan ikke hoppe over to brikker på rad eller over et tomt felt.</li>
        <li>Brikken du hopper over, blir der den er.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "En rød brikke hopper over en blå brikke til det tomme feltet bak, vist med en pil.",
  tekst: "Den røde brikken hopper over den blå brikken.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kjede av hopp</h2>
      <p>Etter et hopp kan den samme brikken hoppe igjen, så mange ganger den kan og i alle retninger. Du bestemmer hvor du stopper. Alle hoppene til sammen er ett trekk.</p>
      <ul>
        <li>I ett trekk kan du ikke lande på det samme feltet to ganger.</li>
        <li>Et trekk er ett steg eller ett eller flere hopp. Du kan ikke ta et steg etter et hopp.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "En rød brikke tar tre hopp i ett trekk, over en blå, en grønn og en blå brikke til. De tre landingsfeltene er nummerert 1, 2 og 3.",
  tekst: "Ett trekk med tre hopp, i rekkefølgen til tallene.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinner ved å flytte alle 10 brikkene dine inn i spissen overfor der du startet. Alle 10 feltene i den spissen må ha dine egne brikker. Så lenge en brikke fra en annen spiller står der, kan du ikke bli ferdig.</p>
      <p>Du kan lande på et hvilket som helst tomt felt, også i spissene til de andre spillerne.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Et stjernebrett for tre spillere. Rød starter nederst; den tomme spissen øverst, markert med stiplede sirkler, er målet til rød.",
  tekst: "Med 3 spillere starter rød nederst. Målet til rød er den tomme spissen øverst.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2, 3, 4 eller 6 spillere</h2>
      <ul>
        <li><strong>2 spillere:</strong> Den første spilleren som har fylt målet, vinner, og spillet er over.</li>
        <li><strong>3, 4 eller 6 spillere:</strong> Den første spilleren som har fylt målet, vinner. De andre spiller videre om de neste plassene, og en spiller som er ferdig, blir hoppet over. Spillet er over når bare én spiller fortsatt spiller.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Å gi opp</h2>
      <p>Når du gir opp, forsvinner brikkene dine fra brettet, slik at de ikke blokkerer noen. Med 2 spillere vinner den andre spilleren. Med flere spillere fortsetter spillet uten deg, og hvis alle unntatt én spiller gir opp, vinner den siste spilleren.</p>
      <p>I et spill på nett har hvert trekk en tidsgrense. Spilleren som starter spillet, velger den, og i et raskt spill er den 30 sekunder. Når tiden din går ut, blir turen din hoppet over. Hvis du går glipp av 3 turer på rad, gir du opp. Spill mot datamaskinen og på én telefon har ingen tidsgrense.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bygg stiger.</strong> Sett brikker på en rad med ett tomt felt imellom, i retning av målet ditt. Én brikke kan da hoppe langs hele raden i ett trekk.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fire brikker på en diagonal rad med et tomt felt imellom hver. En rød brikke i den ene enden hopper over alle fire, med fire nummererte landingsfelt.",
  tekst: "Fire brikker på en rad: Den øverste røde brikken krysser brettet i ett trekk, med fire hopp.",
})}
        </li>
        <li><strong>Enhver brikke er en stige.</strong> Du kan hoppe over alle farger, så brikkene til de andre spillerne hjelper deg også. Og dine egne stiger hjelper dem: Se på hva du etterlater.</li>
        <li><strong>Ikke glem etternølerne.</strong> Du trenger alle 10 brikkene hjem. En brikke som ligger langt bak og ikke har noe å hoppe over, flytter seg ett felt per tur. Hent den med mens de andre brikkene fortsatt står rundt den.</li>
        <li><strong>Starten din er målet deres.</strong> Med 2, 4 eller 6 spillere er startspissen din målet til spilleren overfor deg, og vedkommende kan ikke bli ferdig så lenge en av brikkene dine fortsatt står der. Det samme gjelder for deg.</li>
      </ul>
      <p>Flere tips med bilder finner du i guiden <a href="/no/guider/kinasjakk-strategi">Strategi i kinasjakk</a>. For et spill mellom to kan du lese <a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Spørsmål</h2>
      <h3>Hvor mange kan spille kinasjakk?</h3>
      <p>To, tre, fire eller seks. Hver spiller starter i én spiss av stjernen. Med 2, 3 eller 4 spillere blir noen spisser stående tomme.</p>
      <h3>Hvor mange kuler har hver spiller?</h3>
      <p>Hver spiller har 10 kuler, eller brikker. Brettet har 121 felt: 10 i hver av de seks spissene og 61 i midten.</p>
      <h3>Kan du hoppe over dine egne brikker, eller bakover?</h3>
      <p>Ja. Du kan hoppe over en brikke av hvilken som helst farge, også dine egne, i alle seks retninger, også bakover. Brikken du hopper over, blir stående.</p>
      <h3>Slår man brikker i kinasjakk?</h3>
      <p>Nei. Ingenting blir slått. En brikke forlater brettet bare når spilleren gir opp.</p>
      <h3>Kommer kinasjakk fra Kina?</h3>
      <p>Nei. Spillet dukket opp i Tyskland i 1892 som Stern-Halma, basert på det eldre spillet Halma. Navnet Chinese checkers kommer fra USA, i 1928. Les mer i <a href="/no/regler/hva-er-sternhalma">Sternhalma</a>.</p>
      <h3>Hvor kan man spille kinasjakk på nett med venner, gratis?</h3>
      <p>I Leapstone, i nettleseren eller i appen fra App Store. Send en venn en invitasjonslenke: Vennen blir med i spillet uten konto, e-postadresse eller passord. Du kan også spille mot datamaskinen, eller et raskt spill mot en annen spiller. Leapstone er gratis, uten reklame.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Spill kinasjakk i Leapstone</h2>
      <p>Leapstone er en gratis app for kinasjakk (Chinese checkers) og Halma, med et 3D-brett i rød lakk og gull. Du kan spille i appen og i nettleseren.</p>
      <ul>
        <li><strong>Mot datamaskinen.</strong> Lett, normal eller vanskelig. Du trenger ikke internett.</li>
        <li><strong>Med venner.</strong> Send en invitasjonslenke. Du bestemmer tiden per trekk, og dere kan chatte.</li>
        <li><strong>På nett.</strong> Et raskt spill mot en annen spiller på ditt nivå, 30 sekunder per trekk. Noen motstandere på nett kan være datamaskinspillere.</li>
        <li><strong>På én telefon.</strong> Send telefonen rundt bordet.</li>
      </ul>
      <p>Leapstone er gratis, uten reklame og uten registrering med e-postadresse: Du velger bare et spillernavn. <a href="https://apps.apple.com/no/app/id6831230722">Last ned Leapstone fra App Store</a> eller <a href="/play/">spill i nettleseren</a>.</p>
    </section>`;

export default {
  nav: "Regler for kinasjakk",
  titel: "Regler og tips for kinasjakk (Chinese checkers) | Leapstone",
  beschrijving: "Slik spiller du kinasjakk: start, steg, hopp og kjeder av hopp, hvordan du vinner med 2, 3, 4 eller 6 spillere, og tips. Spill gratis i nettleseren.",
  h1: "Regler for kinasjakk (Chinese checkers)",
  intro: "Flytt alle 10 brikkene dine over stjernebrettet til den motsatte spissen før noen andre gjør det. Reglene kort, med bilder, og noen tips.",
  inhoud,
};
