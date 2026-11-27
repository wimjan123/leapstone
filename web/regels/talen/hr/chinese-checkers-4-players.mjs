// Hrvatski vodič Kineska dama za 4 igrača (taak 301): /hr/vodici/kineska-dama-za-4-igraca.
// Sadržaj: engleski vodič ../en/chinese-checkers-4-players.mjs, rečenicu po rečenicu na hrvatskom.
// Tekstovi gumba u aplikaciji dolaze iz web/src/talen/hr.ts.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako je ploča podijeljena</h2>
      <p>Svaki igrač ima 10 figura, pa na ploči od 121 polja stoji 40 figura. Četiri početna kraka su dva para krakova koji su jedan do drugoga: crveni dolje i plavi dolje lijevo, zeleni gore i žuti gore desno.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku, 10 plavih figura u donjem lijevom kraku, 10 zelenih figura u gornjem kraku i 10 žutih figura u gornjem desnom kraku. Gornji lijevi i donji desni krak su prazni.",
  tekst: "Crveni dolje, plavi dolje lijevo, zeleni gore, žuti gore desno.",
})}
      <p>Igrač 1, crveni, igra prvi. Zatim je plavi Igrač 2, zeleni je Igrač 3, žuti je Igrač 4, a nakon žutog opet je na redu crveni. Potez je jedan korak ili lanac skokova jednom figurom. Za korake i skokove pogledaj <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tko je nasuprot komu</h2>
      <p>Krakovi se po ploči slažu u parove: crveni je nasuprot zelenom, a plavi nasuprot žutom. Tvoj cilj je krak nasuprot tebi. Crveni ide tamo gdje zeleni počinje, zeleni tamo gdje crveni počinje, plavi tamo gdje žuti počinje, a žuti tamo gdje plavi počinje.</p>
      <p>Kao u igri za 2, svaki cilj na početku je pun figura igrača koji je nasuprot tebi, pa tamo možeš doskočiti tek nakon što su otišle. S 3 igrača ciljevi su na početku prazni, pa s 4 nitko ne može završiti odmah. Četiri cilja su četiri različita kraka, pa nitko drugi ne želi tvoj cilj: igrač koji je gotov nikoga ne blokira.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dva prazna kraka</h2>
      <p>Gornji lijevi i donji desni krak nemaju figura. Nisu ničiji početak ni ničiji cilj. Gornji lijevi leži između plavog i zelenog, a donji desni između žutog i crvenog.</p>
      <p>Možeš koračiti ili skočiti na bilo koje prazno polje, pa te krakove možeš prijeći ili se u njima zaustaviti. Figura tamo ipak još nije u cilju. U praznom kraku nema što preskočiti dok netko tamo ne dovede figure.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Što se mijenja u tvojoj taktici</h2>
      <ul>
        <li><strong>Dva prelaska odjednom:</strong> crveni i zeleni prelaze ploču jedan prema drugome, a tako i plavi i žuti. Obje linije prolaze kroz sredinu, pa je sredina prometnija nego u igri za 2, gdje prelazi samo jedna linija.</li>
        <li><strong>Tri igrača igraju između tvojih poteza:</strong> ploča se između dva tvoja poteza mijenja više nego u igri za 2. Pogledaj je ponovno na početku svakog poteza i tada isplaniraj svoj lanac skokova. Igrač koji igra nakon tebe nikad nije onaj koji je nasuprot tebi.</li>
        <li><strong>Figure pomažu svima:</strong> svaka figura ostalih triju odskočna je daska za tebe, a tvoje su odskočne daske za njih. Figure igrača nasuprot tebi kreću se u suprotnom smjeru, kao u igri za 2.</li>
        <li><strong>Prostor za zaobilazak:</strong> ako je sredina puna, prazni krakovi su otvoren prostor pokraj kampova. Put kroz jedan od njih može biti način da zaobiđeš gužvu.</li>
        <li><strong>Igrač koji odustane oslobađa tvoj cilj:</strong> kad igrač nasuprot tebi odustane, njegove figure odlaze s ploče, pa je tvoj cilj odmah prazan.</li>
      </ul>
      <p><a href="/hr/vodici/kineska-dama-strategija">Savjeti o strategiji</a> o ljestvama, zaostalim figurama i popunjavanju cilja od pozadi vrijede jednako s 4 igrača.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Pobjeda i što slijedi nakon nje</h2>
      <ul>
        <li><strong>Pobjeda:</strong> pobjeđuje prvi igrač koji sa svih 10 figura ispuni cilj. Igra se tu ne zaustavlja: ostala trojica igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se. Figure tog igrača ostaju na ploči. Igra je gotova kad još igra samo jedan igrač.</li>
        <li><strong>Odustajanje:</strong> tvoje figure odlaze s ploče, a ostala trojica igraju dalje. Ako odustanu i ostali, pobjeđuje posljednji preostali igrač.</li>
        <li><strong>Vrijeme (online):</strong> u online igri svaki potez ima vremensko ograničenje. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ, a igra se nastavlja bez tebe.</li>
      </ul>
      <p>Za igre s manje igrača pročitaj <a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>. <a href="/hr/pravila/kineska-dama">Stranica s pravilima</a> ima slike svakog početka.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdje igrati u 4 igrača u Leapstoneu</h2>
      <ul>
        <li><strong>Protiv računala, odmah:</strong> otvori <a href="/play/">Leapstone u pregledniku</a>, dodirni Računalo, odaberi zvjezdastu ploču i 3 računala. Ti si Igrač 1, pa igraš prvi. Za računala biraš Lako, Normalno ili Teško.</li>
        <li><strong>Na jednom telefonu:</strong> dodirni Igraj, odaberi zvjezdastu ploču i 4 igrača, a zatim dodirni figuru da to mjesto promijeniš između osobe i računala.</li>
        <li><strong>Online s prijateljima:</strong> dodirni Prijatelji, odaberi zvjezdastu ploču, 4 igrača i vrijeme po potezu te pošalji poveznicu za pozivnicu. Igra počinje kad se popune sva 4 mjesta.</li>
        <li><strong>Brza igra, u aplikaciji:</strong> dodirni Igraj online. Dok traži igru za 2, dodirni Traži 4 ili 6 igrača da umjesto toga potražiš igru za 4. Svaki potez traje 30 sekundi. Ako se unutar 20 sekundi ne pridruži dovoljno igrača, računalni igrači popunjavaju prazna mjesta, pa neki protivnici mogu biti računalni igrači.</li>
      </ul>
    </section>`;

export default {
  nav: "Kineska dama za 4 igrača",
  titel: "Kineska dama za 4 igrača: postava i savjeti | Leapstone",
  beschrijving: "Kako kineska dama funkcionira s 4 igrača: kako je ploča podijeljena, koja 2 kraka ostaju prazna, tko je nasuprot komu, taktika i gdje igrati.",
  h1: "Kineska dama za 4 igrača",
  intro: "S 4 igrača svatko od vas počinje u jednom od četiri kraka zvijezde, a dva kraka ostaju prazna. Crveni je nasuprot zelenom, a plavi nasuprot žutom: tvoj cilj je krak nasuprot tebi, pun figura tog igrača. Ovdje su postava, prazni krakovi, taktika i mjesta gdje je možeš igrati.",
  inhoud,
};
