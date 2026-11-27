//! Meetkunde in het platte vlak, voor de vormen van het bord (`lak.rs`) en de texturen: normalen van
//! een lijn, knippen van een veelhoek, en of een punt binnen een veelhoek ligt.

use glam::Vec2;

/// De normaal van elk punt van een lijn: het gemiddelde van de twee stukjes ernaast.
/// `links`: de normaal wijst links van de looprichting (anders rechts).
pub fn lijn_normalen(p: &[Vec2], links: bool) -> Vec<Vec2> {
    let teken = if links { 1.0 } else { -1.0 };
    let stuk = |a: Vec2, b: Vec2| {
        let d = (b - a).normalize_or_zero();
        Vec2::new(-d.y, d.x) * teken
    };
    (0..p.len())
        .map(|i| {
            let voor = if i > 0 {
                stuk(p[i - 1], p[i])
            } else {
                Vec2::ZERO
            };
            let na = if i + 1 < p.len() {
                stuk(p[i], p[i + 1])
            } else {
                Vec2::ZERO
            };
            (voor + na).normalize_or(Vec2::Y)
        })
        .collect()
}

/// Knip een bolle veelhoek af op een andere bolle veelhoek (Sutherland-Hodgman).
pub(crate) fn knip(veelhoek: &[Vec2], mes: &[Vec2]) -> Vec<Vec2> {
    let mut uit = veelhoek.to_vec();
    let draai = if kruis(mes[1] - mes[0], mes[2] - mes[1]) > 0.0 {
        1.0
    } else {
        -1.0
    };
    for i in 0..mes.len() {
        let (a, b) = (mes[i], mes[(i + 1) % mes.len()]);
        let binnen = |p: Vec2| kruis(b - a, p - a) * draai >= 0.0;
        let vorig = std::mem::take(&mut uit);
        for k in 0..vorig.len() {
            let (p, q) = (vorig[k], vorig[(k + 1) % vorig.len()]);
            if binnen(p) {
                uit.push(p);
            }
            if binnen(p) != binnen(q) {
                // Ligt de zijde (bijna) langs het mes, dan kan t door afronding buiten 0 tot 1 vallen.
                let t = (kruis(b - a, a - p) / kruis(b - a, q - p)).clamp(0.0, 1.0);
                uit.push(p + (q - p) * t);
            }
        }
        if uit.is_empty() {
            break;
        }
    }
    uit
}

fn kruis(a: Vec2, b: Vec2) -> f32 {
    a.x * b.y - a.y * b.x
}

/// Ligt `p` binnen de veelhoek?
pub fn binnen(p: Vec2, veelhoek: &[Vec2]) -> bool {
    let n = veelhoek.len();
    let mut binnen = false;
    for i in 0..n {
        let (a, b) = (veelhoek[i], veelhoek[(i + 1) % n]);
        if (a.y > p.y) != (b.y > p.y) && p.x < a.x + (p.y - a.y) / (b.y - a.y) * (b.x - a.x) {
            binnen = !binnen;
        }
    }
    binnen
}

/// Afstand van `p` tot de rand van een veelhoek.
pub fn afstand_tot_rand(p: Vec2, veelhoek: &[Vec2]) -> f32 {
    let n = veelhoek.len();
    (0..n)
        .map(|i| {
            let (a, b) = (veelhoek[i], veelhoek[(i + 1) % n]);
            let t = ((p - a).dot(b - a) / (b - a).length_squared()).clamp(0.0, 1.0);
            p.distance(a + (b - a) * t)
        })
        .fold(f32::MAX, f32::min)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn vierkant(r: f32) -> Vec<Vec2> {
        vec![
            Vec2::new(-r, -r),
            Vec2::new(r, -r),
            Vec2::new(r, r),
            Vec2::new(-r, r),
        ]
    }

    #[test]
    fn knippen_houdt_het_stuk_binnen_het_mes() {
        let stuk = knip(
            &vierkant(1.0),
            &vierkant(0.5)
                .iter()
                .map(|p| *p + Vec2::splat(0.5))
                .collect::<Vec<_>>(),
        );
        assert_eq!(stuk.len(), 4);
        for p in &stuk {
            assert!(
                p.x >= -1e-5 && p.y >= -1e-5 && p.x <= 1.0 + 1e-5 && p.y <= 1.0 + 1e-5,
                "{p}"
            );
        }
        assert!(
            knip(
                &vierkant(1.0),
                &vierkant(0.5)
                    .iter()
                    .map(|p| *p + Vec2::splat(5.0))
                    .collect::<Vec<_>>()
            )
            .is_empty()
        );
    }

    #[test]
    fn binnen_en_afstand_tot_de_rand() {
        let v = vierkant(1.0);
        assert!(binnen(Vec2::ZERO, &v));
        assert!(!binnen(Vec2::new(1.5, 0.0), &v));
        assert!((afstand_tot_rand(Vec2::new(0.25, 0.0), &v) - 0.75).abs() < 1e-5);
    }

    #[test]
    fn normalen_van_een_lijn_staan_er_loodrecht_op() {
        let n = lijn_normalen(&[Vec2::ZERO, Vec2::X, Vec2::new(2.0, 0.0)], true);
        assert!(n.iter().all(|n| (*n - Vec2::Y).length() < 1e-5));
    }
}
