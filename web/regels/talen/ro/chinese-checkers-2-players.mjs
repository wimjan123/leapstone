// Ghidul damelor chinezești pentru 2 jucători (taak 134), în română. Conținut: ../en/chinese-checkers-2-players.mjs, propoziție cu propoziție.
// Reguli din crates/halma-core (Board::star, Game::new_star(2), make_move, resign), limita de timp din „Regels” și taak 80,
// nivelurile calculatorului din crates/halma-core/src/computer.rs. Ce arată aplicația vine din web/src/Startmenu.svelte.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cum începe jocul</h2>
      <p>Fiecare jucător are 10 piese. Ele încep în două vârfuri ale stelei aflate față în față: roșu jos, albastru sus. Cele 20 de piese stau pe o tablă cu 121 de locuri.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Tabla în formă de stea cu 10 piese roșii în vârful de jos și 10 piese albastre în vârful de sus",
  tekst: "Roșu începe jos, albastru sus.",
})}
      <p>Jucătorul 1, roșu, mută primul. După aceea mutați pe rând, câte o mutare fiecare. O mutare este un pas sau un lanț de salturi cu o piesă. Vezi <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> pentru pași și salturi.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ținta ta este începutul celuilalt jucător</h2>
      <p>Câștigi dacă muți toate cele 10 piese ale tale în vârful din care a plecat celălalt jucător. Acel vârf începe plin de piesele lui, iar al tău este plin de ale tale. Pentru roșu, acesta este vârful de sus din imaginea de mai sus.</p>
      <p>Poți ateriza doar pe un loc liber, deci fiecare dintre voi trebuie să plece din propriul vârf înainte ca celălalt să-l poată umple. Niciunul dintre voi nu poate termina cât timp o piesă a celuilalt rămâne în țintă. Și fiindcă traversați același mijloc în direcții opuse, piesele celuilalt jucător sunt trepte pentru tine, iar ale tale pentru el. Citește <a href="/ro/ghiduri/dame-chinezesti-strategie">sfaturile de strategie</a> ca să afli ce să faci cu asta.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Câștigul și renunțarea</h2>
      <ul>
        <li><strong>Câștigul:</strong> primul jucător care umple ținta cu toate cele 10 piese câștigă, iar jocul se termină pe loc. Celălalt jucător nu mai joacă.</li>
        <li><strong>Renunțarea:</strong> piesele tale ies de pe tablă și celălalt jucător câștigă.</li>
        <li><strong>Timpul (online):</strong> într-un joc online fiecare mutare are o limită de timp. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Cum diferă 3, 4 și 6 jucători</h2>
      <ul>
        <li><strong>3 jucători:</strong> piesele încep din două în două vârfuri, iar cele trei ținte încep goale. Primul care termină câștigă; ceilalți joacă mai departe pentru următoarele locuri, iar un jucător care a terminat este sărit.</li>
        <li><strong>4 jucători:</strong> două perechi de vârfuri vecine. Ținta ta începe plină de piesele altui jucător. Jocul continuă după primul care termină, ca la 3.</li>
        <li><strong>6 jucători:</strong> toate cele șase vârfuri. Pe tablă sunt 60 de piese, față de 20 cu 2 jucători.</li>
      </ul>
      <p>Cu doar 20 de piese pe tablă sunt mai puține piese peste care să sari, deci scările pe care le construiești tu însuți contează mai mult. <a href="/ro/reguli/dame-chinezesti">Pagina de reguli</a> are imagini cu fiecare început.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Unde joci în doi în Leapstone</h2>
      <ul>
        <li><strong>Împotriva calculatorului, chiar acum:</strong> deschide <a href="/play/">Leapstone în browser</a>, atinge Calculator și alege tabla în stea. Un calculator este implicit, deci este un joc în doi. Alegi Ușor, Normal sau Greu, și ești jucătorul 1, deci muți primul. Ușor alege cea mai bună dintre trei mutări aleatoare. Normal alege mutarea care avansează cel mai mult spre țintă. Greu se uită și la cum pot răspunde adversarii săi și la propria sa mutare următoare.</li>
        <li><strong>Joacă online, în aplicație:</strong> un joc rapid pe tabla în stea pentru 2 jucători, împotriva unui alt jucător de nivelul tău, cu 30 de secunde pe mutare. Unii adversari online pot fi jucători calculator.</li>
        <li><strong>Cu un prieten:</strong> trimite un link de invitație și stabilește tu timpul pe mutare. Sau dați un singur telefon de la unul la altul.</li>
      </ul>
      <p><a href="/ro/ghiduri/dame-chinezesti-online-cu-prietenii">Dame chinezești online cu prietenii</a></p>
      <p><a href="/ro/ghiduri/dame-chinezesti-in-trei">Dame chinezești pentru 3 jucători</a></p>
    </section>`;

export default {
  nav: "Dame chinezești pentru 2 jucători",
  titel: "Dame chinezești pentru 2 jucători: reguli | Leapstone",
  beschrijving: "Cum merg damele chinezești cu 2 jucători: unde încep cele 10 piese, cine mută primul, cum câștigi sau renunți, și unde joci în doi gratuit.",
  h1: "Dame chinezești pentru 2 jucători",
  intro: "Cum merge un joc în doi pe tabla în stea: începutul, cine mută primul, cum câștigi și unde poți juca.",
  inhoud,
};
