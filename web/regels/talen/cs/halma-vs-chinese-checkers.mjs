// Česká příručka Halma, nebo čínská dáma (úkol 300). Obsah: anglická příručka ../en/halma-vs-chinese-checkers.mjs, věta po větě česky.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Čínská dáma: hvězdicová deska, 121 polí",
    alt: "Hvězdicová deska s 10 červenými kameny v dolním hrotu a 10 modrými kameny v horním hrotu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: čtvercová deska, 256 polí",
    alt: "Čtvercová deska s 19 červenými kameny v rohu vlevo nahoře a 19 modrými kameny v rohu vpravo dole",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Hvězdicová deska: šest sousedů, tři z nich jsou tu prázdná",
    alt: "Červený kámen s bílým kroužkem kolem. Tři z jeho šesti sousedních polí jsou prázdná a označená; na dalších třech stojí kameny.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Čtvercová deska: osm sousedů, pět z nich je tu prázdných",
    alt: "Červený kámen s bílým kroužkem kolem. Pět z jeho osmi sousedních polí je prázdných a označených; na dalších třech stojí kameny.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Stručná odpověď</h2>
      <p>Halma se hraje na čtvercové desce a čínská dáma na desce ve tvaru šesticípé hvězdy. V obou hrách přesouváte své kameny po desce kroky a skoky a vyhrává hráč, který první zaplní tábor na druhé straně.</p>
      <p>Liší se deska, směry, kterými se táhne, kolik lidí může hrát a kolik kamenů má každý z nich. <a href="/cs/pravidla/co-je-sternhalma">Sternhalma</a> je název pro Halmu na hvězdicové desce, takže je to stejná hra jako čínská dáma.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Desky</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Čínská dáma</strong> používá hvězdicovou desku: 121 polí, s hrotem o 10 polích na každém z šesti konců. Hrot je trojúhelník z řad o 4, 3, 2 a 1 poli.</li>
        <li><strong>Halma</strong> používá čtvercovou desku: 16 krát 16 polí, celkem 256. Tábor je v rohu. Velký tábor má řady o 5, 5, 4, 3 a 2 polích, malý tábor řady o 4, 4, 3 a 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Směry: šest nebo osm</h2>
      <p>Na hvězdicové desce má pole šest sousedů. Na čtvercové jich má osm, protože se počítají i úhlopříčky. Krok vede na prázdné sousední pole. Skok vede přes jeden kámen vedle vašeho, v přímé linii, na prázdné pole za ním, v kterémkoli z těchto směrů a také dozadu.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Pole na okraji má méně sousedů a roh čtvercové desky jich má tři. Šest směrů tvoří na hvězdicové desce tři přímky přes pole. Osm směrů tvoří na čtvercové desce čtyři přímky: vodorovně, svisle a dvě úhlopříčky.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Hráči a kameny</h2>
      <ul>
        <li><strong>Čínská dáma:</strong> 2, 3, 4 nebo 6 hráčů. Každý má 10 kamenů, takže na desce je 20, 30, 40 nebo 60 kamenů.</li>
        <li><strong>Halma:</strong> 2 nebo 4 hráči. Při 2 hráčích má každý 19 kamenů, celkem 38. Při 4 hráčích má každý 13 kamenů, celkem 52.</li>
      </ul>
      <p>Čtvercová deska nemá v Leapstone hru pro 3 ani 6 hráčů. Pro hru ve třech si přečtěte <a href="/cs/navody/cinska-dama-pro-tri-hrace">Čínská dáma pro 3 hráče</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Co je stejné</h2>
      <ul>
        <li><strong>Tah:</strong> jeden krok, nebo řetěz skoků jedním kamenem. Kde řetěz skončí, rozhodujete vy, a po skoku už nemůžete udělat krok.</li>
        <li><strong>Jakákoli barva:</strong> přeskakujete kámen jakékoli barvy, i svého. Kámen, který přeskočíte, zůstává, kde je. Nic se nebere.</li>
        <li><strong>Cíl:</strong> tábor naproti tomu, kde jste začali. Na všech jeho polích musí stát vaše vlastní kameny. Dokud tam stojí kámen jiného hráče, nemůžete hru dokončit.</li>
        <li><strong>Vítězství:</strong> kdo první zaplní cíl, vyhrává. Při 2 hráčích tím hra končí. Při více hráčích ostatní hrají dál o další místa a hráč, který je hotový, se přeskakuje.</li>
        <li><strong>Vzdání a čas:</strong> když hru vzdáte, vaše kameny zmizí z desky. V online hře má každý tah časový limit, a pokud vynecháte 3 tahy za sebou, hru vzdáte.</li>
      </ul>
      <p>Přečtěte si úplná pravidla <a href="/cs/pravidla/cinska-dama">čínské dámy</a> a <a href="/cs/pravidla/halma">Halmy</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Jakou desku v Leapstone vybrat</h2>
      <ul>
        <li><strong>3 nebo 6 hráčů:</strong> tuto hru má jen hvězdicová deska.</li>
        <li><strong>Více kamenů pro každého:</strong> čtvercová deska, s 19 kameny na hráče pro 2 hráče nebo 13 pro 4, oproti 10 na hvězdicové desce.</li>
        <li><strong>Hrát online:</strong> rychlá hra se hraje na hvězdicové desce. S přáteli a proti počítači můžete vybrat kteroukoli desku.</li>
      </ul>
      <p>Tlačítko Hrát hned otevře hru proti počítači na hvězdicové desce. Chcete-li hrát na čtvercové desce, klepněte nahoře na šipku zpět a v nabídce vyberte Čtvercová deska.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Jak dál</h2>
      <ul>
        <li><a href="/play/">Hrajte v prohlížeči</a> a vyzkoušejte obě desky.</li>
        <li><a href="/cs/navody/cinska-dama-strategie">Strategie čínské dámy</a>: šest tipů s obrázky.</li>
        <li><a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>: jak funguje hra ve dvou.</li>
      </ul>
      <p><a href="/cs/navody/cinska-dama-online-s-prateli">Čínská dáma online s přáteli</a></p>
    </section>`;

export default {
  nav: "Halma, nebo čínská dáma",
  titel: "Halma, nebo čínská dáma: rozdíly | Leapstone",
  beschrijving: "Halma, nebo čínská dáma? Čtvercová a hvězdicová deska, šest nebo osm směrů, hráči a kameny a to, co je stejné.",
  h1: "Halma, nebo čínská dáma",
  intro: "Dvě hry s jednou myšlenkou: přesuňte všechny své kameny přes desku na druhou stranu. Čím se liší, co je stejné a kde hrát obě.",
  inhoud,
};
