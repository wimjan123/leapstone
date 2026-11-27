// La página de reglas del Halma en español (taak 134). Contenido: la página inglesa ../en/halma.mjs (comprobada con
// crates/halma-core, véase docs/plan.md, taak 117), frase por frase. Si cambia una regla, cambia en las dos.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 jugadores: 19 fichas cada uno",
    alt: "El tablero cuadrado con 19 fichas rojas en la esquina de arriba a la izquierda y 19 fichas azules en la esquina de abajo a la derecha",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 jugadores: 13 fichas cada uno",
    alt: "El tablero cuadrado con 13 fichas en cada una de las cuatro esquinas: rojas arriba a la izquierda, azules arriba a la derecha, verdes abajo a la derecha y amarillas abajo a la izquierda",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">El tablero</h2>
      <p>El Halma se juega en un tablero cuadrado de 16 por 16 casillas, 256 en total. Cada casilla tiene hasta ocho vecinas: las cuatro en línea recta y las cuatro en diagonal. Una casilla del borde tiene menos, y una esquina tiene tres.</p>
      <p>Este es el tablero cuadrado de Leapstone. Si conoces el juego en el tablero en estrella, lee sobre el <a href="/es/reglas/que-es-sternhalma">Sternhalma</a> y las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Cómo empiezan las fichas</h2>
      <p>El Halma es para 2 o 4 jugadores. Cada jugador empieza con las fichas en un campamento en una esquina del tablero. El campamento de la esquina opuesta es tu objetivo.</p>
      <ul>
        <li><strong>2 jugadores:</strong> 19 fichas cada uno, en dos esquinas opuestas. El campamento son cinco filas de 5, 5, 4, 3 y 2 casillas.</li>
        <li><strong>4 jugadores:</strong> 13 fichas cada uno, un campamento en cada esquina. El campamento son cuatro filas de 4, 4, 3 y 2 casillas. Tu objetivo es la esquina del otro lado del tablero, en diagonal.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Por turnos</h2>
      <p>Empieza el jugador 1. Después los turnos siguen el orden, y después del último jugador vuelve a ser el turno del jugador 1. En Leapstone los colores van con los números: rojo, azul, verde y amarillo.</p>
      <p>En tu turno mueves una ficha, una sola vez. No se captura nada: las fichas se quedan en el tablero hasta que su jugador abandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un paso</h2>
      <p>Mueve una ficha a una casilla vacía junto a ella, en cualquiera de las ocho direcciones: recta o en diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Una ficha roja con un anillo blanco alrededor. Cinco de sus ocho vecinas están vacías y marcadas; en las otras tres hay fichas.",
  tekst: "La ficha roja puede dar un paso a las cinco casillas marcadas. Las otras tres vecinas están ocupadas.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salto</h2>
      <p>Salta por encima de una ficha contigua a la tuya, de cualquier color, y cae en la casilla vacía justo detrás, en línea recta. Puedes saltar en las ocho direcciones, también en diagonal y hacia atrás.</p>
      <ul>
        <li>La casilla en la que caes debe estar vacía.</li>
        <li>No puedes saltar por encima de dos fichas seguidas, ni por encima de una casilla vacía.</li>
        <li>La ficha por encima de la que saltas se queda donde está.</li>
        <li>No puedes saltar por encima del borde del tablero.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Una ficha roja salta en diagonal por encima de una ficha azul hasta la casilla vacía de detrás, indicado con una flecha.",
  tekst: "La ficha roja salta en diagonal por encima de la ficha azul.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una cadena de saltos</h2>
      <p>Después de un salto, la misma ficha puede volver a saltar, tantas veces como pueda, en cualquier dirección, recta o en diagonal. Tú decides dónde parar. Todos los saltos juntos son una sola jugada.</p>
      <ul>
        <li>En una jugada no puedes caer dos veces en la misma casilla.</li>
        <li>Una jugada es un paso, o uno o más saltos. Después de un salto no puedes dar un paso.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Una ficha roja hace tres saltos en una jugada: en diagonal por encima de una ficha azul, en línea recta por encima de otra ficha azul, y en diagonal por encima de una ficha roja. Las tres casillas donde cae llevan los números 1, 2 y 3.",
  tekst: "Una jugada con tres saltos, en el orden de los números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">El objetivo</h2>
      <p>Ganas si llevas todas tus fichas al campamento de enfrente de donde empezaste. Todas las casillas de ese campamento deben tener fichas tuyas: 19 con 2 jugadores, 13 con 4 jugadores. Mientras haya una ficha de otro jugador, no puedes terminar.</p>
      <p>Puedes caer en cualquier casilla vacía, también en los campamentos de los otros jugadores. Una ficha que está en tu objetivo puede volver a salir; nada la bloquea.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "El tablero cuadrado para dos jugadores. El rojo empieza arriba a la izquierda; el campamento de abajo a la derecha, marcado con círculos de puntos y con fichas azules, es el objetivo del rojo.",
  tekst: "Con 2 jugadores, el objetivo del rojo es el campamento donde empieza el azul.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Con 2 o 4 jugadores</h2>
      <ul>
        <li><strong>2 jugadores:</strong> gana el primer jugador que llena el objetivo, y la partida termina.</li>
        <li><strong>4 jugadores:</strong> gana el primer jugador que llena el objetivo. Los demás siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta. La partida termina cuando solo queda un jugador jugando.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonar</h2>
      <p>Cuando abandonas, tus fichas salen del tablero, así que no bloquean a nadie. Con 2 jugadores, gana el otro jugador. Con 4 jugadores la partida sigue sin ti, y si todos menos uno abandonan, gana el último jugador.</p>
      <p>En una partida en línea cada jugada tiene un tiempo límite. Lo fija el jugador que inicia la partida. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas. Las partidas contra el ordenador y en un solo móvil no tienen tiempo límite.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consejos</h2>
      <ul class="tips">
        <li><strong>Construye escaleras.</strong> Pon fichas en línea con una casilla vacía entre cada una, recta o en diagonal, apuntando a tu objetivo. Una ficha puede entonces saltar toda la línea en una sola jugada.</li>
        <li><strong>Cualquier ficha es una escalera.</strong> Puedes saltar por encima de todos los colores, así que las fichas de los otros jugadores también te ayudan. Y tus escaleras los ayudan a ellos: mira lo que dejas atrás.</li>
        <li><strong>Usa las diagonales.</strong> El objetivo está en la esquina opuesta, así que una línea diagonal de fichas es la forma más rápida de cruzar.</li>
        <li><strong>No te olvides de las rezagadas.</strong> Necesitas todas tus fichas en casa. Una ficha muy atrasada, sin nada que saltar, avanza una casilla por turno. Tráela contigo mientras las otras fichas todavía están a su alrededor.</li>
        <li><strong>Tu inicio es su objetivo.</strong> Con 2 jugadores, tu campamento es el objetivo del otro jugador, y él no puede terminar mientras siga allí una ficha tuya. Leapstone te deja mantener una ficha en casa, así que puedes bloquear de esta manera. Lo mismo vale para ti.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Preguntas</h2>
      <h3>¿Cuántas personas pueden jugar al Halma?</h3>
      <p>Dos o cuatro. El Halma se juega en un tablero cuadrado de 16 por 16 casillas, y cada jugador empieza en una esquina.</p>
      <h3>¿Cuántas fichas tiene cada jugador en el Halma?</h3>
      <p>19 fichas cada uno con 2 jugadores, y 13 fichas cada uno con 4 jugadores.</p>
      <h3>¿Quién inventó el Halma?</h3>
      <p>George Howard Monks, un cirujano estadounidense, en 1883 o 1884. El nombre es griego y significa «salto». Lee más en el <a href="/es/reglas/que-es-sternhalma">Sternhalma</a>.</p>
      <h3>¿Cuál es la diferencia entre el Halma y las damas chinas?</h3>
      <p>El Halma usa un tablero cuadrado, con pasos y saltos en ocho direcciones y 19 o 13 fichas cada uno. Las damas chinas usan un tablero en estrella, con seis direcciones y 10 fichas cada uno, para 2, 3, 4 o 6 jugadores.</p>
      <h3>¿Se puede jugar al Halma en línea gratis?</h3>
      <p>Sí, en Leapstone, en el navegador o en la aplicación de la App Store. Elige una forma de jugar, como contra el ordenador o en línea con amigos, y después el Tablero cuadrado. Leapstone es gratis y sin anuncios.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Juega</h2>
      <p>El botón Juega ahora abre una partida contra el ordenador en el <a href="/es/reglas/damas-chinas">tablero en estrella</a>. Para jugar al Halma, toca la flecha hacia atrás de arriba, elige después Jugar en este móvil, Jugar contra el ordenador o Jugar en línea con amigos, y toca el Tablero cuadrado.</p>
    </section>`;

export default {
  nav: "Reglas del Halma",
  titel: "Reglas y consejos del Halma | Leapstone",
  beschrijving: "Cómo se juega al Halma en el tablero cuadrado de 16 por 16: inicio, pasos, saltos, cadenas de saltos, cómo ganar y consejos. Juega gratis en el navegador.",
  h1: "Reglas del Halma",
  intro: "Lleva todas tus fichas a través del tablero cuadrado hasta la esquina opuesta antes que nadie. Las reglas en pocas palabras, con dibujos, y unos cuantos consejos.",
  inhoud,
};
