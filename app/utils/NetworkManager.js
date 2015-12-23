'use strict';

var HexaColors = require('./HexaColors');
var TimeUtils = require('./TimeUtils');

var serverSocket, phaser, interval, btnPlay, readyToStart;
var hexaColors = new HexaColors();
var timeUtils = new TimeUtils();

var NetworkManager = {
    connected: false,
    connect: function(game) {
    	phaser = game;
        serverSocket = io.connect('http://localhost:3333', {'force new connection': true});
        serverSocket.on('connect', onConnectedToServer);
        serverSocket.on('disconnect', onDisconnectedToServer);
        this.communication();
    },
    communication: function() {
        serverSocket.on('SERVER_PLAYER_ID', onReceivePlayerId);
        serverSocket.on('SERVER_LIST_PLAYERS', onReceiveListPlayers);
        serverSocket.on('SERVER_OTHER_PLAYER_ID', onReceiveOtherPlayerId);
        serverSocket.on('CLICK_TO_START_THE_GAME', onReceiveClickToStart);
        serverSocket.on('SERVER_THAT_PLAYER_IS_READY', onReceiveThatPlayerIsReady);
        serverSocket.on('GO_TO_PLAY', onReceiveGoToPlay);
        serverSocket.on('GO_TO_MENU', onReceiveGoToMenu);
        serverSocket.on('SERVER_OTHER_PLAYER_DISCONNECTED', onReceiveOtherPlayerDisconnected);
    }
};

function onConnectedToServer() {
    NetworkManager.connected = true;
    serverSocket.emit('CLIENT_REQUEST_ID');
    serverSocket.emit('CLIENT_REQUEST_LIST_PLAYERS');
    $('#chat').fadeIn( "slow" ).css("display","inline-block");
}

function onDisconnectedToServer() {
    clearInterval(interval);
}

function onReceivePlayerId(data) {
    $('#chat > h2').empty().append("Room "+(data.room._id+1));
    $('#content').empty();

	var text = phaser.add.text(phaser.world.centerX, phaser.world.centerY-50, "Vous êtes");
    text.anchor.set(0.5);
    text.align = 'center';
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 18;
    text.fill = "#000000";

    var textPlayer = phaser.add.text(phaser.world.centerX, phaser.world.centerY-25, "Joueur "+data.player._color);
    textPlayer.anchor.set(0.5);
    textPlayer.align = 'center';
    textPlayer.font = 'Arial';
    textPlayer.fontWeight = 'bold';
    textPlayer.fontSize = 25;
    textPlayer.fill = hexaColors.getHexa(data.player._color);
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
    clearInterval(interval);
    btnPlay.destroy();
    $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est déconnecté.</span></p>");
}

function onReceiveClickToStart() {
    readyToStart = false;
    btnPlay = phaser.add.button(phaser.world.centerX-110, phaser.world.centerY+50, 'btnReady', actionOnClick, this, 2, 1, 0);

    $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span>Tous les joueurs sont connectés.<br />Cliquez sur \"Prêt\" pour lancer la partie.</span></p>");
    var count = 10;
    interval = setInterval(function(){
        if(count==10) {
            var message = count+" secondes restantes";
        } else {
            var message = count;
        }
        $('#content').append("<p><span>"+message+"</span></p>");

        if(count == 0) {
            clearInterval(interval);
            serverSocket.emit('END_OF_READY_TIME');
        }
        count--;
    },1000);
}

function actionOnClick() {
    readyToStart = true;
    btnPlay.destroy();
    serverSocket.emit('CLIENT_IS_READY');
}

function onReceiveGoToPlay() {
    clearInterval(interval);
    phaser.state.start('play');
}

function onReceiveGoToMenu() {
    clearInterval(interval);
    serverSocket.disconnect(true);
    $('#chat').fadeOut( "slow" );
    phaser.state.start('menu');
}

function onReceiveThatPlayerIsReady(player) {
    $('#content').append("<p><span>"+timeUtils.getTime()+"</span><span class=\"txt-"+player._color+"\">Joueur "+player._color+" est prêt !</span></p>");
}

module.exports = NetworkManager;