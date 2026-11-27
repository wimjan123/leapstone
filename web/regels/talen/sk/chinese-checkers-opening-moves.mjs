// Slovenský návod Čínska dáma: úvodné ťahy (taak 303): /sk/navody/cinska-dama-otvorenie.
// Obsah: anglický návod ../en/chinese-checkers-opening-moves.mjs (každé číslo a ťah skontrolované voči crates/halma-core), veta po vete po slovensky.
// Len čísla v texte (žiadne číslovky slovom). Žiadni vymyslení "experti" ani história.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Váš prvý ťah: 14 možností</h2>
      <p>Na začiatku vašich 10 kameňov vypĺňa trojuholník v radoch po 4, 3, 2 a 1 a predný rad smeruje do stredu dosky. Vnútri trojuholníka nie je žiadne voľné pole, takže kameň môže ísť len do radu tesne pred sebou. Zostáva 14 prvých ťahov: každý zo 4 kameňov v prednom rade môže krokovať na 2 polia (8 krokov) a každý z 3 kameňov v druhom rade môže preskočiť predný kameň na 2 polia (6 skokov). Ostatné 3 kamene sa zatiaľ nemôžu hýbať.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Červený hrot dole s 10 kameňmi a v rade tesne pred ním 5 voľných polí označených krúžkom.",
  tekst: "Každý prvý ťah končí na jednom z týchto 5 polí.",
})}
      <p>V tomto návode je rad línia polí naprieč vaším hrotom, rovnobežná s jeho prednou hranou, a postup počítame v radoch. Krok posunie kameň dopredu o 1 rad a skok o 2 rady. Každý hráč má rovnakých 14 prvých ťahov, pri 2, 3, 4 alebo 6 hráčoch a z ktoréhokoľvek hrotu hviezdy, pretože zvnútra vyzerá každý hrot rovnako.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Otvorenie 1: vyskočte a uvoľnite špičku</h2>
      <p>Kameň v špičke vášho hrotu je najďalej od vášho cieľa a na začiatku sa nemôže hýbať: cez kameň môže skočiť len vtedy, keď je pole za ním voľné. Skok z druhého radu také pole vytvorí.</p>
      <ol>
        <li><strong>Ťah 1:</strong> kameň na pravom konci vášho druhého radu preskočí kameň pred sebou. Pristane v rade pred vaším hrotom a získa 2 rady.</li>
        <li><strong>Ťah 2:</strong> kameň v špičke skočí v jednom ťahu dvakrát: najprv na pole, ktoré uvoľnil ťah 1, potom cez kameň druhého radu. Získa 4 rady.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Červený hrot po ťahu 1. Kameň v špičke má krúžok a 2 šípky s číslami 1 a 2 ukazujú jeho skoky cez uvoľnené pole do radu pred hrotom.",
  tekst: "Po ťahu 1 kameň v špičke vyskočí 2 skokmi.",
})}
      <p>To je 6 radov za 2 ťahy. Vyskúšali sme všetky spôsoby, ako zahrať 2 ťahy, a 6 je najviac, čo sa dá získať. Dosiahnuť to dokáže len 4 dvojice ťahov: skočí kameň na ktoromkoľvek konci druhého radu, v ktoromkoľvek z jeho 2 smerov, a kameň v špičke ho nasleduje. Kameň uprostred druhého radu nefunguje, pretože nechá špičku zatvorenú.</p>
      <p>Oba kamene teraz stoja v rade pred vaším hrotom s voľným poľom medzi sebou. To je prvý krok rebríka.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Otvorenie 2: 4 ťahy so 4 rôznymi kameňmi</h2>
      <p>Za 4 ťahy môžete získať najviac 13 radov a dosiahnete to len vtedy, keď každý ťah použije iný kameň. Táto línia to dokáže:</p>
      <ol>
        <li><strong>Ťah 1:</strong> kameň na pravom konci predného radu krokuje dopredu. Získa 1 rad.</li>
        <li><strong>Ťah 2:</strong> kameň na pravom konci tretieho radu skočí dvakrát. Získa 4 rady.</li>
        <li><strong>Ťah 3:</strong> kameň na ľavom konci druhého radu skočí dvakrát. Získa 4 rady.</li>
        <li><strong>Ťah 4:</strong> kameň v špičke skočí dvakrát. Získa 4 rady.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Červený hrot na začiatku. Štyri kamene, ktoré sa pohnú, majú číslo od 1 do 4 v poradí ťahov.",
          tekst: "Pred: kamene, ktoré sa pohnú, v poradí.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Červený hrot po 4 ťahoch so 4 poľami, kde pristáli očíslované kamene v radoch pred hrotom, a so 4 dierami, ktoré zostali v hrote.",
          tekst: "Po: kde pristáli.",
        })}
      </div>
      <p>Každý ťah pripravuje ďalší. Ťahy 2 a 3 končia skokom cez kameň, ktorý sa pohol tesne predtým, a ťah 4 začína cez dieru, ktorú nechal ťah 3. Všetky 4 kamene pristanú vo vašej polovici dosky.</p>
      <p>Existujú ďalšie línie, ktoré dosiahnu 13. Spája ich myšlienka: hľadajte ťah, ktorý nechá dieru alebo odrazový mostík pre ďalší ťah, a kameň v špičke vypustite najneskôr ťahom 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Chyby v prvých ťahoch</h2>
      <ul class="tips">
        <li><strong>Ťahať každé kolo tým istým kameňom.</strong> Kameň, ktorý beží sám, získa za 4 ťahy 5 radov, oproti 13 pri 4 rôznych kameňoch. Ostatné kamene navyše zostanú tam, kde boli.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Červený hrot na začiatku. Jeden kameň z druhého radu urobí 4 ťahy za sebou po jednej línii, so šípkami a číslami od 1 do 4, a skončí sám pri strede dosky.",
  tekst: "Jeden kameň, 4 ťahy, 5 radov.",
})}
      <ul class="tips">
        <li><strong>Krokovať len predným radom.</strong> 4 kroky získajú 4 rady. Po nich sa kameň v špičke stále nemôže hýbať, takže zostane vzadu, kým zvyšok ide dopredu.</li>
        <li><strong>Krokovať do strany.</strong> Krok pozdĺž radu získa 0 radov. Po ťahu 1 otvorenia 1 môže predný kameň krokovať na pole vedľa seba a vyzerá to ako postup, ale ťah je zbytočný.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pokračujte</h2>
      <p>Po asi 4 ťahoch sa obe armády priblížia a otvorenia vyššie ustúpia stredu hry. Nemusíte si pamätať línie: pamätajte si, že každý ťah má pripraviť ďalší.</p>
      <ul>
        <li><a href="/play/">Zahrajte si proti počítaču v prehliadači</a> a skúste otvorenie 1 alebo 2.</li>
        <li><a href="/sk/navody/cinska-dama-strategia">Stratégia čínskej dámy</a>: rebríky, držanie kameňov pokope a plnenie cieľa.</li>
        <li><a href="/sk/navody/cinska-dama-pre-dvoch">Čínska dáma pre 2 hráčov</a>: ako funguje hra pre dvoch.</li>
        <li><a href="/sk/pravidla/cinska-dama">Pravidlá čínskej dámy</a>, s obrázkami krokov, skokov a reťazí.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínska dáma: úvodné ťahy",
  titel: "Úvodné ťahy v čínskej dáme: 2 otvorenia | Leapstone",
  beschrijving: "Úvodné ťahy v čínskej dáme: ako vyskočiť z hrotu, uvoľniť kameň v špičke ťahom 2 a získať 13 radov za 4 ťahy, a chyby, ktorým sa vyhnúť.",
  h1: "Úvodné ťahy v čínskej dáme",
  intro: "Dobré otvorenie v čínskej dáme vyskočí z druhého radu, v každom kole použije iný kameň a kameň v špičke vypustí ťahom 2 alebo 4. Dve otvorenia s obrázkami a chyby, ktorým sa vyhnúť.",
  inhoud,
};
