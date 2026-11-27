// Den danske guide Kinaskak for 6 spillere (opgave 302). Teksten følger ../en/chinese-checkers-6-players.mjs sætning for sætning.
// Reglerne kommer fra crates/halma-core (Board::star med start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) og tidsgrænsen fra "Techniek".
// Se docs/plan.md, opgave 302, for kontrollen pr. påstand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Sådan starter spillet</h2>
      <p>Hver spiller har 10 brikker, og alle 6 spidser af stjernen er i brug. Det giver 60 brikker på et bræt med 121 felter. De 61 felter i midten er tomme i starten.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Stjernebrættet med 10 brikker i hver af de 6 spidser, i 6 farver",
  tekst: "6 spillere, 6 spidser, 60 brikker.",
})}
      <p>Spiller 1, rød, går først, fra den nederste spids. Derefter går turen fra Spiller 1 til Spiller 6, og efter Spiller 6 er det Spiller 1 igen. Spillerne er nummereret i rækkefølgen af deres spidser rundt om stjernen, så spilleren efter dig altid starter i spidsen ved siden af din. Et træk er ét skridt eller en kæde af hop med én brik. Se <a href="/da/regler/kinaskak">reglerne for kinaskak</a> for skridt og hop.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hvert mål er fuldt i starten</h2>
      <p>Du vinder ved at flytte alle 10 af dine brikker ind i spidsen på den anden side af brættet. Med 6 spillere er det den spids, hvor spilleren overfor dig starter, så intet mål er tomt: hvert mål er i starten fuldt af en anden spillers brikker. For rød er målet den øverste spids, hvor Spiller 4 starter.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Stjernebrættet med 6 fyldte spidser. En stiplet ring markerer den øverste spids, den røde spillers mål, som rummer brikkerne fra spilleren overfor.",
  tekst: "Røds mål er spidsen overfor, fuld af Spiller 4's brikker.",
})}
      <p>Du kan kun lande på et tomt felt, så spilleren overfor skal forlade sin spids, før du kan fylde den, og du skal forlade din, før de kan fylde deres. I et spil for 2 er det alt, der er at sige. Med 6 skal begge desuden komme igennem mylderet af de 4 andre.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">En overfyldt midte</h2>
      <p>Hvert mål ligger på den anden side af brættet, og spidserne hænger kun sammen gennem midten, så alle 60 brikker skal krydse de samme 61 felter. I starten har ingen krydset endnu, og midten fyldes hurtigt.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "En rød brik hopper tre gange i ét træk: over en blå brik, derefter en grøn brik og så en lilla brik. Tallene 1, 2 og 3 markerer landingsfelterne.",
  tekst: "Brikker i alle farver er trædesten.",
})}
      <p>Du kan hoppe over en brik i en hvilken som helst farve. Brikker fra 5 andre spillere er trædesten for dig, og dine er trædesten for alle 5. En række brikker, som du lader stå i midten, er en stige for enhver, der kan nå den, og spilleren efter dig får første chance.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">At blokere med 5 modstandere</h2>
      <ul>
        <li><strong>Fyld landingsfeltet:</strong> Et hop kræver et tomt felt lige bag brikken. Når du flytter en brik derhen, er hoppet væk for alle spillere, der ville bruge det.</li>
        <li><strong>Pas på de stiger, du bygger:</strong> Efter dit træk flytter de andre 5 spillere, før det er din tur igen. En stige hjælper dem alle.</li>
        <li><strong>Enhver kan blokere et mål:</strong> En brik fra en hvilken som helst anden spiller i dit mål forhindrer dig i at blive færdig, ikke kun en brik fra spilleren overfor. Alle 10 felter i målet skal rumme dine egne brikker.</li>
      </ul>
      <p><a href="/da/guider/kinaskak-strategi">Strategitipsene</a> viser, hvordan et blokeret hop ser ud, og hvordan du undgår at spærre en anden spillers brik inde i dit eget mål.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Hvor længe et spil varer</h2>
      <p>I et spil for 6 er der 60 brikker at flytte, og mellem et af dine træk og det næste når de andre 5 spillere at flytte én gang hver. Spillet slutter heller ikke, når den første spiller bliver færdig.</p>
      <ul>
        <li><strong>Vind, og spil videre:</strong> Den første spiller, der fylder målet, vinder, og de andre spiller videre om de næste pladser. Spilleren, der er færdig, bliver sprunget over, og den spillers brikker bliver på brættet som trædesten. Spillet er slut, når kun én spiller stadig spiller.</li>
        <li><strong>Give op:</strong> Dine brikker forlader brættet, så de hverken blokerer eller hjælper nogen mere, og de andre spiller videre.</li>
        <li><strong>Tid (online):</strong> I et onlinespil har hvert træk en tidsgrænse, som den spiller, der starter spillet, bestemmer: 15 sekunder, 30 sekunder, 1 minut, 2 minutter eller ingen grænse. En runde med 6 træk tager højst 6 gange grænsen, så med 30 sekunder er det højst 3 minutter. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op, og spillet fortsætter uden dig.</li>
      </ul>
      <p>For et spil med færre spillere kan du læse <a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 6 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mod computeren, lige nu:</strong> Åbn <a href="/play/">Leapstone i din browser</a>, tryk på Computer, og vælg stjernebrættet og 5 computere. Du er Spiller 1, så du går først. Computerne flytter efter hinanden, hver med en kort pause, så du kan følge hvert træk. Du vælger Let, Normal eller Svær til computerne.</li>
        <li><strong>På én telefon:</strong> Tryk på Spil, vælg stjernebrættet og 6 spillere, og tryk derefter på en brik for at skifte den plads mellem en person og en computer.</li>
        <li><strong>Online med venner:</strong> Tryk på Venner, vælg stjernebrættet, 6 spillere og tiden pr. træk, og send invitationslinket. Spillet starter, når alle 6 pladser er taget.</li>
        <li><strong>Hurtige spil:</strong> Spil online finder spil for 2 eller 4 spillere, så der er intet hurtigt spil for 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaskak for 6 spillere",
  titel: "Kinaskak for 6 spillere: hele brættet | Leapstone",
  beschrijving: "Sådan fungerer kinaskak med 6 spillere: en fuld stjerne med 60 brikker, en overfyldt midte, blokering, hvor længe et spil varer og hvor du spiller.",
  h1: "Kinaskak for 6 spillere",
  intro: "Sådan fungerer et spil for 6: alle 6 spidser er fulde, du kæmper om spidsen overfor, og spillet fortsætter, efter den første spiller er færdig.",
  inhoud,
};
