'use strict';

function NetworkManagerServer(client, rooms){

	// Action quand le client connecté veut récupérer la liste des joueurs connectés dans sa room
    client.on('CLIENT_REQUEST_LIST_PLAYERS', onRequestListPlayers);

	// Action quand le client connecté veut récupérer son identité auprès du serveur
    client.on('CLIENT_REQUEST_ID', onRequestId);

    client.on('CLIENT_IS_READY', onRequestClientReady);

    client.on('END_OF_READY_TIME', onRequestEndOfReadyTime);

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
			// On réinitialise à false l'attribut "Ready" des joueurs de la room
			room.resetReady();
			// On autorise l'affichage du bouton pour démarrer la partie
			client.emit('CLICK_TO_START_THE_GAME');
			client.broadcast.in(room._name).emit('CLICK_TO_START_THE_GAME');
		}
	};

	function onDisconnected() {
		if (client.id != undefined){
		    // On récupère la room du client
			var room = rooms.getRoomOfPlayer(client);

			if(room) {
				// On récupère les infos sur le joueur
				var playerDisconnected = room.getPlayerById(client);

				// On signale à tous les autres joueurs de la room que le joueur s'est déconnecté
				client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_DISCONNECTED', playerDisconnected);

				// On enlève le joueur de la room
				room.removePlayer(client);

				// On réinitialise à false l'attribut "Ready" des joueurs de la room
				room.resetReady();

				console.log(playerDisconnected.toString()+" s'est déconnecté");
			}
			
		}
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

	function onRequestEndOfReadyTime() {
		// On récupère la room du client
		var room = rooms.getRoomOfPlayer(client);

		// On récupère les infos sur le joueur
		var player = room.getPlayerById(client);

		if(!player._ready) {
			client.broadcast.in(room._name).emit('SERVER_OTHER_PLAYER_DISCONNECTED', player);
			room.removePlayer(client);
			client.emit('GO_TO_MENU');
			console.log(playerDisconnected.toString()+" s'est déconnecté");
		}	
	}
};

module.exports = NetworkManagerServer;