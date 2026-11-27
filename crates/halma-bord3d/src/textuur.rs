//! Texturen die Rust zelf uitrekent (ontwerp 1b, taak 177). De grote plaatjes van het bord, de rand,
//! het beslag en de tafel zijn gebakken in de browser (`web/scripts/bak-bord3d`) en komen via `zet_plaatje`.
//!
//! - de kop van een Steen: de lakkleur met een lichte wolking, een gouden bies en het teken;
//! - de contactschaduw onder een Steen in zijn gat, de zachte schaduw onder een opgetilde Steen;
//! - de ring om het gat van de gekozen Steen en de landingsschaduw van een gesleepte Steen;
//! - de schaduw van het bord op de tafel.

use crate::vorm;
use glam::Vec2;

/// De kleur van schaduwen op lak en zijde: bijna zwart, iets warm (`#140802`).
pub const SCHADUW: [u8; 3] = [0x14, 0x08, 0x02];
/// Het plaatje van de kop van een Steen beslaat een vierkant van twee keer deze maat (vakken), van boven gezien.
pub const STEEN_BEREIK: f32 = 0.43;

fn byte(x: f32) -> u8 {
    (x.clamp(0.0, 1.0) * 255.0 + 0.5) as u8
}

/// Een vast willekeurig getal (0 tot 1) per roosterpunt.
fn hash(x: i32, y: i32, zaad: u32) -> f32 {
    let mut h = (x as u32)
        .wrapping_mul(0x8da6_b343)
        .wrapping_add((y as u32).wrapping_mul(0xd816_3841))
        .wrapping_add(zaad.wrapping_mul(0xcb1a_b31f));
    h ^= h >> 13;
    h = h.wrapping_mul(0x5bd1_e995);
    h ^= h >> 15;
    (h & 0x00ff_ffff) as f32 / 16_777_215.0
}

/// Zachte ruis (0 tot 1). `periode` > 0: herhaalt zich na zoveel roosterpunten.
fn ruis(p: Vec2, zaad: u32, periode: i32) -> f32 {
    let i = p.floor();
    let f = p - i;
    let u = f * f * (Vec2::splat(3.0) - 2.0 * f);
    let (x, y) = (i.x as i32, i.y as i32);
    let h = |dx: i32, dy: i32| {
        if periode > 0 {
            hash(
                (x + dx).rem_euclid(periode),
                (y + dy).rem_euclid(periode),
                zaad,
            )
        } else {
            hash(x + dx, y + dy, zaad)
        }
    };
    let a = h(0, 0) + (h(1, 0) - h(0, 0)) * u.x;
    let b = h(0, 1) + (h(1, 1) - h(0, 1)) * u.x;
    a + (b - a) * u.y
}

/// Ruis in lagen, elke laag twee keer zo fijn en half zo sterk (0 tot 1).
fn lagen(p: Vec2, zaad: u32, n: u32, periode: i32) -> f32 {
    let (mut som, mut gewicht, mut sterk, mut schaal) = (0.0, 0.0, 1.0, 1.0);
    for k in 0..n {
        let per = if periode > 0 {
            periode * schaal as i32
        } else {
            0
        };
        som += ruis(p * schaal, zaad + k, per) * sterk;
        gewicht += sterk;
        sterk *= 0.5;
        schaal *= 2.0;
    }
    som / gewicht
}

/// De tekens op de kop, in vakken rond het midden van de kop (y wijst naar de Speler, zoals in het
/// plaatje): ▲ ■ ● ◆ ✚ ○ voor Speler 1 tot 6. Maten uit het prototype (`TEKENS` in `src/main.js`, 0,7 keer).
fn teken_afstand(teken: usize, p: Vec2) -> f32 {
    let p = p / 0.7;
    let d = match teken % 6 {
        0 => veelhoek_afstand(
            p,
            &[
                Vec2::new(0.0, -0.3),
                Vec2::new(0.29, 0.21),
                Vec2::new(-0.29, 0.21),
            ],
        ),
        1 => doos(p, Vec2::splat(0.23)),
        2 => p.length() - 0.26,
        3 => veelhoek_afstand(
            p,
            &[
                Vec2::new(0.0, -0.32),
                Vec2::new(0.28, 0.0),
                Vec2::new(0.0, 0.32),
                Vec2::new(-0.28, 0.0),
            ],
        ),
        4 => doos(p, Vec2::new(0.3, 0.1)).min(doos(p, Vec2::new(0.1, 0.3))),
        _ => (p.length() - 0.2).abs() - 0.07,
    };
    d * 0.7
}

fn doos(p: Vec2, b: Vec2) -> f32 {
    let d = p.abs() - b;
    d.max(Vec2::ZERO).length() + d.x.max(d.y).min(0.0)
}

/// Afstand tot een bolle veelhoek: negatief binnen.
fn veelhoek_afstand(p: Vec2, v: &[Vec2]) -> f32 {
    let d = vorm::afstand_tot_rand(p, v);
    if vorm::binnen(p, v) { -d } else { d }
}

/// Een kleur 0xRRGGBB als drie getallen (sRGB, 0 tot 1).
fn rgb(k: u32) -> [f32; 3] {
    [(k >> 16) & 0xff, (k >> 8) & 0xff, k & 0xff].map(|c| c as f32 / 255.0)
}

/// Het plaatje van een Steen, van boven gezien (sRGB, RGBA, `maat` bij `maat` over `STEEN_BEREIK`):
/// de lakkleur met een lichte wolking, de bies rond de kop zoals op een lakdoos (een lijn met goud)
/// en het teken in `inkt`. De rest van de Steen (de buik) krijgt de rand van het plaatje: alleen lak.
pub fn steen(maat: u32, lak: u32, inkt: u32, teken: usize) -> Vec<u8> {
    let (lak, inkt, goud) = (rgb(lak), rgb(inkt), rgb(0xe9c36c));
    let px = 2.0 * STEEN_BEREIK / maat as f32;
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    for py in 0..maat {
        for pxl in 0..maat {
            let p = (Vec2::new(pxl as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE)
                * STEEN_BEREIK;
            // Wolking in het lak: vermenigvuldigen met 0,9 tot 1.
            let wolk = 0.9 + 0.1 * lagen(p * 9.0, 7 + teken as u32, 4, 0);
            let mut c = lak.map(|k| k * wolk);
            let bies = 0.9
                * (1.0
                    - glad(
                        0.007 - px / 2.0,
                        0.007 + px / 2.0,
                        (p.length() - 0.292).abs(),
                    ));
            let teken = (0.5 - teken_afstand(teken, p) / px).clamp(0.0, 1.0);
            for k in 0..3 {
                c[k] += (goud[k] - c[k]) * bies;
                c[k] += (inkt[k] - c[k]) * teken;
            }
            let i = ((py * maat + pxl) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[byte(c[0]), byte(c[1]), byte(c[2]), 255]);
        }
    }
    uit
}
/// De ring om het gat van de gekozen Steen, wit met een doorzichtigheid (de kleur komt uit het
/// materiaal). De textuur beslaat 1,5 vak; de ring loopt van 0,44 tot 0,60 vak van het midden (taak 235: was 0,47 tot 0,565).
pub fn ring(maat: u32) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    let (binnen, buiten) = (0.44 / 0.75, 0.60 / 0.75);
    let rand = 1.5 / maat as f32;
    for py in 0..maat {
        for px in 0..maat {
            let p = Vec2::new(px as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE;
            let r = p.length();
            let a = glad(binnen - rand, binnen + rand, r)
                * (1.0 - glad(buiten - rand, buiten + rand, r));
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[255, 255, 255, byte(a)]);
        }
    }
    uit
}

/// De textuur van de landingsschaduw beslaat een vierkant van twee keer deze maat (vakken).
pub const LANDING_BEREIK: f32 = 0.6;

/// De landingsschaduw van een gesleepte steen: een scherpe ronde schijf, wit met een doorzichtigheid
/// (de kleur komt uit het materiaal). De schijf heeft straal 0,5 vak: over het gat en het gouden
/// ringetje heen, zodat hij op het lak te zien is, met een scherpe rand.
pub fn landing(maat: u32) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    let straal = 0.5 / LANDING_BEREIK;
    let rand = 2.0 / maat as f32;
    for py in 0..maat {
        for px in 0..maat {
            let p = Vec2::new(px as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE;
            let a = 0.82 * (1.0 - glad(straal - rand, straal + rand, p.length()));
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[255, 255, 255, byte(a)]);
        }
    }
    uit
}

/// De contactschaduw onder een Steen in zijn gat: een donkere ring net buiten de Steen, zacht naar
/// binnen en naar buiten (prototype: `vlekTex("ring")`). De textuur beslaat 1,42 vak.
pub fn contact(maat: u32) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    for py in 0..maat {
        for px in 0..maat {
            let p = Vec2::new(px as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE;
            // Een verloop van 0,4 tot 1 van de halve breedte: doorzichtig, 0,95 bij 42 procent, 0,5 bij 62
            // procent en weer doorzichtig, zoals de canvas-gradient van het prototype.
            let t = ((p.length() - 0.4) / 0.6).clamp(0.0, 1.0);
            let a = if t < 0.42 {
                0.95 * t / 0.42
            } else if t < 0.62 {
                0.95 - 0.45 * (t - 0.42) / 0.2
            } else {
                0.5 * (1.0 - t) / 0.38
            };
            let a = if p.length() < 0.4 { 0.0 } else { a };
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[255, 255, 255, byte(a)]);
        }
    }
    uit
}

/// De zachte schaduw onder een opgetilde Steen: donker in het midden, zacht naar de rand
/// (prototype: `vlekTex("rond")`). De textuur beslaat 1,5 vak.
pub fn zweef(maat: u32) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    for py in 0..maat {
        for px in 0..maat {
            let p = Vec2::new(px as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE;
            let t = p.length().min(1.0);
            let a = if t < 0.45 {
                1.0 - 0.38 * t / 0.45
            } else {
                0.62 * (1.0 - t) / 0.55
            };
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[255, 255, 255, byte(a)]);
        }
    }
    uit
}

/// De schaduw van de plank op de ondergrond: donker onder de plank, zacht naar buiten.
/// De textuur beslaat een vierkant van `2 * bereik` rond het midden.
pub fn plank_schaduw(maat: u32, rand: &[Vec2], bereik: f32) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    for py in 0..maat {
        for px in 0..maat {
            let p = (Vec2::new(px as f32 + 0.5, py as f32 + 0.5) / maat as f32 * 2.0 - Vec2::ONE)
                * bereik;
            let d = vorm::afstand_tot_rand(p, rand);
            let d = if vorm::binnen(p, rand) { -d } else { d };
            let a = 0.34 * (1.0 - glad(-1.0, 2.2, d));
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[SCHADUW[0], SCHADUW[1], SCHADUW[2], byte(a)]);
        }
    }
    uit
}

fn glad(a: f32, b: f32, x: f32) -> f32 {
    let t = ((x - a) / (b - a)).clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

/// Voeg kleinere versies toe (elk half zo groot, gemiddelde van 2 bij 2 pixels),
/// achter elkaar in één lijst. Geeft de lijst en het aantal niveaus.
pub fn mipmaps(data: Vec<u8>, maat: u32) -> (Vec<u8>, u32) {
    mipmaps_rechthoek(data, maat, maat)
}

/// Als `mipmaps`, voor een plaatje van `breedte` bij `hoogte` (machten van twee).
pub fn mipmaps_rechthoek(mut data: Vec<u8>, breedte: u32, hoogte: u32) -> (Vec<u8>, u32) {
    let mut niveaus = 1;
    let mut begin = 0;
    let (mut w, mut h) = (breedte as usize, hoogte as usize);
    while w > 1 || h > 1 {
        let (w2, h2) = ((w / 2).max(1), (h / 2).max(1));
        let mut klein = vec![0u8; w2 * h2 * 4];
        for y in 0..h2 {
            for x in 0..w2 {
                for k in 0..4 {
                    let p = |xx: usize, yy: usize| {
                        data[begin + (yy.min(h - 1) * w + xx.min(w - 1)) * 4 + k] as u32
                    };
                    let som = p(2 * x, 2 * y)
                        + p(2 * x + 1, 2 * y)
                        + p(2 * x, 2 * y + 1)
                        + p(2 * x + 1, 2 * y + 1);
                    klein[(y * w2 + x) * 4 + k] = ((som + 2) / 4) as u8;
                }
            }
        }
        begin = data.len();
        data.extend(klein);
        (w, h) = (w2, h2);
        niveaus += 1;
    }
    (data, niveaus)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mipmaps_van_een_rechthoek() {
        let (data, niveaus) = mipmaps_rechthoek(vec![90; 8 * 4 * 4], 8, 4);
        assert_eq!(niveaus, 4);
        assert_eq!(data.len(), (32 + 8 + 2 + 1) * 4);
        assert!(data.iter().all(|&b| b == 90));
    }

    /// De alfa op afstand `d` (vakken) rechts van het midden, bij een textuur over `bereik` vakken.
    fn alfa(t: &[u8], maat: u32, bereik: f32, d: f32) -> u8 {
        let x = ((d / bereik + 1.0) / 2.0 * maat as f32) as u32;
        t[((maat / 2) * maat + x.min(maat - 1)) as usize * 4 + 3]
    }

    #[test]
    fn landing_is_een_scherpe_schijf_over_het_gat_en_het_ringetje() {
        let maat = 128u32;
        let r = landing(maat);
        let a = |d: f32| alfa(&r, maat, LANDING_BEREIK, d);
        assert!(a(0.0) > 190 && a(0.47) > 190, "{}", a(0.47));
        assert_eq!(a(0.56), 0);
        assert!(r.chunks(4).all(|p| p[..3] == [255, 255, 255]));
    }

    #[test]
    fn ring_om_het_gat_van_de_gekozen_steen() {
        let maat = 128u32;
        let r = ring(maat);
        let a = |d: f32| alfa(&r, maat, 0.75, d);
        assert!(a(0.52) > 240, "{}", a(0.52));
        // De ring is 0,16 vak dik (taak 235, was 0,095): ook vlak bij zijn randen nog dik genoeg om te zien.
        assert!(a(0.46) > 200 && a(0.58) > 200, "{} {}", a(0.46), a(0.58));
        // Binnen en buiten de ring niets: de ring ligt buiten de Steen en het gouden ringetje.
        assert_eq!(a(0.2), 0);
        assert_eq!(a(0.41), 0);
        assert_eq!(a(0.64), 0);
        assert!(r.chunks(4).all(|p| p[..3] == [255, 255, 255]));
    }

    #[test]
    fn contactschaduw_is_een_ring_net_buiten_de_steen() {
        let maat = 128u32;
        let c = contact(maat);
        let a = |d: f32| alfa(&c, maat, 0.71, d);
        assert_eq!(a(0.1), 0);
        assert!(a(0.46) > 200, "{}", a(0.46));
        assert!(a(0.46) > a(0.6) && a(0.6) > a(0.69));
    }

    #[test]
    fn de_kop_van_een_steen_heeft_lak_een_gouden_bies_en_het_teken() {
        let maat = 128u32;
        let lak = 0xbb3511;
        for teken in 0..6 {
            let t = steen(maat, lak, 0xfff3dc, teken);
            let px = |p: Vec2| {
                let q = (p / STEEN_BEREIK + Vec2::ONE) / 2.0 * maat as f32;
                let i =
                    ((q.y as u32).min(maat - 1) * maat + (q.x as u32).min(maat - 1)) as usize * 4;
                [t[i], t[i + 1], t[i + 2]]
            };
            // De bies is goud, de rand van het plaatje lak.
            assert!(px(Vec2::new(0.292, 0.0))[1] > 150, "{teken}");
            let r = px(Vec2::new(0.42, 0.42));
            assert!(r[0] > 140 && r[1] < 70, "{teken}: {r:?}");
            // Het teken is licht (de inkt) in het midden, behalve bij de ring (○): daar is het midden lak.
            let midden = px(Vec2::new(0.0, 0.02));
            if teken == 5 {
                assert!(midden[1] < 70, "{midden:?}");
                assert!(px(Vec2::new(0.14, 0.0))[1] > 200);
            } else {
                assert!(midden[1] > 200, "{teken}: {midden:?}");
            }
        }
        // De driehoek wijst van de Speler af (naar -y in het plaatje).
        let t = steen(maat, lak, 0xfff3dc, 0);
        let rij = |y: f32| {
            let py = ((y / STEEN_BEREIK + 1.0) / 2.0 * maat as f32) as u32;
            (0..maat)
                .filter(|x| t[((py * maat + x) * 4 + 1) as usize] > 200)
                .count()
        };
        assert!(rij(-0.15) < rij(0.1));
    }
}
