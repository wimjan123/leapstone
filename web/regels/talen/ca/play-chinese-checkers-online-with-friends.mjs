// La guia Jugar a les dames xineses en línia amb amics (taak 304). Contingut: ../en/play-chinese-checkers-online-with-friends.mjs, el text segueix l'anglès frase per frase.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Els passos, des de l'inici fins a la primera jugada</h2>
      <ol>
        <li><strong>Tria un nom de jugador.</strong> Només això necessites per entrar.</li>
        <li><strong>Crea una partida en línia.</strong> Tria el tauler, el nombre de jugadors i el temps per moviment.</li>
        <li><strong>Envia l'enllaç d'invitació.</strong> Comparteix-lo des de la sala d'espera, o copia'l i enganxa'l en qualsevol aplicació de xat.</li>
        <li><strong>Espera que tothom l'obri.</strong> Quan s'ocupa l'última plaça, la partida comença i mous tu primer.</li>
      </ol>
      <p>La resta d'aquesta pàgina explica cada part, i què passa quan un amic deixa de jugar.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Com funciona l'enllaç d'invitació</h2>
      <p>Una partida té un sol enllaç d'invitació, i tots els amics fan servir el mateix. Cada amic que l'obre ocupa la següent plaça lliure. Tu has creat la partida, així que ets el jugador 1 i ocupes la primera plaça.</p>
      <ul>
        <li><strong>Quantes places:</strong> al tauler d'estrella una partida té 2, 3, 4 o 6 jugadors, i al tauler quadrat 2 o 4. Ho tries abans d'enviar l'enllaç. La partida no comença amb places buides, i no hi ha cap moviment fins que s'ocupa l'última plaça.</li>
        <li><strong>La sala d'espera:</strong> mentre esperes, la sala d'espera mostra qui ha entrat i quantes places queden lliures. Es refresca sola quan s'afegeix un amic.</li>
        <li><strong>Compartir:</strong> el botó «Invitació» obre el menú de compartir del mòbil. Si no està disponible, copia l'enllaç, i el pots enganxar tu mateix.</li>
        <li><strong>Al navegador o a l'aplicació:</strong> l'enllaç funciona sense l'aplicació, en un navegador. Si el teu amic té l'aplicació, l'enllaç la pot obrir.</li>
        <li><strong>Un enllaç ple o desconegut:</strong> quan s'han ocupat totes les places, l'enllaç indica que la partida és plena. Un enllaç que no existeix indica que la invitació no existeix. En tots dos casos, demana un enllaç nou al teu amic.</li>
      </ul>
      <p>L'enllaç és només per a aquesta partida. Té 16 caràcters aleatoris, així que ningú no el pot endevinar, però qualsevol que l'aconsegueixi pot ocupar una plaça lliure. Envia'l només a la gent amb qui vols jugar.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Sense compte, només un nom de jugador</h2>
      <p>No necessites cap adreça de correu ni cap contrasenya. Tries un nom de jugador d'1 a 30 caràcters, i els altres jugadors veuen aquest nom. Alguns noms grollers es rebutgen, i llavors en tries un altre.</p>
      <p>Després de triar el nom, l'aplicació mostra un codi de recuperació de 20 caràcters, en cinc grups. Guarda'l. Si tens un mòbil nou, introdueixes el codi i recuperes el teu nom de jugador. Sense el codi, no pots recuperar el nom en un mòbil nou.</p>
      <p>Els teus amics fan el mateix quan obren el teu enllaç: primer trien un nom, i després s'uneixen a la teva partida.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Temps per moviment: quant pot pensar un amic</h2>
      <p>El temps per moviment és el màxim de temps que té un jugador per a una jugada. L'estableixes en crear la partida, i val per a tothom en aquella partida.</p>
      <ul>
        <li><strong>Les opcions:</strong> 15 segons, 30 segons, 1 minut o 2 minuts. També el pots desactivar, sense cap límit. L'aplicació comença amb 30 segons.</li>
        <li><strong>El rellotge:</strong> el servidor porta el temps, així que un mòbil amb el rellotge mal posat no el canvia. L'aplicació mostra quant temps queda.</li>
        <li><strong>El primer rellotge:</strong> comença quan s'ocupa l'última plaça. Abans, ningú no té el temps en contra.</li>
        <li><strong>Una partida ràpida:</strong> si toques «Jugar en línia» per jugar contra un desconegut, el temps per moviment és fix: 30 segons. Només una partida amb amics et deixa triar.</li>
      </ul>
      <p>Per a amics que juguen des del sofà, 2 minuts o sense límit és relaxat. Per a una partida ràpida, tria 15 segons. Sense límit, una partida pot esperar tant com calgui, i l'acabes quan tens temps.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Què passa quan algú plega</h2>
      <p>Una partida viu al servidor, no en un mòbil. Si un amic tanca l'aplicació, perd la connexió o s'adorm, la partida es queda on és, i l'amic la torna a trobar a «Les meves partides».</p>
      <ul>
        <li><strong>S'acaba el temps:</strong> se salta el torn d'aquest jugador. No es mou res al tauler, i el temps passa al jugador següent.</li>
        <li><strong>Tres torns seguits:</strong> un jugador que perd 3 torns seguits abandona per si sol. Cada moviment que sí fa el jugador torna el recompte a zero.</li>
        <li><strong>Abandonar:</strong> un jugador que abandona, per decisió pròpia o després de 3 torns perduts, veu retirades les seves fitxes del tauler, així que no bloquegen ningú.</li>
        <li><strong>Una partida de 2:</strong> la partida s'acaba i guanya l'altre jugador.</li>
        <li><strong>Una partida de 3, 4 o 6:</strong> la partida continua sense el jugador que ha marxat, i el torn passa al següent jugador que encara hi és.</li>
        <li><strong>Sense temps per moviment:</strong> si has triat sense límit, la partida no se salta mai cap torn. Espera fins que l'amic torni, o fins que abandoni.</li>
      </ul>
      <p>Si has activat les notificacions, l'aplicació t'avisa quan és el teu torn, també quan està tancada. Activa-les des de l'aplicació, o a la configuració del mòbil o del navegador.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Després de la partida</h2>
      <p>Els jugadors que juguen junts mitjançant una invitació s'afegeixen a la llista d'amics els uns dels altres. Des d'allà pots desafiar un amic a una partida nova, sense enllaç nou. Les teves partides obertes i acabades són a «Les meves partides».</p>
      <p>Ets nou amb les regles? Llegeix les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a>. Jugueu dos? Llegeix <a href="/ca/guies/dames-xineses-2-jugadors">Dames xineses per a 2 jugadors</a>. Vols guanyar? Llegeix els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a>.</p>
      <p><a href="/ca/guies/dames-xineses-3-jugadors">Dames xineses per a 3 jugadors</a></p>
    </section>`;

export default {
  nav: "Dames xineses en línia amb amics",
  titel: "Jugar a les dames xineses en línia amb amics | Leapstone",
  beschrijving: "Juga a les dames xineses en línia amb amics: envia un enllaç d'invitació, fixa el temps per moviment i mira què passa si algú plega.",
  h1: "Jugar a les dames xineses en línia amb amics",
  intro: "Crea una partida, envia un sol enllaç d'invitació i jugueu quan tothom s'hagi unit. Només necessites un nom de jugador, i el temps per moviment el fixes tu.",
  inhoud,
};
