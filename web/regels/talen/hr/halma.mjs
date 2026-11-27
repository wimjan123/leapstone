// Hrvatska stranica s pravilima Halma (taak 134): /hr/pravila/halma. Sadržaj: engleska stranica ../en/halma.mjs (provjerena prema
// crates/halma-core, vidi docs/plan.md, taak 117), rečenicu po rečenicu na hrvatskom. Kad se pravilo promijeni, mijenjaju se svi jezici.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 igrača: po 19 figura",
    alt: "Kvadratna ploča s 19 crvenih figura u gornjem lijevom kutu i 19 plavih figura u donjem desnom kutu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 igrača: po 13 figura",
    alt: "Kvadratna ploča s 13 figura u svakom od četiri kuta: crvene gore lijevo, plave gore desno, zelene dolje desno i žute dolje lijevo",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Ploča</h2>
      <p>Halma se igra na kvadratnoj ploči od 16 puta 16 polja, ukupno 256. Svako polje ima najviše osam susjeda: četiri ravna i četiri dijagonalna. Polje na rubu ima ih manje, a kut ima tri.</p>
      <p>Ovo je kvadratna ploča u Leapstoneu. Ako igru poznaješ sa zvjezdaste ploče, pročitaj o <a href="/hr/pravila/sto-je-sternhalma">Sternhalmi</a> i <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kako figure počinju</h2>
      <p>Halma je za 2 ili 4 igrača. Svaki igrač počinje s figurama u logoru u jednom kutu ploče. Logor u suprotnom kutu je tvoj cilj.</p>
      <ul>
        <li><strong>2 igrača:</strong> po 19 figura, u dva kuta jedan nasuprot drugome. Logor se sastoji od pet redova s 5, 5, 4, 3 i 2 polja.</li>
        <li><strong>4 igrača:</strong> po 13 figura, jedan logor u svakom kutu. Logor se sastoji od četiri reda s 4, 4, 3 i 2 polja. Tvoj cilj je kut preko ploče, dijagonalno.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Redoslijed poteza</h2>
      <p>Igrač 1 igra prvi. Zatim potezi idu redom, a nakon zadnjeg igrača opet je na redu Igrač 1. U Leapstoneu boje idu uz brojeve: crvena, plava, zelena i žuta.</p>
      <p>Kad si na redu, pomakneš jednu figuru, jednom. Ništa se ne uzima: figure ostaju na ploči dok njihov igrač ne odustane.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Korak</h2>
      <p>Pomakni figuru na prazno polje pokraj nje, u bilo kojem od osam smjerova: ravno ili dijagonalno.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Crvena figura s bijelim prstenom oko sebe. Pet od njezinih osam susjednih polja prazno je i označeno; na druga tri nalaze se figure.",
  tekst: "Crvena figura može koraknuti na pet označenih polja. Ostala tri susjedna polja su zauzeta.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskoči jednu figuru pokraj svoje, bilo koje boje, i doskoči na prazno polje odmah iza nje, u ravnoj liniji. Možeš skakati u svih osam smjerova, i dijagonalno i unatrag.</p>
      <ul>
        <li>Polje na koje doskočiš mora biti prazno.</li>
        <li>Ne možeš preskočiti dvije figure zaredom niti prazno polje.</li>
        <li>Figura koju preskočiš ostaje gdje jest.</li>
        <li>Ne možeš preskočiti rub ploče.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Crvena figura dijagonalno preskače plavu figuru na prazno polje iza nje, prikazano strelicom.",
  tekst: "Crvena figura dijagonalno preskače plavu figuru.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Lanac skokova</h2>
      <p>Nakon skoka ista figura smije skočiti opet, koliko god puta može, u bilo kojem smjeru, ravno ili dijagonalno. Ti odlučuješ gdje ćeš stati. Svi skokovi zajedno jedan su potez.</p>
      <ul>
        <li>U jednom potezu ne možeš dvaput doskočiti na isto polje.</li>
        <li>Potez je jedan korak ili jedan ili više skokova. Nakon skoka ne možeš koraknuti.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Crvena figura u jednom potezu napravi tri skoka: dijagonalno preko plave figure, ravno preko druge plave figure i dijagonalno preko crvene figure. Tri polja doskoka označena su brojevima 1, 2 i 3.",
  tekst: "Jedan potez s tri skoka, redom prema brojevima.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cilj</h2>
      <p>Pobjeđuješ kad sve svoje figure prebaciš u logor nasuprot onom u kojem si počeo. Na svakom polju tog logora moraju stajati tvoje figure: 19 s 2 igrača, 13 s 4 igrača. Dok se tamo nalazi figura drugog igrača, ne možeš završiti.</p>
      <p>Smiješ doskočiti na bilo koje prazno polje, i u logore drugih igrača. Figura koja je u tvojem cilju smije ga opet napustiti; ništa je ne zaključava.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Kvadratna ploča za dva igrača. Crveni počinje gore lijevo; logor dolje desno, označen crtkanim krugovima i pun plavih figura, cilj je crvenog.",
  tekst: "S 2 igrača cilj crvenog je logor u kojem počinje plavi.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">S 2 ili 4 igrača</h2>
      <ul>
        <li><strong>2 igrača:</strong> pobjeđuje prvi igrač koji ispuni cilj i igra je gotova.</li>
        <li><strong>4 igrača:</strong> pobjeđuje prvi igrač koji ispuni cilj. Ostali igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se. Igra je gotova kad još samo jedan igrač igra.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Odustajanje</h2>
      <p>Kad odustaneš, tvoje figure odlaze s ploče pa nikoga ne blokiraju. S 2 igrača pobjeđuje drugi igrač. S 4 igrača igra se nastavlja bez tebe, a ako svi osim jednog igrača odustanu, pobjeđuje zadnji igrač.</p>
      <p>U online igri svaki potez ima vremensko ograničenje. Postavlja ga igrač koji započne igru. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ. Igre protiv računala i na jednom telefonu nemaju vremensko ograničenje.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Savjeti</h2>
      <ul class="tips">
        <li><strong>Gradi ljestve.</strong> Postavi figure u red s jednim praznim poljem između njih, ravno ili dijagonalno, prema svojem cilju. Jedna figura tada može skakati duž cijelog reda u jednom potezu.</li>
        <li><strong>Svaka figura je ljestve.</strong> Možeš preskočiti figuru bilo koje boje, pa ti pomažu i figure drugih igrača. A tvoje ljestve pomažu njima: pogledaj što ostavljaš iza sebe.</li>
        <li><strong>Koristi dijagonale.</strong> Cilj je u suprotnom kutu, pa je dijagonalni red figura najbrži put preko ploče.</li>
        <li><strong>Ne zaboravi na zaostale.</strong> Trebaju ti sve figure u cilju. Figura daleko iza, koja nema što preskočiti, pomiče se jedno polje po potezu. Dovedi je dok su druge figure još oko nje.</li>
        <li><strong>Tvoj početak je njihov cilj.</strong> S 2 igrača tvoj je logor cilj drugog igrača, a on ne može završiti dok je tamo još jedna tvoja figura. Leapstone ti dopušta da zadržiš figuru kod kuće, pa možeš blokirati na taj način. Isto vrijedi i za tebe.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pitanja</h2>
      <h3>Koliko ljudi može igrati Halmu?</h3>
      <p>Dvoje ili četvero. Halma se igra na kvadratnoj ploči od 16 puta 16 polja, a svaki igrač počinje u jednom kutu.</p>
      <h3>Koliko figura ima svaki igrač u Halmi?</h3>
      <p>19 figura svaki sa 2 igrača, a 13 figura svaki s 4 igrača.</p>
      <h3>Tko je izumio Halmu?</h3>
      <p>George Howard Monks, američki kirurg, 1883. ili 1884. Ime je grčko za &bdquo;skok&rdquo;. Pročitaj više u članku <a href="/hr/pravila/sto-je-sternhalma">Sternhalma</a>.</p>
      <h3>Koja je razlika između Halme i kineske dame?</h3>
      <p>Halma se igra na kvadratnoj ploči, s koracima i skokovima u osam smjerova i 19 ili 13 figura svaki. Kineska dama igra se na zvjezdastoj ploči, sa šest smjerova i 10 figura svaki, za 2, 3, 4 ili 6 igrača.</p>
      <h3>Može li se Halma igrati online besplatno?</h3>
      <p>Da, u Leapstoneu, u pregledniku ili u aplikaciji iz App Storea. Odaberi način igranja, na primjer protiv računala ili online s prijateljima, a zatim Kvadratna ploča. Leapstone je besplatan, bez oglasa.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Igraj je</h2>
      <p>Gumb Igraj sada otvara igru protiv računala na <a href="/hr/pravila/kineska-dama">zvjezdastoj ploči</a>. Da bi igrao Halmu, dodirni strelicu za natrag na vrhu, zatim odaberi Igraj na ovom telefonu, Igraj protiv računala ili Igraj online s prijateljima i dodirni Kvadratna ploča.</p>
    </section>`;

export default {
  nav: "Pravila Halme",
  titel: "Pravila Halme i savjeti | Leapstone",
  beschrijving: "Kako se igra Halma na kvadratnoj ploči 16 puta 16: početak, koraci, skokovi, lanci skokova, kako pobijediti i savjeti. Igraj besplatno u pregledniku.",
  h1: "Pravila Halme",
  intro: "Prebaci sve svoje figure preko kvadratne ploče u suprotni kut prije nego itko drugi. Pravila ukratko, sa slikama, i nekoliko savjeta.",
  inhoud,
};
