// La pagina italiana delle regole della dama cinese, taak 134. Contenuto: la pagina inglese ../en/chinese-checkers.mjs
// (verificata con crates/halma-core, vedi docs/plan.md, taak 116), frase per frase in italiano.
// Ogni regola qui deve coincidere con la pagina inglese; chi cambia una regola, cambia entrambe.
// Le stesse immagini (senza lingua: solo cifre nell'SVG); i testi alt e le didascalie sono in italiano.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      direct: true,
      bestand: `setup-${n}.svg`,
      tekst: `${n} giocatori`,
      alt:
        {
          2: "La scacchiera a stella con 10 pedine rosse nella punta in basso e 10 pedine blu nella punta in alto",
          3: "La scacchiera a stella con pedine rosse in basso, blu in alto a sinistra e verdi in alto a destra",
          4: "La scacchiera a stella con pedine in quattro punte: rosse in basso, verdi in alto, blu in basso a sinistra e gialle in alto a destra",
          6: "La scacchiera a stella con pedine in tutte e sei le punte, in sei colori",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <div class="raster">
      ${opstelling}
    </div>

    <section aria-labelledby="bord">
      <h2 id="bord">La scacchiera</h2>
      <p>La dama cinese si gioca su una stella a sei punte. La scacchiera ha 121 caselle, e ogni punta ne ha 10. All'interno della scacchiera, ogni casella ha sei caselle vicine.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Come iniziano le pedine</h2>
      <p>Ogni giocatore ha 10 pedine e parte con tutte in una punta della stella. La punta di fronte alla tua è il tuo obiettivo. Le immagini in alto mostrano la partenza per ogni numero di giocatori.</p>
      <ul>
        <li><strong>2 giocatori:</strong> le due punte esattamente una di fronte all'altra.</li>
        <li><strong>3 giocatori:</strong> una punta sì e una no. I tre obiettivi iniziano vuoti.</li>
        <li><strong>4 giocatori:</strong> due coppie di punte una accanto all'altra. Ogni giocatore ha un altro giocatore di fronte.</li>
        <li><strong>6 giocatori:</strong> tutte e sei le punte.</li>
      </ul>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">I turni</h2>
      <p>Il Giocatore 1 muove per primo. Poi i turni vanno in ordine, Giocatore 2, Giocatore 3 e così via, e dopo l'ultimo giocatore tocca di nuovo al Giocatore 1. In Leapstone i colori seguono i numeri: rosso, blu, verde, giallo, viola e argento.</p>
      <p>Nel tuo turno muovi una pedina, una volta. Non si cattura nulla: le pedine restano sulla scacchiera finché il loro giocatore non abbandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un passo</h2>
      <p>Sposta una pedina su una casella vuota accanto a lei.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Una pedina rossa con un anello bianco intorno. Tre delle sue sei caselle vicine sono vuote e segnate; sulle altre tre ci sono delle pedine.",
  tekst: "La pedina rossa può fare un passo sulle tre caselle segnate. Le altre tre caselle vicine sono occupate.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salto</h2>
      <p>Salta sopra una pedina accanto alla tua, di qualsiasi colore, e atterra sulla casella vuota subito dietro, in linea retta. Puoi saltare in tutte e sei le direzioni, anche all'indietro.</p>
      <ul>
        <li>La casella su cui atterri deve essere vuota.</li>
        <li>Non puoi saltare sopra due pedine di seguito, né sopra una casella vuota.</li>
        <li>La pedina che salti resta dov'è.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Una pedina rossa salta sopra una pedina blu sulla casella vuota dietro di essa, mostrato con una freccia.",
  tekst: "La pedina rossa salta sopra la pedina blu.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una catena di salti</h2>
      <p>Dopo un salto, la stessa pedina può saltare di nuovo, tutte le volte che riesce e in qualsiasi direzione. Decidi tu dove fermarti. Tutti i salti insieme sono una mossa.</p>
      <ul>
        <li>In una mossa non puoi atterrare due volte sulla stessa casella.</li>
        <li>Una mossa è un passo, oppure uno o più salti. Dopo un salto non puoi fare un passo.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Una pedina rossa fa tre salti in una mossa, sopra una pedina blu, una verde e un'altra blu. Le tre caselle di atterraggio sono numerate 1, 2 e 3.",
  tekst: "Una mossa con tre salti, nell'ordine dei numeri.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">L'obiettivo</h2>
      <p>Vinci portando tutte e 10 le tue pedine nella punta di fronte a quella da cui sei partito. Tutte e 10 le caselle di quella punta devono contenere pedine tue. Finché c'è una pedina di un altro giocatore, non puoi finire.</p>
      <p>Puoi atterrare su qualsiasi casella vuota, anche nelle punte degli altri giocatori.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Una scacchiera a stella per tre giocatori. Il rosso parte in basso; la punta vuota in alto, segnata con cerchi tratteggiati, è l'obiettivo del rosso.",
  tekst: "Con 3 giocatori, il rosso parte in basso. L'obiettivo del rosso è la punta vuota in alto.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Con 2, 3, 4 o 6 giocatori</h2>
      <ul>
        <li><strong>2 giocatori:</strong> vince il primo che riempie l'obiettivo, e la partita finisce.</li>
        <li><strong>3, 4 o 6 giocatori:</strong> vince il primo che riempie l'obiettivo. Gli altri continuano a giocare per i posti successivi, e un giocatore che ha finito viene saltato. La partita finisce quando gioca ancora un solo giocatore.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abbandonare</h2>
      <p>Quando abbandoni, le tue pedine lasciano la scacchiera, così non bloccano nessuno. Con 2 giocatori vince l'altro giocatore. Con più giocatori la partita continua senza di te, e se tutti tranne uno abbandonano, vince l'ultimo giocatore.</p>
      <p>In una partita online ogni mossa ha un limite di tempo. Lo imposta il giocatore che avvia la partita, e in una partita veloce sono 30 secondi. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni. Le partite contro il computer e su un solo telefono non hanno limite di tempo.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consigli</h2>
      <ul class="tips">
        <li><strong>Costruisci scale.</strong> Metti le pedine in fila con una casella vuota in mezzo, rivolte verso il tuo obiettivo. Una pedina può allora saltare lungo tutta la fila in una sola mossa.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quattro pedine in una fila diagonale con una casella vuota in mezzo. Una pedina rossa a un'estremità salta sopra tutte e quattro, con quattro caselle di atterraggio numerate.",
  tekst: "Quattro pedine in fila: la pedina rossa in alto attraversa la scacchiera in una mossa, con quattro salti.",
})}
        </li>
        <li><strong>Ogni pedina è una scala.</strong> Puoi saltare sopra qualsiasi colore, quindi anche le pedine degli altri giocatori ti aiutano. E le tue scale aiutano loro: guarda cosa lasci dietro di te.</li>
        <li><strong>Non dimenticare le pedine rimaste indietro.</strong> Servono tutte e 10 le pedine a casa. Una pedina molto indietro, senza niente da saltare, avanza di una casella per turno. Portala avanti finché le altre pedine sono ancora intorno a lei.</li>
        <li><strong>La tua partenza è il loro obiettivo.</strong> Con 2, 4 o 6 giocatori, la tua punta di partenza è l'obiettivo del giocatore di fronte a te, e lui non può finire finché una tua pedina è ancora lì. Lo stesso vale per te.</li>
      </ul>
      <p>Altri consigli, con le immagini, sono nella guida alla <a href="/it/guide/strategia-dama-cinese">strategia della dama cinese</a>. Per una partita in due, leggi la <a href="/it/guide/dama-cinese-in-due">dama cinese per 2 giocatori</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Domande</h2>
      <h3>Quante persone possono giocare a dama cinese?</h3>
      <p>Due, tre, quattro o sei. Ogni giocatore parte da una punta della stella. Con 2, 3 o 4 giocatori, alcune punte restano vuote.</p>
      <h3>Quante biglie ha ogni giocatore?</h3>
      <p>Ogni giocatore ha 10 biglie, cioè pedine. La scacchiera ha 121 caselle: 10 in ciascuna delle sei punte e 61 al centro.</p>
      <h3>Si può saltare sopra le proprie pedine, o all'indietro?</h3>
      <p>Sì. Puoi saltare sopra una pedina di qualsiasi colore, anche tua, in tutte e sei le direzioni, anche all'indietro. La pedina che salti resta dov'è.</p>
      <h3>Nella dama cinese si catturano le pedine?</h3>
      <p>No. Non si cattura niente. Una pedina lascia la scacchiera solo quando il suo giocatore abbandona.</p>
      <h3>La dama cinese viene dalla Cina?</h3>
      <p>No. Il gioco nacque in Germania nel 1892 con il nome Stern-Halma, sul modello del gioco più antico Halma. Il nome Chinese checkers viene dagli Stati Uniti, nel 1928. Leggi di più nello <a href="/it/regole/che-cos-e-lo-sternhalma">Sternhalma</a>.</p>
      <h3>Dove si può giocare gratis a dama cinese online con gli amici?</h3>
      <p>In Leapstone, nel browser o nell'app dall'App Store. Invia a un amico un link d'invito: entra nella tua partita senza account, indirizzo e-mail o password. Puoi anche giocare contro il computer, o fare una partita veloce contro un altro giocatore. Leapstone è gratuito, senza pubblicità.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Giocare a dama cinese in Leapstone</h2>
      <p>Leapstone è un'app gratuita per giocare a dama cinese e Halma, con una scacchiera 3D in lacca rossa e oro. Puoi giocare nell'app e nel browser.</p>
      <ul>
        <li><strong>Contro il computer.</strong> Facile, normale o difficile. Non serve internet.</li>
        <li><strong>Con gli amici.</strong> Invia un link d'invito. Tu imposti il tempo per mossa, e potete chattare.</li>
        <li><strong>Online.</strong> Una partita veloce contro un altro giocatore del tuo livello, 30 secondi per mossa. Alcuni avversari online potrebbero essere giocatori del computer.</li>
        <li><strong>Su un solo telefono.</strong> Passatevi il telefono intorno al tavolo.</li>
      </ul>
      <p>Leapstone è gratuito, senza pubblicità e senza registrazione con un indirizzo e-mail: scegli solo un nome da giocatore. <a href="https://apps.apple.com/it/app/id6831230722">Scarica Leapstone dall'App Store</a> oppure <a href="/play/">gioca nel browser</a>.</p>
    </section>`;

export default {
  nav: "Regole della dama cinese",
  titel: "Dama cinese: regole e istruzioni | Leapstone",
  beschrijving: "Regole e istruzioni della dama cinese: partenza, passi, salti e catene, come si vince con 2, 3, 4 o 6 giocatori, e consigli. Gioca gratis.",
  h1: "Dama cinese: le regole del gioco",
  intro: "Le regole della dama cinese in breve: ogni giocatore ha 10 pedine su una scacchiera a stella di 121 caselle, a ogni turno muove una pedina con un passo o con una catena di salti, e vince chi porta per primo tutte le pedine nella punta opposta.",
  inhoud,
};
