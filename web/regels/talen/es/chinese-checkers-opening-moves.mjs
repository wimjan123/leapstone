// La guía española Aperturas de las damas chinas (taak 303), frase por frase de ../en/chinese-checkers-opening-moves.mjs.
// Cada jugada y cada cifra está comprobada con crates/halma-core (véase el archivo inglés). Solo cifras en el texto, ningún número escrito con letras.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Tu primera jugada: 14 opciones</h2>
      <p>Al empezar, tus 10 fichas llenan un triángulo con filas de 4, 3, 2 y 1, y la fila de delante mira hacia el centro del tablero. No hay ninguna casilla vacía dentro del triángulo, así que una ficha solo puede ir a la fila que tiene justo delante. Eso deja 14 primeras jugadas: cada una de las 4 fichas de la fila de delante puede dar un paso a 2 casillas (8 pasos), y cada una de las 3 fichas de la segunda fila puede saltar por encima de una ficha de delante hasta 2 casillas (6 saltos). Las otras 3 fichas todavía no se pueden mover.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "La punta roja abajo con sus 10 fichas, y en la fila justo delante 5 casillas vacías marcadas con un círculo.",
  tekst: "Cada primera jugada acaba en una de estas 5 casillas.",
})}
      <p>En esta guía una fila es una línea de casillas que cruza tu punta, paralela a su borde delantero, y contamos el avance en filas. Un paso lleva una ficha adelante 1 fila y un salto la lleva 2 filas. Todos los jugadores tienen las mismas 14 primeras jugadas, con 2, 3, 4 o 6 jugadores y desde cualquier punta de la estrella, porque todas las puntas se ven igual desde dentro.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Apertura 1: salta hacia fuera y luego libera el extremo</h2>
      <p>La ficha del extremo de tu punta es la más lejana de tu objetivo, y al empezar no se puede mover: solo puede saltar por encima de una ficha si la casilla de detrás de esa ficha está vacía. Un salto desde la segunda fila crea justo una casilla así.</p>
      <ol>
        <li><strong>Jugada 1:</strong> la ficha del extremo derecho de tu segunda fila salta por encima de la ficha que tiene delante. Cae en la fila delante de tu punta y avanza 2 filas.</li>
        <li><strong>Jugada 2:</strong> la ficha del extremo salta dos veces en una jugada: primero a la casilla que vació la jugada 1, luego por encima de una ficha de la segunda fila. Avanza 4 filas.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "La punta roja después de la jugada 1. La ficha del extremo tiene un círculo, y 2 flechas con los números 1 y 2 muestran sus saltos por la casilla vaciada hasta la fila delante de la punta.",
  tekst: "Después de la jugada 1, la ficha del extremo salta hacia fuera con 2 saltos.",
})}
      <p>Son 6 filas en 2 jugadas. Hemos probado todas las maneras de hacer 2 jugadas, y 6 es lo máximo que se puede avanzar. Solo 4 pares de jugadas llegan a ello: salta la ficha de cualquiera de los dos extremos de la segunda fila, en cualquiera de sus 2 direcciones, y la ficha del extremo la sigue. La ficha del medio de la segunda fila no sirve, porque deja el extremo cerrado.</p>
      <p>Las dos fichas están ahora en la fila delante de tu punta con una casilla vacía entre ellas. Ese es el primer peldaño de una escalera.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Apertura 2: 4 jugadas con 4 fichas distintas</h2>
      <p>En 4 jugadas lo máximo que se puede avanzar son 13 filas, y solo se llega si cada jugada usa una ficha distinta. Esta línea lo consigue:</p>
      <ol>
        <li><strong>Jugada 1:</strong> la ficha del extremo derecho de la fila de delante da un paso adelante. Avanza 1 fila.</li>
        <li><strong>Jugada 2:</strong> la ficha del extremo derecho de la tercera fila salta dos veces. Avanza 4 filas.</li>
        <li><strong>Jugada 3:</strong> la ficha del extremo izquierdo de la segunda fila salta dos veces. Avanza 4 filas.</li>
        <li><strong>Jugada 4:</strong> la ficha del extremo salta dos veces. Avanza 4 filas.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "La punta roja al empezar. Las 4 fichas que se moverán tienen un número del 1 al 4, según el orden de las jugadas.",
          tekst: "Antes: las fichas que se mueven, en orden.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "La punta roja después de 4 jugadas, con las 4 casillas donde han caído las fichas numeradas en las filas delante de la punta, y 4 huecos que han quedado en la punta.",
          tekst: "Después: dónde han caído.",
        })}
      </div>
      <p>Cada jugada prepara la siguiente. Las jugadas 2 y 3 acaban con un salto por encima de la ficha que acaba de moverse, y la jugada 4 empieza por el hueco que dejó la jugada 3. Las 4 fichas caen en tu mitad del tablero.</p>
      <p>Hay más líneas que llegan a 13. Lo que tienen en común es la idea: busca la jugada que deja un hueco o un escalón para la jugada siguiente, y saca la ficha del extremo como muy tarde en la jugada 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Errores en las primeras jugadas</h2>
      <ul class="tips">
        <li><strong>Mover la misma ficha en cada turno.</strong> Una ficha que corre sola avanza 5 filas en 4 jugadas, frente a 13 con 4 fichas distintas. Además deja el resto de tus fichas donde estaban.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "La punta roja al empezar. Una ficha de la segunda fila hace 4 jugadas seguidas por una misma línea, con flechas y los números del 1 al 4, y acaba sola cerca del centro del tablero.",
  tekst: "Una ficha, 4 jugadas, 5 filas.",
})}
      <ul class="tips">
        <li><strong>Dar solo pasos con la fila de delante.</strong> 4 pasos avanzan 4 filas. Después la ficha del extremo sigue sin poder moverse, así que se queda atrás mientras el resto avanza.</li>
        <li><strong>Dar pasos de lado.</strong> Un paso a lo largo de una fila avanza 0 filas. Después de la jugada 1 de la apertura 1, la ficha de delante puede dar un paso a la casilla de al lado, y parece progreso, pero la jugada se pierde.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Sigue adelante</h2>
      <p>Después de unas 4 jugadas, los dos ejércitos se acercan, y las aperturas de arriba dan paso al medio de la partida. No hace falta que recuerdes las líneas: recuerda que cada jugada debe preparar la siguiente.</p>
      <ul>
        <li><a href="/play/">Juega contra el ordenador en tu navegador</a> y prueba la apertura 1 o 2.</li>
        <li><a href="/es/guias/estrategia-damas-chinas">Estrategia de las damas chinas</a>: escaleras, mantener las fichas juntas y llenar tu objetivo.</li>
        <li><a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>: cómo funciona una partida de dos.</li>
        <li><a href="/es/reglas/damas-chinas">Reglas de las damas chinas</a>, con dibujos de pasos, saltos y cadenas.</li>
      </ul>
    </section>`;

export default {
  nav: "Aperturas de las damas chinas",
  titel: "Aperturas de las damas chinas: 2 aperturas | Leapstone",
  beschrijving: "Aperturas de las damas chinas: cómo saltar fuera de tu punta, liberar la ficha del extremo en la jugada 2, avanzar 13 filas en 4 jugadas y los errores.",
  h1: "Aperturas de las damas chinas",
  intro: "Una buena apertura en las damas chinas salta desde la segunda fila, usa una ficha distinta en cada turno y saca la ficha de tu extremo en la jugada 2 o 4. Dos aperturas con dibujos, y los errores que hay que evitar.",
  inhoud,
};
