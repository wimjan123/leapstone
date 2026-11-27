// Leapstone em números, Portugees (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Casas e peças</h2>
      <p>Contadas nos dois tabuleiros do Leapstone, na posição inicial de uma partida.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "O tabuleiro em estrela com as seis pontas cheias: dez peças de cada uma de seis cores, em volta de um centro vazio.",
  tekst: "O tabuleiro em estrela no início de uma partida para seis jogadores.",
})}
      <ul class="tips">
        <li><strong>O tabuleiro em estrela tem ${f("sterbord_vakken")} casas.</strong> Cada jogador começa com ${f("sterbord_stenen_per_speler")} peças. Então uma partida para dois jogadores tem ${f("sterbord_stenen_2_spelers")} peças no tabuleiro, uma para três tem ${f("sterbord_stenen_3_spelers")}, para quatro ${f("sterbord_stenen_4_spelers")} e para seis ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>O tabuleiro quadrado do Halma tem ${f("vierkant_vakken")} casas.</strong> Numa partida para dois jogadores, cada jogador começa com ${f("vierkant_stenen_per_speler_2_spelers")} peças, ${f("vierkant_stenen_2_spelers")} no total. Numa partida para quatro, cada um começa com ${f("vierkant_stenen_per_speler_4_spelers")} peças, ${f("vierkant_stenen_4_spelers")} no total.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">A cadeia de saltos mais longa: ${f("langste_sprongketen")}</h2>
      <p>No tabuleiro em estrela, uma peça pode dar <strong>${f("langste_sprongketen")} saltos numa só jogada</strong>, e pelas regras do Leapstone nenhuma jogada pode ter mais. Para chegar a esse número, as outras peças são colocadas livremente: uma em cada casa por cima da qual a peça salta.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Um tabuleiro em estrela com uma peça vermelha e muitas peças azuis. Setas brancas mostram a peça vermelha a saltar por cima de uma peça azul atrás da outra, num caminho longo e sinuoso.",
  tekst: "A cadeia mais longa: a peça vermelha salta por cima de cada peça azul, uma após a outra.",
})}
      <p><strong>Como se conta.</strong> Um salto cai sempre duas casas adiante, em linha reta. Por isso uma peça que continua a saltar só chega a uma parte das casas: o tabuleiro divide-se em quatro grupos assim, e o maior tem ${f("grootste_klasse_vakken")} casas. No Leapstone, uma peça não pode cair duas vezes na mesma casa numa jogada, nem na casa de onde saiu. Assim, uma cadeia cai no máximo uma vez em cada uma das outras casas do seu grupo. O programa procurou nesse grupo e achou um caminho que passa pelas ${f("grootste_klasse_vakken")} casas, então nenhuma cadeia pode ser mais longa: ${f("langste_sprongketen")} saltos. Depois, um teste joga essa jogada com as regras do Leapstone.</p>
      <p><strong>Não é uma partida real.</strong> Esta cadeia precisa de ${f("langste_sprongketen")} outras peças, cada uma exatamente na casa certa. Uma partida para dois ou três jogadores tem só ${f("sterbord_stenen_2_spelers")} ou ${f("sterbord_stenen_3_spelers")} peças, o que é pouco. Uma partida para quatro ou seis jogadores tem ${f("sterbord_stenen_4_spelers")} ou ${f("sterbord_stenen_6_spelers")}, o que chega. Mas numa partida real ninguém coloca as peças livremente, então não espere ver esta cadeia na mesa. Ela mostra o que o tabuleiro permite, não o que acontece no jogo.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">A travessia mais curta: ${f("oversteek_zetten")} jogadas</h2>
      <p>Um jogador sozinho no tabuleiro em estrela, sem adversários, precisa de <strong>${f("oversteek_zetten")} jogadas</strong> para levar todas as ${f("sterbord_stenen_per_speler")} peças de uma ponta até a ponta oposta, e não consegue em menos. Uma cadeia de saltos inteira conta como uma jogada.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Um tabuleiro em estrela com apenas dez peças vermelhas, na ponta de baixo. A ponta de cima, para onde elas têm de ir, tem um contorno tracejado.",
  tekst: "Um jogador sozinho: dez peças na ponta de baixo, e a ponta de cima é o destino.",
})}
      <p><strong>Como se conta.</strong> Um teste joga uma travessia de ${f("oversteek_zetten")} jogadas com as regras do Leapstone, sem outras peças no tabuleiro. Para mostrar que ${f("geen_oversteek_in_zetten")} jogadas ou menos não chegam, uma busca segue o método de G. I. Bell (<em>Integers</em> 9, 2009). Toda jogada pode ser feita ao contrário, e dar meia-volta ao tabuleiro troca o início pelo destino. Se existisse uma travessia de ${f("geen_oversteek_in_zetten")} jogadas ou menos, alguma posição a meio caminho estaria no máximo a ${f("zoekdiepte_zetten")} jogadas do início, e a mesma posição virada meia-volta também. A busca percorreu todas as posições a até ${f("zoekdiepte_zetten")} jogadas do início, contou uma só vez cada posição e a sua imagem no espelho, deixou de fora as que comprovadamente não podem ir longe o bastante a tempo, e não achou nenhum par assim. Ela rodou ${f("gemeten_rekentijd_seconden")} segundos numa máquina com ${f("gemeten_kernen")} núcleos, e o seu maior passo guardou ${f("gemeten_grootste_laag_miljoen_standen")} milhões de posições em ${f("gemeten_geheugen_gb")} GB de memória. O número foi calculado de novo para o próprio tabuleiro do Leapstone.</p>
      <p><strong>Não é um limite mínimo para uma partida real.</strong> Numa partida real, as peças dos outros jogadores também estão no tabuleiro, e as suas peças podem saltar por cima delas. Então ${f("oversteek_zetten")} não é o mínimo que uma partida real pode levar: só está provado para um jogador sozinho.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Experimente</h2>
      <p><a href="/play/">Jogue Leapstone no navegador</a> contra o computador, ou baixe o app com os botões no topo desta página. Para as regras, leia as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> ou as <a href="/pt/regras/halma">regras do Halma</a>. Para usar cadeias de saltos numa partida, leia as <a href="/pt/guias/damas-chinesas-estrategia">dicas de estratégia</a>.</p>
    </section>`;

export default {
  nav: "As damas chinesas em números",
  titel: "As damas chinesas em números | Leapstone",
  beschrijving: `O tabuleiro em estrela tem ${c.sterbord_vakken} casas. Uma jogada tem no máximo ${c.langste_sprongketen} saltos, e um jogador sozinho atravessa em ${c.oversteek_zetten} jogadas. Como cada número é calculado.`,
  h1: "As damas chinesas em números",
  intro: `O tabuleiro em estrela das damas chinesas tem ${f("sterbord_vakken")} casas, e cada jogador começa com ${f("sterbord_stenen_per_speler")} peças. No Leapstone, uma jogada nunca pode ter mais de ${f("langste_sprongketen")} saltos. Um jogador sozinho no tabuleiro, sem adversários, precisa de ${f("oversteek_zetten")} jogadas para atravessá-lo. Abaixo você vê como cada número é contado, e o que ele diz e não diz sobre uma partida real.`,
  inhoud,
};
