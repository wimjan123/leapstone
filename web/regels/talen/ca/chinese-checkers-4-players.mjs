// La guia catalana Dames xineses per a 4 jugadors (taak 301, feature 294): /ca/guies/dames-xineses-4-jugadors.
// Contingut: la guia anglesa ../en/chinese-checkers-4-players.mjs, frase per frase (regles de crates/halma-core, vegeu docs/plan.md, taak 301).
// Qui canvia una regla, la canvia a cada llengua.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Com es reparteix el tauler</h2>
      <p>Cada jugador té 10 fitxes, així que 40 fitxes són en un tauler de 121 caselles. Les quatre puntes de sortida són dues parelles de puntes una al costat de l'altra: el vermell a baix i el blau a baix a l'esquerra, el verd a dalt i el groc a dalt a la dreta.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix, 10 fitxes blaves a la punta de baix a l'esquerra, 10 fitxes verdes a la punta de dalt i 10 fitxes grogues a la punta de dalt a la dreta. Les puntes de dalt a l'esquerra i de baix a la dreta són buides.",
  tekst: "El vermell a baix, el blau a baix a l'esquerra, el verd a dalt, el groc a dalt a la dreta.",
})}
      <p>El jugador 1, el vermell, mou primer. Després el blau és el jugador 2, el verd és el jugador 3, el groc és el jugador 4, i després del groc torna a ser el vermell. Una jugada és un pas o una cadena de salts amb una fitxa. Mira les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> per als passos i els salts.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Qui s'enfronta a qui</h2>
      <p>Les puntes s'aparellen a través del tauler: el vermell s'enfronta al verd, i el blau al groc. El teu objectiu és la punta que tens davant. El vermell va a on comença el verd, el verd a on comença el vermell, el blau a on comença el groc i el groc a on comença el blau.</p>
      <p>Com en una partida de 2, cada objectiu comença ple de les fitxes del jugador que t'enfronta, així que només hi pots caure quan les hagin deixat. Amb 3 jugadors els objectius comencen buits, així que amb 4 ningú no pot acabar de seguida. Els quatre objectius són quatre puntes diferents, així que ningú més vol el teu objectiu: un jugador que ha acabat no bloqueja mai ningú.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Les dues puntes buides</h2>
      <p>Les puntes de dalt a l'esquerra i de baix a la dreta no tenen fitxes. No són la sortida ni l'objectiu de ningú. La de dalt a l'esquerra és entre el blau i el verd, i la de baix a la dreta entre el groc i el vermell.</p>
      <p>Pots fer un pas o un salt a qualsevol casella buida, així que pots creuar aquestes puntes o aturar-t'hi. Però una fitxa que hi sigui encara no és en un objectiu. En una punta buida no hi ha res per saltar fins que algú hi porti fitxes.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Què canvia en la teva tàctica</h2>
      <ul>
        <li><strong>Dos creuaments alhora:</strong> el vermell i el verd creuen el tauler l'un cap a l'altre, i el blau i el groc també. Les dues línies passen pel mig, així que el mig està més ocupat que en una partida de 2, on només es creua una línia.</li>
        <li><strong>Tres jugadors mouen entre els teus torns:</strong> el tauler canvia més entre dues jugades teves que en una partida de 2. Mira'l de nou a l'inici de cada torn i planeja llavors la teva cadena de salts. El jugador que mou després de tu mai no és el que tens davant.</li>
        <li><strong>Les fitxes ajuden tothom:</strong> cada fitxa dels altres tres és un esglaó per a tu, i les teves ho són per a ells. Les fitxes del jugador que tens davant es mouen en sentit contrari, com en una partida de 2.</li>
        <li><strong>Espai per voltar:</strong> si el mig és ple, les puntes buides són espai obert al costat de les puntes de sortida. Una ruta per una d'elles pot ser una manera de voltar la multitud.</li>
        <li><strong>Un jugador que abandona allibera el teu objectiu:</strong> quan el jugador que tens davant abandona, les seves fitxes surten del tauler, així que el teu objectiu és buit a l'acte.</li>
      </ul>
      <p>Els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a> sobre escales, fitxes endarrerides i omplir l'objectiu des del darrere són els mateixos amb 4 jugadors.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Guanyar, i què passa després</h2>
      <ul>
        <li><strong>Guanyar:</strong> guanya el primer jugador que omple l'objectiu amb les 10 fitxes. La partida no s'acaba aquí: els altres tres continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta. Les fitxes d'aquell jugador es queden al tauler. La partida s'acaba quan només queda un jugador jugant.</li>
        <li><strong>Abandonar:</strong> les teves fitxes surten del tauler i els altres tres continuen. Si els altres també abandonen, guanya l'últim jugador que queda.</li>
        <li><strong>Temps (en línia):</strong> en una partida en línia cada jugada té un temps límit. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones, i la partida continua sense tu.</li>
      </ul>
      <p>Per a les partides amb menys jugadors, llegeix <a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>. La <a href="/ca/regles/dames-xineses">pàgina de regles</a> té dibuixos de cada inici.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">On jugar amb 4 jugadors a Leapstone</h2>
      <ul>
        <li><strong>Contra l'ordinador, ara mateix:</strong> obre <a href="/play/">Leapstone al navegador</a>, toca Ordinador, tria el tauler en estrella i 3 ordinadors. Ets el jugador 1, així que mous primer. Tries Fàcil, Normal o Difícil per als ordinadors.</li>
        <li><strong>En un sol mòbil:</strong> toca Jugar, tria el tauler en estrella i 4 jugadors, i després toca una fitxa per canviar aquell lloc entre una persona i un ordinador.</li>
        <li><strong>En línia amb amics:</strong> toca Amics, tria el tauler en estrella, 4 jugadors i el temps per jugada, i envia l'enllaç d'invitació. La partida comença quan els 4 llocs són ocupats.</li>
        <li><strong>Partida ràpida, a l'aplicació:</strong> toca Jugar en línia. Mentre busca una partida de 2, toca Busca 4 o 6 jugadors per buscar-ne una de 4. Cada jugada té 30 segons. Si no s'hi uneixen prou jugadors en 20 segons, jugadors de l'ordinador omplen els llocs buits, així que alguns oponents poden ser jugadors de l'ordinador.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames xineses per a 4 jugadors",
  titel: "Dames xineses per a 4 jugadors: inici i consells | Leapstone",
  beschrijving: "Com funcionen les dames xineses amb 4 jugadors: com es reparteix el tauler, quines 2 puntes queden buides, qui s'enfronta a qui, la tàctica i on jugar-hi.",
  h1: "Dames xineses per a 4 jugadors",
  intro: "Amb 4 jugadors, cadascun comença en una de les quatre puntes de l'estrella, i dues puntes queden buides. El vermell s'enfronta al verd i el blau al groc: el teu objectiu és la punta que tens davant, plena de les fitxes d'aquell jugador. Aquí tens l'inici, les puntes buides, la tàctica i on pots jugar-hi.",
  inhoud,
};
