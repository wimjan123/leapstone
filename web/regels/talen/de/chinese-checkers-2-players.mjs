// Die deutsche Anleitung Sternhalma zu zweit (Aufgabe 133): /de/anleitungen/sternhalma-zu-zweit.
// Inhalt: die englische Anleitung ../en/chinese-checkers-2-players.mjs, Satz für Satz auf Deutsch. Die Regeln kommen aus crates/halma-core
// (Board::star, Game::new_star(2), make_move, resign), das Zeitlimit aus "Regels" und Aufgabe 80, die Stufen des Computers aus
// crates/halma-core/src/computer.rs. Was die App zeigt, kommt aus web/src/Startmenu.svelte und der Landingspagina.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">So beginnt die Partie</h2>
      <p>Jeder Spieler hat 10 Steine. Sie beginnen in zwei Spitzen des Sterns, die sich gegenüberliegen: Rot unten, Blau oben. Die 20 Steine stehen auf einem Brett mit 121 Feldern.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze und 10 blauen Steinen in der oberen Spitze",
  tekst: "Rot beginnt unten, Blau oben.",
})}
      <p>Spieler 1, Rot, zieht zuerst. Danach seid ihr abwechselnd dran, mit je einem Zug. Ein Zug ist ein Schritt oder eine Sprungkette mit einem Stein. Schritte und Sprünge findest du in den <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Dein Ziel ist der Start des anderen Spielers</h2>
      <p>Du gewinnst, wenn du alle 10 Steine in die Spitze gebracht hast, in der der andere Spieler begonnen hat. Diese Spitze ist am Anfang voll mit seinen Steinen, und deine ist voll mit deinen. Für Rot ist das die obere Spitze im Bild oben.</p>
      <p>Du kannst nur auf einem leeren Feld landen, also muss jeder von euch seine eigene Spitze verlassen, bevor der andere sie füllen kann. Keiner von euch kann fertig werden, solange ein Stein des anderen im Ziel bleibt. Und weil ihr dieselbe Mitte in entgegengesetzten Richtungen überquert, sind die Steine des anderen Spielers Trittsteine für dich, und deine für ihn. Lies die <a href="/de/anleitungen/sternhalma-strategie">Strategie-Tipps</a>, was du damit anfangen kannst.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gewinnen und aufgeben</h2>
      <ul>
        <li><strong>Gewinnen:</strong> Wer zuerst das Ziel mit allen 10 Steinen füllt, gewinnt, und die Partie ist sofort zu Ende. Der andere Spieler spielt nicht weiter.</li>
        <li><strong>Aufgeben:</strong> Deine Steine verschwinden vom Brett, und der andere Spieler gewinnt.</li>
        <li><strong>Zeit (online):</strong> In einer Online-Partie hat jeder Zug ein Zeitlimit. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Wie sich 3, 4 und 6 Spieler unterscheiden</h2>
      <ul>
        <li><strong>3 Spieler:</strong> Die Steine beginnen in jeder zweiten Spitze, und die drei Ziele sind am Anfang leer. Wer zuerst fertig ist, gewinnt; die anderen spielen weiter um die nächsten Plätze, und ein Spieler, der fertig ist, wird übersprungen.</li>
        <li><strong>4 Spieler:</strong> zwei Paare von Spitzen nebeneinander. Dein Ziel ist am Anfang voll mit den Steinen eines anderen Spielers. Nach dem ersten Fertigen geht die Partie weiter, wie bei 3.</li>
        <li><strong>6 Spieler:</strong> alle sechs Spitzen. Auf dem Brett stehen 60 Steine, gegen 20 bei 2 Spielern.</li>
      </ul>
      <p>Mit nur 20 Steinen auf dem Brett gibt es weniger Steine zum Überspringen, also zählen die Leitern, die du selbst baust, mehr. Die <a href="/de/regeln/sternhalma">Regelseite</a> hat Bilder von jeder Startaufstellung.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Wo du in Leapstone zu zweit spielst</h2>
      <ul>
        <li><strong>Gegen den Computer, sofort:</strong> Öffne <a href="/play/">Leapstone im Browser</a>, tippe auf Computer und wähle das Sternbrett. Ein Computer ist voreingestellt, das ist also eine Partie zu zweit. Du wählst Leicht, Normal oder Schwer, und du bist Spieler 1, du ziehst also zuerst. Leicht wählt den besten von drei zufälligen Zügen. Normal wählt den Zug mit dem meisten Fortschritt zum Ziel. Schwer schaut auch, wie seine Gegner antworten können, und auf seinen eigenen nächsten Zug.</li>
        <li><strong>Online spielen, in der App:</strong> ein schnelles Spiel auf dem Sternbrett für 2 Spieler, gegen einen anderen Spieler deines Levels, mit 30 Sekunden pro Zug. Manche Online-Gegner können Computerspieler sein.</li>
        <li><strong>Mit einem Freund:</strong> Schicke einen Einladungslink und stelle die Zeit pro Zug selbst ein. Oder reiche ein Handy hin und her.</li>
      </ul>
      <p><a href="/de/anleitungen/sternhalma-online-mit-freunden">Sternhalma online mit Freunden</a></p>
      <p><a href="/de/anleitungen/sternhalma-zu-dritt">Sternhalma zu dritt</a></p>
    </section>`;

export default {
  nav: "Sternhalma zu zweit",
  titel: "Sternhalma zu zweit: Aufbau und Regeln | Leapstone",
  beschrijving: "So funktioniert Sternhalma mit 2 Spielern: Wo die 10 Steine beginnen, wer zuerst zieht, wie du gewinnst oder aufgibst, und wo du kostenlos spielst.",
  h1: "Sternhalma (Chinese Checkers) zu zweit",
  intro: "Wie eine Partie zu zweit auf dem Sternbrett abläuft: der Aufbau, wer zuerst zieht, wie du gewinnst und wo du sie spielen kannst.",
  inhoud,
};
