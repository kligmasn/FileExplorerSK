window.addEventListener('DOMContentLoaded', (event) => {
    const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const echoSocketUrl = socketProtocol + '//' + window.location.hostname + ':3000/watch'
    const socket = new WebSocket(echoSocketUrl);

    socket.onmessage = (msg) => {
        if (msg.data == "reload") {
            location.reload();
        }
        console.log("socket connected");
        console.log(msg);
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


    function getAllSiblings(element, parent) {
        const children = [...parent.children];
        return children.filter(child => child !== element);
    }

    
})


