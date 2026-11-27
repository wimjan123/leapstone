// Hướng dẫn nước đi mở đầu cờ đam Trung Quốc bằng tiếng Việt (taak 303), từng câu một từ ../en/chinese-checkers-opening-moves.mjs.
// Mỗi nước đi và con số đã kiểm tra với crates/halma-core (xem bản tiếng Anh). Chỉ dùng chữ số trong văn bản, không viết số bằng chữ.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Nước đi đầu tiên của bạn: 14 lựa chọn</h2>
      <p>Lúc bắt đầu, 10 quân của bạn lấp đầy một hình tam giác với các hàng 4, 3, 2 và 1, và hàng đầu quay về giữa bàn cờ. Không có ô trống nào bên trong tam giác, nên một quân chỉ có thể sang hàng ngay phía trước nó. Như vậy còn 14 nước đi đầu: mỗi quân trong 4 quân ở hàng đầu có thể bước sang 2 ô (8 bước), và mỗi quân trong 3 quân ở hàng thứ hai có thể nhảy qua một quân hàng đầu sang 2 ô (6 cú nhảy). 3 quân còn lại chưa thể di chuyển.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Đỉnh đỏ ở phía dưới với 10 quân của nó, và ở hàng ngay phía trước có 5 ô trống được đánh dấu bằng vòng tròn.",
  tekst: "Mọi nước đi đầu đều kết thúc ở một trong 5 ô này.",
})}
      <p>Trong hướng dẫn này, một hàng là đường các ô nằm ngang qua đỉnh của bạn, song song với cạnh trước của nó, và ta tính tiến độ bằng số hàng. Một bước đưa quân tiến 1 hàng và một cú nhảy đưa nó tiến 2 hàng. Mọi người chơi đều có cùng 14 nước đi đầu, với 2, 3, 4 hoặc 6 người chơi và từ bất kỳ đỉnh nào của ngôi sao, vì nhìn từ bên trong thì đỉnh nào cũng giống nhau.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Mở đầu 1: nhảy ra, rồi giải phóng quân ở chóp</h2>
      <p>Quân ở chóp đỉnh của bạn xa đích nhất, và lúc bắt đầu nó không thể di chuyển: nó chỉ có thể nhảy qua một quân nếu ô phía sau quân đó trống. Một cú nhảy từ hàng thứ hai tạo ra đúng một ô trống như vậy.</p>
      <ol>
        <li><strong>Nước đi 1:</strong> quân ở đầu bên phải của hàng thứ hai nhảy qua quân phía trước nó. Nó đáp xuống hàng phía trước đỉnh của bạn và tiến 2 hàng.</li>
        <li><strong>Nước đi 2:</strong> quân ở chóp nhảy hai lần trong một nước đi: trước tiên vào ô mà nước đi 1 đã làm trống, rồi qua một quân của hàng thứ hai. Nó tiến 4 hàng.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Đỉnh đỏ sau nước đi 1. Quân ở chóp có vòng tròn, và 2 mũi tên với số 1 và 2 cho thấy các cú nhảy của nó qua ô đã trống tới hàng phía trước đỉnh.",
  tekst: "Sau nước đi 1, quân ở chóp nhảy ra bằng 2 cú nhảy.",
})}
      <p>Vậy là 6 hàng trong 2 nước đi. Chúng tôi đã thử mọi cách đi 2 nước, và 6 là mức tiến nhiều nhất. Chỉ có 4 cặp nước đi đạt được mức đó: quân ở một trong hai đầu của hàng thứ hai nhảy, theo một trong 2 hướng của nó, rồi quân ở chóp nhảy theo. Quân ở giữa hàng thứ hai thì không được, vì nó giữ chóp bị kẹt lại.</p>
      <p>Cả hai quân giờ đứng ở hàng phía trước đỉnh của bạn với một ô trống ở giữa. Đó là nấc đầu tiên của một cái thang.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Mở đầu 2: 4 nước đi với 4 quân khác nhau</h2>
      <p>Trong 4 nước đi, mức tiến nhiều nhất là 13 hàng, và bạn chỉ đạt được khi mỗi nước đi dùng một quân khác nhau. Chuỗi nước này làm được điều đó:</p>
      <ol>
        <li><strong>Nước đi 1:</strong> quân ở đầu bên phải của hàng đầu bước tới. Nó tiến 1 hàng.</li>
        <li><strong>Nước đi 2:</strong> quân ở đầu bên phải của hàng thứ ba nhảy hai lần. Nó tiến 4 hàng.</li>
        <li><strong>Nước đi 3:</strong> quân ở đầu bên trái của hàng thứ hai nhảy hai lần. Nó tiến 4 hàng.</li>
        <li><strong>Nước đi 4:</strong> quân ở chóp nhảy hai lần. Nó tiến 4 hàng.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Đỉnh đỏ lúc bắt đầu. 4 quân sẽ di chuyển có số từ 1 đến 4, theo thứ tự các nước đi.",
          tekst: "Trước: các quân sẽ đi, theo thứ tự.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Đỉnh đỏ sau 4 nước đi, với 4 ô nơi các quân đánh số đáp xuống ở các hàng phía trước đỉnh, và 4 lỗ trống để lại trong đỉnh.",
          tekst: "Sau: nơi chúng đã đáp xuống.",
        })}
      </div>
      <p>Mỗi nước đi chuẩn bị cho nước tiếp theo. Nước đi 2 và 3 kết thúc bằng một cú nhảy qua quân vừa đi ngay trước đó, và nước đi 4 bắt đầu xuyên qua lỗ mà nước đi 3 để lại. Cả 4 quân đều đáp xuống nửa bàn cờ của bạn.</p>
      <p>Còn những chuỗi khác cũng đạt 13. Điểm chung của chúng là ý tưởng: tìm nước đi để lại một lỗ hoặc một bậc đệm cho nước tiếp theo, và cho quân ở chóp ra muộn nhất là ở nước đi 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Những lỗi trong các nước đi đầu</h2>
      <ul class="tips">
        <li><strong>Đi cùng một quân mỗi lượt.</strong> Một quân chạy một mình tiến 5 hàng trong 4 nước đi, so với 13 hàng khi dùng 4 quân khác nhau. Nó cũng để các quân còn lại của bạn đứng yên chỗ cũ.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Đỉnh đỏ lúc bắt đầu. Một quân từ hàng thứ hai đi 4 nước liên tiếp dọc một đường, với các mũi tên và số từ 1 đến 4, và kết thúc một mình gần giữa bàn cờ.",
  tekst: "Một quân, 4 nước đi, 5 hàng.",
})}
      <ul class="tips">
        <li><strong>Chỉ bước bằng hàng đầu.</strong> 4 bước tiến 4 hàng. Sau đó quân ở chóp vẫn không thể di chuyển, nên nó ở lại phía sau trong khi phần còn lại tiến lên.</li>
        <li><strong>Bước sang ngang.</strong> Một bước dọc theo hàng tiến 0 hàng. Sau nước đi 1 của mở đầu 1, quân ở phía trước có thể bước sang ô bên cạnh, và trông như tiến lên, nhưng nước đi đó là phí.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Hãy tiếp tục</h2>
      <p>Sau khoảng 4 nước đi, hai đội quân tiến lại gần nhau, và các cách mở đầu ở trên nhường chỗ cho giữa ván. Bạn không cần nhớ các chuỗi nước: chỉ cần nhớ rằng mỗi nước đi nên chuẩn bị cho nước tiếp theo.</p>
      <ul>
        <li><a href="/play/">Chơi với máy tính ngay trong trình duyệt</a> và thử mở đầu 1 hoặc 2.</li>
        <li><a href="/vi/huong-dan/co-nhay-chien-thuat">Chiến thuật cờ đam Trung Quốc</a>: thang, giữ các quân gần nhau và lấp đầy đích.</li>
        <li><a href="/vi/huong-dan/co-nhay-2-nguoi">Cờ đam Trung Quốc cho 2 người</a>: một ván cho hai người diễn ra thế nào.</li>
        <li><a href="/vi/luat-choi/co-nhay">Luật cờ đam Trung Quốc</a>, với hình minh họa bước, cú nhảy và chuỗi nhảy.</li>
      </ul>
    </section>`;

export default {
  nav: "Nước đi mở đầu cờ đam Trung Quốc",
  titel: "Nước đi mở đầu cờ đam Trung Quốc: 2 cách | Leapstone",
  beschrijving: "Nước đi mở đầu cờ đam Trung Quốc: cách nhảy ra khỏi đỉnh, giải phóng quân ở chóp ở nước đi 2, tiến 13 hàng trong 4 nước đi và các lỗi cần tránh.",
  h1: "Nước đi mở đầu cờ đam Trung Quốc",
  intro: "Một cách mở đầu tốt trong cờ đam Trung Quốc nhảy ra từ hàng thứ hai, dùng một quân khác nhau mỗi lượt, và cho quân ở chóp ra ở nước đi 2 hoặc 4. Hai cách mở đầu có hình minh họa, và các lỗi cần tránh.",
  inhoud,
};
