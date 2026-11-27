// A Csillaghalma 3 játékosnak magyar útmutató (299. feladat). Tartalom: az angol útmutató ../en/chinese-checkers-3-players.mjs
// (139. feladat, a szabályok a crates/halma-core-ból), mondatról mondatra magyarul.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Hogyan indul a játék</h2>
      <p>Minden játékosnak 10 bábuja van, így 30 bábu áll a 121 mezős táblán. A csillag minden második csúcsában kezdenek: a piros lent, a kék bal oldalt fent, a zöld jobb oldalt fent. A köztük lévő három csúcs üres.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban, 10 kék bábuval a bal felső csúcsban és 10 zöld bábuval a jobb felső csúcsban",
  tekst: "A piros lent, a kék bal oldalt fent, a zöld jobb oldalt fent.",
})}
      <p>Az 1. játékos, a piros, lép először. Utána a kék a 2. játékos, a zöld a 3. játékos, és a zöld után ismét a piros jön. Egy lépés egy egyszerű lépés vagy egy ugrássorozat egy bábuval. A lépésekről és ugrásokról lásd a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályait</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Három cél, az elején mind üres</h2>
      <p>A célod a kiindulási csúcsoddal szemben lévő csúcs, és 3 játékosnál ez üresen kezd. Ez az üres csúcs a másik két játékos kiindulása között van: a piros célja fent, a kéké jobb oldalt lent, a zöldé bal oldalt lent van.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "A csillag alakú tábla három játékosnak. Az egyes játékosok színével rajzolt szaggatott körök jelölik a három üres célt: a piros fent, a kék jobb oldalt lent, a zöld bal oldalt lent.",
  tekst: "Minden cél a játékosa színében van.",
})}
      <p>Akkor nyersz, ha mind a 10 bábudat átviszed a célodba. Mind a 10 mezőn a saját bábuidnak kell állnia. Senki sem indul a célodban, de megállhatsz bármelyik üres mezőn, így egy másik játékos bábuja később odaérkezhet. Amíg ott áll, nem tudod befejezni.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Győzelem, és ami utána történik</h2>
      <ul>
        <li><strong>Győzelem:</strong> az nyer, aki először tölti meg a célt. A játék itt nem ér véget: a másik kettő tovább játszik a következő helyekért, és aki már végzett, azt kihagyják. A játék akkor ér véget, amikor már csak egy játékos játszik.</li>
        <li><strong>Feladás:</strong> a bábuid lekerülnek a tábláról, és a másik kettő tovább játszik. Ha egy második játékos is feladja, mielőtt bárki végzett volna, az utolsó megmaradt játékos nyer.</li>
        <li><strong>Idő (online):</strong> egy online játékban minden lépésnek időkorlátja van, amelyet a játékot indító játékos állít be. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod, és a játék nélküled folytatódik.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miben különbözik a 2 játékosos játéktól</h2>
      <ul>
        <li><strong>Több bábu:</strong> 30 van a táblán, szemben a 20-szal, amely 2 játékosnál van.</li>
        <li><strong>Üres célok:</strong> 2 játékosnál a célod az elején tele van a másik játékos bábuival. 3 játékosnál üres.</li>
        <li><strong>Két ellenfél:</strong> a lépésed után két másik játékos lép, mielőtt újra te jössz. Mindkettejük bábui ugródeszkák neked, és a tieid nekik. Egy általad épített létrát mindketten használhatnak, és az utánad következő játékos kapja az első lehetőséget.</li>
        <li><strong>A játék folytatódik:</strong> 2 játékosnál a játék véget ér, ha egyikőtök végzett. 3 játékosnál a második és a harmadik helyért folytatódik.</li>
      </ul>
      <p>A kettesben játszott játékról olvasd el a <a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a> útmutatót. A <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippek</a> a lépésekről és ugrásokról szólnak, ezek 3 játékosnál ugyanazok.</p>
      <p><a href="/hu/utmutatok/csillaghalma-online-baratokkal">Csillaghalma online barátokkal</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hol játszhatsz 3 játékossal a Leapstone-ban</h2>
      <ul>
        <li><strong>A számítógép ellen, azonnal:</strong> nyisd meg a <a href="/play/">Leapstone-t a böngészőben</a>, koppints a Számítógép gombra, és válaszd a csillag alakú táblát és a 2 számítógépet. Te vagy az 1. játékos, így te lépsz először. A számítógépeknek Könnyű, Normál vagy Nehéz szintet választhatsz.</li>
        <li><strong>Egy telefonon:</strong> koppints az „Ezen a telefonon” gombra, válaszd a csillag alakú táblát és a 3 játékost, majd koppints egy bábura, hogy az adott helyet ember és számítógép között váltsd.</li>
        <li><strong>Online barátokkal:</strong> koppints a Barátok gombra, válaszd a csillag alakú táblát, a 3 játékost és a lépésenkénti időt, és küldd el a meghívólinket. A játék akkor indul, amikor mind a 3 hely foglalt.</li>
        <li><strong>Gyors játékok:</strong> az Online játék 2 vagy 4 játékosos játékokat talál, így 3 játékosra nincs gyors játék.</li>
      </ul>
    </section>`;

export default {
  nav: "Csillaghalma 3 játékosnak",
  titel: "Csillaghalma 3 játékosnak: szabályok | Leapstone",
  beschrijving: "Hogyan működik a csillaghalma 3 játékossal: hol indul a 30 bábu, melyik üres csúcs kinek a célja, ki lép először, és hogyan nyersz.",
  h1: "Csillaghalma 3 játékosnak",
  intro: "Hogyan működik a háromszemélyes játék a csillag alakú táblán: az indulás, a három cél, ki lép először, hogyan nyersz, és hol játszhatod.",
  inhoud,
};
