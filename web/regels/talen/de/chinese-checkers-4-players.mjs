// Die deutsche Anleitung Sternhalma mit 4 Spielern (Aufgabe 301, Feature 294): /de/anleitungen/sternhalma-zu-viert.
// Inhalt: die englische Anleitung ../en/chinese-checkers-4-players.mjs, Satz für Satz auf Deutsch. Die Regeln kommen aus crates/halma-core
// (Board::star, Game::new_star(4), make_move, resign), das Zeitlimit aus Aufgabe 80, das schnelle Spiel aus Aufgabe 97 und 99.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">So ist das Brett aufgeteilt</h2>
      <p>Jeder Spieler hat 10 Steine, also stehen 40 Steine auf dem Brett mit 121 Feldern. Die vier Startspitzen sind zwei Paare von Spitzen, die nebeneinanderliegen: Rot unten und Blau unten links, Grün oben und Gelb oben rechts.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze, 10 blauen Steinen in der Spitze unten links, 10 grünen Steinen in der oberen Spitze und 10 gelben Steinen in der Spitze oben rechts. Die Spitzen oben links und unten rechts sind leer.",
  tekst: "Rot unten, Blau unten links, Grün oben, Gelb oben rechts.",
})}
      <p>Spieler 1, Rot, zieht zuerst. Danach ist Blau Spieler 2, Grün Spieler 3 und Gelb Spieler 4, und nach Gelb ist wieder Rot dran. Ein Zug ist ein Schritt oder eine Sprungkette mit einem Stein. Schritte und Sprünge findest du in den <a href="/de/regeln/sternhalma">Regeln von Sternhalma</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Wer wem gegenübersteht</h2>
      <p>Die Spitzen liegen sich paarweise gegenüber: Rot gegenüber von Grün und Blau gegenüber von Gelb. Dein Ziel ist die Spitze gegenüber. Rot geht dorthin, wo Grün startet, Grün dorthin, wo Rot startet, Blau dorthin, wo Gelb startet, und Gelb dorthin, wo Blau startet.</p>
      <p>Wie in einer Partie zu zweit ist jedes Ziel am Anfang voll mit den Steinen des Spielers, der dir gegenübersitzt, also kannst du erst dort landen, wenn sie weg sind. Bei 3 Spielern sind die Ziele am Anfang leer, also kann bei 4 niemand sofort fertig sein. Die vier Ziele sind vier verschiedene Spitzen, also will niemand sonst dein Ziel: Ein Spieler, der fertig ist, blockiert nie jemanden.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Die zwei leeren Spitzen</h2>
      <p>Die Spitzen oben links und unten rechts enthalten keine Steine. Sie sind für niemanden Start und für niemanden Ziel. Oben links liegt zwischen Blau und Grün, unten rechts zwischen Gelb und Rot.</p>
      <p>Du darfst auf jedes leere Feld ziehen oder springen, also kannst du diese Spitzen überqueren oder in ihnen stehen bleiben. Ein Stein dort ist aber noch nicht in einem Ziel. In einer leeren Spitze gibt es nichts zum Überspringen, bis jemand Steine dorthin bringt.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Was sich an deiner Taktik ändert</h2>
      <ul>
        <li><strong>Zwei Überquerungen gleichzeitig:</strong> Rot und Grün überqueren das Brett aufeinander zu, und Blau und Gelb auch. Beide Linien laufen durch die Mitte, also ist die Mitte voller als in einer Partie zu zweit, in der nur eine Linie überquert.</li>
        <li><strong>Drei Spieler ziehen zwischen deinen Zügen:</strong> Das Brett verändert sich zwischen zwei Zügen von dir stärker als in einer Partie zu zweit. Sieh es dir zu Beginn jedes Zuges neu an und plane dann deine Sprungkette. Der Spieler, der nach dir zieht, ist nie der, der dir gegenübersitzt.</li>
        <li><strong>Steine helfen allen:</strong> Jeder Stein der anderen drei ist ein Trittstein für dich, und deine sind Trittsteine für sie. Die Steine des Spielers gegenüber ziehen in die Gegenrichtung, wie in einer Partie zu zweit.</li>
        <li><strong>Platz zum Umgehen:</strong> Wenn die Mitte voll ist, sind die leeren Spitzen freier Raum neben den Lagern. Ein Weg durch eine solche Spitze kann ein Weg um das Gedränge herum sein.</li>
        <li><strong>Ein aufgebender Spieler macht dein Ziel frei:</strong> Wenn der Spieler gegenüber aufgibt, verschwinden seine Steine vom Brett, also ist dein Ziel sofort leer.</li>
      </ul>
      <p>Die <a href="/de/anleitungen/sternhalma-strategie">Strategie-Tipps</a> zu Leitern, Nachzüglern und zum Füllen des Ziels von hinten gelten mit 4 Spielern genauso.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gewinnen, und was danach passiert</h2>
      <ul>
        <li><strong>Gewinnen:</strong> Wer zuerst das Ziel mit allen 10 Steinen füllt, gewinnt. Die Partie endet damit nicht: Die anderen drei spielen weiter um die nächsten Plätze, und ein Spieler, der fertig ist, wird übersprungen. Die Steine dieses Spielers bleiben auf dem Brett. Die Partie ist zu Ende, wenn nur noch ein Spieler mitspielt.</li>
        <li><strong>Aufgeben:</strong> Deine Steine verschwinden vom Brett, und die anderen drei spielen weiter. Geben die anderen auch auf, gewinnt der letzte verbleibende Spieler.</li>
        <li><strong>Zeit (online):</strong> In einer Online-Partie hat jeder Zug ein Zeitlimit. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf, und die Partie geht ohne dich weiter.</li>
      </ul>
      <p>Für die Partien mit weniger Spielern lies <a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma mit 2 Spielern</a>. Die <a href="/de/regeln/sternhalma">Regelseite</a> hat Bilder von jeder Startaufstellung.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Wo du in Leapstone mit 4 Spielern spielst</h2>
      <ul>
        <li><strong>Gegen den Computer, sofort:</strong> Öffne <a href="/play/">Leapstone im Browser</a>, tippe auf Computer, wähle das Sternbrett und 3 Computer. Du bist Spieler 1, du ziehst also zuerst. Du wählst Leicht, Normal oder Schwer für die Computer.</li>
        <li><strong>Auf einem Handy:</strong> Tippe auf Spielen, wähle das Sternbrett und 4 Spieler, und tippe dann auf einen Stein, um diesen Platz zwischen Mensch und Computer zu wechseln.</li>
        <li><strong>Online mit Freunden:</strong> Tippe auf Freunde, wähle das Sternbrett, 4 Spieler und die Zeit pro Zug, und schicke den Einladungslink. Die Partie beginnt, wenn alle 4 Plätze besetzt sind.</li>
        <li><strong>Schnelles Spiel, in der App:</strong> Tippe auf Online spielen. Während die App ein Spiel für 2 sucht, tippe auf 4 oder 6 Spieler suchen, um stattdessen ein Spiel für 4 zu suchen. Jeder Zug dauert 30 Sekunden. Wenn innerhalb von 20 Sekunden nicht genug Spieler beitreten, füllen Computerspieler die leeren Plätze, manche Gegner können also Computerspieler sein.</li>
      </ul>
    </section>`;

export default {
  nav: "Sternhalma mit 4 Spielern",
  titel: "Sternhalma mit 4 Spielern: Aufbau und Tipps | Leapstone",
  beschrijving: "So funktioniert Sternhalma mit 4 Spielern: wie das Brett aufgeteilt ist, welche 2 Spitzen leer bleiben, wer wem gegenübersteht, Taktik und wo du spielst.",
  h1: "Sternhalma (Chinese Checkers) mit 4 Spielern",
  intro: "Mit 4 Spielern startet jeder von euch in einer von vier Spitzen des Sterns, und zwei Spitzen bleiben leer. Rot steht Grün gegenüber und Blau Gelb: Dein Ziel ist die Spitze gegenüber, voll mit den Steinen dieses Spielers. Hier findest du den Aufbau, die leeren Spitzen, die Taktik und wo du es spielen kannst.",
  inhoud,
};
