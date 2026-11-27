// Slovenský návod Čínska dáma pre 2 hráčov (taak 134): /sk/navody/cinska-dama-pre-dvoch.
// Obsah: anglický návod ../en/chinese-checkers-2-players.mjs (skontrolovaný voči crates/halma-core), veta po vete po slovensky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ako hra začína</h2>
      <p>Každý hráč má 10 kameňov. Začínajú v dvoch hrotoch hviezdy, ktoré sú oproti sebe: červený dole, modrý hore. 20 kameňov stojí na doske so 121 poľami.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote a 10 modrými kameňmi v hornom hrote",
  tekst: "Červený začína dole, modrý hore.",
})}
      <p>Hráč 1, červený, ide prvý. Potom sa striedate, každý jeden ťah. Ťah je jeden krok alebo reťaz skokov jedným kameňom. Kroky a skoky nájdete v <a href="/sk/pravidla/cinska-dama">pravidlách čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Váš cieľ je štart druhého hráča</h2>
      <p>Vyhráte, keď presuniete všetkých svojich 10 kameňov do hrotu, kde začal druhý hráč. Ten hrot začína plný jeho kameňov a váš je plný vašich. Pre červeného je to horný hrot na obrázku vyššie.</p>
      <p>Pristáť môžete len na voľnom poli, takže každý z vás musí opustiť svoj hrot, skôr než ho druhý môže zaplniť. Ani jeden z vás nemôže skončiť, kým v cieli zostáva kameň druhého. A keďže stred prechádzate v opačných smeroch, kamene druhého hráča sú odrazovými mostíkmi pre vás a vaše pre neho. Prečítajte si <a href="/sk/navody/cinska-dama-strategia">tipy k stratégii</a>, čo s tým robiť.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Výhra a vzdanie sa</h2>
      <ul>
        <li><strong>Výhra:</strong> prvý hráč, ktorý zaplní cieľ všetkými 10 kameňmi, vyhráva a hra sa okamžite skončí. Druhý hráč už nehrá ďalej.</li>
        <li><strong>Vzdanie sa:</strong> vaše kamene zmiznú z dosky a druhý hráč vyhráva.</li>
        <li><strong>Čas (online):</strong> v online hre má každý ťah časový limit. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Ako sa líšia hry pre 3, 4 a 6 hráčov</h2>
      <ul>
        <li><strong>3 hráči:</strong> kamene začínajú v každom druhom hrote a tri ciele začínajú prázdne. Vyhráva prvý hráč, ktorý skončí; ostatní hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje.</li>
        <li><strong>4 hráči:</strong> dve dvojice hrotov vedľa seba. Váš cieľ začína plný kameňov iného hráča. Hra pokračuje aj po prvom hráčovi, ktorý skončí, rovnako ako pri 3.</li>
        <li><strong>6 hráčov:</strong> všetkých šesť hrotov. Na doske je 60 kameňov, oproti 20 pri 2 hráčoch.</li>
      </ul>
      <p>Keď je na doske len 20 kameňov, je menej kameňov na preskakovanie, takže rebríky, ktoré si postavíte sami, majú väčší význam. <a href="/sk/pravidla/cinska-dama">Stránka s pravidlami</a> má obrázky každého štartu.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kde hrať v Leapstone pre 2 hráčov</h2>
      <ul>
        <li><strong>Proti počítaču, hneď teraz:</strong> otvorte <a href="/play/">Leapstone v prehliadači</a>, ťuknite na Počítač a vyberte hviezdicovú dosku. Predvolený je jeden počítač, takže to je hra pre 2. Vyberiete si Ľahká, Normálna alebo Ťažká a ste Hráč 1, takže ťaháte prvý. Ľahká vyberie najlepší z troch náhodných ťahov. Normálna vyberie ťah, ktorý najviac postúpi k cieľu. Ťažká sa pozerá aj na to, ako môžu odpovedať jej súperi, a na svoj vlastný ďalší ťah.</li>
        <li><strong>Hrať online, v aplikácii:</strong> rýchla hra na hviezdicovej doske pre 2 hráčov, proti inému hráčovi vašej úrovne, s 30 sekundami na ťah. Niektorí online súperi môžu byť počítačoví hráči.</li>
        <li><strong>S priateľom:</strong> pošlite pozvánkový odkaz a čas na ťah si nastavte sami. Alebo si podávajte jeden telefón sem a tam.</li>
      </ul>
      <p><a href="/sk/navody/cinska-dama-online-s-priatelmi">Čínska dáma online s priateľmi</a></p>
      <p><a href="/sk/navody/cinska-dama-pre-troch">Čínska dáma pre 3 hráčov</a></p>
    </section>`;

export default {
  nav: "Čínska dáma pre 2 hráčov",
  titel: "Čínska dáma pre 2 hráčov: rozloženie a pravidlá | Leapstone",
  beschrijving: "Ako funguje čínska dáma pre 2 hráčov: kde začína 10 kameňov, kto ide prvý, ako vyhráte alebo sa vzdáte a kde hrať zadarmo.",
  h1: "Čínska dáma pre 2 hráčov",
  intro: "Ako funguje hra pre dvoch na hviezdicovej doske: rozloženie, kto ide prvý, ako vyhráte a kde ju môžete hrať.",
  inhoud,
};
