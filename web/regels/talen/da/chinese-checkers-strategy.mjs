// Den danske guide Strategi i kinaskak (opgave 134): /da/guider/kinaskak-strategi.
// Indhold: den engelske guide ../en/chinese-checkers-strategy.mjs (hvert tip er kontrolleret mod crates/halma-core, se docs/plan.md, opgave 122),
// sætning for sætning på dansk. Ingen opfundne "eksperter", tal eller historie. Det eneste tal er 16 (skridt fra spids til spids).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Hvad tipsene bygger på</h2>
      <p>Tipsene følger af <a href="/da/regler/kinaskak">reglerne for kinaskak</a>, som Leapstone spiller dem: Ét træk er ét skridt eller en kæde af hop, og du kan hoppe over en brik i enhver farve. De er ikke et bevis for det bedste spil. Det hurtigste er at prøve dem i et spil mod computeren.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Byg stiger</h2>
      <p>En stige er en række brikker med ét tomt felt imellem hver af dem. En brik i den ene ende hopper over hele rækken i ét træk, så den krydser brættet på én tur i stedet for ét felt pr. tur.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fire brikker på en diagonal række med et tomt felt imellem hver. En rød brik i den ene ende hopper over alle fire, med fire nummererede landingsfelter.",
  tekst: "Fire hop i ét træk. Den samme brik kunne kun gå ét felt ad gangen.",
})}
      <p>Et hop virker i alle seks retninger, også baglæns, så en stige behøver ikke starte i din egen spids. Enhver række af brikker med huller imellem duer.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Hold dine brikker samlet</h2>
      <p>Du skal have alle 10 brikker i dit mål, så din sidste brik afgør, hvornår du bliver færdig. En brik uden en brik ved siden af har intet at hoppe over og kan kun gå.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Et stjernebræt med en rød brik alene i den nederste spids. Kun dens to tomme nabofelter er markeret. Andre røde og blå brikker står i midten.",
  tekst: "Denne brik har ingen nabo, så den kan kun gå til de to markerede felter.",
})}
      <p>Fra spidsen af din egen spids til spidsen af målet på den anden side af brættet er der 16 skridt. Det er 16 ture for én brik alene, mens en stige krydser på én. Flyt brikkerne bagest, mens der stadig er brikker omkring dem at hoppe over. Computeren i Leapstone gør det samme: Den giver træk med de bageste brikker en smule højere score.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Brug midten</h2>
      <p>En brik midt på brættet har seks nabofelter, så den kan gå eller hoppe i alle seks retninger. En brik i kanten har færre. Brikken i kanten på billedet har fire.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Et stjernebræt med én rød brik i midten med seks markerede nabofelter og én rød brik tæt på kanten øverst til venstre med fire markerede nabofelter.",
  tekst: "Seks måder at gå på i midten, fire i kanten.",
})}
      <p>Brikker i midten giver også de andre brikker noget at hoppe over på vej over brættet.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Fyld målet bagfra</h2>
      <p>Dit mål er en trekant med 10 felter, i rækker med 4, 3, 2 og 1. Felterne bagest kan kun nås gennem felterne foran dem. Hvis du fylder forreste række først, har den sidste brik måske ingen vej ind.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Målspidsen øverst med ni røde brikker og ét tomt felt allerbagest, markeret med streger. En tiende rød brik, med en hvid ring, står under forreste række.",
  tekst: "Ni brikker er hjemme, og feltet bagest er tomt. Den tiende brik har intet træk derind.",
})}
      <p>Sæt de første brikker på felterne bagest og arbejd dig frem, så forreste række holdes åben for de brikker, der kommer sidst.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Mur ikke en brik inde i dit mål</h2>
      <p>Du må stoppe i en anden spillers spids, så en brik fra den anden spiller kan ende i dit mål. Du vinder kun, når alle 10 felter i dit mål har dine egne brikker. Hvis den brik ikke har noget træk, kan ingen flytte den, og du kan ikke vinde, før et felt ved siden af den åbner sig.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Målspidsen øverst med ni røde brikker og én blå brik allerbagest, markeret med en hvid ring. Den blå brik er omringet af røde brikker.",
  tekst: "Den blå brik bagest har intet træk, og rød kan ikke fylde målet.",
})}
      <p>Hold et felt ved siden af sådan en brik åbent, så den kan komme væk. Computeren i Leapstone tager højde for det: Et træk, der spærrer en anden spillers brik inde i dens mål, får en lavere score. Reglerne tvinger ingen til at forlade dit mål, så den anden spiller kan også parkere en brik der med vilje.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bloker et hop, eller lad det være</h2>
      <p>Et hop kræver et tomt felt at lande på. Fyld det felt, og hoppet er væk. To brikker i træk kan heller ikke hoppes over.</p>
      <p>Dine brikker er også trædesten for den anden spiller. På billedet til venstre krydser blå to røde brikker i ét træk. Til højre flyttede rød én brik ind på det første landingsfelt, og blå kan kun gå.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "En blå brik med to røde brikker på en række, hver med et tomt felt bagved. Pile viser to hop med den blå brik.",
          tekst: "Før: Blå kan tage to hop.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Den samme række, efter rød flyttede sin fjerneste brik ind på det første landingsfelt. Blås brik efterfølges af to røde brikker i træk.",
          tekst: "Efter: Rød flyttede én brik. Blå har intet hop.",
        })}
      </div>
      <p>Et træk brugt på at blokere er et træk, der ikke bruges på din egen fremgang, så bloker, når hoppet giver den anden spiller mere, end dit træk ville give dig. Det virker omvendt, når du bygger en stige: Efter dit træk flytter den anden spiller først, så en af deres brikker i den ene ende bruger din stige før dig. På det sværeste niveau ser computeren på hver modstanders bedste svar, før den vælger et træk.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Bliv ved</h2>
      <ul>
        <li><a href="/play/">Spil mod computeren i din browser</a> og prøv en stige.</li>
        <li><a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>: sådan fungerer et spil for to.</li>
        <li><a href="/da/regler/kinaskak">Regler for kinaskak</a>, med billeder af skridt, hop og kæder.</li>
      </ul>
      <p><a href="/da/guider/kinaskak-online-med-venner">Kinaskak online med venner</a></p>
      <p><a href="/da/guider/halma-eller-kinaskak">Halma eller kinaskak</a></p>
      <p><a href="/da/guider/kinaskak-for-tre-spillere">Kinaskak for 3 spillere</a></p>
    </section>`;

export default {
  nav: "Strategi i kinaskak",
  titel: "Strategi i kinaskak: 6 tips med billeder | Leapstone",
  beschrijving: "Kinaskak-strategi: byg stiger, hold brikkerne samlet, brug midten, fyld dit mål bagfra, og vid hvornår du skal blokere et hop.",
  h1: "Strategi i kinaskak",
  intro: "Seks tips til stjernebrættet, hver med et billede fra de rigtige regler: stiger, efternølere, midten, at fylde dit mål og at blokere hop.",
  inhoud,
};
