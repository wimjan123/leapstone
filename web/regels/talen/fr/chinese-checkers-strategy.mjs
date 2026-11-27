// Le guide de stratégie aux dames chinoises en français (taak 134). Contenu : le guide anglais ../en/chinese-checkers-strategy.mjs
// (chaque conseil vérifié contre crates/halma-core, voir docs/plan.md, taak 122), phrase par phrase en français.
// Pas d'« experts », de chiffres ou d'histoire inventés. Le seul nombre est 16 (pas d'une pointe à l'autre), que l'exemple recompte.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Sur quoi reposent ces conseils</h2>
      <p>Les conseils découlent des <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a> telles que Leapstone les applique : un coup est un pas ou une chaîne de sauts, et vous pouvez sauter par-dessus un pion de n'importe quelle couleur. Ce n'est pas une preuve du meilleur jeu. Jouer contre l'ordinateur est le moyen le plus rapide de les essayer.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Construisez des échelles</h2>
      <p>Une échelle est une ligne de pions avec une case vide entre chacun. Un pion à une extrémité saute par-dessus toute la ligne en un seul coup, il traverse donc le plateau en un tour au lieu d'une case par tour.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatre pions en ligne diagonale avec une case vide entre chacun. Un pion rouge à une extrémité saute par-dessus les quatre, avec quatre cases d'arrivée numérotées.",
  tekst: "Quatre sauts en un coup. Le même pion ne pourrait avancer que d'une case à la fois.",
})}
      <p>Un saut fonctionne dans les six directions, aussi en arrière, donc une échelle n'a pas besoin de commencer dans votre propre pointe. Toute ligne de pions avec des vides entre eux fait l'affaire.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Gardez vos pions ensemble</h2>
      <p>Il vous faut les 10 pions dans votre but, donc votre dernier pion décide du moment où vous finissez. Un pion sans pion à côté de lui n'a rien à sauter, et ne peut que faire un pas.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Un plateau en étoile avec un pion rouge seul dans la pointe du bas. Seules ses deux cases voisines vides sont marquées. D'autres pions rouges et bleus sont au milieu.",
  tekst: "Ce pion n'a pas de voisin, il ne peut donc avancer que vers les deux cases marquées.",
})}
      <p>Du bout de votre pointe au bout du but, de l'autre côté du plateau, il y a 16 pas. Cela fait 16 tours pour un pion seul, alors qu'une échelle traverse en un seul. Déplacez les pions de l'arrière tant qu'il reste des pions autour d'eux à sauter. L'ordinateur de Leapstone fait de même : il note un peu plus haut les coups de ses pions les plus en arrière.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Utilisez le milieu</h2>
      <p>Un pion au milieu du plateau a six voisines, il peut donc avancer ou sauter dans les six directions. Un pion sur le bord en a moins. Le pion du bord sur l'image en a quatre.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Un plateau en étoile avec un pion rouge au milieu et six voisines marquées, et un pion rouge près du bord en haut à gauche avec quatre voisines marquées.",
  tekst: "Six façons d'avancer au milieu, quatre sur le bord.",
})}
      <p>Les pions du milieu donnent aussi aux autres pions quelque chose à sauter sur leur chemin.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Remplissez le but par le fond</h2>
      <p>Votre but est un triangle de 10 cases, en rangées de 4, 3, 2 et 1. Les cases du fond ne sont accessibles que par les cases devant elles. Si vous remplissez d'abord le devant, le dernier pion risque de n'avoir aucun chemin.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "La pointe du but en haut avec neuf pions rouges et une case vide tout au fond, marquée en pointillés. Un dixième pion rouge, avec un anneau blanc, est sous la rangée du devant.",
  tekst: "Neuf pions sont arrivés, et la case du fond est vide. Le dixième pion n'a aucun coup pour y aller.",
})}
      <p>Placez les premiers pions dans les cases du fond et avancez vers le devant, pour que le devant reste libre pour les pions qui arrivent en dernier.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. N'emmurez pas un pion dans votre but</h2>
      <p>Vous pouvez vous arrêter dans la pointe d'un autre joueur, donc un pion d'un autre joueur peut se retrouver dans votre but. Vous ne gagnez que si les 10 cases de votre but contiennent vos propres pions. Si ce pion n'a aucun coup, personne ne peut le déplacer, et vous ne pouvez pas gagner tant qu'une case à côté de lui ne se libère pas.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "La pointe du but en haut avec neuf pions rouges et un pion bleu tout au fond, marqué d'un anneau blanc. Le pion bleu est entouré de pions rouges.",
  tekst: "Le pion bleu du fond n'a aucun coup, et le rouge ne peut pas remplir le but.",
})}
      <p>Gardez une case à côté d'un tel pion libre, pour qu'il puisse partir. L'ordinateur de Leapstone en tient compte : un coup qui piège un pion d'un autre joueur dans son but est moins bien noté. Les règles n'obligent personne à quitter votre but, donc l'autre joueur peut aussi y garer un pion exprès.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bloquez un saut, ou laissez-le</h2>
      <p>Un saut a besoin d'une case vide où atterrir. Remplissez cette case et le saut disparaît. On ne peut pas non plus sauter par-dessus deux pions à la suite.</p>
      <p>Vos pions sont aussi des marches pour l'autre joueur. Sur l'image de gauche, le bleu traverse deux pions rouges en un coup. Sur celle de droite, le rouge a déplacé un pion vers la première case d'arrivée, et le bleu ne peut faire qu'un pas.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Un pion bleu avec deux pions rouges alignés, chacun avec une case vide derrière lui. Des flèches montrent deux sauts du pion bleu.",
          tekst: "Avant : le bleu peut faire deux sauts.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "La même ligne après que le rouge a déplacé son pion éloigné vers la première case d'arrivée. Le pion bleu est suivi de deux pions rouges à la suite.",
          tekst: "Après : le rouge a déplacé un pion. Le bleu n'a aucun saut.",
        })}
      </div>
      <p>Un coup passé à bloquer est un coup qui ne fait pas avancer votre jeu, donc bloquez quand le saut rapporte plus à l'autre joueur que votre coup ne vous rapporte. C'est l'inverse quand vous construisez une échelle : après votre coup, l'autre joueur joue en premier, donc un de ses pions à une extrémité utilise votre échelle avant vous. Au niveau le plus difficile, l'ordinateur regarde la meilleure réponse de chaque adversaire avant de choisir un coup.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pour continuer</h2>
      <ul>
        <li><a href="/play/">Jouez contre l'ordinateur dans le navigateur</a> et essayez une échelle.</li>
        <li><a href="/fr/guides/dames-chinoises-a-deux">Les dames chinoises à 2 joueurs</a> : comment fonctionne une partie à deux.</li>
        <li><a href="/fr/regles/dames-chinoises">Règles des dames chinoises</a>, avec des images des pas, des sauts et des chaînes.</li>
      </ul>
      <p><a href="/fr/guides/dames-chinoises-en-ligne-avec-des-amis">Dames chinoises en ligne avec des amis</a></p>
      <p><a href="/fr/guides/halma-ou-dames-chinoises">Halma ou dames chinoises</a></p>
      <p><a href="/fr/guides/dames-chinoises-a-trois">Dames chinoises à 3 joueurs</a></p>
    </section>`;

export default {
  nav: "Stratégie aux dames chinoises",
  titel: "Stratégie aux dames chinoises : 6 conseils | Leapstone",
  beschrijving: "Stratégie aux dames chinoises : construire des échelles, garder ses pions ensemble, utiliser le milieu, remplir son but par le fond, bloquer un saut.",
  h1: "Stratégie aux dames chinoises",
  intro: "Six conseils pour le plateau en étoile, chacun avec une image tirée des vraies règles : les échelles, les retardataires, le milieu, le remplissage du but et le blocage des sauts.",
  inhoud,
};
