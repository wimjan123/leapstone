// De Urdu spelregelpagina Sternhalma (taak 134). Inhoud en bronnen: de Engelse pagina ../en/sternhalma.mjs (Wikipedia Halma en Chinese checkers, zie daar), zin voor zin in het Urdu.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">نام کا مطلب</h2>
      <p>Sternhalma ستارہ نما بورڈ پر کھیلی جانے والی Halma کا جرمن نام ہے۔ <em>Stern</em> جرمن میں ستارے کو کہتے ہیں۔ چائنیز چیکرز اسی کھیل کا وہ نام ہے جو بعد میں ریاستہائے متحدہ میں دیا گیا۔</p>
      <p>Leapstone میں یہ <strong>ستارہ بورڈ</strong> ہے: <a href="/ur/qawaid/chinese-checkers">چائنیز چیکرز کے اصول</a> والا بورڈ۔</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">یہ کہاں سے آیا</h2>
      <ul>
        <li><strong>Halma</strong> 1883 یا 1884 میں ایک امریکی سرجن جارج ہاورڈ مونکس نے ایجاد کی۔ یہ نام یونانی میں &ldquo;چھلانگ&rdquo; کو کہتے ہیں۔ یہ چوکور بورڈ پر کھیلی جاتی ہے۔ <a href="/ur/qawaid/halma">Halma کے اصول پڑھیں</a>۔</li>
        <li><strong>Stern-Halma</strong> 1892 میں جرمنی میں سامنے آئی: وہی خیال، چھ کونوں والے ستارے کی شکل کے بورڈ پر۔</li>
        <li><strong>چائنیز چیکرز</strong> وہ نام ہے جو بل اور جیک پریس مین نے 1928 میں ریاستہائے متحدہ میں اس کھیل کو دیا، شروع میں &ldquo;Hop Ching checkers&rdquo; کے طور پر۔ اس کھیل کا چین سے کوئی تاریخی تعلق نہیں ہے، اور یہ چیکرز کا کھیل بھی نہیں ہے۔</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">کھیلوں میں فرق</h2>
      <ul>
        <li><strong>Halma:</strong> 16 ضرب 16 خانوں کا چوکور بورڈ، 2 یا 4 کھلاڑیوں کے لیے۔ ایک گوٹی کے آٹھ پڑوسی ہوتے ہیں، سیدھے اور ترچھے۔ 2 کھلاڑیوں کے ساتھ ہر ایک کی 19 گوٹیاں ہوتی ہیں، 4 کھلاڑیوں کے ساتھ 13۔</li>
        <li><strong>Sternhalma اور چائنیز چیکرز:</strong> 121 خانوں کا ستارہ نما بورڈ، 2، 3، 4 یا 6 کھلاڑیوں کے لیے۔ ایک گوٹی کے چھ پڑوسی ہوتے ہیں۔ ہر ایک کی 10 گوٹیاں ہوتی ہیں۔</li>
        <li><strong>باقی سب ایک جیسا ہے:</strong> خالی پڑوسی خانے پر ایک قدم، یا ایک گوٹی کے اوپر سے چھلانگ، چھلانگوں کی زنجیروں کے ساتھ۔ بورڈ کے پار والے کیمپ کو سب سے پہلے بھرنے والا کھلاڑی جیتتا ہے۔</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">مختلف طریقے، اور Leapstone کیا کرتا ہے</h2>
      <p>Halma ایک سے زیادہ طریقوں سے کھیلی گئی ہے۔ ہمیں اپنے ذرائع میں جو مختلف طریقے ملے، ان کے مقابلے میں Leapstone یوں ہے:</p>
      <ul>
        <li><strong>بورڈ کا سائز۔</strong> Halma 8 ضرب 8 اور 10 ضرب 10 کے بورڈز پر بھی کھیلی جاتی ہے۔ Leapstone میں صرف 16 ضرب 16 کا بورڈ ہے۔</li>
        <li><strong>منزل سے نکلنا۔</strong> Halma کے ایک اصول میں، جو گوٹی مخالف کے کیمپ میں داخل ہو جائے وہ دوبارہ اس سے نہیں نکل سکتی۔ Leapstone میں یہ اصول نہیں ہے: آپ ایسی گوٹی کو دوبارہ چلا سکتے ہیں۔</li>
        <li><strong>ستارے پر تین کھلاڑی۔</strong> ستارہ نما بورڈ پر تین کھلاڑیوں کی ایک پرانی Halma بیان کی گئی ہے جس میں ہر ایک کی 15 گوٹیاں ہیں۔ Leapstone ستارہ بورڈ پر 3 کھلاڑیوں کو ہر ایک کی 10 گوٹیوں کے ساتھ کھلاتا ہے۔</li>
        <li><strong>چھلانگیں آپ کی مرضی ہیں۔</strong> آپ کو کبھی چھلانگ لگانا ضروری نہیں۔ آپ وہ خانہ خود چنتے ہیں جہاں آپ کی چال ختم ہو۔</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">اسے Leapstone میں کھیلیں</h2>
      <p>ابھی کھیلیں ستارہ بورڈ پر کمپیوٹر کے خلاف ایک کھیل کھولتا ہے۔ چوکور بورڈ کے لیے اوپر پیچھے کے تیر پر ٹیپ کریں اور مینو میں چوکور بورڈ چنیں۔</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "ستارہ نما بورڈ، جس کے نچلے کونے میں 10 سرخ گوٹیاں اور اوپر والے کونے میں 10 نیلی گوٹیاں ہیں",
  tekst: "2 کھلاڑیوں کے لیے ستارہ بورڈ۔",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma کیا ہے؟ ستارہ نما بورڈ پر Halma | Leapstone",
  beschrijving: "Sternhalma ستارہ نما بورڈ پر کھیلی جانے والی Halma کا جرمن نام ہے۔ اس کا Halma اور چائنیز چیکرز سے کیا تعلق ہے، اور اسے مفت کیسے کھیلیں۔",
  h1: "Sternhalma، Halma اور چائنیز چیکرز",
  intro: "قریبی تعلق رکھنے والے کھیلوں کے تین نام۔ ہر نام کا کیا مطلب ہے، یہ کہاں سے آئے، اور ان میں کیا فرق ہے۔",
  inhoud,
};
