// Leapstone بالأرقام, Arabisch (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">الخانات والقطع</h2>
      <p>عددناها على لوحتي Leapstone، في وضع بداية اللعبة.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "اللوحة النجمية ورؤوسها الستة كلها ممتلئة: عشر قطع من كل لون من الألوان الستة، حول وسط فارغ.",
  tekst: "اللوحة النجمية في بداية لعبة لستة لاعبين.",
})}
      <ul class="tips">
        <li><strong>في اللوحة النجمية ${f("sterbord_vakken")} خانة.</strong> يبدأ كل لاعب بـ${f("sterbord_stenen_per_speler")} قطع. لذلك في لعبة للاعبَين ${f("sterbord_stenen_2_spelers")} قطعة على اللوحة، وفي لعبة لثلاثة ${f("sterbord_stenen_3_spelers")}، ولأربعة ${f("sterbord_stenen_4_spelers")}، ولستة ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>في لوحة هالما المربعة ${f("vierkant_vakken")} خانة.</strong> في لعبة للاعبَين، يبدأ كل لاعب بـ${f("vierkant_stenen_per_speler_2_spelers")} قطعة، والمجموع ${f("vierkant_stenen_2_spelers")}. وفي لعبة لأربعة، يبدأ كل واحد بـ${f("vierkant_stenen_per_speler_4_spelers")} قطعة، والمجموع ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">أطول سلسلة قفزات: ${f("langste_sprongketen")}</h2>
      <p>على اللوحة النجمية، تستطيع قطعة واحدة أن تقوم بـ<strong>${f("langste_sprongketen")} قفزة في حركة واحدة</strong>، وحسب قواعد Leapstone لا يمكن أن تحتوي أي حركة على أكثر من ذلك. للوصول إلى هذا العدد، توضع القطع الأخرى بحرية: قطعة على كل خانة تقفز القطعة فوقها.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "لوحة نجمية عليها قطعة حمراء واحدة وقطع زرقاء كثيرة. أسهم بيضاء تُظهر القطعة الحمراء وهي تقفز فوق قطعة زرقاء بعد أخرى، على طريق طويل متعرج.",
  tekst: "أطول سلسلة: القطعة الحمراء تقفز فوق كل قطعة زرقاء، واحدة بعد أخرى.",
})}
      <p><strong>كيف عددناها.</strong> القفزة تهبط دائمًا على بُعد خانتين، في خط مستقيم. لذلك لا تصل القطعة التي تواصل القفز إلا إلى جزء من الخانات: تنقسم اللوحة إلى أربع مجموعات من هذا النوع، وفي أكبرها ${f("grootste_klasse_vakken")} خانة. في Leapstone، لا يجوز للقطعة في حركة واحدة أن تهبط مرتين على الخانة نفسها، ولا على الخانة التي بدأت منها. إذن تهبط السلسلة مرة واحدة على الأكثر على كل خانة أخرى في مجموعتها. بحث البرنامج في هذه المجموعة ووجد طريقًا يمر بكل الخانات الـ${f("grootste_klasse_vakken")}، فلا يمكن لأي سلسلة أن تكون أطول: ${f("langste_sprongketen")} قفزة. ثم يلعب اختبارٌ هذه الحركة بقواعد Leapstone.</p>
      <p><strong>ليست لعبة حقيقية.</strong> تحتاج هذه السلسلة إلى ${f("langste_sprongketen")} قطعة أخرى، كل واحدة على الخانة الصحيحة تمامًا. في لعبة للاعبَين أو ثلاثة لاعبين ${f("sterbord_stenen_2_spelers")} أو ${f("sterbord_stenen_3_spelers")} قطعة فقط، وهذا قليل جدًا. وفي لعبة لأربعة أو ستة لاعبين ${f("sterbord_stenen_4_spelers")} أو ${f("sterbord_stenen_6_spelers")} قطعة، وهذا يكفي. لكن في لعبة حقيقية لا أحد يضع القطع بحرية، فلا تتوقع هذه السلسلة على الطاولة. إنها تُظهر ما تسمح به اللوحة، لا ما يحدث أثناء اللعب.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">أقصر عبور: ${f("oversteek_zetten")} حركة</h2>
      <p>يحتاج لاعب واحد وحده على اللوحة النجمية، بلا خصوم، إلى <strong>${f("oversteek_zetten")} حركة</strong> لينقل قطعه الـ${f("sterbord_stenen_per_speler")} كلها من رأس إلى الرأس المقابل، ولا يستطيع ذلك بأقل منها. سلسلة القفزات الكاملة تُحسب حركة واحدة.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "لوحة نجمية عليها عشر قطع حمراء فقط، في الرأس السفلي. للرأس العلوي، حيث يجب أن تصل، حدّ منقّط.",
  tekst: "لاعب واحد وحده: عشر قطع في الرأس السفلي، والرأس العلوي هو الهدف.",
})}
      <p><strong>كيف عددناها.</strong> يلعب اختبارٌ عبورًا من ${f("oversteek_zetten")} حركة بقواعد Leapstone، دون قطع أخرى على اللوحة. ولإثبات أن ${f("geen_oversteek_in_zetten")} حركة أو أقل لا تكفي، يتبع بحثٌ طريقة G. I. Bell (<em>Integers</em> 9, 2009). يمكن لعب كل حركة بالعكس، وتدوير اللوحة نصف دورة يبدّل البداية والهدف. فلو وُجد عبور من ${f("geen_oversteek_in_zetten")} حركة أو أقل، لكان هناك وضع في منتصف الطريق يبعد عن البداية ${f("zoekdiepte_zetten")} حركة على الأكثر، وكذلك الوضع نفسه بعد تدويره نصف دورة. مرّ البحث على كل وضع يبعد عن البداية ${f("zoekdiepte_zetten")} حركة أو أقل، وعدّ الوضع وصورته في المرآة مرة واحدة، وترك الأوضاع التي ثبت أنها لا تستطيع التقدم بما يكفي في الوقت المتاح، ولم يجد زوجًا كهذا. استغرق ${f("gemeten_rekentijd_seconden")} ثانية على جهاز فيه ${f("gemeten_kernen")} أنوية، وحملت أكبر خطوة فيه ${f("gemeten_grootste_laag_miljoen_standen")} مليون وضع في ${f("gemeten_geheugen_gb")} غيغابايت من الذاكرة. وقد حُسب العدد من جديد للوحة Leapstone نفسها.</p>
      <p><strong>ليس حدًا أدنى للعبة حقيقية.</strong> في لعبة حقيقية تكون قطع اللاعبين الآخرين على اللوحة أيضًا، ويمكن لقطعك أن تقفز فوقها. لذلك ليس ${f("oversteek_zetten")} أقل ما يمكن أن تستغرقه لعبة حقيقية: فهو مثبت فقط للاعب واحد وحده.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">جرّبها</h2>
      <p><a href="/play/">العب Leapstone في المتصفح</a> ضد الكمبيوتر، أو نزّل التطبيق بالأزرار في أعلى هذه الصفحة. للقواعد، اقرأ <a href="/ar/qawaid/dama-siniya">قواعد الداما الصينية</a> أو <a href="/ar/qawaid/halma">قواعد هالما</a>. ولتعرف كيف تستخدم سلاسل القفزات في اللعبة، اقرأ <a href="/ar/adilla/istiratijiyat-dama-siniya">نصائح الاستراتيجية</a>.</p>
    </section>`;

export default {
  nav: "الداما الصينية بالأرقام",
  titel: "الداما الصينية بالأرقام | Leapstone",
  beschrijving: `في اللوحة النجمية ${c.sterbord_vakken} خانة. في الحركة الواحدة ${c.langste_sprongketen} قفزة على الأكثر، ويحتاج لاعب وحده إلى ${c.oversteek_zetten} حركة ليعبرها. كيف يُحسب كل عدد.`,
  h1: "الداما الصينية بالأرقام",
  intro: `في اللوحة النجمية للداما الصينية ${f("sterbord_vakken")} خانة، ويبدأ كل لاعب بـ${f("sterbord_stenen_per_speler")} قطع. في Leapstone، لا يمكن أن تحتوي حركة واحدة أبدًا على أكثر من ${f("langste_sprongketen")} قفزة. ويحتاج لاعب واحد وحده على اللوحة، بلا خصوم، إلى ${f("oversteek_zetten")} حركة ليعبرها. أدناه ترى كيف عُدّ كل رقم، وما الذي يقوله وما لا يقوله عن لعبة حقيقية.`,
  inhoud,
};
