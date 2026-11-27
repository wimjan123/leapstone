// De Koreaanse gids Chinese checkers strategy (다이아몬드 게임 전략), taak 134. Inhoud: ../en/chinese-checkers-strategy.mjs (elke tip nagelopen tegen crates/halma-core, zie docs/plan.md, taak 122), zin voor zin.
// Geen verzonnen "experts", cijfers of geschiedenis. Het enige getal is 16 (stappen van punt tot punt).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">이 팁의 바탕</h2>
      <p>이 팁은 Leapstone이 따르는 <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>에서 나옵니다. 한 수는 한 칸 이동이거나 연속 점프이고, 어떤 색의 말이든 뛰어넘을 수 있습니다. 최선의 플레이를 증명하는 것은 아닙니다. 팁을 시험해 보는 가장 빠른 방법은 컴퓨터와 대결하는 것입니다.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. 사다리를 만드세요</h2>
      <p>사다리는 말 사이에 빈 칸이 하나씩 있는 말의 줄입니다. 한쪽 끝의 말이 한 수에 그 줄 전체를 뛰어넘으므로, 한 차례에 한 칸씩 가는 대신 한 번에 보드를 가로지릅니다.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "대각선으로 놓인 말 네 개, 각각 사이에 빈 칸이 하나씩 있습니다. 한쪽 끝의 빨간 말이 네 개를 모두 뛰어넘으며, 내려앉는 네 칸에 번호가 붙어 있습니다.",
  tekst: "한 수에 점프 네 번. 같은 말이 한 칸 이동만 했다면 한 번에 한 칸씩만 갔을 것입니다.",
})}
      <p>점프는 여섯 방향 모두, 뒤쪽으로도 가능하므로 사다리가 내 꼭짓점에서 시작할 필요는 없습니다. 사이에 빈 칸이 있는 말의 줄이라면 무엇이든 됩니다.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. 말을 가까이 모아 두세요</h2>
      <p>말 10개가 모두 목표에 있어야 하므로, 마지막 말이 언제 끝낼지를 정합니다. 옆에 말이 하나도 없는 말은 뛰어넘을 것이 없어서 한 칸 이동만 할 수 있습니다.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "아래쪽 꼭짓점에 빨간 말 하나가 혼자 있는 별 모양 보드. 비어 있는 이웃 칸 두 개만 표시되어 있습니다. 다른 빨간 말과 파란 말은 가운데에 있습니다.",
  tekst: "이 말은 이웃이 없어서 표시된 두 칸으로만 한 칸 이동할 수 있습니다.",
})}
      <p>내 꼭짓점 끝에서 보드 건너편 목표의 끝까지는 16칸입니다. 혼자 있는 말 하나에는 16번의 차례가 필요하지만, 사다리는 한 번에 건넙니다. 뒤쪽의 말은 주변에 뛰어넘을 말이 아직 있을 때 움직이세요. Leapstone의 컴퓨터도 그렇게 합니다. 가장 뒤에 있는 말의 수에 점수를 조금 더 줍니다.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. 가운데를 활용하세요</h2>
      <p>보드 가운데에 있는 말은 이웃 칸이 여섯 개여서 여섯 방향 모두로 이동하거나 점프할 수 있습니다. 가장자리의 말은 더 적습니다. 그림에서 가장자리의 말은 네 개입니다.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "가운데에 이웃 칸 여섯 개가 표시된 빨간 말 하나, 왼쪽 위 가장자리 근처에 이웃 칸 네 개가 표시된 빨간 말 하나가 있는 별 모양 보드.",
  tekst: "가운데에서는 이동 방향이 여섯, 가장자리에서는 넷.",
})}
      <p>가운데의 말은 다른 말이 건너가는 길에서 뛰어넘을 거리도 만들어 줍니다.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. 목표는 안쪽부터 채우세요</h2>
      <p>내 목표는 4, 3, 2, 1칸의 줄로 이루어진 10칸짜리 삼각형입니다. 안쪽 칸은 그 앞의 칸들을 지나서만 닿을 수 있습니다. 앞쪽을 먼저 채우면 마지막 말이 들어갈 길이 없을 수 있습니다.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "위쪽의 목표 꼭짓점에 빨간 말 아홉 개가 있고, 가장 안쪽 칸 하나가 점선으로 표시된 채 비어 있습니다. 흰 고리가 있는 열 번째 빨간 말이 맨 앞줄 아래에 서 있습니다.",
  tekst: "말 아홉 개는 도착했고 안쪽 칸이 비어 있습니다. 열 번째 말은 그 칸으로 들어갈 수 없습니다.",
})}
      <p>처음 말들은 안쪽 칸에 넣고 앞쪽으로 채워 나가세요. 그러면 마지막에 도착하는 말을 위해 앞쪽이 열려 있습니다.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. 내 목표에 있는 말을 가두지 마세요</h2>
      <p>다른 플레이어의 꼭짓점에도 멈출 수 있으므로, 다른 플레이어의 말이 내 목표에 있을 수 있습니다. 내 목표의 10칸 모두에 내 말이 있어야만 이깁니다. 그 말이 움직일 수 없다면 아무도 그 말을 움직일 수 없고, 그 옆 칸이 열릴 때까지 나는 이길 수 없습니다.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "위쪽의 목표 꼭짓점에 빨간 말 아홉 개가 있고, 가장 안쪽에 흰 고리로 표시된 파란 말 하나가 있습니다. 파란 말은 빨간 말들에 둘러싸여 있습니다.",
  tekst: "안쪽의 파란 말은 움직일 수 없고, 빨강은 목표를 채울 수 없습니다.",
})}
      <p>그런 말 옆 칸을 비워 두어 말이 나갈 수 있게 하세요. Leapstone의 컴퓨터도 이를 고려합니다. 다른 플레이어의 말을 그 목표 안에 가두는 수는 점수가 낮아집니다. 규칙은 누구에게도 내 목표에서 나가라고 강제하지 않으므로, 상대가 일부러 거기에 말을 세워 둘 수도 있습니다.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. 점프를 막거나, 그냥 두세요</h2>
      <p>점프하려면 내려앉을 빈 칸이 필요합니다. 그 칸을 채우면 점프는 사라집니다. 말 두 개가 연달아 있어도 뛰어넘을 수 없습니다.</p>
      <p>내 말은 상대에게도 디딤돌입니다. 왼쪽 그림에서 파랑은 한 수에 빨간 말 두 개를 건넙니다. 오른쪽에서는 빨강이 말 하나를 첫 번째 내려앉는 칸으로 옮겨서, 파랑은 한 칸 이동만 할 수 있습니다.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "파란 말 하나와 빨간 말 두 개가 한 줄로 놓여 있고, 각각 뒤에 빈 칸이 하나씩 있습니다. 화살표가 파란 말의 점프 두 번을 보여 줍니다.",
          tekst: "전: 파랑은 점프를 두 번 할 수 있습니다.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "빨강이 먼 쪽 말을 첫 번째 내려앉는 칸으로 옮긴 뒤의 같은 줄. 파란 말 다음에 빨간 말 두 개가 연달아 있습니다.",
          tekst: "후: 빨강이 말 하나를 옮겼습니다. 파랑은 점프할 수 없습니다.",
        })}
      </div>
      <p>막는 데 쓴 수는 내 전진에 쓰지 않은 수이므로, 그 점프가 내 수가 주는 것보다 상대에게 더 많이 줄 때 막으세요. 사다리를 만들 때는 반대가 됩니다. 내 수 다음에는 상대가 먼저 움직이므로, 한쪽 끝에 있는 상대의 말이 나보다 먼저 내 사다리를 이용합니다. 가장 어려운 레벨에서 컴퓨터는 수를 고르기 전에 각 상대의 가장 좋은 응수를 살펴봅니다.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">계속하기</h2>
      <ul>
        <li><a href="/play/">브라우저에서 컴퓨터와 대결</a>하며 사다리를 시험해 보세요.</li>
        <li><a href="/ko/guides/chinese-checkers-2-players">2인용 다이아몬드 게임</a>: 둘이서 하는 게임은 어떻게 진행되는지.</li>
        <li><a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>, 한 칸 이동, 점프, 연속 점프 그림과 함께.</li>
      </ul>
      <p><a href="/ko/guides/play-chinese-checkers-online-with-friends">친구와 온라인으로 하는 다이아몬드 게임</a></p>
      <p><a href="/ko/guides/halma-vs-chinese-checkers">할마와 다이아몬드 게임의 차이</a></p>
      <p><a href="/ko/guides/chinese-checkers-3-players">3인용 다이아몬드 게임</a></p>
    </section>`;

export default {
  nav: "다이아몬드 게임 전략",
  titel: "다이아몬드 게임 전략: 그림으로 보는 6가지 팁 | Leapstone",
  beschrijving: "다이아몬드 게임(차이니스 체커) 전략: 사다리 만들기, 말을 모아 두기, 가운데 활용하기, 목표를 안쪽부터 채우기, 점프를 막아야 할 때.",
  h1: "다이아몬드 게임 전략",
  intro: "별 보드를 위한 여섯 가지 팁입니다. 각각 실제 규칙에서 가져온 그림이 있습니다: 사다리, 뒤처진 말, 가운데, 목표 채우기, 점프 막기.",
  inhoud,
};
