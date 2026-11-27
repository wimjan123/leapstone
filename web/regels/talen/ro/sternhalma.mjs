// Pagina „Ce este Sternhalma?” (taak 134), în română: numele și legătura cu Halma și damele chinezești.
// Conținut și surse: pagina engleză ../en/sternhalma.mjs (Wikipedia Halma și Chinese checkers, vezi acolo). Propoziție cu propoziție în română.
// Omis intenționat, ca în engleză: cine a publicat Stern-Halma în 1892 (sursele se contrazic) și anii brevetelor.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Ce înseamnă numele</h2>
      <p>Sternhalma este numele german al jocului Halma jucat pe o tablă în formă de stea. <em>Stern</em> înseamnă „stea” în germană. Numele dame chinezești este același joc sub un nume dat mai târziu în Statele Unite.</p>
      <p>În Leapstone aceasta este <strong>tabla în stea</strong>: tabla <a href="/ro/reguli/dame-chinezesti">regulilor damelor chinezești</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">De unde vine</h2>
      <ul>
        <li><strong>Halma</strong> a fost inventat în 1883 sau 1884 de George Howard Monks, un chirurg american. Numele este grecesc și înseamnă „salt”. Se joacă pe o tablă pătrată. <a href="/ro/reguli/halma">Citește regulile Halma</a>.</li>
        <li><strong>Stern-Halma</strong> a apărut în Germania în 1892: aceeași idee pe o tablă în formă de stea cu șase vârfuri.</li>
        <li><strong>Damele chinezești</strong> este numele pe care Bill și Jack Pressman l-au dat jocului în Statele Unite în 1928, la început ca „Hop Ching checkers”. Jocul nu are nicio legătură istorică cu China și nu este un joc de dame.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Cum diferă jocurile</h2>
      <ul>
        <li><strong>Halma:</strong> o tablă pătrată de 16 pe 16 locuri, pentru 2 sau 4 jucători. O piesă are opt vecine, în linie dreaptă și pe diagonală. Cu 2 jucători fiecare are 19 piese, cu 4 jucători 13.</li>
        <li><strong>Sternhalma și damele chinezești:</strong> o tablă în stea de 121 de locuri, pentru 2, 3, 4 sau 6 jucători. O piesă are șase vecine. Fiecare are 10 piese.</li>
        <li><strong>Restul este la fel:</strong> un pas pe o vecină liberă sau un salt peste o piesă, cu lanțuri de salturi. Primul jucător care umple tabăra din partea cealaltă a tablei câștigă.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variante, și ce face Leapstone</h2>
      <p>Halma s-a jucat în mai multe feluri. Așa se compară Leapstone cu variantele găsite în sursele noastre:</p>
      <ul>
        <li><strong>Mărimea tablei.</strong> Halma se joacă și pe table de 8 pe 8 și de 10 pe 10. Leapstone are doar tabla de 16 pe 16.</li>
        <li><strong>Ieșirea din țintă.</strong> După o regulă Halma, o piesă care a intrat în tabăra adversarului nu mai are voie să iasă din ea. Leapstone nu are această regulă: poți muta din nou o astfel de piesă.</li>
        <li><strong>Trei jucători pe o stea.</strong> Un vechi Halma pentru trei jucători pe o tablă în stea este descris cu câte 15 piese. Leapstone joacă 3 jucători pe tabla în stea cu câte 10 piese.</li>
        <li><strong>Salturile sunt alegerea ta.</strong> Nu ești niciodată obligat să sari. Tu alegi locul unde se termină mutarea ta.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Joacă în Leapstone</h2>
      <p>Joacă acum deschide un joc pe tabla în stea împotriva calculatorului. Pentru tabla pătrată, atinge săgeata de înapoi de sus și alege Tablă pătrată din meniu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 10 piese roșii în vârful de jos și 10 piese albastre în vârful de sus",
  tekst: "Tabla în stea pentru 2 jucători.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Ce este Sternhalma? Halma pe tablă în stea | Leapstone",
  beschrijving: "Sternhalma este numele german al jocului Halma pe o tablă în stea. Cum se leagă de Halma și de damele chinezești, și cum îl joci gratuit în browser.",
  h1: "Sternhalma, Halma și damele chinezești",
  intro: "Trei nume pentru jocuri foarte apropiate. Ce înseamnă fiecare, de unde vin și cum diferă.",
  inhoud,
};
