// Hrvatski vodič Kineska dama za 3 igrača (taak 299): /hr/vodici/kineska-dama-za-3-igraca.
// Sadržaj: engleski vodič ../en/chinese-checkers-3-players.mjs, rečenicu po rečenicu na hrvatskom. Pravila su provjerena prema crates/halma-core (vidi englesku datoteku).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako igra počinje</h2>
      <p>Svaki igrač ima 10 figura, pa na ploči od 121 polja stoji 30 figura. Počinju u svakom drugom kraku zvijezde: crveni dolje, plavi gore lijevo i zeleni gore desno. Tri kraka između njih prazna su.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku, 10 plavih figura u gornjem lijevom kraku i 10 zelenih figura u gornjem desnom kraku",
  tekst: "Crveni dolje, plavi gore lijevo, zeleni gore desno.",
})}
      <p>Igrač 1, crveni, igra prvi. Zatim je plavi Igrač 2, zeleni je Igrač 3, a nakon zelenog opet je na redu crveni. Potez je jedan korak ili lanac skokova jednom figurom. Za korake i skokove pogledaj <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tri cilja, svi na početku prazni</h2>
      <p>Tvoj cilj je krak nasuprot onome u kojem si počeo, a s 3 igrača on je na početku prazan. To je prazan krak između početaka ostalih dvaju igrača: cilj crvenog je gore, plavog dolje desno, a zelenog dolje lijevo.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča za tri igrača. Isprekidani krugovi u boji svakog igrača označuju tri prazna cilja: crveni gore, plavi dolje desno, zeleni dolje lijevo.",
  tekst: "Svaki cilj ima boju svog igrača.",
})}
      <p>Pobjeđuješ kad svih 10 svojih figura prebaciš u svoj cilj. Svih 10 polja mora sadržavati tvoje figure. Nitko ne počinje u tvom cilju, ali možeš stati na bilo koje prazno polje, pa kasnije na njega može doskočiti figura drugog igrača. Dok ona tamo stoji, ne možeš završiti.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Pobjeda i što slijedi nakon nje</h2>
      <ul>
        <li><strong>Pobjeda:</strong> pobjeđuje prvi igrač koji ispuni cilj. Igra se tu ne zaustavlja: ostala dvojica igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se. Igra je gotova kad još igra samo jedan igrač.</li>
        <li><strong>Odustajanje:</strong> tvoje figure odlaze s ploče, a ostala dvojica igraju dalje. Ako drugi igrač odustane prije nego što je itko završio, pobjeđuje zadnji preostali igrač.</li>
        <li><strong>Vrijeme (online):</strong> u online igri svaki potez ima vremensko ograničenje koje postavlja igrač koji pokreće igru. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ, a igra se nastavlja bez tebe.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Po čemu se razlikuje od igre za 2</h2>
      <ul>
        <li><strong>Više figura:</strong> 30 na ploči, naspram 20 s 2 igrača.</li>
        <li><strong>Prazni ciljevi:</strong> s 2 igrača tvoj cilj na početku je pun figura drugog igrača. S 3 na početku je prazan.</li>
        <li><strong>Dva protivnika:</strong> nakon tvog poteza igraju dva druga igrača prije nego što si opet na redu. Figure obojice odskočne su daske za tebe, a tvoje za njih. Ljestve koje izgradiš mogu koristiti obojica, a igrač nakon tebe prvi je na redu.</li>
        <li><strong>Igra se nastavlja:</strong> s 2 igrača igra završava kad jedan od vas završi. S 3 se nastavlja za drugo i treće mjesto.</li>
      </ul>
      <p>Za igru u dvoje pročitaj <a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>. <a href="/hr/vodici/kineska-dama-strategija">Savjeti o strategiji</a> odnose se na korake i skokove, koji su isti s 3 igrača.</p>
      <p><a href="/hr/vodici/kineska-dama-online-s-prijateljima">Kineska dama online s prijateljima</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdje igrati s 3 igrača u Leapstoneu</h2>
      <ul>
        <li><strong>Protiv računala, odmah:</strong> otvori <a href="/play/">Leapstone u pregledniku</a>, dodirni Računalo, odaberi zvjezdastu ploču i 2 računala. Ti si Igrač 1, pa igraš prvi. Za računala biraš Lako, Normalno ili Teško.</li>
        <li><strong>Na jednom telefonu:</strong> dodirni „Na ovom telefonu“, odaberi zvjezdastu ploču i 3 igrača, a zatim dodirni figuru da to mjesto prebaciš između osobe i računala.</li>
        <li><strong>Online s prijateljima:</strong> dodirni Prijatelji, odaberi zvjezdastu ploču, 3 igrača i vrijeme po potezu te pošalji poveznicu za pozivnicu. Igra počinje kad su sva 3 mjesta popunjena.</li>
        <li><strong>Brze igre:</strong> Igraj online pronalazi igre za 2 ili 4 igrača, pa brze igre za 3 nema.</li>
      </ul>
    </section>`;

export default {
  nav: "Kineska dama za 3 igrača",
  titel: "Kineska dama za 3 igrača: postava i pravila | Leapstone",
  beschrijving: "Kako kineska dama funkcionira s 3 igrača: gdje počinje 30 figura, koji je prazan krak cilj svakog igrača, tko igra prvi i kako se pobjeđuje.",
  h1: "Kineska dama za 3 igrača",
  intro: "Kako funkcionira igra u troje na zvjezdastoj ploči: postava, tri cilja, tko igra prvi, kako se pobjeđuje i gdje je možeš igrati.",
  inhoud,
};
