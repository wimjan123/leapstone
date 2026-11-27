// Leapstone v číslach, Slowaaks (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Polia a kamene</h2>
      <p>Spočítané na oboch doskách Leapstone, v počiatočnom postavení hry.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Hviezdicová doska so všetkými šiestimi hrotmi plnými: desať kameňov v každej zo šiestich farieb, okolo prázdneho stredu.",
  tekst: "Hviezdicová doska na začiatku hry pre šiestich hráčov.",
})}
      <ul class="tips">
        <li><strong>Hviezdicová doska má ${f("sterbord_vakken")} polí.</strong> Každý hráč začína s ${f("sterbord_stenen_per_speler")} kameňmi. Hra pre dvoch hráčov má teda na doske ${f("sterbord_stenen_2_spelers")} kameňov, hra pre troch ${f("sterbord_stenen_3_spelers")}, pre štyroch ${f("sterbord_stenen_4_spelers")} a pre šiestich ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Štvorcová doska Halmy má ${f("vierkant_vakken")} polí.</strong> V hre pre dvoch hráčov začína každý hráč s ${f("vierkant_stenen_per_speler_2_spelers")} kameňmi, spolu ${f("vierkant_stenen_2_spelers")}. V hre pre štyroch začína každý s ${f("vierkant_stenen_per_speler_4_spelers")} kameňmi, spolu ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Najdlhšia reťaz skokov: ${f("langste_sprongketen")}</h2>
      <p>Na hviezdicovej doske môže jeden kameň urobiť <strong>${f("langste_sprongketen")} skokov v jedinom ťahu</strong> a podľa pravidiel Leapstone žiadny ťah nemôže mať viac. Aby sa dalo dôjsť k tomuto číslu, ostatné kamene sa rozostavia voľne: jeden na každé pole, cez ktoré kameň skáče.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Hviezdicová doska s jedným červeným kameňom a mnohými modrými kameňmi. Biele šípky ukazujú, ako červený kameň preskakuje jeden modrý kameň za druhým po dlhej kľukatej ceste.",
  tekst: "Najdlhšia reťaz: červený kameň preskočí každý modrý kameň, jeden po druhom.",
})}
      <p><strong>Ako sa to počíta.</strong> Skok vždy dopadne o dve polia ďalej v priamej čiare. Kameň, ktorý stále skáče, sa preto dostane len na časť polí: doska sa delí na štyri také skupiny a najväčšia z nich má ${f("grootste_klasse_vakken")} polí. V Leapstone nesmie kameň v jednom ťahu dopadnúť dvakrát na to isté pole ani na pole, odkiaľ vyšiel. Reťaz teda dopadne najviac raz na každé z ostatných polí svojej skupiny. Program túto skupinu prehľadal a našiel cestu cez všetkých ${f("grootste_klasse_vakken")} polí, takže žiadna reťaz nemôže byť dlhšia: ${f("langste_sprongketen")} skokov. Test potom tento ťah zahrá podľa pravidiel Leapstone.</p>
      <p><strong>Nejde o skutočnú hru.</strong> Táto reťaz potrebuje ${f("langste_sprongketen")} ďalších kameňov, každý presne na správnom poli. Hra pre dvoch alebo troch hráčov má len ${f("sterbord_stenen_2_spelers")} alebo ${f("sterbord_stenen_3_spelers")} kameňov, a to je málo. Hra pre štyroch alebo šiestich hráčov ich má ${f("sterbord_stenen_4_spelers")} alebo ${f("sterbord_stenen_6_spelers")}, a to stačí. V skutočnej hre však nikto kamene voľne nerozostavuje, takže túto reťaz pri stole nečakajte. Ukazuje, čo doska dovolí, nie čo sa stane pri hre.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Najkratší prechod: ${f("oversteek_zetten")} ťahov</h2>
      <p>Jeden hráč sám na hviezdicovej doske, bez súperov, potrebuje <strong>${f("oversteek_zetten")} ťahov</strong>, aby dostal všetkých ${f("sterbord_stenen_per_speler")} kameňov z jedného hrotu do protiľahlého, a menej ťahov nestačí. Celá reťaz skokov sa počíta ako jeden ťah.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Hviezdicová doska len s desiatimi červenými kameňmi v dolnom hrote. Horný hrot, kam musia dôjsť, má čiarkovaný obrys.",
  tekst: "Jeden hráč sám: desať kameňov v dolnom hrote a cieľom je horný hrot.",
})}
      <p><strong>Ako sa to počíta.</strong> Test zahrá prechod na ${f("oversteek_zetten")} ťahov podľa pravidiel Leapstone, bez ďalších kameňov na doske. Aby sa ukázalo, že ${f("geen_oversteek_in_zetten")} ťahov alebo menej nestačí, hľadanie sa riadi metódou G. I. Bella (<em>Integers</em> 9, 2009). Každý ťah sa dá zahrať odzadu a otočenie dosky o pol otáčky vymení štart a cieľ. Keby teda existoval prechod na ${f("geen_oversteek_in_zetten")} ťahov alebo menej, nejaké postavenie v polovici cesty by bolo najviac ${f("zoekdiepte_zetten")} ťahov od štartu, a rovnako aj to isté postavenie otočené o pol otáčky. Hľadanie prešlo každé postavenie do ${f("zoekdiepte_zetten")} ťahov od štartu, postavenie a jeho zrkadlový obraz počítalo raz, vynechalo tie, ktoré sa preukázateľne nemôžu včas dostať dosť ďaleko, a žiadnu takú dvojicu nenašlo. Bežalo ${f("gemeten_rekentijd_seconden")} sekúnd na stroji s ${f("gemeten_kernen")} jadrami a jeho najväčší krok držal ${f("gemeten_grootste_laag_miljoen_standen")} milióna postavení v ${f("gemeten_geheugen_gb")} GB pamäte. Číslo sa znova vypočítalo pre vlastnú dosku Leapstone.</p>
      <p><strong>Nejde o dolnú hranicu pre skutočnú hru.</strong> V skutočnej hre sú na doske aj kamene ostatných hráčov a vaše kamene cez ne môžu skákať. ${f("oversteek_zetten")} teda nie je najmenšia možná dĺžka skutočnej hry: platí len pre jedného hráča samého.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Vyskúšajte to</h2>
      <p><a href="/play/">Hrajte Leapstone v prehliadači</a> proti počítaču, alebo si stiahnite aplikáciu tlačidlami hore na tejto stránke. Pravidlá nájdete v <a href="/sk/pravidla/cinska-dama">pravidlách čínskej dámy</a> alebo v <a href="/sk/pravidla/halma">pravidlách Halmy</a>. Ako využiť reťaze skokov v hre, sa dočítate v <a href="/sk/navody/cinska-dama-strategia">tipoch na stratégiu</a>.</p>
    </section>`;

export default {
  nav: "Čínska dáma v číslach",
  titel: "Čínska dáma v číslach | Leapstone",
  beschrijving: `Hviezdicová doska má ${c.sterbord_vakken} polí. Jeden ťah má najviac ${c.langste_sprongketen} skokov a hráč sám na doske potrebuje ${c.oversteek_zetten} ťahov na prechod. Ako sa každé číslo počíta.`,
  h1: "Čínska dáma v číslach",
  intro: `Hviezdicová doska čínskej dámy má ${f("sterbord_vakken")} polí a každý hráč začína s ${f("sterbord_stenen_per_speler")} kameňmi. V Leapstone nemôže mať jeden ťah nikdy viac ako ${f("langste_sprongketen")} skokov. Jeden hráč sám na doske, bez súperov, potrebuje ${f("oversteek_zetten")} ťahov, aby ju prešiel. Nižšie uvidíte, ako sa každé číslo počíta a čo o skutočnej hre hovorí a čo nie.`,
  inhoud,
};
