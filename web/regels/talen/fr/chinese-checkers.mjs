// La page de règles des dames chinoises (taak 134). Contenu : la page anglaise ../en/chinese-checkers.mjs
// (vérifiée contre crates/halma-core, voir docs/plan.md, taak 116), phrase par phrase en français.
// Chaque règle ici doit correspondre à la page anglaise ; si l'on change une règle, on change les deux.
// Mêmes images (sans langue : seulement des chiffres dans le SVG) ; textes alt et légendes en français.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} joueurs`,
      alt:
        {
          2: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas et 10 pions bleus dans la pointe du haut",
          3: "Le plateau en étoile avec des pions rouges en bas, bleus en haut à gauche et verts en haut à droite",
          4: "Le plateau en étoile avec des pions dans quatre pointes : rouge en bas, vert en haut, bleu en bas à gauche et jaune en haut à droite",
          6: "Le plateau en étoile avec des pions dans les six pointes, en six couleurs",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Le plateau</h2>
      <p>On joue aux dames chinoises sur une étoile à six branches. Le plateau a 121 cases, et chaque pointe en compte 10. À l'intérieur du plateau, chaque case a six voisines.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">La position de départ</h2>
      <p>Chaque joueur a 10 pions et les place tous dans une pointe de l'étoile. La pointe en face de la vôtre est votre but.</p>
      <ul>
        <li><strong>2 joueurs :</strong> les deux pointes exactement opposées.</li>
        <li><strong>3 joueurs :</strong> une pointe sur deux. Les trois buts sont vides au départ.</li>
        <li><strong>4 joueurs :</strong> deux paires de pointes côte à côte. Chaque joueur a un autre joueur en face.</li>
        <li><strong>6 joueurs :</strong> les six pointes.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">À tour de rôle</h2>
      <p>Le joueur 1 commence. Ensuite, les tours se suivent dans l'ordre : joueur 2, joueur 3 et ainsi de suite, et après le dernier joueur, c'est de nouveau le joueur 1. Dans Leapstone, les couleurs vont avec les numéros : rouge, bleu, vert, jaune, violet et argent.</p>
      <p>À votre tour, vous déplacez un pion, une seule fois. Rien n'est capturé : les pions restent sur le plateau jusqu'à ce que leur joueur abandonne.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Un pas</h2>
      <p>Déplacez un pion vers une case vide à côté de lui.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Un pion rouge entouré d'un anneau blanc. Trois de ses six cases voisines sont vides et marquées ; les trois autres contiennent des pions.",
  tekst: "Le pion rouge peut avancer vers les trois cases marquées. Les trois autres cases voisines sont prises.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Un saut</h2>
      <p>Sautez par-dessus un pion voisin du vôtre, de n'importe quelle couleur, et posez-vous sur la case vide juste derrière, en ligne droite. Vous pouvez sauter dans les six directions, aussi en arrière.</p>
      <ul>
        <li>La case où vous atterrissez doit être vide.</li>
        <li>Vous ne pouvez pas sauter par-dessus deux pions à la suite, ni par-dessus une case vide.</li>
        <li>Le pion que vous survolez reste à sa place.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Un pion rouge saute par-dessus un pion bleu vers la case vide derrière lui, montré par une flèche.",
  tekst: "Le pion rouge saute par-dessus le pion bleu.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Une chaîne de sauts</h2>
      <p>Après un saut, le même pion peut sauter encore, autant de fois qu'il le peut et dans n'importe quelle direction. Vous décidez où vous vous arrêtez. Tous les sauts ensemble forment un seul coup.</p>
      <ul>
        <li>Dans un même coup, vous ne pouvez pas atterrir deux fois sur la même case.</li>
        <li>Un coup est un pas, ou un ou plusieurs sauts. Vous ne pouvez pas faire un pas après un saut.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Un pion rouge fait trois sauts en un coup, par-dessus un pion bleu, un pion vert et un autre pion bleu. Les trois cases d'arrivée portent les numéros 1, 2 et 3.",
  tekst: "Un coup avec trois sauts, dans l'ordre des numéros.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Le but</h2>
      <p>Vous gagnez en amenant vos 10 pions dans la pointe opposée à votre départ. Les 10 cases de cette pointe doivent contenir vos propres pions. Tant qu'un pion d'un autre joueur s'y trouve, vous ne pouvez pas terminer.</p>
      <p>Vous pouvez atterrir sur n'importe quelle case vide, aussi dans les pointes des autres joueurs.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Un plateau en étoile pour trois joueurs. Le rouge part du bas ; la pointe vide en haut, marquée de cercles en pointillés, est le but du rouge.",
  tekst: "À 3 joueurs, le rouge part du bas. Le but du rouge est la pointe vide en haut.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">À 2, 3, 4 ou 6 joueurs</h2>
      <ul>
        <li><strong>2 joueurs :</strong> le premier joueur qui remplit son but gagne, et la partie est terminée.</li>
        <li><strong>3, 4 ou 6 joueurs :</strong> le premier joueur qui remplit son but gagne. Les autres continuent pour les places suivantes, et un joueur qui a terminé est sauté. La partie est terminée quand un seul joueur joue encore.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Abandonner</h2>
      <p>Quand vous abandonnez, vos pions quittent le plateau, ils ne gênent donc plus personne. À 2 joueurs, l'autre joueur gagne. À plus de joueurs, la partie continue sans vous, et si tous les joueurs sauf un abandonnent, le dernier joueur gagne.</p>
      <p>Dans une partie en ligne, chaque coup a une limite de temps. Le joueur qui lance la partie la règle, et dans une partie rapide elle est de 30 secondes. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez. Les parties contre l'ordinateur et sur un seul téléphone n'ont pas de limite de temps.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Conseils</h2>
      <ul class="tips">
        <li><strong>Construisez des échelles.</strong> Alignez des pions avec une case vide entre chacun, en direction de votre but. Un pion peut alors sauter le long de toute la ligne en un seul coup.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatre pions en ligne diagonale avec une case vide entre chacun. Un pion rouge à une extrémité saute par-dessus les quatre, avec quatre cases d'arrivée numérotées.",
  tekst: "Quatre pions alignés : le pion rouge du haut traverse le plateau en un coup, avec quatre sauts.",
})}
        </li>
        <li><strong>Tout pion est une échelle.</strong> Vous pouvez sauter par-dessus toutes les couleurs, donc les pions des autres joueurs vous aident aussi. Et vos propres échelles les aident : regardez ce que vous laissez derrière vous.</li>
        <li><strong>N'oubliez pas les retardataires.</strong> Il vous faut les 10 pions à l'arrivée. Un pion très en arrière, sans rien à sauter, avance d'une case par tour. Faites-le avancer tant que les autres pions sont encore autour de lui.</li>
        <li><strong>Votre départ est leur but.</strong> À 2, 4 ou 6 joueurs, votre pointe de départ est le but du joueur en face de vous, et il ne peut pas terminer tant qu'un de vos pions s'y trouve encore. Il en va de même pour vous.</li>
      </ul>
      <p>Vous trouverez d'autres conseils, avec des images, dans le guide de <a href="/fr/guides/strategie-dames-chinoises">stratégie aux dames chinoises</a>. Pour une partie à deux, lisez <a href="/fr/guides/dames-chinoises-a-deux">les dames chinoises à 2 joueurs</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Questions</h2>
      <h3>Combien de personnes peuvent jouer aux dames chinoises ?</h3>
      <p>Deux, trois, quatre ou six. Chaque joueur commence dans une pointe de l'étoile. À 2, 3 ou 4 joueurs, certaines pointes restent vides.</p>
      <h3>Combien de billes a chaque joueur ?</h3>
      <p>Chaque joueur a 10 billes, ou pions. Le plateau compte 121 cases : 10 dans chacune des six pointes et 61 au milieu.</p>
      <h3>Peut-on sauter par-dessus ses propres pions, ou en arrière ?</h3>
      <p>Oui. Vous pouvez sauter par-dessus un pion de n'importe quelle couleur, le vôtre aussi, dans les six directions, y compris en arrière. Le pion que vous sautez reste où il est.</p>
      <h3>Capture-t-on des pions aux dames chinoises ?</h3>
      <p>Non. Rien n'est capturé. Un pion ne quitte le plateau que lorsque son joueur abandonne.</p>
      <h3>Les dames chinoises viennent-elles de Chine ?</h3>
      <p>Non. Le jeu est apparu en Allemagne en 1892 sous le nom de Stern-Halma, d'après le jeu plus ancien Halma. Le nom Chinese checkers vient des États-Unis, en 1928. Lisez la suite dans <a href="/fr/regles/qu-est-ce-que-le-sternhalma">Sternhalma</a>.</p>
      <h3>Où jouer gratuitement aux dames chinoises en ligne avec des amis ?</h3>
      <p>Dans Leapstone, dans le navigateur ou dans l'application de l'App Store. Envoyez un lien d'invitation à un ami : il rejoint votre partie sans compte, sans adresse e-mail et sans mot de passe. Vous pouvez aussi jouer contre l'ordinateur, ou faire une partie rapide contre un autre joueur. Leapstone est gratuit, sans publicité.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Jouer aux dames chinoises dans Leapstone</h2>
      <p>Leapstone est une application gratuite pour jouer aux dames chinoises et au Halma, avec un plateau 3D en laque rouge et or. Vous pouvez jouer dans l'application et dans le navigateur.</p>
      <ul>
        <li><strong>Contre l'ordinateur.</strong> Facile, normal ou difficile. Pas besoin d'internet.</li>
        <li><strong>Entre amis.</strong> Envoyez un lien d'invitation. Vous réglez le temps par coup, et vous pouvez discuter.</li>
        <li><strong>En ligne.</strong> Une partie rapide contre un autre joueur de votre niveau, 30 secondes par coup. Certains adversaires en ligne peuvent être des joueurs de l'ordinateur.</li>
        <li><strong>Sur un seul téléphone.</strong> Faites passer le téléphone autour de la table.</li>
      </ul>
      <p>Leapstone est gratuit, sans publicité et sans inscription avec une adresse e-mail : vous choisissez seulement un nom de joueur. <a href="https://apps.apple.com/fr/app/id6831230722">Télécharger Leapstone dans l'App Store</a> ou <a href="/play/">jouer dans le navigateur</a>.</p>
    </section>`;

export default {
  nav: "Règles des dames chinoises",
  titel: "Règles des dames chinoises et conseils | Leapstone",
  beschrijving: "Comment jouer aux dames chinoises : départ, pas, sauts et chaînes, comment gagner à 2, 3, 4 ou 6 joueurs, et conseils. Jouez gratuitement en ligne.",
  h1: "Règles des dames chinoises",
  intro: "Amenez vos 10 pions à travers le plateau en étoile jusqu'à la pointe opposée avant les autres. Les règles en bref, avec des images, et quelques conseils.",
  inhoud,
};
