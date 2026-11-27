// Trang luật chơi cờ đam Trung Quốc (taak 134). Nội dung theo trang tiếng Anh ../en/chinese-checkers.mjs (đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} người chơi`,
      alt:
        {
          2: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới và 10 quân xanh dương ở đỉnh trên",
          3: "Bàn cờ hình ngôi sao với quân đỏ ở dưới, quân xanh dương ở trên bên trái và quân xanh lá ở trên bên phải",
          4: "Bàn cờ hình ngôi sao với quân ở bốn đỉnh: đỏ ở dưới, xanh lá ở trên, xanh dương ở dưới bên trái và vàng ở trên bên phải",
          6: "Bàn cờ hình ngôi sao với quân ở cả sáu đỉnh, bằng sáu màu",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Bàn cờ</h2>
      <p>Cờ đam Trung Quốc được chơi trên một ngôi sao sáu cánh. Bàn cờ có 121 ô, và mỗi đỉnh có 10 ô trong số đó. Bên trong bàn cờ, mỗi ô có sáu ô kề.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Các quân cờ bắt đầu thế nào</h2>
      <p>Mỗi người chơi có 10 quân và bắt đầu với chúng ở một đỉnh của ngôi sao. Đỉnh đối diện đỉnh của bạn là đích của bạn.</p>
      <ul>
        <li><strong>2 người chơi:</strong> hai đỉnh đối diện nhau.</li>
        <li><strong>3 người chơi:</strong> cách một đỉnh lại có một đỉnh. Ba đỉnh đích bắt đầu trống.</li>
        <li><strong>4 người chơi:</strong> hai cặp đỉnh nằm cạnh nhau. Mỗi người chơi có một người chơi khác ở đối diện.</li>
        <li><strong>6 người chơi:</strong> cả sáu đỉnh.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Luân phiên lượt đi</h2>
      <p>Người chơi 1 đi trước. Sau đó các lượt đi lần lượt theo thứ tự, Người chơi 2, Người chơi 3 và cứ thế, và sau người chơi cuối cùng lại đến Người chơi 1. Trong Leapstone, màu sắc đi theo số: đỏ, xanh dương, xanh lá, vàng, tím và bạc.</p>
      <p>Đến lượt, bạn đi một quân, một lần. Không có quân nào bị ăn: các quân ở lại trên bàn cờ cho đến khi người chơi của chúng chịu thua.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Một bước</h2>
      <p>Di chuyển một quân sang một ô trống kề bên.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Một quân đỏ có vòng trắng bao quanh. Ba trong sáu ô kề của nó trống và được đánh dấu; ba ô còn lại có quân.",
  tekst: "Quân đỏ có thể bước sang ba ô được đánh dấu. Ba ô kề còn lại đã có quân.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Một cú nhảy</h2>
      <p>Nhảy qua một quân kề bên quân của bạn, thuộc bất kỳ màu nào, và đáp xuống ô trống ngay sau nó, theo đường thẳng. Bạn có thể nhảy theo cả sáu hướng, kể cả lùi về sau.</p>
      <ul>
        <li>Ô bạn đáp xuống phải trống.</li>
        <li>Bạn không thể nhảy qua hai quân liền nhau, hay qua một ô trống.</li>
        <li>Quân bị nhảy qua vẫn ở nguyên chỗ.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Một quân đỏ nhảy qua một quân xanh dương xuống ô trống phía sau nó, được thể hiện bằng một mũi tên.",
  tekst: "Quân đỏ nhảy qua quân xanh dương.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Chuỗi nhảy</h2>
      <p>Sau một cú nhảy, chính quân đó có thể nhảy tiếp, bao nhiêu lần tùy ý nếu còn nhảy được, theo bất kỳ hướng nào. Bạn quyết định dừng ở đâu. Tất cả các cú nhảy cộng lại là một nước đi.</p>
      <ul>
        <li>Trong một nước đi, bạn không thể đáp xuống cùng một ô hai lần.</li>
        <li>Một nước đi là một bước, hoặc một hay nhiều cú nhảy. Bạn không thể bước sau khi nhảy.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Một quân đỏ nhảy ba lần trong một nước đi, qua một quân xanh dương, một quân xanh lá và một quân xanh dương nữa. Ba ô đáp được đánh số 1, 2 và 3.",
  tekst: "Một nước đi với ba cú nhảy, theo thứ tự các số.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Mục tiêu</h2>
      <p>Bạn thắng khi đưa cả 10 quân của mình vào đỉnh đối diện nơi bạn bắt đầu. Cả 10 ô của đỉnh đó phải có quân của chính bạn. Chừng nào còn một quân của người chơi khác ở đó, bạn không thể hoàn thành.</p>
      <p>Bạn có thể đáp xuống bất kỳ ô trống nào, kể cả ở các đỉnh của người chơi khác.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao cho ba người chơi. Quân đỏ bắt đầu ở dưới; đỉnh trống ở trên, được đánh dấu bằng các vòng tròn nét đứt, là đích của quân đỏ.",
  tekst: "Với 3 người chơi, quân đỏ bắt đầu ở dưới. Đích của quân đỏ là đỉnh trống ở trên.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Với 2, 3, 4 hoặc 6 người chơi</h2>
      <ul>
        <li><strong>2 người chơi:</strong> người đầu tiên lấp đầy đích sẽ thắng, và ván cờ kết thúc.</li>
        <li><strong>3, 4 hoặc 6 người chơi:</strong> người đầu tiên lấp đầy đích sẽ thắng. Những người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt. Ván cờ kết thúc khi chỉ còn một người chơi.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Chịu thua</h2>
      <p>Khi bạn chịu thua, các quân của bạn rời khỏi bàn cờ, nên chúng không cản trở ai. Với 2 người chơi, người kia thắng. Với nhiều người chơi hơn, ván cờ tiếp tục mà không có bạn, và nếu tất cả trừ một người chịu thua thì người cuối cùng thắng.</p>
      <p>Trong ván trực tuyến, mỗi nước đi có giới hạn thời gian. Người bắt đầu ván cờ đặt giới hạn đó, và trong ván nhanh là 30 giây. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua. Các ván với máy tính và trên một điện thoại không có giới hạn thời gian.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Mẹo</h2>
      <ul class="tips">
        <li><strong>Xây thang.</strong> Xếp các quân thành một hàng với một ô trống giữa mỗi quân, hướng về đích của bạn. Khi đó một quân có thể nhảy dọc cả hàng chỉ trong một nước đi.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Bốn quân xếp theo một đường chéo với một ô trống giữa mỗi quân. Một quân đỏ ở một đầu nhảy qua cả bốn quân, với bốn ô đáp được đánh số.",
  tekst: "Bốn quân thành một hàng: quân đỏ ở trên cùng băng qua bàn cờ trong một nước đi, với bốn cú nhảy.",
})}
        </li>
        <li><strong>Quân nào cũng là một cái thang.</strong> Bạn có thể nhảy qua quân của mọi màu, nên quân của những người chơi khác cũng giúp bạn. Và thang của chính bạn cũng giúp họ: hãy nhìn xem bạn để lại gì phía sau.</li>
        <li><strong>Đừng quên những quân tụt lại.</strong> Bạn cần cả 10 quân về nhà. Một quân tụt xa phía sau, không có gì để nhảy qua, mỗi lượt chỉ đi được một ô. Hãy đưa nó theo trong khi các quân khác vẫn còn quanh nó.</li>
        <li><strong>Chỗ bạn xuất phát là đích của họ.</strong> Với 2, 4 hoặc 6 người chơi, đỉnh xuất phát của bạn là đích của người chơi đối diện, và họ không thể hoàn thành khi còn một quân của bạn ở đó. Điều này cũng đúng với bạn.</li>
      </ul>
      <p>Có thêm mẹo kèm hình ảnh trong hướng dẫn <a href="/vi/huong-dan/co-nhay-chien-thuat">chiến thuật cờ đam Trung Quốc</a>. Cho một ván hai người, hãy đọc <a href="/vi/huong-dan/co-nhay-2-nguoi">cờ đam Trung Quốc cho 2 người chơi</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Câu hỏi</h2>
      <h3>Cờ đam Trung Quốc có thể chơi với bao nhiêu người?</h3>
      <p>Hai, ba, bốn hoặc sáu người. Mỗi người chơi bắt đầu ở một đỉnh của ngôi sao. Với 2, 3 hoặc 4 người chơi, một số đỉnh sẽ để trống.</p>
      <h3>Mỗi người chơi có bao nhiêu quân?</h3>
      <p>Mỗi người chơi có 10 quân (bi). Bàn cờ có 121 ô: 10 ô ở mỗi đỉnh trong sáu đỉnh và 61 ô ở giữa.</p>
      <h3>Có thể nhảy qua quân của mình, hoặc nhảy lùi không?</h3>
      <p>Có. Bạn có thể nhảy qua quân thuộc bất kỳ màu nào, kể cả quân của mình, theo cả sáu hướng, kể cả lùi về sau. Quân bị nhảy qua vẫn ở nguyên chỗ.</p>
      <h3>Trong cờ đam Trung Quốc có ăn quân không?</h3>
      <p>Không. Không có quân nào bị ăn. Một quân chỉ rời khỏi bàn cờ khi người chơi của nó chịu thua.</p>
      <h3>Cờ đam Trung Quốc có xuất xứ từ Trung Quốc không?</h3>
      <p>Không. Trò chơi xuất hiện ở Đức năm 1892 với tên Stern-Halma, dựa trên trò chơi cũ hơn là Halma. Cái tên Chinese checkers đến từ Hoa Kỳ, vào năm 1928. Đọc thêm tại <a href="/vi/luat-choi/sternhalma">Sternhalma</a>.</p>
      <h3>Chơi cờ đam Trung Quốc trực tuyến miễn phí với bạn bè ở đâu?</h3>
      <p>Trong Leapstone, trong trình duyệt hoặc trong ứng dụng từ App Store. Gửi cho bạn một liên kết mời: họ tham gia ván cờ của bạn mà không cần tài khoản, địa chỉ email hay mật khẩu. Bạn cũng có thể chơi với máy tính, hoặc một ván nhanh với người chơi khác. Leapstone miễn phí, không quảng cáo.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Chơi cờ đam Trung Quốc trong Leapstone</h2>
      <p>Leapstone là ứng dụng miễn phí để chơi cờ đam Trung Quốc (cờ nhảy) và Halma, với bàn cờ 3D sơn mài đỏ và vàng. Bạn có thể chơi trong ứng dụng và trong trình duyệt.</p>
      <ul>
        <li><strong>Với máy tính.</strong> Dễ, bình thường hoặc khó. Không cần internet.</li>
        <li><strong>Cùng bạn bè.</strong> Gửi một liên kết mời. Bạn đặt thời gian cho mỗi nước đi, và mọi người có thể trò chuyện.</li>
        <li><strong>Trực tuyến.</strong> Một ván nhanh với người chơi khác cùng trình độ, 30 giây mỗi nước đi. Một số đối thủ trực tuyến có thể là người chơi máy tính.</li>
        <li><strong>Trên một điện thoại.</strong> Chuyền điện thoại quanh bàn.</li>
      </ul>
      <p>Leapstone miễn phí, không quảng cáo và không đăng ký bằng địa chỉ email: bạn chỉ chọn một tên người chơi. <a href="https://apps.apple.com/vn/app/id6831230722">Tải về từ App Store</a>. <a href="/play/">Chơi trong trình duyệt</a>.</p>
    </section>`;

export default {
  nav: "Luật cờ đam Trung Quốc",
  titel: "Luật cờ đam Trung Quốc và mẹo chơi | Leapstone",
  beschrijving: "Cách chơi cờ đam Trung Quốc: khởi đầu, bước, nhảy và chuỗi nhảy, cách thắng với 2, 3, 4 hoặc 6 người chơi, và các mẹo. Chơi miễn phí trong trình duyệt.",
  h1: "Luật cờ đam Trung Quốc",
  intro: "Đưa cả 10 quân của bạn qua bàn cờ hình ngôi sao đến đỉnh đối diện trước khi ai khác làm được. Luật chơi ngắn gọn, kèm hình ảnh, và vài mẹo.",
  inhoud,
};
