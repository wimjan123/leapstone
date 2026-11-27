// La guía española Damas chinas para 2 jugadores (taak 134): /es/guias/damas-chinas-2-jugadores.
// Contenido: la guía inglesa ../en/chinese-checkers-2-players.mjs, frase por frase. Reglas de crates/halma-core
// (Board::star, Game::new_star(2), make_move, resign), el tiempo límite de "Regels" y taak 80, los niveles del ordenador de computer.rs.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cómo empieza la partida</h2>
${plaatje({
  direct: true,
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "El tablero en estrella con 10 fichas rojas en la punta de abajo y 10 fichas azules en la punta de arriba",
  tekst: "El rojo empieza abajo, el azul arriba.",
})}
      <p>Cada jugador tiene 10 fichas. Empiezan en dos puntas de la estrella que quedan una frente a la otra: el rojo abajo, el azul arriba. Las 20 fichas están en un tablero de 121 casillas.</p>
      <p>El jugador 1, el rojo, mueve primero. Después os turnáis, una jugada cada uno. Una jugada es un paso o una cadena de saltos con una ficha. Mira las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> para los pasos y los saltos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tu objetivo es el inicio del otro jugador</h2>
      <p>Ganas si llevas las 10 fichas a la punta donde empezó el otro jugador. Esa punta empieza llena de sus fichas, y la tuya llena de las tuyas. Para el rojo, es la punta de arriba del dibujo de encima.</p>
      <p>Solo puedes caer en una casilla vacía, así que cada uno tiene que dejar su propia punta antes de que el otro la llene. Ninguno de los dos puede terminar mientras una ficha del otro siga en el objetivo. Y como cruzáis el mismo centro en direcciones opuestas, las fichas del otro jugador son peldaños para ti, y las tuyas para él. Lee los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a> para saber qué hacer con eso.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Ganar y abandonar</h2>
      <ul>
        <li><strong>Ganar:</strong> gana el primer jugador que llena el objetivo con las 10 fichas, y la partida termina en el acto. El otro jugador no sigue.</li>
        <li><strong>Abandonar:</strong> tus fichas salen del tablero y gana el otro jugador.</li>
        <li><strong>Tiempo (en línea):</strong> en una partida en línea cada jugada tiene un tiempo límite. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En qué se diferencian 3, 4 y 6 jugadores</h2>
      <ul>
        <li><strong>3 jugadores:</strong> las fichas empiezan en una punta sí y otra no, y los tres objetivos empiezan vacíos. Gana el primero que termina; los demás siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta.</li>
        <li><strong>4 jugadores:</strong> dos parejas de puntas una junto a otra. Tu objetivo empieza lleno de fichas de otro jugador. La partida sigue después del primero que termina, como con 3.</li>
        <li><strong>6 jugadores:</strong> las seis puntas. El tablero tiene 60 fichas, frente a 20 con 2 jugadores.</li>
      </ul>
      <p>Con solo 20 fichas en el tablero hay menos fichas que saltar, así que las escaleras que construyes tú mismo importan más. La <a href="/es/reglas/damas-chinas">página de reglas</a> tiene dibujos de cada inicio.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Dónde jugar con 2 jugadores en Leapstone</h2>
      <ul>
        <li><strong>Contra el ordenador, ahora mismo:</strong> abre <a href="/play/">Leapstone en el navegador</a>, toca Ordenador y elige el tablero en estrella. Un ordenador es el valor por defecto, así que es una partida de 2. Eliges Fácil, Normal o Difícil, y eres el jugador 1, así que mueves primero. El nivel fácil elige la mejor de tres jugadas al azar. El normal elige la jugada que hace más progreso hacia su objetivo. El difícil también mira cómo pueden responderle sus oponentes y su siguiente jugada.</li>
        <li><strong>Juega en línea, en la aplicación:</strong> una partida rápida en el tablero en estrella para 2 jugadores, contra otro jugador de tu nivel, con 30 segundos por jugada. Algunos oponentes en línea pueden ser jugadores del ordenador.</li>
        <li><strong>Con un amigo:</strong> envía un enlace de invitación, y fija tú mismo el tiempo por jugada. O pasaos un solo móvil de uno a otro.</li>
      </ul>
      <p><a href="/es/guias/damas-chinas-online-con-amigos">Damas chinas en línea con amigos</a></p>
      <p><a href="/es/guias/damas-chinas-3-jugadores">Damas chinas para 3 jugadores</a></p>
    </section>`;

export default {
  nav: "Damas chinas para 2 jugadores",
  titel: "Damas chinas 2 jugadores: reglas y cómo jugar | Leapstone",
  beschrijving: "Reglas de las damas chinas para 2 jugadores: cada uno lleva 10 fichas, el rojo mueve primero y gana quien llene antes la punta contraria. Juega gratis.",
  h1: "Damas chinas para 2 jugadores",
  intro: "En las damas chinas para 2 jugadores cada uno lleva 10 fichas en puntas opuestas de la estrella, el rojo mueve primero y gana quien lleve antes sus 10 fichas a la punta contraria. En tu turno mueves una ficha: un paso o una cadena de saltos.",
  inhoud,
};
