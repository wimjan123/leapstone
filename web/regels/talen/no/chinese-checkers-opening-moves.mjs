// Den norske guiden Åpningstrekk i kinasjakk (oppgave 303, feature 294): /no/guider/kinasjakk-apningstrekk.
// Innhold: den engelske guiden ../en/chinese-checkers-opening-moves.mjs (hvert tall og hvert trekk er kontrollert mot crates/halma-core), setning for setning på norsk.
// En rad er alle feltene med samme avstand til din egen spiss; et steg rykker 1 rad fram, et hopp 2. Ingen oppdiktede "eksperter" eller historie.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Ditt første trekk: 14 valg</h2>
      <p>I starten fyller de 10 brikkene dine en trekant i rader med 4, 3, 2 og 1, og den fremste raden vender mot midten av brettet. Det er ikke noe tomt felt inne i trekanten, så en brikke kan bare gå til raden rett foran seg. Det gir 14 første trekk: hver av de 4 brikkene i fremste rad kan gå et steg til 2 felt (8 steg), og hver av de 3 brikkene i andre rad kan hoppe over en fremre brikke til 2 felt (6 hopp). De andre 3 brikkene kan ikke flytte seg ennå.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Den røde spissen nederst med de 10 brikkene sine, og i raden rett foran den 5 tomme felt markert med en ring.",
  tekst: "Hvert første trekk ender på ett av disse 5 feltene.",
})}
      <p>I denne guiden er en rad en linje av felt på tvers av spissen din, parallelt med forkanten, og vi teller fremgang i rader. Et steg tar en brikke 1 rad frem, og et hopp tar den 2 rader. Alle spillere har de samme 14 første trekkene, med 2, 3, 4 eller 6 spillere og fra hvilken som helst spiss på stjernen, fordi alle spisser ser like ut innenfra.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Åpning 1: hopp ut, og frigjør så tuppen</h2>
      <p>Brikken i tuppen av spissen din er lengst fra målet ditt, og den kan ikke flytte seg i starten: den kan bare hoppe over en brikke hvis feltet bak brikken er tomt. Et hopp fra andre rad lager akkurat et slikt felt.</p>
      <ol>
        <li><strong>Trekk 1:</strong> brikken ytterst til høyre i andre rad hopper over brikken foran seg. Den lander i raden foran spissen din og vinner 2 rader.</li>
        <li><strong>Trekk 2:</strong> brikken i tuppen hopper to ganger i ett trekk: først inn på feltet som trekk 1 tømte, og deretter over en brikke i andre rad. Den vinner 4 rader.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Den røde spissen etter trekk 1. Brikken i tuppen har en ring, og 2 piler med tallene 1 og 2 viser hoppene dens gjennom det tømte feltet til raden foran spissen.",
  tekst: "Etter trekk 1 hopper brikken i tuppen ut i 2 hopp.",
})}
      <p>Det er 6 rader på 2 trekk. Vi prøvde alle måter å spille 2 trekk på, og 6 er mest du kan vinne. Bare 4 par med trekk klarer det: brikken i begge ender av andre rad hopper, i en av sine 2 retninger, og brikken i tuppen følger etter. Brikken midt i andre rad duger ikke, fordi den holder tuppen innesperret.</p>
      <p>Begge brikkene står nå i raden foran spissen din med et tomt felt imellom. Det er det første trinnet i en stige.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Åpning 2: 4 trekk med 4 forskjellige brikker</h2>
      <p>På 4 trekk kan du vinne høyst 13 rader, og det klarer du bare når hvert trekk bruker en ny brikke. Denne linjen gjør det:</p>
      <ol>
        <li><strong>Trekk 1:</strong> brikken ytterst til høyre i fremste rad går et steg frem. Den vinner 1 rad.</li>
        <li><strong>Trekk 2:</strong> brikken ytterst til høyre i tredje rad hopper to ganger. Den vinner 4 rader.</li>
        <li><strong>Trekk 3:</strong> brikken ytterst til venstre i andre rad hopper to ganger. Den vinner 4 rader.</li>
        <li><strong>Trekk 4:</strong> brikken i tuppen hopper to ganger. Den vinner 4 rader.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Den røde spissen i starten. De 4 brikkene som skal flyttes har et nummer fra 1 til 4, i rekkefølgen på trekkene.",
          tekst: "Før: brikkene som flyttes, i rekkefølge.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Den røde spissen etter 4 trekk, med de 4 feltene der de nummererte brikkene landet i radene foran spissen, og 4 hull igjen i spissen.",
          tekst: "Etter: der de landet.",
        })}
      </div>
      <p>Hvert trekk forbereder det neste. Trekk 2 og 3 ender med et hopp over brikken som nettopp flyttet seg, og trekk 4 starter gjennom hullet som trekk 3 etterlot. Alle 4 brikkene lander i din egen halvdel av brettet.</p>
      <p>Det finnes flere linjer som når 13. Det de har felles er tanken: se etter trekket som etterlater et hull eller en trinnbrikke for neste trekk, og slipp ut brikken i tuppen senest med trekk 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Feil i de første trekkene</h2>
      <ul class="tips">
        <li><strong>Å flytte den samme brikken hver tur.</strong> En brikke som løper alene vinner 5 rader på 4 trekk, mot 13 for 4 forskjellige brikker. Den lar også resten av brikkene dine stå der de var.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Den røde spissen i starten. Én brikke fra andre rad gjør 4 trekk på rad langs én linje, med piler og tallene 1 til 4, og ender alene nær midten av brettet.",
  tekst: "Én brikke, 4 trekk, 5 rader.",
})}
      <ul class="tips">
        <li><strong>Bare å gå med fremste rad.</strong> 4 steg vinner 4 rader. Etter dem kan brikken i tuppen fortsatt ikke flytte seg, så den blir stående bakerst mens resten går fremover.</li>
        <li><strong>Å gå sidelengs.</strong> Et steg langs en rad vinner 0 rader. Etter trekk 1 i åpning 1 kan brikken foran gå til feltet ved siden av, og det ser ut som fremgang, men trekket er bortkastet.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Slik går du videre</h2>
      <p>Etter omtrent 4 trekk kommer de to hærene tett på hverandre, og åpningene over går over i midtspillet. Du trenger ikke huske linjene: husk at hvert trekk skal forberede det neste.</p>
      <ul>
        <li><a href="/play/">Spill mot datamaskinen i nettleseren</a> og prøv åpning 1 eller 2.</li>
        <li><a href="/no/guider/kinasjakk-strategi">Strategi i kinasjakk</a>: stiger, å holde brikkene samlet og å fylle målet ditt.</li>
        <li><a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>: hvordan et spill for to fungerer.</li>
        <li><a href="/no/regler/kinasjakk">Regler for kinasjakk</a>, med bilder av steg, hopp og kjeder.</li>
      </ul>
    </section>`;

export default {
  nav: "Åpningstrekk i kinasjakk",
  titel: "Åpningstrekk i kinasjakk: 2 åpninger | Leapstone",
  beschrijving: "Åpningstrekk i kinasjakk: slik hopper du ut av spissen din, frigjør brikken i tuppen med trekk 2 og vinner 13 rader på 4 trekk, og feil du bør unngå.",
  h1: "Åpningstrekk i kinasjakk",
  intro: "En god åpning i kinasjakk hopper ut av andre rad, bruker en ny brikke hver tur og slipper ut brikken i tuppen med trekk 2 eller 4. To åpninger med bilder og feil du bør unngå.",
  inhoud,
};
