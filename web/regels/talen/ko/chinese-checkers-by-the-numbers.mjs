// 숫자로 보는 다이아몬드 게임, Koreaans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
// Geen cijfers buiten f(): "두 명", "열 개" in woorden, zoals "two players" en "ten pieces" in het Engels.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">칸과 말</h2>
      <p>Leapstone의 두 보드에서, 게임을 시작할 때의 배치로 셌습니다.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "여섯 꼭짓점이 모두 찬 별 모양 보드. 빈 가운데를 둘러싸고 여섯 가지 색마다 말이 열 개씩 있습니다.",
  tekst: "여섯 명이 하는 게임을 시작할 때의 별 모양 보드.",
})}
      <ul class="tips">
        <li><strong>별 모양 보드에는 ${f("sterbord_vakken")}칸이 있습니다.</strong> 플레이어마다 말 ${f("sterbord_stenen_per_speler")}개로 시작합니다. 그래서 보드 위의 말은 두 명이 하면 ${f("sterbord_stenen_2_spelers")}개, 세 명이면 ${f("sterbord_stenen_3_spelers")}개, 네 명이면 ${f("sterbord_stenen_4_spelers")}개, 여섯 명이면 ${f("sterbord_stenen_6_spelers")}개입니다.</li>
        <li><strong>할마의 정사각형 보드에는 ${f("vierkant_vakken")}칸이 있습니다.</strong> 두 명이 하는 게임에서는 플레이어마다 말 ${f("vierkant_stenen_per_speler_2_spelers")}개로 시작해 모두 ${f("vierkant_stenen_2_spelers")}개입니다. 네 명이 하는 게임에서는 각자 말 ${f("vierkant_stenen_per_speler_4_spelers")}개로 시작해 모두 ${f("vierkant_stenen_4_spelers")}개입니다.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">가장 긴 연속 점프: ${f("langste_sprongketen")}번</h2>
      <p>별 모양 보드에서 말 하나는 <strong>한 수에 ${f("langste_sprongketen")}번 점프</strong>할 수 있고, Leapstone 규칙으로는 이보다 많은 점프가 들어간 수는 없습니다. 이 숫자를 만들려고 다른 말들은 자유롭게 놓았습니다. 말이 뛰어넘는 칸마다 하나씩입니다.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "빨간 말 하나와 파란 말 여러 개가 있는 별 모양 보드. 흰 화살표가 길고 구불구불한 길을 따라 빨간 말이 파란 말을 하나씩 차례로 뛰어넘는 모습을 보여 줍니다.",
  tekst: "가장 긴 연속 점프: 빨간 말이 파란 말을 하나씩 차례로 모두 뛰어넘습니다.",
})}
      <p><strong>세는 방법.</strong> 점프는 언제나 직선으로 두 칸 떨어진 곳에 내려앉습니다. 그래서 계속 점프하는 말은 일부 칸에만 갈 수 있습니다. 보드는 이런 무리 네 개로 나뉘고, 가장 큰 무리에는 ${f("grootste_klasse_vakken")}칸이 있습니다. Leapstone에서는 한 수 안에서 같은 칸에 두 번 내려앉을 수 없고, 출발한 칸에도 내려앉을 수 없습니다. 그러니 연속 점프는 자기 무리의 다른 칸마다 많아야 한 번씩만 내려앉습니다. 프로그램은 이 무리를 탐색해 ${f("grootste_klasse_vakken")}칸을 모두 지나는 길을 찾았으므로, 이보다 긴 연속 점프는 있을 수 없습니다. ${f("langste_sprongketen")}번이 최대입니다. 그다음 테스트가 이 수를 Leapstone 규칙으로 실제로 둡니다.</p>
      <p><strong>실제 게임이 아닙니다.</strong> 이 연속 점프에는 다른 말 ${f("langste_sprongketen")}개가 각각 정확히 맞는 칸에 있어야 합니다. 두 명이나 세 명이 하는 게임에는 말이 ${f("sterbord_stenen_2_spelers")}개나 ${f("sterbord_stenen_3_spelers")}개뿐이라 모자랍니다. 네 명이나 여섯 명이 하는 게임에는 ${f("sterbord_stenen_4_spelers")}개나 ${f("sterbord_stenen_6_spelers")}개가 있어 충분합니다. 하지만 실제 게임에서는 아무도 말을 자유롭게 놓지 않으니, 게임판 앞에서 이 연속 점프를 기대하지는 마세요. 이것은 보드가 허락하는 것을 보여 줄 뿐, 게임에서 일어나는 일은 아닙니다.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">가장 짧은 건너가기: ${f("oversteek_zetten")}수</h2>
      <p>상대 없이 별 모양 보드에 혼자 있는 플레이어가 말 ${f("sterbord_stenen_per_speler")}개를 모두 한 꼭짓점에서 맞은편 꼭짓점으로 옮기려면 <strong>${f("oversteek_zetten")}수</strong>가 필요하고, 그보다 적게는 할 수 없습니다. 연속 점프 하나는 통째로 한 수로 셉니다.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "아래 꼭짓점에 빨간 말 열 개만 있는 별 모양 보드. 말들이 가야 할 위 꼭짓점은 점선으로 둘러져 있습니다.",
  tekst: "혼자 하는 플레이어: 아래 꼭짓점에 말 열 개가 있고, 위 꼭짓점이 목표입니다.",
})}
      <p><strong>세는 방법.</strong> 테스트가 다른 말이 없는 보드에서 Leapstone 규칙으로 ${f("oversteek_zetten")}수짜리 건너가기를 둡니다. ${f("geen_oversteek_in_zetten")}수 이하로는 안 된다는 것을 보이려고, 탐색은 G. I. Bell의 방법(<em>Integers</em> 9, 2009)을 따릅니다. 모든 수는 거꾸로 둘 수 있고, 보드를 반 바퀴 돌리면 출발점과 목표가 서로 바뀝니다. 그러니 ${f("geen_oversteek_in_zetten")}수 이하의 건너가기가 있다면, 중간쯤의 어떤 배치는 출발점에서 많아야 ${f("zoekdiepte_zetten")}수 거리에 있고, 그 배치를 반 바퀴 돌린 것도 마찬가지입니다. 탐색은 출발점에서 ${f("zoekdiepte_zetten")}수 안에 있는 모든 배치를 살폈고, 배치와 그 거울상은 한 번만 셌고, 제때 충분히 멀리 갈 수 없다고 증명되는 배치는 뺐으며, 그런 쌍을 하나도 찾지 못했습니다. 탐색은 ${f("gemeten_kernen")}코어 컴퓨터에서 ${f("gemeten_rekentijd_seconden")}초 걸렸고, 가장 큰 단계에서는 ${f("gemeten_geheugen_gb")} GB 메모리에 배치 ${f("gemeten_grootste_laag_miljoen_standen")}백만 개를 담았습니다. 이 숫자는 Leapstone 자체의 보드에 맞춰 다시 계산했습니다.</p>
      <p><strong>실제 게임의 하한이 아닙니다.</strong> 실제 게임에서는 다른 플레이어의 말도 보드 위에 있고, 내 말은 그 말들을 뛰어넘을 수 있습니다. 그러니 ${f("oversteek_zetten")}은 실제 게임에 걸리는 가장 적은 수가 아닙니다. 혼자 하는 플레이어에게만 증명된 숫자입니다.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">직접 해 보세요</h2>
      <p><a href="/play/">브라우저에서 Leapstone 플레이</a>로 컴퓨터와 대결하거나, 이 페이지 맨 위의 버튼으로 앱을 받으세요. 규칙은 <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>이나 <a href="/ko/rules/halma">할마 규칙</a>에서 읽을 수 있습니다. 게임에서 연속 점프를 쓰는 방법은 <a href="/ko/guides/chinese-checkers-strategy">전략 팁</a>에 있습니다.</p>
    </section>`;

export default {
  nav: "숫자로 보는 다이아몬드 게임",
  titel: "숫자로 보는 다이아몬드 게임 | Leapstone",
  beschrijving: `별 모양 보드는 ${c.sterbord_vakken}칸입니다. 한 수의 점프는 최대 ${c.langste_sprongketen}번이고, 혼자인 플레이어는 ${c.oversteek_zetten}수에 건너갑니다. 각 숫자를 구한 방법.`,
  h1: "숫자로 보는 다이아몬드 게임(차이니스 체커)",
  intro: `다이아몬드 게임의 별 모양 보드에는 ${f("sterbord_vakken")}칸이 있고, 플레이어마다 말 ${f("sterbord_stenen_per_speler")}개로 시작합니다. Leapstone에서 한 수의 점프는 절대 ${f("langste_sprongketen")}번을 넘지 않습니다. 상대 없이 보드에 혼자 있는 플레이어는 건너가는 데 ${f("oversteek_zetten")}수가 필요합니다. 아래에서 각 숫자를 어떻게 셌는지, 그리고 그 숫자가 실제 게임에 대해 무엇을 말해 주고 무엇을 말해 주지 않는지 볼 수 있습니다.`,
  inhoud,
};
