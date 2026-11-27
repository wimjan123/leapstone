// Hrvatska stranica s pravilima Kineska dama (taak 134): /hr/pravila/kineska-dama. Sadržaj: engleska stranica ../en/chinese-checkers.mjs
// (provjerena prema crates/halma-core, vidi docs/plan.md, taak 116), rečenicu po rečenicu na hrvatskom.
// Svako pravilo mora odgovarati engleskoj stranici; kad se pravilo promijeni, mijenjaju se svi jezici.
// Iste slike (bez jezika: u SVG-u su samo brojevi); alt-tekstovi i opisi slika su na hrvatskom.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} igrača`,
      alt:
        {
          2: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku i 10 plavih figura u gornjem kraku",
          3: "Zvjezdasta ploča s crvenim figurama dolje, plavima gore lijevo i zelenima gore desno",
          4: "Zvjezdasta ploča s figurama u četiri kraka: crvene dolje, zelene gore, plave dolje lijevo i žute gore desno",
          6: "Zvjezdasta ploča s figurama u svih šest krakova, u šest boja",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Ploča</h2>
      <p>Kineska dama igra se na zvijezdi sa šest krakova. Ploča ima 121 polje, a svaki krak ima 10 polja. Unutar ploče svako polje ima šest susjeda.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kako figure počinju</h2>
      <p>Svaki igrač ima 10 figura i počinje s njima u jednom kraku zvijezde. Krak nasuprot tvojem je tvoj cilj.</p>
      <ul>
        <li><strong>2 igrača:</strong> dva kraka koja su točno jedan nasuprot drugome.</li>
        <li><strong>3 igrača:</strong> svaki drugi krak. Tri cilja na početku su prazna.</li>
        <li><strong>4 igrača:</strong> dva para krakova koji su jedan do drugoga. Svaki igrač ima drugog igrača nasuprot sebi.</li>
        <li><strong>6 igrača:</strong> svih šest krakova.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Redoslijed poteza</h2>
      <p>Igrač 1 igra prvi. Zatim potezi idu redom: Igrač 2, Igrač 3 i tako dalje, a nakon zadnjeg igrača opet je na redu Igrač 1. U Leapstoneu boje idu uz brojeve: crvena, plava, zelena, žuta, ljubičasta i srebrna.</p>
      <p>Kad si na redu, pomakneš jednu figuru, jednom. Ništa se ne uzima: figure ostaju na ploči dok njihov igrač ne odustane.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Korak</h2>
      <p>Pomakni figuru na prazno polje pokraj nje.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Crvena figura s bijelim prstenom oko sebe. Tri od njezinih šest susjednih polja prazna su i označena; na druga tri nalaze se figure.",
  tekst: "Crvena figura može koraknuti na tri označena polja. Ostala tri susjedna polja su zauzeta.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Preskoči jednu figuru pokraj svoje, bilo koje boje, i doskoči na prazno polje odmah iza nje, u ravnoj liniji. Možeš skakati u svih šest smjerova, i unatrag.</p>
      <ul>
        <li>Polje na koje doskočiš mora biti prazno.</li>
        <li>Ne možeš preskočiti dvije figure zaredom niti prazno polje.</li>
        <li>Figura koju preskočiš ostaje gdje jest.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Crvena figura preskače plavu figuru na prazno polje iza nje, prikazano strelicom.",
  tekst: "Crvena figura preskače plavu figuru.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Lanac skokova</h2>
      <p>Nakon skoka ista figura smije skočiti opet, koliko god puta može i u bilo kojem smjeru. Ti odlučuješ gdje ćeš stati. Svi skokovi zajedno jedan su potez.</p>
      <ul>
        <li>U jednom potezu ne možeš dvaput doskočiti na isto polje.</li>
        <li>Potez je jedan korak ili jedan ili više skokova. Nakon skoka ne možeš koraknuti.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Crvena figura u jednom potezu napravi tri skoka, preko plave, zelene i još jedne plave figure. Tri polja doskoka označena su brojevima 1, 2 i 3.",
  tekst: "Jedan potez s tri skoka, redom prema brojevima.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cilj</h2>
      <p>Pobjeđuješ kad svih 10 svojih figura prebaciš u krak nasuprot onom u kojem si počeo. Na svih 10 polja tog kraka moraju stajati tvoje figure. Dok se tamo nalazi figura drugog igrača, ne možeš završiti.</p>
      <p>Smiješ doskočiti na bilo koje prazno polje, i u krakove drugih igrača.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča za tri igrača. Crveni počinje dolje; prazan krak gore, označen crtkanim krugovima, cilj je crvenog.",
  tekst: "S 3 igrača crveni počinje dolje. Cilj crvenog je prazan krak gore.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">S 2, 3, 4 ili 6 igrača</h2>
      <ul>
        <li><strong>2 igrača:</strong> pobjeđuje prvi igrač koji ispuni cilj i igra je gotova.</li>
        <li><strong>3, 4 ili 6 igrača:</strong> pobjeđuje prvi igrač koji ispuni cilj. Ostali igraju dalje za sljedeća mjesta, a igrač koji je gotov preskače se. Igra je gotova kad još samo jedan igrač igra.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Odustajanje</h2>
      <p>Kad odustaneš, tvoje figure odlaze s ploče pa nikoga ne blokiraju. S 2 igrača pobjeđuje drugi igrač. S više igrača igra se nastavlja bez tebe, a ako svi osim jednog igrača odustanu, pobjeđuje zadnji igrač.</p>
      <p>U online igri svaki potez ima vremensko ograničenje. Postavlja ga igrač koji započne igru, a u brzoj igri ono iznosi 30 sekundi. Kad ti istekne vrijeme, tvoj se potez preskače. Ako propustiš 3 poteza zaredom, odustaješ. Igre protiv računala i na jednom telefonu nemaju vremensko ograničenje.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Savjeti</h2>
      <ul class="tips">
        <li><strong>Gradi ljestve.</strong> Postavi figure u red s jednim praznim poljem između njih, prema svojem cilju. Jedna figura tada može skakati duž cijelog reda u jednom potezu.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Četiri figure u dijagonalnom redu s praznim poljem između svake. Crvena figura na jednom kraju preskače sve četiri, s četiri numerirana polja doskoka.",
  tekst: "Četiri figure u redu: gornja crvena figura prelazi ploču u jednom potezu, s četiri skoka.",
})}
        </li>
        <li><strong>Svaka figura je ljestve.</strong> Možeš preskočiti figuru bilo koje boje, pa ti pomažu i figure drugih igrača. A tvoje ljestve pomažu njima: pogledaj što ostavljaš iza sebe.</li>
        <li><strong>Ne zaboravi na zaostale.</strong> Trebaju ti svih 10 figura u cilju. Figura daleko iza, koja nema što preskočiti, pomiče se jedno polje po potezu. Dovedi je dok su druge figure još oko nje.</li>
        <li><strong>Tvoj početak je njihov cilj.</strong> S 2, 4 ili 6 igrača tvoj početni krak cilj je igrača nasuprot tebi, a on ne može završiti dok je tamo još jedna tvoja figura. Isto vrijedi i za tebe.</li>
      </ul>
      <p>Više savjeta, sa slikama, nalazi se u vodiču <a href="/hr/vodici/kineska-dama-strategija">strategija kineske dame</a>. Za igru u dvoje pročitaj <a href="/hr/vodici/kineska-dama-za-2-igraca">kineska dama za 2 igrača</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pitanja</h2>
      <h3>Koliko ljudi može igrati kinesku damu?</h3>
      <p>Dvoje, troje, četvero ili šestero. Svaki igrač počinje u jednom kraku zvijezde. S 2, 3 ili 4 igrača neki krakovi ostaju prazni.</p>
      <h3>Koliko kuglica ima svaki igrač?</h3>
      <p>Svaki igrač ima 10 kuglica, odnosno figura. Ploča ima 121 polje: 10 u svakom od šest krakova i 61 u sredini.</p>
      <h3>Možeš li preskakati vlastite figure ili ići unatrag?</h3>
      <p>Da. Možeš preskočiti figuru bilo koje boje, i vlastitu, u svih šest smjerova, i unatrag. Figura koju preskočiš ostaje gdje je bila.</p>
      <h3>Hvataju li se figure u kineskoj dami?</h3>
      <p>Ne. Ništa se ne hvata. Figura napušta ploču samo kad njezin igrač odustane.</p>
      <h3>Dolazi li kineska dama iz Kine?</h3>
      <p>Ne. Igra se pojavila u Njemačkoj 1892. kao Stern-Halma, prema starijoj igri Halma. Ime Chinese checkers dolazi iz Sjedinjenih Država, 1928. Pročitaj više u članku <a href="/hr/pravila/sto-je-sternhalma">Sternhalma</a>.</p>
      <h3>Gdje se kineska dama može besplatno igrati online s prijateljima?</h3>
      <p>U Leapstoneu, u pregledniku ili u aplikaciji iz App Storea. Pošalji prijatelju poveznicu za pozivnicu: pridružuje se tvojoj igri bez računa, e-adrese ili lozinke. Možeš igrati i protiv računala ili odigrati brzu igru protiv drugog igrača. Leapstone je besplatan, bez oglasa.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Igranje kineske dame u Leapstoneu</h2>
      <p>Leapstone je besplatna aplikacija za igranje kineske dame i Halme na 3D ploči od crvenog laka i zlata. Možeš igrati u aplikaciji i u pregledniku.</p>
      <ul>
        <li><strong>Protiv računala.</strong> Lako, normalno ili teško. Ne treba ti internet.</li>
        <li><strong>S prijateljima.</strong> Pošalji poveznicu za pozivnicu. Ti postavljaš vrijeme po potezu, a možete i chatati.</li>
        <li><strong>Online.</strong> Brza igra protiv drugog igrača tvoje razine, 30 sekundi po potezu. Neki online protivnici mogu biti računalni igrači.</li>
        <li><strong>Na jednom telefonu.</strong> Dodajte telefon jedni drugima oko stola.</li>
      </ul>
      <p>Leapstone je besplatan, bez oglasa i bez prijave e-adresom: biraš samo ime igrača. <a href="https://apps.apple.com/hr/app/id6831230722">Preuzmi Leapstone iz App Storea</a> ili <a href="/play/">igraj u pregledniku</a>.</p>
    </section>`;

export default {
  nav: "Pravila kineske dame",
  titel: "Pravila kineske dame i savjeti | Leapstone",
  beschrijving: "Kako se igra kineska dama: početak, koraci, skokovi i lanci skokova, kako pobijediti s 2, 3, 4 ili 6 igrača te savjeti. Igraj besplatno u pregledniku.",
  h1: "Pravila kineske dame",
  intro: "Prebaci svih 10 svojih figura preko zvjezdaste ploče u suprotni krak prije nego itko drugi. Pravila ukratko, sa slikama, i nekoliko savjeta.",
  inhoud,
};
