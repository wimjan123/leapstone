// Den svenska spelregelsidan för kinaschack (taak 134). Texten följer ../en/chinese-checkers.mjs mening för mening;
// varje regel där är kontrollerad mot crates/halma-core (se docs/plan.md, taak 116).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} spelare`,
      alt:
        {
          2: "Stjärnbrädet med 10 röda pjäser i den nedre spetsen och 10 blå pjäser i den övre spetsen",
          3: "Stjärnbrädet med röda pjäser nederst, blå uppe till vänster och gröna uppe till höger",
          4: "Stjärnbrädet med pjäser i fyra spetsar: röda nederst, gröna överst, blå nere till vänster och gula uppe till höger",
          6: "Stjärnbrädet med pjäser i alla sex spetsar, i sex färger",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Brädet</h2>
      <p>Kinaschack spelas på en stjärna med sex spetsar. Brädet har 121 platser, och varje spets har 10 av dem. Inne på brädet har varje plats sex grannar.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Så börjar pjäserna</h2>
      <p>Varje spelare har 10 pjäser och börjar med dem i en spets av stjärnan. Spetsen mitt emot din är ditt mål.</p>
      <ul>
        <li><strong>2 spelare:</strong> de två spetsarna mitt emot varandra.</li>
        <li><strong>3 spelare:</strong> varannan spets. De tre målen är tomma från början.</li>
        <li><strong>4 spelare:</strong> två par av spetsar som ligger bredvid varandra. Varje spelare har en annan spelare mitt emot sig.</li>
        <li><strong>6 spelare:</strong> alla sex spetsar.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Turordning</h2>
      <p>Spelare 1 börjar. Sedan går turen i ordning, Spelare 2, Spelare 3 och så vidare, och efter den sista spelaren är det Spelare 1 igen. I Leapstone hör färgerna ihop med numren: röd, blå, grön, gul, lila och silver.</p>
      <p>På din tur flyttar du en pjäs, en gång. Inget slås ut: pjäserna ligger kvar på brädet tills deras spelare ger upp.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Ett steg</h2>
      <p>Flytta en pjäs till en ledig plats bredvid den.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "En röd pjäs med en vit ring runt sig. Tre av dess sex grannar är lediga och markerade, de andra tre har pjäser.",
  tekst: "Den röda pjäsen kan gå till de tre markerade platserna. De andra tre grannarna är upptagna.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Ett hopp</h2>
      <p>Hoppa över en pjäs bredvid din, av vilken färg som helst, och landa på den lediga platsen precis bakom den, i en rak linje. Du kan hoppa i alla sex riktningar, också bakåt.</p>
      <ul>
        <li>Platsen du landar på måste vara ledig.</li>
        <li>Du kan inte hoppa över två pjäser i rad, eller över en tom plats.</li>
        <li>Pjäsen du hoppar över ligger kvar där den är.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "En röd pjäs hoppar över en blå pjäs till den lediga platsen bakom, visat med en pil.",
  tekst: "Den röda pjäsen hoppar över den blå pjäsen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En kedja av hopp</h2>
      <p>Efter ett hopp kan samma pjäs hoppa igen, så många gånger den kan och åt vilket håll som helst. Du bestämmer var du stannar. Alla hoppen tillsammans är ett drag.</p>
      <ul>
        <li>I ett drag kan du inte landa på samma plats två gånger.</li>
        <li>Ett drag är ett steg, eller ett eller flera hopp. Du kan inte gå ett steg efter ett hopp.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "En röd pjäs gör tre hopp i ett drag, över en blå, en grön och ytterligare en blå pjäs. De tre landningsplatserna är numrerade 1, 2 och 3.",
  tekst: "Ett drag med tre hopp, i den ordning som numren visar.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Målet</h2>
      <p>Du vinner genom att flytta alla dina 10 pjäser till spetsen mitt emot där du började. Alla 10 platser i den spetsen måste ha dina egna pjäser. Så länge en pjäs från en annan spelare står där kan du inte göra dig klar.</p>
      <p>Du får landa på vilken ledig plats som helst, också i de andra spelarnas spetsar.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Ett stjärnbräde för tre spelare. Röd börjar nederst, den tomma spetsen överst, markerad med streckade cirklar, är rödas mål.",
  tekst: "Med 3 spelare börjar röd nederst. Rödas mål är den tomma spetsen överst.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Med 2, 3, 4 eller 6 spelare</h2>
      <ul>
        <li><strong>2 spelare:</strong> den första spelaren som fyller målet vinner, och spelet är slut.</li>
        <li><strong>3, 4 eller 6 spelare:</strong> den första spelaren som fyller målet vinner. De andra spelar vidare om nästa platser, och en spelare som är klar hoppas över. Spelet är slut när bara en spelare fortfarande spelar.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Ge upp</h2>
      <p>När du ger upp lämnar dina pjäser brädet, så de står inte i vägen för någon. Med 2 spelare vinner den andra spelaren. Med fler spelare fortsätter spelet utan dig, och om alla utom en ger upp vinner den sista spelaren.</p>
      <p>I ett onlinespel har varje drag en tidsgräns. Spelaren som startar spelet bestämmer den, och i ett snabbt spel är den 30 sekunder. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp. Spel mot datorn och på en telefon har ingen tidsgräns.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bygg stegar.</strong> Ställ pjäser på en rad med en ledig plats mellan dem, riktade mot ditt mål. Då kan en pjäs hoppa längs hela raden i ett enda drag.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fyra pjäser på en diagonal rad med en ledig plats mellan varje. En röd pjäs i ena änden hoppar över alla fyra, med fyra numrerade landningsplatser.",
  tekst: "Fyra pjäser på en rad: den röda pjäsen överst tar sig över brädet i ett drag, med fyra hopp.",
})}
        </li>
        <li><strong>Varje pjäs är en stege.</strong> Du kan hoppa över alla färger, så de andra spelarnas pjäser hjälper dig också. Och dina egna stegar hjälper dem: titta på vad du lämnar efter dig.</li>
        <li><strong>Glöm inte eftersläntrarna.</strong> Du behöver alla 10 pjäser hemma. En pjäs långt bakom, utan något att hoppa över, flyttar en plats per tur. Ta med den medan de andra pjäserna fortfarande finns runt den.</li>
        <li><strong>Din start är deras mål.</strong> Med 2, 4 eller 6 spelare är din startspets målet för spelaren mitt emot dig, och de kan inte göra sig klara så länge en av dina pjäser fortfarande står där. Detsamma gäller för dig.</li>
      </ul>
      <p>Fler tips, med bilder, finns i guiden <a href="/sv/guider/kinaschack-strategi">Strategi i kinaschack</a>. För ett spel med två, läs <a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Frågor</h2>
      <h3>Hur många kan spela kinaschack?</h3>
      <p>Två, tre, fyra eller sex. Varje spelare börjar i en spets av stjärnan. Med 2, 3 eller 4 spelare förblir några spetsar tomma.</p>
      <h3>Hur många kulor har varje spelare?</h3>
      <p>Varje spelare har 10 kulor, eller pjäser. Brädet har 121 platser: 10 i var och en av de sex spetsarna och 61 i mitten.</p>
      <h3>Får man hoppa över sina egna pjäser, eller bakåt?</h3>
      <p>Ja. Du kan hoppa över en pjäs av vilken färg som helst, också din egen, i alla sex riktningar, också bakåt. Pjäsen du hoppar över ligger kvar där den är.</p>
      <h3>Slår man ut pjäser i kinaschack?</h3>
      <p>Nej. Inget slås ut. En pjäs lämnar bara brädet när dess spelare ger upp.</p>
      <h3>Kommer kinaschack från Kina?</h3>
      <p>Nej. Spelet dök upp i Tyskland 1892 som Stern-Halma, baserat på det äldre spelet Halma. Namnet kinaschack kommer från USA, 1928. Läs mer i <a href="/sv/regler/sternhalma">Sternhalma</a>.</p>
      <h3>Var kan man spela kinaschack online med vänner gratis?</h3>
      <p>I Leapstone, i webbläsaren eller i appen från App Store. Skicka en inbjudningslänk till en vän: de går med i ditt spel utan konto, e-postadress eller lösenord. Du kan också spela mot datorn, eller ett snabbt spel mot en annan spelare. Leapstone är gratis och utan reklam.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Spela kinaschack i Leapstone</h2>
      <p>Leapstone är en gratis app för kinaschack och Halma, med ett 3D-bräde i röd lack och guld. Du kan spela i appen och i webbläsaren.</p>
      <ul>
        <li><strong>Mot datorn.</strong> Lätt, normal eller svår. Du behöver inget internet.</li>
        <li><strong>Med vänner.</strong> Skicka en inbjudningslänk. Du ställer in tiden per drag, och ni kan chatta.</li>
        <li><strong>Online.</strong> Ett snabbt spel mot en annan spelare på din nivå, 30 sekunder per drag. Vissa motståndare online kan vara datorspelare.</li>
        <li><strong>På en telefon.</strong> Skicka telefonen runt bordet.</li>
      </ul>
      <p>Leapstone är gratis, utan reklam och utan inloggning med e-postadress: Du väljer bara ett spelarnamn. <a href="https://apps.apple.com/se/app/id6831230722">Ladda ner från App Store</a> eller <a href="/play/">spela i webbläsaren</a>.</p>
    </section>`;

export default {
  nav: "Regler för kinaschack",
  titel: "Regler och tips för kinaschack | Leapstone",
  beschrijving: "Så spelar du kinaschack: start, steg, hopp och kedjor av hopp, hur du vinner med 2, 3, 4 eller 6 spelare, och tips. Spela gratis i webbläsaren.",
  h1: "Regler för kinaschack",
  intro: "Flytta alla dina 10 pjäser över stjärnbrädet till den motsatta spetsen innan någon annan hinner. Reglerna i korthet, med bilder, och några tips.",
  inhoud,
};
