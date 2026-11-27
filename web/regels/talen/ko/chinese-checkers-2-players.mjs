// De Koreaanse gids Chinese checkers for 2 players (2인용 다이아몬드 게임), taak 134. Inhoud: ../en/chinese-checkers-2-players.mjs (regels uit crates/halma-core, zie docs/plan.md, taak 122), zin voor zin.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">게임이 시작되는 모습</h2>
      <p>플레이어마다 말이 10개입니다. 말은 서로 마주 보는 별의 두 꼭짓점에서 시작합니다: 빨강은 아래쪽, 파랑은 위쪽. 말 20개가 121칸의 보드 위에 서 있습니다.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "아래쪽 꼭짓점에 빨간 말 10개, 위쪽 꼭짓점에 파란 말 10개가 놓인 별 모양 보드",
  tekst: "빨강은 아래쪽, 파랑은 위쪽에서 시작합니다.",
})}
      <p>플레이어 1, 빨강이 먼저 움직입니다. 그다음에는 한 수씩 번갈아 합니다. 한 수는 말 하나의 한 칸 이동 또는 연속 점프입니다. 한 칸 이동과 점프는 <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>을 보세요.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">내 목표는 상대가 시작한 곳입니다</h2>
      <p>상대 플레이어가 시작한 꼭짓점에 내 말 10개를 모두 옮기면 이깁니다. 그 꼭짓점은 상대의 말로 가득 찬 채 시작하고, 내 꼭짓점은 내 말로 가득합니다. 빨강에게는 위의 그림에서 위쪽 꼭짓점이 그곳입니다.</p>
      <p>빈 칸에만 내려앉을 수 있으므로, 서로 상대가 채우기 전에 자기 꼭짓점을 비워야 합니다. 상대의 말이 목표에 남아 있는 동안에는 어느 쪽도 끝낼 수 없습니다. 그리고 같은 가운데를 반대 방향으로 건너기 때문에, 상대의 말은 나에게, 내 말은 상대에게 디딤돌이 됩니다. 이를 어떻게 활용할지는 <a href="/ko/guides/chinese-checkers-strategy">전략 팁</a>을 읽어 보세요.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">승리와 기권</h2>
      <ul>
        <li><strong>승리:</strong> 말 10개로 목표를 먼저 채운 사람이 이기고, 게임은 곧바로 끝납니다. 상대는 계속하지 않습니다.</li>
        <li><strong>기권:</strong> 내 말이 보드에서 사라지고 상대가 이깁니다.</li>
        <li><strong>시간(온라인):</strong> 온라인 게임에서는 한 수마다 제한 시간이 있습니다. 시간이 다 되면 내 차례는 건너뜁니다. 3번 연속으로 차례를 놓치면 기권한 것으로 처리됩니다.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">3명, 4명, 6명일 때의 차이</h2>
      <ul>
        <li><strong>3명:</strong> 말은 하나씩 건너뛴 꼭짓점에서 시작하고, 세 목표는 비어 있는 채로 시작합니다. 먼저 끝낸 사람이 이기고, 나머지는 다음 순위를 위해 계속하며, 끝낸 사람은 건너뜁니다.</li>
        <li><strong>4명:</strong> 나란히 붙은 꼭짓점 두 쌍. 내 목표는 다른 플레이어의 말로 가득 찬 채 시작합니다. 먼저 끝낸 사람이 나온 뒤에도 게임은 3명일 때처럼 이어집니다.</li>
        <li><strong>6명:</strong> 여섯 꼭짓점 모두. 2명일 때 20개인 것과 달리 보드에는 말이 60개 있습니다.</li>
      </ul>
      <p>보드에 말이 20개뿐이면 뛰어넘을 말이 적으므로 내가 직접 만드는 사다리가 더 중요해집니다. <a href="/ko/rules/chinese-checkers">규칙 페이지</a>에 모든 시작 위치의 그림이 있습니다.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone에서 2명이 플레이할 수 있는 곳</h2>
      <ul>
        <li><strong>컴퓨터와 대결, 바로 지금:</strong> <a href="/play/">브라우저에서 Leapstone</a>을 열고 컴퓨터를 누른 뒤 별 보드를 고르세요. 기본값은 컴퓨터 한 명이므로 2명이 하는 게임입니다. 쉬움, 보통, 어려움 중에서 고르며, 나는 플레이어 1이어서 먼저 움직입니다. 쉬움은 무작위 수 세 개 중 가장 좋은 것을 고릅니다. 보통은 목표를 향해 가장 많이 전진하는 수를 고릅니다. 어려움은 상대가 어떻게 응수할 수 있는지와 자신의 다음 수도 살펴봅니다.</li>
        <li><strong>앱에서 온라인 플레이:</strong> 별 보드에서 2명이 하는 빠른 게임으로, 같은 레벨의 다른 플레이어와 한 수당 30초로 합니다. 온라인 상대 중 일부는 컴퓨터 플레이어일 수 있습니다.</li>
        <li><strong>친구와 함께:</strong> 초대 링크를 보내고, 한 수당 제한 시간은 직접 정하세요. 또는 휴대폰 한 대를 서로 넘겨 가며 하세요.</li>
      </ul>
      <p><a href="/ko/guides/play-chinese-checkers-online-with-friends">친구와 온라인으로 하는 다이아몬드 게임</a></p>
      <p><a href="/ko/guides/chinese-checkers-3-players">3인용 다이아몬드 게임</a></p>
    </section>`;

export default {
  nav: "2인용 다이아몬드 게임",
  titel: "2인용 다이아몬드 게임: 시작과 규칙 | Leapstone",
  beschrijving: "2명이 하는 다이아몬드 게임(차이니스 체커): 말 10개가 시작하는 위치, 누가 먼저 움직이는지, 이기거나 기권하는 방법, 무료로 플레이할 수 있는 곳.",
  h1: "2인용 다이아몬드 게임",
  intro: "별 보드에서 둘이서 하는 게임은 어떻게 진행될까요: 시작 위치, 누가 먼저 움직이는지, 이기는 방법, 플레이할 수 있는 곳.",
  inhoud,
};
