// De gids Halma vs cờ đam Trung Quốc in het Vietnamees, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Cờ đam Trung Quốc: bàn cờ hình ngôi sao, 121 ô",
    alt: "Bàn cờ hình ngôi sao với 10 quân đỏ ở đỉnh dưới và 10 quân xanh dương ở đỉnh trên",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: bàn cờ vuông, 256 ô",
    alt: "Bàn cờ vuông với 19 quân đỏ ở góc trên bên trái và 19 quân xanh dương ở góc dưới bên phải",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Bàn cờ hình ngôi sao: sáu ô kề, ở đây ba ô trống",
    alt: "Một quân đỏ có vòng trắng bao quanh. Ba trong sáu ô kề của nó trống và được đánh dấu; ba ô còn lại có quân.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Bàn cờ vuông: tám ô kề, ở đây năm ô trống",
    alt: "Một quân đỏ có vòng trắng bao quanh. Năm trong tám ô kề của nó trống và được đánh dấu; ba ô còn lại có quân.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Câu trả lời ngắn</h2>
      <p>Halma được chơi trên bàn cờ vuông còn cờ đam Trung Quốc trên bàn cờ hình ngôi sao sáu cánh. Ở cả hai trò chơi, bạn di chuyển quân bằng các bước và các cú nhảy qua bàn cờ, và người chơi đầu tiên lấp đầy trại ở phía đối diện sẽ thắng.</p>
      <p>Điều khác nhau là bàn cờ, các hướng đi, số người có thể chơi và số quân của mỗi người. <a href="/vi/luat-choi/sternhalma">Sternhalma</a> là tên gọi của Halma trên bàn cờ hình ngôi sao, nên đó là cùng một trò chơi với cờ đam Trung Quốc.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Các bàn cờ</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Cờ đam Trung Quốc</strong> dùng bàn cờ hình ngôi sao: 121 ô, với 10 ô ở mỗi đỉnh trong sáu đỉnh. Một đỉnh là một hình tam giác gồm các hàng 4, 3, 2 và 1 ô.</li>
        <li><strong>Halma</strong> dùng bàn cờ vuông: 16 nhân 16 ô, tổng cộng 256. Một trại nằm ở góc. Trại lớn có các hàng 5, 5, 4, 3 và 2 ô, trại nhỏ có các hàng 4, 4, 3 và 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Hướng đi: sáu hoặc tám</h2>
      <p>Trên bàn cờ hình ngôi sao, một ô có sáu ô kề. Trên bàn cờ vuông, nó có tám, vì các đường chéo cũng được tính. Một bước đi tới một ô kề trống. Một cú nhảy đi qua một quân kề bên quân của bạn, theo đường thẳng, xuống ô trống ngay sau nó, theo bất kỳ hướng nào trong số đó và cả lùi về sau.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Ô ở rìa có ít ô kề hơn, và góc của bàn cờ vuông có ba. Sáu hướng tạo thành ba đường thẳng đi qua một ô trên bàn cờ hình ngôi sao. Tám hướng tạo thành bốn đường thẳng trên bàn cờ vuông: ngang, dọc và hai đường chéo.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Người chơi và quân cờ</h2>
      <ul>
        <li><strong>Cờ đam Trung Quốc:</strong> 2, 3, 4 hoặc 6 người chơi. Mỗi người có 10 quân, nên bàn cờ có 20, 30, 40 hoặc 60 quân.</li>
        <li><strong>Halma:</strong> 2 hoặc 4 người chơi. Với 2 người chơi, mỗi người có 19 quân, tổng cộng 38. Với 4 người chơi, mỗi người có 13 quân, tổng cộng 52.</li>
      </ul>
      <p>Bàn cờ vuông trong Leapstone không có ván chơi cho 3 hoặc 6 người chơi. Muốn chơi ván ba người, hãy đọc <a href="/vi/huong-dan/co-nhay-3-nguoi">Cờ đam Trung Quốc cho 3 người chơi</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Điểm giống nhau</h2>
      <ul>
        <li><strong>Một nước đi:</strong> một bước, hoặc một chuỗi nhảy với một quân. Bạn tự quyết định chuỗi kết thúc ở đâu, và bạn không thể bước sau khi nhảy.</li>
        <li><strong>Mọi màu:</strong> bạn nhảy qua quân của bất kỳ màu nào, kể cả quân của chính bạn. Quân bị nhảy qua vẫn ở nguyên chỗ. Không có quân nào bị ăn.</li>
        <li><strong>Đích:</strong> trại đối diện nơi bạn bắt đầu. Mọi ô của nó phải có quân của chính bạn. Chừng nào còn quân của người chơi khác ở đó, bạn không thể hoàn thành.</li>
        <li><strong>Thắng:</strong> người chơi đầu tiên lấp đầy đích sẽ thắng. Với 2 người chơi, ván cờ kết thúc ngay lúc đó. Với nhiều người chơi hơn, những người còn lại chơi tiếp để giành các hạng tiếp theo, và người đã xong sẽ bị bỏ qua lượt.</li>
        <li><strong>Chịu thua và thời gian:</strong> khi bạn chịu thua, các quân của bạn rời khỏi bàn cờ. Trong ván trực tuyến, mỗi nước đi có giới hạn thời gian, và nếu bạn bỏ lỡ 3 lượt liên tiếp, bạn chịu thua.</li>
      </ul>
      <p>Đọc luật chơi đầy đủ của <a href="/vi/luat-choi/co-nhay">cờ đam Trung Quốc</a> và <a href="/vi/luat-choi/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Chọn bàn cờ nào trong Leapstone</h2>
      <ul>
        <li><strong>3 hoặc 6 người chơi:</strong> chỉ bàn cờ hình ngôi sao mới có.</li>
        <li><strong>Mỗi người nhiều quân hơn:</strong> bàn cờ vuông, với 19 quân mỗi người cho 2 người chơi hoặc 13 cho 4, so với 10 trên bàn cờ hình ngôi sao.</li>
        <li><strong>Chơi trực tuyến:</strong> một ván nhanh được chơi trên bàn cờ hình ngôi sao. Với bạn bè, và với máy tính, bạn có thể chọn một trong hai bàn cờ.</li>
      </ul>
      <p>Nút Chơi ngay mở một ván với máy tính trên bàn cờ hình ngôi sao. Để chơi trên bàn cờ vuông, hãy chạm vào mũi tên quay lại ở trên cùng và chọn Bàn cờ vuông trong menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Đi tiếp</h2>
      <ul>
        <li><a href="/play/">Chơi trong trình duyệt</a> và thử cả hai bàn cờ.</li>
        <li><a href="/vi/huong-dan/co-nhay-chien-thuat">Chiến thuật cờ đam Trung Quốc</a>: sáu mẹo kèm hình ảnh.</li>
        <li><a href="/vi/huong-dan/co-nhay-2-nguoi">Cờ đam Trung Quốc cho 2 người chơi</a>: một ván cho hai người diễn ra thế nào.</li>
      </ul>
      <p><a href="/vi/huong-dan/co-nhay-online-voi-ban-be">Cờ đam Trung Quốc online với bạn bè</a></p>
    </section>`;

export default {
  nav: "Halma hay cờ đam Trung Quốc",
  titel: "Halma và cờ đam Trung Quốc: khác nhau | Leapstone",
  beschrijving: "Halma hay cờ đam Trung Quốc? Bàn cờ vuông và bàn cờ hình ngôi sao, sáu hoặc tám hướng, người chơi và quân cờ, và điểm giống nhau.",
  h1: "Halma và cờ đam Trung Quốc",
  intro: "Hai trò chơi chung một ý tưởng: đưa tất cả quân của bạn qua bàn cờ sang phía đối diện. Điểm khác nhau, điểm giống nhau, và nơi chơi cả hai.",
  inhoud,
};
