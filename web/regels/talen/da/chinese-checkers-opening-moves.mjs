// Den danske guide Åbningstræk i kinaskak (opgave 303, feature 294): /da/guider/kinaskak-abningstraek.
// Indhold: den engelske guide ../en/chinese-checkers-opening-moves.mjs (hvert tal og hvert træk er kontrolleret mod crates/halma-core), sætning for sætning på dansk.
// En række er alle felter med samme afstand til din egen spids; et skridt rykker 1 række frem, et hop 2. Ingen opfundne "eksperter" eller historie.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Dit første træk: 14 valg</h2>
      <p>I starten fylder dine 10 brikker en trekant i rækker med 4, 3, 2 og 1, og forreste række vender mod midten af brættet. Der er intet tomt felt inde i trekanten, så en brik kan kun gå til rækken lige foran sig. Det giver 14 første træk: hver af de 4 brikker i forreste række kan gå et skridt til 2 felter (8 skridt), og hver af de 3 brikker i anden række kan hoppe over en forreste brik til 2 felter (6 hop). De andre 3 brikker kan ikke flytte sig endnu.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Den røde spids nederst med sine 10 brikker, og i rækken lige foran den 5 tomme felter markeret med en ring.",
  tekst: "Hvert første træk ender på et af disse 5 felter.",
})}
      <p>I denne guide er en række en linje af felter på tværs af din spids, parallelt med dens forkant, og vi tæller fremgang i rækker. Et skridt tager en brik 1 række frem, og et hop tager den 2 rækker. Alle spillere har de samme 14 første træk, med 2, 3, 4 eller 6 spillere og fra enhver spids af stjernen, fordi alle spidser ser ens ud indefra.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Åbning 1: hop ud, og frigør så spidsen</h2>
      <p>Brikken yderst i din spids er længst fra dit mål, og den kan ikke flytte sig i starten: den kan kun hoppe over en brik, hvis feltet bag brikken er tomt. Et hop fra anden række laver netop sådan et felt.</p>
      <ol>
        <li><strong>Træk 1:</strong> brikken yderst til højre i din anden række hopper over brikken foran sig. Den lander i rækken foran din spids og vinder 2 rækker.</li>
        <li><strong>Træk 2:</strong> brikken yderst i spidsen hopper to gange i ét træk: først ind på feltet, som træk 1 tømte, og derefter over en brik i anden række. Den vinder 4 rækker.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Den røde spids efter træk 1. Brikken yderst i spidsen har en ring, og 2 pile med numrene 1 og 2 viser dens hop gennem det tømte felt til rækken foran spidsen.",
  tekst: "Efter træk 1 hopper brikken yderst i spidsen ud i 2 hop.",
})}
      <p>Det er 6 rækker på 2 træk. Vi prøvede alle måder at spille 2 træk på, og 6 er det mest, du kan vinde. Kun 4 par træk når det: brikken i begge ender af anden række hopper, i en af sine 2 retninger, og brikken yderst i spidsen følger efter. Brikken midt i anden række duer ikke, fordi den holder spidsen lukket inde.</p>
      <p>Begge brikker står nu i rækken foran din spids med et tomt felt imellem. Det er første trin på en stige.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Åbning 2: 4 træk med 4 forskellige brikker</h2>
      <p>På 4 træk kan du højst vinde 13 rækker, og det sker kun, når hvert træk bruger en ny brik. Denne linje klarer det:</p>
      <ol>
        <li><strong>Træk 1:</strong> brikken yderst til højre i forreste række går et skridt frem. Den vinder 1 række.</li>
        <li><strong>Træk 2:</strong> brikken yderst til højre i tredje række hopper to gange. Den vinder 4 rækker.</li>
        <li><strong>Træk 3:</strong> brikken yderst til venstre i anden række hopper to gange. Den vinder 4 rækker.</li>
        <li><strong>Træk 4:</strong> brikken yderst i spidsen hopper to gange. Den vinder 4 rækker.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Den røde spids i starten. De 4 brikker, der skal flyttes, har et nummer fra 1 til 4 i trækkenes rækkefølge.",
          tekst: "Før: de brikker, der flyttes, i rækkefølge.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Den røde spids efter 4 træk, med de 4 felter, hvor de nummererede brikker landede i rækkerne foran spidsen, og 4 huller efterladt i spidsen.",
          tekst: "Efter: hvor de landede.",
        })}
      </div>
      <p>Hvert træk forbereder det næste. Træk 2 og 3 ender med et hop over brikken, der lige var flyttet, og træk 4 starter gennem hullet, som træk 3 efterlod. Alle 4 brikker lander i din egen halvdel af brættet.</p>
      <p>Der er flere linjer, der når 13. Det, de har til fælles, er ideen: led efter trækket, der efterlader et hul eller en trædesten til næste træk, og lad brikken yderst i spidsen ud senest med træk 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Fejl i de første træk</h2>
      <ul class="tips">
        <li><strong>At flytte den samme brik hver tur.</strong> En brik, der løber alene, vinder 5 rækker på 4 træk, mod 13 for 4 forskellige brikker. Den lader også resten af dine brikker stå, hvor de var.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Den røde spids i starten. Én brik fra anden række laver 4 træk i træk langs én linje, med pile og numrene 1 til 4, og ender alene nær midten af brættet.",
  tekst: "Én brik, 4 træk, 5 rækker.",
})}
      <ul class="tips">
        <li><strong>Kun at gå med forreste række.</strong> 4 skridt vinder 4 rækker. Efter dem kan brikken yderst i spidsen stadig ikke flytte sig, så den bliver bagest, mens resten går frem.</li>
        <li><strong>At gå til siden.</strong> Et skridt langs en række vinder 0 rækker. Efter træk 1 i åbning 1 kan brikken foran gå til feltet ved siden af, og det ligner fremgang, men trækket er spildt.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Kom videre</h2>
      <p>Efter omkring 4 træk kommer de to hære tæt på hinanden, og åbningerne ovenfor går over i midterspillet. Du behøver ikke huske linjerne: husk, at hvert træk skal forberede det næste.</p>
      <ul>
        <li><a href="/play/">Spil mod computeren i din browser</a> og prøv åbning 1 eller 2.</li>
        <li><a href="/da/guider/kinaskak-strategi">Strategi i kinaskak</a>: stiger, at holde brikkerne samlet og at fylde dit mål.</li>
        <li><a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>: hvordan et spil for to fungerer.</li>
        <li><a href="/da/regler/kinaskak">Regler for kinaskak</a>, med billeder af skridt, hop og kæder.</li>
      </ul>
    </section>`;

export default {
  nav: "Åbningstræk i kinaskak",
  titel: "Åbningstræk i kinaskak: 2 åbninger | Leapstone",
  beschrijving: "Åbningstræk i kinaskak: sådan hopper du ud af din spids, frigør brikken yderst i spidsen med træk 2 og vinder 13 rækker på 4 træk, og fejl at undgå.",
  h1: "Åbningstræk i kinaskak",
  intro: "En god åbning i kinaskak hopper ud af anden række, bruger en ny brik hver tur og lader brikken yderst i spidsen ud med træk 2 eller 4. To åbninger med billeder og fejl, du skal undgå.",
  inhoud,
};
