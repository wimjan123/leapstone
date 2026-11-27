// La guida italiana alle aperture della dama cinese (taak 303, feature 294): /it/guide/dama-cinese-aperture.
// Contenuto: la guida inglese ../en/chinese-checkers-opening-moves.mjs (ogni numero e ogni mossa verificati con crates/halma-core), frase per frase in italiano.
// Una fila è l'insieme delle caselle alla stessa distanza dalla tua punta; un passo avanza di 1 fila, un salto di 2. Nessun "esperto" inventato né storia.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">La tua prima mossa: 14 scelte</h2>
      <p>All'inizio le tue 10 pedine riempiono un triangolo in file da 4, 3, 2 e 1, e la fila davanti guarda verso il centro della scacchiera. Dentro il triangolo non c'è nessuna casella vuota, quindi una pedina può andare solo nella fila subito davanti a sé. Restano così 14 prime mosse: ognuna delle 4 pedine della fila davanti può fare un passo su 2 caselle (8 passi), e ognuna delle 3 pedine della seconda fila può saltare sopra una pedina davanti su 2 caselle (6 salti). Le altre 3 pedine non possono ancora muoversi.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "La punta rossa in basso con le sue 10 pedine, e nella fila subito davanti 5 caselle vuote segnate con un anello.",
  tekst: "Ogni prima mossa finisce in una di queste 5 caselle.",
})}
      <p>In questa guida una fila è una linea di caselle attraverso la tua punta, parallela al suo bordo anteriore, e contiamo i progressi in file. Un passo porta una pedina avanti di 1 fila e un salto di 2 file. Ogni giocatore ha le stesse 14 prime mosse, con 2, 3, 4 o 6 giocatori e da qualsiasi punta della stella, perché dall'interno ogni punta è uguale.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Apertura 1: salta fuori, poi libera la cima</h2>
      <p>La pedina in cima alla tua punta è la più lontana dal tuo obiettivo, e all'inizio non può muoversi: può saltare sopra una pedina solo se la casella dietro quella pedina è vuota. Un salto dalla seconda fila crea proprio una casella così.</p>
      <ol>
        <li><strong>Mossa 1:</strong> la pedina all'estremità destra della tua seconda fila salta sopra la pedina davanti a sé. Atterra nella fila davanti alla tua punta e guadagna 2 file.</li>
        <li><strong>Mossa 2:</strong> la pedina in cima salta due volte in una mossa: prima nella casella che la mossa 1 ha svuotato, poi sopra una pedina della seconda fila. Guadagna 4 file.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "La punta rossa dopo la mossa 1. La pedina in cima ha un anello, e 2 frecce con i numeri 1 e 2 mostrano i suoi salti attraverso la casella svuotata fino alla fila davanti alla punta.",
  tekst: "Dopo la mossa 1 la pedina in cima salta fuori con 2 salti.",
})}
      <p>Sono 6 file in 2 mosse. Abbiamo provato tutti i modi di giocare 2 mosse, e 6 è il massimo che si può guadagnare. Solo 4 coppie di mosse ci arrivano: salta la pedina a una qualsiasi delle due estremità della seconda fila, in una delle sue 2 direzioni, e la pedina in cima la segue. La pedina al centro della seconda fila non va bene, perché tiene chiusa la cima.</p>
      <p>Ora le due pedine stanno nella fila davanti alla tua punta con una casella vuota in mezzo. È il primo gradino di una scala.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Apertura 2: 4 mosse con 4 pedine diverse</h2>
      <p>In 4 mosse il massimo che puoi guadagnare è 13 file, e ci arrivi solo se ogni mossa usa una pedina diversa. Questa linea ci riesce:</p>
      <ol>
        <li><strong>Mossa 1:</strong> la pedina all'estremità destra della fila davanti fa un passo avanti. Guadagna 1 fila.</li>
        <li><strong>Mossa 2:</strong> la pedina all'estremità destra della terza fila salta due volte. Guadagna 4 file.</li>
        <li><strong>Mossa 3:</strong> la pedina all'estremità sinistra della seconda fila salta due volte. Guadagna 4 file.</li>
        <li><strong>Mossa 4:</strong> la pedina in cima salta due volte. Guadagna 4 file.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "La punta rossa all'inizio. Le 4 pedine che si muoveranno hanno un numero da 1 a 4, nell'ordine delle mosse.",
          tekst: "Prima: le pedine che si muovono, in ordine.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "La punta rossa dopo 4 mosse, con le 4 caselle dove sono atterrate le pedine numerate nelle file davanti alla punta, e 4 buchi rimasti nella punta.",
          tekst: "Dopo: dove sono atterrate.",
        })}
      </div>
      <p>Ogni mossa prepara la successiva. Le mosse 2 e 3 finiscono con un salto sopra la pedina appena mossa, e la mossa 4 parte attraverso il buco lasciato dalla mossa 3. Tutte e 4 le pedine atterrano nella tua metà della scacchiera.</p>
      <p>Ci sono altre linee che arrivano a 13. Hanno in comune l'idea: cerca la mossa che lascia un buco o un appoggio per la mossa dopo, e fai uscire la pedina in cima al più tardi con la mossa 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Errori nelle prime mosse</h2>
      <ul class="tips">
        <li><strong>Muovere la stessa pedina a ogni turno.</strong> Una pedina che corre da sola guadagna 5 file in 4 mosse, contro 13 per 4 pedine diverse. Lascia inoltre le altre tue pedine dove erano.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "La punta rossa all'inizio. Una pedina della seconda fila fa 4 mosse di fila lungo una sola linea, con frecce e i numeri da 1 a 4, e finisce da sola vicino al centro della scacchiera.",
  tekst: "Una pedina, 4 mosse, 5 file.",
})}
      <ul class="tips">
        <li><strong>Fare passi solo con la fila davanti.</strong> 4 passi guadagnano 4 file. Dopo di essi la pedina in cima non può ancora muoversi, quindi resta dietro mentre il resto va avanti.</li>
        <li><strong>Fare passi di lato.</strong> Un passo lungo una fila guadagna 0 file. Dopo la mossa 1 dell'apertura 1 la pedina davanti può fare un passo sulla casella accanto, e sembra un progresso, ma la mossa è sprecata.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Come continuare</h2>
      <p>Dopo circa 4 mosse i due eserciti si avvicinano, e le aperture qui sopra lasciano posto al centro della partita. Non devi ricordare le linee: ricorda che ogni mossa deve preparare la successiva.</p>
      <ul>
        <li><a href="/play/">Gioca contro il computer nel browser</a> e prova l'apertura 1 o 2.</li>
        <li><a href="/it/guide/strategia-dama-cinese">Strategia della dama cinese</a>: scale, tenere unite le pedine e riempire il tuo obiettivo.</li>
        <li><a href="/it/guide/dama-cinese-in-due">Dama cinese per 2 giocatori</a>: come funziona una partita in due.</li>
        <li><a href="/it/regole/dama-cinese">Regole della dama cinese</a>, con immagini di passi, salti e catene.</li>
      </ul>
    </section>`;

export default {
  nav: "Aperture nella dama cinese",
  titel: "Aperture della dama cinese: 2 aperture | Leapstone",
  beschrijving: "Aperture della dama cinese: come saltare fuori dalla tua punta, liberare la pedina in cima con la mossa 2 e guadagnare 13 file in 4 mosse.",
  h1: "Aperture nella dama cinese",
  intro: "Una buona apertura nella dama cinese salta fuori dalla seconda fila, usa una pedina diversa a ogni turno e fa uscire la pedina in cima con la mossa 2 o 4. Due aperture con immagini e gli errori da evitare.",
  inhoud,
};
