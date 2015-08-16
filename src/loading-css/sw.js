var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

function isCssRequest(request) {
    return /css\/main-/.test(request.url);
}

self.addEventListener('fetch', function(event) {
    // If this is a request for our main CSS file
    if (isCssRequest(event.request)) {
        caches.open(cacheName).then(function(cache) {
            // Respond with cached copy or fetch new version
            event.respondWith(
                cache.match(event.request).then(function(response) {
                    return response || fetch(event.request).then(function(response) {
                        // Was a new version so invalidate all old copies
                        cache.keys().then(function(keys){
                            keys.filter(isCssRequest).forEach(function(request){
                                cache.delete(request);
                            });
                        });
                        // Cache new copy
                        if(response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                })
            );
        });
    }
});
