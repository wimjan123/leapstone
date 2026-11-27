// 简体中文规则页「Halma」, taak 134. Inhoud: ../en/halma.mjs zin voor zin (gecontroleerd tegen crates/halma-core, zie docs/plan.md, taak 117).
// Wie een regel wijzigt, wijzigt elke taal.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 人：每人 19 颗棋子",
    alt: "方形棋盘，左上角有 19 颗红色棋子，右下角有 19 颗蓝色棋子",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 人：每人 13 颗棋子",
    alt: "方形棋盘，四个角上各有 13 颗棋子：左上红色，右上蓝色，右下绿色，左下黄色",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">棋盘</h2>
      <p>Halma 在 16 乘 16 个位置的方形棋盘上进行，一共 256 个位置。每个位置最多有八个相邻位置：四个正向的和四个斜向的。边上的位置相邻的更少，角上的位置有三个。</p>
      <p>这就是 Leapstone 中的方形棋盘。如果你玩过星形棋盘的玩法，请阅读 <a href="/zh-hans/rules/sternhalma">Sternhalma</a> 和<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">棋子的起始摆法</h2>
      <p>Halma 适合 2 人或 4 人。每位玩家开局时把棋子摆在棋盘一个角上的营地里。对角的营地就是你的目标。</p>
      <ul>
        <li><strong>2 人：</strong>每人 19 颗棋子，在互相正对的两个角上。营地是五排，各有 5、5、4、3、2 个位置。</li>
        <li><strong>4 人：</strong>每人 13 颗棋子，每个角上一个营地。营地是四排，各有 4、4、3、2 个位置。你的目标是棋盘对面斜对角的那个角。</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">轮流走棋</h2>
      <p>玩家 1 先走。之后按顺序轮流，最后一位玩家之后又回到玩家 1。在 Leapstone 中，颜色对应编号：红、蓝、绿和黄。</p>
      <p>轮到你时，走一颗棋子，只走一次。没有吃子：棋子留在棋盘上，直到它的玩家认输。</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">走一步</h2>
      <p>把一颗棋子移到它旁边的空位上，八个方向都可以：正向或斜向。</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "一颗红色棋子，周围有一圈白色的环。它的八个相邻位置中，五个是空的并有标记，另外三个有棋子。",
  tekst: "红色棋子可以走到五个有标记的位置。另外三个相邻位置已被占用。",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">跳</h2>
      <p>跳过紧挨着你的一颗棋子（任何颜色都可以），落在它正后方的空位上，沿直线跳。八个方向都可以跳，斜着跳、向后跳也可以。</p>
      <ul>
        <li>落点必须是空位。</li>
        <li>不能连续跳过两颗棋子，也不能跳过空位。</li>
        <li>被跳过的棋子留在原处。</li>
        <li>不能跳出棋盘边缘。</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "一颗红色棋子斜着跳过一颗蓝色棋子，落在它后面的空位上，用箭头表示。",
  tekst: "红色棋子斜着跳过蓝色棋子。",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">连跳</h2>
      <p>跳过之后，同一颗棋子可以再跳，能跳多少次就跳多少次，方向不限，正向或斜向都可以。在哪里停下由你决定。所有的跳合在一起算一步棋。</p>
      <ul>
        <li>在一步棋中，不能两次落在同一个位置。</li>
        <li>一步棋是走一步，或者跳一次或多次。跳了之后不能再走一步。</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "一颗红色棋子在一步棋中跳了三次：斜着跳过一颗蓝色棋子，直着跳过另一颗蓝色棋子，再斜着跳过一颗红色棋子。三个落点依次标有 1、2、3。",
  tekst: "一步棋连跳三次，按编号的顺序。",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">目标</h2>
      <p>把你的所有棋子移入与你的起点正对面的营地，就赢了。那个营地的每个位置都必须放着你自己的棋子：2 人对局时是 19 颗，4 人对局时是 13 颗。只要有其他玩家的棋子留在那里，你就无法完成。</p>
      <p>你可以落在任何空位上，包括其他玩家的营地。已经在你目标里的棋子可以再离开；没有什么会把它锁住。</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "两人玩的方形棋盘。红色从左上角出发；右下角的营地用虚线圆圈标出，里面放着蓝色棋子，是红色的目标。",
  tekst: "2 人对局时，红色的目标是蓝色出发的营地。",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2 人或 4 人对局</h2>
      <ul>
        <li><strong>2 人：</strong>先填满目标的玩家获胜，对局结束。</li>
        <li><strong>4 人：</strong>先填满目标的玩家获胜。其他玩家继续争夺后面的名次，已经完成的玩家会被跳过。只剩一位玩家还在玩时，对局结束。</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">认输</h2>
      <p>认输时，你的棋子会离开棋盘，所以不会挡住任何人。2 人对局时，另一位玩家获胜。4 人对局时，对局在没有你的情况下继续，如果除一位玩家外所有人都认输，最后那位玩家获胜。</p>
      <p>在线对局中，每一步都有时间限制。限时由发起对局的玩家设定。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了。与电脑对战和在同一部手机上对局没有时间限制。</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">小技巧</h2>
      <ul class="tips">
        <li><strong>搭梯子。</strong>把棋子排成一条线，棋子之间各留一个空位，正向或斜向都可以，朝向你的目标。这样一颗棋子一步棋就能沿着整条线跳过去。</li>
        <li><strong>任何棋子都是梯子。</strong>每种颜色的棋子你都可以跳过，所以其他玩家的棋子也在帮你。而你自己的梯子也在帮他们：看看你留下了什么。</li>
        <li><strong>利用斜线。</strong>目标在对角的角上，所以斜着排的一列棋子是最快的过河路线。</li>
        <li><strong>别忘了掉队的棋子。</strong>你需要所有棋子都回家。远远落在后面、没有东西可跳的棋子，每回合只能走一个位置。趁其他棋子还在它周围时，把它带上。</li>
        <li><strong>你的起点是他们的目标。</strong>2 人对局时，你的营地是另一位玩家的目标，只要你还有一颗棋子在那里，他们就无法完成。Leapstone 允许你把一颗棋子留在家里，所以你可以这样挡住对方。你也一样。</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">常见问题</h2>
      <h3>Halma 可以几个人玩？</h3>
      <p>两人或四人。Halma 在 16 乘 16 个位置的方形棋盘上进行，每位玩家从一个角开始。</p>
      <h3>Halma 每位玩家有多少颗棋子？</h3>
      <p>2 人时每人 19 颗，4 人时每人 13 颗。</p>
      <h3>Halma 是谁发明的？</h3>
      <p>乔治·霍华德·蒙克斯（George Howard Monks），一位美国外科医生，在 1883 年或 1884 年发明。Halma 这个名字在希腊语中是“跳跃”的意思。了解更多：<a href="/zh-hans/rules/sternhalma">Sternhalma</a>。</p>
      <h3>Halma 和跳棋有什么区别？</h3>
      <p>Halma 使用方形棋盘，朝八个方向走和跳，每人 19 或 13 颗棋子。跳棋使用星形棋盘，有六个方向，每人 10 颗棋子，适合 2、3、4 或 6 人。</p>
      <h3>可以在线免费玩 Halma 吗？</h3>
      <p>可以，在 Leapstone 中，可以在浏览器里玩，也可以用 App Store 里的应用。选择一种玩法，例如与电脑对战或与好友在线对战，然后选方形棋盘。Leapstone 免费，没有广告。</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">来玩一局</h2>
      <p>点击“立即开玩”按钮，会在<a href="/zh-hans/rules/chinese-checkers">星形棋盘</a>上打开一局与电脑的对战。要玩 Halma，请点击顶部的返回箭头，然后选择“在这部手机上玩”“与电脑对战”或“与好友在线对战”，再点击方形棋盘。</p>
    </section>`;

export default {
  nav: "Halma 规则",
  titel: "Halma 规则和技巧 | Leapstone",
  beschrijving: "如何在 16 乘 16 的方形棋盘上玩 Halma：2 人或 4 人时棋子的起始摆法，八个方向的走和跳，连跳，怎样获胜，以及小技巧。可在浏览器中免费玩。",
  h1: "Halma 规则",
  intro: "抢在别人之前，把你的所有棋子移过方形棋盘，到达对面的角。规则简要说明，配有图片，还有一些小技巧。",
  inhoud,
};
