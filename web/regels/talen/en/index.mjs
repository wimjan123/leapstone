// De Engelse spelregelpagina's en gidsen. Engels is de bron: de andere talen vertalen deze bestanden zin voor zin.
// Taalbrede gegevens (locale, richting, naam, taalkeuze, App Store-land) komen uit web/landing/talen/<code>.mjs.
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
import achteruit from "./can-you-move-backwards-in-chinese-checkers.mjs";
import eigenSteen from "./can-you-jump-your-own-piece-in-chinese-checkers.mjs";
import tegenstander from "./can-you-jump-over-your-opponent-in-chinese-checkers.mjs";
import cijfers from "./chinese-checkers-by-the-numbers.mjs";

export default {
  code: "en",
  speel: "Play now",
  site: "Site",
  nav: { thuis: "Leapstone", spelen: "Play in your browser", privacy: "Privacy policy", terms: "Terms of use" },
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
    "can-you-move-backwards-in-chinese-checkers": achteruit,
    "can-you-jump-your-own-piece-in-chinese-checkers": eigenSteen,
    "can-you-jump-over-your-opponent-in-chinese-checkers": tegenstander,
    "chinese-checkers-by-the-numbers": cijfers,
  },
};
