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
    for(var color in list) {
        if( list[color] != null ) {
            $('#content').append("<p><span>"+getTime()+"</span><span class=\"txt-"+color+"\">Joueur "+color+" s'est connecté.</span></p>");
        }
    }
}

function onReceiveOtherPlayerId(player) {
    $('#content').append("<p><span>"+getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est connecté.</span></p>");
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

function onReceiveOtherPlayerDisconnected(player) {
    $('#content').append("<p><span>"+getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est déconnecté.</span></p>");
}

function getTime() {
    var now = new Date();
    var annee   = now.getFullYear();
    var mois    = ('0'+now.getMonth()+1).slice(-2);
    var jour    = ('0'+now.getDate()   ).slice(-2);
    var heure   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    var seconde = ('0'+now.getSeconds()).slice(-2);
     
    return jour+"/"+mois+"/"+annee+", "+heure+":"+minute+":"+seconde;
}

module.exports = NetworkManager;