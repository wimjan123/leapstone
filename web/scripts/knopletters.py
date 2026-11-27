"""Maakt de lettertypen voor de teksten op voorwerpen (taak 183). Wordt gestart door knopletters.mjs; draai dat bestand, niet dit.

Leest een JSON-bestand: { "uit": map, "groepen": [{ "id", "bron", "nummer", "tekst" }] }.
Verkleint elk lettertype tot de tekens van de knopteksten (met alle opmaakregels, dus vormen van Arabisch, Thai en Devanagari kloppen),
slaat het op als woff2 en schrijft letters.json: de tekens die echt in elk bestand zitten. De test leest dat bestand.
"""
import json, sys
from fontTools import subset
from fontTools.ttLib import TTFont

spec = json.load(open(sys.argv[1], encoding="utf-8"))
uit = {}
for g in spec["groepen"]:
    opt = subset.Options()
    opt.flavor = "woff2"
    opt.layout_features = ["*"]
    opt.hinting = False
    opt.desubroutinize = True
    opt.name_IDs = ["*"]
    opt.notdef_outline = True
    opt.font_number = g.get("nummer", -1)
    font = subset.load_font(g["bron"], opt)
    sub = subset.Subsetter(opt)
    sub.populate(text=g["tekst"] + " ")
    sub.subset(font)
    doel = f'{spec["uit"]}/{g["id"]}.woff2'
    subset.save_font(font, doel, opt)
    cmap = TTFont(doel).getBestCmap()
    uit[g["id"]] = "".join(sorted(chr(c) for c in cmap if c > 32 and c != 0xFFFD))
    print(f'{g["id"]}: {len(uit[g["id"]])} tekens')
json.dump(uit, open(f'{spec["uit"]}/letters.json', "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
