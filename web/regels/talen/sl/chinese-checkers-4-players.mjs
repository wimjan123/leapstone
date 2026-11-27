// Vodnik Kitajske dame za 4 igralce (taak 301), v slovenščini. Vsebina: ../en/chinese-checkers-4-players.mjs, poved za povedjo.
// Pravila in kaj prikazuje aplikacija: glej bronverwijzingen v angleški datoteki.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako je plošča razdeljena</h2>
      <p>Vsak igralec ima 10 figur, zato na plošči s 121 polji stoji 40 figur. Štiri začetne konice so dva para konic, ki sta si ena ob drugi: rdeči spodaj in modri spodaj levo, zeleni zgoraj in rumeni zgoraj desno.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici, 10 modrimi figurami v konici spodaj levo, 10 zelenimi figurami v zgornji konici in 10 rumenimi figurami v konici zgoraj desno. Konici zgoraj levo in spodaj desno sta prazni.",
  tekst: "Rdeči spodaj, modri spodaj levo, zeleni zgoraj, rumeni zgoraj desno.",
})}
      <p>Igralec 1, rdeči, igra prvi. Potem je modri igralec 2, zeleni igralec 3, rumeni igralec 4, za rumenim pa je spet na vrsti rdeči. Poteza je en korak ali veriga skokov z eno figuro. Za korake in skoke glej <a href="/sl/pravila/kitajske-dame">pravila kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kdo je komu nasproti</h2>
      <p>Konice so na plošči razporejene v pare: rdeči je nasproti zelenemu, modri pa nasproti rumenemu. Tvoj cilj je konica nasproti tebe. Rdeči gre tja, kjer začne zeleni, zeleni tja, kjer začne rdeči, modri tja, kjer začne rumeni, rumeni pa tja, kjer začne modri.</p>
      <p>Kot pri igri za 2 je vsak cilj na začetku poln figur igralca, ki je nasproti tebe, zato lahko tam pristaneš šele, ko so odšle. Pri 3 igralcih so cilji na začetku prazni, zato pri 4 nihče ne more končati takoj. Štirje cilji so štiri različne konice, zato tvojega cilja ne želi nihče drug: igralec, ki je končal, nikoli nikogar ne ovira.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dve prazni konici</h2>
      <p>Konici zgoraj levo in spodaj desno nimata figur. Nista nikogaršnji začetek in nikogaršnji cilj. Konica zgoraj levo leži med modrim in zelenim, konica spodaj desno pa med rumenim in rdečim.</p>
      <p>Na vsako prosto polje lahko stopiš ali skočiš, zato lahko ti konici prečkaš ali se v njiju ustaviš. Figura tam pa še ni v cilju. V prazni konici ni ničesar za preskok, dokler tja kdo ne pripelje figur.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Kaj se spremeni v taktiki</h2>
      <ul>
        <li><strong>Dve prečkanji hkrati:</strong> rdeči in zeleni prečkata ploščo drug proti drugemu, prav tako modri in rumeni. Obe črti tečeta čez sredino, zato je sredina bolj zasedena kot pri igri za 2, kjer prečka samo ena črta.</li>
        <li><strong>Med tvojima potezama igrajo trije igralci:</strong> plošča se med dvema tvojima potezama spremeni bolj kot pri igri za 2. Na začetku vsake poteze jo poglej znova in šele takrat načrtuj verigo skokov. Igralec, ki igra za tabo, nikoli ni tisti nasproti tebe.</li>
        <li><strong>Figure pomagajo vsem:</strong> vsaka figura ostalih treh je stopnica zate, tvoje pa so stopnice zanje. Figure igralca nasproti tebe se premikajo v nasprotni smeri, kot pri igri za 2.</li>
        <li><strong>Prostor za obhod:</strong> če je sredina polna, sta prazni konici odprt prostor ob taborih. Pot skozi eno od njiju je lahko pot mimo gneče.</li>
        <li><strong>Igralec, ki odstopi, sprosti tvoj cilj:</strong> ko igralec nasproti tebe odstopi, njegove figure zapustijo ploščo, zato je tvoj cilj takoj prazen.</li>
      </ul>
      <p><a href="/sl/vodniki/kitajske-dame-strategija">Nasveti o strategiji</a> o lestvah, zaostalih figurah in polnjenju cilja od zadaj veljajo enako s 4 igralci.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Zmaga in kaj sledi</h2>
      <ul>
        <li><strong>Zmaga:</strong> prvi igralec, ki napolni cilj z vsemi 10 figurami, zmaga. Igre s tem ni konec: ostali trije igrajo naprej za naslednja mesta, igralec, ki je končal, pa se preskoči. Njegove figure ostanejo na plošči. Igre je konec, ko igra samo še en igralec.</li>
        <li><strong>Odstop:</strong> tvoje figure zapustijo ploščo in ostali trije igrajo naprej. Če odstopijo tudi drugi, zmaga zadnji preostali igralec.</li>
        <li><strong>Čas (na spletu):</strong> v spletni igri ima vsaka poteza časovno omejitev. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš in igra se nadaljuje brez tebe.</li>
      </ul>
      <p>Za igre z manj igralci preberi <a href="/sl/vodniki/kitajske-dame-za-dva">Kitajske dame za 2 igralca</a>. <a href="/sl/pravila/kitajske-dame">Stran s pravili</a> ima slike vsakega začetka.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kje igrati s 4 igralci v Leapstone</h2>
      <ul>
        <li><strong>Proti računalniku, takoj:</strong> odpri <a href="/play/">Leapstone v brskalniku</a>, dotakni se Računalnik, izberi zvezdasto ploščo in 3 računalnike. Ti si igralec 1, zato igraš prvi. Za računalnike izbereš Lahko, Običajno ali Težko.</li>
        <li><strong>Na enem telefonu:</strong> dotakni se Igraj, izberi zvezdasto ploščo in 4 igralce, nato se dotakni figure, da to mesto preklopiš med osebo in računalnikom.</li>
        <li><strong>Na spletu s prijatelji:</strong> dotakni se Prijatelji, izberi zvezdasto ploščo, 4 igralce in čas na potezo ter pošlji povabilo s povezavo. Igra se začne, ko so zasedena vsa 4 mesta.</li>
        <li><strong>Hitra igra, v aplikaciji:</strong> dotakni se Igraj na spletu. Medtem ko išče igro za 2, se dotakni Poišči 4 ali 6 igralcev, da namesto tega poišče igro za 4. Vsaka poteza ima 30 sekund. Če se v 20 sekundah ne pridruži dovolj igralcev, prazna mesta zapolnijo računalniški igralci, zato so nekateri nasprotniki lahko računalniški igralci.</li>
      </ul>
    </section>`;

export default {
  nav: "Kitajske dame za 4 igralce",
  titel: "Kitajske dame za 4 igralce: začetek in nasveti | Leapstone",
  beschrijving: "Kako delujejo kitajske dame s 4 igralci: razdelitev plošče, 2 prazni konici, kdo je komu nasproti, taktika in kje igrati.",
  h1: "Kitajske dame za 4 igralce",
  intro: "S 4 igralci vsak začne v eni od štirih konic zvezde, dve konici pa ostaneta prazni. Rdeči je nasproti zelenemu, modri pa nasproti rumenemu: tvoj cilj je konica nasproti tebe, polna figur tega igralca. Tu so začetek, prazni konici, taktika in kje lahko igraš.",
  inhoud,
};
