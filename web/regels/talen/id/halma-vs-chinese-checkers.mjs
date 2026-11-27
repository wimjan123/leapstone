// De gids Halma vs dam Cina in het Indonesisch, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dam Cina: papan bintang, 121 petak",
    alt: "Papan bintang dengan 10 bidak merah di ujung bawah dan 10 bidak biru di ujung atas",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: papan persegi, 256 petak",
    alt: "Papan persegi dengan 19 bidak merah di sudut kiri atas dan 19 bidak biru di sudut kanan bawah",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Papan bintang: enam tetangga, tiga di antaranya kosong di sini",
    alt: "Sebuah bidak merah dengan cincin putih di sekelilingnya. Tiga dari enam tetangganya kosong dan ditandai; tiga lainnya berisi bidak.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Papan persegi: delapan tetangga, lima di antaranya kosong di sini",
    alt: "Sebuah bidak merah dengan cincin putih di sekelilingnya. Lima dari delapan tetangganya kosong dan ditandai; tiga lainnya berisi bidak.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Jawaban singkat</h2>
      <p>Halma dimainkan di papan persegi dan dam Cina di papan berbentuk bintang berujung enam. Di kedua permainan kamu menggerakkan bidakmu dengan geseran dan lompatan melintasi papan, dan pemain pertama yang mengisi kamp di seberang menang.</p>
      <p>Yang berbeda adalah papannya, arah gerakannya, berapa orang yang bisa bermain, dan berapa bidak yang dimiliki masing-masing. <a href="/id/aturan/sternhalma">Sternhalma</a> adalah nama untuk Halma di papan bintang, jadi itu permainan yang sama dengan dam Cina.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Papannya</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Dam Cina</strong> memakai papan bintang: 121 petak, dengan 10 petak di masing-masing dari enam ujungnya. Satu ujung adalah segitiga dari baris-baris berisi 4, 3, 2, dan 1 petak.</li>
        <li><strong>Halma</strong> memakai papan persegi: 16 kali 16 petak, 256 seluruhnya. Sebuah kamp ada di sudut. Kamp besar punya baris berisi 5, 5, 4, 3, dan 2 petak, kamp kecil baris berisi 4, 4, 3, dan 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Arah: enam atau delapan</h2>
      <p>Di papan bintang sebuah petak punya enam tetangga. Di papan persegi petak punya delapan, karena diagonal juga dihitung. Satu geseran menuju tetangga yang kosong. Satu lompatan melewati satu bidak di sebelah bidakmu, dalam garis lurus, ke petak kosong tepat di belakangnya, ke arah mana pun dari arah-arah itu dan juga ke belakang.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Petak di tepi punya lebih sedikit tetangga, dan sudut papan persegi punya tiga. Enam arah membentuk tiga garis melalui sebuah petak di papan bintang. Delapan arah membentuk empat garis di papan persegi: mendatar, naik turun, dan dua diagonal.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pemain dan bidak</h2>
      <ul>
        <li><strong>Dam Cina:</strong> 2, 3, 4, atau 6 pemain. Setiap orang punya 10 bidak, jadi papan berisi 20, 30, 40, atau 60 bidak.</li>
        <li><strong>Halma:</strong> 2 atau 4 pemain. Dengan 2 pemain masing-masing punya 19 bidak, 38 seluruhnya. Dengan 4 pemain masing-masing punya 13 bidak, 52 seluruhnya.</li>
      </ul>
      <p>Papan persegi di Leapstone tidak punya permainan untuk 3 atau 6 pemain. Untuk permainan bertiga, baca <a href="/id/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Apa yang sama</h2>
      <ul>
        <li><strong>Satu langkah:</strong> satu geseran, atau rangkaian lompatan dengan satu bidak. Kamu sendiri yang menentukan di mana rangkaian berakhir, dan kamu tidak bisa menggeser setelah melompat.</li>
        <li><strong>Warna apa pun:</strong> kamu melompati bidak berwarna apa pun, termasuk bidakmu sendiri. Bidak yang kamu lompati tetap di tempatnya. Tidak ada yang ditangkap.</li>
        <li><strong>Tujuan:</strong> kamp di seberang tempatmu mulai. Semua petaknya harus berisi bidakmu sendiri. Selama ada bidak pemain lain di sana, kamu tidak bisa menyelesaikan permainan.</li>
        <li><strong>Menang:</strong> pemain pertama yang mengisi tujuan menang. Dengan 2 pemain permainan selesai saat itu. Dengan lebih banyak pemain, yang lain terus bermain untuk peringkat berikutnya, dan pemain yang sudah selesai dilewati.</li>
        <li><strong>Menyerah dan waktu:</strong> saat kamu menyerah, bidakmu meninggalkan papan. Dalam permainan online setiap langkah punya batas waktu, dan jika kamu melewatkan 3 giliran berturut-turut, kamu dianggap menyerah.</li>
      </ul>
      <p>Baca aturan lengkap <a href="/id/aturan/dam-cina">dam Cina</a> dan <a href="/id/aturan/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Papan mana yang dipilih di Leapstone</h2>
      <ul>
        <li><strong>3 atau 6 pemain:</strong> hanya papan bintang yang punya.</li>
        <li><strong>Lebih banyak bidak untuk masing-masing:</strong> papan persegi, dengan 19 bidak masing-masing untuk 2 pemain atau 13 untuk 4, dibanding 10 di papan bintang.</li>
        <li><strong>Main online:</strong> permainan cepat dimainkan di papan bintang. Bersama teman, dan melawan komputer, kamu bisa memilih salah satu papan.</li>
      </ul>
      <p>Tombol Main sekarang membuka permainan melawan komputer di papan bintang. Untuk bermain di papan persegi, ketuk panah kembali di bagian atas dan pilih Papan persegi di menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Lanjutkan</h2>
      <ul>
        <li><a href="/play/">Main di browser</a> dan coba kedua papan.</li>
        <li><a href="/id/panduan/dam-cina-strategi">Strategi dam Cina</a>: enam tips dengan gambar.</li>
        <li><a href="/id/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara kerja permainan untuk berdua.</li>
      </ul>
      <p><a href="/id/panduan/dam-cina-online-dengan-teman">Dam Cina online bersama teman</a></p>
    </section>`;

export default {
  nav: "Halma atau dam Cina",
  titel: "Halma atau dam Cina: perbedaannya | Leapstone",
  beschrijving: "Halma atau dam Cina? Papan persegi dan papan bintang, enam atau delapan arah, pemain dan bidak, serta apa yang sama.",
  h1: "Halma atau dam Cina",
  intro: "Dua permainan dengan satu gagasan: bawa semua bidakmu melintasi papan ke seberang. Apa yang berbeda, apa yang sama, dan di mana memainkan keduanya.",
  inhoud,
};
