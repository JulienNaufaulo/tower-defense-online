
// game server : handle socket communication related to the game mechanics

var socketIO, listPlayers = [];

var GameServer = function(io){
    socketIO = io;
    return {
        start: function(){
            socketIO.on('connection', onClientConnected);
        }
    };
};

function onClientConnected(client){
    console.log('Client connected ...');
}


module.exports = GameServer;