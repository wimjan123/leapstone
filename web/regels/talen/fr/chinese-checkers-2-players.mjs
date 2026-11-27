// Le guide des dames chinoises à 2 joueurs en français (taak 134). Contenu : le guide anglais ../en/chinese-checkers-2-players.mjs
// (règles de crates/halma-core et taak 80 pour la limite de temps ; niveaux de l'ordinateur de crates/halma-core/src/computer.rs),
// phrase par phrase en français. Ce que l'application montre vient de web/src/Startmenu.svelte et de la page d'accueil.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Comment la partie commence</h2>
      <p>Chaque joueur a 10 pions. Ils partent de deux pointes de l'étoile qui se font face : le rouge en bas, le bleu en haut. Les 20 pions sont posés sur un plateau de 121 cases.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas et 10 pions bleus dans la pointe du haut",
  tekst: "Le rouge part du bas, le bleu du haut.",
})}
      <p>Le joueur 1, le rouge, commence. Ensuite, vous jouez à tour de rôle, un coup chacun. Un coup est un pas ou une chaîne de sauts avec un seul pion. Pour les pas et les sauts, voyez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Votre but est le départ de l'autre joueur</h2>
      <p>Vous gagnez en amenant vos 10 pions dans la pointe d'où l'autre joueur est parti. Cette pointe commence pleine de ses pions, et la vôtre est pleine des vôtres. Pour le rouge, c'est la pointe du haut sur l'image ci-dessus.</p>
      <p>Vous ne pouvez atterrir que sur une case vide, donc chacun de vous doit quitter sa propre pointe avant que l'autre puisse la remplir. Aucun de vous ne peut terminer tant qu'un pion de l'autre reste dans le but. Et comme vous traversez le même milieu dans des sens opposés, les pions de l'autre joueur sont des marches pour vous, et les vôtres pour lui. Lisez les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a> pour savoir quoi en faire.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gagner et abandonner</h2>
      <ul>
        <li><strong>Gagner :</strong> le premier joueur qui remplit le but avec ses 10 pions gagne, et la partie est terminée aussitôt. L'autre joueur ne continue pas.</li>
        <li><strong>Abandonner :</strong> vos pions quittent le plateau et l'autre joueur gagne.</li>
        <li><strong>Temps (en ligne) :</strong> dans une partie en ligne, chaque coup a une limite de temps. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En quoi 3, 4 et 6 joueurs diffèrent</h2>
      <ul>
        <li><strong>3 joueurs :</strong> les pions partent d'une pointe sur deux, et les trois buts sont vides au départ. Le premier joueur qui termine gagne ; les autres continuent pour les places suivantes, et un joueur qui a terminé est sauté.</li>
        <li><strong>4 joueurs :</strong> deux paires de pointes côte à côte. Votre but commence plein des pions d'un autre joueur. La partie continue après le premier arrivé, comme à 3.</li>
        <li><strong>6 joueurs :</strong> les six pointes. Le plateau porte 60 pions, contre 20 à 2 joueurs.</li>
      </ul>
      <p>Avec seulement 20 pions sur le plateau, il y a moins de pions à sauter, donc les échelles que vous construisez vous-même comptent davantage. La <a href="/fr/regles/dames-chinoises">page des règles</a> a des images de chaque départ.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Où jouer à 2 joueurs dans Leapstone</h2>
      <ul>
        <li><strong>Contre l'ordinateur, tout de suite :</strong> ouvrez <a href="/play/">Leapstone dans le navigateur</a>, touchez Ordinateur et choisissez le plateau en étoile. Un ordinateur est le réglage par défaut, c'est donc une partie à 2. Vous choisissez Facile, Normal ou Difficile, et vous êtes le joueur 1, vous jouez donc en premier. Facile choisit le meilleur de trois coups au hasard. Normal choisit le coup qui avance le plus vers son but. Difficile regarde aussi comment ses adversaires peuvent répondre, et son propre coup suivant.</li>
        <li><strong>En ligne, dans l'application :</strong> une partie rapide sur le plateau en étoile pour 2 joueurs, contre un autre joueur de votre niveau, avec 30 secondes par coup. Certains adversaires en ligne peuvent être des joueurs de l'ordinateur.</li>
        <li><strong>Avec un ami :</strong> envoyez un lien d'invitation, et réglez vous-même le temps par coup. Ou faites passer un téléphone de l'un à l'autre.</li>
      </ul>
      <p><a href="/fr/guides/dames-chinoises-en-ligne-avec-des-amis">Dames chinoises en ligne avec des amis</a></p>
      <p><a href="/fr/guides/dames-chinoises-a-trois">Dames chinoises à 3 joueurs</a></p>
    </section>`;

export default {
  nav: "Dames chinoises à 2 joueurs",
  titel: "Dames chinoises à 2 joueurs : règles | Leapstone",
  beschrijving: "Comment fonctionnent les dames chinoises à 2 joueurs : où partent les 10 pions, qui commence, comment on gagne ou on abandonne, et où jouer gratuitement.",
  h1: "Dames chinoises à 2 joueurs",
  intro: "Comment fonctionne une partie à deux sur le plateau en étoile : la mise en place, qui commence, comment on gagne, et où y jouer.",
  inhoud,
};
