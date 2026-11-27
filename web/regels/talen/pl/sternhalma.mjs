// Polska strona „Czym jest Sternhalma”, taak 134. Inhoud: ../en/sternhalma.mjs (bronnen en weggelaten punten staan daar),
// zin voor zin in het Pools. Verandert een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Co oznacza ta nazwa</h2>
      <p>Sternhalma to niemiecka nazwa Halmy rozgrywanej na planszy w kształcie gwiazdy. <em>Stern</em> po niemiecku znaczy gwiazda. Nazwa trylma (chińskie warcaby) oznacza tę samą grę pod nazwą nadaną jej później w Stanach Zjednoczonych.</p>
      <p>W Leapstone to <strong>plansza gwiazdowa</strong>: plansza z <a href="/pl/zasady/trylma">zasad trylmy (chińskich warcabów)</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Skąd się wzięła</h2>
      <ul>
        <li><strong>Halmę</strong> wymyślił w 1883 lub 1884 roku George Howard Monks, amerykański chirurg. Nazwa po grecku oznacza &bdquo;skok&rdquo;. Gra się w nią na kwadratowej planszy. <a href="/pl/zasady/halma">Przeczytaj zasady Halmy</a>.</li>
        <li><strong>Stern-Halma</strong> pojawiła się w Niemczech w 1892 roku: ten sam pomysł na planszy w kształcie sześcioramiennej gwiazdy.</li>
        <li><strong>Chińskie warcaby</strong> to nazwa, którą Bill i Jack Pressmanowie nadali grze w Stanach Zjednoczonych w 1928 roku, najpierw jako &bdquo;Hop Ching checkers&rdquo;. Gra nie ma historycznego związku z Chinami i nie jest grą w warcaby.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Czym te gry się różnią</h2>
      <ul>
        <li><strong>Halma:</strong> kwadratowa plansza o wymiarach 16 na 16 pól, dla 2 lub 4 graczy. Pionek ma ośmiu sąsiadów, w linii prostej i po przekątnej. Przy 2 graczach każdy ma 19 pionków, przy 4 graczach 13.</li>
        <li><strong>Sternhalma i trylma:</strong> gwiazdowa plansza ze 121 polami, dla 2, 3, 4 lub 6 graczy. Pionek ma sześciu sąsiadów. Każdy ma 10 pionków.</li>
        <li><strong>Reszta jest taka sama:</strong> krok na wolne pole obok albo skok przez jeden pionek, z seriami skoków. Wygrywa ten, kto pierwszy wypełni obóz po drugiej stronie planszy.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Warianty i to, co robi Leapstone</h2>
      <p>W Halmę grało się na więcej niż jeden sposób. Tak Leapstone wygląda na tle wariantów, które znaleźliśmy w źródłach:</p>
      <ul>
        <li><strong>Rozmiar planszy.</strong> W Halmę gra się też na planszach 8 na 8 i 10 na 10. Leapstone ma tylko planszę 16 na 16.</li>
        <li><strong>Opuszczanie celu.</strong> Według jednej z zasad Halmy pionek, który wszedł do obozu przeciwnika, nie może go już opuścić. Leapstone nie ma tej zasady: takim pionkiem możesz ruszyć jeszcze raz.</li>
        <li><strong>Trzech graczy na gwieździe.</strong> Starą Halmę dla trzech graczy na planszy gwiazdowej opisano z 15 pionkami dla każdego. Leapstone gra w 3 graczy na planszy gwiazdowej z 10 pionkami dla każdego.</li>
        <li><strong>Skoki to twój wybór.</strong> Nigdy nie musisz skakać. Sam wybierasz pole, na którym kończy się twój ruch.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Zagraj w Leapstone</h2>
      <p>Graj teraz otwiera grę z komputerem na planszy gwiazdowej. Aby zagrać na planszy kwadratowej, stuknij strzałkę wstecz u góry i wybierz w menu Planszę kwadratową.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z 10 czerwonymi pionkami w dolnym ramieniu i 10 niebieskimi pionkami w górnym ramieniu",
  tekst: "Gwiazdowa plansza dla 2 graczy.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Czym jest Sternhalma? Plansza gwiazdowa | Leapstone",
  beschrijving: "Sternhalma to niemiecka nazwa Halmy na planszy gwiazdowej. Jak łączy się z Halmą i trylmą, czym się różni i jak zagrać w nią za darmo w przeglądarce.",
  h1: "Sternhalma, Halma i trylma",
  intro: "Trzy nazwy blisko spokrewnionych gier. Co oznacza każda z nich, skąd się wzięły i czym się różnią.",
  inhoud,
};
