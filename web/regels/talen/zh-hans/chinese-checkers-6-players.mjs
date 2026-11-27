// 简体中文指南「6 人跳棋」, taak 302. Inhoud: ../en/chinese-checkers-6-players.mjs zin voor zin.
// Regels uit crates/halma-core; de feiten staan gecontroleerd in de Engelse bron.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">对局如何开始</h2>
      <p>每位玩家有 10 颗棋子，星形的 6 个角全部用上。这样，有 121 个位置的棋盘上就有 60 颗棋子。中间的 61 个位置开局时是空的。</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "星形棋盘，6 个角上各有 10 颗棋子，共 6 种颜色",
  tekst: "6 位玩家，6 个角，60 颗棋子。",
})}
      <p>玩家 1，也就是红色，从下方的角先走。之后的回合从玩家 1 依次到玩家 6，玩家 6 走完又轮到玩家 1。玩家按各自的角在星形四周的顺序编号，所以你的下一位玩家总是从紧挨着你的角的那个角出发。一步棋是用一颗棋子走一步或连跳。走和跳的说明见<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">开局时每个目标都是满的</h2>
      <p>把你的 10 颗棋子全部移入棋盘对面的角，就赢了。6 人对局时，那个角正是你对面的玩家出发的地方，所以没有空的目标：每个目标开局时都摆满了另一位玩家的棋子。对红色来说，目标是上方的角，玩家 4 从那里出发。</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "星形棋盘，6 个角都摆满了棋子。虚线圈标出上方的角，那是红色玩家的目标，里面是对面玩家的棋子。",
  tekst: "红色的目标是对面的角，里面摆满了玩家 4 的棋子。",
})}
      <p>你只能落在空位上，所以对面的玩家必须先离开自己的角，你才能填满它，而你也必须先离开自己的角，他才能填满。2 人对局就是这样。6 人对局时，你们两人还得穿过其他 4 位玩家造成的拥挤。</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">拥挤的中间</h2>
      <p>每个目标都在棋盘对面，而各个角只通过中间相连，所以全部 60 颗棋子都要越过同样的 61 个位置。开局时还没有人越过，中间很快就会被填满。</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "一颗红色棋子一步连跳三次：先跳过一颗蓝色棋子，再跳过一颗绿色棋子，再跳过一颗紫色棋子。数字 1、2 和 3 标出落点。",
  tekst: "各种颜色的棋子都是垫脚石。",
})}
      <p>你可以跳过任何颜色的棋子。其他 5 位玩家的棋子是你的垫脚石，你的棋子也是这 5 位玩家的垫脚石。你留在中间的一排棋子，对每个够得着的人都是梯子，而你的下一位玩家最先用上。</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">面对 5 个对手时的阻挡</h2>
      <ul>
        <li><strong>填住落点：</strong>跳棋需要棋子正后方有一个空位。你把一颗棋子移到那里后，想走这一跳的每位玩家都跳不成了。</li>
        <li><strong>小心你搭的梯子：</strong>你走完之后，再轮到你之前，其他 5 位玩家都会走棋。梯子对他们所有人都有帮助。</li>
        <li><strong>任何人都能堵住目标：</strong>不只是对面玩家的棋子，其他任何玩家的棋子只要留在你的目标里，你就无法完成。目标的 10 个位置必须全是你自己的棋子。</li>
      </ul>
      <p><a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>说明了被堵住的跳是什么样子，以及怎样避免把另一位玩家的棋子锁在你自己的目标里。</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">一局要多久</h2>
      <p>6 人对局有 60 颗棋子要走，你的一步和下一步之间，其他 5 位玩家各走一步。而且第一位玩家完成时，对局也不会结束。</p>
      <ul>
        <li><strong>赢了，对局继续：</strong>第一个填满目标的玩家获胜，其他玩家继续争夺后面的名次。已经完成的玩家会被跳过，他的棋子作为垫脚石留在棋盘上。只剩一位玩家还在下时，对局结束。</li>
        <li><strong>认输：</strong>你的棋子离开棋盘，所以不再阻挡或帮助任何人，其他玩家继续。</li>
        <li><strong>时间（在线）：</strong>在线对局中，每一步都有时间限制，由开局的玩家设定：15 秒、30 秒、1 分钟、2 分钟或不限时。走 6 步的一轮最多要用限制时间的 6 倍，所以限时 30 秒的话，最多 3 分钟。时间用完时，你的回合会被跳过。连续错过 3 个回合，你就认输了，对局在没有你的情况下继续。</li>
      </ul>
      <p>想了解人数更少的对局，请读<a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">在 Leapstone 中哪里可以 6 人对局</h2>
      <ul>
        <li><strong>马上与电脑对战：</strong>在<a href="/play/">浏览器中打开 Leapstone</a>，点击“电脑”，选择星形棋盘和 5 台电脑。你是玩家 1，所以先走。电脑一台接一台地走，每台之间有短暂的停顿，所以你能看清每一步。你可以为电脑选择简单、普通或困难。</li>
        <li><strong>在一部手机上：</strong>点击“开始玩”，选择星形棋盘和 6 位玩家，然后点击一颗棋子，在真人和电脑之间切换这个座位。</li>
        <li><strong>与好友在线对战：</strong>点击“好友”，选择星形棋盘、6 位玩家和每步的时间，然后发送邀请链接。6 个座位全部坐满时，对局开始。</li>
        <li><strong>快速对局：</strong>“在线对战”会找 2 人或 4 人的对局，所以没有 6 人的快速对局。</li>
      </ul>
    </section>`;

export default {
  nav: "6 人跳棋",
  titel: "6 人跳棋：满盘对局 | Leapstone",
  beschrijving: "6 人玩跳棋是怎样的：星形棋盘的 6 个角全部摆满，共 60 颗棋子，中间拥挤，怎样阻挡对手，一局要多久，以及在 Leapstone 的哪里可以玩。",
  h1: "6 人跳棋",
  intro: "6 人对局是怎样进行的：6 个角全是满的，你要争先抵达棋盘对面的角，第一位玩家完成后对局还会继续。",
  inhoud,
};
