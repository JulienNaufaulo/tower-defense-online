'use strict';

var Player = require('../src/Player/Player');
var ListPlayers = require('../src/Player/ListPlayers');
var HexaColors = require('./HexaColors');

var serverSocket, phaser, listPlayers;
var hexaColors = new HexaColors();

var NetworkManager = {
    connected: false,
    connect: function(game) {
    	phaser = game;
        serverSocket = io.connect('http://localhost:3333');
        serverSocket.on('connect', onConnectedToServer);
        this.communication();
    },
    communication: function() {
        serverSocket.on('SERVER_PLAYER_ID', onReceivePlayerId);
        serverSocket.on('SERVER_LIST_PLAYERS', onReceiveListPlayers);
        serverSocket.on('SERVER_OTHER_PLAYER_ID', onReceiveOtherPlayerId);
        serverSocket.on('SERVER_FULL_ROOM', onReceiveFullRoom);
    },
};

function onConnectedToServer() {
    NetworkManager.connected = true;
    serverSocket.emit('CLIENT_REQUEST_ID');
    serverSocket.emit('CLIENT_REQUEST_LIST_PLAYERS');
    console.log("connexion réussie");
}

function onReceivePlayerId(Player) {
	var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY-50, "Vous êtes : Joueur "+Player._color);
    text.anchor.set(0.5);
    text.align = 'center';
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 18;
    text.fill = hexaColors.getHexa(Player._color);
}

function onReceiveListPlayers(list) {
	var positiontext = 0;
	for(var color in list) {
		if( list[color] != null ) {
			var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY+positiontext, "Joueur "+color+" : connecté");
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = 'Arial';
		    text.fontWeight = 'bold';
		    text.fontSize = 18;
		    text.fill = hexaColors.getHexa(color);

		    positiontext += 25;
		}
	}
}

function onReceiveOtherPlayerId(Player) {
	var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY+25, "Joueur "+Player._color+" : connecté");
    text.anchor.set(0.5);
    text.align = 'center';
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 18;
    text.fill = hexaColors.getHexa(Player._color);
}

function onReceiveFullRoom(message) {
	var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY+25, message);
    text.anchor.set(0.5);
    text.align = 'center';
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 18;
    text.fill = "#000000";
}

module.exports = NetworkManager;