// Leapstone in numeri, Italiaans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Caselle e pedine</h2>
      <p>Contate sulle due scacchiere di Leapstone, nella posizione iniziale di una partita.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "La scacchiera a stella con tutte e sei le punte piene: dieci pedine per ciascuno dei sei colori, attorno a un centro vuoto.",
  tekst: "La scacchiera a stella all'inizio di una partita a sei giocatori.",
})}
      <ul class="tips">
        <li><strong>La scacchiera a stella ha ${f("sterbord_vakken")} caselle.</strong> Ogni giocatore parte con ${f("sterbord_stenen_per_speler")} pedine. Quindi una partita a due giocatori ha ${f("sterbord_stenen_2_spelers")} pedine sulla scacchiera, una a tre ne ha ${f("sterbord_stenen_3_spelers")}, a quattro ${f("sterbord_stenen_4_spelers")} e a sei ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>La scacchiera quadrata dell'Halma ha ${f("vierkant_vakken")} caselle.</strong> In una partita a due giocatori, ogni giocatore parte con ${f("vierkant_stenen_per_speler_2_spelers")} pedine, ${f("vierkant_stenen_2_spelers")} in tutto. In una partita a quattro, ognuno parte con ${f("vierkant_stenen_per_speler_4_spelers")} pedine, ${f("vierkant_stenen_4_spelers")} in tutto.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">La catena di salti più lunga: ${f("langste_sprongketen")}</h2>
      <p>Sulla scacchiera a stella, una pedina può fare <strong>${f("langste_sprongketen")} salti in una sola mossa</strong>, e con le regole di Leapstone nessuna mossa può averne di più. Per arrivare a quel numero, le altre pedine vengono messe liberamente: una su ogni casella che la pedina scavalca.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Una scacchiera a stella con una pedina rossa e molte pedine blu. Frecce bianche mostrano la pedina rossa che salta una pedina blu dopo l'altra, lungo un percorso lungo e tortuoso.",
  tekst: "La catena più lunga: la pedina rossa salta ogni pedina blu, una dopo l'altra.",
})}
      <p><strong>Come si conta.</strong> Un salto atterra sempre due caselle più in là, in linea retta. Così una pedina che continua a saltare raggiunge solo una parte delle caselle: la scacchiera si divide in quattro gruppi di questo tipo, e il più grande ha ${f("grootste_klasse_vakken")} caselle. In Leapstone una pedina non può atterrare due volte sulla stessa casella in una mossa, né sulla casella da cui è partita. Quindi una catena atterra al massimo una volta su ciascuna delle altre caselle del suo gruppo. Il programma ha esplorato quel gruppo e ha trovato un percorso che tocca tutte le ${f("grootste_klasse_vakken")} caselle, quindi nessuna catena può essere più lunga: ${f("langste_sprongketen")} salti. Poi un test gioca quella mossa con le regole di Leapstone.</p>
      <p><strong>Non è una partita vera.</strong> Questa catena richiede ${f("langste_sprongketen")} altre pedine, ognuna proprio sulla casella giusta. Una partita a due o tre giocatori ha solo ${f("sterbord_stenen_2_spelers")} o ${f("sterbord_stenen_3_spelers")} pedine, troppo poche. Una partita a quattro o sei giocatori ne ha ${f("sterbord_stenen_4_spelers")} o ${f("sterbord_stenen_6_spelers")}, che bastano. Ma in una partita vera nessuno mette le pedine liberamente, quindi non aspettarti questa catena al tavolo. Mostra ciò che la scacchiera consente, non ciò che succede giocando.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">La traversata più breve: ${f("oversteek_zetten")} mosse</h2>
      <p>Un giocatore da solo sulla scacchiera a stella, senza avversari, ha bisogno di <strong>${f("oversteek_zetten")} mosse</strong> per portare tutte le ${f("sterbord_stenen_per_speler")} pedine da una punta alla punta opposta, e non può farcela in meno. Un'intera catena di salti conta come una mossa.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Una scacchiera a stella con solo dieci pedine rosse, nella punta in basso. La punta in alto, dove devono arrivare, ha un bordo tratteggiato.",
  tekst: "Un giocatore da solo: dieci pedine nella punta in basso, e la punta in alto è la meta.",
})}
      <p><strong>Come si conta.</strong> Un test gioca una traversata di ${f("oversteek_zetten")} mosse con le regole di Leapstone, senza altre pedine sulla scacchiera. Per mostrare che ${f("geen_oversteek_in_zetten")} mosse o meno non bastano, una ricerca segue il metodo di G. I. Bell (<em>Integers</em> 9, 2009). Ogni mossa si può giocare all'indietro, e mezzo giro della scacchiera scambia la partenza con la meta. Se esistesse una traversata di ${f("geen_oversteek_in_zetten")} mosse o meno, una posizione a metà strada sarebbe al massimo a ${f("zoekdiepte_zetten")} mosse dalla partenza, e così pure la stessa posizione girata di mezzo giro. La ricerca ha passato in rassegna ogni posizione entro ${f("zoekdiepte_zetten")} mosse dalla partenza, ha contato una sola volta una posizione e la sua immagine allo specchio, ha scartato quelle che di sicuro non possono arrivare abbastanza lontano in tempo, e non ha trovato nessuna coppia del genere. È durata ${f("gemeten_rekentijd_seconden")} secondi su una macchina con ${f("gemeten_kernen")} core, e il suo passo più grande conteneva ${f("gemeten_grootste_laag_miljoen_standen")} milioni di posizioni in ${f("gemeten_geheugen_gb")} GB di memoria. Il numero è stato ricalcolato per la scacchiera di Leapstone.</p>
      <p><strong>Non è un limite minimo per una partita vera.</strong> In una partita vera ci sono anche le pedine degli altri giocatori, e le tue pedine possono saltarle. Quindi ${f("oversteek_zetten")} non è il minimo che può durare una partita vera: è dimostrato solo per un giocatore da solo.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Provalo</h2>
      <p><a href="/play/">Gioca a Leapstone nel browser</a> contro il computer, oppure scarica l'app con i pulsanti in cima a questa pagina. Per le regole, leggi <a href="/it/regole/dama-cinese">Dama cinese: le regole del gioco</a> o le <a href="/it/regole/halma">regole dell'Halma</a>. Per usare le catene di salti in partita, leggi i <a href="/it/guide/strategia-dama-cinese">consigli di strategia</a>.</p>
    </section>`;

export default {
  nav: "La dama cinese in numeri",
  titel: "La dama cinese in numeri | Leapstone",
  beschrijving: `La scacchiera a stella ha ${c.sterbord_vakken} caselle. Una mossa ha al massimo ${c.langste_sprongketen} salti, e un giocatore da solo attraversa in ${c.oversteek_zetten} mosse. Come si calcola ogni numero.`,
  h1: "La dama cinese in numeri",
  intro: `La scacchiera a stella della dama cinese ha ${f("sterbord_vakken")} caselle, e ogni giocatore parte con ${f("sterbord_stenen_per_speler")} pedine. In Leapstone una mossa non può mai avere più di ${f("langste_sprongketen")} salti. Un giocatore da solo sulla scacchiera, senza avversari, ha bisogno di ${f("oversteek_zetten")} mosse per attraversarla. Qui sotto vedi come si conta ogni numero, e che cosa dice e non dice su una partita vera.`,
  inhoud,
};
