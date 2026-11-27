// La pàgina de regles de les dames xineses en català (taak 134). Contingut: la pàgina anglesa ../en/chinese-checkers.mjs
// (comprovada amb crates/halma-core, vegeu docs/plan.md, taak 116), frase per frase. Si canvia una regla, canvia a les dues.
// Els mateixos dibuixos (sense llengua: només xifres a l'SVG); els textos alternatius i els peus de figura són en català.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} jugadors`,
      alt:
        {
          2: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix i 10 fitxes blaves a la punta de dalt",
          3: "El tauler en estrella amb fitxes vermelles a baix, blaves a dalt a l'esquerra i verdes a dalt a la dreta",
          4: "El tauler en estrella amb fitxes a quatre puntes: vermelles a baix, verdes a dalt, blaves a baix a l'esquerra i grogues a dalt a la dreta",
          6: "El tauler en estrella amb fitxes a les sis puntes, en sis colors",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">El tauler</h2>
      <p>Les dames xineses es juguen en una estrella de sis puntes. El tauler té 121 caselles, i cada punta en té 10. A l'interior del tauler, cada casella té sis veïnes.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Com comencen les fitxes</h2>
      <p>Cada jugador té 10 fitxes i comença amb totes en una punta de l'estrella. La punta del davant de la teva és el teu objectiu.</p>
      <ul>
        <li><strong>2 jugadors:</strong> les dues puntes que queden enfrontades.</li>
        <li><strong>3 jugadors:</strong> una punta sí i una no. Els tres objectius comencen buits.</li>
        <li><strong>4 jugadors:</strong> dues parelles de puntes que són una al costat de l'altra. Cada jugador té un altre jugador al davant.</li>
        <li><strong>6 jugadors:</strong> les sis puntes.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Per torns</h2>
      <p>Comença el jugador 1. Després els torns segueixen l'ordre: jugador 2, jugador 3 i així successivament, i després de l'últim jugador torna a ser el torn del jugador 1. A Leapstone els colors van amb els números: vermell, blau, verd, groc, lila i plata.</p>
      <p>Al teu torn mous una fitxa, una sola vegada. No es captura res: les fitxes es queden al tauler fins que el seu jugador abandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Mou una fitxa a una casella buida del seu costat.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Una fitxa vermella amb un anell blanc al voltant. Tres de les seves sis veïnes són buides i estan marcades; a les altres tres hi ha fitxes.",
  tekst: "La fitxa vermella pot fer un pas a les tres caselles marcades. Les altres tres veïnes estan ocupades.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salt</h2>
      <p>Salta per sobre d'una fitxa del costat de la teva, de qualsevol color, i cau a la casella buida just darrere, en línia recta. Pots saltar en les sis direccions, també cap enrere.</p>
      <ul>
        <li>La casella on caus ha d'estar buida.</li>
        <li>No pots saltar per sobre de dues fitxes seguides, ni per sobre d'una casella buida.</li>
        <li>La fitxa per sobre de la qual saltes es queda on és.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Una fitxa vermella salta per sobre d'una fitxa blava fins a la casella buida de darrere, indicat amb una fletxa.",
  tekst: "La fitxa vermella salta per sobre de la fitxa blava.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una cadena de salts</h2>
      <p>Després d'un salt, la mateixa fitxa pot tornar a saltar, tantes vegades com pugui i en qualsevol direcció. Tu decideixes on parar. Tots els salts junts són una sola jugada.</p>
      <ul>
        <li>En una jugada no pots caure dues vegades a la mateixa casella.</li>
        <li>Una jugada és un pas, o un o més salts. Després d'un salt no pots fer un pas.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Una fitxa vermella fa tres salts en una jugada, per sobre d'una fitxa blava, una de verda i una altra de blava. Les tres caselles on cau porten els números 1, 2 i 3.",
  tekst: "Una jugada amb tres salts, en l'ordre dels números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">L'objectiu</h2>
      <p>Guanyes si portes les 10 fitxes a la punta del davant d'on has començat. Les 10 caselles d'aquesta punta han de tenir fitxes teves. Mentre hi hagi una fitxa d'un altre jugador, no pots acabar.</p>
      <p>Pots caure a qualsevol casella buida, també a les puntes dels altres jugadors.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Un tauler en estrella per a tres jugadors. El vermell comença a baix; la punta buida de dalt, marcada amb cercles de punts, és l'objectiu del vermell.",
  tekst: "Amb 3 jugadors, el vermell comença a baix. L'objectiu del vermell és la punta buida de dalt.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Amb 2, 3, 4 o 6 jugadors</h2>
      <ul>
        <li><strong>2 jugadors:</strong> guanya el primer jugador que omple l'objectiu, i la partida s'acaba.</li>
        <li><strong>3, 4 o 6 jugadors:</strong> guanya el primer jugador que omple l'objectiu. Els altres continuen jugant pels llocs següents, i el jugador que ja ha acabat se salta. La partida s'acaba quan només queda un jugador jugant.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonar</h2>
      <p>Quan abandones, les teves fitxes surten del tauler, de manera que no bloquegen ningú. Amb 2 jugadors, guanya l'altre jugador. Amb més jugadors la partida continua sense tu, i si tothom llevat d'un jugador abandona, guanya l'últim jugador.</p>
      <p>En una partida en línia cada jugada té un temps límit. El jugador que inicia la partida el fixa, i en una partida ràpida són 30 segons. Quan se t'acaba el temps, se salta el teu torn. Si perds 3 torns seguits, abandones. Les partides contra l'ordinador i en un sol mòbil no tenen temps límit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consells</h2>
      <ul class="tips">
        <li><strong>Construeix escales.</strong> Posa fitxes en línia amb una casella buida entre cadascuna, apuntant cap al teu objectiu. Una fitxa pot saltar llavors tota la línia en una sola jugada.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatre fitxes en una línia diagonal amb una casella buida entre cadascuna. Una fitxa vermella en un extrem salta per sobre de totes quatre, amb quatre caselles numerades on cau.",
  tekst: "Quatre fitxes en una línia: la fitxa vermella de dalt creua el tauler en una jugada, amb quatre salts.",
})}
        </li>
        <li><strong>Qualsevol fitxa és una escala.</strong> Pots saltar per sobre de tots els colors, de manera que les fitxes dels altres jugadors també t'ajuden. I les teves escales els ajuden a ells: mira què deixes enrere.</li>
        <li><strong>No t'oblidis de les endarrerides.</strong> Necessites les 10 fitxes a casa. Una fitxa molt endarrerida, sense res per saltar, avança una casella per torn. Porta-la amb tu mentre les altres fitxes encara són al seu voltant.</li>
        <li><strong>El teu inici és el seu objectiu.</strong> Amb 2, 4 o 6 jugadors, la teva punta d'inici és l'objectiu del jugador que tens al davant, i ell no pot acabar mentre hi hagi una fitxa teva. El mateix val per a tu.</li>
      </ul>
      <p>Hi ha més consells, amb dibuixos, a la guia d'<a href="/ca/guies/estrategia-dames-xineses">estratègia de les dames xineses</a>. Per a una partida de dos, llegeix <a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Preguntes</h2>
      <h3>Quanta gent pot jugar a les dames xineses?</h3>
      <p>Dues, tres, quatre o sis persones. Cada jugador comença en una punta de l'estrella. Amb 2, 3 o 4 jugadors, algunes puntes queden buides.</p>
      <h3>Quantes boles té cada jugador?</h3>
      <p>Cada jugador té 10 boles, és a dir, fitxes. El tauler té 121 caselles: 10 a cadascuna de les sis puntes i 61 al mig.</p>
      <h3>Es pot saltar per sobre de les pròpies fitxes, o cap enrere?</h3>
      <p>Sí. Pots saltar per sobre d'una fitxa de qualsevol color, també de les teves, en qualsevol de les sis direccions, i també cap enrere. La fitxa que has saltat es queda on és.</p>
      <h3>Es capturen fitxes a les dames xineses?</h3>
      <p>No. No es captura res. Una fitxa només surt del tauler quan el seu jugador abandona.</p>
      <h3>Les dames xineses són de la Xina?</h3>
      <p>No. El joc va aparèixer a Alemanya el 1892 amb el nom de Stern-Halma, basat en el joc més antic Halma. El nom Chinese checkers (dames xineses) ve dels Estats Units, el 1928. Llegeix-ne més al <a href="/ca/regles/que-es-sternhalma">Sternhalma</a>.</p>
      <h3>On es pot jugar gratis a les dames xineses en línia amb amics?</h3>
      <p>A Leapstone, al navegador o a l'aplicació de l'App Store. Envia un enllaç d'invitació a un amic: s'uneix a la teva partida sense compte, adreça electrònica ni contrasenya. També pots jugar contra l'ordinador, o fer una partida ràpida contra un altre jugador. Leapstone és gratuït i sense anuncis.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Juga a les dames xineses a Leapstone</h2>
      <p>Leapstone és una aplicació gratuïta de dames xineses i Halma, amb un tauler 3D de laca vermella i or. Pots jugar a l'aplicació i al navegador.</p>
      <ul>
        <li><strong>Contra l'ordinador.</strong> Fàcil, normal o difícil. No cal internet.</li>
        <li><strong>Amb amics.</strong> Envia un enllaç d'invitació. Tu fixes el temps per jugada, i podeu xatejar.</li>
        <li><strong>En línia.</strong> Una partida ràpida contra un altre jugador del teu nivell, 30 segons per jugada. Alguns oponents en línia poden ser jugadors de l'ordinador.</li>
        <li><strong>En un sol mòbil.</strong> Passeu-vos el mòbil al voltant de la taula.</li>
      </ul>
      <p>Leapstone és gratuït, sense anuncis i sense registre amb adreça electrònica: només tries un nom de jugador. <a href="https://apps.apple.com/es/app/id6831230722">Descarrega Leapstone a l'App Store</a> o <a href="/play/">juga al navegador</a>.</p>
    </section>`;

export default {
  nav: "Regles de les dames xineses",
  titel: "Regles i consells de les dames xineses | Leapstone",
  beschrijving: "Com es juga a les dames xineses: inici, passos, salts i cadenes, com guanyar amb 2, 3, 4 o 6 jugadors, i consells. Juga gratis al navegador.",
  h1: "Regles de les dames xineses",
  intro: "Porta les 10 fitxes a través del tauler en estrella fins a la punta contrària abans que ningú. Les regles en poques paraules, amb dibuixos, i uns quants consells.",
  inhoud,
};
