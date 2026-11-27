import { expect, test } from "vitest";
import landing from "../landing/index.html?raw";
import headers from "../public/_headers?raw";

test("de CSP van de Landingspagina bevat de hash van haar inline script", async () => {
  const scripts = landing.match(/<script>[\s\S]*?<\/script>/g) ?? [];
  expect(scripts).toHaveLength(1);
  const tekst = (scripts[0] ?? "").slice("<script>".length, -"</script>".length);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
  const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
  expect(headers).toContain(`'sha256-${hash}'`);
});
