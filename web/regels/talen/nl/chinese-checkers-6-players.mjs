// De gids Chinees dammen met zes spelers (taak 302): /nl/chinees-dammen-zes-spelers.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Nederlands. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Zo begint het potje</h2>
      <p>Elke speler heeft 10 stenen, en alle 6 punten van de ster worden gebruikt. Zo staan er 60 stenen op het bord van 121 plekken. De 61 plekken in het midden zijn aan het begin leeg.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Het Sterbord met 10 stenen in elk van de 6 punten, in 6 kleuren",
  tekst: "6 spelers, 6 punten, 60 stenen.",
})}
      <p>Speler 1, rood, begint, vanuit de onderste punt. Daarna gaat de beurt van Speler 1 naar Speler 6, en na Speler 6 is Speler 1 weer aan de beurt. De spelers zijn genummerd in de volgorde van hun punten rond de ster, dus de speler na jou begint altijd in de punt naast die van jou. Een zet is één stap of een reeks sprongen met één steen. Stappen en sprongen staan in de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Elk doel is aan het begin vol</h2>
      <p>Je wint als je alle 10 stenen hebt verplaatst naar de punt aan de overkant van het bord. Bij 6 spelers is dat de punt waar de speler tegenover jou begint, dus geen enkel doel is leeg: elk doel begint vol met de stenen van een andere speler. Voor rood is het doel de bovenste punt, waar Speler 4 begint.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Het Sterbord met 6 volle punten. Een gestippelde ring markeert de bovenste punt, het doel van de rode speler, vol met de stenen van de speler aan de overkant.",
  tekst: "Het doel van rood is de punt aan de overkant, vol met de stenen van Speler 4.",
})}
      <p>Je kunt alleen op een lege plek landen, dus de speler tegenover jou moet zijn punt verlaten voordat jij die kunt vullen, en jij moet de jouwe verlaten voordat die speler de zijne kan vullen. In een potje voor 2 is dat alles. Bij 6 moeten jullie allebei ook nog door de drukte van de 4 anderen heen.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Een druk midden</h2>
      <p>Elk doel ligt aan de overkant van het bord, en de punten zijn alleen via het midden met elkaar verbonden, dus alle 60 stenen moeten over dezelfde 61 plekken. Aan het begin heeft nog niemand overgestoken, en het midden loopt snel vol.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Een rode steen springt in één zet drie keer: over een blauwe steen, dan over een groene steen en dan over een paarse steen. De cijfers 1, 2 en 3 markeren de landingsplekken.",
  tekst: "Stenen van elke kleur zijn opstapjes.",
})}
      <p>Je mag over een steen van elke kleur springen. Stenen van 5 andere spelers zijn opstapjes voor jou, en die van jou zijn opstapjes voor alle 5. Een rij stenen die je in het midden laat staan, is een ladder voor iedereen die erbij kan, en de speler na jou mag als eerste.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokkeren met 5 tegenstanders</h2>
      <ul>
        <li><strong>Vul de landingsplek:</strong> een sprong heeft een lege plek vlak achter de steen nodig. Zet je daar een steen neer, dan is de sprong weg voor elke speler die hem wilde maken.</li>
        <li><strong>Pas op voor de ladders die je bouwt:</strong> na jouw zet zijn de andere 5 spelers aan de beurt voordat jij weer mag. Een ladder helpt ze allemaal.</li>
        <li><strong>Iedereen kan een doel blokkeren:</strong> een steen van een andere speler in jouw doel houdt je tegen om af te maken, niet alleen een steen van de speler aan de overkant. Alle 10 plekken van het doel moeten je eigen stenen bevatten.</li>
      </ul>
      <p>In de <a href="/nl/chinees-dammen-strategie">tips voor strategie</a> zie je hoe een geblokkeerde sprong eruitziet, en hoe je geen steen van een andere speler in je eigen doel opsluit.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Hoe lang een potje duurt</h2>
      <p>Bij een potje voor 6 moeten 60 stenen worden verplaatst, en tussen een zet van jou en de volgende doen de andere 5 spelers er elk één. Het potje is ook niet afgelopen als de eerste speler klaar is.</p>
      <ul>
        <li><strong>Winnen, en doorspelen:</strong> de eerste speler die het doel vol heeft, wint, en de anderen spelen door voor de volgende plaatsen. Een speler die klaar is, wordt overgeslagen, en zijn stenen blijven als opstapjes op het bord staan. Het potje is voorbij als nog maar één speler meespeelt.</li>
        <li><strong>Opgeven:</strong> je stenen gaan van het bord, dus ze blokkeren of helpen niemand meer, en de anderen spelen door.</li>
        <li><strong>Tijd (online):</strong> in een online potje heeft elke zet een tijdslimiet, ingesteld door de speler die het potje start: 15 seconden, 30 seconden, 1 minuut, 2 minuten of geen limiet. Een ronde van 6 zetten duurt hooguit 6 keer de limiet, dus met 30 seconden is dat hooguit 3 minuten. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op, en het potje gaat zonder jou door.</li>
      </ul>
      <p>Voor een potje met minder spelers lees je <a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Waar je met 6 spelers speelt in Leapstone</h2>
      <ul>
        <li><strong>Tegen de computer, nu meteen:</strong> open <a href="/play/">Leapstone in je browser</a>, tik op Computer en kies het Sterbord en 5 computers. Je bent Speler 1, dus je begint. De computers zetten na elkaar, elk met een korte pauze, zodat je elke zet kunt volgen. Je kiest Makkelijk, Normaal of Moeilijk voor de computers.</li>
        <li><strong>Op één telefoon:</strong> tik op Spelen, kies het Sterbord en 6 spelers, en tik dan op een steen om die plek te wisselen tussen een persoon en een computer.</li>
        <li><strong>Online met vrienden:</strong> tik op Vrienden, kies het Sterbord, 6 spelers en de tijd per zet, en stuur de uitnodigingslink. Het potje begint als alle 6 plekken bezet zijn.</li>
        <li><strong>Snelle potjes:</strong> Online spelen zoekt potjes voor 2 of 4 spelers, dus er is geen snel potje voor 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinees dammen met zes spelers",
  titel: "Chinees dammen met 6: het volle bord | Leapstone",
  beschrijving: "Zo werkt Chinees dammen met 6 spelers: een volle ster van 60 stenen, een druk midden, blokkeren, hoe lang een potje duurt en waar je het speelt.",
  h1: "Chinees dammen met zes spelers",
  intro: "Zo werkt een potje voor 6: alle 6 punten zijn vol, je racet naar de punt aan de overkant van het bord, en het potje gaat door nadat de eerste speler klaar is.",
  inhoud,
};
