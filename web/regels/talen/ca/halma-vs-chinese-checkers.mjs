// La guia Halma o dames xineses en català (taak 300). Contingut: la guia anglesa ../en/halma-vs-chinese-checkers.mjs, frase per frase.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dames xineses: el tauler en estrella, 121 caselles",
    alt: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix i 10 fitxes blaves a la punta de dalt",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: el tauler quadrat, 256 caselles",
    alt: "El tauler quadrat amb 19 fitxes vermelles a la cantonada de dalt a l'esquerra i 19 fitxes blaves a la cantonada de baix a la dreta",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Tauler en estrella: sis veïnes, tres d'elles buides aquí",
    alt: "Una fitxa vermella amb un anell blanc al voltant. Tres de les seves sis veïnes són buides i marcades; les altres tres tenen fitxes.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Tauler quadrat: vuit veïnes, cinc d'elles buides aquí",
    alt: "Una fitxa vermella amb un anell blanc al voltant. Cinc de les seves vuit veïnes són buides i marcades; les altres tres tenen fitxes.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">La resposta curta</h2>
      <p>El Halma es juga en un tauler quadrat i les dames xineses en un tauler amb forma d'estrella de sis puntes. En els dos jocs mous les fitxes amb passos i salts pel tauler, i guanya el primer jugador que omple el camp del costat oposat.</p>
      <p>El que canvia és el tauler, les direccions en què et mous, quantes persones poden jugar i quantes fitxes té cadascuna. El <a href="/ca/regles/que-es-sternhalma">Sternhalma</a> és el nom del Halma en un tauler en estrella, així que és el mateix joc que les dames xineses.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Els taulers</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Les dames xineses</strong> fan servir el tauler en estrella: 121 caselles, amb una punta de 10 caselles a cadascun dels sis extrems. Una punta és un triangle de files de 4, 3, 2 i 1 caselles.</li>
        <li><strong>El Halma</strong> fa servir el tauler quadrat: 16 per 16 caselles, 256 en total. Un camp és en una cantonada. Un camp gran té files de 5, 5, 4, 3 i 2 caselles, i un de petit files de 4, 4, 3 i 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Direccions: sis o vuit</h2>
      <p>Al tauler en estrella una casella té sis veïnes. Al quadrat en té vuit, perquè les diagonals també compten. Un pas va a una veïna buida. Un salt passa per sobre d'una fitxa que és al costat de la teva, en línia recta, fins a la casella buida de darrere, en qualsevol d'aquestes direccions i també cap enrere.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Una casella de la vora té menys veïnes, i una cantonada del tauler quadrat en té tres. Sis direccions formen tres línies que passen per una casella del tauler en estrella. Vuit direccions formen quatre línies al tauler quadrat: de costat a costat, de dalt a baix i dues diagonals.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Jugadors i fitxes</h2>
      <ul>
        <li><strong>Dames xineses:</strong> 2, 3, 4 o 6 jugadors. Cadascun té 10 fitxes, així que el tauler en té 20, 30, 40 o 60.</li>
        <li><strong>Halma:</strong> 2 o 4 jugadors. Amb 2 jugadors cadascun té 19 fitxes, 38 en total. Amb 4 jugadors cadascun té 13 fitxes, 52 en total.</li>
      </ul>
      <p>El tauler quadrat no té partida per a 3 o 6 jugadors a Leapstone. Per a una partida de tres, llegeix <a href="/ca/guies/dames-xineses-3-jugadors">Dames xineses per a 3 jugadors</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">El que és igual</h2>
      <ul>
        <li><strong>Una jugada:</strong> un pas, o una cadena de salts amb una fitxa. Tu decideixes on acaba la cadena, i no pots fer un pas després d'un salt.</li>
        <li><strong>Qualsevol color:</strong> saltes per sobre d'una fitxa de qualsevol color, també de la teva. La fitxa que saltes es queda on és. No es captura res.</li>
        <li><strong>L'objectiu:</strong> el camp d'enfront d'on has començat. Totes les seves caselles han de tenir fitxes teves. Mentre hi hagi una fitxa d'un altre jugador, no pots acabar.</li>
        <li><strong>Guanyar:</strong> guanya el primer jugador que omple l'objectiu. Amb 2 jugadors la partida s'acaba aleshores. Amb més jugadors els altres continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta.</li>
        <li><strong>Abandonar i temps:</strong> quan abandones, les teves fitxes surten del tauler. En una partida en línia cada jugada té un temps límit, i si perds 3 torns seguits, abandones.</li>
      </ul>
      <p>Llegeix les regles completes de les <a href="/ca/regles/dames-xineses">dames xineses</a> i del <a href="/ca/regles/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Quin tauler triar a Leapstone</h2>
      <ul>
        <li><strong>3 o 6 jugadors:</strong> només el tauler en estrella en té.</li>
        <li><strong>Més fitxes cadascun:</strong> el tauler quadrat, amb 19 fitxes cadascun per a 2 jugadors o 13 per a 4, davant de 10 al tauler en estrella.</li>
        <li><strong>Jugar en línia:</strong> una partida ràpida es juga al tauler en estrella. Amb amics i contra l'ordinador pots triar qualsevol dels dos taulers.</li>
      </ul>
      <p>El botó Juga ara obre una partida contra l'ordinador al tauler en estrella. Per jugar al tauler quadrat, toca la fletxa enrere de dalt i tria el Tauler quadrat al menú.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continua</h2>
      <ul>
        <li><a href="/play/">Juga al navegador</a> i prova els dos taulers.</li>
        <li><a href="/ca/guies/estrategia-dames-xineses">Estratègia de les dames xineses</a>: sis consells amb dibuixos.</li>
        <li><a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>: com funciona una partida de dos.</li>
      </ul>
      <p><a href="/ca/guies/dames-xineses-en-linia-amb-amics">Dames xineses en línia amb amics</a></p>
    </section>`;

export default {
  nav: "Halma o dames xineses",
  titel: "Halma o dames xineses: les diferències | Leapstone",
  beschrijving: "Halma o dames xineses? El tauler quadrat i el tauler en estrella, sis o vuit direccions, jugadors i fitxes, i el que és igual.",
  h1: "Halma o dames xineses",
  intro: "Dos jocs amb una mateixa idea: portar totes les teves fitxes a l'altre costat del tauler. Què canvia, què és igual i on jugar als dos.",
  inhoud,
};
