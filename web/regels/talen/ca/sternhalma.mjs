// La pàgina catalana "Què és el Sternhalma?" (taak 134): el nom i la relació amb el Halma i les dames xineses.
// Contingut i fonts: la pàgina anglesa ../en/sternhalma.mjs (Wikipedia Halma i Chinese Checkers, vegeu allà), frase per frase.
// Ometut a propòsit, com en anglès: qui va publicar el Stern-Halma el 1892 (les fonts es contradiuen) i els anys de patents.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Què vol dir el nom</h2>
      <p>Sternhalma és el nom alemany del Halma jugat en un tauler en forma d'estrella. <em>Stern</em> vol dir estrella en alemany. El nom Chinese checkers (dames xineses) és el mateix joc sota un nom que es va donar més tard als Estats Units.</p>
      <p>A Leapstone això és el <strong>tauler en estrella</strong>: el tauler de les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">D'on ve</h2>
      <ul>
        <li>El <strong>Halma</strong> el va inventar el 1883 o el 1884 George Howard Monks, un cirurgià nord-americà. El nom és grec i vol dir &laquo;salt&raquo;. Es juga en un tauler quadrat. <a href="/ca/regles/halma">Llegeix les regles del Halma</a>.</li>
        <li>El <strong>Stern-Halma</strong> va aparèixer a Alemanya el 1892: la mateixa idea en un tauler amb forma d'estrella de sis puntes.</li>
        <li>Les <strong>dames xineses</strong> (Chinese checkers) és el nom que Bill i Jack Pressman van donar al joc als Estats Units el 1928, al principi com a &laquo;Hop Ching checkers&raquo;. El joc no té cap vincle històric amb la Xina, i no és un joc de dames.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En què es diferencien els jocs</h2>
      <ul>
        <li><strong>Halma:</strong> un tauler quadrat de 16 per 16 caselles, per a 2 o 4 jugadors. Una fitxa té vuit veïnes, en línia recta i en diagonal. Amb 2 jugadors cadascun té 19 fitxes, amb 4 jugadors 13.</li>
        <li><strong>Sternhalma i dames xineses:</strong> un tauler en estrella de 121 caselles, per a 2, 3, 4 o 6 jugadors. Una fitxa té sis veïnes. Tothom té 10 fitxes.</li>
        <li><strong>La resta és igual:</strong> un pas a una veïna lliure, o un salt per sobre d'una fitxa, amb cadenes de salts. Guanya el primer jugador que omple el camp del davant del tauler.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variants, i què fa Leapstone</h2>
      <p>El Halma s'ha jugat de més d'una manera. Així es compara Leapstone amb les variants que hem trobat a les nostres fonts:</p>
      <ul>
        <li><strong>Mida del tauler.</strong> El Halma també es juga en taulers de 8 per 8 i de 10 per 10. Leapstone només té el tauler de 16 per 16.</li>
        <li><strong>Sortir de l'objectiu.</strong> En una regla del Halma, una fitxa que ha entrat al camp de l'oponent ja no en pot sortir. Leapstone no té aquesta regla: pots tornar a moure aquesta fitxa.</li>
        <li><strong>Tres jugadors en una estrella.</strong> Es descriu un Halma antic per a tres jugadors en un tauler en estrella amb 15 fitxes cadascun. Leapstone juga 3 jugadors al tauler en estrella amb 10 fitxes cadascun.</li>
        <li><strong>Els salts són decisió teva.</strong> Mai no has de saltar. Tries la casella on acaba la teva jugada.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Juga-hi a Leapstone</h2>
      <p>Juga ara obre una partida al tauler en estrella contra l'ordinador. Per al tauler quadrat, toca la fletxa enrere de dalt i tria el Tauler quadrat al menú.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "El tauler en estrella amb 10 fitxes vermelles a la punta de baix i 10 fitxes blaves a la punta de dalt",
  tekst: "El tauler en estrella per a 2 jugadors.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Què és el Sternhalma? Halma en estrella | Leapstone",
  beschrijving: "Sternhalma és el nom alemany del Halma en un tauler en estrella. Com es relaciona amb el Halma i les dames xineses, i com jugar-hi gratis al navegador.",
  h1: "Sternhalma, Halma i dames xineses",
  intro: "Tres noms per a jocs molt emparentats. Què vol dir cadascun, d'on vénen i en què es diferencien.",
  inhoud,
};
