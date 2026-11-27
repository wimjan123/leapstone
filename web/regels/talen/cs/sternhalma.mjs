// Česká stránka „Co je Sternhalma?“ (úkol 134): název a vztah k Halmě a čínské dámě.
// Obsah a zdroje: anglická stránka ../en/sternhalma.mjs (Wikipedia Halma a Chinese Checkers, viz tam). Věta po větě česky.
// Záměrně vynecháno, stejně jako v angličtině: kdo vydal Stern-Halmu v roce 1892 (zdroje se liší) a roky patentů.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Co název znamená</h2>
      <p>Sternhalma je německý název Halmy hrané na hvězdicové desce. <em>Stern</em> je německy hvězda. Název čínská dáma je táž hra pod jménem, které jí později dali ve Spojených státech.</p>
      <p>V Leapstone je to <strong>hvězdicová deska</strong>: deska z <a href="/cs/pravidla/cinska-dama">pravidel čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Odkud pochází</h2>
      <ul>
        <li><strong>Halmu</strong> vymyslel v roce 1883 nebo 1884 George Howard Monks, americký chirurg. Název je řecky &bdquo;skok&ldquo;. Hraje se na čtvercové desce. <a href="/cs/pravidla/halma">Přečtěte si pravidla Halmy</a>.</li>
        <li><strong>Stern-Halma</strong> se objevila v Německu v roce 1892: stejný nápad na desce ve tvaru hvězdy o šesti hrotech.</li>
        <li><strong>Čínská dáma</strong> je název, který hře dali Bill a Jack Pressman ve Spojených státech v roce 1928, nejdřív jako &bdquo;Hop Ching checkers&ldquo;. Hra nemá s Čínou žádnou historickou souvislost a není to dáma.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Jak se hry liší</h2>
      <ul>
        <li><strong>Halma:</strong> čtvercová deska o 16 krát 16 polích, pro 2 nebo 4 hráče. Kámen má osm sousedů, přímých i úhlopříčných. Při 2 hráčích má každý 19 kamenů, při 4 hráčích 13.</li>
        <li><strong>Sternhalma a čínská dáma:</strong> hvězdicová deska o 121 polích, pro 2, 3, 4 nebo 6 hráčů. Kámen má šest sousedů. Každý má 10 kamenů.</li>
        <li><strong>Zbytek je stejný:</strong> krok na volného souseda, nebo skok přes jeden kámen, s řetězy skoků. Vyhrává ten, kdo první zaplní tábor na druhé straně desky.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianty a co dělá Leapstone</h2>
      <p>Halma se hrála více způsoby. Takhle si Leapstone stojí oproti variantám, které jsme našli ve svých zdrojích:</p>
      <ul>
        <li><strong>Velikost desky.</strong> Halma se hraje také na deskách 8 krát 8 a 10 krát 10 polí. Leapstone má jen desku 16 krát 16 polí.</li>
        <li><strong>Opuštění cíle.</strong> Podle jednoho pravidla Halmy nesmí kámen, který vstoupil do tábora soupeře, tábor znovu opustit. Leapstone toto pravidlo nemá: takovým kamenem můžete znovu táhnout.</li>
        <li><strong>Tři hráči na hvězdě.</strong> Stará Halma pro tři hráče na hvězdicové desce se popisuje s 15 kameny na hráče. Leapstone hraje 3 hráče na hvězdicové desce s 10 kameny na hráče.</li>
        <li><strong>Skoky jsou vaše volba.</strong> Skákat nikdy nemusíte. Pole, kde váš tah skončí, si vybíráte sami.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Zahrajte si to v Leapstone</h2>
      <p>Hrát hned otevře hru na hvězdicové desce proti počítači. Pro čtvercovou desku klepněte nahoře na šipku zpět a v nabídce vyberte Čtvercová deska.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Hvězdicová deska s 10 červenými kameny v dolním hrotu a 10 modrými kameny v horním hrotu",
  tekst: "Hvězdicová deska pro 2 hráče.",
})}
    </section>`;

export default {
  nav: "Co je Sternhalma?",
  titel: "Co je Sternhalma? Halma na hvězdicové desce | Leapstone",
  beschrijving: "Sternhalma je německý název Halmy na hvězdicové desce. Jak souvisí s Halmou a čínskou dámou, v čem se liší a jak ji hrát zdarma v prohlížeči.",
  h1: "Sternhalma, Halma a čínská dáma",
  intro: "Tři názvy pro úzce příbuzné hry. Co který znamená, odkud pocházejí a jak se liší.",
  inhoud,
};
