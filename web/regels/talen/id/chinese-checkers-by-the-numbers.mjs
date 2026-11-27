// Leapstone dalam angka, Indonesisch (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Petak dan bidak</h2>
      <p>Dihitung pada dua papan Leapstone, dalam posisi awal sebuah permainan.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Papan bintang dengan keenam ujungnya penuh: sepuluh bidak dari masing-masing enam warna, di sekeliling bagian tengah yang kosong.",
  tekst: "Papan bintang di awal permainan untuk enam pemain.",
})}
      <ul class="tips">
        <li><strong>Papan bintang punya ${f("sterbord_vakken")} petak.</strong> Setiap pemain mulai dengan ${f("sterbord_stenen_per_speler")} bidak. Jadi permainan untuk dua pemain punya ${f("sterbord_stenen_2_spelers")} bidak di papan, untuk tiga pemain ${f("sterbord_stenen_3_spelers")}, untuk empat ${f("sterbord_stenen_4_spelers")}, dan untuk enam ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Papan Halma yang persegi punya ${f("vierkant_vakken")} petak.</strong> Dalam permainan untuk dua pemain, setiap pemain mulai dengan ${f("vierkant_stenen_per_speler_2_spelers")} bidak, semuanya ${f("vierkant_stenen_2_spelers")}. Dalam permainan untuk empat pemain, masing-masing mulai dengan ${f("vierkant_stenen_per_speler_4_spelers")} bidak, semuanya ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Rantai lompatan terpanjang: ${f("langste_sprongketen")}</h2>
      <p>Di papan bintang, satu bidak bisa melakukan <strong>${f("langste_sprongketen")} lompatan dalam satu langkah</strong>, dan menurut aturan Leapstone tidak ada langkah yang bisa punya lebih banyak. Untuk mencapai angka itu, bidak-bidak lain ditaruh dengan bebas: satu di setiap petak yang dilompati bidak itu.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Papan bintang dengan satu bidak merah dan banyak bidak biru. Panah putih menunjukkan bidak merah melompati satu bidak biru demi satu, di sepanjang jalur yang panjang dan berkelok.",
  tekst: "Rantai terpanjang: bidak merah melompati setiap bidak biru, satu demi satu.",
})}
      <p><strong>Cara menghitungnya.</strong> Sebuah lompatan selalu mendarat dua petak lebih jauh, dalam garis lurus. Jadi bidak yang terus melompat hanya bisa mencapai sebagian petak: papan terbagi menjadi empat kelompok seperti itu, dan yang terbesar punya ${f("grootste_klasse_vakken")} petak. Di Leapstone, bidak tidak boleh mendarat dua kali di petak yang sama dalam satu langkah, juga tidak di petak tempat ia mulai. Jadi sebuah rantai mendarat paling banyak sekali di setiap petak lain dalam kelompoknya. Program menelusuri kelompok itu dan menemukan jalur yang melewati semua ${f("grootste_klasse_vakken")} petak, jadi tidak ada rantai yang bisa lebih panjang: ${f("langste_sprongketen")} lompatan. Lalu sebuah tes memainkan langkah itu dengan aturan Leapstone.</p>
      <p><strong>Bukan permainan sungguhan.</strong> Rantai ini butuh ${f("langste_sprongketen")} bidak lain, masing-masing tepat di petak yang benar. Permainan untuk dua atau tiga pemain hanya punya ${f("sterbord_stenen_2_spelers")} atau ${f("sterbord_stenen_3_spelers")} bidak, dan itu terlalu sedikit. Permainan untuk empat atau enam pemain punya ${f("sterbord_stenen_4_spelers")} atau ${f("sterbord_stenen_6_spelers")}, dan itu cukup. Tetapi dalam permainan sungguhan tidak ada yang menaruh bidak dengan bebas, jadi jangan berharap melihat rantai ini di meja. Rantai ini menunjukkan apa yang diizinkan papan, bukan apa yang terjadi saat bermain.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Penyeberangan tercepat: ${f("oversteek_zetten")} langkah</h2>
      <p>Satu pemain sendirian di papan bintang, tanpa lawan, butuh <strong>${f("oversteek_zetten")} langkah</strong> untuk memindahkan semua ${f("sterbord_stenen_per_speler")} bidak dari satu ujung ke ujung seberang, dan tidak bisa kurang dari itu. Satu rantai lompatan utuh dihitung sebagai satu langkah.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Papan bintang dengan hanya sepuluh bidak merah, di ujung bawah. Ujung atas, tempat tujuan mereka, punya garis tepi putus-putus.",
  tekst: "Satu pemain sendirian: sepuluh bidak di ujung bawah, dan ujung atas adalah tujuannya.",
})}
      <p><strong>Cara menghitungnya.</strong> Sebuah tes memainkan penyeberangan ${f("oversteek_zetten")} langkah dengan aturan Leapstone, tanpa bidak lain di papan. Untuk menunjukkan bahwa ${f("geen_oversteek_in_zetten")} langkah atau kurang tidak mungkin, sebuah pencarian mengikuti metode G. I. Bell (<em>Integers</em> 9, 2009). Setiap langkah bisa dimainkan mundur, dan memutar papan setengah putaran menukar awal dan tujuan. Jadi kalau ada penyeberangan ${f("geen_oversteek_in_zetten")} langkah atau kurang, ada posisi di tengah jalan yang paling jauh ${f("zoekdiepte_zetten")} langkah dari awal, begitu juga posisi yang sama setelah diputar setengah putaran. Pencarian itu memeriksa setiap posisi dalam jarak ${f("zoekdiepte_zetten")} langkah dari awal, menghitung sebuah posisi dan bayangan cerminnya satu kali, membuang posisi yang terbukti tidak bisa maju cukup jauh tepat waktu, dan tidak menemukan pasangan seperti itu. Pencarian berjalan ${f("gemeten_rekentijd_seconden")} detik di mesin dengan ${f("gemeten_kernen")} inti, dan langkah terbesarnya memuat ${f("gemeten_grootste_laag_miljoen_standen")} juta posisi dalam ${f("gemeten_geheugen_gb")} GB memori. Angka itu dihitung ulang untuk papan Leapstone sendiri.</p>
      <p><strong>Bukan batas bawah untuk permainan sungguhan.</strong> Dalam permainan sungguhan, bidak pemain lain juga ada di papan, dan bidakmu bisa melompatinya. Jadi ${f("oversteek_zetten")} bukan jumlah paling sedikit untuk permainan sungguhan: angka itu hanya terbukti untuk satu pemain sendirian.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Coba sendiri</h2>
      <p><a href="/play/">Mainkan Leapstone di browser</a> melawan komputer, atau unduh aplikasinya lewat tombol di bagian atas halaman ini. Untuk aturannya, baca <a href="/id/aturan/dam-cina">aturan dam Cina</a> atau <a href="/id/aturan/halma">aturan Halma</a>. Untuk cara memakai rantai lompatan dalam permainan, baca <a href="/id/panduan/dam-cina-strategi">tips strategi</a>.</p>
    </section>`;

export default {
  nav: "Dam Cina dalam angka",
  titel: "Dam Cina dalam angka | Leapstone",
  beschrijving: `Papan bintang punya ${c.sterbord_vakken} petak. Satu langkah paling banyak ${c.langste_sprongketen} lompatan, dan pemain sendirian butuh ${c.oversteek_zetten} langkah untuk menyeberang. Cara tiap angka dihitung.`,
  h1: "Dam Cina dalam angka",
  intro: `Papan bintang dam Cina punya ${f("sterbord_vakken")} petak, dan setiap pemain mulai dengan ${f("sterbord_stenen_per_speler")} bidak. Di Leapstone, satu langkah tidak pernah bisa punya lebih dari ${f("langste_sprongketen")} lompatan. Satu pemain sendirian di papan, tanpa lawan, butuh ${f("oversteek_zetten")} langkah untuk menyeberanginya. Di bawah ini kamu bisa melihat cara setiap angka dihitung, dan apa yang dikatakan dan tidak dikatakannya tentang permainan sungguhan.`,
  inhoud,
};
