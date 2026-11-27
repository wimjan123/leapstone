// Česká příručka Čínská dáma pro 6 hráčů (úkol 302, feature 294): /cs/navody/cinska-dama-pro-sest-hracu.
// Obsah: anglická příručka ../en/chinese-checkers-6-players.mjs (pravidla z crates/halma-core, viz docs/plan.md, úkol 302), věta po větě česky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak hra začíná</h2>
      <p>Každý hráč má 10 kamenů a všech 6 hrotů hvězdy je v použití. Na desce o 121 polích tak stojí 60 kamenů. 61 polí uprostřed je na začátku prázdných.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Hvězdicová deska s 10 kameny v každém ze 6 hrotů, v 6 barvách",
  tekst: "6 hráčů, 6 hrotů, 60 kamenů.",
})}
      <p>Hráč 1, červený, táhne první, z dolního hrotu. Tah pak jde od hráče 1 k hráči 6 a po hráči 6 je zase na řadě hráč 1. Hráči jsou číslováni podle pořadí svých hrotů kolem hvězdy, takže hráč po vás vždy začíná v hrotu vedle vašeho. Tah je jeden krok nebo řetěz skoků jedním kamenem. Kroky a skoky najdete v <a href="/cs/pravidla/cinska-dama">pravidlech čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Každý cíl je na začátku plný</h2>
      <p>Vyhrajete, když přesunete všech 10 svých kamenů do hrotu na druhé straně desky. Při 6 hráčích je to hrot, kde začíná hráč naproti vám, takže žádný cíl není prázdný: každý začíná plný kamenů jiného hráče. Pro červeného je cílem horní hrot, kde začíná hráč 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Hvězdicová deska se 6 plnými hroty. Přerušovaný kruh označuje horní hrot, cíl červeného hráče, který je plný kamenů hráče naproti.",
  tekst: "Cíl červeného je hrot naproti, plný kamenů hráče 4.",
})}
      <p>Dopadnout můžete jen na prázdné pole, takže hráč naproti musí svůj hrot opustit, než ho zaplníte, a vy musíte opustit svůj, než ho zaplní on. Ve hře pro 2 je to vše. Při 6 se oba hráči navíc musí probít davem 4 ostatních.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Přeplněný střed</h2>
      <p>Každý cíl je na druhé straně desky a hroty se navzájem spojují jen přes střed, takže všech 60 kamenů musí přejít přes stejných 61 polí. Na začátku ještě nikdo nepřešel a střed se rychle plní.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Červený kámen skočí v jednom tahu třikrát: přes modrý kámen, pak přes zelený a pak přes fialový. Čísla 1, 2 a 3 označují pole dopadu.",
  tekst: "Kameny každé barvy jsou odrazovým můstkem.",
})}
      <p>Přeskočit můžete kámen jakékoli barvy. Kameny 5 ostatních hráčů jsou odrazovým můstkem pro vás a vaše jsou odrazovým můstkem pro všech 5. Řada kamenů, kterou necháte uprostřed, je žebřík pro každého, kdo na ni dosáhne, a hráč po vás má první tah.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokování při 5 soupeřích</h2>
      <ul>
        <li><strong>Zaplňte pole dopadu:</strong> skok potřebuje prázdné pole hned za kamenem. Když tam přesunete kámen, skok zmizí pro každého hráče, který ho chtěl.</li>
        <li><strong>Pozor na žebříky, které stavíte:</strong> po vašem tahu táhne ostatních 5 hráčů, než jste znovu na řadě. Žebřík pomáhá všem.</li>
        <li><strong>Cíl může zablokovat kdokoli:</strong> kámen kteréhokoli jiného hráče ve vašem cíli vám brání dokončit, nejen kámen hráče naproti. Všech 10 polí cíle musí obsahovat vaše vlastní kameny.</li>
      </ul>
      <p>V <a href="/cs/navody/cinska-dama-strategie">tipech ke strategii</a> uvidíte, jak vypadá zablokovaný skok a jak nezamknout kámen jiného hráče ve vlastním cíli.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Jak dlouho hra trvá</h2>
      <p>Ve hře pro 6 je 60 kamenů k přesunutí a mezi vaším tahem a dalším táhne každý z ostatních 5 hráčů jednou. Hra také nekončí, když dokončí první hráč.</p>
      <ul>
        <li><strong>Vyhrajte a hrajte dál:</strong> první hráč, který zaplní cíl, vyhrává a ostatní hrají dál o další místa. Hráč, který je hotový, se přeskakuje a jeho kameny zůstávají na desce jako odrazové můstky. Hra končí, když hraje už jen jeden hráč.</li>
        <li><strong>Vzdání:</strong> vaše kameny zmizí z desky, takže už nikomu nepřekážejí ani nepomáhají, a ostatní hrají dál.</li>
        <li><strong>Čas (online):</strong> v online hře má každý tah časový limit, který nastaví hráč, jenž hru zakládá: 15 sekund, 30 sekund, 1 minuta, 2 minuty nebo bez limitu. Kolo 6 tahů trvá nejvýše 6 krát tolik, kolik činí limit, takže při 30 sekundách je to nejvýše 3 minuty. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte a hra pokračuje bez vás.</li>
      </ul>
      <p>O hře s menším počtem hráčů si přečtěte <a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrát v Leapstone se 6 hráči</h2>
      <ul>
        <li><strong>Proti počítačům, hned teď:</strong> otevřete <a href="/play/">Leapstone v prohlížeči</a>, klepněte na Počítač, vyberte hvězdicovou desku a 5 počítačů. Jste hráč 1, takže táhnete první. Počítače táhnou jeden po druhém, každý s krátkou pauzou, takže můžete sledovat každý tah. Pro počítače si vyberete Snadná, Normální nebo Těžká.</li>
        <li><strong>Na jednom telefonu:</strong> klepněte na Hrát, vyberte hvězdicovou desku a 6 hráčů a potom klepnutím na kámen přepněte dané místo mezi člověkem a počítačem.</li>
        <li><strong>Online s přáteli:</strong> klepněte na Přátelé, vyberte hvězdicovou desku, 6 hráčů a čas na tah a pošlete pozvánkový odkaz. Hra začne, když je obsazeno všech 6 míst.</li>
        <li><strong>Rychlé hry:</strong> Hrát online hledá hry pro 2 nebo 4 hráče, takže rychlá hra pro 6 neexistuje.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínská dáma pro 6 hráčů",
  titel: "Čínská dáma pro 6 hráčů: celá deska | Leapstone",
  beschrijving: "Jak funguje čínská dáma pro 6 hráčů: plná hvězda se 60 kameny, přeplněný střed, blokování, jak dlouho hra trvá a kde ji hrát.",
  h1: "Čínská dáma pro 6 hráčů",
  intro: "Jak funguje hra pro 6: všech 6 hrotů je plných, závodíte do hrotu na druhé straně desky a hra pokračuje i poté, co první hráč dokončí.",
  inhoud,
};
