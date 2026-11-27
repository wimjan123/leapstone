// Gids Chinese checkers for 3 players in het Vereenvoudigd Chinees (taak 299). Inhoud: de Engelse gids ../en/chinese-checkers-3-players.mjs (regels uit crates/halma-core,
// zie docs/plan.md, taak 139), zin voor zin in het Chinees. Wijzig je een regel, wijzig dan elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">对局如何开始</h2>
      <p>每位玩家有 10 颗棋子，所以 121 个位置的棋盘上共有 30 颗棋子。它们从星形上隔一个角的角出发：红色在下方，蓝色在左上方，绿色在右上方。中间的三个角是空的。</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "星形棋盘，下方的角上有 10 颗红色棋子，左上方的角上有 10 颗蓝色棋子，右上方的角上有 10 颗绿色棋子",
  tekst: "红色在下方，蓝色在左上方，绿色在右上方。",
})}
      <p>玩家 1，也就是红色，先走。然后蓝色是玩家 2，绿色是玩家 3，绿色之后又轮到红色。一步棋是用一颗棋子走一步或连跳。走和跳的说明见<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">三个目标，开局时全是空的</h2>
      <p>你的目标是与你出发的角相对的那个角，3 人对局时它开局是空的。它是另外两位玩家出发的角之间的那个空角：红色的目标在上方，蓝色的在右下方，绿色的在左下方。</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "三人对局的星形棋盘。每位玩家颜色的虚线圆圈标出三个空的目标：红色在上方，蓝色在右下方，绿色在左下方。",
  tekst: "每个目标都是其玩家的颜色。",
})}
      <p>把你的 10 颗棋子全部移入你的目标，就赢了。全部 10 个位置都必须是你自己的棋子。没有人从你的目标出发，但你可以停在任何空位上，所以其他玩家的棋子以后可能落在那里。只要它在那里，你就无法完成。</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">获胜，以及之后会怎样</h2>
      <ul>
        <li><strong>获胜：</strong>第一个填满目标的玩家获胜。对局不会就此结束：另外两位玩家继续争夺后面的名次，已经完成的玩家会被跳过。只剩一位玩家还在继续时，对局结束。</li>
        <li><strong>认输：</strong>你的棋子离开棋盘，另外两位玩家继续。如果在有人完成之前第二位玩家也认输，最后剩下的玩家获胜。</li>
        <li><strong>时间（在线）：</strong>在线对局中，每一步都有时间限制，由发起对局的玩家设定。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了，对局在没有你的情况下继续。</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">与 2 人对局有什么不同</h2>
      <ul>
        <li><strong>棋子更多：</strong>棋盘上有 30 颗，而 2 人对局时是 20 颗。</li>
        <li><strong>空的目标：</strong>2 人对局时，你的目标开局时摆满了另一位玩家的棋子。3 人时，它开局是空的。</li>
        <li><strong>两个对手：</strong>你走完之后，另外两位玩家各走一步，才会再轮到你。两人的棋子都是你的垫脚石，你的棋子也是他们的垫脚石。你搭的梯子两人都可以用，而你后面的那位玩家先用。</li>
        <li><strong>对局继续：</strong>2 人对局时，你们中有一人完成，对局就结束。3 人时，对局会继续争夺第二名和第三名。</li>
      </ul>
      <p>想了解两个人的玩法，请读<a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>。<a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>讲的是走和跳，3 人对局时也是一样的。</p>
      <p><a href="/zh-hans/guides/play-chinese-checkers-online-with-friends">与好友在线玩跳棋</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">在 Leapstone 中哪里可以 3 人对局</h2>
      <ul>
        <li><strong>马上与电脑对战：</strong>在<a href="/play/">浏览器中打开 Leapstone</a>，点击“电脑”，选择星形棋盘和 2 台电脑。你是玩家 1，所以先走。你可以为电脑选择简单、普通或困难。</li>
        <li><strong>在同一部手机上：</strong>点击“在这部手机上”，选择星形棋盘和 3 名玩家，然后点击一颗棋子，把那个位置在真人和电脑之间切换。</li>
        <li><strong>与好友在线：</strong>点击“好友”，选择星形棋盘、3 名玩家和每步的时间，然后发送邀请链接。3 个位置都坐满后，对局开始。</li>
        <li><strong>快速对局：</strong>“在线对战”只会匹配 2 人或 4 人的对局，所以没有 3 人的快速对局。</li>
      </ul>
    </section>`;

export default {
  nav: "3 人跳棋",
  titel: "3 人跳棋：摆法和规则 | Leapstone",
  beschrijving: "3 人玩跳棋是怎样的：30 颗棋子从哪里出发，哪个空角是谁的目标，谁先走，怎样获胜或认输，以及在哪里可以免费 3 人对局。",
  h1: "3 人跳棋",
  intro: "三个人在星形棋盘上的对局是怎么进行的：摆法、三个目标、谁先走、怎样获胜，以及在哪里可以玩。",
  inhoud,
};
