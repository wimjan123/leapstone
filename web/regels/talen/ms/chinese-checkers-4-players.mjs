// Panduan bahasa Melayu "Dam Cina untuk 4 pemain" (taak 301). Ayat demi ayat daripada ../en/chinese-checkers-4-players.mjs.
// Peraturan dan paparan aplikasi: lihat rujukan sumber dalam fail bahasa Inggeris.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Bagaimana papan dibahagikan</h2>
      <p>Setiap pemain mempunyai 10 buah, jadi 40 buah berdiri pada papan dengan 121 petak. Keempat-empat hujung permulaan ialah dua pasang hujung yang bersebelahan: merah di bawah dan biru di kiri bawah, hijau di atas dan kuning di kanan atas.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 buah merah di hujung bawah, 10 buah biru di hujung kiri bawah, 10 buah hijau di hujung atas dan 10 buah kuning di hujung kanan atas. Hujung kiri atas dan kanan bawah kosong.",
  tekst: "Merah di bawah, biru di kiri bawah, hijau di atas, kuning di kanan atas.",
})}
      <p>Pemain 1, merah, bergerak dahulu. Kemudian biru ialah Pemain 2, hijau Pemain 3, kuning Pemain 4, dan selepas kuning giliran merah semula. Satu langkah ialah satu anjakan atau rangkaian lompatan dengan satu buah. Lihat <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> untuk anjakan dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Siapa berhadapan dengan siapa</h2>
      <p>Hujung-hujung itu berpasangan merentasi papan: merah berhadapan dengan hijau, dan biru dengan kuning. Matlamat anda ialah hujung di seberang anda. Merah pergi ke tempat hijau bermula, hijau ke tempat merah bermula, biru ke tempat kuning bermula, dan kuning ke tempat biru bermula.</p>
      <p>Seperti dalam permainan untuk 2 pemain, setiap matlamat bermula penuh dengan buah pemain yang berhadapan dengan anda, jadi anda hanya boleh mendarat di sana selepas buah itu pergi. Dengan 3 pemain, matlamat bermula kosong, jadi dengan 4 pemain tiada siapa dapat selesai serta-merta. Keempat-empat matlamat ialah empat hujung yang berbeza, jadi tiada orang lain yang mahukan matlamat anda: pemain yang sudah selesai tidak pernah menghalang sesiapa.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Dua hujung yang kosong</h2>
      <p>Hujung kiri atas dan kanan bawah tidak mempunyai buah. Kedua-duanya bukan permulaan dan bukan matlamat sesiapa. Hujung kiri atas terletak di antara biru dan hijau, dan hujung kanan bawah di antara kuning dan merah.</p>
      <p>Anda boleh beranjak atau melompat ke mana-mana petak kosong, jadi anda boleh merentasi hujung ini atau berhenti di dalamnya. Namun buah di sana belum berada di matlamat. Di hujung yang kosong tiada apa untuk dilompati sehingga seseorang membawa buah ke sana.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Apa yang berubah dalam taktik</h2>
      <ul>
        <li><strong>Dua lintasan serentak:</strong> merah dan hijau merentasi papan menuju satu sama lain, begitu juga biru dan kuning. Kedua-dua garisan melalui bahagian tengah, jadi bahagian tengah lebih sesak daripada dalam permainan untuk 2 pemain, yang hanya dilalui satu garisan.</li>
        <li><strong>Tiga pemain bergerak di antara giliran anda:</strong> papan berubah lebih banyak di antara dua langkah anda daripada dalam permainan untuk 2 pemain. Lihat papan semula pada awal setiap giliran, kemudian rancang rangkaian lompatan anda. Pemain yang bergerak selepas anda tidak pernah pemain yang berhadapan dengan anda.</li>
        <li><strong>Buah membantu semua orang:</strong> setiap buah daripada ketiga-tiga pemain lain ialah batu loncatan bagi anda, dan buah anda bagi mereka. Buah pemain yang berhadapan dengan anda bergerak ke arah bertentangan, seperti dalam permainan untuk 2 pemain.</li>
        <li><strong>Ruang untuk memintas:</strong> jika bahagian tengah penuh, hujung-hujung kosong ialah ruang lapang di sebelah petak-petak permulaan. Laluan melalui salah satunya boleh menjadi cara mengelak kesesakan.</li>
        <li><strong>Pemain yang menyerah mengosongkan matlamat anda:</strong> apabila pemain yang berhadapan dengan anda menyerah, buahnya meninggalkan papan, jadi matlamat anda terus kosong.</li>
      </ul>
      <p><a href="/ms/panduan/dam-cina-strategi">Petua strategi</a> tentang tangga, buah yang ketinggalan dan memenuhkan matlamat dari belakang adalah sama dengan 4 pemain.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang, dan apa yang berlaku selepas itu</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang memenuhkan matlamat dengan kesemua 10 buah menang. Permainan tidak berhenti di situ: tiga pemain lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau. Buah pemain itu kekal di papan. Permainan tamat apabila hanya seorang pemain masih bermain.</li>
        <li><strong>Menyerah:</strong> buah anda meninggalkan papan dan tiga pemain lain terus bermain. Jika yang lain juga menyerah, pemain terakhir yang tinggal menang.</li>
        <li><strong>Masa (dalam talian):</strong> dalam permainan dalam talian, setiap langkah mempunyai had masa. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah, dan permainan diteruskan tanpa anda.</li>
      </ul>
      <p>Untuk permainan dengan lebih sedikit pemain, baca <a href="/ms/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>. <a href="/ms/peraturan/dam-cina">Halaman peraturan</a> mempunyai gambar setiap kedudukan awal.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 4 pemain dalam Leapstone</h2>
      <ul>
        <li><strong>Menentang komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone dalam pelayar</a>, ketik Komputer, pilih papan bintang dan 3 komputer. Anda ialah Pemain 1, jadi anda bergerak dahulu. Untuk komputer, anda memilih Mudah, Biasa atau Susah.</li>
        <li><strong>Pada satu telefon:</strong> ketik Main, pilih papan bintang dan 4 pemain, kemudian ketik sebuah buah untuk menukar tempat itu antara orang dengan komputer.</li>
        <li><strong>Dalam talian bersama rakan:</strong> ketik Rakan, pilih papan bintang, 4 pemain dan masa bagi setiap langkah, kemudian hantar pautan jemputan. Permainan bermula apabila kesemua 4 tempat telah diisi.</li>
        <li><strong>Permainan pantas, dalam aplikasi:</strong> ketik Main dalam talian. Semasa aplikasi mencari permainan untuk 2 pemain, ketik Cari 4 atau 6 pemain untuk mencari permainan untuk 4 pemain sebaliknya. Setiap langkah mempunyai 30 saat. Jika tidak cukup pemain menyertai dalam masa 20 saat, pemain komputer mengisi tempat yang kosong, jadi sesetengah lawan mungkin pemain komputer.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 4 pemain",
  titel: "Dam Cina untuk 4 pemain: persediaan dan petua | Leapstone",
  beschrijving: "Cara dam Cina berfungsi dengan 4 pemain: bagaimana papan dibahagikan, 2 hujung yang kosong, siapa berhadapan dengan siapa, taktik dan tempat bermain.",
  h1: "Dam Cina untuk 4 pemain",
  intro: "Dengan 4 pemain, setiap seorang daripada anda bermula di salah satu daripada empat hujung bintang, dan dua hujung kekal kosong. Merah berhadapan dengan hijau dan biru dengan kuning: matlamat anda ialah hujung di seberang anda, penuh dengan buah pemain itu. Berikut persediaan, hujung yang kosong, taktik dan tempat anda boleh memainkannya.",
  inhoud,
};
