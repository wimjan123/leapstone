// A Csillaghalma-megnyitások magyar útmutató (303. feladat, 294. feature): /hu/utmutatok/csillaghalma-megnyitas.
// Tartalom: az angol útmutató ../en/chinese-checkers-opening-moves.mjs (minden szám és lépés a crates/halma-core ellen ellenőrizve), mondatról mondatra magyarul.
// A sor a csúcsodtól azonos távolságra lévő mezők halmaza; az egyszerű lépés 1 sort visz előre, az ugrás 2-t. Nincsenek kitalált „szakértők” vagy történelem.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Az első lépésed: 14 lehetőség</h2>
      <p>Az elején a 10 bábud háromszöget alkot 4, 3, 2 és 1 bábus sorokban, és az első sor a tábla közepe felé néz. A háromszögben nincs üres mező, ezért a bábu csak a közvetlenül előtte lévő sorba mehet. Így 14 első lépés marad: az első sor 4 bábuja közül mindegyik 2 mezőre léphet egyet (8 egyszerű lépés), a második sor 3 bábuja közül pedig mindegyik átugorhat egy első sorbeli bábut 2 mezőre (6 ugrás). A többi 3 bábu még nem tud mozdulni.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "A piros csúcs alul a 10 bábujával, előtte a következő sorban 5 üres mezővel, körrel jelölve.",
  tekst: "Minden első lépés ezen az 5 mezőn valamelyikén ér véget.",
})}
      <p>Ebben az útmutatóban a sor a csúcsod előtt húzódó mezősor, az elülső éllel párhuzamosan, és a haladást sorokban számoljuk. Az egyszerű lépés 1 sort visz előre, az ugrás 2 sort. Minden játékosnak ugyanaz a 14 első lépése van, 2, 3, 4 vagy 6 játékossal és a csillag bármelyik csúcsáról, mert belülről minden csúcs egyformán néz ki.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">1. megnyitás: ugorj ki, aztán szabadítsd fel a hegyet</h2>
      <p>A csúcsod hegyében álló bábu van a legmesszebb a céltól, és az elején nem tud mozdulni: csak akkor ugorhat át egy bábut, ha mögötte üres a mező. A második sorból induló ugrás pont ilyen mezőt csinál.</p>
      <ol>
        <li><strong>1. lépés:</strong> a második sorod jobb szélén álló bábu átugorja az előtte álló bábut. A csúcsod előtti sorba érkezik, és 2 sort nyer.</li>
        <li><strong>2. lépés:</strong> a hegyben álló bábu egy lépésben kétszer ugrik: először az 1. lépés által kiürített mezőre, aztán át a második sor egy bábuján. 4 sort nyer.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "A piros csúcs az 1. lépés után. A hegyben álló bábun kör van, és az 1 és 2 számú nyíl mutatja az ugrásait a kiürített mezőn át a csúcs előtti sorba.",
  tekst: "Az 1. lépés után a hegyi bábu 2 ugrással kiugrik.",
})}
      <p>Ez 6 sor 2 lépésben. Kipróbáltunk minden módot 2 lépés lejátszására, és 6 a legtöbb, amit nyerhetsz. Csak 4 lépéspár éri el: a második sor bármelyik szélén álló bábu ugrik, a 2 irány bármelyikében, és a hegyi bábu követi. A második sor közepén álló bábu nem jó, mert bezárva tartja a hegyet.</p>
      <p>Mindkét bábu most a csúcsod előtti sorban áll, köztük egy üres mezővel. Ez a létra első foka.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">2. megnyitás: 4 lépés 4 különböző bábuval</h2>
      <p>4 lépés alatt legfeljebb 13 sort nyerhetsz, és csak akkor érsz el odáig, ha minden lépésben másik bábu mozdul. Ez a sorozat megoldja:</p>
      <ol>
        <li><strong>1. lépés:</strong> az első sor jobb szélén álló bábu egyet lép előre. 1 sort nyer.</li>
        <li><strong>2. lépés:</strong> a harmadik sor jobb szélén álló bábu kétszer ugrik. 4 sort nyer.</li>
        <li><strong>3. lépés:</strong> a második sor bal szélén álló bábu kétszer ugrik. 4 sort nyer.</li>
        <li><strong>4. lépés:</strong> a hegyben álló bábu kétszer ugrik. 4 sort nyer.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "A piros csúcs az elején. A mozduló 4 bábun 1-től 4-ig szám van, a lépések sorrendjében.",
          tekst: "Előtte: a mozduló bábuk sorrendben.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "A piros csúcs 4 lépés után, a csúcs előtti sorokban a 4 mezővel, ahová a számozott bábuk érkeztek, és a csúcsban hagyott 4 lyukkal.",
          tekst: "Utána: hová érkeztek.",
        })}
      </div>
      <p>Minden lépés előkészíti a következőt. A 2. és 3. lépés az előbb mozdult bábu átugrásával végződik, a 4. lépés pedig a 3. lépés által hagyott lyukon át indul. Mind a 4 bábu a tábla saját felére érkezik.</p>
      <p>Vannak más sorozatok is, amelyek elérik a 13-at. Bennük közös az ötlet: keresd azt a lépést, amely lyukat vagy lépcsőkövet hagy a következőnek, és a hegyi bábut legkésőbb a 4. lépésre engedd ki.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Hibák az első lépésekben</h2>
      <ul class="tips">
        <li><strong>Minden körben ugyanazzal a bábuval lépni.</strong> Az egyedül futó bábu 4 lépéssel 5 sort nyer, míg 4 különböző bábu 13-at. A többi bábud ráadásul ott marad, ahol volt.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "A piros csúcs az elején. A második sor egy bábuja 4 lépést tesz egymás után egy vonalon, nyilakkal és az 1-től 4-ig számokkal, és egyedül ér véget a tábla közepe közelében.",
  tekst: "Egy bábu, 4 lépés, 5 sor.",
})}
      <ul class="tips">
        <li><strong>Csak az első sorral lépegetni.</strong> 4 egyszerű lépés 4 sort nyer. Utánuk a hegyben álló bábu még mindig nem tud mozdulni, így hátul marad, miközben a többiek előremennek.</li>
        <li><strong>Oldalra lépni.</strong> A sor mentén tett lépés 0 sort nyer. Az 1. megnyitás 1. lépése után az elöl álló bábu léphet a mellette lévő mezőre, és haladásnak látszik, de a lépés kárba vész.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Hogyan tovább</h2>
      <p>Körülbelül 4 lépés után a két sereg közel kerül egymáshoz, és a fenti megnyitások átadják a helyüket a középjátéknak. Nem kell megjegyezned a sorozatokat: elég azt megjegyezned, hogy minden lépésnek elő kell készítenie a következőt.</p>
      <ul>
        <li><a href="/play/">Játssz a számítógép ellen a böngészőben</a>, és próbáld ki az 1. vagy 2. megnyitást.</li>
        <li><a href="/hu/utmutatok/csillaghalma-strategia">Csillaghalma-stratégia</a>: létrák, a bábuk együtt tartása és a célod kitöltése.</li>
        <li><a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a>: hogyan megy a játék kettesben.</li>
        <li><a href="/hu/szabalyok/csillaghalma">A csillaghalma szabályai</a>, képekkel a lépésekről, ugrásokról és láncokról.</li>
      </ul>
    </section>`;

export default {
  nav: "Csillaghalma megnyitások",
  titel: "Csillaghalma megnyitások: 2 megnyitás | Leapstone",
  beschrijving: "Csillaghalma megnyitások: hogyan ugorj ki a csúcsodból, szabadítsd fel a hegyi bábut a 2. lépésre, nyerj 13 sort 4 lépésben, és kerüld a hibákat.",
  h1: "Csillaghalma megnyitások",
  intro: "A jó csillaghalma-megnyitás a második sorból ugrik ki, minden körben másik bábut használ, és a hegyben álló bábut a 2. vagy 4. lépésre kiengedi. Két megnyitás képekkel, és a kerülendő hibák.",
  inhoud,
};
