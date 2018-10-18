const hlt = require('./hlt');
const { Direction } = require('./hlt/positionals');
const logging = require('./hlt/logging');
const http = require('http');
const querystring = require('querystring');

const game = new hlt.Game();
game.initialize().then(async () => {
    // At this point "game" variable is populated with initial map data.
    // This is a good place to do computationally expensive start-up pre-processing.
    // As soon as you call "ready" function below, the 2 second per turn timer will start.
    await game.ready('MyJavaScriptBot');

    logging.info(`My Player ID is ${game.myId}.`);

    while (true) {
        await game.updateFrame();

        const { gameMap, me } = game;


        const postData = JSON.stringify({
            'game': game,
        });

        const postOptions = {
            host: "localhost",
            path: "/RngBot/moves",
            port: "8081",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': postData.length
            }
        };
        logging.info("ships" + game.me.getShips());
        let commandQueue = [];
        const postRequest = http.request(postOptions, (resp)=> {
            let innerCommandQueue = [];
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                commandQueue = data;
                innerCommandQueue = data;
                commandQueue = innerCommandQueue;
                logging.info("data from post: " + data);
                logging.info("post ended: " + commandQueue);
                logging.info("post ended inner command queue: " + innerCommandQueue);
            });
        });

        new Promise(function(resolve) {
            postRequest.write(postData);
            postRequest.end();
            resolve();
        }).then(function() {});

        logging.info("about to end turn -> commandqueue: " + commandQueue);
        await game.endTurn(commandQueue);
    }
});
