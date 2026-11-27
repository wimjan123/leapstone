// Leapstone v číslech, Tsjechisch (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Pole a kameny</h2>
      <p>Spočítáno na obou deskách Leapstone, v počátečním postavení hry.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Hvězdicová deska se všemi šesti hroty plnými: deset kamenů v každé ze šesti barev, kolem prázdného středu.",
  tekst: "Hvězdicová deska na začátku hry pro šest hráčů.",
})}
      <ul class="tips">
        <li><strong>Hvězdicová deska má ${f("sterbord_vakken")} polí.</strong> Každý hráč začíná s ${f("sterbord_stenen_per_speler")} kameny. Hra pro dva hráče má tedy na desce ${f("sterbord_stenen_2_spelers")} kamenů, hra pro tři ${f("sterbord_stenen_3_spelers")}, pro čtyři ${f("sterbord_stenen_4_spelers")} a pro šest ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Čtvercová deska Halmy má ${f("vierkant_vakken")} polí.</strong> Ve hře pro dva hráče začíná každý hráč s ${f("vierkant_stenen_per_speler_2_spelers")} kameny, celkem ${f("vierkant_stenen_2_spelers")}. Ve hře pro čtyři začíná každý s ${f("vierkant_stenen_per_speler_4_spelers")} kameny, celkem ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Nejdelší řetěz skoků: ${f("langste_sprongketen")}</h2>
      <p>Na hvězdicové desce může jeden kámen udělat <strong>${f("langste_sprongketen")} skoků v jediném tahu</strong> a podle pravidel Leapstone žádný tah nemůže mít víc. Aby se na toto číslo dalo dojít, ostatní kameny se rozestaví volně: jeden na každé pole, přes které kámen skáče.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Hvězdicová deska s jedním červeným kamenem a mnoha modrými kameny. Bílé šipky ukazují, jak červený kámen přeskakuje jeden modrý kámen za druhým po dlouhé klikaté cestě.",
  tekst: "Nejdelší řetěz: červený kámen přeskočí každý modrý kámen, jeden po druhém.",
})}
      <p><strong>Jak se to počítá.</strong> Skok vždy dopadne o dvě pole dál v přímé čáře. Kámen, který pořád skáče, se proto dostane jen na část polí: deska se dělí na čtyři takové skupiny a největší z nich má ${f("grootste_klasse_vakken")} polí. V Leapstone nesmí kámen v jednom tahu dopadnout dvakrát na stejné pole ani na pole, odkud vyšel. Řetěz tedy dopadne nanejvýš jednou na každé z ostatních polí své skupiny. Program tuto skupinu prohledal a našel cestu přes všech ${f("grootste_klasse_vakken")} polí, takže žádný řetěz nemůže být delší: ${f("langste_sprongketen")} skoků. Test pak tento tah zahraje podle pravidel Leapstone.</p>
      <p><strong>Nejde o skutečnou hru.</strong> Tento řetěz potřebuje ${f("langste_sprongketen")} dalších kamenů, každý přesně na správném poli. Hra pro dva nebo tři hráče má jen ${f("sterbord_stenen_2_spelers")} nebo ${f("sterbord_stenen_3_spelers")} kamenů, a to je málo. Hra pro čtyři nebo šest hráčů jich má ${f("sterbord_stenen_4_spelers")} nebo ${f("sterbord_stenen_6_spelers")}, a to stačí. Ve skutečné hře ale nikdo kameny volně nerozestavuje, takže tento řetěz u stolu nečekejte. Ukazuje, co deska dovolí, ne co se stane při hře.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Nejkratší přechod: ${f("oversteek_zetten")} tahů</h2>
      <p>Jeden hráč sám na hvězdicové desce, bez soupeřů, potřebuje <strong>${f("oversteek_zetten")} tahů</strong>, aby dostal všech ${f("sterbord_stenen_per_speler")} kamenů z jednoho hrotu do protějšího, a méně tahů nestačí. Celý řetěz skoků se počítá jako jeden tah.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Hvězdicová deska jen s deseti červenými kameny v dolním hrotu. Horní hrot, kam musí dojít, má čárkovaný obrys.",
  tekst: "Jeden hráč sám: deset kamenů v dolním hrotu a cílem je horní hrot.",
})}
      <p><strong>Jak se to počítá.</strong> Test zahraje přechod o ${f("oversteek_zetten")} tazích podle pravidel Leapstone, bez dalších kamenů na desce. Aby se ukázalo, že ${f("geen_oversteek_in_zetten")} tahů nebo méně nestačí, řídí se hledání metodou G. I. Bella (<em>Integers</em> 9, 2009). Každý tah se dá zahrát pozpátku a otočení desky o půl otáčky prohodí start a cíl. Kdyby tedy existoval přechod o ${f("geen_oversteek_in_zetten")} tazích nebo méně, nějaké postavení v polovině cesty by bylo nejvýš ${f("zoekdiepte_zetten")} tahů od startu, a stejně tak totéž postavení otočené o půl otáčky. Hledání prošlo každé postavení do ${f("zoekdiepte_zetten")} tahů od startu, počítalo postavení a jeho zrcadlový obraz jednou, vynechalo ta, která se prokazatelně nemohou včas dostat dost daleko, a žádnou takovou dvojici nenašlo. Běželo ${f("gemeten_rekentijd_seconden")} sekund na stroji s ${f("gemeten_kernen")} jádry a jeho největší krok držel ${f("gemeten_grootste_laag_miljoen_standen")} milionu postavení v ${f("gemeten_geheugen_gb")} GB paměti. Číslo bylo znovu spočítáno pro vlastní desku Leapstone.</p>
      <p><strong>Nejde o dolní mez pro skutečnou hru.</strong> Ve skutečné hře jsou na desce i kameny ostatních hráčů a vaše kameny přes ně mohou skákat. ${f("oversteek_zetten")} tedy není nejmenší možná délka skutečné hry: platí jen pro jednoho hráče samotného.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Vyzkoušejte to</h2>
      <p><a href="/play/">Hrajte Leapstone v prohlížeči</a> proti počítači, nebo si stáhněte aplikaci tlačítky nahoře na této stránce. Pravidla najdete v článku <a href="/cs/pravidla/cinska-dama">Čínská dáma: pravidla hry</a> nebo v <a href="/cs/pravidla/halma">pravidlech Halmy</a>. Jak využít řetězy skoků ve hře, se dočtete v <a href="/cs/navody/cinska-dama-strategie">tipech ke strategii</a>.</p>
    </section>`;

export default {
  nav: "Čínská dáma v číslech",
  titel: "Čínská dáma v číslech | Leapstone",
  beschrijving: `Hvězdicová deska má ${c.sterbord_vakken} polí. Jeden tah má nanejvýš ${c.langste_sprongketen} skoků a hráč sám na desce potřebuje ${c.oversteek_zetten} tahů na přechod. Jak se každé číslo počítá.`,
  h1: "Čínská dáma v číslech",
  intro: `Hvězdicová deska čínské dámy má ${f("sterbord_vakken")} polí a každý hráč začíná s ${f("sterbord_stenen_per_speler")} kameny. V Leapstone nemůže mít jeden tah nikdy víc než ${f("langste_sprongketen")} skoků. Jeden hráč sám na desce, bez soupeřů, potřebuje ${f("oversteek_zetten")} tahů, aby ji přešel. Níže uvidíte, jak se každé číslo počítá a co o skutečné hře říká a co ne.`,
  inhoud,
};
