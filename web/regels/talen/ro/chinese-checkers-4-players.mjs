// Ghidul damelor chinezești pentru 4 jucători (taak 301, feature 294), în română: /ro/ghiduri/dame-chinezesti-in-patru.
// Conținut: ../en/chinese-checkers-4-players.mjs, propoziție cu propoziție. Reguli din crates/halma-core (Board::star, Game::new_star(4),
// make_move, resign), limita de timp din taak 80 și jocul rapid din taak 97 și 99. Verificarea este în docs/plan.md, taak 301.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cum este împărțită tabla</h2>
      <p>Fiecare jucător are 10 piese, deci pe tablă cu 121 de locuri stau 40 de piese. Cele patru vârfuri de start sunt două perechi de vârfuri vecine: roșu jos și albastru jos în stânga, verde sus și galben sus în dreapta.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 10 piese roșii în vârful de jos, 10 piese albastre în vârful din stânga jos, 10 piese verzi în vârful de sus și 10 piese galbene în vârful din dreapta sus. Vârfurile din stânga sus și din dreapta jos sunt goale.",
  tekst: "Roșu jos, albastru jos în stânga, verde sus, galben sus în dreapta.",
})}
      <p>Jucătorul 1, roșu, mută primul. După aceea albastru este jucătorul 2, verde este jucătorul 3, galben este jucătorul 4, iar după galben vine din nou roșu. O mutare este un pas sau un lanț de salturi cu o piesă. Vezi <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> pentru pași și salturi.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cine stă față în față cu cine</h2>
      <p>Vârfurile formează perechi față în față: roșu față în față cu verde și albastru față în față cu galben. Ținta ta este vârful din partea opusă. Roșu merge acolo unde începe verde, verde acolo unde începe roșu, albastru acolo unde începe galben și galben acolo unde începe albastru.</p>
      <p>Ca într-un joc pentru 2, fiecare țintă începe plină de piesele jucătorului din fața ta, deci poți ateriza acolo doar după ce ele au plecat. Cu 3 jucători țintele încep goale, deci cu 4 nimeni nu poate termina imediat. Cele patru ținte sunt patru vârfuri diferite, deci nimeni altcineva nu vrea ținta ta: un jucător care a terminat nu blochează pe nimeni.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Cele două vârfuri goale</h2>
      <p>Vârfurile din stânga sus și din dreapta jos nu au piese. Ele nu sunt începutul sau ținta nimănui. Cel din stânga sus se află între albastru și verde, iar cel din dreapta jos între galben și roșu.</p>
      <p>Poți face un pas sau un salt pe orice loc liber, deci poți traversa aceste vârfuri sau te poți opri în ele. O piesă de acolo nu este încă într-o țintă. Într-un vârf gol nu ai peste ce sări, până când cineva aduce piese acolo.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Ce se schimbă în tactica ta</h2>
      <ul>
        <li><strong>Două traversări deodată:</strong> roșu și verde traversează tabla unul spre celălalt, la fel albastru și galben. Ambele linii trec prin mijloc, deci mijlocul este mai aglomerat decât într-un joc pentru 2, în care traversează o singură linie.</li>
        <li><strong>Trei jucători mută între rândurile tale:</strong> tabla se schimbă între două mutări ale tale mai mult decât într-un joc pentru 2. Privește-o din nou la începutul fiecărui rând și abia apoi planifică-ți lanțul de salturi. Jucătorul care mută după tine nu este niciodată cel din fața ta.</li>
        <li><strong>Piesele îi ajută pe toți:</strong> fiecare piesă a celorlalți trei este o treaptă pentru tine, iar ale tale sunt trepte pentru ei. Piesele jucătorului din fața ta merg în sens opus, ca într-un joc pentru 2.</li>
        <li><strong>Loc să ocolești:</strong> dacă mijlocul este plin, vârfurile goale sunt spațiu liber lângă tabere. Un drum printr-unul dintre ele poate fi o cale de a ocoli aglomerația.</li>
        <li><strong>Un jucător care renunță îți eliberează ținta:</strong> când jucătorul din fața ta renunță, piesele lui ies de pe tablă, deci ținta ta este goală pe loc.</li>
      </ul>
      <p><a href="/ro/ghiduri/dame-chinezesti-strategie">Sfaturile de strategie</a> despre scări, piesele rămase în urmă și umplerea țintei din spate sunt aceleași cu 4 jucători.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Câștigul și ce se întâmplă după</h2>
      <ul>
        <li><strong>Câștigul:</strong> primul jucător care umple ținta cu toate cele 10 piese câștigă. Jocul nu se oprește aici: ceilalți trei joacă mai departe pentru următoarele locuri, iar un jucător care a terminat este sărit. Piesele acelui jucător rămân pe tablă. Jocul se termină când mai joacă un singur jucător.</li>
        <li><strong>Renunțarea:</strong> piesele tale ies de pe tablă și ceilalți trei joacă mai departe. Dacă renunță și ceilalți, câștigă ultimul jucător rămas.</li>
        <li><strong>Timpul (online):</strong> într-un joc online fiecare mutare are o limită de timp. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți, iar jocul continuă fără tine.</li>
      </ul>
      <p>Pentru jocurile cu mai puțini jucători citește <a href="/ro/ghiduri/dame-chinezesti-in-doi">Dame chinezești pentru 2 jucători</a>. <a href="/ro/reguli/dame-chinezesti">Pagina de reguli</a> are imagini cu fiecare început.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Unde joci în 4 în Leapstone</h2>
      <ul>
        <li><strong>Împotriva calculatorului, chiar acum:</strong> deschide <a href="/play/">Leapstone în browser</a>, atinge Calculator, alege tabla în stea și 3 calculatoare. Ești jucătorul 1, deci muți primul. Alegi Ușor, Normal sau Greu pentru calculatoare.</li>
        <li><strong>Pe un singur telefon:</strong> atinge Joacă, alege tabla în stea și 4 jucători, apoi atinge o piesă ca să schimbi acel loc între un om și un calculator.</li>
        <li><strong>Online cu prieteni:</strong> atinge Prieteni, alege tabla în stea, 4 jucători și timpul pe mutare, și trimite linkul de invitație. Jocul începe când toate cele 4 locuri sunt ocupate.</li>
        <li><strong>Joc rapid, în aplicație:</strong> atinge Joacă online. Cât timp aplicația caută un joc pentru 2, atinge Caută 4 sau 6 jucători ca să cauți în schimb un joc pentru 4. Fiecare mutare are 30 de secunde. Dacă nu se alătură destui jucători în 20 de secunde, jucători calculator umplu locurile goale, deci unii adversari pot fi jucători calculator.</li>
      </ul>
    </section>`;

export default {
  nav: "Dame chinezești pentru 4 jucători",
  titel: "Dame chinezești, 4 jucători: aranjare și sfaturi | Leapstone",
  beschrijving: "Cum merg damele chinezești cu 4 jucători: cum este împărțită tabla, ce 2 vârfuri rămân goale, cine stă față în față, tactica și unde joci.",
  h1: "Dame chinezești pentru 4 jucători",
  intro: "Cu 4 jucători, fiecare dintre voi începe într-unul din cele patru vârfuri ale stelei, iar două vârfuri rămân goale. Roșu stă față în față cu verde și albastru cu galben: ținta ta este vârful din partea opusă, plin de piesele acelui jucător. Iată începutul, vârfurile goale, tactica și unde poți juca.",
  inhoud,
};
