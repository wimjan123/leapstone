// Den svenska guiden Kinaschack för 6 spelare (taak 302). Texten följer ../en/chinese-checkers-6-players.mjs mening för mening.
// Reglerna kommer från crates/halma-core (Board::star med start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) och tidsgränsen från "Techniek".
// Se docs/plan.md, taak 302, för kontrollen per påstående.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Så börjar spelet</h2>
      <p>Varje spelare har 10 pjäser, och alla 6 spetsar av stjärnan används. Det ger 60 pjäser på ett bräde med 121 platser. De 61 platserna i mitten är tomma från början.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 10 pjäser i var och en av de 6 spetsarna, i 6 färger",
  tekst: "6 spelare, 6 spetsar, 60 pjäser.",
})}
      <p>Spelare 1, röd, börjar, från den nedre spetsen. Sedan går turen från Spelare 1 till Spelare 6, och efter Spelare 6 är det Spelare 1 igen. Spelarna är numrerade i ordningen på sina spetsar runt stjärnan, så spelaren efter dig börjar alltid i spetsen bredvid din. Ett drag är ett steg eller en kedja av hopp med en pjäs. Se <a href="/sv/regler/kinaschack">reglerna för kinaschack</a> för steg och hopp.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Varje mål är fullt från början</h2>
      <p>Du vinner genom att flytta alla dina 10 pjäser till spetsen mitt emot. Med 6 spelare är det spetsen där spelaren mitt emot dig börjar, så inget mål är tomt: varje mål är från början fullt av en annan spelares pjäser. För röd är målet den övre spetsen, där Spelare 4 börjar.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Stjärnbrädet med 6 fyllda spetsar. En streckad ring markerar den övre spetsen, den röda spelarens mål, som är full av pjäser från spelaren mitt emot.",
  tekst: "Rödas mål är spetsen mitt emot, full av Spelare 4:s pjäser.",
})}
      <p>Du kan bara landa på en ledig plats, så spelaren mitt emot måste lämna sin spets innan du kan fylla den, och du måste lämna din innan de kan fylla sin. I ett spel för 2 är det allt som gäller. Med 6 måste båda dessutom ta sig igenom trängseln av de 4 andra.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">En trång mitt</h2>
      <p>Varje mål ligger på andra sidan brädet, och spetsarna hänger bara ihop med varandra genom mitten, så alla 60 pjäser måste korsa samma 61 platser. I början har ingen korsat än, och mitten fylls snabbt.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "En röd pjäs hoppar tre gånger i ett drag: över en blå pjäs, sedan en grön pjäs och sedan en lila pjäs. Siffrorna 1, 2 och 3 markerar landningsplatserna.",
  tekst: "Pjäser i alla färger är språngbrädor.",
})}
      <p>Du kan hoppa över en pjäs av vilken färg som helst. Pjäser från 5 andra spelare är språngbrädor för dig, och dina är språngbrädor för alla 5. En rad pjäser som du lämnar i mitten är en stege för den som kan nå den, och spelaren efter dig får första chansen.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blockera med 5 motståndare</h2>
      <ul>
        <li><strong>Fyll landningsplatsen:</strong> ett hopp kräver en ledig plats precis bakom pjäsen. När du flyttar en pjäs dit är hoppet borta för alla spelare som ville ha det.</li>
        <li><strong>Se upp med stegarna du bygger:</strong> efter ditt drag spelar de andra 5 spelarna innan det är din tur igen. En stege hjälper dem alla.</li>
        <li><strong>Vem som helst kan blockera ett mål:</strong> en pjäs från någon annan spelare i ditt mål hindrar dig från att bli klar, inte bara en pjäs från spelaren mitt emot. Alla 10 platser i målet måste innehålla dina egna pjäser.</li>
      </ul>
      <p><a href="/sv/guider/kinaschack-strategi">Strategitipsen</a> visar hur ett blockerat hopp ser ut, och hur du undviker att låsa in en annan spelares pjäs i ditt eget mål.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Hur länge ett spel varar</h2>
      <p>I ett spel för 6 finns det 60 pjäser att flytta, och mellan ett drag av dig och nästa gör de andra 5 spelarna ett var. Spelet tar inte heller slut när den första spelaren blir klar.</p>
      <ul>
        <li><strong>Vinn, och spela vidare:</strong> den första spelaren som fyller målet vinner, och de andra spelar vidare om nästa platser. Spelaren som är klar hoppas över, och pjäserna från den spelaren ligger kvar på brädet som språngbrädor. Spelet är slut när bara en spelare spelar kvar.</li>
        <li><strong>Ge upp:</strong> dina pjäser lämnar brädet, så de blockerar eller hjälper ingen längre, och de andra spelar vidare.</li>
        <li><strong>Tid (online):</strong> i ett onlinespel har varje drag en tidsgräns som den som startar spelet bestämmer: 15 sekunder, 30 sekunder, 1 minut, 2 minuter eller ingen gräns. En runda med 6 drag tar högst 6 gånger gränsen, så med 30 sekunder är det högst 3 minuter. När din tid är slut hoppas din tur över. Om du missar 3 turer i rad ger du upp, och spelet fortsätter utan dig.</li>
      </ul>
      <p>För ett spel med färre spelare, läs <a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Var du spelar med 6 spelare i Leapstone</h2>
      <ul>
        <li><strong>Mot datorn, direkt:</strong> öppna <a href="/play/">Leapstone i webbläsaren</a>, tryck på Dator, välj stjärnbrädet och 5 datorer. Du är Spelare 1, så du börjar. Datorerna spelar efter varandra, var och en med en kort paus, så du kan följa varje drag. Du väljer Lätt, Normal eller Svår för datorerna.</li>
        <li><strong>På en telefon:</strong> tryck på Spela, välj stjärnbrädet och 6 spelare, och tryck sedan på en pjäs för att växla den platsen mellan en person och en dator.</li>
        <li><strong>Online med vänner:</strong> tryck på Vänner, välj stjärnbrädet, 6 spelare och tiden per drag, och skicka inbjudningslänken. Spelet startar när alla 6 platser är tagna.</li>
        <li><strong>Snabba spel:</strong> Spela online hittar spel för 2 eller 4 spelare, så det finns inget snabbt spel för 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaschack för 6 spelare",
  titel: "Kinaschack för 6 spelare: hela brädet | Leapstone",
  beschrijving: "Så fungerar kinaschack med 6 spelare: en full stjärna med 60 pjäser, en trång mitt, blockering, hur länge ett spel varar och var du spelar det.",
  h1: "Kinaschack för 6 spelare",
  intro: "Så fungerar ett spel för 6: alla 6 spetsar är fulla, du tävlar mot spetsen mitt emot, och spelet fortsätter när den första spelaren är klar.",
  inhoud,
};
