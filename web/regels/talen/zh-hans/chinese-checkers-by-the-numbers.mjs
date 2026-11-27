// 数字里的跳棋, Vereenvoudigd Chinees (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
// Geen cijfers buiten f(): "两人", "十颗" in woorden, zoals "two players" en "ten pieces" in het Engels.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">位置和棋子</h2>
      <p>在 Leapstone 的两种棋盘上，按一局开始时的摆法数出来的。</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "六个角都摆满的星形棋盘：六种颜色各十颗棋子，围着空着的中间。",
  tekst: "六人对局开始时的星形棋盘。",
})}
      <ul class="tips">
        <li><strong>星形棋盘有 ${f("sterbord_vakken")} 个位置。</strong>每位玩家开始时有 ${f("sterbord_stenen_per_speler")} 颗棋子。所以两人对局时棋盘上有 ${f("sterbord_stenen_2_spelers")} 颗棋子，三人对局有 ${f("sterbord_stenen_3_spelers")} 颗，四人有 ${f("sterbord_stenen_4_spelers")} 颗，六人有 ${f("sterbord_stenen_6_spelers")} 颗。</li>
        <li><strong>Halma 的正方形棋盘有 ${f("vierkant_vakken")} 个位置。</strong>两人对局时，每位玩家开始时有 ${f("vierkant_stenen_per_speler_2_spelers")} 颗棋子，一共 ${f("vierkant_stenen_2_spelers")} 颗。四人对局时，每人开始时有 ${f("vierkant_stenen_per_speler_4_spelers")} 颗棋子，一共 ${f("vierkant_stenen_4_spelers")} 颗。</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">最长的连跳：${f("langste_sprongketen")} 次</h2>
      <p>在星形棋盘上，一颗棋子<strong>一步棋可以连跳 ${f("langste_sprongketen")} 次</strong>，而按照 Leapstone 的规则，没有哪一步棋能跳更多次。为了达到这个数，其他棋子是随意摆放的：棋子跳过的每个位置上各放一颗。</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "星形棋盘上有一颗红色棋子和很多蓝色棋子。白色箭头显示红色棋子沿着一条又长又弯的路线，一颗接一颗地跳过蓝色棋子。",
  tekst: "最长的连跳：红色棋子一颗接一颗地跳过每颗蓝色棋子。",
})}
      <p><strong>怎么数的。</strong>每一跳总是沿直线落在两个位置之外。所以一颗不停跳的棋子只能到达一部分位置：棋盘分成四组这样的位置，最大的一组有 ${f("grootste_klasse_vakken")} 个位置。在 Leapstone 中，一步棋里棋子不能两次落在同一个位置，也不能落回出发的位置。所以一串连跳在本组其他每个位置上最多落一次。程序搜索了这一组，找到一条经过全部 ${f("grootste_klasse_vakken")} 个位置的路线，所以没有更长的连跳：最多 ${f("langste_sprongketen")} 次。然后有一个测试按 Leapstone 的规则走出这步棋。</p>
      <p><strong>不是真实的对局。</strong>这串连跳需要另外 ${f("langste_sprongketen")} 颗棋子，每颗都正好在对的位置上。两人或三人对局只有 ${f("sterbord_stenen_2_spelers")} 或 ${f("sterbord_stenen_3_spelers")} 颗棋子，不够用。四人或六人对局有 ${f("sterbord_stenen_4_spelers")} 或 ${f("sterbord_stenen_6_spelers")} 颗，数量够了。但在真实的对局里没有人随意摆放棋子，所以别指望在棋桌上看到这串连跳。它显示的是棋盘允许什么，而不是对局中会发生什么。</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">最快的过河：${f("oversteek_zetten")} 步</h2>
      <p>一位玩家独自在星形棋盘上、没有对手时，要把全部 ${f("sterbord_stenen_per_speler")} 颗棋子从一个角移到对面的角，需要 <strong>${f("oversteek_zetten")} 步棋</strong>，更少是做不到的。一整串连跳算作一步棋。</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "星形棋盘上只有十颗红色棋子，在下方的角里。它们要去的上方的角用虚线框出。",
  tekst: "一位玩家独自下棋：十颗棋子在下方的角，上方的角是目标。",
})}
      <p><strong>怎么数的。</strong>一个测试在没有其他棋子的棋盘上，按 Leapstone 的规则走出一次 ${f("oversteek_zetten")} 步的过河。为了证明 ${f("geen_oversteek_in_zetten")} 步或更少做不到，一次搜索采用了 G. I. Bell 的方法（<em>Integers</em> 9, 2009）。每一步棋都可以倒着走，而把棋盘转半圈会让起点和目标互换。所以，如果存在 ${f("geen_oversteek_in_zetten")} 步或更少的过河，那么半路上的某个局面离起点最多 ${f("zoekdiepte_zetten")} 步，转半圈后的同一个局面也是如此。搜索检查了离起点 ${f("zoekdiepte_zetten")} 步以内的每个局面，把一个局面和它的镜像只算一次，去掉了可以证明来不及走得够远的局面，结果没有找到这样的一对。它在一台 ${f("gemeten_kernen")} 核的机器上运行了 ${f("gemeten_rekentijd_seconden")} 秒，最大的一步在 ${f("gemeten_geheugen_gb")} GB 内存中保存了 ${f("gemeten_grootste_laag_miljoen_standen")} 百万个局面。这个数是针对 Leapstone 自己的棋盘重新算出来的。</p>
      <p><strong>不是真实对局的下限。</strong>在真实的对局里，其他玩家的棋子也在棋盘上，你的棋子可以跳过它们。所以 ${f("oversteek_zetten")} 并不是真实对局最少需要的步数：它只对独自一位玩家成立。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">试一试</h2>
      <p><a href="/play/">在浏览器里玩 Leapstone</a>，和电脑对战，或者用本页顶部的按钮下载应用。规则请看<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>或 <a href="/zh-hans/rules/halma">Halma 规则</a>。想知道在对局中怎样用好连跳，请看<a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>。</p>
    </section>`;

export default {
  nav: "数字里的跳棋",
  titel: "数字里的跳棋（中国跳棋） | Leapstone",
  beschrijving: `星形棋盘有 ${c.sterbord_vakken} 个位置。一步棋最多连跳 ${c.langste_sprongketen} 次，没有对手的一位玩家需要 ${c.oversteek_zetten} 步才能过河。本文说明每个数是怎么算出来的。`,
  h1: "数字里的跳棋（中国跳棋）",
  intro: `跳棋的星形棋盘有 ${f("sterbord_vakken")} 个位置，每位玩家开始时有 ${f("sterbord_stenen_per_speler")} 颗棋子。在 Leapstone 中，一步棋的连跳永远不会超过 ${f("langste_sprongketen")} 次。一位玩家独自在棋盘上、没有对手时，需要 ${f("oversteek_zetten")} 步棋才能过河。下面说明每个数是怎么数出来的，以及它能说明、不能说明真实对局的哪些事。`,
  inhoud,
};
