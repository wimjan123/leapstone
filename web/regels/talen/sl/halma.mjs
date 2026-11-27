// Stran s pravili Halme (taak 134), v slovenščini. Vsebina: ../en/halma.mjs, poved za povedjo
// (preverjeno s crates/halma-core, glej docs/plan.md, taak 117). Vsako pravilo tukaj se mora ujemati z angleško stranjo.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 igralca: po 19 figur",
    alt: "Kvadratna plošča z 19 rdečimi figurami v zgornjem levem kotu in 19 modrimi figurami v spodnjem desnem kotu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 igralci: po 13 figur",
    alt: "Kvadratna plošča s 13 figurami v vsakem od štirih kotov: rdeče zgoraj levo, modre zgoraj desno, zelene spodaj desno in rumene spodaj levo",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Plošča</h2>
      <p>Halma se igra na kvadratni plošči s 16 krat 16 polji, skupaj 256. Vsako polje ima do osem sosedov: štiri v ravni črti in štiri diagonalne. Polje na robu jih ima manj, kot pa jih ima tri.</p>
      <p>To je kvadratna plošča v Leapstone. Če poznaš igro na zvezdasti plošči, preberi o <a href="/sl/pravila/sternhalma">Sternhalmi</a> in o <a href="/sl/pravila/kitajske-dame">pravilih kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kako se figure začnejo</h2>
      <p>Halma je za 2 ali 4 igralce. Vsak igralec začne s figurami v taboru v enem od kotov plošče. Tabor v nasprotnem kotu je tvoj cilj.</p>
      <ul>
        <li><strong>2 igralca:</strong> po 19 figur, v dveh kotih, ki sta si nasproti. Tabor ima pet vrst s 5, 5, 4, 3 in 2 polji.</li>
        <li><strong>4 igralci:</strong> po 13 figur, en tabor v vsakem kotu. Tabor ima štiri vrste s 4, 4, 3 in 2 poljema. Tvoj cilj je kot na drugi strani plošče, diagonalno.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Menjavanje potez</h2>
      <p>Igralec 1 igra prvi. Nato gredo poteze po vrsti, po zadnjem igralcu pa je spet na vrsti igralec 1. V Leapstone barve ustrezajo številkam: rdeča, modra, zelena in rumena.</p>
      <p>Ko si na vrsti, premakneš eno figuro, enkrat. Nič se ne zajame: figure ostanejo na plošči, dokler igralec ne odstopi.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Korak</h2>
      <p>Premakni figuro na prosto polje poleg nje, v katero koli od osmih smeri: naravnost ali diagonalno.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Rdeča figura z belim obročem okoli. Pet od njenih osmih sosedov je prostih in označenih; na drugih treh so figure.",
  tekst: "Rdeča figura lahko stopi na pet označenih polj. Drugi trije sosedje so zasedeni.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskoči eno figuro poleg svoje, katere koli barve, in pristani na prostem polju tik za njo, v ravni črti. Skačeš lahko v vseh osmih smereh, tudi diagonalno in nazaj.</p>
      <ul>
        <li>Polje, na katerem pristaneš, mora biti prosto.</li>
        <li>Ne moreš preskočiti dveh figur zapored ali praznega polja.</li>
        <li>Figura, ki jo preskočiš, ostane tam, kjer je.</li>
        <li>Ne moreš skočiti čez rob plošče.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Rdeča figura diagonalno preskoči modro figuro na prosto polje za njo, prikazano s puščico.",
  tekst: "Rdeča figura diagonalno preskoči modro figuro.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Veriga skokov</h2>
      <p>Po skoku lahko ista figura skoči znova, tolikokrat, kolikor zmore, v katero koli smer, naravnost ali diagonalno. Sam se odločiš, kje se ustaviš. Vsi skoki skupaj so ena poteza.</p>
      <ul>
        <li>V eni potezi ne moreš dvakrat pristati na istem polju.</li>
        <li>Poteza je en korak ali en skok ali več skokov. Po skoku ne moreš narediti koraka.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Rdeča figura v eni potezi naredi tri skoke: diagonalno čez modro figuro, naravnost čez drugo modro figuro in diagonalno čez rdečo figuro. Tri polja pristanka so oštevilčena 1, 2 in 3.",
  tekst: "Ena poteza s tremi skoki, po vrstnem redu številk.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cilj</h2>
      <p>Zmagaš, če vse svoje figure premakneš v tabor nasproti tistega, v katerem si začel. Vsa polja tega tabora morajo imeti tvoje figure: 19 pri 2 igralcih, 13 pri 4 igralcih. Dokler je tam figura drugega igralca, ne moreš končati.</p>
      <p>Pristaneš lahko na katerem koli prostem polju, tudi v taborih drugih igralcev. Figura, ki je v tvojem cilju, lahko spet odide; nič je ne zaklene.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Kvadratna plošča za dva igralca. Rdeči začne zgoraj levo; tabor spodaj desno, označen s črtkanimi krogi in z modrimi figurami, je cilj rdečega.",
  tekst: "Pri 2 igralcih je cilj rdečega tabor, kjer začne modri.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pri 2 ali 4 igralcih</h2>
      <ul>
        <li><strong>2 igralca:</strong> prvi igralec, ki napolni cilj, zmaga, in igre je konec.</li>
        <li><strong>4 igralci:</strong> prvi igralec, ki napolni cilj, zmaga. Drugi igrajo naprej za naslednja mesta, igralec, ki je končal, pa se preskoči. Igre je konec, ko igra samo še en igralec.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Odstop</h2>
      <p>Ko odstopiš, tvoje figure zapustijo ploščo, zato nikomur ne zapirajo poti. Pri 2 igralcih zmaga drugi igralec. Pri 4 igralcih se igra nadaljuje brez tebe, in če odstopijo vsi razen enega, zmaga zadnji igralec.</p>
      <p>V spletni igri ima vsaka poteza časovno omejitev. Določi jo igralec, ki začne igro. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš. Igre proti računalniku in na enem telefonu nimajo časovne omejitve.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Nasveti</h2>
      <ul class="tips">
        <li><strong>Postavljaj lestve.</strong> Figure postavi v vrsto s po enim prostim poljem vmes, naravnost ali diagonalno, v smeri svojega cilja. Ena figura lahko nato v eni potezi skoči po vsej vrsti.</li>
        <li><strong>Vsaka figura je lestev.</strong> Preskočiš lahko vsako barvo, zato ti pomagajo tudi figure drugih igralcev. In tvoje lestve pomagajo njim: poglej, kaj pustiš za seboj.</li>
        <li><strong>Uporabljaj diagonale.</strong> Cilj je v nasprotnem kotu, zato je diagonalna vrsta figur najhitrejša pot čez ploščo.</li>
        <li><strong>Ne pozabi zaostalih figur.</strong> Vse svoje figure potrebuješ doma. Figura daleč zadaj, brez ničesar za preskočiti, se premika po eno polje na potezo. Pripelji jo s seboj, dokler so druge figure še okoli nje.</li>
        <li><strong>Tvoj začetek je njihov cilj.</strong> Pri 2 igralcih je tvoj tabor cilj drugega igralca, on pa ne more končati, dokler je tam še ena tvoja figura. Leapstone ti dovoli, da figuro obdržiš doma, tako lahko blokiraš. Enako velja zate.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Vprašanja</h2>
      <h3>Koliko ljudi lahko igra Halmo?</h3>
      <p>Dva ali štirje. Halma se igra na kvadratni plošči s 16 krat 16 polji, vsak igralec pa začne v kotu.</p>
      <h3>Koliko figur ima vsak igralec v Halmi?</h3>
      <p>Po 19 figur pri 2 igralcih in po 13 figur pri 4 igralcih.</p>
      <h3>Kdo je izumil Halmo?</h3>
      <p>George Howard Monks, ameriški kirurg, leta 1883 ali 1884. Ime je grško za &bdquo;skok&ldquo;. Več preberi v članku <a href="/sl/pravila/sternhalma">Sternhalma</a>.</p>
      <h3>Kakšna je razlika med Halmo in kitajskimi damami?</h3>
      <p>Halma ima kvadratno ploščo, s koraki in skoki v osmih smereh ter po 19 ali 13 figur. Kitajske dame imajo zvezdasto ploščo, s šestimi smermi in po 10 figur, za 2, 3, 4 ali 6 igralcev.</p>
      <h3>Ali lahko Halmo igraš na spletu brezplačno?</h3>
      <p>Da, v Leapstone, v brskalniku ali v aplikaciji iz trgovine App Store. Izberi način igranja, na primer proti računalniku ali na spletu s prijatelji, nato pa Kvadratna plošča. Leapstone je brezplačen, brez oglasov.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Igraj</h2>
      <p>Gumb Igraj zdaj odpre igro proti računalniku na <a href="/sl/pravila/kitajske-dame">zvezdasti plošči</a>. Če želiš igrati Halmo, se dotakni puščice nazaj zgoraj, nato izberi Igraj na tem telefonu, Igraj proti računalniku ali Igraj na spletu s prijatelji, in se dotakni Kvadratna plošča.</p>
    </section>`;

export default {
  nav: "Pravila Halme",
  titel: "Pravila Halme in nasveti | Leapstone",
  beschrijving: "Kako igrati Halmo na kvadratni plošči 16 krat 16: začetek, koraki, skoki, verige skokov, kako zmagati in nasveti. Igraj brezplačno v brskalniku.",
  h1: "Pravila Halme",
  intro: "Vse svoje figure premakni čez kvadratno ploščo do nasprotnega kota, preden to storijo drugi. Pravila na kratko, s slikami, in nekaj nasvetov.",
  inhoud,
};
