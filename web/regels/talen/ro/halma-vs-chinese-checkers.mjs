// Ghidul Halma sau dame chinezești în română (taak 300). Conținut: ghidul englez ../en/halma-vs-chinese-checkers.mjs, propoziție cu propoziție.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dame chinezești: tabla în stea, 121 de locuri",
    alt: "Tabla în formă de stea cu 10 piese roșii în vârful de jos și 10 piese albastre în vârful de sus",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: tabla pătrată, 256 de locuri",
    alt: "Tabla pătrată cu 19 piese roșii în colțul din stânga sus și 19 piese albastre în colțul din dreapta jos",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Tabla în stea: șase vecine, trei dintre ele libere aici",
    alt: "O piesă roșie cu un inel alb în jur. Trei dintre cele șase vecine ale ei sunt libere și marcate; celelalte trei au piese.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Tabla pătrată: opt vecine, cinci dintre ele libere aici",
    alt: "O piesă roșie cu un inel alb în jur. Cinci dintre cele opt vecine ale ei sunt libere și marcate; celelalte trei au piese.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Răspunsul scurt</h2>
      <p>Halma se joacă pe o tablă pătrată, iar damele chinezești pe o tablă în formă de stea cu șase vârfuri. În ambele jocuri îți muți piesele cu pași și salturi pe tablă, iar câștigă primul jucător care umple tabăra din partea opusă.</p>
      <p>Diferă tabla, direcțiile în care te miști, câte persoane pot juca și câte piese are fiecare. <a href="/ro/reguli/sternhalma">Sternhalma</a> este numele jocului Halma pe o tablă în stea, deci este același joc ca damele chinezești.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Tablele</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Damele chinezești</strong> folosesc tabla în stea: 121 de locuri, cu un vârf de 10 locuri la fiecare dintre cele șase capete. Un vârf este un triunghi cu rânduri de 4, 3, 2 și 1 locuri.</li>
        <li><strong>Halma</strong> folosește tabla pătrată: 16 pe 16 locuri, 256 în total. O tabără stă într-un colț. O tabără mare are rânduri de 5, 5, 4, 3 și 2 locuri, iar una mică rânduri de 4, 4, 3 și 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Direcții: șase sau opt</h2>
      <p>Pe tabla în stea un loc are șase vecine. Pe tabla pătrată are opt, pentru că diagonalele contează și ele. Un pas merge pe o vecină liberă. Un salt trece peste o piesă de lângă a ta, în linie dreaptă, pe locul liber din spatele ei, în oricare dintre aceste direcții și chiar înapoi.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Un loc de pe margine are mai puține vecine, iar un colț al tablei pătrate are trei. Șase direcții fac trei linii prin un loc de pe tabla în stea. Opt direcții fac patru linii pe tabla pătrată: dintr-o parte în alta, de sus în jos și două diagonale.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Jucători și piese</h2>
      <ul>
        <li><strong>Dame chinezești:</strong> 2, 3, 4 sau 6 jucători. Fiecare are 10 piese, deci pe tablă sunt 20, 30, 40 sau 60 de piese.</li>
        <li><strong>Halma:</strong> 2 sau 4 jucători. Cu 2 jucători fiecare are 19 piese, 38 în total. Cu 4 jucători fiecare are 13 piese, 52 în total.</li>
      </ul>
      <p>Tabla pătrată nu are joc pentru 3 sau 6 jucători în Leapstone. Pentru un joc în trei, citește <a href="/ro/ghiduri/dame-chinezesti-in-trei">Dame chinezești pentru 3 jucători</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Ce este la fel</h2>
      <ul>
        <li><strong>O mutare:</strong> un pas sau un lanț de salturi cu o singură piesă. Tu decizi unde se termină lanțul și nu poți face un pas după un salt.</li>
        <li><strong>Orice culoare:</strong> sari peste o piesă de orice culoare, chiar și peste a ta. Piesa peste care sari rămâne unde este. Nimic nu se capturează.</li>
        <li><strong>Ținta:</strong> tabăra din fața celei de unde ai pornit. Toate locurile ei trebuie să aibă piesele tale. Cât timp acolo se află o piesă a altui jucător, nu poți termina.</li>
        <li><strong>Câștigul:</strong> primul jucător care umple ținta câștigă. Cu 2 jucători jocul se termină atunci. Cu mai mulți jucători ceilalți joacă mai departe pentru următoarele locuri, iar un jucător care a terminat este sărit.</li>
        <li><strong>Renunțarea și timpul:</strong> când renunți, piesele tale ies de pe tablă. Într-un joc online fiecare mutare are o limită de timp, iar dacă pierzi 3 rânduri la rând, renunți.</li>
      </ul>
      <p>Citește regulile complete ale <a href="/ro/reguli/dame-chinezesti">damelor chinezești</a> și ale jocului <a href="/ro/reguli/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Ce tablă să alegi în Leapstone</h2>
      <ul>
        <li><strong>3 sau 6 jucători:</strong> doar tabla în stea le are.</li>
        <li><strong>Mai multe piese pentru fiecare:</strong> tabla pătrată, cu câte 19 piese pentru 2 jucători sau 13 pentru 4, față de 10 pe tabla în stea.</li>
        <li><strong>Joacă online:</strong> un joc rapid se joacă pe tabla în stea. Cu prieteni și împotriva calculatorului poți alege oricare dintre cele două table.</li>
      </ul>
      <p>Butonul Joacă acum deschide un joc împotriva calculatorului pe tabla în stea. Ca să joci pe tabla pătrată, atinge săgeata de înapoi de sus și alege Tablă pătrată din meniu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Mai departe</h2>
      <ul>
        <li><a href="/play/">Joacă în browser</a> și încearcă ambele table.</li>
        <li><a href="/ro/ghiduri/dame-chinezesti-strategie">Strategia la dame chinezești</a>: șase sfaturi cu imagini.</li>
        <li><a href="/ro/ghiduri/dame-chinezesti-in-doi">Dame chinezești pentru 2 jucători</a>: cum merge un joc în doi.</li>
      </ul>
      <p><a href="/ro/ghiduri/dame-chinezesti-online-cu-prietenii">Dame chinezești online cu prietenii</a></p>
    </section>`;

export default {
  nav: "Halma sau dame chinezești",
  titel: "Halma sau dame chinezești: diferențele | Leapstone",
  beschrijving: "Halma sau dame chinezești? Tabla pătrată și tabla în stea, șase sau opt direcții, jucători și piese, și ce este la fel.",
  h1: "Halma sau dame chinezești",
  intro: "Două jocuri cu aceeași idee: du toate piesele tale de partea cealaltă a tablei. Ce diferă, ce este la fel și unde le poți juca pe amândouă.",
  inhoud,
};
