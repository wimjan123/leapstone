// De vaste laag (taak 190): de tafel en de voorwerpen tekenen met de vaste camera van het overzicht, het bord met de camera
// die zoomt. Eén tekenpas: de diepte is in lagen verdeeld (tafel achter, bord in het midden, voorwerpen voor), zodat de
// voorwerpen boven het ingezoomde bord liggen. Licht en schaduw rekenen in de wereld, zoals altijd: de lamp, de
// schaduwkaart en de plek van elk voorwerp veranderen niet bij zoomen. Alleen de kijkrichting (glans, spiegeling) komt
// van de vaste camera, anders zou de glans op de voorwerpen meebewegen met het zoomen.
import bevy_pbr::render::{
    mesh_functions,
    forward_io::{Vertex, VertexOutput, FragmentOutput, decompress_vertex},
    pbr_fragment::pbr_input_from_standard_material,
    pbr_functions::{alpha_discard, apply_pbr_lighting, main_pass_post_lighting_processing},
    pbr_types::STANDARD_MATERIAL_FLAGS_UNLIT_BIT,
};

@group(constants::MATERIAL_BIND_GROUP) @binding(100) var<uniform> vast_klem: mat4x4<f32>;
@group(constants::MATERIAL_BIND_GROUP) @binding(101) var<uniform> vast_oog: vec4<f32>;
@group(constants::MATERIAL_BIND_GROUP) @binding(102) var<uniform> vast_diepte: vec4<f32>;

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);

@if(VERTEX_NORMALS)
    out.world_normal = mesh_functions::mesh_normal_local_to_world(vertex.normal, vertex_in.instance_index);

@if(VERTEX_POSITIONS)
    out.world_position = mesh_functions::mesh_position_local_to_world(world_from_local, vec4<f32>(vertex.position, 1.0));
@if(VERTEX_POSITIONS)
    {
        var klem = vast_klem * vec4<f32>(out.world_position.xyz, 1.0);
        // Diepte in een eigen laag: z/w wordt diepte.x * z/w + diepte.y.
        klem.z = klem.z * vast_diepte.x + klem.w * vast_diepte.y;
        out.position = klem;
    }

@if(VERTEX_UVS_A)
    out.uv = vertex.uv;
@if(VERTEX_UVS_B)
    out.uv_b = vertex.uv_b;

@if(VERTEX_TANGENTS)
    out.world_tangent = mesh_functions::mesh_tangent_local_to_world(world_from_local, vertex.tangent, vertex_in.instance_index);

@if(VERTEX_COLORS)
    out.color = vertex.color;

@if(VERTEX_OUTPUT_INSTANCE_INDEX)
    out.instance_index = vertex_in.instance_index;

    return out;
}

@fragment
fn fragment(in: VertexOutput, @builtin(front_facing) is_front: bool) -> FragmentOutput {
    var pbr_input = pbr_input_from_standard_material(in, is_front);
    pbr_input.material.base_color = alpha_discard(
        pbr_input.material.flags,
        pbr_input.material.alpha_cutoff,
        pbr_input.material.base_color
    );
    // Kijken vanaf de vaste camera.
    pbr_input.V = normalize(vast_oog.xyz - in.world_position.xyz);

    var out: FragmentOutput;
    if (pbr_input.material.flags & STANDARD_MATERIAL_FLAGS_UNLIT_BIT) == 0u {
        out.color = apply_pbr_lighting(pbr_input);
    } else {
        out.color = pbr_input.material.base_color;
    }
    out.color = main_pass_post_lighting_processing(pbr_input, out.color);
    return out;
}
