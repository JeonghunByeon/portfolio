/* coi-serviceworker — adds Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy
   headers so SharedArrayBuffer (required by Emscripten pthread builds) works on
   static hosts like GitHub Pages that cannot set custom HTTP headers.
   Based on https://github.com/gzuidhof/coi-serviceworker (MIT License) */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

async function handleFetch(request) {
    if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;
    let response;
    try {
        response = await fetch(request);
    } catch (e) {
        console.error("[coi-sw] fetch failed:", e);
        throw e;
    }
    if (response.status === 0) return response;
    const headers = new Headers(response.headers);
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

self.addEventListener("fetch", (e) => e.respondWith(handleFetch(e.request)));
