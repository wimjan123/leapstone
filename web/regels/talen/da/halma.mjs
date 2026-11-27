// Den danske regelside Halma, opgave 134. Indhold: den engelske side ../en/halma.mjs (kontrolleret mod crates/halma-core,
// se docs/plan.md, opgave 117), sætning for sætning på dansk. Ændrer man en regel, ændrer man begge.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 spillere: 19 brikker hver",
    alt: "Det firkantede bræt med 19 røde brikker i hjørnet øverst til venstre og 19 blå brikker i hjørnet nederst til højre",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 spillere: 13 brikker hver",
    alt: "Det firkantede bræt med 13 brikker i hvert af de fire hjørner: rød øverst til venstre, blå øverst til højre, grøn nederst til højre og gul nederst til venstre",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brættet</h2>
      <p>Halma spilles på et firkantet bræt på 16 gange 16 felter, 256 i alt. Hvert felt har op til otte nabofelter: de fire lige og de fire diagonale. Et felt i kanten har færre, og et hjørne har tre.</p>
      <p>Det er Firkantet bræt i Leapstone. Hvis du kender spillet på stjernebrættet, kan du læse om <a href="/da/regler/hvad-er-sternhalma">Sternhalma</a> og <a href="/da/regler/kinaskak">reglerne for kinaskak</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Sådan starter brikkerne</h2>
      <p>Halma er for 2 eller 4 spillere. Hver spiller starter med brikkerne i en lejr i et hjørne af brættet. Lejren i det modsatte hjørne er dit mål.</p>
      <ul>
        <li><strong>2 spillere:</strong> 19 brikker hver, i to hjørner over for hinanden. Lejren er fem rækker med 5, 5, 4, 3 og 2 felter.</li>
        <li><strong>4 spillere:</strong> 13 brikker hver, én lejr i hvert hjørne. Lejren er fire rækker med 4, 4, 3 og 2 felter. Dit mål er hjørnet på den anden side af brættet, på tværs af diagonalen.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">På skift</h2>
      <p>Spiller 1 går først. Derefter går turen videre i rækkefølge, og efter den sidste spiller er det spiller 1 igen. I Leapstone hører farverne til numrene: rød, blå, grøn og gul.</p>
      <p>Når det er din tur, flytter du én brik, én gang. Der bliver ikke slået noget: Brikkerne bliver på brættet, indtil deres spiller giver op.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Et skridt</h2>
      <p>Flyt en brik til et tomt felt ved siden af den, i en af de otte retninger: ligeud eller diagonalt.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "En rød brik med en hvid ring om. Fem af dens otte nabofelter er tomme og markerede; på de andre tre står der en brik.",
  tekst: "Den røde brik kan gå til de fem markerede felter. De andre tre nabofelter er optaget.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Et hop</h2>
      <p>Hop over en brik ved siden af din, uanset farve, og land på det tomme felt lige bagved, i en ret linje. Du kan hoppe i alle otte retninger, også diagonalt og baglæns.</p>
      <ul>
        <li>Feltet, du lander på, skal være tomt.</li>
        <li>Du kan ikke hoppe over to brikker i træk eller over et tomt felt.</li>
        <li>Brikken, du hopper over, bliver, hvor den er.</li>
        <li>Du kan ikke hoppe ud over kanten af brættet.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "En rød brik hopper diagonalt over en blå brik til det tomme felt bagved, vist med en pil.",
  tekst: "Den røde brik hopper diagonalt over den blå brik.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kæde af hop</h2>
      <p>Efter et hop må den samme brik hoppe igen, så mange gange den kan, i alle retninger, ligeud eller diagonalt. Du bestemmer, hvor du stopper. Alle hoppene samlet er ét træk.</p>
      <ul>
        <li>I ét træk kan du ikke lande på det samme felt to gange.</li>
        <li>Et træk er ét skridt eller ét eller flere hop. Du kan ikke tage et skridt efter et hop.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "En rød brik tager tre hop i ét træk: diagonalt over en blå brik, ligeud over en anden blå brik og diagonalt over en rød brik. De tre landingsfelter er nummereret 1, 2 og 3.",
  tekst: "Ét træk med tre hop, i rækkefølgen af tallene.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinder ved at flytte alle dine brikker ind i lejren over for den, du startede i. Hvert felt i den lejr skal have dine egne brikker: 19 med 2 spillere, 13 med 4 spillere. Så længe en brik fra en anden spiller står der, kan du ikke blive færdig.</p>
      <p>Du må lande på ethvert tomt felt, også i de andre spilleres lejre. En brik, der står i dit mål, må godt forlade det igen; intet låser den.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Det firkantede bræt til to spillere. Rød starter øverst til venstre; lejren nederst til højre, markeret med stiplede cirkler og med blå brikker i, er røds mål.",
  tekst: "Med 2 spillere er røds mål den lejr, hvor blå starter.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2 eller 4 spillere</h2>
      <ul>
        <li><strong>2 spillere:</strong> Den første spiller, der har fyldt målet, vinder, og spillet er slut.</li>
        <li><strong>4 spillere:</strong> Den første spiller, der har fyldt målet, vinder. De andre spiller videre om de næste pladser, og en spiller, der er færdig, bliver sprunget over. Spillet er slut, når kun én spiller stadig spiller.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">At give op</h2>
      <p>Når du giver op, forsvinder dine brikker fra brættet, så de ikke blokerer nogen. Med 2 spillere vinder den anden spiller. Med 4 spillere fortsætter spillet uden dig, og hvis alle undtagen én spiller giver op, vinder den sidste spiller.</p>
      <p>I et onlinespil har hvert træk en tidsgrænse. Spilleren, der starter spillet, vælger den. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op. Spil mod computeren og på én telefon har ingen tidsgrænse.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Byg stiger.</strong> Sæt brikker på en række med ét tomt felt imellem, ligeud eller diagonalt, i retning af dit mål. Én brik kan så hoppe hele rækken langs i ét træk.</li>
        <li><strong>Enhver brik er en stige.</strong> Du kan hoppe over alle farver, så de andre spilleres brikker hjælper også dig. Og dine egne stiger hjælper dem: Se på, hvad du efterlader.</li>
        <li><strong>Brug diagonalerne.</strong> Målet ligger i det modsatte hjørne, så en diagonal række af brikker er den hurtigste vej over.</li>
        <li><strong>Glem ikke efternølerne.</strong> Du skal have alle dine brikker hjem. En brik, der ligger langt bagud og ikke har noget at hoppe over, rykker ét felt pr. tur. Hent den med, mens de andre brikker stadig står omkring den.</li>
        <li><strong>Din start er deres mål.</strong> Med 2 spillere er din lejr den anden spillers mål, og vedkommende kan ikke blive færdig, så længe en af dine brikker stadig står der. Leapstone lader dig beholde en brik hjemme, så du kan blokere på den måde. Det samme gælder for dig.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Spørgsmål</h2>
      <h3>Hvor mange kan spille Halma?</h3>
      <p>To eller fire. Halma spilles på et firkantet bræt med 16 gange 16 felter, og hver spiller starter i et hjørne.</p>
      <h3>Hvor mange brikker har hver spiller i Halma?</h3>
      <p>19 brikker hver med 2 spillere og 13 brikker hver med 4 spillere.</p>
      <h3>Hvem opfandt Halma?</h3>
      <p>George Howard Monks, en amerikansk kirurg, i 1883 eller 1884. Navnet er græsk og betyder «spring». Læs mere i <a href="/da/regler/hvad-er-sternhalma">Sternhalma</a>.</p>
      <h3>Hvad er forskellen på Halma og kinaskak?</h3>
      <p>Halma bruger et firkantet bræt, med skridt og hop i otte retninger og 19 eller 13 brikker hver. Kinaskak bruger et stjernebræt, med seks retninger og 10 brikker hver, til 2, 3, 4 eller 6 spillere.</p>
      <h3>Kan man spille Halma online gratis?</h3>
      <p>Ja, i Leapstone, i browseren eller i appen fra App Store. Vælg en måde at spille på, for eksempel mod computeren eller online med venner, og derefter Firkantet bræt. Leapstone er gratis og uden reklamer.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Spil det</h2>
      <p>Knappen Spil nu åbner et spil mod computeren på <a href="/da/regler/kinaskak">stjernebrættet</a>. For at spille Halma skal du trykke på tilbagepilen øverst, derefter vælge Spil på denne telefon, Spil mod computeren eller Spil online med venner, og trykke på Firkantet bræt.</p>
    </section>`;

export default {
  nav: "Regler for Halma",
  titel: "Regler og tips til Halma | Leapstone",
  beschrijving: "Sådan spiller du Halma på det firkantede bræt på 16 gange 16: start, skridt, hop, kæder af hop, sådan vinder du, og tips. Spil gratis i browseren.",
  h1: "Regler for Halma",
  intro: "Flyt alle dine brikker over det firkantede bræt til det modsatte hjørne, før nogen andre gør det. Reglerne kort, med billeder, og et par tips.",
  inhoud,
};
