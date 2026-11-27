// Česká příručka Čínská dáma pro 3 hráče (úkol 299): /cs/navody/cinska-dama-pro-tri-hrace.
// Obsah: anglická příručka ../en/chinese-checkers-3-players.mjs (úkol 139, pravidla z crates/halma-core), věta po větě česky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak hra začíná</h2>
      <p>Každý hráč má 10 kamenů, takže 30 kamenů stojí na desce o 121 polích. Začínají v každém druhém hrotu hvězdy: červený dole, modrý nahoře vlevo a zelený nahoře vpravo. Tři hroty mezi nimi jsou prázdné.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Hvězdicová deska s 10 červenými kameny v dolním hrotu, 10 modrými kameny v hrotu vlevo nahoře a 10 zelenými kameny v hrotu vpravo nahoře",
  tekst: "Červený dole, modrý vlevo nahoře, zelený vpravo nahoře.",
})}
      <p>Hráč 1, červený, táhne první. Potom je modrý hráč 2, zelený je hráč 3 a po zeleném je zase na řadě červený. Tah je jeden krok nebo řetěz skoků jedním kamenem. Kroky a skoky najdete v <a href="/cs/pravidla/cinska-dama">pravidlech čínské dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tři cíle, na začátku všechny prázdné</h2>
      <p>Váš cíl je hrot naproti tomu, kde jste začali, a se 3 hráči je na začátku prázdný. Je to prázdný hrot mezi starty dvou ostatních hráčů: cíl červeného je nahoře, cíl modrého vpravo dole a cíl zeleného vlevo dole.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Hvězdicová deska pro tři hráče. Čárkované kroužky v barvě každého hráče označují tři prázdné cíle: červený nahoře, modrý vpravo dole, zelený vlevo dole.",
  tekst: "Každý cíl má barvu svého hráče.",
})}
      <p>Vyhrajete, když přesunete všech 10 svých kamenů do cíle. Všech 10 polí musí obsadit vaše vlastní kameny. Nikdo nezačíná ve vašem cíli, ale můžete se zastavit na jakémkoli prázdném poli, takže tam může později dopadnout kámen jiného hráče. Dokud tam stojí, nemůžete dokončit.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vítězství a co následuje</h2>
      <ul>
        <li><strong>Vítězství:</strong> kdo první zaplní cíl, vyhrává. Hra tím nekončí: zbylí dva hrají dál o další místa a hráč, který je hotový, se přeskakuje. Hra skončí, když hraje už jen jeden hráč.</li>
        <li><strong>Vzdání:</strong> vaše kameny zmizí z desky a zbylí dva hrají dál. Pokud se vzdá druhý hráč dřív, než někdo dokončí, vyhrává poslední hráč, který zůstal.</li>
        <li><strong>Čas (online):</strong> v online hře má každý tah časový limit, který nastaví hráč, jenž hru začíná. Když vám čas vyprší, váš tah se přeskočí. Pokud vynecháte 3 tahy za sebou, hru vzdáte a hra pokračuje bez vás.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Čím se liší od hry pro 2</h2>
      <ul>
        <li><strong>Více kamenů:</strong> 30 na desce, oproti 20 při 2 hráčích.</li>
        <li><strong>Prázdné cíle:</strong> se 2 hráči je váš cíl na začátku plný kamenů druhého hráče. Se 3 je prázdný.</li>
        <li><strong>Dva soupeři:</strong> po vašem tahu táhnou dva další hráči, než jste zase na řadě. Kameny obou jsou odrazovým můstkem pro vás a vaše pro ně. Žebřík, který postavíte, mohou využít oba, a hráč po vás má přednost.</li>
        <li><strong>Hra pokračuje:</strong> se 2 hráči hra končí, když je jeden z vás hotový. Se 3 pokračuje o druhé a třetí místo.</li>
      </ul>
      <p>O hře ve dvou si přečtěte <a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>. <a href="/cs/navody/cinska-dama-strategie">Tipy ke strategii</a> jsou o krocích a skocích, které jsou se 3 hráči stejné.</p>
      <p><a href="/cs/navody/cinska-dama-online-s-prateli">Čínská dáma online s přáteli</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrát ve 3 hráčích v Leapstone</h2>
      <ul>
        <li><strong>Proti počítači, hned teď:</strong> otevřete <a href="/play/">Leapstone v prohlížeči</a>, klepněte na Počítač, vyberte hvězdicovou desku a 2 počítače. Jste hráč 1, takže táhnete první. Pro počítače si vyberete Snadná, Normální nebo Těžká.</li>
        <li><strong>Na jednom telefonu:</strong> klepněte na „Na tomto telefonu“, vyberte hvězdicovou desku a 3 hráče a pak klepnutím na kámen přepněte dané místo mezi člověkem a počítačem.</li>
        <li><strong>Online s přáteli:</strong> klepněte na Přátelé, vyberte hvězdicovou desku, 3 hráče a čas na tah a pošlete pozvánkový odkaz. Hra začne, když jsou obsazena všechna 3 místa.</li>
        <li><strong>Rychlé hry:</strong> Hrát online najde hry pro 2 nebo 4 hráče, takže pro 3 žádná rychlá hra není.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínská dáma pro 3 hráče",
  titel: "Čínská dáma pro 3 hráče: začátek a pravidla | Leapstone",
  beschrijving: "Jak funguje čínská dáma se 3 hráči: kde začíná 30 kamenů, který prázdný hrot je cílem každého, kdo táhne první a jak se vyhrává.",
  h1: "Čínská dáma pro 3 hráče",
  intro: "Jak funguje hra pro tři na hvězdicové desce: začátek, tři cíle, kdo táhne první, jak se vyhrává a kde ji můžete hrát.",
  inhoud,
};
