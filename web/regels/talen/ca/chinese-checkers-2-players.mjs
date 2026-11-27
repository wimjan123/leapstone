// La guia catalana Dames xineses per a 2 jugadors (taak 134): /ca/guies/dames-xineses-2-jugadors.
// Contingut: la guia anglesa ../en/chinese-checkers-2-players.mjs, frase per frase. Regles de crates/halma-core
// (Board::star, Game::new_star(2), make_move, resign), el temps límit de "Regels" i taak 80, els nivells de l'ordinador de computer.rs.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Com comença la partida</h2>
      <p>Cada jugador té 10 fitxes. Comencen en dues puntes de l'estrella que queden enfrontades: el vermell a baix, el blau a dalt. Les 20 fitxes són en un tauler de 121 caselles.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix i 10 fitxes blaves a la punta de dalt",
  tekst: "El vermell comença a baix, el blau a dalt.",
})}
      <p>El jugador 1, el vermell, mou primer. Després us alterneu els torns, una jugada cadascun. Una jugada és un pas o una cadena de salts amb una fitxa. Mira les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> per als passos i els salts.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">El teu objectiu és l'inici de l'altre jugador</h2>
      <p>Guanyes si portes les 10 fitxes a la punta on ha començat l'altre jugador. Aquesta punta comença plena de les seves fitxes, i la teva plena de les teves. Per al vermell, és la punta de dalt del dibuix de damunt.</p>
      <p>Només pots caure a una casella buida, així que cadascú ha de deixar la seva punta abans que l'altre l'ompli. Cap dels dos no pot acabar mentre una fitxa de l'altre es quedi a l'objectiu. I com que creueu el mateix centre en direccions oposades, les fitxes de l'altre jugador són esglaons per a tu, i les teves per a ell. Llegeix els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a> per saber què fer-ne.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Guanyar i abandonar</h2>
      <ul>
        <li><strong>Guanyar:</strong> guanya el primer jugador que omple l'objectiu amb les 10 fitxes, i la partida s'acaba a l'acte. L'altre jugador no continua.</li>
        <li><strong>Abandonar:</strong> les teves fitxes surten del tauler i guanya l'altre jugador.</li>
        <li><strong>Temps (en línia):</strong> en una partida en línia cada jugada té un temps límit. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En què es diferencien 3, 4 i 6 jugadors</h2>
      <ul>
        <li><strong>3 jugadors:</strong> les fitxes comencen en una punta sí i una no, i els tres objectius comencen buits. Guanya el primer que acaba; els altres continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta.</li>
        <li><strong>4 jugadors:</strong> dues parelles de puntes una al costat de l'altra. El teu objectiu comença ple de fitxes d'un altre jugador. La partida continua després del primer que acaba, com amb 3.</li>
        <li><strong>6 jugadors:</strong> les sis puntes. El tauler té 60 fitxes, contra 20 amb 2 jugadors.</li>
      </ul>
      <p>Amb només 20 fitxes al tauler hi ha menys fitxes per saltar, així que les escales que construeixes tu mateix importen més. La <a href="/ca/regles/dames-xineses">pàgina de regles</a> té dibuixos de cada inici.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">On jugar amb 2 jugadors a Leapstone</h2>
      <ul>
        <li><strong>Contra l'ordinador, ara mateix:</strong> obre <a href="/play/">Leapstone al navegador</a>, toca Ordinador i tria el tauler en estrella. Un ordinador és el valor per defecte, així que és una partida de 2. Tries Fàcil, Normal o Difícil, i ets el jugador 1, així que mous primer. El nivell fàcil tria la millor de tres jugades a l'atzar. El normal tria la jugada que fa més progrés cap al seu objectiu. El difícil també mira com li poden respondre els oponents i la seva pròxima jugada.</li>
        <li><strong>Juga en línia, a l'aplicació:</strong> una partida ràpida al tauler en estrella per a 2 jugadors, contra un altre jugador del teu nivell, amb 30 segons per jugada. Alguns oponents en línia poden ser jugadors de l'ordinador.</li>
        <li><strong>Amb un amic:</strong> envia un enllaç d'invitació, i fixa tu mateix el temps per jugada. O passeu-vos un sol mòbil d'un a l'altre.</li>
      </ul>
      <p><a href="/ca/guies/dames-xineses-en-linia-amb-amics">Dames xineses en línia amb amics</a></p>
      <p><a href="/ca/guies/dames-xineses-3-jugadors">Dames xineses per a 3 jugadors</a></p>
    </section>`;

export default {
  nav: "Dames xineses per a 2 jugadors",
  titel: "Dames xineses per a 2 jugadors: inici i regles | Leapstone",
  beschrijving: "Com funcionen les dames xineses amb 2 jugadors: on comencen les 10 fitxes, qui mou primer, com guanyes o abandones, i on jugar-hi gratis.",
  h1: "Dames xineses per a 2 jugadors",
  intro: "Com funciona una partida de dos al tauler en estrella: l'inici, qui mou primer, com es guanya i on pots jugar-hi.",
  inhoud,
};
