// Vodnik po strategiji kitajskih dam (taak 134), v slovenščini. Vsebina: ../en/chinese-checkers-strategy.mjs, poved za povedjo.
// Vsak nasvet je preverjen s crates/halma-core (glej docs/plan.md, taak 122). Brez izmišljenih »strokovnjakov«, številk ali zgodovine.
// Edina številka je 16 (koraki od konice do konice), ki jo šteje primer.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Na čem temeljijo ti nasveti</h2>
      <p>Nasveti izhajajo iz <a href="/sl/pravila/kitajske-dame">pravil kitajskih dam</a>, kot jih igra Leapstone: poteza je en korak ali veriga skokov, preskočiš pa lahko figuro katere koli barve. Niso dokaz najboljše igre. Igra proti računalniku je najhitrejši način, da jih preizkusiš.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Postavljaj lestve</h2>
      <p>Lestev je vrsta figur s po enim prostim poljem med vsako od njih. Figura na enem koncu v eni potezi preskoči vso vrsto, tako da prečka ploščo v eni potezi namesto po eno polje na potezo.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Štiri figure v diagonalni vrsti s po enim prostim poljem vmes. Rdeča figura na enem koncu preskoči vse štiri, s štirimi oštevilčenimi polji pristanka.",
  tekst: "Štirje skoki v eni potezi. Ista figura bi lahko stopala le po eno polje naenkrat.",
})}
      <p>Skok deluje v vseh šestih smereh, tudi nazaj, zato lestev ni nujno, da se začne v tvoji konici. Primerna je vsaka vrsta figur z vrzelmi med njimi.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Drži figure skupaj</h2>
      <p>Vseh 10 figur potrebuješ v svojem cilju, zato tvoja zadnja figura odloči, kdaj končaš. Figura brez figure poleg sebe nima ničesar za preskočiti in lahko samo stopa.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z rdečo figuro, ki je sama v spodnji konici. Označena sta samo njena dva prosta soseda. Druge rdeče in modre figure stojijo na sredini.",
  tekst: "Ta figura nima soseda, zato lahko stopi samo na dve označeni polji.",
})}
      <p>Od vrha tvoje konice do vrha cilja na drugi strani plošče je 16 korakov. To je 16 potez za samotno figuro, medtem ko lestev prečka v eni. Premikaj figure zadaj, dokler so okoli njih še figure za preskok. Računalnik v Leapstone to počne tudi: poteze svojih najbolj zadnjih figur oceni nekoliko višje.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Izkoristi sredino</h2>
      <p>Figura na sredini plošče ima šest sosedov, zato lahko stopi ali skoči v vseh šestih smereh. Figura na robu jih ima manj. Figura na robu na sliki jih ima štiri.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z eno rdečo figuro na sredini s šestimi označenimi sosedi in eno rdečo figuro blizu zgornjega levega roba s štirimi označenimi sosedi.",
  tekst: "Šest načinov za korak na sredini, štirje na robu.",
})}
      <p>Figure na sredini dajo drugim figuram tudi nekaj za preskok na poti čez.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Cilj polni od zadaj</h2>
      <p>Tvoj cilj je trikotnik z 10 polji, v vrstah po 4, 3, 2 in 1. Do polj zadaj prideš samo skozi polja pred njimi. Če najprej napolniš sprednja, zadnja figura morda ne bo imela poti noter.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Ciljna konica zgoraj z devetimi rdečimi figurami in enim praznim poljem čisto zadaj, označenim s črtami. Deseta rdeča figura, z belim obročem, stoji pod sprednjo vrsto.",
  tekst: "Devet figur je doma, polje zadaj pa je prazno. Deseta figura nima poteze vanj.",
})}
      <p>Prve figure daj na zadnja polja in delaj proti sprednjim, da ostanejo sprednja prosta za figure, ki pridejo zadnje.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Ne zazidaj figure v svojem cilju</h2>
      <p>Ustaviš se lahko v konici drugega igralca, zato lahko figura drugega igralca konča v tvojem cilju. Zmagaš šele, ko vseh 10 polj tvojega cilja drži tvoje figure. Če ta figura nima poteze, je nihče ne more premakniti, ti pa ne moreš zmagati, dokler se ne sprosti polje poleg nje.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Ciljna konica zgoraj z devetimi rdečimi figurami in eno modro figuro čisto zadaj, označeno z belim obročem. Modro figuro obkrožajo rdeče figure.",
  tekst: "Modra figura zadaj nima poteze, rdeči pa ne more napolniti cilja.",
})}
      <p>Ohrani polje poleg take figure prosto, da lahko odide. Računalnik v Leapstone to upošteva: poteza, ki ujame figuro drugega igralca v njegovem cilju, dobi nižjo oceno. Pravila nikogar ne silijo, da zapusti tvoj cilj, zato lahko drugi igralec figuro tam tudi namenoma pusti.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blokiraj skok ali ga pusti</h2>
      <p>Skok potrebuje prosto polje za pristanek. Zapolni to polje in skoka ni več. Dveh figur zapored prav tako ni mogoče preskočiti.</p>
      <p>Tvoje figure so stopnice tudi za drugega igralca. Na levi sliki modri v eni potezi prečka dve rdeči figuri. Na desni je rdeči premaknil eno figuro na prvo polje pristanka in modri lahko le stopi.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Modra figura z dvema rdečima figurama v vrsti, vsaka s prostim poljem za sabo. Puščice kažejo dva skoka modre figure.",
          tekst: "Prej: modri lahko naredi dva skoka.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Ista vrsta, potem ko je rdeči svojo oddaljeno figuro premaknil na prvo polje pristanka. Modri figuri sledita dve rdeči figuri zapored.",
          tekst: "Potem: rdeči je premaknil eno figuro. Modri nima skoka.",
        })}
      </div>
      <p>Poteza, porabljena za blokiranje, ni poteza za tvoj napredek, zato blokiraj, kadar skok drugemu igralcu da več, kot bi tebi dala tvoja poteza. Pri gradnji lestve je obratno: po tvoji potezi prvi igra drugi igralec, zato ena njegova figura na enem koncu uporabi tvojo lestev prej kot ti. Na najtežji ravni računalnik pogleda najboljši odgovor vsakega nasprotnika, preden izbere potezo.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Nadaljuj</h2>
      <ul>
        <li><a href="/play/">Igraj proti računalniku v brskalniku</a> in poskusi lestev.</li>
        <li><a href="/sl/vodniki/kitajske-dame-za-dva">Kitajske dame za 2 igralca</a>: kako deluje igra v dvoje.</li>
        <li><a href="/sl/pravila/kitajske-dame">Pravila kitajskih dam</a>, s slikami korakov, skokov in verig.</li>
      </ul>
      <p><a href="/sl/vodniki/kitajske-dame-na-spletu-s-prijatelji">Kitajske dame na spletu s prijatelji</a></p>
      <p><a href="/sl/vodniki/halma-ali-kitajske-dame">Halma ali kitajske dame</a></p>
      <p><a href="/sl/vodniki/kitajske-dame-za-tri">Kitajske dame za 3 igralce</a></p>
    </section>`;

export default {
  nav: "Strategija v kitajskih damah",
  titel: "Strategija v kitajskih damah: 6 nasvetov | Leapstone",
  beschrijving: "Strategija v kitajskih damah: postavljaj lestve, drži figure skupaj, izkoristi sredino, cilj polni od zadaj in vedi, kdaj blokirati skok.",
  h1: "Strategija v kitajskih damah",
  intro: "Šest nasvetov za zvezdasto ploščo, vsak s sliko iz pravih pravil: lestve, zaostale figure, sredina, polnjenje cilja in blokiranje skokov.",
  inhoud,
};
