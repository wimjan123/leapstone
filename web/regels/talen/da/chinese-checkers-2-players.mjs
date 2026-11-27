// Den danske guide Kinaskak for 2 spillere (opgave 134): /da/guider/kinaskak-for-to-spillere.
// Reglerne kommer fra crates/halma-core (Board::star, Game::new_star(2), make_move, resign) og fra "Regler" og opgave 80 for tidsgrænsen.
// Computerspillerens niveauer kommer fra crates/halma-core/src/computer.rs (Level, choose_move).
// Hvad appen viser kommer fra web/src/Startmenu.svelte og landingssiden. Indhold: den engelske guide ../en/chinese-checkers-2-players.mjs, sætning for sætning på dansk.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Sådan starter spillet</h2>
${plaatje({
  direct: true,
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjernebrættet med 10 røde brikker i den nederste spids og 10 blå brikker i den øverste spids",
  tekst: "Rød starter nederst, blå øverst.",
})}
      <p>Hver spiller har 10 brikker. De starter i to spidser af stjernen, der vender mod hinanden: rød nederst, blå øverst. De 20 brikker står på et bræt med 121 felter.</p>
      <p>Spiller 1, rød, går først. Derefter skiftes I til at flytte, ét træk hver. Et træk er ét skridt eller en kæde af hop med én brik. Se <a href="/da/regler/kinaskak">reglerne for kinaskak</a> for skridt og hop.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Dit mål er den andens start</h2>
      <p>Du vinder ved at flytte alle 10 af dine brikker ind i den spids, hvor den anden spiller startede. Den spids er i starten fuld af deres brikker, og din er fuld af dine. For rød er det den øverste spids på billedet ovenfor.</p>
      <p>Du kan kun lande på et tomt felt, så I skal begge forlade jeres egen spids, før den anden kan fylde den. Ingen af jer kan blive færdig, så længe en brik fra den anden bliver i målet. Og fordi I krydser den samme midte i hver sin retning, er den anden spillers brikker trædesten for dig, og dine for dem. Læs <a href="/da/guider/kinaskak-strategi">strategitipsene</a> for, hvad du kan gøre ved det.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">At vinde og give op</h2>
      <ul>
        <li><strong>Vinde:</strong> Den første spiller, der fylder målet med alle 10 brikker, vinder, og spillet er slut med det samme. Den anden spiller spiller ikke videre.</li>
        <li><strong>Give op:</strong> Dine brikker forlader brættet, og den anden spiller vinder.</li>
        <li><strong>Tid (online):</strong> I et onlinespil har hvert træk en tidsgrænse. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan 3, 4 og 6 spillere er anderledes</h2>
      <ul>
        <li><strong>3 spillere:</strong> Brikkerne starter i hver anden spids, og de tre mål er tomme i starten. Den første spiller, der bliver færdig, vinder; de andre spiller videre om de næste pladser, og en spiller, der er færdig, bliver sprunget over.</li>
        <li><strong>4 spillere:</strong> to par af spidser ved siden af hinanden. Dit mål er i starten fuldt af en anden spillers brikker. Spillet fortsætter efter den første, der bliver færdig, som med 3.</li>
        <li><strong>6 spillere:</strong> alle seks spidser. Brættet rummer 60 brikker mod 20 med 2 spillere.</li>
      </ul>
      <p>Med kun 20 brikker på brættet er der færre brikker at hoppe over, så de stiger, du selv bygger, betyder mere. <a href="/da/regler/kinaskak">Regelsiden</a> har billeder af alle starter.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 2 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mod computeren, lige nu:</strong> Åbn <a href="/play/">Leapstone i din browser</a>, tryk på Computer og vælg stjernebrættet. Én computer er standard, så det er et spil for 2. Du vælger Let, Normal eller Svær, og du er spiller 1, så du går først. Let vælger det bedste af tre tilfældige træk. Normal vælger det træk, der giver mest fremgang mod målet. Svær ser også på, hvordan modstanderne kan svare, og på sit eget næste træk.</li>
        <li><strong>Spil online, i appen:</strong> et hurtigt spil på stjernebrættet for 2 spillere, mod en anden spiller på dit niveau, med 30 sekunder pr. træk. Nogle online-modstandere kan være computerspillere.</li>
        <li><strong>Med en ven:</strong> send et invitationslink, og bestem selv tiden pr. træk. Eller send én telefon frem og tilbage.</li>
      </ul>
      <p><a href="/da/guider/kinaskak-online-med-venner">Kinaskak online med venner</a></p>
      <p><a href="/da/guider/kinaskak-for-tre-spillere">Kinaskak for 3 spillere</a></p>
    </section>`;

export default {
  nav: "Kinaskak for 2 spillere",
  titel: "Regler for kinaskak med 2 spillere | Leapstone",
  beschrijving: "Regler for kinaskak med 2 spillere og sådan spiller man det: 10 brikker hver, rød går først, og den første i mål vinder. Spil gratis.",
  h1: "Kinaskak for 2 spillere",
  intro: "Sådan spiller man kinaskak for 2: hver spiller har 10 brikker i hver sin spids af stjernen, rød går først, og den første, der flytter alle 10 brikker over i den modsatte spids, vinder. I dit træk flytter du én brik: ét skridt eller en kæde af hop.",
  inhoud,
};
