// 简体中文指南「4 人跳棋」 (taak 301, feature 294): /zh-hans/guides/chinese-checkers-4-players.
// Inhoud: ../en/chinese-checkers-4-players.mjs zin voor zin (regels uit crates/halma-core, zie docs/plan.md, taak 301).
// Wie een regel wijzigt, wijzigt elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">棋盘如何划分</h2>
      <p>每位玩家有 10 颗棋子，所以 121 个位置的棋盘上共有 40 颗棋子。四个出发角是两对相邻的角：红色在下方，蓝色在左下方；绿色在上方，黄色在右上方。</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "星形棋盘，下方的角有 10 颗红色棋子，左下方的角有 10 颗蓝色棋子，上方的角有 10 颗绿色棋子，右上方的角有 10 颗黄色棋子。左上方和右下方的角是空的。",
  tekst: "红色在下方，蓝色在左下方，绿色在上方，黄色在右上方。",
})}
      <p>玩家 1，也就是红色，先走。接着蓝色是玩家 2，绿色是玩家 3，黄色是玩家 4，黄色之后又轮到红色。一步棋是用一颗棋子走一步或连跳。走和跳的说明见<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">谁与谁相对</h2>
      <p>各个角两两相对：红色对绿色，蓝色对黄色。你的目标是你对面的那个角。红色去绿色出发的地方，绿色去红色出发的地方，蓝色去黄色出发的地方，黄色去蓝色出发的地方。</p>
      <p>和 2 人对局一样，每个目标开局时摆满了你对面玩家的棋子，所以他们离开之后你才能落在那里。3 人对局时目标开局是空的，所以 4 人对局时没有人能一下子完成。四个目标是四个不同的角，所以没有别人想要你的目标：已经完成的玩家永远不会挡住任何人。</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">两个空角</h2>
      <p>左上方和右下方的角里没有棋子。它们不是任何人的出发点，也不是任何人的目标。左上方的角在蓝色和绿色之间，右下方的角在黄色和红色之间。</p>
      <p>你可以走或跳到任何空位上，所以你可以穿过这些角，或停在里面。不过，那里的棋子还不在目标中。在空角里没有可跳过的棋子，除非有人把棋子带到那里。</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">你的战术有什么变化</h2>
      <ul>
        <li><strong>两条路线同时交叉：</strong>红色和绿色朝对方穿过棋盘，蓝色和黄色也是。两条线都经过中间，所以中间比 2 人对局时更拥挤，那时只有一条线交叉。</li>
        <li><strong>你的两次行动之间有三位玩家走棋：</strong>在你两步棋之间，棋盘比 2 人对局时变化更多。每个回合开始时再看一遍棋盘，然后再计划你的连跳。你之后走棋的玩家绝不是你对面的玩家。</li>
        <li><strong>棋子对所有人都有帮助：</strong>其他三位玩家的每颗棋子都是你的垫脚石，你的棋子也是他们的垫脚石。你对面玩家的棋子朝相反的方向移动，和 2 人对局时一样。</li>
        <li><strong>绕行的空间：</strong>如果中间很满，空角就是出发角旁边的开阔地。穿过其中一个的路线可以绕开拥挤。</li>
        <li><strong>认输的玩家会让出你的目标：</strong>你对面的玩家认输时，他们的棋子离开棋盘，所以你的目标立刻空出来。</li>
      </ul>
      <p>关于梯子、落单棋子和从后面填满目标的<a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>，在 4 人对局时同样适用。</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">获胜，以及之后会怎样</h2>
      <ul>
        <li><strong>获胜：</strong>第一个用全部 10 颗棋子填满目标的玩家获胜。对局并不就此结束：另外三位玩家继续争夺后面的名次，已经完成的玩家会被跳过。该玩家的棋子留在棋盘上。只剩一位玩家还在玩时，对局结束。</li>
        <li><strong>认输：</strong>你的棋子离开棋盘，另外三位玩家继续。如果其他人也认输，剩下的最后一位玩家获胜。</li>
        <li><strong>时间（在线）：</strong>在线对局中，每一步都有时间限制。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了，对局在没有你的情况下继续。</li>
      </ul>
      <p>想了解人数更少的对局，请读<a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>。<a href="/zh-hans/rules/chinese-checkers">规则页</a>上有每种开局的图片。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">在 Leapstone 中哪里可以 4 人对局</h2>
      <ul>
        <li><strong>马上与电脑对战：</strong>在<a href="/play/">浏览器中打开 Leapstone</a>，点击“电脑”，选择星形棋盘和 3 台电脑。你是玩家 1，所以先走。你可以为电脑选择简单、普通或困难。</li>
        <li><strong>在一部手机上：</strong>点击“开始玩”，选择星形棋盘和 4 位玩家，然后点击一颗棋子，把那个位置在真人和电脑之间切换。</li>
        <li><strong>与好友在线：</strong>点击“好友”，选择星形棋盘、4 位玩家和每步的时间，然后发送邀请链接。4 个位置都有人时对局开始。</li>
        <li><strong>快速对局，在应用中：</strong>点击“在线对战”。在它寻找 2 人对局时，点击“寻找4或6位玩家”，改为寻找 4 人对局。每一步有 30 秒。如果 20 秒内没有足够的玩家加入，电脑玩家会补上空位，所以有些对手可能是电脑玩家。</li>
      </ul>
    </section>`;

export default {
  nav: "4 人跳棋",
  titel: "4 人跳棋：摆法和技巧 | Leapstone",
  beschrijving: "4 人玩跳棋是怎样的：棋盘如何分成两对相邻的角，哪 2 个角保持空着，谁与谁相对，战术有什么变化，以及在 Leapstone 哪里可以玩。",
  h1: "4 人跳棋",
  intro: "4 人对局时，你们每人从星形的四个角之一出发，另外两个角保持空着。红色对绿色，蓝色对黄色：你的目标是你对面的角，那里开局时摆满了那位玩家的棋子。下面是摆法、空角、战术，以及在哪里可以玩。",
  inhoud,
};
