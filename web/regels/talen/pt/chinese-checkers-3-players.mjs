// O guia das damas chinesas para 3 jogadores (taak 299), em português do Brasil. Conteúdo: ../en/chinese-checkers-3-players.mjs, frase por frase.
// Regras de crates/halma-core; o controle está em docs/plan.md, taak 139. Mudou uma regra, mude os dois.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Como a partida começa</h2>
      <p>Cada jogador tem 10 peças, então 30 peças estão em um tabuleiro de 121 casas. Elas começam em uma ponta sim, outra não, da estrela: vermelho embaixo, azul no alto à esquerda e verde no alto à direita. As três pontas do meio ficam vazias.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo, 10 peças azuis na ponta do alto à esquerda e 10 peças verdes na ponta do alto à direita",
  tekst: "Vermelho embaixo, azul no alto à esquerda, verde no alto à direita.",
})}
      <p>O jogador 1, vermelho, joga primeiro. Depois o azul é o jogador 2, o verde é o jogador 3, e depois do verde é a vez do vermelho de novo. Uma jogada é um passo ou uma sequência de pulos com uma peça. Veja as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> para passos e pulos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Três objetivos, todos vazios no início</h2>
      <p>O seu objetivo é a ponta oposta à de onde você começou, e com 3 jogadores ela começa vazia. É a ponta vazia entre as pontas iniciais dos outros dois jogadores: o objetivo do vermelho fica no alto, o do azul embaixo à direita e o do verde embaixo à esquerda.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela para três jogadores. Círculos tracejados na cor de cada jogador marcam os três objetivos vazios: vermelho no alto, azul embaixo à direita, verde embaixo à esquerda.",
  tekst: "Cada objetivo tem a cor do seu jogador.",
})}
      <p>Você vence ao levar todas as suas 10 peças para o seu objetivo. Todas as 10 casas precisam ter peças suas. Ninguém começa no seu objetivo, mas você pode parar em qualquer casa livre, então uma peça de outro jogador pode cair ali mais tarde. Enquanto ela estiver lá, você não consegue terminar.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vencer, e o que acontece depois</h2>
      <ul>
        <li><strong>Vencer:</strong> o primeiro jogador que preencher o objetivo vence. A partida não termina aí: os outros dois continuam jogando pelos próximos lugares, e o jogador que já terminou é pulado. A partida acaba quando só resta um jogador jogando.</li>
        <li><strong>Desistir:</strong> suas peças saem do tabuleiro e os outros dois continuam. Se um segundo jogador desistir antes de alguém terminar, o último jogador que restou vence.</li>
        <li><strong>Tempo (online):</strong> em uma partida online, cada jogada tem um limite de tempo, definido pelo jogador que inicia a partida. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste, e a partida continua sem você.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Como ela difere de uma partida para 2</h2>
      <ul>
        <li><strong>Mais peças:</strong> 30 no tabuleiro, contra 20 com 2 jogadores.</li>
        <li><strong>Objetivos vazios:</strong> com 2 jogadores, o seu objetivo começa cheio de peças do outro jogador. Com 3, ele começa vazio.</li>
        <li><strong>Dois adversários:</strong> depois da sua jogada, dois outros jogadores jogam antes de chegar a sua vez de novo. As peças dos dois são degraus para você, e as suas para eles. Uma escada que você monta pode ser usada pelos dois, e o jogador depois de você tem a primeira chance.</li>
        <li><strong>A partida continua:</strong> com 2 jogadores, a partida termina quando um de vocês termina. Com 3, ela continua pelo segundo e pelo terceiro lugar.</li>
      </ul>
      <p>Para a partida com dois, leia <a href="/pt/guias/damas-chinesas-para-2-jogadores">damas chinesas para 2 jogadores</a>. As <a href="/pt/guias/damas-chinesas-estrategia">dicas de estratégia</a> tratam de passos e pulos, que são os mesmos com 3 jogadores.</p>
      <p><a href="/pt/guias/damas-chinesas-online-com-amigos">Damas chinesas online com amigos</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Onde jogar com 3 jogadores no Leapstone</h2>
      <ul>
        <li><strong>Contra o computador, agora mesmo:</strong> abra o <a href="/play/">Leapstone no navegador</a>, toque em Computador, escolha o tabuleiro em estrela e 2 computadores. Você é o jogador 1, então joga primeiro. Você escolhe Fácil, Normal ou Difícil para os computadores.</li>
        <li><strong>Em um só celular:</strong> toque em “Neste celular”, escolha o tabuleiro em estrela e 3 jogadores, e depois toque em uma peça para alternar esse lugar entre uma pessoa e um computador.</li>
        <li><strong>Online com amigos:</strong> toque em Amigos, escolha o tabuleiro em estrela, 3 jogadores e o tempo por jogada, e envie o link de convite. A partida começa quando os 3 lugares estiverem ocupados.</li>
        <li><strong>Partidas rápidas:</strong> o Jogar online encontra partidas para 2 ou 4 jogadores, então não há partida rápida para 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Damas chinesas para 3 jogadores",
  titel: "Damas chinesas para 3 jogadores: regras | Leapstone",
  beschrijving: "Como funcionam as damas chinesas com 3 jogadores: onde as 30 peças começam, qual ponta vazia é cada objetivo, quem joga primeiro e como vencer.",
  h1: "Damas chinesas para 3 jogadores",
  intro: "Como funciona uma partida de três no tabuleiro em estrela: o início, os três objetivos, quem joga primeiro, como vencer e onde jogar.",
  inhoud,
};
