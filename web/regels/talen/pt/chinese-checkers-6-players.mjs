// De gids Damas chinesas para 6 jogadores (taak 302): /pt/guias/damas-chinesas-para-6-jogadores.
// Inhoud: de Engelse gids ../en/chinese-checkers-6-players.mjs, zin voor zin in het Portugees. De controle tegen crates/halma-core staat
// in docs/plan.md, taak 302. Verander je een regel, verander dan beide.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Como a partida começa</h2>
      <p>Cada jogador tem 10 peças, e todas as 6 pontas da estrela estão em uso. Isso coloca 60 peças no tabuleiro de 121 casas. As 61 casas do meio estão vazias no início.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 10 peças em cada uma das suas 6 pontas, em 6 cores",
  tekst: "6 jogadores, 6 pontas, 60 peças.",
})}
      <p>O jogador 1, vermelho, joga primeiro, a partir da ponta de baixo. Depois a vez passa do jogador 1 ao jogador 6, e depois do jogador 6 é de novo o jogador 1. Os jogadores são numerados na ordem das suas pontas em volta da estrela, então o jogador depois de você sempre começa na ponta ao lado da sua. Uma jogada é um passo ou uma sequência de pulos com uma peça. Veja as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> para passos e pulos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Todo objetivo começa cheio</h2>
      <p>Você vence ao levar todas as suas 10 peças para a ponta do outro lado do tabuleiro. Com 6 jogadores, essa é a ponta onde começa o jogador do lado oposto, então nenhum objetivo está vazio: cada objetivo começa cheio de peças de outro jogador. Para o vermelho, o objetivo é a ponta de cima, onde começa o jogador 4.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 6 pontas cheias. Um anel tracejado marca a ponta de cima, o objetivo do jogador vermelho, que tem as peças do jogador do lado oposto.",
  tekst: "O objetivo do vermelho é a ponta oposta, cheia de peças do jogador 4.",
})}
      <p>Você só pode cair em uma casa livre, então o jogador do lado oposto precisa sair da ponta dele antes que você possa preenchê-la, e você precisa sair da sua antes que ele possa preencher a dele. Em uma partida para 2, é só isso. Com 6, os dois também precisam atravessar a multidão dos outros 4.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Um meio lotado</h2>
      <p>Todo objetivo fica do outro lado do tabuleiro, e as pontas só se ligam entre si pelo meio, então todas as 60 peças precisam atravessar as mesmas 61 casas. No início ninguém atravessou ainda, e o meio enche rápido.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Uma peça vermelha pula três vezes em uma só jogada: sobre uma peça azul, depois sobre uma verde e depois sobre uma roxa. Os números 1, 2 e 3 marcam as casas de chegada.",
  tekst: "Peças de todas as cores são degraus.",
})}
      <p>Você pode pular sobre uma peça de qualquer cor. As peças de outros 5 jogadores são degraus para você, e as suas são degraus para todos os 5. Uma fila de peças que você deixa no meio é uma escada para quem conseguir alcançá-la, e o jogador depois de você tem a primeira chance.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Bloquear com 5 adversários</h2>
      <ul>
        <li><strong>Preencha a casa de chegada:</strong> um pulo precisa de uma casa livre logo atrás da peça. Quando você coloca uma peça ali, o pulo some para todo jogador que queria fazê-lo.</li>
        <li><strong>Cuidado com as escadas que você monta:</strong> depois da sua jogada, os outros 5 jogadores jogam antes de chegar a sua vez de novo. Uma escada ajuda todos eles.</li>
        <li><strong>Qualquer um pode bloquear um objetivo:</strong> uma peça de qualquer outro jogador no seu objetivo impede você de terminar, não só uma peça do jogador do lado oposto. Todas as 10 casas do objetivo precisam ter peças suas.</li>
      </ul>
      <p>As <a href="/pt/guias/damas-chinesas-estrategia">dicas de estratégia</a> mostram como é um pulo bloqueado, e como não prender uma peça de outro jogador no seu próprio objetivo.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Quanto tempo dura uma partida</h2>
      <p>Uma partida para 6 tem 60 peças para mover, e entre uma jogada sua e a seguinte, os outros 5 jogadores fazem uma cada um. Ela também não termina quando o primeiro jogador termina.</p>
      <ul>
        <li><strong>Vencer e continuar jogando:</strong> o primeiro jogador a preencher o objetivo vence, e os outros continuam jogando pelos próximos lugares. O jogador que terminou é pulado, e as peças dele ficam no tabuleiro como degraus. A partida acaba quando só um jogador ainda está jogando.</li>
        <li><strong>Desistir:</strong> suas peças saem do tabuleiro, então não bloqueiam nem ajudam mais ninguém, e os outros continuam.</li>
        <li><strong>Tempo (online):</strong> em uma partida online, cada jogada tem um limite de tempo, definido pelo jogador que inicia a partida: 15 segundos, 30 segundos, 1 minuto, 2 minutos ou sem limite. Uma rodada de 6 jogadas leva no máximo 6 vezes o limite, então com 30 segundos são no máximo 3 minutos. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste, e a partida continua sem você.</li>
      </ul>
      <p>Para uma partida com menos jogadores, leia <a href="/pt/guias/damas-chinesas-para-2-jogadores">Damas chinesas para 2 jogadores</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Onde jogar com 6 jogadores no Leapstone</h2>
      <ul>
        <li><strong>Contra o computador, agora mesmo:</strong> abra o <a href="/play/">Leapstone no navegador</a>, toque em Computador, escolha o tabuleiro em estrela e 5 computadores. Você é o jogador 1, então joga primeiro. Os computadores jogam um depois do outro, cada um com uma pausa curta, para você poder acompanhar cada jogada. Você escolhe Fácil, Normal ou Difícil para os computadores.</li>
        <li><strong>Em um só celular:</strong> toque em Jogar, escolha o tabuleiro em estrela e 6 jogadores, e depois toque em uma peça para alternar esse lugar entre uma pessoa e um computador.</li>
        <li><strong>Online com amigos:</strong> toque em Amigos, escolha o tabuleiro em estrela, 6 jogadores e o tempo por jogada, e envie o link de convite. A partida começa quando os 6 lugares estão ocupados.</li>
        <li><strong>Partidas rápidas:</strong> Jogar online encontra partidas para 2 ou 4 jogadores, então não há partida rápida para 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinesas para 6 jogadores",
  titel: "Damas chinesas para 6: o tabuleiro cheio | Leapstone",
  beschrijving: "Como funcionam as damas chinesas com 6 jogadores: uma estrela cheia de 60 peças, um meio lotado, bloqueio, quanto dura uma partida e onde jogar.",
  h1: "Damas chinesas para 6 jogadores",
  intro: "Como funciona uma partida para 6: todas as 6 pontas estão cheias, você corre até a ponta do outro lado do tabuleiro, e a partida continua depois que o primeiro jogador termina.",
  inhoud,
};
