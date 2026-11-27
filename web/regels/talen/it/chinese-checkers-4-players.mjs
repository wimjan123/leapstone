// La guida italiana Dama cinese per 4 giocatori (taak 301): /it/guide/dama-cinese-in-quattro.
// Contenuto: la guida inglese ../en/chinese-checkers-4-players.mjs, frase per frase in italiano.
// I testi dei pulsanti dell'app vengono da web/src/talen/it.ts.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Come è divisa la scacchiera</h2>
      <p>Ogni giocatore ha 10 pedine, quindi 40 pedine stanno su una scacchiera di 121 caselle. Le quattro punte di partenza sono due coppie di punte una accanto all'altra: il rosso in basso e il blu in basso a sinistra, il verde in alto e il giallo in alto a destra.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "La scacchiera a stella con 10 pedine rosse nella punta in basso, 10 pedine blu nella punta in basso a sinistra, 10 pedine verdi nella punta in alto e 10 pedine gialle nella punta in alto a destra. Le punte in alto a sinistra e in basso a destra sono vuote.",
  tekst: "Il rosso in basso, il blu in basso a sinistra, il verde in alto, il giallo in alto a destra.",
})}
      <p>Il Giocatore 1, il rosso, muove per primo. Poi il blu è il Giocatore 2, il verde è il Giocatore 3, il giallo è il Giocatore 4, e dopo il giallo tocca di nuovo al rosso. Una mossa è un passo o una catena di salti con una pedina. Per passi e salti guarda le <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Chi sta di fronte a chi</h2>
      <p>Le punte formano coppie attraverso la scacchiera: il rosso sta di fronte al verde, e il blu sta di fronte al giallo. Il tuo obiettivo è la punta di fronte a te. Il rosso va dove parte il verde, il verde dove parte il rosso, il blu dove parte il giallo e il giallo dove parte il blu.</p>
      <p>Come in una partita per 2, ogni obiettivo parte pieno delle pedine del giocatore che sta di fronte a te, quindi puoi atterrarci solo dopo che se ne sono andate. Con 3 giocatori gli obiettivi partono vuoti, quindi con 4 nessuno può finire subito. I quattro obiettivi sono quattro punte diverse, quindi nessun altro vuole il tuo obiettivo: un giocatore che ha finito non blocca mai nessuno.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Le due punte vuote</h2>
      <p>Le punte in alto a sinistra e in basso a destra non hanno pedine. Non sono la partenza di nessuno e l'obiettivo di nessuno. Quella in alto a sinistra sta tra il blu e il verde, e quella in basso a destra tra il giallo e il rosso.</p>
      <p>Puoi fare un passo o un salto su qualsiasi casella vuota, quindi puoi attraversare queste punte o fermarti al loro interno. Una pedina lì, però, non è ancora in un obiettivo. In una punta vuota non c'è nulla da saltare finché qualcuno non ci porta delle pedine.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Cosa cambia nella tua tattica</h2>
      <ul>
        <li><strong>Due attraversamenti insieme:</strong> il rosso e il verde attraversano la scacchiera uno verso l'altro, e lo stesso fanno il blu e il giallo. Entrambe le linee passano per il centro, quindi il centro è più affollato che in una partita per 2, dove attraversa una sola linea.</li>
        <li><strong>Tre giocatori muovono tra i tuoi turni:</strong> la scacchiera cambia più che in una partita per 2 tra due tue mosse. Guardala di nuovo all'inizio di ogni turno e pianifica allora la tua catena di salti. Il giocatore che muove dopo di te non è mai quello che sta di fronte a te.</li>
        <li><strong>Le pedine aiutano tutti:</strong> ogni pedina degli altri tre è un appiglio per te, e le tue sono appigli per loro. Le pedine del giocatore di fronte a te vanno nella direzione opposta, come in una partita per 2.</li>
        <li><strong>Spazio per aggirare:</strong> se il centro è pieno, le punte vuote sono spazio libero accanto agli accampamenti. Un percorso attraverso una di esse può essere un modo per aggirare la folla.</li>
        <li><strong>Un giocatore che abbandona libera il tuo obiettivo:</strong> quando il giocatore di fronte a te abbandona, le sue pedine lasciano la scacchiera, quindi il tuo obiettivo è subito vuoto.</li>
      </ul>
      <p>I <a href="/it/guide/strategia-dama-cinese">consigli di strategia</a> su scale, pedine in ritardo e riempimento dell'obiettivo dal fondo valgono allo stesso modo con 4 giocatori.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vincere, e cosa succede dopo</h2>
      <ul>
        <li><strong>Vincere:</strong> il primo giocatore che riempie l'obiettivo con tutte e 10 le pedine vince. La partita non finisce lì: gli altri tre continuano a giocare per i posti successivi, e il giocatore che ha finito viene saltato. Le pedine di quel giocatore restano sulla scacchiera. La partita finisce quando gioca ancora un solo giocatore.</li>
        <li><strong>Abbandonare:</strong> le tue pedine lasciano la scacchiera e gli altri tre continuano a giocare. Se abbandonano anche gli altri, vince l'ultimo giocatore rimasto.</li>
        <li><strong>Tempo (online):</strong> in una partita online ogni mossa ha un limite di tempo. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni, e la partita continua senza di te.</li>
      </ul>
      <p>Per le partite con meno giocatori leggi <a href="/it/guide/dama-cinese-in-due">Dama cinese per 2 giocatori</a>. La <a href="/it/regole/dama-cinese">pagina delle regole</a> ha le immagini di ogni partenza.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dove giocare in 4 in Leapstone</h2>
      <ul>
        <li><strong>Contro il computer, subito:</strong> apri <a href="/play/">Leapstone nel browser</a>, tocca Computer, scegli la tavola a stella e 3 computer. Sei il Giocatore 1, quindi muovi per primo. Per i computer scegli Facile, Normale o Difficile.</li>
        <li><strong>Su un solo telefono:</strong> tocca Gioca, scegli la tavola a stella e 4 giocatori, poi tocca una pedina per cambiare quel posto tra una persona e un computer.</li>
        <li><strong>Online con gli amici:</strong> tocca Amici, scegli la tavola a stella, 4 giocatori e il tempo per mossa, e invia il link d'invito. La partita inizia quando tutti e 4 i posti sono occupati.</li>
        <li><strong>Partita veloce, nell'app:</strong> tocca Gioca online. Mentre cerca una partita per 2, tocca Cerca 4 o 6 giocatori per cercare invece una partita per 4. Ogni mossa ha 30 secondi. Se non entrano abbastanza giocatori entro 20 secondi, i giocatori del computer riempiono i posti vuoti, quindi alcuni avversari potrebbero essere giocatori del computer.</li>
      </ul>
    </section>`;

export default {
  nav: "Dama cinese per 4 giocatori",
  titel: "Dama cinese per 4: preparazione e consigli | Leapstone",
  beschrijving: "Come funziona la dama cinese con 4 giocatori: come è divisa la scacchiera, quali 2 punte restano vuote, chi sta di fronte a chi e dove giocare.",
  h1: "Dama cinese per 4 giocatori",
  intro: "Con 4 giocatori, ognuno di voi parte da una di quattro punte della stella, e due punte restano vuote. Il rosso sta di fronte al verde e il blu sta di fronte al giallo: il tuo obiettivo è la punta di fronte a te, piena delle pedine di quel giocatore. Ecco la preparazione, le punte vuote, la tattica e dove puoi giocarla.",
  inhoud,
};
