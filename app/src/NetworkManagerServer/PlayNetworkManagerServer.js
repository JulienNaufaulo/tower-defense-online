'use strict';

var WeaponFactory = require('../Weapon/WeaponFactory');

function PlayNetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('READY_TO_START', onRequestReadyToStart);
    client.on('SPRITE_TWEEN_FINISHED', onRequestSpriteTweenFinished);
    client.on('LIFE_LOST', onRequestLifeLost);
    client.on('MONSTER_DEAD', onRequestMonsterDead);
    client.on('I_WANT_TO_BUY_A_TOWER', onRequestBuyATower);
    client.on('I_WANT_TO_BUY_A_WEAPON', onRequestBuyAWeapon);
    client.on('READY_FOR_NEXT_ROUND', onRequestReadyForNextRound);

    function onRequestReadyToStart() {

    	// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		player._readyForNextRound = true;

		client.emit('INIT_DATAS_GAME', {
										"ready" : player._readyForNextRound,
										"color" : player._color,
										"life" : player._life,
										"gold" : player._gold,
										"idRoom" : room._id
									});

		if(room.isReadyForNextRound()) {
			room.setAllPlayersPlaying();
			room.resetReadyForNextRound();
			client.broadcast.in(room._name).emit('GO_TO_NEXT_ROUND');
			client.emit('GO_TO_NEXT_ROUND');
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

		player._gold += data.price;
		client.emit("GOLD_EARN", data.price);
		client.broadcast.in(room._name).emit('A_MONSTER_IS_DEAD', { "idMonster" : data.idMonster, "idWave" : data.idWave, "owner" : data.ownerWave });
	}

	function onRequestBuyATower(data) {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		if(player._gold - data.cost >= 0) {
			player._gold -= data.cost;
			client.emit('A_TOWER_HAS_BEEN_BUILT', {"towerType" : data.towerType, "owner" : player._color, "tileX" : data.tileX, "tileY" : data.tileY, "gold" : player._gold});
			client.broadcast.in(room._name).emit('A_TOWER_HAS_BEEN_BUILT', {"towerType" : data.towerType, "owner" : player._color, "tileX" : data.tileX, "tileY" : data.tileY});
		}
	}

	function onRequestBuyAWeapon(data) {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		var weapon = WeaponFactory.getInstance(data.weaponName);

		if(player._gold - weapon._cost >= 0) {
			player._gold -= weapon._cost;
			client.emit('A_WEAPON_HAS_BEEN_BOUGHT', {"tileX" : data.tileX, "tileY" : data.tileY, "owner" : player._color, "gold" : player._gold, "weaponName" : data.weaponName});
			client.broadcast.in(room._name).emit('A_WEAPON_HAS_BEEN_BOUGHT', {"tileX" : data.tileX, "tileY" : data.tileY, "owner" : player._color, "gold" : player._gold, "weaponName" : data.weaponName});
		}
	}

	function onRequestReadyForNextRound() {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		player._readyForNextRound = true;

		console.log("un joueur est prêt pour le prochain round");

		if(room.isReadyForNextRound()) {
			console.log("tous les joueurs sont prêts pour le prochain round");
			room.resetReadyForNextRound();
			client.broadcast.in(room._name).emit('GO_TO_NEXT_ROUND');
			client.emit('GO_TO_NEXT_ROUND');
		}


	}
};

module.exports = PlayNetworkManagerServer;