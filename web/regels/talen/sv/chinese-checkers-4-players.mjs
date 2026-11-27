// Den svenska guiden Kinaschack för 4 spelare (taak 301). Texten följer ../en/chinese-checkers-4-players.mjs mening för mening.
// Reglerna och vad appen visar: se källhänvisningarna i den engelska filen.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Så delas brädet upp</h2>
      <p>Varje spelare har 10 pjäser, så 40 pjäser står på ett bräde med 121 platser. De fyra startspetsarna är två par av spetsar som ligger bredvid varandra: röd nederst och blå nere till vänster, grön överst och gul uppe till höger.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen, 10 blå pjäser i spetsen nere till vänster, 10 gröna pjäser i den övre spetsen och 10 gula pjäser i spetsen uppe till höger. Spetsarna uppe till vänster och nere till höger är tomma.",
  tekst: "Röd nederst, blå nere till vänster, grön överst, gul uppe till höger.",
})}
      <p>Spelare 1, röd, börjar. Sedan är blå Spelare 2, grön Spelare 3, gul Spelare 4, och efter gul är det röds tur igen. Ett drag är ett steg eller en kedja av hopp med en pjäs. Se <a href="/sv/regler/kinaschack">reglerna för kinaschack</a> för steg och hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Vem som står mitt emot vem</h2>
      <p>Spetsarna bildar par tvärs över brädet: röd står mitt emot grön, och blå mitt emot gul. Ditt mål är spetsen mitt emot dig. Röd går dit där grön börjar, grön dit där röd börjar, blå dit där gul börjar och gul dit där blå börjar.</p>
      <p>Som i ett spel för 2 är varje mål fullt av pjäser från spelaren mitt emot dig från början, så du kan bara landa där när de har gått. Med 3 spelare är målen tomma från början, så med 4 kan ingen bli klar direkt. De fyra målen är fyra olika spetsar, så ingen annan vill ha ditt mål: en spelare som är klar blockerar aldrig någon.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">De två tomma spetsarna</h2>
      <p>Spetsen uppe till vänster och spetsen nere till höger har inga pjäser. De är ingens start och ingens mål. Spetsen uppe till vänster ligger mellan blå och grön, och spetsen nere till höger mellan gul och röd.</p>
      <p>Du får kliva eller hoppa till vilken ledig plats som helst, så du kan korsa de här spetsarna eller stanna i dem. En pjäs där är ändå inte i ett mål. Det finns inget att hoppa över i en tom spets förrän någon för dit pjäser.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Vad som ändras i taktiken</h2>
      <ul>
        <li><strong>Två korsningar på en gång:</strong> röd och grön korsar brädet mot varandra, och det gör blå och gul också. Båda linjerna går genom mitten, så mitten är mer trafikerad än i ett spel för 2, där bara en linje korsar.</li>
        <li><strong>Tre spelare drar mellan dina turer:</strong> brädet ändras mer mellan två av dina drag än i ett spel för 2. Titta på det igen i början av varje tur och planera då din kedja av hopp. Spelaren som drar efter dig är aldrig den som står mitt emot dig.</li>
        <li><strong>Pjäser hjälper alla:</strong> varje pjäs från de tre andra är en språngbräda för dig, och dina är språngbrädor för dem. Pjäserna från spelaren mitt emot dig rör sig åt motsatt håll, som i ett spel för 2.</li>
        <li><strong>Utrymme att gå runt:</strong> om mitten är full är de tomma spetsarna öppet utrymme bredvid lägren. En väg genom en av dem kan vara ett sätt att komma runt trängseln.</li>
        <li><strong>En spelare som ger upp frigör ditt mål:</strong> när spelaren mitt emot dig ger upp lämnar hens pjäser brädet, så ditt mål är genast tomt.</li>
      </ul>
      <p><a href="/sv/guider/kinaschack-strategi">Strategitipsen</a> om stegar, eftersläntrare och att fylla målet bakifrån gäller likadant med 4 spelare.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vinna och vad som händer efteråt</h2>
      <ul>
        <li><strong>Vinna:</strong> den första spelaren som fyller målet med alla 10 pjäser vinner. Spelet slutar inte där: de andra tre spelar vidare om nästa platser, och spelaren som är klar hoppas över. Den spelarens pjäser blir kvar på brädet. Spelet är slut när bara en spelare spelar kvar.</li>
        <li><strong>Ge upp:</strong> dina pjäser lämnar brädet och de andra tre spelar vidare. Om de andra också ger upp vinner den sista spelaren som är kvar.</li>
        <li><strong>Tid (online):</strong> i ett onlinespel har varje drag en tidsgräns. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp, och spelet fortsätter utan dig.</li>
      </ul>
      <p>För spelen med färre spelare, läs <a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>. <a href="/sv/regler/kinaschack">Regelsidan</a> har bilder av varje start.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Var du spelar med 4 spelare i Leapstone</h2>
      <ul>
        <li><strong>Mot datorn, direkt:</strong> öppna <a href="/play/">Leapstone i webbläsaren</a>, tryck på Dator, välj stjärnbrädet och 3 datorer. Du är Spelare 1, så du börjar. Du väljer Lätt, Normal eller Svår för datorerna.</li>
        <li><strong>På en telefon:</strong> tryck på Spela, välj stjärnbrädet och 4 spelare, och tryck sedan på en pjäs för att växla den platsen mellan en person och en dator.</li>
        <li><strong>Online med vänner:</strong> tryck på Vänner, välj stjärnbrädet, 4 spelare och tiden per drag, och skicka inbjudningslänken. Spelet börjar när alla 4 platser är tagna.</li>
        <li><strong>Snabbt spel, i appen:</strong> tryck på Spela online. Medan den söker ett spel för 2, tryck på Sök 4 eller 6 spelare för att söka ett spel för 4 i stället. Varje drag har 30 sekunder. Om för få spelare ansluter inom 20 sekunder fyller datorspelare de tomma platserna, så vissa motståndare kan vara datorspelare.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaschack för 4 spelare",
  titel: "Kinaschack för 4 spelare: start och tips | Leapstone",
  beschrijving: "Så fungerar kinaschack med 4 spelare: hur brädet delas upp, vilka 2 spetsar som står tomma, vem som står mitt emot vem, taktiken och var du spelar.",
  h1: "Kinaschack för 4 spelare",
  intro: "Med 4 spelare börjar var och en av er i en av stjärnans fyra spetsar, och två spetsar står tomma. Röd står mitt emot grön och blå mitt emot gul: ditt mål är spetsen mitt emot dig, full av den spelarens pjäser. Här är starten, de tomma spetsarna, taktiken och var du kan spela det.",
  inhoud,
};
