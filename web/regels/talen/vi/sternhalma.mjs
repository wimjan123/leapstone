// Trang luật chơi Sternhalma bằng tiếng Việt (taak 134). Nội dung và nguồn: trang tiếng Anh ../en/sternhalma.mjs (Wikipedia Halma và Chinese checkers, xem ở đó), từng câu một.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Tên gọi có nghĩa là gì</h2>
      <p>Sternhalma là tên tiếng Đức của Halma chơi trên bàn cờ hình ngôi sao. <em>Stern</em> trong tiếng Đức nghĩa là ngôi sao. Cờ đam Trung Quốc là cùng một trò chơi với một cái tên được đặt sau này ở Hoa Kỳ.</p>
      <p>Trong Leapstone, đây là <strong>bàn cờ sao</strong>: bàn cờ của <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Nguồn gốc</h2>
      <ul>
        <li><strong>Halma</strong> được phát minh vào năm 1883 hoặc 1884 bởi George Howard Monks, một bác sĩ phẫu thuật người Mỹ. Cái tên trong tiếng Hy Lạp nghĩa là &ldquo;cú nhảy&rdquo;. Trò chơi được chơi trên bàn cờ vuông. <a href="/vi/luat-choi/halma">Đọc luật Halma</a>.</li>
        <li><strong>Stern-Halma</strong> xuất hiện ở Đức vào năm 1892: cùng một ý tưởng trên bàn cờ hình ngôi sao sáu cánh.</li>
        <li><strong>Cờ đam Trung Quốc</strong> là tên mà Bill và Jack Pressman đặt cho trò chơi ở Hoa Kỳ vào năm 1928, lúc đầu là &ldquo;Hop Ching checkers&rdquo;. Trò chơi không có liên hệ lịch sử nào với Trung Quốc, và cũng không phải là một trò chơi cờ đam.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Các trò chơi khác nhau thế nào</h2>
      <ul>
        <li><strong>Halma:</strong> bàn cờ vuông 16 nhân 16 ô, cho 2 hoặc 4 người chơi. Một quân có tám ô kề, thẳng và chéo. Với 2 người chơi, mỗi người có 19 quân, với 4 người chơi là 13.</li>
        <li><strong>Sternhalma và cờ đam Trung Quốc:</strong> bàn cờ hình ngôi sao 121 ô, cho 2, 3, 4 hoặc 6 người chơi. Một quân có sáu ô kề. Mỗi người có 10 quân.</li>
        <li><strong>Phần còn lại giống nhau:</strong> một bước sang ô kề còn trống, hoặc một cú nhảy qua một quân, với chuỗi nhảy. Người đầu tiên lấp đầy trại đối diện bên kia bàn cờ sẽ thắng.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Các biến thể, và Leapstone làm gì</h2>
      <p>Halma đã được chơi theo nhiều cách. Đây là cách Leapstone so với các biến thể chúng tôi tìm thấy trong các nguồn của mình:</p>
      <ul>
        <li><strong>Kích thước bàn cờ.</strong> Halma cũng được chơi trên bàn cờ 8 nhân 8 và 10 nhân 10. Leapstone chỉ có bàn cờ 16 nhân 16.</li>
        <li><strong>Rời khỏi đích.</strong> Theo một luật Halma, một quân đã vào trại của đối thủ thì không được rời khỏi đó nữa. Leapstone không có luật này: bạn có thể đi lại quân như vậy.</li>
        <li><strong>Ba người chơi trên bàn cờ sao.</strong> Một bản Halma ba người chơi xưa trên bàn cờ sao được mô tả với mỗi người 15 quân. Leapstone cho 3 người chơi trên bàn cờ sao, mỗi người 10 quân.</li>
        <li><strong>Nhảy là tùy bạn.</strong> Bạn không bao giờ bắt buộc phải nhảy. Bạn chọn ô nơi nước đi của mình kết thúc.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Chơi trong Leapstone</h2>
      <p>Chơi ngay mở một ván trên bàn cờ sao với máy tính. Với bàn cờ vuông, hãy chạm vào mũi tên quay lại ở trên cùng và chọn Bàn cờ vuông trong menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới và 10 quân xanh dương ở đỉnh trên",
  tekst: "Bàn cờ sao cho 2 người chơi.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma là gì? Halma trên bàn cờ sao | Leapstone",
  beschrijving: "Sternhalma là tên tiếng Đức của Halma trên bàn cờ sao. Nó liên quan thế nào đến Halma và cờ đam Trung Quốc, và cách chơi miễn phí trong trình duyệt.",
  h1: "Sternhalma, Halma và cờ đam Trung Quốc",
  intro: "Ba cái tên cho những trò chơi có quan hệ gần gũi. Mỗi tên có nghĩa là gì, chúng đến từ đâu và khác nhau thế nào.",
  inhoud,
};
