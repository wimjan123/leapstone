// La guida italiana alla dama cinese per 2 giocatori (taak 134). Contenuto: la guida inglese ../en/chinese-checkers-2-players.mjs
// (verificata con crates/halma-core, vedi docs/plan.md, taak 122), frase per frase in italiano.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Come inizia la partita</h2>
      <p>Ogni giocatore ha 10 pedine. Partono in due punte della stella una di fronte all'altra: il rosso in basso, il blu in alto. Le 20 pedine stanno su una scacchiera di 121 caselle.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "La scacchiera a stella con 10 pedine rosse nella punta in basso e 10 pedine blu nella punta in alto",
  tekst: "Il rosso parte in basso, il blu in alto.",
})}
      <p>Il Giocatore 1, il rosso, muove per primo. Dopo, giocate a turno, una mossa ciascuno. Una mossa è un passo o una catena di salti con una pedina. Per passi e salti guarda le <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Il tuo obiettivo è la partenza dell'altro giocatore</h2>
      <p>Vinci portando tutte e 10 le tue pedine nella punta da cui è partito l'altro giocatore. Quella punta parte piena delle sue pedine, e la tua è piena delle tue. Per il rosso, è la punta in alto nell'immagine qui sopra.</p>
      <p>Puoi atterrare solo su una casella vuota, quindi ognuno di voi deve lasciare la propria punta prima che l'altro possa riempirla. Nessuno dei due può finire finché una pedina dell'altro resta nell'obiettivo. E poiché attraversate lo stesso centro in direzioni opposte, le pedine dell'altro giocatore sono appigli per te, e le tue per lui. Leggi i <a href="/it/guide/strategia-dama-cinese">consigli di strategia</a> per sapere cosa farne.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vincere e abbandonare</h2>
      <ul>
        <li><strong>Vincere:</strong> il primo giocatore che riempie l'obiettivo con tutte e 10 le pedine vince, e la partita finisce subito. L'altro giocatore non continua.</li>
        <li><strong>Abbandonare:</strong> le tue pedine lasciano la scacchiera e vince l'altro giocatore.</li>
        <li><strong>Tempo (online):</strong> in una partita online ogni mossa ha un limite di tempo. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Come differiscono 3, 4 e 6 giocatori</h2>
      <ul>
        <li><strong>3 giocatori:</strong> le pedine partono da una punta sì e una no, e i tre obiettivi partono vuoti. Vince il primo che finisce; gli altri continuano a giocare per i posti successivi, e un giocatore che ha finito viene saltato.</li>
        <li><strong>4 giocatori:</strong> due coppie di punte una accanto all'altra. Il tuo obiettivo parte pieno delle pedine di un altro giocatore. La partita continua dopo il primo che finisce, come con 3.</li>
        <li><strong>6 giocatori:</strong> tutte e sei le punte. La scacchiera contiene 60 pedine, contro 20 con 2 giocatori.</li>
      </ul>
      <p>Con solo 20 pedine sulla scacchiera ci sono meno pedine da saltare, quindi le scale che costruisci da solo contano di più. La <a href="/it/regole/dama-cinese">pagina delle regole</a> ha le immagini di ogni partenza.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dove giocare in 2 in Leapstone</h2>
      <ul>
        <li><strong>Contro il computer, subito:</strong> apri <a href="/play/">Leapstone nel browser</a>, tocca Computer e scegli la scacchiera a stella. Un computer è l'impostazione predefinita, quindi è una partita per 2. Scegli Facile, Normale o Difficile, e sei il Giocatore 1, quindi muovi per primo. Facile sceglie la migliore tra tre mosse a caso. Normale sceglie la mossa che fa più progressi verso il suo obiettivo. Difficile guarda anche come possono rispondere i suoi avversari e la sua mossa successiva.</li>
        <li><strong>Online, nell'app:</strong> una partita veloce sulla scacchiera a stella per 2 giocatori, contro un altro giocatore del tuo livello, con 30 secondi per mossa. Alcuni avversari online potrebbero essere giocatori del computer.</li>
        <li><strong>Con un amico:</strong> invia un link d'invito e imposta tu il tempo per mossa. Oppure passatevi un telefono avanti e indietro.</li>
      </ul>
      <p><a href="/it/guide/dama-cinese-online-con-gli-amici">Dama cinese online con gli amici</a></p>
      <p><a href="/it/guide/dama-cinese-in-tre">Dama cinese per 3 giocatori</a></p>
    </section>`;

export default {
  nav: "Dama cinese per 2 giocatori",
  titel: "Dama cinese per 2: preparazione e regole | Leapstone",
  beschrijving: "Come funziona la dama cinese con 2 giocatori: dove partono le 10 pedine, chi muove per primo, come si vince o si abbandona, e dove giocare gratis.",
  h1: "Dama cinese per 2 giocatori",
  intro: "Come funziona una partita in due sulla scacchiera a stella: la preparazione, chi muove per primo, come si vince e dove si può giocare.",
  inhoud,
};
