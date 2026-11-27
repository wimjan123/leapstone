// De Nederlandse spelregelpagina Chinees dammen (taak 121). Inhoud: de Engelse pagina chinese-checkers.mjs
// (nagelopen tegen crates/halma-core, zie docs/plan.md, taak 116), zin voor zin in het Nederlands.
// Elke regel hier moet met die pagina kloppen; verander je een regel, verander dan beide.
// Dezelfde plaatjes (taalloos: alleen cijfers in de SVG); de alt-teksten en bijschriften zijn Nederlands.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} spelers`,
      alt:
        {
          2: "Het Sterbord met 10 rode stenen in de onderste punt en 10 blauwe stenen in de bovenste punt",
          3: "Het Sterbord met rode stenen onderaan, blauwe linksboven en groene rechtsboven",
          4: "Het Sterbord met stenen in vier punten: rood onderaan, groen bovenaan, blauw linksonder en geel rechtsboven",
          6: "Het Sterbord met stenen in alle zes de punten, in zes kleuren",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Het bord</h2>
      <p>Chinees dammen speel je op een ster met zes punten. Het bord heeft 121 plekken, en elke punt heeft er 10. Binnen het bord heeft elke plek zes buren.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Zo beginnen de stenen</h2>
      <p>Elke speler heeft 10 stenen en begint met ze allemaal in één punt van de ster. De punt aan de overkant is jouw doel.</p>
      <ul>
        <li><strong>2 spelers:</strong> de twee punten die recht tegenover elkaar liggen.</li>
        <li><strong>3 spelers:</strong> om de andere punt. De drie doelen zijn aan het begin leeg.</li>
        <li><strong>4 spelers:</strong> twee paren punten die naast elkaar liggen. Elke speler heeft een andere speler tegenover zich.</li>
        <li><strong>6 spelers:</strong> alle zes de punten.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Om de beurt</h2>
      <p>Speler 1 begint. Daarna gaat de beurt op volgorde verder: speler 2, speler 3 en zo door, en na de laatste speler is speler 1 weer aan de beurt. In Leapstone horen de kleuren bij de nummers: rood, blauw, groen, geel, paars en zilver.</p>
      <p>Als je aan de beurt bent, doe je één zet met één steen. Er wordt niets geslagen: stenen blijven op het bord staan tot hun speler opgeeft.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Een stap</h2>
      <p>Verplaats een steen naar een lege plek naast hem.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Een rode steen met een witte ring eromheen. Drie van zijn zes buren zijn leeg en gemarkeerd; op de andere drie staat een steen.",
  tekst: "De rode steen kan naar de drie gemarkeerde plekken stappen. De andere drie buren zijn bezet.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Een sprong</h2>
      <p>Spring over één steen naast de jouwe, van welke kleur ook, en land op de lege plek er recht achter. Je kunt in alle zes de richtingen springen, ook achteruit.</p>
      <ul>
        <li>De plek waar je landt, moet leeg zijn.</li>
        <li>Je kunt niet over twee stenen achter elkaar springen, en ook niet over een lege plek.</li>
        <li>De steen waar je overheen springt, blijft staan.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Een rode steen springt over een blauwe steen naar de lege plek erachter, aangegeven met een pijl.",
  tekst: "De rode steen springt over de blauwe steen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Een reeks sprongen</h2>
      <p>Na een sprong mag dezelfde steen nog een keer springen, zo vaak als hij kan en in elke richting. Jij bepaalt waar je stopt. Alle sprongen samen zijn één zet.</p>
      <ul>
        <li>In één zet kun je niet twee keer op dezelfde plek landen.</li>
        <li>Een zet is één stap, of één of meer sprongen. Na een sprong mag je niet meer stappen.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Een rode steen maakt in één zet drie sprongen, over een blauwe, een groene en nog een blauwe steen. De drie landingsplekken hebben het nummer 1, 2 en 3.",
  tekst: "Eén zet met drie sprongen, in de volgorde van de nummers.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Het doel</h2>
      <p>Je wint als je alle 10 stenen hebt verplaatst naar de punt tegenover waar je begon. Op alle 10 plekken van die punt moeten je eigen stenen staan. Zolang er een steen van een andere speler staat, kun je niet winnen.</p>
      <p>Je mag op elke lege plek landen, ook in de punten van andere spelers.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Een Sterbord voor drie spelers. Rood begint onderaan; de lege punt bovenaan, aangegeven met stippellijn-cirkels, is het doel van rood.",
  tekst: "Bij 3 spelers begint rood onderaan. Het doel van rood is de lege punt bovenaan.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Met 2, 3, 4 of 6 spelers</h2>
      <ul>
        <li><strong>2 spelers:</strong> wie als eerste het doel vol heeft, wint, en het potje is afgelopen.</li>
        <li><strong>3, 4 of 6 spelers:</strong> wie als eerste het doel vol heeft, wint. De anderen spelen door voor de volgende plaatsen, en een speler die klaar is, wordt overgeslagen. Het potje is afgelopen als nog maar één speler meespeelt.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Opgeven</h2>
      <p>Als je opgeeft, gaan je stenen van het bord, zodat ze niemand meer in de weg staan. Bij 2 spelers wint de andere speler. Bij meer spelers gaat het potje zonder jou door, en als iedereen op één speler na opgeeft, wint die laatste speler.</p>
      <p>In een online potje heeft elke zet een tijdslimiet. De speler die het potje start, stelt die in, en in een snel potje is het 30 seconden. Loopt je tijd af, dan wordt je beurt overgeslagen. Mis je 3 beurten achter elkaar, dan geef je op. Potjes tegen de computer en op één telefoon hebben geen tijdslimiet.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Bouw ladders.</strong> Zet stenen op een rij met steeds één lege plek ertussen, in de richting van je doel. Eén steen kan dan in één zet langs de hele rij springen.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Vier stenen op een schuine rij met steeds een lege plek ertussen. Een rode steen aan het ene eind springt over alle vier, met vier genummerde landingsplekken.",
  tekst: "Vier stenen op een rij: de bovenste rode steen steekt het bord over in één zet, met vier sprongen.",
})}
        </li>
        <li><strong>Elke steen is een ladder.</strong> Je kunt over elke kleur springen, dus de stenen van de andere spelers helpen jou ook. En jouw ladders helpen hen: kijk wat je achterlaat.</li>
        <li><strong>Vergeet de achterblijvers niet.</strong> Je hebt alle 10 stenen thuis nodig. Een steen die ver achterligt en niets heeft om overheen te springen, gaat één plek per beurt vooruit. Haal hem erbij zolang de andere stenen nog om hem heen staan.</li>
        <li><strong>Jouw begin is hun doel.</strong> Bij 2, 4 of 6 spelers is jouw beginpunt het doel van de speler tegenover je, en die kan niet winnen zolang er nog een steen van jou staat. Hetzelfde geldt voor jou.</li>
      </ul>
      <p>Meer tips, met plaatjes, staan in de gids <a href="/nl/chinees-dammen-strategie">Chinees dammen: strategie</a>. Voor een potje met twee lees je <a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Vragen</h2>
      <h3>Met hoeveel mensen kun je Chinees dammen spelen?</h3>
      <p>Met twee, drie, vier of zes. Elke speler begint in één punt van de ster. Bij 2, 3 of 4 spelers blijven sommige punten leeg.</p>
      <h3>Hoeveel stenen heeft elke speler?</h3>
      <p>Elke speler heeft 10 stenen. Het bord heeft 121 plekken: 10 in elk van de zes punten en 61 in het midden.</p>
      <h3>Mag je over je eigen stenen springen, of achteruit?</h3>
      <p>Ja. Je mag over een steen van elke kleur springen, ook over je eigen steen, in alle zes de richtingen, ook achteruit. De steen waar je overheen springt, blijft staan.</p>
      <h3>Sla je stenen in Chinees dammen?</h3>
      <p>Nee. Er wordt niets geslagen. Een steen gaat alleen van het bord als de speler opgeeft.</p>
      <h3>Komt Chinees dammen uit China?</h3>
      <p>Nee. Het spel verscheen in 1892 in Duitsland als Stern-Halma, gebaseerd op het oudere spel Halma. De naam Chinees dammen komt uit de Verenigde Staten, in 1928. Lees meer bij <a href="/nl/sternhalma">Sternhalma</a>.</p>
      <h3>Waar kun je gratis online Chinees dammen spelen met vrienden?</h3>
      <p>In Leapstone, in je browser of in de app uit de App Store. Stuur een vriend een uitnodigingslink: hij of zij doet mee zonder account, e-mailadres of wachtwoord. Je kunt ook tegen de computer spelen, of een snel potje tegen een andere speler. Leapstone is gratis, zonder advertenties.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Chinees dammen spelen in Leapstone</h2>
      <p>Leapstone is een gratis app voor Chinees dammen en Halma, met een 3D-bord van rode lak en goud. Je kunt in de app en in je browser spelen.</p>
      <ul>
        <li><strong>Tegen de computer.</strong> Makkelijk, normaal of moeilijk. Daar heb je geen internet voor nodig.</li>
        <li><strong>Met vrienden.</strong> Stuur een uitnodigingslink. Je stelt de tijd per zet in, en je kunt chatten.</li>
        <li><strong>Online.</strong> Een snel potje tegen een andere speler van jouw niveau, 30 seconden per zet. Sommige online tegenstanders kunnen computerspelers zijn.</li>
        <li><strong>Op één telefoon.</strong> Geef de telefoon door aan tafel.</li>
      </ul>
      <p>Leapstone is gratis, zonder advertenties en zonder aanmelden met e-mailadres: je kiest alleen een spelersnaam. <a href="https://apps.apple.com/nl/app/id6831230722">Download Leapstone in de App Store</a> of <a href="/play/">speel in je browser</a>.</p>
    </section>`;

export default {
  nav: "Chinees dammen: spelregels",
  titel: "Chinees dammen: spelregels en tips | Leapstone",
  beschrijving: "Spelregels Chinees dammen: beginopstelling, stappen, sprongen en reeksen sprongen, winnen met 2, 3, 4 of 6 spelers, en tips. Speel gratis in je browser.",
  h1: "Chinees dammen: spelregels",
  intro: "Breng al je 10 stenen over het Sterbord naar de punt aan de overkant, eerder dan de rest. De spelregels in het kort, met plaatjes, en een paar tips.",
  inhoud,
};
