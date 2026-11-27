// De gids Halma tegenover trylma (chinese checkers) in het Pools, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Trylma: plansza gwiazdowa, 121 pól",
    alt: "Plansza gwiazdowa z 10 czerwonymi pionkami w dolnym ramieniu i 10 niebieskimi pionkami w górnym ramieniu",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: plansza kwadratowa, 256 pól",
    alt: "Kwadratowa plansza z 19 czerwonymi pionkami w lewym górnym rogu i 19 niebieskimi pionkami w prawym dolnym rogu",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Plansza gwiazdowa: sześciu sąsiadów, tu trzech z nich jest pustych",
    alt: "Czerwony pionek z białym kółkiem wokół. Trzy z jego sześciu sąsiednich pól są puste i zaznaczone; na pozostałych trzech stoją pionki.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Plansza kwadratowa: ośmiu sąsiadów, tu pięciu z nich jest pustych",
    alt: "Czerwony pionek z białym kółkiem wokół. Pięć z ośmiu jego sąsiednich pól jest pustych i zaznaczonych; na pozostałych trzech stoją pionki.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Krótka odpowiedź</h2>
      <p>W Halmę gra się na kwadratowej planszy, a w trylmę (chińskie warcaby) na planszy w kształcie sześcioramiennej gwiazdy. W obu grach przesuwasz pionki krokami i skokami przez planszę, a wygrywa ten, kto pierwszy wypełni obóz po drugiej stronie.</p>
      <p>Różni się plansza, kierunki ruchu, liczba osób, które mogą grać, i liczba pionków każdej z nich. <a href="/pl/zasady/sternhalma">Sternhalma</a> to nazwa Halmy na planszy gwiazdowej, więc to ta sama gra co trylma.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Plansze</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Trylma</strong> używa planszy gwiazdowej: 121 pól, z ramieniem o 10 polach na każdym z sześciu końców. Ramię to trójkąt z rzędów po 4, 3, 2 i 1 polu.</li>
        <li><strong>Halma</strong> używa planszy kwadratowej: 16 na 16 pól, razem 256. Obóz stoi w rogu. Duży obóz ma rzędy po 5, 5, 4, 3 i 2 pola, mały obóz rzędy po 4, 4, 3 i 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Kierunki: sześć albo osiem</h2>
      <p>Na planszy gwiazdowej pole ma sześciu sąsiadów. Na kwadratowej ma ich ośmiu, bo liczą się też przekątne. Krok prowadzi na puste sąsiednie pole. Skok przechodzi przez jeden pionek obok twojego, w linii prostej, na puste pole za nim, w każdym z tych kierunków, także do tyłu.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Pole na brzegu ma mniej sąsiadów, a róg planszy kwadratowej ma ich trzech. Sześć kierunków daje trzy linie przez pole na planszy gwiazdowej. Osiem kierunków daje cztery linie na planszy kwadratowej: poziomo, pionowo i dwie przekątne.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Gracze i pionki</h2>
      <ul>
        <li><strong>Trylma:</strong> 2, 3, 4 lub 6 graczy. Każdy ma 10 pionków, więc na planszy jest 20, 30, 40 lub 60 pionków.</li>
        <li><strong>Halma:</strong> 2 lub 4 graczy. Przy 2 graczach każdy ma 19 pionków, razem 38. Przy 4 graczach każdy ma 13 pionków, razem 52.</li>
      </ul>
      <p>Plansza kwadratowa nie ma w Leapstone gry dla 3 ani 6 graczy. Jeśli chcesz zagrać we troje, przeczytaj <a href="/pl/poradniki/trylma-dla-trzech-graczy">Trylma dla 3 graczy</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Co jest takie samo</h2>
      <ul>
        <li><strong>Ruch:</strong> jeden krok albo seria skoków jednym pionkiem. Sam decydujesz, gdzie seria się kończy, i po skoku nie możesz zrobić kroku.</li>
        <li><strong>Dowolny kolor:</strong> skaczesz przez pionek w dowolnym kolorze, także własny. Pionek, przez który skaczesz, zostaje na swoim miejscu. Nic nie jest zbijane.</li>
        <li><strong>Cel:</strong> obóz naprzeciwko tego, z którego zaczęły twoje pionki. Wszystkie jego pola muszą zajmować twoje własne pionki. Dopóki stoi tam pionek innego gracza, nie możesz skończyć.</li>
        <li><strong>Wygrana:</strong> wygrywa ten, kto pierwszy wypełni cel. Przy 2 graczach gra się wtedy kończy. Przy większej liczbie graczy pozostali grają dalej o kolejne miejsca, a gracz, który już skończył, jest pomijany.</li>
        <li><strong>Poddanie się i czas:</strong> gdy się poddajesz, twoje pionki znikają z planszy. W grze online każdy ruch ma limit czasu, a jeśli pominiesz 3 kolejki z rzędu, poddajesz się.</li>
      </ul>
      <p>Przeczytaj pełne zasady <a href="/pl/zasady/trylma">trylmy (chińskich warcabów)</a> i <a href="/pl/zasady/halma">Halmy</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Którą planszę wybrać w Leapstone</h2>
      <ul>
        <li><strong>3 lub 6 graczy:</strong> taką grę ma tylko plansza gwiazdowa.</li>
        <li><strong>Więcej pionków na gracza:</strong> plansza kwadratowa, z 19 pionkami na gracza przy 2 graczach albo 13 przy 4, wobec 10 na planszy gwiazdowej.</li>
        <li><strong>Graj online:</strong> szybka gra toczy się na planszy gwiazdowej. Ze znajomymi i z komputerem możesz wybrać każdą z plansz.</li>
      </ul>
      <p>Przycisk Graj teraz otwiera grę z komputerem na planszy gwiazdowej. Aby zagrać na planszy kwadratowej, stuknij strzałkę wstecz u góry i wybierz w menu Plansza kwadratowa.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Co dalej</h2>
      <ul>
        <li><a href="/play/">Graj w przeglądarce</a> i wypróbuj obie plansze.</li>
        <li><a href="/pl/poradniki/trylma-strategia">Strategia w trylmie</a>: sześć wskazówek z obrazkami.</li>
        <li><a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>: jak wygląda gra we dwoje.</li>
      </ul>
      <p><a href="/pl/poradniki/trylma-online-z-przyjaciolmi">Trylma online ze znajomymi</a></p>
    </section>`;

export default {
  nav: "Halma czy trylma",
  titel: "Halma czy trylma: różnice | Leapstone",
  beschrijving: "Halma czy trylma (chińskie warcaby)? Plansza kwadratowa i gwiazdowa, sześć lub osiem kierunków, gracze i pionki oraz to, co jest takie samo.",
  h1: "Halma czy trylma (chińskie warcaby)",
  intro: "Dwie gry z jednym pomysłem: przenieś wszystkie pionki przez planszę na drugą stronę. Co je różni, co jest takie samo i gdzie zagrać w obie.",
  inhoud,
};
