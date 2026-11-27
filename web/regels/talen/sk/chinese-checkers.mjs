// Slovenská stránka s pravidlami čínskej dámy (taak 134). Text sleduje anglickú stránku ../en/chinese-checkers.mjs (skontrolovanú voči crates/halma-core) vetu po vete.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: n === 6 ? "6 hráčov" : `${n} hráči`,
      alt:
        {
          2: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote a 10 modrými kameňmi v hornom hrote",
          3: "Hviezdicová doska s červenými kameňmi dole, modrými vľavo hore a zelenými vpravo hore",
          4: "Hviezdicová doska s kameňmi v štyroch hrotoch: červené dole, zelené hore, modré vľavo dole a žlté vpravo hore",
          6: "Hviezdicová doska s kameňmi vo všetkých šiestich hrotoch, v šiestich farbách",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Doska</h2>
      <p>Čínska dáma sa hrá na hviezde so šiestimi hrotmi. Doska má 121 polí a každý hrot má 10 z nich. Vo vnútri dosky má každé pole šesť susedov.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Ako kamene začínajú</h2>
      <p>Každý hráč má 10 kameňov a začína s nimi v jednom hrote hviezdy. Hrot oproti vášmu je váš cieľ.</p>
      <ul>
        <li><strong>2 hráči:</strong> dva hroty oproti sebe.</li>
        <li><strong>3 hráči:</strong> každý druhý hrot. Tri ciele začínajú prázdne.</li>
        <li><strong>4 hráči:</strong> dve dvojice hrotov, ktoré sú vedľa seba. Každý hráč má oproti sebe iného hráča.</li>
        <li><strong>6 hráčov:</strong> všetkých šesť hrotov.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Striedanie ťahov</h2>
      <p>Hráč 1 ide prvý. Potom idú ťahy v poradí, Hráč 2, Hráč 3 a tak ďalej, a po poslednom hráčovi je znova na ťahu Hráč 1. V Leapstone farby patria k číslam: červená, modrá, zelená, žltá, fialová a strieborná.</p>
      <p>Na svojom ťahu posuniete jeden kameň, raz. Nič sa neberie: kamene zostávajú na doske, kým sa ich hráč nevzdá.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Presuňte kameň na voľné pole vedľa neho.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Červený kameň s bielym kruhom okolo. Traja zo šiestich jeho susedov sú voľní a označení; ostatní traja majú kamene.",
  tekst: "Červený kameň môže urobiť krok na tri označené polia. Ostatní traja susedia sú obsadení.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskočte jeden kameň vedľa vášho, akejkoľvek farby, a pristaňte na voľnom poli hneď za ním, v priamej línii. Skákať môžete v ktoromkoľvek zo šiestich smerov, aj dozadu.</p>
      <ul>
        <li>Pole, na ktorom pristanete, musí byť voľné.</li>
        <li>Nemôžete preskočiť dva kamene za sebou ani prázdne pole.</li>
        <li>Kameň, ktorý preskočíte, zostáva tam, kde je.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Červený kameň preskakuje modrý kameň na voľné pole za ním, znázornené šípkou.",
  tekst: "Červený kameň preskakuje modrý kameň.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Reťaz skokov</h2>
      <p>Po skoku môže ten istý kameň skákať znova, koľkokrát vie a v ktoromkoľvek smere. Vy rozhodnete, kde sa zastavíte. Všetky skoky dokopy sú jeden ťah.</p>
      <ul>
        <li>V jednom ťahu nemôžete pristáť na tom istom poli dvakrát.</li>
        <li>Ťah je jeden krok, alebo jeden či viac skokov. Po skoku už nemôžete urobiť krok.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Červený kameň urobí tri skoky v jednom ťahu, cez modrý, zelený a ďalší modrý kameň. Tri polia pristátia sú očíslované 1, 2 a 3.",
  tekst: "Jeden ťah s tromi skokmi, v poradí podľa čísel.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cieľ</h2>
      <p>Vyhráte, keď presuniete všetkých svojich 10 kameňov do hrotu oproti tomu, z ktorého ste začali. Všetkých 10 polí tohto hrotu musí obsadzovať vaše vlastné kamene. Kým tam sedí kameň iného hráča, nemôžete skončiť.</p>
      <p>Pristáť môžete na ktoromkoľvek voľnom poli, aj v hrotoch iných hráčov.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Hviezdicová doska pre troch hráčov. Červený začína dole; prázdny hrot hore, označený prerušovanými kruhmi, je cieľ červeného.",
  tekst: "Pri 3 hráčoch začína červený dole. Cieľ červeného je prázdny hrot hore.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pri 2, 3, 4 alebo 6 hráčoch</h2>
      <ul>
        <li><strong>2 hráči:</strong> vyhráva prvý hráč, ktorý zaplní cieľ, a hra sa skončí.</li>
        <li><strong>3, 4 alebo 6 hráčov:</strong> vyhráva prvý hráč, ktorý zaplní cieľ. Ostatní hrajú ďalej o ďalšie miesta a hráč, ktorý je hotový, sa preskakuje. Hra sa skončí, keď hrá už len jeden hráč.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Vzdanie sa</h2>
      <p>Keď sa vzdáte, vaše kamene zmiznú z dosky, takže nikomu nezavadzajú. Pri 2 hráčoch vyhráva druhý hráč. Pri viacerých hráčoch hra pokračuje bez vás a ak sa vzdajú všetci okrem jedného, vyhráva posledný hráč.</p>
      <p>V online hre má každý ťah časový limit. Nastavuje ho hráč, ktorý hru začína, a v rýchlej hre je to 30 sekúnd. Keď vám vyprší čas, váš ťah sa preskočí. Ak vynecháte 3 ťahy po sebe, vzdáte sa. Hry proti počítaču a na jednom telefóne nemajú časový limit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipy</h2>
      <ul class="tips">
        <li><strong>Stavajte rebríky.</strong> Dajte kamene do línie s jedným voľným poľom medzi nimi, smerom k vášmu cieľu. Jeden kameň potom môže preskákať celou líniou jediným ťahom.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Štyri kamene v uhlopriečnej línii s voľným poľom medzi každými dvoma. Červený kameň na jednom konci preskočí všetky štyri, so štyrmi očíslovanými poliami pristátia.",
  tekst: "Štyri kamene v línii: červený kameň hore prejde cez dosku jediným ťahom so štyrmi skokmi.",
})}
        </li>
        <li><strong>Každý kameň je rebrík.</strong> Preskakovať môžete kamene každej farby, takže pomáhajú aj kamene ostatných hráčov. A vaše vlastné rebríky pomáhajú im: pozrite sa, čo za sebou necháte.</li>
        <li><strong>Nezabúdajte na zaostávajúce kamene.</strong> Potrebujete všetkých 10 kameňov doma. Kameň ďaleko vzadu, ktorý nemá cez čo skákať, sa pohne o jedno pole za ťah. Zoberte ho so sebou, kým sú okolo neho ešte ostatné kamene.</li>
        <li><strong>Váš štart je ich cieľ.</strong> Pri 2, 4 alebo 6 hráčoch je váš štartovací hrot cieľom hráča oproti vám a ten nemôže skončiť, kým je tam ešte jeden z vašich kameňov. To isté platí pre vás.</li>
      </ul>
      <p>Ďalšie tipy s obrázkami nájdete v návode <a href="/sk/navody/cinska-dama-strategia">Stratégia čínskej dámy</a>. Pre hru dvoch si prečítajte <a href="/sk/navody/cinska-dama-pre-dvoch">Čínsku dámu pre 2 hráčov</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Otázky</h2>
      <h3>Koľko ľudí môže hrať čínsku dámu?</h3>
      <p>Dvaja, traja, štyria alebo šiesti. Každý hráč začína v jednom hrote hviezdy. Pri 2, 3 alebo 4 hráčoch zostanú niektoré hroty prázdne.</p>
      <h3>Koľko kameňov má každý hráč?</h3>
      <p>Každý hráč má 10 kameňov. Doska má 121 polí: 10 v každom zo šiestich hrotov a 61 v strede.</p>
      <h3>Môžem skákať cez vlastné kamene alebo dozadu?</h3>
      <p>Áno. Skákať môžete cez kameň akejkoľvek farby, aj cez vlastný, v každom zo šiestich smerov, aj dozadu. Kameň, cez ktorý skočíte, zostane na mieste.</p>
      <h3>Berie sa v čínskej dáme kameň?</h3>
      <p>Nie. Nič sa neberie. Kameň odíde z dosky, len keď sa jeho hráč vzdá.</p>
      <h3>Pochádza čínska dáma z Číny?</h3>
      <p>Nie. Hra vznikla v Nemecku v roku 1892 ako Stern-Halma na základe staršej hry Halma. Názov čínska dáma pochádza zo Spojených štátov z roku 1928. Viac si prečítajte v článku <a href="/sk/pravidla/sternhalma">Sternhalma</a>.</p>
      <h3>Kde si môžem zadarmo zahrať čínsku dámu online s priateľmi?</h3>
      <p>V Leapstone, v prehliadači alebo v aplikácii z App Store. Pošlite priateľovi pozvánkový odkaz: pripojí sa k vašej hre bez účtu, e-mailovej adresy a hesla. Môžete hrať aj proti počítaču alebo rýchlu hru proti inému hráčovi. Leapstone je zadarmo a bez reklám.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Hrajte čínsku dámu v Leapstone</h2>
      <p>Leapstone je bezplatná aplikácia na hranie čínskej dámy a Halmy s 3D doskou z červeného laku a zlata. Hrať môžete v aplikácii aj v prehliadači.</p>
      <ul>
        <li><strong>Proti počítaču.</strong> Ľahká, normálna alebo ťažká. Nepotrebujete internet.</li>
        <li><strong>S priateľmi.</strong> Pošlite pozvánkový odkaz. Čas na ťah nastavujete vy a môžete si písať v chate.</li>
        <li><strong>Online.</strong> Rýchla hra proti inému hráčovi vašej úrovne, 30 sekúnd na ťah. Niektorí online súperi môžu byť počítačoví hráči.</li>
        <li><strong>Na jednom telefóne.</strong> Podávajte si telefón okolo stola.</li>
      </ul>
      <p>Leapstone je zadarmo, bez reklám a bez prihlásenia e-mailovou adresou: vyberiete si len meno hráča. <a href="https://apps.apple.com/sk/app/id6831230722">Stiahnuť z App Store</a>. <a href="/play/">Hrať v prehliadači</a>.</p>
    </section>`;

export default {
  nav: "Pravidlá čínskej dámy",
  titel: "Pravidlá čínskej dámy a tipy | Leapstone",
  beschrijving: "Ako hrať čínsku dámu: ako kamene začínajú, kroky, skoky a reťaze skokov, ako vyhrať pri 2, 3, 4 alebo 6 hráčoch, a tipy. Hrajte zadarmo v prehliadači.",
  h1: "Pravidlá čínskej dámy",
  intro: "Presuňte všetkých svojich 10 kameňov cez hviezdicovú dosku do protiľahlého hrotu skôr než ktokoľvek iný. Pravidlá stručne, s obrázkami, a pár tipov.",
  inhoud,
};
