// A Halma magyar szabályoldala, 134. feladat. Tartalom: az angol oldal ../en/halma.mjs (a crates/halma-core ellen ellenőrizve,
// lásd docs/plan.md, 117. feladat), mondatról mondatra magyarul. Aki egy szabályt módosít, minden nyelvben módosítja.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 játékos: fejenként 19 bábu",
    alt: "A négyzet alakú tábla 19 piros bábuval a bal felső sarokban és 19 kék bábuval a jobb alsó sarokban",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 játékos: fejenként 13 bábu",
    alt: "A négyzet alakú tábla mind a négy sarokban 13 bábuval: piros bal felül, kék jobb felül, zöld jobb alul és sárga bal alul",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">A tábla</h2>
      <p>A Halmát 16 × 16 mezős négyzet alakú táblán játsszák, összesen 256 mezőn. Minden mezőnek legfeljebb nyolc szomszédja van: négy egyenes és négy átlós. A szélén lévő mezőnek kevesebb van, a sarokmezőnek három.</p>
      <p>Ez a Leapstone négyzet alakú táblája. Ha ismered a játékot a csillag alakú táblán, olvass a <a href="/hu/szabalyok/mi-az-a-sternhalma">Sternhalmáról</a> és a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályairól</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Hogyan indulnak a bábuk</h2>
      <p>A Halma 2 vagy 4 játékosnak szól. Minden játékos a bábuival egy tábor mezőn kezd a tábla egyik sarkában. A szemközti sarokban lévő tábor a célod.</p>
      <ul>
        <li><strong>2 játékos:</strong> fejenként 19 bábu, két egymással szemközti sarokban. A tábor öt sor, 5, 5, 4, 3 és 2 mezővel.</li>
        <li><strong>4 játékos:</strong> fejenként 13 bábu, minden sarokban egy tábor. A tábor négy sor, 4, 4, 3 és 2 mezővel. A célod a tábla átellenes sarka, átlósan.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">A lépések sorrendje</h2>
      <p>Az 1. játékos kezd. Utána sorban jönnek a következők, és az utolsó játékos után újra az 1. játékos következik. A Leapstone-ban a színek a számokhoz tartoznak: piros, kék, zöld és sárga.</p>
      <p>Amikor te jössz, egyetlen bábuval lépsz, egyszer. Semmit nem ütnek le: a bábuk a táblán maradnak, amíg a játékosuk fel nem adja.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Egy lépés</h2>
      <p>Mozgass egy bábut a mellette lévő üres mezőre, a nyolc irány bármelyikébe: egyenesen vagy átlósan.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Egy piros bábu fehér gyűrűvel körülvéve. Nyolc szomszédja közül öt üres és meg van jelölve; a másik háromon bábu áll.",
  tekst: "A piros bábu az öt megjelölt mezőre léphet. A másik három szomszédos mező foglalt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Egy ugrás</h2>
      <p>Ugorj át egy, a tiéd mellett álló bábut, bármilyen színűt, és érkezz a mögötte lévő üres mezőre, egyenes vonalban. Mind a nyolc irányba ugorhatsz, átlósan és hátrafelé is.</p>
      <ul>
        <li>A mezőnek, ahová érkezel, üresnek kell lennie.</li>
        <li>Nem ugorhatsz át két bábut egymás után, és üres mezőt sem.</li>
        <li>A bábu, amelyet átugrasz, ott marad, ahol van.</li>
        <li>A tábla szélén nem ugorhatsz túl.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Egy piros bábu átlósan átugrik egy kék bábut a mögötte lévő üres mezőre, nyíllal jelezve.",
  tekst: "A piros bábu átlósan átugorja a kék bábut.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Ugrássorozat</h2>
      <p>Egy ugrás után ugyanaz a bábu újra ugorhat, ahányszor csak tud, bármelyik irányba, egyenesen vagy átlósan. Te döntöd el, hol állsz meg. Az összes ugrás együtt egy lépés.</p>
      <ul>
        <li>Egy lépésen belül nem érkezhetsz kétszer ugyanarra a mezőre.</li>
        <li>Egy lépés vagy egy egyszerű lépés, vagy egy vagy több ugrás. Ugrás után már nem léphetsz egyszerűt.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Egy piros bábu egyetlen lépésben három ugrást tesz: átlósan egy kék bábu fölött, egyenesen egy másik kék bábu fölött, és átlósan egy piros bábu fölött. A három érkezési mező az 1, 2 és 3 számot viseli.",
  tekst: "Egy lépés három ugrással, a számok sorrendjében.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">A cél</h2>
      <p>Akkor nyersz, ha az összes bábudat átviszed az indulási táboroddal szemközti táborba. A tábor minden mezőjén a saját bábuidnak kell állnia: 2 játékosnál 19-nek, 4 játékosnál 13-nak. Amíg egy másik játékos bábuja ott áll, nem fejezheted be.</p>
      <p>Bármelyik üres mezőre érkezhetsz, a többi játékos táboraiban is. Az a bábu, amely a célodban van, újra elhagyhatja azt; semmi nem zárja be.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "A négyzet alakú tábla két játékosnak. A piros bal felül kezd; a jobb alsó tábor, szaggatott körökkel jelölve és kék bábukkal tele, a piros célja.",
  tekst: "2 játékosnál a piros célja az a tábor, ahol a kék kezd.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2 vagy 4 játékossal</h2>
      <ul>
        <li><strong>2 játékos:</strong> aki először tölti meg a célt, nyer, és a játék véget ér.</li>
        <li><strong>4 játékos:</strong> aki először tölti meg a célt, nyer. A többiek tovább játszanak a következő helyekért, és aki már végzett, azt kihagyják. A játék akkor ér véget, amikor már csak egy játékos játszik.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Feladás</h2>
      <p>Ha feladod, a bábuid lekerülnek a tábláról, így senkit sem akadályoznak. 2 játékosnál a másik játékos nyer. 4 játékosnál a játék nélküled folytatódik, és ha egy kivételével mindenki feladja, az utolsó játékos nyer.</p>
      <p>Egy online játékban minden lépésnek időkorlátja van. A játékot indító játékos állítja be. Ha lejár az időd, kimarad a lépésed. Ha egymás után 3 lépést kihagysz, feladod. A számítógép elleni és az egy telefonon játszott játékoknak nincs időkorlátja.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tippek</h2>
      <ul class="tips">
        <li><strong>Építs létrákat.</strong> Állítsd a bábukat egy sorba, köztük egy-egy üres mezővel, egyenesen vagy átlósan, a célod felé mutatva. Egy bábu ekkor az egész soron végigugorhat egyetlen lépésben.</li>
        <li><strong>Minden bábu létra.</strong> Minden színű bábut átugorhatsz, így a többi játékos bábui is segítenek neked. A te létráid pedig nekik segítenek: nézd meg, mit hagysz magad mögött.</li>
        <li><strong>Használd az átlókat.</strong> A cél a szemközti sarokban van, ezért az átlós bábusor a leggyorsabb út a táblán át.</li>
        <li><strong>Ne felejtsd el a lemaradókat.</strong> Az összes bábura szükséged van otthon. Egy messze lemaradt bábu, amelynek nincs mit átugrania, körönként egy mezőt halad. Hozd előre, amíg a többi bábu még körülötte van.</li>
        <li><strong>A te indulásod az ő céljuk.</strong> 2 játékosnál a te táborod a másik játékos célja, és ő nem tudja befejezni, amíg még áll ott egy bábud. A Leapstone megengedi, hogy egy bábut otthon tarts, így ilyen módon blokkolhatsz. Ugyanez igaz rád is.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Kérdések</h2>
      <h3>Hányan játszhatnak Halmát?</h3>
      <p>Ketten vagy négyen. A Halmát 16 × 16 mezős négyzet alakú táblán játsszák, és minden játékos egy sarokban kezd.</p>
      <h3>Hány bábuja van egy játékosnak a Halmában?</h3>
      <p>Fejenként 19 bábu 2 játékosnál, és fejenként 13 bábu 4 játékosnál.</p>
      <h3>Ki találta fel a Halmát?</h3>
      <p>George Howard Monks, egy amerikai sebész, 1883-ban vagy 1884-ben. A név görögül „ugrást” jelent. Olvass tovább: <a href="/hu/szabalyok/mi-az-a-sternhalma">Sternhalma</a>.</p>
      <h3>Mi a különbség a Halma és a kínai dáma között?</h3>
      <p>A Halma négyzet alakú táblán játszódik, nyolc irányban lehet lépni és ugrani, fejenként 19 vagy 13 bábuval. A kínai dáma csillag alakú táblán játszódik, hat irányban, fejenként 10 bábuval, 2, 3, 4 vagy 6 játékosnak.</p>
      <h3>Lehet ingyen online Halmát játszani?</h3>
      <p>Igen, a Leapstone-ban, a böngészőben vagy az App Store-ból letölthető alkalmazásban. Válassz egy játékmódot, például a számítógép ellen vagy online barátokkal, majd a Négyzet alakú táblát. A Leapstone ingyenes, reklámok nélkül.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Játssz vele</h2>
      <p>A Játssz most gomb egy számítógép elleni játékot nyit meg a <a href="/hu/szabalyok/csillaghalma">csillag alakú táblán</a>. A Halma játszásához koppints fent a vissza nyílra, majd válaszd a Játssz ezen a telefonon, a Játssz a számítógép ellen vagy a Játssz online barátokkal lehetőséget, és koppints a Négyzet alakú táblára.</p>
    </section>`;

export default {
  nav: "A Halma szabályai",
  titel: "Halma: szabályok és tippek | Leapstone",
  beschrijving: "Így játsszuk a Halmát a 16 × 16-os négyzet alakú táblán: indulás, lépések, ugrások, ugrássorozatok, nyerés és tippek. Játssz ingyen a böngészőben.",
  h1: "Halma: játékszabályok",
  intro: "Vidd át az összes bábudat a négyzet alakú táblán a szemközti sarokba, mielőtt bárki más megtenné. A szabályok röviden, képekkel, és néhány tipp.",
  inhoud,
};
