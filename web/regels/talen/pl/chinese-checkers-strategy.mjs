// Polski poradnik „Strategia w trylmie”, taak 134. Inhoud: ../en/chinese-checkers-strategy.mjs (elke tip is nagelopen
// tegen crates/halma-core, zie docs/plan.md, taak 122), zin voor zin in het Pools. Verandert een tip, verander dan beide.
// Geen verzonnen "experts", cijfers of geschiedenis. Het enige getal is 16 (stappen van punt tot punt), dat het voorbeeld natelt.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Na czym opierają się te wskazówki</h2>
      <p>Wskazówki wynikają z <a href="/pl/zasady/trylma">zasad trylmy (chińskich warcabów)</a> w takiej postaci, w jakiej gra w nią Leapstone: jeden ruch to jeden krok albo seria skoków, a skakać można przez pionek w każdym kolorze. To nie jest dowód najlepszej gry. Najszybciej wypróbujesz je, grając z komputerem.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Buduj drabinki</h2>
      <p>Drabinka to linia pionków z jednym pustym polem między każdymi dwoma. Pionek na jednym końcu przeskakuje całą linię w jednym ruchu, więc przechodzi przez planszę w jednej kolejce, a nie po jednym polu na kolejkę.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Cztery pionki w ukośnej linii z pustym polem między każdymi dwoma. Czerwony pionek na jednym końcu przeskakuje przez wszystkie cztery, z czterema ponumerowanymi polami lądowania.",
  tekst: "Cztery skoki w jednym ruchu. Ten sam pionek mógłby iść tylko po jednym polu naraz.",
})}
      <p>Skok działa we wszystkich sześciu kierunkach, także do tyłu, więc drabinka nie musi zaczynać się w twoim ramieniu. Wystarczy każda linia pionków z przerwami między nimi.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Trzymaj pionki razem</h2>
      <p>Wszystkie 10 pionków musi znaleźć się w twoim celu, więc to ostatni pionek decyduje, kiedy skończysz. Pionek, obok którego nie ma żadnego pionka, nie ma przez co skakać i może tylko robić kroki.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z czerwonym pionkiem samotnie stojącym w dolnym ramieniu. Zaznaczone są tylko jego dwa puste sąsiednie pola. Inne czerwone i niebieskie pionki stoją na środku.",
  tekst: "Ten pionek nie ma sąsiada, więc może zrobić krok tylko na dwa zaznaczone pola.",
})}
      <p>Od czubka twojego ramienia do czubka celu po drugiej stronie planszy jest 16 kroków. To 16 kolejek dla jednego pionka idącego samotnie, podczas gdy drabinka przechodzi przez planszę w jednej. Rusz pionki z tyłu, póki wokół nich są jeszcze pionki, przez które można skakać. Komputer w Leapstone też tak robi: ruchy swoich najbardziej cofniętych pionków ocenia trochę wyżej.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Korzystaj ze środka</h2>
      <p>Pionek na środku planszy ma sześciu sąsiadów, więc może robić kroki i skakać we wszystkich sześciu kierunkach. Pionek na brzegu ma ich mniej. Pionek na brzegu na obrazku ma czterech.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z jednym czerwonym pionkiem na środku z sześcioma zaznaczonymi sąsiednimi polami i jednym czerwonym pionkiem blisko lewego górnego brzegu z czterema zaznaczonymi sąsiednimi polami.",
  tekst: "Sześć sposobów na krok na środku, cztery na brzegu.",
})}
      <p>Pionki na środku dają też innym pionkom coś, przez co mogą skakać w drodze przez planszę.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Wypełniaj cel od tyłu</h2>
      <p>Twój cel to trójkąt z 10 pól, w rzędach po 4, 3, 2 i 1. Do pól z tyłu można dotrzeć tylko przez pola przed nimi. Jeśli najpierw wypełnisz przód, ostatni pionek może nie mieć drogi do środka.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Ramię celu u góry z dziewięcioma czerwonymi pionkami i jednym pustym polem na samym końcu, zaznaczonym kreskami. Dziesiąty czerwony pionek, z białym kółkiem, stoi pod przednim rzędem.",
  tekst: "Dziewięć pionków jest w domu, a pole z tyłu jest puste. Dziesiąty pionek nie ma ruchu na to pole.",
})}
      <p>Wstawiaj pierwsze pionki na pola z tyłu i posuwaj się ku przodowi, żeby przód został wolny dla pionków, które przyjdą ostatnie.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Nie zamykaj pionka w swoim celu</h2>
      <p>Możesz się zatrzymać w ramieniu innego gracza, więc pionek innego gracza może znaleźć się w twoim celu. Wygrywasz tylko wtedy, gdy wszystkie 10 pól twojego celu zajmują twoje własne pionki. Jeśli taki pionek nie ma ruchu, nikt nie może nim ruszyć i nie możesz wygrać, dopóki nie zwolni się pole obok niego.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Ramię celu u góry z dziewięcioma czerwonymi pionkami i jednym niebieskim pionkiem na samym końcu, zaznaczonym białym kółkiem. Niebieski pionek jest otoczony czerwonymi pionkami.",
  tekst: "Niebieski pionek z tyłu nie ma ruchu, a czerwony nie może wypełnić celu.",
})}
      <p>Zostaw wolne pole obok takiego pionka, żeby mógł odejść. Komputer w Leapstone to uwzględnia: ruch, który zamyka pionek innego gracza w jego celu, dostaje niższą ocenę. Zasady nikogo nie zmuszają do opuszczenia twojego celu, więc inny gracz może też zostawić tam pionek celowo.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Zablokuj skok albo go zostaw</h2>
      <p>Skok wymaga pustego pola do lądowania. Zajmij to pole, a skoku nie ma. Przez dwa pionki z rzędu też nie da się przeskoczyć.</p>
      <p>Twoje pionki są też stopniami dla innego gracza. Na lewym obrazku niebieski przechodzi przez dwa czerwone pionki w jednym ruchu. Po prawej czerwony przesunął jeden pionek na pierwsze pole lądowania i niebieski może tylko zrobić krok.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Niebieski pionek i dwa czerwone pionki w jednej linii, za każdym z czerwonych puste pole. Strzałki pokazują dwa skoki niebieskiego pionka.",
          tekst: "Przed: niebieski może zrobić dwa skoki.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Ta sama linia po tym, jak czerwony przesunął dalszy pionek na pierwsze pole lądowania. Za niebieskim pionkiem stoją teraz dwa czerwone z rzędu.",
          tekst: "Po: czerwony przesunął jeden pionek. Niebieski nie ma skoku.",
        })}
      </div>
      <p>Ruch wydany na blokowanie to ruch niewydany na twój własny postęp, więc blokuj wtedy, gdy skok daje drugiemu graczowi więcej, niż dałby tobie twój ruch. Z drabinką jest odwrotnie: po twoim ruchu pierwszy rusza drugi gracz, więc jego pionek na jednym końcu skorzysta z twojej drabinki przed tobą. Na najtrudniejszym poziomie komputer przed wyborem ruchu patrzy na najlepszą odpowiedź każdego przeciwnika.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Co dalej</h2>
      <ul>
        <li><a href="/play/">Zagraj z komputerem w przeglądarce</a> i wypróbuj drabinkę.</li>
        <li><a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>: jak wygląda gra we dwoje.</li>
        <li><a href="/pl/zasady/trylma">Zasady trylmy (chińskich warcabów)</a>, z obrazkami kroków, skoków i serii.</li>
      </ul>
      <p><a href="/pl/poradniki/trylma-online-z-przyjaciolmi">Trylma online ze znajomymi</a></p>
      <p><a href="/pl/poradniki/halma-czy-trylma">Halma czy trylma</a></p>
      <p><a href="/pl/poradniki/trylma-dla-trzech-graczy">Trylma dla 3 graczy</a></p>
    </section>`;

export default {
  nav: "Strategia w trylmie",
  titel: "Strategia w trylmie: 6 wskazówek z obrazkami | Leapstone",
  beschrijving: "Strategia w trylmie (chińskich warcabach): buduj drabinki, trzymaj pionki razem, korzystaj ze środka, wypełniaj cel od tyłu i blokuj skoki.",
  h1: "Strategia w trylmie (chińskich warcabach)",
  intro: "Sześć wskazówek dla planszy gwiazdowej, każda z obrazkiem z prawdziwych zasad: drabinki, maruderzy, środek, wypełnianie celu i blokowanie skoków.",
  inhoud,
};
