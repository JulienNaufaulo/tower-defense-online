var ListRooms = require('../app/src/Room/ListRooms');
var Room = require('../app/src/Room/Room');

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

	// On ajoute le nouveau joueur dans une room libre
	rooms.addPlayer(client);

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('CLIENT_REQUEST_LIST_PLAYERS', onRequestListPlayers);

	// Action quand le client connecté veut récupérer son identité auprès du serveur
    client.on('CLIENT_REQUEST_ID', onRequestId);

    // Action quand le client se déconnecte
    client.on('disconnect', onDisconnected);

    function onRequestId() {
    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
    	var player = room.getPlayerById(client);

    	// On envoie les infos au client ainsi qu'à tous les autres joueurs de la room
        client.emit('SERVER_PLAYER_ID', player);
        client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_ID', player);

        console.log("Nouvelle connexion : "+player.toString());
    }

    function onRequestListPlayers() {
    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

    	// On liste les joueurs connectés dans la room
    	var list = room.getListOtherPlayersInRoom(client);

    	// On envoie la liste au joueur
    	client.emit('SERVER_LIST_PLAYERS', list);
    }

    function onDisconnected(){
    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

    	// On récupère les infos sur le joueur
    	playerDisconnected = room.getPlayerById(client);

		// On enlève le joueur de la room
    	room.removePlayer(client);

    	// On signale à tous les autres joueurs de la room que le joueur s'est déconnecté
    	client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_DISCONNECTED', playerDisconnected);
    	
    	console.log(playerDisconnected.toString()+" s'est déconnecté");
    }
	

}

module.exports = GameServer;