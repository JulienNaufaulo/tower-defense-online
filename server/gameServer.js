var ListRooms = require('../app/src/Room/ListRooms');
var Room = require('../app/src/Room/Room');
var NetworkManagerServer = require('./NetworkManagerServer');

var socketIO, rooms;

var GameServer = function(io){
    socketIO = io;
    return {
        start: function(){
        	rooms = new ListRooms();
            socketIO.on('connection', onClientConnected);
        }
    };
};

function onClientConnected(client){

    // Création de l'objet qui va gérer la communication avec le client
    var networkManager = new NetworkManagerServer(client, rooms);

	// On ajoute le nouveau joueur dans une room libre
	rooms.addPlayer(client);

}

module.exports = GameServer;