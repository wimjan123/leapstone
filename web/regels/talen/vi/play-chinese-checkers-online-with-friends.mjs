// Hướng dẫn chơi cờ đam Trung Quốc online với bạn bè bằng tiếng Việt (taak 304, feature 294): /vi/huong-dan/co-nhay-online-voi-ban-be.
// Nội dung: tiếng Anh ../en/play-chinese-checkers-online-with-friends.mjs, từng câu một (taak 304, "tekst volgt ../en/ zin voor zin").

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Các bước, từ lúc bắt đầu đến nước đi đầu tiên</h2>
      <ol>
        <li><strong>Chọn tên người chơi.</strong> Chỉ cần vậy là bạn đăng nhập được.</li>
        <li><strong>Tạo một ván chơi trực tuyến.</strong> Chọn bàn cờ, số người chơi và thời gian mỗi nước đi.</li>
        <li><strong>Gửi liên kết mời.</strong> Chia sẻ từ Phòng chờ, hoặc sao chép rồi dán vào bất kỳ ứng dụng nhắn tin nào.</li>
        <li><strong>Đợi mọi người mở liên kết.</strong> Khi chỗ cuối cùng có người ngồi, ván chơi bắt đầu và bạn đi trước.</li>
      </ol>
      <p>Phần còn lại của trang này giải thích từng bước, và chuyện gì xảy ra khi một người bạn ngừng chơi.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Liên kết mời hoạt động thế nào</h2>
      <p>Mỗi ván chơi có một liên kết mời, và mọi người bạn dùng cùng một liên kết đó. Ai mở liên kết sẽ ngồi vào chỗ trống kế tiếp. Bạn tạo ván chơi nên bạn là người chơi 1, và bạn ngồi chỗ đầu tiên.</p>
      <ul>
        <li><strong>Bao nhiêu chỗ:</strong> trên bàn cờ sao, một ván có 2, 3, 4 hoặc 6 người chơi, còn trên bàn cờ vuông là 2 hoặc 4. Bạn chọn điều này trước khi gửi liên kết. Ván chơi không bắt đầu khi còn chỗ trống, và chưa ai được đi cho đến khi chỗ cuối cùng có người.</li>
        <li><strong>Phòng chờ:</strong> trong lúc đợi, Phòng chờ cho biết ai đã vào và còn bao nhiêu chỗ trống. Phòng chờ tự cập nhật khi có bạn vào.</li>
        <li><strong>Chia sẻ:</strong> nút Mời mở menu chia sẻ của điện thoại. Nếu không có menu đó, nút sẽ sao chép liên kết và bạn tự dán đi.</li>
        <li><strong>Trên trình duyệt hoặc trong ứng dụng:</strong> liên kết dùng được mà không cần ứng dụng, ngay trong trình duyệt. Nếu bạn của bạn có ứng dụng, liên kết có thể mở ứng dụng.</li>
        <li><strong>Liên kết đã đầy hoặc không có thật:</strong> khi mọi chỗ đã có người, liên kết báo rằng ván chơi đã đầy. Liên kết không tồn tại thì báo rằng lời mời không có. Trong cả hai trường hợp, hãy xin bạn mình một liên kết mới.</li>
      </ul>
      <p>Liên kết chỉ dành cho ván chơi này. Nó có 16 ký tự ngẫu nhiên nên không ai đoán được, nhưng ai có được liên kết cũng có thể ngồi vào chỗ trống. Chỉ gửi cho những người bạn muốn chơi cùng.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Không cần tài khoản, chỉ cần tên người chơi</h2>
      <p>Bạn không cần địa chỉ email hay mật khẩu. Bạn chọn một tên người chơi dài từ 1 đến 30 ký tự, và những người chơi khác sẽ thấy tên đó. Một số tên thô tục bị từ chối, khi đó bạn chọn tên khác.</p>
      <p>Sau khi chọn tên, ứng dụng hiện một mã khôi phục gồm 20 ký tự, chia thành năm nhóm. Hãy lưu lại. Nếu đổi điện thoại mới, bạn nhập mã và lấy lại được tên người chơi của mình. Không có mã, bạn không thể lấy lại tên trên điện thoại mới.</p>
      <p>Bạn bè của bạn làm giống vậy khi mở liên kết: họ chọn tên trước, rồi mới vào ván chơi của bạn.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Thời gian mỗi nước đi: một người bạn được nghĩ bao lâu</h2>
      <p>Thời gian mỗi nước đi là khoảng thời gian dài nhất một người chơi có cho một nước đi. Bạn đặt nó khi tạo ván chơi, và nó áp dụng cho mọi người trong ván đó.</p>
      <ul>
        <li><strong>Các lựa chọn:</strong> 15 giây, 30 giây, 1 phút hoặc 2 phút. Bạn cũng có thể tắt đi, tức là không giới hạn. Ứng dụng mặc định là 30 giây.</li>
        <li><strong>Đồng hồ:</strong> máy chủ giữ thời gian, nên điện thoại có đồng hồ sai cũng không ảnh hưởng. Ứng dụng cho thấy còn bao nhiêu thời gian.</li>
        <li><strong>Đồng hồ đầu tiên:</strong> nó bắt đầu chạy khi chỗ cuối cùng có người. Trước đó chưa ai bị tính giờ.</li>
        <li><strong>Ván chơi nhanh:</strong> nếu bạn chạm Chơi trực tuyến để chơi với người lạ, thời gian mỗi nước đi cố định là 30 giây. Chỉ ván chơi với bạn bè mới cho bạn chọn.</li>
      </ul>
      <p>Với những người bạn chơi thong thả trên ghế sofa, 2 phút hoặc không giới hạn là thoải mái. Muốn chơi nhanh thì chọn 15 giây. Khi không giới hạn, ván chơi có thể chờ bao lâu cũng được, và bạn chơi nốt khi có thời gian.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Chuyện gì xảy ra khi có người bỏ ngang</h2>
      <p>Ván chơi nằm trên máy chủ, không nằm trên điện thoại. Nếu một người bạn đóng ứng dụng, mất kết nối hoặc đi ngủ, ván chơi vẫn giữ nguyên chỗ cũ, và bạn đó tìm lại nó trong Ván chơi của tôi.</p>
      <ul>
        <li><strong>Hết thời gian:</strong> lượt của người chơi đó bị bỏ qua. Không quân nào di chuyển trên bàn cờ, và người chơi kế tiếp bị tính giờ.</li>
        <li><strong>Ba lượt liên tiếp:</strong> người chơi bỏ lỡ 3 lượt liên tiếp sẽ tự đầu hàng. Mỗi nước đi người đó thực hiện sẽ đưa bộ đếm về không.</li>
        <li><strong>Đầu hàng:</strong> người chơi đầu hàng, do tự chọn hoặc sau 3 lượt bị bỏ lỡ, sẽ bị lấy quân khỏi bàn cờ, nên không cản đường ai.</li>
        <li><strong>Ván chơi cho 2 người:</strong> ván kết thúc và người còn lại thắng.</li>
        <li><strong>Ván chơi cho 3, 4 hoặc 6 người:</strong> ván tiếp tục mà không có người đã rời đi, và lượt chuyển cho người kế tiếp vẫn còn trong ván.</li>
        <li><strong>Không có thời gian mỗi nước đi:</strong> nếu bạn chọn không giới hạn, ván chơi không bao giờ bỏ qua lượt. Nó đợi đến khi người bạn quay lại, hoặc đến khi người bạn đầu hàng.</li>
      </ul>
      <p>Nếu bạn đã bật thông báo, ứng dụng báo cho bạn khi đến lượt, kể cả khi ứng dụng đang đóng. Hãy bật chúng trong ứng dụng, hoặc trong cài đặt điện thoại hay trình duyệt.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Sau ván chơi</h2>
      <p>Những người chơi cùng nhau qua lời mời sẽ được thêm vào danh sách bạn bè của nhau. Từ đó bạn có thể thách đấu một người bạn ván mới, không cần liên kết mới. Các ván đang chơi và đã kết thúc của bạn nằm trong Ván chơi của tôi.</p>
      <p>Mới làm quen với luật? Hãy đọc <a href="/vi/luat-choi/co-nhay">luật cờ đam Trung Quốc</a>. Chơi hai người? Hãy đọc <a href="/vi/huong-dan/co-nhay-2-nguoi">cờ đam Trung Quốc cho 2 người</a>. Muốn thắng? Hãy đọc <a href="/vi/huong-dan/co-nhay-chien-thuat">các mẹo chiến thuật</a>.</p>
      <p><a href="/vi/huong-dan/co-nhay-3-nguoi">Cờ đam Trung Quốc cho 3 người chơi</a></p>
    </section>`;

export default {
  nav: "Cờ đam Trung Quốc online với bạn bè",
  titel: "Chơi cờ đam Trung Quốc online với bạn bè | Leapstone",
  beschrijving: "Chơi cờ đam Trung Quốc online với bạn bè: gửi liên kết mời, đặt thời gian mỗi nước, chỉ cần tên người chơi, và xem chuyện gì xảy ra nếu có người bỏ ngang.",
  h1: "Chơi cờ đam Trung Quốc online với bạn bè",
  intro: "Tạo một ván chơi, gửi một liên kết mời và chơi khi mọi người đã vào. Bạn chỉ cần một tên người chơi, và tự đặt thời gian mỗi nước đi.",
  inhoud,
};
