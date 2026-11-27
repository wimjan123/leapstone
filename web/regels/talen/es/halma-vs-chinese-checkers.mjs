// La guía Halma o damas chinas en español (taak 300). Contenido: la guía inglesa ../en/halma-vs-chinese-checkers.mjs, frase por frase.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Damas chinas: el tablero en estrella, 121 casillas",
    alt: "El tablero en estrella con 10 fichas rojas en la punta de abajo y 10 fichas azules en la punta de arriba",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: el tablero cuadrado, 256 casillas",
    alt: "El tablero cuadrado con 19 fichas rojas en la esquina de arriba a la izquierda y 19 fichas azules en la esquina de abajo a la derecha",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Tablero en estrella: seis vecinas, tres de ellas vacías aquí",
    alt: "Una ficha roja con un anillo blanco alrededor. Tres de sus seis vecinas están vacías y marcadas; las otras tres tienen fichas.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Tablero cuadrado: ocho vecinas, cinco de ellas vacías aquí",
    alt: "Una ficha roja con un anillo blanco alrededor. Cinco de sus ocho vecinas están vacías y marcadas; las otras tres tienen fichas.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">La respuesta corta</h2>
      <p>El Halma se juega en un tablero cuadrado y las damas chinas en un tablero con forma de estrella de seis puntas. En los dos juegos mueves tus fichas con pasos y saltos por el tablero, y gana el primer jugador que llena el campamento del lado opuesto.</p>
      <p>Lo que cambia es el tablero, las direcciones en las que te mueves, cuántas personas pueden jugar y cuántas fichas tiene cada una. El <a href="/es/reglas/que-es-sternhalma">Sternhalma</a> es el nombre del Halma en un tablero en estrella, así que es el mismo juego que las damas chinas.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Los tableros</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Las damas chinas</strong> usan el tablero en estrella: 121 casillas, con una punta de 10 casillas en cada uno de los seis extremos. Una punta es un triángulo de filas de 4, 3, 2 y 1 casillas.</li>
        <li><strong>El Halma</strong> usa el tablero cuadrado: 16 por 16 casillas, 256 en total. Un campamento está en una esquina. Un campamento grande tiene filas de 5, 5, 4, 3 y 2 casillas, y uno pequeño filas de 4, 4, 3 y 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Direcciones: seis u ocho</h2>
      <p>En el tablero en estrella una casilla tiene seis vecinas. En el cuadrado tiene ocho, porque las diagonales también cuentan. Un paso va a una vecina vacía. Un salto pasa por encima de una ficha que está junto a la tuya, en línea recta, hasta la casilla vacía de detrás, en cualquiera de esas direcciones y también hacia atrás.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Una casilla del borde tiene menos vecinas, y una esquina del tablero cuadrado tiene tres. Seis direcciones forman tres líneas que pasan por una casilla del tablero en estrella. Ocho direcciones forman cuatro líneas en el tablero cuadrado: de lado a lado, de arriba abajo y dos diagonales.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Jugadores y fichas</h2>
      <ul>
        <li><strong>Damas chinas:</strong> 2, 3, 4 o 6 jugadores. Cada uno tiene 10 fichas, así que el tablero tiene 20, 30, 40 o 60 fichas.</li>
        <li><strong>Halma:</strong> 2 o 4 jugadores. Con 2 jugadores cada uno tiene 19 fichas, 38 en total. Con 4 jugadores cada uno tiene 13 fichas, 52 en total.</li>
      </ul>
      <p>El tablero cuadrado no tiene partida para 3 o 6 jugadores en Leapstone. Para una partida de tres, lee <a href="/es/guias/damas-chinas-3-jugadores">Damas chinas para 3 jugadores</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Lo que es igual</h2>
      <ul>
        <li><strong>Una jugada:</strong> un paso, o una cadena de saltos con una ficha. Tú decides dónde termina la cadena, y no puedes dar un paso después de un salto.</li>
        <li><strong>Cualquier color:</strong> saltas por encima de una ficha de cualquier color, también de la tuya. La ficha que saltas se queda donde está. No se captura nada.</li>
        <li><strong>El objetivo:</strong> el campamento de enfrente de donde empezaste. Todas sus casillas deben tener fichas tuyas. Mientras haya una ficha de otro jugador, no puedes terminar.</li>
        <li><strong>Ganar:</strong> gana el primer jugador que llena el objetivo. Con 2 jugadores la partida termina entonces. Con más jugadores los demás siguen jugando por los puestos siguientes, y el jugador que ya ha terminado se salta.</li>
        <li><strong>Abandonar y tiempo:</strong> cuando abandonas, tus fichas salen del tablero. En una partida en línea cada jugada tiene un tiempo límite, y si pierdes 3 turnos seguidos, abandonas.</li>
      </ul>
      <p>Lee las reglas completas de las <a href="/es/reglas/damas-chinas">damas chinas</a> y del <a href="/es/reglas/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Qué tablero elegir en Leapstone</h2>
      <ul>
        <li><strong>3 o 6 jugadores:</strong> solo el tablero en estrella los tiene.</li>
        <li><strong>Más fichas cada uno:</strong> el tablero cuadrado, con 19 fichas cada uno para 2 jugadores o 13 para 4, frente a 10 en el tablero en estrella.</li>
        <li><strong>Jugar en línea:</strong> una partida rápida se juega en el tablero en estrella. Con amigos y contra el ordenador puedes elegir cualquiera de los dos tableros.</li>
      </ul>
      <p>El botón Juega ahora abre una partida contra el ordenador en el tablero en estrella. Para jugar en el tablero cuadrado, toca la flecha hacia atrás de arriba y elige el Tablero cuadrado en el menú.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Sigue adelante</h2>
      <ul>
        <li><a href="/play/">Juega en el navegador</a> y prueba los dos tableros.</li>
        <li><a href="/es/guias/estrategia-damas-chinas">Estrategia de las damas chinas</a>: seis consejos con dibujos.</li>
        <li><a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>: cómo funciona una partida de dos.</li>
      </ul>
      <p><a href="/es/guias/damas-chinas-online-con-amigos">Damas chinas en línea con amigos</a></p>
    </section>`;

export default {
  nav: "Halma o damas chinas",
  titel: "Halma o damas chinas: las diferencias | Leapstone",
  beschrijving: "¿Halma o damas chinas? El tablero cuadrado y el tablero en estrella, seis u ocho direcciones, jugadores y fichas, y lo que es igual.",
  h1: "Halma o damas chinas",
  intro: "Dos juegos con una misma idea: llevar todas tus fichas al otro lado del tablero. Qué cambia, qué es igual y dónde jugar a los dos.",
  inhoud,
};
