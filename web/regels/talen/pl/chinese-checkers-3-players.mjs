// Polski poradnik „Trylma dla 3 graczy”, taak 299. Inhoud: ../en/chinese-checkers-3-players.mjs (regels uit crates/halma-core,
// zie docs/plan.md, taak 139), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak zaczyna się gra</h2>
      <p>Każdy gracz ma 10 pionków, więc na planszy ze 121 polami stoi 30 pionków. Zaczynają w co drugim ramieniu gwiazdy: czerwone na dole, niebieskie w lewym górnym, zielone w prawym górnym. Trzy ramiona pomiędzy nimi są puste.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 10 czerwonymi pionkami w dolnym ramieniu, 10 niebieskimi pionkami w lewym górnym ramieniu i 10 zielonymi pionkami w prawym górnym ramieniu",
  tekst: "Czerwony na dole, niebieski w lewym górnym, zielony w prawym górnym.",
})}
      <p>Pierwszy rusza gracz 1, czerwony. Potem niebieski to gracz 2, zielony to gracz 3, a po zielonym znów czerwony. Ruch to jeden krok albo seria skoków jednym pionkiem. Kroki i skoki opisują <a href="/pl/zasady/trylma">zasady trylmy (chińskich warcabów)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Trzy cele, wszystkie puste na początku</h2>
      <p>Twoim celem jest ramię naprzeciw tego, z którego startujesz, a przy 3 graczach na początku jest ono puste. To puste ramię między ramionami startowymi dwóch pozostałych graczy: cel czerwonego jest u góry, niebieskiego w prawym dolnym, a zielonego w lewym dolnym.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza dla trzech graczy. Przerywane kółka w kolorze każdego gracza oznaczają trzy puste cele: czerwony u góry, niebieski w prawym dolnym, zielony w lewym dolnym.",
  tekst: "Każdy cel ma kolor swojego gracza.",
})}
      <p>Wygrywasz, gdy przeniesiesz wszystkie 10 swoich pionków do celu. Wszystkie 10 pól musi zajmować twoje własne pionki. Nikt nie zaczyna w twoim celu, ale możesz zatrzymać się na każdym pustym polu, więc pionek innego gracza może tam później wylądować. Dopóki tam stoi, nie możesz skończyć.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Wygrana i co dzieje się potem</h2>
      <ul>
        <li><strong>Wygrana:</strong> wygrywa pierwszy gracz, który wypełni cel. Gra się na tym nie kończy: pozostali dwaj grają dalej o kolejne miejsca, a gracz, który już skończył, jest pomijany. Gra kończy się, gdy gra już tylko jeden gracz.</li>
        <li><strong>Poddanie się:</strong> twoje pionki znikają z planszy, a pozostali dwaj grają dalej. Jeśli drugi gracz podda się, zanim ktokolwiek skończy, wygrywa ostatni gracz, który został.</li>
        <li><strong>Czas (online):</strong> w grze online każdy ruch ma limit czasu, który ustawia gracz zaczynający grę. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się, a gra toczy się dalej bez ciebie.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Czym różni się od gry we dwoje</h2>
      <ul>
        <li><strong>Więcej pionków:</strong> 30 na planszy, wobec 20 przy 2 graczach.</li>
        <li><strong>Puste cele:</strong> przy 2 graczach twój cel na początku jest pełny pionków drugiego gracza. Przy 3 jest pusty.</li>
        <li><strong>Dwaj przeciwnicy:</strong> po twoim ruchu ruszają się dwaj inni gracze, zanim znów przyjdzie twoja kolej. Pionki obu są dla ciebie stopniami, a twoje dla nich. Drabinkę, którą zbudujesz, mogą wykorzystać obaj, a gracz po tobie ma pierwszeństwo.</li>
        <li><strong>Gra toczy się dalej:</strong> przy 2 graczach gra kończy się, gdy jedno z was skończy. Przy 3 toczy się dalej o drugie i trzecie miejsce.</li>
      </ul>
      <p>O grze we dwoje przeczytasz w poradniku <a href="/pl/poradniki/trylma-dla-dwoch-graczy">trylma dla 2 graczy</a>. <a href="/pl/poradniki/trylma-strategia">Wskazówki o strategii</a> dotyczą kroków i skoków, które przy 3 graczach są takie same.</p>
      <p><a href="/pl/poradniki/trylma-online-z-przyjaciolmi">Trylma online ze znajomymi</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdzie grać w 3 osoby w Leapstone</h2>
      <ul>
        <li><strong>Z komputerem, od razu:</strong> otwórz <a href="/play/">Leapstone w przeglądarce</a>, stuknij Komputer, wybierz planszę gwiazdową i 2 komputery. Jesteś graczem 1, więc ruszasz pierwszy. Dla komputerów wybierasz poziom Łatwy, Normalny lub Trudny.</li>
        <li><strong>Na jednym telefonie:</strong> stuknij „Na tym telefonie”, wybierz planszę gwiazdową i 3 graczy, a potem stuknij pionek, by zmienić to miejsce między osobą a komputerem.</li>
        <li><strong>Online ze znajomymi:</strong> stuknij Znajomi, wybierz planszę gwiazdową, 3 graczy i czas na ruch, i wyślij link z zaproszeniem. Gra zaczyna się, gdy wszystkie 3 miejsca są zajęte.</li>
        <li><strong>Szybkie gry:</strong> Graj online znajduje gry dla 2 lub 4 graczy, więc nie ma szybkiej gry dla 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Trylma dla 3 graczy",
  titel: "Trylma dla 3 graczy: ustawienie i zasady | Leapstone",
  beschrijving: "Jak działa trylma (chińskie warcaby) dla 3 graczy: gdzie zaczyna 30 pionków, które puste ramię to cel, kto rusza pierwszy i jak wygrać.",
  h1: "Trylma (chińskie warcaby) dla 3 graczy",
  intro: "Jak wygląda gra we troje na planszy gwiazdowej: ustawienie, trzy cele, kto rusza pierwszy, jak się wygrywa i gdzie można zagrać.",
  inhoud,
};
