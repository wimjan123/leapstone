// La guia catalana Dames xineses per a 3 jugadors (taak 299): /ca/guies/dames-xineses-3-jugadors.
// Contingut: la guia anglesa ../en/chinese-checkers-3-players.mjs (taak 139, regles de crates/halma-core), frase per frase.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Com comença la partida</h2>
      <p>Cada jugador té 10 fitxes, així que hi ha 30 fitxes en un tauler de 121 caselles. Comencen en una punta sí i una no de l'estrella: el vermell a baix, el blau a dalt a l'esquerra i el verd a dalt a la dreta. Les tres puntes del mig són buides.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix, 10 fitxes blaves a la punta de dalt a l'esquerra i 10 fitxes verdes a la punta de dalt a la dreta",
  tekst: "El vermell a baix, el blau a dalt a l'esquerra, el verd a dalt a la dreta.",
})}
      <p>El jugador 1, el vermell, mou primer. Després el blau és el jugador 2, el verd és el jugador 3, i després del verd torna a ser el vermell. Una jugada és un pas o una cadena de salts amb una fitxa. Mira les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> per als passos i els salts.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tres objectius, tots buits a l'inici</h2>
      <p>El teu objectiu és la punta oposada a on has començat, i amb 3 jugadors comença buida. És la punta buida entre els inicis dels altres dos jugadors: l'objectiu del vermell és a dalt, el del blau a baix a la dreta i el del verd a baix a l'esquerra.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "El tauler en estrella per a tres jugadors. Uns cercles discontinus amb el color de cada jugador marquen els tres objectius buits: el vermell a dalt, el blau a baix a la dreta, el verd a baix a l'esquerra.",
  tekst: "Cada objectiu té el color del seu jugador.",
})}
      <p>Guanyes si portes les 10 fitxes a l'objectiu. Les 10 caselles han de tenir fitxes teves. Ningú no comença al teu objectiu, però pots aturar-te a qualsevol casella buida, així que una fitxa d'un altre jugador hi pot caure més tard. Mentre hi sigui, no pots acabar.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Guanyar, i què passa després</h2>
      <ul>
        <li><strong>Guanyar:</strong> guanya el primer jugador que omple l'objectiu. La partida no s'acaba aquí: els altres dos continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta. La partida s'acaba quan només queda un jugador jugant.</li>
        <li><strong>Abandonar:</strong> les teves fitxes surten del tauler i els altres dos continuen jugant. Si un segon jugador abandona abans que ningú hagi acabat, guanya l'últim jugador que queda.</li>
        <li><strong>Temps (en línia):</strong> en una partida en línia cada jugada té un temps límit, que fixa el jugador que comença la partida. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones, i la partida continua sense tu.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En què es diferencia d'una partida de 2</h2>
      <ul>
        <li><strong>Més fitxes:</strong> 30 al tauler, contra 20 amb 2 jugadors.</li>
        <li><strong>Objectius buits:</strong> amb 2 jugadors el teu objectiu comença ple de fitxes de l'altre jugador. Amb 3 comença buit.</li>
        <li><strong>Dos oponents:</strong> després de la teva jugada, mouen dos jugadors més abans que et torni a tocar. Les fitxes de tots dos són esglaons per a tu, i les teves per a ells. Una escala que construeixes la poden fer servir tots dos, i el jugador que va després de tu hi té la primera opció.</li>
        <li><strong>La partida continua:</strong> amb 2 jugadors la partida s'acaba quan un dels dos ha acabat. Amb 3, continua pel segon i el tercer lloc.</li>
      </ul>
      <p>Per a la partida de dos, llegeix <a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>. Els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a> parlen de passos i salts, que són els mateixos amb 3 jugadors.</p>
      <p><a href="/ca/guies/dames-xineses-en-linia-amb-amics">Dames xineses en línia amb amics</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">On jugar amb 3 jugadors a Leapstone</h2>
      <ul>
        <li><strong>Contra l'ordinador, ara mateix:</strong> obre <a href="/play/">Leapstone al navegador</a>, toca Ordinador, tria el tauler en estrella i 2 ordinadors. Ets el jugador 1, així que mous primer. Tries Fàcil, Normal o Difícil per als ordinadors.</li>
        <li><strong>En un sol mòbil:</strong> toca «En aquest mòbil», tria el tauler en estrella i 3 jugadors, i després toca una fitxa per canviar aquell lloc entre una persona i un ordinador.</li>
        <li><strong>En línia amb amics:</strong> toca Amics, tria el tauler en estrella, 3 jugadors i el temps per jugada, i envia l'enllaç d'invitació. La partida comença quan els 3 llocs estan ocupats.</li>
        <li><strong>Partides ràpides:</strong> Jugar en línia troba partides per a 2 o 4 jugadors, així que no hi ha cap partida ràpida per a 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames xineses per a 3 jugadors",
  titel: "Dames xineses per a 3 jugadors: regles | Leapstone",
  beschrijving: "Com funcionen les dames xineses amb 3 jugadors: on comencen les 30 fitxes, quina punta buida és l'objectiu de cadascú, qui mou primer i com es guanya.",
  h1: "Dames xineses per a 3 jugadors",
  intro: "Com funciona una partida de tres al tauler en estrella: l'inici, els tres objectius, qui mou primer, com es guanya i on pots jugar-hi.",
  inhoud,
};
