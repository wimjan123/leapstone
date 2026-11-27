// Leapstone dalam angka, Maleis (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Petak dan buah</h2>
      <p>Dikira pada dua papan Leapstone, dalam kedudukan permulaan sesuatu permainan.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Papan bintang dengan keenam-enam hujungnya penuh: sepuluh buah bagi setiap satu daripada enam warna, di sekeliling bahagian tengah yang kosong.",
  tekst: "Papan bintang pada permulaan permainan untuk enam pemain.",
})}
      <ul class="tips">
        <li><strong>Papan bintang mempunyai ${f("sterbord_vakken")} petak.</strong> Setiap pemain bermula dengan ${f("sterbord_stenen_per_speler")} buah. Jadi permainan untuk dua pemain ada ${f("sterbord_stenen_2_spelers")} buah di atas papan, untuk tiga pemain ${f("sterbord_stenen_3_spelers")}, untuk empat ${f("sterbord_stenen_4_spelers")} dan untuk enam ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Papan Halma segi empat mempunyai ${f("vierkant_vakken")} petak.</strong> Dalam permainan untuk dua pemain, setiap pemain bermula dengan ${f("vierkant_stenen_per_speler_2_spelers")} buah, semuanya ${f("vierkant_stenen_2_spelers")}. Dalam permainan untuk empat pemain, setiap seorang bermula dengan ${f("vierkant_stenen_per_speler_4_spelers")} buah, semuanya ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rantai lompatan terpanjang: ${f("langste_sprongketen")}</h2>
      <p>Di atas papan bintang, satu buah boleh membuat <strong>${f("langste_sprongketen")} lompatan dalam satu langkah</strong>, dan mengikut peraturan Leapstone tiada langkah yang boleh mempunyai lebih. Untuk mencapai angka itu, buah-buah lain diletakkan dengan bebas: satu di setiap petak yang dilompati buah itu.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Papan bintang dengan satu buah merah dan banyak buah biru. Anak panah putih menunjukkan buah merah melompati satu buah biru demi satu, di sepanjang laluan yang panjang dan berliku.",
  tekst: "Rantai terpanjang: buah merah melompati setiap buah biru, satu demi satu.",
})}
      <p><strong>Cara ia dikira.</strong> Sesuatu lompatan sentiasa mendarat dua petak lebih jauh, dalam garis lurus. Jadi buah yang terus melompat hanya boleh sampai ke sebahagian petak: papan terbahagi kepada empat kumpulan seperti itu, dan yang terbesar mempunyai ${f("grootste_klasse_vakken")} petak. Dalam Leapstone, sesuatu buah tidak boleh mendarat dua kali di petak yang sama dalam satu langkah, dan tidak juga di petak tempat ia bermula. Jadi sesuatu rantai mendarat paling banyak sekali di setiap petak lain dalam kumpulannya. Program itu menggeledah kumpulan tersebut dan menjumpai laluan yang melalui kesemua ${f("grootste_klasse_vakken")} petak, jadi tiada rantai yang boleh lebih panjang: ${f("langste_sprongketen")} lompatan. Kemudian satu ujian memainkan langkah itu dengan peraturan Leapstone.</p>
      <p><strong>Bukan permainan sebenar.</strong> Rantai ini memerlukan ${f("langste_sprongketen")} buah lain, setiap satu tepat di petak yang betul. Permainan untuk dua atau tiga pemain hanya ada ${f("sterbord_stenen_2_spelers")} atau ${f("sterbord_stenen_3_spelers")} buah, dan itu terlalu sedikit. Permainan untuk empat atau enam pemain ada ${f("sterbord_stenen_4_spelers")} atau ${f("sterbord_stenen_6_spelers")}, dan itu mencukupi. Tetapi dalam permainan sebenar tiada siapa yang meletakkan buah dengan bebas, jadi jangan harap melihat rantai ini di meja. Ia menunjukkan apa yang dibenarkan oleh papan, bukan apa yang berlaku semasa bermain.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Lintasan tersingkat: ${f("oversteek_zetten")} langkah</h2>
      <p>Seorang pemain bersendirian di atas papan bintang, tanpa lawan, memerlukan <strong>${f("oversteek_zetten")} langkah</strong> untuk membawa kesemua ${f("sterbord_stenen_per_speler")} buah dari satu hujung ke hujung bertentangan, dan tidak boleh kurang daripada itu. Satu rantai lompatan yang lengkap dikira sebagai satu langkah.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Papan bintang dengan hanya sepuluh buah merah, di hujung bawah. Hujung atas, tempat yang mesti dituju, mempunyai garis tepi putus-putus.",
  tekst: "Seorang pemain bersendirian: sepuluh buah di hujung bawah, dan hujung atas ialah sasarannya.",
})}
      <p><strong>Cara ia dikira.</strong> Satu ujian memainkan lintasan ${f("oversteek_zetten")} langkah dengan peraturan Leapstone, tanpa buah lain di atas papan. Untuk menunjukkan bahawa ${f("geen_oversteek_in_zetten")} langkah atau kurang tidak mungkin, satu carian mengikut kaedah G. I. Bell (<em>Integers</em> 9, 2009). Setiap langkah boleh dimainkan ke belakang, dan memusingkan papan setengah pusingan menukar permulaan dengan sasaran. Jadi jika wujud lintasan ${f("geen_oversteek_in_zetten")} langkah atau kurang, ada kedudukan di pertengahan jalan yang paling jauh ${f("zoekdiepte_zetten")} langkah dari permulaan, begitu juga kedudukan yang sama setelah dipusingkan setengah pusingan. Carian itu menyemak setiap kedudukan dalam jarak ${f("zoekdiepte_zetten")} langkah dari permulaan, mengira sesuatu kedudukan dan bayangan cerminnya sekali sahaja, membuang kedudukan yang terbukti tidak dapat maju cukup jauh tepat pada masanya, dan tidak menjumpai pasangan seperti itu. Carian berjalan ${f("gemeten_rekentijd_seconden")} saat pada mesin dengan ${f("gemeten_kernen")} teras, dan langkah terbesarnya memuatkan ${f("gemeten_grootste_laag_miljoen_standen")} juta kedudukan dalam ${f("gemeten_geheugen_gb")} GB memori. Angka itu dikira semula untuk papan Leapstone sendiri.</p>
      <p><strong>Bukan had bawah untuk permainan sebenar.</strong> Dalam permainan sebenar, buah pemain lain juga ada di atas papan, dan buah anda boleh melompatinya. Jadi ${f("oversteek_zetten")} bukan jumlah paling sedikit untuk permainan sebenar: ia hanya terbukti untuk seorang pemain bersendirian.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Cuba sendiri</h2>
      <p><a href="/play/">Main Leapstone dalam pelayar</a> menentang komputer, atau dapatkan aplikasinya melalui butang di bahagian atas halaman ini. Untuk peraturan, baca <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> atau <a href="/ms/peraturan/halma">peraturan Halma</a>. Untuk cara menggunakan rantai lompatan dalam permainan, baca <a href="/ms/panduan/dam-cina-strategi">petua strategi</a>.</p>
    </section>`;

export default {
  nav: "Dam Cina dalam nombor",
  titel: "Dam Cina dalam nombor | Leapstone",
  beschrijving: `Papan bintang ada ${c.sterbord_vakken} petak. Satu langkah paling banyak ${c.langste_sprongketen} lompatan, dan pemain bersendirian perlu ${c.oversteek_zetten} langkah untuk melintas. Cara setiap angka dikira.`,
  h1: "Dam Cina dalam nombor",
  intro: `Papan bintang dam Cina mempunyai ${f("sterbord_vakken")} petak, dan setiap pemain bermula dengan ${f("sterbord_stenen_per_speler")} buah. Dalam Leapstone, satu langkah tidak boleh sekali-kali mempunyai lebih daripada ${f("langste_sprongketen")} lompatan. Seorang pemain bersendirian di atas papan, tanpa lawan, memerlukan ${f("oversteek_zetten")} langkah untuk melintasinya. Di bawah ini anda boleh lihat cara setiap angka dikira, dan apa yang dikatakan dan tidak dikatakannya tentang permainan sebenar.`,
  inhoud,
};
