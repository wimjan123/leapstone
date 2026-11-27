// 简体中文指南「跳棋策略」, taak 134. Inhoud: ../en/chinese-checkers-strategy.mjs zin voor zin (elke tip is gecontroleerd tegen
// crates/halma-core, zie docs/plan.md, taak 122). Wie een tip wijzigt, wijzigt elke taal.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">这些技巧的依据</h2>
      <p>这些技巧来自 Leapstone 所用的<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>：一步棋是走一步或连跳，并且你可以跳过任何颜色的棋子。它们并不证明什么是最佳下法。与电脑对战是试验它们最快的办法。</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. 搭梯子</h2>
      <p>梯子是一列棋子，每两颗之间留一个空位。一端的棋子一步棋就能跳过整条线，这样它一个回合就能越过棋盘，而不是每回合只走一个位置。</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "四颗棋子排成一条斜线，每两颗之间有一个空位。一端的红色棋子跳过全部四颗，有四个编了号的落点。",
  tekst: "一步棋连跳四次。同一颗棋子如果只走，一次只能走一个位置。",
})}
      <p>六个方向都可以跳，向后也可以，所以梯子不必从你自己的角开始。任何一列中间留有空位的棋子都可以。</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. 让棋子靠在一起</h2>
      <p>你需要 10 颗棋子全部进入目标，所以你的最后一颗棋子决定你什么时候完成。旁边没有棋子的棋子没有东西可跳，只能走。</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "星形棋盘，下方的角上有一颗孤零零的红色棋子。只有它的两个空着的相邻位置有标记。棋盘中间还有其他红色和蓝色棋子。",
  tekst: "这颗棋子没有相邻的棋子，所以只能走到两个有标记的位置。",
})}
      <p>从你自己的角的尖端，到棋盘对面目标角的尖端，是 16 步。一颗落单的棋子要走 16 个回合，而梯子一步就能越过。趁后面的棋子周围还有棋子可跳时，把它们先走上来。Leapstone 中的电脑也是这样做的：它给走最靠后棋子的棋步打的分稍高一些。</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. 用好中间</h2>
      <p>棋盘中间的棋子有六个相邻位置，所以它向六个方向都可以走或跳。边上的棋子相邻位置更少。图中边上的那颗棋子有四个。</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "星形棋盘，中间有一颗红色棋子，六个相邻位置有标记；左上边缘附近有一颗红色棋子，四个相邻位置有标记。",
  tekst: "中间有六种走法，边上有四种。",
})}
      <p>中间的棋子还能给其他棋子在过河的路上提供可跳的对象。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. 从后面开始填满目标</h2>
      <p>你的目标是一个有 10 个位置的三角形，各排分别是 4、3、2 和 1 个。后面的位置只能经过它们前面的位置才能到达。如果先填满前面，最后一颗棋子可能无路可进。</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "上方的目标角，里面有九颗红色棋子，最里面有一个空位，用虚线标出。第十颗红色棋子带着白色的环，站在前排下方。",
  tekst: "九颗棋子已经到家，后面的位置是空的。第十颗棋子没有走进去的棋步。",
})}
      <p>先把棋子放进后面的位置，再向前面填，这样前面就留给最后到达的棋子。</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. 不要围死目标里的棋子</h2>
      <p>你可以停在其他玩家的角上，所以其他玩家的棋子可能会待在你的目标里。只有当你目标的 10 个位置全是你自己的棋子时，你才获胜。如果那颗棋子没有棋步，就没有人能移动它，在它旁边的位置空出来之前，你无法获胜。</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "上方的目标角，里面有九颗红色棋子，最里面有一颗蓝色棋子，用白色的环标出。蓝色棋子被红色棋子围住。",
  tekst: "最里面的蓝色棋子没有棋步，红色无法填满目标。",
})}
      <p>在这样的棋子旁边留一个空位，让它能离开。Leapstone 中的电脑也会计算这一点：把其他玩家的棋子困在它自己的目标里的棋步，得分更低。规则不会要求任何人离开你的目标，所以对方也可以故意把一颗棋子停在那里。</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. 挡住一次跳，或者放任它</h2>
      <p>跳需要一个空位来落脚。把那个位置填上，这次跳就没有了。连续的两颗棋子也不能跳过。</p>
      <p>你的棋子对对方来说也是垫脚石。左图中，蓝色一步棋越过两颗红色棋子。右图中，红色把一颗棋子移到了第一个落点上，蓝色只能走。</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "一颗蓝色棋子，和排成一线的两颗红色棋子，每颗后面都有一个空位。箭头表示蓝色棋子的两次跳。",
          tekst: "之前：蓝色可以跳两次。",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "红色把较远的那颗棋子移到第一个落点之后的同一条线。蓝色棋子后面紧跟着两颗红色棋子。",
          tekst: "之后：红色移动了一颗棋子。蓝色没有跳的机会。",
        })}
      </div>
      <p>用来阻挡的一步棋，就是没有用在自己前进上的一步棋，所以只有当这次跳给对方带来的好处比你这一步给你带来的更多时，才去阻挡。搭梯子时则正相反：你走完之后，对方先走，所以他们在一端的棋子会比你先用上你的梯子。在最难的级别上，电脑在选择棋步之前，会先看每个对手最好的应对。</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">继续阅读</h2>
      <ul>
        <li><a href="/play/">在浏览器中与电脑对战</a>，试试搭梯子。</li>
        <li><a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>：两个人的对局是怎么进行的。</li>
        <li><a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>，配有走、跳和连跳的图片。</li>
      </ul>
      <p><a href="/zh-hans/guides/play-chinese-checkers-online-with-friends">与好友在线玩跳棋</a></p>
      <p><a href="/zh-hans/guides/halma-vs-chinese-checkers">Halma 和跳棋的区别</a></p>
      <p><a href="/zh-hans/guides/chinese-checkers-3-players">3 人跳棋</a></p>
    </section>`;

export default {
  nav: "跳棋策略",
  titel: "跳棋策略：6 个配图技巧 | Leapstone",
  beschrijving: "星形棋盘上的跳棋策略：搭梯子，让棋子靠在一起，用好中间，从后面填满目标，以及什么时候挡住一次跳。每个技巧都对照规则检查过。",
  h1: "跳棋策略",
  intro: "星形棋盘的六个技巧，每个都配有来自真实规则的图片：梯子、落单的棋子、中间、填满目标，以及挡住跳。",
  inhoud,
};
