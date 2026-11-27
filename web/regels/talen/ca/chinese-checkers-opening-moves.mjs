// La guia catalana Obertures de les dames xineses (taak 303), frase per frase de ../en/chinese-checkers-opening-moves.mjs.
// Cada jugada i cada xifra està comprovada amb crates/halma-core (vegeu el fitxer anglès). Només xifres al text, cap nombre escrit amb lletres.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">La teva primera jugada: 14 opcions</h2>
      <p>Al començament, les teves 10 fitxes omplen un triangle amb files de 4, 3, 2 i 1, i la fila del davant mira cap al centre del tauler. No hi ha cap casella buida dins del triangle, així que una fitxa només pot anar a la fila que té just al davant. Això deixa 14 primeres jugades: cadascuna de les 4 fitxes de la fila del davant pot fer un pas a 2 caselles (8 passos), i cadascuna de les 3 fitxes de la segona fila pot saltar per sobre d'una fitxa del davant fins a 2 caselles (6 salts). Les altres 3 fitxes encara no es poden moure.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "La punta vermella a baix amb les seves 10 fitxes, i a la fila just al davant 5 caselles buides marcades amb un cercle.",
  tekst: "Cada primera jugada acaba en una d'aquestes 5 caselles.",
})}
      <p>En aquesta guia una fila és una línia de caselles que travessa la teva punta, paral·lela a la vora del davant, i comptem el progrés en files. Un pas porta una fitxa endavant 1 fila i un salt la porta 2 files. Tots els jugadors tenen les mateixes 14 primeres jugades, amb 2, 3, 4 o 6 jugadors i des de qualsevol punta de l'estrella, perquè totes les puntes es veuen igual des de dins.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Obertura 1: salta enfora i després allibera l'extrem</h2>
      <p>La fitxa de l'extrem de la teva punta és la més lluny del teu objectiu, i al començament no es pot moure: només pot saltar per sobre d'una fitxa si la casella de darrere d'aquella fitxa és buida. Un salt des de la segona fila crea justament una casella així.</p>
      <ol>
        <li><strong>Jugada 1:</strong> la fitxa de l'extrem dret de la teva segona fila salta per sobre de la fitxa que té al davant. Cau a la fila davant de la teva punta i avança 2 files.</li>
        <li><strong>Jugada 2:</strong> la fitxa de l'extrem salta dues vegades en una jugada: primer a la casella que ha buidat la jugada 1, després per sobre d'una fitxa de la segona fila. Avança 4 files.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "La punta vermella després de la jugada 1. La fitxa de l'extrem té un cercle, i 2 fletxes amb els números 1 i 2 mostren els seus salts per la casella buidada fins a la fila davant de la punta.",
  tekst: "Després de la jugada 1, la fitxa de l'extrem salta enfora amb 2 salts.",
})}
      <p>Són 6 files en 2 jugades. Hem provat totes les maneres de fer 2 jugades, i 6 és el màxim que es pot avançar. Només 4 parells de jugades hi arriben: salta la fitxa de qualsevol dels dos extrems de la segona fila, en qualsevol de les seves 2 direccions, i la fitxa de l'extrem la segueix. La fitxa del mig de la segona fila no serveix, perquè deixa l'extrem tancat.</p>
      <p>Les dues fitxes ara són a la fila davant de la teva punta amb una casella buida entremig. Això és el primer graó d'una escala.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Obertura 2: 4 jugades amb 4 fitxes diferents</h2>
      <p>En 4 jugades el màxim que es pot avançar són 13 files, i només s'hi arriba si cada jugada fa servir una fitxa diferent. Aquesta línia ho aconsegueix:</p>
      <ol>
        <li><strong>Jugada 1:</strong> la fitxa de l'extrem dret de la fila del davant fa un pas endavant. Avança 1 fila.</li>
        <li><strong>Jugada 2:</strong> la fitxa de l'extrem dret de la tercera fila salta dues vegades. Avança 4 files.</li>
        <li><strong>Jugada 3:</strong> la fitxa de l'extrem esquerre de la segona fila salta dues vegades. Avança 4 files.</li>
        <li><strong>Jugada 4:</strong> la fitxa de l'extrem salta dues vegades. Avança 4 files.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "La punta vermella al començament. Les 4 fitxes que es mouran tenen un número de l'1 al 4, segons l'ordre de les jugades.",
          tekst: "Abans: les fitxes que es mouen, en ordre.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "La punta vermella després de 4 jugades, amb les 4 caselles on han caigut les fitxes numerades a les files davant de la punta, i 4 forats que han quedat a la punta.",
          tekst: "Després: on han caigut.",
        })}
      </div>
      <p>Cada jugada prepara la següent. Les jugades 2 i 3 acaben amb un salt per sobre de la fitxa que s'acaba de moure, i la jugada 4 comença pel forat que ha deixat la jugada 3. Les 4 fitxes cauen a la teva meitat del tauler.</p>
      <p>Hi ha més línies que arriben a 13. El que tenen en comú és la idea: busca la jugada que deixa un forat o un esglaó per a la jugada següent, i fes sortir la fitxa de l'extrem com a molt tard a la jugada 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Errors a les primeres jugades</h2>
      <ul class="tips">
        <li><strong>Moure la mateixa fitxa a cada torn.</strong> Una fitxa que corre sola avança 5 files en 4 jugades, contra 13 amb 4 fitxes diferents. A més, deixa la resta de les teves fitxes on eren.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "La punta vermella al començament. Una fitxa de la segona fila fa 4 jugades seguides per una mateixa línia, amb fletxes i els números de l'1 al 4, i acaba sola prop del centre del tauler.",
  tekst: "Una fitxa, 4 jugades, 5 files.",
})}
      <ul class="tips">
        <li><strong>Fer només passos amb la fila del davant.</strong> 4 passos avancen 4 files. Després, la fitxa de l'extrem encara no es pot moure, així que es queda al darrere mentre la resta avança.</li>
        <li><strong>Fer passos de costat.</strong> Un pas al llarg d'una fila avança 0 files. Després de la jugada 1 de l'obertura 1, la fitxa del davant pot fer un pas a la casella del costat, i sembla progrés, però la jugada es perd.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continua</h2>
      <p>Després de 4 jugades més o menys, els dos exèrcits s'acosten, i les obertures de dalt deixen pas al mig de la partida. No cal que recordis les línies: recorda que cada jugada ha de preparar la següent.</p>
      <ul>
        <li><a href="/play/">Juga contra l'ordinador al navegador</a> i prova l'obertura 1 o 2.</li>
        <li><a href="/ca/guies/estrategia-dames-xineses">Estratègia de les dames xineses</a>: escales, mantenir les fitxes juntes i omplir el teu objectiu.</li>
        <li><a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>: com funciona una partida de dos.</li>
        <li><a href="/ca/regles/dames-xineses">Regles de les dames xineses</a>, amb dibuixos de passos, salts i cadenes.</li>
      </ul>
    </section>`;

export default {
  nav: "Obertures de les dames xineses",
  titel: "Obertures de les dames xineses: 2 obertures | Leapstone",
  beschrijving: "Obertures de les dames xineses: com saltar fora de la teva punta, alliberar la fitxa de l'extrem a la jugada 2, avançar 13 files en 4 jugades i els errors.",
  h1: "Obertures de les dames xineses",
  intro: "Una bona obertura a les dames xineses salta des de la segona fila, fa servir una fitxa diferent a cada torn i fa sortir la fitxa del teu extrem a la jugada 2 o 4. Dues obertures amb dibuixos, i els errors que cal evitar.",
  inhoud,
};
