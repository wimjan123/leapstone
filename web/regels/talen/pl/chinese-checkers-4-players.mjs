// Polski poradnik „Trylma dla 4 graczy”, taak 301 (feature 294): /pl/poradniki/trylma-dla-czterech-graczy. Inhoud: ../en/chinese-checkers-4-players.mjs
// (regels uit crates/halma-core, zie docs/plan.md, taak 301), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Jak podzielona jest plansza</h2>
      <p>Każdy gracz ma 10 pionków, więc na planszy ze 121 polami stoi 40 pionków. Cztery ramiona startowe to dwie pary ramion obok siebie: czerwony na dole i niebieski w lewym dolnym rogu, zielony u góry i żółty w prawym górnym rogu.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 10 czerwonymi pionkami w dolnym ramieniu, 10 niebieskimi pionkami w lewym dolnym ramieniu, 10 zielonymi pionkami w górnym ramieniu i 10 żółtymi pionkami w prawym górnym ramieniu. Lewe górne i prawe dolne ramię są puste.",
  tekst: "Czerwony na dole, niebieski w lewym dolnym rogu, zielony u góry, żółty w prawym górnym rogu.",
})}
      <p>Pierwszy rusza gracz 1, czerwony. Potem niebieski jest graczem 2, zielony graczem 3, żółty graczem 4, a po żółtym znów jest kolej czerwonego. Ruch to jeden krok albo seria skoków jednym pionkiem. Kroki i skoki opisują <a href="/pl/zasady/trylma">zasady trylmy</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kto naprzeciw kogo</h2>
      <p>Ramiona tworzą pary naprzeciw siebie: czerwony naprzeciw zielonego, a niebieski naprzeciw żółtego. Twoim celem jest ramię po przeciwnej stronie. Czerwony idzie tam, gdzie zaczyna zielony, zielony tam, gdzie zaczyna czerwony, niebieski tam, gdzie zaczyna żółty, a żółty tam, gdzie zaczyna niebieski.</p>
      <p>Tak jak w grze dla 2, każdy cel na początku jest pełny pionków gracza naprzeciw ciebie, więc możesz tam wylądować dopiero po ich odejściu. Przy 3 graczach cele na początku są puste, więc przy 4 nikt nie może skończyć od razu. Cztery cele to cztery różne ramiona, więc nikt inny nie chce twojego celu: gracz, który skończył, nikomu nie przeszkadza.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dwa puste ramiona</h2>
      <p>Lewe górne i prawe dolne ramię nie mają pionków. Nie są niczyim startem ani niczyim celem. Lewe górne leży między niebieskim a zielonym, a prawe dolne między żółtym a czerwonym.</p>
      <p>Możesz wejść krokiem lub skokiem na każde puste pole, więc możesz przejść przez te ramiona albo się w nich zatrzymać. Pionek tam nie jest jeszcze w celu. W pustym ramieniu nie ma nad czym skakać, dopóki ktoś nie przyniesie tam pionków.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Co się zmienia w twojej taktyce</h2>
      <ul>
        <li><strong>Dwa przejścia naraz:</strong> czerwony i zielony przechodzą przez planszę ku sobie, i niebieski z żółtym też. Obie linie biegną przez środek, więc środek jest bardziej zatłoczony niż w grze dla 2, w której przechodzi tylko jedna linia.</li>
        <li><strong>Trzech graczy rusza między twoimi ruchami:</strong> plansza zmienia się między twoimi dwoma ruchami bardziej niż w grze dla 2. Spójrz na nią od nowa na początku każdej tury i dopiero wtedy zaplanuj serię skoków. Gracz, który rusza po tobie, nigdy nie jest tym, który siedzi naprzeciw ciebie.</li>
        <li><strong>Pionki pomagają wszystkim:</strong> każdy pionek pozostałych trzech jest dla ciebie stopniem, a twoje są stopniami dla nich. Pionki gracza naprzeciw idą w przeciwną stronę, tak jak w grze dla 2.</li>
        <li><strong>Miejsce na obejście:</strong> gdy środek jest pełny, puste ramiona to wolna przestrzeń obok obozów. Droga przez takie ramię może być objazdem tłumu.</li>
        <li><strong>Gracz, który się poddał, zwalnia twój cel:</strong> gdy gracz naprzeciw ciebie się podda, jego pionki znikają z planszy, więc twój cel od razu jest pusty.</li>
      </ul>
      <p><a href="/pl/poradniki/trylma-strategia">Wskazówki o strategii</a> dotyczące drabinek, maruderów i wypełniania celu od tyłu są takie same przy 4 graczach.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Wygrana i to, co dzieje się potem</h2>
      <ul>
        <li><strong>Wygrana:</strong> wygrywa ten, kto pierwszy wypełni cel wszystkimi 10 pionkami. Gra się na tym nie kończy: pozostali trzej grają dalej o kolejne miejsca, a gracz, który skończył, jest pomijany. Pionki tego gracza zostają na planszy. Gra się kończy, gdy gra już tylko jeden gracz.</li>
        <li><strong>Poddanie się:</strong> twoje pionki znikają z planszy, a pozostali trzej grają dalej. Jeśli poddadzą się też pozostali, wygrywa ostatni gracz, który został.</li>
        <li><strong>Czas (online):</strong> w grze online każdy ruch ma limit czasu. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się, a gra toczy się dalej bez ciebie.</li>
      </ul>
      <p>O grach z mniejszą liczbą graczy przeczytasz w poradniku <a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>. Na <a href="/pl/zasady/trylma">stronie z zasadami</a> są obrazki każdego ustawienia początkowego.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Gdzie grać w 4 osoby w Leapstone</h2>
      <ul>
        <li><strong>Z komputerem, od razu:</strong> otwórz <a href="/play/">Leapstone w przeglądarce</a>, stuknij Komputer, wybierz planszę gwiazdową i 3 komputery. Jesteś graczem 1, więc ruszasz pierwszy. Dla komputerów wybierasz poziom Łatwy, Normalny lub Trudny.</li>
        <li><strong>Na jednym telefonie:</strong> stuknij Graj, wybierz planszę gwiazdową i 4 graczy, a potem stuknij pionek, żeby zmienić to miejsce między człowiekiem a komputerem.</li>
        <li><strong>Online ze znajomymi:</strong> stuknij Znajomi, wybierz planszę gwiazdową, 4 graczy i czas na ruch, i wyślij link z zaproszeniem. Gra zaczyna się, gdy zajęte są wszystkie 4 miejsca.</li>
        <li><strong>Szybka gra, w aplikacji:</strong> stuknij Graj online. Gdy aplikacja szuka gry dla 2, stuknij Szukaj 4 lub 6 graczy, żeby zamiast tego szukać gry dla 4. Każdy ruch trwa 30 sekund. Jeśli w ciągu 20 sekund dołączy za mało graczy, puste miejsca zapełniają gracze komputerowi, więc niektórzy przeciwnicy mogą być graczami komputerowymi.</li>
      </ul>
    </section>`;

export default {
  nav: "Trylma dla 4 graczy",
  titel: "Trylma dla 4 graczy: ustawienie i wskazówki | Leapstone",
  beschrijving: "Jak działa trylma (chińskie warcaby) dla 4 graczy: jak podzielona jest plansza, które 2 ramiona są puste, kto naprzeciw kogo, taktyka i gdzie zagrać.",
  h1: "Trylma (chińskie warcaby) dla 4 graczy",
  intro: "Przy 4 graczach każdy z was zaczyna w jednym z czterech ramion gwiazdy, a dwa ramiona zostają puste. Czerwony stoi naprzeciw zielonego, a niebieski naprzeciw żółtego: twoim celem jest ramię po przeciwnej stronie, pełne pionków tego gracza. Oto ustawienie, puste ramiona, taktyka i miejsca, w których możesz zagrać.",
  inhoud,
};
