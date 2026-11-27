// Ghidul damelor chinezești pentru 3 jucători (taak 299), în română. Conținut: ../en/chinese-checkers-3-players.mjs, propoziție cu propoziție.
// Reguli din crates/halma-core; controlul este în docs/plan.md, taak 139. Dacă schimbi o regulă, schimbă-le pe ambele.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cum începe jocul</h2>
      <p>Fiecare jucător are 10 piese, deci 30 de piese stau pe tabla cu 121 de locuri. Ele încep din două în două vârfuri ale stelei: roșu jos, albastru sus în stânga și verde sus în dreapta. Cele trei vârfuri dintre ele sunt goale.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 10 piese roșii în vârful de jos, 10 piese albastre în vârful din stânga sus și 10 piese verzi în vârful din dreapta sus",
  tekst: "Roșu jos, albastru sus în stânga, verde sus în dreapta.",
})}
      <p>Jucătorul 1, roșu, mută primul. După aceea albastru este jucătorul 2, verde este jucătorul 3, iar după verde urmează din nou roșu. O mutare este un pas sau un lanț de salturi cu o piesă. Vezi <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> pentru pași și salturi.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Trei ținte, toate goale la început</h2>
      <p>Ținta ta este vârful opus celui din care ai plecat, iar cu 3 jucători el începe gol. Este vârful gol dintre vârfurile de start ale celorlalți doi jucători: ținta roșului este sus, a albastrului jos în dreapta și a verdelui jos în stânga.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Tabla în formă de stea pentru trei jucători. Cercuri punctate în culoarea fiecărui jucător marchează cele trei ținte goale: roșu sus, albastru jos în dreapta, verde jos în stânga.",
  tekst: "Fiecare țintă are culoarea jucătorului ei.",
})}
      <p>Câștigi dacă muți toate cele 10 piese ale tale în țintă. Toate cele 10 locuri trebuie să conțină piese proprii. Nimeni nu începe în ținta ta, dar te poți opri pe orice loc liber, așa că o piesă a altui jucător poate ateriza acolo mai târziu. Cât timp ea stă acolo, nu poți termina.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Câștigul și ce se întâmplă după</h2>
      <ul>
        <li><strong>Câștigul:</strong> primul jucător care umple ținta câștigă. Jocul nu se oprește aici: ceilalți doi joacă mai departe pentru următoarele locuri, iar jucătorul care a terminat este sărit. Jocul se termină când mai joacă un singur jucător.</li>
        <li><strong>Renunțarea:</strong> piesele tale ies de pe tablă și ceilalți doi joacă mai departe. Dacă un al doilea jucător renunță înainte ca cineva să termine, câștigă ultimul jucător rămas.</li>
        <li><strong>Timpul (online):</strong> într-un joc online fiecare mutare are o limită de timp, stabilită de jucătorul care pornește jocul. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți, iar jocul continuă fără tine.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Cum diferă de un joc pentru 2</h2>
      <ul>
        <li><strong>Mai multe piese:</strong> 30 pe tablă, față de 20 cu 2 jucători.</li>
        <li><strong>Ținte goale:</strong> cu 2 jucători, ținta ta începe plină de piesele celuilalt jucător. Cu 3, începe goală.</li>
        <li><strong>Doi adversari:</strong> după mutarea ta, mută doi alți jucători înainte să-ți vină din nou rândul. Piesele ambilor sunt trepte pentru tine, iar ale tale pentru ei. O scară pe care o construiești o pot folosi amândoi, iar jucătorul de după tine are prima șansă.</li>
        <li><strong>Jocul continuă:</strong> cu 2 jucători jocul se termină când unul dintre voi a terminat. Cu 3, continuă pentru locul al doilea și al treilea.</li>
      </ul>
      <p>Pentru jocul în doi citește <a href="/ro/ghiduri/dame-chinezesti-in-doi">damele chinezești pentru 2 jucători</a>. <a href="/ro/ghiduri/dame-chinezesti-strategie">Sfaturile de strategie</a> vorbesc despre pași și salturi, care sunt la fel cu 3 jucători.</p>
      <p><a href="/ro/ghiduri/dame-chinezesti-online-cu-prietenii">Dame chinezești online cu prietenii</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Unde joci în trei în Leapstone</h2>
      <ul>
        <li><strong>Împotriva calculatorului, chiar acum:</strong> deschide <a href="/play/">Leapstone în browser</a>, atinge Calculator, alege tabla în stea și 2 calculatoare. Ești jucătorul 1, deci muți primul. Alegi Ușor, Normal sau Greu pentru calculatoare.</li>
        <li><strong>Pe un singur telefon:</strong> atinge „Pe acest telefon”, alege tabla în stea și 3 jucători, apoi atinge o piesă ca să schimbi locul acela între o persoană și un calculator.</li>
        <li><strong>Online cu prieteni:</strong> atinge Prieteni, alege tabla în stea, 3 jucători și timpul pe mutare, și trimite linkul de invitație. Jocul începe când toate cele 3 locuri sunt ocupate.</li>
        <li><strong>Jocuri rapide:</strong> Joacă online găsește jocuri pentru 2 sau 4 jucători, deci nu există joc rapid pentru 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Dame chinezești pentru 3 jucători",
  titel: "Dame chinezești pentru 3 jucători: reguli | Leapstone",
  beschrijving: "Cum merg damele chinezești cu 3 jucători: unde încep cele 30 de piese, ce vârf gol este fiecare țintă, cine mută primul și cum câștigi.",
  h1: "Dame chinezești pentru 3 jucători",
  intro: "Cum merge un joc în trei pe tabla în stea: începutul, cele trei ținte, cine mută primul, cum câștigi și unde poți juca.",
  inhoud,
};
