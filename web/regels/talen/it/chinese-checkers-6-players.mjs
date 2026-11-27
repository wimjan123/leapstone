// De gids Dama cinese per 6 giocatori (taak 302): /it/guide/dama-cinese-in-sei.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Italiaans. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Come inizia la partita</h2>
      <p>Ogni giocatore ha 10 pedine, e tutte le 6 punte della stella sono in uso. Così ci sono 60 pedine sulla scacchiera di 121 caselle. Le 61 caselle al centro sono vuote all'inizio.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "La tavola a stella con 10 pedine in ciascuna delle sue 6 punte, in 6 colori",
  tekst: "6 giocatori, 6 punte, 60 pedine.",
})}
      <p>Il Giocatore 1, il rosso, muove per primo, dalla punta in basso. Poi il turno va dal Giocatore 1 al Giocatore 6, e dopo il Giocatore 6 tocca di nuovo al Giocatore 1. I giocatori sono numerati nell'ordine delle loro punte intorno alla stella, quindi il giocatore dopo di te parte sempre dalla punta accanto alla tua. Una mossa è un passo o una catena di salti con una pedina. Per passi e salti guarda le <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ogni obiettivo è pieno all'inizio</h2>
      <p>Vinci portando tutte e 10 le tue pedine nella punta dall'altra parte della scacchiera. Con 6 giocatori è la punta da cui parte il giocatore di fronte a te, quindi nessun obiettivo è vuoto: ogni obiettivo parte pieno delle pedine di un altro giocatore. Per il rosso, l'obiettivo è la punta in alto, da cui parte il Giocatore 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "La tavola a stella con 6 punte piene. Un anello tratteggiato segna la punta in alto, l'obiettivo del giocatore rosso, che contiene le pedine del giocatore di fronte.",
  tekst: "L'obiettivo del rosso è la punta di fronte, piena delle pedine del Giocatore 4.",
})}
      <p>Puoi atterrare solo su una casella vuota, quindi il giocatore di fronte deve lasciare la sua punta prima che tu possa riempirla, e tu devi lasciare la tua prima che lui possa riempire la sua. In una partita per 2 è tutto qui. Con 6, entrambi dovete anche attraversare la folla degli altri 4.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Un centro affollato</h2>
      <p>Ogni obiettivo è dall'altra parte della scacchiera, e le punte sono collegate tra loro solo attraverso il centro, quindi tutte le 60 pedine devono attraversare le stesse 61 caselle. All'inizio nessuno ha ancora attraversato, e il centro si riempie in fretta.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Una pedina rossa salta tre volte in una sola mossa: sopra una pedina blu, poi sopra una verde e poi sopra una viola. I numeri 1, 2 e 3 segnano le caselle di atterraggio.",
  tekst: "Le pedine di ogni colore sono appigli.",
})}
      <p>Puoi saltare sopra una pedina di qualsiasi colore. Le pedine di altri 5 giocatori sono appigli per te, e le tue sono appigli per tutti e 5. Una fila di pedine che lasci al centro è una scala per chiunque riesca a raggiungerla, e il giocatore dopo di te ha la prima occasione.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Bloccare con 5 avversari</h2>
      <ul>
        <li><strong>Riempi la casella di atterraggio:</strong> un salto richiede una casella vuota subito dietro la pedina. Quando ci porti una pedina, il salto sparisce per ogni giocatore che lo voleva fare.</li>
        <li><strong>Attenzione alle scale che costruisci:</strong> dopo la tua mossa, gli altri 5 giocatori muovono prima che tocchi di nuovo a te. Una scala aiuta tutti loro.</li>
        <li><strong>Chiunque può bloccare un obiettivo:</strong> una pedina di qualsiasi altro giocatore nel tuo obiettivo ti impedisce di finire, non solo una pedina del giocatore di fronte. Tutte e 10 le caselle dell'obiettivo devono contenere le tue pedine.</li>
      </ul>
      <p>I <a href="/it/guide/strategia-dama-cinese">consigli di strategia</a> mostrano come appare un salto bloccato, e come non chiudere una pedina di un altro giocatore nel tuo obiettivo.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Quanto dura una partita</h2>
      <p>In una partita a 6 ci sono 60 pedine da muovere, e tra una tua mossa e la successiva gli altri 5 giocatori ne fanno una ciascuno. Inoltre non finisce quando finisce il primo giocatore.</p>
      <ul>
        <li><strong>Vincere e continuare a giocare:</strong> il primo giocatore che riempie l'obiettivo vince, e gli altri continuano a giocare per i posti successivi. Il giocatore che ha finito viene saltato, e le sue pedine restano sulla scacchiera come appigli. La partita finisce quando gioca ancora un solo giocatore.</li>
        <li><strong>Abbandonare:</strong> le tue pedine lasciano la scacchiera, quindi non bloccano e non aiutano più nessuno, e gli altri continuano.</li>
        <li><strong>Tempo (online):</strong> in una partita online ogni mossa ha un limite di tempo, scelto dal giocatore che avvia la partita: 15 secondi, 30 secondi, 1 minuto, 2 minuti o nessun limite. Un giro di 6 mosse dura al massimo 6 volte il limite, quindi con 30 secondi sono al massimo 3 minuti. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni, e la partita continua senza di te.</li>
      </ul>
      <p>Per una partita con meno giocatori, leggi <a href="/it/guide/dama-cinese-in-due">Dama cinese per 2 giocatori</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dove giocare con 6 giocatori in Leapstone</h2>
      <ul>
        <li><strong>Contro il computer, subito:</strong> apri <a href="/play/">Leapstone nel browser</a>, tocca Computer, scegli la tavola a stella e 5 computer. Sei il Giocatore 1, quindi muovi per primo. I computer muovono uno dopo l'altro, ognuno con una breve pausa, così puoi seguire ogni mossa. Scegli Facile, Normale o Difficile per i computer.</li>
        <li><strong>Su un solo telefono:</strong> tocca Gioca, scegli la tavola a stella e 6 giocatori, poi tocca una pedina per cambiare quel posto tra una persona e un computer.</li>
        <li><strong>Online con gli amici:</strong> tocca Amici, scegli la tavola a stella, 6 giocatori e il tempo per mossa, e invia il link d'invito. La partita inizia quando tutti e 6 i posti sono occupati.</li>
        <li><strong>Partite veloci:</strong> Gioca online trova partite per 2 o 4 giocatori, quindi non c'è una partita veloce per 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Dama cinese per 6 giocatori",
  titel: "Dama cinese per 6: la scacchiera piena | Leapstone",
  beschrijving: "Come funziona la dama cinese con 6 giocatori: una stella piena di 60 pedine, un centro affollato, il blocco, quanto dura una partita e dove giocare.",
  h1: "Dama cinese per 6 giocatori",
  intro: "Come funziona una partita per 6: tutte le 6 punte sono piene, corri verso la punta dall'altra parte della scacchiera, e la partita continua dopo che il primo giocatore ha finito.",
  inhoud,
};
