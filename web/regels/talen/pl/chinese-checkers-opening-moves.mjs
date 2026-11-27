// Polski poradnik „Otwarcia w trylmie”, taak 303 (feature 294): /pl/poradniki/trylma-otwarcia. Inhoud: ../en/chinese-checkers-opening-moves.mjs,
// zin voor zin in het Pools. Elk getal en elke zet is nagelopen tegen crates/halma-core; de plaatjes komen uit
// crates/halma-core/examples/regelplaatjes.rs (sectie "taak 303"). Verandert een zet, verander dan beide.
// Een "rząd" is alle velden met dezelfde afstand tot je eigen punt; een krok schuift 1 rząd op, een skok 2.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Twój pierwszy ruch: 14 możliwości</h2>
      <p>Na początku twoje 10 pionków wypełnia trójkąt w rzędach po 4, 3, 2 i 1, a przedni rząd zwrócony jest ku środkowi planszy. W trójkącie nie ma wolnego pola, więc pionek może pójść tylko do rzędu tuż przed nim. Daje to 14 pierwszych ruchów: każdy z 4 pionków w przednim rzędzie może zrobić krok na 2 pola (8 kroków), a każdy z 3 pionków w drugim rzędzie może przeskoczyć przez przedni pionek na 2 pola (6 skoków). Pozostałe 3 pionki nie mogą jeszcze się ruszyć.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Czerwone ramię na dole z jego 10 pionkami, a w rzędzie tuż przed nim 5 pustych pól oznaczonych kółkiem.",
  tekst: "Każdy pierwszy ruch kończy się na jednym z tych 5 pól.",
})}
      <p>W tym poradniku rząd to linia pól w poprzek twojego ramienia, równoległa do jego przedniej krawędzi, a postęp liczymy w rzędach. Krok przesuwa pionek o 1 rząd do przodu, a skok o 2 rzędy. Każdy gracz ma te same 14 pierwszych ruchów, przy 2, 3, 4 lub 6 graczach i z każdego ramienia gwiazdy, bo od środka każde ramię wygląda tak samo.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Otwarcie 1: wyskocz, potem uwolnij czubek</h2>
      <p>Pionek w czubku twojego ramienia jest najdalej od twojego celu i na początku nie może się ruszyć: może przeskoczyć przez pionek tylko wtedy, gdy pole za tym pionkiem jest puste. Skok z drugiego rzędu tworzy dokładnie takie pole.</p>
      <ol>
        <li><strong>Ruch 1:</strong> pionek na prawym końcu twojego drugiego rzędu przeskakuje przez pionek przed nim. Ląduje w rzędzie przed twoim ramieniem i zyskuje 2 rzędy.</li>
        <li><strong>Ruch 2:</strong> pionek w czubku skacze dwa razy w jednym ruchu: najpierw na pole, które opróżnił ruch 1, potem przez pionek drugiego rzędu. Zyskuje 4 rzędy.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Czerwone ramię po ruchu 1. Pionek w czubku ma kółko, a 2 strzałki z numerami 1 i 2 pokazują jego skoki przez opróżnione pole do rzędu przed ramieniem.",
  tekst: "Po ruchu 1 pionek z czubka wyskakuje w 2 skokach.",
})}
      <p>To 6 rzędów w 2 ruchach. Sprawdziliśmy każdy sposób rozegrania 2 ruchów i 6 to najwięcej, ile można zyskać. Udaje się to tylko 4 parom ruchów: skacze pionek na dowolnym końcu drugiego rzędu, w jednym ze swoich 2 kierunków, a za nim pionek z czubka. Pionek ze środka drugiego rzędu się nie nadaje, bo zostawia czubek zamknięty.</p>
      <p>Oba pionki stoją teraz w rzędzie przed twoim ramieniem z jednym pustym polem między nimi. To pierwszy szczebel drabinki.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Otwarcie 2: 4 ruchy 4 różnymi pionkami</h2>
      <p>W 4 ruchach możesz zyskać najwyżej 13 rzędów i uda się to tylko wtedy, gdy każdy ruch wykonuje inny pionek. Ten ciąg to robi:</p>
      <ol>
        <li><strong>Ruch 1:</strong> pionek na prawym końcu przedniego rzędu robi krok do przodu. Zyskuje 1 rząd.</li>
        <li><strong>Ruch 2:</strong> pionek na prawym końcu trzeciego rzędu skacze dwa razy. Zyskuje 4 rzędy.</li>
        <li><strong>Ruch 3:</strong> pionek na lewym końcu drugiego rzędu skacze dwa razy. Zyskuje 4 rzędy.</li>
        <li><strong>Ruch 4:</strong> pionek w czubku skacze dwa razy. Zyskuje 4 rzędy.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Czerwone ramię na początku. 4 pionki, które się ruszą, mają numer od 1 do 4, w kolejności ruchów.",
          tekst: "Przed: pionki, które się ruszają, po kolei.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Czerwone ramię po 4 ruchach, z 4 polami, na których wylądowały ponumerowane pionki w rzędach przed ramieniem, i 4 dziurami pozostawionymi w ramieniu.",
          tekst: "Po: gdzie wylądowały.",
        })}
      </div>
      <p>Każdy ruch przygotowuje następny. Ruchy 2 i 3 kończą się skokiem przez pionek, który ruszył się chwilę wcześniej, a ruch 4 zaczyna się przez dziurę, którą zostawił ruch 3. Wszystkie 4 pionki lądują w twojej połowie planszy.</p>
      <p>Są też inne ciągi, które dają 13. Łączy je pomysł: szukaj ruchu, który zostawia dziurę lub pionek do przeskoku dla następnego ruchu, i wypuść pionek z czubka najpóźniej ruchem 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Błędy w pierwszych ruchach</h2>
      <ul class="tips">
        <li><strong>Ruszanie co turę tym samym pionkiem.</strong> Pionek biegnący samotnie zyskuje 5 rzędów w 4 ruchach, wobec 13 przy 4 różnych pionkach. Zostawia też resztę twoich pionków tam, gdzie były.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Czerwone ramię na początku. Jeden pionek z drugiego rzędu robi 4 ruchy z rzędu wzdłuż jednej linii, ze strzałkami i numerami od 1 do 4, i kończy samotnie blisko środka planszy.",
  tekst: "Jeden pionek, 4 ruchy, 5 rzędów.",
})}
      <ul class="tips">
        <li><strong>Robienie samych kroków pionkami z przedniego rzędu.</strong> 4 kroki dają 4 rzędy. Po nich pionek w czubku nadal nie może się ruszyć, więc zostaje z tyłu, podczas gdy reszta idzie naprzód.</li>
        <li><strong>Krok w bok.</strong> Krok wzdłuż rzędu daje 0 rzędów. Po ruchu 1 otwarcia 1 przedni pionek może zrobić krok na sąsiednie pole i wygląda to na postęp, ale ruch jest zmarnowany.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Graj dalej</h2>
      <p>Po około 4 ruchach obie armie się zbliżają, a otwarcia powyżej ustępują miejsca grze środkowej. Nie musisz pamiętać tych ciągów: pamiętaj, że każdy ruch ma przygotowywać następny.</p>
      <ul>
        <li><a href="/play/">Zagraj z komputerem w przeglądarce</a> i wypróbuj otwarcie 1 lub 2.</li>
        <li><a href="/pl/poradniki/trylma-strategia">Strategia w trylmie</a>: drabinki, trzymanie pionków razem i wypełnianie celu.</li>
        <li><a href="/pl/poradniki/trylma-dla-dwoch-graczy">Trylma dla 2 graczy</a>: jak wygląda gra we dwoje.</li>
        <li><a href="/pl/zasady/trylma">Zasady trylmy (chińskich warcabów)</a>, z obrazkami kroków, skoków i serii.</li>
      </ul>
    </section>`;

export default {
  nav: "Otwarcia w trylmie",
  titel: "Otwarcia w trylmie: 2 otwarcia z obrazkami | Leapstone",
  beschrijving: "Otwarcia w trylmie (chińskich warcabach): jak wyskoczyć z ramienia, uwolnić czubek w ruchu 2 i zyskać 13 rzędów w 4 ruchach, plus typowe błędy.",
  h1: "Otwarcia w trylmie (chińskich warcabach)",
  intro: "Dobre otwarcie w trylmie wyskakuje z drugiego rzędu, co turę rusza innym pionkiem i wypuszcza pionek z czubka ramienia w ruchu 2 lub 4. Dwa otwarcia z obrazkami i błędy, których unikać.",
  inhoud,
};
