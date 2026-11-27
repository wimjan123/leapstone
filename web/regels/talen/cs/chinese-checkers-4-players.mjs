// Česká příručka Čínská dáma pro 4 hráče (úkol 301, feature 294): /cs/navody/cinska-dama-pro-4-hrace.
// Obsah: anglická příručka ../en/chinese-checkers-4-players.mjs, věta po větě česky (pravidla z crates/halma-core, viz docs/plan.md, úkol 301).
// Kdo změní pravidlo, změní ho v každém jazyce.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak se deska dělí</h2>
      <p>Každý hráč má 10 kamenů, takže na desce o 121 polích stojí 40 kamenů. Čtyři startovní hroty jsou dva páry hrotů vedle sebe: červený dole a modrý vlevo dole, zelený nahoře a žlutý vpravo nahoře.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Hvězdicová deska s 10 červenými kameny v dolním hrotu, 10 modrými kameny v hrotu vlevo dole, 10 zelenými kameny v horním hrotu a 10 žlutými kameny v hrotu vpravo nahoře. Hroty vlevo nahoře a vpravo dole jsou prázdné.",
  tekst: "Červený dole, modrý vlevo dole, zelený nahoře, žlutý vpravo nahoře.",
})}
      <p>Hráč 1, červený, táhne první. Potom je modrý hráč 2, zelený je hráč 3, žlutý je hráč 4 a po žlutém je zase na řadě červený. Tah je jeden krok nebo řetěz skoků jedním kamenem. Kroky a skoky najdete v <a href="/cs/pravidla/cinska-dama">pravidlech čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kdo stojí proti komu</h2>
      <p>Hroty jsou ve dvojicích proti sobě: červený proti zelenému a modrý proti žlutému. Váš cíl je hrot naproti vám. Červený jde tam, kde začíná zelený, zelený tam, kde začíná červený, modrý tam, kde začíná žlutý, a žlutý tam, kde začíná modrý.</p>
      <p>Stejně jako ve hře pro 2 je každý cíl na začátku plný kamenů hráče, který stojí proti vám, takže tam můžete dopadnout, až je opustí. Se 3 hráči jsou cíle na začátku prázdné, takže při 4 hráčích nemůže nikdo skončit hned. Čtyři cíle jsou čtyři různé hroty, takže váš cíl nikdo jiný nechce: hráč, který je hotový, nikdy nikoho neblokuje.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dva prázdné hroty</h2>
      <p>Hroty vlevo nahoře a vpravo dole nemají žádné kameny. Nejsou ničím startem ani cílem. Hrot vlevo nahoře leží mezi modrým a zeleným a hrot vpravo dole mezi žlutým a červeným.</p>
      <p>Na libovolné prázdné pole můžete vstoupit krokem nebo skokem, takže těmito hroty můžete projít nebo se v nich zastavit. Kámen tam ale ještě není v cíli. V prázdném hrotu není přes co skákat, dokud tam někdo kameny nepřinese.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Co se mění ve vaší taktice</h2>
      <ul>
        <li><strong>Dvě křížení najednou:</strong> červený a zelený přecházejí desku k sobě, stejně tak modrý a žlutý. Obě linie vedou středem, takže střed je rušnější než ve hře pro 2, kde se kříží jen jedna linie.</li>
        <li><strong>Mezi vašimi tahy táhnou tři hráči:</strong> deska se mezi dvěma vašimi tahy mění víc než ve hře pro 2. Podívejte se na ni znovu na začátku každého tahu a teprve pak plánujte řetěz skoků. Hráč, který táhne po vás, nikdy není ten, který stojí proti vám.</li>
        <li><strong>Kameny pomáhají všem:</strong> každý kámen ostatních tří je odrazovým můstkem pro vás a vaše jsou odrazovými můstky pro ně. Kameny hráče naproti vám se pohybují opačným směrem, stejně jako ve hře pro 2.</li>
        <li><strong>Místo na obejití:</strong> když je střed plný, jsou prázdné hroty volný prostor vedle startovních hrotů. Cesta přes jeden z nich může být způsob, jak obejít tlačenici.</li>
        <li><strong>Hráč, který se vzdá, uvolní váš cíl:</strong> když se hráč naproti vám vzdá, jeho kameny zmizí z desky, takže váš cíl je okamžitě prázdný.</li>
      </ul>
      <p><a href="/cs/navody/cinska-dama-strategie">Tipy ke strategii</a> o žebřících, opozdilcích a plnění cíle odzadu platí stejně i se 4 hráči.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vítězství a co přijde potom</h2>
      <ul>
        <li><strong>Vítězství:</strong> kdo první zaplní cíl všemi 10 kameny, vyhrává. Hra tím nekončí: ostatní tři hrají dál o další místa a hráč, který je hotový, se přeskakuje. Kameny tohoto hráče zůstávají na desce. Hra končí, když hraje už jen jeden hráč.</li>
        <li><strong>Vzdání:</strong> vaše kameny zmizí z desky a ostatní tři hrají dál. Pokud se vzdají i ostatní, vyhrává poslední zbývající hráč.</li>
        <li><strong>Čas (online):</strong> v online hře má každý tah časový limit. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte a hra pokračuje bez vás.</li>
      </ul>
      <p>Hry s menším počtem hráčů najdete v příručce <a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>. Na <a href="/cs/pravidla/cinska-dama">stránce s pravidly</a> jsou obrázky každého začátku.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrát ve 4 hráčích v Leapstone</h2>
      <ul>
        <li><strong>Proti počítači, hned teď:</strong> otevřete <a href="/play/">Leapstone v prohlížeči</a>, klepněte na Počítač, vyberte hvězdicovou desku a 3 počítače. Jste hráč 1, takže táhnete první. Pro počítače si vyberete Snadná, Normální nebo Těžká.</li>
        <li><strong>Na jednom telefonu:</strong> klepněte na Hrát, vyberte hvězdicovou desku a 4 hráče a potom klepnutím na kámen přepněte dané místo mezi člověkem a počítačem.</li>
        <li><strong>Online s přáteli:</strong> klepněte na Přátelé, vyberte hvězdicovou desku, 4 hráče a čas na tah a pošlete pozvánkový odkaz. Hra začne, když jsou obsazena všechna 4 místa.</li>
        <li><strong>Rychlá hra, v aplikaci:</strong> klepněte na Hrát online. Když hledá hru pro 2, klepněte na Hledat 4 nebo 6 hráčů a hledejte místo toho hru pro 4. Každý tah má 30 sekund. Pokud se do 20 sekund nepřipojí dost hráčů, prázdná místa doplní počítačoví hráči, takže někteří soupeři mohou být počítačoví hráči.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínská dáma pro 4 hráče",
  titel: "Čínská dáma pro 4 hráče: začátek a tipy | Leapstone",
  beschrijving: "Jak funguje čínská dáma pro 4 hráče: jak se deska dělí, které 2 hroty zůstanou prázdné, kdo stojí proti komu, co se mění v taktice a kde hrát.",
  h1: "Čínská dáma pro 4 hráče",
  intro: "Při 4 hráčích začíná každý z vás v jednom ze čtyř hrotů hvězdy a dva hroty zůstávají prázdné. Červený stojí proti zelenému a modrý proti žlutému: váš cíl je hrot naproti vám, plný kamenů onoho hráče. Tady je začátek, prázdné hroty, taktika a kde to můžete hrát.",
  inhoud,
};
