// Ghidul de deschideri pentru dame chinezești (taak 303, feature 294), în română: /ro/ghiduri/dame-chinezesti-deschideri.
// Conținut: ../en/chinese-checkers-opening-moves.mjs, propoziție cu propoziție. Fiecare cifră și fiecare mutare au fost verificate cu crates/halma-core;
// imaginile vin din crates/halma-core/examples/regelplaatjes.rs (secțiunea "taak 303"). Schimbi o mutare? Schimbă ambele versiuni.
// Un „rând” înseamnă toate locurile aflate la aceeași distanță de propriul vârf; un pas înaintează 1 rând, un salt 2.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Prima ta mutare: 14 alegeri</h2>
      <p>La început, cele 10 piese ale tale umplu un triunghi în rânduri de 4, 3, 2 și 1, iar rândul din față privește spre mijlocul tablei. În triunghi nu există niciun loc liber, așa că o piesă poate merge doar în rândul de chiar în fața ei. Rezultă 14 prime mutări: fiecare dintre cele 4 piese din rândul din față poate face un pas pe 2 locuri (8 pași), iar fiecare dintre cele 3 piese din al doilea rând poate sări peste o piesă din față pe 2 locuri (6 salturi). Celelalte 3 piese nu se pot mișca încă.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Vârful roșu de jos cu cele 10 piese ale lui și, în rândul de chiar în fața lui, 5 locuri libere marcate cu un inel.",
  tekst: "Orice primă mutare se termină pe unul dintre aceste 5 locuri.",
})}
      <p>În acest ghid, un rând este o linie de locuri de-a curmezișul vârfului tău, paralelă cu marginea lui din față, iar progresul îl numărăm în rânduri. Un pas duce o piesă 1 rând înainte, iar un salt o duce 2 rânduri. Fiecare jucător are aceleași 14 prime mutări, cu 2, 3, 4 sau 6 jucători și din orice vârf al stelei, pentru că privit dinăuntru fiecare vârf arată la fel.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Deschiderea 1: sari afară, apoi eliberează piesa din capăt</h2>
      <p>Piesa din capătul vârfului tău este cea mai departe de țintă și nu se poate mișca la început: poate sări peste o piesă doar dacă locul din spatele acelei piese este liber. Un salt din al doilea rând face exact un astfel de loc.</p>
      <ol>
        <li><strong>Mutarea 1:</strong> piesa din dreapta rândului al doilea sare peste piesa din fața ei. Aterizează în rândul din fața vârfului tău și câștigă 2 rânduri.</li>
        <li><strong>Mutarea 2:</strong> piesa din capăt sare de două ori într-o singură mutare: mai întâi pe locul pe care l-a eliberat mutarea 1, apoi peste o piesă din al doilea rând. Câștigă 4 rânduri.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Vârful roșu după mutarea 1. Piesa din capăt are un inel, iar 2 săgeți cu numerele 1 și 2 arată salturile ei prin locul eliberat până în rândul din fața vârfului.",
  tekst: "După mutarea 1, piesa din capăt iese în 2 salturi.",
})}
      <p>Asta înseamnă 6 rânduri în 2 mutări. Am încercat toate felurile de a juca 2 mutări, iar 6 este maximul pe care îl poți câștiga. Doar 4 perechi de mutări ajung la el: sare piesa din oricare capăt al rândului al doilea, într-una dintre cele 2 direcții ale ei, și piesa din capăt o urmează. Piesa din mijlocul rândului al doilea nu merge, pentru că lasă piesa din capăt blocată.</p>
      <p>Ambele piese stau acum în rândul din fața vârfului tău, cu un loc liber între ele. Acesta este primul pas al unei scări.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Deschiderea 2: 4 mutări cu 4 piese diferite</h2>
      <p>În 4 mutări poți câștiga cel mult 13 rânduri, și ajungi acolo doar dacă fiecare mutare folosește o altă piesă. Această serie reușește:</p>
      <ol>
        <li><strong>Mutarea 1:</strong> piesa din dreapta rândului din față face un pas înainte. Câștigă 1 rând.</li>
        <li><strong>Mutarea 2:</strong> piesa din dreapta rândului al treilea sare de două ori. Câștigă 4 rânduri.</li>
        <li><strong>Mutarea 3:</strong> piesa din stânga rândului al doilea sare de două ori. Câștigă 4 rânduri.</li>
        <li><strong>Mutarea 4:</strong> piesa din capăt sare de două ori. Câștigă 4 rânduri.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Vârful roșu la început. Cele 4 piese care se vor muta au un număr de la 1 la 4, în ordinea mutărilor.",
          tekst: "Înainte: piesele care se mută, în ordine.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Vârful roșu după 4 mutări, cu cele 4 locuri unde au aterizat piesele numerotate în rândurile din fața vârfului și 4 goluri rămase în vârf.",
          tekst: "După: unde au aterizat.",
        })}
      </div>
      <p>Fiecare mutare o pregătește pe următoarea. Mutările 2 și 3 se termină cu un salt peste piesa mutată chiar înainte, iar mutarea 4 începe prin golul lăsat de mutarea 3. Toate cele 4 piese aterizează în jumătatea ta de tablă.</p>
      <p>Există și alte serii care ajung la 13. Ce au în comun este ideea: caută mutarea care lasă un gol sau un punct de sprijin pentru mutarea următoare și scoate piesa din capăt cel târziu la mutarea 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Greșeli la primele mutări</h2>
      <ul class="tips">
        <li><strong>Mutarea aceleiași piese la fiecare tură.</strong> O piesă care aleargă singură câștigă 5 rânduri în 4 mutări, față de 13 pentru 4 piese diferite. În plus, lasă restul pieselor tale pe loc.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Vârful roșu la început. O piesă din al doilea rând face 4 mutări la rând pe aceeași linie, cu săgeți și numerele de la 1 la 4, și rămâne singură aproape de mijlocul tablei.",
  tekst: "O piesă, 4 mutări, 5 rânduri.",
})}
      <ul class="tips">
        <li><strong>Doar pași cu rândul din față.</strong> 4 pași câștigă 4 rânduri. După ei, piesa din capăt tot nu se poate mișca, deci rămâne în spate în timp ce restul înaintează.</li>
        <li><strong>Pași în lateral.</strong> Un pas de-a lungul unui rând câștigă 0 rânduri. După mutarea 1 din deschiderea 1, piesa din față poate face un pas pe locul de lângă ea, și pare progres, dar mutarea este irosită.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Mergi mai departe</h2>
      <p>După aproximativ 4 mutări, cele două armate se apropie, iar deschiderile de mai sus lasă locul mijlocului de joc. Nu trebuie să ții minte seriile: ține minte că fiecare mutare trebuie să o pregătească pe următoarea.</p>
      <ul>
        <li><a href="/play/">Joacă împotriva calculatorului în browser</a> și încearcă deschiderea 1 sau 2.</li>
        <li><a href="/ro/ghiduri/dame-chinezesti-strategie">Strategia la dame chinezești</a>: scări, piese ținute împreună și umplerea țintei.</li>
        <li><a href="/ro/ghiduri/dame-chinezesti-in-doi">Damele chinezești pentru 2 jucători</a>: cum merge un joc în doi.</li>
        <li><a href="/ro/reguli/dame-chinezesti">Regulile damelor chinezești</a>, cu imagini cu pași, salturi și lanțuri.</li>
      </ul>
    </section>`;

export default {
  nav: "Deschideri la dame chinezești",
  titel: "Deschideri la dame chinezești: 2 deschideri | Leapstone",
  beschrijving: "Deschideri la dame chinezești: cum sari din vârf, eliberezi piesa din capăt la mutarea 2 și câștigi 13 rânduri în 4 mutări, plus greșelile de evitat.",
  h1: "Deschideri la dame chinezești",
  intro: "O deschidere bună la dame chinezești sare din al doilea rând, folosește la fiecare tură altă piesă și scoate piesa din capătul vârfului tău la mutarea 2 sau 4. Două deschideri cu imagini și greșelile de evitat.",
  inhoud,
};
