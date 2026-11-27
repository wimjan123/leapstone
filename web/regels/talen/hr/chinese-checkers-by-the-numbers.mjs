// Leapstone u brojkama, Kroatisch (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Polja i figure</h2>
      <p>Prebrojeno na obje ploče Leapstonea, u početnom položaju igre.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Zvjezdasta ploča sa svih šest krakova punih: deset figura u svakoj od šest boja, oko praznog središta.",
  tekst: "Zvjezdasta ploča na početku igre za šest igrača.",
})}
      <ul class="tips">
        <li><strong>Zvjezdasta ploča ima ${f("sterbord_vakken")} polje.</strong> Svaki igrač počinje s ${f("sterbord_stenen_per_speler")} figura. Igra za dva igrača zato ima ${f("sterbord_stenen_2_spelers")} figura na ploči, igra za tri ${f("sterbord_stenen_3_spelers")}, za četiri ${f("sterbord_stenen_4_spelers")} i za šest ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Kvadratna ploča za Halmu ima ${f("vierkant_vakken")} polja.</strong> U igri za dva igrača svaki igrač počinje s ${f("vierkant_stenen_per_speler_2_spelers")} figura, ukupno ${f("vierkant_stenen_2_spelers")}. U igri za četiri svaki počinje s ${f("vierkant_stenen_per_speler_4_spelers")} figura, ukupno ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Najduži lanac skokova: ${f("langste_sprongketen")}</h2>
      <p>Na zvjezdastoj ploči jedna figura može napraviti <strong>${f("langste_sprongketen")} skokova u jednom potezu</strong>, a po pravilima Leapstonea nijedan potez ne može imati više. Da bi se došlo do tog broja, ostale su figure postavljene slobodno: po jedna na svako polje preko kojeg figura skače.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Zvjezdasta ploča s jednom crvenom figurom i mnogo plavih figura. Bijele strelice pokazuju kako crvena figura skače preko jedne plave figure za drugom, dugim vijugavim putem.",
  tekst: "Najduži lanac: crvena figura skače preko svake plave figure, jedne za drugom.",
})}
      <p><strong>Kako je prebrojeno.</strong> Skok uvijek doskoči dva polja dalje, u ravnoj crti. Figura koja stalno skače zato dolazi samo na dio polja: ploča se dijeli na četiri takve skupine, a najveća ima ${f("grootste_klasse_vakken")} polja. U Leapstoneu figura u jednom potezu ne smije dvaput doskočiti na isto polje, ni na polje s kojeg je krenula. Lanac zato doskoči najviše jednom na svako od ostalih polja svoje skupine. Program je pretražio tu skupinu i našao put preko svih ${f("grootste_klasse_vakken")} polja, pa nijedan lanac ne može biti duži: ${f("langste_sprongketen")} skokova. Test zatim odigra taj potez po pravilima Leapstonea.</p>
      <p><strong>Nije prava igra.</strong> Taj lanac treba ${f("langste_sprongketen")} drugih figura, svaku točno na pravom polju. Igra za dva ili tri igrača ima samo ${f("sterbord_stenen_2_spelers")} ili ${f("sterbord_stenen_3_spelers")} figura, što je premalo. Igra za četiri ili šest igrača ima ${f("sterbord_stenen_4_spelers")} ili ${f("sterbord_stenen_6_spelers")}, što je dovoljno. Ali u pravoj igri nitko ne postavlja figure slobodno, pa taj lanac ne očekuj za stolom. On pokazuje što ploča dopušta, a ne što se događa u igri.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Najkraći prijelaz: ${f("oversteek_zetten")} poteza</h2>
      <p>Jedan igrač sam na zvjezdastoj ploči, bez protivnika, treba <strong>${f("oversteek_zetten")} poteza</strong> da svih ${f("sterbord_stenen_per_speler")} figura prebaci iz jednog kraka u suprotni, i ne može to u manje. Cijeli lanac skokova broji se kao jedan potez.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča samo s deset crvenih figura, u donjem kraku. Gornji krak, kamo moraju stići, ima isprekidan obrub.",
  tekst: "Jedan igrač sam: deset figura u donjem kraku, a gornji krak je cilj.",
})}
      <p><strong>Kako je prebrojeno.</strong> Test odigra prijelaz u ${f("oversteek_zetten")} poteza po pravilima Leapstonea, bez drugih figura na ploči. Da bi se pokazalo da ${f("geen_oversteek_in_zetten")} poteza ili manje nije dovoljno, pretraga slijedi metodu G. I. Bella (<em>Integers</em> 9, 2009). Svaki se potez može odigrati unatrag, a okret ploče za pola kruga zamijeni početak i cilj. Kad bi postojao prijelaz u ${f("geen_oversteek_in_zetten")} poteza ili manje, neki položaj na pola puta bio bi najviše ${f("zoekdiepte_zetten")} poteza od početka, a isto tako i isti položaj okrenut za pola kruga. Pretraga je prošla svaki položaj do ${f("zoekdiepte_zetten")} poteza od početka, brojila položaj i njegovu zrcalnu sliku jednom, izostavila one koji dokazivo ne mogu na vrijeme stići dovoljno daleko, i nije našla takav par. Radila je ${f("gemeten_rekentijd_seconden")} sekundi na stroju s ${f("gemeten_kernen")} jezgri, a njezin najveći korak držao je ${f("gemeten_grootste_laag_miljoen_standen")} milijuna položaja u ${f("gemeten_geheugen_gb")} GB memorije. Broj je ponovno izračunat za Leapstoneovu vlastitu ploču.</p>
      <p><strong>Nije donja granica za pravu igru.</strong> U pravoj igri na ploči su i figure drugih igrača, a tvoje figure mogu skakati preko njih. ${f("oversteek_zetten")} zato nije najmanje što prava igra može trajati: dokazano je samo za jednog igrača samog.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Isprobaj</h2>
      <p><a href="/play/">Igraj Leapstone u pregledniku</a> protiv računala, ili preuzmi aplikaciju gumbima na vrhu ove stranice. Za pravila pročitaj <a href="/hr/pravila/kineska-dama">pravila kineske dame</a> ili <a href="/hr/pravila/halma">pravila Halme</a>. Kako lance skokova koristiti u igri, pročitaj u <a href="/hr/vodici/kineska-dama-strategija">savjetima za strategiju</a>.</p>
    </section>`;

export default {
  nav: "Kineska dama u brojkama",
  titel: "Kineska dama u brojkama | Leapstone",
  beschrijving: `Zvjezdasta ploča ima ${c.sterbord_vakken} polje. Jedan potez ima najviše ${c.langste_sprongketen} skokova, a igrač sam treba ${c.oversteek_zetten} poteza za prijelaz. Kako je izračunat svaki broj.`,
  h1: "Kineska dama u brojkama",
  intro: `Zvjezdasta ploča kineske dame ima ${f("sterbord_vakken")} polje, a svaki igrač počinje s ${f("sterbord_stenen_per_speler")} figura. U Leapstoneu jedan potez nikad ne može imati više od ${f("langste_sprongketen")} skokova. Jedan igrač sam na ploči, bez protivnika, treba ${f("oversteek_zetten")} poteza da je prijeđe. Ispod vidiš kako je prebrojen svaki broj, i što govori a što ne govori o pravoj igri.`,
  inhoud,
};
