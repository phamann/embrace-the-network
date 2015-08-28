if (window.Worker) {
    var fetchWorker = new Worker("js/worker.js");
    var el = document.querySelector('.events');
    var input = document.querySelector('.user-input');

    fetchWorker.onmessage = function(events) {
        var frag = document.createDocumentFragment();

        events.data.forEach(function(event) {
            var li = document.createElement("li");
            li.textContent = event;
            frag.appendChild(li);
        });

        el.appendChild(frag);
    };

    input.addEventListener('input', function(event){
        fetchWorker.postMessage(input.value);
    });
}
