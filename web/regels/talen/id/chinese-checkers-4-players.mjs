// Panduan bahasa Indonesia "Dam Cina untuk 4 pemain" (taak 301). Kalimat demi kalimat dari ../en/chinese-checkers-4-players.mjs.
// Aturan dan tampilan aplikasi: lihat rujukan sumber di berkas bahasa Inggris.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cara papan dibagi</h2>
      <p>Setiap pemain punya 10 bidak, jadi 40 bidak berdiri di papan dengan 121 petak. Keempat ujung awal adalah dua pasang ujung yang bersebelahan: merah di bawah dan biru di kiri bawah, hijau di atas dan kuning di kanan atas.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 bidak merah di ujung bawah, 10 bidak biru di ujung kiri bawah, 10 bidak hijau di ujung atas, dan 10 bidak kuning di ujung kanan atas. Ujung kiri atas dan kanan bawah kosong.",
  tekst: "Merah di bawah, biru di kiri bawah, hijau di atas, kuning di kanan atas.",
})}
      <p>Pemain 1, merah, jalan lebih dulu. Lalu biru adalah Pemain 2, hijau Pemain 3, kuning Pemain 4, dan setelah kuning giliran merah lagi. Satu langkah adalah satu geseran atau rangkaian lompatan dengan satu bidak. Lihat <a href="/id/aturan/dam-cina">aturan dam Cina</a> untuk geseran dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Siapa berhadapan dengan siapa</h2>
      <p>Ujung-ujung itu berpasangan di seberang papan: merah berhadapan dengan hijau, dan biru dengan kuning. Tujuanmu adalah ujung di seberangmu. Merah pergi ke tempat hijau mulai, hijau ke tempat merah mulai, biru ke tempat kuning mulai, dan kuning ke tempat biru mulai.</p>
      <p>Seperti pada permainan untuk 2 pemain, setiap tujuan mulai penuh dengan bidak pemain yang berhadapan denganmu, jadi kamu hanya bisa mendarat di sana setelah bidak itu pergi. Dengan 3 pemain, tujuan mulai kosong, jadi dengan 4 pemain tidak ada yang bisa langsung selesai. Keempat tujuan adalah empat ujung yang berbeda, jadi tidak ada orang lain yang menginginkan tujuanmu: pemain yang sudah selesai tidak pernah menghalangi siapa pun.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dua ujung yang kosong</h2>
      <p>Ujung kiri atas dan kanan bawah tidak berisi bidak. Keduanya bukan awal dan bukan tujuan siapa pun. Ujung kiri atas berada di antara biru dan hijau, dan ujung kanan bawah di antara kuning dan merah.</p>
      <p>Kamu boleh bergeser atau melompat ke petak kosong mana pun, jadi kamu bisa melintasi ujung-ujung ini atau berhenti di dalamnya. Namun bidak di sana belum berada di tujuan. Di ujung kosong tidak ada yang bisa dilompati sampai seseorang membawa bidak ke sana.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Apa yang berubah dalam taktik</h2>
      <ul>
        <li><strong>Dua penyeberangan sekaligus:</strong> merah dan hijau menyeberangi papan menuju satu sama lain, begitu juga biru dan kuning. Kedua garis melewati bagian tengah, jadi bagian tengah lebih ramai daripada permainan untuk 2 pemain, yang hanya dilewati satu garis.</li>
        <li><strong>Tiga pemain jalan di antara giliranmu:</strong> papan berubah lebih banyak di antara dua langkahmu daripada pada permainan untuk 2 pemain. Lihat papan lagi di awal setiap giliran, lalu rencanakan rangkaian lompatanmu. Pemain yang jalan setelahmu tidak pernah pemain yang berhadapan denganmu.</li>
        <li><strong>Bidak membantu semua orang:</strong> setiap bidak dari ketiga pemain lain adalah batu pijakan bagimu, dan bidakmu bagi mereka. Bidak pemain yang berhadapan denganmu bergerak ke arah sebaliknya, seperti pada permainan untuk 2 pemain.</li>
        <li><strong>Ruang untuk memutar:</strong> jika bagian tengah penuh, ujung-ujung kosong adalah ruang terbuka di samping kubu-kubu. Jalan lewat salah satunya bisa menjadi cara menghindari keramaian.</li>
        <li><strong>Pemain yang menyerah mengosongkan tujuanmu:</strong> saat pemain yang berhadapan denganmu menyerah, bidaknya meninggalkan papan, jadi tujuanmu langsung kosong.</li>
      </ul>
      <p><a href="/id/panduan/dam-cina-strategi">Tips strategi</a> tentang tangga, bidak yang tertinggal, dan mengisi tujuan dari belakang sama saja dengan 4 pemain.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang, dan apa yang terjadi setelahnya</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang mengisi tujuan dengan semua 10 bidak menang. Permainan tidak berhenti di situ: tiga pemain lain terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati. Bidak pemain itu tetap di papan. Permainan berakhir saat hanya satu pemain yang masih bermain.</li>
        <li><strong>Menyerah:</strong> bidakmu meninggalkan papan dan tiga pemain lain terus bermain. Jika yang lain juga menyerah, pemain terakhir yang tersisa menang.</li>
        <li><strong>Waktu (online):</strong> dalam permainan online, setiap langkah punya batas waktu. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah, dan permainan berlanjut tanpamu.</li>
      </ul>
      <p>Untuk permainan dengan lebih sedikit pemain, baca <a href="/id/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>. <a href="/id/aturan/dam-cina">Halaman aturan</a> punya gambar setiap posisi awal.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 4 pemain di Leapstone</h2>
      <ul>
        <li><strong>Melawan komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone di browser</a>, ketuk Komputer, pilih papan bintang dan 3 komputer. Kamu adalah Pemain 1, jadi kamu jalan lebih dulu. Untuk komputer, kamu memilih Mudah, Normal, atau Sulit.</li>
        <li><strong>Di satu ponsel:</strong> ketuk Main, pilih papan bintang dan 4 pemain, lalu ketuk sebuah bidak untuk mengganti tempat itu antara orang dan komputer.</li>
        <li><strong>Online bersama teman:</strong> ketuk Teman, pilih papan bintang, 4 pemain, dan waktu per langkah, lalu kirim tautan undangan. Permainan dimulai saat semua 4 tempat terisi.</li>
        <li><strong>Permainan cepat, di aplikasi:</strong> ketuk Main online. Selagi aplikasi mencari permainan untuk 2 pemain, ketuk Cari 4 atau 6 pemain untuk mencari permainan untuk 4 pemain. Setiap langkah punya 30 detik. Jika dalam 20 detik tidak cukup pemain yang bergabung, pemain komputer mengisi tempat yang kosong, jadi beberapa lawan mungkin pemain komputer.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 4 pemain",
  titel: "Dam Cina untuk 4 pemain: posisi awal dan tips | Leapstone",
  beschrijving: "Cara kerja dam Cina dengan 4 pemain: cara papan dibagi, 2 ujung yang kosong, siapa berhadapan dengan siapa, perubahan taktik, dan tempat bermain.",
  h1: "Dam Cina untuk 4 pemain",
  intro: "Dengan 4 pemain, kalian masing-masing mulai di salah satu dari empat ujung bintang, dan dua ujung tetap kosong. Merah berhadapan dengan hijau dan biru dengan kuning: tujuanmu adalah ujung di seberangmu, penuh dengan bidak pemain itu. Berikut posisi awal, ujung yang kosong, taktik, dan tempat memainkannya.",
  inhoud,
};
