// A página "O que é o Sternhalma?" (taak 134), em português do Brasil: o nome e a relação com o Halma e as damas chinesas.
// Conteúdo e fontes: a página inglesa ../en/sternhalma.mjs (Wikipedia Halma e Chinese checkers, ver lá). Frase por frase em português.
// Omitido de propósito, como no inglês: quem publicou o Stern-Halma em 1892 (as fontes divergem) e os anos de patentes.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">O que o nome significa</h2>
      <p>Sternhalma é o nome alemão do Halma jogado em um tabuleiro em forma de estrela. <em>Stern</em> é &ldquo;estrela&rdquo; em alemão. O nome damas chinesas é o mesmo jogo sob um nome dado mais tarde nos Estados Unidos.</p>
      <p>No Leapstone este é o <strong>tabuleiro em estrela</strong>: o tabuleiro das <a href="/pt/regras/damas-chinesas">regras das damas chinesas</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">De onde vem</h2>
      <ul>
        <li>O <strong>Halma</strong> foi inventado em 1883 ou 1884 por George Howard Monks, um cirurgião americano. O nome é grego para &ldquo;salto&rdquo;. É jogado em um tabuleiro quadrado. <a href="/pt/regras/halma">Leia as regras do Halma</a>.</li>
        <li>O <strong>Stern-Halma</strong> apareceu na Alemanha em 1892: a mesma ideia em um tabuleiro com a forma de uma estrela de seis pontas.</li>
        <li>As <strong>damas chinesas</strong> são o nome que Bill e Jack Pressman deram ao jogo nos Estados Unidos em 1928, a princípio como &ldquo;Hop Ching checkers&rdquo;. O jogo não tem ligação histórica com a China, e não é um jogo de damas.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Como os jogos diferem</h2>
      <ul>
        <li><strong>Halma:</strong> um tabuleiro quadrado de 16 por 16 casas, para 2 ou 4 jogadores. Uma peça tem oito vizinhas, em linha reta e na diagonal. Com 2 jogadores cada um tem 19 peças, com 4 jogadores 13.</li>
        <li><strong>Sternhalma e damas chinesas:</strong> um tabuleiro em estrela de 121 casas, para 2, 3, 4 ou 6 jogadores. Uma peça tem seis vizinhas. Cada um tem 10 peças.</li>
        <li><strong>O resto é igual:</strong> um passo para uma vizinha livre, ou um pulo sobre uma peça, com sequências de pulos. Vence quem primeiro preencher o campo do outro lado do tabuleiro.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Variantes, e o que o Leapstone faz</h2>
      <p>O Halma foi jogado de mais de uma maneira. Assim o Leapstone se compara com as variantes que encontramos em nossas fontes:</p>
      <ul>
        <li><strong>Tamanho do tabuleiro.</strong> O Halma também é jogado em tabuleiros de 8 por 8 e 10 por 10. O Leapstone tem só o tabuleiro de 16 por 16.</li>
        <li><strong>Sair do objetivo.</strong> Em uma regra do Halma, uma peça que entrou no campo do adversário não pode mais sair dele. O Leapstone não tem essa regra: você pode mover essa peça de novo.</li>
        <li><strong>Três jogadores em uma estrela.</strong> Um antigo Halma para três jogadores em um tabuleiro em estrela é descrito com 15 peças para cada um. O Leapstone joga com 3 jogadores no tabuleiro em estrela com 10 peças cada.</li>
        <li><strong>Os pulos são uma escolha sua.</strong> Você nunca é obrigado a pular. Você escolhe a casa onde a sua jogada termina.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Jogue no Leapstone</h2>
      <p>Jogar agora abre uma partida no tabuleiro em estrela contra o computador. Para o tabuleiro quadrado, toque na seta de voltar no alto e escolha Tabuleiro quadrado no menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "O tabuleiro em estrela com 10 peças vermelhas na ponta de baixo e 10 peças azuis na ponta de cima",
  tekst: "O tabuleiro em estrela para 2 jogadores.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "O que é o Sternhalma? Halma em estrela | Leapstone",
  beschrijving: "Sternhalma é o nome alemão do Halma em um tabuleiro em estrela. Como ele se relaciona com o Halma e as damas chinesas, e como jogar grátis no navegador.",
  h1: "Sternhalma, Halma e damas chinesas",
  intro: "Três nomes para jogos muito parecidos. O que cada um significa, de onde vêm e como diferem.",
  inhoud,
};
