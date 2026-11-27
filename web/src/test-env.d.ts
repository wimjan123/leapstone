// Klein stukje Node dat de tests nodig hebben om het WebAssembly-bestand of een bronbestand (tekst) te lezen.
declare module "node:fs" {
  export function readFileSync(path: string): Uint8Array;
  export function readFileSync(path: string, codering: "utf8"): string;
}
declare module "node:path" {
  const path: { join(...delen: string[]): string };
  export default path;
}
declare const process: { cwd(): string };
