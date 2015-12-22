'use strict';

var HexaColors = require('./HexaColors');
var TimeUtils = require('./TimeUtils');

var serverSocket, phaser;
var hexaColors = new HexaColors();
var timeUtils = new TimeUtils();

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
        serverSocket.on('SERVER_OTHER_PLAYER_DISCONNECTED', onReceiveOtherPlayerDisconnected);
    }
};

function onConnectedToServer() {
    NetworkManager.connected = true;
    serverSocket.emit('CLIENT_REQUEST_ID');
    serverSocket.emit('CLIENT_REQUEST_LIST_PLAYERS');
    console.log("connexion réussie");
}

function onReceivePlayerId(player) {
	var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY-50, "Vous êtes");
    text.anchor.set(0.5);
    text.align = 'center';
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 18;
    text.fill = "#000000";

    var textPlayer = phaser.add.text(phaser.world.centerX, phaser.world.centerY-25, "Joueur "+player._color);
    textPlayer.anchor.set(0.5);
    textPlayer.align = 'center';
    textPlayer.font = 'Arial';
    textPlayer.fontWeight = 'bold';
    textPlayer.fontSize = 25;
    textPlayer.fill = hexaColors.getHexa(player._color);
}

function onReceiveListPlayers(list) {
    for(var i=0, count=list.length; i < count; i++) {
        $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span class=\"txt-"+list[i]._color+"\">Joueur "+list[i]._color+" est déjà connecté.</span></p>");
    }
}

function onReceiveOtherPlayerId(player) {
    $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est connecté.</span></p>");
}

function onReceiveOtherPlayerDisconnected(player) {
    $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est déconnecté.</span></p>");
}

module.exports = NetworkManager;