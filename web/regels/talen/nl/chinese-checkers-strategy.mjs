// De gids Chinees dammen: strategie (taak 133): /nl/chinees-dammen-strategie.
// Inhoud: de Engelse gids ../en/chinese-checkers-strategy.mjs, zin voor zin in het Nederlands. Elke tip is nagelopen tegen
// crates/halma-core (zie docs/plan.md, taak 122); de plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs.
// Verander je een tip, verander dan beide.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Waar deze tips op rusten</h2>
      <p>De tips volgen uit de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a> zoals Leapstone ze speelt: een zet is één stap of een reeks sprongen, en je kunt over een steen van elke kleur springen. Het is geen bewijs van het beste spel. Tegen de computer spelen is de snelste manier om ze te proberen.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Bouw ladders</h2>
      <p>Een ladder is een rij stenen met steeds één lege plek ertussen. Een steen aan het ene eind springt in één zet langs de hele rij, dus hij steekt het bord over in één beurt in plaats van één plek per beurt.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Vier stenen op een schuine rij met steeds een lege plek ertussen. Een rode steen aan het ene eind springt over alle vier, met vier genummerde landingsplekken.",
  tekst: "Vier sprongen in één zet. Dezelfde steen kon anders maar één plek per keer stappen.",
})}
      <p>Een sprong werkt in alle zes de richtingen, ook achteruit, dus een ladder hoeft niet in je eigen punt te beginnen. Elke rij stenen met gaten ertussen is goed.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Houd je stenen bij elkaar</h2>
      <p>Je hebt alle 10 stenen in je doel nodig, dus je laatste steen bepaalt wanneer je klaar bent. Een steen zonder steen naast zich heeft niets om overheen te springen, en kan alleen stappen.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Een Sterbord met een rode steen alleen in de onderste punt. Alleen de twee lege buren van die steen zijn gemarkeerd. Andere rode en blauwe stenen staan in het midden.",
  tekst: "Deze steen heeft geen buur, dus hij kan alleen naar de twee gemarkeerde plekken stappen.",
})}
      <p>Van de punt van je eigen hoek naar de punt van het doel aan de overkant van het bord zijn het 16 stappen. Dat zijn 16 beurten voor één steen die alleen is, terwijl een ladder het in één beurt doet. Verplaats de stenen achteraan zolang er nog stenen omheen staan om overheen te springen. De computer in Leapstone doet dit ook: hij geeft zetten met zijn achterste stenen een iets hogere score.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Gebruik het midden</h2>
      <p>Een steen in het midden van het bord heeft zes buren, dus hij kan in alle zes de richtingen stappen of springen. Een steen aan de rand heeft er minder. De steen aan de rand op het plaatje heeft er vier.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Een Sterbord met een rode steen in het midden met zes gemarkeerde buren, en een rode steen bij de rand linksboven met vier gemarkeerde buren.",
  tekst: "Zes manieren om te stappen in het midden, vier aan de rand.",
})}
      <p>Stenen in het midden geven ook de andere stenen iets om overheen te springen op hun weg over het bord.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Vul het doel van achteren</h2>
      <p>Je doel is een driehoek van 10 plekken, in rijen van 4, 3, 2 en 1. De plekken achteraan zijn alleen te bereiken via de plekken ervoor. Vul je eerst de voorkant, dan heeft de laatste steen misschien geen weg meer naar binnen.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "De doelpunt bovenaan met negen rode stenen en één lege plek helemaal achteraan, aangegeven met streepjes. Een tiende rode steen, met een witte ring, staat onder de voorste rij.",
  tekst: "Negen stenen zijn thuis, en de plek achteraan is leeg. De tiende steen heeft geen zet ernaartoe.",
})}
      <p>Zet de eerste stenen op de plekken achteraan en werk naar voren, zodat de voorkant open blijft voor de stenen die als laatste aankomen.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Sluit geen steen in je doel op</h2>
      <p>Je mag stoppen in de punt van een andere speler, dus een steen van de andere speler kan in jouw doel terechtkomen. Je wint pas als op alle 10 plekken van je doel je eigen stenen staan. Heeft die steen geen zet, dan kan niemand hem verplaatsen, en kun je niet winnen tot er een plek naast hem vrijkomt.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "De doelpunt bovenaan met negen rode stenen en één blauwe steen helemaal achteraan, aangegeven met een witte ring. De blauwe steen is omringd door rode stenen.",
  tekst: "De blauwe steen achteraan heeft geen zet, en rood kan het doel niet vullen.",
})}
      <p>Laat een plek naast zo&rsquo;n steen open, zodat hij weg kan. De computer in Leapstone houdt hier rekening mee: een zet die een steen van een andere speler in zijn doel opsluit, krijgt een lagere score. De regels dwingen niemand om uit jouw doel te gaan, dus de andere speler kan er ook met opzet een steen neerzetten.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blokkeer een sprong, of laat hem</h2>
      <p>Een sprong heeft een lege plek nodig om op te landen. Vul die plek en de sprong is weg. Twee stenen achter elkaar kun je ook niet overspringen.</p>
      <p>Jouw stenen zijn ook opstapjes voor de andere speler. Op het linkerplaatje steekt blauw in één zet twee rode stenen over. Rechts heeft rood één steen naar de eerste landingsplek gezet, en kan blauw alleen stappen.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Een blauwe steen met twee rode stenen op een rij, elk met een lege plek erachter. Pijlen laten twee sprongen van de blauwe steen zien.",
          tekst: "Ervoor: blauw kan twee sprongen maken.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Dezelfde rij nadat rood zijn verste steen naar de eerste landingsplek heeft gezet. Op de blauwe steen volgen twee rode stenen achter elkaar.",
          tekst: "Erna: rood heeft één steen verplaatst. Blauw kan niet springen.",
        })}
      </div>
      <p>Een zet die je aan blokkeren besteedt, is een zet die je niet aan je eigen vooruitgang besteedt. Blokkeer dus als de sprong de andere speler meer oplevert dan jouw zet jou. Andersom werkt het ook als je een ladder bouwt: na jouw zet is de andere speler als eerste aan de beurt, dus een steen van hem aan het ene eind gebruikt jouw ladder eerder dan jij. Op het moeilijkste niveau kijkt de computer naar het beste antwoord van elke tegenstander voordat hij een zet kiest.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Ga verder</h2>
      <ul>
        <li><a href="/play/">Speel tegen de computer in je browser</a> en probeer een ladder.</li>
        <li><a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>: zo werkt een potje voor twee.</li>
        <li><a href="/nl/chinees-dammen">Spelregels van Chinees dammen</a>, met plaatjes van stappen, sprongen en reeksen.</li>
      </ul>
      <p><a href="/nl/chinees-dammen-online-met-vrienden">Chinees dammen online met vrienden</a></p>
      <p><a href="/nl/halma-of-chinees-dammen">Halma of Chinees dammen</a></p>
      <p><a href="/nl/chinees-dammen-drie-spelers">Chinees dammen met drie spelers</a></p>
    </section>`;

export default {
  nav: "Chinees dammen: strategie",
  titel: "Chinees dammen: strategie, 6 tips met plaatjes | Leapstone",
  beschrijving: "Strategie voor Chinees dammen: bouw ladders, houd je stenen bij elkaar, gebruik het midden, vul je doel van achteren en blokkeer sprongen.",
  h1: "Chinees dammen: strategie",
  intro: "Zes tips voor het Sterbord, elk met een plaatje uit de echte regels: ladders, achterblijvers, het midden, je doel vullen en sprongen blokkeren.",
  inhoud,
};
