'use strict';

function PlayNetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('READY_TO_START', onRequestReadyToStart);
    client.on('SPRITE_TWEEN_FINISHED', onRequestSpriteTweenFinished);

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

	function onRequestSpriteTweenFinished(data) {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		client.broadcast.in(room._name).emit('CHECK_SPRITE_POSITION', {"idMonster" : data.idMonster, "currentIndex" : data.currentIndex, "posX" : data.posX, "posY" : data.posY});
		
		
	}

};

module.exports = PlayNetworkManagerServer;