// La pagina italiana Sternhalma (taak 134): il nome, il rapporto con l'Halma e la dama cinese. Contenuto: la pagina inglese
// ../en/sternhalma.mjs (lì ci sono anche le fonti), frase per frase in italiano. Ciò che fa Leapstone è verificato con crates/halma-core.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Cosa significa il nome</h2>
      <p>Sternhalma è il nome tedesco dell'Halma giocato su una scacchiera a forma di stella. <em>Stern</em> in tedesco significa stella. Il nome dama cinese è lo stesso gioco con un nome dato più tardi negli Stati Uniti.</p>
      <p>In Leapstone questa è la <strong>scacchiera a stella</strong>: la scacchiera delle <a href="/it/regole/dama-cinese">regole della dama cinese</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Da dove viene</h2>
      <ul>
        <li>L'<strong>Halma</strong> fu inventato nel 1883 o 1884 da George Howard Monks, un chirurgo americano. Il nome è greco e significa &laquo;salto&raquo;. Si gioca su una scacchiera quadrata. <a href="/it/regole/halma">Leggi le regole dell'Halma</a>.</li>
        <li>Lo <strong>Stern-Halma</strong> comparve in Germania nel 1892: la stessa idea su una scacchiera a forma di stella a sei punte.</li>
        <li>La <strong>dama cinese</strong> è il nome che Bill e Jack Pressman diedero al gioco negli Stati Uniti nel 1928, all'inizio come &laquo;Hop Ching checkers&raquo;. Il gioco non ha alcun legame storico con la Cina, e non è un gioco di dama.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Come differiscono i giochi</h2>
      <ul>
        <li><strong>Halma:</strong> una scacchiera quadrata di 16 per 16 caselle, per 2 o 4 giocatori. Una pedina ha otto caselle vicine, dritte e diagonali. Con 2 giocatori ognuno ha 19 pedine, con 4 giocatori 13.</li>
        <li><strong>Sternhalma e dama cinese:</strong> una scacchiera a stella di 121 caselle, per 2, 3, 4 o 6 giocatori. Una pedina ha sei caselle vicine. Tutti hanno 10 pedine.</li>
        <li><strong>Il resto è uguale:</strong> un passo su una casella vicina libera, oppure un salto sopra una pedina, con catene di salti. Vince il primo giocatore che riempie il campo dall'altra parte della scacchiera.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianti, e cosa fa Leapstone</h2>
      <p>L'Halma è stato giocato in più di un modo. Ecco come si confronta Leapstone con le varianti che abbiamo trovato nelle nostre fonti:</p>
      <ul>
        <li><strong>Dimensione della scacchiera.</strong> L'Halma si gioca anche su scacchiere da 8 per 8 e da 10 per 10. Leapstone ha solo la scacchiera da 16 per 16.</li>
        <li><strong>Uscire dall'obiettivo.</strong> Secondo una regola dell'Halma, una pedina che è entrata nel campo dell'avversario non può più uscirne. Leapstone non ha questa regola: puoi muovere di nuovo una pedina così.</li>
        <li><strong>Tre giocatori su una stella.</strong> Un vecchio Halma per tre giocatori su una scacchiera a stella è descritto con 15 pedine ciascuno. Leapstone gioca con 3 giocatori sulla scacchiera a stella con 10 pedine ciascuno.</li>
        <li><strong>I salti sono una tua scelta.</strong> Non sei mai obbligato a saltare. Scegli tu la casella in cui finisce la tua mossa.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Giocaci in Leapstone</h2>
      <p>Gioca ora apre una partita sulla scacchiera a stella contro il computer. Per la scacchiera quadrata, tocca la freccia indietro in alto e scegli la Scacchiera quadrata nel menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "La scacchiera a stella con 10 pedine rosse nella punta in basso e 10 pedine blu nella punta in alto",
  tekst: "La scacchiera a stella per 2 giocatori.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Che cos'è lo Sternhalma? Halma a stella | Leapstone",
  beschrijving: "Lo Sternhalma è il nome tedesco dell'Halma su una scacchiera a stella. Come si collega all'Halma e alla dama cinese, e come giocarlo gratis nel browser.",
  h1: "Sternhalma, Halma e dama cinese",
  intro: "Tre nomi per giochi strettamente imparentati. Cosa significa ciascuno, da dove vengono e come differiscono.",
  inhoud,
};
