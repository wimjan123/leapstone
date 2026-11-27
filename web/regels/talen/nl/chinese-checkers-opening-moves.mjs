// De gids Chinees dammen: openingszetten (taak 303, feature 294): /nl/chinees-dammen-openingszetten.
// Inhoud: de Engelse gids ../en/chinese-checkers-opening-moves.mjs, zin voor zin in het Nederlands. Elk getal en elke zet is nagelopen
// tegen crates/halma-core; de plaatjes komen uit crates/halma-core/examples/regelplaatjes.rs (sectie "taak 303"). Verander je een zet, verander dan beide.
// Een "rij" is alle plekken met dezelfde afstand tot je eigen punt; een stap schuift 1 rij op, een sprong 2.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Je eerste zet: 14 keuzes</h2>
      <p>Aan het begin vullen je 10 stenen een driehoek in rijen van 4, 3, 2 en 1, en de voorste rij kijkt naar het midden van het bord. Er is geen lege plek in de driehoek, dus een steen kan alleen naar de rij vlak voor hem. Dat geeft 14 eerste zetten: elk van de 4 stenen in de voorste rij kan naar 2 plekken stappen (8 stappen), en elk van de 3 stenen in de tweede rij kan over een voorste steen springen naar 2 plekken (6 sprongen). De andere 3 stenen kunnen nog niet bewegen.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "De rode punt onderaan met zijn 10 stenen, en in de rij vlak ervoor 5 lege plekken, gemarkeerd met een ring.",
  tekst: "Elke eerste zet eindigt op een van deze 5 plekken.",
})}
      <p>In deze gids is een rij een lijn van plekken dwars over je punt, evenwijdig aan de voorkant ervan, en we tellen de voortgang in rijen. Een stap brengt een steen 1 rij vooruit en een sprong brengt hem 2 rijen vooruit. Elke speler heeft dezelfde 14 eerste zetten, met 2, 3, 4 of 6 spelers en vanuit elke punt van de ster, want van binnenuit ziet elke punt er hetzelfde uit.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Opening 1: spring eruit, maak dan de achterste steen vrij</h2>
      <p>De steen helemaal achterin je punt is het verst van je doel, en hij kan aan het begin niet bewegen: hij kan alleen over een steen springen als de plek achter die steen leeg is. Een sprong uit de tweede rij maakt precies zo'n plek.</p>
      <ol>
        <li><strong>Zet 1:</strong> de steen aan het rechteruiteinde van je tweede rij springt over de steen die voor hem staat. Hij landt in de rij vóór je punt en wint 2 rijen.</li>
        <li><strong>Zet 2:</strong> de achterste steen springt twee keer in één zet: eerst naar de plek die zet 1 leeg heeft gemaakt, en dan over een steen van de tweede rij. Hij wint 4 rijen.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "De rode punt na zet 1. De achterste steen heeft een ring, en 2 pijlen met de cijfers 1 en 2 laten zijn sprongen zien door de lege plek naar de rij voor de punt.",
  tekst: "Na zet 1 springt de achterste steen er in 2 sprongen uit.",
})}
      <p>Dat is 6 rijen in 2 zetten. We hebben alle manieren geprobeerd om 2 zetten te spelen, en 6 is het meeste dat je kunt winnen. Slechts 4 paren zetten halen het: de steen aan een van beide uiteinden van de tweede rij springt, in een van zijn 2 richtingen, en de achterste steen volgt. De steen in het midden van de tweede rij werkt niet, want die houdt de achterste steen opgesloten.</p>
      <p>Beide stenen staan nu in de rij vóór je punt, met een lege plek ertussen. Dat is de eerste stap van een ladder.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Opening 2: 4 zetten met 4 verschillende stenen</h2>
      <p>In 4 zetten kun je hooguit 13 rijen winnen, en dat lukt alleen als elke zet een andere steen gebruikt. Deze reeks doet dat:</p>
      <ol>
        <li><strong>Zet 1:</strong> de steen aan het rechteruiteinde van de voorste rij stapt vooruit. Hij wint 1 rij.</li>
        <li><strong>Zet 2:</strong> de steen aan het rechteruiteinde van de derde rij springt twee keer. Hij wint 4 rijen.</li>
        <li><strong>Zet 3:</strong> de steen aan het linkeruiteinde van de tweede rij springt twee keer. Hij wint 4 rijen.</li>
        <li><strong>Zet 4:</strong> de achterste steen springt twee keer. Hij wint 4 rijen.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "De rode punt aan het begin. De 4 stenen die gaan bewegen hebben een cijfer van 1 tot 4, in de volgorde van de zetten.",
          tekst: "Ervoor: de stenen die bewegen, op volgorde.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "De rode punt na 4 zetten, met de 4 plekken waar de genummerde stenen zijn geland in de rijen voor de punt, en 4 gaten die achterbleven in de punt.",
          tekst: "Erna: waar ze zijn geland.",
        })}
      </div>
      <p>Elke zet bereidt de volgende voor. Zet 2 en 3 eindigen met een sprong over de steen die net daarvoor bewoog, en zet 4 begint via het gat dat zet 3 heeft achtergelaten. Alle 4 de stenen landen in je eigen helft van het bord.</p>
      <p>Er zijn meer reeksen die 13 halen. Wat ze delen is het idee: zoek de zet die een gat of een opstapje voor de volgende zet achterlaat, en laat de achterste steen uiterlijk bij zet 4 eruit.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Fouten in de eerste zetten</h2>
      <ul class="tips">
        <li><strong>Elke beurt dezelfde steen verplaatsen.</strong> Een steen die alleen rent, wint 5 rijen in 4 zetten, tegen 13 voor 4 verschillende stenen. Hij laat ook de rest van je stenen staan waar ze stonden.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "De rode punt aan het begin. Eén steen uit de tweede rij doet 4 zetten achter elkaar langs één lijn, met pijlen en de cijfers 1 tot 4, en eindigt alleen bij het midden van het bord.",
  tekst: "Eén steen, 4 zetten, 5 rijen.",
})}
      <ul class="tips">
        <li><strong>Alleen stappen met de voorste rij.</strong> 4 stappen winnen 4 rijen. Daarna kan de achterste steen nog steeds niet bewegen, dus hij blijft achter terwijl de rest vooruitgaat.</li>
        <li><strong>Opzij stappen.</strong> Een stap langs een rij wint 0 rijen. Na zet 1 van opening 1 kan de voorste steen naar de plek naast hem stappen, en dat lijkt vooruitgang, maar de zet is verspild.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Ga verder</h2>
      <p>Na ongeveer 4 zetten komen de twee legers dicht bij elkaar, en de openingen hierboven maken plaats voor het middenspel. Je hoeft de reeksen niet te onthouden: onthoud dat elke zet de volgende moet voorbereiden.</p>
      <ul>
        <li><a href="/play/">Speel tegen de computer in je browser</a> en probeer opening 1 of 2.</li>
        <li><a href="/nl/chinees-dammen-strategie">Strategie voor Chinees dammen</a>: ladders, je stenen bij elkaar houden en je doel vullen.</li>
        <li><a href="/nl/chinees-dammen-twee-spelers">Chinees dammen met twee spelers</a>: zo werkt een potje voor twee.</li>
        <li><a href="/nl/chinees-dammen">Spelregels van Chinees dammen</a>, met plaatjes van stappen, sprongen en reeksen.</li>
      </ul>
    </section>`;

export default {
  nav: "Chinees dammen: openingszetten",
  titel: "Chinees dammen openingszetten: 2 openingen | Leapstone",
  beschrijving: "Openingszetten bij Chinees dammen: zo spring je uit je punt, maak je de achterste steen vrij bij zet 2 en win je 13 rijen in 4 zetten, plus de fouten.",
  h1: "Chinees dammen: openingszetten",
  intro: "Een goede opening bij Chinees dammen springt uit de tweede rij, gebruikt elke beurt een andere steen en laat de steen achterin je punt bij zet 2 of 4 eruit. Twee openingen met plaatjes, en de fouten die je moet vermijden.",
  inhoud,
};
