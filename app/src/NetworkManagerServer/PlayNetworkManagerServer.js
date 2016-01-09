'use strict';

function PlayNetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('READY_TO_START', onRequestReadyToStart);
    client.on('SPRITE_TWEEN_FINISHED', onRequestSpriteTweenFinished);
    client.on('LIFE_LOST', onRequestLifeLost);

    function onRequestReadyToStart() {

    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		player._playing = true;

		client.emit('INIT_DATAS_GAME', {
										"ready" : false,
										"color" : player._color,
										"life" : player._life,
										"gold" : player._gold
									});

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

		client.broadcast.in(room._name).emit('CHECK_SPRITE_POSITION', {"idMonster" : data.idMonster, "currentIndex" : data.currentIndex, "tileX" : data.tileX, "tileY" : data.tileY, "idWave": data.idWave});
	}

	function onRequestLifeLost(idWave) {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		if( idWave == player._color ) {
			player._life--;
			client.emit('GET_MY_LIFE', player._life);
		}
	}

};

module.exports = PlayNetworkManagerServer;