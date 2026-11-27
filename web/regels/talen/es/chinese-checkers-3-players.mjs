// La guía en español Damas chinas para 3 jugadores (taak 299): /es/guias/damas-chinas-3-jugadores.
// Contenido: la guía inglesa ../en/chinese-checkers-3-players.mjs (taak 139, reglas de crates/halma-core), frase por frase.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cómo empieza la partida</h2>
      <p>Cada jugador tiene 10 fichas, así que hay 30 fichas en un tablero de 121 casillas. Empiezan en una punta sí y otra no de la estrella: el rojo abajo, el azul arriba a la izquierda y el verde arriba a la derecha. Las tres puntas intermedias están vacías.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "El tablero en estrella con 10 fichas rojas en la punta inferior, 10 fichas azules en la punta superior izquierda y 10 fichas verdes en la punta superior derecha",
  tekst: "El rojo abajo, el azul arriba a la izquierda, el verde arriba a la derecha.",
})}
      <p>El jugador 1, el rojo, mueve primero. Después el azul es el jugador 2, el verde es el jugador 3, y tras el verde vuelve a ser el rojo. Una jugada es un paso o una cadena de saltos con una ficha. Mira las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> para los pasos y los saltos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tres objetivos, todos vacíos al principio</h2>
      <p>Tu objetivo es la punta opuesta a donde empezaste, y con 3 jugadores empieza vacía. Es la punta vacía entre los inicios de los otros dos jugadores: el objetivo del rojo está arriba, el del azul abajo a la derecha y el del verde abajo a la izquierda.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "El tablero en estrella para tres jugadores. Círculos de trazos con el color de cada jugador marcan los tres objetivos vacíos: el rojo arriba, el azul abajo a la derecha, el verde abajo a la izquierda.",
  tekst: "Cada objetivo tiene el color de su jugador.",
})}
      <p>Ganas si llevas las 10 fichas a tu objetivo. Las 10 casillas deben tener fichas tuyas. Nadie empieza en tu objetivo, pero puedes detenerte en cualquier casilla vacía, así que una ficha de otro jugador puede caer allí más tarde. Mientras esté ahí, no puedes terminar.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Ganar, y qué pasa después</h2>
      <ul>
        <li><strong>Ganar:</strong> gana el primer jugador que llena el objetivo. La partida no se acaba ahí: los otros dos siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta. La partida termina cuando solo queda un jugador jugando.</li>
        <li><strong>Abandonar:</strong> tus fichas salen del tablero y los otros dos siguen jugando. Si un segundo jugador abandona antes de que alguien haya terminado, gana el último jugador que queda.</li>
        <li><strong>Tiempo (en línea):</strong> en una partida en línea cada jugada tiene un límite de tiempo, que fija el jugador que empieza la partida. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas, y la partida sigue sin ti.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En qué se diferencia de una partida de 2</h2>
      <ul>
        <li><strong>Más fichas:</strong> 30 en el tablero, frente a 20 con 2 jugadores.</li>
        <li><strong>Objetivos vacíos:</strong> con 2 jugadores tu objetivo empieza lleno de fichas del otro jugador. Con 3 empieza vacío.</li>
        <li><strong>Dos oponentes:</strong> después de tu jugada, mueven otros dos jugadores antes de que te toque de nuevo. Las fichas de ambos son peldaños para ti, y las tuyas para ellos. Una escalera que construyes pueden usarla los dos, y el jugador que va después de ti tiene la primera opción.</li>
        <li><strong>La partida sigue:</strong> con 2 jugadores la partida termina cuando uno de los dos acaba. Con 3, sigue por el segundo y el tercer puesto.</li>
      </ul>
      <p>Para la partida de dos, lee <a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>. Los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a> tratan de pasos y saltos, que son iguales con 3 jugadores.</p>
      <p><a href="/es/guias/damas-chinas-online-con-amigos">Damas chinas en línea con amigos</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dónde jugar con 3 jugadores en Leapstone</h2>
      <ul>
        <li><strong>Contra el ordenador, ahora mismo:</strong> abre <a href="/play/">Leapstone en el navegador</a>, toca Ordenador, elige el tablero en estrella y 2 ordenadores. Eres el jugador 1, así que mueves primero. Eliges Fácil, Normal o Difícil para los ordenadores.</li>
        <li><strong>En un solo móvil:</strong> toca «En este móvil», elige el tablero en estrella y 3 jugadores, y luego toca una ficha para cambiar ese puesto entre una persona y un ordenador.</li>
        <li><strong>En línea con amigos:</strong> toca Amigos, elige el tablero en estrella, 3 jugadores y el tiempo por jugada, y envía el enlace de invitación. La partida empieza cuando los 3 puestos están ocupados.</li>
        <li><strong>Partidas rápidas:</strong> Jugar en línea encuentra partidas para 2 o 4 jugadores, así que no hay partida rápida para 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinas para 3 jugadores",
  titel: "Damas chinas para 3 jugadores: reglas | Leapstone",
  beschrijving: "Cómo funcionan las damas chinas con 3 jugadores: dónde empiezan las 30 fichas, qué punta vacía es el objetivo de cada uno y cómo ganas.",
  h1: "Damas chinas para 3 jugadores",
  intro: "Cómo funciona una partida de tres en el tablero en estrella: el inicio, los tres objetivos, quién mueve primero, cómo se gana y dónde puedes jugarla.",
  inhoud,
};
