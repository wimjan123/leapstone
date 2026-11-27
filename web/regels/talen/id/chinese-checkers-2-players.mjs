// Panduan Indonesia "Dam Cina untuk 2 pemain" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-2-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Cara permainan dimulai</h2>
      <p>Setiap pemain punya 10 bidak. Bidak itu mulai di dua ujung bintang yang saling berhadapan: merah di bawah, biru di atas. Ke-20 bidak itu berdiri di papan dengan 121 petak.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 bidak merah di ujung bawah dan 10 bidak biru di ujung atas",
  tekst: "Merah mulai di bawah, biru di atas.",
})}
      <p>Pemain 1, merah, jalan lebih dulu. Setelah itu kalian bergiliran, satu langkah masing-masing. Satu langkah adalah satu geseran atau rangkaian lompatan dengan satu bidak. Lihat <a href="/id/aturan/dam-cina">aturan dam Cina</a> untuk geseran dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tujuanmu adalah awal pemain lain</h2>
      <p>Kamu menang dengan memindahkan semua 10 bidakmu ke ujung tempat pemain lain memulai. Ujung itu mulai penuh dengan bidak mereka, dan ujungmu penuh dengan bidakmu. Untuk merah, itu adalah ujung atas pada gambar di atas.</p>
      <p>Kamu hanya bisa mendarat di petak kosong, jadi kalian masing-masing harus meninggalkan ujung sendiri sebelum yang lain bisa mengisinya. Tidak ada dari kalian yang bisa menyelesaikan permainan selama ada bidak pemain lain di tujuan. Dan karena kalian menyeberangi bagian tengah yang sama dari arah berlawanan, bidak pemain lain adalah batu pijakan bagimu, dan bidakmu bagi mereka. Baca <a href="/id/panduan/dam-cina-strategi">tips strategi</a> untuk apa yang harus dilakukan dengan itu.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang dan menyerah</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang mengisi tujuan dengan semua 10 bidak menang, dan permainan langsung selesai. Pemain lain tidak melanjutkan.</li>
        <li><strong>Menyerah:</strong> bidakmu meninggalkan papan dan pemain lain menang.</li>
        <li><strong>Waktu (online):</strong> dalam permainan online, setiap langkah punya batas waktu. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbedaan dengan 3, 4, dan 6 pemain</h2>
      <ul>
        <li><strong>3 pemain:</strong> bidak mulai di setiap ujung selang-seling, dan ketiga tujuan mulai kosong. Pemain pertama yang selesai menang; yang lain terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati.</li>
        <li><strong>4 pemain:</strong> dua pasang ujung yang bersebelahan. Tujuanmu mulai penuh dengan bidak pemain lain. Permainan berlanjut setelah pemain pertama selesai, seperti pada 3 pemain.</li>
        <li><strong>6 pemain:</strong> keenam ujung. Papan berisi 60 bidak, dibanding 20 dengan 2 pemain.</li>
      </ul>
      <p>Dengan hanya 20 bidak di papan, ada lebih sedikit bidak untuk dilompati, jadi tangga yang kamu buat sendiri lebih penting. <a href="/id/aturan/dam-cina">Halaman aturan</a> punya gambar setiap posisi awal.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 2 pemain di Leapstone</h2>
      <ul>
        <li><strong>Melawan komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone di browser</a>, ketuk Komputer dan pilih papan bintang. Satu komputer adalah pengaturan awalnya, jadi itu permainan untuk 2 pemain. Kamu memilih Mudah, Normal, atau Sulit, dan kamu adalah Pemain 1, jadi kamu jalan lebih dulu. Mudah memilih yang terbaik dari tiga langkah acak. Normal memilih langkah yang paling maju menuju tujuannya. Sulit juga melihat bagaimana lawannya bisa membalas dan langkah berikutnya sendiri.</li>
        <li><strong>Main online, di aplikasi:</strong> permainan cepat di papan bintang untuk 2 pemain, melawan pemain lain yang selevel denganmu, dengan 30 detik per langkah. Beberapa lawan online mungkin pemain komputer.</li>
        <li><strong>Bersama teman:</strong> kirim tautan undangan, dan tentukan sendiri waktu per langkah. Atau oper satu ponsel bolak-balik.</li>
      </ul>
      <p><a href="/id/panduan/dam-cina-online-dengan-teman">Dam Cina online bersama teman</a></p>
      <p><a href="/id/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a></p>
    </section>`;

export default {
  nav: "Dam Cina untuk 2 pemain",
  titel: "Dam Cina untuk 2 pemain: posisi awal dan aturan | Leapstone",
  beschrijving: "Cara kerja dam Cina dengan 2 pemain: tempat 10 bidak mulai, siapa jalan lebih dulu, cara menang atau menyerah, dan bedanya dengan 3, 4, atau 6 pemain.",
  h1: "Dam Cina untuk 2 pemain",
  intro: "Cara kerja permainan berdua di papan bintang: posisi awal, siapa yang jalan lebih dulu, cara menang, dan tempat memainkannya.",
  inhoud,
};
