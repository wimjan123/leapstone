// Hướng dẫn cờ đam Trung Quốc cho 6 người bằng tiếng Việt (taak 302).
// Nội dung: hướng dẫn tiếng Anh ../en/chinese-checkers-6-players.mjs (đã kiểm tra với crates/halma-core), từng câu một.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Ván cờ bắt đầu thế nào</h2>
      <p>Mỗi người chơi có 10 quân, và cả 6 đỉnh của ngôi sao đều được dùng. Như vậy có 60 quân trên bàn cờ 121 ô. 61 ô ở giữa lúc đầu đều trống.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 10 quân ở mỗi đỉnh trong 6 đỉnh, có 6 màu",
  tekst: "6 người chơi, 6 đỉnh, 60 quân.",
})}
      <p>Người chơi 1, quân đỏ, đi trước, từ đỉnh dưới. Sau đó lượt đi từ Người chơi 1 đến Người chơi 6, và sau Người chơi 6 lại là Người chơi 1. Người chơi được đánh số theo thứ tự các đỉnh quanh ngôi sao, nên người đi sau bạn luôn bắt đầu ở đỉnh kề với đỉnh của bạn. Một nước đi là một bước hoặc một chuỗi nhảy với một quân. Xem <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> để biết về bước và nhảy.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Lúc đầu mọi đích đều đầy quân</h2>
      <p>Bạn thắng khi đưa cả 10 quân của mình vào đỉnh ở phía bên kia bàn cờ. Với 6 người chơi, đó là đỉnh nơi người chơi đối diện bạn xuất phát, nên không có đích nào trống: mọi đích lúc đầu đều đầy quân của một người chơi khác. Với quân đỏ, đích là đỉnh trên, nơi Người chơi 4 xuất phát.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 6 đỉnh đầy quân. Một vòng nét đứt đánh dấu đỉnh trên, đích của người chơi đỏ, nơi có quân của người chơi đối diện.",
  tekst: "Đích của quân đỏ là đỉnh đối diện, đầy quân của Người chơi 4.",
})}
      <p>Bạn chỉ có thể đáp xuống một ô trống, nên người chơi đối diện phải rời đỉnh của họ trước khi bạn lấp đầy nó, và bạn phải rời đỉnh của mình trước khi họ lấp đầy đỉnh của họ. Trong ván cho 2 người, chỉ có thế thôi. Với 6 người, cả hai còn phải len qua đám đông của 4 người còn lại.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Khu vực giữa đông đúc</h2>
      <p>Mọi đích đều ở phía bên kia bàn cờ, và các đỉnh chỉ nối với nhau qua khu vực giữa, nên cả 60 quân phải đi qua cùng 61 ô ấy. Lúc đầu chưa ai đi qua, và khu vực giữa đầy lên rất nhanh.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Một quân đỏ nhảy ba lần trong một nước đi: qua một quân xanh dương, rồi một quân xanh lá, rồi một quân tím. Các số 1, 2 và 3 đánh dấu các ô tiếp đất.",
  tekst: "Quân của mọi màu đều là bậc đá.",
})}
      <p>Bạn có thể nhảy qua quân của bất kỳ màu nào. Quân của 5 người chơi khác là bậc đá cho bạn, và quân của bạn là bậc đá cho cả 5 người đó. Một hàng quân bạn để lại ở giữa là cái thang cho bất kỳ ai với tới được, và người đi sau bạn được đi trước.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Chặn khi có 5 đối thủ</h2>
      <ul>
        <li><strong>Lấp ô tiếp đất:</strong> một cú nhảy cần một ô trống ngay sau quân bị nhảy qua. Khi bạn đưa một quân vào đó, cú nhảy ấy biến mất với mọi người chơi muốn dùng nó.</li>
        <li><strong>Cẩn thận với những cái thang bạn dựng:</strong> sau nước đi của bạn, 5 người chơi còn lại đi trước khi đến lượt bạn. Một cái thang giúp tất cả họ.</li>
        <li><strong>Ai cũng có thể chặn một đích:</strong> một quân của bất kỳ người chơi nào khác trong đích của bạn khiến bạn không thể hoàn thành, không chỉ quân của người chơi đối diện. Cả 10 ô của đích phải có quân của chính bạn.</li>
      </ul>
      <p><a href="/vi/huong-dan/co-nhay-chien-thuat">Các mẹo chiến thuật</a> cho thấy một cú nhảy bị chặn trông thế nào, và làm sao để không nhốt quân của người chơi khác trong đích của chính bạn.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Một ván kéo dài bao lâu</h2>
      <p>Một ván cho 6 người có 60 quân phải di chuyển, và giữa nước đi này và nước đi sau của bạn, 5 người chơi còn lại mỗi người đi một nước. Ván cờ cũng không kết thúc khi người đầu tiên hoàn thành.</p>
      <ul>
        <li><strong>Thắng, và chơi tiếp:</strong> người đầu tiên lấp đầy đích sẽ thắng, và những người khác chơi tiếp để giành các hạng tiếp theo. Người đã xong bị bỏ qua lượt, và quân của họ vẫn ở trên bàn cờ làm bậc đá. Ván cờ kết thúc khi chỉ còn một người chơi.</li>
        <li><strong>Chịu thua:</strong> các quân của bạn rời khỏi bàn cờ, nên không còn chặn hay giúp ai nữa, và những người khác chơi tiếp.</li>
        <li><strong>Thời gian (trực tuyến):</strong> trong ván trực tuyến, mỗi nước đi có giới hạn thời gian, do người bắt đầu ván đặt: 15 giây, 30 giây, 1 phút, 2 phút hoặc không giới hạn. Một vòng 6 nước đi mất tối đa 6 lần giới hạn đó, nên với 30 giây thì tối đa là 3 phút. Khi hết giờ, lượt của bạn bị bỏ qua. Nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua, và ván cờ tiếp tục mà không có bạn.</li>
      </ul>
      <p>Để biết về ván có ít người chơi hơn, hãy đọc <a href="/vi/huong-dan/co-nhay-2-nguoi">Cờ đam Trung Quốc cho 2 người</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Chơi với 6 người chơi trong Leapstone ở đâu</h2>
      <ul>
        <li><strong>Với máy tính, ngay bây giờ:</strong> mở <a href="/play/">Leapstone trong trình duyệt</a>, chạm vào Máy, chọn bàn cờ sao và 5 máy tính. Bạn là Người chơi 1, nên bạn đi trước. Các máy tính đi lần lượt từng máy một, mỗi máy dừng một chút, nên bạn có thể theo dõi từng nước đi. Bạn chọn Dễ, Vừa hoặc Khó cho các máy tính.</li>
        <li><strong>Trên một điện thoại:</strong> chạm vào Chơi, chọn bàn cờ sao và 6 người chơi, rồi chạm vào một quân để chuyển chỗ đó giữa người và máy tính.</li>
        <li><strong>Trực tuyến với bạn bè:</strong> chạm vào Bạn bè, chọn bàn cờ sao, 6 người chơi và thời gian mỗi nước đi, rồi gửi liên kết mời. Ván bắt đầu khi cả 6 chỗ đã có người.</li>
        <li><strong>Ván nhanh:</strong> Chơi trực tuyến tìm các ván cho 2 hoặc 4 người chơi, nên không có ván nhanh cho 6 người.</li>
      </ul>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc cho 6 người",
  titel: "Cờ đam Trung Quốc cho 6 người: bàn cờ đầy | Leapstone",
  beschrijving: "Cờ đam Trung Quốc với 6 người chơi: ngôi sao đầy 60 quân, khu vực giữa đông đúc, cách chặn, một ván kéo dài bao lâu và nơi chơi.",
  h1: "Cờ đam Trung Quốc cho 6 người",
  intro: "Một ván cho 6 người diễn ra thế nào: cả 6 đỉnh đều đầy quân, bạn đua đến đỉnh đối diện, và ván cờ tiếp tục sau khi người đầu tiên hoàn thành.",
  inhoud,
};
