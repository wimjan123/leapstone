// Een tekening in één kleur die altijd bovenop komt: de ring om de gekozen steen (taak 168).
// De doorzichtigheid komt uit de textuur; de kleur uit het materiaal (lineair, de inkt van het ontwerp).
import bevy_pbr::render::forward_io::VertexOutput;

struct Overlay {
    // Kleur (lineair); a: hoe sterk.
    kleur: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> overlay: Overlay;
@group(constants::MATERIAL_BIND_GROUP) @binding(1) var tekening: texture_2d<f32>;
@group(constants::MATERIAL_BIND_GROUP) @binding(2) var tekening_sampler: sampler;

struct Uit {
    @location(0) kleur: vec4<f32>,
    // Taak 190: boven het bord en de Stenen (die liggen nooit dichterbij dan 0,4), onder de voorwerpen (vanaf 0,5).
    @builtin(frag_depth) diepte: f32,
}

@fragment
fn fragment(in: VertexOutput) -> Uit {
    let a = textureSample(tekening, tekening_sampler, in.uv).a;
    var uit: Uit;
    uit.kleur = vec4<f32>(overlay.kleur.rgb, a * overlay.kleur.a);
    uit.diepte = 0.49;
    return uit;
}
