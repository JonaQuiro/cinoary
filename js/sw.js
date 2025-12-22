self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("tabu-v1").then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                "./style/style.css",
                "./js/script.js",
                "./js/cartas.js"
            ]);
        })
    );
});
