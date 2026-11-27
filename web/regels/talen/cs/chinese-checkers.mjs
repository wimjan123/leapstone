// Česká stránka s pravidly čínské dámy (úkol 134). Obsah: anglická stránka ../en/chinese-checkers.mjs
// (zkontrolovaná proti crates/halma-core, viz docs/plan.md, úkol 116), věta po větě česky.
// Každé pravidlo musí souhlasit s anglickou stránkou; kdo mění pravidlo, mění všechny jazyky.
// Stejné obrázky (bez jazyka: v SVG jsou jen číslice); alt texty a popisky jsou česky.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} hráči`,
      alt:
        {
          2: "Hvězdicová deska s 10 červenými kameny v dolním hrotu a 10 modrými kameny v horním hrotu",
          3: "Hvězdicová deska s červenými kameny dole, modrými vlevo nahoře a zelenými vpravo nahoře",
          4: "Hvězdicová deska s kameny ve čtyřech hrotech: červené dole, zelené nahoře, modré vlevo dole a žluté vpravo nahoře",
          6: "Hvězdicová deska s kameny ve všech šesti hrotech, v šesti barvách",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Deska</h2>
      <p>Čínská dáma se hraje na hvězdě o šesti hrotech. Deska má 121 polí a každý hrot jich má 10. Uvnitř desky má každé pole šest sousedů.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Jak kameny začínají</h2>
      <p>Každý hráč má 10 kamenů a začíná s nimi v jednom hrotu hvězdy. Protější hrot je váš cíl.</p>
      <ul>
        <li><strong>2 hráči:</strong> dva hroty přímo proti sobě.</li>
        <li><strong>3 hráči:</strong> každý druhý hrot. Tři cíle jsou na začátku prázdné.</li>
        <li><strong>4 hráči:</strong> dva páry hrotů, které sousedí. Každý hráč má proti sobě jiného hráče.</li>
        <li><strong>6 hráčů:</strong> všech šest hrotů.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Střídání tahů</h2>
      <p>Hráč 1 začíná. Pak se tahy střídají popořadě, hráč 2, hráč 3 a tak dále, a po posledním hráči je znovu na tahu hráč 1. V Leapstone patří barvy k číslům: červená, modrá, zelená, žlutá, fialová a stříbrná.</p>
      <p>Když jste na tahu, hrajete jedním kamenem, jednou. Nic se nebere: kameny zůstávají na desce, dokud jejich hráč nevzdá hru.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Posuňte kámen na prázdné pole vedle něj.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Červený kámen s bílým kroužkem kolem. Tři z jeho šesti sousedních polí jsou prázdná a označená; na dalších třech stojí kameny.",
  tekst: "Červený kámen může udělat krok na tři označená pole. Další tři sousední pole jsou obsazená.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Přeskočte jeden kámen vedle svého, jakékoli barvy, a dopadněte na prázdné pole hned za ním, v přímé linii. Můžete skákat v kterémkoli ze šesti směrů, i dozadu.</p>
      <ul>
        <li>Pole, na které dopadnete, musí být prázdné.</li>
        <li>Nemůžete přeskočit dva kameny za sebou ani prázdné pole.</li>
        <li>Kámen, který přeskočíte, zůstává, kde je.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Červený kámen přeskakuje modrý kámen na prázdné pole za ním, znázorněno šipkou.",
  tekst: "Červený kámen přeskakuje modrý kámen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Řetěz skoků</h2>
      <p>Po skoku může stejný kámen skočit znovu, tolikrát, kolikrát to jde, a v kterémkoli směru. Sami rozhodnete, kde skončíte. Všechny skoky dohromady jsou jeden tah.</p>
      <ul>
        <li>V jednom tahu nemůžete dopadnout dvakrát na stejné pole.</li>
        <li>Tah je jeden krok, nebo jeden či více skoků. Po skoku už nemůžete udělat krok.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Červený kámen udělá v jednom tahu tři skoky, přes modrý, zelený a další modrý kámen. Tři místa dopadu jsou očíslovaná 1, 2 a 3.",
  tekst: "Jeden tah se třemi skoky, v pořadí podle čísel.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cíl</h2>
      <p>Vyhrajete, když přesunete všech 10 svých kamenů do hrotu naproti tomu, kde jste začali. Na všech 10 polích tohoto hrotu musí stát vaše vlastní kameny. Dokud tam stojí kámen jiného hráče, nemůžete hru dokončit.</p>
      <p>Dopadnout můžete na kterékoli prázdné pole, i v hrotech ostatních hráčů.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Hvězdicová deska pro tři hráče. Červený začíná dole; prázdný hrot nahoře, označený přerušovanými kroužky, je cíl červeného.",
  tekst: "Při 3 hráčích začíná červený dole. Cílem červeného je prázdný hrot nahoře.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Se 2, 3, 4 nebo 6 hráči</h2>
      <ul>
        <li><strong>2 hráči:</strong> kdo první zaplní cíl, vyhrává, a hra končí.</li>
        <li><strong>3, 4 nebo 6 hráčů:</strong> kdo první zaplní cíl, vyhrává. Ostatní hrají dál o další místa a hráč, který je hotový, se přeskakuje. Hra končí, když hraje už jen jeden hráč.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Vzdání hry</h2>
      <p>Když hru vzdáte, vaše kameny zmizí z desky, takže nikomu nepřekážejí. Při 2 hráčích vyhrává druhý hráč. Při více hráčích hra pokračuje bez vás, a pokud všichni kromě jednoho hráče hru vzdají, vyhrává poslední hráč.</p>
      <p>V online hře má každý tah časový limit. Nastavuje ho hráč, který hru zakládá, a v rychlé hře je to 30 sekund. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte. Hry proti počítači a na jednom telefonu časový limit nemají.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipy</h2>
      <ul class="tips">
        <li><strong>Stavte žebříky.</strong> Postavte kameny do řady s jedním prázdným polem mezi nimi, směrem k cíli. Jeden kámen pak může přeskákat celou řadu v jediném tahu.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Čtyři kameny v diagonální řadě s prázdným polem mezi každými dvěma. Červený kámen na jednom konci přeskočí všechny čtyři, se čtyřmi očíslovanými místy dopadu.",
  tekst: "Čtyři kameny v řadě: horní červený kámen přejde desku jedním tahem, se čtyřmi skoky.",
})}
        </li>
        <li><strong>Každý kámen je žebřík.</strong> Přeskakovat můžete kameny všech barev, takže vám pomáhají i kameny ostatních hráčů. A vaše žebříky pomáhají jim: dívejte se, co po sobě necháváte.</li>
        <li><strong>Nezapomínejte na opozdilce.</strong> Potřebujete všech 10 kamenů v cíli. Kámen daleko vzadu, který nemá co přeskakovat, postupuje o jedno pole za tah. Přiveďte ho dopředu, dokud jsou kolem něj ještě ostatní kameny.</li>
        <li><strong>Váš start je jejich cíl.</strong> Při 2, 4 nebo 6 hráčích je váš startovní hrot cílem hráče naproti vám a ten nemůže dokončit, dokud tam stojí některý váš kámen. Totéž platí pro vás.</li>
      </ul>
      <p>Další tipy s obrázky najdete v návodu <a href="/cs/navody/cinska-dama-strategie">Strategie čínské dámy</a>. Pro hru ve dvou si přečtěte <a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Otázky</h2>
      <h3>Kolik lidí může hrát čínskou dámu?</h3>
      <p>Dva, tři, čtyři nebo šest. Každý hráč začíná v jednom hrotu hvězdy. Se 2, 3 nebo 4 hráči zůstanou některé hroty prázdné.</p>
      <h3>Kolik kuliček má každý hráč?</h3>
      <p>Každý hráč má 10 kuliček, tedy kamenů. Deska má 121 polí: po 10 v každém ze šesti hrotů a 61 uprostřed.</p>
      <h3>Můžete skákat přes své vlastní kameny, nebo dozadu?</h3>
      <p>Ano. Skákat můžete přes kámen jakékoli barvy, i přes svůj vlastní, v kterémkoli ze šesti směrů, i dozadu. Kámen, přes který skočíte, zůstane na svém místě.</p>
      <h3>Berou se v čínské dámě kameny?</h3>
      <p>Ne. Nic se nebere. Kámen opouští desku jen tehdy, když jeho hráč hru vzdá.</p>
      <h3>Pochází čínská dáma z Číny?</h3>
      <p>Ne. Hra vznikla v Německu v roce 1892 pod názvem Stern-Halma a vychází ze starší hry Halma. Název Chinese checkers (čínská dáma) pochází ze Spojených států, z roku 1928. Více se dočtete v článku <a href="/cs/pravidla/co-je-sternhalma">Sternhalma</a>.</p>
      <h3>Kde si můžete zdarma zahrát čínskou dámu online s přáteli?</h3>
      <p>V Leapstone, v prohlížeči nebo v aplikaci z App Store. Pošlete kamarádovi pozvánkový odkaz: připojí se k vaší hře bez účtu, e-mailové adresy a hesla. Můžete hrát také proti počítači, nebo rychlou hru proti jinému hráči. Leapstone je zdarma a bez reklam.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Hrajte čínskou dámu v Leapstone</h2>
      <p>Leapstone je bezplatná aplikace pro hraní čínské dámy a Halmy na 3D desce z červeného laku a zlata. Hrát můžete v aplikaci i v prohlížeči.</p>
      <ul>
        <li><strong>Proti počítači.</strong> Snadný, normální nebo těžký. Nepotřebujete internet.</li>
        <li><strong>S přáteli.</strong> Pošlete pozvánkový odkaz. Čas na tah nastavujete vy a můžete si psát v chatu.</li>
        <li><strong>Online.</strong> Rychlá hra proti jinému hráči vaší úrovně, 30 sekund na tah. Někteří online soupeři mohou být počítačoví hráči.</li>
        <li><strong>Na jednom telefonu.</strong> Podávejte si telefon kolem stolu.</li>
      </ul>
      <p>Leapstone je zdarma, bez reklam a bez registrace e-mailovou adresou: vyberete si jen jméno hráče. <a href="https://apps.apple.com/cz/app/id6831230722">Stáhněte si Leapstone v App Store</a> nebo <a href="/play/">hrajte v prohlížeči</a>.</p>
    </section>`;

export default {
  nav: "Pravidla čínské dámy",
  titel: "Čínská dáma: pravidla a tipy | Leapstone",
  beschrijving: "Jak se hraje čínská dáma: jak kameny začínají, kroky, skoky a řetězy skoků, jak vyhrát se 2, 3, 4 nebo 6 hráči, a tipy. Hrajte zdarma v prohlížeči.",
  h1: "Čínská dáma: pravidla hry",
  intro: "Přesuňte všech 10 svých kamenů přes hvězdicovou desku do protějšího hrotu dřív než ostatní. Pravidla ve zkratce, s obrázky, a pár tipů.",
  inhoud,
};
