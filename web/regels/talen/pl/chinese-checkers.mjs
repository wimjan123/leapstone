// Polska strona z zasadami trylmy (chińskich warcabów), taak 134. Inhoud: ../en/chinese-checkers.mjs (gecontroleerd tegen crates/halma-core,
// zie docs/plan.md, taak 116), zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `Liczba graczy: ${n}`,
      alt:
        {
          2: "Gwiazdowa plansza z 10 czerwonymi pionkami w dolnym ramieniu i 10 niebieskimi pionkami w górnym ramieniu",
          3: "Gwiazdowa plansza: czerwone pionki na dole, niebieskie u góry po lewej i zielone u góry po prawej",
          4: "Gwiazdowa plansza z pionkami w czterech ramionach: czerwone na dole, zielone u góry, niebieskie na dole po lewej i żółte u góry po prawej",
          6: "Gwiazdowa plansza z pionkami we wszystkich sześciu ramionach, w sześciu kolorach",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Plansza</h2>
      <p>W trylmę (chińskie warcaby) gra się na gwieździe o sześciu ramionach. Plansza ma 121 pól, a w każdym ramieniu jest ich 10. Wewnątrz planszy każde pole ma sześciu sąsiadów.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Jak pionki stoją na początku</h2>
      <p>Każdy gracz ma 10 pionków i na początku ustawia je w jednym ramieniu gwiazdy. Ramię naprzeciwko twojego jest twoim celem.</p>
      <ul>
        <li><strong>2 graczy:</strong> dwa ramiona naprzeciwko siebie.</li>
        <li><strong>3 graczy:</strong> co drugie ramię. Trzy cele na początku są puste.</li>
        <li><strong>4 graczy:</strong> dwie pary ramion, które sąsiadują ze sobą. Naprzeciwko każdego gracza stoi inny gracz.</li>
        <li><strong>6 graczy:</strong> wszystkie sześć ramion.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Kolejność ruchów</h2>
      <p>Pierwszy zaczyna gracz 1. Potem ruchy idą po kolei: gracz 2, gracz 3 i tak dalej, a po ostatnim graczu znowu gra gracz 1. W Leapstone kolory pasują do numerów: czerwony, niebieski, zielony, żółty, fioletowy i srebrny.</p>
      <p>W swojej kolejce ruszasz jednym pionkiem, jeden raz. Nic się nie zbija: pionki zostają na planszy, dopóki ich gracz się nie podda.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Krok</h2>
      <p>Przesuń pionek na puste pole obok niego.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Czerwony pionek z białym kółkiem wokół. Trzy z jego sześciu sąsiednich pól są puste i zaznaczone; na pozostałych trzech stoją pionki.",
  tekst: "Czerwony pionek może zrobić krok na trzy zaznaczone pola. Pozostałe trzy pola obok są zajęte.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Skok</h2>
      <p>Przeskocz przez jeden pionek obok twojego, w dowolnym kolorze, i wyląduj na pustym polu tuż za nim, w linii prostej. Możesz skakać w każdym z sześciu kierunków, także do tyłu.</p>
      <ul>
        <li>Pole, na którym lądujesz, musi być puste.</li>
        <li>Nie możesz przeskoczyć przez dwa pionki z rzędu ani przez puste pole.</li>
        <li>Pionek, przez który skaczesz, zostaje na swoim miejscu.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Czerwony pionek przeskakuje przez niebieski pionek na puste pole za nim, co pokazuje strzałka.",
  tekst: "Czerwony pionek przeskakuje przez niebieski.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Seria skoków</h2>
      <p>Po skoku ten sam pionek może skoczyć jeszcze raz, tyle razy, ile się da, i w dowolnym kierunku. Sam decydujesz, gdzie się zatrzymać. Wszystkie skoki razem to jeden ruch.</p>
      <ul>
        <li>W jednym ruchu nie możesz wylądować dwa razy na tym samym polu.</li>
        <li>Ruch to jeden krok albo jeden skok lub kilka skoków. Po skoku nie możesz zrobić kroku.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Czerwony pionek robi trzy skoki w jednym ruchu, przez niebieski, zielony i jeszcze jeden niebieski pionek. Trzy pola lądowania mają numery 1, 2 i 3.",
  tekst: "Jeden ruch z trzema skokami, w kolejności numerów.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cel gry</h2>
      <p>Wygrywasz, gdy przeniesiesz wszystkie 10 swoich pionków do ramienia naprzeciwko tego, z którego zaczęły. Wszystkie 10 pól tego ramienia musi zajmować twoje własne pionki. Dopóki stoi tam pionek innego gracza, nie możesz skończyć.</p>
      <p>Możesz lądować na dowolnym pustym polu, także w ramionach innych graczy.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza dla trzech graczy. Czerwony zaczyna na dole; puste ramię u góry, zaznaczone przerywanymi kółkami, jest celem czerwonego.",
  tekst: "Przy 3 graczach czerwony zaczyna na dole. Celem czerwonego jest puste ramię u góry.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Przy 2, 3, 4 lub 6 graczach</h2>
      <ul>
        <li><strong>2 graczy:</strong> wygrywa ten, kto pierwszy wypełni cel, i gra się kończy.</li>
        <li><strong>3, 4 lub 6 graczy:</strong> wygrywa ten, kto pierwszy wypełni cel. Pozostali grają dalej o kolejne miejsca, a gracz, który już skończył, jest pomijany. Gra kończy się, gdy gra już tylko jeden gracz.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Poddanie się</h2>
      <p>Gdy się poddajesz, twoje pionki znikają z planszy, więc nikomu nie przeszkadzają. Przy 2 graczach wygrywa drugi gracz. Przy większej liczbie graczy gra toczy się dalej bez ciebie, a jeśli poddadzą się wszyscy oprócz jednego, wygrywa ostatni gracz.</p>
      <p>W grze online każdy ruch ma limit czasu. Ustawia go gracz, który zaczyna grę, a w szybkiej grze to 30 sekund. Gdy twój czas się skończy, twoja kolejka jest pomijana. Jeśli pominiesz 3 kolejki z rzędu, poddajesz się. Gry z komputerem i na jednym telefonie nie mają limitu czasu.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Wskazówki</h2>
      <ul class="tips">
        <li><strong>Buduj drabinki.</strong> Ustaw pionki w linii z jednym pustym polem między nimi, w stronę swojego celu. Wtedy jeden pionek może przeskoczyć całą linię w jednym ruchu.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Cztery pionki w ukośnej linii z pustym polem między każdymi dwoma. Czerwony pionek na jednym końcu przeskakuje przez wszystkie cztery, z czterema ponumerowanymi polami lądowania.",
  tekst: "Cztery pionki w linii: czerwony pionek na górze przechodzi przez planszę w jednym ruchu, czterema skokami.",
})}
        </li>
        <li><strong>Każdy pionek to drabinka.</strong> Możesz skakać przez pionki w każdym kolorze, więc pionki innych graczy pomagają także tobie. A twoje drabinki pomagają im: patrz, co po sobie zostawiasz.</li>
        <li><strong>Nie zapominaj o maruderach.</strong> Wszystkie 10 pionków musi dotrzeć do domu. Pionek daleko w tyle, który nie ma przez co skakać, rusza się o jedno pole na kolejkę. Podciągnij go, póki inne pionki są jeszcze wokół niego.</li>
        <li><strong>Twój start to ich cel.</strong> Przy 2, 4 lub 6 graczach twoje ramię startowe jest celem gracza naprzeciwko i nie może on skończyć, dopóki stoi tam choć jeden twój pionek. To samo dotyczy ciebie.</li>
      </ul>
      <p>Więcej wskazówek, z obrazkami, jest w poradniku <a href="/pl/poradniki/trylma-strategia">Strategia w trylmie</a>. Jeśli chcesz zagrać we dwoje, przeczytaj <a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pytania</h2>
      <h3>Ile osób może grać w trylmę (chińskie warcaby)?</h3>
      <p>Dwie, trzy, cztery lub sześć. Każdy gracz zaczyna w jednym ramieniu gwiazdy. Przy 2, 3 lub 4 graczach niektóre ramiona zostają puste.</p>
      <h3>Ile pionków ma każdy gracz?</h3>
      <p>Każdy gracz ma 10 pionków. Plansza ma 121 pól: 10 w każdym z sześciu ramion i 61 w środku.</p>
      <h3>Czy można skakać przez własne pionki albo do tyłu?</h3>
      <p>Tak. Możesz skakać przez pionek dowolnego koloru, także własny, w każdym z sześciu kierunków, również do tyłu. Pionek, przez który skaczesz, zostaje na miejscu.</p>
      <h3>Czy w trylmie bije się pionki?</h3>
      <p>Nie. Nic nie jest bite. Pionek schodzi z planszy tylko wtedy, gdy jego gracz się podda.</p>
      <h3>Czy chińskie warcaby pochodzą z Chin?</h3>
      <p>Nie. Gra pojawiła się w Niemczech w 1892 roku jako Stern-Halma, na podstawie starszej gry Halma. Nazwa chińskie warcaby pochodzi ze Stanów Zjednoczonych, z 1928 roku. Więcej przeczytasz w artykule <a href="/pl/zasady/sternhalma">Sternhalma</a>.</p>
      <h3>Gdzie można za darmo grać online w trylmę ze znajomymi?</h3>
      <p>W Leapstone, w przeglądarce albo w aplikacji z App Store. Wyślij znajomemu link z zaproszeniem: dołączy do twojej gry bez konta, adresu e-mail i hasła. Możesz też grać z komputerem albo w szybką grę z innym graczem. Leapstone jest darmowy i bez reklam.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Graj w Leapstone</h2>
      <p>Leapstone to darmowa aplikacja do gry w trylmę (chińskie warcaby) i Halmę na planszy 3D z czerwonej laki i złota. Możesz grać w aplikacji i w przeglądarce.</p>
      <ul>
        <li><strong>Z komputerem.</strong> Łatwy, normalny lub trudny. Nie potrzebujesz internetu.</li>
        <li><strong>Ze znajomymi.</strong> Wyślij link z zaproszeniem. Ty ustawiasz czas na ruch i możecie rozmawiać na czacie.</li>
        <li><strong>Online.</strong> Szybka gra z innym graczem na twoim poziomie, 30 sekund na ruch. Niektórzy przeciwnicy online mogą być graczami komputerowymi.</li>
        <li><strong>Na jednym telefonie.</strong> Podawajcie telefon dookoła stołu.</li>
      </ul>
      <p>Leapstone jest darmowy, bez reklam i bez logowania adresem e-mail: wybierasz tylko nazwę gracza. <a href="https://apps.apple.com/pl/app/id6831230722">Pobierz z App Store</a> / <a href="/play/">Graj w przeglądarce</a>.</p>
    </section>`;

export default {
  nav: "Zasady trylmy",
  titel: "Zasady trylmy (chińskich warcabów) i wskazówki | Leapstone",
  beschrijving: "Jak grać w trylmę: ustawienie, kroki, skoki i serie skoków, jak wygrać przy 2, 3, 4 lub 6 graczach, i wskazówki. Graj za darmo w przeglądarce.",
  h1: "Zasady trylmy (chińskich warcabów)",
  intro: "Przenieś wszystkie 10 swoich pionków przez gwiazdową planszę do ramienia naprzeciwko, zanim zrobi to ktokolwiek inny. Zasady w skrócie, z obrazkami, i kilka wskazówek.",
  inhoud,
};
