const express = require('express')
const app = express()
const expressWs = require('express-ws')(app);
const path = require('path')
const os = require('os');
const fs = require('fs')
const { fdir } = require("fdir");

const port = 3000;

const args = process.argv.slice(2);

//Check if any path arguments are invalid 
for (let x = 0; x < args.length; x++) {
    //Converts linux home directory symbol to platform agnostic
    if (args[x].includes('~')) { 
        args[x] = args[x].replace('~', os.homedir());
    }

    if (!fs.existsSync(args[x])) {
        console.log(args[x] + " path entered doesn't exist.")
        return;
    }
}


app.use(express.static(path.join(__dirname, '//')))

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Expires', new Date().toUTCString())

    var mainPromises = main(args);

    //Resolve array of promises sequentially to build html string response
    mainPromises.reduce(function(cur, next) {
        return cur.then(next);
    }, Promise.resolve()).then(function() {
        endHTML();
        res.setHeader('Content-Length', html.length);
        res.send(html);
    });

}).listen(port, () => console.log('App listening'));

//Create server path for a websocket to send messages to client if files change in path arguments
app.ws('/watch', function(ws, req) {
    args.forEach((arg, index) => {
        fs.watch(arg, {recursive: true}, (eventType, fileName) => {
            ws.send("reload");
        });
    });
})

function main(args) {
    startHTML();
    var dirPromises = [];

    args.forEach((arg, index) => {
        var fileList = new fdir().withFullPaths().withDirs().crawl(arg).sync();

        //Add more info to each file found
        var detailedFileList = fileList.map((val) => {
            return {
                name: val.split('\\').slice(-1)[0], //Name of file without full path
                dir: fs.statSync(val).isDirectory(), //If file is a directory
                level: val.split('\\').length //Level of file (Subdirectories increase file level by 1) (root path has lowest level)
            }
        });
    
        var dirPromise = function() { 
            return new Promise((res, rej) => {
                (function walk(itemIndex, currentLevel) {
                    if(itemIndex == 1) {
                        createItem(true, arg); //Create root path div and button
                    }
                    const startIndex = itemIndex;
                    for(var x = itemIndex; x < detailedFileList.length; x++) {
                        if (detailedFileList[x].dir == true && detailedFileList[x].level == currentLevel){ //If item is a directory on the current level being traversed
                            createItem(true, detailedFileList[x].name)
                            x = walk(x + 1, detailedFileList[x].level + 1) 
                        } 
                        else if (detailedFileList[x].level == currentLevel) { //If item is a file on the current level being traversed
                            createItem(false, detailedFileList[x].name)
                        }
                        else if (startIndex != 1) { //End the directory
                            html += '</div>'
                            return x;
                        }
                    }
            
                    if (startIndex == 1) { //If end of initial walk function call: end root html div, end current directory div, and resolve the promise 
                        html += "</div></div>";
                        res();
                    }
                })(1, detailedFileList[1].level);
            });
        };
        dirPromises.push(dirPromise);
    });
    return dirPromises;
}

function createItem(directory, name) {
    if(directory) {
        html += "<div><button class='directory'>" + name + "</button>"
    } else {
        html += "<div class='file'>" + name + "</div>"
    }
}

function startHTML() {
    html = 
    `<html>
    <head>
        <link rel="stylesheet" href="index.css">
    </head>
    <body>`;
}

function endHTML() {
    html += 
        `<script src="index.js"></script>
        </body>
        </html>
        `;
}
