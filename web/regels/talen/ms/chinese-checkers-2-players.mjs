// Panduan Melayu "Dam Cina untuk 2 pemain" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-2-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Bagaimana permainan bermula</h2>
      <p>Setiap pemain mempunyai 10 buah. Buah itu bermula di dua hujung bintang yang saling berhadapan: merah di bawah, biru di atas. Ke-20 buah itu berdiri pada papan dengan 121 petak.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 buah merah di hujung bawah dan 10 buah biru di hujung atas",
  tekst: "Merah bermula di bawah, biru di atas.",
})}
      <p>Pemain 1, merah, bergerak dahulu. Selepas itu anda bergilir-gilir, satu langkah seorang. Satu langkah ialah satu anjakan atau rangkaian lompatan dengan satu buah. Lihat <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> untuk anjakan dan lompatan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Matlamat anda ialah permulaan pemain lain</h2>
      <p>Anda menang dengan memindahkan kesemua 10 buah anda ke hujung tempat pemain lain bermula. Hujung itu bermula penuh dengan buah mereka, dan hujung anda penuh dengan buah anda. Bagi merah, itu ialah hujung atas dalam gambar di atas.</p>
      <p>Anda hanya boleh mendarat di petak kosong, jadi setiap seorang daripada anda mesti meninggalkan hujung sendiri sebelum yang lain dapat memenuhkannya. Tiada seorang pun daripada anda dapat menamatkan permainan selagi ada buah pemain lain kekal di matlamat. Dan kerana anda merentasi bahagian tengah yang sama dari arah bertentangan, buah pemain lain ialah batu loncatan bagi anda, dan buah anda bagi mereka. Baca <a href="/ms/panduan/dam-cina-strategi">petua strategi</a> untuk apa yang perlu dilakukan dengan itu.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Menang dan menyerah</h2>
      <ul>
        <li><strong>Menang:</strong> pemain pertama yang memenuhkan matlamat dengan kesemua 10 buah menang, dan permainan tamat serta-merta. Pemain yang lain tidak meneruskan permainan.</li>
        <li><strong>Menyerah:</strong> buah anda meninggalkan papan dan pemain yang lain menang.</li>
        <li><strong>Masa (dalam talian):</strong> dalam permainan dalam talian, setiap langkah mempunyai had masa. Apabila masa anda habis, giliran anda dilangkau. Jika anda terlepas 3 giliran berturut-turut, anda dianggap menyerah.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbezaan dengan 3, 4 dan 6 pemain</h2>
      <ul>
        <li><strong>3 pemain:</strong> buah bermula di setiap hujung berselang-seli, dan ketiga-tiga matlamat bermula kosong. Pemain pertama yang selesai menang; yang lain terus bermain untuk kedudukan seterusnya, dan pemain yang sudah selesai dilangkau.</li>
        <li><strong>4 pemain:</strong> dua pasang hujung yang bersebelahan. Matlamat anda bermula penuh dengan buah pemain lain. Permainan diteruskan selepas pemain pertama selesai, seperti dengan 3 pemain.</li>
        <li><strong>6 pemain:</strong> keenam-enam hujung. Papan memuatkan 60 buah, berbanding 20 dengan 2 pemain.</li>
      </ul>
      <p>Dengan hanya 20 buah di atas papan, terdapat lebih sedikit buah untuk dilompati, jadi tangga yang anda bina sendiri lebih penting. <a href="/ms/peraturan/dam-cina">Halaman peraturan</a> mempunyai gambar setiap kedudukan awal.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Tempat bermain dengan 2 pemain dalam Leapstone</h2>
      <ul>
        <li><strong>Menentang komputer, sekarang juga:</strong> buka <a href="/play/">Leapstone dalam pelayar</a>, ketik Komputer dan pilih papan bintang. Satu komputer ialah tetapan lalai, jadi itu ialah permainan untuk 2 pemain. Anda memilih Mudah, Biasa atau Sukar, dan anda ialah Pemain 1, jadi anda bergerak dahulu. Mudah memilih yang terbaik daripada tiga langkah rawak. Biasa memilih langkah yang paling maju ke arah matlamatnya. Sukar juga melihat bagaimana lawannya boleh membalas dan langkah seterusnya sendiri.</li>
        <li><strong>Main dalam talian, dalam aplikasi:</strong> permainan pantas pada papan bintang untuk 2 pemain, menentang pemain lain yang setahap dengan anda, dengan 30 saat setiap langkah. Sesetengah lawan dalam talian mungkin pemain komputer.</li>
        <li><strong>Bersama rakan:</strong> hantar pautan jemputan, dan tetapkan sendiri masa bagi setiap langkah. Atau edarkan satu telefon berulang-alik.</li>
      </ul>
      <p><a href="/ms/panduan/dam-cina-dalam-talian-dengan-rakan">Dam Cina dalam talian dengan rakan</a></p>
      <p><a href="/ms/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a></p>
    </section>`;

export default {
  nav: "Dam Cina untuk 2 pemain",
  titel: "Dam Cina untuk 2 pemain: peraturan | Leapstone",
  beschrijving: "Cara dam Cina berfungsi dengan 2 pemain: tempat 10 buah bermula, siapa bergerak dahulu, cara menang atau menyerah, dan tempat bermain percuma.",
  h1: "Dam Cina untuk 2 pemain",
  intro: "Cara permainan berdua berfungsi pada papan bintang: persediaan, siapa bergerak dahulu, cara menang, dan tempat anda boleh memainkannya.",
  inhoud,
};
