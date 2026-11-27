// De gids Sternhalma zu sechst (taak 302): /de/anleitungen/sternhalma-zu-sechst.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Duits. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">So beginnt die Partie</h2>
      <p>Jeder Spieler hat 10 Steine, und alle 6 Spitzen des Sterns sind in Gebrauch. Das ergibt 60 Steine auf einem Brett mit 121 Feldern. Die 61 Felder in der Mitte sind am Anfang leer.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 10 Steinen in jeder seiner 6 Spitzen, in 6 Farben",
  tekst: "6 Spieler, 6 Spitzen, 60 Steine.",
})}
      <p>Spieler 1, Rot, zieht zuerst, von der unteren Spitze aus. Danach geht der Zug von Spieler 1 bis Spieler 6, und nach Spieler 6 ist wieder Spieler 1 dran. Die Spieler sind in der Reihenfolge ihrer Spitzen rund um den Stern nummeriert, also beginnt der Spieler nach dir immer in der Spitze neben deiner. Ein Zug ist ein Schritt oder eine Sprungkette mit einem Stein. Schritte und Sprünge findest du in den <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Jedes Ziel ist am Anfang voll</h2>
      <p>Du gewinnst, wenn du alle 10 deiner Steine in die Spitze auf der anderen Seite des Bretts gebracht hast. Bei 6 Spielern ist das die Spitze, in der der Spieler dir gegenüber beginnt, also ist kein Ziel leer: Jedes Ziel beginnt voll mit den Steinen eines anderen Spielers. Für Rot ist das Ziel die obere Spitze, in der Spieler 4 beginnt.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 6 vollen Spitzen. Ein gestrichelter Ring markiert die obere Spitze, das Ziel des roten Spielers, das die Steine des Spielers gegenüber enthält.",
  tekst: "Das Ziel von Rot ist die Spitze gegenüber, voll mit den Steinen von Spieler 4.",
})}
      <p>Du kannst nur auf einem leeren Feld landen, also muss der Spieler gegenüber seine Spitze verlassen, bevor du sie füllen kannst, und du musst deine verlassen, bevor er seine füllen kann. Bei einer Partie mit 2 Spielern ist das alles. Bei 6 müsst ihr beide außerdem noch durch das Gedränge der 4 anderen.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Eine volle Mitte</h2>
      <p>Jedes Ziel liegt auf der anderen Seite des Bretts, und die Spitzen sind nur über die Mitte miteinander verbunden, also müssen alle 60 Steine über dieselben 61 Felder. Am Anfang hat noch niemand die Mitte überquert, und sie füllt sich schnell.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Ein roter Stein springt in einem Zug dreimal: über einen blauen Stein, dann über einen grünen und dann über einen lila Stein. Die Zahlen 1, 2 und 3 markieren die Landefelder.",
  tekst: "Steine jeder Farbe sind Trittsteine.",
})}
      <p>Du kannst über einen Stein jeder Farbe springen. Steine von 5 anderen Spielern sind Trittsteine für dich, und deine sind Trittsteine für alle 5. Eine Reihe von Steinen, die du in der Mitte stehen lässt, ist eine Leiter für jeden, der sie erreichen kann, und der Spieler nach dir ist als Erster dran.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Blockieren mit 5 Gegnern</h2>
      <ul>
        <li><strong>Das Landefeld füllen:</strong> Ein Sprung braucht ein leeres Feld direkt hinter dem Stein. Wenn du einen Stein dorthin ziehst, ist der Sprung für jeden Spieler weg, der ihn machen wollte.</li>
        <li><strong>Auf die Leitern achten, die du baust:</strong> Nach deinem Zug ziehen die anderen 5 Spieler, bevor du wieder dran bist. Eine Leiter hilft ihnen allen.</li>
        <li><strong>Jeder kann ein Ziel blockieren:</strong> Ein Stein eines beliebigen anderen Spielers in deinem Ziel hindert dich am Fertigwerden, nicht nur ein Stein des Spielers gegenüber. Alle 10 Felder des Ziels müssen deine eigenen Steine enthalten.</li>
      </ul>
      <p>Die <a href="/de/anleitungen/sternhalma-strategie">Strategie-Tipps</a> zeigen, wie ein blockierter Sprung aussieht und wie du keinen Stein eines anderen Spielers in deinem eigenen Ziel einsperrst.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Wie lange eine Partie dauert</h2>
      <p>Bei einer Partie mit 6 Spielern sind 60 Steine zu bewegen, und zwischen einem Zug von dir und dem nächsten ziehen die anderen 5 Spieler je einmal. Sie endet außerdem nicht, wenn der erste Spieler fertig ist.</p>
      <ul>
        <li><strong>Gewinnen und weiterspielen:</strong> Wer als Erster das Ziel füllt, gewinnt, und die anderen spielen um die nächsten Plätze weiter. Ein Spieler, der fertig ist, wird übersprungen, und seine Steine bleiben als Trittsteine auf dem Brett. Die Partie ist vorbei, wenn nur noch ein Spieler mitspielt.</li>
        <li><strong>Aufgeben:</strong> Deine Steine verschwinden vom Brett, sie blockieren und helfen also niemandem mehr, und die anderen spielen weiter.</li>
        <li><strong>Zeit (online):</strong> In einer Online-Partie hat jeder Zug ein Zeitlimit, das der Spieler festlegt, der die Partie startet: 15 Sekunden, 30 Sekunden, 1 Minute, 2 Minuten oder kein Limit. Eine Runde mit 6 Zügen dauert höchstens 6-mal das Limit, bei 30 Sekunden also höchstens 3 Minuten. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf, und die Partie geht ohne dich weiter.</li>
      </ul>
      <p>Für eine Partie mit weniger Spielern lies <a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Wo du in Leapstone mit 6 Spielern spielst</h2>
      <ul>
        <li><strong>Gegen den Computer, sofort:</strong> Öffne <a href="/play/">Leapstone im Browser</a>, tippe auf Computer und wähle das Sternbrett und 5 Computer. Du bist Spieler 1, du ziehst also zuerst. Die Computer ziehen nacheinander, jeweils mit einer kurzen Pause, sodass du jeden Zug verfolgen kannst. Du wählst Leicht, Normal oder Schwer für die Computer.</li>
        <li><strong>An einem Handy:</strong> Tippe auf Spielen, wähle das Sternbrett und 6 Spieler, und tippe dann auf einen Stein, um diesen Platz zwischen Mensch und Computer umzuschalten.</li>
        <li><strong>Online mit Freunden:</strong> Tippe auf Freunde, wähle das Sternbrett, 6 Spieler und die Zeit pro Zug, und sende den Einladungslink. Die Partie beginnt, wenn alle 6 Plätze besetzt sind.</li>
        <li><strong>Schnelle Spiele:</strong> Online spielen findet Partien für 2 oder 4 Spieler, also gibt es kein schnelles Spiel für 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Sternhalma zu sechst",
  titel: "Sternhalma mit 6 Spielern: volles Brett | Leapstone",
  beschrijving: "So funktioniert Sternhalma mit 6 Spielern: ein voller Stern aus 60 Steinen, eine volle Mitte, Blockieren, die Spieldauer und wo du spielst.",
  h1: "Sternhalma (Chinese Checkers) zu sechst",
  intro: "So funktioniert eine Partie mit 6: Alle 6 Spitzen sind voll, du rennst zur Spitze auf der anderen Seite des Bretts, und die Partie geht weiter, nachdem der erste Spieler fertig ist.",
  inhoud,
};
