// Hướng dẫn chiến thuật cờ đam Trung Quốc bằng tiếng Việt (taak 134): /vi/huong-dan/co-nhay-chien-thuat.
// Nội dung: hướng dẫn tiếng Anh ../en/chinese-checkers-strategy.mjs (mỗi mẹo đã kiểm tra với crates/halma-core), từng câu một.
// Không có "chuyên gia", số liệu hay lịch sử bịa ra. Con số duy nhất là 16 (bước từ đỉnh này sang đỉnh kia), mà ví dụ đếm lại.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Các mẹo này dựa trên điều gì</h2>
      <p>Các mẹo xuất phát từ <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> như Leapstone chơi: một nước đi là một bước hoặc một chuỗi nhảy, và bạn có thể nhảy qua quân của bất kỳ màu nào. Chúng không phải là bằng chứng về cách chơi tốt nhất. Chơi với máy tính là cách nhanh nhất để thử chúng.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Xây thang</h2>
      <p>Thang là một hàng quân với một ô trống giữa mỗi quân. Một quân ở một đầu nhảy qua cả hàng chỉ trong một nước đi, nên nó băng qua bàn cờ trong một lượt thay vì mỗi lượt một ô.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Bốn quân xếp theo một đường chéo với một ô trống giữa mỗi quân. Một quân đỏ ở một đầu nhảy qua cả bốn quân, với bốn ô đáp được đánh số.",
  tekst: "Bốn cú nhảy trong một nước đi. Cũng quân đó nếu không chỉ có thể bước từng ô một.",
})}
      <p>Một cú nhảy đi được theo cả sáu hướng, kể cả lùi về sau, nên thang không nhất thiết phải bắt đầu ở đỉnh của bạn. Bất kỳ hàng quân nào có khoảng trống giữa chúng đều dùng được.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Giữ các quân gần nhau</h2>
      <p>Bạn cần cả 10 quân ở đích, nên quân cuối cùng của bạn quyết định khi nào bạn hoàn thành. Một quân không có quân nào kề bên thì không có gì để nhảy qua, và chỉ có thể bước.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với một quân đỏ đứng một mình ở đỉnh dưới. Chỉ hai ô kề trống của nó được đánh dấu. Các quân đỏ và xanh dương khác đứng ở giữa.",
  tekst: "Quân này không có ô kề nào có quân, nên nó chỉ có thể bước sang hai ô được đánh dấu.",
})}
      <p>Từ chóp đỉnh của bạn đến chóp đỉnh đích bên kia bàn cờ là 16 bước. Đó là 16 lượt cho một quân đi một mình, trong khi một cái thang băng qua trong một lượt. Hãy đi các quân ở phía sau khi vẫn còn quân quanh chúng để nhảy qua. Máy tính trong Leapstone cũng làm vậy: nó chấm điểm các nước đi của những quân sau cùng cao hơn một chút.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Dùng khu vực giữa</h2>
      <p>Một quân ở giữa bàn cờ có sáu ô kề, nên nó có thể bước hoặc nhảy theo cả sáu hướng. Một quân ở rìa có ít hơn. Quân ở rìa trong hình có bốn.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Bàn cờ hình ngôi sao với một quân đỏ ở giữa có sáu ô kề được đánh dấu, và một quân đỏ gần mép trên bên trái có bốn ô kề được đánh dấu.",
  tekst: "Sáu cách bước ở giữa, bốn cách ở rìa.",
})}
      <p>Các quân ở giữa cũng cho những quân khác thứ để nhảy qua trên đường băng qua bàn cờ.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Lấp đầy đích từ phía sau</h2>
      <p>Đích của bạn là một tam giác gồm 10 ô, với các hàng 4, 3, 2 và 1 ô. Các ô ở phía sau chỉ đến được qua các ô phía trước chúng. Nếu bạn lấp phía trước trước, quân cuối cùng có thể không còn đường vào.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Đỉnh đích ở trên với chín quân đỏ và một ô trống ở tận phía sau, được đánh dấu bằng nét đứt. Quân đỏ thứ mười, có vòng trắng, đứng bên dưới hàng đầu.",
  tekst: "Chín quân đã về nhà, và ô ở phía sau còn trống. Quân thứ mười không có nước đi nào vào đó.",
})}
      <p>Hãy đưa những quân đầu tiên vào các ô phía sau và tiến dần về phía trước, để phía trước còn mở cho những quân đến cuối cùng.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Đừng nhốt một quân trong đích của bạn</h2>
      <p>Bạn có thể dừng ở đỉnh của người chơi khác, nên một quân của người chơi khác có thể nằm trong đích của bạn. Bạn chỉ thắng khi cả 10 ô của đích có quân của chính bạn. Nếu quân đó không có nước đi, không ai di chuyển được nó, và bạn không thể thắng cho đến khi một ô kề nó mở ra.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Đỉnh đích ở trên với chín quân đỏ và một quân xanh dương ở tận phía sau, được đánh dấu bằng vòng trắng. Quân xanh dương bị các quân đỏ bao quanh.",
  tekst: "Quân xanh dương ở phía sau không có nước đi nào, và quân đỏ không thể lấp đầy đích.",
})}
      <p>Hãy để mở một ô kề một quân như vậy, để nó có thể rời đi. Máy tính trong Leapstone tính đến điều này: một nước đi nhốt quân của người chơi khác trong đích của chính nó sẽ bị chấm điểm thấp hơn. Luật không bắt ai phải rời khỏi đích của bạn, nên người chơi kia cũng có thể cố ý đỗ một quân ở đó.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Chặn một cú nhảy, hoặc để yên</h2>
      <p>Một cú nhảy cần một ô trống để đáp xuống. Lấp ô đó và cú nhảy biến mất. Hai quân liền nhau cũng không nhảy qua được.</p>
      <p>Quân của bạn cũng là bậc đá cho người chơi kia. Ở hình bên trái, quân xanh dương băng qua hai quân đỏ trong một nước đi. Ở hình bên phải, quân đỏ đã đưa một quân vào ô đáp đầu tiên, và quân xanh dương chỉ có thể bước.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Một quân xanh dương với hai quân đỏ trên một hàng, mỗi quân có một ô trống phía sau. Các mũi tên thể hiện hai cú nhảy của quân xanh dương.",
          tekst: "Trước: quân xanh dương có thể nhảy hai lần.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Cũng hàng đó sau khi quân đỏ đưa quân ở xa vào ô đáp đầu tiên. Quân xanh dương được theo sau bởi hai quân đỏ liền nhau.",
          tekst: "Sau: quân đỏ đã đi một quân. Quân xanh dương không có cú nhảy nào.",
        })}
      </div>
      <p>Một nước đi dùng để chặn là một nước đi không dùng cho tiến độ của bạn, nên hãy chặn khi cú nhảy mang lại cho người chơi kia nhiều hơn nước đi của bạn mang lại cho bạn. Khi bạn xây thang thì ngược lại: sau nước đi của bạn, người chơi kia đi trước, nên một quân của họ ở một đầu dùng thang của bạn trước bạn. Ở mức khó nhất, máy tính xem xét phản ứng tốt nhất của từng đối thủ trước khi chọn một nước đi.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Tiếp tục nhé</h2>
      <ul>
        <li><a href="/play/">Chơi với máy tính trong trình duyệt</a> và thử xây một cái thang.</li>
        <li><a href="/vi/huong-dan/co-nhay-2-nguoi">Cờ đam Trung Quốc cho 2 người chơi</a>: một ván hai người diễn ra thế nào.</li>
        <li><a href="/vi/luat-choi/co-nhay">Luật cờ đam Trung Quốc</a>, kèm hình ảnh về bước, nhảy và chuỗi nhảy.</li>
      </ul>
      <p><a href="/vi/huong-dan/co-nhay-online-voi-ban-be">Cờ đam Trung Quốc online với bạn bè</a></p>
      <p><a href="/vi/huong-dan/halma-hay-co-nhay">Halma hay cờ đam Trung Quốc</a></p>
      <p><a href="/vi/huong-dan/co-nhay-3-nguoi">Cờ đam Trung Quốc cho 3 người chơi</a></p>
    </section>`;

export default {
  nav: "Chiến thuật cờ đam Trung Quốc",
  titel: "Chiến thuật cờ đam Trung Quốc: 6 mẹo có hình | Leapstone",
  beschrijving: "Chiến thuật cờ đam Trung Quốc: xây thang, giữ các quân gần nhau, dùng khu vực giữa, lấp đích từ phía sau, và khi nào nên chặn một cú nhảy.",
  h1: "Chiến thuật cờ đam Trung Quốc",
  intro: "Sáu mẹo cho bàn cờ sao, mỗi mẹo kèm một hình từ luật chơi thật: thang, quân tụt lại, khu vực giữa, lấp đầy đích và chặn các cú nhảy.",
  inhoud,
};
