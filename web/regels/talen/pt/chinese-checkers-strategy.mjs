// O guia de estratégia das damas chinesas (taak 134), em português do Brasil. Conteúdo: ../en/chinese-checkers-strategy.mjs, frase por frase.
// Cada dica foi conferida com crates/halma-core (ver docs/plan.md, taak 122). Nada de "especialistas", números ou história inventados.
// O único número é 16 (passos de ponta a ponta), que o exemplo conta.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">No que estas dicas se baseiam</h2>
      <p>As dicas vêm das <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a> como o Leapstone as joga: uma jogada é um passo ou uma sequência de pulos, e você pode pular sobre uma peça de qualquer cor. Elas não são uma prova de jogo perfeito. Jogar contra o computador é a forma mais rápida de testá-las.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Monte escadas</h2>
      <p>Uma escada é uma linha de peças com uma casa livre entre cada uma delas. Uma peça em uma ponta pula sobre a linha inteira em uma só jogada, então atravessa o tabuleiro em uma vez só, em vez de uma casa por vez.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Quatro peças em uma linha diagonal com uma casa livre entre cada uma. Uma peça vermelha em uma ponta pula sobre as quatro, com quatro casas de chegada numeradas.",
  tekst: "Quatro pulos em uma jogada. A mesma peça só poderia dar um passo de uma casa por vez.",
})}
      <p>Um pulo funciona nas seis direções, também para trás, então uma escada não precisa começar na sua própria ponta. Qualquer linha de peças com espaços entre elas serve.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Mantenha suas peças juntas</h2>
      <p>Você precisa de todas as 10 peças no seu objetivo, então a sua última peça decide quando você termina. Uma peça sem nenhuma peça ao lado não tem nada para pular, e só pode dar passos.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Um tabuleiro em estrela com uma peça vermelha sozinha na ponta de baixo. Só as suas duas vizinhas livres estão marcadas. Outras peças vermelhas e azuis estão no meio.",
  tekst: "Esta peça não tem vizinha, então só pode dar um passo para as duas casas marcadas.",
})}
      <p>Da extremidade da sua própria ponta até a extremidade do objetivo, do outro lado do tabuleiro, são 16 passos. São 16 jogadas para uma peça sozinha, enquanto uma escada atravessa em uma só. Mova as peças de trás enquanto ainda há peças em volta para pular. O computador do Leapstone também faz isso: ele dá uma nota um pouco maior às jogadas das suas peças mais atrasadas.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Use o meio</h2>
      <p>Uma peça no meio do tabuleiro tem seis vizinhas, então pode dar um passo ou pular nas seis direções. Uma peça na borda tem menos. A peça na borda da imagem tem quatro.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Um tabuleiro em estrela com uma peça vermelha no meio com seis vizinhas marcadas, e uma peça vermelha perto da borda superior esquerda com quatro vizinhas marcadas.",
  tekst: "Seis jeitos de dar um passo no meio, quatro na borda.",
})}
      <p>As peças no meio também dão às outras peças algo para pular na travessia.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Preencha o objetivo de trás para a frente</h2>
      <p>O seu objetivo é um triângulo de 10 casas, em fileiras de 4, 3, 2 e 1. As casas do fundo só podem ser alcançadas passando pelas casas da frente. Se você preencher primeiro a frente, a última peça pode ficar sem caminho para entrar.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "A ponta do objetivo no alto com nove peças vermelhas e uma casa livre bem no fundo, marcada com tracejado. Uma décima peça vermelha, com um anel branco, está abaixo da fileira da frente.",
  tekst: "Nove peças estão em casa, e a casa do fundo está livre. A décima peça não tem jogada para entrar nela.",
})}
      <p>Coloque as primeiras peças nas casas do fundo e avance em direção à frente, para que a frente fique livre para as peças que chegam por último.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Não deixe uma peça presa no seu objetivo</h2>
      <p>Você pode parar na ponta de outro jogador, então uma peça de outro jogador pode ir parar no seu objetivo. Você só vence quando as 10 casas do seu objetivo têm peças suas. Se essa peça não tem jogada, ninguém pode movê-la, e você não pode vencer até que uma casa ao lado dela se abra.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "A ponta do objetivo no alto com nove peças vermelhas e uma peça azul bem no fundo, marcada com um anel branco. A peça azul está cercada por peças vermelhas.",
  tekst: "A peça azul no fundo não tem jogada, e o vermelho não consegue preencher o objetivo.",
})}
      <p>Deixe uma casa ao lado dessa peça livre, para que ela possa sair. O computador do Leapstone leva isso em conta: uma jogada que prende uma peça de outro jogador no objetivo dele recebe uma nota menor. As regras não obrigam ninguém a sair do seu objetivo, então o outro jogador também pode deixar uma peça ali de propósito.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bloqueie um pulo, ou deixe-o</h2>
      <p>Um pulo precisa de uma casa livre para cair. Preencha essa casa e o pulo some. Duas peças seguidas também não podem ser puladas.</p>
      <p>As suas peças são degraus também para o outro jogador. Na imagem da esquerda, o azul atravessa duas peças vermelhas em uma jogada. Na da direita, o vermelho moveu uma peça para a primeira casa de chegada, e o azul só pode dar um passo.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Uma peça azul com duas peças vermelhas em linha, cada uma com uma casa livre atrás. Setas mostram dois pulos da peça azul.",
          tekst: "Antes: o azul pode dar dois pulos.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "A mesma linha depois de o vermelho mover a sua peça mais distante para a primeira casa de chegada. A peça azul é seguida por duas peças vermelhas seguidas.",
          tekst: "Depois: o vermelho moveu uma peça. O azul não tem pulo.",
        })}
      </div>
      <p>Uma jogada gasta bloqueando é uma jogada que não vai para o seu próprio avanço, então bloqueie quando o pulo der ao outro jogador mais do que a sua jogada daria a você. Funciona ao contrário quando você monta uma escada: depois da sua jogada, o outro jogador joga primeiro, então uma peça dele em uma ponta usa a sua escada antes de você. No nível mais difícil, o computador olha a melhor resposta de cada adversário antes de escolher uma jogada.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Continue</h2>
      <ul>
        <li><a href="/play/">Jogue contra o computador no navegador</a> e experimente uma escada.</li>
        <li><a href="/pt/guias/damas-chinesas-para-2-jogadores">Damas chinesas para 2 jogadores</a>: como funciona uma partida de dois.</li>
        <li><a href="/pt/regras/damas-chinesas">Regras das damas chinesas</a>, com imagens de passos, pulos e sequências.</li>
      </ul>
      <p><a href="/pt/guias/damas-chinesas-online-com-amigos">Damas chinesas online com amigos</a></p>
      <p><a href="/pt/guias/halma-ou-damas-chinesas">Halma ou damas chinesas</a></p>
      <p><a href="/pt/guias/damas-chinesas-para-3-jogadores">Damas chinesas para 3 jogadores</a></p>
    </section>`;

export default {
  nav: "Estratégia nas damas chinesas",
  titel: "Estratégia nas damas chinesas: 6 dicas | Leapstone",
  beschrijving: "Estratégia nas damas chinesas: monte escadas, mantenha as peças juntas, use o meio, preencha o objetivo de trás para a frente e saiba quando bloquear.",
  h1: "Estratégia nas damas chinesas",
  intro: "Seis dicas para o tabuleiro em estrela, cada uma com uma imagem das regras reais: escadas, peças atrasadas, o meio, preencher o objetivo e bloquear pulos.",
  inhoud,
};
