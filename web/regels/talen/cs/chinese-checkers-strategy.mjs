// Česká příručka Strategie čínské dámy (úkol 134). Obsah: anglická příručka ../en/chinese-checkers-strategy.mjs
// (každý tip zkontrolován proti crates/halma-core, viz docs/plan.md, úkol 122), věta po větě česky.
// Žádní vymyšlení „experti“, čísla ani historie. Jediné číslo je 16 (kroků od hrotu k hrotu), které příklad dopočítává.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Na čem tyto tipy stojí</h2>
      <p>Tipy vycházejí z <a href="/cs/pravidla/cinska-dama">pravidel čínské dámy</a>, jak je hraje Leapstone: jeden tah je jeden krok nebo řetěz skoků a přeskočit můžete kámen jakékoli barvy. Nejsou důkazem nejlepší hry. Nejrychlejší způsob, jak je vyzkoušet, je hrát proti počítači.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Stavte žebříky</h2>
      <p>Žebřík je řada kamenů s jedním prázdným polem mezi každými dvěma. Kámen na jednom konci přeskáče celou řadu v jediném tahu, takže přejde desku za jedno kolo místo jednoho pole za kolo.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Čtyři kameny v diagonální řadě s prázdným polem mezi každými dvěma. Červený kámen na jednom konci přeskočí všechny čtyři, se čtyřmi očíslovanými místy dopadu.",
  tekst: "Čtyři skoky v jednom tahu. Stejný kámen by mohl dělat jen krok o jedno pole.",
})}
      <p>Skok funguje ve všech šesti směrech, i dozadu, takže žebřík nemusí začínat ve vašem hrotu. Postačí jakákoli řada kamenů s mezerami mezi nimi.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Držte kameny pohromadě</h2>
      <p>Potřebujete všech 10 kamenů v cíli, takže o tom, kdy skončíte, rozhoduje váš poslední kámen. Kámen, vedle kterého nestojí žádný další, nemá co přeskakovat a může dělat jen kroky.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Hvězdicová deska s jedním červeným kamenem osamoceným v dolním hrotu. Označena jsou jen jeho dvě prázdná sousední pole. Další červené a modré kameny stojí uprostřed.",
  tekst: "Tento kámen nemá souseda, takže může udělat krok jen na dvě označená pole.",
})}
      <p>Od špičky vašeho hrotu ke špičce cílového hrotu na druhé straně desky je 16 kroků. To je 16 kol pro jeden kámen samotný, zatímco žebřík přejde za jedno. Táhněte kameny vzadu, dokud jsou kolem nich ještě kameny k přeskakování. Počítač v Leapstone to dělá také: tahy svých nejzazších kamenů hodnotí o něco výš.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Využívejte střed</h2>
      <p>Kámen uprostřed desky má šest sousedů, takže může dělat kroky nebo skoky ve všech šesti směrech. Kámen na okraji jich má méně. Kámen na okraji na obrázku jich má čtyři.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Hvězdicová deska s jedním červeným kamenem uprostřed se šesti označenými sousedy a jedním červeným kamenem poblíž okraje vlevo nahoře se čtyřmi označenými sousedy.",
  tekst: "Šest způsobů, jak udělat krok uprostřed, čtyři na okraji.",
})}
      <p>Kameny uprostřed také dávají ostatním kamenům něco k přeskakování na cestě přes desku.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Plňte cíl odzadu</h2>
      <p>Váš cíl je trojúhelník z 10 polí, v řadách po 4, 3, 2 a 1. Pole vzadu jsou dostupná jen přes pole před nimi. Když nejdřív zaplníte přední, poslední kámen se nemusí dostat dovnitř.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Cílový hrot nahoře s devíti červenými kameny a jedním prázdným polem úplně vzadu, označeným čárkami. Desátý červený kámen, s bílým kroužkem, stojí pod přední řadou.",
  tekst: "Devět kamenů je doma a pole vzadu je prázdné. Desátý kámen se do něj nemá jak dostat.",
})}
      <p>Dávejte první kameny na zadní pole a postupujte dopředu, aby přední zůstala volná pro kameny, které dorazí jako poslední.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Nezazdívejte kámen ve svém cíli</h2>
      <p>Zastavit se můžete v hrotu jiného hráče, takže kámen jiného hráče se může ocitnout ve vašem cíli. Vyhrajete, až když všech 10 polí vašeho cíle zaplní vaše vlastní kameny. Když ten kámen nemá žádný tah, nikdo s ním nemůže hnout a vy nemůžete vyhrát, dokud se vedle něj neuvolní pole.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Cílový hrot nahoře s devíti červenými kameny a jedním modrým kamenem úplně vzadu, označeným bílým kroužkem. Modrý kámen je obklopen červenými kameny.",
  tekst: "Modrý kámen vzadu nemá žádný tah a červený nemůže zaplnit cíl.",
})}
      <p>Nechte vedle takového kamene pole volné, aby mohl odejít. Počítač v Leapstone s tím počítá: tah, který uvězní kámen jiného hráče v jeho cíli, hodnotí níž. Pravidla nikoho nenutí váš cíl opustit, takže druhý hráč tam může kámen také nechat schválně.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Zablokujte skok, nebo ho nechte</h2>
      <p>Skok potřebuje prázdné pole, na které dopadne. Zaplňte to pole a skok zmizí. Dva kameny za sebou také nejdou přeskočit.</p>
      <p>Vaše kameny jsou odrazovým můstkem i pro druhého hráče. Na levém obrázku modrý přejde dva červené kameny jedním tahem. Vpravo červený posunul jeden kámen na první místo dopadu a modrý může udělat jen krok.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Modrý kámen se dvěma červenými kameny v řadě, za každým je prázdné pole. Šipky ukazují dva skoky modrého kamene.",
          tekst: "Předtím: modrý může udělat dva skoky.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Stejná řada poté, co červený posunul svůj vzdálenější kámen na první místo dopadu. Za modrým kamenem stojí dva červené kameny za sebou.",
          tekst: "Potom: červený posunul jeden kámen. Modrý nemá žádný skok.",
        })}
      </div>
      <p>Tah vynaložený na blokování je tah, který nepoužijete na vlastní postup, takže blokujte, když skok dá druhému hráči víc, než by vám dal váš tah. Opačně to platí, když stavíte žebřík: po vašem tahu táhne první druhý hráč, takže jeho kámen na jednom konci použije váš žebřík dřív než vy. Na nejtěžší úrovni se počítač před volbou tahu podívá na nejlepší odpověď každého soupeře.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pokračujte</h2>
      <ul>
        <li><a href="/play/">Zahrajte si proti počítači v prohlížeči</a> a vyzkoušejte žebřík.</li>
        <li><a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>: jak funguje hra ve dvou.</li>
        <li><a href="/cs/pravidla/cinska-dama">Pravidla čínské dámy</a>, s obrázky kroků, skoků a řetězů.</li>
      </ul>
      <p><a href="/cs/navody/cinska-dama-online-s-prateli">Čínská dáma online s přáteli</a></p>
      <p><a href="/cs/navody/halma-nebo-cinska-dama">Halma, nebo čínská dáma</a></p>
      <p><a href="/cs/navody/cinska-dama-pro-tri-hrace">Čínská dáma pro 3 hráče</a></p>
    </section>`;

export default {
  nav: "Strategie čínské dámy",
  titel: "Strategie čínské dámy: 6 tipů s obrázky | Leapstone",
  beschrijving: "Strategie čínské dámy: stavějte žebříky, držte kameny pohromadě, využívejte střed, plňte cíl odzadu a vězte, kdy blokovat skok.",
  h1: "Strategie čínské dámy",
  intro: "Šest tipů pro hvězdicovou desku, každý s obrázkem ze skutečných pravidel: žebříky, opozdilci, střed, plnění cíle a blokování skoků.",
  inhoud,
};
