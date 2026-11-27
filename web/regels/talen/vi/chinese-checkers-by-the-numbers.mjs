// Leapstone qua những con số, Vietnamees (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Ô và quân</h2>
      <p>Đếm trên hai bàn cờ của Leapstone, ở thế cờ ban đầu của một ván.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Bàn cờ hình ngôi sao với cả sáu đỉnh đều đầy: mười quân cho mỗi màu trong sáu màu, quanh một khoảng giữa trống.",
  tekst: "Bàn cờ hình ngôi sao lúc bắt đầu một ván sáu người chơi.",
})}
      <ul class="tips">
        <li><strong>Bàn cờ hình ngôi sao có ${f("sterbord_vakken")} ô.</strong> Mỗi người chơi bắt đầu với ${f("sterbord_stenen_per_speler")} quân. Vậy một ván hai người có ${f("sterbord_stenen_2_spelers")} quân trên bàn, một ván ba người có ${f("sterbord_stenen_3_spelers")}, bốn người có ${f("sterbord_stenen_4_spelers")} và sáu người có ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Bàn cờ Halma hình vuông có ${f("vierkant_vakken")} ô.</strong> Trong một ván hai người, mỗi người chơi bắt đầu với ${f("vierkant_stenen_per_speler_2_spelers")} quân, tổng cộng ${f("vierkant_stenen_2_spelers")}. Trong một ván bốn người, mỗi người bắt đầu với ${f("vierkant_stenen_per_speler_4_spelers")} quân, tổng cộng ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Chuỗi nhảy dài nhất: ${f("langste_sprongketen")}</h2>
      <p>Trên bàn cờ hình ngôi sao, một quân có thể <strong>nhảy ${f("langste_sprongketen")} lần trong một nước đi</strong>, và theo luật của Leapstone không nước đi nào có thể nhiều hơn. Để đạt con số đó, các quân khác được đặt tự do: mỗi ô mà quân nhảy qua có một quân.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Một bàn cờ hình ngôi sao với một quân đỏ và nhiều quân xanh dương. Các mũi tên trắng cho thấy quân đỏ nhảy qua hết quân xanh này đến quân xanh khác, theo một đường dài và quanh co.",
  tekst: "Chuỗi dài nhất: quân đỏ nhảy qua từng quân xanh, hết quân này đến quân khác.",
})}
      <p><strong>Cách đếm.</strong> Một bước nhảy luôn đáp xuống cách hai ô, theo đường thẳng. Vì vậy một quân cứ nhảy tiếp chỉ đến được một phần các ô: bàn cờ chia thành bốn nhóm như vậy, và nhóm lớn nhất có ${f("grootste_klasse_vakken")} ô. Trong Leapstone, trong một nước đi, quân không được đáp hai lần xuống cùng một ô, cũng không được đáp xuống ô nó xuất phát. Vậy một chuỗi đáp xuống mỗi ô khác trong nhóm của nó nhiều nhất một lần. Chương trình đã tìm trong nhóm đó và thấy một đường đi qua cả ${f("grootste_klasse_vakken")} ô, nên không chuỗi nào có thể dài hơn: ${f("langste_sprongketen")} lần nhảy. Sau đó một bài kiểm thử chơi nước đi ấy theo luật của Leapstone.</p>
      <p><strong>Không phải một ván thật.</strong> Chuỗi này cần ${f("langste_sprongketen")} quân khác, mỗi quân đúng ở ô của nó. Một ván hai hoặc ba người chỉ có ${f("sterbord_stenen_2_spelers")} hoặc ${f("sterbord_stenen_3_spelers")} quân, quá ít. Một ván bốn hoặc sáu người có ${f("sterbord_stenen_4_spelers")} hoặc ${f("sterbord_stenen_6_spelers")}, đủ dùng. Nhưng trong một ván thật không ai đặt quân tự do, nên đừng mong thấy chuỗi này bên bàn cờ. Nó cho thấy bàn cờ cho phép điều gì, không phải điều xảy ra khi chơi.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Đường sang nhanh nhất: ${f("oversteek_zetten")} nước</h2>
      <p>Một người chơi một mình trên bàn cờ hình ngôi sao, không có đối thủ, cần <strong>${f("oversteek_zetten")} nước</strong> để đưa cả ${f("sterbord_stenen_per_speler")} quân từ một đỉnh sang đỉnh đối diện, và không thể ít hơn. Cả một chuỗi nhảy tính là một nước.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Một bàn cờ hình ngôi sao chỉ có mười quân đỏ, ở đỉnh dưới. Đỉnh trên, nơi chúng phải đến, có viền nét đứt.",
  tekst: "Một người chơi một mình: mười quân ở đỉnh dưới, và đỉnh trên là đích.",
})}
      <p><strong>Cách đếm.</strong> Một bài kiểm thử chơi một đường sang ${f("oversteek_zetten")} nước theo luật của Leapstone, không có quân nào khác trên bàn. Để chứng minh rằng ${f("geen_oversteek_in_zetten")} nước hoặc ít hơn là không thể, một cuộc tìm kiếm làm theo phương pháp của G. I. Bell (<em>Integers</em> 9, 2009). Mọi nước đi đều chơi ngược lại được, và xoay bàn cờ nửa vòng thì đổi chỗ điểm xuất phát và đích. Vậy nếu có một đường sang ${f("geen_oversteek_in_zetten")} nước hoặc ít hơn, thì một thế cờ ở giữa đường sẽ cách điểm xuất phát nhiều nhất ${f("zoekdiepte_zetten")} nước, và chính thế cờ đó khi xoay nửa vòng cũng vậy. Cuộc tìm kiếm đã đi qua mọi thế cờ cách điểm xuất phát không quá ${f("zoekdiepte_zetten")} nước, đếm một thế cờ và ảnh trong gương của nó một lần, bỏ đi những thế cờ chắc chắn không thể đi đủ xa kịp lúc, và không tìm thấy cặp nào như thế. Nó chạy ${f("gemeten_rekentijd_seconden")} giây trên một máy có ${f("gemeten_kernen")} lõi, và bước lớn nhất của nó chứa ${f("gemeten_grootste_laag_miljoen_standen")} triệu thế cờ trong ${f("gemeten_geheugen_gb")} GB bộ nhớ. Con số này được tính lại cho chính bàn cờ của Leapstone.</p>
      <p><strong>Không phải giới hạn dưới cho một ván thật.</strong> Trong một ván thật, quân của những người chơi khác cũng ở trên bàn, và quân của bạn có thể nhảy qua chúng. Vậy ${f("oversteek_zetten")} không phải số nước ít nhất mà một ván thật có thể cần: nó chỉ được chứng minh cho một người chơi một mình.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Thử ngay</h2>
      <p><a href="/play/">Chơi Leapstone trên trình duyệt</a> với máy, hoặc tải ứng dụng bằng các nút ở đầu trang này. Về luật chơi, hãy đọc <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a> hoặc <a href="/vi/luat-choi/halma">luật Halma</a>. Để biết cách dùng chuỗi nhảy trong một ván, hãy đọc <a href="/vi/huong-dan/co-nhay-chien-thuat">mẹo chiến thuật</a>.</p>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc qua những con số",
  titel: "Cờ đam Trung Quốc qua những con số | Leapstone",
  beschrijving: `Bàn cờ ngôi sao có ${c.sterbord_vakken} ô. Một nước có nhiều nhất ${c.langste_sprongketen} lần nhảy, và một người chơi một mình cần ${c.oversteek_zetten} nước để sang bên kia. Cách tính từng con số.`,
  h1: "Cờ đam Trung Quốc qua những con số",
  intro: `Bàn cờ hình ngôi sao của cờ đam Trung Quốc có ${f("sterbord_vakken")} ô, và mỗi người chơi bắt đầu với ${f("sterbord_stenen_per_speler")} quân. Trong Leapstone, một nước đi không bao giờ có hơn ${f("langste_sprongketen")} lần nhảy. Một người chơi một mình trên bàn, không có đối thủ, cần ${f("oversteek_zetten")} nước để sang bên kia. Dưới đây bạn sẽ thấy cách đếm từng con số, và con số ấy nói gì và không nói gì về một ván thật.`,
  inhoud,
};
