// Panduan Indonesia "Dam Cina untuk 3 pemain" (taak 299). Zin voor zin vertaald uit ../en/chinese-checkers-3-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cara permainan dimulai</h2>
      <p>Setiap pemain punya 10 bidak, jadi 30 bidak berdiri di papan dengan 121 petak. Bidak itu mulai di setiap ujung bintang secara selang-seling: merah di bawah, biru di kiri atas, dan hijau di kanan atas. Ketiga ujung di antaranya kosong.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 bidak merah di ujung bawah, 10 bidak biru di ujung kiri atas, dan 10 bidak hijau di ujung kanan atas",
  tekst: "Merah di bawah, biru di kiri atas, hijau di kanan atas.",
})}
      <p>Pemain 1, merah, jalan lebih dulu. Lalu biru adalah Pemain 2, hijau adalah Pemain 3, dan setelah hijau giliran merah lagi. Satu langkah adalah satu geseran atau rangkaian lompatan dengan satu bidak. Lihat <a href="/id/aturan/dam-cina">aturan dam Cina</a> untuk geseran dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tiga tujuan, semuanya kosong di awal</h2>
      <p>Tujuanmu adalah ujung di seberang tempat kamu mulai, dan dengan 3 pemain ujung itu mulai kosong. Itu adalah ujung kosong di antara posisi awal dua pemain lainnya: tujuan merah ada di atas, tujuan biru di kanan bawah, dan tujuan hijau di kiri bawah.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Papan bintang untuk tiga pemain. Lingkaran putus-putus dengan warna tiap pemain menandai tiga tujuan kosong: merah di atas, biru di kanan bawah, hijau di kiri bawah.",
  tekst: "Setiap tujuan berwarna sama dengan pemainnya.",
})}
      <p>Kamu menang dengan memindahkan semua 10 bidakmu ke tujuanmu. Semua 10 petak harus berisi bidakmu sendiri. Tidak ada yang mulai di tujuanmu, tetapi kamu boleh berhenti di petak kosong mana pun, jadi bidak pemain lain bisa mendarat di sana nanti. Selama bidak itu ada di sana, kamu tidak bisa menyelesaikan permainan.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang, dan apa yang terjadi setelahnya</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang mengisi tujuan menang. Permainan tidak berhenti di situ: dua pemain lainnya terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati. Permainan berakhir saat hanya satu pemain yang masih bermain.</li>
        <li><strong>Menyerah:</strong> bidakmu meninggalkan papan dan dua pemain lainnya terus bermain. Jika pemain kedua menyerah sebelum ada yang selesai, pemain terakhir yang tersisa menang.</li>
        <li><strong>Waktu (online):</strong> dalam permainan online, setiap langkah punya batas waktu, yang ditentukan oleh pemain yang memulai permainan. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah, dan permainan berlanjut tanpamu.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbedaan dengan permainan untuk 2 pemain</h2>
      <ul>
        <li><strong>Lebih banyak bidak:</strong> 30 di papan, dibanding 20 dengan 2 pemain.</li>
        <li><strong>Tujuan kosong:</strong> dengan 2 pemain, tujuanmu mulai penuh dengan bidak pemain lain. Dengan 3 pemain, tujuan itu mulai kosong.</li>
        <li><strong>Dua lawan:</strong> setelah langkahmu, dua pemain lain jalan sebelum giliranmu tiba lagi. Bidak keduanya adalah batu pijakan bagimu, dan bidakmu bagi mereka. Tangga yang kamu buat bisa dipakai keduanya, dan pemain setelahmu mendapat kesempatan pertama.</li>
        <li><strong>Permainan berlanjut:</strong> dengan 2 pemain, permainan berakhir saat salah satu dari kalian selesai. Dengan 3 pemain, permainan berlanjut untuk peringkat kedua dan ketiga.</li>
      </ul>
      <p>Untuk permainan berdua, baca <a href="/id/panduan/dam-cina-2-pemain">dam Cina untuk 2 pemain</a>. <a href="/id/panduan/dam-cina-strategi">Tips strategi</a> membahas geseran dan lompatan, yang sama dengan 3 pemain.</p>
      <p><a href="/id/panduan/dam-cina-online-dengan-teman">Dam Cina online bersama teman</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 3 pemain di Leapstone</h2>
      <ul>
        <li><strong>Melawan komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone di browser</a>, ketuk Komputer, pilih papan bintang dan 2 komputer. Kamu adalah Pemain 1, jadi kamu jalan lebih dulu. Kamu memilih Mudah, Normal, atau Sulit untuk komputernya.</li>
        <li><strong>Di satu ponsel:</strong> ketuk “Di ponsel ini”, pilih papan bintang dan 3 pemain, lalu ketuk sebuah bidak untuk mengganti tempat itu antara orang dan komputer.</li>
        <li><strong>Online bersama teman:</strong> ketuk Teman, pilih papan bintang, 3 pemain, dan waktu per langkah, lalu kirim tautan undangan. Permainan dimulai saat semua 3 tempat sudah terisi.</li>
        <li><strong>Permainan cepat:</strong> Main online mencari permainan untuk 2 atau 4 pemain, jadi tidak ada permainan cepat untuk 3 pemain.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 3 pemain",
  titel: "Dam Cina untuk 3 pemain: aturan | Leapstone",
  beschrijving: "Cara kerja dam Cina dengan 3 pemain: tempat 30 bidak mulai, ujung kosong mana yang jadi tujuan siapa, siapa jalan lebih dulu, dan cara menang.",
  h1: "Dam Cina untuk 3 pemain",
  intro: "Cara kerja permainan bertiga di papan bintang: posisi awal, tiga tujuan, siapa yang jalan lebih dulu, cara menang, dan tempat memainkannya.",
  inhoud,
};
