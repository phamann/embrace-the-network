var version = 1;

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

importScripts('js/circuit-breaker.js');

var circuitBreakers = {};
var options = {
    windowDuraion: 1000,
    numBucket: 1,
    timeoutDuration: 3000,
    errorThreshold: 50,
    volumeThrehold: 1
};

CircuitBreaker.prototype.fetch = function(request) {
    var msg = 'Service unavailable: circuit broken.';
    var unavailableResponse = new Response(msg, {
        status: 503,
        statusText: msg
    });

    return new Promise(function(resolve, reject){
        this.run(function(success, fail) {
            fetch(request).then(function(response) {
                if(response.status < 400) {
                    success();
                } else {
                    fail();
                }
                resolve(response);
            })
            .catch(function(err) {
                fail();
                reject(unavailableResponse);
            });
        }, function() {
            resolve(unavailableResponse);
        });
    }.bind(this));
};

self.addEventListener('fetch', function(event) {
    var url = event.request.url;

    if(!circuitBreakers[url]) {
        circuitBreakers[url] = new CircuitBreaker(options);
    }

    event.respondWith(
        circuitBreakers[url].fetch(event.request)
    );
});
