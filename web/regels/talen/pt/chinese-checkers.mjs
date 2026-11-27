// A página de regras das damas chinesas (taak 134), em português do Brasil. Conteúdo: ../en/chinese-checkers.mjs, frase por frase
// (conferido com crates/halma-core, ver docs/plan.md, taak 116). Cada regra aqui deve coincidir com a página inglesa.
// As mesmas imagens (sem idioma: só números no SVG); textos alternativos e legendas em português.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} jogadores`,
      alt:
        {
          2: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo e 10 peças azuis na ponta de cima",
          3: "O tabuleiro em estrela com peças vermelhas embaixo, azuis no alto à esquerda e verdes no alto à direita",
          4: "O tabuleiro em estrela com peças em quatro pontas: vermelhas embaixo, verdes no alto, azuis embaixo à esquerda e amarelas no alto à direita",
          6: "O tabuleiro em estrela com peças nas seis pontas, em seis cores",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">O tabuleiro</h2>
      <p>As damas chinesas são jogadas em uma estrela de seis pontas. O tabuleiro tem 121 casas, e cada ponta tem 10 delas. No interior do tabuleiro, cada casa tem seis vizinhas.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Como as peças começam</h2>
      <p>Cada jogador tem 10 peças e começa com todas elas em uma ponta da estrela. A ponta do lado oposto à sua é o seu objetivo.</p>
      <ul>
        <li><strong>2 jogadores:</strong> as duas pontas opostas.</li>
        <li><strong>3 jogadores:</strong> uma ponta sim, outra não. Os três objetivos começam vazios.</li>
        <li><strong>4 jogadores:</strong> dois pares de pontas vizinhas. Cada jogador tem outro jogador do lado oposto.</li>
        <li><strong>6 jogadores:</strong> todas as seis pontas.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">A vez de cada um</h2>
      <p>O jogador 1 começa. Depois as vezes seguem em ordem, jogador 2, jogador 3 e assim por diante, e depois do último jogador volta a ser o jogador 1. No Leapstone as cores acompanham os números: vermelho, azul, verde, amarelo, roxo e prata.</p>
      <p>Na sua vez, você move uma peça, uma vez. Nada é capturado: as peças ficam no tabuleiro até o jogador desistir.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Um passo</h2>
      <p>Mova uma peça para uma casa livre ao lado dela.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Uma peça vermelha com um anel branco em volta. Três das suas seis vizinhas estão livres e marcadas; as outras três têm peças.",
  tekst: "A peça vermelha pode dar um passo para as três casas marcadas. As outras três vizinhas estão ocupadas.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Um pulo</h2>
      <p>Pule sobre uma peça ao lado da sua, de qualquer cor, e caia na casa livre logo atrás dela, em linha reta. Você pode pular nas seis direções, também para trás.</p>
      <ul>
        <li>A casa onde você cai precisa estar livre.</li>
        <li>Você não pode pular sobre duas peças seguidas, nem sobre uma casa vazia.</li>
        <li>A peça sobre a qual você pulou continua onde está.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Uma peça vermelha pula sobre uma peça azul para a casa livre atrás dela, mostrado com uma seta.",
  tekst: "A peça vermelha pula sobre a peça azul.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Uma sequência de pulos</h2>
      <p>Depois de um pulo, a mesma peça pode pular de novo, quantas vezes conseguir e em qualquer direção. Você decide onde parar. Todos os pulos juntos formam uma jogada.</p>
      <ul>
        <li>Em uma jogada, você não pode cair duas vezes na mesma casa.</li>
        <li>Uma jogada é um passo, ou um ou mais pulos. Você não pode dar um passo depois de um pulo.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Uma peça vermelha dá três pulos em uma jogada, sobre uma peça azul, uma verde e outra azul. As três casas de chegada estão numeradas 1, 2 e 3.",
  tekst: "Uma jogada com três pulos, na ordem dos números.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">O objetivo</h2>
      <p>Você vence ao levar todas as suas 10 peças para a ponta oposta àquela em que começou. As 10 casas dessa ponta precisam ter peças suas. Enquanto houver uma peça de outro jogador ali, você não consegue terminar.</p>
      <p>Você pode cair em qualquer casa livre, também nas pontas de outros jogadores.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Um tabuleiro em estrela para três jogadores. O vermelho começa embaixo; a ponta vazia no alto, marcada com círculos tracejados, é o objetivo do vermelho.",
  tekst: "Com 3 jogadores, o vermelho começa embaixo. O objetivo do vermelho é a ponta vazia no alto.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Com 2, 3, 4 ou 6 jogadores</h2>
      <ul>
        <li><strong>2 jogadores:</strong> vence quem primeiro preencher o objetivo, e a partida termina.</li>
        <li><strong>3, 4 ou 6 jogadores:</strong> vence quem primeiro preencher o objetivo. Os outros continuam jogando pelos próximos lugares, e um jogador que já terminou é pulado. A partida termina quando só resta um jogador jogando.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Desistir</h2>
      <p>Quando você desiste, suas peças saem do tabuleiro, então não atrapalham ninguém. Com 2 jogadores, o outro jogador vence. Com mais jogadores a partida continua sem você, e se todos menos um desistirem, o último jogador vence.</p>
      <p>Em uma partida online, cada jogada tem um limite de tempo. Quem inicia a partida define o limite, e em uma partida rápida são 30 segundos. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste. Partidas contra o computador e em um só celular não têm limite de tempo.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Dicas</h2>
      <ul class="tips">
        <li><strong>Monte escadas.</strong> Coloque peças em linha com uma casa livre entre elas, apontando para o seu objetivo. Uma peça pode então pular ao longo de toda a linha em uma só jogada.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatro peças em uma linha diagonal com uma casa livre entre cada uma. Uma peça vermelha em uma ponta pula sobre as quatro, com quatro casas de chegada numeradas.",
  tekst: "Quatro peças em linha: a peça vermelha no alto atravessa o tabuleiro em uma jogada, com quatro pulos.",
})}
        </li>
        <li><strong>Qualquer peça é uma escada.</strong> Você pode pular sobre todas as cores, então as peças dos outros jogadores também ajudam você. E as suas escadas ajudam os outros: veja o que você deixa para trás.</li>
        <li><strong>Não esqueça as peças atrasadas.</strong> Você precisa de todas as 10 peças em casa. Uma peça lá atrás, sem nada para pular, anda uma casa por vez. Traga-a junto enquanto as outras peças ainda estão por perto.</li>
        <li><strong>O seu começo é o objetivo deles.</strong> Com 2, 4 ou 6 jogadores, a sua ponta inicial é o objetivo do jogador do lado oposto, e ele não consegue terminar enquanto uma peça sua ainda estiver ali. O mesmo vale para você.</li>
      </ul>
      <p>Mais dicas, com imagens, estão no guia de <a href="/pt/guias/damas-chinesas-estrategia">estratégia nas damas chinesas</a>. Para uma partida de dois, leia <a href="/pt/guias/damas-chinesas-para-2-jogadores">damas chinesas para 2 jogadores</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Perguntas</h2>
      <h3>Quantas pessoas podem jogar damas chinesas?</h3>
      <p>Duas, três, quatro ou seis. Cada jogador começa em uma ponta da estrela. Com 2, 3 ou 4 jogadores, algumas pontas ficam vazias.</p>
      <h3>Quantas peças cada jogador tem?</h3>
      <p>Cada jogador tem 10 peças. O tabuleiro tem 121 casas: 10 em cada uma das seis pontas e 61 no meio.</p>
      <h3>Dá para pular sobre as próprias peças ou para trás?</h3>
      <p>Sim. Você pode pular sobre uma peça de qualquer cor, inclusive a sua, em qualquer uma das seis direções, também para trás. A peça sobre a qual você pula continua onde está.</p>
      <h3>Nas damas chinesas se capturam peças?</h3>
      <p>Não. Nada é capturado. Uma peça só sai do tabuleiro quando o jogador desiste.</p>
      <h3>As damas chinesas vêm da China?</h3>
      <p>Não. O jogo surgiu na Alemanha em 1892 como Stern-Halma, baseado no jogo mais antigo Halma. O nome damas chinesas vem dos Estados Unidos, em 1928. Leia mais em <a href="/pt/regras/sternhalma">Sternhalma</a>.</p>
      <h3>Onde jogar damas chinesas online com amigos de graça?</h3>
      <p>No Leapstone, no navegador ou no app da App Store. Envie um link de convite a um amigo: ele entra na sua partida sem conta, e-mail nem senha. Você também pode jogar contra o computador ou fazer uma partida rápida contra outro jogador. O Leapstone é grátis e sem anúncios.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Jogar damas chinesas no Leapstone</h2>
      <p>Leapstone é um app gratuito para jogar damas chinesas e Halma, com um tabuleiro 3D de laca vermelha e ouro. Você pode jogar no app e no navegador.</p>
      <ul>
        <li><strong>Contra o computador.</strong> Fácil, normal ou difícil. Não precisa de internet.</li>
        <li><strong>Com amigos.</strong> Envie um link de convite. Você define o tempo por jogada, e vocês podem conversar no chat.</li>
        <li><strong>Online.</strong> Uma partida rápida contra outro jogador do seu nível, 30 segundos por jogada. Alguns oponentes online podem ser jogadores do computador.</li>
        <li><strong>Em um só celular.</strong> Passem o celular pela mesa.</li>
      </ul>
      <p>O Leapstone é grátis, sem anúncios e sem cadastro com e-mail: você escolhe só um nome de jogador. <a href="https://apps.apple.com/br/app/id6831230722">Baixar na App Store</a> ou <a href="/play/">Jogar no navegador</a>.</p>
    </section>`;

export default {
  nav: "Regras das damas chinesas",
  titel: "Regras das damas chinesas e dicas | Leapstone",
  beschrijving: "Como jogar damas chinesas: início, passos, pulos e sequências de pulos, como vencer com 2, 3, 4 ou 6 jogadores, e dicas. Jogue grátis no navegador.",
  h1: "Regras das damas chinesas",
  intro: "Leve todas as suas 10 peças pelo tabuleiro em estrela até a ponta oposta antes de qualquer outro jogador. As regras em resumo, com imagens, e algumas dicas.",
  inhoud,
};
