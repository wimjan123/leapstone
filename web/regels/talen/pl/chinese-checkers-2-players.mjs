// Polski poradnik „Trylma dla 2 graczy”, taak 134. Inhoud: ../en/chinese-checkers-2-players.mjs (regels uit crates/halma-core,
// zie docs/plan.md, taak 122), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak zaczyna się gra</h2>
      <p>Każdy gracz ma 10 pionków. Na początku stoją w dwóch ramionach gwiazdy zwróconych do siebie: czerwone na dole, niebieskie u góry. Te 20 pionków stoi na planszy ze 121 polami.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 10 czerwonymi pionkami w dolnym ramieniu i 10 niebieskimi pionkami w górnym ramieniu",
  tekst: "Czerwony zaczyna na dole, niebieski u góry.",
})}
      <p>Pierwszy rusza gracz 1, czerwony. Potem gracie na zmianę, każdy po jednym ruchu. Ruch to jeden krok albo seria skoków jednym pionkiem. Kroki i skoki opisują <a href="/pl/zasady/trylma">zasady trylmy (chińskich warcabów)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Twoim celem jest start drugiego gracza</h2>
      <p>Wygrywasz, gdy przeniesiesz wszystkie 10 swoich pionków do ramienia, w którym zaczął drugi gracz. To ramię na początku jest pełne jego pionków, a twoje pełne twoich. Dla czerwonego to górne ramię na obrazku powyżej.</p>
      <p>Możesz lądować tylko na pustym polu, więc każde z was musi opuścić swoje ramię, zanim drugie zdoła je wypełnić. Żadne z was nie może skończyć, dopóki w celu zostaje pionek drugiego. A ponieważ przechodzicie przez ten sam środek w przeciwnych kierunkach, pionki drugiego gracza są stopniami dla ciebie, a twoje dla niego. Co z tym zrobić, przeczytasz we <a href="/pl/poradniki/trylma-strategia">wskazówkach o strategii</a>.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Wygrana i poddanie się</h2>
      <ul>
        <li><strong>Wygrana:</strong> wygrywa ten, kto pierwszy wypełni cel wszystkimi 10 pionkami, i gra od razu się kończy. Drugi gracz nie gra dalej.</li>
        <li><strong>Poddanie się:</strong> twoje pionki znikają z planszy i wygrywa drugi gracz.</li>
        <li><strong>Czas (online):</strong> w grze online każdy ruch ma limit czasu. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Czym różni się gra w 3, 4 i 6 graczy</h2>
      <ul>
        <li><strong>3 graczy:</strong> pionki stoją w co drugim ramieniu, a trzy cele na początku są puste. Wygrywa ten, kto skończy pierwszy; pozostali grają dalej o kolejne miejsca, a gracz, który już skończył, jest pomijany.</li>
        <li><strong>4 graczy:</strong> dwie pary ramion obok siebie. Twój cel na początku jest pełny pionków innego gracza. Gra toczy się dalej po pierwszym, który skończył, tak jak przy 3.</li>
        <li><strong>6 graczy:</strong> wszystkie sześć ramion. Na planszy jest 60 pionków, wobec 20 przy 2 graczach.</li>
      </ul>
      <p>Przy zaledwie 20 pionkach na planszy jest mniej pionków do przeskakiwania, więc drabinki, które sam budujesz, liczą się bardziej. Na <a href="/pl/zasady/trylma">stronie z zasadami</a> są obrazki każdego ustawienia początkowego.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdzie grać w 2 osoby w Leapstone</h2>
      <ul>
        <li><strong>Z komputerem, od razu:</strong> otwórz <a href="/play/">Leapstone w przeglądarce</a>, stuknij Komputer i wybierz planszę gwiazdową. Domyślnie jest jeden komputer, więc to gra dla 2. Wybierasz poziom Łatwy, Normalny lub Trudny i jesteś graczem 1, więc ruszasz pierwszy. Łatwy wybiera najlepszy z trzech losowych ruchów. Normalny wybiera ruch, który najbardziej przybliża do celu. Trudny patrzy też, jak mogą odpowiedzieć jego przeciwnicy, i na swój następny ruch.</li>
        <li><strong>Online, w aplikacji:</strong> szybka gra na planszy gwiazdowej dla 2 graczy, z innym graczem na twoim poziomie, po 30 sekund na ruch. Niektórzy przeciwnicy online mogą być graczami komputerowymi.</li>
        <li><strong>Ze znajomym:</strong> wyślij link z zaproszeniem i sam ustaw czas na ruch. Albo podawajcie sobie jeden telefon.</li>
      </ul>
      <p><a href="/pl/poradniki/trylma-online-z-przyjaciolmi">Trylma online ze znajomymi</a></p>
      <p><a href="/pl/poradniki/trylma-dla-trzech-graczy">Trylma dla 3 graczy</a></p>
    </section>`;

export default {
  nav: "Trylma dla 2 graczy",
  titel: "Trylma dla 2 graczy: ustawienie i zasady | Leapstone",
  beschrijving: "Jak działa trylma (chińskie warcaby) dla 2 graczy: gdzie zaczyna 10 pionków, kto rusza pierwszy, jak wygrać lub się poddać i gdzie zagrać za darmo.",
  h1: "Trylma (chińskie warcaby) dla 2 graczy",
  intro: "Jak wygląda gra we dwoje na planszy gwiazdowej: ustawienie, kto rusza pierwszy, jak się wygrywa i gdzie można zagrać.",
  inhoud,
};
