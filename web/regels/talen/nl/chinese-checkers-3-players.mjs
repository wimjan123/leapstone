// De gids Chinees dammen met drie spelers (taak 299): /nl/chinees-dammen-drie-spelers.
// Inhoud: de Engelse gids ../en/chinese-checkers-3-players.mjs, zin voor zin in het Nederlands. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 139. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Zo begint het potje</h2>
      <p>Elke speler heeft 10 stenen, dus er staan 30 stenen op een bord van 121 plekken. Ze beginnen in om de andere punt van de ster: rood onderaan, blauw linksboven en groen rechtsboven. De drie punten ertussen zijn leeg.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Het Sterbord met 10 rode stenen in de onderste punt, 10 blauwe stenen in de punt linksboven en 10 groene stenen in de punt rechtsboven",
  tekst: "Rood onderaan, blauw linksboven, groen rechtsboven.",
})}
      <p>Speler 1, rood, begint. Daarna is blauw speler 2, groen speler 3, en na groen is rood weer aan de beurt. Een zet is één stap of een reeks sprongen met één steen. Stappen en sprongen staan in de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Drie doelen, alle leeg aan het begin</h2>
      <p>Jouw doel is de punt tegenover waar je begon, en met 3 spelers is die aan het begin leeg. Het is de lege punt tussen de beginpunten van de twee andere spelers: het doel van rood is bovenaan, dat van blauw rechtsonder en dat van groen linksonder.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Het Sterbord voor drie spelers. Gestippelde cirkels in de kleur van elke speler tonen de drie lege doelen: rood bovenaan, blauw rechtsonder, groen linksonder.",
  tekst: "Elk doel heeft de kleur van zijn speler.",
})}
      <p>Je wint als je alle 10 stenen in je doel hebt gezet. Alle 10 plekken moeten stenen van jezelf bevatten. Niemand begint in jouw doel, maar je mag op elke lege plek blijven staan, dus een steen van een andere speler kan er later landen. Zolang die daar staat, kun je niet winnen.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winnen, en wat daarna gebeurt</h2>
      <ul>
        <li><strong>Winnen:</strong> de eerste speler die het doel vult, wint. Het potje stopt daar niet: de andere twee spelen door voor de volgende plaatsen, en de speler die klaar is, wordt overgeslagen. Het potje is afgelopen als nog maar één speler meespeelt.</li>
        <li><strong>Opgeven:</strong> je stenen gaan van het bord en de andere twee spelen door. Geeft een tweede speler op voordat iemand klaar is, dan wint de laatste speler die overblijft.</li>
        <li><strong>Tijd (online):</strong> in een online potje heeft elke zet een tijdslimiet, die de speler instelt die het potje begint. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op, en het potje gaat zonder jou verder.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Zo verschilt het van een potje voor 2</h2>
      <ul>
        <li><strong>Meer stenen:</strong> 30 op het bord, tegen 20 met 2 spelers.</li>
        <li><strong>Lege doelen:</strong> met 2 spelers is jouw doel aan het begin vol met stenen van de andere speler. Met 3 is het leeg.</li>
        <li><strong>Twee tegenstanders:</strong> na jouw zet doen twee andere spelers een zet voordat je weer aan de beurt bent. De stenen van allebei zijn opstapjes voor jou, en die van jou voor hen. Een ladder die je bouwt, kunnen beiden gebruiken, en de speler na jou mag als eerste.</li>
        <li><strong>Het potje gaat door:</strong> met 2 spelers is het potje afgelopen als een van jullie klaar is. Met 3 gaat het door voor de tweede en derde plaats.</li>
      </ul>
      <p>Over het potje met twee lees je <a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>. De <a href="/nl/chinees-dammen-strategie">tips voor strategie</a> gaan over stappen en sprongen, en die zijn met 3 spelers hetzelfde.</p>
      <p><a href="/nl/chinees-dammen-online-met-vrienden">Chinees dammen online met vrienden</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Waar je met 3 spelers speelt in Leapstone</h2>
      <ul>
        <li><strong>Tegen de computer, nu meteen:</strong> open <a href="/play/">Leapstone in je browser</a>, tik op Computer, kies het Sterbord en 2 computers. Je bent speler 1, dus je begint. Je kiest Makkelijk, Normaal of Moeilijk voor de computers.</li>
        <li><strong>Op één telefoon:</strong> tik op “Op deze telefoon”, kies het Sterbord en 3 spelers, en tik dan op een steen om die plek te wisselen tussen een persoon en een computer.</li>
        <li><strong>Online met vrienden:</strong> tik op Vrienden, kies het Sterbord, 3 spelers en de tijd per zet, en stuur de uitnodigingslink. Het potje begint als alle 3 de plekken bezet zijn.</li>
        <li><strong>Snelle potjes:</strong> Online spelen zoekt potjes voor 2 of 4 spelers, dus er is geen snel potje voor 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinees dammen met drie spelers",
  titel: "Chinees dammen met 3: opstelling en regels | Leapstone",
  beschrijving: "Zo werkt Chinees dammen met 3 spelers: waar de 30 stenen beginnen, welke lege punt elk doel is, wie begint en hoe je wint.",
  h1: "Chinees dammen met drie spelers",
  intro: "Zo werkt een potje voor drie op het Sterbord: de opstelling, de drie doelen, wie begint, hoe je wint en waar je het kunt spelen.",
  inhoud,
};
