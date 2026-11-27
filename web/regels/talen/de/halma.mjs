// Die deutsche Regelseite Halma, Aufgabe 133. Inhalt: die englische Seite ../en/halma.mjs (gegen crates/halma-core geprüft,
// siehe docs/plan.md, Aufgabe 117), Satz für Satz auf Deutsch. Ändert man eine Regel, ändert man beide.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 Spieler: je 19 Steine",
    alt: "Das quadratische Brett mit 19 roten Steinen in der Ecke oben links und 19 blauen Steinen in der Ecke unten rechts",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 Spieler: je 13 Steine",
    alt: "Das quadratische Brett mit 13 Steinen in jeder der vier Ecken: rot oben links, blau oben rechts, grün unten rechts und gelb unten links",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Das Brett</h2>
      <p>Halma spielst du auf einem quadratischen Brett mit 16 mal 16 Feldern, insgesamt 256. Jedes Feld hat bis zu acht Nachbarn: die vier geraden und die vier diagonalen. Ein Feld am Rand hat weniger, und eine Ecke hat drei.</p>
      <p>Das ist das quadratische Brett in Leapstone. Kennst du das Spiel auf dem Sternbrett, dann lies über <a href="/de/regeln/was-ist-sternhalma">Sternhalma</a> und die <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">So beginnen die Steine</h2>
      <p>Halma ist für 2 oder 4 Spieler. Jeder Spieler beginnt mit den Steinen in einem Lager in einer Ecke des Bretts. Das Lager in der gegenüberliegenden Ecke ist dein Ziel.</p>
      <ul>
        <li><strong>2 Spieler:</strong> je 19 Steine, in zwei Ecken, die sich gegenüberliegen. Das Lager besteht aus fünf Reihen mit 5, 5, 4, 3 und 2 Feldern.</li>
        <li><strong>4 Spieler:</strong> je 13 Steine, ein Lager in jeder Ecke. Das Lager besteht aus vier Reihen mit 4, 4, 3 und 2 Feldern. Dein Ziel ist die Ecke diagonal gegenüber auf dem Brett.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Der Reihe nach</h2>
      <p>Spieler 1 beginnt. Danach geht es der Reihe nach weiter, und nach dem letzten Spieler ist wieder Spieler 1 dran. In Leapstone gehören die Farben zu den Nummern: Rot, Blau, Grün und Gelb.</p>
      <p>Wenn du dran bist, machst du einen Zug mit einem Stein. Es wird nichts geschlagen: Die Steine bleiben auf dem Brett, bis ihr Spieler aufgibt.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Ein Schritt</h2>
      <p>Setze einen Stein auf ein leeres Feld neben ihm, in eine der acht Richtungen: gerade oder diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Ein roter Stein mit einem weißen Ring darum. Fünf seiner acht Nachbarfelder sind leer und markiert; auf den anderen drei steht ein Stein.",
  tekst: "Der rote Stein kann auf die fünf markierten Felder ziehen. Die anderen drei Nachbarfelder sind besetzt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Ein Sprung</h2>
      <p>Springe über einen Stein neben deinem, egal welcher Farbe, und lande auf dem leeren Feld direkt dahinter, in gerader Linie. Du kannst in alle acht Richtungen springen, auch diagonal und rückwärts.</p>
      <ul>
        <li>Das Feld, auf dem du landest, muss leer sein.</li>
        <li>Du kannst nicht über zwei Steine hintereinander springen und auch nicht über ein leeres Feld.</li>
        <li>Der Stein, über den du springst, bleibt liegen.</li>
        <li>Du kannst nicht über den Rand des Bretts springen.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Ein roter Stein springt diagonal über einen blauen Stein auf das leere Feld dahinter, gezeigt mit einem Pfeil.",
  tekst: "Der rote Stein springt diagonal über den blauen Stein.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Eine Sprungkette</h2>
      <p>Nach einem Sprung darf derselbe Stein noch einmal springen, so oft er kann, in jede Richtung, gerade oder diagonal. Du entscheidest, wo du aufhörst. Alle Sprünge zusammen sind ein Zug.</p>
      <ul>
        <li>In einem Zug kannst du nicht zweimal auf demselben Feld landen.</li>
        <li>Ein Zug ist ein Schritt oder ein Sprung oder mehrere Sprünge. Nach einem Sprung darfst du keinen Schritt mehr machen.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Ein roter Stein macht in einem Zug drei Sprünge: diagonal über einen blauen Stein, gerade über einen weiteren blauen Stein und diagonal über einen roten Stein. Die drei Landefelder tragen die Nummern 1, 2 und 3.",
  tekst: "Ein Zug mit drei Sprüngen, in der Reihenfolge der Nummern.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Das Ziel</h2>
      <p>Du gewinnst, wenn du alle deine Steine in das Lager gegenüber deinem Start gebracht hast. Jedes Feld dieses Lagers muss einen eigenen Stein tragen: 19 bei 2 Spielern, 13 bei 4 Spielern. Solange dort ein Stein eines anderen Spielers steht, kannst du nicht gewinnen.</p>
      <p>Du darfst auf jedem leeren Feld landen, auch in den Lagern anderer Spieler. Ein Stein in deinem Ziel darf wieder wegziehen; nichts hält ihn fest.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Das quadratische Brett für zwei Spieler. Rot beginnt oben links; das Lager unten rechts, markiert mit gestrichelten Kreisen und mit blauen Steinen darin, ist das Ziel von Rot.",
  tekst: "Bei 2 Spielern ist das Ziel von Rot das Lager, in dem Blau beginnt.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Mit 2 oder 4 Spielern</h2>
      <ul>
        <li><strong>2 Spieler:</strong> Wer zuerst das Ziel voll hat, gewinnt, und die Partie ist zu Ende.</li>
        <li><strong>4 Spieler:</strong> Wer zuerst das Ziel voll hat, gewinnt. Die anderen spielen weiter um die nächsten Plätze, und ein Spieler, der fertig ist, wird übersprungen. Die Partie ist zu Ende, wenn nur noch ein Spieler mitspielt.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Aufgeben</h2>
      <p>Wenn du aufgibst, verschwinden deine Steine vom Brett, sodass sie niemanden mehr blockieren. Bei 2 Spielern gewinnt der andere Spieler. Bei 4 Spielern geht die Partie ohne dich weiter, und wenn alle bis auf einen Spieler aufgeben, gewinnt der letzte Spieler.</p>
      <p>In einer Online-Partie hat jeder Zug ein Zeitlimit. Der Spieler, der die Partie startet, stellt es ein. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf. Partien gegen den Computer und auf einem Handy haben kein Zeitlimit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipps</h2>
      <ul class="tips">
        <li><strong>Baue Leitern.</strong> Stelle Steine in eine Reihe mit jeweils einem leeren Feld dazwischen, gerade oder diagonal, in Richtung deines Ziels. Ein Stein kann dann in einem Zug die ganze Reihe entlangspringen.</li>
        <li><strong>Jeder Stein ist eine Leiter.</strong> Du kannst über jede Farbe springen, also helfen dir auch die Steine der anderen Spieler. Und deine Leitern helfen ihnen: Schau, was du zurücklässt.</li>
        <li><strong>Nutze die Diagonalen.</strong> Das Ziel liegt in der gegenüberliegenden Ecke, also ist eine diagonale Reihe von Steinen der schnellste Weg hinüber.</li>
        <li><strong>Vergiss die Nachzügler nicht.</strong> Du brauchst alle deine Steine im Ziel. Ein Stein, der weit hinten liegt und nichts zum Überspringen hat, kommt pro Zug ein Feld voran. Hole ihn nach, solange die anderen Steine noch um ihn herum stehen.</li>
        <li><strong>Dein Start ist ihr Ziel.</strong> Bei 2 Spielern ist dein Lager das Ziel des anderen Spielers, und er kann nicht fertig werden, solange noch ein Stein von dir dort steht. Leapstone lässt dich einen Stein zu Hause lassen, du kannst also auf diese Weise blockieren. Dasselbe gilt für dich.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Fragen</h2>
      <h3>Wie viele Personen können Halma spielen?</h3>
      <p>Zwei oder vier. Halma spielt man auf einem quadratischen Brett mit 16 mal 16 Feldern, und jeder Spieler beginnt in einer Ecke.</p>
      <h3>Wie viele Steine hat jeder Spieler bei Halma?</h3>
      <p>Bei 2 Spielern hat jeder 19 Steine, bei 4 Spielern jeder 13.</p>
      <h3>Wer hat Halma erfunden?</h3>
      <p>George Howard Monks, ein amerikanischer Chirurg, 1883 oder 1884. Der Name ist Griechisch für &bdquo;Sprung&ldquo;. Mehr dazu unter <a href="/de/regeln/was-ist-sternhalma">Sternhalma</a>.</p>
      <h3>Was ist der Unterschied zwischen Halma und Sternhalma (Chinese Checkers)?</h3>
      <p>Halma hat ein quadratisches Brett, mit Schritten und Sprüngen in acht Richtungen und 19 oder 13 Steinen pro Spieler. Sternhalma hat ein Sternbrett, mit sechs Richtungen und 10 Steinen pro Spieler, für 2, 3, 4 oder 6 Spieler.</p>
      <h3>Kann man Halma kostenlos online spielen?</h3>
      <p>Ja, in Leapstone, im Browser oder in der App aus dem App Store. Wähle eine Spielart, zum Beispiel gegen den Computer oder online mit Freunden, und tippe dann auf Quadratisches Brett. Leapstone ist kostenlos und ohne Werbung.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Spiele es</h2>
      <p>Die Schaltfläche Jetzt spielen öffnet eine Partie gegen den Computer auf dem <a href="/de/regeln/sternhalma">Sternbrett</a>. Um Halma zu spielen, tippe oben auf den Zurück-Pfeil, wähle dann Auf diesem Handy spielen, Gegen den Computer spielen oder Online mit Freunden spielen, und tippe auf Quadratisches Brett.</p>
    </section>`;

export default {
  nav: "Halma-Regeln",
  titel: "Halma: Regeln und Tipps | Leapstone",
  beschrijving: "So spielst du Halma auf dem Brett mit 16 mal 16 Feldern: Aufstellung, Schritte, Sprünge, Sprungketten, Gewinnen und Tipps. Kostenlos im Browser.",
  h1: "Halma: Spielregeln",
  intro: "Bringe alle deine Steine über das quadratische Brett in die gegenüberliegende Ecke, bevor es jemand anderes schafft. Die Regeln in Kürze, mit Bildern, und ein paar Tipps.",
  inhoud,
};
