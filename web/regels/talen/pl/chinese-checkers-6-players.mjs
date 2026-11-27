// Polski poradnik „Trylma dla 6 graczy”, taak 302 (feature 294): /pl/poradniki/trylma-dla-szesciu-graczy. Inhoud: ../en/chinese-checkers-6-players.mjs
// (regels uit crates/halma-core, zie docs/plan.md, taak 302), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak zaczyna się gra</h2>
      <p>Każdy gracz ma 10 pionków i wszystkie 6 ramion gwiazdy jest w grze. Na planszy ze 121 polami stoi więc 60 pionków. 61 pól pośrodku jest na początku pustych.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 10 pionkami w każdym z 6 ramion, w 6 kolorach",
  tekst: "6 graczy, 6 ramion, 60 pionków.",
})}
      <p>Pierwszy rusza gracz 1, czerwony, z dolnego ramienia. Potem kolejka przechodzi od gracza 1 do gracza 6, a po graczu 6 znów jest gracz 1. Gracze są ponumerowani w kolejności swoich ramion wokół gwiazdy, więc gracz po tobie zawsze zaczyna w ramieniu obok twojego. Ruch to jeden krok albo seria skoków jednym pionkiem. Kroki i skoki opisują <a href="/pl/zasady/trylma">zasady trylmy (chińskich warcabów)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Każdy cel jest na początku pełny</h2>
      <p>Wygrywasz, gdy przeniesiesz wszystkie 10 swoich pionków do ramienia po drugiej stronie planszy. Przy 6 graczach to ramię, w którym zaczyna gracz naprzeciw ciebie, więc żaden cel nie jest pusty: każdy zaczyna pełny pionków innego gracza. Dla czerwonego celem jest górne ramię, w którym zaczyna gracz 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 6 pełnymi ramionami. Przerywany pierścień zaznacza górne ramię, cel czerwonego gracza, w którym stoją pionki gracza naprzeciw.",
  tekst: "Cel czerwonego to ramię naprzeciw, pełne pionków gracza 4.",
})}
      <p>Możesz lądować tylko na pustym polu, więc gracz naprzeciw musi opuścić swoje ramię, zanim je wypełnisz, a ty musisz opuścić swoje, zanim wypełni je on. W grze dla 2 osób na tym koniec. Przy 6 obaj gracze muszą jeszcze przebić się przez tłum 4 pozostałych.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Tłok pośrodku</h2>
      <p>Każdy cel jest po drugiej stronie planszy, a ramiona łączą się ze sobą tylko przez środek, więc wszystkie 60 pionków musi przejść przez te same 61 pól. Na początku nikt jeszcze nie przeszedł i środek szybko się zapełnia.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Czerwony pionek skacze trzy razy w jednym ruchu: przez niebieski pionek, potem zielony, potem fioletowy. Cyfry 1, 2 i 3 oznaczają pola lądowania.",
  tekst: "Pionki każdego koloru są stopniami.",
})}
      <p>Możesz przeskoczyć pionek dowolnego koloru. Pionki 5 pozostałych graczy są dla ciebie stopniami, a twoje są stopniami dla wszystkich 5. Rząd pionków, który zostawisz pośrodku, jest drabinką dla każdego, kto do niego dosięgnie, a gracz po tobie ma pierwszeństwo.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blokowanie przy 5 przeciwnikach</h2>
      <ul>
        <li><strong>Zajmij pole lądowania:</strong> skok wymaga pustego pola tuż za pionkiem. Gdy ustawisz tam pionek, skoku nie ma dla żadnego gracza, który go chciał.</li>
        <li><strong>Uważaj na drabinki, które budujesz:</strong> po twoim ruchu pozostałych 5 graczy rusza, zanim znów przyjdzie twoja kolej. Drabinka pomaga wszystkim.</li>
        <li><strong>Każdy może zablokować cel:</strong> pionek dowolnego innego gracza w twoim celu nie pozwala ci skończyć, nie tylko pionek gracza naprzeciw. Wszystkie 10 pól celu musi zajmować twoje własne pionki.</li>
      </ul>
      <p>Jak wygląda zablokowany skok i jak nie zamknąć pionka innego gracza we własnym celu, pokazują <a href="/pl/poradniki/trylma-strategia">wskazówki o strategii</a>.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Ile trwa gra</h2>
      <p>W grze dla 6 jest 60 pionków do przesunięcia, a między twoim ruchem a następnym każdy z 5 pozostałych graczy wykonuje jeden. Gra nie kończy się też, gdy pierwszy gracz skończy.</p>
      <ul>
        <li><strong>Wygrana i gra dalej:</strong> wygrywa pierwszy gracz, który wypełni cel, a pozostali grają dalej o kolejne miejsca. Gracz, który skończył, jest pomijany, a jego pionki zostają na planszy jako stopnie. Gra kończy się, gdy gra już tylko jeden gracz.</li>
        <li><strong>Poddanie się:</strong> twoje pionki znikają z planszy, więc już nikomu nie przeszkadzają ani nie pomagają, a pozostali grają dalej.</li>
        <li><strong>Czas (online):</strong> w grze online każdy ruch ma limit czasu, który ustawia gracz zaczynający grę: 15 sekund, 30 sekund, 1 minuta, 2 minuty albo bez limitu. Runda 6 ruchów trwa najwyżej 6 razy tyle, co limit, więc przy 30 sekundach to najwyżej 3 minuty. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się, a gra toczy się dalej bez ciebie.</li>
      </ul>
      <p>O grze z mniejszą liczbą graczy przeczytasz w poradniku <a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdzie grać w 6 osób w Leapstone</h2>
      <ul>
        <li><strong>Z komputerami, od razu:</strong> otwórz <a href="/play/">Leapstone w przeglądarce</a>, stuknij Komputer, wybierz planszę gwiazdową i 5 komputerów. Jesteś graczem 1, więc ruszasz pierwszy. Komputery ruszają się jeden po drugim, każdy z krótką pauzą, więc możesz śledzić każdy ruch. Dla komputerów wybierasz poziom Łatwy, Normalny lub Trudny.</li>
        <li><strong>Na jednym telefonie:</strong> stuknij Graj, wybierz planszę gwiazdową i 6 graczy, a potem stuknij pionek, aby przełączyć to miejsce między osobą a komputerem.</li>
        <li><strong>Online ze znajomymi:</strong> stuknij Znajomi, wybierz planszę gwiazdową, 6 graczy i czas na ruch, i wyślij link z zaproszeniem. Gra zaczyna się, gdy wszystkie 6 miejsc jest zajętych.</li>
        <li><strong>Szybkie gry:</strong> Graj online znajduje gry dla 2 lub 4 graczy, więc dla 6 nie ma szybkiej gry.</li>
      </ul>
    </section>`;

export default {
  nav: "Trylma dla 6 graczy",
  titel: "Trylma dla 6 graczy: cała plansza | Leapstone",
  beschrijving: "Jak działa trylma (chińskie warcaby) dla 6 graczy: pełna gwiazda 60 pionków, tłok pośrodku, blokowanie, czas trwania gry i gdzie zagrać.",
  h1: "Trylma (chińskie warcaby) dla 6 graczy",
  intro: "Jak działa gra dla 6: wszystkie 6 ramion jest pełnych, ścigasz się do ramienia po drugiej stronie planszy, a gra trwa dalej po tym, jak pierwszy gracz skończy.",
  inhoud,
};
