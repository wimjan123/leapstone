// A Halma vagy csillaghalma magyar útmutató, 300. feladat. Tartalom: ../en/halma-vs-chinese-checkers.mjs mondatról mondatra magyarul.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Csillaghalma: a csillag alakú tábla, 121 mező",
    alt: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban és 10 kék bábuval a felső csúcsban",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: a négyzet alakú tábla, 256 mező",
    alt: "A négyzet alakú tábla 19 piros bábuval a bal felső sarokban és 19 kék bábuval a jobb alsó sarokban",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Csillag alakú tábla: hat szomszéd, ebből három itt üres",
    alt: "Egy piros bábu fehér gyűrűvel körülvéve. Hat szomszédja közül három üres és meg van jelölve; a másik háromon bábu áll.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Négyzet alakú tábla: nyolc szomszéd, ebből öt itt üres",
    alt: "Egy piros bábu fehér gyűrűvel körülvéve. Nyolc szomszédja közül öt üres és meg van jelölve; a másik háromon bábu áll.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">A rövid válasz</h2>
      <p>A Halmát négyzet alakú táblán játsszák, a csillaghalmát pedig hatágú csillag alakú táblán. Mindkét játékban lépésekkel és ugrásokkal viszed át a bábuidat a táblán, és az nyer, aki elsőként tölti meg a túloldali tábort.</p>
      <p>A tábla, a lépések iránya, a játékosok száma és az egyes játékosok bábuinak száma különbözik. A <a href="/hu/szabalyok/mi-az-a-sternhalma">Sternhalma</a> a Halma neve csillag alakú táblán, tehát ugyanaz a játék, mint a csillaghalma.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">A táblák</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>A csillaghalma</strong> csillag alakú táblát használ: 121 mező, mind a hat végén egy 10 mezős csúccsal. Egy csúcs háromszög, 4, 3, 2 és 1 mezős sorokból.</li>
        <li><strong>A Halma</strong> négyzet alakú táblát használ: 16 × 16 mező, összesen 256. A tábor egy sarokban áll. Egy nagy tábor 5, 5, 4, 3 és 2 mezős sorokból áll, egy kis tábor 4, 4, 3 és 2 mezősekből.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Irányok: hat vagy nyolc</h2>
      <p>A csillag alakú táblán egy mezőnek hat szomszédja van. A négyzet alakún nyolc, mert az átlók is számítanak. A lépés egy üres szomszédos mezőre vezet. Az ugrás átmegy egy bábun a tiéd mellett, egyenes vonalban, a mögötte lévő üres mezőre, ezen irányok bármelyikében, hátrafelé is.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>A szélén lévő mezőnek kevesebb szomszédja van, a négyzet alakú tábla sarkának pedig három. Hat irány három egyenest ad egy mezőn át a csillag alakú táblán. Nyolc irány négy egyenest ad a négyzet alakú táblán: vízszintesen, függőlegesen és két átlóban.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Játékosok és bábuk</h2>
      <ul>
        <li><strong>Csillaghalma:</strong> 2, 3, 4 vagy 6 játékos. Mindenkinek 10 bábuja van, így a táblán 20, 30, 40 vagy 60 bábu áll.</li>
        <li><strong>Halma:</strong> 2 vagy 4 játékos. 2 játékosnál mindenkinek 19 bábuja van, összesen 38. 4 játékosnál mindenkinek 13 bábuja van, összesen 52.</li>
      </ul>
      <p>A négyzet alakú táblán a Leapstone-ban nincs játék 3 vagy 6 játékosnak. Háromfős játékhoz olvasd el ezt: <a href="/hu/utmutatok/csillaghalma-3-jatekosnak">Csillaghalma 3 játékosnak</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Ami ugyanaz</h2>
      <ul>
        <li><strong>Egy lépés:</strong> egy lépés, vagy ugrások láncolata egy bábuval. Te döntöd el, hol ér véget a lánc, és ugrás után már nem léphetsz.</li>
        <li><strong>Bármilyen szín:</strong> bármilyen színű bábut átugorhatsz, a sajátodat is. A bábu, amelyet átugrasz, ott marad, ahol van. Semmit sem ütnek le.</li>
        <li><strong>A cél:</strong> az indulási táborral szemközti tábor. Minden mezőjén a saját bábuidnak kell állnia. Amíg egy másik játékos bábuja ott áll, nem fejezheted be.</li>
        <li><strong>A győzelem:</strong> az nyer, aki először tölti meg a célt. 2 játékosnál ekkor véget ér a játék. Többnél a többiek tovább játszanak a következő helyekért, és aki már végzett, azt kihagyják.</li>
        <li><strong>Feladás és idő:</strong> ha feladod, a bábuid lekerülnek a tábláról. Egy online játékban minden lépésnek időkorlátja van, és ha egymás után 3 lépést kihagysz, feladod.</li>
      </ul>
      <p>Olvasd el a <a href="/hu/szabalyok/csillaghalma">csillaghalma</a> és a <a href="/hu/szabalyok/halma">Halma</a> teljes szabályait.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Melyik táblát válaszd a Leapstone-ban</h2>
      <ul>
        <li><strong>3 vagy 6 játékos:</strong> ezt csak a csillag alakú tábla tudja.</li>
        <li><strong>Több bábu fejenként:</strong> a négyzet alakú tábla, 2 játékosnál fejenként 19 bábuval, 4 játékosnál 13-mal, szemben a csillag alakú tábla 10 bábujával.</li>
        <li><strong>Online játék:</strong> a gyors játék a csillag alakú táblán zajlik. Barátokkal és a számítógép ellen bármelyik táblát választhatod.</li>
      </ul>
      <p>A Játssz most gomb egy számítógép elleni játékot nyit meg a csillag alakú táblán. Ha a négyzet alakú táblán akarsz játszani, koppints fent a vissza nyílra, és válaszd a menüben a Négyzet alakú tábla lehetőséget.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Tovább</h2>
      <ul>
        <li><a href="/play/">Játssz a böngészőben</a>, és próbáld ki mindkét táblát.</li>
        <li><a href="/hu/utmutatok/csillaghalma-strategia">Csillaghalma stratégia</a>: hat tipp képekkel.</li>
        <li><a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a>: hogyan működik a kétszemélyes játék.</li>
      </ul>
      <p><a href="/hu/utmutatok/csillaghalma-online-baratokkal">Csillaghalma online barátokkal</a></p>
    </section>`;

export default {
  nav: "Halma vagy csillaghalma",
  titel: "Halma vagy csillaghalma: a különbségek | Leapstone",
  beschrijving: "Halma vagy csillaghalma? A négyzet és a csillag alakú tábla, hat vagy nyolc irány, játékosok és bábuk, és ami ugyanaz.",
  h1: "Halma vagy csillaghalma",
  intro: "Két játék egy ötlettel: vidd át az összes bábudat a tábla túloldalára. Miben különböznek, mi ugyanaz, és hol játszhatod mindkettőt.",
  inhoud,
};
