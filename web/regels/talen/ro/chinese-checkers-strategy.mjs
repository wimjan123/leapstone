// Ghidul de strategie pentru dame chinezești (taak 134), în română. Conținut: ../en/chinese-checkers-strategy.mjs, propoziție cu propoziție.
// Fiecare sfat a fost verificat cu crates/halma-core (vezi docs/plan.md, taak 122). Fără „experți”, cifre sau istorie inventate.
// Singura cifră este 16 (pași de la vârf la vârf), pe care o numără exemplul.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Pe ce se sprijină aceste sfaturi</h2>
      <p>Sfaturile decurg din <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a> așa cum le joacă Leapstone: o mutare este un pas sau un lanț de salturi, și poți sări peste o piesă de orice culoare. Nu sunt o dovadă a celui mai bun joc. Jocul împotriva calculatorului este cea mai rapidă cale de a le încerca.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Construiește scări</h2>
      <p>O scară este o linie de piese cu un loc liber între fiecare două. O piesă de la un capăt sare peste toată linia într-o singură mutare, deci traversează tabla dintr-un rând, în loc de un loc pe rând.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Patru piese pe o linie diagonală cu un loc liber între ele. O piesă roșie de la un capăt sare peste toate patru, cu patru locuri de aterizare numerotate.",
  tekst: "Patru salturi într-o mutare. Aceeași piesă ar fi putut face doar câte un pas de un loc.",
})}
      <p>Un salt merge în toate cele șase direcții, și înapoi, deci o scară nu trebuie să înceapă în vârful tău. Orice linie de piese cu goluri între ele merge.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Ține piesele împreună</h2>
      <p>Ai nevoie de toate cele 10 piese în țintă, deci ultima ta piesă decide când termini. O piesă fără nicio piesă alături nu are nimic de sărit și poate face doar pași.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "O tablă în formă de stea cu o piesă roșie singură în vârful de jos. Sunt marcate doar cele două vecine libere ale ei. Alte piese roșii și albastre stau în mijloc.",
  tekst: "Această piesă nu are nicio vecină, deci poate face un pas doar pe cele două locuri marcate.",
})}
      <p>De la capătul propriului vârf până la capătul țintei, de cealaltă parte a tablei, sunt 16 pași. Adică 16 rânduri pentru o piesă singură, în timp ce o scară traversează într-unul. Mută piesele din spate cât timp mai sunt piese în jurul lor peste care să sari. Calculatorul din Leapstone face la fel: dă un scor puțin mai mare mutărilor pieselor sale cele mai din spate.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Folosește mijlocul</h2>
      <p>O piesă din mijlocul tablei are șase vecine, deci poate face un pas sau un salt în toate cele șase direcții. O piesă de la margine are mai puține. Piesa de la margine din imagine are patru.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "O tablă în formă de stea cu o piesă roșie în mijloc, cu șase vecine marcate, și o piesă roșie lângă marginea din stânga sus, cu patru vecine marcate.",
  tekst: "Șase feluri de a face un pas în mijloc, patru la margine.",
})}
      <p>Piesele din mijloc dau și celorlalte piese ceva peste care să sară în drumul lor.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Umple ținta din spate</h2>
      <p>Ținta ta este un triunghi de 10 locuri, în rânduri de 4, 3, 2 și 1. Locurile din spate pot fi atinse doar prin locurile din fața lor. Dacă umpli întâi fața, ultima piesă poate rămâne fără drum de intrare.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Vârful țintă de sus cu nouă piese roșii și un loc liber chiar în spate, marcat cu linii punctate. A zecea piesă roșie, cu un inel alb, stă sub rândul din față.",
  tekst: "Nouă piese sunt acasă, iar locul din spate este liber. A zecea piesă nu are nicio mutare spre el.",
})}
      <p>Pune primele piese pe locurile din spate și lucrează spre față, ca fața să rămână liberă pentru piesele care ajung ultimele.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Nu bloca o piesă în ținta ta</h2>
      <p>Te poți opri în vârful altui jucător, deci o piesă a altui jucător poate ajunge în ținta ta. Câștigi doar când toate cele 10 locuri ale țintei tale au piese de-ale tale. Dacă acea piesă nu are nicio mutare, nimeni nu o poate muta, și nu poți câștiga până nu se deschide un loc de lângă ea.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Vârful țintă de sus cu nouă piese roșii și o piesă albastră chiar în spate, marcată cu un inel alb. Piesa albastră este înconjurată de piese roșii.",
  tekst: "Piesa albastră din spate nu are nicio mutare, iar roșul nu poate umple ținta.",
})}
      <p>Ține liber un loc de lângă o astfel de piesă, ca ea să poată pleca. Calculatorul din Leapstone ține cont de asta: o mutare care blochează o piesă a altui jucător în ținta lui primește un scor mai mic. Regulile nu obligă pe nimeni să iasă din ținta ta, deci celălalt jucător poate lăsa o piesă acolo și intenționat.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blochează un salt, sau lasă-l</h2>
      <p>Un salt are nevoie de un loc liber pe care să aterizeze. Umple acel loc și saltul dispare. Nici două piese la rând nu pot fi sărite.</p>
      <p>Piesele tale sunt trepte și pentru celălalt jucător. În imaginea din stânga, albastrul traversează două piese roșii într-o mutare. În cea din dreapta, roșul a mutat o piesă pe primul loc de aterizare, iar albastrul poate face doar un pas.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "O piesă albastră cu două piese roșii pe o linie, fiecare cu un loc liber în spate. Săgeți arată două salturi ale piesei albastre.",
          tekst: "Înainte: albastrul poate face două salturi.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Aceeași linie după ce roșul și-a mutat piesa îndepărtată pe primul loc de aterizare. Piesa albastră este urmată de două piese roșii la rând.",
          tekst: "După: roșul a mutat o piesă. Albastrul nu are niciun salt.",
        })}
      </div>
      <p>O mutare folosită pentru blocare este o mutare care nu merge spre propria ta înaintare, deci blochează când saltul îi dă celuilalt jucător mai mult decât ți-ar da ție mutarea ta. Merge invers când construiești o scară: după mutarea ta, celălalt jucător mută primul, deci o piesă a lui de la un capăt folosește scara ta înaintea ta. Pe nivelul cel mai greu, calculatorul se uită la cel mai bun răspuns al fiecărui adversar înainte să aleagă o mutare.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Mergi mai departe</h2>
      <ul>
        <li><a href="/play/">Joacă împotriva calculatorului în browser</a> și încearcă o scară.</li>
        <li><a href="/ro/ghiduri/dame-chinezesti-in-doi">Damele chinezești pentru 2 jucători</a>: cum merge un joc în doi.</li>
        <li><a href="/ro/reguli/dame-chinezesti">Regulile damelor chinezești</a>, cu imagini cu pași, salturi și lanțuri.</li>
      </ul>
      <p><a href="/ro/ghiduri/dame-chinezesti-online-cu-prietenii">Dame chinezești online cu prietenii</a></p>
      <p><a href="/ro/ghiduri/halma-sau-dame-chinezesti">Halma sau dame chinezești</a></p>
      <p><a href="/ro/ghiduri/dame-chinezesti-in-trei">Dame chinezești pentru 3 jucători</a></p>
    </section>`;

export default {
  nav: "Strategia la dame chinezești",
  titel: "Strategia la dame chinezești: 6 sfaturi | Leapstone",
  beschrijving: "Strategia la dame chinezești: construiește scări, ține piesele împreună, folosește mijlocul, umple ținta din spate și știi când să blochezi un salt.",
  h1: "Strategia la dame chinezești",
  intro: "Șase sfaturi pentru tabla în stea, fiecare cu o imagine din regulile reale: scări, piese rămase în urmă, mijlocul, umplerea țintei și blocarea salturilor.",
  inhoud,
};
