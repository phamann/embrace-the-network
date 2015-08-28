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

CircuitBreaker.prototype.fetch = function(request) {
    var unavailableResponse = Response.error();

    return new Promise(function(resolve, reject) {
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

var circuitBreakers = {};
var options = {
    windowDuraion: 1000,
    timeoutDuration: 3000,
    errorThreshold: 50,
    volumeThrehold: 2
};

self.addEventListener('fetch', function(event) {
    var url = event.request.url;

    if(!circuitBreakers[url]) {
        circuitBreakers[url] = new CircuitBreaker(options);
    }

    event.respondWith(circuitBreakers[url].fetch(event.request));
});
