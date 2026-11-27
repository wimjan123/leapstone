// De gids Halma tegenover Chinese checkers in het vereenvoudigd Chinees, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "跳棋：星形棋盘，121 个位置",
    alt: "星形棋盘，下方的尖角上有 10 颗红色棋子，上方的尖角上有 10 颗蓝色棋子",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma：方形棋盘，256 个位置",
    alt: "方形棋盘，左上角有 19 颗红色棋子，右下角有 19 颗蓝色棋子",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "星形棋盘：六个相邻位置，这里有三个是空的",
    alt: "一颗红色棋子，周围有一圈白色的环。它的六个相邻位置中，三个是空的并有标记，另外三个有棋子。",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "方形棋盘：八个相邻位置，这里有五个是空的",
    alt: "一颗红色棋子，周围有一圈白色的环。它的八个相邻位置中，五个是空的并有标记，另外三个有棋子。",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">简短的回答</h2>
      <p>Halma 在方形棋盘上进行，跳棋在六个角的星形棋盘上进行。两种游戏都是让棋子一步一步或者跳着穿过棋盘，先把对面的营地填满的玩家获胜。</p>
      <p>不同的是棋盘、走棋的方向、能有多少人一起玩，以及每个人有多少颗棋子。<a href="/zh-hans/rules/sternhalma">Sternhalma</a> 是星形棋盘上的 Halma 的名字，所以它和跳棋是同一种游戏。</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">棋盘</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>跳棋</strong>用星形棋盘：121 个位置，六个尖端各有一个 10 个位置的尖角。尖角是一个三角形，由 4、3、2、1 个位置的几排组成。</li>
        <li><strong>Halma</strong> 用方形棋盘：16 乘 16 个位置，一共 256 个。营地在角上。大营地有 5、5、4、3、2 个位置的几排，小营地有 4、4、3、2 个位置的几排。</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">方向：六个还是八个</h2>
      <p>在星形棋盘上，一个位置有六个相邻位置。在方形棋盘上有八个，因为斜向也算。走一步是走到一个空的相邻位置。跳是沿直线跳过紧挨着你的一颗棋子，落在它正后方的空位上，这些方向都可以，向后也可以。</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>边上的位置相邻的更少，方形棋盘的角上有三个。六个方向使星形棋盘上经过一个位置的线有三条。八个方向使方形棋盘上有四条：横向、竖向和两条斜线。</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">玩家和棋子</h2>
      <ul>
        <li><strong>跳棋：</strong>2、3、4 或 6 人。每人 10 颗棋子，所以棋盘上有 20、30、40 或 60 颗棋子。</li>
        <li><strong>Halma：</strong>2 或 4 人。2 人时每人 19 颗棋子，一共 38 颗。4 人时每人 13 颗棋子，一共 52 颗。</li>
      </ul>
      <p>在 Leapstone 中，方形棋盘没有 3 人或 6 人的玩法。想玩三人局，请阅读<a href="/zh-hans/guides/chinese-checkers-3-players">3 人跳棋</a>。</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">相同之处</h2>
      <ul>
        <li><strong>一步棋：</strong>走一步，或者用一颗棋子连续跳。在哪里停下由你决定，跳了之后不能再走一步。</li>
        <li><strong>任何颜色：</strong>你可以跳过任何颜色的棋子，包括你自己的。被跳过的棋子留在原处。没有吃子。</li>
        <li><strong>目标：</strong>你起点正对面的营地。它的每个位置都必须放着你自己的棋子。只要有其他玩家的棋子在那里，你就无法完成。</li>
        <li><strong>获胜：</strong>先填满目标的玩家获胜。2 人时对局到此结束。人数更多时，其他玩家继续争夺后面的名次，已经完成的玩家会被跳过。</li>
        <li><strong>认输和时间：</strong>认输时，你的棋子会离开棋盘。在线对局中每一步都有时间限制，连续错过 3 个回合，你就认输了。</li>
      </ul>
      <p>阅读<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>和 <a href="/zh-hans/rules/halma">Halma 规则</a>的完整内容。</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">在 Leapstone 中选哪种棋盘</h2>
      <ul>
        <li><strong>3 或 6 人：</strong>只有星形棋盘可以。</li>
        <li><strong>每人更多棋子：</strong>方形棋盘，2 人时每人 19 颗，4 人时每人 13 颗，而星形棋盘是 10 颗。</li>
        <li><strong>在线对战：</strong>快速对局在星形棋盘上进行。与好友玩和与电脑对战时，两种棋盘都可以选。</li>
      </ul>
      <p>点击“立即开玩”按钮，会在星形棋盘上打开一局与电脑的对战。要在方形棋盘上玩，请点击顶部的返回箭头，然后在菜单中选择方形棋盘。</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">继续了解</h2>
      <ul>
        <li><a href="/play/">在浏览器中玩</a>，两种棋盘都试一试。</li>
        <li><a href="/zh-hans/guides/chinese-checkers-strategy">跳棋策略</a>：六个带图片的小技巧。</li>
        <li><a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>：两个人的对局是怎么进行的。</li>
      </ul>
      <p><a href="/zh-hans/guides/play-chinese-checkers-online-with-friends">与好友在线玩跳棋</a></p>
    </section>`;

export default {
  nav: "Halma 和跳棋的区别",
  titel: "Halma 和跳棋的区别 | Leapstone",
  beschrijving: "Halma 还是跳棋？这篇指南比较方形棋盘和星形棋盘、六个或八个方向、玩家人数和每人的棋子数量，也说明两种游戏有什么相同之处。",
  h1: "Halma 和跳棋的区别",
  intro: "两种游戏，同一个想法：把你的所有棋子移过棋盘，到达对面。有什么不同，有什么相同，以及在哪里可以两种都玩。",
  inhoud,
};
