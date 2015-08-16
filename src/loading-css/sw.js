var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Service worker installed');
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
    console.log('Service worker activated');
});

function isMainCSS(request) {
    return /css\/main-/.test(request.url);
}

self.addEventListener('fetch', function(event) {
    // If this is a request for our main  CSS file.
    if (isMainCSS(event.request)) {
        console.log('Request for main CSS file.');
        caches.open(cacheName).then(function(cache) {
            // Respond with cached copy or fetch new version
            event.respondWith(
                cache.match(event.request).then(function(response) {
                    console.log((response) ? 'Cache hit!' : 'Cache miss!');
                    return response || fetch(event.request).then(function(response) {
                        // Was a new version so invalidate all copies
                        cache.keys().then(function(keys){
                            keys.filter(isMainCSS).forEach(function(request){
                                console.log('Deleting old cached version: ' + request.url);
                                cache.delete(request);
                            });
                        });
                        // Cache new copy
                        cache.put(event.request, response.clone()).then(function(){
                            console.log('Cached new version: ' + event.request.url);
                        });
                        return response;
                    });
                })
            );
        });
    }
});
