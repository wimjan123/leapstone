// De gids Halma tegenover Chinese checkers in het Duits, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Chinese Checkers: das Sternbrett, 121 Felder",
    alt: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze und 10 blauen Steinen in der oberen Spitze",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: das quadratische Brett, 256 Felder",
    alt: "Das quadratische Brett mit 19 roten Steinen in der Ecke oben links und 19 blauen Steinen in der Ecke unten rechts",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Sternbrett: sechs Nachbarn, hier drei davon leer",
    alt: "Ein roter Stein mit einem weißen Ring darum. Drei seiner sechs Nachbarfelder sind leer und markiert; auf den anderen drei stehen Steine.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Quadratisches Brett: acht Nachbarn, hier fünf davon leer",
    alt: "Ein roter Stein mit einem weißen Ring darum. Fünf seiner acht Nachbarfelder sind leer und markiert; auf den anderen drei stehen Steine.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Die kurze Antwort</h2>
      <p>Halma spielt man auf einem quadratischen Brett und Chinese Checkers auf einem Brett in Form eines sechszackigen Sterns. In beiden Spielen ziehst du deine Steine in Schritten und Sprüngen über das Brett, und wer zuerst das Lager auf der anderen Seite füllt, gewinnt.</p>
      <p>Unterschiedlich sind das Brett, die Richtungen, in die du ziehst, wie viele Leute mitspielen können und wie viele Steine jeder hat. <a href="/de/regeln/was-ist-sternhalma">Sternhalma</a> ist der Name für Halma auf einem Sternbrett, es ist also dasselbe Spiel wie Chinese Checkers.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Die Bretter</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Chinese Checkers</strong> nutzt das Sternbrett: 121 Felder, mit einer Spitze aus 10 Feldern an jeder der sechs Zacken. Eine Spitze ist ein Dreieck aus Reihen mit 4, 3, 2 und 1 Feldern.</li>
        <li><strong>Halma</strong> nutzt das quadratische Brett: 16 mal 16 Felder, insgesamt 256. Ein Lager liegt in einer Ecke. Ein großes Lager hat Reihen mit 5, 5, 4, 3 und 2 Feldern, ein kleines Reihen mit 4, 4, 3 und 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Richtungen: sechs oder acht</h2>
      <p>Auf dem Sternbrett hat ein Feld sechs Nachbarn. Auf dem quadratischen Brett hat es acht, weil auch die Diagonalen zählen. Ein Schritt geht auf einen leeren Nachbarn. Ein Sprung geht über einen Stein neben deinem, in gerader Linie, auf das leere Feld dahinter, in jede dieser Richtungen und auch rückwärts.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Ein Feld am Rand hat weniger Nachbarn, und eine Ecke des quadratischen Bretts hat drei. Sechs Richtungen ergeben drei Linien durch ein Feld auf dem Sternbrett. Acht Richtungen ergeben vier Linien auf dem quadratischen Brett: quer, hoch und runter und zwei Diagonalen.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Spieler und Steine</h2>
      <ul>
        <li><strong>Chinese Checkers:</strong> 2, 3, 4 oder 6 Spieler. Jeder hat 10 Steine, auf dem Brett stehen also 20, 30, 40 oder 60 Steine.</li>
        <li><strong>Halma:</strong> 2 oder 4 Spieler. Bei 2 Spielern hat jeder 19 Steine, insgesamt 38. Bei 4 Spielern hat jeder 13 Steine, insgesamt 52.</li>
      </ul>
      <p>Das quadratische Brett hat in Leapstone keine Partie für 3 oder 6 Spieler. Für eine Partie zu dritt lies <a href="/de/anleitungen/sternhalma-zu-dritt">Sternhalma zu dritt</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Was gleich ist</h2>
      <ul>
        <li><strong>Ein Zug:</strong> ein Schritt oder eine Sprungkette mit einem Stein. Du entscheidest, wo die Kette endet, und nach einem Sprung darfst du keinen Schritt mehr machen.</li>
        <li><strong>Jede Farbe:</strong> du springst über einen Stein jeder Farbe, auch über deinen eigenen. Der Stein, über den du springst, bleibt, wo er ist. Es wird nichts geschlagen.</li>
        <li><strong>Das Ziel:</strong> das Lager gegenüber deinem Start. Alle Felder müssen mit deinen eigenen Steinen besetzt sein. Solange dort ein Stein eines anderen Spielers steht, kannst du nicht fertig werden.</li>
        <li><strong>Gewinnen:</strong> wer zuerst das Ziel füllt, gewinnt. Bei 2 Spielern ist die Partie dann zu Ende. Bei mehr Spielern spielen die anderen um die nächsten Plätze weiter, und ein Spieler, der fertig ist, wird übersprungen.</li>
        <li><strong>Aufgeben und Zeit:</strong> wenn du aufgibst, verschwinden deine Steine vom Brett. In einer Online-Partie hat jeder Zug ein Zeitlimit, und wenn du 3 Züge hintereinander verpasst, gibst du auf.</li>
      </ul>
      <p>Lies die vollständigen Regeln von <a href="/de/regeln/sternhalma">Chinese Checkers</a> und <a href="/de/regeln/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Welches Brett du in Leapstone wählst</h2>
      <ul>
        <li><strong>3 oder 6 Spieler:</strong> nur das Sternbrett hat sie.</li>
        <li><strong>Mehr Steine pro Spieler:</strong> das quadratische Brett, mit 19 Steinen pro Spieler bei 2 Spielern oder 13 bei 4, gegen 10 auf dem Sternbrett.</li>
        <li><strong>Online spielen:</strong> eine schnelle Partie wird auf dem Sternbrett gespielt. Mit Freunden und gegen den Computer kannst du beide Bretter wählen.</li>
      </ul>
      <p>Die Schaltfläche Jetzt spielen öffnet eine Partie gegen den Computer auf dem Sternbrett. Für das quadratische Brett tippe oben auf den Zurück-Pfeil und wähle im Menü Quadratisches Brett.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Weiter geht es</h2>
      <ul>
        <li><a href="/play/">Spiele im Browser</a> und probiere beide Bretter aus.</li>
        <li><a href="/de/anleitungen/sternhalma-strategie">Strategie für Chinese Checkers</a>: sechs Tipps mit Bildern.</li>
        <li><a href="/de/anleitungen/sternhalma-zu-zweit">Chinese Checkers zu zweit</a>: wie eine Partie zu zweit abläuft.</li>
      </ul>
      <p><a href="/de/anleitungen/sternhalma-online-mit-freunden">Sternhalma online mit Freunden</a></p>
    </section>`;

export default {
  nav: "Halma oder Chinese Checkers",
  titel: "Halma oder Chinese Checkers: Unterschiede | Leapstone",
  beschrijving: "Halma oder Chinese Checkers? Das quadratische und das Sternbrett, sechs oder acht Richtungen, Spieler und Steine, und was gleich ist.",
  h1: "Halma oder Chinese Checkers",
  intro: "Zwei Spiele mit einer Idee: Bringe alle deine Steine über das Brett auf die andere Seite. Was sich unterscheidet, was gleich ist und wo du beide spielst.",
  inhoud,
};
