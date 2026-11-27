// De gids Halma vs dam Cina in het Maleis, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Dam Cina: papan bintang, 121 petak",
    alt: "Papan bintang dengan 10 buah merah di hujung bawah dan 10 buah biru di hujung atas",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: papan segi empat sama, 256 petak",
    alt: "Papan segi empat sama dengan 19 buah merah di sudut kiri atas dan 19 buah biru di sudut kanan bawah",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Papan bintang: enam jiran, tiga daripadanya kosong di sini",
    alt: "Sebuah buah merah dengan cincin putih di sekelilingnya. Tiga daripada enam jirannya kosong dan ditandakan; tiga yang lain berisi buah.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Papan segi empat sama: lapan jiran, lima daripadanya kosong di sini",
    alt: "Sebuah buah merah dengan cincin putih di sekelilingnya. Lima daripada lapan jirannya kosong dan ditandakan; tiga yang lain berisi buah.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Jawapan ringkas</h2>
      <p>Halma dimainkan pada papan segi empat sama dan dam Cina pada papan berbentuk bintang berhujung enam. Dalam kedua-dua permainan anda menggerakkan buah anda dengan anjakan dan lompatan merentasi papan, dan pemain pertama yang memenuhkan kem di seberang menang.</p>
      <p>Yang berbeza ialah papannya, arah pergerakan, berapa orang yang boleh bermain, dan berapa banyak buah yang ada pada setiap seorang. <a href="/ms/peraturan/sternhalma">Sternhalma</a> ialah nama bagi Halma pada papan bintang, jadi ia permainan yang sama dengan dam Cina.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Papannya</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Dam Cina</strong> menggunakan papan bintang: 121 petak, dengan 10 petak pada setiap satu daripada enam hujungnya. Satu hujung ialah segi tiga yang terdiri daripada baris 4, 3, 2 dan 1 petak.</li>
        <li><strong>Halma</strong> menggunakan papan segi empat sama: 16 kali 16 petak, 256 kesemuanya. Sebuah kem terletak di sudut. Kem besar mempunyai baris 5, 5, 4, 3 dan 2 petak, kem kecil baris 4, 4, 3 dan 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Arah: enam atau lapan</h2>
      <p>Pada papan bintang, sebuah petak mempunyai enam jiran. Pada papan segi empat sama ia mempunyai lapan, kerana pepenjuru juga dikira. Satu anjakan menuju ke jiran yang kosong. Satu lompatan melepasi satu buah di sebelah buah anda, dalam garis lurus, ke petak kosong tepat di belakangnya, ke mana-mana daripada arah itu dan juga ke belakang.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Petak di tepi mempunyai lebih sedikit jiran, dan sudut papan segi empat sama mempunyai tiga. Enam arah membentuk tiga garisan melalui sebuah petak pada papan bintang. Lapan arah membentuk empat garisan pada papan segi empat sama: melintang, menegak dan dua pepenjuru.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pemain dan buah</h2>
      <ul>
        <li><strong>Dam Cina:</strong> 2, 3, 4 atau 6 pemain. Setiap orang mempunyai 10 buah, jadi papan memuatkan 20, 30, 40 atau 60 buah.</li>
        <li><strong>Halma:</strong> 2 atau 4 pemain. Dengan 2 pemain, setiap seorang mempunyai 19 buah, 38 kesemuanya. Dengan 4 pemain, setiap seorang mempunyai 13 buah, 52 kesemuanya.</li>
      </ul>
      <p>Papan segi empat sama dalam Leapstone tidak mempunyai permainan untuk 3 atau 6 pemain. Untuk permainan bertiga, baca <a href="/ms/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Apa yang sama</h2>
      <ul>
        <li><strong>Satu langkah:</strong> satu anjakan, atau rangkaian lompatan dengan satu buah. Anda sendiri yang menentukan di mana rangkaian itu berakhir, dan anda tidak boleh menganjak selepas melompat.</li>
        <li><strong>Mana-mana warna:</strong> anda melompat melepasi buah daripada warna apa pun, termasuk buah anda sendiri. Buah yang anda lompati kekal di tempatnya. Tiada apa-apa yang ditangkap.</li>
        <li><strong>Matlamat:</strong> kem di seberang tempat anda bermula. Semua petaknya mestilah berisi buah anda sendiri. Selagi ada buah pemain lain di sana, anda tidak boleh menamatkan permainan.</li>
        <li><strong>Menang:</strong> pemain pertama yang memenuhkan matlamat menang. Dengan 2 pemain, permainan tamat pada ketika itu. Dengan lebih ramai pemain, yang lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau.</li>
        <li><strong>Menyerah dan masa:</strong> apabila anda menyerah, buah anda meninggalkan papan. Dalam permainan dalam talian, setiap langkah mempunyai had masa, dan jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah.</li>
      </ul>
      <p>Baca peraturan penuh <a href="/ms/peraturan/dam-cina">dam Cina</a> dan <a href="/ms/peraturan/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Papan mana yang dipilih dalam Leapstone</h2>
      <ul>
        <li><strong>3 atau 6 pemain:</strong> hanya papan bintang yang mempunyainya.</li>
        <li><strong>Lebih banyak buah setiap seorang:</strong> papan segi empat sama, dengan 19 buah setiap seorang untuk 2 pemain atau 13 untuk 4, berbanding 10 pada papan bintang.</li>
        <li><strong>Main dalam talian:</strong> permainan pantas dimainkan pada papan bintang. Bersama rakan, dan menentang komputer, anda boleh memilih mana-mana papan.</li>
      </ul>
      <p>Butang Main sekarang membuka permainan menentang komputer pada papan bintang. Untuk bermain pada papan segi empat sama, ketik anak panah kembali di bahagian atas dan pilih Papan segi empat sama dalam menu.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Teruskan</h2>
      <ul>
        <li><a href="/play/">Main dalam pelayar</a> dan cuba kedua-dua papan.</li>
        <li><a href="/ms/panduan/dam-cina-strategi">Strategi dam Cina</a>: enam petua dengan gambar.</li>
        <li><a href="/ms/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara permainan untuk dua orang berfungsi.</li>
      </ul>
      <p><a href="/ms/panduan/dam-cina-dalam-talian-dengan-rakan">Dam Cina dalam talian dengan rakan</a></p>
    </section>`;

export default {
  nav: "Halma atau dam Cina",
  titel: "Halma atau dam Cina: perbezaannya | Leapstone",
  beschrijving: "Halma atau dam Cina? Papan segi empat sama dan papan bintang, enam atau lapan arah, pemain dan buah, serta apa yang sama.",
  h1: "Halma atau dam Cina",
  intro: "Dua permainan dengan satu idea: bawa semua buah anda merentasi papan ke seberang. Apa yang berbeza, apa yang sama, dan di mana hendak memainkan kedua-duanya.",
  inhoud,
};
