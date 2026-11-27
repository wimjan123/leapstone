// De gids Dames xineses per a 6 jugadors (taak 302): /ca/guies/dames-xineses-6-jugadors.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Catalaans. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Com comença la partida</h2>
      <p>Cada jugador té 10 fitxes, i les 6 puntes de l'estrella són en ús. Això posa 60 fitxes al tauler de 121 caselles. Les 61 caselles del centre són buides al començament.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 10 fitxes a cadascuna de les seves 6 puntes, en 6 colors",
  tekst: "6 jugadors, 6 puntes, 60 fitxes.",
})}
      <p>El jugador 1, el vermell, mou primer, des de la punta de baix. Després el torn va del jugador 1 al jugador 6, i després del jugador 6 torna a ser el jugador 1. Els jugadors estan numerats en l'ordre de les seves puntes al voltant de l'estrella, així que el jugador que va després de tu sempre comença a la punta del costat de la teva. Una jugada és un pas o una cadena de salts amb una fitxa. Mira les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> per als passos i els salts.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Cada objectiu comença ple</h2>
      <p>Guanyes si portes les 10 fitxes a la punta de l'altre costat del tauler. Amb 6 jugadors aquesta és la punta on comença el jugador del davant, així que cap objectiu no és buit: cada objectiu comença ple de fitxes d'un altre jugador. Per al vermell, l'objectiu és la punta de dalt, on comença el jugador 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 6 puntes plenes. Un anell de línies discontínues marca la punta de dalt, l'objectiu del jugador vermell, que conté les fitxes del jugador del davant.",
  tekst: "L'objectiu del vermell és la punta del davant, plena de fitxes del jugador 4.",
})}
      <p>Només pots caure a una casella buida, així que el jugador del davant ha de deixar la seva punta abans que tu puguis omplir-la, i tu has de deixar la teva abans que ell pugui omplir la seva. En una partida de 2 això és tot. Amb 6, tots dos també heu de passar entre la gentada dels altres 4.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Un centre atapeït</h2>
      <p>Cada objectiu és a l'altre costat del tauler, i les puntes només es connecten entre elles pel centre, així que les 60 fitxes han de creuar les mateixes 61 caselles. Al començament ningú no ha creuat encara, i el centre s'omple de pressa.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Una fitxa vermella salta tres vegades en una sola jugada: per sobre d'una fitxa blava, després d'una de verda i després d'una de lila. Els números 1, 2 i 3 marquen les caselles d'aterratge.",
  tekst: "Les fitxes de tots els colors són esglaons.",
})}
      <p>Pots saltar per sobre d'una fitxa de qualsevol color. Les fitxes d'altres 5 jugadors són esglaons per a tu, i les teves són esglaons per als 5. Una filera de fitxes que deixes al centre és una escala per a qui hi pugui arribar, i el jugador que va després de tu té la primera oportunitat.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Bloquejar amb 5 oponents</h2>
      <ul>
        <li><strong>Omple la casella d'aterratge:</strong> un salt necessita una casella buida just darrere de la fitxa. Quan hi poses una fitxa, el salt desapareix per a tots els jugadors que el volien fer.</li>
        <li><strong>Vigila les escales que construeixes:</strong> després de la teva jugada, els altres 5 jugadors mouen abans que et torni a tocar. Una escala els ajuda a tots.</li>
        <li><strong>Qualsevol pot bloquejar un objectiu:</strong> una fitxa de qualsevol altre jugador al teu objectiu t'impedeix acabar, no només una fitxa del jugador del davant. Les 10 caselles de l'objectiu han de tenir fitxes teves.</li>
      </ul>
      <p>Els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a> mostren com és un salt bloquejat, i com no tancar una fitxa d'un altre jugador al teu propi objectiu.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Quant dura una partida</h2>
      <p>Una partida de 6 té 60 fitxes per moure, i entre una jugada teva i la següent, els altres 5 jugadors en fan una cadascun. A més, no s'acaba quan acaba el primer jugador.</p>
      <ul>
        <li><strong>Guanyar i seguir jugant:</strong> guanya el primer jugador que omple l'objectiu, i els altres continuen jugant pels llocs següents. El jugador que ja ha acabat se salta, i les seves fitxes es queden al tauler com a esglaons. La partida s'acaba quan només queda un jugador jugant.</li>
        <li><strong>Abandonar:</strong> les teves fitxes surten del tauler, així que ja no bloquegen ni ajuden ningú, i els altres continuen.</li>
        <li><strong>Temps (en línia):</strong> en una partida en línia cada jugada té un temps límit, que fixa el jugador que comença la partida: 15 segons, 30 segons, 1 minut, 2 minuts o sense límit. Una ronda de 6 jugades dura com a màxim 6 vegades el límit, així que amb 30 segons són 3 minuts com a màxim. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones, i la partida continua sense tu.</li>
      </ul>
      <p>Per a una partida amb menys jugadors, llegeix <a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">On jugar amb 6 jugadors a Leapstone</h2>
      <ul>
        <li><strong>Contra l'ordinador, ara mateix:</strong> obre <a href="/play/">Leapstone al navegador</a>, toca Ordinador, tria el tauler en estrella i 5 ordinadors. Ets el jugador 1, així que mous primer. Els ordinadors mouen un darrere l'altre, cadascun amb una pausa curta, així pots seguir cada jugada. Tries Fàcil, Normal o Difícil per als ordinadors.</li>
        <li><strong>En un sol mòbil:</strong> toca Jugar, tria el tauler en estrella i 6 jugadors, i després toca una fitxa per canviar aquest lloc entre una persona i un ordinador.</li>
        <li><strong>En línia amb amics:</strong> toca Amics, tria el tauler en estrella, 6 jugadors i el temps per jugada, i envia l'enllaç d'invitació. La partida comença quan els 6 llocs estan ocupats.</li>
        <li><strong>Partides ràpides:</strong> Jugar en línia troba partides de 2 o 4 jugadors, així que no hi ha partida ràpida de 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames xineses per a 6 jugadors",
  titel: "Dames xineses per a 6: el tauler ple | Leapstone",
  beschrijving: "Com funcionen les dames xineses amb 6 jugadors: una estrella plena de 60 fitxes, un centre atapeït, el bloqueig, quant dura una partida i on jugar-hi.",
  h1: "Dames xineses per a 6 jugadors",
  intro: "Com funciona una partida de 6: les 6 puntes són plenes, corres cap a la punta de l'altre costat del tauler, i la partida continua després que el primer jugador acabi.",
  inhoud,
};
