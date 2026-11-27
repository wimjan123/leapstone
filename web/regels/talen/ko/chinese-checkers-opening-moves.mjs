// De Koreaanse gids Chinese checkers opening moves (다이아몬드 게임 첫 수), taak 303. Inhoud: ../en/chinese-checkers-opening-moves.mjs, zin voor zin.
// Elk getal en elke zet is nagelopen tegen crates/halma-core (docs/plan.md, taak 303). Wijzig je een zet, wijzig dan elke taal.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">첫 수: 14가지 선택</h2>
      <p>처음에는 말 10개가 4, 3, 2, 1개씩 줄을 이루어 삼각형을 채우고, 맨 앞줄은 보드 가운데를 향합니다. 삼각형 안에는 빈 칸이 없으므로 말은 바로 앞줄로만 갈 수 있습니다. 그래서 첫 수는 14가지입니다. 맨 앞줄의 말 4개는 각각 2칸으로 이동할 수 있고(8가지 이동), 두 번째 줄의 말 3개는 각각 앞쪽 말을 뛰어넘어 2칸으로 갈 수 있습니다(6가지 점프). 나머지 말 3개는 아직 움직일 수 없습니다.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "아래쪽의 빨간 꼭짓점과 말 10개, 그리고 그 바로 앞줄에 고리로 표시된 빈 칸 5개.",
  tekst: "첫 수는 모두 이 5칸 중 한 곳에서 끝납니다.",
})}
      <p>이 가이드에서 줄은 내 꼭짓점을 가로지르는, 앞쪽 가장자리와 나란한 칸의 선이며, 진행 정도는 줄 수로 셉니다. 이동은 말을 1줄 앞으로, 점프는 2줄 앞으로 보냅니다. 2, 3, 4, 6명이 하든 별의 어느 꼭짓점에서 시작하든 모든 플레이어의 첫 수는 같은 14가지입니다. 어느 꼭짓점이든 안쪽에서 보면 모양이 같기 때문입니다.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">오프닝 1: 뛰어나간 뒤 끝을 풀어 주기</h2>
      <p>꼭짓점 끝에 있는 말은 목표에서 가장 멀고, 처음에는 움직일 수 없습니다. 말 뒤의 칸이 비어 있을 때만 그 말을 뛰어넘을 수 있기 때문입니다. 두 번째 줄에서 점프하면 바로 그런 칸이 생깁니다.</p>
      <ol>
        <li><strong>1수:</strong> 두 번째 줄 오른쪽 끝의 말이 바로 앞의 말을 뛰어넘습니다. 꼭짓점 앞줄에 내려앉고 2줄을 나아갑니다.</li>
        <li><strong>2수:</strong> 끝의 말이 한 수에 두 번 점프합니다. 먼저 1수가 비운 칸으로, 그다음 두 번째 줄의 말을 넘습니다. 4줄을 나아갑니다.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "1수 뒤의 빨간 꼭짓점. 끝의 말에 고리가 있고, 숫자 1과 2가 붙은 화살표 2개가 비워진 칸을 지나 꼭짓점 앞줄로 가는 점프를 보여 준다.",
  tekst: "1수 뒤에 끝의 말이 점프 2번으로 빠져나옵니다.",
})}
      <p>2수에 6줄을 나아간 것입니다. 2수를 두는 모든 방법을 시험해 봤고, 얻을 수 있는 최대치는 6줄입니다. 거기에 닿는 수 쌍은 4가지뿐입니다. 두 번째 줄의 양쪽 끝 중 한 말이 2가지 방향 중 하나로 점프하고, 끝의 말이 뒤따릅니다. 두 번째 줄 가운데의 말은 끝을 계속 막아 두므로 맞지 않습니다.</p>
      <p>이제 두 말 모두 꼭짓점 앞줄에, 사이에 빈 칸을 두고 서 있습니다. 이것이 사다리의 첫걸음입니다.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">오프닝 2: 서로 다른 말 4개로 4수</h2>
      <p>4수에 얻을 수 있는 최대치는 13줄이고, 매 수마다 다른 말을 쓸 때만 거기에 닿습니다. 이 순서가 그렇게 합니다.</p>
      <ol>
        <li><strong>1수:</strong> 맨 앞줄 오른쪽 끝의 말이 앞으로 한 칸 이동합니다. 1줄을 나아갑니다.</li>
        <li><strong>2수:</strong> 세 번째 줄 오른쪽 끝의 말이 두 번 점프합니다. 4줄을 나아갑니다.</li>
        <li><strong>3수:</strong> 두 번째 줄 왼쪽 끝의 말이 두 번 점프합니다. 4줄을 나아갑니다.</li>
        <li><strong>4수:</strong> 끝의 말이 두 번 점프합니다. 4줄을 나아갑니다.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "시작 때의 빨간 꼭짓점. 움직일 말 4개에 수 순서대로 1부터 4까지 번호가 붙어 있다.",
          tekst: "전: 움직일 말, 순서대로.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "4수 뒤의 빨간 꼭짓점. 번호 붙은 말이 꼭짓점 앞줄의 칸 4곳에 내려앉았고, 꼭짓점에는 빈자리 4개가 남아 있다.",
          tekst: "후: 내려앉은 자리.",
        })}
      </div>
      <p>각 수는 다음 수를 준비합니다. 2수와 3수는 바로 앞에 움직인 말을 뛰어넘으며 끝나고, 4수는 3수가 남긴 빈자리를 통해 시작합니다. 말 4개 모두 보드의 내 쪽 절반에 내려앉습니다.</p>
      <p>13줄에 닿는 순서는 더 있습니다. 공통된 생각은 이것입니다. 다음 수를 위해 빈자리나 디딤돌을 남기는 수를 찾고, 늦어도 4수까지는 끝의 말을 내보내세요.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">첫 수에서 하는 실수</h2>
      <ul class="tips">
        <li><strong>매 차례 같은 말만 움직이기.</strong> 혼자 달리는 말은 4수에 5줄을 나아가는 반면, 서로 다른 말 4개는 13줄입니다. 게다가 나머지 말은 제자리에 남습니다.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "시작 때의 빨간 꼭짓점. 두 번째 줄의 말 하나가 화살표와 1부터 4까지의 번호로 한 선을 따라 연속 4수를 두고, 보드 가운데 근처에 혼자 남는다.",
  tekst: "말 하나, 4수, 5줄.",
})}
      <ul class="tips">
        <li><strong>맨 앞줄로 이동만 하기.</strong> 4번 이동하면 4줄입니다. 그 뒤에도 끝의 말은 움직일 수 없어서, 나머지가 앞서가는 동안 뒤에 남습니다.</li>
        <li><strong>옆으로 이동하기.</strong> 줄을 따라 옆으로 이동하면 0줄입니다. 오프닝 1의 1수 뒤에 앞에 있는 말이 옆 칸으로 이동할 수 있고, 나아가는 것처럼 보이지만 헛수입니다.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">이어서 해 보세요</h2>
      <p>4수쯤 지나면 두 군대가 가까워지고, 위의 오프닝은 게임의 중반으로 넘어갑니다. 이 순서를 외울 필요는 없습니다. 모든 수가 다음 수를 준비해야 한다는 것만 기억하세요.</p>
      <ul>
        <li><a href="/play/">브라우저에서 컴퓨터와 대결</a>하며 오프닝 1이나 2를 시험해 보세요.</li>
        <li><a href="/ko/guides/chinese-checkers-strategy">다이아몬드 게임 전략</a>: 사다리, 말을 모아 두기, 목표 채우기.</li>
        <li><a href="/ko/guides/chinese-checkers-2-players">2명이 하는 다이아몬드 게임</a>: 둘이서 하는 게임의 진행 방식.</li>
        <li><a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>, 이동, 점프, 연쇄 그림과 함께.</li>
      </ul>
    </section>`;

export default {
  nav: "다이아몬드 게임 첫 수",
  titel: "다이아몬드 게임 첫 수: 2가지 오프닝 | Leapstone",
  beschrijving: "다이아몬드 게임(차이니스 체커) 첫 수: 꼭짓점에서 뛰어나가는 법, 2수까지 끝의 말을 풀어 주기, 4수에 13줄 나아가기, 피해야 할 실수.",
  h1: "다이아몬드 게임 첫 수",
  intro: "다이아몬드 게임의 좋은 오프닝은 두 번째 줄에서 뛰어나가고, 매 차례 다른 말을 쓰고, 2수나 4수까지 끝의 말을 내보냅니다. 그림과 함께 두 가지 오프닝과 피해야 할 실수를 소개합니다.",
  inhoud,
};
