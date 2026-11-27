// Leapstone în cifre, Roemeens (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Locuri și piese</h2>
      <p>Numărate pe cele două table din Leapstone, în poziția de început a unui joc.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Tabla în formă de stea cu toate cele șase vârfuri pline: zece piese din fiecare dintre cele șase culori, în jurul unui mijloc gol.",
  tekst: "Tabla în formă de stea la începutul unui joc pentru șase jucători.",
})}
      <ul class="tips">
        <li><strong>Tabla în formă de stea are ${f("sterbord_vakken")} de locuri.</strong> Fiecare jucător începe cu ${f("sterbord_stenen_per_speler")} piese. Deci un joc pentru doi jucători are ${f("sterbord_stenen_2_spelers")} de piese pe tablă, unul pentru trei are ${f("sterbord_stenen_3_spelers")}, pentru patru ${f("sterbord_stenen_4_spelers")} și pentru șase ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Tabla pătrată de Halma are ${f("vierkant_vakken")} de locuri.</strong> Într-un joc pentru doi jucători, fiecare jucător începe cu ${f("vierkant_stenen_per_speler_2_spelers")} piese, ${f("vierkant_stenen_2_spelers")} în total. Într-un joc pentru patru, fiecare începe cu ${f("vierkant_stenen_per_speler_4_spelers")} piese, ${f("vierkant_stenen_4_spelers")} în total.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Cel mai lung lanț de sărituri: ${f("langste_sprongketen")}</h2>
      <p>Pe tabla în formă de stea, o piesă poate face <strong>${f("langste_sprongketen")} de sărituri într-o singură mutare</strong>, iar după regulile din Leapstone nicio mutare nu poate avea mai multe. Ca să se ajungă la acest număr, celelalte piese sunt așezate liber: câte una pe fiecare loc peste care sare piesa.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "O tablă în formă de stea cu o piesă roșie și multe piese albastre. Săgeți albe arată piesa roșie sărind peste o piesă albastră după alta, pe un drum lung și întortocheat.",
  tekst: "Cel mai lung lanț: piesa roșie sare peste fiecare piesă albastră, una după alta.",
})}
      <p><strong>Cum se numără.</strong> O săritură aterizează mereu cu două locuri mai departe, în linie dreaptă. Așa că o piesă care tot sare ajunge doar pe o parte din locuri: tabla se împarte în patru astfel de grupuri, iar cel mai mare are ${f("grootste_klasse_vakken")} de locuri. În Leapstone, o piesă nu poate ateriza de două ori pe același loc într-o mutare, nici pe locul de unde a pornit. Deci un lanț aterizează cel mult o dată pe fiecare dintre celelalte locuri din grupul lui. Programul a căutat în acel grup și a găsit un drum care trece prin toate cele ${f("grootste_klasse_vakken")} de locuri, așa că niciun lanț nu poate fi mai lung: ${f("langste_sprongketen")} de sărituri. Apoi un test joacă acea mutare cu regulile din Leapstone.</p>
      <p><strong>Nu este un joc real.</strong> Acest lanț are nevoie de ${f("langste_sprongketen")} de alte piese, fiecare exact pe locul potrivit. Un joc pentru doi sau trei jucători are doar ${f("sterbord_stenen_2_spelers")} sau ${f("sterbord_stenen_3_spelers")} de piese, prea puține. Un joc pentru patru sau șase jucători are ${f("sterbord_stenen_4_spelers")} sau ${f("sterbord_stenen_6_spelers")}, destule. Dar într-un joc real nimeni nu așază piesele liber, așa că nu te aștepta la acest lanț la masă. El arată ce permite tabla, nu ce se întâmplă în joc.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Cea mai scurtă traversare: ${f("oversteek_zetten")} de mutări</h2>
      <p>Un jucător singur pe tabla în formă de stea, fără adversari, are nevoie de <strong>${f("oversteek_zetten")} de mutări</strong> ca să ducă toate cele ${f("sterbord_stenen_per_speler")} piese dintr-un vârf în vârful opus și nu poate reuși în mai puține. Un lanț întreg de sărituri contează ca o singură mutare.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "O tablă în formă de stea cu doar zece piese roșii, în vârful de jos. Vârful de sus, unde trebuie să ajungă, are un contur punctat.",
  tekst: "Un jucător singur: zece piese în vârful de jos, iar vârful de sus este ținta.",
})}
      <p><strong>Cum se numără.</strong> Un test joacă o traversare de ${f("oversteek_zetten")} de mutări cu regulile din Leapstone, fără alte piese pe tablă. Ca să arate că ${f("geen_oversteek_in_zetten")} de mutări sau mai puține nu ajung, o căutare urmează metoda lui G. I. Bell (<em>Integers</em> 9, 2009). Orice mutare se poate juca înapoi, iar o jumătate de rotire a tablei schimbă între ele startul și ținta. Dacă ar exista o traversare de ${f("geen_oversteek_in_zetten")} de mutări sau mai puține, o poziție de la jumătatea drumului ar fi la cel mult ${f("zoekdiepte_zetten")} mutări de start, la fel și aceeași poziție rotită cu o jumătate de tură. Căutarea a trecut prin fiecare poziție aflată la cel mult ${f("zoekdiepte_zetten")} mutări de start, a numărat o singură dată o poziție și imaginea ei în oglindă, a lăsat deoparte pozițiile care dovedit nu pot ajunge destul de departe la timp și n-a găsit nicio astfel de pereche. A rulat ${f("gemeten_rekentijd_seconden")} de secunde pe o mașină cu ${f("gemeten_kernen")} nuclee, iar cel mai mare pas al ei a ținut ${f("gemeten_grootste_laag_miljoen_standen")} milioane de poziții în ${f("gemeten_geheugen_gb")} GB de memorie. Numărul a fost calculat din nou pentru tabla proprie a Leapstone.</p>
      <p><strong>Nu este o limită de jos pentru un joc real.</strong> Într-un joc real, pe tablă sunt și piesele celorlalți jucători, iar piesele tale pot sări peste ele. Deci ${f("oversteek_zetten")} nu este minimul pe care îl poate lua un joc real: este dovedit doar pentru un jucător singur.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Încearcă</h2>
      <p><a href="/play/">Joacă Leapstone în browser</a> împotriva calculatorului sau ia aplicația cu butoanele din partea de sus a acestei pagini. Pentru reguli, citește <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> sau <a href="/ro/reguli/halma">regulile Halma</a>. Ca să afli cum folosești lanțurile de sărituri într-un joc, citește <a href="/ro/ghiduri/dame-chinezesti-strategie">sfaturile de strategie</a>.</p>
    </section>`;

export default {
  nav: "Dame chinezești în cifre",
  titel: "Dame chinezești în cifre | Leapstone",
  beschrijving: `Tabla în stea are ${c.sterbord_vakken} de locuri. O mutare are cel mult ${c.langste_sprongketen} de sărituri, iar un jucător singur traversează în ${c.oversteek_zetten} de mutări. Cum se calculează fiecare număr.`,
  h1: "Dame chinezești în cifre",
  intro: `Tabla în formă de stea a damelor chinezești are ${f("sterbord_vakken")} de locuri, iar fiecare jucător începe cu ${f("sterbord_stenen_per_speler")} piese. În Leapstone, o mutare nu poate avea niciodată mai mult de ${f("langste_sprongketen")} de sărituri. Un jucător singur pe tablă, fără adversari, are nevoie de ${f("oversteek_zetten")} de mutări ca s-o traverseze. Mai jos vezi cum se numără fiecare număr și ce spune și ce nu spune el despre un joc real.`,
  inhoud,
};
