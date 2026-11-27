// Le guide Jouer aux dames chinoises en ligne avec des amis, en français (taak 304) : /fr/guides/dames-chinoises-en-ligne-avec-des-amis. Le texte suit ../en/ phrase par phrase.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Les étapes, du début au premier coup</h2>
      <ol>
        <li><strong>Choisissez un nom de joueur.</strong> C'est tout ce qu'il faut pour se connecter.</li>
        <li><strong>Créez une partie en ligne.</strong> Choisissez le plateau, le nombre de joueurs et le temps par coup.</li>
        <li><strong>Envoyez le lien d'invitation.</strong> Partagez-le depuis la salle d'attente, ou copiez-le et collez-le dans n'importe quelle application de messagerie.</li>
        <li><strong>Attendez que tout le monde l'ouvre.</strong> Quand la dernière place est prise, la partie commence et vous jouez en premier.</li>
      </ol>
      <p>Le reste de cette page explique chaque étape, et ce qui se passe quand un ami arrête de jouer.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Comment fonctionne le lien d'invitation</h2>
      <p>Une partie a un seul lien d'invitation, et tous les amis utilisent le même. Chaque ami qui l'ouvre prend la prochaine place libre. Vous avez créé la partie, donc vous êtes le joueur 1, et vous prenez la première place.</p>
      <ul>
        <li><strong>Combien de places :</strong> sur le plateau en étoile, une partie compte 2, 3, 4 ou 6 joueurs, et sur le plateau carré 2 ou 4. Vous le choisissez avant d'envoyer le lien. La partie ne commence pas avec des places vides, et aucun coup n'est joué avant que la dernière place soit prise.</li>
        <li><strong>La salle d'attente :</strong> pendant que vous attendez, la salle d'attente montre qui est là et combien de places restent libres. Elle se met à jour toute seule quand un ami arrive.</li>
        <li><strong>Le partage :</strong> le bouton Invitation ouvre le menu de partage de votre téléphone. Si celui-ci n'est pas disponible, il copie le lien, et vous pouvez le coller vous-même.</li>
        <li><strong>Dans le navigateur ou dans l'application :</strong> le lien fonctionne sans l'application, dans un navigateur. Si votre ami a l'application, le lien peut l'ouvrir.</li>
        <li><strong>Un lien complet ou inconnu :</strong> quand toutes les places sont prises, le lien indique que la partie est complète. Un lien qui n'existe pas indique que l'invitation est inconnue. Dans les deux cas, demandez un nouveau lien à votre ami.</li>
      </ul>
      <p>Le lien ne sert que pour cette partie. Il compte 16 caractères aléatoires, donc personne ne peut le deviner, mais quiconque le reçoit peut prendre une place libre. Envoyez-le seulement aux personnes avec qui vous voulez jouer.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Pas de compte, seulement un nom de joueur</h2>
      <p>Vous n'avez besoin ni d'une adresse e-mail ni d'un mot de passe. Vous choisissez un nom de joueur de 1 à 30 caractères, et les autres joueurs voient ce nom. Certains noms grossiers sont refusés, et vous en choisissez alors un autre.</p>
      <p>Après avoir choisi un nom, l'application affiche un code de récupération de 20 caractères, en cinq groupes. Enregistrez-le. Si vous changez de téléphone, vous saisissez le code et vous retrouvez votre nom de joueur. Sans le code, vous ne pouvez pas retrouver votre nom sur un nouveau téléphone.</p>
      <p>Vos amis font de même quand ils ouvrent votre lien : ils choisissent d'abord un nom, puis ils rejoignent votre partie.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Temps par coup : combien de temps un ami peut réfléchir</h2>
      <p>Le temps par coup est le temps maximal dont un joueur dispose pour un coup. Vous le réglez en créant la partie, et il vaut pour tous les joueurs de cette partie.</p>
      <ul>
        <li><strong>Les choix :</strong> 15 secondes, 30 secondes, 1 minute ou 2 minutes. Vous pouvez aussi le désactiver, sans aucune limite. L'application démarre à 30 secondes.</li>
        <li><strong>L'horloge :</strong> le serveur garde le temps, donc un téléphone dont l'heure est fausse ne change rien. L'application montre le temps qui reste.</li>
        <li><strong>La première horloge :</strong> elle démarre quand la dernière place est prise. Avant cela, personne n'est chronométré.</li>
        <li><strong>Une partie rapide :</strong> si vous touchez Jouer en ligne pour affronter un inconnu, le temps par coup est fixé à 30 secondes. Seule une partie entre amis vous laisse choisir.</li>
      </ul>
      <p>Pour des amis qui jouent depuis le canapé, 2 minutes ou aucune limite est tranquille. Pour une partie rapide, choisissez 15 secondes. Sans limite, une partie peut attendre aussi longtemps qu'il faut, et vous la terminez quand vous avez le temps.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Ce qui se passe quand quelqu'un décroche</h2>
      <p>Une partie vit sur le serveur, pas sur un téléphone. Si un ami ferme l'application, perd la connexion ou s'endort, la partie reste où elle est, et l'ami la retrouve dans Mes parties.</p>
      <ul>
        <li><strong>Le temps est écoulé :</strong> le tour de ce joueur est sauté. Rien ne bouge sur le plateau, et le joueur suivant est chronométré.</li>
        <li><strong>Trois tours de suite :</strong> un joueur qui manque 3 tours de suite abandonne de lui-même. Chaque coup que le joueur joue vraiment remet le compte à zéro.</li>
        <li><strong>Abandonner :</strong> les pions d'un joueur qui abandonne, par choix ou après 3 tours manqués, sont retirés du plateau, afin qu'ils ne bloquent personne.</li>
        <li><strong>Une partie à 2 :</strong> la partie se termine et l'autre joueur gagne.</li>
        <li><strong>Une partie à 3, 4 ou 6 :</strong> la partie continue sans le joueur parti, et le tour passe au joueur suivant encore en jeu.</li>
        <li><strong>Pas de temps par coup :</strong> si vous avez choisi aucune limite, la partie ne saute jamais un tour. Elle attend que l'ami revienne, ou que l'ami abandonne.</li>
      </ul>
      <p>Si vous avez activé les notifications, l'application vous prévient quand c'est votre tour, même quand elle est fermée. Activez-les depuis l'application, ou dans les réglages de votre téléphone ou de votre navigateur.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Après la partie</h2>
      <p>Les joueurs qui jouent ensemble grâce à une invitation sont ajoutés à la liste d'amis les uns des autres. De là, vous pouvez défier un ami pour une nouvelle partie, sans nouveau lien. Vos parties en cours et terminées sont dans Mes parties.</p>
      <p>Les règles sont nouvelles pour vous ? Lisez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>. Vous jouez à deux ? Lisez <a href="/fr/guides/dames-chinoises-a-deux">les dames chinoises à 2 joueurs</a>. Vous voulez gagner ? Lisez les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a>.</p>
      <p><a href="/fr/guides/dames-chinoises-a-trois">Dames chinoises à 3 joueurs</a></p>
    </section>`;

export default {
  nav: "Dames chinoises en ligne avec des amis",
  titel: "Jouer aux dames chinoises en ligne avec des amis | Leapstone",
  beschrijving: "Jouez aux dames chinoises en ligne avec des amis : lien d'invitation, temps par coup, simple nom de joueur, et ce qui arrive si quelqu'un décroche.",
  h1: "Jouer aux dames chinoises en ligne avec des amis",
  intro: "Créez une partie, envoyez un seul lien d'invitation et jouez quand tout le monde a rejoint. Il vous faut seulement un nom de joueur, et vous réglez vous-même le temps par coup.",
  inhoud,
};
