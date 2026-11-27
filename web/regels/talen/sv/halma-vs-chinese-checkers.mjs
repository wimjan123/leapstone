// De gids Halma tegenover Chinese checkers in het Zweeds, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kinaschack: stjärnbrädet, 121 platser",
    alt: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen och 10 blå pjäser i den övre spetsen",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: det fyrkantiga brädet, 256 platser",
    alt: "Det fyrkantiga brädet med 19 röda pjäser i hörnet uppe till vänster och 19 blå pjäser i hörnet nere till höger",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Stjärnbrädet: sex grannar, tre av dem lediga här",
    alt: "En röd pjäs med en vit ring runt sig. Tre av dess sex grannar är lediga och markerade, de andra tre har pjäser.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Det fyrkantiga brädet: åtta grannar, fem av dem lediga här",
    alt: "En röd pjäs med en vit ring runt sig. Fem av dess åtta grannar är lediga och markerade, de andra tre har pjäser.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Det korta svaret</h2>
      <p>Halma spelas på ett fyrkantigt bräde och kinaschack på ett bräde format som en sexuddig stjärna. I båda spelen flyttar du dina pjäser med steg och hopp över brädet, och den första spelaren som fyller lägret på andra sidan vinner.</p>
      <p>Det som skiljer är brädet, riktningarna du flyttar i, hur många som kan spela och hur många pjäser var och en har. <a href="/sv/regler/sternhalma">Sternhalma</a> är namnet på Halma på ett stjärnbräde, så det är samma spel som kinaschack.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Brädena</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kinaschack</strong> använder stjärnbrädet: 121 platser, med en spets på 10 platser vid var och en av de sex uddarna. En spets är en triangel av rader med 4, 3, 2 och 1 platser.</li>
        <li><strong>Halma</strong> använder det fyrkantiga brädet: 16 gånger 16 platser, 256 allt som allt. Ett läger ligger i ett hörn. Ett stort läger har rader med 5, 5, 4, 3 och 2 platser, ett litet rader med 4, 4, 3 och 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Riktningar: sex eller åtta</h2>
      <p>På stjärnbrädet har en plats sex grannar. På det fyrkantiga brädet har den åtta, eftersom diagonalerna också räknas. Ett steg går till en ledig granne. Ett hopp går över en pjäs bredvid din, i en rak linje, till den lediga platsen bakom den, i vilken som helst av dessa riktningar och även bakåt.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>En plats vid kanten har färre grannar, och ett hörn på det fyrkantiga brädet har tre. Sex riktningar ger tre linjer genom en plats på stjärnbrädet. Åtta riktningar ger fyra linjer på det fyrkantiga brädet: tvärs, upp och ner och två diagonaler.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Spelare och pjäser</h2>
      <ul>
        <li><strong>Kinaschack:</strong> 2, 3, 4 eller 6 spelare. Alla har 10 pjäser, så brädet rymmer 20, 30, 40 eller 60 pjäser.</li>
        <li><strong>Halma:</strong> 2 eller 4 spelare. Med 2 spelare har var och en 19 pjäser, 38 allt som allt. Med 4 spelare har var och en 13 pjäser, 52 allt som allt.</li>
      </ul>
      <p>Det fyrkantiga brädet har inget spel för 3 eller 6 spelare i Leapstone. För ett spel med tre kan du läsa <a href="/sv/guider/kinaschack-for-tre">Kinaschack för 3 spelare</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Det som är lika</h2>
      <ul>
        <li><strong>Ett drag:</strong> ett steg eller en kedja av hopp med en pjäs. Du bestämmer var kedjan slutar, och efter ett hopp kan du inte ta ett steg.</li>
        <li><strong>Vilken färg som helst:</strong> du hoppar över en pjäs av vilken färg som helst, också din egen. Pjäsen du hoppar över ligger kvar där den är. Inget slås ut.</li>
        <li><strong>Målet:</strong> lägret mitt emot där du började. Alla dess platser måste ha dina egna pjäser. Så länge en pjäs från en annan spelare står där kan du inte bli klar.</li>
        <li><strong>Vinna:</strong> den första spelaren som fyller målet vinner. Med 2 spelare är spelet då slut. Med fler spelare spelar de andra vidare om nästa platser, och en spelare som är klar hoppas över.</li>
        <li><strong>Ge upp och tid:</strong> när du ger upp lämnar dina pjäser brädet. I ett onlinespel har varje drag en tidsgräns, och om du missar 3 turer i rad ger du upp.</li>
      </ul>
      <p>Läs de fullständiga reglerna för <a href="/sv/regler/kinaschack">kinaschack</a> och <a href="/sv/regler/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Vilket bräde du väljer i Leapstone</h2>
      <ul>
        <li><strong>3 eller 6 spelare:</strong> bara stjärnbrädet har dem.</li>
        <li><strong>Fler pjäser var:</strong> det fyrkantiga brädet, med 19 pjäser var för 2 spelare eller 13 för 4, mot 10 på stjärnbrädet.</li>
        <li><strong>Spela online:</strong> ett snabbt spel spelas på stjärnbrädet. Med vänner och mot datorn kan du välja vilket bräde som helst.</li>
      </ul>
      <p>Knappen Spela nu öppnar ett spel mot datorn på stjärnbrädet. För det fyrkantiga brädet, tryck på bakåtpilen högst upp och välj Fyrkantigt bräde i menyn.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Gå vidare</h2>
      <ul>
        <li><a href="/play/">Spela i webbläsaren</a> och prova båda brädena.</li>
        <li><a href="/sv/guider/kinaschack-strategi">Strategi i kinaschack</a>: sex tips med bilder.</li>
        <li><a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>: så fungerar ett spel för två.</li>
      </ul>
      <p><a href="/sv/guider/kinaschack-online-med-vanner">Kinaschack online med vänner</a></p>
    </section>`;

export default {
  nav: "Halma eller kinaschack",
  titel: "Halma eller kinaschack: skillnaderna | Leapstone",
  beschrijving: "Halma eller kinaschack? Det fyrkantiga och stjärnbrädet, sex eller åtta riktningar, spelare och pjäser, och vad som är lika.",
  h1: "Halma eller kinaschack",
  intro: "Två spel med en idé: flytta alla dina pjäser över brädet till andra sidan. Vad som skiljer, vad som är lika och var du spelar båda.",
  inhoud,
};
