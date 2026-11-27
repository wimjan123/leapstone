// De gids Chinees dammen met 4 spelers (taak 301, feature 294): /nl/chinees-dammen-vier-spelers.
// Inhoud: de Engelse gids ../en/chinese-checkers-4-players.mjs, zin voor zin in het Nederlands. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 301. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Zo is het bord verdeeld</h2>
      <p>Elke speler heeft 10 stenen, dus er staan 40 stenen op het bord van 121 plekken. De vier beginpunten zijn twee paren punten die naast elkaar liggen: rood onderaan en blauw linksonder, groen bovenaan en geel rechtsboven.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Het Sterbord met 10 rode stenen in de onderste punt, 10 blauwe stenen in de punt linksonder, 10 groene stenen in de bovenste punt en 10 gele stenen in de punt rechtsboven. De punten linksboven en rechtsonder zijn leeg.",
  tekst: "Rood onderaan, blauw linksonder, groen bovenaan, geel rechtsboven.",
})}
      <p>Speler 1, rood, begint. Daarna is blauw speler 2, groen speler 3 en geel speler 4, en na geel is rood weer aan de beurt. Een zet is één stap of een reeks sprongen met één steen. Stappen en sprongen staan in de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Wie tegenover wie staat</h2>
      <p>De punten staan in paren tegenover elkaar: rood tegenover groen en blauw tegenover geel. Jouw doel is de punt aan de overkant. Rood gaat naar waar groen begint, groen naar waar rood begint, blauw naar waar geel begint en geel naar waar blauw begint.</p>
      <p>Net als bij een potje voor 2 is elk doel aan het begin vol met de stenen van de speler tegenover je, dus je kunt er pas landen als die weg zijn. Bij 3 spelers zijn de doelen aan het begin leeg, dus bij 4 kan niemand meteen klaar zijn. De vier doelen zijn vier verschillende punten, dus niemand anders wil jouw doel: een speler die klaar is, houdt niemand tegen.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">De twee lege punten</h2>
      <p>De punten linksboven en rechtsonder bevatten geen stenen. Het is van niemand een begin en van niemand een doel. Linksboven ligt tussen blauw en groen, en rechtsonder tussen geel en rood.</p>
      <p>Je mag naar elke lege plek stappen of springen, dus je kunt deze punten oversteken of er stoppen. Een steen daar staat nog niet in een doel. Er valt in een leeg punt niets over te springen, totdat iemand er stenen brengt.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Wat verandert er in je tactiek</h2>
      <ul>
        <li><strong>Twee oversteken tegelijk:</strong> rood en groen steken het bord naar elkaar toe over, en blauw en geel ook. Beide lijnen lopen door het midden, dus het midden is drukker dan bij een potje voor 2, waar maar één lijn oversteekt.</li>
        <li><strong>Drie spelers zetten tussen je beurten:</strong> het bord verandert tussen twee zetten van jou meer dan bij een potje voor 2. Kijk er aan het begin van elke beurt opnieuw naar en plan dan je reeks sprongen. De speler die na jou zet, is nooit degene die tegenover je staat.</li>
        <li><strong>Stenen helpen iedereen:</strong> elke steen van de andere drie is een opstapje voor jou, en de jouwe zijn opstapjes voor hen. De stenen van de speler tegenover je gaan de andere kant op, net als bij een potje voor 2.</li>
        <li><strong>Ruimte om eromheen te gaan:</strong> als het midden vol is, zijn de lege punten open ruimte naast de kampen. Een route door zo'n punt kan een weg om de drukte heen zijn.</li>
        <li><strong>Een speler die opgeeft, maakt je doel vrij:</strong> als de speler tegenover je opgeeft, gaan zijn stenen van het bord, dus je doel is meteen leeg.</li>
      </ul>
      <p>De <a href="/nl/chinees-dammen-strategie">tips voor strategie</a> over ladders, achterblijvers en het doel van achteren vullen zijn met 4 spelers hetzelfde.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winnen, en wat daarna gebeurt</h2>
      <ul>
        <li><strong>Winnen:</strong> wie als eerste het doel vol heeft met alle 10 stenen, wint. Het potje stopt dan niet: de andere drie spelen door voor de volgende plaatsen, en een speler die klaar is, wordt overgeslagen. De stenen van die speler blijven op het bord. Het potje is afgelopen als nog maar één speler meespeelt.</li>
        <li><strong>Opgeven:</strong> je stenen gaan van het bord en de andere drie spelen door. Geven de anderen ook op, dan wint de laatste speler die overblijft.</li>
        <li><strong>Tijd (online):</strong> in een online potje heeft elke zet een tijdslimiet. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op, en het potje gaat zonder jou door.</li>
      </ul>
      <p>Voor de potjes met minder spelers lees je <a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met 2 spelers</a>. De <a href="/nl/chinees-dammen">pagina met spelregels</a> heeft plaatjes van elke beginopstelling.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Waar je met 4 spelers speelt in Leapstone</h2>
      <ul>
        <li><strong>Tegen de computer, nu meteen:</strong> open <a href="/play/">Leapstone in je browser</a>, tik op Computer, kies het Sterbord en 3 computers. Je bent speler 1, dus je begint. Je kiest Makkelijk, Normaal of Moeilijk voor de computers.</li>
        <li><strong>Op één telefoon:</strong> tik op Spelen, kies het Sterbord en 4 spelers, en tik dan op een steen om die plek te wisselen tussen een mens en een computer.</li>
        <li><strong>Online met vrienden:</strong> tik op Vrienden, kies het Sterbord, 4 spelers en de tijd per zet, en stuur de uitnodigingslink. Het potje begint als alle 4 plekken bezet zijn.</li>
        <li><strong>Snel potje, in de app:</strong> tik op Online spelen. Terwijl de app zoekt naar een potje voor 2, tik je op Zoek 4 of 6 spelers om een potje voor 4 te zoeken. Elke zet duurt 30 seconden. Doen er binnen 20 seconden te weinig spelers mee, dan vullen computerspelers de lege plekken, dus sommige tegenstanders kunnen computerspelers zijn.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinees dammen met 4 spelers",
  titel: "Chinees dammen met 4: opstelling en tips | Leapstone",
  beschrijving: "Zo werkt Chinees dammen met 4 spelers: hoe het bord is verdeeld, welke 2 punten leeg blijven, wie tegenover wie staat, je tactiek en waar je speelt.",
  h1: "Chinees dammen met 4 spelers",
  intro: "Met 4 spelers begint ieder van jullie in een van vier punten van de ster, en twee punten blijven leeg. Rood staat tegenover groen en blauw tegenover geel: jouw doel is de punt aan de overkant, vol met de stenen van die speler. Hier lees je de opstelling, de lege punten, de tactiek en waar je het kunt spelen.",
  inhoud,
};
