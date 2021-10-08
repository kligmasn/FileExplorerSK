window.addEventListener('DOMContentLoaded', (event) => {
    const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const socketUrl = socketProtocol + '//' + window.location.hostname + ':3000/watch' //Web socket listens on server port 3000 on '/watch' path
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (msg) => {
        if (msg.data == "reload") {
            location.reload(); //Reload the browser window to get html updates from server
        }
    }

    var btns = document.getElementsByTagName('button');
    for(var x = 0; btns.length; x++) {
        btns[x].addEventListener("click", (e) => {
            if(e.target.parentElement) {
                var siblings = getAllSiblings(e.target, e.target.parentElement);
                for (var y = 0; y < siblings.length; y++) {
                    if (siblings[y].style.display == 'none') { 
                        siblings[y].style.display = 'block';
                    } else {
                        siblings[y].style.display = 'none';
                    }
                }
            }
        })
    }

    //Get all elements with the same parent of the element passed in (excluding the element itself) 
    function getAllSiblings(element, parent) {
        const children = [...parent.children];
        return children.filter(child => child !== element);
    }
});


