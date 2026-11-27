// Slovenský návod Čínska dáma pre 4 hráčov (taak 301, feature 294): /sk/navody/cinska-dama-pre-styroch.
// Obsah: anglický návod ../en/chinese-checkers-4-players.mjs (skontrolovaný voči crates/halma-core, docs/plan.md, taak 301), veta po vete po slovensky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ako je doska rozdelená</h2>
      <p>Každý hráč má 10 kameňov, takže na doske so 121 poľami stojí 40 kameňov. Štyri štartovacie hroty sú dve dvojice hrotov vedľa seba: červený dole a modrý vľavo dole, zelený hore a žltý vpravo hore.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote, 10 modrými kameňmi v hrote vľavo dole, 10 zelenými kameňmi v hornom hrote a 10 žltými kameňmi v hrote vpravo hore. Hroty vľavo hore a vpravo dole sú prázdne.",
  tekst: "Červený dole, modrý vľavo dole, zelený hore, žltý vpravo hore.",
})}
      <p>Hráč 1, červený, ide prvý. Potom je modrý hráč 2, zelený hráč 3, žltý hráč 4 a po žltom je opäť na rade červený. Ťah je jeden krok alebo reťaz skokov jedným kameňom. Kroky a skoky nájdete v <a href="/sk/pravidla/cinska-dama">pravidlách čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kto stojí oproti komu</h2>
      <p>Hroty tvoria dvojice oproti sebe: červený oproti zelenému a modrý oproti žltému. Váš cieľ je hrot oproti vám. Červený ide tam, kde začína zelený, zelený tam, kde začína červený, modrý tam, kde začína žltý, a žltý tam, kde začína modrý.</p>
      <p>Rovnako ako v hre pre 2 je každý cieľ na začiatku plný kameňov hráča oproti vám, takže tam môžete pristáť, až keď odídu. Pri 3 hráčoch sú ciele na začiatku prázdne, takže pri 4 nemôže nikto skončiť hneď. Štyri ciele sú štyri rôzne hroty, takže váš cieľ nechce nikto iný: hráč, ktorý skončil, nikomu nebráni.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dva prázdne hroty</h2>
      <p>Hroty vľavo hore a vpravo dole nemajú žiadne kamene. Nie sú ničím štartom ani ničím cieľom. Ten vľavo hore leží medzi modrým a zeleným a ten vpravo dole medzi žltým a červeným.</p>
      <p>Na každé voľné pole môžete vstúpiť krokom alebo skokom, takže tieto hroty môžete prejsť alebo sa v nich zastaviť. Kameň tam ešte nie je v cieli. V prázdnom hrote nie je cez čo skákať, kým tam niekto neprivedie kamene.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Čo sa mení vo vašej taktike</h2>
      <ul>
        <li><strong>Dva prechody naraz:</strong> červený a zelený prechádzajú dosku smerom k sebe a modrý so žltým tiež. Obe čiary vedú cez stred, takže stred je rušnejší ako v hre pre 2, kde prechádza len jedna čiara.</li>
        <li><strong>Traja hráči ťahajú medzi vašimi ťahmi:</strong> doska sa medzi dvoma vašimi ťahmi mení viac ako v hre pre 2. Pozrite sa na ňu znova na začiatku každého ťahu a až potom naplánujte reťaz skokov. Hráč, ktorý ťahá po vás, nikdy nie je ten, kto stojí oproti vám.</li>
        <li><strong>Kamene pomáhajú všetkým:</strong> každý kameň ostatných troch je pre vás odrazovým mostíkom a vaše sú mostíkmi pre nich. Kamene hráča oproti vám idú opačným smerom, rovnako ako v hre pre 2.</li>
        <li><strong>Miesto na obídenie:</strong> ak je stred plný, prázdne hroty sú voľný priestor vedľa táborov. Cesta cez taký hrot môže byť spôsob, ako obísť tlačenicu.</li>
        <li><strong>Hráč, ktorý sa vzdá, uvoľní váš cieľ:</strong> keď sa hráč oproti vám vzdá, jeho kamene odídu z dosky, takže váš cieľ je hneď prázdny.</li>
      </ul>
      <p><a href="/sk/navody/cinska-dama-strategia">Tipy k stratégii</a> o rebríkoch, zaostávajúcich kameňoch a plnení cieľa odzadu platia rovnako aj pri 4 hráčoch.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Výhra a čo nasleduje potom</h2>
      <ul>
        <li><strong>Výhra:</strong> vyhráva prvý hráč, ktorý zaplní cieľ všetkými 10 kameňmi. Hra tým nekončí: ostatní traja hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje. Kamene tohto hráča zostávajú na doske. Hra skončí, keď hrá už len jeden hráč.</li>
        <li><strong>Vzdanie sa:</strong> vaše kamene odídu z dosky a ostatní traja hrajú ďalej. Ak sa vzdajú aj ostatní, vyhráva posledný zostávajúci hráč.</li>
        <li><strong>Čas (online):</strong> v online hre má každý ťah časový limit. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa a hra pokračuje bez vás.</li>
      </ul>
      <p>O hrách s menším počtom hráčov si prečítajte <a href="/sk/navody/cinska-dama-pre-dvoch">Čínska dáma pre 2 hráčov</a>. <a href="/sk/pravidla/cinska-dama">Stránka s pravidlami</a> má obrázky každého štartu.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrať v Leapstone pre 4 hráčov</h2>
      <ul>
        <li><strong>Proti počítaču, hneď teraz:</strong> otvorte <a href="/play/">Leapstone v prehliadači</a>, ťuknite na Počítač, vyberte hviezdicovú dosku a 3 počítače. Ste Hráč 1, takže ťaháte prvý. Pre počítače si vyberiete Ľahká, Normálna alebo Ťažká.</li>
        <li><strong>Na jednom telefóne:</strong> ťuknite na Hrať, vyberte hviezdicovú dosku a 4 hráčov a potom ťuknite na kameň, aby sa toto miesto prepínalo medzi človekom a počítačom.</li>
        <li><strong>Online s priateľmi:</strong> ťuknite na Priatelia, vyberte hviezdicovú dosku, 4 hráčov a čas na ťah a pošlite pozvánkový odkaz. Hra sa začne, keď sú obsadené všetky 4 miesta.</li>
        <li><strong>Rýchla hra, v aplikácii:</strong> ťuknite na Hrať online. Kým aplikácia hľadá hru pre 2, ťuknite na Hľadať 4 alebo 6 hráčov, aby hľadala hru pre 4. Každý ťah má 30 sekúnd. Ak sa do 20 sekúnd nepridá dosť hráčov, prázdne miesta zaplnia počítačoví hráči, takže niektorí súperi môžu byť počítačoví hráči.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínska dáma pre 4 hráčov",
  titel: "Čínska dáma pre 4 hráčov: rozloženie a tipy | Leapstone",
  beschrijving: "Ako funguje čínska dáma pre 4 hráčov: ako je doska rozdelená, ktoré 2 hroty zostávajú prázdne, kto stojí oproti komu, taktika a kde hrať.",
  h1: "Čínska dáma pre 4 hráčov",
  intro: "Pri 4 hráčoch každý z vás začína v jednom zo štyroch hrotov hviezdy a dva hroty zostávajú prázdne. Červený stojí oproti zelenému a modrý oproti žltému: váš cieľ je hrot oproti vám, plný kameňov toho hráča. Tu je rozloženie, prázdne hroty, taktika a miesta, kde môžete hrať.",
  inhoud,
};
