// 简体中文规则页「跳棋（中国跳棋）」, taak 134. Inhoud: ../en/chinese-checkers.mjs zin voor zin (gecontroleerd tegen crates/halma-core,
// zie docs/plan.md, taak 116). Wie een regel wijzigt, wijzigt elke taal. Dezelfde taalloze plaatjes; alt-teksten en bijschriften zijn Chinees.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} 人`,
      alt:
        {
          2: "星形棋盘，下方的角上有 10 颗红色棋子，上方的角上有 10 颗蓝色棋子",
          3: "星形棋盘，红色棋子在下方，蓝色棋子在左上方，绿色棋子在右上方",
          4: "星形棋盘，四个角上有棋子：红色在下方，绿色在上方，蓝色在左下方，黄色在右上方",
          6: "星形棋盘，六个角上都有棋子，共六种颜色",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">棋盘</h2>
      <p>跳棋（中国跳棋）在一个有六个角的星形棋盘上进行。棋盘上有 121 个位置，每个角有 10 个。在棋盘内部，每个位置都有六个相邻位置。</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">棋子的起始摆法</h2>
      <p>每位玩家有 10 颗棋子，开局时全部摆在星形的一个角上。与你的角正对面的角，就是你的目标。</p>
      <ul>
        <li><strong>2 人：</strong>正对面的两个角。</li>
        <li><strong>3 人：</strong>隔一个角用一个。三个目标开局时是空的。</li>
        <li><strong>4 人：</strong>两对相邻的角。每位玩家的对面都有另一位玩家。</li>
        <li><strong>6 人：</strong>全部六个角。</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">轮流走棋</h2>
      <p>玩家 1 先走。之后按顺序轮流，玩家 2、玩家 3，依此类推，最后一位玩家之后又回到玩家 1。在 Leapstone 中，颜色对应编号：红、蓝、绿、黄、紫和银。</p>
      <p>轮到你时，走一颗棋子，只走一次。没有吃子：棋子留在棋盘上，直到它的玩家认输。</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">走一步</h2>
      <p>把一颗棋子移到它旁边的空位上。</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "一颗红色棋子，周围有一圈白色的环。它的六个相邻位置中，三个是空的并有标记，另外三个有棋子。",
  tekst: "红色棋子可以走到三个有标记的位置。另外三个相邻位置已被占用。",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">跳</h2>
      <p>跳过紧挨着你的一颗棋子（任何颜色都可以），落在它正后方的空位上，沿直线跳。六个方向都可以跳，向后跳也可以。</p>
      <ul>
        <li>落点必须是空位。</li>
        <li>不能连续跳过两颗棋子，也不能跳过空位。</li>
        <li>被跳过的棋子留在原处。</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "一颗红色棋子跳过一颗蓝色棋子，落在它后面的空位上，用箭头表示。",
  tekst: "红色棋子跳过蓝色棋子。",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">连跳</h2>
      <p>跳过之后，同一颗棋子可以再跳，能跳多少次就跳多少次，方向不限。在哪里停下由你决定。所有的跳合在一起算一步棋。</p>
      <ul>
        <li>在一步棋中，不能两次落在同一个位置。</li>
        <li>一步棋是走一步，或者跳一次或多次。跳了之后不能再走一步。</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "一颗红色棋子在一步棋中跳了三次，依次跳过一颗蓝色、一颗绿色和另一颗蓝色棋子。三个落点依次标有 1、2、3。",
  tekst: "一步棋连跳三次，按编号的顺序。",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">目标</h2>
      <p>把你的 10 颗棋子全部移入与你的起点正对面的那个角，就赢了。那个角的 10 个位置都必须放着你自己的棋子。只要有其他玩家的棋子留在那里，你就无法完成。</p>
      <p>你可以落在任何空位上，包括其他玩家的角。</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "三人玩的星形棋盘。红色从下方出发；上方用虚线圆圈标出的空角是红色的目标。",
  tekst: "3 人对局时，红色从下方出发。红色的目标是上方的空角。",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2、3、4 或 6 人对局</h2>
      <ul>
        <li><strong>2 人：</strong>先填满目标的玩家获胜，对局结束。</li>
        <li><strong>3、4 或 6 人：</strong>先填满目标的玩家获胜。其他玩家继续争夺后面的名次，已经完成的玩家会被跳过。只剩一位玩家还在玩时，对局结束。</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">认输</h2>
      <p>认输时，你的棋子会离开棋盘，所以不会挡住任何人。2 人对局时，另一位玩家获胜。人数更多时，对局在没有你的情况下继续，如果除一位玩家外所有人都认输，最后那位玩家获胜。</p>
      <p>在线对局中，每一步都有时间限制。限时由发起对局的玩家设定，快速对局固定为 30 秒。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了。与电脑对战和在同一部手机上对局没有时间限制。</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">小技巧</h2>
      <ul class="tips">
        <li><strong>搭梯子。</strong>把棋子排成一条线，棋子之间各留一个空位，朝向你的目标。这样一颗棋子一步棋就能沿着整条线跳过去。
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "四颗棋子排成一条斜线，每两颗之间有一个空位。一端的红色棋子跳过全部四颗，有四个编了号的落点。",
  tekst: "四颗棋子排成一线：上方的红色棋子一步棋连跳四次，就越过了棋盘。",
})}
        </li>
        <li><strong>任何棋子都是梯子。</strong>每种颜色的棋子你都可以跳过，所以其他玩家的棋子也在帮你。而你自己的梯子也在帮他们：看看你留下了什么。</li>
        <li><strong>别忘了掉队的棋子。</strong>你需要 10 颗棋子全部回家。远远落在后面、没有东西可跳的棋子，每回合只能走一个位置。趁其他棋子还在它周围时，把它带上。</li>
        <li><strong>你的起点是他们的目标。</strong>2、4 或 6 人对局时，你的起点角是你对面玩家的目标，只要你还有一颗棋子在那里，他们就无法完成。你也一样。</li>
      </ul>
      <p>更多配图的技巧见<a href="/zh-hans/guides/chinese-checkers-strategy">跳棋策略</a>指南。两人对局请读<a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>。</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">常见问题</h2>
      <h3>跳棋可以几个人玩？</h3>
      <p>两人、三人、四人或六人。每位玩家从星形的一个角开始。2、3 或 4 人时，有些角是空的。</p>
      <h3>每位玩家有多少颗弹珠？</h3>
      <p>每位玩家有 10 颗弹珠，也就是棋子。棋盘有 121 个位置：六个角各 10 个，中间 61 个。</p>
      <h3>可以跳过自己的棋子，或者向后跳吗？</h3>
      <p>可以。你可以跳过任何颜色的棋子，包括自己的，朝六个方向中的任何一个，也可以向后。被跳过的棋子留在原处。</p>
      <h3>跳棋可以吃子吗？</h3>
      <p>不可以。没有棋子会被吃掉。只有玩家认输时，他的棋子才会离开棋盘。</p>
      <h3>中国跳棋是来自中国吗？</h3>
      <p>不是。这个游戏于 1892 年出现在德国，名为 Stern-Halma，源自更早的 Halma。“Chinese checkers”（中国跳棋）这个名字来自美国，出现在 1928 年。了解更多：<a href="/zh-hans/rules/sternhalma">Sternhalma</a>。</p>
      <h3>在哪里可以免费和朋友在线玩跳棋？</h3>
      <p>在 Leapstone 中，可以在浏览器里玩，也可以用 App Store 里的应用。给朋友发一个邀请链接：他们无需账号、电子邮件地址或密码就能加入你的对局。你也可以与电脑对战，或快速对局另一位玩家。Leapstone 免费，没有广告。</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">在 Leapstone 中玩跳棋</h2>
      <p>Leapstone 是一款免费应用，可在 红漆金饰的 3D 棋盘上玩跳棋（中国跳棋）和 Halma。你可以在应用和浏览器中玩。</p>
      <ul>
        <li><strong>与电脑对战。</strong>简单、普通或困难。不需要网络。</li>
        <li><strong>与好友一起玩。</strong>发送邀请链接。每一步的时间由你设定，还可以聊天。</li>
        <li><strong>在线对战。</strong>与水平相近的另一位玩家快速对局，每步 30 秒。部分在线对手可能是电脑玩家。</li>
        <li><strong>一部手机。</strong>围着桌子传递手机。</li>
      </ul>
      <p>Leapstone 免费，没有广告，也不需要用电子邮件地址注册：只需选一个玩家名。<a href="https://apps.apple.com/cn/app/id6831230722">在 App Store 下载 Leapstone</a>，或<a href="/play/">在浏览器中玩</a>。</p>
    </section>`;

export default {
  nav: "跳棋规则",
  titel: "跳棋（中国跳棋）规则和技巧 | Leapstone",
  beschrijving: "跳棋（中国跳棋）怎么玩：棋子的起始摆法，走一步、跳和连跳，2、3、4 或 6 人对局怎样获胜，以及小技巧。可在浏览器中免费玩。",
  h1: "跳棋（中国跳棋）规则",
  intro: "抢在别人之前，把你的 10 颗棋子全部移过星形棋盘，到达对面的角。规则简要说明，配有图片，还有一些小技巧。",
  inhoud,
};
