// Le pagine italiane delle regole e delle guide (taak 134). Il testo segue i file inglesi in ../en/ frase per frase.
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
  code: "it",
  speel: "Gioca ora",
  site: "Sito",
  nav: { thuis: "Leapstone", spelen: "Gioca nel browser", privacy: "Informativa sulla privacy (in inglese)", terms: "Termini d'uso (in inglese)" },
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
