'use strict';

function PlayNetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('READY_TO_START', onRequestReadyToStart);

    function onRequestReadyToStart() {

    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		player._playing = true;

		if(room.isPlaying()) {
			client.broadcast.in(room._name).emit('START_GAME');
			client.emit('START_GAME');
		}
	};

};

module.exports = PlayNetworkManagerServer;