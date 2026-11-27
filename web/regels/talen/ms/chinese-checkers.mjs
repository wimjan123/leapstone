// Halaman Melayu "Peraturan dam Cina" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} pemain`,
      alt:
        {
          2: "Papan bintang dengan 10 buah merah di hujung bawah dan 10 buah biru di hujung atas",
          3: "Papan bintang dengan buah merah di bawah, biru di kiri atas dan hijau di kanan atas",
          4: "Papan bintang dengan buah di empat hujung: merah di bawah, hijau di atas, biru di kiri bawah dan kuning di kanan atas",
          6: "Papan bintang dengan buah di keenam-enam hujungnya, dalam enam warna",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Papan</h2>
      <p>Dam Cina dimainkan pada bintang berhujung enam. Papan ini mempunyai 121 petak, dan setiap hujung mempunyai 10 daripadanya. Di dalam papan, setiap petak mempunyai enam jiran.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Kedudukan awal buah</h2>
      <p>Setiap pemain mempunyai 10 buah dan memulakan permainan dengan semuanya di satu hujung bintang. Hujung yang betul-betul bertentangan dengan hujung anda ialah matlamat anda.</p>
      <ul>
        <li><strong>2 pemain:</strong> dua hujung yang saling bertentangan.</li>
        <li><strong>3 pemain:</strong> setiap hujung berselang-seli. Ketiga-tiga matlamat bermula kosong.</li>
        <li><strong>4 pemain:</strong> dua pasang hujung yang bersebelahan. Setiap pemain mempunyai pemain lain di seberangnya.</li>
        <li><strong>6 pemain:</strong> keenam-enam hujung.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Bergilir-gilir</h2>
      <p>Pemain 1 bermula dahulu. Kemudian giliran berjalan mengikut urutan, Pemain 2, Pemain 3 dan seterusnya, dan selepas pemain terakhir, giliran kembali kepada Pemain 1. Dalam Leapstone, warna mengikut nombor: merah, biru, hijau, kuning, ungu dan perak.</p>
      <p>Pada giliran anda, anda menggerakkan satu buah, sekali sahaja. Tiada apa-apa yang ditangkap: buah kekal di atas papan sehingga pemainnya menyerah.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Menganjak satu petak</h2>
      <p>Alihkan satu buah ke petak kosong di sebelahnya.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Sebuah buah merah dengan cincin putih di sekelilingnya. Tiga daripada enam jirannya kosong dan ditandakan; tiga yang lain berisi buah.",
  tekst: "Buah merah boleh melangkah ke tiga petak yang ditandakan. Tiga jiran yang lain sudah diisi.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Melompat</h2>
      <p>Lompat melepasi satu buah di sebelah buah anda, daripada warna apa pun, dan mendarat di petak kosong tepat di belakangnya, dalam garis lurus. Anda boleh melompat ke mana-mana daripada enam arah, termasuk ke belakang.</p>
      <ul>
        <li>Petak tempat anda mendarat mestilah kosong.</li>
        <li>Anda tidak boleh melompat melepasi dua buah berturut-turut, atau petak kosong.</li>
        <li>Buah yang anda lompati kekal di tempatnya.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Sebuah buah merah melompat melepasi buah biru ke petak kosong di belakangnya, ditunjukkan dengan anak panah.",
  tekst: "Buah merah melompat melepasi buah biru.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rangkaian lompatan</h2>
      <p>Selepas melompat, buah yang sama boleh melompat lagi, sebanyak yang boleh dan ke mana-mana arah. Anda sendiri yang menentukan di mana hendak berhenti. Semua lompatan itu bersama-sama ialah satu langkah.</p>
      <ul>
        <li>Dalam satu langkah, anda tidak boleh mendarat di petak yang sama dua kali.</li>
        <li>Satu langkah ialah satu anjakan, atau satu lompatan atau lebih. Anda tidak boleh menganjak selepas melompat.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Sebuah buah merah membuat tiga lompatan dalam satu langkah, melepasi buah biru, buah hijau dan sebuah lagi buah biru. Ketiga-tiga petak pendaratan dinomborkan 1, 2 dan 3.",
  tekst: "Satu langkah dengan tiga lompatan, mengikut urutan nombor.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Matlamat</h2>
      <p>Anda menang dengan memindahkan kesemua 10 buah anda ke hujung yang bertentangan dengan tempat anda bermula. Kesemua 10 petak di hujung itu mestilah berisi buah anda sendiri. Selagi ada buah pemain lain di sana, anda tidak boleh menamatkan permainan.</p>
      <p>Anda boleh mendarat di mana-mana petak kosong, termasuk di hujung milik pemain lain.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Papan bintang untuk tiga pemain. Merah bermula di bawah; hujung kosong di atas, ditandakan dengan bulatan putus-putus, ialah matlamat merah.",
  tekst: "Dengan 3 pemain, merah bermula di bawah. Matlamat merah ialah hujung kosong di atas.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Dengan 2, 3, 4 atau 6 pemain</h2>
      <ul>
        <li><strong>2 pemain:</strong> pemain pertama yang memenuhkan matlamat menang, dan permainan tamat.</li>
        <li><strong>3, 4 atau 6 pemain:</strong> pemain pertama yang memenuhkan matlamat menang. Yang lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau. Permainan tamat apabila hanya seorang pemain yang masih bermain.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Menyerah</h2>
      <p>Apabila anda menyerah, buah anda meninggalkan papan, jadi tidak menghalang sesiapa pun. Dengan 2 pemain, pemain yang lain menang. Dengan lebih ramai pemain, permainan diteruskan tanpa anda, dan jika semua pemain kecuali seorang menyerah, pemain terakhir menang.</p>
      <p>Dalam permainan dalam talian, setiap langkah mempunyai had masa. Pemain yang memulakan permainan menetapkannya, dan dalam permainan pantas ia 30 saat. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah. Permainan menentang komputer dan pada satu telefon tidak mempunyai had masa.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Petua</h2>
      <ul class="tips">
        <li><strong>Bina tangga.</strong> Susun buah dalam satu garisan dengan satu petak kosong di antaranya, menghala ke matlamat anda. Satu buah kemudian boleh melompat sepanjang garisan itu dalam satu langkah.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Empat buah dalam garisan pepenjuru dengan satu petak kosong di antaranya. Sebuah buah merah di satu hujung melompat melepasi kesemua empat, dengan empat petak pendaratan bernombor.",
  tekst: "Empat buah dalam satu garisan: buah merah di atas merentasi papan dalam satu langkah, dengan empat lompatan.",
})}
        </li>
        <li><strong>Mana-mana buah boleh jadi tangga.</strong> Anda boleh melompat melepasi semua warna, jadi buah pemain lain juga membantu anda. Dan tangga anda sendiri membantu mereka: lihat apa yang anda tinggalkan.</li>
        <li><strong>Jangan lupakan buah yang tertinggal.</strong> Anda memerlukan kesemua 10 buah sampai ke rumah. Buah yang jauh di belakang, tanpa apa-apa untuk dilompati, hanya bergerak satu petak setiap giliran. Bawa ia bersama selagi buah yang lain masih ada di sekelilingnya.</li>
        <li><strong>Permulaan anda ialah matlamat mereka.</strong> Dengan 2, 4 atau 6 pemain, hujung permulaan anda ialah matlamat pemain di seberang anda, dan mereka tidak boleh menamatkan permainan selagi ada buah anda di sana. Perkara yang sama berlaku untuk anda.</li>
      </ul>
      <p>Lebih banyak petua, dengan gambar, ada dalam panduan <a href="/ms/panduan/dam-cina-strategi">strategi dam Cina</a>. Untuk permainan berdua, baca <a href="/ms/panduan/dam-cina-2-pemain">dam Cina untuk 2 pemain</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Soalan</h2>
      <h3>Berapa orang boleh bermain dam Cina?</h3>
      <p>Dua, tiga, empat atau enam. Setiap pemain bermula di satu hujung bintang. Dengan 2, 3 atau 4 pemain, sesetengah hujung kekal kosong.</p>
      <h3>Berapa banyak guli yang ada pada setiap pemain?</h3>
      <p>Setiap pemain mempunyai 10 guli, atau buah. Papan mempunyai 121 petak: 10 di setiap satu daripada enam hujung dan 61 di tengah.</p>
      <h3>Bolehkah anda melompat melepasi buah sendiri, atau ke belakang?</h3>
      <p>Boleh. Anda boleh melompat melepasi buah berwarna apa pun, termasuk buah sendiri, dalam mana-mana daripada enam arah, termasuk ke belakang. Buah yang anda lompati kekal di tempatnya.</p>
      <h3>Adakah buah ditangkap dalam dam Cina?</h3>
      <p>Tidak. Tiada apa-apa yang ditangkap. Sebuah buah hanya meninggalkan papan apabila pemainnya menyerah.</p>
      <h3>Adakah dam Cina berasal dari Cina?</h3>
      <p>Tidak. Permainan ini muncul di Jerman pada 1892 sebagai Stern-Halma, berdasarkan permainan yang lebih lama, Halma. Nama dam Cina datang dari Amerika Syarikat, pada 1928. Baca lebih lanjut dalam <a href="/ms/peraturan/sternhalma">Sternhalma</a>.</p>
      <h3>Di mana anda boleh bermain dam Cina dalam talian secara percuma bersama rakan?</h3>
      <p>Dalam Leapstone, dalam pelayar anda atau dalam aplikasi dari App Store. Hantar pautan jemputan kepada rakan: dia menyertai permainan anda tanpa akaun, alamat e-mel atau kata laluan. Anda juga boleh bermain menentang komputer, atau permainan pantas menentang pemain lain. Leapstone percuma, tanpa iklan.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Main dam Cina dalam Leapstone</h2>
      <p>Leapstone ialah aplikasi percuma untuk dam Cina dan Halma, dengan papan 3D merah berkilat dan emas. Anda boleh bermain dalam aplikasi dan dalam pelayar.</p>
      <ul>
        <li><strong>Menentang komputer.</strong> Mudah, biasa atau sukar. Tidak perlu internet.</li>
        <li><strong>Bersama rakan.</strong> Hantar pautan jemputan. Anda menetapkan masa bagi setiap langkah, dan anda boleh berbual.</li>
        <li><strong>Dalam talian.</strong> Permainan pantas menentang pemain lain yang setahap dengan anda, 30 saat setiap langkah. Sesetengah lawan dalam talian mungkin pemain komputer.</li>
        <li><strong>Pada satu telefon.</strong> Edarkan telefon di sekeliling meja.</li>
      </ul>
      <p>Leapstone percuma, tanpa iklan dan tanpa pendaftaran dengan alamat e-mel: anda hanya memilih nama pemain. <a href="https://apps.apple.com/my/app/id6831230722">Muat turun di App Store</a> / <a href="/play/">Main dalam pelayar</a>.</p>
    </section>`;

export default {
  nav: "Peraturan dam Cina",
  titel: "Peraturan dan petua dam Cina | Leapstone",
  beschrijving: "Cara bermain dam Cina: kedudukan awal, langkah, lompatan dan rangkaian lompatan, cara menang dengan 2, 3, 4 atau 6 pemain, dan petua. Main percuma.",
  h1: "Peraturan dam Cina",
  intro: "Alihkan kesemua 10 buah anda merentasi papan bintang ke hujung yang bertentangan sebelum orang lain. Peraturannya secara ringkas, dengan gambar, dan beberapa petua.",
  inhoud,
};
