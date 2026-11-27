// Vodnik po kitajskih damah za 3 igralce (taak 299), v slovenščini. Vsebina: ../en/chinese-checkers-3-players.mjs, poved za povedjo.
// Pravila so preverjena v angleški datoteki proti crates/halma-core; kaj prikazuje aplikacija, je iz web/src/Startmenu.svelte.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako se igra začne</h2>
      <p>Vsak igralec ima 10 figur, zato na plošči s 121 polji stoji 30 figur. Začnejo v vsaki drugi konici zvezde: rdeči spodaj, modri zgoraj levo in zeleni zgoraj desno. Tri konice vmes so prazne.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici, 10 modrimi figurami v zgornji levi konici in 10 zelenimi figurami v zgornji desni konici",
  tekst: "Rdeči spodaj, modri zgoraj levo, zeleni zgoraj desno.",
})}
      <p>Igralec 1, rdeči, igra prvi. Potem je modri igralec 2, zeleni je igralec 3 in za zelenim je spet na vrsti rdeči. Poteza je en korak ali veriga skokov z eno figuro. Za korake in skoke glej <a href="/sl/pravila/kitajske-dame">pravila kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Trije cilji, vsi na začetku prazni</h2>
      <p>Tvoj cilj je konica nasproti tiste, kjer si začel, in s 3 igralci je na začetku prazna. To je prazna konica med začetkoma drugih dveh igralcev: cilj rdečega je zgoraj, cilj modrega spodaj desno, cilj zelenega pa spodaj levo.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Zvezdasta plošča za tri igralce. Črtkani krogi v barvi vsakega igralca označujejo tri prazne cilje: rdeči zgoraj, modri spodaj desno, zeleni spodaj levo.",
  tekst: "Vsak cilj ima barvo svojega igralca.",
})}
      <p>Zmagaš, če vseh svojih 10 figur premakneš v svoj cilj. Vseh 10 polj mora biti zasedenih z lastnimi figurami. Nihče ne začne v tvojem cilju, vendar se lahko ustaviš na vsakem praznem polju, zato lahko tam pozneje pristane figura drugega igralca. Dokler tam stoji, ne moreš končati.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Zmaga in kaj sledi</h2>
      <ul>
        <li><strong>Zmaga:</strong> prvi igralec, ki napolni cilj, zmaga. Igra se tam ne konča: druga dva igrata naprej za naslednja mesta, igralec, ki je končal, pa se preskoči. Igre je konec, ko igra samo še en igralec.</li>
        <li><strong>Odstop:</strong> tvoje figure zapustijo ploščo in druga dva igrata naprej. Če odstopi še drugi igralec, preden je kdo končal, zmaga zadnji preostali igralec.</li>
        <li><strong>Čas (na spletu):</strong> v spletni igri ima vsaka poteza časovno omejitev, ki jo določi igralec, ki igro začne. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš, igra pa se nadaljuje brez tebe.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Kako se razlikuje od igre za 2</h2>
      <ul>
        <li><strong>Več figur:</strong> 30 na plošči, proti 20 pri 2 igralcih.</li>
        <li><strong>Prazni cilji:</strong> pri 2 igralcih je tvoj cilj na začetku poln figur drugega igralca. Pri 3 je na začetku prazen.</li>
        <li><strong>Dva nasprotnika:</strong> po tvoji potezi se premakneta dva druga igralca, preden si spet na vrsti. Figure obeh so stopnice zate, tvoje pa zanju. Lestev, ki jo zgradiš, lahko uporabita oba, prvi pa jo lahko izkoristi igralec za tabo.</li>
        <li><strong>Igra se nadaljuje:</strong> pri 2 igralcih se igra konča, ko eden od vaju konča. Pri 3 se nadaljuje za drugo in tretje mesto.</li>
      </ul>
      <p>Za igro v dvoje preberi <a href="/sl/vodniki/kitajske-dame-za-dva">kitajske dame za 2 igralca</a>. <a href="/sl/vodniki/kitajske-dame-strategija">Nasveti o strategiji</a> govorijo o korakih in skokih, ki so s 3 igralci enaki.</p>
      <p><a href="/sl/vodniki/kitajske-dame-na-spletu-s-prijatelji">Kitajske dame na spletu s prijatelji</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kje igrati s 3 igralci v Leapstone</h2>
      <ul>
        <li><strong>Proti računalniku, takoj:</strong> odpri <a href="/play/">Leapstone v brskalniku</a>, dotakni se Računalnik, izberi zvezdasto ploščo in 2 računalnika. Ti si igralec 1, zato igraš prvi. Za računalnika izbereš Lahko, Običajno ali Težko.</li>
        <li><strong>Na enem telefonu:</strong> dotakni se „Na tem telefonu“, izberi zvezdasto ploščo in 3 igralce, nato se dotakni figure, da to mesto preklopiš med človekom in računalnikom.</li>
        <li><strong>Na spletu s prijatelji:</strong> dotakni se Prijatelji, izberi zvezdasto ploščo, 3 igralce in čas na potezo ter pošlji povabilo s povezavo. Igra se začne, ko so zasedena vsa 3 mesta.</li>
        <li><strong>Hitre igre:</strong> Igraj na spletu najde igre za 2 ali 4 igralce, zato hitre igre za 3 ni.</li>
      </ul>
    </section>`;

export default {
  nav: "Kitajske dame za 3 igralce",
  titel: "Kitajske dame za 3 igralce: pravila | Leapstone",
  beschrijving: "Kako delujejo kitajske dame s 3 igralci: kje začne 30 figur, kateri prazen cilj je čigav, kdo igra prvi in kako zmagaš.",
  h1: "Kitajske dame za 3 igralce",
  intro: "Kako deluje igra za tri na zvezdasti plošči: začetek, trije cilji, kdo igra prvi, kako zmagaš in kje lahko igraš.",
  inhoud,
};
