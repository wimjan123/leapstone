// La page de règles du Halma en français (taak 134). Contenu : la page anglaise ../en/halma.mjs (vérifiée contre crates/halma-core,
// voir docs/plan.md, taak 117), phrase par phrase en français. Si l'on change une règle, on change les deux.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 joueurs : 19 pions chacun",
    alt: "Le plateau carré avec 19 pions rouges dans le coin en haut à gauche et 19 pions bleus dans le coin en bas à droite",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 joueurs : 13 pions chacun",
    alt: "Le plateau carré avec 13 pions dans chacun des quatre coins : rouge en haut à gauche, bleu en haut à droite, vert en bas à droite et jaune en bas à gauche",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Le plateau</h2>
      <p>On joue au Halma sur un plateau carré de 16 par 16 cases, soit 256 en tout. Chaque case a jusqu'à huit voisines : les quatre en ligne droite et les quatre en diagonale. Une case sur le bord en a moins, et un coin en a trois.</p>
      <p>C'est le plateau carré de Leapstone. Si vous connaissez le jeu sur le plateau en étoile, lisez ce qu'est le <a href="/fr/regles/qu-est-ce-que-le-sternhalma">Sternhalma</a> et les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">La position de départ</h2>
      <p>Le Halma se joue à 2 ou 4 joueurs. Chaque joueur commence avec ses pions dans un camp, dans un coin du plateau. Le camp du coin opposé est votre but.</p>
      <ul>
        <li><strong>2 joueurs :</strong> 19 pions chacun, dans deux coins opposés. Le camp compte cinq rangées de 5, 5, 4, 3 et 2 cases.</li>
        <li><strong>4 joueurs :</strong> 13 pions chacun, un camp dans chaque coin. Le camp compte quatre rangées de 4, 4, 3 et 2 cases. Votre but est le coin de l'autre côté du plateau, en diagonale.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">À tour de rôle</h2>
      <p>Le joueur 1 commence. Ensuite, les tours se suivent dans l'ordre, et après le dernier joueur, c'est de nouveau le joueur 1. Dans Leapstone, les couleurs vont avec les numéros : rouge, bleu, vert et jaune.</p>
      <p>À votre tour, vous déplacez un pion, une seule fois. Rien n'est capturé : les pions restent sur le plateau jusqu'à ce que leur joueur abandonne.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Déplacez un pion vers une case vide à côté de lui, dans l'une des huit directions : en ligne droite ou en diagonale.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Un pion rouge entouré d'un anneau blanc. Cinq de ses huit cases voisines sont vides et marquées ; les trois autres contiennent des pions.",
  tekst: "Le pion rouge peut avancer vers les cinq cases marquées. Les trois autres cases voisines sont prises.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un saut</h2>
      <p>Sautez par-dessus un pion voisin du vôtre, de n'importe quelle couleur, et posez-vous sur la case vide juste derrière, en ligne droite. Vous pouvez sauter dans les huit directions, aussi en diagonale et en arrière.</p>
      <ul>
        <li>La case où vous atterrissez doit être vide.</li>
        <li>Vous ne pouvez pas sauter par-dessus deux pions à la suite, ni par-dessus une case vide.</li>
        <li>Le pion que vous survolez reste à sa place.</li>
        <li>Vous ne pouvez pas sauter par-dessus le bord du plateau.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Un pion rouge saute en diagonale par-dessus un pion bleu vers la case vide derrière lui, montré par une flèche.",
  tekst: "Le pion rouge saute en diagonale par-dessus le pion bleu.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Une chaîne de sauts</h2>
      <p>Après un saut, le même pion peut sauter encore, autant de fois qu'il le peut, dans n'importe quelle direction, en ligne droite ou en diagonale. Vous décidez où vous vous arrêtez. Tous les sauts ensemble forment un seul coup.</p>
      <ul>
        <li>Dans un même coup, vous ne pouvez pas atterrir deux fois sur la même case.</li>
        <li>Un coup est un pas, ou un ou plusieurs sauts. Vous ne pouvez pas faire un pas après un saut.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Un pion rouge fait trois sauts en un coup : en diagonale par-dessus un pion bleu, en ligne droite par-dessus un autre pion bleu, et en diagonale par-dessus un pion rouge. Les trois cases d'arrivée portent les numéros 1, 2 et 3.",
  tekst: "Un coup avec trois sauts, dans l'ordre des numéros.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Le but</h2>
      <p>Vous gagnez en amenant tous vos pions dans le camp opposé à votre départ. Chaque case de ce camp doit contenir vos propres pions : 19 à 2 joueurs, 13 à 4 joueurs. Tant qu'un pion d'un autre joueur s'y trouve, vous ne pouvez pas terminer.</p>
      <p>Vous pouvez atterrir sur n'importe quelle case vide, aussi dans les camps des autres joueurs. Un pion qui se trouve dans votre but peut en ressortir ; rien ne le bloque.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Le plateau carré pour deux joueurs. Le rouge part en haut à gauche ; le camp en bas à droite, marqué de cercles en pointillés et occupé par des pions bleus, est le but du rouge.",
  tekst: "À 2 joueurs, le but du rouge est le camp où part le bleu.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">À 2 ou 4 joueurs</h2>
      <ul>
        <li><strong>2 joueurs :</strong> le premier joueur qui remplit son but gagne, et la partie est terminée.</li>
        <li><strong>4 joueurs :</strong> le premier joueur qui remplit son but gagne. Les autres continuent pour les places suivantes, et un joueur qui a terminé est sauté. La partie est terminée quand un seul joueur joue encore.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonner</h2>
      <p>Quand vous abandonnez, vos pions quittent le plateau, ils ne gênent donc plus personne. À 2 joueurs, l'autre joueur gagne. À 4 joueurs, la partie continue sans vous, et si tous les joueurs sauf un abandonnent, le dernier joueur gagne.</p>
      <p>Dans une partie en ligne, chaque coup a une limite de temps. Le joueur qui lance la partie la règle. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez. Les parties contre l'ordinateur et sur un seul téléphone n'ont pas de limite de temps.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Conseils</h2>
      <ul class="tips">
        <li><strong>Construisez des échelles.</strong> Alignez des pions avec une case vide entre chacun, en ligne droite ou en diagonale, en direction de votre but. Un pion peut alors sauter le long de toute la ligne en un seul coup.</li>
        <li><strong>Tout pion est une échelle.</strong> Vous pouvez sauter par-dessus toutes les couleurs, donc les pions des autres joueurs vous aident aussi. Et vos propres échelles les aident : regardez ce que vous laissez derrière vous.</li>
        <li><strong>Utilisez les diagonales.</strong> Le but est dans le coin opposé, donc une ligne de pions en diagonale est le chemin le plus rapide pour traverser.</li>
        <li><strong>N'oubliez pas les retardataires.</strong> Il vous faut tous vos pions à l'arrivée. Un pion très en arrière, sans rien à sauter, avance d'une case par tour. Faites-le avancer tant que les autres pions sont encore autour de lui.</li>
        <li><strong>Votre départ est leur but.</strong> À 2 joueurs, votre camp est le but de l'autre joueur, et il ne peut pas terminer tant qu'un de vos pions s'y trouve encore. Leapstone vous permet de laisser un pion chez vous, vous pouvez donc bloquer de cette façon. Il en va de même pour vous.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Questions</h2>
      <h3>Combien de personnes peuvent jouer au Halma ?</h3>
      <p>Deux ou quatre. On joue au Halma sur un plateau carré de 16 par 16 cases, et chaque joueur commence dans un coin.</p>
      <h3>Combien de pions chaque joueur a-t-il au Halma ?</h3>
      <p>19 pions chacun à 2 joueurs, et 13 pions chacun à 4 joueurs.</p>
      <h3>Qui a inventé le Halma ?</h3>
      <p>George Howard Monks, un chirurgien américain, en 1883 ou 1884. Le nom vient du grec et veut dire &laquo;&nbsp;saut&nbsp;&raquo;. Lisez la suite dans <a href="/fr/regles/qu-est-ce-que-le-sternhalma">Sternhalma</a>.</p>
      <h3>Quelle est la différence entre le Halma et les dames chinoises ?</h3>
      <p>Le Halma se joue sur un plateau carré, avec des pas et des sauts dans huit directions et 19 ou 13 pions chacun. Les dames chinoises se jouent sur un plateau en étoile, avec six directions et 10 pions chacun, pour 2, 3, 4 ou 6 joueurs.</p>
      <h3>Peut-on jouer au Halma en ligne gratuitement ?</h3>
      <p>Oui, dans Leapstone, dans le navigateur ou dans l'application de l'App Store. Choisissez une façon de jouer, par exemple contre l'ordinateur ou en ligne avec des amis, puis le Plateau carré. Leapstone est gratuit, sans publicité.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Jouez</h2>
      <p>Le bouton Jouer maintenant ouvre une partie contre l'ordinateur sur le <a href="/fr/regles/dames-chinoises">plateau en étoile</a>. Pour jouer au Halma, touchez la flèche de retour en haut, puis choisissez Jouer sur ce téléphone, Jouer contre l'ordinateur ou Jouer en ligne avec des amis, et touchez Plateau carré.</p>
    </section>`;

export default {
  nav: "Règles du Halma",
  titel: "Règles du Halma et conseils | Leapstone",
  beschrijving: "Comment jouer au Halma sur le plateau de 16 par 16 : départ, pas, sauts, chaînes de sauts, comment gagner et conseils. Jouez gratuitement en ligne.",
  h1: "Règles du Halma",
  intro: "Amenez tous vos pions à travers le plateau carré jusqu'au coin opposé avant les autres. Les règles en bref, avec des images, et quelques conseils.",
  inhoud,
};
