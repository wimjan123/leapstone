// Vodnik Kitajske dame: otvoritvene poteze (taak 303), v slovenščini. Vsebina: ../en/chinese-checkers-opening-moves.mjs, poved za povedjo.
// Vsako število in vsaka poteza je preverjena s crates/halma-core (glej docs/plan.md, taak 303). Brez izmišljenih »strokovnjakov« ali zgodovine.
// Samo številke v besedilu (brez številk z besedami).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Tvoja prva poteza: 14 izbir</h2>
      <p>Na začetku tvojih 10 figur zapolnjuje trikotnik v vrstah po 4, 3, 2 in 1, sprednja vrsta pa gleda proti sredini plošče. Znotraj trikotnika ni nobenega praznega polja, zato lahko figura gre samo v vrsto tik pred sabo. Ostane 14 prvih potez: vsaka od 4 figur v sprednji vrsti lahko stopi na 2 polji (8 korakov), vsaka od 3 figur v drugi vrsti pa lahko preskoči sprednjo figuro na 2 polji (6 skokov). Preostale 3 figure se še ne morejo premakniti.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Rdeča konica spodaj z 10 figurami in v vrsti tik pred njo 5 praznih polj, označenih z obročem.",
  tekst: "Vsaka prva poteza se konča na enem od teh 5 polj.",
})}
      <p>V tem vodniku je vrsta niz polj počez čez tvojo konico, vzporedno z njenim sprednjim robom, napredek pa štejemo v vrstah. Korak premakne figuro naprej za 1 vrsto, skok pa za 2 vrsti. Vsak igralec ima enakih 14 prvih potez, pri 2, 3, 4 ali 6 igralcih in iz katere koli konice zvezde, ker je od znotraj vsaka konica videti enako.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Otvoritev 1: skoči ven, nato sprosti vrh</h2>
      <p>Figura na vrhu tvoje konice je najdlje od tvojega cilja in se na začetku ne more premakniti: čez figuro lahko skoči le, če je polje za njo prosto. Skok iz druge vrste naredi točno tako polje.</p>
      <ol>
        <li><strong>Poteza 1:</strong> figura na desnem koncu tvoje druge vrste preskoči figuro pred sabo. Pristane v vrsti pred tvojo konico in pridobi 2 vrsti.</li>
        <li><strong>Poteza 2:</strong> figura na vrhu v eni potezi skoči dvakrat: najprej na polje, ki ga je sprostila poteza 1, nato čez figuro druge vrste. Pridobi 4 vrste.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Rdeča konica po potezi 1. Figura na vrhu ima obroč, 2 puščici s številkama 1 in 2 pa kažeta njena skoka skozi sproščeno polje v vrsto pred konico.",
  tekst: "Po potezi 1 figura z vrha skoči ven z 2 skokoma.",
})}
      <p>To je 6 vrst v 2 potezah. Preizkusili smo vse načine, kako odigrati 2 potezi, in 6 je največ, kar lahko pridobiš. Dosežejo ga samo 4 pari potez: skoči figura na katerem koli koncu druge vrste, v katero koli od svojih 2 smeri, figura z vrha pa ji sledi. Figura na sredini druge vrste ne deluje, ker pusti vrh zaprt.</p>
      <p>Obe figuri zdaj stojita v vrsti pred tvojo konico s praznim poljem vmes. To je prvi korak lestve.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Otvoritev 2: 4 poteze s 4 različnimi figurami</h2>
      <p>V 4 potezah lahko pridobiš največ 13 vrst, do tega pa prideš le, če vsaka poteza uporabi drugo figuro. Ta vrstni red to zmore:</p>
      <ol>
        <li><strong>Poteza 1:</strong> figura na desnem koncu sprednje vrste stopi naprej. Pridobi 1 vrsto.</li>
        <li><strong>Poteza 2:</strong> figura na desnem koncu tretje vrste skoči dvakrat. Pridobi 4 vrste.</li>
        <li><strong>Poteza 3:</strong> figura na levem koncu druge vrste skoči dvakrat. Pridobi 4 vrste.</li>
        <li><strong>Poteza 4:</strong> figura z vrha skoči dvakrat. Pridobi 4 vrste.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Rdeča konica na začetku. 4 figure, ki se bodo premaknile, imajo številko od 1 do 4 po vrstnem redu potez.",
          tekst: "Prej: figure, ki se premaknejo, po vrsti.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Rdeča konica po 4 potezah s 4 polji, kjer so pristale oštevilčene figure v vrstah pred konico, in s 4 luknjami, ki so ostale v konici.",
          tekst: "Potem: kje so pristale.",
        })}
      </div>
      <p>Vsaka poteza pripravi naslednjo. Potezi 2 in 3 se končata s skokom čez figuro, ki se je premaknila tik prej, poteza 4 pa se začne skozi luknjo, ki jo je pustila poteza 3. Vse 4 figure pristanejo v tvoji polovici plošče.</p>
      <p>Obstajajo še druge poti, ki dosežejo 13. Skupna jim je ideja: poišči potezo, ki pusti luknjo ali stopnico za naslednjo potezo, in figuro z vrha spusti ven najpozneje s potezo 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Napake v prvih potezah</h2>
      <ul class="tips">
        <li><strong>Vsak krog premikaš isto figuro.</strong> Figura, ki teče sama, v 4 potezah pridobi 5 vrst, 4 različne figure pa 13. Poleg tega ostanejo tvoje druge figure tam, kjer so bile.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Rdeča konica na začetku. Ena figura iz druge vrste naredi 4 poteze zapored po eni liniji, s puščicami in številkami od 1 do 4, in konča sama blizu sredine plošče.",
  tekst: "Ena figura, 4 poteze, 5 vrst.",
})}
      <ul class="tips">
        <li><strong>Stopanje samo s sprednjo vrsto.</strong> 4 koraki pridobijo 4 vrste. Po njih figura na vrhu še vedno ne more premakniti, zato ostane zadaj, medtem ko ostale napredujejo.</li>
        <li><strong>Stopanje vstran.</strong> Korak vzdolž vrste pridobi 0 vrst. Po potezi 1 otvoritve 1 lahko sprednja figura stopi na polje poleg sebe in videti je kot napredek, a je poteza zapravljena.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Igraj naprej</h2>
      <p>Po približno 4 potezah se vojski približata in zgornje otvoritve prepustijo mesto sredini igre. Vrstnega reda si ni treba zapomniti: zapomni si, da mora vsaka poteza pripraviti naslednjo.</p>
      <ul>
        <li><a href="/play/">Igraj proti računalniku v brskalniku</a> in poskusi otvoritev 1 ali 2.</li>
        <li><a href="/sl/vodniki/kitajske-dame-strategija">Strategija v kitajskih damah</a>: lestve, držanje figur skupaj in polnjenje cilja.</li>
        <li><a href="/sl/vodniki/kitajske-dame-za-dva">Kitajske dame za 2 igralca</a>: kako deluje igra v dvoje.</li>
        <li><a href="/sl/pravila/kitajske-dame">Pravila kitajskih dam</a>, s slikami korakov, skokov in verig.</li>
      </ul>
    </section>`;

export default {
  nav: "Kitajske dame: otvoritvene poteze",
  titel: "Otvoritvene poteze v kitajskih damah: 2 možnosti | Leapstone",
  beschrijving: "Otvoritvene poteze v kitajskih damah: kako skočiš iz konice, sprostiš figuro z vrha s potezo 2 in pridobiš 13 vrst v 4 potezah, ter napake.",
  h1: "Otvoritvene poteze v kitajskih damah",
  intro: "Dobra otvoritev v kitajskih damah skoči iz druge vrste, v vsakem krogu uporabi drugo figuro in figuro z vrha spusti ven s potezo 2 ali 4. Dve otvoritvi s slikami in napake, ki se jim izogni.",
  inhoud,
};
