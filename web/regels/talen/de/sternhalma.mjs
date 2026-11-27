// Die deutsche Seite "Was ist Sternhalma?" (Aufgabe 133): der Name und die Beziehung zu Halma und Chinese Checkers.
// Inhalt und Quellen: die englische Seite ../en/sternhalma.mjs (Wikipedia Halma und Chinese Checkers, siehe dort). Satz für Satz auf Deutsch.
// Bewusst weggelassen, wie im Englischen: wer Stern-Halma 1892 herausgab (die Quellen widersprechen sich) und Patentjahre.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Was der Name bedeutet</h2>
      <p>Sternhalma ist der deutsche Name von Halma, gespielt auf einem sternförmigen Brett. Der Name setzt sich aus <em>Stern</em> und <em>Halma</em> zusammen. Der Name Chinese Checkers ist dasselbe Spiel unter einem Namen, der später in den Vereinigten Staaten vergeben wurde.</p>
      <p>In Leapstone ist das das <strong>Sternbrett</strong>: das Brett der <a href="/de/regeln/sternhalma">Regeln von Sternhalma (Chinese Checkers)</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Woher es kommt</h2>
      <ul>
        <li><strong>Halma</strong> wurde 1883 oder 1884 von George Howard Monks erfunden, einem amerikanischen Chirurgen. Der Name ist griechisch für &bdquo;Sprung&ldquo;. Es wird auf einem quadratischen Brett gespielt. <a href="/de/regeln/halma">Lies die Halma-Regeln</a>.</li>
        <li><strong>Stern-Halma</strong> erschien 1892 in Deutschland: dieselbe Idee auf einem Brett in Form eines sechszackigen Sterns.</li>
        <li><strong>Chinese Checkers</strong> ist der Name, den Bill und Jack Pressman dem Spiel 1928 in den Vereinigten Staaten gaben, zuerst als &bdquo;Hop Ching checkers&ldquo;. Das Spiel hat keine geschichtliche Verbindung zu China, und es ist kein Damespiel.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Wie sich die Spiele unterscheiden</h2>
      <ul>
        <li><strong>Halma:</strong> ein quadratisches Brett mit 16 mal 16 Feldern, für 2 oder 4 Spieler. Ein Stein hat acht Nachbarn, gerade und diagonal. Bei 2 Spielern hat jeder 19 Steine, bei 4 Spielern 13.</li>
        <li><strong>Sternhalma und Chinese Checkers:</strong> ein Sternbrett mit 121 Feldern, für 2, 3, 4 oder 6 Spieler. Ein Stein hat sechs Nachbarn. Jeder hat 10 Steine.</li>
        <li><strong>Der Rest ist gleich:</strong> ein Schritt auf einen freien Nachbarn oder ein Sprung über einen Stein, mit Sprungketten. Wer zuerst das Lager auf der anderen Seite des Bretts füllt, gewinnt.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianten, und was Leapstone macht</h2>
      <p>Halma wurde auf mehr als eine Art gespielt. So verhält sich Leapstone zu den Varianten, die wir in unseren Quellen gefunden haben:</p>
      <ul>
        <li><strong>Brettgröße.</strong> Halma wird auch auf Brettern mit 8 mal 8 und 10 mal 10 Feldern gespielt. Leapstone hat nur das Brett mit 16 mal 16 Feldern.</li>
        <li><strong>Das Ziel verlassen.</strong> Nach einer Halma-Regel darf ein Stein, der das Lager des Gegners erreicht hat, es nicht mehr verlassen. Leapstone hat diese Regel nicht: Du kannst einen solchen Stein wieder ziehen.</li>
        <li><strong>Drei Spieler auf einem Stern.</strong> Ein altes Halma für drei Spieler auf einem Sternbrett wird mit je 15 Steinen beschrieben. Leapstone spielt 3 Spieler auf dem Sternbrett mit je 10 Steinen.</li>
        <li><strong>Sprünge sind deine Wahl.</strong> Du musst nie springen. Du wählst das Feld, auf dem dein Zug endet.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Spiele es in Leapstone</h2>
      <p>Jetzt spielen öffnet eine Partie auf dem Sternbrett gegen den Computer. Für das quadratische Brett tippe oben auf den Zurück-Pfeil und wähle im Menü Quadratisches Brett.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Das Sternbrett mit 10 roten Steinen in der unteren Spitze und 10 blauen Steinen in der oberen Spitze",
  tekst: "Das Sternbrett für 2 Spieler.",
})}
    </section>`;

export default {
  nav: "Was ist Sternhalma?",
  titel: "Was ist Sternhalma? Halma auf einem Sternbrett | Leapstone",
  beschrijving: "Sternhalma ist der deutsche Name von Halma auf einem Sternbrett. Wie es zu Halma und Chinese Checkers passt, und wie du es gratis im Browser spielst.",
  h1: "Sternhalma, Halma und Chinese Checkers",
  intro: "Drei Namen für eng verwandte Spiele. Was jeder bedeutet, woher sie kommen und wie sie sich unterscheiden.",
  inhoud,
};
