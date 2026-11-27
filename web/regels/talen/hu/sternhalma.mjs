// A „Mi az a Sternhalma?” magyar oldal (134. feladat): a név és a kapcsolat a Halmával és a kínai dámával.
// Tartalom és források: az angol oldal ../en/sternhalma.mjs (Wikipedia Halma és Chinese Checkers, lásd ott). Mondatról mondatra magyarul.
// Szándékosan kihagyva, mint az angolban: ki adta ki a Stern-Halmát 1892-ben (a források eltérnek) és a szabadalmak évei.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Mit jelent a név</h2>
      <p>A Sternhalma a Halma német neve, csillag alakú táblán játszva. A <em>Stern</em> németül csillagot jelent. A kínai dáma (Chinese checkers) név ugyanaz a játék, egy később, az Egyesült Államokban adott néven.</p>
      <p>A Leapstone-ban ez a <strong>csillag alakú tábla</strong>: a <a href="/hu/szabalyok/csillaghalma">csillaghalma (kínai dáma) szabályainak</a> táblája.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Honnan ered</h2>
      <ul>
        <li><strong>A Halmát</strong> 1883-ban vagy 1884-ben találta ki George Howard Monks, egy amerikai sebész. A név görögül &bdquo;ugrást&rdquo; jelent. Négyzet alakú táblán játsszák. <a href="/hu/szabalyok/halma">Olvasd el a Halma szabályait</a>.</li>
        <li><strong>A Stern-Halma</strong> 1892-ben jelent meg Németországban: ugyanaz az ötlet egy hatágú csillag alakú táblán.</li>
        <li><strong>A kínai dáma</strong> (Chinese checkers) az a név, amelyet Bill és Jack Pressman 1928-ban adott a játéknak az Egyesült Államokban, eleinte &bdquo;Hop Ching checkers&rdquo; néven. A játéknak nincs történelmi köze Kínához, és nem is dámajáték.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miben különböznek a játékok</h2>
      <ul>
        <li><strong>Halma:</strong> 16 × 16 mezős négyzet alakú tábla, 2 vagy 4 játékosnak. Egy bábunak nyolc szomszédja van, egyenes és átlós. 2 játékosnál mindenkinek 19 bábuja van, 4 játékosnál 13.</li>
        <li><strong>Sternhalma és kínai dáma:</strong> 121 mezős csillag alakú tábla, 2, 3, 4 vagy 6 játékosnak. Egy bábunak hat szomszédja van. Mindenkinek 10 bábuja van.</li>
        <li><strong>A többi ugyanaz:</strong> egy lépés egy szabad szomszédra, vagy egy ugrás egy bábu fölött, ugrássorozatokkal. Az nyer, aki először tölti meg a tábla túloldalán lévő tábort.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Változatok, és mit csinál a Leapstone</h2>
      <p>A Halmát többféleképpen is játszották. Így viszonyul a Leapstone azokhoz a változatokhoz, amelyeket a forrásainkban találtunk:</p>
      <ul>
        <li><strong>A tábla mérete.</strong> A Halmát 8 × 8 és 10 × 10 mezős táblán is játsszák. A Leapstone-ban csak a 16 × 16 mezős tábla van.</li>
        <li><strong>A cél elhagyása.</strong> Egy Halma-szabály szerint az a bábu, amely az ellenfél táborába ért, nem hagyhatja el többé. A Leapstone-ban nincs ilyen szabály: egy ilyen bábuval újra léphetsz.</li>
        <li><strong>Három játékos egy csillagon.</strong> Egy régi, három játékosos Halmát csillag alakú táblán fejenként 15 bábuval írnak le. A Leapstone-ban 3 játékos játszik a csillag alakú táblán, fejenként 10 bábuval.</li>
        <li><strong>Az ugrás a te döntésed.</strong> Soha nem kell ugranod. Te választod meg a mezőt, ahol a lépésed véget ér.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Játssz vele a Leapstone-ban</h2>
      <p>A Játssz most egy játékot nyit meg a csillag alakú táblán a számítógép ellen. A négyzet alakú táblához koppints fent a vissza nyílra, és válaszd a menüben a Négyzet alakú táblát.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban és 10 kék bábuval a felső csúcsban",
  tekst: "A csillag alakú tábla 2 játékosnak.",
})}
    </section>`;

export default {
  nav: "Mi az a Sternhalma?",
  titel: "Mi az a Sternhalma? Halma csillag alakú táblán | Leapstone",
  beschrijving: "A Sternhalma a Halma német neve csillag alakú táblán. Hogyan függ össze a Halmával és a kínai dámával, és hogyan játszhatod ingyen a böngészőben.",
  h1: "Sternhalma, Halma és kínai dáma",
  intro: "Három név szorosan rokon játékokra. Mit jelent mind, honnan származnak, és miben különböznek.",
  inhoud,
};
