// De gids Halma tegenover Chinese checkers in het Italiaans, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dama cinese: la scacchiera a stella, 121 caselle",
    alt: "La scacchiera a stella con 10 pedine rosse nella punta in basso e 10 pedine blu nella punta in alto",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: la scacchiera quadrata, 256 caselle",
    alt: "La scacchiera quadrata con 19 pedine rosse nell'angolo in alto a sinistra e 19 pedine blu nell'angolo in basso a destra",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Scacchiera a stella: sei caselle vicine, qui tre vuote",
    alt: "Una pedina rossa con un anello bianco intorno. Tre delle sue sei caselle vicine sono vuote e segnate; le altre tre hanno delle pedine.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Scacchiera quadrata: otto caselle vicine, qui cinque vuote",
    alt: "Una pedina rossa con un anello bianco intorno. Cinque delle sue otto caselle vicine sono vuote e segnate; le altre tre hanno delle pedine.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">La risposta breve</h2>
      <p>L'Halma si gioca su una scacchiera quadrata e la dama cinese su una scacchiera a forma di stella a sei punte. In entrambi i giochi muovi le tue pedine con passi e salti sulla scacchiera, e vince il primo giocatore che riempie il campo dall'altra parte.</p>
      <p>Cambiano la scacchiera, le direzioni in cui muovi, quante persone possono giocare e quante pedine ha ciascuna. Lo <a href="/it/regole/che-cos-e-lo-sternhalma">Sternhalma</a> è il nome dell'Halma su una scacchiera a stella, quindi è lo stesso gioco della dama cinese.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Le scacchiere</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>La dama cinese</strong> usa la scacchiera a stella: 121 caselle, con una punta di 10 caselle a ciascuna delle sei estremità. Una punta è un triangolo di file di 4, 3, 2 e 1 caselle.</li>
        <li><strong>L'Halma</strong> usa la scacchiera quadrata: 16 per 16 caselle, 256 in tutto. Un campo sta in un angolo. Un campo grande ha file di 5, 5, 4, 3 e 2 caselle, uno piccolo file di 4, 4, 3 e 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Direzioni: sei o otto</h2>
      <p>Sulla scacchiera a stella una casella ha sei caselle vicine. Su quella quadrata ne ha otto, perché contano anche le diagonali. Un passo va su una casella vicina vuota. Un salto va sopra una pedina accanto alla tua, in linea retta, sulla casella vuota subito dietro, in una qualsiasi di queste direzioni e anche all'indietro.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Una casella sul bordo ha meno caselle vicine, e un angolo della scacchiera quadrata ne ha tre. Sei direzioni formano tre linee che passano per una casella sulla scacchiera a stella. Otto direzioni formano quattro linee sulla scacchiera quadrata: in orizzontale, in verticale e due diagonali.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Giocatori e pedine</h2>
      <ul>
        <li><strong>Dama cinese:</strong> 2, 3, 4 o 6 giocatori. Ognuno ha 10 pedine, quindi la scacchiera ne contiene 20, 30, 40 o 60.</li>
        <li><strong>Halma:</strong> 2 o 4 giocatori. Con 2 giocatori ognuno ha 19 pedine, 38 in tutto. Con 4 giocatori ognuno ha 13 pedine, 52 in tutto.</li>
      </ul>
      <p>La scacchiera quadrata in Leapstone non ha partite per 3 o 6 giocatori. Per una partita in tre, leggi <a href="/it/guide/dama-cinese-in-tre">Dama cinese per 3 giocatori</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Che cosa è uguale</h2>
      <ul>
        <li><strong>Una mossa:</strong> un passo o una catena di salti con una pedina. Decidi tu dove finisce la catena, e dopo un salto non puoi fare un passo.</li>
        <li><strong>Qualsiasi colore:</strong> salti sopra una pedina di qualsiasi colore, anche la tua. La pedina che salti resta dov'è. Non si cattura nulla.</li>
        <li><strong>L'obiettivo:</strong> il campo di fronte a quello da cui sei partito. Tutte le sue caselle devono avere le tue pedine. Finché lì c'è una pedina di un altro giocatore, non puoi finire.</li>
        <li><strong>Vincere:</strong> vince il primo giocatore che riempie l'obiettivo. Con 2 giocatori la partita finisce lì. Con più giocatori gli altri continuano a giocare per i posti successivi, e un giocatore che ha finito viene saltato.</li>
        <li><strong>Abbandonare e tempo:</strong> quando abbandoni, le tue pedine lasciano la scacchiera. In una partita online ogni mossa ha un limite di tempo, e se salti 3 turni di fila abbandoni.</li>
      </ul>
      <p>Leggi le regole complete della <a href="/it/regole/dama-cinese">dama cinese</a> e dell'<a href="/it/regole/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Quale scacchiera scegliere in Leapstone</h2>
      <ul>
        <li><strong>3 o 6 giocatori:</strong> solo la scacchiera a stella le ha.</li>
        <li><strong>Più pedine ciascuno:</strong> la scacchiera quadrata, con 19 pedine ciascuno per 2 giocatori o 13 per 4, contro 10 sulla scacchiera a stella.</li>
        <li><strong>Gioca online:</strong> una partita veloce si gioca sulla scacchiera a stella. Con gli amici e contro il computer puoi scegliere l'una o l'altra scacchiera.</li>
      </ul>
      <p>Gioca ora apre una partita sulla scacchiera a stella contro il computer. Per la scacchiera quadrata, tocca la freccia indietro in alto e scegli Tavola quadrata nel menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Per continuare</h2>
      <ul>
        <li><a href="/play/">Gioca nel browser</a> e prova entrambe le scacchiere.</li>
        <li><a href="/it/guide/strategia-dama-cinese">Strategia della dama cinese</a>: sei consigli con immagini.</li>
        <li><a href="/it/guide/dama-cinese-in-due">Dama cinese in due</a>: come funziona una partita in due.</li>
      </ul>
      <p><a href="/it/guide/dama-cinese-online-con-gli-amici">Dama cinese online con gli amici</a></p>
    </section>`;

export default {
  nav: "Halma o dama cinese",
  titel: "Halma o dama cinese: le differenze | Leapstone",
  beschrijving: "Halma o dama cinese? La scacchiera quadrata e quella a stella, sei o otto direzioni, giocatori e pedine, e che cosa è uguale.",
  h1: "Halma o dama cinese",
  intro: "Due giochi con un'idea sola: porta tutte le tue pedine dall'altra parte della scacchiera. Che cosa cambia, che cosa è uguale e dove giocarli entrambi.",
  inhoud,
};
