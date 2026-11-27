// Halaman Indonesia "Aturan dam Cina" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} pemain`,
      alt:
        {
          2: "Papan bintang dengan 10 bidak merah di ujung bawah dan 10 bidak biru di ujung atas",
          3: "Papan bintang dengan bidak merah di bawah, biru di kiri atas, dan hijau di kanan atas",
          4: "Papan bintang dengan bidak di empat ujung: merah di bawah, hijau di atas, biru di kiri bawah, dan kuning di kanan atas",
          6: "Papan bintang dengan bidak di keenam ujungnya, dalam enam warna",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Papan</h2>
      <p>Dam Cina dimainkan di bintang berujung enam. Papannya punya 121 petak, dan setiap ujung punya 10 di antaranya. Di dalam papan, setiap petak punya enam tetangga.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Posisi awal bidak</h2>
      <p>Setiap pemain punya 10 bidak dan memulai dengan semuanya di satu ujung bintang. Ujung yang tepat di seberang ujungmu adalah tujuanmu.</p>
      <ul>
        <li><strong>2 pemain:</strong> dua ujung yang saling berseberangan.</li>
        <li><strong>3 pemain:</strong> setiap ujung selang-seling. Ketiga tujuan mulai dalam keadaan kosong.</li>
        <li><strong>4 pemain:</strong> dua pasang ujung yang bersebelahan. Setiap pemain punya pemain lain di seberangnya.</li>
        <li><strong>6 pemain:</strong> keenam ujung.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Bergiliran</h2>
      <p>Pemain 1 mulai lebih dulu. Lalu giliran berjalan berurutan, Pemain 2, Pemain 3, dan seterusnya, dan setelah pemain terakhir, giliran kembali ke Pemain 1. Di Leapstone, warna mengikuti nomor: merah, biru, hijau, kuning, ungu, dan perak.</p>
      <p>Pada gilirannya kamu menggerakkan satu bidak, satu kali. Tidak ada yang ditangkap: bidak tetap di papan sampai pemainnya menyerah.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Menggeser satu petak</h2>
      <p>Pindahkan satu bidak ke petak kosong di sebelahnya.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Sebuah bidak merah dengan cincin putih di sekelilingnya. Tiga dari enam tetangganya kosong dan ditandai; tiga lainnya berisi bidak.",
  tekst: "Bidak merah bisa melangkah ke tiga petak yang ditandai. Tiga tetangga lainnya sudah terisi.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Melompat</h2>
      <p>Lompati satu bidak di sebelah bidakmu, warna apa pun, dan mendaratlah di petak kosong tepat di belakangnya, dalam garis lurus. Kamu bisa melompat ke keenam arah, juga ke belakang.</p>
      <ul>
        <li>Petak tempat kamu mendarat harus kosong.</li>
        <li>Kamu tidak bisa melompati dua bidak berurutan, atau petak kosong.</li>
        <li>Bidak yang kamu lompati tetap di tempatnya.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Sebuah bidak merah melompati bidak biru ke petak kosong di belakangnya, ditunjukkan dengan anak panah.",
  tekst: "Bidak merah melompati bidak biru.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rangkaian lompatan</h2>
      <p>Setelah melompat, bidak yang sama boleh melompat lagi, sebanyak yang bisa dan ke arah mana pun. Kamu sendiri yang menentukan di mana berhenti. Semua lompatan itu bersama-sama adalah satu langkah.</p>
      <ul>
        <li>Dalam satu langkah kamu tidak bisa mendarat di petak yang sama dua kali.</li>
        <li>Satu langkah adalah satu geseran, atau satu lompatan atau lebih. Kamu tidak bisa menggeser setelah melompat.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Sebuah bidak merah melakukan tiga lompatan dalam satu langkah, melewati bidak biru, bidak hijau, dan bidak biru lainnya. Ketiga petak pendaratan diberi nomor 1, 2, dan 3.",
  tekst: "Satu langkah dengan tiga lompatan, sesuai urutan nomor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tujuan</h2>
      <p>Kamu menang dengan memindahkan semua 10 bidakmu ke ujung di seberang tempatmu mulai. Semua 10 petak di ujung itu harus berisi bidakmu sendiri. Selama ada bidak pemain lain di sana, kamu tidak bisa menyelesaikan permainan.</p>
      <p>Kamu boleh mendarat di petak kosong mana pun, juga di ujung milik pemain lain.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Papan bintang untuk tiga pemain. Merah mulai di bawah; ujung kosong di atas, ditandai dengan lingkaran putus-putus, adalah tujuan merah.",
  tekst: "Dengan 3 pemain, merah mulai di bawah. Tujuan merah adalah ujung kosong di atas.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Dengan 2, 3, 4, atau 6 pemain</h2>
      <ul>
        <li><strong>2 pemain:</strong> pemain pertama yang mengisi tujuan menang, dan permainan selesai.</li>
        <li><strong>3, 4, atau 6 pemain:</strong> pemain pertama yang mengisi tujuan menang. Yang lain terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati. Permainan selesai ketika hanya satu pemain yang masih bermain.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Menyerah</h2>
      <p>Saat kamu menyerah, bidakmu meninggalkan papan, sehingga tidak menghalangi siapa pun. Dengan 2 pemain, pemain lain menang. Dengan lebih banyak pemain, permainan berlanjut tanpamu, dan jika semua pemain kecuali satu menyerah, pemain terakhir menang.</p>
      <p>Dalam permainan online, setiap langkah punya batas waktu. Pemain yang memulai permainan menentukannya, dan dalam permainan cepat batasnya 30 detik. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah. Permainan melawan komputer dan di satu ponsel tidak punya batas waktu.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Buat tangga.</strong> Susun bidak dalam satu garis dengan satu petak kosong di antaranya, mengarah ke tujuanmu. Satu bidak lalu bisa melompat sepanjang garis itu dalam satu langkah.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Empat bidak dalam garis diagonal dengan satu petak kosong di antaranya. Sebuah bidak merah di salah satu ujung melompati keempatnya, dengan empat petak pendaratan bernomor.",
  tekst: "Empat bidak dalam satu garis: bidak merah di atas menyeberangi papan dalam satu langkah, dengan empat lompatan.",
})}
        </li>
        <li><strong>Bidak mana pun bisa jadi tangga.</strong> Kamu bisa melompati semua warna, jadi bidak pemain lain juga membantumu. Dan tanggamu sendiri membantu mereka: perhatikan apa yang kamu tinggalkan.</li>
        <li><strong>Jangan lupakan bidak yang tertinggal.</strong> Kamu butuh semua 10 bidak sampai di tujuan. Bidak yang jauh di belakang, tanpa apa pun untuk dilompati, hanya maju satu petak per giliran. Bawa dia serta selagi bidak lain masih ada di sekitarnya.</li>
        <li><strong>Awalmu adalah tujuan mereka.</strong> Dengan 2, 4, atau 6 pemain, ujung awalmu adalah tujuan pemain di seberangmu, dan mereka tidak bisa menyelesaikan permainan selama masih ada bidakmu di sana. Hal yang sama berlaku untukmu.</li>
      </ul>
      <p>Tips lain, dengan gambar, ada di panduan <a href="/id/panduan/dam-cina-strategi">strategi dam Cina</a>. Untuk permainan berdua, baca <a href="/id/panduan/dam-cina-2-pemain">dam Cina untuk 2 pemain</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pertanyaan</h2>
      <h3>Berapa orang yang bisa bermain dam Cina?</h3>
      <p>Dua, tiga, empat, atau enam. Setiap pemain memulai di satu ujung bintang. Dengan 2, 3, atau 4 pemain, beberapa ujung tetap kosong.</p>
      <h3>Berapa banyak kelereng yang dimiliki setiap pemain?</h3>
      <p>Setiap pemain punya 10 kelereng, atau bidak. Papan punya 121 petak: 10 di setiap ujung dari keenam ujung dan 61 di tengah.</p>
      <h3>Bolehkah melompati bidak sendiri, atau melompat mundur?</h3>
      <p>Boleh. Kamu bisa melompati bidak berwarna apa pun, termasuk bidakmu sendiri, ke keenam arah, juga mundur. Bidak yang kamu lompati tetap di tempatnya.</p>
      <h3>Apakah bidak ditangkap dalam dam Cina?</h3>
      <p>Tidak. Tidak ada yang ditangkap. Sebuah bidak hanya meninggalkan papan saat pemainnya menyerah.</p>
      <h3>Apakah dam Cina berasal dari Cina?</h3>
      <p>Bukan. Permainan ini muncul di Jerman pada 1892 dengan nama Stern-Halma, berdasarkan permainan yang lebih tua, Halma. Nama dam Cina berasal dari Amerika Serikat, pada 1928. Baca selengkapnya di <a href="/id/aturan/sternhalma">Sternhalma</a>.</p>
      <h3>Di mana bisa main dam Cina online gratis bersama teman?</h3>
      <p>Di Leapstone, di browser atau di aplikasi dari App Store. Kirim tautan undangan ke teman: dia bergabung ke permainanmu tanpa akun, alamat email, atau kata sandi. Kamu juga bisa bermain melawan komputer, atau permainan cepat melawan pemain lain. Leapstone gratis, tanpa iklan.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Main dam Cina di Leapstone</h2>
      <p>Leapstone adalah aplikasi gratis untuk dam Cina dan Halma, dengan papan 3D merah mengilap dan emas. Kamu bisa bermain di aplikasi dan di browser.</p>
      <ul>
        <li><strong>Melawan komputer.</strong> Mudah, normal, atau sulit. Tidak perlu internet.</li>
        <li><strong>Bersama teman.</strong> Kirim tautan undangan. Kamu menentukan waktu per langkah, dan kalian bisa mengobrol.</li>
        <li><strong>Online.</strong> Permainan cepat melawan pemain lain yang selevel denganmu, 30 detik per langkah. Beberapa lawan online mungkin pemain komputer.</li>
        <li><strong>Di satu ponsel.</strong> Oper ponsel secara bergiliran di sekitar meja.</li>
      </ul>
      <p>Leapstone gratis, tanpa iklan, dan tanpa pendaftaran dengan alamat email: kamu hanya memilih nama pemain. <a href="https://apps.apple.com/id/app/id6831230722">Unduh di App Store</a> / <a href="/play/">Main di browser</a>.</p>
    </section>`;

export default {
  nav: "Aturan dam Cina",
  titel: "Aturan dan tips dam Cina | Leapstone",
  beschrijving: "Cara bermain dam Cina: posisi awal, langkah, lompatan dan rangkaian lompatan, cara menang dengan 2, 3, 4, atau 6 pemain, dan tips. Main gratis di browser.",
  h1: "Aturan dam Cina",
  intro: "Pindahkan semua 10 bidakmu melintasi papan bintang ke ujung seberang sebelum yang lain. Aturannya secara singkat, dengan gambar, dan beberapa tips.",
  inhoud,
};
