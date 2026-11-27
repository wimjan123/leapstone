// Slovenský návod Čínska dáma pre 3 hráčov (taak 299): /sk/navody/cinska-dama-pre-troch.
// Obsah: anglický návod ../en/chinese-checkers-3-players.mjs (skontrolovaný voči crates/halma-core), veta po vete po slovensky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ako hra začína</h2>
      <p>Každý hráč má 10 kameňov, takže na doske so 121 poľami stojí 30 kameňov. Začínajú v každom druhom hrote hviezdy: červený dole, modrý hore vľavo a zelený hore vpravo. Tri hroty medzi nimi sú prázdne.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote, 10 modrými kameňmi v hrote hore vľavo a 10 zelenými kameňmi v hrote hore vpravo",
  tekst: "Červený dole, modrý hore vľavo, zelený hore vpravo.",
})}
      <p>Hráč 1, červený, ide prvý. Potom je modrý Hráč 2, zelený je Hráč 3 a po zelenom je opäť na rade červený. Ťah je jeden krok alebo reťaz skokov jedným kameňom. Kroky a skoky nájdete v <a href="/sk/pravidla/cinska-dama">pravidlách čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tri ciele, všetky prázdne na začiatku</h2>
      <p>Váš cieľ je hrot oproti tomu, z ktorého ste začali, a pri 3 hráčoch je na začiatku prázdny. Je to prázdny hrot medzi štartovými hrotmi ostatných dvoch hráčov: cieľ červeného je hore, cieľ modrého dole vpravo a cieľ zeleného dole vľavo.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Hviezdicová doska pre troch hráčov. Prerušované kruhy vo farbe každého hráča označujú tri prázdne ciele: červený hore, modrý dole vpravo, zelený dole vľavo.",
  tekst: "Každý cieľ má farbu svojho hráča.",
})}
      <p>Vyhráte, keď presuniete všetkých svojich 10 kameňov do svojho cieľa. Všetkých 10 polí musí obsadzovať vaše vlastné kamene. V cieli nikto nezačína, ale zastaviť sa môžete na ktoromkoľvek voľnom poli, takže tam neskôr môže pristáť kameň iného hráča. Kým tam stojí, nemôžete skončiť.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Výhra a čo nasleduje potom</h2>
      <ul>
        <li><strong>Výhra:</strong> vyhráva prvý hráč, ktorý zaplní cieľ. Hra sa tým nekončí: ostatní dvaja hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje. Hra sa skončí, keď hrá už len jeden hráč.</li>
        <li><strong>Vzdanie sa:</strong> vaše kamene zmiznú z dosky a ostatní dvaja hrajú ďalej. Ak sa vzdá druhý hráč skôr, než niekto skončí, vyhráva posledný zostávajúci hráč.</li>
        <li><strong>Čas (online):</strong> v online hre má každý ťah časový limit, ktorý určí hráč, ktorý hru začína. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa a hra pokračuje bez vás.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Ako sa to líši od hry pre 2</h2>
      <ul>
        <li><strong>Viac kameňov:</strong> 30 na doske, oproti 20 pri 2 hráčoch.</li>
        <li><strong>Prázdne ciele:</strong> pri 2 hráčoch váš cieľ začína plný kameňov druhého hráča. Pri 3 začína prázdny.</li>
        <li><strong>Dvaja súperi:</strong> po vašom ťahu ťahajú dvaja ďalší hráči, kým ste znova na rade. Kamene oboch sú pre vás odrazovými mostíkmi a vaše pre nich. Rebrík, ktorý postavíte, môžu využiť obaja a hráč po vás má prvú šancu.</li>
        <li><strong>Hra pokračuje:</strong> pri 2 hráčoch sa hra skončí, keď jeden z vás skončí. Pri 3 pokračuje o druhé a tretie miesto.</li>
      </ul>
      <p>O hre pre dvoch si prečítajte <a href="/sk/navody/cinska-dama-pre-dvoch">čínsku dámu pre 2 hráčov</a>. <a href="/sk/navody/cinska-dama-strategia">Tipy k stratégii</a> sa týkajú krokov a skokov, ktoré sú pri 3 hráčoch rovnaké.</p>
      <p><a href="/sk/navody/cinska-dama-online-s-priatelmi">Čínska dáma online s priateľmi</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrať v Leapstone pre 3 hráčov</h2>
      <ul>
        <li><strong>Proti počítaču, hneď teraz:</strong> otvorte <a href="/play/">Leapstone v prehliadači</a>, ťuknite na Počítač, vyberte hviezdicovú dosku a 2 počítače. Ste Hráč 1, takže ťaháte prvý. Pre počítače si vyberiete Ľahká, Normálna alebo Ťažká.</li>
        <li><strong>Na jednom telefóne:</strong> ťuknite na „Na tomto telefóne“, vyberte hviezdicovú dosku a 3 hráčov a potom ťuknutím na kameň prepnite toto miesto medzi človekom a počítačom.</li>
        <li><strong>Online s priateľmi:</strong> ťuknite na Priatelia, vyberte hviezdicovú dosku, 3 hráčov a čas na ťah a pošlite pozvánkový odkaz. Hra sa začne, keď sú obsadené všetky 3 miesta.</li>
        <li><strong>Rýchle hry:</strong> Hrať online nájde hry pre 2 alebo 4 hráčov, takže rýchla hra pre 3 neexistuje.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínska dáma pre 3 hráčov",
  titel: "Čínska dáma pre 3 hráčov: pravidlá | Leapstone",
  beschrijving: "Ako funguje čínska dáma pre 3 hráčov: kde začína 30 kameňov, ktorý prázdny hrot je cieľ, kto ide prvý a ako vyhráte.",
  h1: "Čínska dáma pre 3 hráčov",
  intro: "Ako funguje hra pre troch na hviezdicovej doske: rozloženie, tri ciele, kto ide prvý, ako vyhráte a kde ju môžete hrať.",
  inhoud,
};
