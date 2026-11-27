// Slovenský návod Stratégia čínskej dámy (taak 134): /sk/navody/cinska-dama-strategia.
// Obsah: anglický návod ../en/chinese-checkers-strategy.mjs (každý tip skontrolovaný voči crates/halma-core), veta po vete po slovensky.
// Žiadni vymyslení "experti", čísla ani história. Jediné číslo je 16 (krokov od hrotu k hrotu), ktoré príklad spočíta.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Na čom tieto tipy stoja</h2>
      <p>Tipy vychádzajú z <a href="/sk/pravidla/cinska-dama">pravidiel čínskej dámy</a>, ako ju hrá Leapstone: jeden ťah je jeden krok alebo reťaz skokov a môžete skákať cez kameň akejkoľvek farby. Nie sú dôkazom najlepšej hry. Najrýchlejšie ich vyskúšate hrou proti počítaču.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Stavajte rebríky</h2>
      <p>Rebrík je línia kameňov s jedným voľným poľom medzi každými dvoma. Kameň na jednom konci preskáče celú líniu jediným ťahom, takže prejde cez dosku za jeden ťah namiesto jedného poľa za ťah.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Štyri kamene v uhlopriečnej línii s voľným poľom medzi každými dvoma. Červený kameň na jednom konci preskočí všetky štyri, so štyrmi očíslovanými poliami pristátia.",
  tekst: "Štyri skoky v jednom ťahu. Ten istý kameň by inak mohol ísť len po jednom poli.",
})}
      <p>Skok funguje vo všetkých šiestich smeroch, aj dozadu, takže rebrík nemusí začínať vo vašom hrote. Poslúži akákoľvek línia kameňov s medzerami medzi nimi.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Držte kamene pokope</h2>
      <p>Potrebujete všetkých 10 kameňov v cieli, takže o tom, kedy skončíte, rozhoduje váš posledný kameň. Kameň, ktorý nemá vedľa seba žiadny kameň, nemá cez čo skákať a môže len krokovať.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Hviezdicová doska s červeným kameňom osamote v dolnom hrote. Označení sú len jeho dvaja voľní susedia. Ďalšie červené a modré kamene stoja uprostred.",
  tekst: "Tento kameň nemá suseda, takže môže urobiť krok len na dve označené polia.",
})}
      <p>Od špičky vášho hrotu po špičku cieľa cez dosku je 16 krokov. To je 16 ťahov pre kameň osamote, kým rebrík prejde za jeden. Ťahajte kamene vzadu, kým sú okolo nich ešte kamene, cez ktoré môžu skákať. Počítač v Leapstone to robí tiež: ťahy svojich najzadnejších kameňov hodnotí o niečo vyššie.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Využívajte stred</h2>
      <p>Kameň v strede dosky má šesť susedov, takže môže krokovať alebo skákať vo všetkých šiestich smeroch. Kameň na okraji ich má menej. Kameň na okraji na obrázku ich má štyri.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Hviezdicová doska s jedným červeným kameňom v strede so šiestimi označenými susedmi a jedným červeným kameňom pri ľavom hornom okraji so štyrmi označenými susedmi.",
  tekst: "Šesť spôsobov kroku v strede, štyri na okraji.",
})}
      <p>Kamene v strede dávajú aj ostatným kameňom niečo na preskakovanie na ceste cez dosku.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Plňte cieľ odzadu</h2>
      <p>Váš cieľ je trojuholník s 10 poľami, v radoch po 4, 3, 2 a 1. K poliam vzadu sa dá dostať len cez polia pred nimi. Ak najprv zaplníte predok, posledný kameň už nemusí mať cestu dnu.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Cieľový hrot hore s deviatimi červenými kameňmi a jedným voľným poľom celkom vzadu, označeným prerušovanou čiarou. Desiaty červený kameň, s bielym kruhom, stojí pod predným radom.",
  tekst: "Deväť kameňov je doma a pole vzadu je voľné. Desiaty kameň doň nemá ťah.",
})}
      <p>Prvé kamene dávajte na polia vzadu a postupujte dopredu, aby predok zostal otvorený pre kamene, ktoré prídu ako posledné.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Neuzatvárajte kameň vo svojom cieli</h2>
      <p>Zastaviť sa môžete v hrote iného hráča, takže kameň iného hráča sa môže ocitnúť vo vašom cieli. Vyhráte len vtedy, keď všetkých 10 polí vášho cieľa obsadzujú vaše vlastné kamene. Ak ten kameň nemá ťah, nikto ním nemôže hýbať a nemôžete vyhrať, kým sa vedľa neho neuvoľní pole.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Cieľový hrot hore s deviatimi červenými kameňmi a jedným modrým kameňom celkom vzadu, označeným bielym kruhom. Modrý kameň je obklopený červenými kameňmi.",
  tekst: "Modrý kameň vzadu nemá ťah a červený nemôže zaplniť cieľ.",
})}
      <p>Nechajte pole vedľa takého kameňa voľné, aby mohol odísť. Počítač v Leapstone s tým počíta: ťah, ktorý uväzní kameň iného hráča v jeho cieli, dostane nižšie hodnotenie. Pravidlá nikoho nenútia opustiť váš cieľ, takže druhý hráč tam môže kameň nechať stáť aj naschvál.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Zablokujte skok, alebo ho nechajte</h2>
      <p>Skok potrebuje voľné pole na pristátie. Zaplňte to pole a skok je preč. Cez dva kamene za sebou sa tiež nedá skákať.</p>
      <p>Vaše kamene sú pre druhého hráča tiež odrazovými mostíkmi. Na ľavom obrázku modrý prejde cez dva červené kamene jedným ťahom. Vpravo červený presunul jeden kameň na prvé pole pristátia a modrý môže len krokovať.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Modrý kameň s dvoma červenými kameňmi v línii, každý s voľným poľom za sebou. Šípky ukazujú dva skoky modrého kameňa.",
          tekst: "Pred: modrý môže urobiť dva skoky.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Tá istá línia po tom, čo červený presunul svoj vzdialený kameň na prvé pole pristátia. Za modrým kameňom idú dva červené kamene za sebou.",
          tekst: "Po: červený presunul jeden kameň. Modrý nemá skok.",
        })}
      </div>
      <p>Ťah strávený blokovaním je ťah, ktorý nepostúpil váš vlastný postup, takže blokujte, keď skok dá druhému hráčovi viac, než by vám dal váš ťah. Naopak je to pri stavbe rebríka: po vašom ťahu ide prvý druhý hráč, takže jeho kameň na jednom konci použije váš rebrík skôr než vy. Na najťažšej úrovni sa počítač pred výberom ťahu pozrie na najlepšiu odpoveď každého súpera.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pokračujte</h2>
      <ul>
        <li><a href="/play/">Zahrajte si proti počítaču v prehliadači</a> a skúste rebrík.</li>
        <li><a href="/sk/navody/cinska-dama-pre-dvoch">Čínska dáma pre 2 hráčov</a>: ako funguje hra pre dvoch.</li>
        <li><a href="/sk/pravidla/cinska-dama">Pravidlá čínskej dámy</a>, s obrázkami krokov, skokov a reťazí.</li>
      </ul>
      <p><a href="/sk/navody/cinska-dama-online-s-priatelmi">Čínska dáma online s priateľmi</a></p>
      <p><a href="/sk/navody/halma-alebo-cinska-dama">Halma, alebo čínska dáma</a></p>
      <p><a href="/sk/navody/cinska-dama-pre-troch">Čínska dáma pre 3 hráčov</a></p>
    </section>`;

export default {
  nav: "Stratégia čínskej dámy",
  titel: "Stratégia čínskej dámy: 6 tipov s obrázkami | Leapstone",
  beschrijving: "Stratégia čínskej dámy: stavajte rebríky, držte kamene pokope, využívajte stred, plňte cieľ odzadu a vedzte, kedy zablokovať skok.",
  h1: "Stratégia čínskej dámy",
  intro: "Šesť tipov pre hviezdicovú dosku, každý s obrázkom zo skutočných pravidiel: rebríky, zaostávajúce kamene, stred, plnenie cieľa a blokovanie skokov.",
  inhoud,
};
