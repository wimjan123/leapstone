// De gids Halma tegenover Chinees dammen in het Nederlands, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Chinees dammen: het Sterbord, 121 plekken",
    alt: "Het Sterbord met 10 rode stenen in de onderste punt en 10 blauwe stenen in de bovenste punt",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: het Vierkante bord, 256 plekken",
    alt: "Het Vierkante bord met 19 rode stenen in de hoek linksboven en 19 blauwe stenen in de hoek rechtsonder",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Sterbord: zes buren, hier drie ervan leeg",
    alt: "Een rode steen met een witte ring eromheen. Drie van zijn zes buren zijn leeg en gemarkeerd; op de andere drie staan stenen.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Vierkante bord: acht buren, hier vijf ervan leeg",
    alt: "Een rode steen met een witte ring eromheen. Vijf van zijn acht buren zijn leeg en gemarkeerd; op de andere drie staan stenen.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Het korte antwoord</h2>
      <p>Halma speel je op een vierkant bord en Chinees dammen op een bord in de vorm van een zespuntige ster. In allebei de spellen verplaats je je stenen met stappen en sprongen over het bord, en de eerste speler die het kamp aan de overkant vult, wint.</p>
      <p>Wat verschilt, is het bord, de richtingen waarin je beweegt, hoeveel mensen kunnen meespelen en hoeveel stenen ieder heeft. <a href="/nl/sternhalma">Sternhalma</a> is de naam voor Halma op een Sterbord, dus het is hetzelfde spel als Chinees dammen.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">De borden</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Chinees dammen</strong> gebruikt het Sterbord: 121 plekken, met een punt van 10 plekken aan elk van de zes uiteinden. Een punt is een driehoek van rijen van 4, 3, 2 en 1 plekken.</li>
        <li><strong>Halma</strong> gebruikt het Vierkante bord: 16 bij 16 plekken, 256 in totaal. Een kamp zit in een hoek. Een groot kamp heeft rijen van 5, 5, 4, 3 en 2 plekken, een klein kamp rijen van 4, 4, 3 en 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Richtingen: zes of acht</h2>
      <p>Op het Sterbord heeft een plek zes buren. Op het Vierkante bord heeft een plek er acht, omdat de schuine richtingen ook tellen. Een stap gaat naar een lege buur. Een sprong gaat over één steen naast de jouwe, in een rechte lijn, naar de lege plek erachter, in al die richtingen en ook achteruit.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Een plek aan de rand heeft minder buren, en een hoek van het Vierkante bord heeft er drie. Zes richtingen maken drie lijnen door een plek op het Sterbord. Acht richtingen maken vier lijnen op het Vierkante bord: dwars, op en neer en twee schuine.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Spelers en stenen</h2>
      <ul>
        <li><strong>Chinees dammen:</strong> 2, 3, 4 of 6 spelers. Iedereen heeft 10 stenen, dus er staan 20, 30, 40 of 60 stenen op het bord.</li>
        <li><strong>Halma:</strong> 2 of 4 spelers. Met 2 spelers heeft ieder 19 stenen, 38 in totaal. Met 4 spelers heeft ieder 13 stenen, 52 in totaal.</li>
      </ul>
      <p>Het Vierkante bord heeft in Leapstone geen potje voor 3 of 6 spelers. Voor een potje met drie lees je <a href="/nl/chinees-dammen-drie-spelers">Chinees dammen met drie spelers</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Wat gelijk is</h2>
      <ul>
        <li><strong>Een zet:</strong> één stap, of een reeks sprongen met één steen. Je beslist zelf waar de reeks eindigt, en na een sprong kun je geen stap meer doen.</li>
        <li><strong>Elke kleur:</strong> je springt over een steen van elke kleur, ook je eigen. De steen waar je overheen springt, blijft staan. Er wordt niets geslagen.</li>
        <li><strong>Het doel:</strong> het kamp tegenover waar je begon. Op alle plekken moeten je eigen stenen staan. Zolang daar een steen van een andere speler staat, kun je niet klaar zijn.</li>
        <li><strong>Winnen:</strong> de eerste speler die het doel vult, wint. Met 2 spelers is het potje dan afgelopen. Met meer spelers spelen de anderen door voor de volgende plaatsen, en een speler die klaar is, wordt overgeslagen.</li>
        <li><strong>Opgeven en tijd:</strong> als je opgeeft, gaan je stenen van het bord. In een online potje heeft elke zet een tijdslimiet, en als je 3 beurten achter elkaar mist, geef je op.</li>
      </ul>
      <p>Lees de volledige spelregels van <a href="/nl/chinees-dammen">Chinees dammen</a> en <a href="/nl/halma-spelregels">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Welk bord je kiest in Leapstone</h2>
      <ul>
        <li><strong>3 of 6 spelers:</strong> alleen het Sterbord heeft ze.</li>
        <li><strong>Meer stenen per speler:</strong> het Vierkante bord, met 19 stenen per speler bij 2 spelers of 13 bij 4, tegen 10 op het Sterbord.</li>
        <li><strong>Online spelen:</strong> een snel potje wordt op het Sterbord gespeeld. Met vrienden en tegen de computer kun je beide borden kiezen.</li>
      </ul>
      <p>Speel nu opent een potje op het Sterbord tegen de computer. Voor het Vierkante bord tik je bovenaan op de terugpijl en kies je in het menu Vierkant bord.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Ga verder</h2>
      <ul>
        <li><a href="/play/">Speel in je browser</a> en probeer beide borden.</li>
        <li><a href="/nl/chinees-dammen-strategie">Chinees dammen: strategie</a>: zes tips met plaatjes.</li>
        <li><a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>: hoe een potje voor twee werkt.</li>
      </ul>
      <p><a href="/nl/chinees-dammen-online-met-vrienden">Chinees dammen online met vrienden</a></p>
    </section>`;

export default {
  nav: "Halma of Chinees dammen",
  titel: "Halma of Chinees dammen: de verschillen | Leapstone",
  beschrijving: "Halma of Chinees dammen? Het Vierkante bord en het Sterbord, zes of acht richtingen, spelers en stenen, en wat gelijk is.",
  h1: "Halma of Chinees dammen",
  intro: "Twee spellen met één idee: breng al je stenen over het bord naar de overkant. Wat verschilt, wat gelijk is en waar je beide speelt.",
  inhoud,
};
