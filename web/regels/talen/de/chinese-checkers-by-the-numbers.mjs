// Leapstone in Zahlen, Deutsch (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Felder und Steine</h2>
      <p>Gezählt auf den beiden Brettern von Leapstone, in der Anfangsstellung einer Partie.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Das Sternbrett mit allen sechs Spitzen voll: zehn Steine in jeder von sechs Farben, um eine leere Mitte.",
  tekst: "Das Sternbrett zu Beginn einer Partie für sechs Spieler.",
})}
      <ul class="tips">
        <li><strong>Das Sternbrett hat ${f("sterbord_vakken")} Felder.</strong> Jeder Spieler beginnt mit ${f("sterbord_stenen_per_speler")} Steinen. Eine Partie zu zweit hat also ${f("sterbord_stenen_2_spelers")} Steine auf dem Brett, eine zu dritt ${f("sterbord_stenen_3_spelers")}, zu viert ${f("sterbord_stenen_4_spelers")} und zu sechst ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Das quadratische Halmabrett hat ${f("vierkant_vakken")} Felder.</strong> In einer Partie zu zweit beginnt jeder Spieler mit ${f("vierkant_stenen_per_speler_2_spelers")} Steinen, zusammen ${f("vierkant_stenen_2_spelers")}. In einer Partie zu viert beginnt jeder mit ${f("vierkant_stenen_per_speler_4_spelers")} Steinen, zusammen ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Die längste Sprungkette: ${f("langste_sprongketen")}</h2>
      <p>Auf dem Sternbrett kann ein Stein <strong>${f("langste_sprongketen")} Sprünge in einem einzigen Zug</strong> machen, und nach den Regeln von Leapstone kann kein Zug mehr haben. Für diese Zahl werden die anderen Steine frei aufgestellt: einer auf jedes Feld, über das der Stein springt.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Ein Sternbrett mit einem roten Stein und vielen blauen Steinen. Weiße Pfeile zeigen, wie der rote Stein über einen blauen Stein nach dem anderen springt, auf einem langen, gewundenen Weg.",
  tekst: "Die längste Kette: Der rote Stein springt über jeden blauen Stein, einen nach dem anderen.",
})}
      <p><strong>So wird gezählt.</strong> Ein Sprung landet immer zwei Felder weiter, in gerader Linie. Ein Stein, der immer weiter springt, erreicht deshalb nur einen Teil der Felder: Das Brett zerfällt in vier solche Gruppen, und die größte hat ${f("grootste_klasse_vakken")} Felder. In Leapstone darf ein Stein in einem Zug nicht zweimal auf demselben Feld landen und auch nicht auf dem Feld, von dem er losging. Eine Kette landet also höchstens einmal auf jedem anderen Feld ihrer Gruppe. Das Programm hat diese Gruppe durchsucht und einen Weg über alle ${f("grootste_klasse_vakken")} Felder gefunden. Länger kann also keine Kette sein: ${f("langste_sprongketen")} Sprünge. Ein Test spielt diesen Zug danach mit den Regeln von Leapstone.</p>
      <p><strong>Keine echte Partie.</strong> Diese Kette braucht ${f("langste_sprongketen")} andere Steine, jeden genau auf dem richtigen Feld. Eine Partie zu zweit oder zu dritt hat nur ${f("sterbord_stenen_2_spelers")} oder ${f("sterbord_stenen_3_spelers")} Steine, das ist zu wenig. Eine Partie zu viert oder zu sechst hat ${f("sterbord_stenen_4_spelers")} oder ${f("sterbord_stenen_6_spelers")}, das reicht. Aber in einer echten Partie stellt niemand Steine frei auf, also rechne nicht mit dieser Kette am Tisch. Sie zeigt, was das Brett zulässt, nicht was im Spiel passiert.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Die kürzeste Überquerung: ${f("oversteek_zetten")} Züge</h2>
      <p>Ein Spieler allein auf dem Sternbrett, ohne Gegner, braucht <strong>${f("oversteek_zetten")} Züge</strong>, um alle ${f("sterbord_stenen_per_speler")} Steine von einer Spitze in die gegenüberliegende zu bringen, und schafft es nicht in weniger. Eine ganze Sprungkette zählt als ein Zug.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Ein Sternbrett mit nur zehn roten Steinen in der unteren Spitze. Die obere Spitze, in die sie müssen, hat einen gestrichelten Rand.",
  tekst: "Ein Spieler allein: zehn Steine in der unteren Spitze, und die obere Spitze ist das Ziel.",
})}
      <p><strong>So wird gezählt.</strong> Ein Test spielt eine Überquerung in ${f("oversteek_zetten")} Zügen mit den Regeln von Leapstone, ohne andere Steine auf dem Brett. Um zu zeigen, dass ${f("geen_oversteek_in_zetten")} Züge oder weniger nicht reichen, folgt eine Suche der Methode von G. I. Bell (<em>Integers</em> 9, 2009). Jeder Zug lässt sich rückwärts spielen, und eine halbe Drehung des Bretts vertauscht Start und Ziel. Gäbe es also eine Überquerung in ${f("geen_oversteek_in_zetten")} Zügen oder weniger, dann läge eine Stellung auf halbem Weg höchstens ${f("zoekdiepte_zetten")} Züge vom Start entfernt, und dieselbe Stellung um eine halbe Drehung gedreht ebenfalls. Die Suche ging jede Stellung innerhalb von ${f("zoekdiepte_zetten")} Zügen vom Start durch, zählte eine Stellung und ihr Spiegelbild einmal, ließ die Stellungen weg, die nachweislich nicht rechtzeitig weit genug kommen, und fand kein solches Paar. Sie lief ${f("gemeten_rekentijd_seconden")} Sekunden auf einem Rechner mit ${f("gemeten_kernen")} Kernen, und ihr größter Schritt hielt ${f("gemeten_grootste_laag_miljoen_standen")} Millionen Stellungen in ${f("gemeten_geheugen_gb")} GB Speicher. Die Zahl wurde für das eigene Brett von Leapstone neu ausgerechnet.</p>
      <p><strong>Keine Untergrenze für eine echte Partie.</strong> In einer echten Partie stehen auch die Steine der anderen Spieler auf dem Brett, und deine Steine können über sie springen. ${f("oversteek_zetten")} ist also nicht das Mindeste, was eine echte Partie dauern kann: Bewiesen ist es nur für einen Spieler allein.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Probier es aus</h2>
      <p><a href="/play/">Spiel Leapstone im Browser</a> gegen den Computer, oder hol dir die App mit den Knöpfen oben auf dieser Seite. Die Regeln findest du unter <a href="/de/regeln/sternhalma">Sternhalma: Spielregeln</a> und in den <a href="/de/regeln/halma">Regeln von Halma</a>. Wie du Sprungketten in einer Partie nutzt, steht in den <a href="/de/anleitungen/sternhalma-strategie">Strategietipps</a>.</p>
    </section>`;

export default {
  nav: "Sternhalma in Zahlen",
  titel: "Sternhalma in Zahlen | Leapstone",
  beschrijving: `Das Sternbrett hat ${c.sterbord_vakken} Felder. Ein Zug hat höchstens ${c.langste_sprongketen} Sprünge, und ein Spieler allein braucht ${c.oversteek_zetten} Züge zur Überquerung. So wird jede Zahl berechnet.`,
  h1: "Sternhalma in Zahlen",
  intro: `Das Sternbrett von Sternhalma (Chinese Checkers) hat ${f("sterbord_vakken")} Felder, und jeder Spieler beginnt mit ${f("sterbord_stenen_per_speler")} Steinen. In Leapstone kann ein Zug nie mehr als ${f("langste_sprongketen")} Sprünge haben. Ein Spieler allein auf dem Brett, ohne Gegner, braucht ${f("oversteek_zetten")} Züge, um es zu überqueren. Unten siehst du, wie jede Zahl gezählt wird und was sie über eine echte Partie sagt und was nicht.`,
  inhoud,
};
