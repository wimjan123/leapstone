// O guia de aberturas das damas chinesas (taak 303, feature 294), em português do Brasil: /pt/guias/damas-chinesas-aberturas.
// Conteúdo: ../en/chinese-checkers-opening-moves.mjs, frase por frase. Cada número e cada jogada foram conferidos com crates/halma-core;
// as imagens vêm de crates/halma-core/examples/regelplaatjes.rs (seção "taak 303"). Mudou uma jogada? Mude as duas versões.
// Uma "fileira" são todas as casas com a mesma distância até a sua própria ponta; um passo avança 1 fileira, um pulo 2.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Sua primeira jogada: 14 opções</h2>
      <p>No começo, as suas 10 peças preenchem um triângulo em fileiras de 4, 3, 2 e 1, e a fileira da frente aponta para o meio do tabuleiro. Não há nenhuma casa livre dentro do triângulo, então uma peça só pode ir para a fileira logo à sua frente. Isso dá 14 primeiras jogadas: cada uma das 4 peças da fileira da frente pode dar um passo para 2 casas (8 passos), e cada uma das 3 peças da segunda fileira pode pular sobre uma peça da frente para 2 casas (6 pulos). As outras 3 peças ainda não podem se mover.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "A ponta vermelha embaixo com suas 10 peças e, na fileira logo à frente dela, 5 casas livres marcadas com um anel.",
  tekst: "Toda primeira jogada termina em uma destas 5 casas.",
})}
      <p>Neste guia, uma fileira é uma linha de casas atravessada na sua ponta, paralela à borda da frente, e contamos o progresso em fileiras. Um passo leva uma peça 1 fileira para a frente e um pulo leva 2 fileiras. Todo jogador tem as mesmas 14 primeiras jogadas, com 2, 3, 4 ou 6 jogadores e de qualquer ponta da estrela, porque vista de dentro toda ponta é igual.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Abertura 1: pule para fora e depois solte a extremidade</h2>
      <p>A peça na extremidade da sua ponta é a mais distante do seu objetivo e não pode se mover no começo: ela só pode pular sobre uma peça se a casa atrás dessa peça estiver livre. Um pulo da segunda fileira cria exatamente essa casa.</p>
      <ol>
        <li><strong>Jogada 1:</strong> a peça no canto direito da sua segunda fileira pula sobre a peça que está à sua frente. Ela cai na fileira à frente da sua ponta e ganha 2 fileiras.</li>
        <li><strong>Jogada 2:</strong> a peça da extremidade pula duas vezes em uma só jogada: primeiro para a casa que a jogada 1 esvaziou, depois sobre uma peça da segunda fileira. Ela ganha 4 fileiras.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "A ponta vermelha depois da jogada 1. A peça da extremidade tem um anel, e 2 setas com os números 1 e 2 mostram seus pulos pela casa esvaziada até a fileira à frente da ponta.",
  tekst: "Depois da jogada 1, a peça da extremidade sai em 2 pulos.",
})}
      <p>São 6 fileiras em 2 jogadas. Testamos todas as formas de jogar 2 jogadas, e 6 é o máximo que você consegue ganhar. Só 4 pares de jogadas chegam lá: a peça de qualquer um dos cantos da segunda fileira pula, em uma de suas 2 direções, e a peça da extremidade vem em seguida. A peça do meio da segunda fileira não serve, porque deixa a extremidade trancada.</p>
      <p>As duas peças agora estão na fileira à frente da sua ponta, com uma casa livre entre elas. Esse é o primeiro degrau de uma escada.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Abertura 2: 4 jogadas com 4 peças diferentes</h2>
      <p>Em 4 jogadas, o máximo que você ganha é 13 fileiras, e só chega lá se cada jogada usar uma peça diferente. Esta sequência consegue:</p>
      <ol>
        <li><strong>Jogada 1:</strong> a peça no canto direito da fileira da frente dá um passo à frente. Ela ganha 1 fileira.</li>
        <li><strong>Jogada 2:</strong> a peça no canto direito da terceira fileira pula duas vezes. Ela ganha 4 fileiras.</li>
        <li><strong>Jogada 3:</strong> a peça no canto esquerdo da segunda fileira pula duas vezes. Ela ganha 4 fileiras.</li>
        <li><strong>Jogada 4:</strong> a peça da extremidade pula duas vezes. Ela ganha 4 fileiras.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "A ponta vermelha no começo. As 4 peças que vão se mover têm um número de 1 a 4, na ordem das jogadas.",
          tekst: "Antes: as peças que se movem, em ordem.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "A ponta vermelha depois de 4 jogadas, com as 4 casas onde as peças numeradas caíram nas fileiras à frente da ponta e 4 buracos deixados na ponta.",
          tekst: "Depois: onde elas caíram.",
        })}
      </div>
      <p>Cada jogada prepara a próxima. As jogadas 2 e 3 terminam com um pulo sobre a peça que acabou de se mover, e a jogada 4 começa pelo buraco que a jogada 3 deixou. As 4 peças caem na sua própria metade do tabuleiro.</p>
      <p>Há outras sequências que chegam a 13. O que elas têm em comum é a ideia: procure a jogada que deixa um buraco ou um apoio para a próxima, e solte a peça da extremidade até a jogada 4, no máximo.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Erros nas primeiras jogadas</h2>
      <ul class="tips">
        <li><strong>Mover a mesma peça a cada turno.</strong> Uma peça que corre sozinha ganha 5 fileiras em 4 jogadas, contra 13 com 4 peças diferentes. Além disso, ela deixa o resto das suas peças onde estavam.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "A ponta vermelha no começo. Uma peça da segunda fileira faz 4 jogadas seguidas ao longo de uma linha, com setas e os números de 1 a 4, e termina sozinha perto do meio do tabuleiro.",
  tekst: "Uma peça, 4 jogadas, 5 fileiras.",
})}
      <ul class="tips">
        <li><strong>Só dar passos com a fileira da frente.</strong> 4 passos ganham 4 fileiras. Depois deles, a peça da extremidade ainda não pode se mover, então fica para trás enquanto o resto avança.</li>
        <li><strong>Andar de lado.</strong> Um passo ao longo de uma fileira ganha 0 fileiras. Depois da jogada 1 da abertura 1, a peça da frente pode dar um passo para a casa ao lado, e parece progresso, mas a jogada é desperdiçada.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continue daqui</h2>
      <p>Depois de umas 4 jogadas, os dois exércitos se aproximam, e as aberturas acima dão lugar ao meio do jogo. Você não precisa decorar as sequências: lembre-se de que cada jogada deve preparar a próxima.</p>
      <ul>
        <li><a href="/play/">Jogue contra o computador no navegador</a> e experimente a abertura 1 ou 2.</li>
        <li><a href="/pt/guias/damas-chinesas-estrategia">Estratégia nas damas chinesas</a>: escadas, manter as peças juntas e preencher o seu objetivo.</li>
        <li><a href="/pt/guias/damas-chinesas-para-2-jogadores">Damas chinesas para 2 jogadores</a>: como funciona uma partida de dois.</li>
        <li><a href="/pt/regras/damas-chinesas">Regras das damas chinesas</a>, com imagens de passos, pulos e sequências.</li>
      </ul>
    </section>`;

export default {
  nav: "Aberturas nas damas chinesas",
  titel: "Aberturas nas damas chinesas: 2 aberturas | Leapstone",
  beschrijving: "Aberturas nas damas chinesas: como pular para fora da ponta, soltar a peça da extremidade na jogada 2 e ganhar 13 fileiras em 4 jogadas, e os erros.",
  h1: "Aberturas nas damas chinesas",
  intro: "Uma boa abertura nas damas chinesas pula para fora da segunda fileira, usa uma peça diferente a cada turno e solta a peça da extremidade da sua ponta até a jogada 2 ou 4. Duas aberturas com imagens e os erros a evitar.",
  inhoud,
};
