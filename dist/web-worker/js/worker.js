importScripts('es6-promise.js', 'fetch.js');

onmessage = function(msg) {
    var user = msg.data;
    var url = 'https://api.github.com/users/' + user + '/received_events';
    var lastWeek = Date.now() - 604800000;

    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            return data.map(function(event){
                event.created_at = new Date(event.created_at).getTime();
                return event;
            })
            .filter(function(event) {
                return event.created_at > lastWeek && event.payload.commits;
            })
            .map(function(event){
                var user = event.actor.login;
                var message = event.payload.commits[0].message;
                return user + ': ' + message;
            });
        })
        .then(postMessage);
}
