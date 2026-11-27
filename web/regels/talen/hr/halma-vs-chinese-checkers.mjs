// Vodič Halma ili kineska dama na hrvatskom (taak 300). Sadržaj: engleski vodič ../en/halma-vs-chinese-checkers.mjs, rečenicu po rečenicu.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kineska dama: zvjezdasta ploča, 121 polje",
    alt: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku i 10 plavih figura u gornjem kraku",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: kvadratna ploča, 256 polja",
    alt: "Kvadratna ploča s 19 crvenih figura u gornjem lijevom kutu i 19 plavih figura u donjem desnom kutu",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Zvjezdasta ploča: šest susjeda, tri od njih ovdje prazna",
    alt: "Crvena figura s bijelim prstenom oko sebe. Tri od njezinih šest susjeda prazna su i označena; ostala tri imaju figure.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Kvadratna ploča: osam susjeda, pet od njih ovdje prazno",
    alt: "Crvena figura s bijelim prstenom oko sebe. Pet od njezinih osam susjeda prazno je i označeno; ostala tri imaju figure.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Kratki odgovor</h2>
      <p>Halma se igra na kvadratnoj ploči, a kineska dama na ploči u obliku šesterokrake zvijezde. U objema igrama figure pomičeš koracima i skokovima preko ploče, a pobjeđuje prvi igrač koji ispuni logor na suprotnoj strani.</p>
      <p>Razlikuju se ploča, smjerovi u kojima se krećeš, koliko ljudi može igrati i koliko figura ima svatko od njih. <a href="/hr/pravila/sto-je-sternhalma">Sternhalma</a> je naziv za Halmu na zvjezdastoj ploči, dakle to je ista igra kao kineska dama.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Ploče</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kineska dama</strong> koristi zvjezdastu ploču: 121 polje, s krakom od 10 polja na svakom od šest vrhova. Krak je trokut od redova s 4, 3, 2 i 1 poljem.</li>
        <li><strong>Halma</strong> koristi kvadratnu ploču: 16 puta 16 polja, ukupno 256. Logor je u kutu. Veliki logor ima redove s 5, 5, 4, 3 i 2 polja, a mali redove s 4, 4, 3 i 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Smjerovi: šest ili osam</h2>
      <p>Na zvjezdastoj ploči polje ima šest susjeda. Na kvadratnoj ima osam, jer se i dijagonale računaju. Korak ide na prazno susjedno polje. Skok ide preko jedne figure pokraj tvoje, ravnom crtom, na prazno polje iza nje, u bilo kojem od tih smjerova, pa i unatrag.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Polje na rubu ima manje susjeda, a kut kvadratne ploče ima tri. Šest smjerova čini tri crte kroz polje na zvjezdastoj ploči. Osam smjerova čini četiri crte na kvadratnoj ploči: poprijeko, gore i dolje te dvije dijagonale.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Igrači i figure</h2>
      <ul>
        <li><strong>Kineska dama:</strong> 2, 3, 4 ili 6 igrača. Svatko ima 10 figura, pa na ploči ima 20, 30, 40 ili 60 figura.</li>
        <li><strong>Halma:</strong> 2 ili 4 igrača. S 2 igrača svatko ima 19 figura, ukupno 38. S 4 igrača svatko ima 13 figura, ukupno 52.</li>
      </ul>
      <p>Kvadratna ploča u Leapstoneu nema igru za 3 ili 6 igrača. Za igru u troje pročitaj <a href="/hr/vodici/kineska-dama-za-3-igraca">Kineska dama za 3 igrača</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Što je isto</h2>
      <ul>
        <li><strong>Potez:</strong> jedan korak ili lanac skokova jednom figurom. Ti odlučuješ gdje lanac završava, a nakon skoka ne možeš koraknuti.</li>
        <li><strong>Bilo koja boja:</strong> skačeš preko figure bilo koje boje, i svoje. Figura preko koje skočiš ostaje gdje jest. Ništa se ne uzima.</li>
        <li><strong>Cilj:</strong> logor nasuprot onome iz kojeg si krenuo. Sva njegova polja moraju imati tvoje figure. Dok se u njemu nalazi figura drugog igrača, ne možeš završiti.</li>
        <li><strong>Pobjeda:</strong> pobjeđuje prvi igrač koji ispuni cilj. S 2 igrača igra je tada gotova. S više igrača ostali igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se.</li>
        <li><strong>Odustajanje i vrijeme:</strong> kad odustaneš, tvoje figure odlaze s ploče. U online igri svaki potez ima vremensko ograničenje, a ako propustiš 3 poteza zaredom, odustaješ.</li>
      </ul>
      <p>Pročitaj potpuna pravila <a href="/hr/pravila/kineska-dama">kineske dame</a> i <a href="/hr/pravila/halma">Halme</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Koju ploču odabrati u Leapstoneu</h2>
      <ul>
        <li><strong>3 ili 6 igrača:</strong> samo zvjezdasta ploča ima te igre.</li>
        <li><strong>Više figura svatko:</strong> kvadratna ploča, s po 19 figura za 2 igrača ili 13 za 4, naspram 10 na zvjezdastoj ploči.</li>
        <li><strong>Igraj online:</strong> brza igra igra se na zvjezdastoj ploči. S prijateljima i protiv računala možeš odabrati bilo koju ploču.</li>
      </ul>
      <p>Gumb Igraj sada otvara igru protiv računala na zvjezdastoj ploči. Za igru na kvadratnoj ploči dodirni strelicu za natrag na vrhu i u izborniku odaberi Četvrtasta ploča.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Idemo dalje</h2>
      <ul>
        <li><a href="/play/">Igraj u pregledniku</a> i isprobaj obje ploče.</li>
        <li><a href="/hr/vodici/kineska-dama-strategija">Strategija kineske dame</a>: šest savjeta sa slikama.</li>
        <li><a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>: kako izgleda igra za dvoje.</li>
      </ul>
      <p><a href="/hr/vodici/kineska-dama-online-s-prijateljima">Kineska dama online s prijateljima</a></p>
    </section>`;

export default {
  nav: "Halma ili kineska dama",
  titel: "Halma ili kineska dama: razlike | Leapstone",
  beschrijving: "Halma ili kineska dama? Kvadratna i zvjezdasta ploča, šest ili osam smjerova, igrači i figure te što je isto.",
  h1: "Halma ili kineska dama",
  intro: "Dvije igre s istom idejom: dovedi sve svoje figure na drugu stranu ploče. Što se razlikuje, što je isto i gdje igrati obje.",
  inhoud,
};
