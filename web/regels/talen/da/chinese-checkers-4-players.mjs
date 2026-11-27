// Den danske guide Kinaskak for 4 spillere (opgave 301, feature 294): /da/guider/kinaskak-for-4-spillere.
// Indhold: den engelske guide ../en/chinese-checkers-4-players.mjs, sætning for sætning på dansk (regler fra crates/halma-core, se docs/plan.md, opgave 301).
// Den, der ændrer en regel, ændrer den i alle sprog.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Sådan er brættet delt</h2>
      <p>Hver spiller har 10 brikker, så 40 brikker står på et bræt med 121 felter. De fire startspidser er to par af spidser ved siden af hinanden: rød nederst og blå nederst til venstre, grøn øverst og gul øverst til højre.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Stjernebrættet med 10 røde brikker i den nederste spids, 10 blå brikker i spidsen nederst til venstre, 10 grønne brikker i den øverste spids og 10 gule brikker i spidsen øverst til højre. Spidserne øverst til venstre og nederst til højre er tomme.",
  tekst: "Rød nederst, blå nederst til venstre, grøn øverst, gul øverst til højre.",
})}
      <p>Spiller 1, rød, går først. Derefter er blå spiller 2, grøn er spiller 3, gul er spiller 4, og efter gul er det rød igen. Et træk er ét skridt eller en kæde af hop med én brik. Se <a href="/da/regler/kinaskak">reglerne for kinaskak</a> for skridt og hop.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hvem står over for hvem</h2>
      <p>Spidserne danner par hen over brættet: rød står over for grøn, og blå over for gul. Dit mål er spidsen lige over for dig. Rød går til, hvor grøn starter, grøn til, hvor rød starter, blå til, hvor gul starter, og gul til, hvor blå starter.</p>
      <p>Som i et spil for 2 starter hvert mål fuldt af brikkerne fra spilleren over for dig, så du kan først lande der, når de er væk. Med 3 spillere starter målene tomme, så med 4 kan ingen blive færdig med det samme. De fire mål er fire forskellige spidser, så ingen andre vil have dit mål: en spiller, der er færdig, blokerer aldrig nogen.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">De to tomme spidser</h2>
      <p>Spidserne øverst til venstre og nederst til højre har ingen brikker. De er ingens start og ingens mål. Den øverst til venstre ligger mellem blå og grøn, og den nederst til højre mellem gul og rød.</p>
      <p>Du må gå eller hoppe til ethvert tomt felt, så du kan krydse disse spidser eller stoppe i dem. En brik dér er dog ikke i et mål endnu. Der er intet at hoppe over i en tom spids, før nogen bringer brikker dertil.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Hvad der ændrer sig i din taktik</h2>
      <ul>
        <li><strong>To krydsninger på én gang:</strong> rød og grøn krydser brættet mod hinanden, og det gør blå og gul også. Begge linjer går gennem midten, så midten er travlere end i et spil for 2, hvor kun én linje krydser.</li>
        <li><strong>Tre spillere flytter mellem dine ture:</strong> brættet ændrer sig mere mellem to af dine træk end i et spil for 2. Kig på det igen i starten af hver tur, og planlæg så din kæde af hop. Spilleren, der flytter efter dig, er aldrig den, der står over for dig.</li>
        <li><strong>Brikker hjælper alle:</strong> hver brik fra de tre andre er en trædesten for dig, og dine er trædesten for dem. Brikkerne fra spilleren over for dig bevæger sig den modsatte vej, som i et spil for 2.</li>
        <li><strong>Plads til at gå udenom:</strong> hvis midten er fuld, er de tomme spidser åbent rum ved siden af startspidserne. En rute gennem en af dem kan være en vej uden om trængslen.</li>
        <li><strong>En spiller, der giver op, frigør dit mål:</strong> når spilleren over for dig giver op, forlader deres brikker brættet, så dit mål er tomt med det samme.</li>
      </ul>
      <p><a href="/da/guider/kinaskak-strategi">Strategitipsene</a> om stiger, efternølere og at fylde målet bagfra er de samme med 4 spillere.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">At vinde, og hvad der sker bagefter</h2>
      <ul>
        <li><strong>Vinde:</strong> Den første spiller, der fylder målet med alle 10 brikker, vinder. Spillet stopper ikke her: de tre andre spiller videre om de næste pladser, og spilleren, der er færdig, bliver sprunget over. Den spillers brikker bliver på brættet. Spillet er slut, når kun én spiller stadig spiller.</li>
        <li><strong>Give op:</strong> Dine brikker forlader brættet, og de tre andre spiller videre. Hvis de andre også giver op, vinder den sidste spiller, der er tilbage.</li>
        <li><strong>Tid (online):</strong> I et onlinespil har hvert træk en tidsgrænse. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op, og spillet fortsætter uden dig.</li>
      </ul>
      <p>For spil med færre spillere kan du læse <a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>. <a href="/da/regler/kinaskak">Regelsiden</a> har billeder af alle starter.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 4 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mod computeren, lige nu:</strong> Åbn <a href="/play/">Leapstone i din browser</a>, tryk på Computer, vælg stjernebrættet og 3 computere. Du er spiller 1, så du går først. Du vælger Let, Normal eller Svær til computerne.</li>
        <li><strong>På én telefon:</strong> Tryk på Spil, vælg stjernebrættet og 4 spillere, og tryk derefter på en brik for at skifte den plads mellem et menneske og en computer.</li>
        <li><strong>Online med venner:</strong> Tryk på Venner, vælg stjernebrættet, 4 spillere og tiden pr. træk, og send invitationslinket. Spillet starter, når alle 4 pladser er besat.</li>
        <li><strong>Hurtigt spil, i appen:</strong> Tryk på Spil online. Mens den søger efter et spil for 2, kan du trykke på Find 4 eller 6 spillere for i stedet at søge efter et spil for 4. Hvert træk har 30 sekunder. Hvis der ikke kommer nok spillere inden for 20 sekunder, fylder computerspillere de tomme pladser, så nogle modstandere kan være computerspillere.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaskak for 4 spillere",
  titel: "Kinaskak for 4 spillere: opstilling og tips | Leapstone",
  beschrijving: "Sådan fungerer kinaskak med 4 spillere: hvordan brættet er delt, hvilke 2 spidser der er tomme, hvem der står over for hvem, og hvor du kan spille.",
  h1: "Kinaskak for 4 spillere",
  intro: "Med 4 spillere starter hver af jer i en af stjernens fire spidser, og to spidser er tomme. Rød står over for grøn, og blå over for gul: dit mål er spidsen over for dig, fuld af den spillers brikker. Her er opstillingen, de tomme spidser, taktikken og hvor du kan spille det.",
  inhoud,
};
