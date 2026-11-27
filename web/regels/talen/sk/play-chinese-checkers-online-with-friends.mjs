// Slovenský návod Čínska dáma online s priateľmi (taak 304): /sk/navody/cinska-dama-online-s-priatelmi. Text sleduje ../en/ vetu po vete.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Kroky od začiatku po prvý ťah</h2>
      <ol>
        <li><strong>Vyberte si meno hráča.</strong> Viac na prihlásenie nepotrebujete.</li>
        <li><strong>Vytvorte online hru.</strong> Vyberte dosku, počet hráčov a čas na ťah.</li>
        <li><strong>Pošlite odkaz s pozvánkou.</strong> Zdieľajte ho z čakárne, alebo ho skopírujte a vložte do ľubovoľnej chatovej aplikácie.</li>
        <li><strong>Počkajte, kým ho otvoria všetci.</strong> Keď sa obsadí posledné miesto, hra sa začne a prvý ťah robíte vy.</li>
      </ol>
      <p>Zvyšok tejto stránky vysvetľuje každú časť a čo sa stane, keď priateľ prestane hrať.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Ako funguje odkaz s pozvánkou</h2>
      <p>Jedna hra má jeden odkaz s pozvánkou a každý priateľ používa ten istý. Každý priateľ, ktorý ho otvorí, zaujme ďalšie voľné miesto. Hru ste vytvorili vy, takže ste hráč 1 a zaberiete prvé miesto.</p>
      <ul>
        <li><strong>Koľko miest:</strong> na hviezdicovej doske má hra 2, 3, 4 alebo 6 hráčov a na štvorcovej doske 2 alebo 4. Vyberiete to, skôr než pošlete odkaz. Hra sa nezačne s prázdnymi miestami a žiadny ťah nie je možný, kým sa neobsadí posledné miesto.</li>
        <li><strong>Čakáreň:</strong> kým čakáte, čakáreň ukazuje, kto už je tu a koľko miest je ešte voľných. Aktualizuje sa sama, keď sa pripojí priateľ.</li>
        <li><strong>Zdieľanie:</strong> tlačidlo Pozvánka otvorí ponuku zdieľania vo vašom telefóne. Ak nie je k dispozícii, odkaz skopíruje a môžete ho vložiť sami.</li>
        <li><strong>V prehliadači alebo v aplikácii:</strong> odkaz funguje aj bez aplikácie, v prehliadači. Ak má váš priateľ aplikáciu, odkaz ju môže otvoriť.</li>
        <li><strong>Plný alebo neznámy odkaz:</strong> keď sú všetky miesta obsadené, odkaz ukáže, že hra je plná. Odkaz, ktorý neexistuje, ukáže, že pozvánka je neznáma. V oboch prípadoch požiadajte priateľa o nový odkaz.</li>
      </ul>
      <p>Odkaz platí len pre túto hru. Má 16 náhodných znakov, takže ho nikto nemôže uhádnuť, ale kto ho dostane, môže zaujať voľné miesto. Posielajte ho len ľuďom, s ktorými chcete hrať.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Bez účtu, len meno hráča</h2>
      <p>Nepotrebujete e-mailovú adresu ani heslo. Vyberiete si meno hráča s dĺžkou od 1 do 30 znakov a ostatní hráči toto meno vidia. Niektoré hrubé mená sa odmietnu a vtedy si vyberiete iné.</p>
      <p>Keď si vyberiete meno, aplikácia ukáže obnovovací kód s 20 znakmi v piatich skupinách. Uložte si ho. Ak dostanete nový telefón, zadáte kód a svoje meno hráča získate späť. Bez kódu svoje meno na novom telefóne späť nezískate.</p>
      <p>Vaši priatelia robia to isté, keď otvoria váš odkaz: najprv si vyberú meno a potom sa pripoja k vašej hre.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Čas na ťah: ako dlho môže priateľ rozmýšľať</h2>
      <p>Čas na ťah je najdlhší čas, ktorý má hráč na jeden ťah. Nastavíte ho pri vytváraní hry a platí pre všetkých v tejto hre.</p>
      <ul>
        <li><strong>Možnosti:</strong> 15 sekúnd, 30 sekúnd, 1 minúta alebo 2 minúty. Môžete ho aj vypnúť, vtedy nie je žiadny limit. Aplikácia začína na 30 sekundách.</li>
        <li><strong>Hodiny:</strong> čas meria server, takže telefón so zlými hodinami na tom nič nezmení. Aplikácia ukazuje, koľko času ešte zostáva.</li>
        <li><strong>Prvé hodiny:</strong> spustia sa, keď sa obsadí posledné miesto. Dovtedy nikomu čas nebeží.</li>
        <li><strong>Rýchla hra:</strong> ak ťuknete na Hrať online, aby ste hrali proti cudziemu človeku, čas na ťah je pevne 30 sekúnd. Vyberať môžete len pri hre s priateľmi.</li>
      </ul>
      <p>Pre priateľov, ktorí hrajú z gauča, sú 2 minúty alebo žiadny limit pohodlné. Na rýchlu hru vyberte 15 sekúnd. Bez limitu môže hra čakať, ako dlho treba, a dohráte ju, keď budete mať čas.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Čo sa stane, keď niekto vypadne</h2>
      <p>Hra žije na serveri, nie v telefóne. Ak priateľ zatvorí aplikáciu, stratí pripojenie alebo zaspí, hra ostane, kde je, a priateľ ju nájde znova v Moje hry.</p>
      <ul>
        <li><strong>Čas vyprší:</strong> ťah tohto hráča sa preskočí. Na doske sa nič nepohne a čas začne bežať ďalšiemu hráčovi.</li>
        <li><strong>Tri ťahy po sebe:</strong> hráč, ktorý vynechá 3 ťahy po sebe, sa vzdá sám. Každý ťah, ktorý hráč predsa len urobí, vráti počítadlo na nulu.</li>
        <li><strong>Vzdanie sa:</strong> hráčovi, ktorý sa vzdá, z vlastnej vôle alebo po 3 vynechaných ťahoch, zmiznú kamene z dosky, aby nikomu neprekážali.</li>
        <li><strong>Hra pre 2:</strong> hra sa skončí a druhý hráč vyhrá.</li>
        <li><strong>Hra pre 3, 4 alebo 6:</strong> hra pokračuje bez hráča, ktorý odišiel, a ťah prejde na ďalšieho hráča, ktorý je ešte v hre.</li>
        <li><strong>Bez času na ťah:</strong> ak ste vybrali žiadny limit, hra nikdy nepreskočí ťah. Počká, kým sa priateľ vráti, alebo kým sa priateľ vzdá.</li>
      </ul>
      <p>Ak ste zapli oznámenia, aplikácia vám povie, kedy ste na ťahu, aj keď je zatvorená. Zapnite ich v aplikácii alebo v nastaveniach telefónu či prehliadača.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Po hre</h2>
      <p>Hráči, ktorí hrajú spolu cez pozvánku, sa dostanú do zoznamu priateľov toho druhého. Odtiaľ môžete priateľa vyzvať na novú hru bez nového odkazu. Vaše otvorené a skončené hry sú v Moje hry.</p>
      <p>Pravidlá ešte nepoznáte? Prečítajte si <a href="/sk/pravidla/cinska-dama">pravidlá čínskej dámy</a>. Hráte dvaja? Prečítajte si <a href="/sk/navody/cinska-dama-pre-dvoch">čínsku dámu pre 2 hráčov</a>. Chcete vyhrať? Prečítajte si <a href="/sk/navody/cinska-dama-strategia">tipy k stratégii</a>.</p>
      <p><a href="/sk/navody/cinska-dama-pre-troch">Čínska dáma pre 3 hráčov</a></p>
    </section>`;

export default {
  nav: "Čínska dáma online s priateľmi",
  titel: "Čínska dáma online s priateľmi | Leapstone",
  beschrijving: "Čínska dáma online s priateľmi: pošlite odkaz s pozvánkou, nastavte čas na ťah, hrajte len s menom hráča a pozrite, čo sa stane, keď niekto vypadne.",
  h1: "Hrajte čínsku dámu online s priateľmi",
  intro: "Vytvorte hru, pošlite jeden odkaz s pozvánkou a hrajte, keď sa pripoja všetci. Stačí meno hráča a čas na ťah si nastavíte sami.",
  inhoud,
};
