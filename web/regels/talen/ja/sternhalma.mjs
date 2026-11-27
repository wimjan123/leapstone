// 日本語のページ「Sternhalma」, taak 134. Inhoud: ../en/sternhalma.mjs zin voor zin. De bronnen voor de geschiedenis staan in de Engelse
// versie. Wie een feit wijzigt, wijzigt elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">名前の意味</h2>
      <p>Sternhalma(シュテルンハルマ)は、星型のボードで遊ぶハルマのドイツ語名です。<em>Stern</em>はドイツ語で「星」の意味です。チャイニーズチェッカーという名前は、同じゲームにあとからアメリカでつけられた名前です。</p>
      <p>Leapstoneでは、これが<strong>星型ボード</strong>です。<a href="/ja/rules/chinese-checkers">ダイヤモンドゲームのルール</a>のボードのことです。</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">由来</h2>
      <ul>
        <li><strong>ハルマ</strong>は、1883年または1884年に、アメリカの外科医ジョージ・ハワード・モンクスが考案しました。名前はギリシャ語で「跳ぶ」という意味です。四角いボードで遊びます。<a href="/ja/rules/halma">ハルマのルールを読む</a>。</li>
        <li><strong>Stern-Halma</strong>は、1892年にドイツで登場しました。考え方は同じで、六つの角を持つ星の形のボードを使います。</li>
        <li><strong>チャイニーズチェッカー</strong>は、ビルとジャックのプレスマン兄弟が、1928年にアメリカでこのゲームにつけた名前で、最初は「Hop Ching checkers」でした。このゲームは中国とは歴史的なつながりがなく、チェッカー(ドラフツ)のゲームでもありません。</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">ゲームの違い</h2>
      <ul>
        <li><strong>ハルマ:</strong> 縦16マス、横16マスの四角いボードで、2人または4人用。コマの隣のマスは、縦横と斜めの八つです。2人なら各19個、4人なら各13個のコマを持ちます。</li>
        <li><strong>SternhalmaとChinese checkers:</strong> 121マスの星型ボードで、2、3、4、6人用。コマの隣のマスは六つです。誰でも10個のコマを持ちます。</li>
        <li><strong>それ以外は同じ:</strong> 空いている隣のマスへ歩くか、コマを一個飛び越えて、連続ジャンプもできます。ボードの反対側の陣地を先に埋めた人が勝ちです。</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">バリエーションと、Leapstoneのルール</h2>
      <p>ハルマは、いくつかの違う方法で遊ばれてきました。調べた資料にあったバリエーションと、Leapstoneとの比較は次のとおりです。</p>
      <ul>
        <li><strong>ボードの大きさ。</strong> ハルマは8×8や10×10のボードでも遊ばれます。Leapstoneにあるのは、16×16のボードだけです。</li>
        <li><strong>ゴールから出る。</strong> あるハルマのルールでは、相手の陣地に入ったコマは、もうそこから出られません。Leapstoneにこのルールはなく、そのコマをまた動かせます。</li>
        <li><strong>星型ボードで三人。</strong> 星型ボードで三人で遊ぶ昔のハルマは、各15個のコマとされています。Leapstoneでは、星型ボードで3人が各10個のコマで遊びます。</li>
        <li><strong>ジャンプは自由。</strong> ジャンプをしなければならないことはありません。手を終えるマスは自分で選べます。</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstoneで遊ぶ</h2>
      <p>「今すぐ遊ぶ」を押すと、星型ボードでコンピューターと対戦するゲームが開きます。四角いボードで遊ぶには、上の戻る矢印をタップして、メニューから四角いボードを選びます。</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "星型ボード。下の角に赤いコマ10個、上の角に青いコマ10個",
  tekst: "2人用の星型ボード。",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalmaとは? 星型ボードのハルマ | Leapstone",
  beschrijving: "Sternhalmaは、星型ボードで遊ぶハルマのドイツ語名です。ハルマやチャイニーズチェッカーとの関係、違い、ブラウザーで無料で遊ぶ方法を紹介します。",
  h1: "Sternhalma、ハルマ、チャイニーズチェッカー",
  intro: "よく似たゲームにつけられた三つの名前。それぞれの意味、由来、違いを紹介します。",
  inhoud,
};
