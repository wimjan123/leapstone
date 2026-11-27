// Panduan Melayu "Dam Cina untuk 6 pemain" (taak 302). Zin voor zin vertaald uit ../en/chinese-checkers-6-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Bagaimana permainan bermula</h2>
      <p>Setiap pemain mempunyai 10 buah, dan kesemua 6 hujung bintang digunakan. Itu meletakkan 60 buah pada papan dengan 121 petak. Ke-61 petak di tengah kosong pada permulaan.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 buah di setiap satu daripada 6 hujungnya, dalam 6 warna",
  tekst: "6 pemain, 6 hujung, 60 buah.",
})}
      <p>Pemain 1, merah, bergerak dahulu, dari hujung bawah. Giliran kemudian bergerak dari Pemain 1 hingga Pemain 6, dan selepas Pemain 6 ialah Pemain 1 semula. Pemain dinomborkan mengikut susunan hujung mereka di sekeliling bintang, jadi pemain selepas anda sentiasa bermula di hujung bersebelahan dengan hujung anda. Satu langkah ialah satu anjakan atau rangkaian lompatan dengan satu buah. Lihat <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> untuk anjakan dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Setiap matlamat penuh pada permulaan</h2>
      <p>Anda menang dengan memindahkan kesemua 10 buah anda ke hujung di seberang papan. Dengan 6 pemain, hujung itu ialah tempat pemain di seberang anda bermula, jadi tiada matlamat yang kosong: setiap matlamat bermula penuh dengan buah pemain lain. Bagi merah, matlamatnya ialah hujung atas, tempat Pemain 4 bermula.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Papan bintang dengan 6 hujung yang penuh. Gelang putus-putus menandakan hujung atas, matlamat pemain merah, yang memuatkan buah pemain di seberang.",
  tekst: "Matlamat merah ialah hujung di seberang, penuh dengan buah Pemain 4.",
})}
      <p>Anda hanya boleh mendarat di petak kosong, jadi pemain di seberang mesti meninggalkan hujungnya sebelum anda dapat memenuhkannya, dan anda mesti meninggalkan hujung anda sebelum dia dapat memenuhkan hujungnya. Dalam permainan untuk 2 pemain, itu sahaja yang perlu dilakukan. Dengan 6, kedua-duanya juga mesti melalui kesesakan 4 pemain lain.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Bahagian tengah yang sesak</h2>
      <p>Setiap matlamat berada di seberang papan, dan hujung-hujung itu hanya bersambung antara satu sama lain melalui bahagian tengah, jadi kesemua 60 buah mesti merentasi 61 petak yang sama. Pada permulaan belum ada sesiapa yang merentasinya, dan bahagian tengah cepat menjadi penuh.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Satu buah merah melompat tiga kali dalam satu langkah: melangkaui buah biru, kemudian buah hijau, kemudian buah ungu. Nombor 1, 2 dan 3 menandakan petak pendaratan.",
  tekst: "Buah setiap warna ialah batu loncatan.",
})}
      <p>Anda boleh melompati buah warna apa pun. Buah 5 pemain lain ialah batu loncatan bagi anda, dan buah anda ialah batu loncatan bagi kesemua 5 mereka. Barisan buah yang anda tinggalkan di tengah ialah tangga bagi sesiapa yang dapat mencapainya, dan pemain selepas anda mendapat giliran pertama.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Menyekat dengan 5 lawan</h2>
      <ul>
        <li><strong>Isi petak pendaratan:</strong> satu lompatan memerlukan petak kosong tepat di belakang buah itu. Apabila anda menggerakkan sebuah buah ke sana, lompatan itu hilang bagi setiap pemain yang mahukannya.</li>
        <li><strong>Berhati-hati dengan tangga yang anda bina:</strong> selepas langkah anda, 5 pemain lain bergerak sebelum tiba giliran anda semula. Sebuah tangga membantu kesemua mereka.</li>
        <li><strong>Sesiapa sahaja boleh menyekat matlamat:</strong> buah pemain lain mana-mana dalam matlamat anda menghalang anda daripada selesai, bukan hanya buah pemain di seberang. Kesemua 10 petak matlamat mesti memuatkan buah anda sendiri.</li>
      </ul>
      <p><a href="/ms/panduan/dam-cina-strategi">Petua strategi</a> menunjukkan rupa lompatan yang tersekat, dan cara tidak mengunci buah pemain lain dalam matlamat anda sendiri.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Berapa lama satu permainan</h2>
      <p>Permainan untuk 6 pemain mempunyai 60 buah untuk digerakkan, dan antara satu langkah anda dengan langkah berikutnya, 5 pemain lain masing-masing membuat satu langkah. Permainan juga tidak tamat apabila pemain pertama selesai.</p>
      <ul>
        <li><strong>Menang, dan terus bermain:</strong> pemain pertama yang memenuhkan matlamat menang, dan yang lain terus bermain untuk kedudukan seterusnya. Pemain yang sudah selesai dilangkau, dan buahnya kekal di atas papan sebagai batu loncatan. Permainan tamat apabila hanya seorang pemain masih bermain.</li>
        <li><strong>Menyerah:</strong> buah anda meninggalkan papan, jadi tidak lagi menyekat atau membantu sesiapa, dan yang lain terus bermain.</li>
        <li><strong>Masa (dalam talian):</strong> dalam permainan dalam talian, setiap langkah mempunyai had masa, yang ditetapkan oleh pemain yang memulakan permainan: 15 saat, 30 saat, 1 minit, 2 minit atau tanpa had. Satu pusingan 6 langkah mengambil masa paling lama 6 kali had itu, jadi dengan 30 saat, itu paling lama 3 minit. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda menyerah, dan permainan diteruskan tanpa anda.</li>
      </ul>
      <p>Untuk permainan dengan lebih sedikit pemain, baca <a href="/ms/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 6 pemain dalam Leapstone</h2>
      <ul>
        <li><strong>Menentang komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone dalam pelayar</a>, ketik Komputer, pilih papan bintang dan 5 komputer. Anda ialah Pemain 1, jadi anda bergerak dahulu. Komputer bergerak seorang demi seorang, masing-masing dengan jeda singkat, jadi anda dapat mengikuti setiap langkah. Anda memilih Mudah, Biasa atau Susah untuk komputer itu.</li>
        <li><strong>Pada satu telefon:</strong> ketik Main, pilih papan bintang dan 6 pemain, kemudian ketik sebuah buah untuk menukar tempat itu antara seorang manusia dengan komputer.</li>
        <li><strong>Dalam talian bersama rakan:</strong> ketik Rakan, pilih papan bintang, 6 pemain dan masa bagi setiap langkah, kemudian hantar pautan jemputan. Permainan bermula apabila kesemua 6 tempat telah diisi.</li>
        <li><strong>Permainan pantas:</strong> Main dalam talian mencari permainan untuk 2 atau 4 pemain, jadi tiada permainan pantas untuk 6 pemain.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 6 pemain",
  titel: "Dam Cina 6 pemain: panduan papan penuh | Leapstone",
  beschrijving: "Cara dam Cina berfungsi dengan 6 pemain: bintang penuh dengan 60 buah, bahagian tengah yang sesak, menyekat, tempoh permainan, dan tempat bermain.",
  h1: "Dam Cina untuk 6 pemain",
  intro: "Cara permainan untuk 6 pemain berfungsi: kesemua 6 hujung penuh, anda berlumba ke hujung di seberang papan, dan permainan diteruskan selepas pemain pertama selesai.",
  inhoud,
};
