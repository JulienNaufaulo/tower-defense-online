'use strict';

function NetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('CLIENT_REQUEST_LIST_PLAYERS', onRequestListPlayers);

	// Action quand le client connecté veut récupérer son identité auprès du serveur
    client.on('CLIENT_REQUEST_ID', onRequestId);

    client.on('CLIENT_IS_READY', onRequestClientReady);

    client.on('CLIENT_IS_NOT_READY', onRequestClientNotReady);

    // Action quand le client se déconnecte
    client.on('disconnect', onDisconnected);

    function onRequestId() {
	    // On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos du joueur
		var player = room.getPlayerById(client);

		// On envoie les infos au client ainsi qu'à tous les autres joueurs de la room
	    client.emit('SERVER_PLAYER_ID', { "player": player, "room": room });
	    client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_ID', player);

	    console.log("Nouvelle connexion : "+player.toString());
	};

	function onRequestListPlayers() {
	    // On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On liste les joueurs connectés dans la room
		var list = room.getListOtherPlayersInRoom(client);

		// On envoie la liste au joueur
		client.emit('SERVER_LIST_PLAYERS', list);

		// Si la room est pleine, on envoie un message invitant les joueurs à lancer la partie
		if(room.isFull()) {
			client.emit('CLICK_TO_START_THE_GAME');
			client.broadcast.in(room._name).emit('CLICK_TO_START_THE_GAME');
		}
	};

	function onDisconnected() {
	    // On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos sur le joueur
		var playerDisconnected = room.getPlayerById(client);

		// On signale à tous les autres joueurs de la room que le joueur s'est déconnecté
		client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_DISCONNECTED', playerDisconnected);

		// On enlève le joueur de la room
		room.removePlayer(client);

		// On réinitialise à false l'attribut "Ready" des autres joueurs de la room
		room.resetReady();

		console.log(playerDisconnected.toString()+" s'est déconnecté");
	};

	function onRequestClientReady() {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos sur le joueur
		var player = room.getPlayerById(client);
		player._ready = true;

		client.emit('SERVER_THAT_PLAYER_IS_READY', player);
		client.broadcast.in(room._name).emit('SERVER_THAT_PLAYER_IS_READY', player);

		if(room.isReady()) {
			client.emit('GO_TO_PLAY');
			client.broadcast.in(room._name).emit('GO_TO_PLAY');
		}
	}

	function onRequestClientNotReady() {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos sur le joueur
		var playerDisconnected = room.getPlayerById(client);

		// On signale à tous les autres joueurs de la room que le joueur s'est déconnecté
		client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_DISCONNECTED', playerDisconnected);

		// On enlève le joueur de la room
		room.removePlayer(client);

		// On réinitialise à false l'attribut "Ready" des autres joueurs de la room
		room.resetReady();

		client.emit('GO_TO_MENU');

		console.log(playerDisconnected.toString()+" s'est déconnecté");
	}
};

module.exports = NetworkManagerServer;