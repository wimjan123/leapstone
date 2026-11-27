// Chinese gids Chinese checkers opening moves (taak 303). Inhoud: ../en/chinese-checkers-opening-moves.mjs (elke zet en elk getal getoetst aan crates/halma-core, zie docs/plan.md, taak 303), zin voor zin.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">你的第一步棋：14 种选择</h2>
      <p>开局时，你的 10 颗棋子摆成一个三角形，各排依次有 4、3、2 和 1 颗，最前面一排朝向棋盘中间。三角形里没有空位，所以棋子只能走到它前面的那一排。这样就有 14 种第一步棋：前排的 4 颗棋子各可以走到 2 个位置（8 次走），第二排的 3 颗棋子各可以跳过前排的一颗棋子落到 2 个位置（6 次跳）。其余 3 颗棋子暂时还动不了。</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "下方的红色角和它的 10 颗棋子，紧靠它前面的一排有 5 个空位，用圆圈标了出来。",
  tekst: "每一个第一步棋都落在这 5 个位置之一。",
})}
      <p>在本指南里，排是指横跨你的角、与角的前沿平行的一行位置，我们用前进了几排来计算进度。走一步让棋子前进 1 排，跳一次让它前进 2 排。无论是 2、3、4 还是 6 名玩家，也无论从星形的哪个角出发，每位玩家都有同样的 14 种第一步棋，因为从里面看，每个角都一样。</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">开局 1：先跳出去，再放出角尖</h2>
      <p>你的角尖上的那颗棋子离目标最远，开局时它动不了：只有它所跳过的那颗棋子后面是空位时，它才能跳。从第二排跳出一颗棋子，正好能腾出这样一个空位。</p>
      <ol>
        <li><strong>第 1 步棋：</strong>你第二排最右端的棋子跳过它前面的那颗棋子，落在角前面的那一排，前进 2 排。</li>
        <li><strong>第 2 步棋：</strong>角尖上的棋子一步棋连跳两次：先跳进第 1 步棋腾出的空位，再跳过第二排的一颗棋子，前进 4 排。</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "第 1 步棋之后的红色角。角尖上的棋子套着一个圆圈，编号为 1 和 2 的两个箭头表示它穿过腾出的空位，跳到角前面的那一排。",
  tekst: "第 1 步棋之后，角尖的棋子连跳 2 次跳出去。",
})}
      <p>这样 2 步棋就前进了 6 排。我们试遍了走 2 步棋的所有走法，6 排是最多的。只有 4 组走法能做到：第二排任一端的棋子朝它的 2 个方向之一跳出去，然后角尖的棋子跟上。第二排正中间的棋子不行，因为它会把角尖堵死。</p>
      <p>现在这两颗棋子都站在角前面的那一排，中间隔着一个空位。这就是梯子的第一步。</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">开局 2：4 步棋，用 4 颗不同的棋子</h2>
      <p>走 4 步棋，最多能前进 13 排，而且只有每一步都用不同的棋子才能做到。这条路线就能做到：</p>
      <ol>
        <li><strong>第 1 步棋：</strong>前排最右端的棋子走一步，前进 1 排。</li>
        <li><strong>第 2 步棋：</strong>第三排最右端的棋子连跳两次，前进 4 排。</li>
        <li><strong>第 3 步棋：</strong>第二排最左端的棋子连跳两次，前进 4 排。</li>
        <li><strong>第 4 步棋：</strong>角尖上的棋子连跳两次，前进 4 排。</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "开局时的红色角。将要移动的 4 颗棋子带有 1 到 4 的编号，按走棋的顺序排列。",
          tekst: "走之前：要移动的棋子，按顺序。",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "走完 4 步棋后的红色角：编号的棋子落在角前面几排的 4 个位置，角里留下 4 个空洞。",
          tekst: "走之后：它们落脚的地方。",
        })}
      </div>
      <p>每一步棋都为下一步做准备。第 2 步棋和第 3 步棋最后都跳过了刚刚走过的那颗棋子，第 4 步棋则从第 3 步棋留下的空洞穿过去。这 4 颗棋子都落在你自己的半边棋盘上。</p>
      <p>还有别的路线也能前进 13 排。它们的共同点是同一个思路：找出能为下一步留下空洞或垫脚石的那步棋，并且最晚在第 4 步棋之前让角尖的棋子出来。</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">头几步棋的常见错误</h2>
      <ul class="tips">
        <li><strong>每回合都走同一颗棋子。</strong>一颗棋子单独跑，4 步棋只前进 5 排，而 4 颗不同的棋子能前进 13 排。其余的棋子也还留在原地。</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "开局时的红色角。第二排的一颗棋子沿着一条线连走 4 步棋，用箭头和 1 到 4 的编号标出，最后孤零零地停在棋盘中间附近。",
  tekst: "一颗棋子，4 步棋，前进 5 排。",
})}
      <ul class="tips">
        <li><strong>只用前排的棋子走一步。</strong>走 4 次只前进 4 排。之后角尖的棋子仍然动不了，所以它留在后面，其余的棋子却冲到了前面。</li>
        <li><strong>横着走。</strong>沿着一排横走一步前进 0 排。开局 1 的第 1 步棋之后，前面的那颗棋子可以走到旁边的位置，看上去像是在前进，其实这步棋白白浪费了。</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">继续阅读</h2>
      <p>大约走了 4 步棋之后，双方的棋子会靠近，上面的开局就让位于中局。你不必背下这些路线：记住每一步棋都要为下一步做准备就够了。</p>
      <ul>
        <li><a href="/play/">在浏览器中与电脑对战</a>，试试开局 1 或开局 2。</li>
        <li><a href="/zh-hans/guides/chinese-checkers-strategy">跳棋策略</a>：梯子、让棋子靠在一起、填满你的目标。</li>
        <li><a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>：两个人的对局是怎么进行的。</li>
        <li><a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>，配有走、跳和连跳的图片。</li>
      </ul>
    </section>`;

export default {
  nav: "跳棋开局走法",
  titel: "跳棋开局走法：2 种开局 | Leapstone",
  beschrijving: "星形棋盘上的跳棋开局走法：先从第二排跳出去，在第 2 步棋放出角尖的棋子，4 步棋前进 13 排，并避开开局的常见错误。",
  h1: "跳棋开局走法",
  intro: "跳棋的好开局是从第二排跳出去，每回合用不同的棋子，并在第 2 步棋或第 4 步棋让角尖的棋子出来。两种开局配有图片，还有要避免的错误。",
  inhoud,
};
