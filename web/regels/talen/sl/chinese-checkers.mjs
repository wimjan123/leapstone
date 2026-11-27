// Stran s pravili kitajskih dam (taak 134), v slovenščini. Vsebina: ../en/chinese-checkers.mjs, poved za povedjo
// (preverjeno s crates/halma-core, glej docs/plan.md, taak 116). Vsako pravilo tukaj se mora ujemati z angleško stranjo.
// Iste slike (brez jezika: v SVG so le številke); nadomestna besedila in podnapisi so v slovenščini.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: { 2: "2 igralca", 3: "3 igralci", 4: "4 igralci", 6: "6 igralcev" }[n],
      alt:
        {
          2: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici in 10 modrimi figurami v zgornji konici",
          3: "Zvezdasta plošča z rdečimi figurami spodaj, modrimi zgoraj levo in zelenimi zgoraj desno",
          4: "Zvezdasta plošča s figurami v štirih konicah: rdeče spodaj, zelene zgoraj, modre spodaj levo in rumene zgoraj desno",
          6: "Zvezdasta plošča s figurami v vseh šestih konicah, v šestih barvah",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Plošča</h2>
      <p>Kitajske dame se igrajo na zvezdi s šestimi konicami. Plošča ima 121 polj, v vsaki konici jih je 10. Znotraj plošče ima vsako polje šest sosedov.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kako se figure začnejo</h2>
      <p>Vsak igralec ima 10 figur in z vsemi začne v eni konici zvezde. Nasprotna konica je tvoj cilj.</p>
      <ul>
        <li><strong>2 igralca:</strong> dve konici, ki sta si nasproti.</li>
        <li><strong>3 igralci:</strong> vsaka druga konica. Vsi trije cilji so na začetku prazni.</li>
        <li><strong>4 igralci:</strong> dva para konic, ki sta ena ob drugi. Vsak igralec ima nasproti drugega igralca.</li>
        <li><strong>6 igralcev:</strong> vseh šest konic.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Menjavanje potez</h2>
      <p>Igralec 1 igra prvi. Nato gredo poteze po vrsti, igralec 2, igralec 3 in tako naprej, po zadnjem igralcu pa je spet na vrsti igralec 1. V Leapstone barve ustrezajo številkam: rdeča, modra, zelena, rumena, vijolična in srebrna.</p>
      <p>Ko si na vrsti, premakneš eno figuro, enkrat. Nič se ne zajame: figure ostanejo na plošči, dokler igralec ne odstopi.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Korak</h2>
      <p>Premakni figuro na prosto polje poleg nje.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Rdeča figura z belim obročem okoli. Trije od njenih šestih sosedov so prosti in označeni; na drugih treh so figure.",
  tekst: "Rdeča figura lahko stopi na tri označena polja. Drugi trije sosedje so zasedeni.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskoči eno figuro poleg svoje, katere koli barve, in pristani na prostem polju tik za njo, v ravni črti. Skačeš lahko v vseh šestih smereh, tudi nazaj.</p>
      <ul>
        <li>Polje, na katerem pristaneš, mora biti prosto.</li>
        <li>Ne moreš preskočiti dveh figur zapored ali praznega polja.</li>
        <li>Figura, ki jo preskočiš, ostane tam, kjer je.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Rdeča figura preskoči modro figuro na prosto polje za njo, prikazano s puščico.",
  tekst: "Rdeča figura preskoči modro figuro.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Veriga skokov</h2>
      <p>Po skoku lahko ista figura skoči znova, tolikokrat, kolikor zmore, in v katero koli smer. Sam se odločiš, kje se ustaviš. Vsi skoki skupaj so ena poteza.</p>
      <ul>
        <li>V eni potezi ne moreš dvakrat pristati na istem polju.</li>
        <li>Poteza je en korak ali en skok ali več skokov. Po skoku ne moreš narediti koraka.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Rdeča figura v eni potezi naredi tri skoke, čez modro, zeleno in še eno modro figuro. Tri polja pristanka so oštevilčena 1, 2 in 3.",
  tekst: "Ena poteza s tremi skoki, po vrstnem redu številk.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cilj</h2>
      <p>Zmagaš, če vseh svojih 10 figur premakneš v konico nasproti tiste, v kateri si začel. Vseh 10 polj te konice mora imeti tvoje figure. Dokler je tam figura drugega igralca, ne moreš končati.</p>
      <p>Pristaneš lahko na katerem koli prostem polju, tudi v konicah drugih igralcev.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Zvezdasta plošča za tri igralce. Rdeči začne spodaj; prazna konica zgoraj, označena s črtkanimi krogi, je cilj rdečega.",
  tekst: "Pri 3 igralcih rdeči začne spodaj. Cilj rdečega je prazna konica zgoraj.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pri 2, 3, 4 ali 6 igralcih</h2>
      <ul>
        <li><strong>2 igralca:</strong> prvi igralec, ki napolni cilj, zmaga, in igre je konec.</li>
        <li><strong>3, 4 ali 6 igralcev:</strong> prvi igralec, ki napolni cilj, zmaga. Drugi igrajo naprej za naslednja mesta, igralec, ki je končal, pa se preskoči. Igre je konec, ko igra samo še en igralec.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Odstop</h2>
      <p>Ko odstopiš, tvoje figure zapustijo ploščo, zato nikomur ne zapirajo poti. Pri 2 igralcih zmaga drugi igralec. Pri več igralcih se igra nadaljuje brez tebe, in če odstopijo vsi razen enega, zmaga zadnji igralec.</p>
      <p>V spletni igri ima vsaka poteza časovno omejitev. Določi jo igralec, ki začne igro, v hitri igri pa je 30 sekund. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš. Igre proti računalniku in na enem telefonu nimajo časovne omejitve.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Nasveti</h2>
      <ul class="tips">
        <li><strong>Postavljaj lestve.</strong> Figure postavi v vrsto s po enim prostim poljem vmes, v smeri svojega cilja. Ena figura lahko nato v eni potezi skoči po vsej vrsti.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Štiri figure v diagonalni vrsti s po enim prostim poljem vmes. Rdeča figura na enem koncu preskoči vse štiri, s štirimi oštevilčenimi polji pristanka.",
  tekst: "Štiri figure v vrsti: rdeča figura zgoraj v eni potezi prečka ploščo, s štirimi skoki.",
})}
        </li>
        <li><strong>Vsaka figura je lestev.</strong> Preskočiš lahko vsako barvo, zato ti pomagajo tudi figure drugih igralcev. In tvoje lestve pomagajo njim: poglej, kaj pustiš za seboj.</li>
        <li><strong>Ne pozabi zaostalih figur.</strong> Vseh 10 figur potrebuješ doma. Figura daleč zadaj, brez ničesar za preskočiti, se premika po eno polje na potezo. Pripelji jo s seboj, dokler so druge figure še okoli nje.</li>
        <li><strong>Tvoj začetek je njihov cilj.</strong> Pri 2, 4 ali 6 igralcih je tvoja začetna konica cilj igralca nasproti, on pa ne more končati, dokler je tam še ena tvoja figura. Enako velja zate.</li>
      </ul>
      <p>Več nasvetov s slikami je v vodniku o <a href="/sl/vodniki/kitajske-dame-strategija">strategiji v kitajskih damah</a>. Za igro v dvoje preberi <a href="/sl/vodniki/kitajske-dame-za-dva">kitajske dame za 2 igralca</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Vprašanja</h2>
      <h3>Koliko ljudi lahko igra kitajske dame?</h3>
      <p>Dva, trije, štirje ali šest. Vsak igralec začne v eni konici zvezde. Pri 2, 3 ali 4 igralcih nekaj konic ostane praznih.</p>
      <h3>Koliko frnikol ima vsak igralec?</h3>
      <p>Vsak igralec ima 10 frnikol, torej figur. Plošča ima 121 polj: po 10 v vsaki od šestih konic in 61 v sredini.</p>
      <h3>Ali lahko skačeš čez svoje figure ali nazaj?</h3>
      <p>Da. Preskočiš lahko figuro katere koli barve, tudi svojo, v vseh šestih smereh, tudi nazaj. Figura, ki jo preskočiš, ostane tam, kjer je.</p>
      <h3>Ali se v kitajskih damah figure zajemajo?</h3>
      <p>Ne. Nič se ne zajame. Figura zapusti ploščo samo, ko njen igralec odstopi.</p>
      <h3>Ali so kitajske dame s Kitajske?</h3>
      <p>Ne. Igra se je leta 1892 pojavila v Nemčiji kot Stern-Halma, po starejši igri Halma. Ime kitajske dame prihaja iz Združenih držav, iz leta 1928. Več preberi v članku <a href="/sl/pravila/sternhalma">Sternhalma</a>.</p>
      <h3>Kje lahko brezplačno igraš kitajske dame na spletu s prijatelji?</h3>
      <p>V Leapstone, v brskalniku ali v aplikaciji iz trgovine App Store. Prijatelju pošlji povezavo z vabilom: v igro se pridruži brez računa, e-poštnega naslova ali gesla. Igraš lahko tudi proti računalniku ali hitro igro proti drugemu igralcu. Leapstone je brezplačen, brez oglasov.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Igraj kitajske dame v Leapstone</h2>
      <p>Leapstone je brezplačna aplikacija za kitajske dame in Halmo, s 3D ploščo iz rdečega laka in zlata. Igraš lahko v aplikaciji in v brskalniku.</p>
      <ul>
        <li><strong>Proti računalniku.</strong> Lahko, običajno ali težko. Interneta ne potrebuješ.</li>
        <li><strong>S prijatelji.</strong> Pošlji povezavo z vabilom. Ti določiš čas za potezo, pogovarjate pa se lahko v klepetu.</li>
        <li><strong>Na spletu.</strong> Hitra igra proti drugemu igralcu tvoje ravni, 30 sekund za potezo. Nekateri nasprotniki na spletu so lahko računalniški igralci.</li>
        <li><strong>Na enem telefonu.</strong> Podajajte telefon okoli mize.</li>
      </ul>
      <p>Leapstone je brezplačen, brez oglasov in brez prijave z e-poštnim naslovom: izbereš samo ime igralca. <a href="https://apps.apple.com/si/app/id6831230722">Prenesi iz trgovine App Store</a> ali <a href="/play/">Igraj v brskalniku</a>.</p>
    </section>`;

export default {
  nav: "Pravila kitajskih dam",
  titel: "Pravila kitajskih dam in nasveti | Leapstone",
  beschrijving: "Kako igrati kitajske dame: začetek, koraki, skoki in verige skokov, kako zmagati pri 2, 3, 4 ali 6 igralcih, in nasveti. Igraj brezplačno v brskalniku.",
  h1: "Pravila kitajskih dam",
  intro: "Vseh svojih 10 figur premakni čez zvezdasto ploščo do nasprotne konice, preden to storita drugi. Pravila na kratko, s slikami, in nekaj nasvetov.",
  inhoud,
};
