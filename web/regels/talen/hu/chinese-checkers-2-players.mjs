// A Csillaghalma 2 játékosnak magyar útmutató (134. feladat). Tartalom: az angol útmutató ../en/chinese-checkers-2-players.mjs
// (a szabályok a crates/halma-core-ból, lásd docs/plan.md, 122. feladat), mondatról mondatra magyarul.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Hogyan indul a játék</h2>
      <p>Minden játékosnak 10 bábuja van. A csillag két, egymással szemben lévő csúcsában kezdenek: a piros lent, a kék fent. A 20 bábu egy 121 mezős táblán áll.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban és 10 kék bábuval a felső csúcsban",
  tekst: "A piros lent kezd, a kék fent.",
})}
      <p>Az 1. játékos, a piros, lép először. Utána felváltva léptek, egyszerre egyet. Egy lépés egy egyszerű lépés vagy egy ugrássorozat egy bábuval. A lépésekről és ugrásokról lásd a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályait</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">A célod a másik játékos indulása</h2>
      <p>Akkor nyersz, ha mind a 10 bábudat átviszed abba a csúcsba, ahol a másik játékos kezdett. Az a csúcs az elején tele van az ő bábuival, a tiéd pedig a tieiddel. A pirosnak ez a fenti kép felső csúcsa.</p>
      <p>Csak üres mezőre érkezhetsz, ezért mindkettőtöknek el kell hagynia a saját csúcsát, mielőtt a másik megtölthetné. Egyikőtök sem tudja befejezni, amíg a másik egy bábuja a célban marad. És mivel ugyanazon a középen mentek át ellentétes irányban, a másik játékos bábui ugródeszkák neked, és a tieid neki. Azt, hogy mit kezdj ezzel, a <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippekben</a> olvashatod.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Győzelem és feladás</h2>
      <ul>
        <li><strong>Győzelem:</strong> aki először tölti meg a célt mind a 10 bábujával, nyer, és a játék azonnal véget ér. A másik játékos nem játszik tovább.</li>
        <li><strong>Feladás:</strong> a bábuid lekerülnek a tábláról, és a másik játékos nyer.</li>
        <li><strong>Idő (online):</strong> egy online játékban minden lépésnek időkorlátja van. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miben különbözik a 3, 4 és 6 játékos</h2>
      <ul>
        <li><strong>3 játékos:</strong> a bábuk minden második csúcsban indulnak, és a három cél az elején üres. Az nyer, aki először végez; a többiek tovább játszanak a következő helyekért, és aki már végzett, azt kihagyják.</li>
        <li><strong>4 játékos:</strong> két pár egymás melletti csúcs. A célod az elején tele van egy másik játékos bábuival. Az első befutó után a játék folytatódik, mint 3 játékosnál.</li>
        <li><strong>6 játékos:</strong> mind a hat csúcs. A táblán 60 bábu van, szemben a 2 játékosnál lévő 20-szal.</li>
      </ul>
      <p>Mivel a táblán csak 20 bábu van, kevesebb bábut lehet átugrani, ezért a magad építette létrák többet számítanak. A <a href="/hu/szabalyok/csillaghalma">szabályoldalon</a> minden induláshoz van kép.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hol játszhatsz 2 játékossal a Leapstone-ban</h2>
      <ul>
        <li><strong>A számítógép ellen, azonnal:</strong> nyisd meg a <a href="/play/">Leapstone-t a böngészőben</a>, koppints a Számítógép gombra, és válaszd a csillag alakú táblát. Alapértelmezés szerint egy számítógép van, tehát ez 2 játékosos játék. Kiválaszthatod a Könnyű, Normál vagy Nehéz szintet, és te vagy az 1. játékos, így te lépsz először. A Könnyű a három véletlen lépés közül a legjobbat választja. A Normál azt a lépést választja, amelyik a legtöbbet halad a célja felé. A Nehéz azt is megnézi, hogyan válaszolhatnak az ellenfelei, és a saját következő lépését is.</li>
        <li><strong>Online játék, az alkalmazásban:</strong> gyors játék a csillag alakú táblán 2 játékosnak, egy másik, veled azonos szintű játékos ellen, lépésenként 30 másodperccel. Néhány online ellenfél számítógépes játékos lehet.</li>
        <li><strong>Baráttal:</strong> küldj meghívólinket, és állítsd be magad a lépésenkénti időt. Vagy add körbe az egy telefont.</li>
      </ul>
      <p><a href="/hu/utmutatok/csillaghalma-online-baratokkal">Csillaghalma online barátokkal</a></p>
      <p><a href="/hu/utmutatok/csillaghalma-3-jatekosnak">Csillaghalma 3 játékosnak</a></p>
    </section>`;

export default {
  nav: "Csillaghalma 2 játékosnak",
  titel: "Csillaghalma 2 játékosnak: indulás és szabályok | Leapstone",
  beschrijving: "Hogyan működik a csillaghalma 2 játékossal: hol indul a 10 bábu, ki lép először, hogyan nyersz vagy adod fel, és hol játszhatsz ingyen.",
  h1: "Csillaghalma 2 játékosnak",
  intro: "Hogyan működik a kétszemélyes játék a csillag alakú táblán: az indulás, ki lép először, hogyan nyersz, és hol játszhatod.",
  inhoud,
};
