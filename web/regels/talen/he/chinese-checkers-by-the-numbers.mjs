// Leapstone במספרים, Hebreeuws (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">נקודות וכלים</h2>
      <p>נספרו על שני הלוחות של Leapstone, במצב הפתיחה של משחק.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "לוח הכוכב כשכל שש הקצוות מלאים: עשרה כלים מכל אחד משישה צבעים, סביב מרכז ריק.",
  tekst: "לוח הכוכב בתחילת משחק לשישה שחקנים.",
})}
      <ul class="tips">
        <li><strong>בלוח הכוכב יש ${f("sterbord_vakken")} נקודות.</strong> כל שחקן מתחיל עם ${f("sterbord_stenen_per_speler")} כלים. לכן במשחק לשני שחקנים יש על הלוח ${f("sterbord_stenen_2_spelers")} כלים, במשחק לשלושה ${f("sterbord_stenen_3_spelers")}, לארבעה ${f("sterbord_stenen_4_spelers")} ולשישה ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>בלוח ההלמה המרובע יש ${f("vierkant_vakken")} נקודות.</strong> במשחק לשני שחקנים כל שחקן מתחיל עם ${f("vierkant_stenen_per_speler_2_spelers")} כלים, ${f("vierkant_stenen_2_spelers")} בסך הכול. במשחק לארבעה כל אחד מתחיל עם ${f("vierkant_stenen_per_speler_4_spelers")} כלים, ${f("vierkant_stenen_4_spelers")} בסך הכול.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">שרשרת הקפיצות הארוכה ביותר: ${f("langste_sprongketen")}</h2>
      <p>על לוח הכוכב, כלי אחד יכול לבצע <strong>${f("langste_sprongketen")} קפיצות במהלך אחד</strong>, ולפי החוקים של Leapstone אין מהלך שיכול להכיל יותר. כדי להגיע למספר הזה, שאר הכלים מוצבים בחופשיות: אחד על כל נקודה שהכלי קופץ מעליה.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "לוח כוכב עם כלי אדום אחד והרבה כלים כחולים. חצים לבנים מראים את הכלי האדום קופץ מעל כלי כחול אחד אחרי השני, לאורך מסלול ארוך ומתפתל.",
  tekst: "השרשרת הארוכה ביותר: הכלי האדום קופץ מעל כל כלי כחול, אחד אחרי השני.",
})}
      <p><strong>איך זה נספר.</strong> קפיצה תמיד נוחתת שתי נקודות הלאה, בקו ישר. לכן כלי שממשיך לקפוץ מגיע רק לחלק מהנקודות: הלוח מתחלק לארבע קבוצות כאלה, ובגדולה מהן יש ${f("grootste_klasse_vakken")} נקודות. ב־Leapstone כלי לא יכול לנחות פעמיים על אותה נקודה במהלך אחד, וגם לא על הנקודה שממנה יצא. לכן שרשרת נוחתת לכל היותר פעם אחת על כל אחת מהנקודות האחרות בקבוצה שלה. התוכנה חיפשה בקבוצה הזו ומצאה מסלול שעובר בכל ${f("grootste_klasse_vakken")} הנקודות, ולכן אין שרשרת שיכולה להיות ארוכה יותר: ${f("langste_sprongketen")} קפיצות. אחר כך בדיקה משחקת את המהלך הזה לפי החוקים של Leapstone.</p>
      <p><strong>לא משחק אמיתי.</strong> השרשרת הזו צריכה ${f("langste_sprongketen")} כלים אחרים, כל אחד בדיוק על הנקודה הנכונה. במשחק לשניים או לשלושה שחקנים יש רק ${f("sterbord_stenen_2_spelers")} או ${f("sterbord_stenen_3_spelers")} כלים, וזה מעט מדי. במשחק לארבעה או לשישה שחקנים יש ${f("sterbord_stenen_4_spelers")} או ${f("sterbord_stenen_6_spelers")}, וזה מספיק. אבל במשחק אמיתי אף אחד לא מציב כלים בחופשיות, אז אל תצפו לראות את השרשרת הזו ליד השולחן. היא מראה מה הלוח מאפשר, לא מה קורה במשחק.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">המעבר הקצר ביותר: ${f("oversteek_zetten")} מהלכים</h2>
      <p>שחקן אחד לבדו על לוח הכוכב, בלי יריבים, צריך <strong>${f("oversteek_zetten")} מהלכים</strong> כדי להעביר את כל ${f("sterbord_stenen_per_speler")} הכלים מקצה אחד לקצה שממול, ולא יכול לעשות את זה בפחות. שרשרת קפיצות שלמה נחשבת למהלך אחד.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "לוח כוכב שיש עליו רק עשרה כלים אדומים, בקצה התחתון. לקצה העליון, שאליו הם צריכים להגיע, יש מסגרת מקווקוות.",
  tekst: "שחקן אחד לבדו: עשרה כלים בקצה התחתון, והקצה העליון הוא היעד.",
})}
      <p><strong>איך זה נספר.</strong> בדיקה משחקת מעבר של ${f("oversteek_zetten")} מהלכים לפי החוקים של Leapstone, בלי כלים אחרים על הלוח. כדי להראות ש־${f("geen_oversteek_in_zetten")} מהלכים או פחות לא מספיקים, חיפוש הולך לפי השיטה של G. I. Bell (<em>Integers</em> 9, 2009). כל מהלך אפשר לשחק לאחור, וסיבוב של הלוח בחצי סיבוב מחליף בין ההתחלה ליעד. לכן אם היה קיים מעבר של ${f("geen_oversteek_in_zetten")} מהלכים או פחות, מצב כלשהו באמצע הדרך היה רחוק לכל היותר ${f("zoekdiepte_zetten")} מהלכים מההתחלה, וגם אותו מצב אחרי סיבוב בחצי סיבוב. החיפוש עבר על כל מצב שנמצא עד ${f("zoekdiepte_zetten")} מהלכים מההתחלה, ספר מצב ואת תמונת הראי שלו פעם אחת, השמיט מצבים שאפשר להוכיח שלא יגיעו רחוק מספיק בזמן, ולא מצא זוג כזה. הוא רץ ${f("gemeten_rekentijd_seconden")} שניות על מחשב עם ${f("gemeten_kernen")} ליבות, והשלב הגדול ביותר שלו החזיק ${f("gemeten_grootste_laag_miljoen_standen")} מיליון מצבים ב־${f("gemeten_geheugen_gb")} GB זיכרון. המספר חושב מחדש עבור הלוח של Leapstone עצמו.</p>
      <p><strong>לא גבול תחתון למשחק אמיתי.</strong> במשחק אמיתי גם הכלים של השחקנים האחרים נמצאים על הלוח, והכלים שלכם יכולים לקפוץ מעליהם. לכן ${f("oversteek_zetten")} הוא לא המינימום שמשחק אמיתי יכול לקחת: הוא הוכח רק לשחקן אחד לבדו.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">נסו בעצמכם</h2>
      <p><a href="/play/">שחקו Leapstone בדפדפן</a> נגד המחשב, או הורידו את האפליקציה בכפתורים שבראש הדף. לחוקים, קראו את <a href="/he/hokim/dameka-sinit">חוקי דמקה סינית</a> או את <a href="/he/hokim/halma">חוקי הלמה</a>. כדי לדעת איך להשתמש בשרשראות קפיצות במשחק, קראו את <a href="/he/madrichim/dameka-sinit-estrategia">טיפי האסטרטגיה</a>.</p>
    </section>`;

export default {
  nav: "דמקה סינית במספרים",
  titel: "דמקה סינית במספרים | Leapstone",
  beschrijving: `בלוח הכוכב יש ${c.sterbord_vakken} נקודות. במהלך אחד יש לכל היותר ${c.langste_sprongketen} קפיצות, ושחקן לבדו צריך ${c.oversteek_zetten} מהלכים כדי לחצות אותו. כך מחושב כל מספר.`,
  h1: "דמקה סינית במספרים",
  intro: `בלוח הכוכב של דמקה סינית יש ${f("sterbord_vakken")} נקודות, וכל שחקן מתחיל עם ${f("sterbord_stenen_per_speler")} כלים. ב־Leapstone במהלך אחד אף פעם לא יכולות להיות יותר מ־${f("langste_sprongketen")} קפיצות. שחקן אחד לבדו על הלוח, בלי יריבים, צריך ${f("oversteek_zetten")} מהלכים כדי לחצות אותו. בהמשך תראו איך נספר כל מספר, ומה הוא אומר ומה הוא לא אומר על משחק אמיתי.`,
  inhoud,
};
