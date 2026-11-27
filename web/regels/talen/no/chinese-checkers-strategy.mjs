// Den norske guiden Strategi i kinasjakk (oppgave 134): /no/guider/kinasjakk-strategi.
// Innhold: den engelske guiden ../en/chinese-checkers-strategy.mjs (hvert tips er kontrollert mot crates/halma-core, se docs/plan.md, oppgave 122),
// setning for setning på norsk. Ingen oppdiktede "eksperter", tall eller historie. Det eneste tallet er 16 (steg fra spiss til spiss).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Hva tipsene bygger på</h2>
${plaatje({
  direct: true,
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fire brikker på en diagonal rad med et tomt felt imellom hver. En rød brikke i den ene enden hopper over alle fire, med fire nummererte landingsfelt.",
  tekst: "En stige: fire hopp i ett trekk. Den samme brikken kunne bare gå ett felt om gangen.",
})}
      <p>Tipsene følger av <a href="/no/regler/kinasjakk">reglene for kinasjakk</a> slik Leapstone spiller dem: Ett trekk er ett steg eller en kjede av hopp, og du kan hoppe over en brikke i hvilken som helst farge. De er ikke et bevis for beste spill. Det raskeste er å prøve dem i et spill mot datamaskinen.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Bygg stiger</h2>
      <p>En stige er en rad med brikker med ett tomt felt imellom hver av dem, som på bildet øverst på siden. En brikke i den ene enden hopper over hele raden i ett trekk, så den krysser brettet på én tur i stedet for ett felt per tur.</p>
      <p>Et hopp virker i alle seks retninger, også bakover, så en stige trenger ikke starte i din egen spiss. Enhver rad med brikker med hull imellom duger.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Hold brikkene dine samlet</h2>
      <p>Du trenger alle 10 brikkene i målet ditt, så den siste brikken din avgjør når du blir ferdig. En brikke uten en brikke ved siden av har ingenting å hoppe over og kan bare gå.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Et stjernebrett med en rød brikke alene i den nederste spissen. Bare de to tomme nabofeltene er markert. Andre røde og blå brikker står i midten.",
  tekst: "Denne brikken har ingen nabo, så den kan bare gå til de to markerte feltene.",
})}
      <p>Fra tuppen av din egen spiss til tuppen av målet på den andre siden av brettet er det 16 steg. Det er 16 turer for én brikke alene, mens en stige krysser på én. Flytt brikkene bakerst mens det fortsatt er brikker rundt dem å hoppe over. Datamaskinen i Leapstone gjør det samme: Den gir trekk med de bakerste brikkene en litt høyere score.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Bruk midten</h2>
      <p>En brikke midt på brettet har seks nabofelt, så den kan gå eller hoppe i alle seks retninger. En brikke i kanten har færre. Brikken i kanten på bildet har fire.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Et stjernebrett med én rød brikke i midten med seks markerte nabofelt og én rød brikke nær kanten øverst til venstre med fire markerte nabofelt.",
  tekst: "Seks måter å gå på i midten, fire i kanten.",
})}
      <p>Brikker i midten gir også de andre brikkene noe å hoppe over på vei over brettet.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Fyll målet bakfra</h2>
      <p>Målet ditt er en trekant med 10 felt, i rader med 4, 3, 2 og 1. Feltene bakerst kan bare nås gjennom feltene foran dem. Hvis du fyller fremste rad først, har den siste brikken kanskje ingen vei inn.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Målspissen øverst med ni røde brikker og ett tomt felt aller bakerst, markert med streker. En tiende rød brikke, med en hvit ring, står under fremste rad.",
  tekst: "Ni brikker er hjemme, og feltet bakerst er tomt. Den tiende brikken har ikke noe trekk dit.",
})}
      <p>Sett de første brikkene på feltene bakerst og jobb deg framover, slik at fremste rad holdes åpen for brikkene som kommer sist.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Mur ikke inne en brikke i målet ditt</h2>
      <p>Du kan stoppe i spissen til en annen spiller, så en brikke fra den andre spilleren kan havne i målet ditt. Du vinner bare når alle 10 feltene i målet ditt har dine egne brikker. Hvis den brikken ikke har noe trekk, kan ingen flytte den, og du kan ikke vinne før et felt ved siden av den åpner seg.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Målspissen øverst med ni røde brikker og én blå brikke aller bakerst, markert med en hvit ring. Den blå brikken er omringet av røde brikker.",
  tekst: "Den blå brikken bakerst har ikke noe trekk, og rød kan ikke fylle målet.",
})}
      <p>Hold et felt ved siden av en slik brikke åpent, slik at den kan komme seg bort. Datamaskinen i Leapstone tar hensyn til dette: Et trekk som sperrer inne brikken til en annen spiller i spillerens eget mål, får lavere score. Reglene tvinger ingen til å forlate målet ditt, så den andre spilleren kan også parkere en brikke der med vilje.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blokker et hopp, eller la det være</h2>
      <p>Et hopp trenger et tomt felt å lande på. Fyll det feltet, og hoppet er borte. To brikker på rad kan heller ikke hoppes over.</p>
      <p>Brikkene dine er også trinnsteiner for den andre spilleren. På bildet til venstre krysser blå to røde brikker i ett trekk. Til høyre flyttet rød én brikke inn på det første landingsfeltet, og blå kan bare gå.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "En blå brikke med to røde brikker på en rad, hver med et tomt felt bak seg. Piler viser to hopp med den blå brikken.",
          tekst: "Før: Blå kan ta to hopp.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Den samme raden etter at rød flyttet den fjerneste brikken inn på det første landingsfeltet. Etter den blå brikken kommer to røde brikker på rad.",
          tekst: "Etter: Rød flyttet én brikke. Blå har ikke noe hopp.",
        })}
      </div>
      <p>Et trekk brukt på å blokkere er et trekk som ikke brukes på din egen framgang, så blokker når hoppet gir den andre spilleren mer enn trekket ditt ville gitt deg. Det virker motsatt når du bygger en stige: Etter trekket ditt flytter den andre spilleren først, så en av brikkene deres i den ene enden bruker stigen din før deg. På det vanskeligste nivået ser datamaskinen på det beste svaret til hver motstander før den velger et trekk.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Fortsett</h2>
      <ul>
        <li><a href="/play/">Spill mot datamaskinen i nettleseren</a> og prøv en stige.</li>
        <li><a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>: slik fungerer et spill for to.</li>
        <li><a href="/no/regler/kinasjakk">Regler for kinasjakk</a>, med bilder av steg, hopp og kjeder.</li>
      </ul>
      <p><a href="/no/guider/kinasjakk-online-med-venner">Kinasjakk på nett med venner</a></p>
      <p><a href="/no/guider/halma-eller-kinasjakk">Halma eller kinasjakk</a></p>
      <p><a href="/no/guider/kinasjakk-for-tre-spillere">Kinasjakk for 3 spillere</a></p>
    </section>`;

export default {
  nav: "Strategi i kinasjakk",
  titel: "Strategi i kinasjakk: 6 tips med bilder | Leapstone",
  beschrijving: "Strategi i kinasjakk i seks tips med bilder: bygg stiger, hold brikkene samlet, bruk midten, fyll målet bakfra og blokker hopp. Prøv dem gratis.",
  h1: "Strategi i kinasjakk",
  intro: "Kinasjakkstrategi i korte trekk: bygg stiger som lar én brikke hoppe tvers over brettet i ett trekk, hold brikkene samlet, bruk midten, fyll målet bakfra, og blokker et hopp bare når det lønner seg.",
  inhoud,
};
