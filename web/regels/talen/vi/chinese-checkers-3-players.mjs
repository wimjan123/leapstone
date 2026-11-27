// Hướng dẫn cờ đam Trung Quốc cho 3 người chơi bằng tiếng Việt (taak 299): /vi/huong-dan/co-nhay-3-nguoi.
// Nội dung: hướng dẫn tiếng Anh ../en/chinese-checkers-3-players.mjs (taak 139, đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ván cờ bắt đầu thế nào</h2>
      <p>Mỗi người chơi có 10 quân, nên có 30 quân đứng trên bàn cờ 121 ô. Chúng bắt đầu ở cách một đỉnh lại có một đỉnh của ngôi sao: đỏ ở dưới, xanh dương ở trên bên trái và xanh lá ở trên bên phải. Ba đỉnh ở giữa để trống.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới, 10 quân xanh dương ở đỉnh trên bên trái và 10 quân xanh lá ở đỉnh trên bên phải",
  tekst: "Quân đỏ ở dưới, quân xanh dương ở trên bên trái, quân xanh lá ở trên bên phải.",
})}
      <p>Người chơi 1, quân đỏ, đi trước. Sau đó xanh dương là Người chơi 2, xanh lá là Người chơi 3, và sau xanh lá lại đến quân đỏ. Một nước đi là một bước hoặc một chuỗi nhảy với một quân. Xem <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> để biết về bước và nhảy.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ba đích, tất cả đều trống lúc đầu</h2>
      <p>Đích của bạn là đỉnh đối diện với nơi bạn bắt đầu, và với 3 người chơi, đỉnh đó bắt đầu trống. Đó là đỉnh trống nằm giữa chỗ xuất phát của hai người chơi kia: đích của quân đỏ ở trên, đích của quân xanh dương ở dưới bên phải và đích của quân xanh lá ở dưới bên trái.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao cho ba người chơi. Các vòng tròn nét đứt có màu của từng người chơi đánh dấu ba đích trống: đỏ ở trên, xanh dương ở dưới bên phải, xanh lá ở dưới bên trái.",
  tekst: "Mỗi đích có màu của người chơi của nó.",
})}
      <p>Bạn thắng khi đưa cả 10 quân của mình vào đích. Cả 10 ô phải có quân của chính bạn. Không ai bắt đầu trong đích của bạn, nhưng bạn có thể dừng lại ở bất kỳ ô trống nào, nên quân của một người chơi khác có thể đáp xuống đó sau này. Khi quân đó còn nằm ở đấy, bạn không thể hoàn thành.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Thắng, và chuyện xảy ra sau đó</h2>
      <ul>
        <li><strong>Thắng:</strong> người chơi đầu tiên lấp đầy đích sẽ thắng. Ván cờ không dừng ở đó: hai người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt. Ván cờ kết thúc khi chỉ còn một người chơi đang chơi.</li>
        <li><strong>Chịu thua:</strong> các quân của bạn rời khỏi bàn cờ và hai người còn lại chơi tiếp. Nếu người thứ hai chịu thua trước khi có ai hoàn thành, người chơi cuối cùng còn lại sẽ thắng.</li>
        <li><strong>Thời gian (trực tuyến):</strong> trong ván trực tuyến, mỗi nước đi có giới hạn thời gian do người bắt đầu ván cờ đặt. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua, và ván cờ tiếp tục mà không có bạn.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Khác thế nào so với ván cờ cho 2 người</h2>
      <ul>
        <li><strong>Nhiều quân hơn:</strong> 30 quân trên bàn cờ, so với 20 quân khi có 2 người chơi.</li>
        <li><strong>Đích trống:</strong> với 2 người chơi, đích của bạn bắt đầu đầy quân của người kia. Với 3 người chơi, nó bắt đầu trống.</li>
        <li><strong>Hai đối thủ:</strong> sau nước đi của bạn, hai người chơi khác đi trước khi lại đến lượt bạn. Quân của cả hai là bậc đá cho bạn, và quân của bạn là bậc đá cho họ. Một cái thang bạn xây có thể được cả hai dùng, và người đi sau bạn được dùng trước.</li>
        <li><strong>Ván cờ tiếp tục:</strong> với 2 người chơi, ván cờ kết thúc khi một trong hai bạn xong. Với 3 người chơi, ván cờ tiếp tục để giành hạng nhì và hạng ba.</li>
      </ul>
      <p>Về ván cờ cho hai người, hãy đọc <a href="/vi/huong-dan/co-nhay-2-nguoi">cờ đam Trung Quốc cho 2 người chơi</a>. <a href="/vi/huong-dan/co-nhay-chien-thuat">Các mẹo chiến thuật</a> nói về bước và nhảy, và chúng giống nhau khi có 3 người chơi.</p>
      <p><a href="/vi/huong-dan/co-nhay-online-voi-ban-be">Cờ đam Trung Quốc online với bạn bè</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Chơi với 3 người chơi trong Leapstone ở đâu</h2>
      <ul>
        <li><strong>Với máy tính, ngay bây giờ:</strong> mở <a href="/play/">Leapstone trong trình duyệt</a>, chạm vào Máy, chọn bàn cờ sao và 2 máy tính. Bạn là Người chơi 1, nên bạn đi trước. Bạn chọn Dễ, Vừa hoặc Khó cho các máy tính.</li>
        <li><strong>Trên một chiếc điện thoại:</strong> chạm vào “Trên điện thoại này”, chọn bàn cờ sao và 3 người chơi, rồi chạm vào một quân để chuyển chỗ đó giữa người và máy tính.</li>
        <li><strong>Trực tuyến với bạn bè:</strong> chạm vào Bạn bè, chọn bàn cờ sao, 3 người chơi và thời gian cho mỗi nước đi, rồi gửi liên kết mời. Ván cờ bắt đầu khi cả 3 chỗ đã có người.</li>
        <li><strong>Ván nhanh:</strong> Chơi trực tuyến tìm ván cho 2 hoặc 4 người chơi, nên không có ván nhanh cho 3 người.</li>
      </ul>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc cho 3 người chơi",
  titel: "Cờ đam Trung Quốc cho 3 người: bày quân | Leapstone",
  beschrijving: "Cờ đam Trung Quốc với 3 người chơi: 30 quân bắt đầu ở đâu, đỉnh trống nào là đích của mỗi người, ai đi trước và cách thắng.",
  h1: "Cờ đam Trung Quốc cho 3 người chơi",
  intro: "Một ván cho ba người trên bàn cờ sao diễn ra thế nào: cách bày quân, ba đích, ai đi trước, cách thắng và nơi bạn có thể chơi.",
  inhoud,
};
