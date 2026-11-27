// Die Anleitung Sternhalma online mit Freunden (Aufgabe 304): /de/anleitungen/sternhalma-online-mit-freunden. Text folgt ../en/ Satz für Satz.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Die Schritte, vom Start bis zum ersten Zug</h2>
      <ol>
        <li><strong>Wähle einen Spielernamen.</strong> Mehr brauchst du nicht, um dich anzumelden.</li>
        <li><strong>Erstelle eine Online-Partie.</strong> Wähle das Brett, die Zahl der Spieler und die Bedenkzeit.</li>
        <li><strong>Schicke den Einladungslink.</strong> Teile ihn aus der Lobby, oder kopiere ihn und füge ihn in einer beliebigen Chat-App ein.</li>
        <li><strong>Warte, bis alle ihn geöffnet haben.</strong> Sobald der letzte Platz besetzt ist, beginnt die Partie, und du ziehst zuerst.</li>
      </ol>
      <p>Der Rest dieser Seite erklärt jeden Teil und was passiert, wenn ein Freund aufhört zu spielen.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">So funktioniert der Einladungslink</h2>
      <p>Eine Partie hat einen Einladungslink, und jeder Freund benutzt denselben. Jeder Freund, der ihn öffnet, bekommt den nächsten freien Platz. Du hast die Partie erstellt, also bist du Spieler 1 und nimmst den ersten Platz.</p>
      <ul>
        <li><strong>Wie viele Plätze:</strong> Auf dem Sternbrett hat eine Partie 2, 3, 4 oder 6 Spieler, auf dem quadratischen Brett 2 oder 4. Das wählst du, bevor du den Link schickst. Die Partie beginnt nicht mit leeren Plätzen, und es gibt keinen Zug, bis der letzte Platz besetzt ist.</li>
        <li><strong>Die Lobby:</strong> Während du wartest, zeigt die Lobby, wer schon da ist und wie viele Plätze noch frei sind. Sie aktualisiert sich von selbst, wenn ein Freund beitritt.</li>
        <li><strong>Teilen:</strong> Die Taste „Einladen“ öffnet das Teilen-Menü deines Handys. Gibt es das nicht, kopiert sie den Link, und du kannst ihn selbst einfügen.</li>
        <li><strong>Im Browser oder in der App:</strong> Der Link funktioniert auch ohne die App, in einem Browser. Hat dein Freund die App, kann der Link sie öffnen.</li>
        <li><strong>Ein voller oder unbekannter Link:</strong> Sind alle Plätze besetzt, zeigt der Link, dass die Partie voll ist. Bei einem Link, den es nicht gibt, steht dort, dass die Einladung unbekannt ist. Bitte in beiden Fällen deinen Freund um einen neuen Link.</li>
      </ul>
      <p>Der Link gilt nur für diese Partie. Er hat 16 zufällige Zeichen, also kann ihn niemand erraten, aber wer ihn bekommt, kann einen freien Platz nehmen. Schicke ihn nur an die Leute, mit denen du spielen willst.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Kein Konto, nur ein Spielername</h2>
      <p>Du brauchst keine E-Mail-Adresse und kein Passwort. Du wählst einen Spielernamen mit 1 bis 30 Zeichen, und die anderen Spieler sehen diesen Namen. Manche unhöfliche Namen werden abgelehnt, dann wählst du einen anderen.</p>
      <p>Nachdem du einen Namen gewählt hast, zeigt die App einen Wiederherstellungscode mit 20 Zeichen in fünf Gruppen. Speichere ihn. Wenn du ein neues Handy bekommst, gibst du den Code ein und hast deinen Spielernamen zurück. Ohne den Code bekommst du deinen Namen auf einem neuen Handy nicht zurück.</p>
      <p>Deine Freunde machen dasselbe, wenn sie deinen Link öffnen: Sie wählen zuerst einen Namen und treten dann deiner Partie bei.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Bedenkzeit: wie lange ein Freund nachdenken darf</h2>
      <p>Die Bedenkzeit ist die längste Zeit, die ein Spieler für einen Zug hat. Du stellst sie ein, wenn du die Partie erstellst, und sie gilt für alle in dieser Partie.</p>
      <ul>
        <li><strong>Die Auswahl:</strong> 15 Sekunden, 30 Sekunden, 1 Minute oder 2 Minuten. Du kannst die Bedenkzeit auch ausschalten, dann gibt es gar keine Grenze. Die App beginnt bei 30 Sekunden.</li>
        <li><strong>Die Uhr:</strong> Der Server misst die Zeit, also ändert ein Handy mit falscher Uhr nichts daran. Die App zeigt, wie viel Zeit noch bleibt.</li>
        <li><strong>Die erste Uhr:</strong> Sie startet, wenn der letzte Platz besetzt ist. Vorher ist niemand an der Uhr.</li>
        <li><strong>Eine schnelle Partie:</strong> Wenn du auf „Online spielen“ tippst, um gegen einen Fremden zu spielen, steht die Bedenkzeit fest auf 30 Sekunden. Nur bei einer Partie mit Freunden kannst du wählen.</li>
      </ul>
      <p>Für Freunde, die vom Sofa aus spielen, sind 2 Minuten oder keine Grenze entspannt. Für eine schnelle Partie wähle 15 Sekunden. Ohne Grenze kann eine Partie so lange warten, wie es nötig ist, und du beendest sie, wenn du Zeit hast.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Was passiert, wenn jemand ausfällt</h2>
      <p>Eine Partie lebt auf dem Server, nicht auf einem Handy. Schließt ein Freund die App, verliert er die Verbindung oder schläft er ein, bleibt die Partie, wo sie ist, und der Freund findet sie unter „Meine Partien“ wieder.</p>
      <ul>
        <li><strong>Die Zeit läuft ab:</strong> Der Zug dieses Spielers wird übersprungen. Auf dem Brett bewegt sich nichts, und der nächste Spieler ist an der Uhr.</li>
        <li><strong>Drei Züge hintereinander:</strong> Ein Spieler, der 3 Züge hintereinander verpasst, gibt von selbst auf. Jeder Zug, den der Spieler doch macht, setzt die Zählung auf null zurück.</li>
        <li><strong>Aufgeben:</strong> Bei einem Spieler, der aufgibt, aus eigener Entscheidung oder nach 3 verpassten Zügen, werden die Steine vom Brett genommen, damit sie niemanden blockieren.</li>
        <li><strong>Eine Partie für 2:</strong> Die Partie endet, und der andere Spieler gewinnt.</li>
        <li><strong>Eine Partie zu 3, 4 oder 6:</strong> Die Partie geht ohne den Spieler weiter, der weg ist, und der Zug geht an den nächsten Spieler, der noch dabei ist.</li>
        <li><strong>Keine Bedenkzeit:</strong> Hast du keine Grenze gewählt, überspringt die Partie nie einen Zug. Sie wartet, bis der Freund zurückkommt oder bis der Freund aufgibt.</li>
      </ul>
      <p>Wenn du Benachrichtigungen eingeschaltet hast, sagt dir die App, wann du dran bist, auch wenn sie geschlossen ist. Schalte sie in der App ein oder in den Einstellungen deines Handys oder Browsers.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Nach der Partie</h2>
      <p>Spieler, die über eine Einladung zusammen spielen, landen in der Freundesliste des jeweils anderen. Von dort aus kannst du einen Freund zu einer neuen Partie herausfordern, ohne neuen Link. Deine offenen und beendeten Partien findest du unter „Meine Partien“.</p>
      <p>Die Regeln noch nicht gelesen? Lies die <a href="/de/regeln/sternhalma">Regeln von Sternhalma</a>. Du spielst zu zweit? Lies <a href="/de/anleitungen/sternhalma-zu-zweit">Sternhalma zu zweit</a>. Du willst gewinnen? Lies die <a href="/de/anleitungen/sternhalma-strategie">Strategie-Tipps</a>.</p>
      <p><a href="/de/anleitungen/sternhalma-zu-dritt">Sternhalma zu dritt</a></p>
    </section>`;

export default {
  nav: "Sternhalma online mit Freunden",
  titel: "Sternhalma online mit Freunden spielen | Leapstone",
  beschrijving: "Sternhalma online mit Freunden: Einladungslink schicken, Bedenkzeit einstellen, nur mit Spielernamen spielen und sehen, was bei einem Ausfall passiert.",
  h1: "Sternhalma online mit Freunden spielen",
  intro: "Erstelle eine Partie, schicke einen Einladungslink und spielt los, sobald alle da sind. Du brauchst nur einen Spielernamen und stellst die Bedenkzeit selbst ein.",
  inhoud,
};
