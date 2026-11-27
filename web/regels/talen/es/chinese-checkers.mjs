// La página de reglas de las damas chinas en español (taak 134). Contenido: la página inglesa ../en/chinese-checkers.mjs
// (comprobada con crates/halma-core, véase docs/plan.md, taak 116), frase por frase. Si cambia una regla, cambia en las dos.
// Los mismos dibujos (sin idioma: solo cifras en el SVG); los textos alternativos y los pies de figura están en español.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} jugadores`,
      alt:
        {
          2: "El tablero en estrella con 10 fichas rojas en la punta de abajo y 10 fichas azules en la punta de arriba",
          3: "El tablero en estrella con fichas rojas abajo, azules arriba a la izquierda y verdes arriba a la derecha",
          4: "El tablero en estrella con fichas en cuatro puntas: rojas abajo, verdes arriba, azules abajo a la izquierda y amarillas arriba a la derecha",
          6: "El tablero en estrella con fichas en las seis puntas, en seis colores",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">El tablero</h2>
      <p>Las damas chinas se juegan en una estrella de seis puntas. El tablero tiene 121 casillas, y cada punta tiene 10. En el interior del tablero, cada casilla tiene seis vecinas.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Cómo empiezan las fichas</h2>
      <p>Cada jugador tiene 10 fichas y empieza con todas en una punta de la estrella. La punta que tienes enfrente es tu objetivo.</p>
      <ul>
        <li><strong>2 jugadores:</strong> las dos puntas que quedan una frente a la otra.</li>
        <li><strong>3 jugadores:</strong> una punta sí y otra no. Los tres objetivos empiezan vacíos.</li>
        <li><strong>4 jugadores:</strong> dos parejas de puntas que están una junto a otra. Cada jugador tiene a otro jugador enfrente.</li>
        <li><strong>6 jugadores:</strong> las seis puntas.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Por turnos</h2>
      <p>Empieza el jugador 1. Después los turnos siguen el orden: jugador 2, jugador 3 y así sucesivamente, y después del último jugador vuelve a ser el turno del jugador 1. En Leapstone los colores van con los números: rojo, azul, verde, amarillo, morado y plata.</p>
      <p>En tu turno mueves una ficha, una sola vez. No se captura nada: las fichas se quedan en el tablero hasta que su jugador abandona.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un paso</h2>
      <p>Mueve una ficha a una casilla vacía junto a ella.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Una ficha roja con un anillo blanco alrededor. Tres de sus seis vecinas están vacías y marcadas; en las otras tres hay fichas.",
  tekst: "La ficha roja puede dar un paso a las tres casillas marcadas. Las otras tres vecinas están ocupadas.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un salto</h2>
      <p>Salta por encima de una ficha contigua a la tuya, de cualquier color, y cae en la casilla vacía justo detrás, en línea recta. Puedes saltar en las seis direcciones, también hacia atrás.</p>
      <ul>
        <li>La casilla en la que caes debe estar vacía.</li>
        <li>No puedes saltar por encima de dos fichas seguidas, ni por encima de una casilla vacía.</li>
        <li>La ficha por encima de la que saltas se queda donde está.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Una ficha roja salta por encima de una ficha azul hasta la casilla vacía de detrás, indicado con una flecha.",
  tekst: "La ficha roja salta por encima de la ficha azul.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Una cadena de saltos</h2>
      <p>Después de un salto, la misma ficha puede volver a saltar, tantas veces como pueda y en cualquier dirección. Tú decides dónde parar. Todos los saltos juntos son una sola jugada.</p>
      <ul>
        <li>En una jugada no puedes caer dos veces en la misma casilla.</li>
        <li>Una jugada es un paso, o uno o más saltos. Después de un salto no puedes dar un paso.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Una ficha roja hace tres saltos en una jugada, por encima de una ficha azul, una verde y otra azul. Las tres casillas donde cae llevan los números 1, 2 y 3.",
  tekst: "Una jugada con tres saltos, en el orden de los números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">El objetivo</h2>
      <p>Ganas si llevas las 10 fichas a la punta de enfrente de donde empezaste. Las 10 casillas de esa punta deben tener fichas tuyas. Mientras haya una ficha de otro jugador, no puedes terminar.</p>
      <p>Puedes caer en cualquier casilla vacía, también en las puntas de los otros jugadores.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Un tablero en estrella para tres jugadores. El rojo empieza abajo; la punta vacía de arriba, marcada con círculos de puntos, es el objetivo del rojo.",
  tekst: "Con 3 jugadores, el rojo empieza abajo. El objetivo del rojo es la punta vacía de arriba.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Con 2, 3, 4 o 6 jugadores</h2>
      <ul>
        <li><strong>2 jugadores:</strong> gana el primer jugador que llena el objetivo, y la partida termina.</li>
        <li><strong>3, 4 o 6 jugadores:</strong> gana el primer jugador que llena el objetivo. Los demás siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta. La partida termina cuando solo queda un jugador jugando.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonar</h2>
      <p>Cuando abandonas, tus fichas salen del tablero, así que no bloquean a nadie. Con 2 jugadores, gana el otro jugador. Con más jugadores la partida sigue sin ti, y si todos menos uno abandonan, gana el último jugador.</p>
      <p>En una partida en línea cada jugada tiene un tiempo límite. Lo fija el jugador que inicia la partida, y en una partida rápida son 30 segundos. Cuando se te acaba el tiempo, se salta tu turno. Si pierdes 3 turnos seguidos, abandonas. Las partidas contra el ordenador y en un solo móvil no tienen tiempo límite.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Consejos</h2>
      <ul class="tips">
        <li><strong>Construye escaleras.</strong> Pon fichas en línea con una casilla vacía entre cada una, apuntando a tu objetivo. Una ficha puede entonces saltar toda la línea en una sola jugada.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Cuatro fichas en una línea diagonal con una casilla vacía entre cada una. Una ficha roja en un extremo salta por encima de las cuatro, con cuatro casillas numeradas donde cae.",
  tekst: "Cuatro fichas en una línea: la ficha roja de arriba cruza el tablero en una jugada, con cuatro saltos.",
})}
        </li>
        <li><strong>Cualquier ficha es una escalera.</strong> Puedes saltar por encima de todos los colores, así que las fichas de los otros jugadores también te ayudan. Y tus escaleras los ayudan a ellos: mira lo que dejas atrás.</li>
        <li><strong>No te olvides de las rezagadas.</strong> Necesitas las 10 fichas en casa. Una ficha muy atrasada, sin nada que saltar, avanza una casilla por turno. Tráela contigo mientras las otras fichas todavía están a su alrededor.</li>
        <li><strong>Tu inicio es su objetivo.</strong> Con 2, 4 o 6 jugadores, tu punta de inicio es el objetivo del jugador que tienes enfrente, y él no puede terminar mientras siga allí una ficha tuya. Lo mismo vale para ti.</li>
      </ul>
      <p>Hay más consejos, con dibujos, en la guía de <a href="/es/guias/estrategia-damas-chinas">estrategia de las damas chinas</a>. Para una partida de dos, lee <a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Preguntas</h2>
      <h3>¿Cuántas personas pueden jugar a las damas chinas?</h3>
      <p>Dos, tres, cuatro o seis. Cada jugador empieza en una punta de la estrella. Con 2, 3 o 4 jugadores, algunas puntas quedan vacías.</p>
      <h3>¿Cuántas canicas tiene cada jugador?</h3>
      <p>Cada jugador tiene 10 canicas, es decir, fichas. El tablero tiene 121 casillas: 10 en cada una de las seis puntas y 61 en el centro.</p>
      <h3>¿Se puede saltar sobre las propias fichas, o hacia atrás?</h3>
      <p>Sí. Puedes saltar sobre una ficha de cualquier color, también las tuyas, en cualquiera de las seis direcciones, y también hacia atrás. La ficha sobre la que saltas se queda donde está.</p>
      <h3>¿Se capturan fichas en las damas chinas?</h3>
      <p>No. No se captura nada. Una ficha solo sale del tablero cuando su jugador abandona.</p>
      <h3>¿Las damas chinas son de China?</h3>
      <p>No. El juego apareció en Alemania en 1892 con el nombre de Stern-Halma, basado en el juego más antiguo Halma. El nombre Chinese checkers (damas chinas) viene de Estados Unidos, en 1928. Lee más en el <a href="/es/reglas/que-es-sternhalma">Sternhalma</a>.</p>
      <h3>¿Dónde se puede jugar gratis a las damas chinas en línea con amigos?</h3>
      <p>En Leapstone, en el navegador o en la aplicación de la App Store. Envía un enlace de invitación a un amigo: se une a tu partida sin cuenta, correo electrónico ni contraseña. También puedes jugar contra el ordenador, o hacer una partida rápida contra otro jugador. Leapstone es gratis y sin anuncios.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Juega a las damas chinas en Leapstone</h2>
      <p>Leapstone es una aplicación gratuita de damas chinas y Halma, con un tablero 3D de laca roja y oro. Puedes jugar en la aplicación y en el navegador.</p>
      <ul>
        <li><strong>Contra el ordenador.</strong> Fácil, normal o difícil. No hace falta internet.</li>
        <li><strong>Con amigos.</strong> Envía un enlace de invitación. Tú fijas el tiempo por jugada, y podéis chatear.</li>
        <li><strong>En línea.</strong> Una partida rápida contra otro jugador de tu nivel, 30 segundos por jugada. Algunos oponentes en línea pueden ser jugadores del ordenador.</li>
        <li><strong>En un solo móvil.</strong> Pasad el móvil alrededor de la mesa.</li>
      </ul>
      <p>Leapstone es gratis, sin anuncios y sin registro con correo electrónico: solo eliges un nombre de jugador. <a href="https://apps.apple.com/es/app/id6831230722">Descarga Leapstone en la App Store</a> o <a href="/play/">juega en el navegador</a>.</p>
    </section>`;

export default {
  nav: "Reglas de las damas chinas",
  titel: "Reglas y consejos de las damas chinas | Leapstone",
  beschrijving: "Cómo se juega a las damas chinas: inicio, pasos, saltos y cadenas, cómo ganar con 2, 3, 4 o 6 jugadores, y consejos. Juega gratis en el navegador.",
  h1: "Reglas de las damas chinas",
  intro: "Lleva las 10 fichas a través del tablero en estrella hasta la punta contraria antes que nadie. Las reglas en pocas palabras, con dibujos, y unos cuantos consejos.",
  inhoud,
};
