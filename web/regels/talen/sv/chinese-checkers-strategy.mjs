// Den svenska guiden Strategi i kinaschack (taak 134). Texten följer ../en/chinese-checkers-strategy.mjs mening för mening.
// Varje tips är kontrollerat mot crates/halma-core; bilderna kommer från crates/halma-core/examples/regelplaatjes.rs (se docs/plan.md, taak 122).
// Inga påhittade "experter", siffror eller historia. Det enda talet är 16 (steg från spets till spets).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Vad de här tipsen bygger på</h2>
      <p>Tipsen följer av <a href="/sv/regler/kinaschack">reglerna för kinaschack</a> som Leapstone spelar dem: ett drag är ett steg eller en kedja av hopp, och du kan hoppa över en pjäs av vilken färg som helst. De är inget bevis för bästa spel. Att spela mot datorn är det snabbaste sättet att pröva dem.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Bygg stegar</h2>
      <p>En stege är en rad av pjäser med en ledig plats mellan var och en. En pjäs i ena änden hoppar över hela raden i ett enda drag, så den tar sig över brädet på en tur i stället för en plats per tur.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Fyra pjäser på en diagonal rad med en ledig plats mellan varje. En röd pjäs i ena änden hoppar över alla fyra, med fyra numrerade landningsplatser.",
  tekst: "Fyra hopp i ett drag. Samma pjäs kunde bara gå en plats i taget.",
})}
      <p>Ett hopp fungerar i alla sex riktningar, också bakåt, så en stege behöver inte börja i din egen spets. Vilken rad av pjäser som helst med luckor mellan sig duger.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Håll ihop dina pjäser</h2>
      <p>Du behöver alla 10 pjäser i ditt mål, så din sista pjäs avgör när du blir klar. En pjäs utan någon pjäs bredvid sig har inget att hoppa över och kan bara gå steg.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Ett stjärnbräde med en röd pjäs ensam i den nedre spetsen. Bara dess två lediga grannar är markerade. Andra röda och blå pjäser står i mitten.",
  tekst: "Den här pjäsen har ingen granne, så den kan bara gå till de två markerade platserna.",
})}
      <p>Från spetsen av din egen spets till spetsen av målet tvärs över brädet är det 16 steg. Det är 16 turer för en pjäs på egen hand, medan en stege tar sig över på en. Flytta pjäserna längst bak medan det fortfarande finns pjäser runt dem att hoppa över. Datorn i Leapstone gör likadant: den ger drag med sina bakersta pjäser lite högre poäng.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Använd mitten</h2>
      <p>En pjäs i mitten av brädet har sex grannar, så den kan gå eller hoppa i alla sex riktningar. En pjäs vid kanten har färre. Pjäsen vid kanten på bilden har fyra.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Ett stjärnbräde med en röd pjäs i mitten med sex markerade grannar, och en röd pjäs nära den övre vänstra kanten med fyra markerade grannar.",
  tekst: "Sex sätt att gå i mitten, fyra vid kanten.",
})}
      <p>Pjäser i mitten ger också de andra pjäserna något att hoppa över på väg över brädet.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Fyll målet bakifrån</h2>
      <p>Ditt mål är en triangel med 10 platser, i rader om 4, 3, 2 och 1. Platserna längst bak kan bara nås genom platserna framför dem. Om du fyller fronten först kan den sista pjäsen sakna väg in.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Målspetsen överst med nio röda pjäser och en ledig plats allra längst bak, markerad med streck. En tionde röd pjäs, med en vit ring, står nedanför främre raden.",
  tekst: "Nio pjäser är hemma, och platsen längst bak är ledig. Den tionde pjäsen har inget drag dit.",
})}
      <p>Sätt de första pjäserna på platserna längst bak och arbeta dig framåt, så att fronten förblir öppen för de pjäser som kommer sist.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Stäng inte in en pjäs i ditt mål</h2>
      <p>Du får stanna i en annan spelares spets, så en pjäs från en annan spelare kan hamna i ditt mål. Du vinner bara när alla 10 platser i ditt mål har dina egna pjäser. Om den pjäsen inte har något drag kan ingen flytta den, och du kan inte vinna förrän en plats bredvid den blir ledig.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Målspetsen överst med nio röda pjäser och en blå pjäs allra längst bak, markerad med en vit ring. Den blå pjäsen är omgiven av röda pjäser.",
  tekst: "Den blå pjäsen längst bak har inget drag, och röd kan inte fylla målet.",
})}
      <p>Håll en plats bredvid en sådan pjäs öppen, så att den kan lämna. Datorn i Leapstone räknar med detta: ett drag som stänger in en annan spelares pjäs i dess mål får lägre poäng. Reglerna tvingar ingen att lämna ditt mål, så den andra spelaren kan också parkera en pjäs där med flit.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blockera ett hopp, eller lämna det</h2>
      <p>Ett hopp behöver en ledig plats att landa på. Fyll den platsen och hoppet är borta. Två pjäser i rad kan inte heller hoppas över.</p>
      <p>Dina pjäser är språngbrädor för den andra spelaren också. På bilden till vänster tar sig blå över två röda pjäser i ett drag. Till höger flyttade röd en pjäs till den första landningsplatsen, och blå kan bara gå steg.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "En blå pjäs med två röda pjäser på en linje, var och en med en ledig plats bakom sig. Pilar visar två hopp av den blå pjäsen.",
          tekst: "Före: blå kan göra två hopp.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Samma linje efter att röd flyttat sin bortre pjäs till den första landningsplatsen. Den blå pjäsen följs av två röda pjäser i rad.",
          tekst: "Efter: röd flyttade en pjäs. Blå har inget hopp.",
        })}
      </div>
      <p>Ett drag som läggs på att blockera är ett drag som inte läggs på din egen framfart, så blockera när hoppet ger den andra spelaren mer än ditt drag skulle ge dig. Det är tvärtom när du bygger en stege: efter ditt drag flyttar den andra spelaren först, så en pjäs av deras i ena änden använder din stege före dig. På den svåraste nivån tittar datorn på varje motståndares bästa svar innan den väljer ett drag.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Fortsätt</h2>
      <ul>
        <li><a href="/play/">Spela mot datorn i webbläsaren</a> och prova en stege.</li>
        <li><a href="/sv/guider/kinaschack-for-tva">Kinaschack för 2 spelare</a>: hur ett spel för två fungerar.</li>
        <li><a href="/sv/regler/kinaschack">Regler för kinaschack</a>, med bilder av steg, hopp och kedjor.</li>
      </ul>
      <p><a href="/sv/guider/kinaschack-online-med-vanner">Kinaschack online med vänner</a></p>
      <p><a href="/sv/guider/halma-eller-kinaschack">Halma eller kinaschack</a></p>
      <p><a href="/sv/guider/kinaschack-for-tre">Kinaschack för 3 spelare</a></p>
    </section>`;

export default {
  nav: "Strategi i kinaschack",
  titel: "Strategi i kinaschack: 6 tips med bilder | Leapstone",
  beschrijving: "Strategi i kinaschack: bygg stegar, håll ihop pjäserna, använd mitten, fyll målet bakifrån och lär dig när du ska blockera ett hopp.",
  h1: "Strategi i kinaschack",
  intro: "Sex tips för stjärnbrädet, vart och ett med en bild från de riktiga reglerna: stegar, eftersläntrare, mitten, att fylla målet och att blockera hopp.",
  inhoud,
};
