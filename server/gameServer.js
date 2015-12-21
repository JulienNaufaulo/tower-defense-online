var ListPlayers = require('../app/src/Player/ListPlayers');

var socketIO, player, listPlayers;

var GameServer = function(io){
    socketIO = io;
    return {
        start: function(){
        	listPlayers = new ListPlayers();
            socketIO.on('connection', onClientConnected);
        }
    };
};

function onClientConnected(client){

	// S'il reste une place dans la salle d'attente
	if( listPlayers.numberOfConnectedPlayers() < listPlayers.maximumNumberOfPlayers() ) {

		// On ajoute le joueur dans la liste des joueurs de la partie
	    player = listPlayers.addPlayer(client.id);
	    console.log(player.toString()+" s'est connecté");

	    client.on('CLIENT_REQUEST_ID', onRequestId);
	    client.on('CLIENT_REQUEST_LIST_PLAYERS', onRequestListPlayers);
	    client.on('disconnect', onDisconnected);

	    function onRequestId() {
	        client.emit('SERVER_PLAYER_ID', player);
	        client.broadcast.emit('SERVER_OTHER_PLAYER_ID', player);
	    }

	    function onRequestListPlayers() {
	    	var list = listPlayers.getList();
	    	client.emit('SERVER_LIST_PLAYERS', list);
	    }

	    function onDisconnected(){
    		playerDisconnected = listPlayers.getDisconnectedPlayer(client.id);
	    	listPlayers.removePlayer(playerDisconnected);
	    	client.broadcast.emit('SERVER_OTHER_PLAYER_DISCONNECTED', playerDisconnected);
	    	console.log(playerDisconnected.toString()+" s'est déconnecté");
	    }
	} else {
		var message = "Impossible de rejoindre la salle d'attente. Plus de place disponible.";
		client.emit('SERVER_FULL_ROOM', message);
	}

}

module.exports = GameServer;