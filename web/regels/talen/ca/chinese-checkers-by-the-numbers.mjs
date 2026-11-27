// Leapstone en xifres, Catalaans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Caselles i fitxes</h2>
      <p>Comptades als dos taulers de Leapstone, en la posició inicial d'una partida.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "El tauler en estrella amb les sis puntes plenes: deu fitxes de cadascun dels sis colors, al voltant d'un centre buit.",
  tekst: "El tauler en estrella al començament d'una partida de sis jugadors.",
})}
      <ul class="tips">
        <li><strong>El tauler en estrella té ${f("sterbord_vakken")} caselles.</strong> Cada jugador comença amb ${f("sterbord_stenen_per_speler")} fitxes. Així, una partida de dos jugadors té ${f("sterbord_stenen_2_spelers")} fitxes al tauler, una de tres en té ${f("sterbord_stenen_3_spelers")}, una de quatre ${f("sterbord_stenen_4_spelers")} i una de sis ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>El tauler quadrat del Halma té ${f("vierkant_vakken")} caselles.</strong> En una partida de dos jugadors, cada jugador comença amb ${f("vierkant_stenen_per_speler_2_spelers")} fitxes, ${f("vierkant_stenen_2_spelers")} en total. En una partida de quatre, cadascú comença amb ${f("vierkant_stenen_per_speler_4_spelers")} fitxes, ${f("vierkant_stenen_4_spelers")} en total.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">La cadena de salts més llarga: ${f("langste_sprongketen")}</h2>
      <p>Al tauler en estrella, una fitxa pot fer <strong>${f("langste_sprongketen")} salts en un sol moviment</strong>, i segons les regles de Leapstone cap moviment no en pot tenir més. Per arribar a aquest nombre, les altres fitxes es col·loquen lliurement: una a cada casella per sobre de la qual salta la fitxa.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Un tauler en estrella amb una fitxa vermella i moltes fitxes blaves. Unes fletxes blanques mostren la fitxa vermella saltant per sobre d'una fitxa blava rere l'altra, per un camí llarg i sinuós.",
  tekst: "La cadena més llarga: la fitxa vermella salta per sobre de cada fitxa blava, una rere l'altra.",
})}
      <p><strong>Com es compta.</strong> Un salt sempre cau dues caselles més enllà, en línia recta. Per això una fitxa que continua saltant només arriba a una part de les caselles: el tauler es divideix en quatre grups així, i el més gran té ${f("grootste_klasse_vakken")} caselles. A Leapstone, una fitxa no pot caure dues vegades a la mateixa casella en un moviment, ni a la casella d'on ha sortit. Així, una cadena cau com a màxim una vegada a cadascuna de les altres caselles del seu grup. El programa va buscar en aquest grup i va trobar un camí que passa per les ${f("grootste_klasse_vakken")} caselles, de manera que cap cadena no pot ser més llarga: ${f("langste_sprongketen")} salts. Després, una prova juga aquest moviment amb les regles de Leapstone.</p>
      <p><strong>No és una partida real.</strong> Aquesta cadena necessita ${f("langste_sprongketen")} fitxes més, cadascuna just a la casella correcta. Una partida de dos o tres jugadors només té ${f("sterbord_stenen_2_spelers")} o ${f("sterbord_stenen_3_spelers")} fitxes, i són massa poques. Una partida de quatre o sis jugadors en té ${f("sterbord_stenen_4_spelers")} o ${f("sterbord_stenen_6_spelers")}, i n'hi ha prou. Però en una partida real ningú no col·loca les fitxes lliurement, així que no esperis veure aquesta cadena a la taula. Mostra el que el tauler permet, no el que passa quan es juga.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">La travessa més curta: ${f("oversteek_zetten")} moviments</h2>
      <p>Un jugador sol al tauler en estrella, sense rivals, necessita <strong>${f("oversteek_zetten")} moviments</strong> per portar les ${f("sterbord_stenen_per_speler")} fitxes d'una punta a la punta contrària, i no ho pot fer en menys. Una cadena de salts sencera compta com un moviment.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Un tauler en estrella amb només deu fitxes vermelles, a la punta de baix. La punta de dalt, on han d'anar, té una vora puntejada.",
  tekst: "Un jugador sol: deu fitxes a la punta de baix, i la punta de dalt és la meta.",
})}
      <p><strong>Com es compta.</strong> Una prova juga una travessa de ${f("oversteek_zetten")} moviments amb les regles de Leapstone, sense cap altra fitxa al tauler. Per mostrar que amb ${f("geen_oversteek_in_zetten")} moviments o menys no es pot, una cerca segueix el mètode de G. I. Bell (<em>Integers</em> 9, 2009). Cada moviment es pot jugar enrere, i girar el tauler mitja volta intercanvia la sortida i la meta. Si existís una travessa de ${f("geen_oversteek_in_zetten")} moviments o menys, alguna posició a mig camí estaria com a màxim a ${f("zoekdiepte_zetten")} moviments de la sortida, i la mateixa posició girada mitja volta també. La cerca va recórrer totes les posicions a ${f("zoekdiepte_zetten")} moviments o menys de la sortida, va comptar una sola vegada cada posició i la seva imatge al mirall, va deixar fora les que de manera demostrable no poden arribar prou lluny a temps, i no va trobar cap parella així. Va funcionar ${f("gemeten_rekentijd_seconden")} segons en una màquina amb ${f("gemeten_kernen")} nuclis, i el seu pas més gran va tenir ${f("gemeten_grootste_laag_miljoen_standen")} milions de posicions en ${f("gemeten_geheugen_gb")} GB de memòria. El nombre es va tornar a calcular per al tauler propi de Leapstone.</p>
      <p><strong>No és un mínim per a una partida real.</strong> En una partida real, les fitxes dels altres jugadors també són al tauler, i les teves fitxes poden saltar per sobre d'elles. Així que ${f("oversteek_zetten")} no és el mínim que pot durar una partida real: només està demostrat per a un jugador sol.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Prova-ho</h2>
      <p><a href="/play/">Juga a Leapstone al navegador</a> contra l'ordinador, o baixa't l'aplicació amb els botons de dalt d'aquesta pàgina. Per a les regles, llegeix les <a href="/ca/regles/dames-xineses">regles de les dames xineses</a> o les <a href="/ca/regles/halma">regles del Halma</a>. Per saber com fer servir les cadenes de salts en una partida, llegeix els <a href="/ca/guies/estrategia-dames-xineses">consells d'estratègia</a>.</p>
    </section>`;

export default {
  nav: "Les dames xineses en xifres",
  titel: "Les dames xineses en xifres | Leapstone",
  beschrijving: `El tauler en estrella té ${c.sterbord_vakken} caselles. Un moviment té com a màxim ${c.langste_sprongketen} salts, i un jugador sol travessa en ${c.oversteek_zetten} moviments. Com es calcula cada nombre.`,
  h1: "Les dames xineses en xifres",
  intro: `El tauler en estrella de les dames xineses té ${f("sterbord_vakken")} caselles, i cada jugador comença amb ${f("sterbord_stenen_per_speler")} fitxes. A Leapstone, un moviment mai no pot tenir més de ${f("langste_sprongketen")} salts. Un jugador sol al tauler, sense rivals, necessita ${f("oversteek_zetten")} moviments per travessar-lo. A sota pots veure com es compta cada nombre, i què diu i què no diu d'una partida real.`,
  inhoud,
};
