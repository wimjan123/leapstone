// Česká stránka s pravidly Halmy, úkol 134. Obsah: anglická stránka ../en/halma.mjs (zkontrolovaná proti crates/halma-core,
// viz docs/plan.md, úkol 117), věta po větě česky. Kdo mění pravidlo, mění všechny jazyky.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 hráči: každý 19 kamenů",
    alt: "Čtvercová deska s 19 červenými kameny v rohu vlevo nahoře a 19 modrými kameny v rohu vpravo dole",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 hráči: každý 13 kamenů",
    alt: "Čtvercová deska s 13 kameny v každém ze čtyř rohů: červené vlevo nahoře, modré vpravo nahoře, zelené vpravo dole a žluté vlevo dole",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Deska</h2>
      <p>Halma se hraje na čtvercové desce o 16 krát 16 polích, celkem 256. Každé pole má nejvýše osm sousedů: čtyři přímé a čtyři úhlopříčné. Pole na okraji jich má méně a roh má tři.</p>
      <p>To je čtvercová deska v Leapstone. Pokud znáte hru na hvězdicové desce, přečtěte si o <a href="/cs/pravidla/co-je-sternhalma">Sternhalmě</a> a <a href="/cs/pravidla/cinska-dama">pravidla čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Jak kameny začínají</h2>
      <p>Halma je pro 2 nebo 4 hráče. Každý hráč začíná s kameny v táboře v rohu desky. Tábor v protějším rohu je váš cíl.</p>
      <ul>
        <li><strong>2 hráči:</strong> každý 19 kamenů, ve dvou rozích proti sobě. Tábor tvoří pět řad o 5, 5, 4, 3 a 2 polích.</li>
        <li><strong>4 hráči:</strong> každý 13 kamenů, jeden tábor v každém rohu. Tábor tvoří čtyři řady o 4, 4, 3 a 2 polích. Váš cíl je roh na druhé straně desky, úhlopříčně.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Střídání tahů</h2>
      <p>Hráč 1 začíná. Pak se tahy střídají popořadě, a po posledním hráči je znovu na tahu hráč 1. V Leapstone patří barvy k číslům: červená, modrá, zelená a žlutá.</p>
      <p>Když jste na tahu, hrajete jedním kamenem, jednou. Nic se nebere: kameny zůstávají na desce, dokud jejich hráč nevzdá hru.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Posuňte kámen na prázdné pole vedle něj, v kterémkoli z osmi směrů: přímo nebo úhlopříčně.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Červený kámen s bílým kroužkem kolem. Pět z jeho osmi sousedních polí je prázdných a označených; na dalších třech stojí kameny.",
  tekst: "Červený kámen může udělat krok na pět označených polí. Další tři sousední pole jsou obsazená.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Přeskočte jeden kámen vedle svého, jakékoli barvy, a dopadněte na prázdné pole hned za ním, v přímé linii. Můžete skákat ve všech osmi směrech, i úhlopříčně a dozadu.</p>
      <ul>
        <li>Pole, na které dopadnete, musí být prázdné.</li>
        <li>Nemůžete přeskočit dva kameny za sebou ani prázdné pole.</li>
        <li>Kámen, který přeskočíte, zůstává, kde je.</li>
        <li>Nemůžete přeskočit okraj desky.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Červený kámen přeskakuje úhlopříčně modrý kámen na prázdné pole za ním, znázorněno šipkou.",
  tekst: "Červený kámen přeskakuje úhlopříčně modrý kámen.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Řetěz skoků</h2>
      <p>Po skoku může stejný kámen skočit znovu, tolikrát, kolikrát to jde, v kterémkoli směru, přímo nebo úhlopříčně. Sami rozhodnete, kde skončíte. Všechny skoky dohromady jsou jeden tah.</p>
      <ul>
        <li>V jednom tahu nemůžete dopadnout dvakrát na stejné pole.</li>
        <li>Tah je jeden krok, nebo jeden či více skoků. Po skoku už nemůžete udělat krok.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Červený kámen udělá v jednom tahu tři skoky: úhlopříčně přes modrý kámen, přímo přes další modrý kámen a úhlopříčně přes červený kámen. Tři místa dopadu jsou očíslovaná 1, 2 a 3.",
  tekst: "Jeden tah se třemi skoky, v pořadí podle čísel.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cíl</h2>
      <p>Vyhrajete, když přesunete všechny své kameny do tábora naproti tomu, kde jste začali. Na každém poli tohoto tábora musí stát vaše vlastní kameny: 19 při 2 hráčích, 13 při 4 hráčích. Dokud tam stojí kámen jiného hráče, nemůžete hru dokončit.</p>
      <p>Dopadnout můžete na kterékoli prázdné pole, i v táborech ostatních hráčů. Kámen, který je ve vašem cíli, může zase odejít; nic ho nezamyká.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Čtvercová deska pro dva hráče. Červený začíná vlevo nahoře; tábor vpravo dole, označený přerušovanými kroužky a plný modrých kamenů, je cíl červeného.",
  tekst: "Při 2 hráčích je cílem červeného tábor, kde začíná modrý.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Se 2 nebo 4 hráči</h2>
      <ul>
        <li><strong>2 hráči:</strong> kdo první zaplní cíl, vyhrává, a hra končí.</li>
        <li><strong>4 hráči:</strong> kdo první zaplní cíl, vyhrává. Ostatní hrají dál o další místa a hráč, který je hotový, se přeskakuje. Hra končí, když hraje už jen jeden hráč.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Vzdání hry</h2>
      <p>Když hru vzdáte, vaše kameny zmizí z desky, takže nikomu nepřekážejí. Při 2 hráčích vyhrává druhý hráč. Při 4 hráčích hra pokračuje bez vás, a pokud všichni kromě jednoho hráče hru vzdají, vyhrává poslední hráč.</p>
      <p>V online hře má každý tah časový limit. Nastavuje ho hráč, který hru zakládá. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte. Hry proti počítači a na jednom telefonu časový limit nemají.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipy</h2>
      <ul class="tips">
        <li><strong>Stavte žebříky.</strong> Postavte kameny do řady s jedním prázdným polem mezi nimi, přímé nebo úhlopříčné, směrem k cíli. Jeden kámen pak může přeskákat celou řadu v jediném tahu.</li>
        <li><strong>Každý kámen je žebřík.</strong> Přeskakovat můžete kameny všech barev, takže vám pomáhají i kameny ostatních hráčů. A vaše žebříky pomáhají jim: dívejte se, co po sobě necháváte.</li>
        <li><strong>Využívejte úhlopříčky.</strong> Cíl je v protějším rohu, takže úhlopříčná řada kamenů je nejrychlejší cesta přes desku.</li>
        <li><strong>Nezapomínejte na opozdilce.</strong> Potřebujete všechny kameny v cíli. Kámen daleko vzadu, který nemá co přeskakovat, postupuje o jedno pole za tah. Přiveďte ho dopředu, dokud jsou kolem něj ještě ostatní kameny.</li>
        <li><strong>Váš start je jejich cíl.</strong> Při 2 hráčích je váš tábor cílem druhého hráče a ten nemůže dokončit, dokud tam stojí některý váš kámen. Leapstone vám dovolí nechat kámen doma, takže takhle můžete blokovat. Totéž platí pro vás.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Otázky</h2>
      <h3>Kolik lidí může hrát Halmu?</h3>
      <p>Dva nebo čtyři. Halma se hraje na čtvercové desce 16 krát 16 polí a každý hráč začíná v jednom rohu.</p>
      <h3>Kolik kamenů má každý hráč v Halmě?</h3>
      <p>Každý 19 kamenů se 2 hráči a každý 13 kamenů se 4 hráči.</p>
      <h3>Kdo vymyslel Halmu?</h3>
      <p>George Howard Monks, americký chirurg, v roce 1883 nebo 1884. Název je řecky „skok“. Více se dočtete v článku <a href="/cs/pravidla/co-je-sternhalma">Sternhalma</a>.</p>
      <h3>Jaký je rozdíl mezi Halmou a čínskou dámou?</h3>
      <p>Halma se hraje na čtvercové desce, s kroky a skoky v osmi směrech a s 19 nebo 13 kameny na hráče. Čínská dáma se hraje na hvězdicové desce, v šesti směrech a s 10 kameny na hráče, pro 2, 3, 4 nebo 6 hráčů.</p>
      <h3>Dá se Halma hrát online zdarma?</h3>
      <p>Ano, v Leapstone, v prohlížeči nebo v aplikaci z App Store. Vyberte způsob hry, například proti počítači nebo online s přáteli, a pak Čtvercová deska. Leapstone je zdarma a bez reklam.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Zahrajte si ji</h2>
      <p>Tlačítko Hrát hned otevře hru proti počítači na <a href="/cs/pravidla/cinska-dama">hvězdicové desce</a>. Chcete-li hrát Halmu, klepněte nahoře na šipku zpět, vyberte Hrát na tomto telefonu, Hrát proti počítači nebo Hrát online s přáteli a klepněte na Čtvercová deska.</p>
    </section>`;

export default {
  nav: "Pravidla Halmy",
  titel: "Halma: pravidla a tipy | Leapstone",
  beschrijving: "Jak se hraje Halma na čtvercové desce 16 krát 16: začátek, kroky, skoky, řetězy skoků, jak vyhrát a tipy. Hrajte zdarma v prohlížeči.",
  h1: "Halma: pravidla hry",
  intro: "Přesuňte všechny své kameny přes čtvercovou desku do protějšího rohu dřív než ostatní. Pravidla ve zkratce, s obrázky, a pár tipů.",
  inhoud,
};
