// Halaman Melayu "Peraturan Halma" (taak 134). Zin voor zin vertaald uit ../en/halma.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 pemain: 19 buah setiap seorang",
    alt: "Papan segi empat sama dengan 19 buah merah di sudut kiri atas dan 19 buah biru di sudut kanan bawah",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 pemain: 13 buah setiap seorang",
    alt: "Papan segi empat sama dengan 13 buah di setiap satu daripada empat sudutnya: merah di kiri atas, biru di kanan atas, hijau di kanan bawah dan kuning di kiri bawah",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Papan</h2>
      <p>Halma dimainkan pada papan segi empat sama berukuran 16 kali 16 petak, 256 petak kesemuanya. Setiap petak mempunyai sehingga lapan jiran: empat yang lurus dan empat yang pepenjuru. Petak di tepi mempunyai lebih sedikit, dan petak di sudut mempunyai tiga.</p>
      <p>Ini ialah Papan segi empat sama dalam Leapstone. Jika anda sudah mengenali permainan ini pada papan bintang, baca tentang <a href="/ms/peraturan/sternhalma">Sternhalma</a> dan <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kedudukan awal buah</h2>
      <p>Halma untuk 2 atau 4 pemain. Setiap pemain memulakan permainan dengan buahnya di sebuah kem di satu sudut papan. Kem di sudut yang bertentangan ialah matlamat anda.</p>
      <ul>
        <li><strong>2 pemain:</strong> 19 buah setiap seorang, di dua sudut yang saling bertentangan. Kem itu terdiri daripada lima baris dengan 5, 5, 4, 3 dan 2 petak.</li>
        <li><strong>4 pemain:</strong> 13 buah setiap seorang, satu kem di setiap sudut. Kem itu terdiri daripada empat baris dengan 4, 4, 3 dan 2 petak. Matlamat anda ialah sudut di seberang papan, secara pepenjuru.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Bergilir-gilir</h2>
      <p>Pemain 1 bermula dahulu. Kemudian giliran berjalan mengikut urutan, dan selepas pemain terakhir, giliran kembali kepada Pemain 1. Dalam Leapstone, warna mengikut nombor: merah, biru, hijau dan kuning.</p>
      <p>Pada giliran anda, anda menggerakkan satu buah, sekali sahaja. Tiada apa-apa yang ditangkap: buah kekal di atas papan sehingga pemainnya menyerah.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Menganjak satu petak</h2>
      <p>Alihkan satu buah ke petak kosong di sebelahnya, ke mana-mana daripada lapan arah: lurus atau pepenjuru.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Sebuah buah merah dengan cincin putih di sekelilingnya. Lima daripada lapan jirannya kosong dan ditandakan; tiga yang lain berisi buah.",
  tekst: "Buah merah boleh melangkah ke lima petak yang ditandakan. Tiga jiran yang lain sudah diisi.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Melompat</h2>
      <p>Lompat melepasi satu buah di sebelah buah anda, daripada warna apa pun, dan mendarat di petak kosong tepat di belakangnya, dalam garis lurus. Anda boleh melompat ke kesemua lapan arah, termasuk secara pepenjuru dan ke belakang.</p>
      <ul>
        <li>Petak tempat anda mendarat mestilah kosong.</li>
        <li>Anda tidak boleh melompat melepasi dua buah berturut-turut, atau petak kosong.</li>
        <li>Buah yang anda lompati kekal di tempatnya.</li>
        <li>Anda tidak boleh melompat melepasi tepi papan.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Sebuah buah merah melompat secara pepenjuru melepasi buah biru ke petak kosong di belakangnya, ditunjukkan dengan anak panah.",
  tekst: "Buah merah melompat secara pepenjuru melepasi buah biru.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rangkaian lompatan</h2>
      <p>Selepas melompat, buah yang sama boleh melompat lagi, sebanyak yang boleh, ke mana-mana arah, lurus atau pepenjuru. Anda sendiri yang menentukan di mana hendak berhenti. Semua lompatan itu bersama-sama ialah satu langkah.</p>
      <ul>
        <li>Dalam satu langkah, anda tidak boleh mendarat di petak yang sama dua kali.</li>
        <li>Satu langkah ialah satu anjakan, atau satu lompatan atau lebih. Anda tidak boleh menganjak selepas melompat.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Sebuah buah merah membuat tiga lompatan dalam satu langkah: secara pepenjuru melepasi buah biru, secara lurus melepasi sebuah lagi buah biru, dan secara pepenjuru melepasi buah merah. Ketiga-tiga petak pendaratan dinomborkan 1, 2 dan 3.",
  tekst: "Satu langkah dengan tiga lompatan, mengikut urutan nombor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Matlamat</h2>
      <p>Anda menang dengan memindahkan semua buah anda ke kem yang bertentangan dengan tempat anda bermula. Setiap petak kem itu mestilah berisi buah anda sendiri: 19 dengan 2 pemain, 13 dengan 4 pemain. Selagi ada buah pemain lain di sana, anda tidak boleh menamatkan permainan.</p>
      <p>Anda boleh mendarat di mana-mana petak kosong, termasuk di kem pemain lain. Buah yang berada di matlamat anda boleh keluar semula; tiada apa-apa yang mengunci buah itu.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Papan segi empat sama untuk dua pemain. Merah bermula di kiri atas; kem kanan bawah, ditandakan dengan bulatan putus-putus dan berisi buah biru, ialah matlamat merah.",
  tekst: "Dengan 2 pemain, matlamat merah ialah kem tempat biru bermula.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Dengan 2 atau 4 pemain</h2>
      <ul>
        <li><strong>2 pemain:</strong> pemain pertama yang memenuhkan matlamat menang, dan permainan tamat.</li>
        <li><strong>4 pemain:</strong> pemain pertama yang memenuhkan matlamat menang. Yang lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau. Permainan tamat apabila hanya seorang pemain yang masih bermain.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Menyerah</h2>
      <p>Apabila anda menyerah, buah anda meninggalkan papan, jadi tidak menghalang sesiapa pun. Dengan 2 pemain, pemain yang lain menang. Dengan 4 pemain, permainan diteruskan tanpa anda, dan jika semua pemain kecuali seorang menyerah, pemain terakhir menang.</p>
      <p>Dalam permainan dalam talian, setiap langkah mempunyai had masa. Pemain yang memulakan permainan menetapkannya. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah. Permainan menentang komputer dan pada satu telefon tidak mempunyai had masa.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Petua</h2>
      <ul class="tips">
        <li><strong>Bina tangga.</strong> Susun buah dalam satu garisan dengan satu petak kosong di antaranya, lurus atau pepenjuru, menghala ke matlamat anda. Satu buah kemudian boleh melompat sepanjang garisan itu dalam satu langkah.</li>
        <li><strong>Mana-mana buah boleh jadi tangga.</strong> Anda boleh melompat melepasi semua warna, jadi buah pemain lain juga membantu anda. Dan tangga anda sendiri membantu mereka: lihat apa yang anda tinggalkan.</li>
        <li><strong>Gunakan pepenjuru.</strong> Matlamat berada di sudut yang bertentangan, jadi garisan buah secara pepenjuru ialah cara paling pantas untuk merentasi papan.</li>
        <li><strong>Jangan lupakan buah yang tertinggal.</strong> Anda memerlukan semua buah anda sampai ke rumah. Buah yang jauh di belakang, tanpa apa-apa untuk dilompati, hanya bergerak satu petak setiap giliran. Bawa ia bersama selagi buah yang lain masih ada di sekelilingnya.</li>
        <li><strong>Permulaan anda ialah matlamat mereka.</strong> Dengan 2 pemain, kem anda ialah matlamat pemain lain, dan mereka tidak boleh menamatkan permainan selagi ada buah anda di sana. Leapstone membenarkan anda menyimpan sebuah buah di rumah, jadi anda boleh menghalang dengan cara ini. Perkara yang sama berlaku untuk anda.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Soalan</h2>
      <h3>Berapa orang boleh bermain Halma?</h3>
      <p>Dua atau empat. Halma dimainkan pada papan segi empat sama berukuran 16 kali 16 petak, dan setiap pemain bermula di sudut.</p>
      <h3>Berapa banyak buah yang ada pada setiap pemain dalam Halma?</h3>
      <p>Masing-masing 19 buah dengan 2 pemain, dan masing-masing 13 buah dengan 4 pemain.</p>
      <h3>Siapa yang mencipta Halma?</h3>
      <p>George Howard Monks, seorang pakar bedah Amerika, pada 1883 atau 1884. Namanya bermaksud &ldquo;lompat&rdquo; dalam bahasa Yunani. Baca lebih lanjut dalam <a href="/ms/peraturan/sternhalma">Sternhalma</a>.</p>
      <h3>Apakah perbezaan antara Halma dengan dam Cina?</h3>
      <p>Halma menggunakan papan segi empat sama, dengan langkah dan lompatan dalam lapan arah serta 19 atau 13 buah setiap seorang. Dam Cina menggunakan papan bintang, dengan enam arah dan 10 buah setiap seorang, untuk 2, 3, 4 atau 6 pemain.</p>
      <h3>Bolehkah Halma dimainkan dalam talian secara percuma?</h3>
      <p>Boleh, dalam Leapstone, dalam pelayar atau dalam aplikasi dari App Store. Pilih cara bermain, seperti menentang komputer atau dalam talian bersama rakan, kemudian Papan segi empat sama. Leapstone percuma, tanpa iklan.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Mainkannya</h2>
      <p>Butang Main sekarang membuka permainan menentang komputer pada <a href="/ms/peraturan/dam-cina">papan bintang</a>. Untuk bermain Halma, ketik anak panah kembali di bahagian atas, kemudian pilih Main pada telefon ini, Main menentang komputer atau Main dalam talian bersama rakan, dan ketik Papan segi empat sama.</p>
    </section>`;

export default {
  nav: "Peraturan Halma",
  titel: "Peraturan dan petua Halma | Leapstone",
  beschrijving: "Cara bermain Halma pada papan segi empat sama 16 kali 16: kedudukan awal, langkah, lompatan, cara menang, dan petua. Main percuma dalam pelayar.",
  h1: "Peraturan Halma",
  intro: "Alihkan semua buah anda merentasi papan segi empat sama ke sudut yang bertentangan sebelum orang lain. Peraturannya secara ringkas, dengan gambar, dan beberapa petua.",
  inhoud,
};
