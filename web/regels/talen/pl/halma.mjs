// Polska strona z zasadami Halmy, taak 134. Inhoud: ../en/halma.mjs (gecontroleerd tegen crates/halma-core,
// zie docs/plan.md, taak 117), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 graczy: po 19 pionków",
    alt: "Kwadratowa plansza z 19 czerwonymi pionkami w lewym górnym rogu i 19 niebieskimi pionkami w prawym dolnym rogu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 graczy: po 13 pionków",
    alt: "Kwadratowa plansza z 13 pionkami w każdym z czterech rogów: czerwone w lewym górnym, niebieskie w prawym górnym, zielone w prawym dolnym i żółte w lewym dolnym",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Plansza</h2>
      <p>W Halmę gra się na kwadratowej planszy o wymiarach 16 na 16 pól, razem 256. Każde pole ma do ośmiu sąsiadów: czterech w linii prostej i czterech po przekątnej. Pole na brzegu ma ich mniej, a pole w rogu ma trzech.</p>
      <p>To jest kwadratowa plansza w Leapstone. Jeśli znasz grę na planszy gwiazdowej, przeczytaj o <a href="/pl/zasady/sternhalma">Sternhalmie</a> i <a href="/pl/zasady/trylma">zasadach trylmy (chińskich warcabów)</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Jak pionki stoją na początku</h2>
      <p>Halma jest dla 2 lub 4 graczy. Każdy gracz zaczyna z pionkami w obozie w rogu planszy. Obóz w przeciwległym rogu jest twoim celem.</p>
      <ul>
        <li><strong>2 graczy:</strong> po 19 pionków, w dwóch rogach naprzeciwko siebie. Obóz to pięć rzędów po 5, 5, 4, 3 i 2 pola.</li>
        <li><strong>4 graczy:</strong> po 13 pionków, po jednym obozie w każdym rogu. Obóz to cztery rzędy po 4, 4, 3 i 2 pola. Twoim celem jest róg po drugiej stronie planszy, po przekątnej.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Kolejność ruchów</h2>
      <p>Pierwszy zaczyna gracz 1. Potem ruchy idą po kolei, a po ostatnim graczu znowu gra gracz 1. W Leapstone kolory pasują do numerów: czerwony, niebieski, zielony i żółty.</p>
      <p>W swojej kolejce ruszasz jednym pionkiem, jeden raz. Nic się nie zbija: pionki zostają na planszy, dopóki ich gracz się nie podda.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Przesuń pionek na puste pole obok niego, w dowolnym z ośmiu kierunków: w linii prostej lub po przekątnej.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Czerwony pionek z białym kółkiem wokół. Pięć z ośmiu jego sąsiednich pól jest pustych i zaznaczonych; na pozostałych trzech stoją pionki.",
  tekst: "Czerwony pionek może zrobić krok na pięć zaznaczonych pól. Pozostałe trzy pola obok są zajęte.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Przeskocz przez jeden pionek obok twojego, w dowolnym kolorze, i wyląduj na pustym polu tuż za nim, w linii prostej. Możesz skakać we wszystkich ośmiu kierunkach, także po przekątnej i do tyłu.</p>
      <ul>
        <li>Pole, na którym lądujesz, musi być puste.</li>
        <li>Nie możesz przeskoczyć przez dwa pionki z rzędu ani przez puste pole.</li>
        <li>Pionek, przez który skaczesz, zostaje na swoim miejscu.</li>
        <li>Nie możesz przeskoczyć przez brzeg planszy.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Czerwony pionek przeskakuje po przekątnej przez niebieski pionek na puste pole za nim, co pokazuje strzałka.",
  tekst: "Czerwony pionek przeskakuje po przekątnej przez niebieski.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Seria skoków</h2>
      <p>Po skoku ten sam pionek może skoczyć jeszcze raz, tyle razy, ile się da, w dowolnym kierunku, w linii prostej lub po przekątnej. Sam decydujesz, gdzie się zatrzymać. Wszystkie skoki razem to jeden ruch.</p>
      <ul>
        <li>W jednym ruchu nie możesz wylądować dwa razy na tym samym polu.</li>
        <li>Ruch to jeden krok albo jeden skok lub kilka skoków. Po skoku nie możesz zrobić kroku.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Czerwony pionek robi trzy skoki w jednym ruchu: po przekątnej przez niebieski pionek, w linii prostej przez inny niebieski pionek i po przekątnej przez czerwony pionek. Trzy pola lądowania mają numery 1, 2 i 3.",
  tekst: "Jeden ruch z trzema skokami, w kolejności numerów.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cel gry</h2>
      <p>Wygrywasz, gdy przeniesiesz wszystkie swoje pionki do obozu naprzeciwko tego, z którego zaczęły. Każde pole tego obozu musi zajmować twój własny pionek: 19 przy 2 graczach, 13 przy 4 graczach. Dopóki stoi tam pionek innego gracza, nie możesz skończyć.</p>
      <p>Możesz lądować na dowolnym pustym polu, także w obozach innych graczy. Pionek, który stoi w twoim celu, może go znowu opuścić; nic go nie blokuje.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Kwadratowa plansza dla dwóch graczy. Czerwony zaczyna w lewym górnym rogu; obóz w prawym dolnym rogu, zaznaczony przerywanymi kółkami i zajęty przez niebieskie pionki, jest celem czerwonego.",
  tekst: "Przy 2 graczach celem czerwonego jest obóz, w którym zaczyna niebieski.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Przy 2 lub 4 graczach</h2>
      <ul>
        <li><strong>2 graczy:</strong> wygrywa ten, kto pierwszy wypełni cel, i gra się kończy.</li>
        <li><strong>4 graczy:</strong> wygrywa ten, kto pierwszy wypełni cel. Pozostali grają dalej o kolejne miejsca, a gracz, który już skończył, jest pomijany. Gra kończy się, gdy gra już tylko jeden gracz.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Poddanie się</h2>
      <p>Gdy się poddajesz, twoje pionki znikają z planszy, więc nikomu nie przeszkadzają. Przy 2 graczach wygrywa drugi gracz. Przy 4 graczach gra toczy się dalej bez ciebie, a jeśli poddadzą się wszyscy oprócz jednego, wygrywa ostatni gracz.</p>
      <p>W grze online każdy ruch ma limit czasu. Ustawia go gracz, który zaczyna grę. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się. Gry z komputerem i na jednym telefonie nie mają limitu czasu.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Wskazówki</h2>
      <ul class="tips">
        <li><strong>Buduj drabinki.</strong> Ustaw pionki w linii z jednym pustym polem między nimi, prostej lub po przekątnej, w stronę swojego celu. Wtedy jeden pionek może przeskoczyć całą linię w jednym ruchu.</li>
        <li><strong>Każdy pionek to drabinka.</strong> Możesz skakać przez pionki w każdym kolorze, więc pionki innych graczy pomagają także tobie. A twoje drabinki pomagają im: patrz, co po sobie zostawiasz.</li>
        <li><strong>Korzystaj z przekątnych.</strong> Cel jest w przeciwległym rogu, więc ukośna linia pionków to najszybsza droga przez planszę.</li>
        <li><strong>Nie zapominaj o maruderach.</strong> Wszystkie pionki muszą dotrzeć do domu. Pionek daleko w tyle, który nie ma przez co skakać, rusza się o jedno pole na kolejkę. Podciągnij go, póki inne pionki są jeszcze wokół niego.</li>
        <li><strong>Twój start to ich cel.</strong> Przy 2 graczach twój obóz jest celem drugiego gracza i nie może on skończyć, dopóki stoi tam choć jeden twój pionek. W Leapstone możesz zostawić pionek w domu, więc możesz w ten sposób blokować. To samo dotyczy ciebie.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pytania</h2>
      <h3>Ile osób może grać w Halmę?</h3>
      <p>Dwie lub cztery. W Halmę gra się na kwadratowej planszy o wymiarach 16 na 16 pól, a każdy gracz zaczyna w rogu.</p>
      <h3>Ile pionków ma każdy gracz w Halmie?</h3>
      <p>Przy 2 graczach po 19 pionków, a przy 4 graczach po 13.</p>
      <h3>Kto wymyślił Halmę?</h3>
      <p>George Howard Monks, amerykański chirurg, w 1883 lub 1884 roku. Nazwa po grecku oznacza &bdquo;skok&rdquo;. Więcej przeczytasz w artykule <a href="/pl/zasady/sternhalma">Sternhalma</a>.</p>
      <h3>Czym różni się Halma od trylmy (chińskich warcabów)?</h3>
      <p>Halma ma kwadratową planszę, kroki i skoki w ośmiu kierunkach oraz 19 lub 13 pionków na gracza. Trylma ma planszę w kształcie gwiazdy, sześć kierunków i 10 pionków na gracza, dla 2, 3, 4 lub 6 graczy.</p>
      <h3>Czy można grać w Halmę online za darmo?</h3>
      <p>Tak, w Leapstone, w przeglądarce albo w aplikacji z App Store. Wybierz sposób gry, na przykład z komputerem albo online ze znajomymi, a potem stuknij Planszę kwadratową. Leapstone jest darmowy i bez reklam.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Zagraj</h2>
      <p>Przycisk Graj teraz otwiera grę z komputerem na <a href="/pl/zasady/trylma">planszy gwiazdowej</a>. Aby zagrać w Halmę, stuknij strzałkę wstecz u góry, potem wybierz Graj na tym telefonie, Graj z komputerem lub Graj online ze znajomymi i stuknij Planszę kwadratową.</p>
    </section>`;

export default {
  nav: "Zasady Halmy",
  titel: "Zasady Halmy i wskazówki | Leapstone",
  beschrijving: "Jak grać w Halmę na kwadratowej planszy 16 na 16: ustawienie, kroki, skoki, serie skoków, jak wygrać i wskazówki. Graj za darmo w przeglądarce.",
  h1: "Zasady Halmy",
  intro: "Przenieś wszystkie swoje pionki przez kwadratową planszę do przeciwległego rogu, zanim zrobi to ktokolwiek inny. Zasady w skrócie, z obrazkami, i kilka wskazówek.",
  inhoud,
};
