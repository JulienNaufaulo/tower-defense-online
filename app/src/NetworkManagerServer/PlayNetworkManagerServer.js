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
										"gold" : player._gold,
										"idRoom" : room._id
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
};

module.exports = PlayNetworkManagerServer;