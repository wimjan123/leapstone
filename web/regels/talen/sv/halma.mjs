// Den svenska spelregelsidan för Halma (taak 134). Texten följer ../en/halma.mjs mening för mening;
// varje regel där är kontrollerad mot crates/halma-core (se docs/plan.md, taak 117).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 spelare: 19 pjäser var",
    alt: "Det fyrkantiga brädet med 19 röda pjäser i det övre vänstra hörnet och 19 blå pjäser i det nedre högra hörnet",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 spelare: 13 pjäser var",
    alt: "Det fyrkantiga brädet med 13 pjäser i vart och ett av de fyra hörnen: röd uppe till vänster, blå uppe till höger, grön nere till höger och gul nere till vänster",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brädet</h2>
      <p>Halma spelas på ett fyrkantigt bräde med 16 gånger 16 platser, 256 allt som allt. Varje plats har upp till åtta grannar: de fyra raka och de fyra diagonala. En plats vid kanten har färre, och ett hörn har tre.</p>
      <p>Det här är Fyrkantigt bräde i Leapstone. Om du kan spelet på stjärnbrädet, läs om <a href="/sv/regler/sternhalma">Sternhalma</a> och <a href="/sv/regler/kinaschack">reglerna för kinaschack</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Så börjar pjäserna</h2>
      <p>Halma är för 2 eller 4 spelare. Varje spelare börjar med pjäserna i ett läger i ett hörn av brädet. Lägret i det motsatta hörnet är ditt mål.</p>
      <ul>
        <li><strong>2 spelare:</strong> 19 pjäser var, i två hörn mitt emot varandra. Lägret är fem rader med 5, 5, 4, 3 och 2 platser.</li>
        <li><strong>4 spelare:</strong> 13 pjäser var, ett läger i varje hörn. Lägret är fyra rader med 4, 4, 3 och 2 platser. Ditt mål är hörnet snett över brädet.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Turordning</h2>
      <p>Spelare 1 börjar. Sedan går turen i ordning, och efter den sista spelaren är det Spelare 1 igen. I Leapstone hör färgerna ihop med numren: röd, blå, grön och gul.</p>
      <p>På din tur flyttar du en pjäs, en gång. Inget slås ut: pjäserna ligger kvar på brädet tills deras spelare ger upp.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Ett steg</h2>
      <p>Flytta en pjäs till en ledig plats bredvid den, i någon av de åtta riktningarna: rakt eller diagonalt.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "En röd pjäs med en vit ring runt sig. Fem av dess åtta grannar är lediga och markerade, de andra tre har pjäser.",
  tekst: "Den röda pjäsen kan gå till de fem markerade platserna. De andra tre grannarna är upptagna.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Ett hopp</h2>
      <p>Hoppa över en pjäs bredvid din, av vilken färg som helst, och landa på den lediga platsen precis bakom den, i en rak linje. Du kan hoppa i alla åtta riktningar, också diagonalt och bakåt.</p>
      <ul>
        <li>Platsen du landar på måste vara ledig.</li>
        <li>Du kan inte hoppa över två pjäser i rad, eller över en tom plats.</li>
        <li>Pjäsen du hoppar över ligger kvar där den är.</li>
        <li>Du kan inte hoppa över brädets kant.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "En röd pjäs hoppar diagonalt över en blå pjäs till den lediga platsen bakom, visat med en pil.",
  tekst: "Den röda pjäsen hoppar diagonalt över den blå pjäsen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kedja av hopp</h2>
      <p>Efter ett hopp kan samma pjäs hoppa igen, så många gånger den kan, åt vilket håll som helst, rakt eller diagonalt. Du bestämmer var du stannar. Alla hoppen tillsammans är ett drag.</p>
      <ul>
        <li>I ett drag kan du inte landa på samma plats två gånger.</li>
        <li>Ett drag är ett steg, eller ett eller flera hopp. Du kan inte gå ett steg efter ett hopp.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "En röd pjäs gör tre hopp i ett drag: diagonalt över en blå pjäs, rakt över ytterligare en blå pjäs och diagonalt över en röd pjäs. De tre landningsplatserna är numrerade 1, 2 och 3.",
  tekst: "Ett drag med tre hopp, i den ordning som numren visar.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinner genom att flytta alla dina pjäser till lägret mitt emot där du började. Alla platser i det lägret måste ha dina egna pjäser: 19 med 2 spelare, 13 med 4 spelare. Så länge en pjäs från en annan spelare står där kan du inte göra dig klar.</p>
      <p>Du får landa på vilken ledig plats som helst, också i de andra spelarnas läger. En pjäs som står i ditt mål får lämna det igen, ingenting låser den.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Det fyrkantiga brädet för två spelare. Röd börjar uppe till vänster, lägret nere till höger, markerat med streckade cirklar och med blå pjäser, är rödas mål.",
  tekst: "Med 2 spelare är rödas mål lägret där blå börjar.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2 eller 4 spelare</h2>
      <ul>
        <li><strong>2 spelare:</strong> den första spelaren som fyller målet vinner, och spelet är slut.</li>
        <li><strong>4 spelare:</strong> den första spelaren som fyller målet vinner. De andra spelar vidare om nästa platser, och en spelare som är klar hoppas över. Spelet är slut när bara en spelare fortfarande spelar.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Ge upp</h2>
      <p>När du ger upp lämnar dina pjäser brädet, så de står inte i vägen för någon. Med 2 spelare vinner den andra spelaren. Med 4 spelare fortsätter spelet utan dig, och om alla utom en ger upp vinner den sista spelaren.</p>
      <p>I ett onlinespel har varje drag en tidsgräns. Spelaren som startar spelet bestämmer den. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp. Spel mot datorn och på en telefon har ingen tidsgräns.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bygg stegar.</strong> Ställ pjäser på en rad med en ledig plats mellan dem, rakt eller diagonalt, riktade mot ditt mål. Då kan en pjäs hoppa längs hela raden i ett enda drag.</li>
        <li><strong>Varje pjäs är en stege.</strong> Du kan hoppa över alla färger, så de andra spelarnas pjäser hjälper dig också. Och dina egna stegar hjälper dem: titta på vad du lämnar efter dig.</li>
        <li><strong>Använd diagonalerna.</strong> Målet ligger i det motsatta hörnet, så en diagonal rad av pjäser är det snabbaste sättet över.</li>
        <li><strong>Glöm inte eftersläntrarna.</strong> Du behöver alla dina pjäser hemma. En pjäs långt bakom, utan något att hoppa över, flyttar en plats per tur. Ta med den medan de andra pjäserna fortfarande finns runt den.</li>
        <li><strong>Din start är deras mål.</strong> Med 2 spelare är ditt läger den andra spelarens mål, och de kan inte göra sig klara så länge en av dina pjäser fortfarande står där. I Leapstone kan du låta en pjäs stå kvar hemma, så du kan blockera på det sättet. Detsamma gäller för dig.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Frågor</h2>
      <h3>Hur många kan spela Halma?</h3>
      <p>Två eller fyra. Halma spelas på ett fyrkantigt bräde med 16 gånger 16 platser, och varje spelare börjar i ett hörn.</p>
      <h3>Hur många pjäser har varje spelare i Halma?</h3>
      <p>19 pjäser var med 2 spelare, och 13 pjäser var med 4 spelare.</p>
      <h3>Vem uppfann Halma?</h3>
      <p>George Howard Monks, en amerikansk kirurg, 1883 eller 1884. Namnet är grekiska för &rdquo;hopp&rdquo;. Läs mer i <a href="/sv/regler/sternhalma">Sternhalma</a>.</p>
      <h3>Vad är skillnaden mellan Halma och kinaschack?</h3>
      <p>Halma har ett fyrkantigt bräde, med steg och hopp i åtta riktningar och 19 eller 13 pjäser var. Kinaschack har ett stjärnbräde, med sex riktningar och 10 pjäser var, för 2, 3, 4 eller 6 spelare.</p>
      <h3>Kan man spela Halma online gratis?</h3>
      <p>Ja, i Leapstone, i webbläsaren eller i appen från App Store. Välj ett sätt att spela, till exempel mot datorn eller online med vänner, och sedan Fyrkantigt bräde. Leapstone är gratis och utan reklam.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Spela det</h2>
      <p>Knappen Spela nu öppnar ett spel mot datorn på <a href="/sv/regler/kinaschack">stjärnbrädet</a>. För att spela Halma, tryck på bakåtpilen högst upp, välj sedan Spela på den här telefonen, Spela mot datorn eller Spela online med vänner, och tryck på Fyrkantigt bräde.</p>
    </section>`;

export default {
  nav: "Regler för Halma",
  titel: "Regler och tips för Halma | Leapstone",
  beschrijving: "Så spelar du Halma på det fyrkantiga brädet med 16 gånger 16 platser: start, steg, hopp, kedjor av hopp, hur du vinner, och tips. Spela gratis.",
  h1: "Regler för Halma",
  intro: "Flytta alla dina pjäser över det fyrkantiga brädet till det motsatta hörnet innan någon annan hinner. Reglerna i korthet, med bilder, och några tips.",
  inhoud,
};
