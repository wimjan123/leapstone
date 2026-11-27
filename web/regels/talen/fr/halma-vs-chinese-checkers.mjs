// Le guide Halma ou dames chinoises en français (taak 300). Contenu : le guide anglais ../en/halma-vs-chinese-checkers.mjs, phrase par phrase.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dames chinoises : le plateau en étoile, 121 cases",
    alt: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas et 10 pions bleus dans la pointe du haut",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma : le plateau carré, 256 cases",
    alt: "Le plateau carré avec 19 pions rouges dans le coin en haut à gauche et 19 pions bleus dans le coin en bas à droite",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Plateau en étoile : six voisines, dont trois vides ici",
    alt: "Un pion rouge entouré d'un anneau blanc. Trois de ses six voisines sont vides et marquées ; les trois autres contiennent des pions.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Plateau carré : huit voisines, dont cinq vides ici",
    alt: "Un pion rouge entouré d'un anneau blanc. Cinq de ses huit voisines sont vides et marquées ; les trois autres contiennent des pions.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">La réponse courte</h2>
      <p>Le Halma se joue sur un plateau carré et les dames chinoises sur un plateau en forme d'étoile à six branches. Dans les deux jeux, vous déplacez vos pions par pas et par sauts à travers le plateau, et le premier joueur qui remplit le camp du côté opposé gagne.</p>
      <p>Ce qui change, c'est le plateau, les directions dans lesquelles on se déplace, le nombre de personnes qui peuvent jouer et le nombre de pions de chacune. Le <a href="/fr/regles/qu-est-ce-que-le-sternhalma">Sternhalma</a> est le nom du Halma sur un plateau en étoile : c'est donc le même jeu que les dames chinoises.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Les plateaux</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Les dames chinoises</strong> utilisent le plateau en étoile : 121 cases, avec une pointe de 10 cases à chacune des six extrémités. Une pointe est un triangle de rangées de 4, 3, 2 et 1 cases.</li>
        <li><strong>Le Halma</strong> utilise le plateau carré : 16 par 16 cases, soit 256 en tout. Un camp se trouve dans un coin. Un grand camp compte des rangées de 5, 5, 4, 3 et 2 cases, un petit camp des rangées de 4, 4, 3 et 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Directions : six ou huit</h2>
      <p>Sur le plateau en étoile, une case a six voisines. Sur le plateau carré, elle en a huit, car les diagonales comptent aussi. Un pas va vers une voisine vide. Un saut passe par-dessus un pion voisin du vôtre, en ligne droite, jusqu'à la case vide juste derrière, dans n'importe laquelle de ces directions et aussi en arrière.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Une case au bord a moins de voisines, et un coin du plateau carré en a trois. Six directions font trois lignes qui passent par une case du plateau en étoile. Huit directions font quatre lignes sur le plateau carré : en travers, de haut en bas et deux diagonales.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Joueurs et pions</h2>
      <ul>
        <li><strong>Dames chinoises :</strong> 2, 3, 4 ou 6 joueurs. Chacun a 10 pions, donc le plateau en compte 20, 30, 40 ou 60.</li>
        <li><strong>Halma :</strong> 2 ou 4 joueurs. À 2 joueurs, chacun a 19 pions, soit 38 en tout. À 4 joueurs, chacun a 13 pions, soit 52 en tout.</li>
      </ul>
      <p>Le plateau carré n'a pas de partie à 3 ou 6 joueurs dans Leapstone. Pour une partie à trois, lisez <a href="/fr/guides/dames-chinoises-a-trois">Dames chinoises à 3 joueurs</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Ce qui est pareil</h2>
      <ul>
        <li><strong>Un coup :</strong> un pas, ou une chaîne de sauts avec un seul pion. Vous décidez où la chaîne s'arrête, et vous ne pouvez pas faire un pas après un saut.</li>
        <li><strong>Toutes les couleurs :</strong> vous sautez par-dessus un pion de n'importe quelle couleur, même le vôtre. Le pion sauté reste où il est. Rien n'est capturé.</li>
        <li><strong>Le but :</strong> le camp en face de celui d'où vous êtes parti. Toutes ses cases doivent contenir vos propres pions. Tant qu'un pion d'un autre joueur s'y trouve, vous ne pouvez pas terminer.</li>
        <li><strong>Gagner :</strong> le premier joueur qui remplit le but gagne. À 2 joueurs, la partie est alors terminée. À plus de joueurs, les autres continuent pour les places suivantes, et un joueur qui a terminé est sauté.</li>
        <li><strong>Abandon et temps :</strong> quand vous abandonnez, vos pions quittent le plateau. Dans une partie en ligne, chaque coup a une limite de temps, et si vous manquez 3 tours de suite, vous abandonnez.</li>
      </ul>
      <p>Lisez les règles complètes des <a href="/fr/regles/dames-chinoises">dames chinoises</a> et du <a href="/fr/regles/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Quel plateau choisir dans Leapstone</h2>
      <ul>
        <li><strong>3 ou 6 joueurs :</strong> seul le plateau en étoile les propose.</li>
        <li><strong>Plus de pions chacun :</strong> le plateau carré, avec 19 pions chacun à 2 joueurs ou 13 à 4, contre 10 sur le plateau en étoile.</li>
        <li><strong>Jouer en ligne :</strong> une partie rapide se joue sur le plateau en étoile. Avec des amis et contre l'ordinateur, vous pouvez choisir l'un ou l'autre plateau.</li>
      </ul>
      <p>Le bouton Jouer maintenant ouvre une partie contre l'ordinateur sur le plateau en étoile. Pour jouer sur le plateau carré, touchez la flèche de retour en haut et choisissez Plateau carré dans le menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pour aller plus loin</h2>
      <ul>
        <li><a href="/play/">Jouez dans votre navigateur</a> et essayez les deux plateaux.</li>
        <li><a href="/fr/guides/strategie-dames-chinoises">Stratégie aux dames chinoises</a> : six conseils avec des images.</li>
        <li><a href="/fr/guides/dames-chinoises-a-deux">Dames chinoises à 2 joueurs</a> : comment se déroule une partie à deux.</li>
      </ul>
      <p><a href="/fr/guides/dames-chinoises-en-ligne-avec-des-amis">Dames chinoises en ligne avec des amis</a></p>
    </section>`;

export default {
  nav: "Halma ou dames chinoises",
  titel: "Halma ou dames chinoises : les différences | Leapstone",
  beschrijving: "Halma ou dames chinoises ? Le plateau carré et le plateau en étoile, six ou huit directions, joueurs et pions, et ce qui est pareil.",
  h1: "Halma ou dames chinoises",
  intro: "Deux jeux, une même idée : amener tous vos pions de l'autre côté du plateau. Ce qui change, ce qui est pareil, et où jouer aux deux.",
  inhoud,
};
