// Leapstone w liczbach, Pools (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Pola i pionki</h2>
      <p>Policzone na obu planszach Leapstone, w pozycji początkowej partii.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Gwiazdowa plansza ze wszystkimi sześcioma ramionami pełnymi: dziesięć pionków w każdym z sześciu kolorów, wokół pustego środka.",
  tekst: "Gwiazdowa plansza na początku partii dla sześciu graczy.",
})}
      <ul class="tips">
        <li><strong>Gwiazdowa plansza ma ${f("sterbord_vakken")} pól.</strong> Każdy gracz zaczyna z ${f("sterbord_stenen_per_speler")} pionkami. Partia dla dwóch graczy ma więc na planszy ${f("sterbord_stenen_2_spelers")} pionków, dla trzech ${f("sterbord_stenen_3_spelers")}, dla czterech ${f("sterbord_stenen_4_spelers")}, a dla sześciu ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Kwadratowa plansza do Halmy ma ${f("vierkant_vakken")} pól.</strong> W partii dla dwóch graczy każdy gracz zaczyna z ${f("vierkant_stenen_per_speler_2_spelers")} pionkami, razem ${f("vierkant_stenen_2_spelers")}. W partii dla czterech każdy zaczyna z ${f("vierkant_stenen_per_speler_4_spelers")} pionkami, razem ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Najdłuższy łańcuch skoków: ${f("langste_sprongketen")}</h2>
      <p>Na gwiazdowej planszy jeden pionek może wykonać <strong>${f("langste_sprongketen")} skoków w jednym ruchu</strong>, a według zasad Leapstone żaden ruch nie może mieć ich więcej. Żeby dojść do tej liczby, pozostałe pionki są ustawione dowolnie: po jednym na każdym polu, nad którym pionek przeskakuje.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Gwiazdowa plansza z jednym czerwonym pionkiem i wieloma niebieskimi. Białe strzałki pokazują, jak czerwony pionek przeskakuje jeden niebieski pionek po drugim, po długiej, krętej drodze.",
  tekst: "Najdłuższy łańcuch: czerwony pionek przeskakuje każdy niebieski pionek, jeden po drugim.",
})}
      <p><strong>Jak to policzono.</strong> Skok zawsze ląduje dwa pola dalej, w linii prostej. Pionek, który skacze dalej, dociera więc tylko do części pól: plansza dzieli się na cztery takie grupy, a największa ma ${f("grootste_klasse_vakken")} pól. W Leapstone pionek nie może w jednym ruchu wylądować dwa razy na tym samym polu ani na polu, z którego wyruszył. Łańcuch ląduje więc najwyżej raz na każdym z pozostałych pól swojej grupy. Program przeszukał tę grupę i znalazł drogę przez wszystkie ${f("grootste_klasse_vakken")} pól, więc żaden łańcuch nie może być dłuższy: ${f("langste_sprongketen")} skoków. Potem test rozgrywa ten ruch według zasad Leapstone.</p>
      <p><strong>To nie jest prawdziwa partia.</strong> Ten łańcuch potrzebuje ${f("langste_sprongketen")} innych pionków, każdego dokładnie na właściwym polu. Partia dla dwóch lub trzech graczy ma tylko ${f("sterbord_stenen_2_spelers")} lub ${f("sterbord_stenen_3_spelers")} pionków, czyli za mało. Partia dla czterech lub sześciu graczy ma ich ${f("sterbord_stenen_4_spelers")} lub ${f("sterbord_stenen_6_spelers")}, czyli dość. Ale w prawdziwej partii nikt nie ustawia pionków dowolnie, więc nie licz na ten łańcuch przy stole. Pokazuje on, na co pozwala plansza, a nie to, co dzieje się w grze.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Najkrótsza przeprawa: ${f("oversteek_zetten")} ruchów</h2>
      <p>Jeden gracz sam na gwiazdowej planszy, bez przeciwników, potrzebuje <strong>${f("oversteek_zetten")} ruchów</strong>, żeby przenieść wszystkie ${f("sterbord_stenen_per_speler")} pionków z jednego ramienia do ramienia naprzeciwko, i nie da rady w mniejszej liczbie. Cały łańcuch skoków liczy się jako jeden ruch.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Gwiazdowa plansza z samymi dziesięcioma czerwonymi pionkami, w dolnym ramieniu. Górne ramię, do którego muszą dojść, ma przerywany obrys.",
  tekst: "Jeden gracz sam: dziesięć pionków w dolnym ramieniu, a górne ramię jest celem.",
})}
      <p><strong>Jak to policzono.</strong> Test rozgrywa przeprawę w ${f("oversteek_zetten")} ruchach według zasad Leapstone, bez innych pionków na planszy. Żeby pokazać, że ${f("geen_oversteek_in_zetten")} ruchów lub mniej nie wystarczy, wyszukiwanie stosuje metodę G. I. Bella (<em>Integers</em> 9, 2009). Każdy ruch można zagrać wstecz, a obrót planszy o pół obrotu zamienia start z celem. Gdyby więc istniała przeprawa w ${f("geen_oversteek_in_zetten")} ruchach lub mniej, jakaś pozycja w połowie drogi byłaby najwyżej ${f("zoekdiepte_zetten")} ruchów od startu, a ta sama pozycja obrócona o pół obrotu też. Wyszukiwanie przeszło przez każdą pozycję w odległości do ${f("zoekdiepte_zetten")} ruchów od startu, liczyło pozycję i jej lustrzane odbicie raz, pomijało pozycje, które na pewno nie zdążą dojść dość daleko, i nie znalazło takiej pary. Działało ${f("gemeten_rekentijd_seconden")} sekund na maszynie z ${f("gemeten_kernen")} rdzeniami, a jego największy krok mieścił ${f("gemeten_grootste_laag_miljoen_standen")} mln pozycji w ${f("gemeten_geheugen_gb")} GB pamięci. Liczbę policzono od nowa dla własnej planszy Leapstone.</p>
      <p><strong>To nie jest dolna granica dla prawdziwej partii.</strong> W prawdziwej partii na planszy stoją też pionki innych graczy, a twoje pionki mogą przez nie przeskakiwać. ${f("oversteek_zetten")} to więc nie najmniej, ile może trwać prawdziwa partia: udowodniono to tylko dla jednego gracza samego na planszy.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Wypróbuj</h2>
      <p><a href="/play/">Zagraj w Leapstone w przeglądarce</a> z komputerem albo pobierz aplikację przyciskami na górze tej strony. Zasady znajdziesz w <a href="/pl/zasady/trylma">zasadach trylmy</a> i w <a href="/pl/zasady/halma">zasadach Halmy</a>. Jak wykorzystać łańcuchy skoków w partii, przeczytasz we <a href="/pl/poradniki/trylma-strategia">wskazówkach strategicznych</a>.</p>
    </section>`;

export default {
  nav: "Trylma w liczbach",
  titel: "Trylma (chińskie warcaby) w liczbach | Leapstone",
  beschrijving: `Gwiazdowa plansza ma ${c.sterbord_vakken} pól. Jeden ruch ma najwyżej ${c.langste_sprongketen} skoków, a gracz sam na planszy potrzebuje ${c.oversteek_zetten} ruchów na przeprawę. Jak policzono każdą liczbę.`,
  h1: "Trylma (chińskie warcaby) w liczbach",
  intro: `Gwiazdowa plansza do trylmy ma ${f("sterbord_vakken")} pól, a każdy gracz zaczyna z ${f("sterbord_stenen_per_speler")} pionkami. W Leapstone jeden ruch nigdy nie może mieć więcej niż ${f("langste_sprongketen")} skoków. Jeden gracz sam na planszy, bez przeciwników, potrzebuje ${f("oversteek_zetten")} ruchów, żeby ją przebyć. Poniżej widać, jak policzono każdą liczbę i co mówi, a czego nie mówi o prawdziwej partii.`,
  inhoud,
};
