// Die deutsche Anleitung Sternhalma zu dritt (Aufgabe 299): /de/anleitungen/sternhalma-zu-dritt.
// Inhalt: die englische Anleitung ../en/chinese-checkers-3-players.mjs, Satz für Satz auf Deutsch. Die Regeln kommen aus crates/halma-core;
// die Kontrolle steht in docs/plan.md, Aufgabe 139. Ändert sich eine Regel, ändere beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">So beginnt die Partie</h2>
      <p>Jeder Spieler hat 10 Steine, also stehen 30 Steine auf dem Brett mit 121 Feldern. Sie beginnen in jeder zweiten Spitze des Sterns: Rot unten, Blau oben links und Grün oben rechts. Die drei Spitzen dazwischen sind leer.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze, 10 blauen Steinen in der Spitze oben links und 10 grünen Steinen in der Spitze oben rechts",
  tekst: "Rot unten, Blau oben links, Grün oben rechts.",
})}
      <p>Spieler 1, Rot, zieht zuerst. Danach ist Blau Spieler 2, Grün ist Spieler 3, und nach Grün ist wieder Rot dran. Ein Zug ist ein Schritt oder eine Sprungkette mit einem Stein. Schritte und Sprünge findest du in den <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Drei Ziele, am Anfang alle leer</h2>
      <p>Dein Ziel ist die Spitze gegenüber deinem Start, und mit 3 Spielern ist sie am Anfang leer. Es ist die leere Spitze zwischen den Startspitzen der beiden anderen Spieler: Das Ziel von Rot ist oben, das von Blau unten rechts und das von Grün unten links.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Das Sternbrett für drei Spieler. Gestrichelte Kreise in der Farbe jedes Spielers markieren die drei leeren Ziele: Rot oben, Blau unten rechts, Grün unten links.",
  tekst: "Jedes Ziel hat die Farbe seines Spielers.",
})}
      <p>Du gewinnst, wenn du alle 10 Steine in dein Ziel gebracht hast. Alle 10 Felder müssen eigene Steine enthalten. Niemand beginnt in deinem Ziel, aber du darfst auf jedem leeren Feld stehen bleiben, also kann später ein Stein eines anderen Spielers dort landen. Solange er dort steht, kannst du nicht fertig werden.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gewinnen, und was danach passiert</h2>
      <ul>
        <li><strong>Gewinnen:</strong> Wer als Erster das Ziel füllt, gewinnt. Die Partie endet damit nicht: Die anderen beiden spielen um die nächsten Plätze weiter, und der Spieler, der fertig ist, wird übersprungen. Die Partie ist zu Ende, wenn nur noch ein Spieler mitspielt.</li>
        <li><strong>Aufgeben:</strong> Deine Steine verschwinden vom Brett, und die anderen beiden spielen weiter. Gibt ein zweiter Spieler auf, bevor jemand fertig ist, gewinnt der letzte verbliebene Spieler.</li>
        <li><strong>Zeit (online):</strong> In einer Online-Partie hat jeder Zug ein Zeitlimit, das der Spieler festlegt, der die Partie startet. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf, und die Partie geht ohne dich weiter.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Wie sich das vom Spiel zu zweit unterscheidet</h2>
      <ul>
        <li><strong>Mehr Steine:</strong> 30 auf dem Brett, gegen 20 mit 2 Spielern.</li>
        <li><strong>Leere Ziele:</strong> Mit 2 Spielern ist dein Ziel am Anfang voll mit den Steinen des anderen Spielers. Mit 3 ist es leer.</li>
        <li><strong>Zwei Gegner:</strong> Nach deinem Zug ziehen zwei andere Spieler, bevor du wieder dran bist. Die Steine von beiden sind Trittsteine für dich, und deine für sie. Eine Leiter, die du baust, können beide nutzen, und der Spieler nach dir ist als Erster dran.</li>
        <li><strong>Die Partie geht weiter:</strong> Mit 2 Spielern endet die Partie, wenn einer von euch fertig ist. Mit 3 geht sie um den zweiten und dritten Platz weiter.</li>
      </ul>
      <p>Für das Spiel zu zweit lies <a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>. Die <a href="/de/anleitungen/sternhalma-strategie">Strategie-Tipps</a> handeln von Schritten und Sprüngen, und die sind mit 3 Spielern dieselben.</p>
      <p><a href="/de/anleitungen/sternhalma-online-mit-freunden">Sternhalma online mit Freunden</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Wo du in Leapstone zu dritt spielst</h2>
      <ul>
        <li><strong>Gegen den Computer, sofort:</strong> Öffne <a href="/play/">Leapstone im Browser</a>, tippe auf Computer, wähle das Sternbrett und 2 Computer. Du bist Spieler 1, du ziehst also zuerst. Du wählst Leicht, Normal oder Schwer für die Computer.</li>
        <li><strong>An einem Handy:</strong> Tippe auf „Auf diesem Handy“, wähle das Sternbrett und 3 Spieler, und tippe dann auf einen Stein, um diesen Platz zwischen Mensch und Computer zu wechseln.</li>
        <li><strong>Online mit Freunden:</strong> Tippe auf Freunde, wähle das Sternbrett, 3 Spieler und die Zeit pro Zug, und schicke den Einladungslink. Die Partie beginnt, wenn alle 3 Plätze besetzt sind.</li>
        <li><strong>Schnelle Spiele:</strong> Online spielen findet Partien für 2 oder 4 Spieler, also gibt es kein schnelles Spiel für 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Sternhalma zu dritt",
  titel: "Sternhalma zu dritt: Aufbau und Regeln | Leapstone",
  beschrijving: "So funktioniert Sternhalma mit 3 Spielern: Wo die 30 Steine beginnen, welche leere Spitze jedes Ziel ist, wer zuerst zieht und wie du gewinnst.",
  h1: "Sternhalma (Chinese Checkers) zu dritt",
  intro: "Wie eine Partie zu dritt auf dem Sternbrett abläuft: der Aufbau, die drei Ziele, wer zuerst zieht, wie du gewinnst und wo du sie spielen kannst.",
  inhoud,
};
