// Den svenska guiden Kinaschack för 3 spelare (taak 299). Texten följer ../en/chinese-checkers-3-players.mjs mening för mening.
// Reglerna är kontrollerade i den engelska filen mot crates/halma-core; vad appen visar kommer från web/src/Startmenu.svelte.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Så börjar spelet</h2>
      <p>Varje spelare har 10 pjäser, så 30 pjäser står på ett bräde med 121 platser. De börjar i varannan spets av stjärnan: röd nederst, blå uppe till vänster och grön uppe till höger. De tre spetsarna emellan är tomma.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen, 10 blå pjäser i den övre vänstra spetsen och 10 gröna pjäser i den övre högra spetsen",
  tekst: "Röd nederst, blå uppe till vänster, grön uppe till höger.",
})}
      <p>Spelare 1, röd, börjar. Sedan är blå Spelare 2, grön är Spelare 3, och efter grön är det röds tur igen. Ett drag är ett steg eller en kedja av hopp med en pjäs. Se <a href="/sv/regler/kinaschack">reglerna för kinaschack</a> för steg och hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tre mål, alla tomma från början</h2>
      <p>Ditt mål är spetsen mitt emot där du började, och med 3 spelare är den tom från början. Det är den tomma spetsen mellan de två andra spelarnas starter: rödas mål är överst, blås är nere till höger och grönas är nere till vänster.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Stjärnbrädet för tre spelare. Streckade cirklar i varje spelares färg markerar de tre tomma målen: rött överst, blått nere till höger, grönt nere till vänster.",
  tekst: "Varje mål har sin spelares färg.",
})}
      <p>Du vinner genom att flytta alla dina 10 pjäser till ditt mål. Alla 10 platser måste hålla dina egna pjäser. Ingen börjar i ditt mål, men du får stanna på vilken tom plats som helst, så en pjäs från en annan spelare kan landa där senare. Så länge den står där kan du inte bli klar.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vinna, och vad som händer sedan</h2>
      <ul>
        <li><strong>Vinna:</strong> den första spelaren som fyller målet vinner. Spelet slutar inte där: de andra två spelar vidare om nästa platser, och spelaren som är klar hoppas över. Spelet är slut när bara en spelare spelar kvar.</li>
        <li><strong>Ge upp:</strong> dina pjäser lämnar brädet och de andra två spelar vidare. Om en andra spelare ger upp innan någon är klar vinner den sista spelaren som är kvar.</li>
        <li><strong>Tid (online):</strong> i ett onlinespel har varje drag en tidsgräns, som bestäms av spelaren som startar spelet. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp, och spelet fortsätter utan dig.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hur det skiljer sig från ett spel för 2</h2>
      <ul>
        <li><strong>Fler pjäser:</strong> 30 på brädet, mot 20 med 2 spelare.</li>
        <li><strong>Tomma mål:</strong> med 2 spelare är ditt mål fullt av den andra spelarens pjäser från början. Med 3 är det tomt.</li>
        <li><strong>Två motståndare:</strong> efter ditt drag gör två andra spelare drag innan det är din tur igen. Allas pjäser är språngbrädor för dig, och dina för dem. En stege du bygger kan användas av båda, och spelaren efter dig får första chansen.</li>
        <li><strong>Spelet fortsätter:</strong> med 2 spelare slutar spelet när en av er är klar. Med 3 fortsätter det om andra och tredje plats.</li>
      </ul>
      <p>För spelet med två, läs <a href="/sv/guider/kinaschack-for-tva">kinaschack för 2 spelare</a>. <a href="/sv/guider/kinaschack-strategi">Strategitipsen</a> handlar om steg och hopp, som är desamma med 3 spelare.</p>
      <p><a href="/sv/guider/kinaschack-online-med-vanner">Kinaschack online med vänner</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Var du spelar med 3 spelare i Leapstone</h2>
      <ul>
        <li><strong>Mot datorn, direkt:</strong> öppna <a href="/play/">Leapstone i webbläsaren</a>, tryck på Dator, välj stjärnbrädet och 2 datorer. Du är Spelare 1, så du börjar. Du väljer Lätt, Normal eller Svår för datorerna.</li>
        <li><strong>På en telefon:</strong> tryck på ”På den här telefonen”, välj stjärnbrädet och 3 spelare, och tryck sedan på en pjäs för att växla den platsen mellan en person och en dator.</li>
        <li><strong>Online med vänner:</strong> tryck på Vänner, välj stjärnbrädet, 3 spelare och tiden per drag, och skicka inbjudningslänken. Spelet startar när alla 3 platser är tagna.</li>
        <li><strong>Snabba spel:</strong> Spela online hittar spel för 2 eller 4 spelare, så det finns inget snabbspel för 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaschack för 3 spelare",
  titel: "Kinaschack för 3 spelare: start och regler | Leapstone",
  beschrijving: "Så fungerar kinaschack med 3 spelare: var de 30 pjäserna börjar, vilken tom spets som är varje mål, vem som börjar och hur du vinner.",
  h1: "Kinaschack för 3 spelare",
  intro: "Så fungerar ett spel för tre på stjärnbrädet: starten, de tre målen, vem som börjar, hur du vinner och var du kan spela det.",
  inhoud,
};
