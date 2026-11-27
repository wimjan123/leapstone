/** Uitnodigingslinks in de native app: een App Link opent de app, dan gaan we naar het Uitnodiging-scherm. */
import { codeUitPad } from "./online";

/** Het pad (/uitnodiging/<code>) uit een geopende link, of null als de link niet van ons is. */
export function uitnodigingPadUitLink(link: string): string | null {
  try {
    const pad = new URL(link).pathname;
    return codeUitPad(pad) !== null ? pad : null;
  } catch {
    return null;
  }
}

/** Zet de adresbalk van de webview op de Uitnodiging, zodat de app hem zoals in de web-app opent. */
export async function leesStartLink(): Promise<void> {
  const { getCurrent, onOpenUrl } = await import("@tauri-apps/plugin-deep-link");
  const ga = (links: string[] | null | undefined) => {
    const pad = links?.map(uitnodigingPadUitLink).find((p) => p !== null);
    if (!pad) return false;
    history.replaceState(null, "", pad);
    return true;
  };
  ga(await getCurrent().catch(() => null));
  // De app draait al en krijgt een link: opnieuw laden zodat hij het scherm van de Uitnodiging opent.
  await onOpenUrl((links) => {
    if (ga(links)) location.reload();
  });
}
