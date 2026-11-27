// صفحات القواعد والأدلة بالعربية (المهمة 134). النص يتبع الملفات الإنجليزية في ../en/ جملة بجملة.
import chineseCheckers from "./chinese-checkers.mjs";
import halma from "./halma.mjs";
import sternhalma from "./sternhalma.mjs";
import strategie from "./chinese-checkers-strategy.mjs";
import tweeSpelers from "./chinese-checkers-2-players.mjs";
import halmaTegenover from "./halma-vs-chinese-checkers.mjs";
import drieSpelers from "./chinese-checkers-3-players.mjs";
import vierSpelers from "./chinese-checkers-4-players.mjs";
import zesSpelers from "./chinese-checkers-6-players.mjs";
import openingen from "./chinese-checkers-opening-moves.mjs";
import onlineMetVrienden from "./play-chinese-checkers-online-with-friends.mjs";
import cijfers from "./chinese-checkers-by-the-numbers.mjs";

export default {
  code: "ar",
  speel: "العب الآن",
  site: "الموقع",
  nav: { thuis: "Leapstone", spelen: "العب في المتصفح", privacy: "سياسة الخصوصية (بالإنجليزية)", terms: "شروط الاستخدام (بالإنجليزية)" },
  paginas: {
    "chinese-checkers": chineseCheckers,
    halma,
    sternhalma,
    "chinese-checkers-strategy": strategie,
    "chinese-checkers-2-players": tweeSpelers,
    "halma-vs-chinese-checkers": halmaTegenover,
    "chinese-checkers-3-players": drieSpelers,
    "chinese-checkers-4-players": vierSpelers,
    "chinese-checkers-6-players": zesSpelers,
    "chinese-checkers-opening-moves": openingen,
    "play-chinese-checkers-online-with-friends": onlineMetVrienden,
    "chinese-checkers-by-the-numbers": cijfers,
  },
};
