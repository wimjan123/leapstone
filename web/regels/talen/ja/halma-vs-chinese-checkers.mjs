// De gids Halma tegenover Chinese checkers in het Japans, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "ダイヤモンドゲーム: 星型ボード、121マス",
    alt: "下の角に赤いコマ10個、上の角に青いコマ10個が置かれた星型ボード",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "ハルマ: 四角いボード、256マス",
    alt: "左上の角に赤いコマ19個、右下の角に青いコマ19個が置かれた四角いボード",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "星型ボード: 隣のマスは六つ、ここでは三つが空き",
    alt: "白い輪に囲まれた赤いコマ。六つの隣のマスのうち三つは空いていて印が付いており、残りの三つにはコマがある。",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "四角いボード: 隣のマスは八つ、ここでは五つが空き",
    alt: "白い輪に囲まれた赤いコマ。八つの隣のマスのうち五つは空いていて印が付いており、残りの三つにはコマがある。",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">まず結論</h2>
      <p>ハルマは四角いボードで、ダイヤモンドゲームは六つの角を持つ星型のボードで遊びます。どちらのゲームも、コマを一歩ずつ、またはジャンプでボードの向こう側へ進め、反対側の陣地を先に埋めたプレイヤーが勝ちです。</p>
      <p>違うのは、ボード、動かせる方向、遊べる人数、そしてひとりが持つコマの数です。<a href="/ja/rules/sternhalma">Sternhalma</a>は星型のボードで遊ぶハルマの呼び名なので、ダイヤモンドゲームと同じゲームです。</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">ボード</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>ダイヤモンドゲーム</strong>は星型のボードを使います。121マスあり、六つの先端のそれぞれに10マスの角があります。角は、4、3、2、1マスの列でできた三角形です。</li>
        <li><strong>ハルマ</strong>は四角いボードを使います。縦16マス、横16マスで、全部で256マスです。陣地は角にあります。大きい陣地は5、5、4、3、2マスの列、小さい陣地は4、4、3、2マスの列です。</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">方向は六つか八つか</h2>
      <p>星型のボードでは、マスの隣は六つです。四角いボードでは、斜めも数えるので八つです。歩くのは、空いている隣のマスへ進むことです。飛ぶのは、隣にあるコマをひとつ、まっすぐに飛び越えて、そのすぐ後ろの空いているマスに着地することで、どの方向にも、後ろ向きにもできます。</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>ボードの端のマスは隣が少なく、四角いボードの角は三つです。六つの方向だと、星型のボードではマスを通る線が三本になります。八つの方向だと、四角いボードでは四本になります。横、縦、そして二つの斜めです。</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">人数とコマの数</h2>
      <ul>
        <li><strong>ダイヤモンドゲーム:</strong> 2人、3人、4人または6人。全員が10個のコマを持つので、ボードには20個、30個、40個または60個のコマが並びます。</li>
        <li><strong>ハルマ:</strong> 2人または4人。2人のときは各19個で、全部で38個。4人のときは各13個で、全部で52個です。</li>
      </ul>
      <p>Leapstoneでは、四角いボードに3人用と6人用のゲームはありません。三人で遊ぶときは、<a href="/ja/guides/chinese-checkers-3-players">3人で遊ぶダイヤモンドゲーム</a>を読んでください。</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">同じところ</h2>
      <ul>
        <li><strong>一回の手:</strong> 一個のコマの一歩か、連続ジャンプです。連続ジャンプをどこで止めるかは自分で決めます。ジャンプのあとに歩くことはできません。</li>
        <li><strong>どの色でも:</strong> どの色のコマでも、自分のコマでも飛び越えられます。飛び越えたコマはそのまま動きません。コマを取ることはありません。</li>
        <li><strong>ゴール:</strong> スタートした陣地の向かい側の陣地です。そのすべてのマスが、自分のコマで埋まっていなければなりません。ほかのプレイヤーのコマがそこにある間は、ゴールできません。</li>
        <li><strong>勝ち:</strong> 先にゴールを埋めたプレイヤーが勝ちです。2人のときは、そこでゲームが終わります。もっと多いときは、残りのプレイヤーが次の順位を目指して続け、終わったプレイヤーは飛ばされます。</li>
        <li><strong>投了と時間:</strong> 投了すると、あなたのコマは盤から消えます。オンライン対戦では、一手ごとに制限時間があり、3回続けて番を逃すと、投了になります。</li>
      </ul>
      <p><a href="/ja/rules/chinese-checkers">ダイヤモンドゲームのルール</a>と<a href="/ja/rules/halma">ハルマのルール</a>の全文を読めます。</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Leapstoneでどちらのボードを選ぶか</h2>
      <ul>
        <li><strong>3人または6人:</strong> 星型のボードだけで遊べます。</li>
        <li><strong>コマを多く:</strong> 四角いボードです。2人なら各19個、4人なら各13個で、星型のボードの10個より多くなります。</li>
        <li><strong>オンライン対戦:</strong> クイックゲームは星型のボードで遊びます。友達と、またコンピューターと遊ぶときは、どちらのボードも選べます。</li>
      </ul>
      <p>「今すぐ遊ぶ」ボタンを押すと、星型のボードでコンピューターと対戦するゲームが開きます。四角いボードで遊ぶには、上の戻る矢印をタップし、メニューで「四角ボード」を選びます。</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">さらに進む</h2>
      <ul>
        <li><a href="/play/">ブラウザーで遊んで</a>、どちらのボードも試してみましょう。</li>
        <li><a href="/ja/guides/chinese-checkers-strategy">ダイヤモンドゲームの戦略</a>: 絵つきの六つのヒント。</li>
        <li><a href="/ja/guides/chinese-checkers-2-players">2人で遊ぶダイヤモンドゲーム</a>: 二人用のゲームの仕組み。</li>
      </ul>
      <p><a href="/ja/guides/play-chinese-checkers-online-with-friends">友達とオンラインで遊ぶダイヤモンドゲーム</a></p>
    </section>`;

export default {
  nav: "ハルマとダイヤモンドゲームの違い",
  titel: "ハルマとダイヤモンドゲームの違い | Leapstone",
  beschrijving: "ハルマとダイヤモンドゲームの違い。四角いボードと星型のボード、六つか八つの方向、人数とコマの数、同じところを解説します。",
  h1: "ハルマとダイヤモンドゲームの違い",
  intro: "考え方はひとつの二つのゲーム。すべてのコマをボードの反対側へ運びます。違うところ、同じところ、両方を遊べる場所を紹介します。",
  inhoud,
};
