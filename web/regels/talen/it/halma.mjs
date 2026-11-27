// La pagina italiana delle regole dell'Halma, taak 134. Contenuto: la pagina inglese ../en/halma.mjs (verificata con crates/halma-core,
// vedi docs/plan.md, taak 117), frase per frase in italiano. Chi cambia una regola, cambia entrambe.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 giocatori: 19 pedine ciascuno",
    alt: "La scacchiera quadrata con 19 pedine rosse nell'angolo in alto a sinistra e 19 pedine blu nell'angolo in basso a destra",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 giocatori: 13 pedine ciascuno",
    alt: "La scacchiera quadrata con 13 pedine in ciascuno dei quattro angoli: rosse in alto a sinistra, blu in alto a destra, verdi in basso a destra e gialle in basso a sinistra",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">La scacchiera</h2>
      <p>L'Halma si gioca su una scacchiera quadrata di 16 per 16 caselle, 256 in tutto. Ogni casella ha fino a otto caselle vicine: le quattro dritte e le quattro diagonali. Una casella sul bordo ne ha meno, e un angolo ne ha tre.</p>
      <p>Questa è la scacchiera quadrata di Leapstone. Se conosci il gioco sulla scacchiera a stella, leggi lo <a href="/it/regole/che-cos-e-lo-sternhalma">Sternhalma</a> e le <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Come iniziano le pedine</h2>
      <p>L'Halma è per 2 o 4 giocatori. Ogni giocatore parte con le pedine in un campo in un angolo della scacchiera. Il campo nell'angolo opposto è il tuo obiettivo.</p>
      <ul>
        <li><strong>2 giocatori:</strong> 19 pedine ciascuno, in due angoli uno di fronte all'altro. Il campo è fatto di cinque file di 5, 5, 4, 3 e 2 caselle.</li>
        <li><strong>4 giocatori:</strong> 13 pedine ciascuno, un campo in ogni angolo. Il campo è fatto di quattro file di 4, 4, 3 e 2 caselle. Il tuo obiettivo è l'angolo dall'altra parte della scacchiera, in diagonale.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">I turni</h2>
      <p>Il Giocatore 1 muove per primo. Poi i turni vanno in ordine, e dopo l'ultimo giocatore tocca di nuovo al Giocatore 1. In Leapstone i colori seguono i numeri: rosso, blu, verde e giallo.</p>
      <p>Nel tuo turno muovi una pedina, una volta. Non si cattura nulla: le pedine restano sulla scacchiera finché il loro giocatore non abbandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un passo</h2>
      <p>Sposta una pedina su una casella vuota accanto a lei, in una qualsiasi delle otto direzioni: dritta o diagonale.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Una pedina rossa con un anello bianco intorno. Cinque delle sue otto caselle vicine sono vuote e segnate; sulle altre tre ci sono delle pedine.",
  tekst: "La pedina rossa può fare un passo sulle cinque caselle segnate. Le altre tre caselle vicine sono occupate.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salto</h2>
      <p>Salta sopra una pedina accanto alla tua, di qualsiasi colore, e atterra sulla casella vuota subito dietro, in linea retta. Puoi saltare in tutte e otto le direzioni, anche in diagonale e all'indietro.</p>
      <ul>
        <li>La casella su cui atterri deve essere vuota.</li>
        <li>Non puoi saltare sopra due pedine di seguito, né sopra una casella vuota.</li>
        <li>La pedina che salti resta dov'è.</li>
        <li>Non puoi saltare oltre il bordo della scacchiera.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Una pedina rossa salta in diagonale sopra una pedina blu sulla casella vuota dietro di essa, mostrato con una freccia.",
  tekst: "La pedina rossa salta in diagonale sopra la pedina blu.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una catena di salti</h2>
      <p>Dopo un salto, la stessa pedina può saltare di nuovo, tutte le volte che riesce, in qualsiasi direzione, dritta o diagonale. Decidi tu dove fermarti. Tutti i salti insieme sono una mossa.</p>
      <ul>
        <li>In una mossa non puoi atterrare due volte sulla stessa casella.</li>
        <li>Una mossa è un passo, oppure uno o più salti. Dopo un salto non puoi fare un passo.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Una pedina rossa fa tre salti in una mossa: in diagonale sopra una pedina blu, in linea retta sopra un'altra pedina blu, e in diagonale sopra una pedina rossa. Le tre caselle di atterraggio sono numerate 1, 2 e 3.",
  tekst: "Una mossa con tre salti, nell'ordine dei numeri.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">L'obiettivo</h2>
      <p>Vinci portando tutte le tue pedine nel campo di fronte a quello da cui sei partito. Ogni casella di quel campo deve contenere pedine tue: 19 con 2 giocatori, 13 con 4 giocatori. Finché c'è una pedina di un altro giocatore, non puoi finire.</p>
      <p>Puoi atterrare su qualsiasi casella vuota, anche nei campi degli altri giocatori. Una pedina che è nel tuo obiettivo può uscirne di nuovo; niente la blocca.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "La scacchiera quadrata per due giocatori. Il rosso parte in alto a sinistra; il campo in basso a destra, segnato con cerchi tratteggiati e con delle pedine blu, è l'obiettivo del rosso.",
  tekst: "Con 2 giocatori, l'obiettivo del rosso è il campo da cui parte il blu.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Con 2 o 4 giocatori</h2>
      <ul>
        <li><strong>2 giocatori:</strong> vince il primo che riempie l'obiettivo, e la partita finisce.</li>
        <li><strong>4 giocatori:</strong> vince il primo che riempie l'obiettivo. Gli altri continuano a giocare per i posti successivi, e un giocatore che ha finito viene saltato. La partita finisce quando gioca ancora un solo giocatore.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abbandonare</h2>
      <p>Quando abbandoni, le tue pedine lasciano la scacchiera, così non bloccano nessuno. Con 2 giocatori vince l'altro giocatore. Con 4 giocatori la partita continua senza di te, e se tutti tranne uno abbandonano, vince l'ultimo giocatore.</p>
      <p>In una partita online ogni mossa ha un limite di tempo. Lo imposta il giocatore che avvia la partita. Quando il tuo tempo scade, il tuo turno viene saltato. Se salti 3 turni di fila, abbandoni. Le partite contro il computer e su un solo telefono non hanno limite di tempo.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consigli</h2>
      <ul class="tips">
        <li><strong>Costruisci scale.</strong> Metti le pedine in fila con una casella vuota in mezzo, dritta o diagonale, rivolte verso il tuo obiettivo. Una pedina può allora saltare lungo tutta la fila in una sola mossa.</li>
        <li><strong>Ogni pedina è una scala.</strong> Puoi saltare sopra qualsiasi colore, quindi anche le pedine degli altri giocatori ti aiutano. E le tue scale aiutano loro: guarda cosa lasci dietro di te.</li>
        <li><strong>Usa le diagonali.</strong> L'obiettivo è nell'angolo opposto, quindi una fila diagonale di pedine è la via più veloce per attraversare.</li>
        <li><strong>Non dimenticare le pedine rimaste indietro.</strong> Servono tutte le tue pedine a casa. Una pedina molto indietro, senza niente da saltare, avanza di una casella per turno. Portala avanti finché le altre pedine sono ancora intorno a lei.</li>
        <li><strong>La tua partenza è il loro obiettivo.</strong> Con 2 giocatori, il tuo campo è l'obiettivo dell'altro giocatore, e lui non può finire finché una tua pedina è ancora lì. Leapstone ti lascia tenere una pedina a casa, quindi puoi bloccare in questo modo. Lo stesso vale per te.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Domande</h2>
      <h3>Quante persone possono giocare a Halma?</h3>
      <p>Due o quattro. L'Halma si gioca su una scacchiera quadrata di 16 per 16 caselle, e ogni giocatore parte da un angolo.</p>
      <h3>Quante pedine ha ogni giocatore a Halma?</h3>
      <p>19 pedine ciascuno con 2 giocatori, e 13 pedine ciascuno con 4 giocatori.</p>
      <h3>Chi ha inventato l'Halma?</h3>
      <p>George Howard Monks, un chirurgo americano, nel 1883 o 1884. Il nome è greco e significa &laquo;salto&raquo;. Leggi di più nello <a href="/it/regole/che-cos-e-lo-sternhalma">Sternhalma</a>.</p>
      <h3>Qual è la differenza tra Halma e dama cinese?</h3>
      <p>L'Halma usa una scacchiera quadrata, con passi e salti in otto direzioni e 19 o 13 pedine ciascuno. La dama cinese usa una scacchiera a stella, con sei direzioni e 10 pedine ciascuno, per 2, 3, 4 o 6 giocatori.</p>
      <h3>Si può giocare a Halma online gratis?</h3>
      <p>Sì, in Leapstone, nel browser o nell'app dall'App Store. Scegli un modo di giocare, per esempio contro il computer o online con gli amici, e poi la Scacchiera quadrata. Leapstone è gratuito, senza pubblicità.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Giocaci</h2>
      <p>Il pulsante Gioca ora apre una partita contro il computer sulla <a href="/it/regole/dama-cinese">scacchiera a stella</a>. Per giocare a Halma, tocca la freccia indietro in alto, poi scegli Gioca su questo telefono, Gioca contro il computer o Gioca online con gli amici, e tocca la Scacchiera quadrata.</p>
    </section>`;

export default {
  nav: "Regole dell'Halma",
  titel: "Halma: regole e consigli | Leapstone",
  beschrijving: "Come si gioca a Halma sulla scacchiera quadrata di 16 per 16: partenza, passi, salti, catene di salti, come si vince e consigli. Gioca gratis nel browser.",
  h1: "Halma: le regole del gioco",
  intro: "Porta tutte le tue pedine dall'altra parte della scacchiera quadrata, nell'angolo opposto, prima di chiunque altro. Le regole in breve, con le immagini, e qualche consiglio.",
  inhoud,
};
