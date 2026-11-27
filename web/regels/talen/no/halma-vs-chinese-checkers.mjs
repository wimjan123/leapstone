// De gids Halma tegenover Chinese checkers in het Noors, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kinasjakk: stjernebrettet, 121 felt",
    alt: "Stjernebrettet med 10 røde brikker i den nederste spissen og 10 blå brikker i den øverste spissen",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: det firkantede brettet, 256 felt",
    alt: "Det firkantede brettet med 19 røde brikker i hjørnet øverst til venstre og 19 blå brikker i hjørnet nederst til høyre",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Stjernebrettet: seks nabofelt, tre av dem tomme her",
    alt: "En rød brikke med en hvit ring rundt. Tre av de seks nabofeltene er tomme og markert, de andre tre har brikker.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Det firkantede brettet: åtte nabofelt, fem av dem tomme her",
    alt: "En rød brikke med en hvit ring rundt. Fem av de åtte nabofeltene er tomme og markert, de andre tre har brikker.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Det korte svaret</h2>
      <p>Halma spilles på et firkantet brett og kinasjakk på et brett formet som en sekskantet stjerne. I begge spillene flytter du brikkene dine med steg og hopp over brettet, og den første spilleren som fyller leiren på den andre siden, vinner.</p>
      <p>Det som er forskjellig, er brettet, retningene du flytter i, hvor mange som kan spille, og hvor mange brikker hver har. <a href="/no/regler/hva-er-sternhalma">Sternhalma</a> er navnet på Halma på et stjernebrett, så det er det samme spillet som kinasjakk.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Brettene</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kinasjakk</strong> bruker stjernebrettet: 121 felt, med en spiss på 10 felt ved hver av de seks tuppene. En spiss er en trekant av rader med 4, 3, 2 og 1 felt.</li>
        <li><strong>Halma</strong> bruker det firkantede brettet: 16 ganger 16 felt, 256 til sammen. En leir ligger i et hjørne. En stor leir har rader med 5, 5, 4, 3 og 2 felt, en liten rader med 4, 4, 3 og 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Retninger: seks eller åtte</h2>
      <p>På stjernebrettet har et felt seks nabofelt. På det firkantede brettet har det åtte, fordi diagonalene også teller. Et steg går til et tomt nabofelt. Et hopp går over en brikke ved siden av din, i en rett linje, til det tomme feltet bak, i hver av disse retningene og også bakover.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Et felt i kanten har færre nabofelt, og et hjørne på det firkantede brettet har tre. Seks retninger gir tre linjer gjennom et felt på stjernebrettet. Åtte retninger gir fire linjer på det firkantede brettet: på tvers, opp og ned og to diagonaler.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Spillere og brikker</h2>
      <ul>
        <li><strong>Kinasjakk:</strong> 2, 3, 4 eller 6 spillere. Alle har 10 brikker, så brettet rommer 20, 30, 40 eller 60 brikker.</li>
        <li><strong>Halma:</strong> 2 eller 4 spillere. Med 2 spillere har hver 19 brikker, 38 til sammen. Med 4 spillere har hver 13 brikker, 52 til sammen.</li>
      </ul>
      <p>Det firkantede brettet har ikke noe spill for 3 eller 6 spillere i Leapstone. For et spill med tre kan du lese <a href="/no/guider/kinasjakk-for-tre-spillere">Kinasjakk for 3 spillere</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Det som er likt</h2>
      <ul>
        <li><strong>Ett trekk:</strong> ett steg eller en kjede av hopp med én brikke. Du bestemmer hvor kjeden ender, og etter et hopp kan du ikke ta et steg.</li>
        <li><strong>Hvilken som helst farge:</strong> du hopper over en brikke i hvilken som helst farge, også din egen. Brikken du hopper over, blir der den er. Ingenting blir slått.</li>
        <li><strong>Målet:</strong> leiren overfor der du startet. Alle feltene må ha dine egne brikker. Så lenge en brikke fra en annen spiller står der, kan du ikke bli ferdig.</li>
        <li><strong>Å vinne:</strong> den første spilleren som fyller målet, vinner. Med 2 spillere er spillet da over. Med flere spillere spiller de andre videre om de neste plassene, og en spiller som er ferdig, blir hoppet over.</li>
        <li><strong>Gi opp og tid:</strong> når du gir opp, forlater brikkene dine brettet. I et spill på nett har hvert trekk en tidsgrense, og hvis du går glipp av 3 turer på rad, gir du opp.</li>
      </ul>
      <p>Les de fulle reglene for <a href="/no/regler/kinasjakk">kinasjakk</a> og <a href="/no/regler/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Hvilket brett du velger i Leapstone</h2>
      <ul>
        <li><strong>3 eller 6 spillere:</strong> bare stjernebrettet har dem.</li>
        <li><strong>Flere brikker hver:</strong> det firkantede brettet, med 19 brikker hver for 2 spillere eller 13 for 4, mot 10 på stjernebrettet.</li>
        <li><strong>Spill på nett:</strong> et raskt spill spilles på stjernebrettet. Med venner og mot datamaskinen kan du velge begge brettene.</li>
      </ul>
      <p>Knappen Spill nå åpner et spill mot datamaskinen på stjernebrettet. For det firkantede brettet trykker du på tilbakepilen øverst og velger Firkantet brett i menyen.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Gå videre</h2>
      <ul>
        <li><a href="/play/">Spill i nettleseren</a> og prøv begge brettene.</li>
        <li><a href="/no/guider/kinasjakk-strategi">Strategi i kinasjakk</a>: seks tips med bilder.</li>
        <li><a href="/no/guider/kinasjakk-for-to-spillere">Kinasjakk for 2 spillere</a>: slik fungerer et spill for to.</li>
      </ul>
      <p><a href="/no/guider/kinasjakk-online-med-venner">Kinasjakk på nett med venner</a></p>
    </section>`;

export default {
  nav: "Halma eller kinasjakk",
  titel: "Halma eller kinasjakk: forskjellene | Leapstone",
  beschrijving: "Halma eller kinasjakk? Det firkantede brettet og stjernebrettet, seks eller åtte retninger, spillere og brikker, og hva som er likt.",
  h1: "Halma eller kinasjakk",
  intro: "To spill med én idé: flytt alle brikkene dine over brettet til den andre siden. Hva som er forskjellig, hva som er likt, og hvor du spiller begge.",
  inhoud,
};
