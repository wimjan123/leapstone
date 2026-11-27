// De gids Halma tegenover Chinese checkers in het Koreaans, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "다이아몬드 게임: 별 모양 보드, 121칸",
    alt: "아래쪽 꼭짓점에 빨간 말 10개, 위쪽 꼭짓점에 파란 말 10개가 놓인 별 모양 보드",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "할마: 정사각형 보드, 256칸",
    alt: "왼쪽 위 모서리에 빨간 말 19개, 오른쪽 아래 모서리에 파란 말 19개가 놓인 정사각형 보드",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "별 모양 보드: 이웃 칸 여섯 개, 여기서는 세 개가 비어 있음",
    alt: "흰 고리로 둘러싸인 빨간 말. 이웃 칸 여섯 개 중 세 개는 비어 있고 표시되어 있으며, 나머지 세 개에는 말이 있습니다.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "정사각형 보드: 이웃 칸 여덟 개, 여기서는 다섯 개가 비어 있음",
    alt: "흰 고리로 둘러싸인 빨간 말. 이웃 칸 여덟 개 중 다섯 개는 비어 있고 표시되어 있으며, 나머지 세 개에는 말이 있습니다.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">짧은 답</h2>
      <p>할마는 정사각형 보드에서, 다이아몬드 게임은 여섯 꼭짓점의 별 모양 보드에서 합니다. 두 게임 모두 말을 한 칸 이동이나 점프로 보드 건너편까지 옮기고, 반대편의 진영을 먼저 채운 플레이어가 이깁니다.</p>
      <p>다른 점은 보드, 움직이는 방향, 함께 할 수 있는 사람 수, 그리고 각자가 가진 말의 수입니다. <a href="/ko/rules/sternhalma">Sternhalma</a>는 별 모양 보드에서 하는 할마를 가리키는 이름이므로, 다이아몬드 게임과 같은 게임입니다.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">보드</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>다이아몬드 게임</strong>은 별 모양 보드를 씁니다. 121칸이고, 여섯 개의 끝에 각각 10칸짜리 꼭짓점이 있습니다. 꼭짓점은 4, 3, 2, 1칸의 줄로 이루어진 삼각형입니다.</li>
        <li><strong>할마</strong>는 정사각형 보드를 씁니다. 16 x 16칸으로 모두 256칸입니다. 진영은 모서리에 있습니다. 큰 진영은 5, 5, 4, 3, 2칸의 줄로, 작은 진영은 4, 4, 3, 2칸의 줄로 이루어집니다.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">방향: 여섯 개 또는 여덟 개</h2>
      <p>별 모양 보드에서 한 칸에는 이웃 칸이 여섯 개 있습니다. 정사각형 보드에서는 대각선도 세기 때문에 여덟 개입니다. 한 칸 이동은 빈 이웃 칸으로 가는 것입니다. 점프는 내 말 옆에 있는 말 하나를 일직선으로 뛰어넘어 바로 뒤의 빈 칸에 내려앉는 것이고, 어느 방향으로든, 뒤쪽으로도 할 수 있습니다.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>가장자리의 칸은 이웃이 더 적고, 정사각형 보드의 모서리는 세 칸입니다. 여섯 방향이면 별 모양 보드에서 한 칸을 지나는 선이 세 개가 됩니다. 여덟 방향이면 정사각형 보드에서는 네 개가 됩니다: 가로, 세로, 그리고 두 대각선.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">플레이어와 말</h2>
      <ul>
        <li><strong>다이아몬드 게임:</strong> 2명, 3명, 4명 또는 6명. 모두 말이 10개이므로 보드에는 말이 20개, 30개, 40개 또는 60개 놓입니다.</li>
        <li><strong>할마:</strong> 2명 또는 4명. 2명이면 각자 19개로 모두 38개입니다. 4명이면 각자 13개로 모두 52개입니다.</li>
      </ul>
      <p>Leapstone에서 정사각형 보드에는 3명이나 6명이 하는 게임이 없습니다. 세 명이 하는 게임이라면 <a href="/ko/guides/chinese-checkers-3-players">3인용 다이아몬드 게임</a> 글을 읽어 보세요.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">같은 점</h2>
      <ul>
        <li><strong>한 수:</strong> 한 칸 이동이거나, 말 하나로 이어 가는 연속 점프입니다. 연속 점프를 어디서 멈출지는 내가 정하며, 점프한 뒤에는 한 칸 이동을 할 수 없습니다.</li>
        <li><strong>어떤 색이든:</strong> 어떤 색의 말이든, 내 말도 뛰어넘을 수 있습니다. 뛰어넘은 말은 제자리에 그대로 있습니다. 잡히는 말은 없습니다.</li>
        <li><strong>목표:</strong> 내가 시작한 곳의 맞은편 진영입니다. 그 진영의 모든 칸에 내 말이 있어야 합니다. 다른 플레이어의 말이 거기 있는 동안에는 끝낼 수 없습니다.</li>
        <li><strong>승리:</strong> 목표를 먼저 채운 플레이어가 이깁니다. 2명이면 그때 게임이 끝납니다. 더 많으면 나머지는 다음 순위를 위해 계속하고, 끝낸 플레이어는 건너뜁니다.</li>
        <li><strong>기권과 시간:</strong> 기권하면 내 말이 보드에서 사라집니다. 온라인 게임에서는 한 수마다 제한 시간이 있고, 3번 연속으로 차례를 놓치면 기권한 것으로 처리됩니다.</li>
      </ul>
      <p><a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>과 <a href="/ko/rules/halma">할마 규칙</a>의 전체 내용을 읽어 보세요.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Leapstone에서 어떤 보드를 고를까</h2>
      <ul>
        <li><strong>3명 또는 6명:</strong> 별 모양 보드에만 있습니다.</li>
        <li><strong>각자 말이 더 많이:</strong> 정사각형 보드입니다. 2명이면 각자 19개, 4명이면 13개로, 별 모양 보드의 10개보다 많습니다.</li>
        <li><strong>온라인 플레이:</strong> 빠른 게임은 별 모양 보드에서 합니다. 친구와 하거나 컴퓨터와 할 때는 어느 보드든 고를 수 있습니다.</li>
      </ul>
      <p>지금 플레이 버튼은 별 모양 보드에서 컴퓨터와 하는 게임을 엽니다. 정사각형 보드에서 하려면 위쪽의 뒤로 가기 화살표를 누른 다음, 메뉴에서 사각 보드를 고르세요.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">더 알아보기</h2>
      <ul>
        <li><a href="/play/">브라우저에서 플레이</a>하며 두 보드를 모두 해 보세요.</li>
        <li><a href="/ko/guides/chinese-checkers-strategy">다이아몬드 게임 전략</a>: 그림과 함께하는 여섯 가지 팁.</li>
        <li><a href="/ko/guides/chinese-checkers-2-players">2인용 다이아몬드 게임</a>: 둘이 하는 게임의 진행 방식.</li>
      </ul>
      <p><a href="/ko/guides/play-chinese-checkers-online-with-friends">친구와 온라인으로 하는 다이아몬드 게임</a></p>
    </section>`;

export default {
  nav: "할마와 다이아몬드 게임의 차이",
  titel: "할마와 다이아몬드 게임의 차이 | Leapstone",
  beschrijving: "할마일까, 다이아몬드 게임일까? 사각 보드와 별 모양 보드, 여섯 또는 여덟 방향, 플레이어 수와 말의 수, 같은 점을 알려 드립니다.",
  h1: "할마와 다이아몬드 게임의 차이",
  intro: "생각은 하나인 두 게임: 내 말을 모두 보드 건너편으로 옮기세요. 무엇이 다르고 무엇이 같은지, 두 게임을 어디서 할 수 있는지 알려 드립니다.",
  inhoud,
};
