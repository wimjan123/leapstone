// La pàgina de regles del Halma en català (taak 134). Contingut: la pàgina anglesa ../en/halma.mjs (comprovada amb
// crates/halma-core, vegeu docs/plan.md, taak 117), frase per frase. Si canvia una regla, canvia a les dues.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 jugadors: 19 fitxes cadascun",
    alt: "El tauler quadrat amb 19 fitxes vermelles a la cantonada de dalt a l'esquerra i 19 fitxes blaves a la cantonada de baix a la dreta",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 jugadors: 13 fitxes cadascun",
    alt: "El tauler quadrat amb 13 fitxes a cadascuna de les quatre cantonades: vermelles a dalt a l'esquerra, blaves a dalt a la dreta, verdes a baix a la dreta i grogues a baix a l'esquerra",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">El tauler</h2>
      <p>El Halma es juga en un tauler quadrat de 16 per 16 caselles, 256 en total. Cada casella té fins a vuit veïnes: les quatre en línia recta i les quatre en diagonal. Una casella de la vora en té menys, i una cantonada en té tres.</p>
      <p>Aquest és el tauler quadrat de Leapstone. Si coneixes el joc al tauler en estrella, llegeix sobre el <a href="/ca/regles/que-es-sternhalma">Sternhalma</a> i les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Com comencen les fitxes</h2>
      <p>El Halma és per a 2 o 4 jugadors. Cada jugador comença amb les fitxes en un camp en una cantonada del tauler. El camp de la cantonada oposada és el teu objectiu.</p>
      <ul>
        <li><strong>2 jugadors:</strong> 19 fitxes cadascun, en dues cantonades enfrontades. El camp són cinc files de 5, 5, 4, 3 i 2 caselles.</li>
        <li><strong>4 jugadors:</strong> 13 fitxes cadascun, un camp a cada cantonada. El camp són quatre files de 4, 4, 3 i 2 caselles. El teu objectiu és la cantonada de l'altra banda del tauler, en diagonal.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Per torns</h2>
      <p>Comença el jugador 1. Després els torns segueixen l'ordre, i després de l'últim jugador torna a ser el torn del jugador 1. A Leapstone els colors van amb els números: vermell, blau, verd i groc.</p>
      <p>Al teu torn mous una fitxa, una sola vegada. No es captura res: les fitxes es queden al tauler fins que el seu jugador abandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Mou una fitxa a una casella buida del seu costat, en qualsevol de les vuit direccions: recta o en diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Una fitxa vermella amb un anell blanc al voltant. Cinc de les seves vuit veïnes són buides i estan marcades; a les altres tres hi ha fitxes.",
  tekst: "La fitxa vermella pot fer un pas a les cinc caselles marcades. Les altres tres veïnes estan ocupades.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salt</h2>
      <p>Salta per sobre d'una fitxa del costat de la teva, de qualsevol color, i cau a la casella buida just darrere, en línia recta. Pots saltar en les vuit direccions, també en diagonal i cap enrere.</p>
      <ul>
        <li>La casella on caus ha d'estar buida.</li>
        <li>No pots saltar per sobre de dues fitxes seguides, ni per sobre d'una casella buida.</li>
        <li>La fitxa per sobre de la qual saltes es queda on és.</li>
        <li>No pots saltar per sobre de la vora del tauler.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Una fitxa vermella salta en diagonal per sobre d'una fitxa blava fins a la casella buida de darrere, indicat amb una fletxa.",
  tekst: "La fitxa vermella salta en diagonal per sobre de la fitxa blava.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una cadena de salts</h2>
      <p>Després d'un salt, la mateixa fitxa pot tornar a saltar, tantes vegades com pugui, en qualsevol direcció, recta o en diagonal. Tu decideixes on parar. Tots els salts junts són una sola jugada.</p>
      <ul>
        <li>En una jugada no pots caure dues vegades a la mateixa casella.</li>
        <li>Una jugada és un pas, o un o més salts. Després d'un salt no pots fer un pas.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Una fitxa vermella fa tres salts en una jugada: en diagonal per sobre d'una fitxa blava, en línia recta per sobre d'una altra fitxa blava, i en diagonal per sobre d'una fitxa vermella. Les tres caselles on cau porten els números 1, 2 i 3.",
  tekst: "Una jugada amb tres salts, en l'ordre dels números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">L'objectiu</h2>
      <p>Guanyes si portes totes les fitxes al camp del davant d'on has començat. Totes les caselles d'aquest camp han de tenir fitxes teves: 19 amb 2 jugadors, 13 amb 4 jugadors. Mentre hi hagi una fitxa d'un altre jugador, no pots acabar.</p>
      <p>Pots caure a qualsevol casella buida, també als camps dels altres jugadors. Una fitxa que és al teu objectiu pot tornar a sortir; res no la bloqueja.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "El tauler quadrat per a dos jugadors. El vermell comença a dalt a l'esquerra; el camp de baix a la dreta, marcat amb cercles de punts i amb fitxes blaves, és l'objectiu del vermell.",
  tekst: "Amb 2 jugadors, l'objectiu del vermell és el camp on comença el blau.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Amb 2 o 4 jugadors</h2>
      <ul>
        <li><strong>2 jugadors:</strong> guanya el primer jugador que omple l'objectiu, i la partida s'acaba.</li>
        <li><strong>4 jugadors:</strong> guanya el primer jugador que omple l'objectiu. Els altres continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta. La partida s'acaba quan només queda un jugador jugant.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonar</h2>
      <p>Quan abandones, les teves fitxes surten del tauler, de manera que no bloquegen ningú. Amb 2 jugadors, guanya l'altre jugador. Amb 4 jugadors la partida continua sense tu, i si tothom llevat d'un jugador abandona, guanya l'últim jugador.</p>
      <p>En una partida en línia cada jugada té un temps límit. El jugador que inicia la partida el fixa. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones. Les partides contra l'ordinador i en un sol mòbil no tenen temps límit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consells</h2>
      <ul class="tips">
        <li><strong>Construeix escales.</strong> Posa fitxes en línia amb una casella buida entre cadascuna, recta o en diagonal, apuntant cap al teu objectiu. Una fitxa pot saltar llavors tota la línia en una sola jugada.</li>
        <li><strong>Qualsevol fitxa és una escala.</strong> Pots saltar per sobre de tots els colors, de manera que les fitxes dels altres jugadors també t'ajuden. I les teves escales els ajuden a ells: mira què deixes enrere.</li>
        <li><strong>Fes servir les diagonals.</strong> L'objectiu és a la cantonada oposada, així que una línia diagonal de fitxes és la manera més ràpida de travessar.</li>
        <li><strong>No t'oblidis de les endarrerides.</strong> Necessites totes les fitxes a casa. Una fitxa molt endarrerida, sense res per saltar, avança una casella per torn. Porta-la amb tu mentre les altres fitxes encara són al seu voltant.</li>
        <li><strong>El teu inici és el seu objectiu.</strong> Amb 2 jugadors, el teu camp és l'objectiu de l'altre jugador, i ell no pot acabar mentre hi hagi una fitxa teva. Leapstone et deixa mantenir una fitxa a casa, de manera que pots bloquejar així. El mateix val per a tu.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Preguntes</h2>
      <h3>Quanta gent pot jugar al Halma?</h3>
      <p>Dues o quatre persones. El Halma es juga en un tauler quadrat de 16 per 16 caselles, i cada jugador comença en una cantonada.</p>
      <h3>Quantes fitxes té cada jugador al Halma?</h3>
      <p>19 fitxes cadascun amb 2 jugadors, i 13 fitxes cadascun amb 4 jugadors.</p>
      <h3>Qui va inventar el Halma?</h3>
      <p>George Howard Monks, un cirurgià nord-americà, el 1883 o el 1884. El nom és grec i vol dir «salt». Llegeix-ne més al <a href="/ca/regles/que-es-sternhalma">Sternhalma</a>.</p>
      <h3>Quina diferència hi ha entre el Halma i les dames xineses?</h3>
      <p>El Halma fa servir un tauler quadrat, amb passos i salts en vuit direccions i 19 o 13 fitxes cadascun. Les dames xineses fan servir un tauler en estrella, amb sis direccions i 10 fitxes cadascun, per a 2, 3, 4 o 6 jugadors.</p>
      <h3>Es pot jugar al Halma en línia gratis?</h3>
      <p>Sí, a Leapstone, al navegador o a l'aplicació de l'App Store. Tria una manera de jugar, com ara contra l'ordinador o en línia amb amics, i després el Tauler quadrat. Leapstone és gratuït i sense anuncis.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Juga-hi</h2>
      <p>El botó Juga ara obre una partida contra l'ordinador al <a href="/ca/regles/dames-xineses">tauler en estrella</a>. Per jugar al Halma, toca la fletxa enrere de dalt, tria després Jugar en aquest mòbil, Jugar contra l'ordinador o Jugar en línia amb amics, i toca el Tauler quadrat.</p>
    </section>`;

export default {
  nav: "Regles del Halma",
  titel: "Regles i consells del Halma | Leapstone",
  beschrijving: "Com es juga al Halma al tauler quadrat de 16 per 16: inici, passos, salts, cadenes de salts, com guanyar i consells. Juga gratis al navegador.",
  h1: "Regles del Halma",
  intro: "Porta totes les fitxes a través del tauler quadrat fins a la cantonada oposada abans que ningú. Les regles en poques paraules, amb dibuixos, i uns quants consells.",
  inhoud,
};
