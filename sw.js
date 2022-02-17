const staticCacheName = "site-static"
const assets = [
  "/",
  "/index.html",
  "/js/metronome.js",
  "/js/app.js",
  "/style.css",
  "/snd/clave.mp3",
  "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400&display=swap",
]

// install event
self.addEventListener("install", evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets")
      cache.addAll(assets)
    })
  )
})

// activate event
self.addEventListener("activate", evt => {
  console.log('service worker activated');
})

// fetch event
self.addEventListener("fetch", evt => {
  // console.log('fetch event', evt);
})
