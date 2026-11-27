// Makes the wood texture for the board, src/assets/hout.webp. Run: npm run hout
// Generated locally with noise, so the app needs no image from elsewhere.
// The grain runs horizontally; Bord.svelte rotates and tints it per board part.
import sharp from "sharp";

const SIZE = 1024;

// Value noise with a fixed seed: the texture is the same on every run.
function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}
function fbm(x, y, octaves) {
  let sum = 0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x, y);
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return sum;
}
const smooth = (a, b, t) => fade(Math.min(1, Math.max(0, (t - a) / (b - a))));

const light = [226, 176, 116];
const dark = [138, 80, 38];
const data = Buffer.alloc(SIZE * SIZE * 3);

for (let py = 0; py < SIZE; py++) {
  for (let px = 0; px < SIZE; px++) {
    const x = px / SIZE;
    const y = py / SIZE;
    // Growth rings: wavy bands along the grain, with a sharp dark edge (latewood).
    const warp = fbm(x * 0.9 + 3, y * 2.4, 4);
    const rings = y * 15 + warp * 1.3 + fbm(x * 0.5 + 11, y * 0.6, 2) * 1.2;
    const ring = rings - Math.floor(rings);
    const late = smooth(0.7, 0.93, ring) * (1 - smooth(0.94, 1, ring));
    // Fine fibres: long thin streaks along the grain.
    const fibres = fbm(x * 3 + 7, y * 420, 3);
    const streaks = fbm(x * 0.9, y * 90 + 4, 3);
    // Pores: tiny dark dashes.
    const pore = noise(x * 34, y * 1400) > 0.74 ? 1 : 0;
    // Slow colour change over the board.
    const figure = fbm(x * 1.3 + 21, y * 2.2 + 5, 3);

    let t = 0.36 + 0.3 * late + 0.22 * fibres + 0.24 * streaks + 0.2 * figure + 0.1 * pore;
    t = Math.min(1, Math.max(0, t));
    const i = (py * SIZE + px) * 3;
    for (let k = 0; k < 3; k++) data[i + k] = Math.round(light[k] + (dark[k] - light[k]) * t);
  }
}

await sharp(data, { raw: { width: SIZE, height: SIZE, channels: 3 } })
  .webp({ quality: 80 })
  .toFile(new URL("../src/assets/hout.webp", import.meta.url).pathname);
