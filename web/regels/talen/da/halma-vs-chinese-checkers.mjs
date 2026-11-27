// De gids Halma tegenover Chinese checkers in het Deens, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kinaskak: stjernebrættet, 121 felter",
    alt: "Stjernebrættet med 10 røde brikker i den nederste spids og 10 blå brikker i den øverste spids",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: det firkantede bræt, 256 felter",
    alt: "Det firkantede bræt med 19 røde brikker i hjørnet øverst til venstre og 19 blå brikker i hjørnet nederst til højre",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Stjernebrættet: seks nabofelter, tre af dem tomme her",
    alt: "En rød brik med en hvid ring rundt om. Tre af dens seks nabofelter er tomme og markerede, de andre tre har brikker.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Det firkantede bræt: otte nabofelter, fem af dem tomme her",
    alt: "En rød brik med en hvid ring rundt om. Fem af dens otte nabofelter er tomme og markerede, de andre tre har brikker.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Det korte svar</h2>
      <p>Halma spilles på et firkantet bræt og kinaskak på et bræt formet som en sekskantet stjerne. I begge spil flytter du dine brikker med skridt og hop hen over brættet, og den første spiller, der fylder lejren på den anden side, vinder.</p>
      <p>Det, der er forskelligt, er brættet, retningerne du flytter i, hvor mange der kan spille, og hvor mange brikker hver har. <a href="/da/regler/hvad-er-sternhalma">Sternhalma</a> er navnet på Halma på et stjernebræt, så det er det samme spil som kinaskak.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Brættene</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kinaskak</strong> bruger stjernebrættet: 121 felter, med en spids på 10 felter ved hver af de seks takker. En spids er en trekant af rækker med 4, 3, 2 og 1 felter.</li>
        <li><strong>Halma</strong> bruger det firkantede bræt: 16 gange 16 felter, 256 i alt. En lejr ligger i et hjørne. En stor lejr har rækker med 5, 5, 4, 3 og 2 felter, en lille rækker med 4, 4, 3 og 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Retninger: seks eller otte</h2>
      <p>På stjernebrættet har et felt seks nabofelter. På det firkantede bræt har det otte, fordi diagonalerne også tæller. Et skridt går til et tomt nabofelt. Et hop går over en brik ved siden af din, i en ret linje, til det tomme felt bagved, i hver af disse retninger og også baglæns.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Et felt i kanten har færre nabofelter, og et hjørne på det firkantede bræt har tre. Seks retninger giver tre linjer gennem et felt på stjernebrættet. Otte retninger giver fire linjer på det firkantede bræt: på tværs, op og ned og to diagonaler.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Spillere og brikker</h2>
      <ul>
        <li><strong>Kinaskak:</strong> 2, 3, 4 eller 6 spillere. Alle har 10 brikker, så brættet rummer 20, 30, 40 eller 60 brikker.</li>
        <li><strong>Halma:</strong> 2 eller 4 spillere. Med 2 spillere har hver 19 brikker, 38 i alt. Med 4 spillere har hver 13 brikker, 52 i alt.</li>
      </ul>
      <p>Det firkantede bræt har intet spil for 3 eller 6 spillere i Leapstone. Til et spil med tre kan du læse <a href="/da/guider/kinaskak-for-tre-spillere">Kinaskak for 3 spillere</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Det, der er ens</h2>
      <ul>
        <li><strong>Et træk:</strong> ét skridt eller en kæde af hop med én brik. Du bestemmer, hvor kæden ender, og efter et hop kan du ikke tage et skridt.</li>
        <li><strong>Hvilken som helst farve:</strong> du hopper over en brik i hvilken som helst farve, også din egen. Brikken, du hopper over, bliver, hvor den er. Der bliver ikke slået noget.</li>
        <li><strong>Målet:</strong> lejren over for der, hvor du startede. Alle dens felter skal have dine egne brikker. Så længe en brik fra en anden spiller står der, kan du ikke blive færdig.</li>
        <li><strong>At vinde:</strong> den første spiller, der fylder målet, vinder. Med 2 spillere er spillet så slut. Med flere spillere spiller de andre videre om de næste pladser, og en spiller, der er færdig, bliver sprunget over.</li>
        <li><strong>Give op og tid:</strong> når du giver op, forlader dine brikker brættet. I et onlinespil har hvert træk en tidsgrænse, og hvis du misser 3 ture i træk, giver du op.</li>
      </ul>
      <p>Læs de fulde regler for <a href="/da/regler/kinaskak">kinaskak</a> og <a href="/da/regler/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Hvilket bræt du vælger i Leapstone</h2>
      <ul>
        <li><strong>3 eller 6 spillere:</strong> kun stjernebrættet har dem.</li>
        <li><strong>Flere brikker hver:</strong> det firkantede bræt, med 19 brikker hver for 2 spillere eller 13 for 4, mod 10 på stjernebrættet.</li>
        <li><strong>Spil online:</strong> et hurtigt spil spilles på stjernebrættet. Med venner og mod computeren kan du vælge begge bræt.</li>
      </ul>
      <p>Knappen Spil nu åbner et spil mod computeren på stjernebrættet. For at spille på det firkantede bræt skal du trykke på tilbagepilen øverst og vælge Firkantet bræt i menuen.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Kom videre</h2>
      <ul>
        <li><a href="/play/">Spil i din browser</a> og prøv begge bræt.</li>
        <li><a href="/da/guider/kinaskak-strategi">Strategi i kinaskak</a>: seks tips med billeder.</li>
        <li><a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>: sådan fungerer et spil for to.</li>
      </ul>
      <p><a href="/da/guider/kinaskak-online-med-venner">Kinaskak online med venner</a></p>
    </section>`;

export default {
  nav: "Halma eller kinaskak",
  titel: "Halma eller kinaskak: forskellene | Leapstone",
  beschrijving: "Halma eller kinaskak? Det firkantede bræt og stjernebrættet, seks eller otte retninger, spillere og brikker, og hvad der er ens.",
  h1: "Halma eller kinaskak",
  intro: "To spil med én idé: flyt alle dine brikker hen over brættet til den anden side. Hvad der er forskelligt, hvad der er ens, og hvor du spiller begge.",
  inhoud,
};
