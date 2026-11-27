// 简体中文页面「Sternhalma」, taak 134. Inhoud: ../en/sternhalma.mjs zin voor zin. De bronnen voor de geschiedenis staan in de Engelse
// versie. Wie een feit wijzigt, wijzigt elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">这个名字的意思</h2>
      <p>Sternhalma 是在星形棋盘上玩的 Halma 的德语名称。<em>Stern</em> 在德语中是“星”的意思。跳棋（Chinese checkers）这个名字，是同一个游戏后来在美国得到的名称。</p>
      <p>在 Leapstone 中，这就是<strong>星形棋盘</strong>：<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>用的棋盘。</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">它的来历</h2>
      <ul>
        <li><strong>Halma</strong> 由美国外科医生乔治·霍华德·蒙克斯（George Howard Monks）于 1883 年或 1884 年发明。这个名字在希腊语中是“跳”的意思。它在方形棋盘上进行。<a href="/zh-hans/rules/halma">阅读 Halma 规则</a>。</li>
        <li><strong>Stern-Halma</strong> 于 1892 年出现在德国：同样的玩法，用一块六角星形的棋盘。</li>
        <li><strong>Chinese checkers</strong> 是比尔和杰克·普雷斯曼（Bill and Jack Pressman）1928 年在美国给这个游戏起的名字，起初叫“Hop Ching checkers”。这个游戏与中国没有历史渊源，也不是一种西洋跳棋（checkers）。</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">这些游戏有什么不同</h2>
      <ul>
        <li><strong>Halma：</strong>16 乘 16 个位置的方形棋盘，2 人或 4 人玩。每颗棋子有八个相邻位置，正向和斜向都有。2 人对局时每人 19 颗棋子，4 人对局时每人 13 颗。</li>
        <li><strong>Sternhalma 和跳棋：</strong>121 个位置的星形棋盘，2、3、4 或 6 人玩。每颗棋子有六个相邻位置。每人 10 颗棋子。</li>
        <li><strong>其余都一样：</strong>走一步到空着的相邻位置，或跳过一颗棋子，还可以连跳。先填满棋盘对面营地的玩家获胜。</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">玩法变体，以及 Leapstone 怎么做</h2>
      <p>Halma 有不止一种玩法。下面是 Leapstone 与我们在资料中找到的各种变体的对比：</p>
      <ul>
        <li><strong>棋盘大小。</strong>Halma 也可以在 8 乘 8 和 10 乘 10 的棋盘上玩。Leapstone 只有 16 乘 16 的棋盘。</li>
        <li><strong>离开目标。</strong>按照某一种 Halma 规则，进入对手营地的棋子不能再离开。Leapstone 没有这条规则：这样的棋子还可以再走。</li>
        <li><strong>星形棋盘上的三人对局。</strong>有一种古老的三人 Halma 在星形棋盘上进行，据说每人 15 颗棋子。Leapstone 在星形棋盘上玩 3 人对局，每人 10 颗棋子。</li>
        <li><strong>跳不跳由你选。</strong>你从不必跳。你自己选这一步棋在哪里结束。</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">在 Leapstone 中玩</h2>
      <p>点击“立即开玩”，会在星形棋盘上打开一局与电脑的对战。要玩方形棋盘，请点击顶部的返回箭头，在菜单中选择方形棋盘。</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "星形棋盘，下方的角上有 10 颗红色棋子，上方的角上有 10 颗蓝色棋子",
  tekst: "2 人玩的星形棋盘。",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "什么是 Sternhalma？星形棋盘上的 Halma | Leapstone",
  beschrijving: "Sternhalma 是在星形棋盘上玩的 Halma 的德语名称。它与 Halma 和跳棋有什么关系，有哪些不同，以及如何在浏览器中免费玩。",
  h1: "Sternhalma、Halma 和跳棋",
  intro: "三个名字，指的是关系密切的游戏。各自是什么意思，从哪里来，有什么不同。",
  inhoud,
};
