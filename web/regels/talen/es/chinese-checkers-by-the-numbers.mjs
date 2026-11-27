// Leapstone en cifras, Spaans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Casillas y fichas</h2>
      <p>Contadas en los dos tableros de Leapstone, en la posición inicial de una partida.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "El tablero en estrella con las seis puntas llenas: diez fichas de cada uno de seis colores, alrededor de un centro vacío.",
  tekst: "El tablero en estrella al empezar una partida de seis jugadores.",
})}
      <ul class="tips">
        <li><strong>El tablero en estrella tiene ${f("sterbord_vakken")} casillas.</strong> Cada jugador empieza con ${f("sterbord_stenen_per_speler")} fichas. Así, una partida de dos jugadores tiene ${f("sterbord_stenen_2_spelers")} fichas en el tablero, una de tres tiene ${f("sterbord_stenen_3_spelers")}, una de cuatro ${f("sterbord_stenen_4_spelers")} y una de seis ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>El tablero cuadrado del Halma tiene ${f("vierkant_vakken")} casillas.</strong> En una partida de dos jugadores, cada jugador empieza con ${f("vierkant_stenen_per_speler_2_spelers")} fichas, ${f("vierkant_stenen_2_spelers")} en total. En una partida de cuatro, cada uno empieza con ${f("vierkant_stenen_per_speler_4_spelers")} fichas, ${f("vierkant_stenen_4_spelers")} en total.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">La cadena de saltos más larga: ${f("langste_sprongketen")}</h2>
      <p>En el tablero en estrella, una ficha puede hacer <strong>${f("langste_sprongketen")} saltos en un solo movimiento</strong>, y según las reglas de Leapstone ningún movimiento puede tener más. Para llegar a ese número, las demás fichas se colocan libremente: una en cada casilla por encima de la que salta la ficha.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Un tablero en estrella con una ficha roja y muchas fichas azules. Unas flechas blancas muestran la ficha roja saltando sobre una ficha azul tras otra, por un camino largo y sinuoso.",
  tekst: "La cadena más larga: la ficha roja salta sobre cada ficha azul, una tras otra.",
})}
      <p><strong>Cómo se cuenta.</strong> Un salto siempre cae dos casillas más allá, en línea recta. Por eso una ficha que sigue saltando solo llega a una parte de las casillas: el tablero se divide en cuatro grupos así, y el mayor tiene ${f("grootste_klasse_vakken")} casillas. En Leapstone, una ficha no puede caer dos veces en la misma casilla en un movimiento, ni en la casilla de la que salió. Así que una cadena cae como mucho una vez en cada una de las otras casillas de su grupo. El programa buscó en ese grupo y encontró un camino que pasa por las ${f("grootste_klasse_vakken")} casillas, así que ninguna cadena puede ser más larga: ${f("langste_sprongketen")} saltos. Después, una prueba juega ese movimiento con las reglas de Leapstone.</p>
      <p><strong>No es una partida real.</strong> Esta cadena necesita ${f("langste_sprongketen")} fichas más, cada una justo en la casilla correcta. Una partida de dos o tres jugadores tiene solo ${f("sterbord_stenen_2_spelers")} o ${f("sterbord_stenen_3_spelers")} fichas, que son muy pocas. Una partida de cuatro o seis jugadores tiene ${f("sterbord_stenen_4_spelers")} o ${f("sterbord_stenen_6_spelers")}, que bastan. Pero en una partida real nadie coloca las fichas libremente, así que no esperes ver esta cadena en la mesa. Muestra lo que el tablero permite, no lo que pasa al jugar.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">La travesía más corta: ${f("oversteek_zetten")} movimientos</h2>
      <p>Un jugador solo en el tablero en estrella, sin rivales, necesita <strong>${f("oversteek_zetten")} movimientos</strong> para llevar sus ${f("sterbord_stenen_per_speler")} fichas de una punta a la punta contraria, y no puede hacerlo en menos. Una cadena de saltos entera cuenta como un movimiento.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Un tablero en estrella con solo diez fichas rojas, en la punta de abajo. La punta de arriba, adonde tienen que ir, tiene un borde punteado.",
  tekst: "Un jugador solo: diez fichas en la punta de abajo, y la punta de arriba es la meta.",
})}
      <p><strong>Cómo se cuenta.</strong> Una prueba juega una travesía de ${f("oversteek_zetten")} movimientos con las reglas de Leapstone, sin otras fichas en el tablero. Para mostrar que con ${f("geen_oversteek_in_zetten")} movimientos o menos no se puede, una búsqueda sigue el método de G. I. Bell (<em>Integers</em> 9, 2009). Cada movimiento se puede jugar hacia atrás, y girar el tablero media vuelta intercambia la salida y la meta. Si existiera una travesía de ${f("geen_oversteek_in_zetten")} movimientos o menos, alguna posición a mitad de camino estaría como mucho a ${f("zoekdiepte_zetten")} movimientos de la salida, y la misma posición girada media vuelta también. La búsqueda recorrió todas las posiciones a ${f("zoekdiepte_zetten")} movimientos o menos de la salida, contó una sola vez cada posición y su imagen en el espejo, dejó fuera las que de forma demostrable no pueden llegar lo bastante lejos a tiempo, y no encontró ningún par así. Funcionó ${f("gemeten_rekentijd_seconden")} segundos en una máquina con ${f("gemeten_kernen")} núcleos, y su paso más grande tuvo ${f("gemeten_grootste_laag_miljoen_standen")} millones de posiciones en ${f("gemeten_geheugen_gb")} GB de memoria. El número se volvió a calcular para el propio tablero de Leapstone.</p>
      <p><strong>No es un mínimo para una partida real.</strong> En una partida real, las fichas de los demás jugadores también están en el tablero, y tus fichas pueden saltar sobre ellas. Así que ${f("oversteek_zetten")} no es lo mínimo que puede durar una partida real: solo está demostrado para un jugador solo.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Pruébalo</h2>
      <p><a href="/play/">Juega a Leapstone en tu navegador</a> contra el ordenador, o descarga la app con los botones de arriba de esta página. Para las reglas, lee las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> o las <a href="/es/reglas/halma">reglas del Halma</a>. Para saber cómo usar las cadenas de saltos en una partida, lee los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a>.</p>
    </section>`;

export default {
  nav: "Las damas chinas en cifras",
  titel: "Las damas chinas en cifras | Leapstone",
  beschrijving: `El tablero en estrella tiene ${c.sterbord_vakken} casillas. Un movimiento tiene como mucho ${c.langste_sprongketen} saltos, y un jugador solo cruza en ${c.oversteek_zetten} movimientos. Así se calcula cada número.`,
  h1: "Las damas chinas en cifras",
  intro: `El tablero en estrella de las damas chinas tiene ${f("sterbord_vakken")} casillas, y cada jugador empieza con ${f("sterbord_stenen_per_speler")} fichas. En Leapstone, un movimiento nunca puede tener más de ${f("langste_sprongketen")} saltos. Un jugador solo en el tablero, sin rivales, necesita ${f("oversteek_zetten")} movimientos para cruzarlo. Abajo puedes ver cómo se cuenta cada número, y qué dice y qué no dice sobre una partida real.`,
  inhoud,
};
