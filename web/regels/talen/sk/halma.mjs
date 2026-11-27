// Slovenská stránka s pravidlami Halmy, taak 134. Obsah: anglická stránka ../en/halma.mjs (skontrolovaná voči crates/halma-core), veta po vete po slovensky.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 hráči: každý 19 kameňov",
    alt: "Štvorcová doska s 19 červenými kameňmi v ľavom hornom rohu a 19 modrými kameňmi v pravom dolnom rohu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 hráči: každý 13 kameňov",
    alt: "Štvorcová doska s 13 kameňmi v každom zo štyroch rohov: červené vľavo hore, modré vpravo hore, zelené vpravo dole a žlté vľavo dole",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Doska</h2>
      <p>Halma sa hrá na štvorcovej doske s 16 × 16 poľami, spolu 256. Každé pole má až osem susedov: štyroch priamych a štyroch uhlopriečnych. Pole na okraji má menej a roh má troch.</p>
      <p>Toto je Štvorcová doska v Leapstone. Ak poznáte hru na hviezdicovej doske, prečítajte si o <a href="/sk/pravidla/sternhalma">Sternhalme</a> a <a href="/sk/pravidla/cinska-dama">pravidlá čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Ako kamene začínajú</h2>
      <p>Halma je pre 2 alebo 4 hráčov. Každý hráč začína s kameňmi v tábore v rohu dosky. Tábor v protiľahlom rohu je váš cieľ.</p>
      <ul>
        <li><strong>2 hráči:</strong> každý 19 kameňov, v dvoch rohoch oproti sebe. Tábor tvorí päť radov s 5, 5, 4, 3 a 2 poľami.</li>
        <li><strong>4 hráči:</strong> každý 13 kameňov, v každom rohu jeden tábor. Tábor tvoria štyri rady so 4, 4, 3 a 2 poľami. Váš cieľ je roh cez dosku, uhlopriečne.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Striedanie ťahov</h2>
      <p>Hráč 1 ide prvý. Potom idú ťahy v poradí a po poslednom hráčovi je znova na ťahu Hráč 1. V Leapstone farby patria k číslam: červená, modrá, zelená a žltá.</p>
      <p>Na svojom ťahu posuniete jeden kameň, raz. Nič sa neberie: kamene zostávajú na doske, kým sa ich hráč nevzdá.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Presuňte kameň na voľné pole vedľa neho, v ktoromkoľvek z ôsmich smerov: priamo alebo uhlopriečne.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Červený kameň s bielym kruhom okolo. Piati z ôsmich jeho susedov sú voľní a označení; ostatní traja majú kamene.",
  tekst: "Červený kameň môže urobiť krok na päť označených polí. Ostatní traja susedia sú obsadení.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskočte jeden kameň vedľa vášho, akejkoľvek farby, a pristaňte na voľnom poli hneď za ním, v priamej línii. Skákať môžete vo všetkých ôsmich smeroch, aj uhlopriečne a dozadu.</p>
      <ul>
        <li>Pole, na ktorom pristanete, musí byť voľné.</li>
        <li>Nemôžete preskočiť dva kamene za sebou ani prázdne pole.</li>
        <li>Kameň, ktorý preskočíte, zostáva tam, kde je.</li>
        <li>Nemôžete preskočiť cez okraj dosky.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Červený kameň preskakuje uhlopriečne modrý kameň na voľné pole za ním, znázornené šípkou.",
  tekst: "Červený kameň preskakuje uhlopriečne modrý kameň.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Reťaz skokov</h2>
      <p>Po skoku môže ten istý kameň skákať znova, koľkokrát vie, v ktoromkoľvek smere, priamo alebo uhlopriečne. Vy rozhodnete, kde sa zastavíte. Všetky skoky dokopy sú jeden ťah.</p>
      <ul>
        <li>V jednom ťahu nemôžete pristáť na tom istom poli dvakrát.</li>
        <li>Ťah je jeden krok, alebo jeden či viac skokov. Po skoku už nemôžete urobiť krok.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Červený kameň urobí tri skoky v jednom ťahu: uhlopriečne cez modrý kameň, priamo cez ďalší modrý kameň a uhlopriečne cez červený kameň. Tri polia pristátia sú očíslované 1, 2 a 3.",
  tekst: "Jeden ťah s tromi skokmi, v poradí podľa čísel.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cieľ</h2>
      <p>Vyhráte, keď presuniete všetky svoje kamene do tábora oproti tomu, z ktorého ste začali. Každé pole tohto tábora musí obsadzovať váš vlastný kameň: 19 pri 2 hráčoch, 13 pri 4 hráčoch. Kým tam sedí kameň iného hráča, nemôžete skončiť.</p>
      <p>Pristáť môžete na ktoromkoľvek voľnom poli, aj v táboroch iných hráčov. Kameň, ktorý je vo vašom cieli, môže znova odísť; nič ho nezamyká.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Štvorcová doska pre dvoch hráčov. Červený začína vľavo hore; tábor vpravo dole, označený prerušovanými kruhmi a s modrými kameňmi, je cieľ červeného.",
  tekst: "Pri 2 hráčoch je cieľ červeného tábor, v ktorom začína modrý.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pri 2 alebo 4 hráčoch</h2>
      <ul>
        <li><strong>2 hráči:</strong> vyhráva prvý hráč, ktorý zaplní cieľ, a hra sa skončí.</li>
        <li><strong>4 hráči:</strong> vyhráva prvý hráč, ktorý zaplní cieľ. Ostatní hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje. Hra sa skončí, keď hrá už len jeden hráč.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Vzdanie sa</h2>
      <p>Keď sa vzdáte, vaše kamene zmiznú z dosky, takže nikomu nezavadzajú. Pri 2 hráčoch vyhráva druhý hráč. Pri 4 hráčoch hra pokračuje bez vás a ak sa vzdajú všetci okrem jedného, vyhráva posledný hráč.</p>
      <p>V online hre má každý ťah časový limit. Nastavuje ho hráč, ktorý hru začína. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa. Hry proti počítaču a na jednom telefóne nemajú časový limit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipy</h2>
      <ul class="tips">
        <li><strong>Stavajte rebríky.</strong> Dajte kamene do línie s jedným voľným poľom medzi nimi, priamo alebo uhlopriečne, smerom k vášmu cieľu. Jeden kameň potom môže preskákať celou líniou jediným ťahom.</li>
        <li><strong>Každý kameň je rebrík.</strong> Preskakovať môžete kamene každej farby, takže pomáhajú aj kamene ostatných hráčov. A vaše vlastné rebríky pomáhajú im: pozrite sa, čo za sebou necháte.</li>
        <li><strong>Využívajte uhlopriečky.</strong> Cieľ je v protiľahlom rohu, takže uhlopriečna línia kameňov je najrýchlejšia cesta cez dosku.</li>
        <li><strong>Nezabúdajte na zaostávajúce kamene.</strong> Potrebujete všetky kamene doma. Kameň ďaleko vzadu, ktorý nemá cez čo skákať, sa pohne o jedno pole za ťah. Zoberte ho so sebou, kým sú okolo neho ešte ostatné kamene.</li>
        <li><strong>Váš štart je ich cieľ.</strong> Pri 2 hráčoch je váš tábor cieľom druhého hráča a ten nemôže skončiť, kým je tam ešte jeden z vašich kameňov. Leapstone vám dovoľuje nechať jeden kameň doma, takže môžete takto blokovať. To isté platí pre vás.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Otázky</h2>
      <h3>Koľko ľudí môže hrať Halmu?</h3>
      <p>Dvaja alebo štyria. Halma sa hrá na štvorcovej doske s 16 × 16 poľami a každý hráč začína v rohu.</p>
      <h3>Koľko kameňov má každý hráč v Halme?</h3>
      <p>Pri 2 hráčoch po 19 kameňov, pri 4 hráčoch po 13 kameňov.</p>
      <h3>Kto vymyslel Halmu?</h3>
      <p>George Howard Monks, americký chirurg, v roku 1883 alebo 1884. Názov je grécky a znamená &bdquo;skok&ldquo;. Viac si prečítajte v článku <a href="/sk/pravidla/sternhalma">Sternhalma</a>.</p>
      <h3>Aký je rozdiel medzi Halmou a čínskou dámou?</h3>
      <p>Halma má štvorcovú dosku, kroky a skoky v ôsmich smeroch a 19 alebo 13 kameňov na hráča. Čínska dáma má hviezdicovú dosku, šesť smerov a 10 kameňov na hráča, pre 2, 3, 4 alebo 6 hráčov.</p>
      <h3>Dá sa hrať Halma online zadarmo?</h3>
      <p>Áno, v Leapstone, v prehliadači alebo v aplikácii z App Store. Vyberte spôsob hry, napríklad proti počítaču alebo online s priateľmi, a potom ťuknite na Štvorcová doska. Leapstone je zadarmo a bez reklám.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Zahrajte si</h2>
      <p>Tlačidlo Hrať hneď otvorí hru proti počítaču na <a href="/sk/pravidla/cinska-dama">hviezdicovej doske</a>. Ak chcete hrať Halmu, ťuknite hore na šípku späť, potom vyberte Hrať na tomto telefóne, Hrať proti počítaču alebo Hrať online s priateľmi a ťuknite na Štvorcová doska.</p>
    </section>`;

export default {
  nav: "Pravidlá Halmy",
  titel: "Pravidlá Halmy a tipy | Leapstone",
  beschrijving: "Ako hrať Halmu na štvorcovej doske 16 × 16: začiatok, kroky, skoky, reťaze skokov, ako vyhrať a tipy. Hrajte zadarmo v prehliadači.",
  h1: "Pravidlá Halmy",
  intro: "Presuňte všetky svoje kamene cez štvorcovú dosku do protiľahlého rohu skôr než ktokoľvek iný. Pravidlá stručne, s obrázkami, a pár tipov.",
  inhoud,
};
