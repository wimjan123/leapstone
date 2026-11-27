// O guia das damas chinesas para 4 jogadores (taak 301, feature 294), em português do Brasil: /pt/guias/damas-chinesas-para-4-jogadores.
// Conteúdo: ../en/chinese-checkers-4-players.mjs, frase por frase. Regras de crates/halma-core (Board::star, Game::new_star(4), make_move, resign),
// limite de tempo de taak 80 e jogo rápido de taak 97 e 99. Verificação em docs/plan.md, taak 301.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Como o tabuleiro é dividido</h2>
      <p>Cada jogador tem 10 peças, então 40 peças estão no tabuleiro de 121 casas. As quatro pontas de início são dois pares de pontas vizinhas: vermelho embaixo e azul embaixo à esquerda, verde no alto e amarelo no alto à direita.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo, 10 peças azuis na ponta inferior esquerda, 10 peças verdes na ponta de cima e 10 peças amarelas na ponta superior direita. As pontas superior esquerda e inferior direita estão vazias.",
  tekst: "Vermelho embaixo, azul embaixo à esquerda, verde no alto, amarelo no alto à direita.",
})}
      <p>O jogador 1, vermelho, joga primeiro. Depois o azul é o jogador 2, o verde é o jogador 3, o amarelo é o jogador 4, e depois do amarelo é a vez do vermelho de novo. Uma jogada é um passo ou uma sequência de pulos com uma peça. Veja as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> para passos e pulos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Quem fica de frente para quem</h2>
      <p>As pontas formam pares frente a frente: vermelho de frente para o verde, e azul de frente para o amarelo. O seu objetivo é a ponta do lado oposto. O vermelho vai para onde o verde começa, o verde para onde o vermelho começa, o azul para onde o amarelo começa e o amarelo para onde o azul começa.</p>
      <p>Como em uma partida para 2, cada objetivo começa cheio de peças do jogador à sua frente, então você só pode cair ali depois que elas saírem. Com 3 jogadores os objetivos começam vazios, então com 4 ninguém pode terminar logo de cara. Os quatro objetivos são quatro pontas diferentes, então ninguém mais quer o seu objetivo: um jogador que terminou nunca bloqueia ninguém.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">As duas pontas vazias</h2>
      <p>As pontas superior esquerda e inferior direita não têm peças. Elas não são início nem objetivo de ninguém. A superior esquerda fica entre o azul e o verde, e a inferior direita entre o amarelo e o vermelho.</p>
      <p>Você pode dar um passo ou pular para qualquer casa livre, então pode atravessar essas pontas ou parar nelas. Uma peça ali ainda não está em um objetivo. Em uma ponta vazia não há nada para pular, até que alguém leve peças para lá.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">O que muda na sua tática</h2>
      <ul>
        <li><strong>Duas travessias ao mesmo tempo:</strong> o vermelho e o verde atravessam o tabuleiro um em direção ao outro, e o azul e o amarelo também. As duas linhas passam pelo meio, então o meio fica mais cheio do que em uma partida para 2, em que só uma linha atravessa.</li>
        <li><strong>Três jogadores jogam entre as suas jogadas:</strong> o tabuleiro muda mais entre duas jogadas suas do que em uma partida para 2. Olhe para ele de novo no início de cada vez e planeje então a sua sequência de pulos. O jogador que joga depois de você nunca é o que está à sua frente.</li>
        <li><strong>As peças ajudam todos:</strong> cada peça dos outros três é um degrau para você, e as suas são degraus para eles. As peças do jogador à sua frente andam no sentido oposto, como em uma partida para 2.</li>
        <li><strong>Espaço para contornar:</strong> se o meio estiver cheio, as pontas vazias são espaço livre ao lado dos acampamentos. Um caminho por uma delas pode ser um jeito de contornar a multidão.</li>
        <li><strong>Um jogador que desiste libera o seu objetivo:</strong> quando o jogador à sua frente desiste, as peças dele saem do tabuleiro, então o seu objetivo fica vazio na hora.</li>
      </ul>
      <p>As <a href="/pt/guias/damas-chinesas-estrategia">dicas de estratégia</a> sobre escadas, peças que ficam para trás e preencher o objetivo de trás para a frente valem igualmente com 4 jogadores.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vencer, e o que acontece depois</h2>
      <ul>
        <li><strong>Vencer:</strong> quem primeiro preencher o objetivo com todas as 10 peças vence. A partida não termina aí: os outros três continuam jogando pelos próximos lugares, e um jogador que já terminou é pulado. As peças desse jogador ficam no tabuleiro. A partida acaba quando só resta um jogador jogando.</li>
        <li><strong>Desistir:</strong> suas peças saem do tabuleiro e os outros três continuam. Se os outros também desistirem, vence o último jogador que sobrou.</li>
        <li><strong>Tempo (online):</strong> em uma partida online, cada jogada tem um limite de tempo. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste, e a partida continua sem você.</li>
      </ul>
      <p>Para as partidas com menos jogadores, leia <a href="/pt/guias/damas-chinesas-para-2-jogadores">Damas chinesas para 2 jogadores</a>. A <a href="/pt/regras/damas-chinesas">página de regras</a> tem imagens de cada começo.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Onde jogar com 4 jogadores no Leapstone</h2>
      <ul>
        <li><strong>Contra o computador, agora mesmo:</strong> abra o <a href="/play/">Leapstone no navegador</a>, toque em Computador, escolha o tabuleiro em estrela e 3 computadores. Você é o jogador 1, então joga primeiro. Você escolhe Fácil, Normal ou Difícil para os computadores.</li>
        <li><strong>Em um só celular:</strong> toque em Jogar, escolha o tabuleiro em estrela e 4 jogadores, e depois toque em uma peça para alternar esse lugar entre uma pessoa e um computador.</li>
        <li><strong>Online com amigos:</strong> toque em Amigos, escolha o tabuleiro em estrela, 4 jogadores e o tempo por jogada, e envie o link de convite. A partida começa quando os 4 lugares estiverem ocupados.</li>
        <li><strong>Partida rápida, no app:</strong> toque em Jogar online. Enquanto ele procura uma partida para 2, toque em Procurar 4 ou 6 jogadores para procurar uma partida para 4. Cada jogada tem 30 segundos. Se não entrarem jogadores suficientes em 20 segundos, jogadores do computador preenchem os lugares vazios, então alguns adversários podem ser jogadores do computador.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinesas para 4 jogadores",
  titel: "Damas chinesas para 4 jogadores: início e dicas | Leapstone",
  beschrijving: "Como funcionam as damas chinesas com 4 jogadores: como o tabuleiro é dividido, quais 2 pontas ficam vazias, quem fica de frente, a tática e onde jogar.",
  h1: "Damas chinesas para 4 jogadores",
  intro: "Com 4 jogadores, cada um de vocês começa em uma das quatro pontas da estrela, e duas pontas ficam vazias. O vermelho fica de frente para o verde e o azul para o amarelo: o seu objetivo é a ponta do lado oposto, cheia de peças desse jogador. Veja o início, as pontas vazias, a tática e onde jogar.",
  inhoud,
};
