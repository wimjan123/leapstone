// De Koreaanse spelregelpagina Halma (할마), taak 134. Inhoud: ../en/halma.mjs (nagelopen tegen crates/halma-core, zie docs/plan.md, taak 117), zin voor zin.
// Wie een regel wijzigt, wijzigt elke taal.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2명: 각 19개",
    alt: "왼쪽 위 모서리에 빨간 말 19개, 오른쪽 아래 모서리에 파란 말 19개가 놓인 정사각형 보드",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4명: 각 13개",
    alt: "네 모서리에 각각 말 13개가 놓인 정사각형 보드: 빨강은 왼쪽 위, 파랑은 오른쪽 위, 초록은 오른쪽 아래, 노랑은 왼쪽 아래",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">보드</h2>
      <p>할마는 16 x 16칸, 모두 256칸의 정사각형 보드에서 합니다. 모든 칸에는 최대 여덟 개의 이웃 칸이 있습니다: 상하좌우 네 칸과 대각선 네 칸. 가장자리의 칸은 이웃이 더 적고, 모서리는 세 칸입니다.</p>
      <p>이것이 Leapstone의 사각 보드입니다. 별 모양 보드에서 하는 게임을 안다면 <a href="/ko/rules/sternhalma">Sternhalma</a>와 <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>을 읽어 보세요.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">말이 시작하는 위치</h2>
      <p>할마는 2명 또는 4명이 합니다. 플레이어는 모두 보드 모서리에 있는 진영에서 말을 가지고 시작합니다. 맞은편 모서리의 진영이 내 목표입니다.</p>
      <ul>
        <li><strong>2명:</strong> 각 19개, 서로 마주 보는 두 모서리에서. 진영은 5, 5, 4, 3, 2칸으로 이루어진 다섯 줄입니다.</li>
        <li><strong>4명:</strong> 각 13개, 모서리마다 진영 하나씩. 진영은 4, 4, 3, 2칸으로 이루어진 네 줄입니다. 목표는 보드 대각선 건너편의 모서리입니다.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">차례</h2>
      <p>플레이어 1이 먼저 합니다. 그다음에는 순서대로 이어지고, 마지막 플레이어 다음에는 다시 플레이어 1의 차례입니다. Leapstone에서는 색이 번호와 짝을 이룹니다: 빨강, 파랑, 초록, 노랑.</p>
      <p>내 차례에는 말 하나를 한 번 움직입니다. 잡히는 말은 없습니다. 말은 그 플레이어가 기권할 때까지 보드에 남아 있습니다.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">한 칸 이동</h2>
      <p>말 하나를 바로 옆의 빈 칸으로, 여덟 방향 중 어느 쪽으로든 옮깁니다: 직선이든 대각선이든 상관없습니다.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "흰 고리로 둘러싸인 빨간 말. 이웃 칸 여덟 개 중 다섯 개는 비어 있고 표시되어 있으며, 나머지 세 개에는 말이 있습니다.",
  tekst: "빨간 말은 표시된 다섯 칸으로 한 칸 이동할 수 있습니다. 나머지 세 이웃 칸은 막혀 있습니다.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">점프</h2>
      <p>내 말 옆에 있는 말 하나를 색에 상관없이 뛰어넘어, 일직선으로 바로 뒤에 있는 빈 칸에 내려앉습니다. 여덟 방향 어디로든, 대각선과 뒤쪽으로도 점프할 수 있습니다.</p>
      <ul>
        <li>내려앉는 칸은 비어 있어야 합니다.</li>
        <li>말 두 개가 연달아 있으면 뛰어넘을 수 없고, 빈 칸도 뛰어넘을 수 없습니다.</li>
        <li>뛰어넘은 말은 제자리에 그대로 있습니다.</li>
        <li>보드의 가장자리 밖으로는 점프할 수 없습니다.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "빨간 말이 파란 말을 대각선으로 뛰어넘어 그 뒤의 빈 칸으로 가는 모습이 화살표로 표시되어 있습니다.",
  tekst: "빨간 말이 파란 말을 대각선으로 뛰어넘습니다.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">연속 점프</h2>
      <p>점프한 뒤에는 같은 말이 다시 점프할 수 있고, 할 수 있는 만큼 직선이든 대각선이든 어느 방향으로나 계속할 수 있습니다. 어디서 멈출지는 내가 정합니다. 모든 점프를 합쳐 한 수입니다.</p>
      <ul>
        <li>한 수 안에서는 같은 칸에 두 번 내려앉을 수 없습니다.</li>
        <li>한 수는 한 칸 이동이거나, 점프 한 번 이상입니다. 점프한 뒤에는 한 칸 이동을 할 수 없습니다.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "빨간 말이 한 수에 세 번 점프합니다. 파란 말을 대각선으로, 또 다른 파란 말을 직선으로, 빨간 말을 대각선으로 뛰어넘습니다. 내려앉는 세 칸에는 1, 2, 3 번호가 붙어 있습니다.",
  tekst: "점프 세 번으로 이루어진 한 수. 번호 순서대로입니다.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">목표</h2>
      <p>내가 시작한 곳의 맞은편 진영에 내 말을 모두 옮기면 이깁니다. 그 진영의 모든 칸에 내 말이 있어야 합니다: 2명이면 19칸, 4명이면 13칸. 다른 플레이어의 말이 거기 있는 동안에는 끝낼 수 없습니다.</p>
      <p>비어 있는 칸이라면 어디든 내려앉을 수 있고, 다른 플레이어의 진영도 마찬가지입니다. 내 목표에 있는 말도 다시 나갈 수 있습니다. 붙잡아 두는 것은 없습니다.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "2명이 하는 정사각형 보드. 빨강은 왼쪽 위에서 시작하고, 점선 원으로 표시되고 파란 말이 들어 있는 오른쪽 아래 진영이 빨강의 목표입니다.",
  tekst: "2명이 할 때 빨강의 목표는 파랑이 시작하는 진영입니다.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2명 또는 4명이 할 때</h2>
      <ul>
        <li><strong>2명:</strong> 목표를 먼저 채운 사람이 이기고, 게임이 끝납니다.</li>
        <li><strong>4명:</strong> 목표를 먼저 채운 사람이 이깁니다. 나머지는 다음 순위를 위해 계속하고, 끝낸 사람은 건너뜁니다. 한 명만 남아 플레이하게 되면 게임이 끝납니다.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">기권</h2>
      <p>기권하면 내 말이 보드에서 사라지므로 아무도 막지 않습니다. 2명이면 상대가 이깁니다. 4명이면 게임은 내가 없이 계속되고, 한 명을 빼고 모두 기권하면 마지막 한 명이 이깁니다.</p>
      <p>온라인 게임에서는 한 수마다 제한 시간이 있습니다. 게임을 시작한 플레이어가 정합니다. 시간이 다 되면 내 차례는 건너뜁니다. 3번 연속으로 차례를 놓치면 기권한 것으로 처리됩니다. 컴퓨터와 하는 게임과 휴대폰 한 대로 하는 게임에는 제한 시간이 없습니다.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">팁</h2>
      <ul class="tips">
        <li><strong>사다리를 만드세요.</strong> 목표를 향해 말 사이에 빈 칸을 하나씩 두고, 직선이든 대각선이든 한 줄로 놓으세요. 그러면 말 하나가 한 수 만에 그 줄 전체를 따라 점프할 수 있습니다.</li>
        <li><strong>어떤 말이든 사다리입니다.</strong> 어떤 색이든 뛰어넘을 수 있으니, 다른 플레이어의 말도 나를 도와줍니다. 내 사다리도 상대를 돕습니다. 내가 무엇을 남기는지 살펴보세요.</li>
        <li><strong>대각선을 활용하세요.</strong> 목표는 맞은편 모서리에 있으므로, 대각선으로 놓인 말의 줄이 건너가는 가장 빠른 길입니다.</li>
        <li><strong>뒤처진 말을 잊지 마세요.</strong> 말이 모두 도착해야 합니다. 뛰어넘을 말이 없이 멀리 뒤처진 말은 한 차례에 한 칸씩만 움직입니다. 다른 말이 아직 주변에 있을 때 함께 데려오세요.</li>
        <li><strong>내 시작이 상대의 목표입니다.</strong> 2명이 할 때 내 진영은 상대의 목표이고, 내 말이 하나라도 거기 남아 있으면 상대는 끝낼 수 없습니다. Leapstone에서는 말 하나를 집에 남겨 둘 수 있으므로, 이런 식으로 막을 수 있습니다. 나도 마찬가지입니다.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">자주 묻는 질문</h2>
      <h3>할마는 몇 명이 할 수 있나요?</h3>
      <p>두 명 또는 네 명이 할 수 있습니다. 할마는 16 x 16칸의 정사각형 보드에서 하며, 플레이어마다 모서리에서 시작합니다.</p>
      <h3>할마에서 플레이어마다 말이 몇 개인가요?</h3>
      <p>2명이면 각자 19개, 4명이면 각자 13개입니다.</p>
      <h3>할마는 누가 만들었나요?</h3>
      <p>미국의 외과 의사 조지 하워드 몽크스(George Howard Monks)가 1883년 또는 1884년에 만들었습니다. 이름은 그리스어로 “도약”이라는 뜻입니다. 자세한 내용은 <a href="/ko/rules/sternhalma">Sternhalma</a>에서 읽어 보세요.</p>
      <h3>할마와 다이아몬드 게임은 무엇이 다른가요?</h3>
      <p>할마는 사각 보드에서 여덟 방향으로 한 칸 이동과 점프를 하고, 각자 말이 19개 또는 13개입니다. 다이아몬드 게임은 별 모양 보드에서 여섯 방향이고, 각자 말이 10개이며, 2명, 3명, 4명 또는 6명이 합니다.</p>
      <h3>할마를 온라인에서 무료로 할 수 있나요?</h3>
      <p>네, Leapstone에서 브라우저나 App Store 앱으로 할 수 있습니다. 컴퓨터와 대결하기나 친구와 온라인으로 하기 같은 방식을 고른 다음, 사각 보드를 고르세요. Leapstone은 무료이며 광고가 없습니다.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">플레이하기</h2>
      <p>지금 플레이 버튼은 <a href="/ko/rules/chinese-checkers">별 보드</a>에서 컴퓨터와 하는 게임을 엽니다. 할마를 하려면 위쪽의 뒤로 가기 화살표를 누른 다음, 이 휴대폰에서 하기, 컴퓨터와 대결, 친구와 온라인으로 하기 중 하나를 고르고 사각 보드를 누르세요.</p>
    </section>`;

export default {
  nav: "할마 규칙",
  titel: "할마 규칙과 팁 | Leapstone",
  beschrijving: "16 x 16 정사각형 보드에서 할마 하는 방법: 시작, 한 칸 이동, 점프, 연속 점프, 이기는 방법, 팁. 브라우저에서 무료로 플레이하세요.",
  h1: "할마 규칙",
  intro: "다른 사람보다 먼저 내 말을 모두 정사각형 보드 건너편 모서리로 옮기세요. 규칙을 그림과 함께 간단히 정리하고, 팁도 몇 가지 소개합니다.",
  inhoud,
};
