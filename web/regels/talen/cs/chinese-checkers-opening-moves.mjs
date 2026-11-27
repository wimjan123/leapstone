// Česká příručka Zahájení čínské dámy (úkol 303, feature 294): /cs/navody/cinska-dama-zahajeni.
// Obsah: anglická příručka ../en/chinese-checkers-opening-moves.mjs (každé číslo a každý tah je zkontrolován proti crates/halma-core), věta po větě česky.
// Řada je množina polí se stejnou vzdáleností od vašeho hrotu; krok posune o 1 řadu, skok o 2. Žádní vymyšlení „experti“ ani historie.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Váš první tah: 14 možností</h2>
      <p>Na začátku vašich 10 kamenů tvoří trojúhelník v řadách po 4, 3, 2 a 1 a přední řada míří ke středu desky. Uvnitř trojúhelníku není žádné prázdné pole, takže kámen může jít jen do řady těsně před sebou. Zbývá tak 14 prvních tahů: každý ze 4 kamenů v přední řadě může udělat krok na 2 pole (8 kroků) a každý ze 3 kamenů ve druhé řadě může přeskočit přední kámen na 2 pole (6 skoků). Ostatní 3 kameny se zatím nemohou hýbat.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Červený hrot dole s 10 kameny a v řadě těsně před ním 5 prázdných polí označených kroužkem.",
  tekst: "Každý první tah končí na jednom z těchto 5 polí.",
})}
      <p>V této příručce je řada čára polí napříč vaším hrotem, rovnoběžná s jeho předním okrajem, a postup počítáme v řadách. Krok posune kámen dopředu o 1 řadu a skok o 2 řady. Každý hráč má stejných 14 prvních tahů, ať hraje 2, 3, 4 nebo 6 hráčů a z kteréhokoli hrotu hvězdy, protože zevnitř vypadá každý hrot stejně.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Zahájení 1: vyskočte a uvolněte špičku</h2>
      <p>Kámen ve špičce vašeho hrotu je nejdál od cíle a na začátku se nemůže hýbat: kámen může přeskočit jen tehdy, když je pole za ním prázdné. Skok z druhé řady takové pole právě vytvoří.</p>
      <ol>
        <li><strong>Tah 1:</strong> kámen na pravém konci vaší druhé řady přeskočí kámen před sebou. Dopadne do řady před vaším hrotem a získá 2 řady.</li>
        <li><strong>Tah 2:</strong> kámen ve špičce skočí dvakrát v jednom tahu: nejdřív na pole, které uvolnil tah 1, a pak přes kámen druhé řady. Získá 4 řady.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Červený hrot po tahu 1. Kámen ve špičce má kroužek a 2 šipky s čísly 1 a 2 ukazují jeho skoky přes uvolněné pole do řady před hrotem.",
  tekst: "Po tahu 1 vyskočí kámen ze špičky ve 2 skocích.",
})}
      <p>To je 6 řad ve 2 tazích. Zkusili jsme všechny způsoby, jak odehrát 2 tahy, a 6 je nejvíc, co můžete získat. Dosáhnou ho jen 4 dvojice tahů: skočí kámen na kterémkoli konci druhé řady, v kterémkoli ze 2 směrů, a kámen ze špičky ho následuje. Kámen uprostřed druhé řady nefunguje, protože drží špičku zavřenou.</p>
      <p>Oba kameny teď stojí v řadě před vaším hrotem s prázdným polem mezi sebou. To je první příčka žebříku.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Zahájení 2: 4 tahy se 4 různými kameny</h2>
      <p>Za 4 tahy můžete získat nejvýš 13 řad, a to jen tehdy, když každý tah použije jiný kámen. Tahle cesta to zvládne:</p>
      <ol>
        <li><strong>Tah 1:</strong> kámen na pravém konci přední řady udělá krok dopředu. Získá 1 řadu.</li>
        <li><strong>Tah 2:</strong> kámen na pravém konci třetí řady skočí dvakrát. Získá 4 řady.</li>
        <li><strong>Tah 3:</strong> kámen na levém konci druhé řady skočí dvakrát. Získá 4 řady.</li>
        <li><strong>Tah 4:</strong> kámen ve špičce skočí dvakrát. Získá 4 řady.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Červený hrot na začátku. 4 kameny, které se pohnou, mají číslo od 1 do 4 podle pořadí tahů.",
          tekst: "Před: kameny, které se hýbou, v pořadí.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Červený hrot po 4 tazích, se 4 poli, kam dopadly očíslované kameny v řadách před hrotem, a 4 dírami, které zůstaly v hrotu.",
          tekst: "Po: kam dopadly.",
        })}
      </div>
      <p>Každý tah připravuje další. Tahy 2 a 3 končí skokem přes kámen, který se pohnul těsně předtím, a tah 4 začíná přes díru, kterou nechal tah 3. Všechny 4 kameny dopadnou do vaší poloviny desky.</p>
      <p>Existují další cesty, které dosáhnou 13. Společná je jim myšlenka: hledejte tah, který nechá díru nebo odrazový kámen pro další tah, a kámen ze špičky pusťte ven nejpozději tahem 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Chyby v prvních tazích</h2>
      <ul class="tips">
        <li><strong>Hýbat pokaždé stejným kamenem.</strong> Kámen, který běží sám, získá za 4 tahy 5 řad, kdežto 4 různé kameny získají 13. Navíc zbytek vašich kamenů zůstane tam, kde byl.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Červený hrot na začátku. Jeden kámen z druhé řady udělá 4 tahy za sebou po jedné linii, se šipkami a čísly 1 až 4, a skončí sám poblíž středu desky.",
  tekst: "Jeden kámen, 4 tahy, 5 řad.",
})}
      <ul class="tips">
        <li><strong>Krokovat jen přední řadou.</strong> 4 kroky získají 4 řady. Kámen ve špičce se po nich pořád nemůže hýbat, takže zůstane vzadu, zatímco zbytek postupuje.</li>
        <li><strong>Krok do strany.</strong> Krok podél řady získá 0 řad. Po tahu 1 zahájení 1 může kámen vpředu udělat krok na pole vedle sebe, a vypadá to jako postup, ale tah je zbytečný.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Jak dál</h2>
      <p>Asi po 4 tazích se obě armády přiblíží a zahájení přejdou ve střední hru. Nemusíte si pamatovat jednotlivé cesty: pamatujte si, že každý tah má připravit další.</p>
      <ul>
        <li><a href="/play/">Zahrajte si proti počítači v prohlížeči</a> a vyzkoušejte zahájení 1 nebo 2.</li>
        <li><a href="/cs/navody/cinska-dama-strategie">Strategie čínské dámy</a>: žebříky, držení kamenů pohromadě a plnění cíle.</li>
        <li><a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínská dáma pro 2 hráče</a>: jak funguje hra ve dvou.</li>
        <li><a href="/cs/pravidla/cinska-dama">Pravidla čínské dámy</a> s obrázky kroků, skoků a řetězů.</li>
      </ul>
    </section>`;

export default {
  nav: "Zahájení čínské dámy",
  titel: "Zahájení čínské dámy: 2 zahájení | Leapstone",
  beschrijving: "Zahájení čínské dámy: jak vyskočit z hrotu, uvolnit kámen ze špičky tahem 2 a získat 13 řad ve 4 tazích, a kterým chybám se vyhnout.",
  h1: "Zahájení čínské dámy",
  intro: "Dobré zahájení v čínské dámě vyskočí z druhé řady, v každém tahu použije jiný kámen a pustí kámen ze špičky ven tahem 2 nebo 4. Dvě zahájení s obrázky a chyby, kterým se vyhnout.",
  inhoud,
};
