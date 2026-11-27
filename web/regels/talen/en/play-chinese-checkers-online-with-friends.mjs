// De gids Play Chinese checkers online with friends (taak 304, feature 294): /guides/play-chinese-checkers-online-with-friends.
// Alles komt uit de code; docs/plan.md, taak 304, heeft de controle per bewering. Bronnen:
// - Bord en aantal Spelers: halma-core Game::new_star (2, 3, 4, 6) en Game::new_square (2, 4); opslag controleer_potjekeuze.
// - Uitnodiging: crates/halma-opslag opslag.rs maak_potje (maker op plek 0, 16 tekens), doe_mee (volgende plek, Fout::Vol, "Unknown invite"),
//   doe_zet ("The game has not started yet" tot het Potje vol is); web/src/Online.svelte (nodigUit: deelmenu of kopieer, uitnodigingsLink).
// - Spelersnaam: opslag schoon_naam (1 tot 30 tekens); codes::nieuwe_herstelcode (20 tekens in vijf groepen); geen e-mail of wachtwoord in de app.
// - Denktijd: opslag DENKTIJDEN [15, 30, 60, 120] of geen grens; web/src/denktijd.ts (STANDAARD_DENKTIJD 30); een Snel potje is vast 30 s.
// - Wegvallen: halma-core skip_turn, resign, after_turn; opslag MAX_GEMISTE_BEURTEN = 3; voeg_potje_vrienden_toe (Vriendenlijst).

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">The steps, from start to first move</h2>
      <ol>
        <li><strong>Choose a player name.</strong> That is all you need to sign in.</li>
        <li><strong>Create an online game.</strong> Choose the board, the number of players and the move time.</li>
        <li><strong>Send the invite link.</strong> Share it from the lobby, or copy it and paste it in any chat app.</li>
        <li><strong>Wait for everyone to open it.</strong> When the last seat is taken, the game starts and you move first.</li>
      </ol>
      <p>The rest of this page explains each part, and what happens when a friend stops playing.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">How the invite link works</h2>
      <p>One game has one invite link, and every friend uses the same one. Each friend who opens it takes the next free seat. You made the game, so you are Player 1, and you take the first seat.</p>
      <ul>
        <li><strong>How many seats:</strong> on the star board a game has 2, 3, 4 or 6 players, and on the square board 2 or 4. You choose this before you send the link. The game does not start with empty seats, and there is no move until the last seat is taken.</li>
        <li><strong>The lobby:</strong> while you wait, the lobby shows who is in and how many seats are still open. It updates by itself when a friend joins.</li>
        <li><strong>Sharing:</strong> the Invite button opens the share menu of your phone. If that is not available, it copies the link, and you can paste it yourself.</li>
        <li><strong>In the browser or in the app:</strong> the link works without the app, in a browser. If your friend has the app, the link can open it.</li>
        <li><strong>A full or unknown link:</strong> once every seat is taken, the link shows that the game is full. A link that does not exist shows that the invite is unknown. In both cases, ask your friend for a new link.</li>
      </ul>
      <p>The link is only for this game. It has 16 random characters, so nobody can guess it, but anyone who gets it can take a free seat. Send it only to the people you want to play with.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">No account, only a player name</h2>
      <p>You do not need an email address or a password. You choose a player name of 1 to 30 characters, and the other players see that name. Some rude names are refused, and then you choose another.</p>
      <p>After you choose a name, the app shows a recovery code of 20 characters, in five groups. Save it. If you get a new phone, you enter the code and you get your player name back. Without the code, you cannot get your name back on a new phone.</p>
      <p>Your friends do the same when they open your link: they choose a name first, and then they join your game.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Move time: how long a friend can think</h2>
      <p>The move time is the most time a player has for one move. You set it when you create the game, and it counts for everyone in that game.</p>
      <ul>
        <li><strong>The choices:</strong> 15 seconds, 30 seconds, 1 minute or 2 minutes. You can also turn it off, with no limit at all. The app starts at 30 seconds.</li>
        <li><strong>The clock:</strong> the server keeps the time, so a phone with a wrong clock does not change it. The app shows how much time is left.</li>
        <li><strong>The first clock:</strong> it starts when the last seat is taken. Before that, nobody is on the clock.</li>
        <li><strong>A quick game:</strong> if you tap Play online to play a stranger, the move time is fixed at 30 seconds. Only a game with friends lets you choose.</li>
      </ul>
      <p>For friends who play from the couch, 2 minutes or no limit is relaxed. For a fast game, choose 15 seconds. With no limit, a game can wait for as long as it takes, and you finish it when you have time.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">What happens when someone drops out</h2>
      <p>A game lives on the server, not on a phone. If a friend closes the app, loses the connection or goes to sleep, the game stays where it is, and the friend finds it again in My games.</p>
      <ul>
        <li><strong>The time runs out:</strong> the turn of that player is skipped. Nothing moves on the board, and the next player is on the clock.</li>
        <li><strong>Three turns in a row:</strong> a player who misses 3 turns in a row resigns by themselves. Every move the player does make sets the count back to zero.</li>
        <li><strong>Resigning:</strong> a player who resigns, by choice or after 3 missed turns, has the pieces removed from the board, so they do not block anyone.</li>
        <li><strong>A game for 2:</strong> the game ends and the other player wins.</li>
        <li><strong>A game for 3, 4 or 6:</strong> the game goes on without the player who is gone, and the turn passes to the next player who is still in.</li>
        <li><strong>No move time:</strong> if you chose no limit, the game never skips a turn. It waits until the friend comes back, or until the friend resigns.</li>
      </ul>
      <p>If you turned on notifications, the app tells you when it is your turn, also when it is closed. Turn them on from the app, or in your phone or browser settings.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">After the game</h2>
      <p>Players who play together through an invite are added to each other's Friends list. From there you can challenge a friend to a new game, without a new link. Your open and finished games are in My games.</p>
      <p>New to the rules? Read the <a href="/rules/chinese-checkers">Chinese checkers rules</a>. Playing with two? Read <a href="/guides/chinese-checkers-2-players">Chinese checkers for 2 players</a>, or <a href="/guides/chinese-checkers-3-players">for 3 players</a>. Want to win? Read the <a href="/guides/chinese-checkers-strategy">strategy tips</a>.</p>
    </section>`;

export default {
  nav: "Chinese checkers online with friends",
  titel: "Play Chinese checkers online with friends | Leapstone",
  beschrijving: "Play Chinese checkers online with friends: send an invite link, set the move time, play with only a player name, and see what happens if someone drops out.",
  h1: "Play Chinese checkers online with friends",
  intro: "Create a game, send one invite link and play when everyone has joined. You need only a player name, and you set the move time yourself.",
  inhoud,
};
