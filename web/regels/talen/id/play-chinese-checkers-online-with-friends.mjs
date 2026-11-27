// Panduan Indonesia "Dam Cina online bersama teman" (taak 304). Tekst volgt ../en/ zin voor zin.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Langkah-langkah, dari awal sampai langkah pertama</h2>
      <ol>
        <li><strong>Pilih nama pemain.</strong> Hanya itu yang kamu perlukan untuk masuk.</li>
        <li><strong>Buat permainan online.</strong> Pilih papan, jumlah pemain, dan waktu per langkah.</li>
        <li><strong>Kirim tautan undangan.</strong> Bagikan dari lobi, atau salin dan tempel di aplikasi obrolan mana pun.</li>
        <li><strong>Tunggu sampai semua orang membukanya.</strong> Saat kursi terakhir terisi, permainan dimulai dan kamu jalan lebih dulu.</li>
      </ol>
      <p>Bagian lain di halaman ini menjelaskan tiap bagian, dan apa yang terjadi saat seorang teman berhenti bermain.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Cara kerja tautan undangan</h2>
      <p>Satu permainan punya satu tautan undangan, dan semua teman memakai tautan yang sama. Setiap teman yang membukanya mengambil kursi kosong berikutnya. Kamu yang membuat permainan, jadi kamu adalah Pemain 1 dan mengambil kursi pertama.</p>
      <ul>
        <li><strong>Berapa kursi:</strong> di papan bintang satu permainan punya 2, 3, 4, atau 6 pemain, dan di papan persegi 2 atau 4. Kamu memilihnya sebelum mengirim tautan. Permainan tidak dimulai dengan kursi kosong, dan tidak ada langkah sampai kursi terakhir terisi.</li>
        <li><strong>Lobi:</strong> selagi kamu menunggu, lobi menunjukkan siapa yang sudah masuk dan berapa kursi yang masih kosong. Lobi diperbarui sendiri saat seorang teman bergabung.</li>
        <li><strong>Membagikan:</strong> tombol Undangan membuka menu bagikan di ponselmu. Jika menu itu tidak tersedia, tombol ini menyalin tautan, dan kamu menempelkannya sendiri.</li>
        <li><strong>Di browser atau di aplikasi:</strong> tautan ini bisa dipakai tanpa aplikasi, di browser. Jika temanmu punya aplikasinya, tautan bisa membukanya.</li>
        <li><strong>Tautan penuh atau tidak dikenal:</strong> setelah semua kursi terisi, tautan menunjukkan bahwa permainan sudah penuh. Tautan yang tidak ada menunjukkan bahwa undangan tidak dikenal. Dalam kedua kasus, minta tautan baru kepada temanmu.</li>
      </ul>
      <p>Tautan ini hanya untuk permainan ini. Tautan ini terdiri dari 16 karakter acak, jadi tidak ada yang bisa menebaknya, tetapi siapa pun yang mendapatkannya bisa mengambil kursi kosong. Kirim hanya kepada orang yang ingin kamu ajak bermain.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Tanpa akun, hanya nama pemain</h2>
      <p>Kamu tidak perlu alamat email atau kata sandi. Kamu memilih nama pemain sepanjang 1 sampai 30 karakter, dan pemain lain melihat nama itu. Beberapa nama kasar ditolak, lalu kamu memilih nama lain.</p>
      <p>Setelah kamu memilih nama, aplikasi menampilkan kode pemulihan sepanjang 20 karakter dalam lima kelompok. Simpan kode itu. Jika kamu mendapat ponsel baru, kamu memasukkan kode itu dan nama pemainmu kembali. Tanpa kode, kamu tidak bisa mendapatkan namamu kembali di ponsel baru.</p>
      <p>Temanmu melakukan hal yang sama saat membuka tautanmu: mereka memilih nama dulu, lalu bergabung ke permainanmu.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Waktu per langkah: berapa lama teman boleh berpikir</h2>
      <p>Waktu per langkah adalah waktu terlama yang dimiliki seorang pemain untuk satu langkah. Kamu mengaturnya saat membuat permainan, dan berlaku untuk semua orang dalam permainan itu.</p>
      <ul>
        <li><strong>Pilihannya:</strong> 15 detik, 30 detik, 1 menit, atau 2 menit. Kamu juga bisa mematikannya, jadi tanpa batas sama sekali. Aplikasi mulai dari 30 detik.</li>
        <li><strong>Jam:</strong> server yang menghitung waktu, jadi ponsel dengan jam yang salah tidak mengubah apa pun. Aplikasi menunjukkan berapa waktu yang tersisa.</li>
        <li><strong>Jam pertama:</strong> jam ini mulai saat kursi terakhir terisi. Sebelum itu, tidak ada yang dihitung waktunya.</li>
        <li><strong>Permainan cepat:</strong> jika kamu mengetuk Main online untuk bermain melawan orang asing, waktu per langkah dikunci di 30 detik. Hanya permainan bersama teman yang membiarkanmu memilih.</li>
      </ul>
      <p>Untuk teman yang bermain santai di sofa, 2 menit atau tanpa batas terasa nyaman. Untuk permainan cepat, pilih 15 detik. Tanpa batas, permainan bisa menunggu selama diperlukan, dan kamu menyelesaikannya saat punya waktu.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Apa yang terjadi saat seseorang keluar</h2>
      <p>Permainan tersimpan di server, bukan di ponsel. Jika seorang teman menutup aplikasi, kehilangan koneksi, atau tertidur, permainan tetap di posisinya, dan teman itu menemukannya lagi di Permainanku.</p>
      <ul>
        <li><strong>Waktu habis:</strong> giliran pemain itu dilewati. Tidak ada yang bergerak di papan, dan pemain berikutnya mulai dihitung waktunya.</li>
        <li><strong>Tiga giliran berturut-turut:</strong> pemain yang melewatkan 3 giliran berturut-turut menyerah dengan sendirinya. Setiap langkah yang dimainkan pemain mengembalikan hitungan ke nol.</li>
        <li><strong>Menyerah:</strong> bidak pemain yang menyerah, karena pilihan sendiri atau setelah 3 giliran terlewat, diambil dari papan, jadi tidak menghalangi siapa pun.</li>
        <li><strong>Permainan untuk 2:</strong> permainan berakhir dan pemain lain menang.</li>
        <li><strong>Permainan untuk 3, 4, atau 6:</strong> permainan berlanjut tanpa pemain yang pergi, dan giliran berpindah ke pemain berikutnya yang masih ada.</li>
        <li><strong>Tanpa waktu per langkah:</strong> jika kamu memilih tanpa batas, permainan tidak pernah melewati giliran. Permainan menunggu sampai teman kembali, atau sampai teman menyerah.</li>
      </ul>
      <p>Jika kamu mengaktifkan notifikasi, aplikasi memberi tahu saat giliranmu, juga saat aplikasi tertutup. Aktifkan dari aplikasi, atau di pengaturan ponsel atau browsermu.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Setelah permainan</h2>
      <p>Pemain yang bermain bersama lewat undangan ditambahkan ke daftar teman satu sama lain. Dari sana kamu bisa menantang teman untuk permainan baru, tanpa tautan baru. Permainanmu yang masih berjalan dan yang sudah selesai ada di Permainanku.</p>
      <p>Baru mengenal aturannya? Baca <a href="/id/aturan/dam-cina">aturan dam Cina</a>. Bermain berdua? Baca <a href="/id/panduan/dam-cina-2-pemain">dam Cina untuk 2 pemain</a>. Ingin menang? Baca <a href="/id/panduan/dam-cina-strategi">tips strategi</a>.</p>
      <p><a href="/id/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a></p>
    </section>`;

export default {
  nav: "Dam Cina online bersama teman",
  titel: "Main dam Cina online bersama teman | Leapstone",
  beschrijving: "Main dam Cina online bersama teman: kirim tautan undangan, atur waktu per langkah, main dengan nama pemain saja, dan ketahui jika ada yang keluar.",
  h1: "Main dam Cina online bersama teman",
  intro: "Buat permainan, kirim satu tautan undangan, dan main setelah semua orang bergabung. Kamu hanya perlu nama pemain, dan waktu per langkah kamu atur sendiri.",
  inhoud,
};
