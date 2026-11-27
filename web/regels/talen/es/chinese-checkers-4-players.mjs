// La guía española Damas chinas para 4 jugadores (taak 301, feature 294): /es/guias/damas-chinas-4-jugadores.
// Contenido: la guía inglesa ../en/chinese-checkers-4-players.mjs, frase por frase (reglas de crates/halma-core, ver docs/plan.md, taak 301).
// Quien cambia una regla, la cambia en cada idioma.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cómo se reparte el tablero</h2>
      <p>Cada jugador tiene 10 fichas, así que hay 40 fichas en un tablero de 121 casillas. Las cuatro puntas de salida son dos parejas de puntas una junto a otra: el rojo abajo y el azul abajo a la izquierda, el verde arriba y el amarillo arriba a la derecha.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "El tablero en estrella con 10 fichas rojas en la punta de abajo, 10 fichas azules en la punta de abajo a la izquierda, 10 fichas verdes en la punta de arriba y 10 fichas amarillas en la punta de arriba a la derecha. Las puntas de arriba a la izquierda y de abajo a la derecha están vacías.",
  tekst: "El rojo abajo, el azul abajo a la izquierda, el verde arriba, el amarillo arriba a la derecha.",
})}
      <p>El jugador 1, el rojo, mueve primero. Después el azul es el jugador 2, el verde es el jugador 3, el amarillo es el jugador 4, y después del amarillo vuelve a ser el rojo. Una jugada es un paso o una cadena de saltos con una ficha. Mira las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> para los pasos y los saltos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Quién se enfrenta a quién</h2>
      <p>Las puntas se emparejan a través del tablero: el rojo se enfrenta al verde, y el azul al amarillo. Tu objetivo es la punta que tienes enfrente. El rojo va a donde empieza el verde, el verde a donde empieza el rojo, el azul a donde empieza el amarillo y el amarillo a donde empieza el azul.</p>
      <p>Como en una partida de 2, cada objetivo empieza lleno de las fichas del jugador que tienes enfrente, así que solo puedes caer en él cuando las hayan dejado. Con 3 jugadores los objetivos empiezan vacíos, así que con 4 nadie puede terminar de inmediato. Los cuatro objetivos son cuatro puntas distintas, así que nadie más quiere tu objetivo: un jugador que ha terminado nunca bloquea a nadie.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Las dos puntas vacías</h2>
      <p>Las puntas de arriba a la izquierda y de abajo a la derecha no tienen fichas. No son la salida ni el objetivo de nadie. La de arriba a la izquierda queda entre el azul y el verde, y la de abajo a la derecha entre el amarillo y el rojo.</p>
      <p>Puedes dar un paso o un salto a cualquier casilla vacía, así que puedes cruzar estas puntas o parar en ellas. Pero una ficha allí todavía no está en un objetivo. En una punta vacía no hay nada que saltar hasta que alguien lleva fichas allí.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Qué cambia en tu táctica</h2>
      <ul>
        <li><strong>Dos cruces a la vez:</strong> el rojo y el verde cruzan el tablero uno hacia el otro, y el azul y el amarillo también. Las dos líneas pasan por el centro, así que el centro está más concurrido que en una partida de 2, donde solo cruza una línea.</li>
        <li><strong>Tres jugadores mueven entre tus turnos:</strong> el tablero cambia más entre dos jugadas tuyas que en una partida de 2. Míralo de nuevo al empezar cada turno y planea entonces tu cadena de saltos. El jugador que mueve después de ti nunca es el que tienes enfrente.</li>
        <li><strong>Las fichas ayudan a todos:</strong> cada ficha de los otros tres es un peldaño para ti, y las tuyas lo son para ellos. Las fichas del jugador que tienes enfrente se mueven en sentido contrario, como en una partida de 2.</li>
        <li><strong>Espacio para rodear:</strong> si el centro está lleno, las puntas vacías son espacio abierto junto a las puntas de salida. Una ruta por una de ellas puede ser una forma de rodear la multitud.</li>
        <li><strong>Un jugador que abandona libera tu objetivo:</strong> cuando el jugador que tienes enfrente abandona, sus fichas salen del tablero, así que tu objetivo queda vacío en el acto.</li>
      </ul>
      <p>Los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a> sobre escaleras, fichas rezagadas y llenar el objetivo desde atrás son los mismos con 4 jugadores.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Ganar, y qué pasa después</h2>
      <ul>
        <li><strong>Ganar:</strong> gana el primer jugador que llena el objetivo con las 10 fichas. La partida no termina ahí: los otros tres siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta. Las fichas de ese jugador se quedan en el tablero. La partida termina cuando solo queda un jugador jugando.</li>
        <li><strong>Abandonar:</strong> tus fichas salen del tablero y los otros tres siguen. Si los demás también abandonan, gana el último jugador que queda.</li>
        <li><strong>Tiempo (en línea):</strong> en una partida en línea cada jugada tiene un tiempo límite. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas, y la partida sigue sin ti.</li>
      </ul>
      <p>Para las partidas con menos jugadores, lee <a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>. La <a href="/es/reglas/damas-chinas">página de reglas</a> tiene dibujos de cada inicio.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dónde jugar con 4 jugadores en Leapstone</h2>
      <ul>
        <li><strong>Contra el ordenador, ahora mismo:</strong> abre <a href="/play/">Leapstone en el navegador</a>, toca Ordenador, elige el tablero en estrella y 3 ordenadores. Eres el jugador 1, así que mueves primero. Eliges Fácil, Normal o Difícil para los ordenadores.</li>
        <li><strong>En un solo móvil:</strong> toca Jugar, elige el tablero en estrella y 4 jugadores, y luego toca una ficha para cambiar ese puesto entre una persona y un ordenador.</li>
        <li><strong>En línea con amigos:</strong> toca Amigos, elige el tablero en estrella, 4 jugadores y el tiempo por jugada, y envía el enlace de invitación. La partida empieza cuando están ocupados los 4 puestos.</li>
        <li><strong>Partida rápida, en la aplicación:</strong> toca Jugar en línea. Mientras busca una partida de 2, toca Buscar 4 o 6 jugadores para buscar una de 4. Cada jugada tiene 30 segundos. Si no se unen suficientes jugadores en 20 segundos, jugadores del ordenador llenan los puestos vacíos, así que algunos oponentes pueden ser jugadores del ordenador.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinas para 4 jugadores",
  titel: "Damas chinas para 4 jugadores: inicio y trucos | Leapstone",
  beschrijving: "Cómo funcionan las damas chinas con 4 jugadores: cómo se reparte el tablero, qué 2 puntas quedan vacías, quién se enfrenta a quién y dónde jugar.",
  h1: "Damas chinas para 4 jugadores",
  intro: "Con 4 jugadores, cada uno empieza en una de las cuatro puntas de la estrella, y dos puntas quedan vacías. El rojo se enfrenta al verde y el azul al amarillo: tu objetivo es la punta que tienes enfrente, llena de las fichas de ese jugador. Aquí tienes el inicio, las puntas vacías, la táctica y dónde puedes jugar.",
  inhoud,
};
