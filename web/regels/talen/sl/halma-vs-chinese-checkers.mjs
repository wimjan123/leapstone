// Vodnik Halma ali kitajske dame v slovenščini (taak 300). Vsebina: angleški vodnik ../en/halma-vs-chinese-checkers.mjs, stavek za stavkom.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kitajske dame: zvezdasta plošča, 121 polj",
    alt: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici in 10 modrimi figurami v zgornji konici",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: kvadratna plošča, 256 polj",
    alt: "Kvadratna plošča z 19 rdečimi figurami v zgornjem levem kotu in 19 modrimi figurami v spodnjem desnem kotu",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Zvezdasta plošča: šest sosedov, trije od njih tu prosti",
    alt: "Rdeča figura z belim obročem okoli sebe. Trije od njenih šestih sosedov so prosti in označeni; ostali trije imajo figure.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Kvadratna plošča: osem sosedov, pet od njih tu prostih",
    alt: "Rdeča figura z belim obročem okoli sebe. Pet od njenih osmih sosedov je prostih in označenih; ostali trije imajo figure.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Kratek odgovor</h2>
      <p>Halma se igra na kvadratni plošči, kitajske dame pa na plošči v obliki šestkrake zvezde. V obeh igrah svoje figure premikaš s koraki in skoki čez ploščo, zmaga pa prvi igralec, ki napolni tabor na nasprotni strani.</p>
      <p>Razlikujejo se plošča, smeri, v katere se premikaš, koliko ljudi lahko igra in koliko figur ima vsak od njih. <a href="/sl/pravila/sternhalma">Sternhalma</a> je ime za Halmo na zvezdasti plošči, zato je to ista igra kot kitajske dame.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Plošče</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kitajske dame</strong> uporabljajo zvezdasto ploščo: 121 polj, s konico z 10 polji na vsakem od šestih koncev. Konica je trikotnik iz vrst s 4, 3, 2 in 1 poljem.</li>
        <li><strong>Halma</strong> uporablja kvadratno ploščo: 16 krat 16 polj, skupaj 256. Tabor je v kotu. Velik tabor ima vrste s 5, 5, 4, 3 in 2 polji, majhen pa vrste s 4, 4, 3 in 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Smeri: šest ali osem</h2>
      <p>Na zvezdasti plošči ima polje šest sosedov. Na kvadratni jih ima osem, ker štejejo tudi diagonale. Korak gre na prostega soseda. Skok gre čez eno figuro poleg tvoje, v ravni črti, na prosto polje za njo, v katero koli od teh smeri in tudi nazaj.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Polje na robu ima manj sosedov, kotno polje kvadratne plošče pa tri. Šest smeri naredi tri črte skozi polje na zvezdasti plošči. Osem smeri naredi štiri črte na kvadratni plošči: počez, od zgoraj navzdol in dve diagonali.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Igralci in figure</h2>
      <ul>
        <li><strong>Kitajske dame:</strong> 2, 3, 4 ali 6 igralcev. Vsak ima 10 figur, zato je na plošči 20, 30, 40 ali 60 figur.</li>
        <li><strong>Halma:</strong> 2 ali 4 igralci. Pri 2 igralcih ima vsak 19 figur, skupaj 38. Pri 4 igralcih ima vsak 13 figur, skupaj 52.</li>
      </ul>
      <p>Kvadratna plošča v Leapstone nima igre za 3 ali 6 igralcev. Za igro v treh preberi <a href="/sl/vodniki/kitajske-dame-za-tri">Kitajske dame za 3 igralce</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Kaj je enako</h2>
      <ul>
        <li><strong>Poteza:</strong> en korak ali veriga skokov z eno figuro. Sam se odločiš, kje se veriga konča, po skoku pa ne moreš narediti koraka.</li>
        <li><strong>Katera koli barva:</strong> skačeš čez figuro katere koli barve, tudi čez svojo. Figura, čez katero skočiš, ostane, kjer je. Nič se ne zajame.</li>
        <li><strong>Cilj:</strong> tabor nasproti tistega, iz katerega si začel. Vsa njegova polja morajo imeti tvoje figure. Dokler je tam figura drugega igralca, ne moreš končati.</li>
        <li><strong>Zmaga:</strong> zmaga prvi igralec, ki napolni cilj. Pri 2 igralcih je takrat igre konec. Pri več igralcih drugi igrajo naprej za naslednja mesta, igralec, ki je končal, pa se preskoči.</li>
        <li><strong>Odstop in čas:</strong> ko odstopiš, tvoje figure zapustijo ploščo. V spletni igri ima vsaka poteza časovno omejitev, in če zamudiš 3 poteze zapored, odstopiš.</li>
      </ul>
      <p>Preberi popolna pravila <a href="/sl/pravila/kitajske-dame">kitajskih dam</a> in <a href="/sl/pravila/halma">Halme</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Katero ploščo izbrati v Leapstone</h2>
      <ul>
        <li><strong>3 ali 6 igralcev:</strong> samo zvezdasta plošča ima take igre.</li>
        <li><strong>Več figur za vsakega:</strong> kvadratna plošča, s po 19 figurami za 2 igralca ali 13 za 4, proti 10 na zvezdasti plošči.</li>
        <li><strong>Igraj na spletu:</strong> hitra igra se igra na zvezdasti plošči. S prijatelji in proti računalniku lahko izbereš katero koli ploščo.</li>
      </ul>
      <p>Gumb Igraj zdaj odpre igro proti računalniku na zvezdasti plošči. Za igro na kvadratni plošči se dotakni puščice nazaj zgoraj in v meniju izberi Kvadratna plošča.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Naprej</h2>
      <ul>
        <li><a href="/play/">Igraj v brskalniku</a> in preizkusi obe plošči.</li>
        <li><a href="/sl/vodniki/kitajske-dame-strategija">Strategija v kitajskih damah</a>: šest nasvetov s slikami.</li>
        <li><a href="/sl/vodniki/kitajske-dame-za-dva">Kitajske dame za 2 igralca</a>: kako poteka igra za dva.</li>
      </ul>
      <p><a href="/sl/vodniki/kitajske-dame-na-spletu-s-prijatelji">Kitajske dame na spletu s prijatelji</a></p>
    </section>`;

export default {
  nav: "Halma ali kitajske dame",
  titel: "Halma ali kitajske dame: razlike | Leapstone",
  beschrijving: "Halma ali kitajske dame? Kvadratna in zvezdasta plošča, šest ali osem smeri, igralci in figure ter kaj je enako.",
  h1: "Halma ali kitajske dame",
  intro: "Dve igri z isto idejo: pripelji vse svoje figure na drugo stran plošče. Kaj je drugače, kaj je enako in kje igrati obe.",
  inhoud,
};
