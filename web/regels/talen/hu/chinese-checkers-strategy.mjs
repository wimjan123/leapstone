// A Csillaghalma-stratégia magyar útmutató (134. feladat). Tartalom: az angol útmutató ../en/chinese-checkers-strategy.mjs
// (minden tipp a crates/halma-core ellen ellenőrizve, lásd docs/plan.md, 122. feladat), mondatról mondatra magyarul.
// Nincsenek kitalált „szakértők”, számok vagy történelem. Az egyetlen szám a 16 (lépés csúcstól csúcsig), amelyet a példa megszámol.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Min alapulnak ezek a tippek</h2>
      <p>A tippek a <a href="/hu/szabalyok/csillaghalma">csillaghalma (kínai dáma) szabályaiból</a> következnek, ahogy a Leapstone játssza: egy lépés egy egyszerű lépés vagy egy ugrássorozat, és bármilyen színű bábut átugorhatsz. Nem a legjobb játék bizonyításai. A leggyorsabb módja, hogy kipróbáld őket, ha a számítógép ellen játszol.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Építs létrákat</h2>
      <p>A létra egy bábusor, amelyben két bábu között mindig egy üres mező van. A sor egyik végén álló bábu egyetlen lépésben végigugorja az egész sort, így egy kör alatt átszeli a táblát, ahelyett hogy körönként egy mezőt haladna.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Négy bábu egy átlós sorban, köztük egy-egy üres mezővel. Egy piros bábu a sor egyik végén mind a négy fölött átugrik, négy számozott érkezési mezővel.",
  tekst: "Négy ugrás egyetlen lépésben. Ugyanez a bábu egyébként csak egy mezőt léphetne.",
})}
      <p>Az ugrás mind a hat irányban működik, hátrafelé is, ezért a létrának nem kell a saját csúcsodban kezdődnie. Bármilyen bábusor megfelel, amelyben hézagok vannak.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Tartsd együtt a bábuidat</h2>
      <p>Mind a 10 bábura szükséged van a célban, ezért az utolsó bábud dönti el, mikor végzel. Az a bábu, amelynek nincs mellette másik bábu, nem tud mit átugrani, és csak lépni tud.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Egy csillag alakú tábla, az alsó csúcsban egyetlen piros bábuval egyedül. Csak a két üres szomszédja van megjelölve. Más piros és kék bábuk középen állnak.",
  tekst: "Ennek a bábunak nincs szomszédja, ezért csak a két megjelölt mezőre léphet.",
})}
      <p>A saját csúcsod hegyétől a tábla túloldalán lévő cél hegyéig 16 lépés van. Ez 16 kör egyetlen magára hagyott bábunak, míg egy létra egy lépésben átér. Mozgasd a hátul lévő bábukat, amíg még vannak körülöttük átugrható bábuk. A Leapstone számítógépe is ezt teszi: a leghátsó bábui lépéseit egy kicsit magasabbra pontozza.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Használd a közepét</h2>
      <p>A tábla közepén álló bábunak hat szomszédja van, ezért mind a hat irányba léphet vagy ugorhat. A szélén álló bábunak kevesebb. A képen a szélen álló bábunak négy van.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Egy csillag alakú tábla, a közepén egy piros bábuval hat megjelölt szomszéddal, és a bal felső szélhez közel egy piros bábuval négy megjelölt szomszéddal.",
  tekst: "Hat lépési lehetőség középen, négy a szélen.",
})}
      <p>A középen álló bábuk a többi bábunak is adnak valamit, amit átugorhat a táblán át vezető úton.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Töltsd meg a célt hátulról</h2>
      <p>A célod egy 10 mezős háromszög, 4, 3, 2 és 1 mezős sorokban. A hátsó mezőket csak az előttük lévő mezőkön át lehet elérni. Ha előbb az elsőket töltöd meg, az utolsó bábunak lehet, hogy nem lesz útja befelé.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "A felső cél csúcs kilenc piros bábuval és egy üres mezővel egészen hátul, szaggatott vonallal jelölve. Egy tizedik piros bábu, fehér gyűrűvel, az első sor alatt áll.",
  tekst: "Kilenc bábu otthon van, és a hátsó mező üres. A tizedik bábunak nincs lépése, amely oda vinné.",
})}
      <p>Az első bábukat tedd a hátsó mezőkre, és haladj előre, hogy az elülső rész szabad maradjon a legutoljára érkező bábuknak.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Ne zárj be egy bábut a céledben</h2>
      <p>Megállhatsz egy másik játékos csúcsában, így egy másik játékos bábuja a te célodban is kiköthet. Csak akkor nyersz, ha a célod mind a 10 mezőjén a saját bábuid állnak. Ha az a bábu nem tud lépni, senki sem mozdíthatja, és nem nyerhetsz, amíg mellette fel nem szabadul egy mező.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "A felső cél csúcs kilenc piros bábuval és egy kék bábuval egészen hátul, fehér gyűrűvel jelölve. A kék bábut piros bábuk veszik körül.",
  tekst: "A hátul lévő kék bábu nem tud lépni, és a piros nem tudja megtölteni a célt.",
})}
      <p>Hagyj egy mezőt szabadon egy ilyen bábu mellett, hogy el tudjon menni. A Leapstone számítógépe ezt beleszámolja: az a lépés, amely egy másik játékos bábuját a saját céljában csapdába ejti, alacsonyabb pontot kap. A szabályok senkit nem kényszerítenek arra, hogy elhagyja a célodat, így a másik játékos szándékosan is otthagyhat ott egy bábut.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blokkolj egy ugrást, vagy hagyd</h2>
      <p>Egy ugráshoz üres mező kell, ahová érkezhet. Töltsd meg azt a mezőt, és az ugrás eltűnik. Két egymás utáni bábut sem lehet átugrani.</p>
      <p>A te bábuid a másik játékosnak is ugródeszkák. A bal oldali képen a kék egyetlen lépésben átszel két piros bábut. A jobb oldalin a piros egy bábut az első érkezési mezőre mozgatott, és a kék már csak lépni tud.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Egy kék bábu két piros bábuval egy sorban, mindegyik mögött egy üres mező. Nyilak mutatják a kék bábu két ugrását.",
          tekst: "Előtte: a kék két ugrást tehet.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Ugyanaz a sor, miután a piros a távolabbi bábuját az első érkezési mezőre mozgatta. A kék bábu után két piros bábu áll egymás mellett.",
          tekst: "Utána: a piros egy bábut mozgatott. A kéknek nincs ugrása.",
        })}
      </div>
      <p>A blokkolásra fordított lépés olyan lépés, amelyet nem a saját haladásodra fordítasz, ezért akkor blokkolj, ha az ugrás többet ad a másik játékosnak, mint amennyit a lépésed neked. Fordítva is igaz, amikor létrát építesz: a lépésed után a másik játékos lép először, így az egyik végén álló bábuja előbb használja a létrádat, mint te. A legnehezebb szinten a számítógép a lépése kiválasztása előtt megnézi minden ellenfele legjobb válaszát.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Haladj tovább</h2>
      <ul>
        <li><a href="/play/">Játssz a számítógép ellen a böngészőben</a>, és próbálj ki egy létrát.</li>
        <li><a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a>: hogyan működik a kétszemélyes játék.</li>
        <li><a href="/hu/szabalyok/csillaghalma">A csillaghalma szabályai</a>, lépések, ugrások és sorozatok képeivel.</li>
      </ul>
      <p><a href="/hu/utmutatok/csillaghalma-online-baratokkal">Csillaghalma online barátokkal</a></p>
      <p><a href="/hu/utmutatok/halma-vagy-csillaghalma">Halma vagy csillaghalma</a></p>
      <p><a href="/hu/utmutatok/csillaghalma-3-jatekosnak">Csillaghalma 3 játékosnak</a></p>
    </section>`;

export default {
  nav: "Csillaghalma-stratégia",
  titel: "Csillaghalma-stratégia: 6 tipp képekkel | Leapstone",
  beschrijving: "Csillaghalma-stratégia: építs létrákat, tartsd együtt a bábuidat, használd a közepét, töltsd meg a célt hátulról, és tudd, mikor blokkolj ugrást.",
  h1: "Csillaghalma-stratégia",
  intro: "Hat tipp a csillag alakú táblához, mindegyik a valódi szabályokból vett képpel: létrák, lemaradók, a közép, a cél megtöltése és az ugrások blokkolása.",
  inhoud,
};
