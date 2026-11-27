// Vodnik po kitajskih damah za 6 igralcev (taak 302, feature 294), v slovenščini: /sl/vodniki/kitajske-dame-za-sest.
// Vsebina: ../en/chinese-checkers-6-players.mjs, poved za povedjo. Pravila iz crates/halma-core, glej docs/plan.md, taak 302.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako se igra začne</h2>
      <p>Vsak igralec ima 10 figur in vseh 6 konic zvezde je v uporabi. Na plošči s 121 polji tako stoji 60 figur. 61 polj v sredini je na začetku praznih.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z 10 figurami v vsaki od 6 konic, v 6 barvah",
  tekst: "6 igralcev, 6 konic, 60 figur.",
})}
      <p>Igralec 1, rdeči, igra prvi, iz spodnje konice. Poteza nato gre od igralca 1 do igralca 6, po igralcu 6 pa je spet na vrsti igralec 1. Igralci so oštevilčeni po vrstnem redu svojih konic okoli zvezde, zato igralec za teboj vedno začne v konici ob tvoji. Poteza je en korak ali veriga skokov z eno figuro. Za korake in skoke glej <a href="/sl/pravila/kitajske-dame">pravila kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Vsak cilj je na začetku poln</h2>
      <p>Zmagaš, če vseh svojih 10 figur premakneš v konico na drugi strani plošče. Pri 6 igralcih je to konica, kjer začne igralec nasproti tebe, zato noben cilj ni prazen: vsak se začne poln figur drugega igralca. Za rdečega je cilj zgornja konica, kjer začne igralec 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Zvezdasta plošča s 6 polnimi konicami. Prekinjen krog označuje zgornjo konico, cilj rdečega igralca, v kateri so figure igralca nasproti.",
  tekst: "Cilj rdečega je konica nasproti, polna figur igralca 4.",
})}
      <p>Pristaneš lahko samo na prostem polju, zato mora igralec nasproti zapustiti svojo konico, preden jo napolniš, ti pa moraš zapustiti svojo, preden jo napolni on. Pri igri za 2 je s tem vse. Pri 6 se morata oba igralca poleg tega prebiti še skozi gnečo 4 drugih.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Natrpana sredina</h2>
      <p>Vsak cilj je na drugi strani plošče, konice pa se med seboj povezujejo samo prek sredine, zato mora vseh 60 figur prečkati istih 61 polj. Na začetku še nihče ni prečkal in sredina se hitro polni.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Rdeča figura v eni potezi trikrat skoči: čez modro figuro, nato čez zeleno in nato čez vijolično. Številke 1, 2 in 3 označujejo polja pristanka.",
  tekst: "Figure vseh barv so stopnice.",
})}
      <p>Preskočiš lahko figuro katere koli barve. Figure 5 drugih igralcev so stopnice zate, tvoje pa so stopnice za vseh 5. Vrsta figur, ki jo pustiš v sredini, je lestev za vsakogar, ki jo lahko doseže, in igralec za teboj je prvi na vrsti.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokiranje s 5 nasprotniki</h2>
      <ul>
        <li><strong>Zapolni polje pristanka:</strong> skok potrebuje prosto polje takoj za figuro. Ko tja premakneš figuro, skoka ni več za vse igralce, ki so ga hoteli.</li>
        <li><strong>Pazi na lestve, ki jih postaviš:</strong> po tvoji potezi igra še drugih 5 igralcev, preden si spet na vrsti. Lestev pomaga vsem.</li>
        <li><strong>Cilj lahko blokira vsak:</strong> figura katerega koli drugega igralca v tvojem cilju ti prepreči, da bi končal, ne samo figura igralca nasproti. Vseh 10 polj cilja mora vsebovati tvoje lastne figure.</li>
      </ul>
      <p>V <a href="/sl/vodniki/kitajske-dame-strategija">nasvetih o strategiji</a> je prikazano, kako izgleda blokiran skok in kako ne zapreti figure drugega igralca v svojem cilju.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Kako dolgo traja igra</h2>
      <p>Igra za 6 ima 60 figur za premik, med tvojo potezo in naslednjo pa vsak od drugih 5 igralcev odigra eno. Prav tako se ne konča, ko prvi igralec konča.</p>
      <ul>
        <li><strong>Zmagaj in igraj naprej:</strong> prvi igralec, ki napolni cilj, zmaga, drugi pa igrajo naprej za naslednja mesta. Igralec, ki je končal, se preskoči, njegove figure pa ostanejo na plošči kot stopnice. Igre je konec, ko igra samo še en igralec.</li>
        <li><strong>Odstop:</strong> tvoje figure zapustijo ploščo, zato nikomur več ne ovirajo poti in ne pomagajo, drugi pa igrajo naprej.</li>
        <li><strong>Čas (na spletu):</strong> v spletni igri ima vsaka poteza časovno omejitev, ki jo določi igralec, ki igro začne: 15 sekund, 30 sekund, 1 minuta, 2 minuti ali brez omejitve. Krog 6 potez traja največ 6-krat toliko kot omejitev, torej pri 30 sekundah največ 3 minute. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš in igra poteka naprej brez tebe.</li>
      </ul>
      <p>O igri z manj igralci preberi <a href="/sl/vodniki/kitajske-dame-za-dva">Kitajske dame za 2 igralca</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kje igrati s 6 igralci v Leapstone</h2>
      <ul>
        <li><strong>Proti računalnikom, takoj:</strong> odpri <a href="/play/">Leapstone v brskalniku</a>, dotakni se Računalnik, izberi zvezdasto ploščo in 5 računalnikov. Ti si igralec 1, zato igraš prvi. Računalniki igrajo drug za drugim, vsak s kratkim premorom, tako da lahko spremljaš vsako potezo. Za računalnike izbereš Lahko, Običajno ali Težko.</li>
        <li><strong>Na enem telefonu:</strong> dotakni se Igraj, izberi zvezdasto ploščo in 6 igralcev, nato se dotakni figure, da to mesto preklopiš med osebo in računalnikom.</li>
        <li><strong>Na spletu s prijatelji:</strong> dotakni se Prijatelji, izberi zvezdasto ploščo, 6 igralcev in čas na potezo ter pošlji povabilo s povezavo. Igra se začne, ko je zasedenih vseh 6 mest.</li>
        <li><strong>Hitre igre:</strong> Igraj na spletu najde igre za 2 ali 4 igralce, zato hitre igre za 6 ni.</li>
      </ul>
    </section>`;

export default {
  nav: "Kitajske dame za 6 igralcev",
  titel: "Kitajske dame za 6 igralcev: cela plošča | Leapstone",
  beschrijving: "Kako delujejo kitajske dame s 6 igralci: polna zvezda s 60 figurami, natrpana sredina, blokiranje, kako dolgo traja igra in kje jo igrati.",
  h1: "Kitajske dame za 6 igralcev",
  intro: "Kako deluje igra za 6: vseh 6 konic je polnih, tekmuješ do konice na drugi strani plošče, igra pa se nadaljuje, ko prvi igralec konča.",
  inhoud,
};
