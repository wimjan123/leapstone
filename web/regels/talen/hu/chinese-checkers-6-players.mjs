// A Csillaghalma 6 játékosnak magyar útmutató (302. feladat, 294. feature): /hu/utmutatok/csillaghalma-6-jatekosnak.
// Tartalom: az angol útmutató ../en/chinese-checkers-6-players.mjs (a szabályok a crates/halma-core-ból, lásd docs/plan.md, 302. feladat), mondatról mondatra magyarul.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Hogyan indul a játék</h2>
      <p>Minden játékosnak 10 bábuja van, és a csillag mind a 6 csúcsa használatban van. Így 60 bábu áll a 121 mezős táblán. A középső 61 mező az elején üres.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "A csillag alakú tábla mind a 6 csúcsában 10 bábuval, 6 színben",
  tekst: "6 játékos, 6 csúcs, 60 bábu.",
})}
      <p>Az 1. játékos, a piros, lép először, az alsó csúcsból. A sor ezután az 1. játékostól a 6. játékosig megy, a 6. játékos után pedig megint az 1. játékos jön. A játékosok a csúcsaik sorrendjében vannak megszámozva a csillag körül, így az utánad következő játékos mindig a tiéd melletti csúcsban kezd. Egy lépés egy egyszerű lépés vagy egy ugrássorozat egy bábuval. A lépésekről és ugrásokról lásd a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályait</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Minden cél tele van az elején</h2>
      <p>Akkor nyersz, ha mind a 10 bábudat átviszed a tábla túloldalán lévő csúcsba. 6 játékosnál ez az a csúcs, ahol a veled szemben lévő játékos kezd, így egyik cél sem üres: mindegyik egy másik játékos bábuival van tele az elején. A pirosnak a cél a felső csúcs, ahol a 4. játékos kezd.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "A csillag alakú tábla 6 teli csúccsal. Egy szaggatott gyűrű jelöli a felső csúcsot, a piros játékos célját, amelyben a szemben lévő játékos bábui állnak.",
  tekst: "A piros célja a szemközti csúcs, tele a 4. játékos bábuival.",
})}
      <p>Csak üres mezőre érkezhetsz, ezért a szemben lévő játékosnak el kell hagynia a csúcsát, mielőtt te megtöltheted, neked pedig el kell hagynod a tiédet, mielőtt ő megtöltheti. 2 játékosos játékban ennyi az egész. 6 játékosnál mindkét játékosnak át kell verekednie magát a másik 4 tömegén is.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Zsúfolt közép</h2>
      <p>Minden cél a tábla túloldalán van, és a csúcsok csak a középen át kapcsolódnak egymáshoz, ezért mind a 60 bábunak ugyanazon a 61 mezőn kell átkelnie. Az elején még senki sem kelt át, és a közép gyorsan megtelik.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Egy piros bábu egyetlen lépésben háromszor ugrik: egy kék bábun, majd egy zölden, majd egy lilán át. Az 1, 2 és 3 számok az érkezési mezőket jelölik.",
  tekst: "Minden színű bábu ugródeszka.",
})}
      <p>Bármilyen színű bábut átugorhatsz. A másik 5 játékos bábui ugródeszkák neked, a tieid pedig mind az 5 játékosnak. A bábuk sora, amelyet a középen hagysz, létra bárkinek, aki eléri, és az utánad következő játékosnak van először lehetősége.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokkolás 5 ellenféllel</h2>
      <ul>
        <li><strong>Töltsd ki az érkezési mezőt:</strong> egy ugráshoz üres mező kell közvetlenül a bábu mögött. Ha oda lépsz egy bábuval, az ugrás eltűnik minden játékos elől, aki élni akart vele.</li>
        <li><strong>Vigyázz a létrákra, amiket építesz:</strong> a lépésed után a másik 5 játékos lép, mielőtt újra te jössz. Egy létra mindegyiküknek segít.</li>
        <li><strong>Bárki blokkolhatja a célt:</strong> bármelyik másik játékos bábuja a célodban megakadályozza, hogy befejezd, nem csak a szemben lévő játékosé. A cél mind a 10 mezőjén a saját bábuidnak kell állnia.</li>
      </ul>
      <p>A <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippek</a> megmutatják, hogyan néz ki egy blokkolt ugrás, és hogyan ne zárd be egy másik játékos bábuját a saját célodba.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Mennyi ideig tart egy játék</h2>
      <p>A 6 játékosos játékban 60 bábut kell mozgatni, és a te lépésed és a következő között a másik 5 játékos mindegyike egyet lép. A játék akkor sem ér véget, amikor az első játékos befejezi.</p>
      <ul>
        <li><strong>Nyerj, és játssz tovább:</strong> az első játékos, aki megtölti a célt, nyer, a többiek pedig tovább játszanak a következő helyekért. Aki már végzett, azt kihagyják, a bábui pedig ugródeszkaként a táblán maradnak. A játék akkor ér véget, amikor már csak egy játékos játszik.</li>
        <li><strong>Feladás:</strong> a bábuid lekerülnek a tábláról, így többé nem akadályoznak és nem segítenek senkit, a többiek pedig tovább játszanak.</li>
        <li><strong>Idő (online):</strong> egy online játékban minden lépésnek időkorlátja van, amelyet a játékot indító játékos állít be: 15 másodperc, 30 másodperc, 1 perc, 2 perc vagy korlát nélkül. A 6 lépésből álló kör legfeljebb a korlát 6-szorosáig tart, tehát 30 másodpercnél legfeljebb 3 percig. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod, és a játék nélküled folytatódik.</li>
      </ul>
      <p>Kevesebb játékossal játszott játékról a <a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a> oldalon olvashatsz.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hol játszhatsz 6 játékossal a Leapstone-ban</h2>
      <ul>
        <li><strong>A számítógépek ellen, azonnal:</strong> nyisd meg a <a href="/play/">Leapstone-t a böngészőben</a>, koppints a Számítógép gombra, válaszd a csillag alakú táblát és az 5 számítógépet. Te vagy az 1. játékos, így te lépsz először. A számítógépek egymás után lépnek, mindegyik rövid szünettel, így követni tudod minden lépést. A számítógépeknek a Könnyű, Normál vagy Nehéz szintet választhatod.</li>
        <li><strong>Egy telefonon:</strong> koppints a Játék gombra, válaszd a csillag alakú táblát és a 6 játékost, majd koppints egy bábura, hogy az adott helyet ember és számítógép között átváltsd.</li>
        <li><strong>Online barátokkal:</strong> koppints a Barátok gombra, válaszd a csillag alakú táblát, a 6 játékost és a lépésenkénti időt, és küldd el a meghívólinket. A játék akkor indul, amikor mind a 6 hely foglalt.</li>
        <li><strong>Gyors játékok:</strong> az Online játék 2 vagy 4 játékosos játékokat talál, ezért 6 játékosra nincs gyors játék.</li>
      </ul>
    </section>`;

export default {
  nav: "Csillaghalma 6 játékosnak",
  titel: "Csillaghalma 6 játékosnak: a teljes tábla | Leapstone",
  beschrijving: "Hogyan működik a csillaghalma 6 játékossal: 60 bábus teli csillag, zsúfolt közép, blokkolás, mennyi ideig tart a játék, és hol játszhatod.",
  h1: "Csillaghalma 6 játékosnak",
  intro: "Hogyan működik a 6 játékosos játék: mind a 6 csúcs tele van, a tábla túloldalán lévő csúcsért versenyeztek, és a játék az első játékos befejezése után is folytatódik.",
  inhoud,
};
