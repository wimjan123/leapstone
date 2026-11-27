// A Csillaghalma 4 játékosnak magyar útmutató (301. feladat, 294. feature): /hu/utmutatok/csillaghalma-4-jatekosnak.
// Tartalom: az angol útmutató ../en/chinese-checkers-4-players.mjs, mondatról mondatra magyarul (a szabályok a crates/halma-core-ból, lásd docs/plan.md, 301. feladat).
// Aki egy szabályt módosít, minden nyelven módosítja.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Hogyan oszlik fel a tábla</h2>
      <p>Minden játékosnak 10 bábuja van, így 40 bábu áll a 121 mezős táblán. A négy kezdőcsúcs két pár egymás melletti csúcs: a piros az alsó csúcsban és a kék a bal alsó csúcsban, a zöld a felső csúcsban és a sárga a jobb felső csúcsban.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban, 10 kék bábuval a bal alsó csúcsban, 10 zöld bábuval a felső csúcsban és 10 sárga bábuval a jobb felső csúcsban. A bal felső és a jobb alsó csúcs üres.",
  tekst: "A piros az alsó, a kék a bal alsó, a zöld a felső, a sárga a jobb felső csúcsban.",
})}
      <p>Az 1. játékos, a piros, lép először. Utána a kék a 2. játékos, a zöld a 3. játékos, a sárga a 4. játékos, és a sárga után ismét a piros jön. Egy lépés egy egyszerű lépés vagy egy ugrássorozat egy bábuval. A lépésekről és ugrásokról lásd a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályait</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ki kivel áll szemben</h2>
      <p>A csúcsok párokba állnak a táblán át: a piros a zölddel áll szemben, a kék a sárgával. A célod a veled szemben lévő csúcs. A piros oda megy, ahol a zöld indul, a zöld oda, ahol a piros indul, a kék oda, ahol a sárga indul, a sárga pedig oda, ahol a kék indul.</p>
      <p>Mint a 2 játékosos játékban, minden cél az elején tele van a veled szemben álló játékos bábuival, ezért csak akkor érkezhetsz oda, ha ők már elhagyták. 3 játékosnál a célok üresen indulnak, így 4 játékosnál senki sem végezhet azonnal. A négy cél négy különböző csúcs, ezért senki más nem akarja a te célodat: aki már végzett, soha nem akadályoz senkit.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">A két üres csúcs</h2>
      <p>A bal felső és a jobb alsó csúcsban nincs bábu. Egyik sem senki kezdőhelye és senki célja. A bal felső a kék és a zöld között van, a jobb alsó a sárga és a piros között.</p>
      <p>Bármelyik üres mezőre léphetsz vagy ugorhatsz, ezért átkelhetsz ezeken a csúcsokon, vagy megállhatsz bennük. Az ott álló bábu viszont még nincs célban. Egy üres csúcsban nincs mit átugrani, amíg valaki bábukat nem visz oda.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Mi változik a taktikádban</h2>
      <ul>
        <li><strong>Két átkelés egyszerre:</strong> a piros és a zöld egymás felé keresztezi a táblát, és a kék meg a sárga is. Mindkét vonal a középen át vezet, ezért a közép zsúfoltabb, mint a 2 játékosos játékban, ahol csak egy vonal keresztezi a táblát.</li>
        <li><strong>Három játékos lép a te köreid között:</strong> a tábla két lépésed között jobban változik, mint a 2 játékosos játékban. Nézd meg újra minden kör elején, és csak akkor tervezd meg az ugrássorozatodat. Az utánad lépő játékos soha nem az, aki veled szemben áll.</li>
        <li><strong>A bábuk mindenkinek segítenek:</strong> a másik három minden bábuja ugródeszka neked, és a tieid nekik. A veled szemben álló játékos bábui ellenkező irányba mozognak, mint a 2 játékosos játékban.</li>
        <li><strong>Hely a kerülésre:</strong> ha a közép tele van, az üres csúcsok nyílt terepet jelentenek a kezdőcsúcsok mellett. Az egyiken át vezető út a tömeg megkerülése lehet.</li>
        <li><strong>A feladó játékos felszabadítja a célodat:</strong> ha a veled szemben álló játékos feladja, a bábui lekerülnek a tábláról, így a célod azonnal üres.</li>
      </ul>
      <p>A létrákról, a lemaradókról és a cél hátulról való megtöltéséről szóló <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippek</a> 4 játékosnál ugyanúgy érvényesek.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Győzelem, és mi történik utána</h2>
      <ul>
        <li><strong>Győzelem:</strong> aki először tölti meg a célt mind a 10 bábujával, nyer. A játék itt nem ér véget: a másik három tovább játszik a következő helyekért, és aki már végzett, azt kihagyják. Annak a játékosnak a bábui a táblán maradnak. A játék akkor ér véget, amikor már csak egy játékos játszik.</li>
        <li><strong>Feladás:</strong> a bábuid lekerülnek a tábláról, és a másik három tovább játszik. Ha a többiek is feladják, az utolsó megmaradt játékos nyer.</li>
        <li><strong>Idő (online):</strong> egy online játékban minden lépésnek időkorlátja van. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod, és a játék nélküled folytatódik.</li>
      </ul>
      <p>A kevesebb játékossal játszott játékokról olvasd el a <a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a> útmutatót. A <a href="/hu/szabalyok/csillaghalma">szabályoldalon</a> minden induláshoz van kép.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hol játszhatsz 4 játékossal a Leapstone-ban</h2>
      <ul>
        <li><strong>A számítógép ellen, azonnal:</strong> nyisd meg a <a href="/play/">Leapstone-t a böngészőben</a>, koppints a Számítógép gombra, és válaszd a csillag alakú táblát és a 3 számítógépet. Te vagy az 1. játékos, így te lépsz először. A számítógépeknek kiválaszthatod a Könnyű, Normál vagy Nehéz szintet.</li>
        <li><strong>Egy telefonon:</strong> koppints a Játék gombra, válaszd a csillag alakú táblát és a 4 játékost, majd koppints egy bábura, hogy az adott helyet ember és számítógép között válts.</li>
        <li><strong>Online barátokkal:</strong> koppints a Barátok gombra, válaszd a csillag alakú táblát, a 4 játékost és a lépésenkénti időt, és küldd el a meghívólinket. A játék akkor indul, amikor mind a 4 hely foglalt.</li>
        <li><strong>Gyors játék, az alkalmazásban:</strong> koppints az Online játék gombra. Amíg 2 játékosos játékot keres, koppints a Keress 4 vagy 6 játékost gombra, hogy helyette 4 játékosost keressen. Minden lépésre 30 másodperc jár. Ha 20 másodperc alatt nem csatlakozik elég játékos, számítógépes játékosok töltik be az üres helyeket, így néhány ellenfél számítógépes játékos lehet.</li>
      </ul>
    </section>`;

export default {
  nav: "Csillaghalma 4 játékosnak",
  titel: "Csillaghalma 4 játékosnak: indulás és tippek | Leapstone",
  beschrijving: "Hogyan működik a csillaghalma 4 játékossal: hogyan oszlik fel a tábla, melyik 2 csúcs marad üresen, ki kivel áll szemben, és hol játszhatsz.",
  h1: "Csillaghalma 4 játékosnak",
  intro: "4 játékosnál mindenki a csillag négy csúcsa közül az egyikben kezd, és két csúcs üres marad. A piros a zölddel áll szemben, a kék a sárgával: a célod a veled szemben lévő csúcs, amely tele van annak a játékosnak a bábuival. Itt az indulás, az üres csúcsok, a taktika, és hogy hol játszhatod.",
  inhoud,
};
