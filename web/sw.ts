/// <reference lib="webworker" />
// Eigen service worker: offline spelen (precache, ook .wasm) en Meldingen via web push.
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
self.addEventListener("activate", () => self.clients.claim());

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
// Alleen het spel (/play/, een Uitnodiging, een Potje) geeft de app offline; / is de Landingspagina en komt van het netwerk.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("play/index.html"), {
    allowlist: [/^\/play(\/|$)/, /^\/uitnodiging\//, /^\/potje\//],
    denylist: [/^\/api\//],
  }),
);
// Het 3D-bord (groot, ongeveer 3 MB gecomprimeerd) zit niet in de precache: dan zou de eerste
// installatie hem twee keer downloaden. Hij komt in een eigen cache zodra de app hem laadt; de naam
// verandert bij elke nieuwe versie, dus wat in de cache zit, klopt altijd. Daarna werkt hij ook offline.
// Zijn plaatjes (`src/bord3d/halma_bord3d-*`, taak 177) en het geperste bestand `halma_bord3d_bg-*.wasm.xz` (src/wasmGeperst.ts) gaan in dezelfde cache.
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.includes("/assets/halma_bord3d"),
  new CacheFirst({ cacheName: "bord3d", plugins: [new ExpirationPlugin({ maxEntries: 40 })] }),
);

type Inhoud = { titel?: string; tekst?: string; url?: string };

function leesInhoud(event: PushEvent): Inhoud {
  try {
    return event.data?.json() ?? {};
  } catch {
    return { tekst: event.data?.text() };
  }
}

self.addEventListener("push", (event) => {
  const { titel, tekst, url } = leesInhoud(event);
  const doel = url && url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\") ? url : "/play/";
  event.waitUntil(
    self.registration.showNotification(titel || "Leapstone", {
      body: tekst ?? "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      // Per Potje één Melding: een nieuwe vervangt de oude.
      tag: doel,
      data: { url: doel },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const doel = new URL(event.notification.data?.url ?? "/play/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const vensters = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = vensters.find((v) => new URL(v.url).origin === self.location.origin);
      if (open) {
        await open.focus();
        if (open.url !== doel) await open.navigate(doel);
      } else {
        await self.clients.openWindow(doel);
      }
    })(),
  );
});
