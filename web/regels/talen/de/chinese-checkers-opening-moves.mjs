// Die deutsche Anleitung Sternhalma-Eröffnungszüge (Aufgabe 303, Feature 294): /de/anleitungen/sternhalma-eroeffnungszuege.
// Inhalt: die englische Anleitung ../en/chinese-checkers-opening-moves.mjs, Satz für Satz auf Deutsch. Jede Zahl und jeder Zug ist gegen
// crates/halma-core geprüft; die Bilder kommen aus crates/halma-core/examples/regelplaatjes.rs (Abschnitt "taak 303"). Ändert sich ein Zug, ändere beide.
// Eine "Reihe" sind alle Felder mit demselben Abstand zu deiner eigenen Spitze; ein Schritt rückt 1 Reihe vor, ein Sprung 2.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Dein erster Zug: 14 Möglichkeiten</h2>
      <p>Am Anfang füllen deine 10 Steine ein Dreieck in Reihen zu 4, 3, 2 und 1, und die vorderste Reihe zeigt zur Mitte des Bretts. Im Dreieck gibt es kein leeres Feld, also kann ein Stein nur in die Reihe direkt vor ihm. Das ergibt 14 erste Züge: Jeder der 4 Steine in der vorderen Reihe kann auf 2 Felder ziehen (8 Schritte), und jeder der 3 Steine in der zweiten Reihe kann über einen vorderen Stein auf 2 Felder springen (6 Sprünge). Die anderen 3 Steine können noch nicht ziehen.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Die rote Spitze unten mit ihren 10 Steinen, und in der Reihe direkt davor 5 leere Felder, die mit einem Ring markiert sind.",
  tekst: "Jeder erste Zug endet auf einem dieser 5 Felder.",
})}
      <p>In dieser Anleitung ist eine Reihe eine Linie von Feldern quer über deine Spitze, parallel zu ihrer Vorderkante, und wir zählen den Fortschritt in Reihen. Ein Schritt bringt einen Stein 1 Reihe voran, ein Sprung bringt ihn 2 Reihen voran. Jeder Spieler hat dieselben 14 ersten Züge, mit 2, 3, 4 oder 6 Spielern und von jeder Spitze des Sterns aus, denn von innen sieht jede Spitze gleich aus.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Eröffnung 1: herausspringen, dann den hintersten Stein befreien</h2>
      <p>Der Stein ganz hinten in deiner Spitze ist am weitesten von deinem Ziel entfernt, und er kann am Anfang nicht ziehen: Er kann nur über einen Stein springen, wenn das Feld hinter diesem Stein leer ist. Ein Sprung aus der zweiten Reihe schafft genau so ein Feld.</p>
      <ol>
        <li><strong>Zug 1:</strong> Der Stein am rechten Ende deiner zweiten Reihe springt über den Stein vor ihm. Er landet in der Reihe vor deiner Spitze und gewinnt 2 Reihen.</li>
        <li><strong>Zug 2:</strong> Der hinterste Stein springt zweimal in einem Zug: erst auf das Feld, das Zug 1 geleert hat, dann über einen Stein der zweiten Reihe. Er gewinnt 4 Reihen.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Die rote Spitze nach Zug 1. Der hinterste Stein hat einen Ring, und 2 Pfeile mit den Zahlen 1 und 2 zeigen seine Sprünge durch das geleerte Feld in die Reihe vor der Spitze.",
  tekst: "Nach Zug 1 springt der hinterste Stein in 2 Sprüngen heraus.",
})}
      <p>Das sind 6 Reihen in 2 Zügen. Wir haben alle Möglichkeiten ausprobiert, 2 Züge zu spielen, und 6 ist das Meiste, was du gewinnen kannst. Nur 4 Zugpaare schaffen es: Der Stein an einem der beiden Enden der zweiten Reihe springt, in eine seiner 2 Richtungen, und der hinterste Stein folgt. Der Stein in der Mitte der zweiten Reihe funktioniert nicht, weil er den hintersten Stein eingeschlossen lässt.</p>
      <p>Beide Steine stehen nun in der Reihe vor deiner Spitze, mit einem leeren Feld dazwischen. Das ist der erste Schritt einer Leiter.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Eröffnung 2: 4 Züge mit 4 verschiedenen Steinen</h2>
      <p>In 4 Zügen kannst du höchstens 13 Reihen gewinnen, und das gelingt nur, wenn jeder Zug einen anderen Stein benutzt. Diese Folge schafft es:</p>
      <ol>
        <li><strong>Zug 1:</strong> Der Stein am rechten Ende der vorderen Reihe zieht einen Schritt vor. Er gewinnt 1 Reihe.</li>
        <li><strong>Zug 2:</strong> Der Stein am rechten Ende der dritten Reihe springt zweimal. Er gewinnt 4 Reihen.</li>
        <li><strong>Zug 3:</strong> Der Stein am linken Ende der zweiten Reihe springt zweimal. Er gewinnt 4 Reihen.</li>
        <li><strong>Zug 4:</strong> Der hinterste Stein springt zweimal. Er gewinnt 4 Reihen.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Die rote Spitze am Anfang. Die 4 Steine, die ziehen werden, tragen eine Zahl von 1 bis 4, in der Reihenfolge der Züge.",
          tekst: "Vorher: die ziehenden Steine, der Reihe nach.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Die rote Spitze nach 4 Zügen, mit den 4 Feldern, auf denen die nummerierten Steine in den Reihen vor der Spitze gelandet sind, und 4 Lücken, die in der Spitze zurückbleiben.",
          tekst: "Nachher: wo sie gelandet sind.",
        })}
      </div>
      <p>Jeder Zug bereitet den nächsten vor. Zug 2 und 3 enden mit einem Sprung über den Stein, der kurz zuvor gezogen ist, und Zug 4 beginnt durch die Lücke, die Zug 3 hinterlassen hat. Alle 4 Steine landen in deiner eigenen Hälfte des Bretts.</p>
      <p>Es gibt weitere Folgen, die 13 erreichen. Gemeinsam ist ihnen die Idee: Such den Zug, der eine Lücke oder einen Trittstein für den nächsten Zug hinterlässt, und lass den hintersten Stein spätestens bei Zug 4 heraus.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Fehler bei den ersten Zügen</h2>
      <ul class="tips">
        <li><strong>Jede Runde denselben Stein ziehen.</strong> Ein Stein, der allein läuft, gewinnt 5 Reihen in 4 Zügen, gegen 13 bei 4 verschiedenen Steinen. Außerdem lässt er den Rest deiner Steine dort, wo sie waren.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Die rote Spitze am Anfang. Ein Stein aus der zweiten Reihe macht 4 Züge hintereinander entlang einer Linie, mit Pfeilen und den Zahlen 1 bis 4, und endet allein nahe der Mitte des Bretts.",
  tekst: "Ein Stein, 4 Züge, 5 Reihen.",
})}
      <ul class="tips">
        <li><strong>Nur mit der vorderen Reihe Schritte machen.</strong> 4 Schritte gewinnen 4 Reihen. Danach kann der hinterste Stein immer noch nicht ziehen, also bleibt er hinten, während der Rest vorangeht.</li>
        <li><strong>Seitwärts ziehen.</strong> Ein Schritt entlang einer Reihe gewinnt 0 Reihen. Nach Zug 1 von Eröffnung 1 kann der vordere Stein auf das Feld neben ihm ziehen, und das sieht nach Fortschritt aus, aber der Zug ist verschenkt.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Weiter geht es</h2>
      <p>Nach etwa 4 Zügen kommen sich die beiden Heere nahe, und die Eröffnungen oben gehen ins Mittelspiel über. Du musst dir die Folgen nicht merken: Merk dir, dass jeder Zug den nächsten vorbereiten soll.</p>
      <ul>
        <li><a href="/play/">Spiele im Browser gegen den Computer</a> und probiere Eröffnung 1 oder 2 aus.</li>
        <li><a href="/de/anleitungen/sternhalma-strategie">Sternhalma-Strategie</a>: Leitern, die Steine zusammenhalten und das Ziel füllen.</li>
        <li><a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>: wie eine Partie zu zweit abläuft.</li>
        <li><a href="/de/regeln/sternhalma">Sternhalma-Regeln</a>, mit Bildern von Schritten, Sprüngen und Ketten.</li>
      </ul>
    </section>`;

export default {
  nav: "Sternhalma-Eröffnungszüge",
  titel: "Sternhalma Eröffnungszüge: 2 Eröffnungen | Leapstone",
  beschrijving: "Eröffnungszüge bei Sternhalma (Chinese Checkers): aus der Spitze springen, den hintersten Stein bis Zug 2 befreien, 13 Reihen in 4 Zügen, Fehler.",
  h1: "Sternhalma (Chinese Checkers): Eröffnungszüge",
  intro: "Eine gute Eröffnung bei Sternhalma springt aus der zweiten Reihe, nimmt jede Runde einen anderen Stein und lässt den Stein ganz hinten in deiner Spitze bis Zug 2 oder 4 heraus. Zwei Eröffnungen mit Bildern und die Fehler, die du vermeiden solltest.",
  inhoud,
};
