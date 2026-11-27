// Die deutsche Anleitung Sternhalma-Strategie (Aufgabe 133): /de/anleitungen/sternhalma-strategie.
// Inhalt: die englische Anleitung ../en/chinese-checkers-strategy.mjs, Satz für Satz auf Deutsch. Jeder Tipp ist gegen crates/halma-core
// geprüft (siehe docs/plan.md, Aufgabe 122); die Bilder kommen aus crates/halma-core/examples/regelplaatjes.rs.
// Keine erfundenen "Experten", Zahlen oder Geschichte. Die einzige Zahl ist 16 (Schritte von Spitze zu Spitze), die das Beispiel nachzählt.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Worauf diese Tipps beruhen</h2>
      <p>Die Tipps folgen aus den <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>, wie Leapstone sie spielt: Ein Zug ist ein Schritt oder eine Sprungkette, und du kannst über einen Stein jeder Farbe springen. Sie sind kein Beweis für bestes Spiel. Am schnellsten probierst du sie gegen den Computer aus.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Baue Leitern</h2>
      <p>Eine Leiter ist eine Reihe von Steinen mit jeweils einem leeren Feld dazwischen. Ein Stein an einem Ende springt in einem Zug über die ganze Reihe, er überquert das Brett also in einem Zug statt mit einem Feld pro Zug.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Vier Steine in einer diagonalen Reihe mit jeweils einem leeren Feld dazwischen. Ein roter Stein an einem Ende springt über alle vier, mit vier nummerierten Landefeldern.",
  tekst: "Vier Sprünge in einem Zug. Derselbe Stein könnte sonst nur ein Feld nach dem anderen ziehen.",
})}
      <p>Ein Sprung geht in alle sechs Richtungen, auch rückwärts, deshalb muss eine Leiter nicht in deiner eigenen Spitze beginnen. Jede Reihe von Steinen mit Lücken dazwischen reicht.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Halte deine Steine zusammen</h2>
      <p>Du brauchst alle 10 Steine in deinem Ziel, also entscheidet dein letzter Stein, wann du fertig bist. Ein Stein ohne Nachbarstein hat nichts zum Überspringen und kann nur einen Schritt machen.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Ein Sternbrett mit einem roten Stein allein in der unteren Spitze. Nur seine zwei leeren Nachbarfelder sind markiert. Weitere rote und blaue Steine stehen in der Mitte.",
  tekst: "Dieser Stein hat keinen Nachbarn, also kann er nur auf die zwei markierten Felder ziehen.",
})}
      <p>Von der Spitze deiner eigenen Spitze bis zur Spitze des Ziels auf der anderen Seite des Bretts sind es 16 Schritte. Das sind 16 Züge für einen einzelnen Stein, während eine Leiter in einem Zug überquert. Ziehe die Steine hinten, solange noch Steine um sie herum stehen, über die sie springen können. Der Computer in Leapstone macht das auch: Er bewertet Züge seiner hintersten Steine etwas höher.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Nutze die Mitte</h2>
      <p>Ein Stein in der Mitte des Bretts hat sechs Nachbarn, er kann also in alle sechs Richtungen ziehen oder springen. Ein Stein am Rand hat weniger. Der Stein am Rand im Bild hat vier.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Ein Sternbrett mit einem roten Stein in der Mitte mit sechs markierten Nachbarfeldern und einem roten Stein nahe dem Rand oben links mit vier markierten Nachbarfeldern.",
  tekst: "Sechs Möglichkeiten zu ziehen in der Mitte, vier am Rand.",
})}
      <p>Steine in der Mitte geben den anderen Steinen auf ihrem Weg hinüber auch etwas zum Überspringen.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Fülle das Ziel von hinten</h2>
      <p>Dein Ziel ist ein Dreieck aus 10 Feldern, in Reihen von 4, 3, 2 und 1. Die Felder hinten erreichst du nur über die Felder davor. Füllst du zuerst die vordere Reihe, hat der letzte Stein vielleicht keinen Weg hinein.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Die Zielspitze oben mit neun roten Steinen und einem leeren Feld ganz hinten, gestrichelt markiert. Ein zehnter roter Stein, mit einem weißen Ring, steht unter der vorderen Reihe.",
  tekst: "Neun Steine sind im Ziel, und das Feld hinten ist leer. Der zehnte Stein hat keinen Zug dorthin.",
})}
      <p>Setze die ersten Steine auf die hinteren Felder und arbeite dich nach vorn, damit die Front für die Steine frei bleibt, die zuletzt ankommen.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Schließe keinen Stein in deinem Ziel ein</h2>
      <p>Du darfst in der Spitze eines anderen Spielers anhalten, also kann ein Stein eines anderen Spielers in deinem Ziel landen. Du gewinnst nur, wenn alle 10 Felder deines Ziels deine eigenen Steine tragen. Hat dieser Stein keinen Zug, kann ihn niemand bewegen, und du kannst nicht gewinnen, bis ein Feld neben ihm frei wird.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Die Zielspitze oben mit neun roten Steinen und einem blauen Stein ganz hinten, mit einem weißen Ring markiert. Der blaue Stein ist von roten Steinen umgeben.",
  tekst: "Der blaue Stein hinten hat keinen Zug, und Rot kann das Ziel nicht füllen.",
})}
      <p>Halte ein Feld neben einem solchen Stein frei, damit er wegziehen kann. Der Computer in Leapstone rechnet damit: Ein Zug, der einen Stein eines anderen Spielers in dessen Ziel einschließt, wird niedriger bewertet. Die Regeln zwingen niemanden, dein Ziel zu verlassen, der andere Spieler kann dort also auch absichtlich einen Stein parken.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Blockiere einen Sprung, oder lass ihn</h2>
      <p>Ein Sprung braucht ein leeres Feld zum Landen. Fülle dieses Feld, und der Sprung ist weg. Zwei Steine hintereinander kann man auch nicht überspringen.</p>
      <p>Deine Steine sind auch Trittsteine für den anderen Spieler. Im linken Bild überquert Blau zwei rote Steine in einem Zug. Rechts hat Rot einen Stein auf das erste Landefeld gezogen, und Blau kann nur ziehen.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Ein blauer Stein mit zwei roten Steinen in einer Linie, jeweils mit einem leeren Feld dahinter. Pfeile zeigen zwei Sprünge des blauen Steins.",
          tekst: "Vorher: Blau kann zwei Sprünge machen.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Dieselbe Linie, nachdem Rot seinen hinteren Stein auf das erste Landefeld gezogen hat. Auf den blauen Stein folgen zwei rote Steine hintereinander.",
          tekst: "Nachher: Rot hat einen Stein gezogen. Blau hat keinen Sprung.",
        })}
      </div>
      <p>Ein Zug zum Blockieren ist ein Zug, der nicht in deinen eigenen Fortschritt geht. Blockiere also, wenn der Sprung dem anderen Spieler mehr bringt, als dein Zug dir bringen würde. Beim Bauen einer Leiter ist es umgekehrt: Nach deinem Zug zieht der andere Spieler zuerst, ein Stein von ihm an einem Ende nutzt deine Leiter also vor dir. Auf der schwersten Stufe schaut der Computer auf die beste Antwort jedes Gegners, bevor er einen Zug wählt.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Weiter geht es</h2>
      <ul>
        <li><a href="/play/">Spiele im Browser gegen den Computer</a> und probiere eine Leiter aus.</li>
        <li><a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>: wie eine Partie zu zweit abläuft.</li>
        <li><a href="/de/regeln/sternhalma">Sternhalma-Regeln</a>, mit Bildern von Schritten, Sprüngen und Ketten.</li>
      </ul>
      <p><a href="/de/anleitungen/sternhalma-online-mit-freunden">Sternhalma online mit Freunden</a></p>
      <p><a href="/de/anleitungen/halma-oder-chinese-checkers">Halma oder Chinese Checkers</a></p>
      <p><a href="/de/anleitungen/sternhalma-zu-dritt">Sternhalma zu dritt</a></p>
    </section>`;

export default {
  nav: "Sternhalma-Strategie",
  titel: "Sternhalma (Chinese Checkers) Strategie: 6 Tipps | Leapstone",
  beschrijving: "Strategie für Sternhalma (Chinese Checkers): Leitern bauen, Steine zusammenhalten, die Mitte nutzen, das Ziel von hinten füllen und Sprünge blockieren.",
  h1: "Sternhalma (Chinese Checkers): Strategie",
  intro: "Sechs Tipps für das Sternbrett, jeder mit einem Bild aus den echten Regeln: Leitern, Nachzügler, die Mitte, das Ziel füllen und Sprünge blockieren.",
  inhoud,
};
