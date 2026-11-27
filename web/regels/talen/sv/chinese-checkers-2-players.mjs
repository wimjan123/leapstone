// Den svenska guiden Kinaschack för 2 spelare (taak 134). Texten följer ../en/chinese-checkers-2-players.mjs mening för mening.
// Reglerna kommer från crates/halma-core (Board::star, Game::new_star(2), make_move, resign) och tidsgränsen från "Regels" och taak 80.
// Datorns nivåer kommer från crates/halma-core/src/computer.rs. Se docs/plan.md, taak 122, för kontrollen per regel.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Så börjar spelet</h2>
      <p>Varje spelare har 10 pjäser. De börjar i två spetsar av stjärnan som vetter mot varandra: röd nederst, blå överst. De 20 pjäserna står på ett bräde med 121 platser.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen och 10 blå pjäser i den övre spetsen",
  tekst: "Röd börjar nederst, blå överst.",
})}
      <p>Spelare 1, röd, börjar. Sedan turas ni om, ett drag var. Ett drag är ett steg eller en kedja av hopp med en pjäs. Se <a href="/sv/regler/kinaschack">reglerna för kinaschack</a> för steg och hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ditt mål är den andra spelarens start</h2>
      <p>Du vinner genom att flytta alla dina 10 pjäser till spetsen där den andra spelaren började. Den spetsen är full av deras pjäser från början, och din är full av dina. För röd är det den övre spetsen på bilden ovan.</p>
      <p>Du kan bara landa på en ledig plats, så var och en av er måste lämna sin egen spets innan den andra kan fylla den. Ingen av er kan göra sig klar så länge en pjäs från den andra står kvar i målet. Och eftersom ni korsar samma mitt i motsatta riktningar är den andra spelarens pjäser språngbrädor för dig, och dina för dem. Läs <a href="/sv/guider/kinaschack-strategi">strategitipsen</a> för vad du ska göra med det.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vinna och ge upp</h2>
      <ul>
        <li><strong>Vinna:</strong> den första spelaren som fyller målet med alla 10 pjäser vinner, och spelet är slut direkt. Den andra spelaren spelar inte vidare.</li>
        <li><strong>Ge upp:</strong> dina pjäser lämnar brädet och den andra spelaren vinner.</li>
        <li><strong>Tid (online):</strong> i ett onlinespel har varje drag en tidsgräns. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hur 3, 4 och 6 spelare skiljer sig</h2>
      <ul>
        <li><strong>3 spelare:</strong> pjäserna börjar i varannan spets, och de tre målen är tomma från början. Den första spelaren som blir klar vinner, de andra spelar vidare om nästa platser, och en spelare som är klar hoppas över.</li>
        <li><strong>4 spelare:</strong> två par av spetsar bredvid varandra. Ditt mål är fullt av en annan spelares pjäser från början. Spelet fortsätter efter den första som blir klar, som med 3.</li>
        <li><strong>6 spelare:</strong> alla sex spetsar. Brädet rymmer 60 pjäser, mot 20 med 2 spelare.</li>
      </ul>
      <p>Med bara 20 pjäser på brädet finns det färre pjäser att hoppa över, så stegarna du bygger själv betyder mer. <a href="/sv/regler/kinaschack">Regelsidan</a> har bilder av varje start.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Var du spelar med 2 spelare i Leapstone</h2>
      <ul>
        <li><strong>Mot datorn, direkt:</strong> öppna <a href="/play/">Leapstone i webbläsaren</a>, tryck på Dator och välj stjärnbrädet. En dator är standard, så det är ett spel för 2. Du väljer Lätt, Normal eller Svår, och du är Spelare 1, så du börjar. Lätt väljer det bästa av tre slumpmässiga drag. Normal väljer draget som gör mest framsteg mot målet. Svår tittar också på hur motståndarna kan svara och på sitt eget nästa drag.</li>
        <li><strong>Spela online, i appen:</strong> ett snabbt spel på stjärnbrädet för 2 spelare, mot en annan spelare på din nivå, med 30 sekunder per drag. Vissa motståndare online kan vara datorspelare.</li>
        <li><strong>Med en vän:</strong> skicka en inbjudningslänk och ställ in tiden per drag själv. Eller skicka en telefon fram och tillbaka.</li>
      </ul>
      <p><a href="/sv/guider/kinaschack-online-med-vanner">Kinaschack online med vänner</a></p>
      <p><a href="/sv/guider/kinaschack-for-tre">Kinaschack för 3 spelare</a></p>
    </section>`;

export default {
  nav: "Kinaschack för 2 spelare",
  titel: "Kinaschack för 2 spelare: start och regler | Leapstone",
  beschrijving: "Så fungerar kinaschack med 2 spelare: var de 10 pjäserna börjar, vem som börjar, hur du vinner eller ger upp, och var du spelar gratis.",
  h1: "Kinaschack för 2 spelare",
  intro: "Så fungerar ett spel för två på stjärnbrädet: starten, vem som börjar, hur du vinner och var du kan spela det.",
  inhoud,
};
