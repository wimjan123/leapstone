// La página española "¿Qué es el Sternhalma?" (taak 134): el nombre y la relación con el Halma y las damas chinas.
// Contenido y fuentes: la página inglesa ../en/sternhalma.mjs (Wikipedia Halma y Chinese Checkers, véase allí), frase por frase.
// Omitido a propósito, como en inglés: quién publicó el Stern-Halma en 1892 (las fuentes se contradicen) y los años de patentes.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Qué significa el nombre</h2>
      <p>Sternhalma es el nombre alemán del Halma jugado en un tablero con forma de estrella. <em>Stern</em> significa estrella en alemán. El nombre Chinese checkers (damas chinas) es el mismo juego con un nombre que se le dio más tarde en Estados Unidos.</p>
      <p>En Leapstone esto es el <strong>tablero en estrella</strong>: el tablero de las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">De dónde viene</h2>
      <ul>
        <li>El <strong>Halma</strong> lo inventó en 1883 o 1884 George Howard Monks, un cirujano estadounidense. El nombre es griego y significa &laquo;salto&raquo;. Se juega en un tablero cuadrado. <a href="/es/reglas/halma">Lee las reglas del Halma</a>.</li>
        <li>El <strong>Stern-Halma</strong> apareció en Alemania en 1892: la misma idea en un tablero con forma de estrella de seis puntas.</li>
        <li>Las <strong>damas chinas</strong> (Chinese checkers) es el nombre que Bill y Jack Pressman dieron al juego en Estados Unidos en 1928, al principio como &laquo;Hop Ching checkers&raquo;. El juego no tiene ningún vínculo histórico con China, y no es un juego de damas.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En qué se diferencian los juegos</h2>
      <ul>
        <li><strong>Halma:</strong> un tablero cuadrado de 16 por 16 casillas, para 2 o 4 jugadores. Una ficha tiene ocho vecinas, en línea recta y en diagonal. Con 2 jugadores cada uno tiene 19 fichas, con 4 jugadores 13.</li>
        <li><strong>Sternhalma y damas chinas:</strong> un tablero en estrella de 121 casillas, para 2, 3, 4 o 6 jugadores. Una ficha tiene seis vecinas. Todos tienen 10 fichas.</li>
        <li><strong>Lo demás es igual:</strong> un paso a una vecina libre, o un salto por encima de una ficha, con cadenas de saltos. Gana el primer jugador que llena el campamento de enfrente del tablero.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variantes, y qué hace Leapstone</h2>
      <p>El Halma se ha jugado de más de una manera. Así se compara Leapstone con las variantes que hemos encontrado en nuestras fuentes:</p>
      <ul>
        <li><strong>Tamaño del tablero.</strong> El Halma también se juega en tableros de 8 por 8 y de 10 por 10. Leapstone solo tiene el tablero de 16 por 16.</li>
        <li><strong>Salir del objetivo.</strong> En una regla del Halma, una ficha que ha entrado en el campamento del oponente ya no puede salir. Leapstone no tiene esta regla: puedes volver a mover esa ficha.</li>
        <li><strong>Tres jugadores en una estrella.</strong> Se describe un Halma antiguo para tres jugadores en un tablero en estrella con 15 fichas cada uno. Leapstone juega 3 jugadores en el tablero en estrella con 10 fichas cada uno.</li>
        <li><strong>Los saltos son decisión tuya.</strong> Nunca tienes que saltar. Eliges la casilla donde termina tu jugada.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Juega en Leapstone</h2>
      <p>Juega ahora abre una partida en el tablero en estrella contra el ordenador. Para el tablero cuadrado, toca la flecha hacia atrás de arriba y elige el Tablero cuadrado en el menú.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "El tablero en estrella con 10 fichas rojas en la punta de abajo y 10 fichas azules en la punta de arriba",
  tekst: "El tablero en estrella para 2 jugadores.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "¿Qué es el Sternhalma? Halma en estrella | Leapstone",
  beschrijving: "Sternhalma es el nombre alemán del Halma en un tablero en estrella. Cómo se relaciona con el Halma y las damas chinas, y cómo jugarlo gratis online.",
  h1: "Sternhalma, Halma y damas chinas",
  intro: "Tres nombres para juegos muy emparentados. Qué significa cada uno, de dónde vienen y en qué se diferencian.",
  inhoud,
};
