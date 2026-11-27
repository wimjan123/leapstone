// Panduan bahasa Indonesia Dam Cina untuk 6 pemain (taak 302). Teksnya mengikuti ../en/chinese-checkers-6-players.mjs kalimat demi kalimat.
// Aturannya berasal dari crates/halma-core (Board::star dengan start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) dan batas waktunya dari "Techniek".
// Pemeriksaan per pernyataan ada di docs/plan.md, taak 302.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cara permainan dimulai</h2>
      <p>Setiap pemain punya 10 bidak, dan semua 6 ujung bintang dipakai. Itu berarti ada 60 bidak di papan dengan 121 petak. 61 petak di tengah kosong pada awalnya.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 bidak di setiap ujung dari 6 ujungnya, dalam 6 warna",
  tekst: "6 pemain, 6 ujung, 60 bidak.",
})}
      <p>Pemain 1, merah, jalan lebih dulu, dari ujung bawah. Setelah itu giliran berjalan dari Pemain 1 sampai Pemain 6, dan setelah Pemain 6 giliran kembali ke Pemain 1. Para pemain diberi nomor menurut urutan ujung mereka mengelilingi bintang, jadi pemain setelahmu selalu mulai di ujung di sebelah ujungmu. Satu langkah adalah satu geseran atau rangkaian lompatan dengan satu bidak. Lihat <a href="/id/aturan/dam-cina">aturan dam Cina</a> untuk geseran dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Setiap tujuan penuh pada awalnya</h2>
      <p>Kamu menang dengan memindahkan semua 10 bidakmu ke ujung di seberang papan. Dengan 6 pemain, ujung itu adalah tempat pemain di seberangmu memulai, jadi tidak ada tujuan yang kosong: setiap tujuan mulai penuh dengan bidak pemain lain. Untuk merah, tujuannya adalah ujung atas, tempat Pemain 4 memulai.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Papan bintang dengan 6 ujung yang penuh. Lingkaran putus-putus menandai ujung atas, tujuan pemain merah, yang berisi bidak pemain di seberang.",
  tekst: "Tujuan merah adalah ujung di seberang, penuh dengan bidak Pemain 4.",
})}
      <p>Kamu hanya bisa mendarat di petak kosong, jadi pemain di seberang harus meninggalkan ujungnya sebelum kamu bisa mengisinya, dan kamu harus meninggalkan ujungmu sebelum mereka bisa mengisi ujung mereka. Dalam permainan untuk 2 pemain, hanya itu yang perlu dipikirkan. Dengan 6, keduanya juga harus melewati kerumunan 4 pemain lainnya.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Bagian tengah yang ramai</h2>
      <p>Setiap tujuan ada di seberang papan, dan ujung-ujungnya hanya terhubung satu sama lain lewat bagian tengah, jadi semua 60 bidak harus menyeberangi 61 petak yang sama. Di awal belum ada yang menyeberang, dan bagian tengah cepat penuh.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Satu bidak merah melompat tiga kali dalam satu langkah: melewati bidak biru, lalu bidak hijau, lalu bidak ungu. Angka 1, 2, dan 3 menandai petak pendaratan.",
  tekst: "Bidak dari setiap warna adalah batu pijakan.",
})}
      <p>Kamu bisa melompati bidak berwarna apa pun. Bidak dari 5 pemain lain adalah batu pijakan bagimu, dan bidakmu adalah batu pijakan bagi mereka, ke-5 pemain itu. Sederet bidak yang kamu tinggalkan di tengah adalah tangga bagi siapa pun yang bisa mencapainya, dan pemain setelahmu mendapat kesempatan pertama.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Memblokir dengan 5 lawan</h2>
      <ul>
        <li><strong>Isi petak pendaratan:</strong> sebuah lompatan membutuhkan petak kosong tepat di belakang bidak. Saat kamu memindahkan bidak ke sana, lompatan itu hilang bagi setiap pemain yang menginginkannya.</li>
        <li><strong>Waspadai tangga yang kamu bangun:</strong> setelah langkahmu, 5 pemain lain jalan sebelum giliranmu tiba lagi. Satu tangga membantu mereka semua.</li>
        <li><strong>Siapa pun bisa memblokir tujuan:</strong> bidak pemain lain mana pun di tujuanmu menghalangimu menyelesaikan permainan, bukan hanya bidak pemain di seberang. Semua 10 petak tujuan harus berisi bidakmu sendiri.</li>
      </ul>
      <p><a href="/id/panduan/dam-cina-strategi">Tips strategi</a> menunjukkan seperti apa lompatan yang terblokir, dan cara agar tidak mengunci bidak pemain lain di tujuanmu sendiri.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Berapa lama satu permainan</h2>
      <p>Permainan untuk 6 pemain punya 60 bidak untuk dipindahkan, dan di antara satu langkahmu dan langkah berikutnya, 5 pemain lain masing-masing jalan satu kali. Permainan juga tidak berakhir saat pemain pertama selesai.</p>
      <ul>
        <li><strong>Menang, lalu terus bermain:</strong> pemain pertama yang mengisi tujuan menang, dan yang lain terus bermain untuk peringkat berikutnya. Pemain yang sudah selesai dilewati, dan bidaknya tetap di papan sebagai batu pijakan. Permainan berakhir saat hanya satu pemain yang masih bermain.</li>
        <li><strong>Menyerah:</strong> bidakmu meninggalkan papan, jadi tidak lagi memblokir atau membantu siapa pun, dan yang lain terus bermain.</li>
        <li><strong>Waktu (online):</strong> dalam permainan online, setiap langkah punya batas waktu yang ditentukan pemain yang memulai permainan: 15 detik, 30 detik, 1 menit, 2 menit, atau tanpa batas. Satu putaran 6 langkah memakan waktu paling lama 6 kali batas itu, jadi dengan 30 detik paling lama 3 menit. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah, dan permainan berlanjut tanpamu.</li>
      </ul>
      <p>Untuk permainan dengan lebih sedikit pemain, baca <a href="/id/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 6 pemain di Leapstone</h2>
      <ul>
        <li><strong>Melawan komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone di browser</a>, ketuk Komputer, pilih papan bintang dan 5 komputer. Kamu adalah Pemain 1, jadi kamu jalan lebih dulu. Para komputer jalan satu per satu, masing-masing dengan jeda singkat, jadi kamu bisa mengikuti setiap langkah. Kamu memilih Mudah, Normal, atau Sulit untuk komputernya.</li>
        <li><strong>Di satu ponsel:</strong> ketuk Main, pilih papan bintang dan 6 pemain, lalu ketuk sebuah bidak untuk mengganti tempat itu antara orang dan komputer.</li>
        <li><strong>Online bersama teman:</strong> ketuk Teman, pilih papan bintang, 6 pemain, dan waktu per langkah, lalu kirim tautan undangan. Permainan dimulai saat semua 6 tempat sudah terisi.</li>
        <li><strong>Permainan cepat:</strong> Main online mencarikan permainan untuk 2 atau 4 pemain, jadi tidak ada permainan cepat untuk 6.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 6 pemain",
  titel: "Cara main Dam Cina 6 pemain: papan penuh | Leapstone",
  beschrijving: "Cara kerja dam Cina dengan 6 pemain: bintang penuh berisi 60 bidak, bagian tengah yang ramai, memblokir, lama permainan, dan tempat memainkannya.",
  h1: "Dam Cina untuk 6 pemain",
  intro: "Cara kerja permainan untuk 6 pemain: semua 6 ujung penuh, kamu berlomba ke ujung di seberang papan, dan permainan berlanjut setelah pemain pertama selesai.",
  inhoud,
};
