// Vodnik po kitajskih damah za 2 igralca (taak 134), v slovenščini. Vsebina: ../en/chinese-checkers-2-players.mjs, poved za povedjo.
// Pravila iz crates/halma-core (Board::star, Game::new_star(2), make_move, resign), časovna omejitev iz »Regels« in taak 80,
// ravni računalnika iz crates/halma-core/src/computer.rs. Kaj prikazuje aplikacija, je iz web/src/Startmenu.svelte.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako se igra začne</h2>
      <p>Vsak igralec ima 10 figur. Začnejo v dveh konicah zvezde, ki sta si nasproti: rdeči spodaj, modri zgoraj. Teh 20 figur stoji na plošči s 121 polji.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici in 10 modrimi figurami v zgornji konici",
  tekst: "Rdeči začne spodaj, modri zgoraj.",
})}
      <p>Igralec 1, rdeči, igra prvi. Potem igrata izmenično, vsak po eno potezo. Poteza je en korak ali veriga skokov z eno figuro. Za korake in skoke glej <a href="/sl/pravila/kitajske-dame">pravila kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tvoj cilj je začetek drugega igralca</h2>
      <p>Zmagaš, če vseh svojih 10 figur premakneš v konico, kjer je začel drugi igralec. Ta konica je na začetku polna njegovih figur, tvoja pa je polna tvojih. Za rdečega je to zgornja konica na zgornji sliki.</p>
      <p>Pristaneš lahko samo na prostem polju, zato mora vsak od vaju zapustiti svojo konico, preden jo lahko napolni drugi. Nobeden od vaju ne more končati, dokler v cilju ostane figura drugega. In ker prečkata isto sredino v nasprotnih smereh, so figure drugega igralca stopnice zate, tvoje pa zanj. V <a href="/sl/vodniki/kitajske-dame-strategija">nasvetih o strategiji</a> preberi, kaj s tem početi.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Zmaga in odstop</h2>
      <ul>
        <li><strong>Zmaga:</strong> prvi igralec, ki napolni cilj z vsemi 10 figurami, zmaga, in igre je takoj konec. Drugi igralec ne igra naprej.</li>
        <li><strong>Odstop:</strong> tvoje figure zapustijo ploščo in drugi igralec zmaga.</li>
        <li><strong>Čas (na spletu):</strong> v spletni igri ima vsaka poteza časovno omejitev. Ko ti čas poteče, je tvoja poteza preskočena. Če zamudiš 3 poteze zapored, odstopiš.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Kako se razlikujejo 3, 4 in 6 igralcev</h2>
      <ul>
        <li><strong>3 igralci:</strong> figure začnejo v vsaki drugi konici, vsi trije cilji pa so na začetku prazni. Prvi, ki konča, zmaga; drugi igrajo naprej za naslednja mesta, igralec, ki je končal, pa se preskoči.</li>
        <li><strong>4 igralci:</strong> dva para konic, ki sta ena ob drugi. Tvoj cilj je na začetku poln figur drugega igralca. Igra se po prvem, ki konča, nadaljuje kot pri 3.</li>
        <li><strong>6 igralcev:</strong> vseh šest konic. Na plošči je 60 figur, proti 20 pri 2 igralcih.</li>
      </ul>
      <p>Ker je na plošči samo 20 figur, je manj figur za preskok, zato so lestve, ki jih postaviš sam, pomembnejše. <a href="/sl/pravila/kitajske-dame">Stran s pravili</a> ima slike vsakega začetka.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kje igrati z 2 igralcema v Leapstone</h2>
      <ul>
        <li><strong>Proti računalniku, takoj:</strong> odpri <a href="/play/">Leapstone v brskalniku</a>, dotakni se Računalnik in izberi zvezdasto ploščo. Privzet je en računalnik, torej je to igra za 2. Izbereš Lahko, Običajno ali Težko, ti pa si igralec 1, zato igraš prvi. Lahko izbere najboljšo od treh naključnih potez. Običajno izbere potezo, ki najbolj napreduje proti cilju. Težko pogleda tudi, kako lahko odgovorijo njegovi nasprotniki, in na svojo naslednjo potezo.</li>
        <li><strong>Igraj na spletu, v aplikaciji:</strong> hitra igra na zvezdasti plošči za 2 igralca, proti drugemu igralcu tvoje ravni, s 30 sekundami na potezo. Nekateri nasprotniki na spletu so lahko računalniški igralci.</li>
        <li><strong>S prijateljem:</strong> pošlji povabilo s povezavo in sam določi čas na potezo. Ali pa en telefon podajajta sem in tja.</li>
      </ul>
      <p><a href="/sl/vodniki/kitajske-dame-na-spletu-s-prijatelji">Kitajske dame na spletu s prijatelji</a></p>
      <p><a href="/sl/vodniki/kitajske-dame-za-tri">Kitajske dame za 3 igralce</a></p>
    </section>`;

export default {
  nav: "Kitajske dame za 2 igralca",
  titel: "Kitajske dame za 2 igralca: začetek in pravila | Leapstone",
  beschrijving: "Kako delujejo kitajske dame z 2 igralcema: kje začne 10 figur, kdo igra prvi, kako zmagaš ali odstopiš, in kje igrati brezplačno.",
  h1: "Kitajske dame za 2 igralca",
  intro: "Kako deluje igra v dvoje na zvezdasti plošči: začetek, kdo igra prvi, kako zmagaš in kje lahko igraš.",
  inhoud,
};
