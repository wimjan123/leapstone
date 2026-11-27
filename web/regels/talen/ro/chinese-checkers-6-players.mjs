// Ghidul damelor chinezești pentru 6 jucători (taak 302, feature 294), în română: /ro/ghiduri/dame-chinezesti-in-sase.
// Conținut: ../en/chinese-checkers-6-players.mjs, propoziție cu propoziție. Reguli din crates/halma-core, vezi docs/plan.md, taak 302.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cum începe jocul</h2>
      <p>Fiecare jucător are 10 piese, iar toate cele 6 vârfuri ale stelei sunt folosite. Astfel, pe tabla cu 121 de locuri stau 60 de piese. Cele 61 de locuri din mijloc sunt goale la început.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 10 piese în fiecare dintre cele 6 vârfuri, în 6 culori",
  tekst: "6 jucători, 6 vârfuri, 60 de piese.",
})}
      <p>Jucătorul 1, roșu, mută primul, din vârful de jos. Rândul merge apoi de la jucătorul 1 la jucătorul 6, iar după jucătorul 6 este din nou jucătorul 1. Jucătorii sunt numerotați în ordinea vârfurilor lor în jurul stelei, așa că jucătorul de după tine începe mereu în vârful de lângă al tău. O mutare este un pas sau un lanț de salturi cu o piesă. Vezi <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> pentru pași și salturi.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Fiecare țintă este plină la început</h2>
      <p>Câștigi dacă muți toate cele 10 piese ale tale în vârful de pe partea cealaltă a tablei. Cu 6 jucători, acesta este vârful din care pleacă jucătorul din fața ta, deci nicio țintă nu este goală: fiecare începe plină cu piesele altui jucător. Pentru roșu, ținta este vârful de sus, din care pleacă jucătorul 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 6 vârfuri pline. Un inel punctat marchează vârful de sus, ținta jucătorului roșu, care conține piesele jucătorului din față.",
  tekst: "Ținta roșului este vârful din față, plin cu piesele jucătorului 4.",
})}
      <p>Poți ateriza doar pe un loc liber, deci jucătorul din față trebuie să-și părăsească vârful înainte să-l umpli tu, iar tu trebuie să-l părăsești pe al tău înainte să-l umple el. Într-un joc pentru 2, cu asta se termină. Cu 6, ambii jucători trebuie să treacă și prin înghesuiala celorlalți 4.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Un mijloc aglomerat</h2>
      <p>Fiecare țintă este de partea cealaltă a tablei, iar vârfurile se leagă între ele doar prin mijloc, deci toate cele 60 de piese trebuie să treacă peste aceleași 61 de locuri. La început nimeni nu a trecut încă, iar mijlocul se umple repede.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "O piesă roșie sare de trei ori într-o singură mutare: peste o piesă albastră, apoi peste una verde, apoi peste una mov. Numerele 1, 2 și 3 marchează locurile de aterizare.",
  tekst: "Piesele de orice culoare sunt trepte.",
})}
      <p>Poți sări peste o piesă de orice culoare. Piesele celorlalți 5 jucători sunt trepte pentru tine, iar ale tale sunt trepte pentru toți cei 5. Un șir de piese pe care îl lași în mijloc este o scară pentru oricine poate ajunge la el, iar jucătorul de după tine are prima șansă.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blocarea cu 5 adversari</h2>
      <ul>
        <li><strong>Umple locul de aterizare:</strong> un salt are nevoie de un loc liber chiar în spatele piesei. Când muți o piesă acolo, saltul dispare pentru fiecare jucător care îl voia.</li>
        <li><strong>Ai grijă la scările pe care le construiești:</strong> după mutarea ta, mută ceilalți 5 jucători până când vine din nou rândul tău. O scară îi ajută pe toți.</li>
        <li><strong>Oricine poate bloca o țintă:</strong> o piesă a oricărui alt jucător din ținta ta te împiedică să termini, nu doar o piesă a jucătorului din față. Toate cele 10 locuri ale țintei trebuie să conțină piesele tale.</li>
      </ul>
      <p><a href="/ro/ghiduri/dame-chinezesti-strategie">Sfaturile de strategie</a> arată cum se vede un salt blocat și cum să nu blochezi piesa altui jucător în propria ta țintă.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Cât durează un joc</h2>
      <p>Un joc pentru 6 are 60 de piese de mutat, iar între o mutare a ta și următoarea fiecare dintre ceilalți 5 jucători face câte una. Jocul nu se termină nici când termină primul jucător.</p>
      <ul>
        <li><strong>Câștigă și joacă mai departe:</strong> primul jucător care umple ținta câștigă, iar ceilalți joacă mai departe pentru următoarele locuri. Jucătorul care a terminat este sărit, iar piesele lui rămân pe tablă ca trepte. Jocul se termină când mai joacă un singur jucător.</li>
        <li><strong>Renunțarea:</strong> piesele tale ies de pe tablă, deci nu mai blochează și nu mai ajută pe nimeni, iar ceilalți joacă mai departe.</li>
        <li><strong>Timpul (online):</strong> într-un joc online fiecare mutare are o limită de timp, stabilită de jucătorul care pornește jocul: 15 secunde, 30 de secunde, 1 minut, 2 minute sau fără limită. O rundă de 6 mutări durează cel mult de 6 ori limita, deci cu 30 de secunde sunt cel mult 3 minute. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți, iar jocul continuă fără tine.</li>
      </ul>
      <p>Pentru un joc cu mai puțini jucători, citește <a href="/ro/ghiduri/dame-chinezesti-in-doi">Dame chinezești pentru 2 jucători</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Unde joci cu 6 jucători în Leapstone</h2>
      <ul>
        <li><strong>Împotriva calculatoarelor, chiar acum:</strong> deschide <a href="/play/">Leapstone în browser</a>, atinge Calculator, alege tabla în stea și 5 calculatoare. Ești jucătorul 1, deci muți primul. Calculatoarele mută unul după altul, fiecare cu o scurtă pauză, ca să poți urmări fiecare mutare. Pentru calculatoare alegi Ușor, Normal sau Greu.</li>
        <li><strong>Pe un singur telefon:</strong> atinge Joacă, alege tabla în stea și 6 jucători, apoi atinge o piesă ca să comuți acel loc între o persoană și un calculator.</li>
        <li><strong>Online cu prieteni:</strong> atinge Prieteni, alege tabla în stea, 6 jucători și timpul pe mutare, apoi trimite linkul de invitație. Jocul începe când sunt ocupate toate cele 6 locuri.</li>
        <li><strong>Jocuri rapide:</strong> Joacă online găsește jocuri pentru 2 sau 4 jucători, deci nu există joc rapid pentru 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Dame chinezești pentru 6 jucători",
  titel: "Dame chinezești, 6 jucători: tabla plină | Leapstone",
  beschrijving: "Cum merg damele chinezești cu 6 jucători: o stea plină cu 60 de piese, un mijloc aglomerat, blocarea, cât durează un joc și unde joci.",
  h1: "Dame chinezești pentru 6 jucători",
  intro: "Cum merge un joc pentru 6: toate cele 6 vârfuri sunt pline, alergi spre vârful de pe partea cealaltă a tablei, iar jocul continuă după ce primul jucător termină.",
  inhoud,
};
