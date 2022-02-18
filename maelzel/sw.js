const staticCacheName = "site-static"
const assets = [
  "/maelzel/",
  "/maelzel/index.html",
  "/maelzel/js/metronome.js",
  "/maelzel/js/app.js",
  "/maelzel/style.css",
  "/maelzel/snd/clave.mp3",
  "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400&display=swap",
  "https://fonts.gstatic.com/s/rubik/v18/iJWKBXyIfDnIV7nMrXyi0A.woff2",
  "https://fonts.gstatic.com/s/rubik/v18/iJWKBXyIfDnIV7nBrXw.woff2",
]

// install event
self.addEventListener("install", evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets")
      return cache.addAll(assets)
    })
  )
})

// activate event
self.addEventListener("activate", evt => {
  console.log("service worker activated")
})

// fetch event
self.addEventListener("fetch", evt => {
  console.log("fetch event", evt.request.url)
  evt.respondWith(
    caches.match(evt.request).then(cachedResponse => {
      return cachedResponse || fetch(evt.request)
    })
  )
})
