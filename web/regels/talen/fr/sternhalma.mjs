// La page française « Qu'est-ce que le Sternhalma ? » (taak 134) : le nom et le lien avec le Halma et les dames chinoises.
// Contenu et sources : la page anglaise ../en/sternhalma.mjs (Wikipédia Halma et Chinese checkers, voir là-bas). Phrase par phrase en français.
// Volontairement omis, comme en anglais : qui a publié le Stern-Halma en 1892 (les sources se contredisent) et les années de brevets.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Ce que le nom veut dire</h2>
      <p>Sternhalma est le nom allemand du Halma joué sur un plateau en forme d'étoile. <em>Stern</em> veut dire étoile en allemand. Le nom « dames chinoises » désigne le même jeu, sous un nom donné plus tard aux États-Unis.</p>
      <p>Dans Leapstone, c'est le <strong>plateau en étoile</strong> : le plateau des <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">D'où ça vient</h2>
      <ul>
        <li>Le <strong>Halma</strong> a été inventé en 1883 ou 1884 par George Howard Monks, un chirurgien américain. Le nom vient du grec et veut dire &laquo;&nbsp;saut&nbsp;&raquo;. Il se joue sur un plateau carré. <a href="/fr/regles/halma">Lisez les règles du Halma</a>.</li>
        <li>Le <strong>Stern-Halma</strong> est apparu en Allemagne en 1892 : la même idée sur un plateau en forme d'étoile à six branches.</li>
        <li><strong>Dames chinoises</strong> est le nom que Bill et Jack Pressman ont donné au jeu aux États-Unis en 1928, d'abord sous le nom &laquo;&nbsp;Hop Ching checkers&nbsp;&raquo;. Le jeu n'a aucun lien historique avec la Chine, et ce n'est pas un jeu de dames.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">En quoi les jeux diffèrent</h2>
      <ul>
        <li><strong>Halma :</strong> un plateau carré de 16 par 16 cases, pour 2 ou 4 joueurs. Un pion a huit voisines, en ligne droite et en diagonale. À 2 joueurs, chacun a 19 pions, à 4 joueurs 13.</li>
        <li><strong>Sternhalma et dames chinoises :</strong> un plateau en étoile de 121 cases, pour 2, 3, 4 ou 6 joueurs. Un pion a six voisines. Chacun a 10 pions.</li>
        <li><strong>Le reste est pareil :</strong> un pas vers une voisine libre, ou un saut par-dessus un pion, avec des chaînes de sauts. Le premier joueur qui remplit le camp de l'autre côté du plateau gagne.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variantes, et ce que fait Leapstone</h2>
      <p>On a joué au Halma de plusieurs façons. Voici comment Leapstone se situe par rapport aux variantes que nous avons trouvées dans nos sources :</p>
      <ul>
        <li><strong>Taille du plateau.</strong> On joue aussi au Halma sur des plateaux de 8 par 8 et de 10 par 10 cases. Leapstone n'a que le plateau de 16 par 16 cases.</li>
        <li><strong>Quitter le but.</strong> Selon une règle du Halma, un pion qui est entré dans le camp de l'adversaire ne peut plus en sortir. Leapstone n'a pas cette règle : vous pouvez déplacer un tel pion de nouveau.</li>
        <li><strong>Trois joueurs sur une étoile.</strong> Un ancien Halma à trois joueurs sur un plateau en étoile est décrit avec 15 pions chacun. Leapstone joue à 3 joueurs sur le plateau en étoile avec 10 pions chacun.</li>
        <li><strong>Les sauts sont votre choix.</strong> Vous n'êtes jamais obligé de sauter. Vous choisissez la case où votre coup se termine.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Jouez dans Leapstone</h2>
      <p>Jouer maintenant ouvre une partie sur le plateau en étoile contre l'ordinateur. Pour le plateau carré, touchez la flèche de retour en haut et choisissez Plateau carré dans le menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Le plateau en étoile avec 10 pions rouges dans la pointe du bas et 10 pions bleus dans la pointe du haut",
  tekst: "Le plateau en étoile pour 2 joueurs.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Qu'est-ce que le Sternhalma ? Plateau en étoile | Leapstone",
  beschrijving: "Le Sternhalma est le nom allemand du Halma sur plateau en étoile. Son lien avec le Halma et les dames chinoises, et comment y jouer gratuitement.",
  h1: "Sternhalma, Halma et dames chinoises",
  intro: "Trois noms pour des jeux très proches. Ce que chacun veut dire, d'où ils viennent, et en quoi ils diffèrent.",
  inhoud,
};
