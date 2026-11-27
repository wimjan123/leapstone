// Le guide français Dames chinoises à 4 joueurs (taak 301) : /fr/guides/dames-chinoises-a-quatre.
// Contenu : le guide anglais ../en/chinese-checkers-4-players.mjs, phrase par phrase en français.
// Les textes des boutons de l'application viennent de web/src/talen/fr.ts.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Comment le plateau est partagé</h2>
      <p>Chaque joueur a 10 pions, donc 40 pions sont posés sur un plateau de 121 cases. Les quatre pointes de départ sont deux paires de pointes côte à côte : le rouge en bas et le bleu en bas à gauche, le vert en haut et le jaune en haut à droite.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas, 10 pions bleus dans la pointe du bas à gauche, 10 pions verts dans la pointe du haut et 10 pions jaunes dans la pointe du haut à droite. Les pointes du haut à gauche et du bas à droite sont vides.",
  tekst: "Le rouge en bas, le bleu en bas à gauche, le vert en haut, le jaune en haut à droite.",
})}
      <p>Le joueur 1, le rouge, commence. Ensuite le bleu est le joueur 2, le vert est le joueur 3, le jaune est le joueur 4, et après le jaune, c'est de nouveau le rouge. Un coup est un pas ou une chaîne de sauts avec un seul pion. Pour les pas et les sauts, voyez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Qui fait face à qui</h2>
      <p>Les pointes se répondent deux à deux de part et d'autre du plateau : le rouge fait face au vert, et le bleu fait face au jaune. Votre but est la pointe en face de vous. Le rouge va là où le vert part, le vert là où le rouge part, le bleu là où le jaune part et le jaune là où le bleu part.</p>
      <p>Comme dans une partie à 2, chaque but commence plein des pions du joueur qui vous fait face, donc vous ne pouvez y atterrir qu'après leur départ. À 3 joueurs, les buts commencent vides, donc à 4 personne ne peut terminer tout de suite. Les quatre buts sont quatre pointes différentes, donc personne d'autre ne veut votre but : un joueur qui a terminé ne bloque jamais personne.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Les deux pointes vides</h2>
      <p>Les pointes du haut à gauche et du bas à droite ne contiennent aucun pion. Elles ne sont le départ ni le but de personne. Celle du haut à gauche se trouve entre le bleu et le vert, et celle du bas à droite entre le jaune et le rouge.</p>
      <p>Vous pouvez faire un pas ou un saut sur n'importe quelle case vide, donc vous pouvez traverser ces pointes ou vous y arrêter. Un pion qui s'y trouve n'est pourtant pas encore dans un but. Dans une pointe vide, il n'y a rien à sauter tant que personne n'y amène des pions.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Ce qui change dans votre tactique</h2>
      <ul>
        <li><strong>Deux traversées à la fois :</strong> le rouge et le vert traversent le plateau l'un vers l'autre, et le bleu et le jaune aussi. Les deux lignes passent par le milieu, donc le milieu est plus fréquenté que dans une partie à 2, où une seule ligne traverse.</li>
        <li><strong>Trois joueurs jouent entre vos tours :</strong> le plateau change davantage entre deux de vos coups que dans une partie à 2. Regardez-le de nouveau au début de chaque tour, et préparez alors votre chaîne de sauts. Le joueur qui joue après vous n'est jamais celui qui vous fait face.</li>
        <li><strong>Les pions aident tout le monde :</strong> chaque pion des trois autres est une marche pour vous, et les vôtres sont des marches pour eux. Les pions du joueur en face de vous vont dans le sens opposé, comme dans une partie à 2.</li>
        <li><strong>De la place pour contourner :</strong> si le milieu est plein, les pointes vides sont de l'espace libre à côté des camps. Un trajet par l'une d'elles peut être un moyen de contourner la foule.</li>
        <li><strong>Un joueur qui abandonne libère votre but :</strong> quand le joueur en face de vous abandonne, ses pions quittent le plateau, donc votre but est vide aussitôt.</li>
      </ul>
      <p>Les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a> sur les échelles, les retardataires et le remplissage du but par l'arrière sont les mêmes à 4 joueurs.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gagner, et ce qui se passe ensuite</h2>
      <ul>
        <li><strong>Gagner :</strong> le premier joueur qui remplit le but avec ses 10 pions gagne. La partie ne s'arrête pas là : les trois autres continuent pour les places suivantes, et le joueur qui a terminé est sauté. Les pions de ce joueur restent sur le plateau. La partie est terminée quand un seul joueur joue encore.</li>
        <li><strong>Abandonner :</strong> vos pions quittent le plateau et les trois autres continuent. Si les autres abandonnent aussi, le dernier joueur restant gagne.</li>
        <li><strong>Temps (en ligne) :</strong> dans une partie en ligne, chaque coup a une limite de temps. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez, et la partie continue sans vous.</li>
      </ul>
      <p>Pour les parties à moins de joueurs, lisez <a href="/fr/guides/dames-chinoises-a-deux">Dames chinoises à 2 joueurs</a>. La <a href="/fr/regles/dames-chinoises">page des règles</a> a des images de chaque départ.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Où jouer à 4 joueurs dans Leapstone</h2>
      <ul>
        <li><strong>Contre l'ordinateur, tout de suite :</strong> ouvrez <a href="/play/">Leapstone dans le navigateur</a>, touchez Ordinateur, choisissez le plateau en étoile et 3 ordinateurs. Vous êtes le joueur 1, vous jouez donc en premier. Pour les ordinateurs, vous choisissez Facile, Normal ou Difficile.</li>
        <li><strong>Sur un seul téléphone :</strong> touchez Jouer, choisissez le plateau en étoile et 4 joueurs, puis touchez un pion pour faire passer cette place d'une personne à un ordinateur, ou l'inverse.</li>
        <li><strong>En ligne avec des amis :</strong> touchez Amis, choisissez le plateau en étoile, 4 joueurs et le temps par coup, et envoyez le lien d'invitation. La partie commence quand les 4 places sont prises.</li>
        <li><strong>Partie rapide, dans l'application :</strong> touchez Jouer en ligne. Pendant qu'elle cherche une partie à 2, touchez Chercher 4 ou 6 joueurs pour chercher plutôt une partie à 4. Chaque coup dure 30 secondes. Si trop peu de joueurs arrivent en 20 secondes, des joueurs de l'ordinateur remplissent les places vides, donc certains adversaires peuvent être des joueurs de l'ordinateur.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames chinoises à 4 joueurs",
  titel: "Dames chinoises à 4 : mise en place, conseils | Leapstone",
  beschrijving: "Comment jouer aux dames chinoises à 4 joueurs : le partage du plateau, les 2 pointes vides, qui fait face à qui, la tactique et où jouer.",
  h1: "Dames chinoises à 4 joueurs",
  intro: "À 4 joueurs, chacun de vous part de l'une des quatre pointes de l'étoile, et deux pointes restent vides. Le rouge fait face au vert et le bleu fait face au jaune : votre but est la pointe en face de vous, pleine des pions de ce joueur. Voici la mise en place, les pointes vides, la tactique et où y jouer.",
  inhoud,
};
