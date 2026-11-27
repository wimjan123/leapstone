// De gids Damas chinas para 6 jugadores (taak 302): /es/guias/damas-chinas-6-jugadores.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Spaans. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cómo empieza la partida</h2>
      <p>Cada jugador tiene 10 fichas, y las 6 puntas de la estrella están en uso. Eso pone 60 fichas en el tablero de 121 casillas. Las 61 casillas del centro están vacías al empezar.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "El tablero en estrella con 10 fichas en cada una de sus 6 puntas, en 6 colores",
  tekst: "6 jugadores, 6 puntas, 60 fichas.",
})}
      <p>El jugador 1, el rojo, mueve primero, desde la punta de abajo. Después el turno va del jugador 1 al jugador 6, y tras el jugador 6 vuelve a ser el jugador 1. Los jugadores están numerados en el orden de sus puntas alrededor de la estrella, así que el jugador que va después de ti siempre empieza en la punta junto a la tuya. Una jugada es un paso o una cadena de saltos con una ficha. Mira las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> para los pasos y los saltos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Todos los objetivos empiezan llenos</h2>
      <p>Ganas si llevas las 10 fichas a la punta del otro lado del tablero. Con 6 jugadores esa es la punta donde empieza el jugador de enfrente, así que ningún objetivo está vacío: cada objetivo empieza lleno de fichas de otro jugador. Para el rojo, el objetivo es la punta de arriba, donde empieza el jugador 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "El tablero en estrella con 6 puntas llenas. Un anillo de trazos marca la punta de arriba, el objetivo del jugador rojo, que contiene las fichas del jugador de enfrente.",
  tekst: "El objetivo del rojo es la punta de enfrente, llena de fichas del jugador 4.",
})}
      <p>Solo puedes caer en una casilla vacía, así que el jugador de enfrente tiene que dejar su punta antes de que tú puedas llenarla, y tú tienes que dejar la tuya antes de que él pueda llenar la suya. En una partida de 2 eso es todo. Con 6, los dos también tenéis que atravesar la multitud de los 4 demás.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Un centro abarrotado</h2>
      <p>Todos los objetivos están al otro lado del tablero, y las puntas solo se conectan entre sí por el centro, así que las 60 fichas tienen que cruzar las mismas 61 casillas. Al empezar nadie ha cruzado todavía, y el centro se llena rápido.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Una ficha roja salta tres veces en una sola jugada: por encima de una ficha azul, luego de una verde y luego de una morada. Los números 1, 2 y 3 marcan las casillas de aterrizaje.",
  tekst: "Las fichas de todos los colores son peldaños.",
})}
      <p>Puedes saltar por encima de una ficha de cualquier color. Las fichas de otros 5 jugadores son peldaños para ti, y las tuyas son peldaños para los 5. Una hilera de fichas que dejas en el centro es una escalera para quien pueda alcanzarla, y el jugador que va después de ti tiene la primera oportunidad.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Bloquear con 5 oponentes</h2>
      <ul>
        <li><strong>Llena la casilla de aterrizaje:</strong> un salto necesita una casilla vacía justo detrás de la ficha. Cuando pones una ficha ahí, el salto desaparece para todos los jugadores que lo querían.</li>
        <li><strong>Cuidado con las escaleras que construyes:</strong> después de tu jugada, los otros 5 jugadores mueven antes de que te toque otra vez. Una escalera los ayuda a todos.</li>
        <li><strong>Cualquiera puede bloquear un objetivo:</strong> una ficha de cualquier otro jugador en tu objetivo te impide terminar, no solo una ficha del jugador de enfrente. Las 10 casillas del objetivo deben tener tus propias fichas.</li>
      </ul>
      <p>Los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a> muestran cómo se ve un salto bloqueado, y cómo no encerrar una ficha de otro jugador en tu propio objetivo.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Cuánto dura una partida</h2>
      <p>Una partida de 6 tiene 60 fichas que mover, y entre una jugada tuya y la siguiente, los otros 5 jugadores hacen una cada uno. Además, no termina cuando acaba el primer jugador.</p>
      <ul>
        <li><strong>Ganar y seguir jugando:</strong> gana el primer jugador que llena el objetivo, y los demás siguen jugando por los puestos siguientes. El jugador que ya ha terminado se salta, y sus fichas se quedan en el tablero como peldaños. La partida termina cuando solo queda un jugador jugando.</li>
        <li><strong>Abandonar:</strong> tus fichas salen del tablero, así que ya no bloquean ni ayudan a nadie, y los demás siguen.</li>
        <li><strong>Tiempo (en línea):</strong> en una partida en línea cada jugada tiene un tiempo límite, que fija el jugador que empieza la partida: 15 segundos, 30 segundos, 1 minuto, 2 minutos o sin límite. Una ronda de 6 jugadas dura como mucho 6 veces el límite, así que con 30 segundos son 3 minutos como mucho. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas, y la partida sigue sin ti.</li>
      </ul>
      <p>Para una partida con menos jugadores, lee <a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dónde jugar con 6 jugadores en Leapstone</h2>
      <ul>
        <li><strong>Contra el ordenador, ahora mismo:</strong> abre <a href="/play/">Leapstone en el navegador</a>, toca Ordenador, elige el tablero en estrella y 5 ordenadores. Eres el jugador 1, así que mueves primero. Los ordenadores mueven uno tras otro, cada uno con una pausa corta, así puedes seguir cada jugada. Eliges Fácil, Normal o Difícil para los ordenadores.</li>
        <li><strong>En un solo móvil:</strong> toca Jugar, elige el tablero en estrella y 6 jugadores, y luego toca una ficha para cambiar ese puesto entre una persona y un ordenador.</li>
        <li><strong>En línea con amigos:</strong> toca Amigos, elige el tablero en estrella, 6 jugadores y el tiempo por jugada, y envía el enlace de invitación. La partida empieza cuando están ocupados los 6 puestos.</li>
        <li><strong>Partidas rápidas:</strong> Jugar en línea busca partidas de 2 o 4 jugadores, así que no hay partida rápida de 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinas para 6 jugadores",
  titel: "Damas chinas para 6: el tablero lleno | Leapstone",
  beschrijving: "Cómo funcionan las damas chinas con 6 jugadores: una estrella de 60 fichas, un centro abarrotado, el bloqueo, cuánto dura una partida y dónde jugar.",
  h1: "Damas chinas para 6 jugadores",
  intro: "Cómo funciona una partida de 6: las 6 puntas están llenas, corres hacia la punta del otro lado del tablero, y la partida sigue después de que termine el primer jugador.",
  inhoud,
};
