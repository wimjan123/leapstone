// 简体中文指南「2 人跳棋」, taak 134. Inhoud: ../en/chinese-checkers-2-players.mjs zin voor zin (regels uit crates/halma-core,
// zie docs/plan.md, taak 122). Wie een regel wijzigt, wijzigt elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">对局如何开始</h2>
      <p>每位玩家有 10 颗棋子。它们从星形上相对的两个角出发：红色在下方，蓝色在上方。20 颗棋子摆在有 121 个位置的棋盘上。</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "星形棋盘，下方的角上有 10 颗红色棋子，上方的角上有 10 颗蓝色棋子",
  tekst: "红色从下方出发，蓝色从上方出发。",
})}
      <p>玩家 1，也就是红色，先走。之后你们轮流，各走一步棋。一步棋是用一颗棋子走一步或连跳。走和跳的说明见<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">你的目标是对方的起点</h2>
      <p>把你的 10 颗棋子全部移入对方出发的那个角，就赢了。那个角开局时摆满了对方的棋子，你的角则摆满了你的棋子。对红色来说，那就是上图中上方的角。</p>
      <p>你只能落在空位上，所以你们每个人都必须先离开自己的角，对方才能填满它。只要对方有一颗棋子留在目标里，你们谁都无法完成。而且因为你们沿相反的方向越过同一个中间区域，对方的棋子是你的垫脚石，你的棋子也是对方的垫脚石。怎么利用这一点，请读<a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>。</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">获胜和认输</h2>
      <ul>
        <li><strong>获胜：</strong>第一个用全部 10 颗棋子填满目标的玩家获胜，对局立即结束。另一位玩家不再继续。</li>
        <li><strong>认输：</strong>你的棋子离开棋盘，另一位玩家获胜。</li>
        <li><strong>时间（在线）：</strong>在线对局中，每一步都有时间限制。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了。</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">3、4 和 6 人对局有什么不同</h2>
      <ul>
        <li><strong>3 人：</strong>棋子从隔一个角的角上出发，三个目标开局时是空的。第一个完成的玩家获胜；其他玩家继续争夺后面的名次，已经完成的玩家会被跳过。</li>
        <li><strong>4 人：</strong>两对相邻的角。你的目标开局时摆满了另一位玩家的棋子。第一个完成的玩家之后对局继续，与 3 人时相同。</li>
        <li><strong>6 人：</strong>全部六个角。棋盘上有 60 颗棋子，而 2 人对局时是 20 颗。</li>
      </ul>
      <p>棋盘上只有 20 颗棋子时，可跳的棋子更少，所以你自己搭的梯子更重要。每种开局的图片都在<a href="/zh-hans/rules/chinese-checkers">规则页</a>上。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">在 Leapstone 中哪里可以 2 人对局</h2>
      <ul>
        <li><strong>马上与电脑对战：</strong>在<a href="/play/">浏览器中打开 Leapstone</a>，点击“电脑”，选择星形棋盘。默认是一台电脑，所以这是一局 2 人对局。你可以选择简单、普通或困难，你是玩家 1，所以先走。简单会在三个随机棋步中选最好的。普通会选向目标推进最多的棋步。困难还会看对手可以如何应对，以及它自己的下一步。</li>
        <li><strong>在应用中在线对战：</strong>星形棋盘上的 2 人快速对局，对手是水平相近的另一位玩家，每步 30 秒。部分在线对手可能是电脑玩家。</li>
        <li><strong>与好友：</strong>发送邀请链接，每一步的时间由你自己设定。或者在一部手机上来回传递。</li>
      </ul>
      <p><a href="/zh-hans/guides/play-chinese-checkers-online-with-friends">与好友在线玩跳棋</a></p>
      <p><a href="/zh-hans/guides/chinese-checkers-3-players">3 人跳棋</a></p>
    </section>`;

export default {
  nav: "2 人跳棋",
  titel: "2 人跳棋：摆法和规则 | Leapstone",
  beschrijving: "2 人玩跳棋是怎样的：10 颗棋子从哪里出发，谁先走，怎样获胜或认输，与 3、4 或 6 人对局有什么不同，以及在哪里可以免费 2 人对局。",
  h1: "2 人跳棋",
  intro: "两个人在星形棋盘上的对局是怎么进行的：摆法、谁先走、怎样获胜，以及在哪里可以玩。",
  inhoud,
};
