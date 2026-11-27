// Pagina de reguli Halma (taak 134), în română. Conținut: ../en/halma.mjs, propoziție cu propoziție
// (verificat cu crates/halma-core, vezi docs/plan.md, taak 117). Fiecare regulă de aici trebuie să coincidă cu pagina engleză.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 jucători: câte 19 piese",
    alt: "Tabla pătrată cu 19 piese roșii în colțul din stânga sus și 19 piese albastre în colțul din dreapta jos",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 jucători: câte 13 piese",
    alt: "Tabla pătrată cu 13 piese în fiecare dintre cele patru colțuri: roșii sus în stânga, albastre sus în dreapta, verzi jos în dreapta și galbene jos în stânga",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Tabla</h2>
      <p>Halma se joacă pe o tablă pătrată de 16 pe 16 locuri, 256 în total. Fiecare loc are până la opt vecine: cele patru în linie dreaptă și cele patru pe diagonală. Un loc de pe margine are mai puține, iar un colț are trei.</p>
      <p>Aceasta este tabla pătrată din Leapstone. Dacă știi jocul pe tabla în formă de stea, citește despre <a href="/ro/reguli/sternhalma">Sternhalma</a> și despre <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Cum încep piesele</h2>
      <p>Halma se joacă în 2 sau 4 jucători. Fiecare jucător începe cu piesele într-o tabără dintr-un colț al tablei. Tabăra din colțul opus este ținta ta.</p>
      <ul>
        <li><strong>2 jucători:</strong> câte 19 piese, în două colțuri aflate față în față. Tabăra are cinci rânduri de 5, 5, 4, 3 și 2 locuri.</li>
        <li><strong>4 jucători:</strong> câte 13 piese, o tabără în fiecare colț. Tabăra are patru rânduri de 4, 4, 3 și 2 locuri. Ținta ta este colțul din partea cealaltă a tablei, pe diagonală.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Rândul fiecăruia</h2>
      <p>Jucătorul 1 începe. Apoi rândurile merg în ordine, iar după ultimul jucător urmează din nou jucătorul 1. În Leapstone culorile merg cu numerele: roșu, albastru, verde și galben.</p>
      <p>La rândul tău muți o piesă, o singură dată. Nimic nu se capturează: piesele rămân pe tablă până când jucătorul lor renunță.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Mută o piesă pe un loc liber alăturat, în oricare dintre cele opt direcții: în linie dreaptă sau pe diagonală.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "O piesă roșie cu un inel alb în jurul ei. Cinci dintre cele opt vecine ale ei sunt libere și marcate; celelalte trei au piese.",
  tekst: "Piesa roșie poate face un pas pe cele cinci locuri marcate. Celelalte trei vecine sunt ocupate.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salt</h2>
      <p>Sari peste o piesă de lângă a ta, de orice culoare, și aterizează pe locul liber de imediat în spatele ei, în linie dreaptă. Poți sări în toate cele opt direcții, și pe diagonală, și înapoi.</p>
      <ul>
        <li>Locul pe care aterizezi trebuie să fie liber.</li>
        <li>Nu poți sări peste două piese la rând, nici peste un loc gol.</li>
        <li>Piesa peste care ai sărit rămâne unde este.</li>
        <li>Nu poți sări peste marginea tablei.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "O piesă roșie sare pe diagonală peste o piesă albastră pe locul liber din spatele ei, arătat cu o săgeată.",
  tekst: "Piesa roșie sare pe diagonală peste piesa albastră.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Un lanț de salturi</h2>
      <p>După un salt, aceeași piesă poate sări din nou, de câte ori poate, în orice direcție, în linie dreaptă sau pe diagonală. Tu decizi unde te oprești. Toate salturile la un loc sunt o mutare.</p>
      <ul>
        <li>Într-o mutare nu poți ateriza de două ori pe același loc.</li>
        <li>O mutare este un pas sau unul ori mai multe salturi. Nu poți face un pas după un salt.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "O piesă roșie face trei salturi într-o mutare: pe diagonală peste o piesă albastră, în linie dreaptă peste altă piesă albastră și pe diagonală peste o piesă roșie. Cele trei locuri de aterizare sunt numerotate 1, 2 și 3.",
  tekst: "O mutare cu trei salturi, în ordinea numerelor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ținta</h2>
      <p>Câștigi dacă muți toate piesele tale în tabăra din fața celei din care ai plecat. Toate locurile acelei tabere trebuie să aibă piese de-ale tale: 19 cu 2 jucători, 13 cu 4 jucători. Cât timp acolo se află o piesă a altui jucător, nu poți termina.</p>
      <p>Poți ateriza pe orice loc liber, și în taberele altor jucători. O piesă aflată în ținta ta poate pleca din nou; nimic n-o blochează.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Tabla pătrată pentru doi jucători. Roșu începe sus în stânga; tabăra din dreapta jos, marcată cu cercuri punctate și cu piese albastre, este ținta roșului.",
  tekst: "Cu 2 jucători, ținta roșului este tabăra în care începe albastrul.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Cu 2 sau 4 jucători</h2>
      <ul>
        <li><strong>2 jucători:</strong> primul jucător care umple ținta câștigă, iar jocul se termină.</li>
        <li><strong>4 jucători:</strong> primul jucător care umple ținta câștigă. Ceilalți joacă mai departe pentru următoarele locuri, iar un jucător care a terminat este sărit. Jocul se termină când mai joacă un singur jucător.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Renunțarea</h2>
      <p>Când renunți, piesele tale ies de pe tablă, deci nu blochează pe nimeni. Cu 2 jucători, celălalt jucător câștigă. Cu 4 jucători jocul continuă fără tine, iar dacă toți în afară de unul renunță, ultimul jucător câștigă.</p>
      <p>Într-un joc online fiecare mutare are o limită de timp. Jucătorul care începe jocul o stabilește. Când ți se termină timpul, rândul tău este sărit. Dacă pierzi 3 rânduri la rând, renunți. Jocurile împotriva calculatorului și pe un singur telefon nu au limită de timp.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Sfaturi</h2>
      <ul class="tips">
        <li><strong>Construiește scări.</strong> Pune piesele pe o linie, cu un loc liber între ele, în linie dreaptă sau pe diagonală, îndreptate spre ținta ta. O piesă poate apoi sări pe toată linia într-o singură mutare.</li>
        <li><strong>Orice piesă este o scară.</strong> Poți sări peste orice culoare, deci și piesele celorlalți jucători te ajută. Iar scările tale îi ajută pe ei: uită-te la ce lași în urmă.</li>
        <li><strong>Folosește diagonalele.</strong> Ținta este în colțul opus, deci o linie diagonală de piese este cea mai rapidă cale de traversare.</li>
        <li><strong>Nu uita piesele rămase în urmă.</strong> Ai nevoie de toate piesele acasă. O piesă rămasă departe în spate, fără nimic de sărit, înaintează cu un loc pe rând. Adu-o cu tine cât timp celelalte piese sunt încă în jurul ei.</li>
        <li><strong>Începutul tău este ținta lor.</strong> Cu 2 jucători, tabăra ta este ținta celuilalt jucător, iar el nu poate termina cât timp o piesă de-a ta se află încă acolo. Leapstone te lasă să ții o piesă acasă, deci poți bloca în felul acesta. La fel este și pentru tine.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Întrebări</h2>
      <h3>Câte persoane pot juca Halma?</h3>
      <p>Două sau patru. Halma se joacă pe o tablă pătrată de 16 pe 16 locuri, iar fiecare jucător începe într-un colț.</p>
      <h3>Câte piese are fiecare jucător la Halma?</h3>
      <p>Cu 2 jucători, câte 19 piese, iar cu 4 jucători, câte 13 piese.</p>
      <h3>Cine a inventat Halma?</h3>
      <p>George Howard Monks, un chirurg american, în 1883 sau 1884. Numele înseamnă &bdquo;săritură&rdquo; în greacă. Citește mai mult la <a href="/ro/reguli/sternhalma">Sternhalma</a>.</p>
      <h3>Care este diferența dintre Halma și damele chinezești?</h3>
      <p>Halma folosește o tablă pătrată, cu pași și sărituri în opt direcții și cu 19 sau 13 piese pentru fiecare jucător. Damele chinezești folosesc o tablă în formă de stea, cu șase direcții și 10 piese pentru fiecare jucător, pentru 2, 3, 4 sau 6 jucători.</p>
      <h3>Poți juca Halma online gratuit?</h3>
      <p>Da, în Leapstone, în browser sau în aplicația din App Store. Alege un mod de joc, de exemplu împotriva calculatorului sau online cu prietenii, apoi atinge Tablă pătrată. Leapstone este gratuit și fără reclame.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Joacă</h2>
      <p>Butonul Joacă acum deschide un joc împotriva calculatorului pe <a href="/ro/reguli/dame-chinezesti">tabla în formă de stea</a>. Ca să joci Halma, atinge săgeata de înapoi de sus, apoi alege Joacă pe acest telefon, Joacă împotriva calculatorului sau Joacă online cu prietenii, și atinge Tablă pătrată.</p>
    </section>`;

export default {
  nav: "Regulile Halma",
  titel: "Regulile Halma și sfaturi | Leapstone",
  beschrijving: "Cum se joacă Halma pe tabla pătrată de 16 pe 16: start, pași, salturi, lanțuri de salturi, cum câștigi și sfaturi. Joacă gratuit în browser.",
  h1: "Regulile Halma",
  intro: "Mută toate piesele tale peste tabla pătrată până în colțul opus, înaintea oricui altcuiva. Regulile pe scurt, cu imagini, și câteva sfaturi.",
  inhoud,
};
