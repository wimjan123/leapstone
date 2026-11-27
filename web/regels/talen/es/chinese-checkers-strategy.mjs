// La guía española Estrategia de las damas chinas (taak 134): /es/guias/estrategia-damas-chinas.
// Contenido: la guía inglesa ../en/chinese-checkers-strategy.mjs, frase por frase. Cada consejo está comprobado con crates/halma-core
// (véase docs/plan.md, taak 122); los dibujos vienen de crates/halma-core/examples/regelplaatjes.rs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">En qué se basan estos consejos</h2>
      <p>Los consejos salen de las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a> tal como las juega Leapstone: una jugada es un paso o una cadena de saltos, y puedes saltar por encima de una ficha de cualquier color. No son una demostración del mejor juego. Jugar contra el ordenador es la forma más rápida de probarlos.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Construye escaleras</h2>
      <p>Una escalera es una línea de fichas con una casilla vacía entre cada una. Una ficha de un extremo salta por encima de toda la línea en una sola jugada, así que cruza el tablero en un turno en lugar de una casilla por turno.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Cuatro fichas en una línea diagonal con una casilla vacía entre cada una. Una ficha roja en un extremo salta por encima de las cuatro, con cuatro casillas numeradas donde cae.",
  tekst: "Cuatro saltos en una jugada. La misma ficha solo podría avanzar una casilla cada vez.",
})}
      <p>Un salto funciona en las seis direcciones, también hacia atrás, así que una escalera no tiene que empezar en tu punta. Sirve cualquier línea de fichas con huecos entre ellas.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Mantén las fichas juntas</h2>
      <p>Necesitas las 10 fichas en el objetivo, así que tu última ficha decide cuándo terminas. Una ficha sin ninguna ficha al lado no tiene nada que saltar, y solo puede dar pasos.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Un tablero en estrella con una ficha roja sola en la punta de abajo. Solo están marcadas sus dos vecinas vacías. Otras fichas rojas y azules están en el medio.",
  tekst: "Esta ficha no tiene ninguna vecina, así que solo puede dar un paso a las dos casillas marcadas.",
})}
      <p>Desde el extremo de tu punta hasta el extremo del objetivo al otro lado del tablero hay 16 pasos. Son 16 turnos para una ficha sola, mientras que una escalera la cruza en uno. Mueve las fichas de atrás mientras todavía haya fichas a su alrededor para saltar. El ordenador de Leapstone también lo hace: puntúa un poco más alto las jugadas de sus fichas más rezagadas.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Usa el centro</h2>
      <p>Una ficha en el centro del tablero tiene seis vecinas, así que puede dar un paso o un salto en las seis direcciones. Una ficha en el borde tiene menos. La ficha del borde del dibujo tiene cuatro.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Un tablero en estrella con una ficha roja en el centro con seis vecinas marcadas, y una ficha roja cerca del borde de arriba a la izquierda con cuatro vecinas marcadas.",
  tekst: "Seis formas de dar un paso en el centro, cuatro en el borde.",
})}
      <p>Las fichas del centro también dan a las otras fichas algo que saltar cuando van hacia el otro lado.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Llena el objetivo desde el fondo</h2>
      <p>Tu objetivo es un triángulo de 10 casillas, en filas de 4, 3, 2 y 1. A las casillas del fondo solo se llega pasando por las que tienen delante. Si llenas primero el frente, la última ficha puede no tener forma de entrar.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "La punta del objetivo arriba con nueve fichas rojas y una casilla vacía en el fondo del todo, marcada con rayas. Una décima ficha roja, con un anillo blanco, está debajo de la fila del frente.",
  tekst: "Nueve fichas están en casa, y la casilla del fondo está vacía. La décima ficha no tiene ninguna jugada para entrar.",
})}
      <p>Pon las primeras fichas en las casillas del fondo y avanza hacia el frente, así el frente queda abierto para las fichas que llegan las últimas.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. No emparedes una ficha en tu objetivo</h2>
      <p>Puedes parar en la punta de otro jugador, así que una ficha del otro jugador puede acabar en tu objetivo. Solo ganas cuando las 10 casillas de tu objetivo tienen fichas tuyas. Si esa ficha no tiene ninguna jugada, nadie puede moverla, y no puedes ganar hasta que se abra una casilla a su lado.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "La punta del objetivo arriba con nueve fichas rojas y una ficha azul en el fondo del todo, marcada con un anillo blanco. La ficha azul está rodeada de fichas rojas.",
  tekst: "La ficha azul del fondo no tiene ninguna jugada, y el rojo no puede llenar el objetivo.",
})}
      <p>Deja abierta una casilla junto a una ficha así, para que pueda salir. El ordenador de Leapstone lo tiene en cuenta: una jugada que atrapa una ficha de otro jugador en su objetivo puntúa más bajo. Las reglas no obligan a nadie a salir de tu objetivo, así que el otro jugador también puede aparcar allí una ficha a propósito.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bloquea un salto, o déjalo</h2>
      <p>Un salto necesita una casilla vacía donde caer. Llena esa casilla y el salto desaparece. Dos fichas seguidas tampoco se pueden saltar.</p>
      <p>Tus fichas también son peldaños para el otro jugador. En el dibujo de la izquierda el azul cruza dos fichas rojas en una jugada. A la derecha, el rojo ha movido una ficha a la primera casilla donde caería, y el azul solo puede dar un paso.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Una ficha azul con dos fichas rojas en línea, cada una con una casilla vacía detrás. Unas flechas muestran dos saltos de la ficha azul.",
          tekst: "Antes: el azul puede hacer dos saltos.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "La misma línea después de que el rojo haya movido su ficha lejana a la primera casilla donde caería. La ficha azul va seguida de dos fichas rojas seguidas.",
          tekst: "Después: el rojo ha movido una ficha. El azul no tiene ningún salto.",
        })}
      </div>
      <p>Una jugada gastada en bloquear es una jugada que no gastas en tu propio avance, así que bloquea cuando el salto le dé al otro jugador más de lo que te daría tu jugada a ti. Al revés pasa cuando construyes una escalera: después de tu jugada, mueve primero el otro jugador, así que una ficha suya en un extremo usa tu escalera antes que tú. En el nivel más difícil, el ordenador mira la mejor respuesta de cada oponente antes de elegir una jugada.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Sigue</h2>
      <ul>
        <li><a href="/play/">Juega contra el ordenador en el navegador</a> y prueba una escalera.</li>
        <li><a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>: cómo funciona una partida de dos.</li>
        <li><a href="/es/reglas/damas-chinas">Reglas de las damas chinas</a>, con dibujos de pasos, saltos y cadenas.</li>
      </ul>
      <p><a href="/es/guias/damas-chinas-online-con-amigos">Damas chinas en línea con amigos</a></p>
      <p><a href="/es/guias/halma-o-damas-chinas">Halma o damas chinas</a></p>
      <p><a href="/es/guias/damas-chinas-3-jugadores">Damas chinas para 3 jugadores</a></p>
    </section>`;

export default {
  nav: "Estrategia de las damas chinas",
  titel: "Estrategia de las damas chinas: 6 consejos | Leapstone",
  beschrijving: "Estrategia de las damas chinas: construye escaleras, mantén las fichas juntas, usa el centro, llena el objetivo desde el fondo y bloquea saltos.",
  h1: "Estrategia de las damas chinas",
  intro: "Seis consejos para el tablero en estrella, cada uno con un dibujo de las reglas reales: escaleras, rezagadas, el centro, llenar el objetivo y bloquear saltos.",
  inhoud,
};
