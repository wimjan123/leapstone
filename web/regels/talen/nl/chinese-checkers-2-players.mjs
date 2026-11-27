// De gids Chinees dammen met twee spelers (taak 133): /nl/chinees-dammen-twee-spelers.
// Inhoud: de Engelse gids ../en/chinese-checkers-2-players.mjs, zin voor zin in het Nederlands. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 122. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Zo begint het potje</h2>
      <p>Elke speler heeft 10 stenen. Ze beginnen in twee punten van de ster die naar elkaar toe wijzen: rood onderaan, blauw bovenaan. De 20 stenen staan op een bord van 121 plekken.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Het Sterbord met 10 rode stenen in de onderste punt en 10 blauwe stenen in de bovenste punt",
  tekst: "Rood begint onderaan, blauw bovenaan.",
})}
      <p>Speler 1, rood, begint. Daarna zijn jullie om de beurt aan de beurt, elk één zet. Een zet is één stap of een reeks sprongen met één steen. Stappen en sprongen staan in de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Jouw doel is het begin van de ander</h2>
      <p>Je wint als je alle 10 stenen hebt verplaatst naar de punt waar de andere speler begon. Die punt staat aan het begin vol met zijn stenen, en de jouwe vol met de jouwe. Voor rood is dat de bovenste punt op het plaatje hierboven.</p>
      <p>Je kunt alleen op een lege plek landen, dus jullie moeten allebei je eigen punt verlaten voordat de ander die kan vullen. Geen van beiden kan winnen zolang er een steen van de ander in het doel blijft staan. En omdat jullie hetzelfde midden in tegengestelde richtingen oversteken, zijn de stenen van de ander een opstapje voor jou, en die van jou voor hem. Lees de <a href="/nl/chinees-dammen-strategie">tips voor strategie</a> over wat je daarmee doet.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Winnen en opgeven</h2>
      <ul>
        <li><strong>Winnen:</strong> wie als eerste het doel vol heeft met alle 10 stenen, wint, en het potje is meteen afgelopen. De andere speler speelt niet door.</li>
        <li><strong>Opgeven:</strong> je stenen gaan van het bord en de andere speler wint.</li>
        <li><strong>Tijd (online):</strong> in een online potje heeft elke zet een tijdslimiet. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Zo verschillen 3, 4 en 6 spelers</h2>
      <ul>
        <li><strong>3 spelers:</strong> de stenen beginnen in om de andere punt, en de drie doelen zijn aan het begin leeg. De eerste speler die klaar is, wint; de anderen spelen door voor de volgende plaatsen, en een speler die klaar is, wordt overgeslagen.</li>
        <li><strong>4 spelers:</strong> twee paren punten die naast elkaar liggen. Jouw doel is aan het begin vol met de stenen van een andere speler. Het potje gaat door na de eerste die klaar is, net als bij 3.</li>
        <li><strong>6 spelers:</strong> alle zes de punten. Er staan 60 stenen op het bord, tegen 20 bij 2 spelers.</li>
      </ul>
      <p>Met maar 20 stenen op het bord zijn er minder stenen om overheen te springen, dus de ladders die je zelf bouwt tellen zwaarder. De <a href="/nl/chinees-dammen">pagina met spelregels</a> heeft plaatjes van elke beginopstelling.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Waar je met 2 spelers speelt in Leapstone</h2>
      <ul>
        <li><strong>Tegen de computer, nu meteen:</strong> open <a href="/play/">Leapstone in je browser</a>, tik op Computer en kies het Sterbord. Eén computer is de standaard, dus dat is een potje voor 2. Je kiest Makkelijk, Normaal of Moeilijk, en je bent speler 1, dus je begint. Makkelijk kiest de beste van drie willekeurige zetten. Normaal kiest de zet die het meeste vooruitgang naar het doel geeft. Moeilijk kijkt ook naar hoe de tegenstanders kunnen antwoorden en naar de eigen volgende zet.</li>
        <li><strong>Online spelen, in de app:</strong> een snel potje op het Sterbord voor 2 spelers, tegen een andere speler van jouw niveau, met 30 seconden per zet. Sommige online tegenstanders kunnen computerspelers zijn.</li>
        <li><strong>Met een vriend:</strong> stuur een uitnodigingslink, en stel zelf de tijd per zet in. Of geef één telefoon heen en weer.</li>
      </ul>
      <p><a href="/nl/chinees-dammen-online-met-vrienden">Chinees dammen online met vrienden</a></p>
      <p><a href="/nl/chinees-dammen-drie-spelers">Chinees dammen met drie spelers</a></p>
    </section>`;

export default {
  nav: "Chinees dammen met twee spelers",
  titel: "Chinees dammen met 2: opstelling en regels | Leapstone",
  beschrijving: "Zo werkt Chinees dammen met 2 spelers: waar de 10 stenen beginnen, wie begint, hoe je wint of opgeeft, en waar je het gratis speelt.",
  h1: "Chinees dammen met twee spelers",
  intro: "Zo werkt een potje voor twee op het Sterbord: de opstelling, wie begint, hoe je wint en waar je het kunt spelen.",
  inhoud,
};
