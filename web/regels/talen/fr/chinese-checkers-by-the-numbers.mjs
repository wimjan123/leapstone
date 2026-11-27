// Leapstone en chiffres, Frans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Cases et pions</h2>
      <p>Comptés sur les deux plateaux de Leapstone, dans la position de départ d'une partie.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Le plateau en étoile avec ses six pointes pleines : dix pions de chacune des six couleurs, autour d'un centre vide.",
  tekst: "Le plateau en étoile au début d'une partie à six joueurs.",
})}
      <ul class="tips">
        <li><strong>Le plateau en étoile a ${f("sterbord_vakken")} cases.</strong> Chaque joueur commence avec ${f("sterbord_stenen_per_speler")} pions. Une partie à deux joueurs a donc ${f("sterbord_stenen_2_spelers")} pions sur le plateau, une partie à trois en a ${f("sterbord_stenen_3_spelers")}, à quatre ${f("sterbord_stenen_4_spelers")} et à six ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Le plateau carré du Halma a ${f("vierkant_vakken")} cases.</strong> Dans une partie à deux joueurs, chaque joueur commence avec ${f("vierkant_stenen_per_speler_2_spelers")} pions, ${f("vierkant_stenen_2_spelers")} en tout. Dans une partie à quatre, chacun commence avec ${f("vierkant_stenen_per_speler_4_spelers")} pions, ${f("vierkant_stenen_4_spelers")} en tout.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">La plus longue chaîne de sauts : ${f("langste_sprongketen")}</h2>
      <p>Sur le plateau en étoile, un pion peut faire <strong>${f("langste_sprongketen")} sauts en un seul coup</strong>, et selon les règles de Leapstone aucun coup ne peut en avoir plus. Pour atteindre ce nombre, les autres pions sont placés librement : un sur chaque case par-dessus laquelle le pion saute.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Un plateau en étoile avec un pion rouge et beaucoup de pions bleus. Des flèches blanches montrent le pion rouge qui saute par-dessus un pion bleu après l'autre, sur un long chemin sinueux.",
  tekst: "La plus longue chaîne : le pion rouge saute par-dessus chaque pion bleu, l'un après l'autre.",
})}
      <p><strong>Comment c'est compté.</strong> Un saut atterrit toujours deux cases plus loin, en ligne droite. Un pion qui continue de sauter n'atteint donc qu'une partie des cases : le plateau se divise en quatre groupes de ce type, et le plus grand a ${f("grootste_klasse_vakken")} cases. Dans Leapstone, un pion ne peut pas atterrir deux fois sur la même case en un coup, ni sur la case d'où il est parti. Une chaîne atterrit donc au plus une fois sur chacune des autres cases de son groupe. Le programme a fouillé ce groupe et trouvé un chemin qui passe par les ${f("grootste_klasse_vakken")} cases, donc aucune chaîne ne peut être plus longue : ${f("langste_sprongketen")} sauts. Un test joue ensuite ce coup avec les règles de Leapstone.</p>
      <p><strong>Pas une vraie partie.</strong> Cette chaîne demande ${f("langste_sprongketen")} autres pions, chacun exactement sur la bonne case. Une partie à deux ou trois joueurs n'a que ${f("sterbord_stenen_2_spelers")} ou ${f("sterbord_stenen_3_spelers")} pions, ce qui est trop peu. Une partie à quatre ou six joueurs en a ${f("sterbord_stenen_4_spelers")} ou ${f("sterbord_stenen_6_spelers")}, ce qui suffit. Mais dans une vraie partie, personne ne place les pions librement : ne comptez donc pas voir cette chaîne autour de la table. Elle montre ce que le plateau permet, pas ce qui arrive en jeu.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">La traversée la plus courte : ${f("oversteek_zetten")} coups</h2>
      <p>Un joueur seul sur le plateau en étoile, sans adversaire, a besoin de <strong>${f("oversteek_zetten")} coups</strong> pour amener ses ${f("sterbord_stenen_per_speler")} pions d'une pointe à la pointe opposée, et ne peut pas le faire en moins. Une chaîne de sauts entière compte pour un seul coup.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Un plateau en étoile avec seulement dix pions rouges, dans la pointe du bas. La pointe du haut, où ils doivent aller, a un contour en pointillés.",
  tekst: "Un joueur seul : dix pions dans la pointe du bas, et la pointe du haut est l'objectif.",
})}
      <p><strong>Comment c'est compté.</strong> Un test joue une traversée en ${f("oversteek_zetten")} coups avec les règles de Leapstone, sans aucun autre pion sur le plateau. Pour montrer que ${f("geen_oversteek_in_zetten")} coups ou moins ne suffisent pas, une recherche suit la méthode de G. I. Bell (<em>Integers</em> 9, 2009). Chaque coup peut se jouer à l'envers, et un demi-tour du plateau échange le départ et l'arrivée. Si une traversée en ${f("geen_oversteek_in_zetten")} coups ou moins existait, une position à mi-chemin serait donc à au plus ${f("zoekdiepte_zetten")} coups du départ, et la même position tournée d'un demi-tour aussi. La recherche a parcouru toutes les positions à ${f("zoekdiepte_zetten")} coups ou moins du départ, a compté une seule fois une position et son image dans un miroir, a écarté celles qui ne peuvent prouvablement pas aller assez loin à temps, et n'a trouvé aucune paire de ce genre. Elle a tourné ${f("gemeten_rekentijd_seconden")} secondes sur une machine à ${f("gemeten_kernen")} cœurs, et sa plus grande étape contenait ${f("gemeten_grootste_laag_miljoen_standen")} millions de positions dans ${f("gemeten_geheugen_gb")} Go de mémoire. Le nombre a été recalculé pour le plateau de Leapstone lui-même.</p>
      <p><strong>Pas une limite basse pour une vraie partie.</strong> Dans une vraie partie, les pions des autres joueurs sont aussi sur le plateau, et vos pions peuvent sauter par-dessus. ${f("oversteek_zetten")} n'est donc pas le minimum que peut prendre une vraie partie : ce n'est prouvé que pour un joueur seul.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Essayez</h2>
      <p><a href="/play/">Jouez à Leapstone dans votre navigateur</a> contre l'ordinateur, ou installez l'application avec les boutons en haut de cette page. Pour les règles, lisez les <a href="/fr/regles/dames-chinoises">règles des dames chinoises</a> ou les <a href="/fr/regles/halma">règles du Halma</a>. Pour savoir comment utiliser les chaînes de sauts en partie, lisez les <a href="/fr/guides/strategie-dames-chinoises">conseils de stratégie</a>.</p>
    </section>`;

export default {
  nav: "Les dames chinoises en chiffres",
  titel: "Les dames chinoises en chiffres | Leapstone",
  beschrijving: `Le plateau en étoile a ${c.sterbord_vakken} cases. Un coup compte au plus ${c.langste_sprongketen} sauts, et un joueur seul traverse en ${c.oversteek_zetten} coups. Comment chaque nombre est calculé.`,
  h1: "Les dames chinoises en chiffres",
  intro: `Le plateau en étoile des dames chinoises a ${f("sterbord_vakken")} cases, et chaque joueur commence avec ${f("sterbord_stenen_per_speler")} pions. Dans Leapstone, un coup ne peut jamais avoir plus de ${f("langste_sprongketen")} sauts. Un joueur seul sur le plateau, sans adversaire, a besoin de ${f("oversteek_zetten")} coups pour le traverser. Vous verrez plus bas comment chaque nombre est compté, et ce qu'il dit ou ne dit pas d'une vraie partie.`,
  inhoud,
};
