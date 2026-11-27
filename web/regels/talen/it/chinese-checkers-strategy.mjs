// La guida italiana alla strategia della dama cinese (taak 134). Contenuto: la guida inglese ../en/chinese-checkers-strategy.mjs
// (ogni consiglio verificato con crates/halma-core, vedi docs/plan.md, taak 122), frase per frase in italiano.
// Le stesse immagini; i testi alt e le didascalie sono in italiano. L'unico numero è 16 (passi da punta a punta).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Su cosa si basano questi consigli</h2>
      <p>I consigli derivano dalle <a href="/it/regole/dama-cinese">regole della dama cinese</a> così come le gioca Leapstone: una mossa è un passo o una catena di salti, e puoi saltare sopra una pedina di qualsiasi colore. Non sono una dimostrazione del gioco migliore. Giocare contro il computer è il modo più rapido per provarli.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Costruisci scale</h2>
      <p>Una scala è una fila di pedine con una casella vuota tra una e l'altra. Una pedina a un'estremità salta sopra tutta la fila in una sola mossa, così attraversa la scacchiera in un turno invece di una casella per turno.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quattro pedine in una fila diagonale con una casella vuota in mezzo. Una pedina rossa a un'estremità salta sopra tutte e quattro, con quattro caselle di atterraggio numerate.",
  tekst: "Quattro salti in una mossa. La stessa pedina potrebbe fare solo una casella alla volta.",
})}
      <p>Un salto funziona in tutte e sei le direzioni, anche all'indietro, quindi una scala non deve per forza partire dalla tua punta. Va bene qualsiasi fila di pedine con dei vuoti in mezzo.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Tieni unite le tue pedine</h2>
      <p>Servono tutte e 10 le pedine nel tuo obiettivo, quindi la tua ultima pedina decide quando finisci. Una pedina senza altre pedine accanto non ha niente da saltare, e può solo fare un passo.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Una scacchiera a stella con una pedina rossa da sola nella punta in basso. Sono segnate solo le sue due caselle vicine vuote. Altre pedine rosse e blu sono al centro.",
  tekst: "Questa pedina non ha vicini, quindi può fare un passo solo sulle due caselle segnate.",
})}
      <p>Dalla cima della tua punta alla cima della punta obiettivo dall'altra parte della scacchiera ci sono 16 passi. Sono 16 turni per una pedina da sola, mentre una scala attraversa in uno. Muovi le pedine in fondo finché ci sono ancora pedine intorno a loro da saltare. Lo fa anche il computer in Leapstone: dà un punteggio un po' più alto alle mosse delle sue pedine più arretrate.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Usa il centro</h2>
      <p>Una pedina al centro della scacchiera ha sei caselle vicine, quindi può fare un passo o un salto in tutte e sei le direzioni. Una pedina sul bordo ne ha meno. La pedina sul bordo nell'immagine ne ha quattro.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Una scacchiera a stella con una pedina rossa al centro con sei caselle vicine segnate, e una pedina rossa vicino al bordo in alto a sinistra con quattro caselle vicine segnate.",
  tekst: "Sei modi per fare un passo al centro, quattro sul bordo.",
})}
      <p>Le pedine al centro danno anche alle altre pedine qualcosa da saltare mentre attraversano.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Riempi l'obiettivo dal fondo</h2>
      <p>Il tuo obiettivo è un triangolo di 10 caselle, in file di 4, 3, 2 e 1. Le caselle in fondo si raggiungono solo passando per quelle davanti. Se riempi prima il davanti, l'ultima pedina potrebbe non avere modo di entrare.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "La punta obiettivo in alto con nove pedine rosse e una casella vuota proprio in fondo, segnata con dei trattini. Una decima pedina rossa, con un anello bianco, è sotto la fila davanti.",
  tekst: "Nove pedine sono a casa, e la casella in fondo è vuota. La decima pedina non ha una mossa per arrivarci.",
})}
      <p>Metti le prime pedine nelle caselle in fondo e vai verso il davanti, così il davanti resta libero per le pedine che arrivano per ultime.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Non murare una pedina nel tuo obiettivo</h2>
      <p>Puoi fermarti nella punta di un altro giocatore, quindi una pedina dell'altro giocatore può finire nel tuo obiettivo. Vinci solo quando tutte e 10 le caselle del tuo obiettivo contengono pedine tue. Se quella pedina non ha mosse, nessuno può muoverla, e non puoi vincere finché non si libera una casella accanto a lei.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "La punta obiettivo in alto con nove pedine rosse e una pedina blu proprio in fondo, segnata con un anello bianco. La pedina blu è circondata da pedine rosse.",
  tekst: "La pedina blu in fondo non ha mosse, e il rosso non può riempire l'obiettivo.",
})}
      <p>Tieni libera una casella accanto a una pedina così, in modo che possa andarsene. Il computer in Leapstone ne tiene conto: una mossa che intrappola una pedina di un altro giocatore nel suo obiettivo ottiene un punteggio più basso. Le regole non costringono nessuno a lasciare il tuo obiettivo, quindi l'altro giocatore può anche parcheggiarci una pedina apposta.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blocca un salto, o lascialo stare</h2>
      <p>Un salto ha bisogno di una casella vuota su cui atterrare. Riempi quella casella e il salto non c'è più. Nemmeno due pedine di seguito si possono saltare.</p>
      <p>Anche le tue pedine sono appigli per l'altro giocatore. Nell'immagine a sinistra il blu attraversa due pedine rosse in una mossa. A destra, il rosso ha spostato una pedina sulla prima casella di atterraggio, e il blu può solo fare un passo.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Una pedina blu con due pedine rosse in fila, ciascuna con una casella vuota dietro. Delle frecce mostrano due salti della pedina blu.",
          tekst: "Prima: il blu può fare due salti.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "La stessa fila dopo che il rosso ha spostato la sua pedina più lontana sulla prima casella di atterraggio. La pedina blu è seguita da due pedine rosse di fila.",
          tekst: "Dopo: il rosso ha spostato una pedina. Il blu non ha salti.",
        })}
      </div>
      <p>Una mossa spesa a bloccare è una mossa non spesa per i tuoi progressi, quindi blocca quando il salto dà all'altro giocatore più di quanto ti darebbe la tua mossa. Vale anche al contrario quando costruisci una scala: dopo la tua mossa muove per primo l'altro giocatore, quindi una sua pedina a un'estremità usa la tua scala prima di te. Al livello più difficile, il computer guarda la migliore risposta di ogni avversario prima di scegliere una mossa.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continua così</h2>
      <ul>
        <li><a href="/play/">Gioca contro il computer nel browser</a> e prova una scala.</li>
        <li><a href="/it/guide/dama-cinese-in-due">Dama cinese per 2 giocatori</a>: come funziona una partita in due.</li>
        <li><a href="/it/regole/dama-cinese">Regole della dama cinese</a>, con le immagini di passi, salti e catene.</li>
      </ul>
      <p><a href="/it/guide/dama-cinese-online-con-gli-amici">Dama cinese online con gli amici</a></p>
      <p><a href="/it/guide/halma-o-dama-cinese">Halma o dama cinese</a></p>
      <p><a href="/it/guide/dama-cinese-in-tre">Dama cinese per 3 giocatori</a></p>
    </section>`;

export default {
  nav: "Strategia della dama cinese",
  titel: "Strategia della dama cinese: 6 consigli | Leapstone",
  beschrijving: "Strategia della dama cinese: costruisci scale, tieni unite le pedine, usa il centro, riempi l'obiettivo dal fondo e impara quando bloccare un salto.",
  h1: "Strategia della dama cinese",
  intro: "Sei consigli per la scacchiera a stella, ognuno con un'immagine tratta dalle regole vere: scale, pedine rimaste indietro, il centro, riempire l'obiettivo e bloccare i salti.",
  inhoud,
};
