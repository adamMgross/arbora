const CACHE_NAME = 'arbora-v1';

const PRECACHE_URLS = [
    'today.html',
    'index.html',
    'cosmology.html',
    'principles.html',
    'practices.html',
    'rituals.html',
    'canon.html',
    'canon-philosophy.html',
    'canon-stoics.html',
    'canon-fragments.html',
    'canon-daoism.html',
    'canon-buddhism.html',
    'canon-jewish-wisdom.html',
    'canon-mystics.html',
    'canon-poetry.html',
    'canon-prayers.html',
    'canon-ancestral.html',
    'canon-science.html',
    'canon-companions.html',
    'tree.html',
    'src/css/style.css',
    'src/js/main.js',
    'favicon.svg',
    'manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE_URLS);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    // Use network-first for Google Fonts (always want fresh)
    if (event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('fonts.gstatic.com')) {
        event.respondWith(
            fetch(event.request).catch(function() {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Cache-first for everything else
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            return cached || fetch(event.request).then(function(response) {
                // Cache successful GET responses
                if (response.ok && event.request.method === 'GET') {
                    var responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            });
        })
    );
});
