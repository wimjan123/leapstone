//! De kleur en de inkt van de Stenen. Op het 3D-bord (ontwerp 1b, taak 177) zijn de Stenen van
//! gekleurde lak: elke kleur uit `SPELER_KLEUREN` in de web-app heeft een eigen lakkleur en inkt,
//! uit het prototype (`kandidaat-1b/kleuren.md`) en daarna bijgesteld op de Bevy-render (taak 177:
//! rood, groen en lila iets lichter of feller), zodat de zes Stenen ook voor kleurenblinde Spelers uit
//! elkaar te houden zijn. Gemeten met `npm --prefix web run meet-bord -- --meting=kleur --gpu`. Een andere kleur krijgt de regel van
//! `inktVoor` in `web/src/steen.ts`.

/// Het aantal tekens: ▲ ■ ● ◆ ✚ ○, voor Speler 1 tot 6 (bij meer Spelers begint het opnieuw).
pub const AANTAL_TEKENS: usize = 6;

/// De donkere inkt van het ontwerp: `#0e3b43`.
const INKT: u32 = 0x0e3b43;

/// Hoe licht het oog een kleur ziet (0 tot 1), zoals WCAG het rekent.
fn helderheid(rgb: u32) -> f32 {
    let lin = |s: u32| {
        let c = ((rgb >> s) & 0xff) as f32 / 255.0;
        if c <= 0.04045 {
            c / 12.92
        } else {
            ((c + 0.055) / 1.055).powf(2.4)
        }
    };
    0.2126 * lin(16) + 0.7152 * lin(8) + 0.0722 * lin(0)
}

/// Contrast (1 tot 21) tussen twee kleuren.
fn contrast(a: u32, b: u32) -> f32 {
    let (x, y) = (helderheid(a), helderheid(b));
    (x.max(y) + 0.05) / (x.min(y) + 0.05)
}

/// Is het teken wit (anders donker)? Wat het meeste contrast geeft met de kleur van de Steen.
pub fn inkt_wit(rgb: u32) -> bool {
    contrast(rgb, 0xff_ffff) >= contrast(rgb, INKT)
}

/// Een Steen van lak: de kleur van de lak, de inkt van het teken, en of hij mat is (de inktsteen:
/// een glanzende zwarte Steen wordt op de render bruin van de weerspiegeling).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Lak {
    pub kleur: u32,
    pub inkt: u32,
    pub mat: bool,
}

/// De lichte en de donkere inkt van de lakstenen.
const INKT_LICHT: u32 = 0xfff3dc;
const INKT_DONKER: u32 = 0x221812;

/// `SPELER_KLEUREN` (web/src/spelers.ts) en hun lak: cinnaberrood, kobaltblauw, jadegroen,
/// keizerlijk geel, blauweregen (lila) en inktsteen.
const LAKKEN: [(u32, Lak); 6] = [
    (
        0xe2533c,
        Lak {
            kleur: 0xc41d0a,
            inkt: INKT_LICHT,
            mat: false,
        },
    ),
    (
        0x3358e0,
        Lak {
            kleur: 0x0b1590,
            inkt: INKT_LICHT,
            mat: false,
        },
    ),
    (
        0x2aa882,
        Lak {
            kleur: 0x62f2d6,
            inkt: 0x10241f,
            mat: false,
        },
    ),
    (
        0xf6c945,
        Lak {
            kleur: 0xffde24,
            inkt: 0x2a1a0c,
            mat: false,
        },
    ),
    (
        0xb49cf7,
        Lak {
            kleur: 0xd2a0fa,
            inkt: 0x24143c,
            mat: false,
        },
    ),
    (
        0x242c36,
        Lak {
            kleur: 0x0b0d10,
            inkt: INKT_LICHT,
            mat: true,
        },
    ),
];

/// De lak van een Steen in kleur `rgb` (0xRRGGBB).
pub fn lak(rgb: u32) -> Lak {
    let rgb = rgb & 0xff_ffff;
    LAKKEN
        .iter()
        .find(|(k, _)| *k == rgb)
        .map(|(_, l)| *l)
        .unwrap_or(Lak {
            kleur: rgb,
            inkt: if inkt_wit(rgb) {
                INKT_LICHT
            } else {
                INKT_DONKER
            },
            mat: false,
        })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// De zes kleuren van `SPELER_KLEUREN` (web/src/spelers.ts) en hun inkt.
    const KLEUREN: [(u32, bool); 6] = [
        (0xe2533c, true),
        (0x3358e0, true),
        (0x2aa882, false),
        (0xf6c945, false),
        (0xb49cf7, false),
        (0x242c36, true),
    ];

    #[test]
    fn de_inkt_geeft_elke_steen_genoeg_contrast() {
        for (rgb, wit) in KLEUREN {
            assert_eq!(inkt_wit(rgb), wit, "{rgb:06x}");
            let inkt = if wit { 0xff_ffff } else { INKT };
            // Een teken is een vorm, geen tekst: minstens 3 op 1.
            assert!(contrast(rgb, inkt) >= 3.0, "{rgb:06x}");
        }
    }

    #[test]
    fn elke_spelerkleur_heeft_zijn_eigen_lak_met_een_leesbaar_teken() {
        let mut gezien = Vec::new();
        for (rgb, _) in KLEUREN {
            let l = lak(rgb);
            assert_ne!(l.kleur, rgb, "{rgb:06x} heeft geen eigen lak");
            assert!(!gezien.contains(&l.kleur));
            gezien.push(l.kleur);
            assert!(contrast(l.kleur, l.inkt) >= 3.0, "{rgb:06x}");
        }
        // Alleen de inktsteen is mat.
        assert_eq!(KLEUREN.iter().filter(|(k, _)| lak(*k).mat).count(), 1);
        // Een andere kleur blijft zichzelf.
        assert_eq!(lak(0x123456).kleur, 0x123456);
    }

    #[test]
    fn een_lichte_kleur_krijgt_donkere_inkt_en_een_donkere_witte() {
        assert!(!inkt_wit(0xf6c945));
        assert!(inkt_wit(0x000000));
        assert!(inkt_wit(0x242c36));
    }
}
