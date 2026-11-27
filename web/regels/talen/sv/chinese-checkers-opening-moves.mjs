// Den svenska guiden Öppningsdrag i kinaschack (taak 303). Texten följer ../en/chinese-checkers-opening-moves.mjs mening för mening.
// Varje tal och drag är kontrollerat mot crates/halma-core; bilderna kommer från crates/halma-core/examples/regelplaatjes.rs (se docs/plan.md, taak 303).
// Inga påhittade "experter" eller historia. Bara siffror i texten (inga talord).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Ditt första drag: 14 val</h2>
      <p>I början fyller dina 10 pjäser en triangel i rader om 4, 3, 2 och 1, och främsta raden vetter mot brädets mitt. Det finns ingen ledig plats inne i triangeln, så en pjäs kan bara gå till raden precis framför sig. Då återstår 14 första drag: var och en av de 4 pjäserna i främsta raden kan gå till 2 platser (8 steg), och var och en av de 3 pjäserna i andra raden kan hoppa över en pjäs i fronten till 2 platser (6 hopp). De andra 3 pjäserna kan inte röra sig än.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Den röda spetsen längst ner med sina 10 pjäser, och i raden precis framför den 5 lediga platser markerade med en ring.",
  tekst: "Varje första drag slutar på någon av de här 5 platserna.",
})}
      <p>I den här guiden är en rad en linje av platser tvärs över din spets, parallell med dess främre kant, och vi räknar framsteg i rader. Ett steg flyttar en pjäs framåt 1 rad och ett hopp flyttar den 2 rader. Alla spelare har samma 14 första drag, med 2, 3, 4 eller 6 spelare och från vilken spets på stjärnan som helst, eftersom alla spetsar ser likadana ut inifrån.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Öppning 1: hoppa ut och frigör toppen</h2>
      <p>Pjäsen i toppen av din spets är längst från ditt mål, och den kan inte röra sig i början: den kan bara hoppa över en pjäs om platsen bakom pjäsen är ledig. Ett hopp från andra raden skapar just en sådan plats.</p>
      <ol>
        <li><strong>Drag 1:</strong> pjäsen i högra änden av din andra rad hoppar över pjäsen framför sig. Den landar i raden framför din spets och vinner 2 rader.</li>
        <li><strong>Drag 2:</strong> pjäsen i toppen hoppar två gånger i ett drag: först till platsen som drag 1 tömde, sedan över en pjäs i andra raden. Den vinner 4 rader.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Den röda spetsen efter drag 1. Pjäsen i toppen har en ring, och 2 pilar med siffrorna 1 och 2 visar dess hopp genom den tömda platsen till raden framför spetsen.",
  tekst: "Efter drag 1 hoppar pjäsen i toppen ut med 2 hopp.",
})}
      <p>Det är 6 rader på 2 drag. Vi prövade alla sätt att spela 2 drag, och 6 är det mesta du kan vinna. Bara 4 par av drag når dit: pjäsen i någon av ändarna på andra raden hoppar, i någon av sina 2 riktningar, och pjäsen i toppen följer efter. Pjäsen i mitten av andra raden fungerar inte, eftersom den håller toppen stängd.</p>
      <p>Båda pjäserna står nu i raden framför din spets med en ledig plats mellan sig. Det är första steget på en stege.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Öppning 2: 4 drag med 4 olika pjäser</h2>
      <p>På 4 drag kan du vinna som mest 13 rader, och du kommer dit bara när varje drag använder en annan pjäs. Den här spelföljden klarar det:</p>
      <ol>
        <li><strong>Drag 1:</strong> pjäsen i högra änden av främsta raden går ett steg framåt. Den vinner 1 rad.</li>
        <li><strong>Drag 2:</strong> pjäsen i högra änden av tredje raden hoppar två gånger. Den vinner 4 rader.</li>
        <li><strong>Drag 3:</strong> pjäsen i vänstra änden av andra raden hoppar två gånger. Den vinner 4 rader.</li>
        <li><strong>Drag 4:</strong> pjäsen i toppen hoppar två gånger. Den vinner 4 rader.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Den röda spetsen i början. De 4 pjäser som ska flyttas har en siffra från 1 till 4, i den ordning dragen görs.",
          tekst: "Före: pjäserna som flyttas, i ordning.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Den röda spetsen efter 4 drag, med de 4 platser där de numrerade pjäserna landade i raderna framför spetsen, och 4 hål kvar i spetsen.",
          tekst: "Efter: där de landade.",
        })}
      </div>
      <p>Varje drag förbereder nästa. Drag 2 och 3 slutar med ett hopp över pjäsen som flyttades precis innan, och drag 4 börjar genom hålet som drag 3 lämnade. Alla 4 pjäser landar i din egen halva av brädet.</p>
      <p>Det finns fler spelföljder som når 13. Det de delar är idén: leta efter draget som lämnar ett hål eller en språngbräda för nästa drag, och släpp ut pjäsen i toppen senast vid drag 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Misstag i de första dragen</h2>
      <ul class="tips">
        <li><strong>Att flytta samma pjäs varje tur.</strong> En pjäs som springer ensam vinner 5 rader på 4 drag, mot 13 för 4 olika pjäser. Dessutom blir resten av dina pjäser stående kvar.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Den röda spetsen i början. En pjäs från andra raden gör 4 drag i rad längs en linje, med pilar och siffrorna 1 till 4, och hamnar ensam nära brädets mitt.",
  tekst: "En pjäs, 4 drag, 5 rader.",
})}
      <ul class="tips">
        <li><strong>Att bara gå steg med främsta raden.</strong> 4 steg vinner 4 rader. Efter dem kan pjäsen i toppen fortfarande inte röra sig, så den blir kvar längst bak medan resten går framåt.</li>
        <li><strong>Att gå steg åt sidan.</strong> Ett steg längs en rad vinner 0 rader. Efter drag 1 i öppning 1 kan pjäsen längst fram gå till platsen bredvid sig, och det ser ut som framsteg, men draget är bortkastat.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Fortsätt härifrån</h2>
      <p>Efter ungefär 4 drag kommer de två arméerna nära varandra, och öppningarna ovan går över i mittspelet. Du behöver inte lära dig spelföljderna utantill: kom ihåg att varje drag ska förbereda nästa.</p>
      <ul>
        <li><a href="/play/">Spela mot datorn i webbläsaren</a> och prova öppning 1 eller 2.</li>
        <li><a href="/sv/guider/kinaschack-strategi">Strategi i kinaschack</a>: stegar, att hålla ihop pjäserna och att fylla målet.</li>
        <li><a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>: hur ett spel för två fungerar.</li>
        <li><a href="/sv/regler/kinaschack">Regler för kinaschack</a>, med bilder av steg, hopp och kedjor.</li>
      </ul>
    </section>`;

export default {
  nav: "Öppningsdrag i kinaschack",
  titel: "Öppningsdrag i kinaschack: 2 öppningar | Leapstone",
  beschrijving: "Öppningsdrag i kinaschack: så hoppar du ut ur din spets, frigör pjäsen i toppen till drag 2 och vinner 13 rader på 4 drag, och misstagen att undvika.",
  h1: "Öppningsdrag i kinaschack",
  intro: "En bra öppning i kinaschack hoppar ut från andra raden, använder en annan pjäs varje tur och släpper ut pjäsen i din topp vid drag 2 eller 4. Två öppningar med bilder, och misstagen att undvika.",
  inhoud,
};
