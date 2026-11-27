// De Nederlandse spelregelpagina Halma (taak 133). Inhoud: de Engelse pagina ../en/halma.mjs (nagelopen tegen crates/halma-core,
// zie docs/plan.md, taak 117), zin voor zin in het Nederlands. Verander je een regel, verander dan beide.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 spelers: elk 19 stenen",
    alt: "Het vierkante bord met 19 rode stenen in de hoek linksboven en 19 blauwe stenen in de hoek rechtsonder",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 spelers: elk 13 stenen",
    alt: "Het vierkante bord met 13 stenen in elk van de vier hoeken: rood linksboven, blauw rechtsboven, groen rechtsonder en geel linksonder",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Het bord</h2>
      <p>Halma speel je op een vierkant bord van 16 bij 16 plekken, 256 in totaal. Elke plek heeft maximaal acht buren: de vier rechte en de vier schuine. Een plek aan de rand heeft er minder, en een hoek heeft er drie.</p>
      <p>Dit is het Vierkante bord in Leapstone. Ken je het spel op het Sterbord, lees dan over <a href="/nl/sternhalma">Sternhalma</a> en de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Zo beginnen de stenen</h2>
      <p>Halma is voor 2 of 4 spelers. Elke speler begint met zijn stenen in een kamp in een hoek van het bord. Het kamp in de hoek tegenover je is jouw doel.</p>
      <ul>
        <li><strong>2 spelers:</strong> elk 19 stenen, in twee hoeken die tegenover elkaar liggen. Het kamp bestaat uit vijf rijen van 5, 5, 4, 3 en 2 plekken.</li>
        <li><strong>4 spelers:</strong> elk 13 stenen, een kamp in elke hoek. Het kamp bestaat uit vier rijen van 4, 4, 3 en 2 plekken. Je doel is de hoek diagonaal aan de overkant van het bord.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Om de beurt</h2>
      <p>Speler 1 begint. Daarna gaat de beurt op volgorde verder, en na de laatste speler is speler 1 weer aan de beurt. In Leapstone horen de kleuren bij de nummers: rood, blauw, groen en geel.</p>
      <p>Als je aan de beurt bent, doe je één zet met één steen. Er wordt niets geslagen: stenen blijven op het bord staan tot hun speler opgeeft.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Een stap</h2>
      <p>Verplaats een steen naar een lege plek naast hem, in een van de acht richtingen: recht of schuin.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Een rode steen met een witte ring eromheen. Vijf van zijn acht buren zijn leeg en gemarkeerd; op de andere drie staat een steen.",
  tekst: "De rode steen kan naar de vijf gemarkeerde plekken stappen. De andere drie buren zijn bezet.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Een sprong</h2>
      <p>Spring over één steen naast de jouwe, van welke kleur ook, en land op de lege plek er recht achter. Je kunt in alle acht de richtingen springen, ook schuin en achteruit.</p>
      <ul>
        <li>De plek waar je landt, moet leeg zijn.</li>
        <li>Je kunt niet over twee stenen achter elkaar springen, en ook niet over een lege plek.</li>
        <li>De steen waar je overheen springt, blijft staan.</li>
        <li>Je kunt niet over de rand van het bord springen.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Een rode steen springt schuin over een blauwe steen naar de lege plek erachter, aangegeven met een pijl.",
  tekst: "De rode steen springt schuin over de blauwe steen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Een reeks sprongen</h2>
      <p>Na een sprong mag dezelfde steen nog een keer springen, zo vaak als hij kan, in elke richting, recht of schuin. Jij bepaalt waar je stopt. Alle sprongen samen zijn één zet.</p>
      <ul>
        <li>In één zet kun je niet twee keer op dezelfde plek landen.</li>
        <li>Een zet is één stap, of één of meer sprongen. Na een sprong mag je niet meer stappen.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Een rode steen maakt in één zet drie sprongen: schuin over een blauwe steen, recht over een andere blauwe steen en schuin over een rode steen. De drie landingsplekken hebben het nummer 1, 2 en 3.",
  tekst: "Eén zet met drie sprongen, in de volgorde van de nummers.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Het doel</h2>
      <p>Je wint als je al je stenen hebt verplaatst naar het kamp tegenover waar je begon. Op alle plekken van dat kamp moeten je eigen stenen staan: 19 bij 2 spelers, 13 bij 4 spelers. Zolang er een steen van een andere speler staat, kun je niet winnen.</p>
      <p>Je mag op elke lege plek landen, ook in de kampen van andere spelers. Een steen die in jouw doel staat, mag er weer uit; niets houdt hem vast.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Het vierkante bord voor twee spelers. Rood begint linksboven; het kamp rechtsonder, aangegeven met stippellijn-cirkels en met blauwe stenen erin, is het doel van rood.",
  tekst: "Bij 2 spelers is het doel van rood het kamp waar blauw begint.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Met 2 of 4 spelers</h2>
      <ul>
        <li><strong>2 spelers:</strong> wie als eerste het doel vol heeft, wint, en het potje is afgelopen.</li>
        <li><strong>4 spelers:</strong> wie als eerste het doel vol heeft, wint. De anderen spelen door voor de volgende plaatsen, en een speler die klaar is, wordt overgeslagen. Het potje is afgelopen als nog maar één speler meespeelt.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Opgeven</h2>
      <p>Als je opgeeft, gaan je stenen van het bord, zodat ze niemand meer in de weg staan. Bij 2 spelers wint de andere speler. Bij 4 spelers gaat het potje zonder jou door, en als iedereen op één speler na opgeeft, wint die laatste speler.</p>
      <p>In een online potje heeft elke zet een tijdslimiet. De speler die het potje start, stelt die in. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op. Potjes tegen de computer en op één telefoon hebben geen tijdslimiet.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bouw ladders.</strong> Zet stenen op een rij met steeds één lege plek ertussen, recht of schuin, in de richting van je doel. Eén steen kan dan in één zet langs de hele rij springen.</li>
        <li><strong>Elke steen is een ladder.</strong> Je kunt over elke kleur springen, dus de stenen van de andere spelers helpen jou ook. En jouw ladders helpen hen: kijk wat je achterlaat.</li>
        <li><strong>Gebruik de diagonalen.</strong> Het doel ligt in de hoek tegenover je, dus een schuine rij stenen is de snelste weg over het bord.</li>
        <li><strong>Vergeet de achterblijvers niet.</strong> Je hebt al je stenen thuis nodig. Een steen die ver achterligt en niets heeft om overheen te springen, gaat één plek per beurt vooruit. Haal hem erbij zolang de andere stenen nog om hem heen staan.</li>
        <li><strong>Jouw begin is hun doel.</strong> Bij 2 spelers is jouw kamp het doel van de andere speler, en die kan niet winnen zolang er nog een steen van jou staat. In Leapstone mag je een steen thuis laten staan, dus je kunt zo blokkeren. Hetzelfde geldt voor jou.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Vragen</h2>
      <h3>Met hoeveel mensen kun je Halma spelen?</h3>
      <p>Met twee of vier. Halma speel je op een vierkant bord van 16 bij 16 plekken, en elke speler begint in een hoek.</p>
      <h3>Hoeveel stenen heeft elke speler bij Halma?</h3>
      <p>Bij 2 spelers heeft elke speler 19 stenen, en bij 4 spelers 13.</p>
      <h3>Wie heeft Halma bedacht?</h3>
      <p>George Howard Monks, een Amerikaanse chirurg, in 1883 of 1884. De naam is Grieks voor &ldquo;sprong&rdquo;. Lees meer bij <a href="/nl/sternhalma">Sternhalma</a>.</p>
      <h3>Wat is het verschil tussen Halma en Chinees dammen?</h3>
      <p>Halma heeft een vierkant bord, met stappen en sprongen in acht richtingen en 19 of 13 stenen per speler. Chinees dammen heeft een sterbord, met zes richtingen en 10 stenen per speler, voor 2, 3, 4 of 6 spelers.</p>
      <h3>Kun je Halma gratis online spelen?</h3>
      <p>Ja, in Leapstone, in je browser of in de app uit de App Store. Kies een manier van spelen, zoals tegen de computer of online met vrienden, en tik dan op Vierkant bord. Leapstone is gratis, zonder advertenties.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Speel het</h2>
      <p>De knop Speel nu opent een potje tegen de computer op het <a href="/nl/chinees-dammen">Sterbord</a>. Om Halma te spelen tik je bovenaan op de terugpijl, kies je Spelen op deze telefoon, Spelen tegen de computer of Online spelen met vrienden, en tik je op Vierkant bord. In de app heten die keuzes nog Play on this phone, Play against the computer en Play online with friends.</p>
    </section>`;

export default {
  nav: "Halma: spelregels",
  titel: "Halma: spelregels en tips | Leapstone",
  beschrijving: "Zo speel je Halma op het vierkante bord van 16 bij 16: beginopstelling, stappen, sprongen, reeksen sprongen, winnen en tips. Speel gratis in je browser.",
  h1: "Halma: spelregels",
  intro: "Breng al je stenen over het vierkante bord naar de hoek aan de overkant, eerder dan de rest. De spelregels in het kort, met plaatjes, en een paar tips.",
  inhoud,
};
