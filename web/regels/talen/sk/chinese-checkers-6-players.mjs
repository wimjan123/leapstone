// Slovenský návod Čínska dáma pre 6 hráčov (taak 302, feature 294): /sk/navody/cinska-dama-pre-sestich.
// Obsah: anglický návod ../en/chinese-checkers-6-players.mjs (skontrolovaný voči crates/halma-core), veta po vete po slovensky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ako hra začína</h2>
      <p>Každý hráč má 10 kameňov a všetkých 6 hrotov hviezdy je v použití. Na doske so 121 poľami tak stojí 60 kameňov. 61 polí v strede je na začiatku prázdnych.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Hviezdicová doska s 10 kameňmi v každom zo 6 hrotov, v 6 farbách",
  tekst: "6 hráčov, 6 hrotov, 60 kameňov.",
})}
      <p>Hráč 1, červený, ide prvý, z dolného hrotu. Ťah potom ide od hráča 1 po hráča 6 a po hráčovi 6 je znova na rade hráč 1. Hráči sú očíslovaní podľa poradia svojich hrotov okolo hviezdy, takže hráč po vás vždy začína v hrote vedľa vášho. Ťah je jeden krok alebo reťaz skokov jedným kameňom. Kroky a skoky nájdete v <a href="/sk/pravidla/cinska-dama">pravidlách čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Každý cieľ je na začiatku plný</h2>
      <p>Vyhráte, keď presuniete všetkých 10 svojich kameňov do hrotu na druhej strane dosky. Pri 6 hráčoch je to hrot, kde začína hráč oproti vám, takže žiadny cieľ nie je prázdny: každý začína plný kameňov iného hráča. Pre červeného je cieľom horný hrot, kde začína hráč 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Hviezdicová doska so 6 plnými hrotmi. Prerušovaný kruh označuje horný hrot, cieľ červeného hráča, ktorý je plný kameňov hráča oproti.",
  tekst: "Cieľ červeného je hrot oproti, plný kameňov hráča 4.",
})}
      <p>Pristáť môžete len na voľnom poli, takže hráč oproti musí svoj hrot opustiť, skôr než ho zaplníte, a vy musíte opustiť svoj, skôr než ho zaplní on. V hre pre 2 je to všetko. Pri 6 sa obaja hráči navyše musia dostať cez dav 4 ostatných.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Preplnený stred</h2>
      <p>Každý cieľ je na druhej strane dosky a hroty sa navzájom spájajú len cez stred, takže všetkých 60 kameňov musí prejsť cez tých istých 61 polí. Na začiatku ešte nikto neprešiel a stred sa rýchlo plní.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Červený kameň skočí v jednom ťahu trikrát: cez modrý kameň, potom cez zelený a potom cez fialový. Čísla 1, 2 a 3 označujú polia dopadu.",
  tekst: "Kamene každej farby sú odrazovými mostíkmi.",
})}
      <p>Preskočiť môžete kameň ľubovoľnej farby. Kamene 5 ostatných hráčov sú odrazovými mostíkmi pre vás a vaše sú odrazovými mostíkmi pre všetkých 5. Rad kameňov, ktorý necháte v strede, je rebrík pre každého, kto naň dosiahne, a hráč po vás má prvý ťah.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokovanie pri 5 súperoch</h2>
      <ul>
        <li><strong>Zaplňte pole dopadu:</strong> skok potrebuje voľné pole hneď za kameňom. Keď tam presuniete kameň, skok zmizne pre každého hráča, ktorý ho chcel.</li>
        <li><strong>Pozor na rebríky, ktoré stavíte:</strong> po vašom ťahu ťahá ostatných 5 hráčov, kým ste znova na rade. Rebrík pomáha všetkým.</li>
        <li><strong>Cieľ môže zablokovať ktokoľvek:</strong> kameň ktoréhokoľvek iného hráča vo vašom cieli vám bráni dokončiť, nielen kameň hráča oproti. Všetkých 10 polí cieľa musí obsahovať vaše vlastné kamene.</li>
      </ul>
      <p>V <a href="/sk/navody/cinska-dama-strategia">tipoch k stratégii</a> uvidíte, ako vyzerá zablokovaný skok a ako nezamknúť kameň iného hráča vo vlastnom cieli.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Ako dlho hra trvá</h2>
      <p>V hre pre 6 je 60 kameňov na presunutie a medzi vaším ťahom a ďalším ťahá každý z ostatných 5 hráčov raz. Hra sa tiež nekončí, keď dokončí prvý hráč.</p>
      <ul>
        <li><strong>Výhra a hra pokračuje:</strong> prvý hráč, ktorý zaplní cieľ, vyhráva a ostatní hrajú ďalej o ďalšie miesta. Hráč, ktorý je hotový, sa preskakuje a jeho kamene zostávajú na doske ako odrazové mostíky. Hra sa skončí, keď hrá už len jeden hráč.</li>
        <li><strong>Vzdanie sa:</strong> vaše kamene zmiznú z dosky, takže už nikomu neprekážajú ani nepomáhajú, a ostatní hrajú ďalej.</li>
        <li><strong>Čas (online):</strong> v online hre má každý ťah časový limit, ktorý nastaví hráč, ktorý hru zakladá: 15 sekúnd, 30 sekúnd, 1 minúta, 2 minúty alebo bez limitu. Kolo 6 ťahov trvá najviac 6 krát toľko, koľko je limit, takže pri 30 sekundách je to najviac 3 minúty. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa a hra pokračuje bez vás.</li>
      </ul>
      <p>O hre s menším počtom hráčov si prečítajte <a href="/sk/navody/cinska-dama-pre-dvoch">Čínska dáma pre 2 hráčov</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrať v Leapstone so 6 hráčmi</h2>
      <ul>
        <li><strong>Proti počítačom, hneď teraz:</strong> otvorte <a href="/play/">Leapstone v prehliadači</a>, ťuknite na Počítač, vyberte hviezdicovú dosku a 5 počítačov. Ste Hráč 1, takže ťaháte prvý. Počítače ťahajú jeden po druhom, každý s krátkou pauzou, takže môžete sledovať každý ťah. Pre počítače si vyberiete Ľahká, Normálna alebo Ťažká.</li>
        <li><strong>Na jednom telefóne:</strong> ťuknite na Hrať, vyberte hviezdicovú dosku a 6 hráčov a potom ťuknutím na kameň prepnite dané miesto medzi človekom a počítačom.</li>
        <li><strong>Online s priateľmi:</strong> ťuknite na Priatelia, vyberte hviezdicovú dosku, 6 hráčov a čas na ťah a pošlite pozvánkový odkaz. Hra začne, keď je obsadených všetkých 6 miest.</li>
        <li><strong>Rýchle hry:</strong> Hrať online hľadá hry pre 2 alebo 4 hráčov, takže rýchla hra pre 6 neexistuje.</li>
      </ul>
    </section>`;

export default {
  nav: "Čínska dáma pre 6 hráčov",
  titel: "Čínska dáma pre 6 hráčov: celá doska | Leapstone",
  beschrijving: "Ako funguje čínska dáma pre 6 hráčov: plná hviezda so 60 kameňmi, preplnený stred, blokovanie, ako dlho hra trvá a kde ju hrať.",
  h1: "Čínska dáma pre 6 hráčov",
  intro: "Ako funguje hra pre 6: všetkých 6 hrotov je plných, súťažíte o hrot na druhej strane dosky a hra pokračuje aj po tom, čo prvý hráč dokončí.",
  inhoud,
};
