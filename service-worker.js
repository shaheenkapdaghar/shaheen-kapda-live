/* Shaheen Kapda Ghar -- v6. Keep logo and manifest fetches out of the service-worker cache.
   This prevents outdated cached HTML from being served in place of missing PNGs.
   Catalogue uses network-first. Browsed product images can work offline. */
const VERSION = 'skg-v6-icon-check-20261009';
const SHELL_CACHE = VERSION + '-shell';
const CATALOG_CACHE = VERSION + '-catalogue';
const IMAGE_CACHE = VERSION + '-images';
const SHELL_FILES = ['/', '/index.html', '/styles.css'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Cache only existing same-origin shell files; never cache missing-asset HTML as an image.
    await Promise.allSettled(SHELL_FILES.map(async path => {
      const response = await fetch(path, { cache: 'reload' });
      const type = response.headers.get('content-type') || '';
      if (response.ok && ((path.endsWith('.css') && type.includes('css')) ||
          (!path.endsWith('.css') && type.includes('html')))) {
        await cache.put(path, response);
      }
    }));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('skg-') && !n.startsWith(VERSION)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

async function networkFirst(req, cacheName, key) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) await cache.put(key || req, res.clone());
    return res;
  } catch (e) {
    const result = await cache.match(key || req);
    return result || Response.error();
  }
}
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin) {
    // IMPORTANT: never intercept manifest, favicons or logo images.
    // These are direct server fetches so a missing deployment remains detectable.
    if(url.pathname.endsWith('.png') || url.pathname.endsWith('.ico') ||
       url.pathname.endsWith('.webmanifest') || url.pathname==='/icon-check.html') return;
    if(url.pathname==='/products.json') {
      event.respondWith(networkFirst(req,CATALOG_CACHE,'/products.json'));
      return;
    }
    if(req.mode==='navigate') {
      event.respondWith((async()=>{
        try {
          const r=await fetch(req);
          if(r.ok && (r.headers.get('content-type')||'').includes('html')) {
            (await caches.open(SHELL_CACHE)).put('/index.html',r.clone());
          }
          return r;
        } catch(_) {
          return (await caches.open(SHELL_CACHE)).match('/index.html') ||
            new Response('<h1>Offline</h1><p>Please connect to the internet to open Shaheen Kapda Ghar.</p>',
              {headers:{'Content-Type':'text/html; charset=utf-8'}});
        }
      })());
      return;
    }
    if(url.pathname==='/styles.css') {
      event.respondWith(networkFirst(req,SHELL_CACHE,'/styles.css'));
      return;
    }
  }
  if(req.destination==='image' && url.origin!==self.location.origin && url.protocol==='https:') {
    event.respondWith((async()=>{
      const cache=await caches.open(IMAGE_CACHE);
      const cached=await cache.match(req); if(cached) return cached;
      try {
        const r=await fetch(req);
        if(r.ok || r.type==='opaque') {
          cache.put(req,r.clone());
          const keys=await cache.keys(); if(keys.length>40) await cache.delete(keys[0]);
        }
        return r;
      } catch(_) {return Response.error();}
    })());
  }
});
