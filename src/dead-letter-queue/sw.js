var version = 1;
var expiration = 86400000;
var queue = {};

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

function replayQueuedRequests() {
    Object.keys(queue).forEach(function(event) {
        fetch(queue[event]).then(function(){
            if(response.status >= 500) {
                return Response.error();
            }

            delete queue[error];
        }).catch(function() {
            var timeDelta = Date.now() - event;
            if (timeDelta > expiration) {
                delete queue[error];
            }
        });
    });
}

function queueFailedRequest(request) {
    queue[Date.now()] = request.url;
}

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(response){
            if(response.status >= 500) {
                return Response.error();
            } else {
                return response;
            }
        }).catch(function() {
            queueFailedRequest(event.request);
        })
    );
});
