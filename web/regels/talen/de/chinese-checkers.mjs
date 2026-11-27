// Die deutsche Regelseite Sternhalma (Chinese Checkers), Aufgabe 133. Inhalt: die englische Seite ../en/chinese-checkers.mjs
// (gegen crates/halma-core geprüft, siehe docs/plan.md, Aufgabe 116), Satz für Satz auf Deutsch.
// Jede Regel hier muss mit der englischen Seite stimmen; ändert man eine Regel, ändert man beide.
// Dieselben Bilder (ohne Sprache: nur Ziffern in der SVG); Alt-Texte und Bildunterschriften sind Deutsch.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} Spieler`,
      alt:
        {
          2: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze und 10 blauen Steinen in der oberen Spitze",
          3: "Das Sternbrett mit roten Steinen unten, blauen oben links und grünen oben rechts",
          4: "Das Sternbrett mit Steinen in vier Spitzen: rot unten, grün oben, blau unten links und gelb oben rechts",
          6: "Das Sternbrett mit Steinen in allen sechs Spitzen, in sechs Farben",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Das Brett</h2>
      <p>Sternhalma (Chinese Checkers) spielst du auf einem Stern mit sechs Spitzen. Das Brett hat 121 Felder, und jede Spitze hat 10 davon. Im Inneren des Bretts hat jedes Feld sechs Nachbarn.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">So beginnen die Steine</h2>
      <p>Jeder Spieler hat 10 Steine und beginnt mit allen in einer Spitze des Sterns. Die Spitze gegenüber ist dein Ziel.</p>
      <ul>
        <li><strong>2 Spieler:</strong> die zwei Spitzen, die sich genau gegenüberliegen.</li>
        <li><strong>3 Spieler:</strong> jede zweite Spitze. Die drei Ziele sind am Anfang leer.</li>
        <li><strong>4 Spieler:</strong> zwei Paare von Spitzen, die nebeneinanderliegen. Jeder Spieler hat einen anderen Spieler gegenüber.</li>
        <li><strong>6 Spieler:</strong> alle sechs Spitzen.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Der Reihe nach</h2>
      <p>Spieler 1 beginnt. Danach geht es der Reihe nach weiter: Spieler 2, Spieler 3 und so weiter, und nach dem letzten Spieler ist wieder Spieler 1 dran. In Leapstone gehören die Farben zu den Nummern: Rot, Blau, Grün, Gelb, Lila und Silber.</p>
      <p>Wenn du dran bist, machst du einen Zug mit einem Stein. Es wird nichts geschlagen: Die Steine bleiben auf dem Brett, bis ihr Spieler aufgibt.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Ein Schritt</h2>
      <p>Setze einen Stein auf ein leeres Feld neben ihm.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Ein roter Stein mit einem weißen Ring darum. Drei seiner sechs Nachbarfelder sind leer und markiert; auf den anderen drei steht ein Stein.",
  tekst: "Der rote Stein kann auf die drei markierten Felder ziehen. Die anderen drei Nachbarfelder sind besetzt.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Ein Sprung</h2>
      <p>Springe über einen Stein neben deinem, egal welcher Farbe, und lande auf dem leeren Feld direkt dahinter, in gerader Linie. Du kannst in alle sechs Richtungen springen, auch rückwärts.</p>
      <ul>
        <li>Das Feld, auf dem du landest, muss leer sein.</li>
        <li>Du kannst nicht über zwei Steine hintereinander springen und auch nicht über ein leeres Feld.</li>
        <li>Der Stein, über den du springst, bleibt liegen.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Ein roter Stein springt über einen blauen Stein auf das leere Feld dahinter, gezeigt mit einem Pfeil.",
  tekst: "Der rote Stein springt über den blauen Stein.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Eine Sprungkette</h2>
      <p>Nach einem Sprung darf derselbe Stein noch einmal springen, so oft er kann und in jede Richtung. Du entscheidest, wo du aufhörst. Alle Sprünge zusammen sind ein Zug.</p>
      <ul>
        <li>In einem Zug kannst du nicht zweimal auf demselben Feld landen.</li>
        <li>Ein Zug ist ein Schritt oder ein Sprung oder mehrere Sprünge. Nach einem Sprung darfst du keinen Schritt mehr machen.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Ein roter Stein macht in einem Zug drei Sprünge, über einen blauen, einen grünen und noch einen blauen Stein. Die drei Landefelder tragen die Nummern 1, 2 und 3.",
  tekst: "Ein Zug mit drei Sprüngen, in der Reihenfolge der Nummern.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Das Ziel</h2>
      <p>Du gewinnst, wenn du alle 10 Steine in die Spitze gegenüber deinem Start gebracht hast. Auf allen 10 Feldern dieser Spitze müssen deine eigenen Steine stehen. Solange dort ein Stein eines anderen Spielers steht, kannst du nicht gewinnen.</p>
      <p>Du darfst auf jedem leeren Feld landen, auch in den Spitzen anderer Spieler.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Ein Sternbrett für drei Spieler. Rot beginnt unten; die leere Spitze oben, markiert mit gestrichelten Kreisen, ist das Ziel von Rot.",
  tekst: "Bei 3 Spielern beginnt Rot unten. Das Ziel von Rot ist die leere Spitze oben.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Mit 2, 3, 4 oder 6 Spielern</h2>
      <ul>
        <li><strong>2 Spieler:</strong> Wer zuerst das Ziel voll hat, gewinnt, und die Partie ist zu Ende.</li>
        <li><strong>3, 4 oder 6 Spieler:</strong> Wer zuerst das Ziel voll hat, gewinnt. Die anderen spielen weiter um die nächsten Plätze, und ein Spieler, der fertig ist, wird übersprungen. Die Partie ist zu Ende, wenn nur noch ein Spieler mitspielt.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Aufgeben</h2>
      <p>Wenn du aufgibst, verschwinden deine Steine vom Brett, sodass sie niemanden mehr blockieren. Bei 2 Spielern gewinnt der andere Spieler. Bei mehr Spielern geht die Partie ohne dich weiter, und wenn alle bis auf einen Spieler aufgeben, gewinnt der letzte Spieler.</p>
      <p>In einer Online-Partie hat jeder Zug ein Zeitlimit. Der Spieler, der die Partie startet, stellt es ein, und in einer schnellen Partie sind es 30 Sekunden. Läuft deine Zeit ab, wird dein Zug übersprungen. Verpasst du 3 Züge hintereinander, gibst du auf. Partien gegen den Computer und auf einem Handy haben kein Zeitlimit.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tipps</h2>
      <ul class="tips">
        <li><strong>Baue Leitern.</strong> Stelle Steine in eine Reihe mit jeweils einem leeren Feld dazwischen, in Richtung deines Ziels. Ein Stein kann dann in einem Zug die ganze Reihe entlangspringen.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Vier Steine in einer diagonalen Reihe mit jeweils einem leeren Feld dazwischen. Ein roter Stein an einem Ende springt über alle vier, mit vier nummerierten Landefeldern.",
  tekst: "Vier Steine in einer Reihe: Der obere rote Stein überquert das Brett in einem Zug, mit vier Sprüngen.",
})}
        </li>
        <li><strong>Jeder Stein ist eine Leiter.</strong> Du kannst über jede Farbe springen, also helfen dir auch die Steine der anderen Spieler. Und deine Leitern helfen ihnen: Schau, was du zurücklässt.</li>
        <li><strong>Vergiss die Nachzügler nicht.</strong> Du brauchst alle 10 Steine im Ziel. Ein Stein, der weit hinten liegt und nichts zum Überspringen hat, kommt pro Zug ein Feld voran. Hole ihn nach, solange die anderen Steine noch um ihn herum stehen.</li>
        <li><strong>Dein Start ist ihr Ziel.</strong> Bei 2, 4 oder 6 Spielern ist deine Startspitze das Ziel des Spielers dir gegenüber, und er kann nicht gewinnen, solange noch ein Stein von dir dort steht. Dasselbe gilt für dich.</li>
      </ul>
      <p>Weitere Tipps mit Bildern findest du in der Anleitung <a href="/de/anleitungen/sternhalma-strategie">Sternhalma-Strategie</a>. Für eine Partie zu zweit lies <a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Fragen</h2>
      <h3>Wie viele Personen können Sternhalma (Chinese Checkers) spielen?</h3>
      <p>Zwei, drei, vier oder sechs. Jeder Spieler beginnt in einer Spitze des Sterns. Bei 2, 3 oder 4 Spielern bleiben einige Spitzen leer.</p>
      <h3>Wie viele Steine hat jeder Spieler?</h3>
      <p>Jeder Spieler hat 10 Steine. Das Brett hat 121 Felder: 10 in jeder der sechs Spitzen und 61 in der Mitte.</p>
      <h3>Darf man über eigene Steine oder rückwärts springen?</h3>
      <p>Ja. Du darfst über einen Stein jeder Farbe springen, auch über deinen eigenen, in alle sechs Richtungen, auch rückwärts. Der übersprungene Stein bleibt stehen.</p>
      <h3>Schlägt man bei Sternhalma Steine?</h3>
      <p>Nein. Es wird nichts geschlagen. Ein Stein verlässt das Brett nur, wenn sein Spieler aufgibt.</p>
      <h3>Kommt Chinese Checkers aus China?</h3>
      <p>Nein. Das Spiel erschien 1892 in Deutschland als Stern-Halma, nach dem älteren Spiel Halma. Der Name Chinese Checkers stammt aus den Vereinigten Staaten, aus dem Jahr 1928. Mehr dazu unter <a href="/de/regeln/was-ist-sternhalma">Sternhalma</a>.</p>
      <h3>Wo kann man Sternhalma kostenlos online mit Freunden spielen?</h3>
      <p>In Leapstone, im Browser oder in der App aus dem App Store. Schicke einem Freund einen Einladungslink: Er oder sie steigt ohne Konto, E-Mail-Adresse oder Passwort in deine Partie ein. Du kannst auch gegen den Computer spielen oder eine schnelle Partie gegen einen anderen Spieler. Leapstone ist kostenlos und ohne Werbung.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Sternhalma in Leapstone spielen</h2>
      <p>Leapstone ist eine kostenlose App für Sternhalma (Chinese Checkers) und Halma, mit einem 3D-Brett aus rotem Lack und Gold. Du kannst in der App und im Browser spielen.</p>
      <ul>
        <li><strong>Gegen den Computer.</strong> Leicht, normal oder schwer. Du brauchst dafür kein Internet.</li>
        <li><strong>Mit Freunden.</strong> Schicke einen Einladungslink. Du stellst die Zeit pro Zug ein, und ihr könnt chatten.</li>
        <li><strong>Online.</strong> Ein schnelles Spiel gegen einen anderen Spieler deines Levels, 30 Sekunden pro Zug. Manche Online-Gegner können Computerspieler sein.</li>
        <li><strong>Auf einem Handy.</strong> Reiche das Handy am Tisch herum.</li>
      </ul>
      <p>Leapstone ist kostenlos, ohne Werbung und ohne Anmeldung mit E-Mail-Adresse: Du wählst nur einen Spielernamen. <a href="https://apps.apple.com/de/app/id6831230722">Leapstone im App Store laden</a> oder <a href="/play/">im Browser spielen</a>.</p>
    </section>`;

export default {
  nav: "Sternhalma-Regeln",
  titel: "Sternhalma (Chinese Checkers): Regeln und Tipps | Leapstone",
  beschrijving: "So spielst du Sternhalma (Chinese Checkers): Aufstellung, Schritte, Sprünge und Ketten, Gewinnen mit 2, 3, 4 oder 6 Spielern, Tipps. Kostenlos im Browser.",
  h1: "Sternhalma (Chinese Checkers): Spielregeln",
  intro: "Bringe alle 10 Steine über das Sternbrett in die gegenüberliegende Spitze, bevor es jemand anderes schafft. Die Regeln in Kürze, mit Bildern, und ein paar Tipps.",
  inhoud,
};
