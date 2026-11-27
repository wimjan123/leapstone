// Hướng dẫn cờ đam Trung Quốc cho 4 người chơi bằng tiếng Việt (taak 301): /vi/huong-dan/co-nhay-4-nguoi.
// Nội dung: hướng dẫn tiếng Anh ../en/chinese-checkers-4-players.mjs (đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Bàn cờ được chia thế nào</h2>
      <p>Mỗi người chơi có 10 quân, nên 40 quân đứng trên bàn cờ 121 ô. Bốn đỉnh xuất phát là hai cặp đỉnh nằm cạnh nhau: đỏ ở dưới và xanh dương ở dưới bên trái, xanh lá ở trên và vàng ở trên bên phải.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới, 10 quân xanh dương ở đỉnh dưới bên trái, 10 quân xanh lá ở đỉnh trên và 10 quân vàng ở đỉnh trên bên phải. Đỉnh trên bên trái và đỉnh dưới bên phải để trống.",
  tekst: "Đỏ ở dưới, xanh dương ở dưới bên trái, xanh lá ở trên, vàng ở trên bên phải.",
})}
      <p>Người chơi 1, quân đỏ, đi trước. Sau đó xanh dương là Người chơi 2, xanh lá là Người chơi 3, vàng là Người chơi 4, và sau vàng lại đến đỏ. Một nước đi là một bước hoặc một chuỗi nhảy với một quân. Xem <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> để biết về bước và nhảy.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Ai đối diện ai</h2>
      <p>Các đỉnh ghép thành cặp đối diện nhau trên bàn cờ: đỏ đối diện xanh lá, và xanh dương đối diện vàng. Đích của bạn là đỉnh đối diện với bạn. Đỏ đi đến chỗ xanh lá xuất phát, xanh lá đến chỗ đỏ xuất phát, xanh dương đến chỗ vàng xuất phát và vàng đến chỗ xanh dương xuất phát.</p>
      <p>Như trong ván cho 2 người, mỗi đích bắt đầu đầy quân của người chơi đối diện bạn, nên bạn chỉ có thể đáp xuống đó sau khi họ đã rời đi. Với 3 người chơi, các đích bắt đầu trống, còn với 4 người thì không ai hoàn thành ngay được. Bốn đích là bốn đỉnh khác nhau, nên không ai khác muốn đích của bạn: một người chơi đã xong không bao giờ chặn ai.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Hai đỉnh trống</h2>
      <p>Đỉnh trên bên trái và đỉnh dưới bên phải không có quân nào. Chúng không phải chỗ xuất phát hay đích của ai. Đỉnh trên bên trái nằm giữa xanh dương và xanh lá, còn đỉnh dưới bên phải nằm giữa vàng và đỏ.</p>
      <p>Bạn có thể bước hoặc nhảy vào bất kỳ ô trống nào, nên bạn có thể băng qua các đỉnh này hoặc dừng lại trong đó. Tuy nhiên, quân ở đó chưa ở trong đích. Trong một đỉnh trống không có gì để nhảy qua cho đến khi ai đó đưa quân đến đó.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Chiến thuật của bạn thay đổi thế nào</h2>
      <ul>
        <li><strong>Hai lối băng qua cùng lúc:</strong> đỏ và xanh lá băng qua bàn cờ về phía nhau, xanh dương và vàng cũng vậy. Cả hai đường đều đi qua giữa bàn, nên khu giữa đông hơn so với ván cho 2 người, nơi chỉ có một đường băng qua.</li>
        <li><strong>Ba người chơi đi giữa các lượt của bạn:</strong> bàn cờ thay đổi nhiều hơn giữa hai nước đi của bạn so với ván cho 2 người. Hãy nhìn lại nó ở đầu mỗi lượt, rồi lên kế hoạch cho chuỗi nhảy của bạn. Người đi sau bạn không bao giờ là người đối diện với bạn.</li>
        <li><strong>Quân giúp tất cả mọi người:</strong> mỗi quân của ba người kia là một bậc đá cho bạn, và quân của bạn là bậc đá cho họ. Quân của người chơi đối diện di chuyển theo hướng ngược lại, như trong ván cho 2 người.</li>
        <li><strong>Chỗ để đi vòng:</strong> nếu khu giữa đầy, các đỉnh trống là khoảng trống cạnh các trại. Một đường đi qua một đỉnh trống có thể là cách vòng qua chỗ đông.</li>
        <li><strong>Người chịu thua giải phóng đích của bạn:</strong> khi người chơi đối diện chịu thua, quân của họ rời khỏi bàn cờ, nên đích của bạn trống ngay lập tức.</li>
      </ul>
      <p>Các <a href="/vi/huong-dan/co-nhay-chien-thuat">mẹo chiến thuật</a> về thang, quân tụt lại và lấp đầy đích từ phía sau vẫn đúng với 4 người chơi.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Thắng, và chuyện xảy ra sau đó</h2>
      <ul>
        <li><strong>Thắng:</strong> người đầu tiên lấp đầy đích với cả 10 quân sẽ thắng. Ván cờ không dừng ở đó: ba người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt. Quân của người đó vẫn ở trên bàn cờ. Ván cờ kết thúc khi chỉ còn một người chơi vẫn đang chơi.</li>
        <li><strong>Chịu thua:</strong> các quân của bạn rời khỏi bàn cờ và ba người còn lại chơi tiếp. Nếu những người khác cũng chịu thua, người chơi cuối cùng còn lại thắng.</li>
        <li><strong>Thời gian (trực tuyến):</strong> trong ván trực tuyến, mỗi nước đi có giới hạn thời gian. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua, và ván cờ tiếp tục mà không có bạn.</li>
      </ul>
      <p>Với các ván có ít người chơi hơn, hãy đọc <a href="/vi/huong-dan/co-nhay-2-nguoi">Cờ đam Trung Quốc cho 2 người chơi</a>. <a href="/vi/luat-choi/co-nhay">Trang luật chơi</a> có hình ảnh của từng cách bắt đầu.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Chơi với 4 người chơi trong Leapstone ở đâu</h2>
      <ul>
        <li><strong>Với máy tính, ngay bây giờ:</strong> mở <a href="/play/">Leapstone trong trình duyệt</a>, chạm vào Máy, chọn Bàn cờ sao và 3 máy tính. Bạn là Người chơi 1, nên bạn đi trước. Bạn chọn Dễ, Vừa hoặc Khó cho các máy tính.</li>
        <li><strong>Trên một điện thoại:</strong> chạm vào Chơi, chọn Bàn cờ sao và 4 người chơi, rồi chạm vào một quân để chuyển chỗ đó giữa người và máy tính.</li>
        <li><strong>Trực tuyến với bạn bè:</strong> chạm vào Bạn bè, chọn Bàn cờ sao, 4 người chơi và thời gian mỗi nước đi, rồi gửi liên kết mời. Ván cờ bắt đầu khi cả 4 chỗ đã có người.</li>
        <li><strong>Ván nhanh, trong ứng dụng:</strong> chạm vào Chơi trực tuyến. Trong lúc tìm ván cho 2 người chơi, hãy chạm vào Tìm 4 hoặc 6 người chơi để tìm ván cho 4 người. Mỗi nước đi có 30 giây. Nếu không đủ người chơi tham gia trong 20 giây, máy tính sẽ lấp các chỗ trống, nên một số đối thủ có thể là người chơi máy tính.</li>
      </ul>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc cho 4 người chơi",
  titel: "Cờ đam Trung Quốc 4 người: bày quân và mẹo | Leapstone",
  beschrijving: "Cờ đam Trung Quốc với 4 người chơi: bàn cờ được chia thế nào, 2 đỉnh nào để trống, ai đối diện ai, chiến thuật thay đổi ra sao và nơi chơi.",
  h1: "Cờ đam Trung Quốc cho 4 người chơi",
  intro: "Với 4 người chơi, mỗi người xuất phát từ một trong bốn đỉnh của ngôi sao, và hai đỉnh còn lại để trống. Đỏ đối diện xanh lá và xanh dương đối diện vàng: đích của bạn là đỉnh đối diện với bạn, đầy quân của người chơi đó. Dưới đây là cách bày quân, các đỉnh trống, chiến thuật và nơi bạn có thể chơi.",
  inhoud,
};
