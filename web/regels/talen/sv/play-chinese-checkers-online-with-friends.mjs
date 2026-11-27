// Den svenska guiden Kinaschack online med vänner (taak 304). Texten följer ../en/ mening för mening.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Stegen, från start till första draget</h2>
      <ol>
        <li><strong>Välj ett spelarnamn.</strong> Mer behövs inte för att logga in.</li>
        <li><strong>Skapa ett onlineparti.</strong> Välj bräde, antal spelare och tid per drag.</li>
        <li><strong>Skicka inbjudningslänken.</strong> Dela den från väntrummet, eller kopiera den och klistra in den i valfri chattapp.</li>
        <li><strong>Vänta tills alla har öppnat den.</strong> När den sista platsen är tagen startar partiet och du gör det första draget.</li>
      </ol>
      <p>Resten av sidan förklarar varje del, och vad som händer när en vän slutar spela.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Så fungerar inbjudningslänken</h2>
      <p>Ett parti har en inbjudningslänk, och alla vänner använder samma. Varje vän som öppnar den tar nästa lediga plats. Du skapade partiet, så du är spelare 1 och tar den första platsen.</p>
      <ul>
        <li><strong>Hur många platser:</strong> på stjärnbrädet har ett parti 2, 3, 4 eller 6 spelare, och på det fyrkantiga brädet 2 eller 4. Du väljer det innan du skickar länken. Partiet startar inte med tomma platser, och det blir inget drag förrän den sista platsen är tagen.</li>
        <li><strong>Väntrummet:</strong> medan du väntar visar väntrummet vem som är med och hur många platser som är lediga. Det uppdateras av sig självt när en vän går med.</li>
        <li><strong>Dela:</strong> knappen Inbjudan öppnar delningsmenyn i telefonen. Finns den inte kopieras länken, och då klistrar du in den själv.</li>
        <li><strong>I webbläsaren eller i appen:</strong> länken fungerar utan appen, i en webbläsare. Har din vän appen kan länken öppna den.</li>
        <li><strong>En full eller okänd länk:</strong> när alla platser är tagna visar länken att partiet är fullt. En länk som inte finns visar att inbjudan är okänd. Be i båda fallen din vän om en ny länk.</li>
      </ul>
      <p>Länken gäller bara det här partiet. Den har 16 slumpmässiga tecken, så ingen kan gissa den, men var och en som får den kan ta en ledig plats. Skicka den bara till dem du vill spela med.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Inget konto, bara ett spelarnamn</h2>
      <p>Du behöver ingen e-postadress eller något lösenord. Du väljer ett spelarnamn på 1 till 30 tecken, och de andra spelarna ser det namnet. Några otrevliga namn nekas, och då väljer du ett annat.</p>
      <p>När du har valt ett namn visar appen en återställningskod på 20 tecken i fem grupper. Spara den. Får du en ny telefon skriver du in koden och får tillbaka ditt spelarnamn. Utan koden kan du inte få tillbaka ditt namn på en ny telefon.</p>
      <p>Dina vänner gör likadant när de öppnar din länk: de väljer först ett namn och går sedan med i ditt parti.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Tid per drag: hur länge en vän får fundera</h2>
      <p>Tiden per drag är den längsta tid en spelare har för ett drag. Du ställer in den när du skapar partiet, och den gäller för alla i partiet.</p>
      <ul>
        <li><strong>Valen:</strong> 15 sekunder, 30 sekunder, 1 minut eller 2 minuter. Du kan också stänga av den, utan någon gräns alls. Appen börjar på 30 sekunder.</li>
        <li><strong>Klockan:</strong> servern håller tiden, så en telefon med fel klocka ändrar ingenting. Appen visar hur mycket tid som är kvar.</li>
        <li><strong>Den första klockan:</strong> den startar när den sista platsen är tagen. Innan dess är ingen på klockan.</li>
        <li><strong>Ett snabbt parti:</strong> trycker du på Spela online för att möta en främling är tiden per drag fast 30 sekunder. Bara ett parti med vänner låter dig välja.</li>
      </ul>
      <p>För vänner som spelar från soffan är 2 minuter eller ingen gräns lugnt. För ett snabbt parti väljer du 15 sekunder. Utan gräns kan ett parti vänta så länge det behövs, och du avslutar det när du har tid.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Vad som händer när någon hoppar av</h2>
      <p>Ett parti ligger på servern, inte i en telefon. Stänger en vän appen, tappar anslutningen eller somnar står partiet kvar där det är, och vännen hittar det igen under Mina partier.</p>
      <ul>
        <li><strong>Tiden går ut:</strong> den spelarens tur hoppas över. Inget flyttas på brädet, och nästa spelare är på klockan.</li>
        <li><strong>Tre turer i rad:</strong> en spelare som missar 3 turer i rad ger upp av sig själv. Varje drag spelaren gör sätter räkningen på noll igen.</li>
        <li><strong>Att ge upp:</strong> en spelare som ger upp, av eget val eller efter 3 missade turer, får sina pjäser borttagna från brädet, så de stör ingen.</li>
        <li><strong>Ett parti för 2:</strong> partiet är slut och den andra spelaren vinner.</li>
        <li><strong>Ett parti för 3, 4 eller 6:</strong> partiet fortsätter utan spelaren som är borta, och turen går till nästa spelare som fortfarande är med.</li>
        <li><strong>Ingen tid per drag:</strong> har du valt ingen gräns hoppar partiet aldrig över en tur. Det väntar tills vännen kommer tillbaka, eller tills vännen ger upp.</li>
      </ul>
      <p>Har du slagit på aviseringar säger appen till när det är din tur, även när den är stängd. Slå på dem i appen eller i inställningarna för telefonen eller webbläsaren.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Efter partiet</h2>
      <p>Spelare som spelar ihop via en inbjudan läggs till i varandras vänlistor. Därifrån kan du utmana en vän till ett nytt parti, utan ny länk. Dina öppna och avslutade partier finns under Mina partier.</p>
      <p>Ny med reglerna? Läs <a href="/sv/regler/kinaschack">reglerna för kinaschack</a>. Spelar ni två? Läs <a href="/sv/guider/kinaschack-for-tva">kinaschack för 2 spelare</a>. Vill du vinna? Läs <a href="/sv/guider/kinaschack-strategi">strategitipsen</a>.</p>
      <p><a href="/sv/guider/kinaschack-for-tre">Kinaschack för 3 spelare</a></p>
    </section>`;

export default {
  nav: "Kinaschack online med vänner",
  titel: "Spela kinaschack online med vänner | Leapstone",
  beschrijving: "Spela kinaschack online med vänner: skicka en länk, ställ in tiden per drag, spela med bara ett spelarnamn och se vad som händer om någon hoppar av.",
  h1: "Spela kinaschack online med vänner",
  intro: "Skapa ett parti, skicka en inbjudningslänk och spela när alla har gått med. Du behöver bara ett spelarnamn, och du ställer in tiden per drag själv.",
  inhoud,
};
