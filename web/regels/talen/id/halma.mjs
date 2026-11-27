// Halaman Indonesia "Aturan Halma" (taak 134). Zin voor zin vertaald uit ../en/halma.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 pemain: masing-masing 19 bidak",
    alt: "Papan persegi dengan 19 bidak merah di sudut kiri atas dan 19 bidak biru di sudut kanan bawah",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 pemain: masing-masing 13 bidak",
    alt: "Papan persegi dengan 13 bidak di setiap sudut dari keempat sudutnya: merah di kiri atas, biru di kanan atas, hijau di kanan bawah, dan kuning di kiri bawah",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Papan</h2>
      <p>Halma dimainkan di papan persegi 16 kali 16 petak, 256 petak seluruhnya. Setiap petak punya hingga delapan tetangga: empat yang lurus dan empat yang diagonal. Petak di tepi punya lebih sedikit, dan petak di sudut punya tiga.</p>
      <p>Ini adalah Papan persegi di Leapstone. Jika kamu sudah kenal permainan ini di papan bintang, baca tentang <a href="/id/aturan/sternhalma">Sternhalma</a> dan <a href="/id/aturan/dam-cina">aturan dam Cina</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Posisi awal bidak</h2>
      <p>Halma untuk 2 atau 4 pemain. Setiap pemain memulai dengan bidaknya di sebuah kamp di salah satu sudut papan. Kamp di sudut seberangnya adalah tujuanmu.</p>
      <ul>
        <li><strong>2 pemain:</strong> masing-masing 19 bidak, di dua sudut yang saling berseberangan. Kampnya terdiri dari lima baris berisi 5, 5, 4, 3, dan 2 petak.</li>
        <li><strong>4 pemain:</strong> masing-masing 13 bidak, satu kamp di setiap sudut. Kampnya terdiri dari empat baris berisi 4, 4, 3, dan 2 petak. Tujuanmu adalah sudut di seberang papan, secara diagonal.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Bergiliran</h2>
      <p>Pemain 1 mulai lebih dulu. Lalu giliran berjalan berurutan, dan setelah pemain terakhir, giliran kembali ke Pemain 1. Di Leapstone, warna mengikuti nomor: merah, biru, hijau, dan kuning.</p>
      <p>Pada gilirannya kamu menggerakkan satu bidak, satu kali. Tidak ada yang ditangkap: bidak tetap di papan sampai pemainnya menyerah.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Menggeser satu petak</h2>
      <p>Pindahkan satu bidak ke petak kosong di sebelahnya, ke salah satu dari delapan arah: lurus atau diagonal.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Sebuah bidak merah dengan cincin putih di sekelilingnya. Lima dari delapan tetangganya kosong dan ditandai; tiga lainnya berisi bidak.",
  tekst: "Bidak merah bisa melangkah ke lima petak yang ditandai. Tiga tetangga lainnya sudah terisi.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Melompat</h2>
      <p>Lompati satu bidak di sebelah bidakmu, warna apa pun, dan mendaratlah di petak kosong tepat di belakangnya, dalam garis lurus. Kamu bisa melompat ke kedelapan arah, juga secara diagonal dan ke belakang.</p>
      <ul>
        <li>Petak tempat kamu mendarat harus kosong.</li>
        <li>Kamu tidak bisa melompati dua bidak berurutan, atau petak kosong.</li>
        <li>Bidak yang kamu lompati tetap di tempatnya.</li>
        <li>Kamu tidak bisa melompat melewati tepi papan.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Sebuah bidak merah melompati bidak biru secara diagonal ke petak kosong di belakangnya, ditunjukkan dengan anak panah.",
  tekst: "Bidak merah melompati bidak biru secara diagonal.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rangkaian lompatan</h2>
      <p>Setelah melompat, bidak yang sama boleh melompat lagi, sebanyak yang bisa, ke arah mana pun, lurus atau diagonal. Kamu sendiri yang menentukan di mana berhenti. Semua lompatan itu bersama-sama adalah satu langkah.</p>
      <ul>
        <li>Dalam satu langkah kamu tidak bisa mendarat di petak yang sama dua kali.</li>
        <li>Satu langkah adalah satu geseran, atau satu lompatan atau lebih. Kamu tidak bisa menggeser setelah melompat.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Sebuah bidak merah melakukan tiga lompatan dalam satu langkah: secara diagonal melewati bidak biru, lurus melewati bidak biru lainnya, dan secara diagonal melewati bidak merah. Ketiga petak pendaratan diberi nomor 1, 2, dan 3.",
  tekst: "Satu langkah dengan tiga lompatan, sesuai urutan nomor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tujuan</h2>
      <p>Kamu menang dengan memindahkan semua bidakmu ke kamp di seberang tempatmu mulai. Setiap petak di kamp itu harus berisi bidakmu sendiri: 19 dengan 2 pemain, 13 dengan 4 pemain. Selama ada bidak pemain lain di sana, kamu tidak bisa menyelesaikan permainan.</p>
      <p>Kamu boleh mendarat di petak kosong mana pun, juga di kamp pemain lain. Bidak yang sudah ada di tujuanmu boleh pergi lagi; tidak ada yang menguncinya.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Papan persegi untuk dua pemain. Merah mulai di kiri atas; kamp kanan bawah, ditandai dengan lingkaran putus-putus dan berisi bidak biru, adalah tujuan merah.",
  tekst: "Dengan 2 pemain, tujuan merah adalah kamp tempat biru mulai.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Dengan 2 atau 4 pemain</h2>
      <ul>
        <li><strong>2 pemain:</strong> pemain pertama yang mengisi tujuan menang, dan permainan selesai.</li>
        <li><strong>4 pemain:</strong> pemain pertama yang mengisi tujuan menang. Yang lain terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati. Permainan selesai ketika hanya satu pemain yang masih bermain.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Menyerah</h2>
      <p>Saat kamu menyerah, bidakmu meninggalkan papan, sehingga tidak menghalangi siapa pun. Dengan 2 pemain, pemain lain menang. Dengan 4 pemain, permainan berlanjut tanpamu, dan jika semua pemain kecuali satu menyerah, pemain terakhir menang.</p>
      <p>Dalam permainan online, setiap langkah punya batas waktu. Pemain yang memulai permainan menentukannya. Saat waktumu habis, gilirannya dilewati. Jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah. Permainan melawan komputer dan di satu ponsel tidak punya batas waktu.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Tips</h2>
      <ul class="tips">
        <li><strong>Buat tangga.</strong> Susun bidak dalam satu garis dengan satu petak kosong di antaranya, lurus atau diagonal, mengarah ke tujuanmu. Satu bidak lalu bisa melompat sepanjang garis itu dalam satu langkah.</li>
        <li><strong>Bidak mana pun bisa jadi tangga.</strong> Kamu bisa melompati semua warna, jadi bidak pemain lain juga membantumu. Dan tanggamu sendiri membantu mereka: perhatikan apa yang kamu tinggalkan.</li>
        <li><strong>Manfaatkan diagonal.</strong> Tujuannya ada di sudut seberang, jadi garis bidak diagonal adalah cara tercepat untuk menyeberang.</li>
        <li><strong>Jangan lupakan bidak yang tertinggal.</strong> Kamu butuh semua bidakmu sampai di tujuan. Bidak yang jauh di belakang, tanpa apa pun untuk dilompati, hanya maju satu petak per giliran. Bawa dia serta selagi bidak lain masih ada di sekitarnya.</li>
        <li><strong>Awalmu adalah tujuan mereka.</strong> Dengan 2 pemain, kampmu adalah tujuan pemain lain, dan mereka tidak bisa menyelesaikan permainan selama masih ada bidakmu di sana. Leapstone membolehkanmu menyisakan satu bidak di rumah, jadi kamu bisa menghalangi dengan cara ini. Hal yang sama berlaku untukmu.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Pertanyaan</h2>
      <h3>Berapa orang yang bisa bermain Halma?</h3>
      <p>Dua atau empat. Halma dimainkan di papan persegi 16 kali 16 petak, dan setiap pemain memulai di sudut.</p>
      <h3>Berapa bidak yang dimiliki setiap pemain di Halma?</h3>
      <p>Masing-masing 19 bidak dengan 2 pemain, dan masing-masing 13 bidak dengan 4 pemain.</p>
      <h3>Siapa yang menemukan Halma?</h3>
      <p>George Howard Monks, seorang ahli bedah Amerika, pada 1883 atau 1884. Namanya berarti &ldquo;lompat&rdquo; dalam bahasa Yunani. Baca selengkapnya di <a href="/id/aturan/sternhalma">Sternhalma</a>.</p>
      <h3>Apa perbedaan Halma dan dam Cina?</h3>
      <p>Halma memakai papan persegi, dengan langkah dan lompatan ke delapan arah dan masing-masing 19 atau 13 bidak. Dam Cina memakai papan bintang, dengan enam arah dan masing-masing 10 bidak, untuk 2, 3, 4, atau 6 pemain.</p>
      <h3>Bisakah Halma dimainkan online gratis?</h3>
      <p>Bisa, di Leapstone, di browser atau di aplikasi dari App Store. Pilih cara bermain, seperti melawan komputer atau online bersama teman, lalu Papan persegi. Leapstone gratis, tanpa iklan.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Mainkan</h2>
      <p>Tombol Main sekarang membuka permainan melawan komputer di <a href="/id/aturan/dam-cina">papan bintang</a>. Untuk bermain Halma, ketuk panah kembali di bagian atas, lalu pilih Main di ponsel ini, Main melawan komputer, atau Main online bersama teman, dan ketuk Papan persegi.</p>
    </section>`;

export default {
  nav: "Aturan Halma",
  titel: "Aturan dan tips Halma | Leapstone",
  beschrijving: "Cara bermain Halma di papan persegi 16 kali 16: posisi awal, langkah, lompatan, rangkaian lompatan, cara menang, dan tips. Main gratis di browser.",
  h1: "Aturan Halma",
  intro: "Pindahkan semua bidakmu melintasi papan persegi ke sudut seberang sebelum yang lain. Aturannya secara singkat, dengan gambar, dan beberapa tips.",
  inhoud,
};
