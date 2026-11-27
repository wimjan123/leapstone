// O guia Halma ou damas chinesas em português (taak 300). Conteúdo: o guia inglês ../en/halma-vs-chinese-checkers.mjs, frase por frase.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Damas chinesas: o tabuleiro em estrela, 121 casas",
    alt: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo e 10 peças azuis na ponta de cima",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: o tabuleiro quadrado, 256 casas",
    alt: "O tabuleiro quadrado com 19 peças vermelhas no canto superior esquerdo e 19 peças azuis no canto inferior direito",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Tabuleiro em estrela: seis vizinhas, três delas livres aqui",
    alt: "Uma peça vermelha com um anel branco em volta. Três das suas seis vizinhas estão livres e marcadas; as outras três têm peças.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Tabuleiro quadrado: oito vizinhas, cinco delas livres aqui",
    alt: "Uma peça vermelha com um anel branco em volta. Cinco das suas oito vizinhas estão livres e marcadas; as outras três têm peças.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">A resposta curta</h2>
      <p>O Halma é jogado em um tabuleiro quadrado e as damas chinesas em um tabuleiro em forma de estrela de seis pontas. Nos dois jogos você move as suas peças com passos e pulos pelo tabuleiro, e vence o primeiro jogador que preencher o campo do lado oposto.</p>
      <p>O que muda é o tabuleiro, as direções em que você se move, quantas pessoas podem jogar e quantas peças cada uma tem. O <a href="/pt/regras/sternhalma">Sternhalma</a> é o nome do Halma em um tabuleiro em estrela, então é o mesmo jogo que as damas chinesas.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Os tabuleiros</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>As damas chinesas</strong> usam o tabuleiro em estrela: 121 casas, com uma ponta de 10 casas em cada uma das seis extremidades. Uma ponta é um triângulo de fileiras de 4, 3, 2 e 1 casas.</li>
        <li><strong>O Halma</strong> usa o tabuleiro quadrado: 16 por 16 casas, 256 no total. Um campo fica em um canto. Um campo grande tem fileiras de 5, 5, 4, 3 e 2 casas, e um campo pequeno fileiras de 4, 4, 3 e 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Direções: seis ou oito</h2>
      <p>No tabuleiro em estrela uma casa tem seis vizinhas. No quadrado ela tem oito, porque as diagonais também contam. Um passo vai para uma vizinha livre. Um pulo passa por cima de uma peça ao lado da sua, em linha reta, até a casa livre logo atrás, em qualquer uma dessas direções e também para trás.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Uma casa na borda tem menos vizinhas, e um canto do tabuleiro quadrado tem três. Seis direções formam três linhas que passam por uma casa do tabuleiro em estrela. Oito direções formam quatro linhas no tabuleiro quadrado: de um lado ao outro, de cima a baixo e duas diagonais.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Jogadores e peças</h2>
      <ul>
        <li><strong>Damas chinesas:</strong> 2, 3, 4 ou 6 jogadores. Cada um tem 10 peças, então o tabuleiro tem 20, 30, 40 ou 60 peças.</li>
        <li><strong>Halma:</strong> 2 ou 4 jogadores. Com 2 jogadores cada um tem 19 peças, 38 no total. Com 4 jogadores cada um tem 13 peças, 52 no total.</li>
      </ul>
      <p>O tabuleiro quadrado não tem partida para 3 ou 6 jogadores no Leapstone. Para uma partida a três, leia <a href="/pt/guias/damas-chinesas-para-3-jogadores">Damas chinesas para 3 jogadores</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">O que é igual</h2>
      <ul>
        <li><strong>Uma jogada:</strong> um passo, ou uma sequência de pulos com uma peça. Você decide onde a sequência termina, e não pode dar um passo depois de um pulo.</li>
        <li><strong>Qualquer cor:</strong> você pula por cima de uma peça de qualquer cor, também da sua. A peça por cima da qual você pula fica onde está. Nada é capturado.</li>
        <li><strong>O objetivo:</strong> o campo em frente àquele de onde você começou. Todas as suas casas precisam ter peças suas. Enquanto houver uma peça de outro jogador ali, você não pode terminar.</li>
        <li><strong>Vencer:</strong> vence o primeiro jogador que preencher o objetivo. Com 2 jogadores a partida termina então. Com mais jogadores os outros continuam jogando pelos próximos lugares, e um jogador que já terminou é pulado.</li>
        <li><strong>Desistir e tempo:</strong> quando você desiste, suas peças saem do tabuleiro. Em uma partida online, cada jogada tem um limite de tempo, e se você perder 3 vezes seguidas, você desiste.</li>
      </ul>
      <p>Leia as regras completas das <a href="/pt/regras/damas-chinesas">damas chinesas</a> e do <a href="/pt/regras/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Qual tabuleiro escolher no Leapstone</h2>
      <ul>
        <li><strong>3 ou 6 jogadores:</strong> só o tabuleiro em estrela tem essas partidas.</li>
        <li><strong>Mais peças para cada um:</strong> o tabuleiro quadrado, com 19 peças cada para 2 jogadores ou 13 para 4, contra 10 no tabuleiro em estrela.</li>
        <li><strong>Jogar online:</strong> uma partida rápida é jogada no tabuleiro em estrela. Com amigos e contra o computador, você pode escolher qualquer um dos dois tabuleiros.</li>
      </ul>
      <p>O botão Jogar agora abre uma partida contra o computador no tabuleiro em estrela. Para jogar no tabuleiro quadrado, toque na seta de voltar no alto e escolha Tabuleiro quadrado no menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continue</h2>
      <ul>
        <li><a href="/play/">Jogue no navegador</a> e experimente os dois tabuleiros.</li>
        <li><a href="/pt/guias/damas-chinesas-estrategia">Estratégia nas damas chinesas</a>: seis dicas com desenhos.</li>
        <li><a href="/pt/guias/damas-chinesas-para-2-jogadores">Damas chinesas para 2 jogadores</a>: como funciona uma partida para dois.</li>
      </ul>
      <p><a href="/pt/guias/damas-chinesas-online-com-amigos">Damas chinesas online com amigos</a></p>
    </section>`;

export default {
  nav: "Halma ou damas chinesas",
  titel: "Halma ou damas chinesas: as diferenças | Leapstone",
  beschrijving: "Halma ou damas chinesas? O tabuleiro quadrado e o tabuleiro em estrela, seis ou oito direções, jogadores e peças, e o que é igual.",
  h1: "Halma ou damas chinesas",
  intro: "Dois jogos com uma mesma ideia: levar todas as suas peças para o outro lado do tabuleiro. O que muda, o que é igual e onde jogar os dois.",
  inhoud,
};
