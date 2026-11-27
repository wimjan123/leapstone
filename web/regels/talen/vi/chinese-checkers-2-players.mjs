// Hướng dẫn cờ đam Trung Quốc cho 2 người chơi bằng tiếng Việt (taak 134): /vi/huong-dan/co-nhay-2-nguoi.
// Nội dung: hướng dẫn tiếng Anh ../en/chinese-checkers-2-players.mjs (đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ván cờ bắt đầu thế nào</h2>
      <p>Mỗi người chơi có 10 quân. Chúng bắt đầu ở hai đỉnh của ngôi sao đối diện nhau: đỏ ở dưới, xanh dương ở trên. 20 quân đứng trên một bàn cờ 121 ô.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới và 10 quân xanh dương ở đỉnh trên",
  tekst: "Quân đỏ bắt đầu ở dưới, quân xanh dương ở trên.",
})}
      <p>Người chơi 1, quân đỏ, đi trước. Sau đó hai bạn luân phiên, mỗi người một nước đi. Một nước đi là một bước hoặc một chuỗi nhảy với một quân. Xem <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> để biết về bước và nhảy.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Đích của bạn là chỗ xuất phát của người kia</h2>
      <p>Bạn thắng khi đưa cả 10 quân của mình vào đỉnh nơi người chơi kia đã bắt đầu. Đỉnh đó bắt đầu đầy quân của họ, còn đỉnh của bạn đầy quân của bạn. Với quân đỏ, đó là đỉnh trên trong hình ở trên.</p>
      <p>Bạn chỉ có thể đáp xuống một ô trống, nên mỗi người phải rời đỉnh của mình trước khi người kia lấp đầy nó. Không ai trong hai bạn có thể hoàn thành khi còn một quân của người kia ở lại đích. Và vì hai bạn băng qua cùng một khu vực giữa theo hai hướng ngược nhau, quân của người chơi kia là bậc đá cho bạn, và quân của bạn là bậc đá cho họ. Hãy đọc <a href="/vi/huong-dan/co-nhay-chien-thuat">các mẹo chiến thuật</a> để biết nên làm gì với điều đó.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Thắng và chịu thua</h2>
      <ul>
        <li><strong>Thắng:</strong> người đầu tiên lấp đầy đích với cả 10 quân sẽ thắng, và ván cờ kết thúc ngay lập tức. Người chơi kia không chơi tiếp.</li>
        <li><strong>Chịu thua:</strong> các quân của bạn rời khỏi bàn cờ và người chơi kia thắng.</li>
        <li><strong>Thời gian (trực tuyến):</strong> trong ván trực tuyến, mỗi nước đi có giới hạn thời gian. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">3, 4 và 6 người chơi khác thế nào</h2>
      <ul>
        <li><strong>3 người chơi:</strong> các quân bắt đầu ở cách một đỉnh lại có một đỉnh, và ba đỉnh đích bắt đầu trống. Người đầu tiên hoàn thành sẽ thắng; những người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt.</li>
        <li><strong>4 người chơi:</strong> hai cặp đỉnh nằm cạnh nhau. Đích của bạn bắt đầu đầy quân của một người chơi khác. Ván cờ tiếp tục sau người hoàn thành đầu tiên, như với 3 người.</li>
        <li><strong>6 người chơi:</strong> cả sáu đỉnh. Bàn cờ có 60 quân, so với 20 quân khi có 2 người chơi.</li>
      </ul>
      <p>Chỉ có 20 quân trên bàn cờ thì có ít quân hơn để nhảy qua, nên những cái thang bạn tự xây càng quan trọng hơn. <a href="/vi/luat-choi/co-nhay">Trang luật chơi</a> có hình ảnh của từng cách bắt đầu.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Chơi với 2 người chơi trong Leapstone ở đâu</h2>
      <ul>
        <li><strong>Với máy tính, ngay bây giờ:</strong> mở <a href="/play/">Leapstone trong trình duyệt</a>, chạm vào Máy và chọn bàn cờ sao. Mặc định là một máy tính, nên đó là một ván cho 2 người. Bạn chọn Dễ, Vừa hoặc Khó, và bạn là Người chơi 1, nên bạn đi trước. Dễ chọn nước tốt nhất trong ba nước đi ngẫu nhiên. Vừa chọn nước đi tiến gần đích nhất. Khó còn xem các đối thủ của nó có thể đáp lại thế nào và nước đi tiếp theo của chính nó.</li>
        <li><strong>Chơi trực tuyến, trong ứng dụng:</strong> một ván nhanh trên bàn cờ sao cho 2 người chơi, với một người chơi khác cùng trình độ, 30 giây mỗi nước đi. Một số đối thủ trực tuyến có thể là người chơi máy tính.</li>
        <li><strong>Với một người bạn:</strong> gửi một liên kết mời, và tự đặt thời gian cho mỗi nước đi. Hoặc chuyền một chiếc điện thoại qua lại.</li>
      </ul>
      <p><a href="/vi/huong-dan/co-nhay-online-voi-ban-be">Cờ đam Trung Quốc online với bạn bè</a></p>
      <p><a href="/vi/huong-dan/co-nhay-3-nguoi">Cờ đam Trung Quốc cho 3 người chơi</a></p>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc cho 2 người chơi",
  titel: "Cờ đam Trung Quốc cho 2 người: luật chơi | Leapstone",
  beschrijving: "Cờ đam Trung Quốc với 2 người chơi: 10 quân bắt đầu ở đâu, ai đi trước, cách thắng hoặc chịu thua, và nơi chơi miễn phí cho 2 người.",
  h1: "Cờ đam Trung Quốc cho 2 người chơi",
  intro: "Một ván cho hai người trên bàn cờ sao diễn ra thế nào: cách bày quân, ai đi trước, cách thắng và nơi bạn có thể chơi.",
  inhoud,
};
