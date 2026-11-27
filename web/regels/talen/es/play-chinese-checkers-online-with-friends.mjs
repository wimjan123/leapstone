// La guía Jugar a las damas chinas en línea con amigos (taak 304). Contenido: ../en/play-chinese-checkers-online-with-friends.mjs, el texto sigue el inglés frase por frase.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Los pasos, desde el principio hasta la primera jugada</h2>
      <ol>
        <li><strong>Elige un nombre de jugador.</strong> Es todo lo que necesitas para entrar.</li>
        <li><strong>Crea una partida en línea.</strong> Elige el tablero, el número de jugadores y el tiempo por movimiento.</li>
        <li><strong>Envía el enlace de invitación.</strong> Compártelo desde la sala de espera, o cópialo y pégalo en cualquier aplicación de chat.</li>
        <li><strong>Espera a que todos lo abran.</strong> Cuando se ocupa el último sitio, la partida empieza y mueves tú primero.</li>
      </ol>
      <p>El resto de esta página explica cada parte, y qué pasa cuando un amigo deja de jugar.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Cómo funciona el enlace de invitación</h2>
      <p>Una partida tiene un solo enlace de invitación, y todos los amigos usan el mismo. Cada amigo que lo abre ocupa el siguiente sitio libre. Tú creaste la partida, así que eres el jugador 1 y ocupas el primer sitio.</p>
      <ul>
        <li><strong>Cuántos sitios:</strong> en el tablero de estrella una partida tiene 2, 3, 4 o 6 jugadores, y en el tablero cuadrado 2 o 4. Lo eliges antes de enviar el enlace. La partida no empieza con sitios vacíos, y no hay ningún movimiento hasta que se ocupa el último sitio.</li>
        <li><strong>La sala de espera:</strong> mientras esperas, la sala de espera muestra quién ha entrado y cuántos sitios siguen libres. Se actualiza sola cuando entra un amigo.</li>
        <li><strong>Compartir:</strong> el botón «Invitación» abre el menú de compartir de tu móvil. Si no está disponible, copia el enlace, y puedes pegarlo tú mismo.</li>
        <li><strong>En el navegador o en la aplicación:</strong> el enlace funciona sin la aplicación, en un navegador. Si tu amigo tiene la aplicación, el enlace puede abrirla.</li>
        <li><strong>Un enlace lleno o desconocido:</strong> cuando todos los sitios están ocupados, el enlace indica que la partida está llena. Un enlace que no existe indica que la invitación no existe. En ambos casos, pide un enlace nuevo a tu amigo.</li>
      </ul>
      <p>El enlace es solo para esta partida. Tiene 16 caracteres aleatorios, así que nadie puede adivinarlo, pero quien lo consiga puede ocupar un sitio libre. Envíalo solo a las personas con las que quieres jugar.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Sin cuenta, solo un nombre de jugador</h2>
      <p>No necesitas correo electrónico ni contraseña. Eliges un nombre de jugador de 1 a 30 caracteres, y los demás jugadores ven ese nombre. Algunos nombres groseros se rechazan, y entonces eliges otro.</p>
      <p>Después de elegir el nombre, la aplicación muestra un código de recuperación de 20 caracteres, en cinco grupos. Guárdalo. Si tienes un móvil nuevo, introduces el código y recuperas tu nombre de jugador. Sin el código, no puedes recuperar tu nombre en un móvil nuevo.</p>
      <p>Tus amigos hacen lo mismo cuando abren tu enlace: primero eligen un nombre, y luego se unen a tu partida.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Tiempo por movimiento: cuánto puede pensar un amigo</h2>
      <p>El tiempo por movimiento es el máximo de tiempo que tiene un jugador para una jugada. Lo fijas al crear la partida, y vale para todos en esa partida.</p>
      <ul>
        <li><strong>Las opciones:</strong> 15 segundos, 30 segundos, 1 minuto o 2 minutos. También puedes desactivarlo, sin ningún límite. La aplicación empieza con 30 segundos.</li>
        <li><strong>El reloj:</strong> el servidor lleva el tiempo, así que un móvil con el reloj mal puesto no lo cambia. La aplicación muestra cuánto tiempo queda.</li>
        <li><strong>El primer reloj:</strong> empieza cuando se ocupa el último sitio. Antes, nadie tiene el tiempo en contra.</li>
        <li><strong>Una partida rápida:</strong> si pulsas «Jugar en línea» para jugar contra un desconocido, el tiempo por movimiento es fijo: 30 segundos. Solo una partida con amigos te deja elegir.</li>
      </ul>
      <p>Para amigos que juegan desde el sofá, 2 minutos o sin límite es relajado. Para una partida rápida, elige 15 segundos. Sin límite, una partida puede esperar todo lo que haga falta, y la terminas cuando tengas tiempo.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Qué pasa cuando alguien se va</h2>
      <p>Una partida vive en el servidor, no en un móvil. Si un amigo cierra la aplicación, pierde la conexión o se queda dormido, la partida se queda donde está, y el amigo la vuelve a encontrar en «Mis partidas».</p>
      <ul>
        <li><strong>Se acaba el tiempo:</strong> se salta el turno de ese jugador. No se mueve nada en el tablero, y el tiempo pasa al siguiente jugador.</li>
        <li><strong>Tres turnos seguidos:</strong> un jugador que pierde 3 turnos seguidos se rinde solo. Cada movimiento que sí hace el jugador devuelve la cuenta a cero.</li>
        <li><strong>Rendirse:</strong> a un jugador que se rinde, por decisión propia o tras perder 3 turnos, se le retiran las fichas del tablero, así que no bloquean a nadie.</li>
        <li><strong>Una partida de 2:</strong> la partida termina y gana el otro jugador.</li>
        <li><strong>Una partida de 3, 4 o 6:</strong> la partida sigue sin el jugador que se ha ido, y el turno pasa al siguiente jugador que sigue en juego.</li>
        <li><strong>Sin tiempo por movimiento:</strong> si elegiste sin límite, la partida nunca salta un turno. Espera hasta que el amigo vuelva, o hasta que se rinda.</li>
      </ul>
      <p>Si has activado las notificaciones, la aplicación te avisa cuando es tu turno, también cuando está cerrada. Actívalas desde la aplicación, o en los ajustes de tu móvil o de tu navegador.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Después de la partida</h2>
      <p>Los jugadores que juegan juntos mediante una invitación se añaden a la lista de amigos de los demás. Desde ahí puedes retar a un amigo a una partida nueva, sin enlace nuevo. Tus partidas abiertas y terminadas están en «Mis partidas».</p>
      <p>¿Eres nuevo con las reglas? Lee las <a href="/es/reglas/damas-chinas">reglas de las damas chinas</a>. ¿Jugáis dos? Lee <a href="/es/guias/damas-chinas-2-jugadores">Damas chinas para 2 jugadores</a>. ¿Quieres ganar? Lee los <a href="/es/guias/estrategia-damas-chinas">consejos de estrategia</a>.</p>
      <p><a href="/es/guias/damas-chinas-3-jugadores">Damas chinas para 3 jugadores</a></p>
    </section>`;

export default {
  nav: "Damas chinas en línea con amigos",
  titel: "Jugar a las damas chinas en línea con amigos | Leapstone",
  beschrijving: "Juega a las damas chinas en línea con amigos: envía un enlace de invitación, fija el tiempo por movimiento y mira qué pasa si alguien se va.",
  h1: "Jugar a las damas chinas en línea con amigos",
  intro: "Crea una partida, envía un solo enlace de invitación y jugad cuando todos se hayan unido. Solo necesitas un nombre de jugador, y el tiempo por movimiento lo fijas tú.",
  inhoud,
};
