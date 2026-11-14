/* Service worker : rend l'application disponible hors ligne.
   « Réseau d'abord », sans cache HTTP : en ligne, on prend TOUJOURS la dernière version publiée ;
   hors ligne, on sert la copie gardée. Aucune donnée personnelle ne passe ici. */
const CACHE = 'suivi-coaching-2.5.0';   // à changer à chaque publication : force la mise à jour chez tout le monde
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './arch.html', './carnet-demo.json', './carnet-demo-en.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const nav = r.mode === 'navigate';
  e.respondWith(
    // redirect:'manual' pour les pages : si l'adresse du site change (redirection), le navigateur suit la redirection au lieu d'afficher une erreur
    fetch(r.url, { cache: 'no-store', credentials: 'same-origin', redirect: nav ? 'manual' : 'follow' })
      .then(res => { if (res.type === 'opaqueredirect') return res; if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('./index.html')))
  );
});
