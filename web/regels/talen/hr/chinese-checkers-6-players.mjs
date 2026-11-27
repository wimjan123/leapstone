// Hrvatski vodič Kineska dama za 6 igrača (taak 302, feature 294): /hr/vodici/kineska-dama-za-6-igraca.
// Sadržaj: engleski vodič ../en/chinese-checkers-6-players.mjs, rečenicu po rečenicu na hrvatskom. Pravila dolaze iz crates/halma-core, vidi docs/plan.md, taak 302.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Kako igra počinje</h2>
      <p>Svaki igrač ima 10 figura i svih 6 krakova zvijezde je u upotrebi. Na ploči od 121 polja tako stoji 60 figura. 61 polje u sredini na početku je prazno.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s 10 figura u svakom od 6 krakova, u 6 boja",
  tekst: "6 igrača, 6 krakova, 60 figura.",
})}
      <p>Igrač 1, crveni, igra prvi, iz donjeg kraka. Potez zatim ide od igrača 1 do igrača 6, a nakon igrača 6 opet je na redu igrač 1. Igrači su numerirani redoslijedom svojih krakova oko zvijezde, pa igrač nakon tebe uvijek počinje u kraku do tvojeg. Potez je jedan korak ili lanac skokova jednom figurom. Za korake i skokove pogledaj <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Svaki je cilj na početku pun</h2>
      <p>Pobjeđuješ kad svih 10 svojih figura prebaciš u krak s druge strane ploče. Sa 6 igrača to je krak u kojem počinje igrač nasuprot tebi, pa nijedan cilj nije prazan: svaki počinje pun figura drugog igrača. Za crvenog je cilj gornji krak, u kojem počinje igrač 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča sa 6 punih krakova. Isprekidani krug označuje gornji krak, cilj crvenog igrača, u kojem su figure igrača nasuprot.",
  tekst: "Cilj crvenog je krak nasuprot, pun figura igrača 4.",
})}
      <p>Možeš doskočiti samo na prazno polje, pa igrač nasuprot mora napustiti svoj krak prije nego ga ti ispuniš, a ti moraš napustiti svoj prije nego ga on ispuni. U igri za 2 to je sve. Sa 6 se oba igrača usto moraju probiti kroz gužvu od 4 ostala.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Pretrpana sredina</h2>
      <p>Svaki je cilj s druge strane ploče, a krakovi se međusobno spajaju samo preko sredine, pa svih 60 figura mora preći preko istih 61 polja. Na početku još nitko nije prešao i sredina se brzo puni.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Crvena figura u jednom potezu skače triput: preko plave figure, zatim preko zelene i zatim preko ljubičaste. Brojevi 1, 2 i 3 označuju polja doskoka.",
  tekst: "Figure svih boja su odskočne daske.",
})}
      <p>Možeš preskočiti figuru bilo koje boje. Figure 5 ostalih igrača odskočne su daske za tebe, a tvoje za svih 5. Niz figura koji ostaviš u sredini ljestve su za svakoga tko do njih može doći, a igrač nakon tebe prvi je na redu.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokiranje s 5 protivnika</h2>
      <ul>
        <li><strong>Ispuni polje doskoka:</strong> skok traži prazno polje odmah iza figure. Kad tamo premjestiš figuru, skoka više nema za svakog igrača koji ga je htio.</li>
        <li><strong>Pazi na ljestve koje gradiš:</strong> nakon tvog poteza igra ostalih 5 igrača prije nego si opet na redu. Ljestve pomažu svima.</li>
        <li><strong>Cilj može blokirati bilo tko:</strong> figura bilo kojeg drugog igrača u tvom cilju sprječava te da završiš, ne samo figura igrača nasuprot. Svih 10 polja cilja mora sadržavati tvoje vlastite figure.</li>
      </ul>
      <p><a href="/hr/vodici/kineska-dama-strategija">Savjeti o strategiji</a> pokazuju kako izgleda blokirani skok i kako ne zaključati figuru drugog igrača u vlastitom cilju.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Koliko igra traje</h2>
      <p>U igri za 6 ima 60 figura za pomicanje, a između tvog poteza i sljedećeg svaki od ostalih 5 igrača odigra po jedan. Igra se također ne završava kad prvi igrač završi.</p>
      <ul>
        <li><strong>Pobijedi i igraj dalje:</strong> pobjeđuje prvi igrač koji ispuni cilj, a ostali igraju dalje za sljedeća mjesta. Igrač koji je gotov preskače se, a njegove figure ostaju na ploči kao odskočne daske. Igra je gotova kad igra samo još jedan igrač.</li>
        <li><strong>Odustajanje:</strong> tvoje figure odlaze s ploče, pa više nikome ne smetaju niti pomažu, a ostali igraju dalje.</li>
        <li><strong>Vrijeme (online):</strong> u online igri svaki potez ima vremensko ograničenje koje postavlja igrač koji pokreće igru: 15 sekundi, 30 sekundi, 1 minuta, 2 minute ili bez ograničenja. Krug od 6 poteza traje najviše 6 puta koliko je ograničenje, pa je s 30 sekundi to najviše 3 minute. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ i igra se nastavlja bez tebe.</li>
      </ul>
      <p>O igri s manje igrača pročitaj <a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdje igrati u 6 igrača u Leapstoneu</h2>
      <ul>
        <li><strong>Protiv računala, odmah:</strong> otvori <a href="/play/">Leapstone u pregledniku</a>, dodirni Računalo, odaberi zvjezdastu ploču i 5 računala. Ti si Igrač 1, pa igraš prvi. Računala igraju jedno za drugim, svako s kratkom stankom, pa možeš pratiti svaki potez. Za računala biraš Lako, Normalno ili Teško.</li>
        <li><strong>Na jednom telefonu:</strong> dodirni Igraj, odaberi zvjezdastu ploču i 6 igrača, zatim dodirni figuru da to mjesto prebaciš između osobe i računala.</li>
        <li><strong>Online s prijateljima:</strong> dodirni Prijatelji, odaberi zvjezdastu ploču, 6 igrača i vrijeme po potezu te pošalji poveznicu za pozivnicu. Igra počinje kad su zauzeta sva 6 mjesta.</li>
        <li><strong>Brze igre:</strong> Igraj online traži igre za 2 ili 4 igrača, pa brze igre za 6 nema.</li>
      </ul>
    </section>`;

export default {
  nav: "Kineska dama za 6 igrača",
  titel: "Kineska dama za 6 igrača: cijela ploča | Leapstone",
  beschrijving: "Kako kineska dama funkcionira sa 6 igrača: puna zvijezda od 60 figura, pretrpana sredina, blokiranje, koliko igra traje i gdje je igrati.",
  h1: "Kineska dama za 6 igrača",
  intro: "Kako funkcionira igra za 6: svih 6 krakova je puno, utrkuješ se do kraka s druge strane ploče, a igra se nastavlja i nakon što prvi igrač završi.",
  inhoud,
};
