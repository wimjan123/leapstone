// O guia das damas chinesas para 2 jogadores (taak 134), em português do Brasil. Conteúdo: ../en/chinese-checkers-2-players.mjs, frase por frase.
// Regras de crates/halma-core (Board::star, Game::new_star(2), make_move, resign), o limite de tempo de "Regels" e taak 80,
// os níveis do computador de crates/halma-core/src/computer.rs. O que o app mostra vem de web/src/Startmenu.svelte.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Como a partida começa</h2>
      <p>Cada jogador tem 10 peças. Elas começam em duas pontas da estrela que ficam de frente uma para a outra: vermelho embaixo, azul no alto. As 20 peças estão em um tabuleiro de 121 casas.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo e 10 peças azuis na ponta de cima",
  tekst: "O vermelho começa embaixo, o azul no alto.",
})}
      <p>O jogador 1, vermelho, joga primeiro. Depois vocês se alternam, uma jogada cada. Uma jogada é um passo ou uma sequência de pulos com uma peça. Veja as <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> para passos e pulos.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">O seu objetivo é o início do outro jogador</h2>
      <p>Você vence ao levar todas as suas 10 peças para a ponta onde o outro jogador começou. Essa ponta começa cheia de peças dele, e a sua está cheia de peças suas. Para o vermelho, é a ponta de cima na imagem acima.</p>
      <p>Você só pode cair em uma casa livre, então cada um de vocês precisa sair da própria ponta antes que o outro possa preenchê-la. Nenhum dos dois consegue terminar enquanto uma peça do outro continuar no objetivo. E como vocês atravessam o mesmo meio em direções opostas, as peças do outro jogador são degraus para você, e as suas para ele. Leia as <a href="/pt/guias/damas-chinesas-estrategia">dicas de estratégia</a> para saber o que fazer com isso.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Vencer e desistir</h2>
      <ul>
        <li><strong>Vencer:</strong> quem primeiro preencher o objetivo com todas as 10 peças vence, e a partida termina na hora. O outro jogador não continua.</li>
        <li><strong>Desistir:</strong> suas peças saem do tabuleiro e o outro jogador vence.</li>
        <li><strong>Tempo (online):</strong> em uma partida online, cada jogada tem um limite de tempo. Quando o seu tempo acaba, a sua vez é pulada. Se você perder 3 vezes seguidas, você desiste.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Como 3, 4 e 6 jogadores diferem</h2>
      <ul>
        <li><strong>3 jogadores:</strong> as peças começam em uma ponta sim, outra não, e os três objetivos começam vazios. Quem terminar primeiro vence; os outros continuam jogando pelos próximos lugares, e um jogador que já terminou é pulado.</li>
        <li><strong>4 jogadores:</strong> dois pares de pontas vizinhas. O seu objetivo começa cheio de peças de outro jogador. A partida continua depois do primeiro a terminar, como com 3.</li>
        <li><strong>6 jogadores:</strong> todas as seis pontas. O tabuleiro tem 60 peças, contra 20 com 2 jogadores.</li>
      </ul>
      <p>Com apenas 20 peças no tabuleiro há menos peças para pular, então as escadas que você mesmo monta importam mais. A <a href="/pt/regras/damas-chinesas">página de regras</a> tem imagens de cada começo.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Onde jogar com 2 jogadores no Leapstone</h2>
      <ul>
        <li><strong>Contra o computador, agora mesmo:</strong> abra o <a href="/play/">Leapstone no navegador</a>, toque em Computador e escolha o tabuleiro em estrela. Um computador é o padrão, então essa é uma partida para 2. Você escolhe Fácil, Normal ou Difícil, e você é o jogador 1, então joga primeiro. O Fácil escolhe a melhor de três jogadas aleatórias. O Normal escolhe a jogada que mais avança em direção ao objetivo. O Difícil também olha como os adversários podem responder e a sua própria jogada seguinte.</li>
        <li><strong>Jogar online, no app:</strong> uma partida rápida no tabuleiro em estrela para 2 jogadores, contra outro jogador do seu nível, com 30 segundos por jogada. Alguns adversários online podem ser jogadores do computador.</li>
        <li><strong>Com um amigo:</strong> envie um link de convite e defina você mesmo o tempo por jogada. Ou passem um só celular de um para o outro.</li>
      </ul>
      <p><a href="/pt/guias/damas-chinesas-online-com-amigos">Damas chinesas online com amigos</a></p>
      <p><a href="/pt/guias/damas-chinesas-para-3-jogadores">Damas chinesas para 3 jogadores</a></p>
    </section>`;

export default {
  nav: "Damas chinesas para 2 jogadores",
  titel: "Damas chinesas para 2 jogadores: início e regras | Leapstone",
  beschrijving: "Como funcionam as damas chinesas com 2 jogadores: onde as 10 peças começam, quem joga primeiro, como vencer ou desistir, e onde jogar de graça.",
  h1: "Damas chinesas para 2 jogadores",
  intro: "Como funciona uma partida de dois no tabuleiro em estrela: o início, quem joga primeiro, como vencer e onde jogar.",
  inhoud,
};
