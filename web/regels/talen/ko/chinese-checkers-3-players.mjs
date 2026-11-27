// De Koreaanse gids Chinese checkers for 3 players (3인용 다이아몬드 게임), taak 299. Inhoud: ../en/chinese-checkers-3-players.mjs (regels uit crates/halma-core, zie docs/plan.md, taak 139), zin voor zin.
// Het adres is /ko/guides/chinese-checkers-3-players (zie paginas.mjs).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">게임이 시작되는 모습</h2>
      <p>플레이어마다 말이 10개이므로 121칸의 보드 위에 말 30개가 서 있습니다. 말은 별의 꼭짓점을 하나씩 건너뛰며 시작합니다: 빨강은 아래쪽, 파랑은 왼쪽 위, 초록은 오른쪽 위. 그 사이의 세 꼭짓점은 비어 있습니다.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "아래쪽 꼭짓점에 빨간 말 10개, 왼쪽 위 꼭짓점에 파란 말 10개, 오른쪽 위 꼭짓점에 초록 말 10개가 놓인 별 모양 보드",
  tekst: "빨강은 아래쪽, 파랑은 왼쪽 위, 초록은 오른쪽 위입니다.",
})}
      <p>플레이어 1, 빨강이 먼저 움직입니다. 그다음 파랑이 플레이어 2, 초록이 플레이어 3이고, 초록 다음에는 다시 빨강입니다. 한 수는 말 하나의 한 칸 이동 또는 연속 점프입니다. 한 칸 이동과 점프는 <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>을 보세요.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">세 개의 목표, 시작할 때는 모두 비어 있습니다</h2>
      <p>내 목표는 내가 시작한 곳의 맞은편 꼭짓점이며, 3명이 할 때는 처음에 비어 있습니다. 그곳은 나머지 두 플레이어의 시작 위치 사이에 있는 빈 꼭짓점입니다. 빨강의 목표는 위쪽, 파랑은 오른쪽 아래, 초록은 왼쪽 아래입니다.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "3명용 별 모양 보드. 각 플레이어 색의 점선 원이 비어 있는 세 목표를 표시합니다: 빨강은 위쪽, 파랑은 오른쪽 아래, 초록은 왼쪽 아래.",
  tekst: "각 목표는 해당 플레이어의 색입니다.",
})}
      <p>내 말 10개를 모두 목표로 옮기면 이깁니다. 10칸 모두에 내 말이 있어야 합니다. 내 목표에서 시작하는 사람은 없지만 빈 칸이라면 어디든 멈출 수 있으므로, 다른 플레이어의 말이 나중에 그곳에 내려앉을 수 있습니다. 그 말이 거기 있는 동안에는 끝낼 수 없습니다.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">승리, 그리고 그다음</h2>
      <ul>
        <li><strong>승리:</strong> 목표를 먼저 채운 사람이 이깁니다. 게임은 거기서 끝나지 않습니다. 나머지 두 사람이 다음 순위를 위해 계속하며, 끝낸 사람은 건너뜁니다. 아직 하고 있는 사람이 한 명만 남으면 게임이 끝납니다.</li>
        <li><strong>기권:</strong> 내 말이 보드에서 사라지고 나머지 두 사람이 계속합니다. 아무도 끝내기 전에 두 번째 사람이 기권하면 마지막에 남은 플레이어가 이깁니다.</li>
        <li><strong>시간(온라인):</strong> 온라인 게임에서는 한 수마다 제한 시간이 있으며, 게임을 시작한 플레이어가 정합니다. 시간이 다 되면 내 차례는 건너뜁니다. 3번 연속으로 차례를 놓치면 기권하게 되고, 게임은 나 없이 이어집니다.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">2명이 하는 게임과의 차이</h2>
      <ul>
        <li><strong>더 많은 말:</strong> 보드에 30개, 2명일 때는 20개입니다.</li>
        <li><strong>빈 목표:</strong> 2명일 때는 내 목표가 처음에 상대의 말로 가득 차 있습니다. 3명일 때는 처음에 비어 있습니다.</li>
        <li><strong>상대 두 명:</strong> 내가 둔 뒤 내 차례가 다시 오기 전에 다른 두 플레이어가 움직입니다. 두 사람의 말은 나에게 디딤돌이 되고, 내 말은 그들에게 디딤돌이 됩니다. 내가 만든 사다리는 둘 다 이용할 수 있고, 내 다음 차례인 플레이어가 먼저 쓸 수 있습니다.</li>
        <li><strong>게임이 계속됩니다:</strong> 2명일 때는 한 사람이 끝내면 게임이 끝납니다. 3명일 때는 두 번째와 세 번째 순위를 가리기 위해 계속됩니다.</li>
      </ul>
      <p>둘이서 하는 게임은 <a href="/ko/guides/chinese-checkers-2-players">2인용 다이아몬드 게임</a>을 읽어 보세요. <a href="/ko/guides/chinese-checkers-strategy">전략 팁</a>은 한 칸 이동과 점프에 관한 것이며, 3명일 때도 같습니다.</p>
      <p><a href="/ko/guides/play-chinese-checkers-online-with-friends">친구와 온라인으로 하는 다이아몬드 게임</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone에서 3명이 플레이할 수 있는 곳</h2>
      <ul>
        <li><strong>컴퓨터와 대결, 바로 지금:</strong> <a href="/play/">브라우저에서 Leapstone</a>을 열고 컴퓨터를 누른 뒤 별 보드와 컴퓨터 2대를 고르세요. 나는 플레이어 1이어서 먼저 움직입니다. 컴퓨터는 쉬움, 보통, 어려움 중에서 고를 수 있습니다.</li>
        <li><strong>휴대폰 한 대로:</strong> “이 휴대폰에서”를 누르고 별 보드와 3명을 고른 뒤, 말을 눌러 그 자리를 사람과 컴퓨터 사이에서 바꾸세요.</li>
        <li><strong>친구와 온라인으로:</strong> 친구를 누르고 별 보드, 3명, 한 수당 시간을 고른 뒤 초대 링크를 보내세요. 3자리가 모두 차면 게임이 시작됩니다.</li>
        <li><strong>빠른 게임:</strong> 온라인 플레이는 2명 또는 4명이 하는 게임을 찾으므로 3명이 하는 빠른 게임은 없습니다.</li>
      </ul>
    </section>`;

export default {
  nav: "3인용 다이아몬드 게임",
  titel: "3인용 다이아몬드 게임: 규칙 | Leapstone",
  beschrijving: "3명이 하는 다이아몬드 게임(차이니스 체커): 말 30개가 시작하는 위치, 세 개의 빈 목표, 누가 먼저 움직이는지, 이기는 방법.",
  h1: "3인용 다이아몬드 게임",
  intro: "별 보드에서 셋이서 하는 게임은 어떻게 진행될까요: 시작 위치, 세 개의 목표, 누가 먼저 움직이는지, 이기는 방법, 플레이할 수 있는 곳.",
  inhoud,
};
