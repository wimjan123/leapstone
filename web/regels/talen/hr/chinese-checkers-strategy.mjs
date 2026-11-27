// Hrvatski vodič Strategija kineske dame (taak 134): /hr/vodici/kineska-dama-strategija.
// Sadržaj: engleski vodič ../en/chinese-checkers-strategy.mjs, rečenicu po rečenicu na hrvatskom. Svaki savjet provjeren je prema crates/halma-core
// (vidi docs/plan.md, taak 122); slike dolaze iz crates/halma-core/examples/regelplaatjes.rs.
// Bez izmišljenih "stručnjaka", brojki ili povijesti. Jedini broj je 16 (koraka od kraka do kraka), koji primjer prebrojava.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Na čemu se ti savjeti temelje</h2>
      <p>Savjeti proizlaze iz <a href="/hr/pravila/kineska-dama">pravila kineske dame</a> onako kako ih Leapstone igra: jedan potez je jedan korak ili lanac skokova, a možeš preskočiti figuru bilo koje boje. Nisu dokaz najbolje igre. Najbrže ih isprobaš protiv računala.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Gradi ljestve</h2>
      <p>Ljestve su red figura s jednim praznim poljem između svake od njih. Figura na jednom kraju preskače cijeli red u jednom potezu, pa prijeđe ploču u jednom potezu umjesto po jedno polje.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Četiri figure u dijagonalnom redu s praznim poljem između svake. Crvena figura na jednom kraju preskače sve četiri, s četiri numerirana polja doskoka.",
  tekst: "Četiri skoka u jednom potezu. Ista figura inače bi mogla koraknuti samo jedno polje odjednom.",
})}
      <p>Skok radi u svih šest smjerova, i unatrag, pa ljestve ne moraju počinjati u tvojem kraku. Dobar je svaki red figura s razmacima među njima.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Drži figure na okupu</h2>
      <p>Trebaju ti svih 10 figura u cilju, pa tvoja zadnja figura odlučuje kad ćeš završiti. Figura koja nema figuru pokraj sebe nema što preskočiti i može samo koraknuti.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s jednom crvenom figurom sama u donjem kraku. Označena su samo njezina dva prazna susjedna polja. Druge crvene i plave figure stoje u sredini.",
  tekst: "Ova figura nema susjeda, pa može koraknuti samo na dva označena polja.",
})}
      <p>Od vrha tvojeg kraka do vrha cilja preko ploče ima 16 koraka. To je 16 poteza za jednu figuru samu, dok ljestve prijeđu isto u jednom. Pomiči figure straga dok oko njih još ima figura koje možeš preskočiti. Računalo u Leapstoneu radi isto: poteze svojih najzadnjih figura ocjenjuje malo višom ocjenom.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Koristi sredinu</h2>
      <p>Figura u sredini ploče ima šest susjeda, pa može koraknuti ili skočiti u svih šest smjerova. Figura na rubu ima ih manje. Figura na rubu na slici ima ih četiri.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s jednom crvenom figurom u sredini sa šest označenih susjeda i jednom crvenom figurom blizu gornjeg lijevog ruba s četiri označena susjeda.",
  tekst: "Šest načina za korak u sredini, četiri na rubu.",
})}
      <p>Figure u sredini daju i drugim figurama nešto što mogu preskočiti na putu preko ploče.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Ispuni cilj straga</h2>
      <p>Tvoj cilj je trokut od 10 polja, u redovima od 4, 3, 2 i 1. Do polja straga može se doći samo preko polja ispred njih. Ako prvo ispuniš prednji dio, zadnja figura možda neće imati put unutra.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Ciljni krak gore s devet crvenih figura i jednim praznim poljem sasvim straga, označenim crticama. Deseta crvena figura, s bijelim prstenom, stoji ispod prednjeg reda.",
  tekst: "Devet figura je kod kuće, a polje straga je prazno. Deseta figura nema potez u njega.",
})}
      <p>Prve figure stavi na zadnja polja i napreduj prema naprijed, tako da prednji dio ostane slobodan za figure koje stignu zadnje.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Ne zazidaj figuru u svojem cilju</h2>
      <p>Smiješ stati u krak drugog igrača, pa figura drugog igrača može završiti u tvojem cilju. Pobjeđuješ samo kad svih 10 polja tvojeg cilja drže tvoje figure. Ako ta figura nema potez, nitko je ne može pomaknuti i ne možeš pobijediti dok se ne otvori polje pokraj nje.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Ciljni krak gore s devet crvenih figura i jednom plavom figurom sasvim straga, označenom bijelim prstenom. Plavu figuru okružuju crvene figure.",
  tekst: "Plava figura straga nema potez, a crveni ne može ispuniti cilj.",
})}
      <p>Ostavi otvoreno polje pokraj takve figure da može otići. Računalo u Leapstoneu to uzima u obzir: potez koji zarobi figuru drugog igrača u njegovu cilju dobiva nižu ocjenu. Pravila nikoga ne tjeraju da napusti tvoj cilj, pa drugi igrač tamo može i namjerno parkirati figuru.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blokiraj skok ili ga ostavi</h2>
      <p>Za skok je potrebno prazno polje na koje se doskače. Ispuni to polje i skoka nema. Ni dvije figure zaredom ne mogu se preskočiti.</p>
      <p>Tvoje figure i drugom igraču služe kao odskočne daske. Na lijevoj slici plavi preko dvije crvene figure prelazi u jednom potezu. Na desnoj je crveni pomaknuo jednu figuru na prvo polje doskoka, a plavi može samo koraknuti.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Plava figura s dvije crvene figure u liniji, a iza svake je prazno polje. Strelice prikazuju dva skoka plave figure.",
          tekst: "Prije: plavi može napraviti dva skoka.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Ista linija nakon što je crveni svoju dalju figuru pomaknuo na prvo polje doskoka. Iza plave figure slijede dvije crvene figure zaredom.",
          tekst: "Poslije: crveni je pomaknuo jednu figuru. Plavi nema skok.",
        })}
      </div>
      <p>Potez potrošen na blokiranje je potez koji nije potrošen na vlastiti napredak, pa blokiraj kad skok drugom igraču daje više nego što bi tebi dao tvoj potez. Obrnuto vrijedi kad gradiš ljestve: nakon tvojeg poteza drugi igrač igra prvi, pa njegova figura na jednom kraju iskoristi tvoje ljestve prije tebe. Na najtežoj razini računalo pogleda najbolji odgovor svakog protivnika prije nego odabere potez.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Nastavi dalje</h2>
      <ul>
        <li><a href="/play/">Igraj protiv računala u pregledniku</a> i isprobaj ljestve.</li>
        <li><a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>: kako funkcionira igra u dvoje.</li>
        <li><a href="/hr/pravila/kineska-dama">Pravila kineske dame</a>, sa slikama koraka, skokova i lanaca.</li>
      </ul>
      <p><a href="/hr/vodici/kineska-dama-online-s-prijateljima">Kineska dama online s prijateljima</a></p>
      <p><a href="/hr/vodici/halma-ili-kineska-dama">Halma ili kineska dama</a></p>
      <p><a href="/hr/vodici/kineska-dama-za-3-igraca">Kineska dama za 3 igrača</a></p>
    </section>`;

export default {
  nav: "Strategija kineske dame",
  titel: "Strategija kineske dame: 6 savjeta sa slikama | Leapstone",
  beschrijving: "Strategija kineske dame: gradi ljestve, drži figure na okupu, koristi sredinu, ispuni cilj straga i znaj kad blokirati skok.",
  h1: "Strategija kineske dame",
  intro: "Šest savjeta za zvjezdastu ploču, svaki sa slikom iz pravih pravila: ljestve, zaostale figure, sredina, ispunjavanje cilja i blokiranje skokova.",
  inhoud,
};
