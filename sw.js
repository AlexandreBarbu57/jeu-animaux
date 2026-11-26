// Garde le jeu sur l'appareil pour qu'il marche sans internet.
const CACHE = "animaux-20261126203312";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./cochon.wav", "./sons/abeille.wav", "./sons/baleine.wav", "./sons/canard.wav", "./sons/chat.wav", "./sons/cheval.wav", "./sons/chevre.wav", "./sons/chien.wav", "./sons/cochon.wav", "./sons/dauphin.wav", "./sons/elephant.wav", "./sons/grenouille.wav", "./sons/hibou.wav", "./sons/lion.wav", "./sons/mouton.wav", "./sons/ours.wav", "./sons/pingouin.wav", "./sons/poule.wav", "./sons/renard.wav", "./sons/singe.wav", "./sons/tigre.wav", "./sons/vache.wav", "./sons/zebre.wav"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// On sert la copie gardée tout de suite, et on la met à jour en arrière-plan quand il y a du réseau.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => {
      if (r && (r.ok || r.type === "opaque")) cache.put(e.request, r.clone());
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
