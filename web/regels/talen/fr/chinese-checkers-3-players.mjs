// Le guide des dames chinoises à 3 joueurs en français (taak 299). Contenu : le guide anglais ../en/chinese-checkers-3-players.mjs
// (règles vérifiées avec crates/halma-core, voir docs/plan.md, taak 139), phrase par phrase en français.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Comment la partie commence</h2>
      <p>Chaque joueur a 10 pions, donc 30 pions sont posés sur un plateau de 121 cases. Ils partent d'une pointe de l'étoile sur deux : le rouge en bas, le bleu en haut à gauche et le vert en haut à droite. Les trois pointes entre elles sont vides.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas, 10 pions bleus dans la pointe en haut à gauche et 10 pions verts dans la pointe en haut à droite",
  tekst: "Le rouge en bas, le bleu en haut à gauche, le vert en haut à droite.",
})}
      <p>Le joueur 1, le rouge, commence. Ensuite, le bleu est le joueur 2, le vert est le joueur 3, et après le vert, c'est de nouveau au rouge. Un coup est un pas ou une chaîne de sauts avec un seul pion. Pour les pas et les sauts, voyez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Trois buts, tous vides au départ</h2>
      <p>Votre but est la pointe en face de celle d'où vous êtes parti, et à 3 joueurs elle commence vide. C'est la pointe vide entre les départs des deux autres joueurs : le but du rouge est en haut, celui du bleu en bas à droite et celui du vert en bas à gauche.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Le plateau en étoile pour trois joueurs. Des cercles en pointillés de la couleur de chaque joueur marquent les trois buts vides : rouge en haut, bleu en bas à droite, vert en bas à gauche.",
  tekst: "Chaque but a la couleur de son joueur.",
})}
      <p>Vous gagnez en amenant vos 10 pions dans votre but. Les 10 cases doivent contenir vos propres pions. Personne ne part de votre but, mais vous pouvez vous arrêter sur n'importe quelle case vide, donc un pion d'un autre joueur peut s'y poser plus tard. Tant qu'il y reste, vous ne pouvez pas terminer.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Gagner, et ce qui se passe ensuite</h2>
      <ul>
        <li><strong>Gagner :</strong> le premier joueur qui remplit le but gagne. La partie ne s'arrête pas là : les deux autres continuent pour les places suivantes, et le joueur qui a terminé est sauté. La partie est terminée quand un seul joueur joue encore.</li>
        <li><strong>Abandonner :</strong> vos pions quittent le plateau et les deux autres continuent. Si un deuxième joueur abandonne avant que quelqu'un ait terminé, le dernier joueur restant gagne.</li>
        <li><strong>Temps (en ligne) :</strong> dans une partie en ligne, chaque coup a une limite de temps, fixée par le joueur qui lance la partie. Quand votre temps est écoulé, votre tour est sauté. Si vous manquez 3 tours de suite, vous abandonnez, et la partie continue sans vous.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En quoi elle diffère d'une partie à 2</h2>
      <ul>
        <li><strong>Plus de pions :</strong> 30 sur le plateau, contre 20 à 2 joueurs.</li>
        <li><strong>Des buts vides :</strong> à 2 joueurs, votre but commence plein des pions de l'autre joueur. À 3, il commence vide.</li>
        <li><strong>Deux adversaires :</strong> après votre coup, deux autres joueurs jouent avant que ce soit de nouveau à vous. Les pions des deux sont des marches pour vous, et les vôtres pour eux. Une échelle que vous construisez peut servir aux deux, et le joueur après vous a la première chance.</li>
        <li><strong>La partie continue :</strong> à 2 joueurs, la partie se termine quand l'un de vous a terminé. À 3, elle continue pour la deuxième et la troisième place.</li>
      </ul>
      <p>Pour la partie à deux, lisez <a href="/fr/guides/dames-chinoises-a-deux">Dames chinoises à 2 joueurs</a>. Les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a> portent sur les pas et les sauts, qui sont les mêmes à 3 joueurs.</p>
      <p><a href="/fr/guides/dames-chinoises-en-ligne-avec-des-amis">Dames chinoises en ligne avec des amis</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Où jouer à 3 joueurs dans Leapstone</h2>
      <ul>
        <li><strong>Contre l'ordinateur, tout de suite :</strong> ouvrez <a href="/play/">Leapstone dans le navigateur</a>, touchez Ordinateur, choisissez le plateau en étoile et 2 ordinateurs. Vous êtes le joueur 1, vous jouez donc en premier. Vous choisissez Facile, Normal ou Difficile pour les ordinateurs.</li>
        <li><strong>Sur un seul téléphone :</strong> touchez « Sur ce téléphone », choisissez le plateau en étoile et 3 joueurs, puis touchez un pion pour faire passer cette place d'une personne à un ordinateur, ou l'inverse.</li>
        <li><strong>En ligne avec des amis :</strong> touchez Amis, choisissez le plateau en étoile, 3 joueurs et le temps par coup, et envoyez le lien d'invitation. La partie commence quand les 3 places sont prises.</li>
        <li><strong>Parties rapides :</strong> Jouer en ligne trouve des parties pour 2 ou 4 joueurs, il n'y a donc pas de partie rapide à 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Dames chinoises à 3 joueurs",
  titel: "Dames chinoises à 3 joueurs : règles | Leapstone",
  beschrijving: "Comment fonctionnent les dames chinoises à 3 joueurs : où partent les 30 pions, quelle pointe vide est le but de chacun, qui commence, et comment on gagne.",
  h1: "Dames chinoises à 3 joueurs",
  intro: "Comment fonctionne une partie à trois sur le plateau en étoile : la mise en place, les trois buts, qui commence, comment on gagne, et où y jouer.",
  inhoud,
};
