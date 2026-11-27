// La guida italiana alla dama cinese per 3 giocatori (taak 299). Contenuto: la guida inglese ../en/chinese-checkers-3-players.mjs
// (verificata con crates/halma-core, vedi docs/plan.md, taak 139), frase per frase in italiano.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Come inizia la partita</h2>
      <p>Ogni giocatore ha 10 pedine, quindi 30 pedine stanno su una scacchiera di 121 caselle. Partono da una punta della stella sì e una no: il rosso in basso, il blu in alto a sinistra e il verde in alto a destra. Le tre punte in mezzo sono vuote.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "La scacchiera a stella con 10 pedine rosse nella punta in basso, 10 pedine blu nella punta in alto a sinistra e 10 pedine verdi nella punta in alto a destra",
  tekst: "Il rosso in basso, il blu in alto a sinistra, il verde in alto a destra.",
})}
      <p>Il Giocatore 1, il rosso, muove per primo. Poi il blu è il Giocatore 2, il verde è il Giocatore 3, e dopo il verde tocca di nuovo al rosso. Una mossa è un passo o una catena di salti con una pedina. Per passi e salti guarda le <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tre obiettivi, tutti vuoti all'inizio</h2>
      <p>Il tuo obiettivo è la punta di fronte a quella da cui sei partito, e con 3 giocatori parte vuota. È la punta vuota tra le partenze degli altri due giocatori: l'obiettivo del rosso è in alto, quello del blu in basso a destra e quello del verde in basso a sinistra.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "La scacchiera a stella per tre giocatori. Cerchi tratteggiati del colore di ogni giocatore segnano i tre obiettivi vuoti: rosso in alto, blu in basso a destra, verde in basso a sinistra.",
  tekst: "Ogni obiettivo ha il colore del suo giocatore.",
})}
      <p>Vinci portando tutte e 10 le tue pedine nel tuo obiettivo. Tutte e 10 le caselle devono contenere pedine tue. Nessuno parte nel tuo obiettivo, ma puoi fermarti su qualsiasi casella vuota, quindi una pedina di un altro giocatore può atterrarci più tardi. Finché resta lì, non puoi finire.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vincere, e cosa succede dopo</h2>
      <ul>
        <li><strong>Vincere:</strong> il primo giocatore che riempie l'obiettivo vince. La partita non finisce lì: gli altri due continuano a giocare per i posti successivi, e il giocatore che ha finito viene saltato. La partita finisce quando gioca ancora un solo giocatore.</li>
        <li><strong>Abbandonare:</strong> le tue pedine lasciano la scacchiera e gli altri due continuano. Se un secondo giocatore abbandona prima che qualcuno abbia finito, vince l'ultimo giocatore rimasto.</li>
        <li><strong>Tempo (online):</strong> in una partita online ogni mossa ha un limite di tempo, scelto dal giocatore che avvia la partita. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni, e la partita va avanti senza di te.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Come differisce da una partita in 2</h2>
      <ul>
        <li><strong>Più pedine:</strong> 30 sulla scacchiera, contro 20 con 2 giocatori.</li>
        <li><strong>Obiettivi vuoti:</strong> con 2 giocatori il tuo obiettivo parte pieno delle pedine dell'altro giocatore. Con 3 parte vuoto.</li>
        <li><strong>Due avversari:</strong> dopo la tua mossa, giocano due altri giocatori prima che tocchi di nuovo a te. Le pedine di entrambi sono appigli per te, e le tue per loro. Una scala che costruisci può essere usata da entrambi, e il giocatore dopo di te ha la prima occasione.</li>
        <li><strong>La partita continua:</strong> con 2 giocatori la partita finisce quando uno di voi ha finito. Con 3 continua per il secondo e il terzo posto.</li>
      </ul>
      <p>Per la partita in due, leggi la <a href="/it/guide/dama-cinese-in-due">dama cinese per 2 giocatori</a>. I <a href="/it/guide/strategia-dama-cinese">consigli di strategia</a> riguardano passi e salti, che sono gli stessi con 3 giocatori.</p>
      <p><a href="/it/guide/dama-cinese-online-con-gli-amici">Dama cinese online con gli amici</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dove giocare in 3 in Leapstone</h2>
      <ul>
        <li><strong>Contro il computer, subito:</strong> apri <a href="/play/">Leapstone nel browser</a>, tocca Computer, scegli la scacchiera a stella e 2 computer. Sei il Giocatore 1, quindi muovi per primo. Scegli Facile, Normale o Difficile per i computer.</li>
        <li><strong>Su un solo telefono:</strong> tocca «Su questo telefono», scegli la scacchiera a stella e 3 giocatori, poi tocca una pedina per cambiare quel posto tra una persona e un computer.</li>
        <li><strong>Online con gli amici:</strong> tocca Amici, scegli la scacchiera a stella, 3 giocatori e il tempo per mossa, e invia il link d'invito. La partita inizia quando tutti e 3 i posti sono occupati.</li>
        <li><strong>Partite veloci:</strong> Gioca online trova partite per 2 o 4 giocatori, quindi non c'è una partita veloce per 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Dama cinese per 3 giocatori",
  titel: "Dama cinese per 3: preparazione e regole | Leapstone",
  beschrijving: "Come funziona la dama cinese con 3 giocatori: dove partono le 30 pedine, quale punta vuota è l'obiettivo di ognuno, chi muove per primo.",
  h1: "Dama cinese per 3 giocatori",
  intro: "Come funziona una partita in tre sulla scacchiera a stella: la preparazione, i tre obiettivi, chi muove per primo, come si vince e dove si può giocare.",
  inhoud,
};
