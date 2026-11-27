// Le guide des ouvertures aux dames chinoises en français (taak 303, feature 294) : /fr/guides/dames-chinoises-ouvertures.
// Contenu : le guide anglais ../en/chinese-checkers-opening-moves.mjs, phrase par phrase en français. Chaque nombre et chaque coup est vérifié
// contre crates/halma-core ; les images viennent de crates/halma-core/examples/regelplaatjes.rs (section "taak 303").
// Une « rangée » est l'ensemble des cases à la même distance de votre pointe ; un pas avance de 1 rangée, un saut de 2. Pas d'« experts » ni d'histoire inventés.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Votre premier coup : 14 choix</h2>
      <p>Au départ, vos 10 pions forment un triangle en rangées de 4, 3, 2 et 1, et la rangée de devant fait face au milieu du plateau. Il n'y a aucune case vide dans le triangle, donc un pion ne peut aller que sur la rangée juste devant lui. Cela laisse 14 premiers coups : chacun des 4 pions de la rangée de devant peut faire un pas vers 2 cases (8 pas), et chacun des 3 pions de la deuxième rangée peut sauter par-dessus un pion de devant vers 2 cases (6 sauts). Les 3 autres pions ne peuvent pas encore bouger.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "La pointe rouge en bas avec ses 10 pions, et dans la rangée juste devant elle 5 cases vides marquées d'un anneau.",
  tekst: "Chaque premier coup se termine sur l'une de ces 5 cases.",
})}
      <p>Dans ce guide, une rangée est une ligne de cases en travers de votre pointe, parallèle à son bord avant, et nous comptons la progression en rangées. Un pas fait avancer un pion de 1 rangée et un saut de 2 rangées. Chaque joueur a les mêmes 14 premiers coups, à 2, 3, 4 ou 6 joueurs et depuis n'importe quelle pointe de l'étoile, car toutes les pointes se ressemblent vues de l'intérieur.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Ouverture 1 : sauter, puis libérer le bout de la pointe</h2>
      <p>Le pion au bout de votre pointe est le plus éloigné de votre but, et il ne peut pas bouger au départ : il ne peut sauter par-dessus un pion que si la case derrière ce pion est vide. Un saut depuis la deuxième rangée crée exactement une telle case.</p>
      <ol>
        <li><strong>Coup 1 :</strong> le pion à l'extrémité droite de votre deuxième rangée saute par-dessus le pion devant lui. Il atterrit dans la rangée devant votre pointe et gagne 2 rangées.</li>
        <li><strong>Coup 2 :</strong> le pion du bout saute deux fois en un seul coup : d'abord dans la case que le coup 1 a libérée, puis par-dessus un pion de la deuxième rangée. Il gagne 4 rangées.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "La pointe rouge après le coup 1. Le pion du bout porte un anneau, et 2 flèches numérotées 1 et 2 montrent ses sauts par la case libérée jusqu'à la rangée devant la pointe.",
  tekst: "Après le coup 1, le pion du bout sort en 2 sauts.",
})}
      <p>Cela fait 6 rangées en 2 coups. Nous avons essayé toutes les façons de jouer 2 coups, et 6 est le maximum possible. Seules 4 paires de coups l'atteignent : le pion à l'une ou l'autre extrémité de la deuxième rangée saute, dans l'une de ses 2 directions, et le pion du bout suit. Le pion du milieu de la deuxième rangée ne convient pas, car il garde le bout enfermé.</p>
      <p>Les deux pions se trouvent maintenant dans la rangée devant votre pointe, avec une case vide entre eux. C'est le premier barreau d'une échelle.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Ouverture 2 : 4 coups avec 4 pions différents</h2>
      <p>Sur 4 coups, le maximum est de 13 rangées gagnées, et on n'y arrive que si chaque coup utilise un pion différent. Cette ligne y parvient :</p>
      <ol>
        <li><strong>Coup 1 :</strong> le pion à l'extrémité droite de la rangée de devant fait un pas en avant. Il gagne 1 rangée.</li>
        <li><strong>Coup 2 :</strong> le pion à l'extrémité droite de la troisième rangée saute deux fois. Il gagne 4 rangées.</li>
        <li><strong>Coup 3 :</strong> le pion à l'extrémité gauche de la deuxième rangée saute deux fois. Il gagne 4 rangées.</li>
        <li><strong>Coup 4 :</strong> le pion du bout saute deux fois. Il gagne 4 rangées.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "La pointe rouge au départ. Les 4 pions qui vont bouger portent un numéro de 1 à 4, dans l'ordre des coups.",
          tekst: "Avant : les pions qui bougent, dans l'ordre.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "La pointe rouge après 4 coups, avec les 4 cases où les pions numérotés ont atterri dans les rangées devant la pointe, et 4 trous laissés dans la pointe.",
          tekst: "Après : où ils ont atterri.",
        })}
      </div>
      <p>Chaque coup prépare le suivant. Les coups 2 et 3 se terminent par un saut par-dessus le pion qui vient de bouger, et le coup 4 part du trou laissé par le coup 3. Les 4 pions atterrissent dans votre moitié du plateau.</p>
      <p>Il existe d'autres lignes qui atteignent 13. Elles partagent la même idée : cherchez le coup qui laisse un trou ou un appui pour le coup suivant, et faites sortir le pion du bout au plus tard au coup 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Erreurs dans les premiers coups</h2>
      <ul class="tips">
        <li><strong>Déplacer le même pion à chaque tour.</strong> Un pion qui court seul gagne 5 rangées en 4 coups, contre 13 pour 4 pions différents. Cela laisse aussi le reste de vos pions là où ils étaient.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "La pointe rouge au départ. Un pion de la deuxième rangée fait 4 coups d'affilée le long d'une ligne, avec des flèches et les numéros 1 à 4, et finit seul près du milieu du plateau.",
  tekst: "Un pion, 4 coups, 5 rangées.",
})}
      <ul class="tips">
        <li><strong>N'avancer que la rangée de devant.</strong> 4 pas gagnent 4 rangées. Après cela, le pion du bout ne peut toujours pas bouger, il reste donc à l'arrière pendant que le reste avance.</li>
        <li><strong>Faire un pas sur le côté.</strong> Un pas le long d'une rangée gagne 0 rangée. Après le coup 1 de l'ouverture 1, le pion de devant peut aller sur la case voisine, et cela ressemble à un progrès, mais le coup est perdu.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Pour continuer</h2>
      <p>Après environ 4 coups, les deux armées se rapprochent et les ouvertures ci-dessus laissent place au milieu de partie. Inutile de retenir les lignes : retenez que chaque coup doit préparer le suivant.</p>
      <ul>
        <li><a href="/play/">Jouez contre l'ordinateur dans votre navigateur</a> et essayez l'ouverture 1 ou 2.</li>
        <li><a href="/fr/guides/strategie-dames-chinoises">Stratégie aux dames chinoises</a> : les échelles, garder vos pions ensemble et remplir votre but.</li>
        <li><a href="/fr/guides/dames-chinoises-a-deux">Les dames chinoises à 2 joueurs</a> : comment se joue une partie à deux.</li>
        <li><a href="/fr/regles/dames-chinoises">Règles des dames chinoises</a>, avec des images de pas, de sauts et de chaînes.</li>
      </ul>
    </section>`;

export default {
  nav: "Ouvertures aux dames chinoises",
  titel: "Ouvertures aux dames chinoises : 2 ouvertures | Leapstone",
  beschrijving: "Ouvertures aux dames chinoises : sautez hors de votre pointe, libérez le pion du bout au coup 2 et gagnez 13 rangées en 4 coups, sans les erreurs.",
  h1: "Ouvertures aux dames chinoises",
  intro: "Une bonne ouverture aux dames chinoises saute depuis la deuxième rangée, utilise un pion différent à chaque tour et fait sortir le pion du bout au coup 2 ou 4. Deux ouvertures en images, et les erreurs à éviter.",
  inhoud,
};
