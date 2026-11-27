// Panduan Melayu "Dam Cina untuk 3 pemain" (taak 299). Zin voor zin vertaald uit ../en/chinese-checkers-3-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Bagaimana permainan bermula</h2>
      <p>Setiap pemain mempunyai 10 buah, jadi 30 buah berdiri pada papan dengan 121 petak. Buah itu bermula di setiap hujung bintang secara berselang-seli: merah di bawah, biru di kiri atas dan hijau di kanan atas. Tiga hujung di antaranya kosong.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 buah merah di hujung bawah, 10 buah biru di hujung kiri atas dan 10 buah hijau di hujung kanan atas",
  tekst: "Merah di bawah, biru di kiri atas, hijau di kanan atas.",
})}
      <p>Pemain 1, merah, bergerak dahulu. Kemudian biru ialah Pemain 2, hijau ialah Pemain 3, dan selepas hijau giliran merah semula. Satu langkah ialah satu anjakan atau rangkaian lompatan dengan satu buah. Lihat <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> untuk anjakan dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tiga matlamat, semuanya kosong pada permulaan</h2>
      <p>Matlamat anda ialah hujung di seberang tempat anda bermula, dan dengan 3 pemain hujung itu bermula kosong. Itu ialah hujung kosong di antara permulaan dua pemain lain: matlamat merah di atas, matlamat biru di kanan bawah dan matlamat hijau di kiri bawah.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Papan bintang untuk tiga pemain. Bulatan putus-putus dengan warna setiap pemain menandakan tiga matlamat kosong: merah di atas, biru di kanan bawah, hijau di kiri bawah.",
  tekst: "Setiap matlamat berwarna sama dengan pemainnya.",
})}
      <p>Anda menang dengan memindahkan kesemua 10 buah anda ke matlamat anda. Kesemua 10 petak mesti berisi buah anda sendiri. Tiada sesiapa bermula di matlamat anda, tetapi anda boleh berhenti di mana-mana petak kosong, jadi buah pemain lain boleh mendarat di situ kemudian. Selagi buah itu berada di situ, anda tidak dapat menamatkan permainan.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang, dan apa yang berlaku selepas itu</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang memenuhkan matlamat menang. Permainan tidak berhenti di situ: dua pemain yang lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau. Permainan tamat apabila hanya seorang pemain yang masih bermain.</li>
        <li><strong>Menyerah:</strong> buah anda meninggalkan papan dan dua pemain yang lain terus bermain. Jika pemain kedua menyerah sebelum sesiapa selesai, pemain terakhir yang tinggal menang.</li>
        <li><strong>Masa (dalam talian):</strong> dalam permainan dalam talian, setiap langkah mempunyai had masa, yang ditetapkan oleh pemain yang memulakan permainan. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah, dan permainan diteruskan tanpa anda.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbezaan dengan permainan untuk 2 pemain</h2>
      <ul>
        <li><strong>Lebih banyak buah:</strong> 30 di atas papan, berbanding 20 dengan 2 pemain.</li>
        <li><strong>Matlamat kosong:</strong> dengan 2 pemain, matlamat anda bermula penuh dengan buah pemain lain. Dengan 3 pemain, ia bermula kosong.</li>
        <li><strong>Dua lawan:</strong> selepas langkah anda, dua pemain lain bergerak sebelum tiba giliran anda semula. Buah kedua-duanya ialah batu loncatan bagi anda, dan buah anda bagi mereka. Tangga yang anda bina boleh digunakan oleh kedua-duanya, dan pemain selepas anda mendapat peluang pertama.</li>
        <li><strong>Permainan diteruskan:</strong> dengan 2 pemain, permainan tamat apabila salah seorang daripada anda selesai. Dengan 3 pemain, permainan diteruskan untuk kedudukan kedua dan ketiga.</li>
      </ul>
      <p>Untuk permainan berdua, baca <a href="/ms/panduan/dam-cina-2-pemain">dam Cina untuk 2 pemain</a>. <a href="/ms/panduan/dam-cina-strategi">Petua strategi</a> membincangkan anjakan dan lompatan, yang sama dengan 3 pemain.</p>
      <p><a href="/ms/panduan/dam-cina-dalam-talian-dengan-rakan">Dam Cina dalam talian dengan rakan</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 3 pemain dalam Leapstone</h2>
      <ul>
        <li><strong>Menentang komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone dalam pelayar</a>, ketik Komputer, pilih papan bintang dan 2 komputer. Anda ialah Pemain 1, jadi anda bergerak dahulu. Anda memilih Mudah, Biasa atau Sukar untuk komputer itu.</li>
        <li><strong>Pada satu telefon:</strong> ketik “Di telefon ini”, pilih papan bintang dan 3 pemain, kemudian ketik sebuah buah untuk menukar tempat itu antara orang dan komputer.</li>
        <li><strong>Dalam talian bersama rakan:</strong> ketik Rakan, pilih papan bintang, 3 pemain dan masa bagi setiap langkah, kemudian hantar pautan jemputan. Permainan bermula apabila kesemua 3 tempat telah diisi.</li>
        <li><strong>Permainan pantas:</strong> Main dalam talian mencari permainan untuk 2 atau 4 pemain, jadi tiada permainan pantas untuk 3 pemain.</li>
      </ul>
    </section>`;

export default {
  nav: "Dam Cina untuk 3 pemain",
  titel: "Dam Cina untuk 3 pemain: peraturan | Leapstone",
  beschrijving: "Cara dam Cina berfungsi dengan 3 pemain: tempat 30 buah bermula, hujung kosong mana ialah matlamat siapa, siapa bergerak dahulu, dan cara menang.",
  h1: "Dam Cina untuk 3 pemain",
  intro: "Cara permainan bertiga berfungsi pada papan bintang: persediaan, tiga matlamat, siapa bergerak dahulu, cara menang, dan tempat anda boleh memainkannya.",
  inhoud,
};
