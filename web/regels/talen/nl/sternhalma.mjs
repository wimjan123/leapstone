// De Nederlandse pagina Sternhalma (taak 133): de naam, de relatie met Halma en Chinees dammen.
// Inhoud: de Engelse pagina ../en/sternhalma.mjs, zin voor zin in het Nederlands. De bronnen voor de geschiedenis staan daar.
// Verander je een feit, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Wat de naam betekent</h2>
      <p>Sternhalma is de Duitse naam van Halma op een bord in de vorm van een ster. <em>Stern</em> is Duits voor ster. De naam Chinees dammen is hetzelfde spel onder een naam die later in de Verenigde Staten is bedacht.</p>
      <p>In Leapstone is dit het <strong>Sterbord</strong>: het bord van de <a href="/nl/chinees-dammen">spelregels van Chinees dammen</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Waar het vandaan komt</h2>
      <ul>
        <li><strong>Halma</strong> is in 1883 of 1884 bedacht door George Howard Monks, een Amerikaanse chirurg. De naam is Grieks voor &ldquo;sprong&rdquo;. Het wordt gespeeld op een vierkant bord. <a href="/nl/halma-spelregels">Lees de spelregels van Halma</a>.</li>
        <li><strong>Stern-Halma</strong> verscheen in 1892 in Duitsland: hetzelfde idee op een bord in de vorm van een ster met zes punten.</li>
        <li><strong>Chinese checkers</strong>, in het Nederlands Chinees dammen, is de naam die Bill en Jack Pressman het spel in 1928 in de Verenigde Staten gaven, eerst als &ldquo;Hop Ching checkers&rdquo;. Het spel heeft geen historische band met China, en het is geen damspel.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Zo verschillen de spellen</h2>
      <ul>
        <li><strong>Halma:</strong> een vierkant bord van 16 bij 16 plekken, voor 2 of 4 spelers. Een steen heeft acht buren, recht en schuin. Bij 2 spelers heeft elk 19 stenen, bij 4 spelers 13.</li>
        <li><strong>Sternhalma en Chinees dammen:</strong> een Sterbord van 121 plekken, voor 2, 3, 4 of 6 spelers. Een steen heeft zes buren. Iedereen heeft 10 stenen.</li>
        <li><strong>De rest is hetzelfde:</strong> een stap naar een vrije buur, of een sprong over één steen, met reeksen sprongen. De eerste speler die het kamp aan de overkant van het bord vol heeft, wint.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianten, en wat Leapstone doet</h2>
      <p>Halma is op meer dan één manier gespeeld. Zo verhoudt Leapstone zich tot de varianten die we in onze bronnen vonden:</p>
      <ul>
        <li><strong>Grootte van het bord.</strong> Halma wordt ook gespeeld op borden van 8 bij 8 en 10 bij 10. Leapstone heeft alleen het bord van 16 bij 16.</li>
        <li><strong>Het doel verlaten.</strong> In een Halma-regel mag een steen die het kamp van de tegenstander is binnengegaan, er niet meer uit. Leapstone heeft deze regel niet: je mag zo&rsquo;n steen weer verplaatsen.</li>
        <li><strong>Drie spelers op een ster.</strong> Een oude Halma-variant voor drie spelers op een Sterbord wordt beschreven met elk 15 stenen. Leapstone speelt 3 spelers op het Sterbord met elk 10 stenen.</li>
        <li><strong>Springen is jouw keuze.</strong> Je hoeft nooit te springen. Jij kiest de plek waar je zet eindigt.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Speel het in Leapstone</h2>
      <p>Speel nu opent een potje op het Sterbord tegen de computer. Voor het Vierkante bord tik je bovenaan op de terugpijl en kies je in het menu het Vierkante bord.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Het Sterbord met 10 rode stenen in de onderste punt en 10 blauwe stenen in de bovenste punt",
  tekst: "Het Sterbord voor 2 spelers.",
})}
    </section>`;

export default {
  nav: "Sternhalma: wat is het?",
  titel: "Wat is Sternhalma? Halma op een Sterbord | Leapstone",
  beschrijving: "Sternhalma is de Duitse naam van Halma op een Sterbord. Hoe het zich verhoudt tot Halma en Chinees dammen, en hoe je het gratis in je browser speelt.",
  h1: "Sternhalma, Halma en Chinees dammen",
  intro: "Drie namen voor spellen die sterk op elkaar lijken. Wat elke naam betekent, waar ze vandaan komen en waarin ze verschillen.",
  inhoud,
};
