// Slovenský návod Halma, alebo čínska dáma (úloha 300). Obsah: anglický návod ../en/halma-vs-chinese-checkers.mjs, veta po vete po slovensky.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Čínska dáma: hviezdicová doska, 121 polí",
    alt: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote a 10 modrými kameňmi v hornom hrote",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: štvorcová doska, 256 polí",
    alt: "Štvorcová doska s 19 červenými kameňmi v ľavom hornom rohu a 19 modrými kameňmi v pravom dolnom rohu",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Hviezdicová doska: šesť susedov, traja z nich sú tu voľní",
    alt: "Červený kameň s bielym kruhom okolo. Traja zo šiestich jeho susedov sú voľní a označení; ostatní traja majú kamene.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Štvorcová doska: osem susedov, piati z nich sú tu voľní",
    alt: "Červený kameň s bielym kruhom okolo. Piati z ôsmich jeho susedov sú voľní a označení; ostatní traja majú kamene.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Stručná odpoveď</h2>
      <p>Halma sa hrá na štvorcovej doske a čínska dáma na doske v tvare šesťcípej hviezdy. V oboch hrách presúvate svoje kamene po doske krokmi a skokmi a vyhráva hráč, ktorý prvý zaplní tábor na druhej strane.</p>
      <p>Líši sa doska, smery, ktorými sa ťahá, koľko ľudí môže hrať a koľko kameňov má každý z nich. <a href="/sk/pravidla/sternhalma">Sternhalma</a> je názov pre Halmu na hviezdicovej doske, takže je to rovnaká hra ako čínska dáma.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Dosky</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Čínska dáma</strong> používa hviezdicovú dosku: 121 polí, s hrotom s 10 poľami na každom zo šiestich koncov. Hrot je trojuholník z radov so 4, 3, 2 a 1 poľom.</li>
        <li><strong>Halma</strong> používa štvorcovú dosku: 16 × 16 polí, spolu 256. Tábor je v rohu. Veľký tábor má rady s 5, 5, 4, 3 a 2 poľami, malý tábor rady so 4, 4, 3 a 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Smery: šesť alebo osem</h2>
      <p>Na hviezdicovej doske má pole šesť susedov. Na štvorcovej ich má osem, pretože sa počítajú aj uhlopriečky. Krok vedie na voľné susedné pole. Skok vedie cez jeden kameň vedľa vášho, v priamej línii, na voľné pole za ním, v ktoromkoľvek z týchto smerov a aj dozadu.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Pole na okraji má menej susedov a roh štvorcovej dosky ich má troch. Šesť smerov tvorí na hviezdicovej doske tri priamky cez pole. Osem smerov tvorí na štvorcovej doske štyri priamky: vodorovne, zvisle a dve uhlopriečky.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Hráči a kamene</h2>
      <ul>
        <li><strong>Čínska dáma:</strong> 2, 3, 4 alebo 6 hráčov. Každý má 10 kameňov, takže na doske je 20, 30, 40 alebo 60 kameňov.</li>
        <li><strong>Halma:</strong> 2 alebo 4 hráči. Pri 2 hráčoch má každý 19 kameňov, spolu 38. Pri 4 hráčoch má každý 13 kameňov, spolu 52.</li>
      </ul>
      <p>Štvorcová doska nemá v Leapstone hru pre 3 ani 6 hráčov. Pre hru v troch si prečítajte <a href="/sk/navody/cinska-dama-pre-troch">Čínska dáma pre 3 hráčov</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Čo je rovnaké</h2>
      <ul>
        <li><strong>Ťah:</strong> jeden krok, alebo reťaz skokov jedným kameňom. Kde reťaz skončí, rozhodujete vy, a po skoku už nemôžete urobiť krok.</li>
        <li><strong>Akákoľvek farba:</strong> preskakujete kameň akejkoľvek farby, aj svojho. Kameň, ktorý preskočíte, zostáva tam, kde je. Nič sa neberie.</li>
        <li><strong>Cieľ:</strong> tábor oproti tomu, kde ste začali. Na všetkých jeho poliach musia stáť vaše vlastné kamene. Kým tam stojí kameň iného hráča, nemôžete skončiť.</li>
        <li><strong>Výhra:</strong> kto prvý zaplní cieľ, vyhráva. Pri 2 hráčoch tým hra končí. Pri viacerých hráčoch ostatní hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje.</li>
        <li><strong>Vzdanie sa a čas:</strong> keď sa vzdáte, vaše kamene zmiznú z dosky. V online hre má každý ťah časový limit, a ak vynecháte 3 ťahy po sebe, vzdáte sa.</li>
      </ul>
      <p>Prečítajte si úplné pravidlá <a href="/sk/pravidla/cinska-dama">čínskej dámy</a> a <a href="/sk/pravidla/halma">Halmy</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Akú dosku vybrať v Leapstone</h2>
      <ul>
        <li><strong>3 alebo 6 hráčov:</strong> túto hru má len hviezdicová doska.</li>
        <li><strong>Viac kameňov pre každého:</strong> štvorcová doska, s 19 kameňmi na hráča pre 2 hráčov alebo 13 pre 4, oproti 10 na hviezdicovej doske.</li>
        <li><strong>Hrať online:</strong> rýchla hra sa hrá na hviezdicovej doske. S priateľmi a proti počítaču si môžete vybrať ktorúkoľvek dosku.</li>
      </ul>
      <p>Tlačidlo Hrať hneď otvorí hru proti počítaču na hviezdicovej doske. Ak chcete hrať na štvorcovej doske, ťuknite hore na šípku späť a v ponuke vyberte Štvorcová doska.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Ako ďalej</h2>
      <ul>
        <li><a href="/play/">Hrajte v prehliadači</a> a vyskúšajte obe dosky.</li>
        <li><a href="/sk/navody/cinska-dama-strategia">Stratégia čínskej dámy</a>: šesť tipov s obrázkami.</li>
        <li><a href="/sk/navody/cinska-dama-pre-dvoch">Čínska dáma pre 2 hráčov</a>: ako funguje hra pre dvoch.</li>
      </ul>
      <p><a href="/sk/navody/cinska-dama-online-s-priatelmi">Čínska dáma online s priateľmi</a></p>
    </section>`;

export default {
  nav: "Halma, alebo čínska dáma",
  titel: "Halma, alebo čínska dáma: rozdiely | Leapstone",
  beschrijving: "Halma, alebo čínska dáma? Štvorcová a hviezdicová doska, šesť alebo osem smerov, hráči a kamene a to, čo je rovnaké.",
  h1: "Halma, alebo čínska dáma",
  intro: "Dve hry s jednou myšlienkou: presuňte všetky svoje kamene cez dosku na druhú stranu. Čím sa líšia, čo je rovnaké a kde hrať obe.",
  inhoud,
};
