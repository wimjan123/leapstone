// De Koreaanse spelregelpagina Sternhalma, taak 134. Inhoud: ../en/sternhalma.mjs (bronnen en wat weggelaten is: zie dat bestand), zin voor zin.
// Wat Leapstone doet staat in crates/halma-core (Board::star, Board::square, Game).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">이름의 뜻</h2>
      <p>Sternhalma는 별 모양 보드에서 하는 할마를 가리키는 독일어 이름입니다. <em>Stern</em>은 독일어로 별이라는 뜻입니다. 차이니스 체커라는 이름은 같은 게임에 나중에 미국에서 붙은 이름입니다.</p>
      <p>Leapstone에서는 이것이 <strong>별 보드</strong>입니다. <a href="/ko/rules/chinese-checkers">다이아몬드 게임 규칙</a>의 보드입니다.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">어디서 왔을까</h2>
      <ul>
        <li><strong>할마</strong>는 1883년 또는 1884년에 미국의 외과 의사 조지 하워드 몽크스가 발명했습니다. 이름은 그리스어로 &ldquo;뛰다&rdquo;라는 뜻입니다. 정사각형 보드에서 합니다. <a href="/ko/rules/halma">할마 규칙 읽기</a>.</li>
        <li><strong>Stern-Halma</strong>는 1892년 독일에서 나왔습니다. 같은 아이디어를 꼭짓점이 여섯 개인 별 모양 보드에 옮긴 것입니다.</li>
        <li><strong>차이니스 체커</strong>는 1928년 미국에서 빌 프레스먼과 잭 프레스먼이 이 게임에 붙인 이름으로, 처음에는 &ldquo;Hop Ching checkers&rdquo;였습니다. 이 게임은 중국과 역사적인 관련이 없고, 체커 게임도 아닙니다.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">게임들은 어떻게 다를까</h2>
      <ul>
        <li><strong>할마:</strong> 16 x 16칸의 정사각형 보드, 2명 또는 4명용. 말 하나에는 직선과 대각선으로 여덟 개의 이웃 칸이 있습니다. 2명이면 각자 말이 19개, 4명이면 13개입니다.</li>
        <li><strong>Sternhalma와 차이니스 체커:</strong> 121칸의 별 모양 보드, 2, 3, 4, 6명용. 말 하나에는 이웃 칸이 여섯 개 있습니다. 모두 말이 10개입니다.</li>
        <li><strong>나머지는 같습니다:</strong> 빈 이웃 칸으로 한 칸 이동하거나, 말 하나를 뛰어넘는 점프를 하고, 연속 점프도 할 수 있습니다. 보드 건너편의 진영을 먼저 채운 사람이 이깁니다.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">변형 규칙, 그리고 Leapstone의 방식</h2>
      <p>할마는 여러 방식으로 해 왔습니다. 우리가 찾은 자료의 변형 규칙과 Leapstone을 비교하면 다음과 같습니다.</p>
      <ul>
        <li><strong>보드 크기.</strong> 할마는 8 x 8과 10 x 10 보드에서도 합니다. Leapstone에는 16 x 16 보드만 있습니다.</li>
        <li><strong>목표에서 나가기.</strong> 어떤 할마 규칙에서는 상대 진영에 들어간 말은 다시 나올 수 없습니다. Leapstone에는 이 규칙이 없습니다. 그런 말도 다시 움직일 수 있습니다.</li>
        <li><strong>별 모양 보드에서 세 명.</strong> 별 모양 보드에서 세 명이 하는 옛 할마는 각자 말 15개로 설명됩니다. Leapstone은 별 모양 보드에서 3명이 각자 말 10개로 합니다.</li>
        <li><strong>점프는 내 선택입니다.</strong> 반드시 점프해야 하는 것은 아닙니다. 내 수가 끝나는 칸은 내가 고릅니다.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone에서 플레이하기</h2>
      <p>지금 플레이 버튼은 별 보드에서 컴퓨터와 하는 게임을 엽니다. 사각 보드는 위쪽의 뒤로 가기 화살표를 누른 다음 메뉴에서 사각 보드를 고르세요.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "아래쪽 꼭짓점에 빨간 말 10개, 위쪽 꼭짓점에 파란 말 10개가 놓인 별 모양 보드",
  tekst: "2명이 하는 별 보드.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma란? 별 보드에서 하는 할마 | Leapstone",
  beschrijving: "Sternhalma는 별 모양 보드에서 하는 할마의 독일어 이름입니다. 할마, 다이아몬드 게임과의 관계와 무료로 플레이하는 방법을 알려 드립니다.",
  h1: "Sternhalma, 할마, 차이니스 체커",
  intro: "서로 가까운 게임에 붙은 세 가지 이름. 각각이 무슨 뜻인지, 어디서 왔는지, 어떻게 다른지 알아봅니다.",
  inhoud,
};
