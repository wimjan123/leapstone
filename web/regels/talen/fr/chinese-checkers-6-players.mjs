// De gids Dames chinoises à 6 joueurs (taak 302): /fr/guides/dames-chinoises-a-six.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Frans. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Comment la partie commence</h2>
      <p>Chaque joueur a 10 pions, et les 6 pointes de l'étoile sont toutes utilisées. Cela met 60 pions sur le plateau de 121 cases. Les 61 cases du milieu sont vides au départ.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 10 pions dans chacune de ses 6 pointes, en 6 couleurs",
  tekst: "6 joueurs, 6 pointes, 60 pions.",
})}
      <p>Le joueur 1, le rouge, commence, depuis la pointe du bas. Le tour passe ensuite du joueur 1 au joueur 6, et après le joueur 6 c'est de nouveau le joueur 1. Les joueurs sont numérotés dans l'ordre de leurs pointes autour de l'étoile, donc le joueur après vous part toujours de la pointe voisine de la vôtre. Un coup est un pas ou une chaîne de sauts avec un seul pion. Pour les pas et les sauts, voyez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Chaque but est plein au départ</h2>
      <p>Vous gagnez en amenant vos 10 pions dans la pointe de l'autre côté du plateau. À 6 joueurs, c'est la pointe d'où part le joueur en face de vous, donc aucun but n'est vide : chaque but commence plein des pions d'un autre joueur. Pour le rouge, le but est la pointe du haut, d'où part le joueur 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 6 pointes pleines. Un anneau en pointillés marque la pointe du haut, le but du joueur rouge, qui contient les pions du joueur d'en face.",
  tekst: "Le but du rouge est la pointe d'en face, pleine des pions du joueur 4.",
})}
      <p>Vous ne pouvez atterrir que sur une case vide, donc le joueur d'en face doit quitter sa pointe avant que vous puissiez la remplir, et vous devez quitter la vôtre avant qu'il puisse remplir la sienne. Dans une partie à 2, c'est tout. À 6, vous devez aussi tous les deux traverser la foule des 4 autres.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Un milieu bondé</h2>
      <p>Chaque but est de l'autre côté du plateau, et les pointes ne communiquent que par le milieu, donc les 60 pions doivent tous traverser les mêmes 61 cases. Au départ, personne n'a encore traversé, et le milieu se remplit vite.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Un pion rouge saute trois fois en un seul coup : par-dessus un pion bleu, puis un pion vert, puis un pion violet. Les chiffres 1, 2 et 3 marquent les cases d'arrivée.",
  tekst: "Les pions de chaque couleur sont des marches.",
})}
      <p>Vous pouvez sauter par-dessus un pion de n'importe quelle couleur. Les pions de 5 autres joueurs sont des marches pour vous, et les vôtres sont des marches pour chacun de ces 5 joueurs. Une ligne de pions que vous laissez au milieu est une échelle pour quiconque peut l'atteindre, et le joueur qui vous suit joue en premier.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Bloquer avec 5 adversaires</h2>
      <ul>
        <li><strong>Remplir la case d'arrivée :</strong> un saut demande une case vide juste derrière le pion. Quand vous y posez un pion, le saut disparaît pour tous les joueurs qui voulaient le faire.</li>
        <li><strong>Attention aux échelles que vous construisez :</strong> après votre coup, les 5 autres joueurs jouent avant que ce soit de nouveau à vous. Une échelle les aide tous.</li>
        <li><strong>N'importe qui peut bloquer un but :</strong> un pion de n'importe quel autre joueur dans votre but vous empêche de terminer, pas seulement un pion du joueur d'en face. Les 10 cases du but doivent contenir vos propres pions.</li>
      </ul>
      <p>Les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a> montrent à quoi ressemble un saut bloqué, et comment ne pas enfermer un pion d'un autre joueur dans votre propre but.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Combien de temps dure une partie</h2>
      <p>Une partie à 6 a 60 pions à déplacer, et entre un de vos coups et le suivant, les 5 autres joueurs en jouent chacun un. Elle ne s'arrête pas non plus quand le premier joueur termine.</p>
      <ul>
        <li><strong>Gagner, et continuer à jouer :</strong> le premier joueur qui remplit son but gagne, et les autres continuent pour les places suivantes. Le joueur qui a terminé est sauté, et ses pions restent sur le plateau comme marches. La partie est finie quand il ne reste qu'un joueur en jeu.</li>
        <li><strong>Abandonner :</strong> vos pions quittent le plateau, donc ils ne bloquent et n'aident plus personne, et les autres continuent.</li>
        <li><strong>Temps (en ligne) :</strong> dans une partie en ligne, chaque coup a une limite de temps, fixée par le joueur qui lance la partie : 15 secondes, 30 secondes, 1 minute, 2 minutes ou pas de limite. Une ronde de 6 coups dure au plus 6 fois la limite, donc avec 30 secondes, 3 minutes au plus. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez, et la partie continue sans vous.</li>
      </ul>
      <p>Pour une partie avec moins de joueurs, lisez <a href="/fr/guides/dames-chinoises-a-deux">Dames chinoises à 2 joueurs</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Où jouer à 6 joueurs dans Leapstone</h2>
      <ul>
        <li><strong>Contre l'ordinateur, tout de suite :</strong> ouvrez <a href="/play/">Leapstone dans le navigateur</a>, touchez Ordinateur, choisissez le plateau en étoile et 5 ordinateurs. Vous êtes le joueur 1, vous jouez donc en premier. Les ordinateurs jouent l'un après l'autre, chacun avec une courte pause, pour que vous puissiez suivre chaque coup. Vous choisissez Facile, Normal ou Difficile pour les ordinateurs.</li>
        <li><strong>Sur un seul téléphone :</strong> touchez Jouer, choisissez le plateau en étoile et 6 joueurs, puis touchez un pion pour faire passer cette place d'une personne à un ordinateur, et inversement.</li>
        <li><strong>En ligne avec des amis :</strong> touchez Amis, choisissez le plateau en étoile, 6 joueurs et le temps par coup, puis envoyez le lien d'invitation. La partie commence quand les 6 places sont prises.</li>
        <li><strong>Parties rapides :</strong> Jouer en ligne trouve des parties à 2 ou 4 joueurs, donc il n'y a pas de partie rapide à 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames chinoises à 6 joueurs",
  titel: "Dames chinoises à 6 : le plateau plein | Leapstone",
  beschrijving: "Comment fonctionnent les dames chinoises à 6 joueurs : une étoile pleine de 60 pions, un milieu bondé, le blocage, la durée d'une partie, et où jouer.",
  h1: "Dames chinoises à 6 joueurs",
  intro: "Comment se joue une partie à 6 : les 6 pointes sont pleines, vous courez vers la pointe d'en face, et la partie continue après l'arrivée du premier joueur.",
  inhoud,
};
