// 日本語のガイド「2人で遊ぶダイヤモンドゲーム」, taak 134. Inhoud: ../en/chinese-checkers-2-players.mjs zin voor zin (regels uit
// crates/halma-core, zie docs/plan.md, taak 122). Wie een regel wijzigt, wijzigt elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">ゲームの始まり方</h2>
      <p>プレイヤーはそれぞれ10個のコマを持ちます。コマは、星の向かい合う二つの角から始まります。赤は下、青は上です。20個のコマが、121マスのボードに並びます。</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "星型ボード。下の角に赤いコマ10個、上の角に青いコマ10個",
  tekst: "赤は下、青は上からスタートします。",
})}
      <p>プレイヤー1の赤が最初に動かします。そのあとは、一回ずつ交代で動かします。一回の手とは、一個のコマの一歩か、連続ジャンプです。歩き方と飛び方は、<a href="/ja/rules/chinese-checkers">ダイヤモンドゲームのルール</a>を見てください。</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">ゴールは相手のスタート地点</h2>
      <p>自分のコマ10個すべてを、相手がスタートした角に移せば勝ちです。その角は最初は相手のコマでいっぱいで、あなたの角はあなたのコマでいっぱいです。赤の場合、それは上の絵の上の角です。</p>
      <p>着地できるのは空いているマスだけです。ですから、お互いに、相手が埋める前に自分の角を出なければなりません。相手のコマがゴールに残っている間は、どちらもゴールできません。そして、同じ真ん中を反対向きに渡るので、相手のコマはあなたの踏み石になり、あなたのコマは相手の踏み石になります。それをどう生かすかは、<a href="/ja/guides/chinese-checkers-strategy">戦略のヒント</a>を読んでください。</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">勝ちと投了</h2>
      <ul>
        <li><strong>勝ち:</strong> 10個すべてのコマで先にゴールを埋めたプレイヤーが勝ち、ゲームはすぐに終わります。もう一人のプレイヤーは続けません。</li>
        <li><strong>投了:</strong> あなたのコマは盤から消え、もう一人のプレイヤーの勝ちです。</li>
        <li><strong>時間(オンライン):</strong> オンライン対戦では、一手ごとに制限時間があります。時間切れになると、あなたの番は飛ばされます。3回続けて番を逃すと、投了になります。</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">3人、4人、6人との違い</h2>
      <ul>
        <li><strong>3人:</strong> コマはひとつおきの角から始まり、三つのゴールは最初は空です。先に終えた人が勝ちです。残りのプレイヤーは次の順位を目指して続け、終わったプレイヤーは飛ばされます。</li>
        <li><strong>4人:</strong> 隣り合う角が二組。あなたのゴールは、最初は別のプレイヤーのコマでいっぱいです。最初に終えた人のあともゲームが続くのは、3人のときと同じです。</li>
        <li><strong>6人:</strong> 六つの角すべて。ボードには、2人のときの20個に対して、60個のコマが並びます。</li>
      </ul>
      <p>ボードにコマが20個しかないと、飛び越えるコマが少ないので、自分で作るはしごがより大切になります。それぞれの配置の絵は、<a href="/ja/rules/chinese-checkers">ルールのページ</a>にあります。</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstoneで2人で遊ぶには</h2>
      <ul>
        <li><strong>コンピューターと、今すぐ:</strong> <a href="/play/">ブラウザーでLeapstone</a>を開き、「コンピューター」をタップして、星型ボードを選びます。コンピューターは一台が初期設定なので、それが2人用のゲームです。かんたん、ふつう、むずかしいから選べます。あなたはプレイヤー1なので、先に動かします。かんたんは、ランダムな三つの手のうち最善のものを選びます。ふつうは、ゴールへいちばん進む手を選びます。むずかしいは、相手がどう返せるかと、自分の次の手も調べます。</li>
        <li><strong>アプリでオンライン対戦:</strong> 星型ボードで2人用のクイックゲーム。同じレベルの別のプレイヤーと、一手30秒で対戦します。オンラインの対戦相手の一部はコンピューターのプレイヤーの場合があります。</li>
        <li><strong>友達と:</strong> 招待リンクを送り、一手あたりの時間を自分で設定します。または、一台のスマートフォンを交互に渡して遊びます。</li>
      </ul>
      <p><a href="/ja/guides/play-chinese-checkers-online-with-friends">友達とオンラインで遊ぶダイヤモンドゲーム</a></p>
      <p><a href="/ja/guides/chinese-checkers-3-players">3人で遊ぶダイヤモンドゲーム</a></p>
    </section>`;

export default {
  nav: "2人で遊ぶダイヤモンドゲーム",
  titel: "2人で遊ぶダイヤモンドゲーム: 配置とルール | Leapstone",
  beschrijving: "2人で遊ぶダイヤモンドゲームの仕組み。10個のコマの最初の配置、先手、勝ち方と投了、3人、4人、6人との違い、2人で無料で遊べる場所。",
  h1: "2人で遊ぶダイヤモンドゲーム",
  intro: "星型ボードで二人で遊ぶゲームの仕組み。最初の配置、先手、勝ち方、遊べる場所を紹介します。",
  inhoud,
};
