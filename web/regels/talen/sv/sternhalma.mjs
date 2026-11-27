// Den svenska sidan "Vad är Sternhalma?" (taak 134): namnet och förhållandet till Halma och kinaschack.
// Innehåll och källor: den engelska sidan ../en/sternhalma.mjs (Wikipedia Halma och Chinese Checkers, se där). Mening för mening på svenska.
// Medvetet utelämnat, som på engelska: vem som gav ut Stern-Halma 1892 (källorna säger emot varandra) och patentår.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Vad namnet betyder</h2>
      <p>Sternhalma är det tyska namnet på Halma spelat på ett stjärnformat bräde. <em>Stern</em> är tyska för stjärna. Namnet kinaschack är samma spel under ett namn som gavs senare i USA.</p>
      <p>I Leapstone är det <strong>stjärnbrädet</strong>: brädet i <a href="/sv/regler/kinaschack">reglerna för kinaschack</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Varifrån det kommer</h2>
      <ul>
        <li><strong>Halma</strong> uppfanns 1883 eller 1884 av George Howard Monks, en amerikansk kirurg. Namnet är grekiska för &rdquo;hopp&rdquo;. Det spelas på ett fyrkantigt bräde. <a href="/sv/regler/halma">Läs reglerna för Halma</a>.</li>
        <li><strong>Stern-Halma</strong> kom ut i Tyskland 1892: samma idé på ett bräde format som en sexuddig stjärna.</li>
        <li><strong>Kinaschack</strong> är namnet som Bill och Jack Pressman gav spelet i USA 1928, först som &rdquo;Hop Ching checkers&rdquo;. Spelet har ingen historisk koppling till Kina, och det är inget damspel.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hur spelen skiljer sig</h2>
      <ul>
        <li><strong>Halma:</strong> ett fyrkantigt bräde med 16 gånger 16 platser, för 2 eller 4 spelare. En pjäs har åtta grannar, raka och diagonala. Med 2 spelare har var och en 19 pjäser, med 4 spelare 13.</li>
        <li><strong>Sternhalma och kinaschack:</strong> ett stjärnbräde med 121 platser, för 2, 3, 4 eller 6 spelare. En pjäs har sex grannar. Alla har 10 pjäser.</li>
        <li><strong>Resten är lika:</strong> ett steg till en ledig granne, eller ett hopp över en pjäs, med kedjor av hopp. Den första spelaren som fyller lägret på andra sidan brädet vinner.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianter, och vad Leapstone gör</h2>
      <p>Halma har spelats på mer än ett sätt. Så här förhåller sig Leapstone till de varianter vi hittade i våra källor:</p>
      <ul>
        <li><strong>Brädets storlek.</strong> Halma spelas också på bräden med 8 gånger 8 och 10 gånger 10 platser. Leapstone har bara brädet med 16 gånger 16 platser.</li>
        <li><strong>Att lämna målet.</strong> Enligt en Halma-regel får en pjäs som har kommit in i motståndarens läger inte lämna det igen. Leapstone har inte den regeln: du kan flytta en sådan pjäs igen.</li>
        <li><strong>Tre spelare på en stjärna.</strong> Ett gammalt Halma för tre spelare på ett stjärnbräde beskrivs med 15 pjäser var. Leapstone spelar 3 spelare på stjärnbrädet med 10 pjäser var.</li>
        <li><strong>Hoppen är ditt val.</strong> Du måste aldrig hoppa. Du väljer platsen där ditt drag slutar.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Spela det i Leapstone</h2>
      <p>Spela nu öppnar ett spel på stjärnbrädet mot datorn. För det fyrkantiga brädet, tryck på bakåtpilen högst upp och välj Fyrkantigt bräde i menyn.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen och 10 blå pjäser i den övre spetsen",
  tekst: "Stjärnbrädet för 2 spelare.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Vad är Sternhalma? Halma på ett stjärnbräde | Leapstone",
  beschrijving: "Sternhalma är det tyska namnet på Halma på ett stjärnbräde. Hur det hänger ihop med Halma och kinaschack, och hur du spelar det gratis i webbläsaren.",
  h1: "Sternhalma, Halma och kinaschack",
  intro: "Tre namn på nära besläktade spel. Vad vart och ett betyder, varifrån de kommer och hur de skiljer sig.",
  inhoud,
};
