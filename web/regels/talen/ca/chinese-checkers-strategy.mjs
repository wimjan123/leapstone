// La guia catalana Estratègia de les dames xineses (taak 134): /ca/guies/estrategia-dames-xineses.
// Contingut: la guia anglesa ../en/chinese-checkers-strategy.mjs, frase per frase. Cada consell està comprovat amb crates/halma-core
// (vegeu docs/plan.md, taak 122); els dibuixos vénen de crates/halma-core/examples/regelplaatjes.rs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">En què es basen aquests consells</h2>
      <p>Els consells surten de les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> tal com les juga Leapstone: una jugada és un pas o una cadena de salts, i pots saltar per sobre d'una fitxa de qualsevol color. No són una demostració del millor joc. Jugar contra l'ordinador és la manera més ràpida de provar-los.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Construeix escales</h2>
      <p>Una escala és una línia de fitxes amb una casella buida entre cadascuna. Una fitxa d'un extrem salta per sobre de tota la línia en una sola jugada, així que creua el tauler en un torn en lloc d'una casella per torn.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatre fitxes en una línia diagonal amb una casella buida entre cadascuna. Una fitxa vermella en un extrem salta per sobre de totes quatre, amb quatre caselles numerades on cau.",
  tekst: "Quatre salts en una jugada. La mateixa fitxa només podria avançar una casella cada vegada.",
})}
      <p>Un salt funciona en les sis direccions, també cap enrere, de manera que una escala no ha de començar a la teva punta. Serveix qualsevol línia de fitxes amb buits entre elles.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Mantén les fitxes juntes</h2>
      <p>Necessites les 10 fitxes a l'objectiu, així que la teva última fitxa decideix quan acabes. Una fitxa sense cap fitxa al costat no té res per saltar, i només pot fer passos.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Un tauler en estrella amb una fitxa vermella sola a la punta de baix. Només estan marcades les seves dues veïnes buides. Altres fitxes vermelles i blaves són al mig.",
  tekst: "Aquesta fitxa no té cap veïna, així que només pot fer un pas a les dues caselles marcades.",
})}
      <p>Des de l'extrem de la teva punta fins a l'extrem de l'objectiu a l'altra banda del tauler hi ha 16 passos. Són 16 torns per a una fitxa sola, mentre que una escala la creua en un. Mou les fitxes de darrere mentre encara hi ha fitxes al seu voltant per saltar. L'ordinador de Leapstone també ho fa: puntua una mica més alt les jugades de les seves fitxes més endarrerides.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Fes servir el centre</h2>
      <p>Una fitxa al centre del tauler té sis veïnes, així que pot fer un pas o un salt en les sis direccions. Una fitxa a la vora en té menys. La fitxa de la vora del dibuix en té quatre.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Un tauler en estrella amb una fitxa vermella al centre amb sis veïnes marcades, i una fitxa vermella a prop de la vora de dalt a l'esquerra amb quatre veïnes marcades.",
  tekst: "Sis maneres de fer un pas al centre, quatre a la vora.",
})}
      <p>Les fitxes del centre també donen a les altres fitxes alguna cosa per saltar quan van cap a l'altra banda.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Omple l'objectiu des del fons</h2>
      <p>El teu objectiu és un triangle de 10 caselles, en files de 4, 3, 2 i 1. Només es pot arribar a les caselles del fons passant per les que tenen al davant. Si primer omples el davant, l'última fitxa pot no tenir manera d'entrar.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "La punta de l'objectiu a dalt amb nou fitxes vermelles i una casella buida al fons de tot, marcada amb ratlles. Una desena fitxa vermella, amb un anell blanc, és sota la fila del davant.",
  tekst: "Nou fitxes són a casa, i la casella del fons és buida. La desena fitxa no té cap jugada per entrar-hi.",
})}
      <p>Posa les primeres fitxes a les caselles del fons i avança cap al davant, així el davant queda obert per a les fitxes que arriben les últimes.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. No emmurallis una fitxa al teu objectiu</h2>
      <p>Pots parar a la punta d'un altre jugador, així que una fitxa de l'altre jugador pot acabar al teu objectiu. Només guanyes quan les 10 caselles del teu objectiu tenen fitxes teves. Si aquella fitxa no té cap jugada, ningú no la pot moure, i no pots guanyar fins que s'obri una casella del seu costat.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "La punta de l'objectiu a dalt amb nou fitxes vermelles i una fitxa blava al fons de tot, marcada amb un anell blanc. La fitxa blava està envoltada de fitxes vermelles.",
  tekst: "La fitxa blava del fons no té cap jugada, i el vermell no pot omplir l'objectiu.",
})}
      <p>Deixa oberta una casella al costat d'una fitxa així, perquè pugui sortir. L'ordinador de Leapstone ho té en compte: una jugada que atrapa una fitxa d'un altre jugador al seu objectiu puntua més baix. Les regles no obliguen ningú a sortir del teu objectiu, així que l'altre jugador també hi pot aparcar una fitxa a propòsit.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bloqueja un salt, o deixa'l</h2>
      <p>Un salt necessita una casella buida on caure. Omple aquesta casella i el salt desapareix. Dues fitxes seguides tampoc no es poden saltar.</p>
      <p>Les teves fitxes també són esglaons per a l'altre jugador. Al dibuix de l'esquerra el blau creua dues fitxes vermelles en una jugada. A la dreta, el vermell ha mogut una fitxa a la primera casella on cauria, i el blau només pot fer un pas.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Una fitxa blava amb dues fitxes vermelles en línia, cadascuna amb una casella buida darrere. Unes fletxes mostren dos salts de la fitxa blava.",
          tekst: "Abans: el blau pot fer dos salts.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "La mateixa línia després que el vermell hagi mogut la fitxa llunyana a la primera casella on cauria. La fitxa blava va seguida de dues fitxes vermelles seguides.",
          tekst: "Després: el vermell ha mogut una fitxa. El blau no té cap salt.",
        })}
      </div>
      <p>Una jugada gastada a bloquejar és una jugada que no gastes en el teu propi progrés, així que bloqueja quan el salt doni a l'altre jugador més del que et donaria la teva jugada a tu. Al revés passa quan construeixes una escala: després de la teva jugada, l'altre jugador mou primer, així que una fitxa seva en un extrem fa servir la teva escala abans que tu. Al nivell més difícil, l'ordinador mira la millor resposta de cada oponent abans de triar una jugada.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continua</h2>
      <ul>
        <li><a href="/play/">Juga contra l'ordinador al navegador</a> i prova una escala.</li>
        <li><a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>: com funciona una partida de dos.</li>
        <li><a href="/ca/regles/dames-xineses">Regles de les dames xineses</a>, amb dibuixos de passos, salts i cadenes.</li>
      </ul>
      <p><a href="/ca/guies/dames-xineses-en-linia-amb-amics">Dames xineses en línia amb amics</a></p>
      <p><a href="/ca/guies/halma-o-dames-xineses">Halma o dames xineses</a></p>
      <p><a href="/ca/guies/dames-xineses-3-jugadors">Dames xineses per a 3 jugadors</a></p>
    </section>`;

export default {
  nav: "Estratègia de les dames xineses",
  titel: "Estratègia de les dames xineses: 6 consells | Leapstone",
  beschrijving: "Estratègia de les dames xineses: fes escales, mantén les fitxes juntes, usa el centre, omple l'objectiu des del fons i bloqueja salts a temps.",
  h1: "Estratègia de les dames xineses",
  intro: "Sis consells per al tauler en estrella, cadascun amb un dibuix de les regles reals: escales, endarrerides, el centre, omplir l'objectiu i bloquejar salts.",
  inhoud,
};
