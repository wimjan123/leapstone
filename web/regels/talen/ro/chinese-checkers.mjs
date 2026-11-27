// Pagina de reguli pentru dame chinezești (taak 134), în română. Conținut: ../en/chinese-checkers.mjs, propoziție cu propoziție
// (verificat cu crates/halma-core, vezi docs/plan.md, taak 116). Fiecare regulă de aici trebuie să coincidă cu pagina engleză.
// Aceleași imagini (fără limbă: doar cifre în SVG); textele alternative și legendele sunt în română.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} jucători`,
      alt:
        {
          2: "Tabla în formă de stea cu 10 piese roșii în vârful de jos și 10 piese albastre în vârful de sus",
          3: "Tabla în formă de stea cu piese roșii jos, albastre sus în stânga și verzi sus în dreapta",
          4: "Tabla în formă de stea cu piese în patru vârfuri: roșii jos, verzi sus, albastre jos în stânga și galbene sus în dreapta",
          6: "Tabla în formă de stea cu piese în toate cele șase vârfuri, în șase culori",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Tabla</h2>
      <p>Damele chinezești se joacă pe o stea cu șase vârfuri. Tabla are 121 de locuri, iar fiecare vârf are 10 dintre ele. În interiorul tablei, fiecare loc are șase vecine.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Cum încep piesele</h2>
      <p>Fiecare jucător are 10 piese și începe cu toate într-un vârf al stelei. Vârful din fața celui al tău este ținta ta.</p>
      <ul>
        <li><strong>2 jucători:</strong> cele două vârfuri aflate față în față.</li>
        <li><strong>3 jucători:</strong> din două în două vârfuri. Cele trei ținte încep goale.</li>
        <li><strong>4 jucători:</strong> două perechi de vârfuri vecine. Fiecare jucător are un alt jucător în față.</li>
        <li><strong>6 jucători:</strong> toate cele șase vârfuri.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Rândul fiecăruia</h2>
      <p>Jucătorul 1 începe. Apoi rândurile merg în ordine, jucătorul 2, jucătorul 3 și așa mai departe, iar după ultimul jucător urmează din nou jucătorul 1. În Leapstone culorile merg cu numerele: roșu, albastru, verde, galben, mov și argintiu.</p>
      <p>La rândul tău muți o piesă, o singură dată. Nimic nu se capturează: piesele rămân pe tablă până când jucătorul lor renunță.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Mută o piesă pe un loc liber alăturat.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "O piesă roșie cu un inel alb în jurul ei. Trei dintre cele șase vecine ale ei sunt libere și marcate; celelalte trei au piese.",
  tekst: "Piesa roșie poate face un pas pe cele trei locuri marcate. Celelalte trei vecine sunt ocupate.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salt</h2>
      <p>Sari peste o piesă de lângă a ta, de orice culoare, și aterizează pe locul liber de imediat în spatele ei, în linie dreaptă. Poți sări în oricare dintre cele șase direcții, și înapoi.</p>
      <ul>
        <li>Locul pe care aterizezi trebuie să fie liber.</li>
        <li>Nu poți sări peste două piese la rând, nici peste un loc gol.</li>
        <li>Piesa peste care ai sărit rămâne unde este.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "O piesă roșie sare peste o piesă albastră pe locul liber din spatele ei, arătat cu o săgeată.",
  tekst: "Piesa roșie sare peste piesa albastră.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Un lanț de salturi</h2>
      <p>După un salt, aceeași piesă poate sări din nou, de câte ori poate și în orice direcție. Tu decizi unde te oprești. Toate salturile la un loc sunt o mutare.</p>
      <ul>
        <li>Într-o mutare nu poți ateriza de două ori pe același loc.</li>
        <li>O mutare este un pas sau unul ori mai multe salturi. Nu poți face un pas după un salt.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "O piesă roșie face trei salturi într-o mutare, peste o piesă albastră, una verde și încă una albastră. Cele trei locuri de aterizare sunt numerotate 1, 2 și 3.",
  tekst: "O mutare cu trei salturi, în ordinea numerelor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ținta</h2>
      <p>Câștigi dacă muți toate cele 10 piese ale tale în vârful din fața celui din care ai plecat. Toate cele 10 locuri ale acelui vârf trebuie să aibă piese de-ale tale. Cât timp acolo se află o piesă a altui jucător, nu poți termina.</p>
      <p>Poți ateriza pe orice loc liber, și în vârfurile altor jucători.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "O tablă în formă de stea pentru trei jucători. Roșu începe jos; vârful gol de sus, marcat cu cercuri punctate, este ținta roșului.",
  tekst: "Cu 3 jucători, roșu începe jos. Ținta roșului este vârful gol de sus.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Cu 2, 3, 4 sau 6 jucători</h2>
      <ul>
        <li><strong>2 jucători:</strong> primul jucător care umple ținta câștigă, iar jocul se termină.</li>
        <li><strong>3, 4 sau 6 jucători:</strong> primul jucător care umple ținta câștigă. Ceilalți joacă mai departe pentru următoarele locuri, iar un jucător care a terminat este sărit. Jocul se termină când mai joacă un singur jucător.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Renunțarea</h2>
      <p>Când renunți, piesele tale ies de pe tablă, deci nu blochează pe nimeni. Cu 2 jucători, celălalt jucător câștigă. Cu mai mulți jucători jocul continuă fără tine, iar dacă toți în afară de unul renunță, ultimul jucător câștigă.</p>
      <p>Într-un joc online fiecare mutare are o limită de timp. Jucătorul care începe jocul o stabilește, iar într-un joc rapid sunt 30 de secunde. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți. Jocurile împotriva calculatorului și pe un singur telefon nu au limită de timp.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Sfaturi</h2>
      <ul class="tips">
        <li><strong>Construiește scări.</strong> Pune piesele pe o linie, cu un loc liber între ele, îndreptate spre ținta ta. O piesă poate apoi sări pe toată linia într-o singură mutare.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Patru piese pe o linie diagonală cu un loc liber între ele. O piesă roșie de la un capăt sare peste toate patru, cu patru locuri de aterizare numerotate.",
  tekst: "Patru piese pe o linie: piesa roșie de sus traversează tabla într-o mutare, cu patru salturi.",
})}
        </li>
        <li><strong>Orice piesă este o scară.</strong> Poți sări peste orice culoare, deci și piesele celorlalți jucători te ajută. Iar scările tale îi ajută pe ei: uită-te la ce lași în urmă.</li>
        <li><strong>Nu uita piesele rămase în urmă.</strong> Ai nevoie de toate cele 10 piese acasă. O piesă rămasă departe în spate, fără nimic de sărit, înaintează cu un loc pe rând. Adu-o cu tine cât timp celelalte piese sunt încă în jurul ei.</li>
        <li><strong>Începutul tău este ținta lor.</strong> Cu 2, 4 sau 6 jucători, vârful tău de start este ținta jucătorului din față, iar el nu poate termina cât timp o piesă de-a ta se află încă acolo. La fel este și pentru tine.</li>
      </ul>
      <p>Mai multe sfaturi, cu imagini, sunt în ghidul despre <a href="/ro/ghiduri/dame-chinezesti-strategie">strategia la dame chinezești</a>. Pentru un joc în doi, citește <a href="/ro/ghiduri/dame-chinezesti-in-doi">damele chinezești pentru 2 jucători</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Întrebări</h2>
      <h3>Câte persoane pot juca dame chinezești?</h3>
      <p>Două, trei, patru sau șase. Fiecare jucător începe într-un vârf al stelei. Cu 2, 3 sau 4 jucători, unele vârfuri rămân goale.</p>
      <h3>Câte piese are fiecare jucător?</h3>
      <p>Fiecare jucător are 10 piese. Tabla are 121 de locuri: 10 în fiecare dintre cele șase vârfuri și 61 în mijloc.</p>
      <h3>Poți sări peste propriile piese sau înapoi?</h3>
      <p>Da. Poți sări peste o piesă de orice culoare, inclusiv a ta, în oricare dintre cele șase direcții, și înapoi. Piesa peste care sari rămâne pe loc.</p>
      <h3>Se capturează piese la dame chinezești?</h3>
      <p>Nu. Nu se capturează nimic. O piesă iese de pe tablă doar când jucătorul ei renunță.</p>
      <h3>Damele chinezești vin din China?</h3>
      <p>Nu. Jocul a apărut în Germania în 1892 sub numele Stern-Halma, pornind de la jocul mai vechi Halma. Numele dame chinezești vine din Statele Unite, din 1928. Citește mai mult la <a href="/ro/reguli/sternhalma">Sternhalma</a>.</p>
      <h3>Unde poți juca gratuit dame chinezești online cu prietenii?</h3>
      <p>În Leapstone, în browser sau în aplicația din App Store. Trimite unui prieten un link de invitație: se alătură jocului tău fără cont, adresă de e-mail sau parolă. Poți juca și împotriva calculatorului sau un joc rapid împotriva altui jucător. Leapstone este gratuit și fără reclame.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Joacă dame chinezești în Leapstone</h2>
      <p>Leapstone este o aplicație gratuită pentru dame chinezești și Halma, cu o tablă 3D din lac roșu și aur. Poți juca în aplicație și în browser.</p>
      <ul>
        <li><strong>Împotriva calculatorului.</strong> Ușor, normal sau greu. Nu ai nevoie de internet.</li>
        <li><strong>Cu prietenii.</strong> Trimite un link de invitație. Tu stabilești timpul pe mutare și puteți vorbi în chat.</li>
        <li><strong>Online.</strong> Un joc rapid împotriva altui jucător de nivelul tău, 30 de secunde pe mutare. Unii adversari online pot fi jucători calculator.</li>
        <li><strong>Pe un singur telefon.</strong> Dați telefonul din mână în mână în jurul mesei.</li>
      </ul>
      <p>Leapstone este gratuit, fără reclame și fără autentificare cu adresă de e-mail: alegi doar un nume de jucător. <a href="https://apps.apple.com/ro/app/id6831230722">Descarcă din App Store</a> sau <a href="/play/">Joacă în browser</a>.</p>
    </section>`;

export default {
  nav: "Regulile damelor chinezești",
  titel: "Regulile damelor chinezești și sfaturi | Leapstone",
  beschrijving: "Cum se joacă dame chinezești: start, pași, salturi și lanțuri de salturi, cum câștigi cu 2, 3, 4 sau 6 jucători, și sfaturi. Joacă gratuit în browser.",
  h1: "Regulile damelor chinezești",
  intro: "Mută toate cele 10 piese ale tale peste tabla în formă de stea până la vârful opus, înaintea oricui altcuiva. Regulile pe scurt, cu imagini, și câteva sfaturi.",
  inhoud,
};
