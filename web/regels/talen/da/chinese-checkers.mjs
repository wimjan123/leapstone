// Den danske regelside Kinaskak (Chinese checkers), opgave 134. Indhold: den engelske side ../en/chinese-checkers.mjs
// (kontrolleret mod crates/halma-core, se docs/plan.md, opgave 116), sætning for sætning på dansk.
// Hver regel her skal passe med den engelske side; ændrer man en regel, ændrer man begge.
// De samme billeder (uden sprog: kun tal i SVG'en); alt-tekster og billedtekster er på dansk.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} spillere`,
      alt:
        {
          2: "Stjernebrættet med 10 røde brikker i den nederste spids og 10 blå brikker i den øverste spids",
          3: "Stjernebrættet med røde brikker nederst, blå øverst til venstre og grønne øverst til højre",
          4: "Stjernebrættet med brikker i fire spidser: rød nederst, grøn øverst, blå nederst til venstre og gul øverst til højre",
          6: "Stjernebrættet med brikker i alle seks spidser, i seks farver",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brættet</h2>
      <p>Kinaskak (Chinese checkers) spilles på en stjerne med seks spidser. Brættet har 121 felter, og hver spids har 10 af dem. Inde på brættet har hvert felt seks nabofelter.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Sådan starter brikkerne</h2>
      <p>Hver spiller har 10 brikker og starter med dem alle i én spids af stjernen. Spidsen over for din egen er dit mål.</p>
      <ul>
        <li><strong>2 spillere:</strong> de to spidser, der ligger lige over for hinanden.</li>
        <li><strong>3 spillere:</strong> hver anden spids. De tre mål er tomme i starten.</li>
        <li><strong>4 spillere:</strong> to par af spidser, der ligger ved siden af hinanden. Hver spiller har en anden spiller over for sig.</li>
        <li><strong>6 spillere:</strong> alle seks spidser.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">På skift</h2>
      <p>Spiller 1 går først. Derefter går turen videre i rækkefølge: spiller 2, spiller 3 og så videre, og efter den sidste spiller er det spiller 1 igen. I Leapstone hører farverne til numrene: rød, blå, grøn, gul, lilla og sølv.</p>
      <p>Når det er din tur, flytter du én brik, én gang. Der bliver ikke slået noget: Brikkerne bliver på brættet, indtil deres spiller giver op.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Et skridt</h2>
      <p>Flyt en brik til et tomt felt ved siden af den.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "En rød brik med en hvid ring om. Tre af dens seks nabofelter er tomme og markerede; på de andre tre står der en brik.",
  tekst: "Den røde brik kan gå til de tre markerede felter. De andre tre nabofelter er optaget.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Et hop</h2>
      <p>Hop over en brik ved siden af din, uanset farve, og land på det tomme felt lige bagved, i en ret linje. Du kan hoppe i alle seks retninger, også baglæns.</p>
      <ul>
        <li>Feltet, du lander på, skal være tomt.</li>
        <li>Du kan ikke hoppe over to brikker i træk eller over et tomt felt.</li>
        <li>Brikken, du hopper over, bliver, hvor den er.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "En rød brik hopper over en blå brik til det tomme felt bagved, vist med en pil.",
  tekst: "Den røde brik hopper over den blå brik.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kæde af hop</h2>
      <p>Efter et hop må den samme brik hoppe igen, så mange gange den kan og i alle retninger. Du bestemmer, hvor du stopper. Alle hoppene samlet er ét træk.</p>
      <ul>
        <li>I ét træk kan du ikke lande på det samme felt to gange.</li>
        <li>Et træk er ét skridt eller ét eller flere hop. Du kan ikke tage et skridt efter et hop.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "En rød brik tager tre hop i ét træk, over en blå, en grøn og endnu en blå brik. De tre landingsfelter er nummereret 1, 2 og 3.",
  tekst: "Ét træk med tre hop, i rækkefølgen af tallene.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinder ved at flytte alle 10 af dine brikker ind i spidsen over for den, du startede i. Alle 10 felter i den spids skal have dine egne brikker. Så længe en brik fra en anden spiller står der, kan du ikke blive færdig.</p>
      <p>Du må lande på ethvert tomt felt, også i de andre spilleres spidser.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Et stjernebræt til tre spillere. Rød starter nederst; den tomme spids øverst, markeret med stiplede cirkler, er røds mål.",
  tekst: "Med 3 spillere starter rød nederst. Røds mål er den tomme spids øverst.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2, 3, 4 eller 6 spillere</h2>
      <ul>
        <li><strong>2 spillere:</strong> Den første spiller, der har fyldt målet, vinder, og spillet er slut.</li>
        <li><strong>3, 4 eller 6 spillere:</strong> Den første spiller, der har fyldt målet, vinder. De andre spiller videre om de næste pladser, og en spiller, der er færdig, bliver sprunget over. Spillet er slut, når kun én spiller stadig spiller.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">At give op</h2>
      <p>Når du giver op, forsvinder dine brikker fra brættet, så de ikke blokerer nogen. Med 2 spillere vinder den anden spiller. Med flere spillere fortsætter spillet uden dig, og hvis alle undtagen én spiller giver op, vinder den sidste spiller.</p>
      <p>I et onlinespil har hvert træk en tidsgrænse. Spilleren, der starter spillet, vælger den, og i et hurtigt spil er den 30 sekunder. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op. Spil mod computeren og på én telefon har ingen tidsgrænse.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Byg stiger.</strong> Sæt brikker på en række med ét tomt felt imellem, i retning af dit mål. Én brik kan så hoppe hele rækken langs i ét træk.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fire brikker på en diagonal række med et tomt felt imellem hver. En rød brik i den ene ende hopper over alle fire, med fire nummererede landingsfelter.",
  tekst: "Fire brikker på en række: Den øverste røde brik krydser brættet i ét træk, med fire hop.",
})}
        </li>
        <li><strong>Enhver brik er en stige.</strong> Du kan hoppe over alle farver, så de andre spilleres brikker hjælper også dig. Og dine egne stiger hjælper dem: Se på, hvad du efterlader.</li>
        <li><strong>Glem ikke efternølerne.</strong> Du skal have alle 10 brikker hjem. En brik, der ligger langt bagud og ikke har noget at hoppe over, rykker ét felt pr. tur. Hent den med, mens de andre brikker stadig står omkring den.</li>
        <li><strong>Din start er deres mål.</strong> Med 2, 4 eller 6 spillere er din startspids målet for spilleren over for dig, og vedkommende kan ikke blive færdig, så længe en af dine brikker stadig står der. Det samme gælder for dig.</li>
      </ul>
      <p>Flere tips med billeder finder du i guiden <a href="/da/guider/kinaskak-strategi">Strategi i kinaskak</a>. Til et spil mellem to kan du læse <a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Spørgsmål</h2>
      <h3>Hvor mange kan spille kinaskak?</h3>
      <p>To, tre, fire eller seks. Hver spiller starter i én spids af stjernen. Med 2, 3 eller 4 spillere er nogle af spidserne tomme.</p>
      <h3>Hvor mange kugler har hver spiller?</h3>
      <p>Hver spiller har 10 kugler, altså brikker. Brættet har 121 felter: 10 i hver af de seks spidser og 61 i midten.</p>
      <h3>Kan man hoppe over sine egne brikker, eller baglæns?</h3>
      <p>Ja. Du kan hoppe over en brik i en hvilken som helst farve, også dine egne, i en af de seks retninger, også baglæns. Brikken, du hopper over, bliver liggende.</p>
      <h3>Slår man brikker i kinaskak?</h3>
      <p>Nej. Der bliver ikke slået noget. En brik forlader kun brættet, når spilleren giver op.</p>
      <h3>Kommer kinaskak fra Kina?</h3>
      <p>Nej. Spillet opstod i Tyskland i 1892 under navnet Stern-Halma, bygget på det ældre spil Halma. Navnet Chinese checkers (kinaskak) kommer fra USA, i 1928. Læs mere i <a href="/da/regler/hvad-er-sternhalma">Sternhalma</a>.</p>
      <h3>Hvor kan man spille kinaskak online med venner gratis?</h3>
      <p>I Leapstone, i browseren eller i appen fra App Store. Send et invitationslink til en ven: Vennen kommer med i dit spil uden konto, e-mailadresse eller adgangskode. Du kan også spille mod computeren, eller et hurtigt spil mod en anden spiller. Leapstone er gratis og uden reklamer.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Spil kinaskak i Leapstone</h2>
      <p>Leapstone er en gratis app til kinaskak (Chinese checkers) og Halma, med et 3D-bræt i rød lak og guld. Du kan spille i appen og i browseren.</p>
      <ul>
        <li><strong>Mod computeren.</strong> Let, normal eller svær. Du behøver ikke internet.</li>
        <li><strong>Med venner.</strong> Send et invitationslink. Du bestemmer tiden pr. træk, og I kan chatte.</li>
        <li><strong>Online.</strong> Et hurtigt spil mod en anden spiller på dit niveau, 30 sekunder pr. træk. Nogle online-modstandere kan være computerspillere.</li>
        <li><strong>På én telefon.</strong> Send telefonen rundt om bordet.</li>
      </ul>
      <p>Leapstone er gratis, uden reklamer og uden tilmelding med e-mailadresse: Du vælger bare et spillernavn. <a href="https://apps.apple.com/dk/app/id6831230722">Hent Leapstone i App Store</a> eller <a href="/play/">spil i browseren</a>.</p>
    </section>`;

export default {
  nav: "Regler for kinaskak",
  titel: "Regler og tips til kinaskak (Chinese checkers) | Leapstone",
  beschrijving: "Sådan spiller du kinaskak: start, skridt, hop og kæder af hop, sådan vinder du med 2, 3, 4 eller 6 spillere, og tips. Spil gratis i browseren.",
  h1: "Regler for kinaskak (Chinese checkers)",
  intro: "Flyt alle 10 af dine brikker over stjernebrættet til den modsatte spids, før nogen andre gør det. Reglerne kort, med billeder, og et par tips.",
  inhoud,
};
