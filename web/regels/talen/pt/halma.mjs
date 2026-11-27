// A página de regras do Halma (taak 134), em português do Brasil. Conteúdo: ../en/halma.mjs, frase por frase
// (conferido com crates/halma-core, ver docs/plan.md, taak 117). Cada regra aqui deve coincidir com a página inglesa.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 jogadores: 19 peças cada",
    alt: "O tabuleiro quadrado com 19 peças vermelhas no canto superior esquerdo e 19 peças azuis no canto inferior direito",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 jogadores: 13 peças cada",
    alt: "O tabuleiro quadrado com 13 peças em cada um dos quatro cantos: vermelhas no alto à esquerda, azuis no alto à direita, verdes embaixo à direita e amarelas embaixo à esquerda",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">O tabuleiro</h2>
      <p>O Halma é jogado em um tabuleiro quadrado de 16 por 16 casas, 256 no total. Cada casa tem até oito vizinhas: as quatro em linha reta e as quatro na diagonal. Uma casa na borda tem menos, e um canto tem três.</p>
      <p>Este é o tabuleiro quadrado do Leapstone. Se você conhece o jogo no tabuleiro em estrela, leia sobre o <a href="/pt/regras/sternhalma">Sternhalma</a> e as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Como as peças começam</h2>
      <p>O Halma é para 2 ou 4 jogadores. Cada jogador começa com as peças em um campo em um canto do tabuleiro. O campo no canto oposto é o seu objetivo.</p>
      <ul>
        <li><strong>2 jogadores:</strong> 19 peças cada, em dois cantos opostos. O campo tem cinco fileiras de 5, 5, 4, 3 e 2 casas.</li>
        <li><strong>4 jogadores:</strong> 13 peças cada, um campo em cada canto. O campo tem quatro fileiras de 4, 4, 3 e 2 casas. O seu objetivo é o canto do outro lado do tabuleiro, na diagonal.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">A vez de cada um</h2>
      <p>O jogador 1 começa. Depois as vezes seguem em ordem, e depois do último jogador volta a ser o jogador 1. No Leapstone as cores acompanham os números: vermelho, azul, verde e amarelo.</p>
      <p>Na sua vez, você move uma peça, uma vez. Nada é capturado: as peças ficam no tabuleiro até o jogador desistir.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Um passo</h2>
      <p>Mova uma peça para uma casa livre ao lado dela, em qualquer uma das oito direções: em linha reta ou na diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Uma peça vermelha com um anel branco em volta. Cinco das suas oito vizinhas estão livres e marcadas; as outras três têm peças.",
  tekst: "A peça vermelha pode dar um passo para as cinco casas marcadas. As outras três vizinhas estão ocupadas.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Um pulo</h2>
      <p>Pule sobre uma peça ao lado da sua, de qualquer cor, e caia na casa livre logo atrás dela, em linha reta. Você pode pular nas oito direções, também na diagonal e para trás.</p>
      <ul>
        <li>A casa onde você cai precisa estar livre.</li>
        <li>Você não pode pular sobre duas peças seguidas, nem sobre uma casa vazia.</li>
        <li>A peça sobre a qual você pulou continua onde está.</li>
        <li>Você não pode pular para fora da borda do tabuleiro.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Uma peça vermelha pula na diagonal sobre uma peça azul para a casa livre atrás dela, mostrado com uma seta.",
  tekst: "A peça vermelha pula na diagonal sobre a peça azul.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Uma sequência de pulos</h2>
      <p>Depois de um pulo, a mesma peça pode pular de novo, quantas vezes conseguir, em qualquer direção, em linha reta ou na diagonal. Você decide onde parar. Todos os pulos juntos formam uma jogada.</p>
      <ul>
        <li>Em uma jogada, você não pode cair duas vezes na mesma casa.</li>
        <li>Uma jogada é um passo, ou um ou mais pulos. Você não pode dar um passo depois de um pulo.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Uma peça vermelha dá três pulos em uma jogada: na diagonal sobre uma peça azul, em linha reta sobre outra peça azul e na diagonal sobre uma peça vermelha. As três casas de chegada estão numeradas 1, 2 e 3.",
  tekst: "Uma jogada com três pulos, na ordem dos números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">O objetivo</h2>
      <p>Você vence ao levar todas as suas peças para o campo oposto àquele em que começou. Todas as casas desse campo precisam ter peças suas: 19 com 2 jogadores, 13 com 4 jogadores. Enquanto houver uma peça de outro jogador ali, você não consegue terminar.</p>
      <p>Você pode cair em qualquer casa livre, também nos campos de outros jogadores. Uma peça que está no seu objetivo pode sair de novo; nada a prende.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "O tabuleiro quadrado para dois jogadores. O vermelho começa no alto à esquerda; o campo embaixo à direita, marcado com círculos tracejados e com peças azuis, é o objetivo do vermelho.",
  tekst: "Com 2 jogadores, o objetivo do vermelho é o campo onde o azul começa.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Com 2 ou 4 jogadores</h2>
      <ul>
        <li><strong>2 jogadores:</strong> vence quem primeiro preencher o objetivo, e a partida termina.</li>
        <li><strong>4 jogadores:</strong> vence quem primeiro preencher o objetivo. Os outros continuam jogando pelos próximos lugares, e um jogador que já terminou é pulado. A partida termina quando só resta um jogador jogando.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Desistir</h2>
      <p>Quando você desiste, suas peças saem do tabuleiro, então não atrapalham ninguém. Com 2 jogadores, o outro jogador vence. Com 4 jogadores a partida continua sem você, e se todos menos um desistirem, o último jogador vence.</p>
      <p>Em uma partida online, cada jogada tem um limite de tempo. Quem inicia a partida define o limite. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste. Partidas contra o computador e em um só celular não têm limite de tempo.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Dicas</h2>
      <ul class="tips">
        <li><strong>Monte escadas.</strong> Coloque peças em linha com uma casa livre entre elas, em linha reta ou na diagonal, apontando para o seu objetivo. Uma peça pode então pular ao longo de toda a linha em uma só jogada.</li>
        <li><strong>Qualquer peça é uma escada.</strong> Você pode pular sobre todas as cores, então as peças dos outros jogadores também ajudam você. E as suas escadas ajudam os outros: veja o que você deixa para trás.</li>
        <li><strong>Use as diagonais.</strong> O objetivo está no canto oposto, então uma linha diagonal de peças é o caminho mais rápido para atravessar.</li>
        <li><strong>Não esqueça as peças atrasadas.</strong> Você precisa de todas as suas peças em casa. Uma peça lá atrás, sem nada para pular, anda uma casa por vez. Traga-a junto enquanto as outras peças ainda estão por perto.</li>
        <li><strong>O seu começo é o objetivo deles.</strong> Com 2 jogadores, o seu campo é o objetivo do outro jogador, e ele não consegue terminar enquanto uma peça sua ainda estiver ali. No Leapstone você pode deixar uma peça em casa, e assim bloquear. O mesmo vale para você.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Perguntas</h2>
      <h3>Quantas pessoas podem jogar Halma?</h3>
      <p>Duas ou quatro. O Halma é jogado em um tabuleiro quadrado de 16 por 16 casas, e cada jogador começa em um canto.</p>
      <h3>Quantas peças cada jogador tem no Halma?</h3>
      <p>Com 2 jogadores, 19 peças cada um, e com 4 jogadores, 13 peças cada um.</p>
      <h3>Quem inventou o Halma?</h3>
      <p>George Howard Monks, um cirurgião americano, em 1883 ou 1884. O nome é grego para &ldquo;salto&rdquo;. Leia mais em <a href="/pt/regras/sternhalma">Sternhalma</a>.</p>
      <h3>Qual é a diferença entre Halma e damas chinesas?</h3>
      <p>O Halma usa um tabuleiro quadrado, com passos e saltos em oito direções e 19 ou 13 peças para cada jogador. As damas chinesas usam um tabuleiro em estrela, com seis direções e 10 peças para cada jogador, para 2, 3, 4 ou 6 jogadores.</p>
      <h3>Dá para jogar Halma online de graça?</h3>
      <p>Sim, no Leapstone, no navegador ou no app da App Store. Escolha uma forma de jogar, como contra o computador ou online com amigos, e depois toque em Tabuleiro quadrado. O Leapstone é grátis e sem anúncios.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Jogue</h2>
      <p>O botão Jogar agora abre uma partida contra o computador no <a href="/pt/regras/damas-chinesas">tabuleiro em estrela</a>. Para jogar Halma, toque na seta de voltar no alto, escolha Jogar neste celular, Jogar contra o computador ou Jogar online com amigos, e toque em Tabuleiro quadrado.</p>
    </section>`;

export default {
  nav: "Regras do Halma",
  titel: "Regras do Halma e dicas | Leapstone",
  beschrijving: "Como jogar Halma no tabuleiro quadrado de 16 por 16: início, passos, pulos, sequências de pulos, como vencer e dicas. Jogue grátis no navegador.",
  h1: "Regras do Halma",
  intro: "Leve todas as suas peças pelo tabuleiro quadrado até o canto oposto antes de qualquer outro jogador. As regras em resumo, com imagens, e algumas dicas.",
  inhoud,
};
