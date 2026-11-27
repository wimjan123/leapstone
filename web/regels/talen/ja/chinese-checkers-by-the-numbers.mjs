// 数字で見るダイヤモンドゲーム, Japans (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
// Geen cijfers buiten f(): "二人", "十個" in woorden, zoals "two players" en "ten pieces" in het Engels.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">マスとコマ</h2>
      <p>Leapstoneの二つのボードで、ゲームの開始時の配置で数えました。</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "六つの角がすべて埋まった星型ボード。空いた真ん中のまわりに、六色それぞれ十個ずつのコマ。",
  tekst: "六人で遊ぶゲームの開始時の星型ボード。",
})}
      <ul class="tips">
        <li><strong>星型ボードには${f("sterbord_vakken")}マスあります。</strong>プレイヤーはそれぞれ${f("sterbord_stenen_per_speler")}個のコマで始めます。つまりボード上のコマは、二人で遊ぶときは${f("sterbord_stenen_2_spelers")}個、三人では${f("sterbord_stenen_3_spelers")}個、四人では${f("sterbord_stenen_4_spelers")}個、六人では${f("sterbord_stenen_6_spelers")}個です。</li>
        <li><strong>ハルマの正方形のボードには${f("vierkant_vakken")}マスあります。</strong>二人で遊ぶときは、それぞれ${f("vierkant_stenen_per_speler_2_spelers")}個のコマで始め、全部で${f("vierkant_stenen_2_spelers")}個です。四人で遊ぶときは、それぞれ${f("vierkant_stenen_per_speler_4_spelers")}個で始め、全部で${f("vierkant_stenen_4_spelers")}個です。</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">いちばん長い連続ジャンプ: ${f("langste_sprongketen")}回</h2>
      <p>星型ボードでは、一つのコマが<strong>一回の手で${f("langste_sprongketen")}回ジャンプ</strong>でき、Leapstoneのルールではそれより多いジャンプを含む手はありません。この数にするために、ほかのコマは自由に置いてあります。コマが飛び越えるマスのそれぞれに一つずつです。</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "赤いコマ一つと、たくさんの青いコマがある星型ボード。白い矢印が、長く曲がりくねった道に沿って、赤いコマが青いコマを次々に飛び越えるようすを示しています。",
  tekst: "いちばん長い連続ジャンプ: 赤いコマが青いコマを一つずつ、次々に飛び越えます。",
})}
      <p><strong>数え方。</strong>ジャンプはいつもまっすぐ二マス先に着地します。そのため、ジャンプを続けるコマが行けるのは一部のマスだけです。ボードはこうしたグループ四つに分かれ、いちばん大きいグループには${f("grootste_klasse_vakken")}マスあります。Leapstoneでは、一回の手の中で同じマスに二度着地することも、出発したマスに着地することもできません。そのため連続ジャンプは、グループ内のほかのマスのそれぞれに、多くても一度しか着地しません。プログラムはこのグループを調べ、${f("grootste_klasse_vakken")}マスすべてを通る道を見つけました。だからこれより長い連続ジャンプはありえず、${f("langste_sprongketen")}回が最長です。そのあとテストが、この手をLeapstoneのルールで実際に指します。</p>
      <p><strong>本物のゲームではありません。</strong>この連続ジャンプには、ほかのコマが${f("langste_sprongketen")}個、それぞれちょうど正しいマスに必要です。二人や三人のゲームではコマは${f("sterbord_stenen_2_spelers")}個か${f("sterbord_stenen_3_spelers")}個しかなく、足りません。四人や六人のゲームなら${f("sterbord_stenen_4_spelers")}個か${f("sterbord_stenen_6_spelers")}個あり、数は足ります。けれども本物のゲームでは誰もコマを自由に置かないので、この連続ジャンプを実際の対局で見ることは期待しないでください。これはボードが許すことを示すもので、対局で起きることではありません。</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">いちばん短い横断: ${f("oversteek_zetten")}手</h2>
      <p>相手のいない星型ボードにプレイヤーが一人だけなら、${f("sterbord_stenen_per_speler")}個のコマすべてをある角から向かいの角へ移すのに<strong>${f("oversteek_zetten")}手</strong>かかり、それより少ない手ではできません。連続ジャンプは、まるごとで一手と数えます。</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "下の角に赤いコマが十個だけある星型ボード。コマが目指す上の角は、点線で囲まれています。",
  tekst: "プレイヤーが一人だけ: 十個のコマが下の角にあり、上の角がゴールです。",
})}
      <p><strong>数え方。</strong>テストが、ほかのコマのないボードで、Leapstoneのルールに従って${f("oversteek_zetten")}手の横断を指します。${f("geen_oversteek_in_zetten")}手以下ではできないことを示すために、G. I. Bellの方法(<em>Integers</em> 9, 2009)に沿った探索を行いました。どの手も逆向きに指すことができ、ボードを半回転させるとスタートとゴールが入れかわります。そのため、もし${f("geen_oversteek_in_zetten")}手以下の横断があるなら、途中のある局面はスタートから多くても${f("zoekdiepte_zetten")}手の距離にあり、その局面を半回転させたものも同じです。探索は、スタートから${f("zoekdiepte_zetten")}手以内のすべての局面を調べ、局面とその鏡像を一つとして数え、時間内に十分先まで進めないと証明できる局面を除き、そのような組を一つも見つけませんでした。探索は${f("gemeten_kernen")}コアのマシンで${f("gemeten_rekentijd_seconden")}秒かかり、いちばん大きい段階では${f("gemeten_geheugen_gb")} GBのメモリに${f("gemeten_grootste_laag_miljoen_standen")}百万の局面を保持しました。この数は、Leapstone自身のボードについて計算し直したものです。</p>
      <p><strong>本物のゲームの下限ではありません。</strong>本物のゲームでは、ほかのプレイヤーのコマもボードにあり、自分のコマはそれを飛び越えられます。そのため${f("oversteek_zetten")}は本物のゲームでかかる最少の手数ではありません。証明されているのは、プレイヤーが一人だけの場合だけです。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">遊んでみよう</h2>
      <p><a href="/play/">ブラウザーでLeapstoneを遊ぶ</a>ならコンピューターと対戦できます。このページの上にあるボタンからアプリも入手できます。ルールは<a href="/ja/rules/chinese-checkers">ダイヤモンドゲームのルール</a>や<a href="/ja/rules/halma">ハルマのルール</a>をどうぞ。連続ジャンプを対局で生かす方法は<a href="/ja/guides/chinese-checkers-strategy">戦略のヒント</a>にあります。</p>
    </section>`;

export default {
  nav: "数字で見るダイヤモンドゲーム",
  titel: "数字で見るダイヤモンドゲーム | Leapstone",
  beschrijving: `星型ボードは${c.sterbord_vakken}マス。一回の手のジャンプは最大${c.langste_sprongketen}回で、相手のいないプレイヤー一人なら${c.oversteek_zetten}手で横断できます。それぞれの数の求め方も説明します。`,
  h1: "数字で見るダイヤモンドゲーム(チャイニーズチェッカー)",
  intro: `ダイヤモンドゲームの星型ボードには${f("sterbord_vakken")}マスあり、プレイヤーはそれぞれ${f("sterbord_stenen_per_speler")}個のコマで始めます。Leapstoneでは、一回の手のジャンプが${f("langste_sprongketen")}回を超えることはありません。相手のいないボードにプレイヤーが一人だけなら、横断に${f("oversteek_zetten")}手かかります。下では、それぞれの数をどう数えたか、そしてその数が本物のゲームについて何を語り、何を語らないかを説明します。`,
  inhoud,
};
