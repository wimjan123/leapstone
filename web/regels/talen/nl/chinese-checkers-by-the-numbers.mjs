// Leapstone in cijfers, Nederlands (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Plekken en stenen</h2>
      <p>Geteld op de twee borden van Leapstone, in de beginstand van een potje.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Het Sterbord met alle zes punten vol: tien stenen in elk van zes kleuren, rond een leeg midden.",
  tekst: "Het Sterbord aan het begin van een potje voor zes spelers.",
})}
      <ul class="tips">
        <li><strong>Het Sterbord heeft ${f("sterbord_vakken")} plekken.</strong> Elke speler begint met ${f("sterbord_stenen_per_speler")} stenen. Een potje voor twee spelers heeft dus ${f("sterbord_stenen_2_spelers")} stenen op het bord, een potje voor drie ${f("sterbord_stenen_3_spelers")}, voor vier ${f("sterbord_stenen_4_spelers")} en voor zes ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Het vierkante Halmabord heeft ${f("vierkant_vakken")} plekken.</strong> In een potje voor twee spelers begint elke speler met ${f("vierkant_stenen_per_speler_2_spelers")} stenen, samen ${f("vierkant_stenen_2_spelers")}. In een potje voor vier begint elke speler met ${f("vierkant_stenen_per_speler_4_spelers")} stenen, samen ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">De langste sprongketen: ${f("langste_sprongketen")}</h2>
      <p>Op het Sterbord kan één steen <strong>${f("langste_sprongketen")} sprongen in één zet</strong> maken, en volgens de regels van Leapstone kan geen zet er meer hebben. Om dat aantal te halen, zijn de andere stenen vrij neergezet: één op elke plek waar de steen overheen springt.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Een Sterbord met één rode steen en veel blauwe stenen. Witte pijlen tonen hoe de rode steen over de ene blauwe steen na de andere springt, langs een lang kronkelend pad.",
  tekst: "De langste keten: de rode steen springt over elke blauwe steen, de een na de ander.",
})}
      <p><strong>Zo is het geteld.</strong> Een sprong landt altijd twee plekken verder, in een rechte lijn. Een steen die blijft springen, komt dus maar op een deel van de plekken: het bord valt uiteen in vier van zulke groepen, en de grootste heeft ${f("grootste_klasse_vakken")} plekken. In Leapstone mag een steen in één zet niet twee keer op dezelfde plek landen, en ook niet op de plek waar hij begon. Een keten landt dus hooguit één keer op elke andere plek in zijn groep. Het programma doorzocht die groep en vond een pad langs alle ${f("grootste_klasse_vakken")} plekken, dus geen keten kan langer zijn: ${f("langste_sprongketen")} sprongen. Een test speelt die zet daarna met de regels van Leapstone.</p>
      <p><strong>Geen echt potje.</strong> Deze keten heeft ${f("langste_sprongketen")} andere stenen nodig, elk op precies de goede plek. Een potje voor twee of drie spelers heeft maar ${f("sterbord_stenen_2_spelers")} of ${f("sterbord_stenen_3_spelers")} stenen, en dat is te weinig. Een potje voor vier of zes spelers heeft er ${f("sterbord_stenen_4_spelers")} of ${f("sterbord_stenen_6_spelers")}, en dat is genoeg. Maar in een echt potje zet niemand stenen vrij neer, dus verwacht deze keten niet aan tafel. Hij laat zien wat het bord toelaat, niet wat er in een potje gebeurt.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">De kortste oversteek: ${f("oversteek_zetten")} zetten</h2>
      <p>Eén speler alleen op het Sterbord, zonder tegenstanders, heeft <strong>${f("oversteek_zetten")} zetten</strong> nodig om alle ${f("sterbord_stenen_per_speler")} stenen van de ene punt naar de punt aan de overkant te brengen, en kan het niet in minder. Een hele sprongketen telt als één zet.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Een Sterbord met alleen tien rode stenen, in de onderste punt. De bovenste punt, waar ze heen moeten, heeft een gestippelde rand.",
  tekst: "Eén speler alleen: tien stenen in de onderste punt, en de bovenste punt is het doel.",
})}
      <p><strong>Zo is het geteld.</strong> Een test speelt een oversteek van ${f("oversteek_zetten")} zetten met de regels van Leapstone, zonder andere stenen op het bord. Om te laten zien dat ${f("geen_oversteek_in_zetten")} zetten of minder niet kan, volgt een zoektocht de methode van G. I. Bell (<em>Integers</em> 9, 2009). Elke zet kan achteruit gespeeld worden, en een halve draai van het bord ruilt het begin en het doel om. Als er een oversteek van ${f("geen_oversteek_in_zetten")} zetten of minder bestond, dan lag een stand halverwege hooguit ${f("zoekdiepte_zetten")} zetten van het begin, en dezelfde stand een halve slag gedraaid ook. De zoektocht ging elke stand binnen ${f("zoekdiepte_zetten")} zetten van het begin langs, telde een stand en zijn spiegelbeeld één keer, liet de standen weg die aantoonbaar niet op tijd ver genoeg kunnen komen, en vond zo'n paar niet. Hij liep ${f("gemeten_rekentijd_seconden")} seconden op een machine met ${f("gemeten_kernen")} kernen, en zijn grootste stap hield ${f("gemeten_grootste_laag_miljoen_standen")} miljoen standen vast in ${f("gemeten_geheugen_gb")} GB geheugen. Het getal is opnieuw uitgerekend voor het eigen bord van Leapstone.</p>
      <p><strong>Geen ondergrens voor een echt potje.</strong> In een echt potje staan ook de stenen van andere spelers op het bord, en jouw stenen kunnen daarover springen. ${f("oversteek_zetten")} is dus niet het minste dat een echt potje kan duren: het is alleen bewezen voor één speler alleen.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Probeer het</h2>
      <p><a href="/play/">Speel Leapstone in je browser</a> tegen de computer, of haal de app met de knoppen bovenaan deze pagina. Voor de spelregels lees je <a href="/nl/chinees-dammen">Chinees dammen: spelregels</a> of de <a href="/nl/halma-spelregels">spelregels van Halma</a>. Hoe je sprongketens in een potje gebruikt, lees je in de <a href="/nl/chinees-dammen-strategie">strategietips</a>.</p>
    </section>`;

export default {
  nav: "Chinees dammen in cijfers",
  titel: "Chinees dammen in cijfers | Leapstone",
  beschrijving: `Het Sterbord heeft ${c.sterbord_vakken} plekken. Eén zet telt hooguit ${c.langste_sprongketen} sprongen, en een speler alleen heeft ${c.oversteek_zetten} zetten nodig voor de oversteek. Zo is elk getal berekend.`,
  h1: "Chinees dammen in cijfers",
  intro: `Het Sterbord van Chinees dammen heeft ${f("sterbord_vakken")} plekken, en elke speler begint met ${f("sterbord_stenen_per_speler")} stenen. In Leapstone kan één zet nooit meer dan ${f("langste_sprongketen")} sprongen hebben. Eén speler alleen op het bord, zonder tegenstanders, heeft ${f("oversteek_zetten")} zetten nodig om over te steken. Hieronder zie je hoe elk getal is geteld, en wat het wel en niet zegt over een echt potje.`,
  inhoud,
};
