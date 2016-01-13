'use strict';

function PlayNetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('READY_TO_START', onRequestReadyToStart);
    client.on('SPRITE_TWEEN_FINISHED', onRequestSpriteTweenFinished);
    client.on('LIFE_LOST', onRequestLifeLost);
    client.on('MONSTER_DEAD', onRequestMonsterDead);
    client.on('BUILD_TOWER', onRequestBuildTower);

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

		client.broadcast.in(room._name).emit('CHECK_SPRITE_POSITION', {"idMonster" : data.idMonster, "currentIndex" : data.currentIndex, "tileX" : data.tileX, "tileY" : data.tileY, "idWave": data.idWave, "owner" : data.owner});
	}

	function onRequestLifeLost(waveOwner) {

		console.log("vie perdu !");
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		if(waveOwner == player._color){
			player._life--;
			client.emit('GET_MY_LIFE', player._life);
		}
		
	}

	function onRequestMonsterDead(data) {

		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		if(data.owner == player._color) {
			client.broadcast.in(room._name).emit('A_MONSTER_IS_DEAD', { "idMonster" : data.idMonster, "idWave" : data.idWave, "owner" : data.owner });
		}
		
	}

	function onRequestBuildTower(data) {

		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		client.broadcast.in(room._name).emit('A_TOWER_HAS_BEEN_BUILT', {"towerType" : data.towerType, "owner" : player._color, "tileX" : data.tileX, "tileY" : data.tileY});

	}

};

module.exports = PlayNetworkManagerServer;