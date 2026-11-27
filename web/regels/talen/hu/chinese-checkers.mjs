// A csillaghalma (kínai dáma) magyar szabályoldala (134. feladat). Tartalom: az angol oldal ../en/chinese-checkers.mjs
// (a crates/halma-core ellen ellenőrizve, lásd docs/plan.md, 116. feladat), mondatról mondatra magyarul.
// Minden szabálynak egyeznie kell az angol oldallal; aki egy szabályt módosít, minden nyelvben módosítja.
// Ugyanazok a képek (nyelvfüggetlenek: az SVG-ben csak számjegyek vannak); az alt szövegek és a feliratok magyarul vannak.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} játékos`,
      alt:
        {
          2: "A csillag alakú tábla 10 piros bábuval az alsó csúcsban és 10 kék bábuval a felső csúcsban",
          3: "A csillag alakú tábla piros bábukkal lent, kékekkel balra fent és zöldekkel jobbra fent",
          4: "A csillag alakú tábla bábukkal négy csúcsban: piros lent, zöld fent, kék balra lent és sárga jobbra fent",
          6: "A csillag alakú tábla bábukkal mind a hat csúcsban, hat színben",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">A tábla</h2>
      <p>A csillaghalmát (kínai dámát) egy hatágú csillagon játsszák. A táblán 121 mező van, és minden csúcsban 10. A tábla belsejében minden mezőnek hat szomszédja van.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Hogyan indulnak a bábuk</h2>
      <p>Minden játékosnak 10 bábuja van, és mindegyikkel a csillag egyik csúcsában kezd. A szemközti csúcs a célod.</p>
      <ul>
        <li><strong>2 játékos:</strong> a két, egymással pontosan szemben lévő csúcs.</li>
        <li><strong>3 játékos:</strong> minden második csúcs. A három cél az elején üres.</li>
        <li><strong>4 játékos:</strong> két pár egymás melletti csúcs. Minden játékosnak egy másik játékos van szemben.</li>
        <li><strong>6 játékos:</strong> mind a hat csúcs.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">A lépések sorrendje</h2>
      <p>Az 1. játékos kezd. Utána sorban jönnek a következők, a 2. játékos, a 3. játékos és így tovább, és az utolsó játékos után újra az 1. játékos következik. A Leapstone-ban a színek a számokhoz tartoznak: piros, kék, zöld, sárga, lila és ezüst.</p>
      <p>Amikor te jössz, egyetlen bábuval lépsz, egyszer. Semmit nem ütnek le: a bábuk a táblán maradnak, amíg a játékosuk fel nem adja.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Egy lépés</h2>
      <p>Mozgass egy bábut a mellette lévő üres mezőre.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Egy piros bábu fehér gyűrűvel körülvéve. Hat szomszédja közül három üres és meg van jelölve; a másik háromon bábu áll.",
  tekst: "A piros bábu a három megjelölt mezőre léphet. A másik három szomszédos mező foglalt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Egy ugrás</h2>
      <p>Ugorj át egy, a tiéd mellett álló bábut, bármilyen színűt, és érkezz a mögötte lévő üres mezőre, egyenes vonalban. Mind a hat irányba ugorhatsz, hátrafelé is.</p>
      <ul>
        <li>A mezőnek, ahová érkezel, üresnek kell lennie.</li>
        <li>Nem ugorhatsz át két bábut egymás után, és üres mezőt sem.</li>
        <li>A bábu, amelyet átugrasz, ott marad, ahol van.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Egy piros bábu átugrik egy kék bábut a mögötte lévő üres mezőre, nyíllal jelezve.",
  tekst: "A piros bábu átugorja a kék bábut.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Ugrássorozat</h2>
      <p>Egy ugrás után ugyanaz a bábu újra ugorhat, ahányszor csak tud, bármelyik irányba. Te döntöd el, hol állsz meg. Az összes ugrás együtt egy lépés.</p>
      <ul>
        <li>Egy lépésen belül nem érkezhetsz kétszer ugyanarra a mezőre.</li>
        <li>Egy lépés vagy egy egyszerű lépés, vagy egy vagy több ugrás. Ugrás után már nem léphetsz egyszerűt.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Egy piros bábu egyetlen lépésben három ugrást tesz, egy kék, egy zöld és még egy kék bábu fölött. A három érkezési mező az 1, 2 és 3 számot viseli.",
  tekst: "Egy lépés három ugrással, a számok sorrendjében.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">A cél</h2>
      <p>Akkor nyersz, ha mind a 10 bábudat átviszed az indulási csúcsoddal szemközti csúcsba. Ennek a csúcsnak mind a 10 mezőjén a saját bábuidnak kell állnia. Amíg egy másik játékos bábuja ott áll, nem fejezheted be.</p>
      <p>Bármelyik üres mezőre érkezhetsz, a többi játékos csúcsaiban is.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Egy csillag alakú tábla három játékosnak. A piros lent kezd; a felső üres csúcs, szaggatott körökkel jelölve, a piros célja.",
  tekst: "3 játékosnál a piros lent kezd. A piros célja a felső üres csúcs.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2, 3, 4 vagy 6 játékossal</h2>
      <ul>
        <li><strong>2 játékos:</strong> aki először tölti meg a célt, nyer, és a játék véget ér.</li>
        <li><strong>3, 4 vagy 6 játékos:</strong> aki először tölti meg a célt, nyer. A többiek tovább játszanak a következő helyekért, és aki már végzett, azt kihagyják. A játék akkor ér véget, amikor már csak egy játékos játszik.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Feladás</h2>
      <p>Ha feladod, a bábuid lekerülnek a tábláról, így senkit sem akadályoznak. 2 játékosnál a másik játékos nyer. Több játékosnál a játék nélküled folytatódik, és ha egy kivételével mindenki feladja, az utolsó játékos nyer.</p>
      <p>Egy online játékban minden lépésnek időkorlátja van. A játékot indító játékos állítja be, és gyors játékban 30 másodperc. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod. A számítógép elleni és az egy telefonon játszott játékoknak nincs időkorlátja.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tippek</h2>
      <ul class="tips">
        <li><strong>Építs létrákat.</strong> Állítsd a bábukat egy sorba, köztük egy-egy üres mezővel, a célod felé mutatva. Egy bábu ekkor az egész soron végigugorhat egyetlen lépésben.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Négy bábu egy átlós sorban, köztük egy-egy üres mezővel. Egy piros bábu a sor egyik végén mind a négy fölött átugrik, négy számozott érkezési mezővel.",
  tekst: "Négy bábu egy sorban: a felső piros bábu egyetlen lépésben, négy ugrással átszeli a táblát.",
})}
        </li>
        <li><strong>Minden bábu létra.</strong> Minden színű bábut átugorhatsz, így a többi játékos bábui is segítenek neked. A te létráid pedig nekik segítenek: nézd meg, mit hagysz magad mögött.</li>
        <li><strong>Ne felejtsd el a lemaradókat.</strong> Mind a 10 bábura szükséged van otthon. Egy messze lemaradt bábu, amelynek nincs mit átugrania, körönként egy mezőt halad. Hozd előre, amíg a többi bábu még körülötte van.</li>
        <li><strong>A te indulásod az ő céljuk.</strong> 2, 4 vagy 6 játékosnál a te induló csúcsod a veled szemben lévő játékos célja, és ő nem tudja befejezni, amíg még áll ott egy bábud. Ugyanez igaz rád is.</li>
      </ul>
      <p>További tippeket képekkel a <a href="/hu/utmutatok/csillaghalma-strategia">csillaghalma-stratégia</a> útmutatóban találsz. Kétszemélyes játékhoz olvasd el a <a href="/hu/utmutatok/csillaghalma-2-jatekosnak">csillaghalma 2 játékosnak</a> útmutatót.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Kérdések</h2>
      <h3>Hányan játszhatnak csillaghalmát?</h3>
      <p>Ketten, hárman, négyen vagy hatan. Minden játékos a csillag egyik csúcsában kezd. 2, 3 vagy 4 játékosnál néhány csúcs üresen marad.</p>
      <h3>Hány golyója van egy játékosnak?</h3>
      <p>Minden játékosnak 10 golyója, vagyis bábuja van. A táblán 121 mező van: a hat csúcs mindegyikében 10, középen pedig 61.</p>
      <h3>Átugorhatod a saját bábuidat, vagy ugrálhatsz hátrafelé?</h3>
      <p>Igen. Bármilyen színű bábut átugorhatsz, a sajátodat is, a hat irány bármelyikében, hátrafelé is. Az átugrott bábu a helyén marad.</p>
      <h3>Leüthetők a bábuk a csillaghalmában?</h3>
      <p>Nem. Semmit sem ütnek le. Egy bábu csak akkor kerül le a tábláról, ha a játékosa feladja.</p>
      <h3>A kínai dáma Kínából származik?</h3>
      <p>Nem. A játék Németországban jelent meg 1892-ben Stern-Halma néven, a régebbi Halma alapján. A Chinese checkers (kínai dáma) név az Egyesült Államokból származik, 1928-ból. Olvass tovább: <a href="/hu/szabalyok/mi-az-a-sternhalma">Sternhalma</a>.</p>
      <h3>Hol játszhatsz ingyen csillaghalmát online a barátaiddal?</h3>
      <p>A Leapstone-ban, a böngészőben vagy az App Store-ból letölthető alkalmazásban. Küldj egy barátodnak meghívólinket: fiók, e-mail-cím és jelszó nélkül csatlakozik a játékodhoz. Játszhatsz a számítógép ellen is, vagy gyors játékot egy másik játékos ellen. A Leapstone ingyenes, reklámok nélkül.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Játssz csillaghalmát a Leapstone-ban</h2>
      <p>A Leapstone egy ingyenes alkalmazás csillaghalma (kínai dáma) és Halma játszására egy 3D-s, vörös lakk és arany táblán. Az alkalmazásban és a böngészőben is játszhatsz.</p>
      <ul>
        <li><strong>A számítógép ellen.</strong> Könnyű, normál vagy nehéz. Nincs szükséged internetre.</li>
        <li><strong>Barátokkal.</strong> Küldj meghívólinket. Te állítod be a lépésenkénti időt, és csevegni is tudtok.</li>
        <li><strong>Online.</strong> Gyors játék egy másik, veled azonos szintű játékos ellen, lépésenként 30 másodperc. Néhány online ellenfél számítógépes játékos lehet.</li>
        <li><strong>Egy telefonon.</strong> Add körbe a telefont az asztal körül.</li>
      </ul>
      <p>A Leapstone ingyenes, reklámok nélkül, és e-mail-címes regisztráció nélkül: csak egy játékosnevet választasz. <a href="https://apps.apple.com/hu/app/id6831230722">Töltsd le a Leapstone-t az App Store-ból</a>, vagy <a href="/play/">játssz a böngészőben</a>.</p>
    </section>`;

export default {
  nav: "A csillaghalma szabályai",
  titel: "Csillaghalma (kínai dáma): szabályok és tippek | Leapstone",
  beschrijving: "Így játsszuk a csillaghalmát: indulás, lépések, ugrások és ugrássorozatok, nyerés 2, 3, 4 vagy 6 játékossal, és tippek. Játssz ingyen a böngészőben.",
  h1: "Csillaghalma (kínai dáma): játékszabályok",
  intro: "Vidd át mind a 10 bábudat a csillag alakú táblán a szemközti csúcsba, mielőtt bárki más megtenné. A szabályok röviden, képekkel, és néhány tipp.",
  inhoud,
};
