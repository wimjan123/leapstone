// Česká příručka Čínská dáma pro 2 hráče (úkol 134). Obsah: anglická příručka ../en/chinese-checkers-2-players.mjs
// (pravidla z crates/halma-core, viz docs/plan.md, úkol 122), věta po větě česky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak hra začíná</h2>
      <p>Každý hráč má 10 kamenů. Začínají ve dvou hrotech hvězdy, které jsou proti sobě: červený dole, modrý nahoře. Těch 20 kamenů stojí na desce o 121 polích.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Hvězdicová deska s 10 červenými kameny v dolním hrotu a 10 modrými kameny v horním hrotu",
  tekst: "Červený začíná dole, modrý nahoře.",
})}
      <p>Hráč 1, červený, táhne první. Potom se střídáte, každý jedním tahem. Tah je jeden krok nebo řetěz skoků jedním kamenem. Kroky a skoky najdete v <a href="/cs/pravidla/cinska-dama">pravidlech čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Váš cíl je start druhého hráče</h2>
      <p>Vyhrajete, když přesunete všech 10 svých kamenů do hrotu, kde začal druhý hráč. Ten hrot je na začátku plný jeho kamenů a ten váš je plný vašich. Pro červeného je to horní hrot na obrázku výše.</p>
      <p>Dopadnout můžete jen na prázdné pole, takže každý z vás musí svůj hrot opustit, než ho druhý může zaplnit. Nikdo z vás nemůže dokončit, dokud v cíli zůstává kámen druhého. A protože procházíte stejným středem opačnými směry, kameny druhého hráče jsou odrazovým můstkem pro vás a vaše pro něj. Co s tím dělat, si přečtěte v <a href="/cs/navody/cinska-dama-strategie">tipech ke strategii</a>.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vítězství a vzdání hry</h2>
      <ul>
        <li><strong>Vítězství:</strong> kdo první zaplní cíl všemi 10 kameny, vyhrává, a hra okamžitě končí. Druhý hráč už nehraje dál.</li>
        <li><strong>Vzdání:</strong> vaše kameny zmizí z desky a vyhrává druhý hráč.</li>
        <li><strong>Čas (online):</strong> v online hře má každý tah časový limit. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Jak se liší hra se 3, 4 a 6 hráči</h2>
      <ul>
        <li><strong>3 hráči:</strong> kameny začínají v každém druhém hrotu a tři cíle jsou na začátku prázdné. Kdo skončí první, vyhrává; ostatní hrají dál o další místa a hráč, který je hotový, se přeskakuje.</li>
        <li><strong>4 hráči:</strong> dva páry hrotů vedle sebe. Váš cíl je na začátku plný kamenů jiného hráče. Hra po prvním dokončení pokračuje, stejně jako při 3.</li>
        <li><strong>6 hráčů:</strong> všech šest hrotů. Na desce je 60 kamenů, oproti 20 při 2 hráčích.</li>
      </ul>
      <p>Když je na desce jen 20 kamenů, je méně kamenů k přeskakování, takže žebříky, které si postavíte sami, mají větší váhu. Na <a href="/cs/pravidla/cinska-dama">stránce s pravidly</a> jsou obrázky každého začátku.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrát ve 2 hráčích v Leapstone</h2>
      <ul>
        <li><strong>Proti počítači, hned teď:</strong> otevřete <a href="/play/">Leapstone v prohlížeči</a>, klepněte na Počítač a vyberte hvězdicovou desku. Výchozí je jeden počítač, takže je to hra pro 2. Vyberete si Snadná, Normální nebo Těžká a jste hráč 1, takže táhnete první. Snadná vybere nejlepší ze tří náhodných tahů. Normální vybere tah s největším postupem k cíli. Těžká se navíc dívá, jak mohou odpovědět její soupeři, a na svůj vlastní příští tah.</li>
        <li><strong>Hrát online, v aplikaci:</strong> rychlá hra na hvězdicové desce pro 2 hráče, proti jinému hráči vaší úrovně, s 30 sekundami na tah. Někteří online soupeři mohou být počítačoví hráči.</li>
        <li><strong>S přítelem:</strong> pošlete pozvánkový odkaz a čas na tah si nastavte sami. Nebo si podávejte jeden telefon.</li>
      </ul>
      <p><a href="/cs/navody/cinska-dama-online-s-prateli">Čínská dáma online s přáteli</a></p>
      <p><a href="/cs/navody/cinska-dama-pro-tri-hrace">Čínská dáma pro 3 hráče</a></p>
    </section>`;

export default {
  nav: "Čínská dáma pro 2 hráče",
  titel: "Čínská dáma pro 2 hráče: začátek a pravidla | Leapstone",
  beschrijving: "Jak funguje čínská dáma pro 2 hráče: kde začíná 10 kamenů, kdo táhne první, jak vyhrát nebo vzdát hru a kde hrát zdarma.",
  h1: "Čínská dáma pro 2 hráče",
  intro: "Jak funguje hra ve dvou na hvězdicové desce: začátek, kdo táhne první, jak vyhrát a kde ji můžete hrát.",
  inhoud,
};
