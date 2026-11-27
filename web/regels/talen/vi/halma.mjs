// Trang luật chơi Halma bằng tiếng Việt, taak 134. Nội dung: trang tiếng Anh ../en/halma.mjs (đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 người chơi: mỗi người 19 quân",
    alt: "Bàn cờ vuông với 19 quân đỏ ở góc trên bên trái và 19 quân xanh dương ở góc dưới bên phải",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 người chơi: mỗi người 13 quân",
    alt: "Bàn cờ vuông với 13 quân ở mỗi góc trong bốn góc: đỏ ở trên bên trái, xanh dương ở trên bên phải, xanh lá ở dưới bên phải và vàng ở dưới bên trái",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Bàn cờ</h2>
      <p>Halma được chơi trên bàn cờ vuông 16 nhân 16 ô, tổng cộng 256 ô. Mỗi ô có tối đa tám ô kề: bốn ô thẳng và bốn ô chéo. Ô ở rìa có ít hơn, và ô ở góc có ba.</p>
      <p>Đây là Bàn cờ vuông trong Leapstone. Nếu bạn đã biết trò chơi này trên bàn cờ hình ngôi sao, hãy đọc về <a href="/vi/luat-choi/sternhalma">Sternhalma</a> và <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Các quân cờ bắt đầu thế nào</h2>
      <p>Halma dành cho 2 hoặc 4 người chơi. Mỗi người chơi bắt đầu với các quân trong một trại ở một góc của bàn cờ. Trại ở góc đối diện là đích của bạn.</p>
      <ul>
        <li><strong>2 người chơi:</strong> mỗi người 19 quân, ở hai góc đối diện nhau. Trại gồm năm hàng với 5, 5, 4, 3 và 2 ô.</li>
        <li><strong>4 người chơi:</strong> mỗi người 13 quân, một trại ở mỗi góc. Trại gồm bốn hàng với 4, 4, 3 và 2 ô. Đích của bạn là góc đối diện theo đường chéo qua bàn cờ.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Luân phiên lượt đi</h2>
      <p>Người chơi 1 đi trước. Sau đó các lượt đi lần lượt theo thứ tự, và sau người chơi cuối cùng lại đến Người chơi 1. Trong Leapstone, màu sắc đi theo số: đỏ, xanh dương, xanh lá và vàng.</p>
      <p>Đến lượt, bạn đi một quân, một lần. Không có quân nào bị ăn: các quân ở lại trên bàn cờ cho đến khi người chơi của chúng chịu thua.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Một bước</h2>
      <p>Di chuyển một quân sang một ô trống kề bên, theo bất kỳ hướng nào trong tám hướng: thẳng hoặc chéo.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Một quân đỏ có vòng trắng bao quanh. Năm trong tám ô kề của nó trống và được đánh dấu; ba ô còn lại có quân.",
  tekst: "Quân đỏ có thể bước sang năm ô được đánh dấu. Ba ô kề còn lại đã có quân.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Một cú nhảy</h2>
      <p>Nhảy qua một quân kề bên quân của bạn, thuộc bất kỳ màu nào, và đáp xuống ô trống ngay sau nó, theo đường thẳng. Bạn có thể nhảy theo cả tám hướng, kể cả theo đường chéo và lùi về sau.</p>
      <ul>
        <li>Ô bạn đáp xuống phải trống.</li>
        <li>Bạn không thể nhảy qua hai quân liền nhau, hay qua một ô trống.</li>
        <li>Quân bị nhảy qua vẫn ở nguyên chỗ.</li>
        <li>Bạn không thể nhảy ra ngoài mép bàn cờ.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Một quân đỏ nhảy chéo qua một quân xanh dương xuống ô trống phía sau nó, được thể hiện bằng một mũi tên.",
  tekst: "Quân đỏ nhảy chéo qua quân xanh dương.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Chuỗi nhảy</h2>
      <p>Sau một cú nhảy, chính quân đó có thể nhảy tiếp, bao nhiêu lần tùy ý nếu còn nhảy được, theo bất kỳ hướng nào, thẳng hoặc chéo. Bạn quyết định dừng ở đâu. Tất cả các cú nhảy cộng lại là một nước đi.</p>
      <ul>
        <li>Trong một nước đi, bạn không thể đáp xuống cùng một ô hai lần.</li>
        <li>Một nước đi là một bước, hoặc một hay nhiều cú nhảy. Bạn không thể bước sau khi nhảy.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Một quân đỏ nhảy ba lần trong một nước đi: chéo qua một quân xanh dương, thẳng qua một quân xanh dương khác, và chéo qua một quân đỏ. Ba ô đáp được đánh số 1, 2 và 3.",
  tekst: "Một nước đi với ba cú nhảy, theo thứ tự các số.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Mục tiêu</h2>
      <p>Bạn thắng khi đưa tất cả quân của mình vào trại đối diện nơi bạn bắt đầu. Mọi ô của trại đó phải có quân của chính bạn: 19 quân với 2 người chơi, 13 quân với 4 người chơi. Chừng nào còn một quân của người chơi khác ở đó, bạn không thể hoàn thành.</p>
      <p>Bạn có thể đáp xuống bất kỳ ô trống nào, kể cả trong trại của người chơi khác. Một quân đang ở trong đích của bạn vẫn có thể rời đi; không có gì khóa nó lại.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Bàn cờ vuông cho hai người chơi. Quân đỏ bắt đầu ở góc trên bên trái; trại ở góc dưới bên phải, được đánh dấu bằng các vòng tròn nét đứt và có các quân xanh dương, là đích của quân đỏ.",
  tekst: "Với 2 người chơi, đích của quân đỏ là trại nơi quân xanh dương bắt đầu.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Với 2 hoặc 4 người chơi</h2>
      <ul>
        <li><strong>2 người chơi:</strong> người đầu tiên lấp đầy đích sẽ thắng, và ván cờ kết thúc.</li>
        <li><strong>4 người chơi:</strong> người đầu tiên lấp đầy đích sẽ thắng. Những người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt. Ván cờ kết thúc khi chỉ còn một người chơi.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Chịu thua</h2>
      <p>Khi bạn chịu thua, các quân của bạn rời khỏi bàn cờ, nên chúng không cản trở ai. Với 2 người chơi, người kia thắng. Với 4 người chơi, ván cờ tiếp tục mà không có bạn, và nếu tất cả trừ một người chịu thua thì người cuối cùng thắng.</p>
      <p>Trong ván trực tuyến, mỗi nước đi có giới hạn thời gian. Người bắt đầu ván cờ đặt giới hạn đó. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua. Các ván với máy tính và trên một điện thoại không có giới hạn thời gian.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Mẹo</h2>
      <ul class="tips">
        <li><strong>Xây thang.</strong> Xếp các quân thành một hàng với một ô trống giữa mỗi quân, thẳng hoặc chéo, hướng về đích của bạn. Khi đó một quân có thể nhảy dọc cả hàng chỉ trong một nước đi.</li>
        <li><strong>Quân nào cũng là một cái thang.</strong> Bạn có thể nhảy qua quân của mọi màu, nên quân của những người chơi khác cũng giúp bạn. Và thang của chính bạn cũng giúp họ: hãy nhìn xem bạn để lại gì phía sau.</li>
        <li><strong>Tận dụng đường chéo.</strong> Đích nằm ở góc đối diện, nên một hàng quân theo đường chéo là cách nhanh nhất để băng qua bàn cờ.</li>
        <li><strong>Đừng quên những quân tụt lại.</strong> Bạn cần tất cả quân về nhà. Một quân tụt xa phía sau, không có gì để nhảy qua, mỗi lượt chỉ đi được một ô. Hãy đưa nó theo trong khi các quân khác vẫn còn quanh nó.</li>
        <li><strong>Chỗ bạn xuất phát là đích của họ.</strong> Với 2 người chơi, trại của bạn là đích của người chơi kia, và họ không thể hoàn thành khi còn một quân của bạn ở đó. Leapstone cho phép bạn giữ một quân ở nhà, nên bạn có thể chặn theo cách này. Điều này cũng đúng với bạn.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Câu hỏi</h2>
      <h3>Có thể chơi Halma với bao nhiêu người?</h3>
      <p>Hai hoặc bốn người. Halma được chơi trên bàn cờ vuông 16 nhân 16 ô, và mỗi người chơi bắt đầu ở một góc.</p>
      <h3>Mỗi người chơi có bao nhiêu quân trong Halma?</h3>
      <p>Mỗi người có 19 quân khi chơi 2 người, và 13 quân khi chơi 4 người.</p>
      <h3>Ai đã phát minh ra Halma?</h3>
      <p>George Howard Monks, một bác sĩ phẫu thuật người Mỹ, vào năm 1883 hoặc 1884. Trong tiếng Hy Lạp, cái tên có nghĩa là “nhảy”. Đọc thêm tại <a href="/vi/luat-choi/sternhalma">Sternhalma</a>.</p>
      <h3>Halma khác cờ đam Trung Quốc ở điểm nào?</h3>
      <p>Halma dùng bàn cờ vuông, với bước và nhảy theo tám hướng và 19 hoặc 13 quân mỗi người. Cờ đam Trung Quốc dùng bàn cờ hình ngôi sao, với sáu hướng và 10 quân mỗi người, cho 2, 3, 4 hoặc 6 người chơi.</p>
      <h3>Có thể chơi Halma trực tuyến miễn phí không?</h3>
      <p>Có, trong Leapstone, trong trình duyệt hoặc trong ứng dụng từ App Store. Hãy chọn một cách chơi, chẳng hạn chơi với máy hoặc trực tuyến với bạn bè, rồi chọn Bàn cờ vuông. Leapstone miễn phí, không quảng cáo.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Chơi thử</h2>
      <p>Nút Chơi ngay mở một ván với máy tính trên <a href="/vi/luat-choi/co-nhay">bàn cờ hình ngôi sao</a>. Để chơi Halma, hãy chạm vào mũi tên quay lại ở trên cùng, rồi chọn Chơi trên điện thoại này, Chơi với máy hoặc Chơi trực tuyến với bạn bè, và chạm vào Bàn cờ vuông.</p>
    </section>`;

export default {
  nav: "Luật Halma",
  titel: "Luật Halma và mẹo chơi | Leapstone",
  beschrijving: "Cách chơi Halma trên bàn cờ vuông 16 nhân 16: khởi đầu, bước, nhảy, chuỗi nhảy, cách thắng, và các mẹo. Chơi miễn phí trong trình duyệt.",
  h1: "Luật Halma",
  intro: "Đưa tất cả quân của bạn qua bàn cờ vuông đến góc đối diện trước khi ai khác làm được. Luật chơi ngắn gọn, kèm hình ảnh, và vài mẹo.",
  inhoud,
};
