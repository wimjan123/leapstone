// Hrvatski vodič Kineska dama za 2 igrača (taak 134): /hr/vodici/kineska-dama-za-2-igraca.
// Sadržaj: engleski vodič ../en/chinese-checkers-2-players.mjs, rečenicu po rečenicu na hrvatskom. Pravila dolaze iz crates/halma-core
// (Board::star, Game::new_star(2), make_move, resign), vremensko ograničenje iz "Regels" i taak 80, razine računala iz
// crates/halma-core/src/computer.rs. Što aplikacija prikazuje dolazi iz web/src/Startmenu.svelte i Landingspagina.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako igra počinje</h2>
      <p>Svaki igrač ima 10 figura. Počinju u dva kraka zvijezde koji su jedan nasuprot drugome: crveni dolje, plavi gore. Tih 20 figura stoji na ploči od 121 polja.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku i 10 plavih figura u gornjem kraku",
  tekst: "Crveni počinje dolje, plavi gore.",
})}
      <p>Igrač 1, crveni, igra prvi. Nakon toga igrate naizmjence, po jedan potez. Potez je jedan korak ili lanac skokova jednom figurom. Za korake i skokove pogledaj <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tvoj cilj je početak drugog igrača</h2>
      <p>Pobjeđuješ kad svih 10 svojih figura prebaciš u krak u kojem je počeo drugi igrač. Taj krak na početku je pun njegovih figura, a tvoj je pun tvojih. Za crvenog je to gornji krak na gornjoj slici.</p>
      <p>Možeš doskočiti samo na prazno polje, pa svatko od vas mora napustiti svoj krak prije nego ga drugi može ispuniti. Nijedan od vas ne može završiti dok figura drugoga ostaje u cilju. A budući da istu sredinu prelazite u suprotnim smjerovima, figure drugog igrača odskočne su daske za tebe, a tvoje za njega. Pročitaj <a href="/hr/vodici/kineska-dama-strategija">savjete o strategiji</a> o tome što s tim.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Pobjeda i odustajanje</h2>
      <ul>
        <li><strong>Pobjeda:</strong> pobjeđuje prvi igrač koji sa svih 10 figura ispuni cilj i igra je odmah gotova. Drugi igrač ne igra dalje.</li>
        <li><strong>Odustajanje:</strong> tvoje figure odlaze s ploče i pobjeđuje drugi igrač.</li>
        <li><strong>Vrijeme (online):</strong> u online igri svaki potez ima vremensko ograničenje. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Po čemu se razlikuju igre s 3, 4 i 6 igrača</h2>
      <ul>
        <li><strong>3 igrača:</strong> figure počinju u svakom drugom kraku, a tri cilja na početku su prazna. Pobjeđuje prvi igrač koji završi; ostali igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se.</li>
        <li><strong>4 igrača:</strong> dva para krakova jedan do drugoga. Tvoj cilj na početku je pun figura drugog igrača. Igra se nastavlja nakon prvog koji završi, kao s 3.</li>
        <li><strong>6 igrača:</strong> svih šest krakova. Na ploči je 60 figura, naspram 20 s 2 igrača.</li>
      </ul>
      <p>Sa samo 20 figura na ploči ima manje figura za preskakanje, pa su ljestve koje sam izgradiš važnije. <a href="/hr/pravila/kineska-dama">Stranica s pravilima</a> ima slike svakog početka.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdje igrati u dvoje u Leapstoneu</h2>
      <ul>
        <li><strong>Protiv računala, odmah:</strong> otvori <a href="/play/">Leapstone u pregledniku</a>, dodirni Računalo i odaberi zvjezdastu ploču. Zadano je jedno računalo, pa je to igra za 2. Biraš Lako, Normalno ili Teško, a ti si Igrač 1, pa igraš prvi. Lako bira najbolji od tri nasumična poteza. Normalno bira potez koji najviše napreduje prema cilju. Teško gleda i kako mu protivnici mogu odgovoriti te svoj sljedeći potez.</li>
        <li><strong>Igraj online, u aplikaciji:</strong> brza igra na zvjezdastoj ploči za 2 igrača, protiv drugog igrača tvoje razine, s 30 sekundi po potezu. Neki online protivnici mogu biti računalni igrači.</li>
        <li><strong>S prijateljem:</strong> pošalji poveznicu za pozivnicu i sam postavi vrijeme po potezu. Ili dodavajte jedan telefon naprijed-natrag.</li>
      </ul>
      <p><a href="/hr/vodici/kineska-dama-online-s-prijateljima">Kineska dama online s prijateljima</a></p>
      <p><a href="/hr/vodici/kineska-dama-za-3-igraca">Kineska dama za 3 igrača</a></p>
    </section>`;

export default {
  nav: "Kineska dama za 2 igrača",
  titel: "Kineska dama za 2 igrača: postava i pravila | Leapstone",
  beschrijving: "Kako kineska dama funkcionira s 2 igrača: gdje počinje 10 figura, tko igra prvi, kako se pobjeđuje ili odustaje i gdje besplatno igrati u dvoje.",
  h1: "Kineska dama za 2 igrača",
  intro: "Kako funkcionira igra u dvoje na zvjezdastoj ploči: postava, tko igra prvi, kako se pobjeđuje i gdje je možeš igrati.",
  inhoud,
};
