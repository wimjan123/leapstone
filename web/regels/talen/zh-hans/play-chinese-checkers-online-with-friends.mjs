// 简体中文指南「与好友在线玩跳棋」, taak 304. Inhoud: ../en/play-chinese-checkers-online-with-friends.mjs, tekst volgt ../en/ zin voor zin.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">从开始到第一步的步骤</h2>
      <ol>
        <li><strong>选择玩家名。</strong>登录只需要这个。</li>
        <li><strong>创建在线对局。</strong>选择棋盘、玩家人数和走子时间。</li>
        <li><strong>发送邀请链接。</strong>在等候室里分享，或者复制后粘贴到任何聊天应用中。</li>
        <li><strong>等所有人打开链接。</strong>最后一个座位坐满时，对局开始，由你先走。</li>
      </ol>
      <p>本页的其余部分会逐一说明每个环节，以及好友中途不玩了会怎样。</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">邀请链接如何运作</h2>
      <p>一场对局只有一个邀请链接，每位好友用的都是同一个。每位打开链接的好友会坐到下一个空座位。对局是你创建的，所以你是玩家 1，坐第一个座位。</p>
      <ul>
        <li><strong>有几个座位：</strong>星形棋盘的对局有 2、3、4 或 6 位玩家，方形棋盘有 2 或 4 位。你在发送链接之前选择。座位没坐满时对局不会开始，最后一个座位坐满之前也不能走子。</li>
        <li><strong>等候室：</strong>等待时，等候室会显示谁已经加入，还剩几个空座位。好友加入时它会自动更新。</li>
        <li><strong>分享：</strong>点击“邀请”按钮会打开手机的分享菜单。如果用不了，它会复制链接，你可以自己粘贴。</li>
        <li><strong>在浏览器或应用中：</strong>链接不需要应用，在浏览器中就能用。如果好友装了应用，链接可以打开应用。</li>
        <li><strong>已满或未知的链接：</strong>所有座位都坐满后，链接会显示对局已满。不存在的链接会显示邀请不存在。两种情况下，都请向好友要一个新链接。</li>
      </ul>
      <p>这个链接只属于这场对局。它有 16 个随机字符，没有人能猜到，但谁拿到它都可以坐一个空座位。只把它发给你想一起玩的人。</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">不需要账号，只要一个玩家名</h2>
      <p>你不需要电子邮箱或密码。你选择一个 1 到 30 个字符的玩家名，其他玩家会看到这个名字。有些粗鲁的名字会被拒绝，这时请另选一个。</p>
      <p>选好名字后，应用会显示一个 20 个字符、分成五组的恢复码。请保存好。换新手机时，输入这个码就能找回你的玩家名。没有这个码，你在新手机上就找不回名字。</p>
      <p>你的好友打开你的链接时也一样：先选一个名字，然后加入你的对局。</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">走子时间：好友可以想多久</h2>
      <p>走子时间是一位玩家走一步最多可用的时间。你在创建对局时设定，它对这场对局中的每个人都有效。</p>
      <ul>
        <li><strong>可选的时间：</strong>15 秒、30 秒、1 分钟或 2 分钟。你也可以关掉它，完全不限时。应用默认是 30 秒。</li>
        <li><strong>计时：</strong>由服务器计时，所以手机时间不准也没有影响。应用会显示还剩多少时间。</li>
        <li><strong>第一次计时：</strong>从最后一个座位坐满时开始。在那之前，没有人在计时。</li>
        <li><strong>快速对局：</strong>如果你点“在线对战”去和陌生人玩，走子时间固定为 30 秒。只有和好友的对局可以自己选择。</li>
      </ul>
      <p>对在沙发上玩的好友来说，2 分钟或不限时比较轻松。想快点玩，就选 15 秒。不限时的话，对局可以一直等下去，你有空时再玩完。</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">有人中途退出会怎样</h2>
      <p>对局存放在服务器上，而不是手机上。如果好友关掉应用、断线或手机休眠，对局会停在原处，好友可以在“我的对局”里再找到它。</p>
      <ul>
        <li><strong>时间用完：</strong>该玩家的回合会被跳过。棋盘上没有任何变化，轮到下一位玩家计时。</li>
        <li><strong>连续三个回合：</strong>连续错过 3 个回合的玩家会自动认输。玩家只要走了一步，计数就归零。</li>
        <li><strong>认输：</strong>认输的玩家，无论是自己选择还是错过 3 个回合后，棋子都会从棋盘上移走，所以不会挡住任何人。</li>
        <li><strong>2 人对局：</strong>对局结束，另一位玩家获胜。</li>
        <li><strong>3、4 或 6 人对局：</strong>对局在没有这位玩家的情况下继续，回合交给下一位还在场的玩家。</li>
        <li><strong>没有走子时间：</strong>如果你选了不限时，对局永远不会跳过回合。它会等到好友回来，或者好友认输。</li>
      </ul>
      <p>如果你打开了通知，轮到你时应用会提醒你，应用关着时也一样。可以在应用里打开，也可以在手机或浏览器的设置中打开。</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">对局之后</h2>
      <p>通过邀请一起玩的玩家会互相加入对方的好友列表。你可以从那里向好友发起新的对局，不需要新的链接。你进行中和已结束的对局都在“我的对局”里。</p>
      <p>刚接触规则？请读<a href="/zh-hans/rules/chinese-checkers">跳棋规则</a>。两个人玩？请读<a href="/zh-hans/guides/chinese-checkers-2-players">2 人跳棋</a>。想赢？请读<a href="/zh-hans/guides/chinese-checkers-strategy">策略技巧</a>。</p>
      <p><a href="/zh-hans/guides/chinese-checkers-3-players">3 人跳棋</a></p>
    </section>`;

export default {
  nav: "与好友在线玩跳棋",
  titel: "与好友在线玩跳棋 | Leapstone",
  beschrijving: "与好友在线玩跳棋：创建对局并发送一个邀请链接，自己设定每步的走子时间，只需一个玩家名，无需账号，并说明好友中途退出时会怎样。",
  h1: "与好友在线玩跳棋",
  intro: "创建一场对局，发送一个邀请链接，等所有人加入后就可以开始。你只需要一个玩家名，走子时间由你自己设定。",
  inhoud,
};
