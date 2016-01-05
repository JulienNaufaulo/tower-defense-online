'use strict';

var HexaColors = require('../../utils/HexaColors');

function RoomNetworkManagerClient(phaser, chat) {

    var that = this;

    var server = window.location.hostname;
    var server_port = 5000;

    if(server == "localhost")
        server += ":"+server_port;

    this._socket = io.connect(server, {'force new connection': true});

    this._intervalReadyTime;
    this._btnPlay;

    this._socket.on('connect', onConnectedToServer);
    this._socket.on('disconnect', onDisconnectedToServer);
    this._socket.on('SERVER_PLAYER_ID', onReceivePlayerId);
    this._socket.on('SERVER_LIST_PLAYERS', onReceiveListPlayers);
    this._socket.on('SERVER_OTHER_PLAYER_ID', onReceiveOtherPlayerId);
    this._socket.on('CLICK_TO_START_THE_GAME', onReceiveClickToStart);
    this._socket.on('SERVER_THAT_PLAYER_IS_READY', onReceiveThatPlayerIsReady);
    this._socket.on('GO_TO_PLAY', onReceiveGoToPlay);
    this._socket.on('GO_TO_MENU', onReceiveGoToMenu);
    this._socket.on('MESSAGE_SENT_BY_A_PLAYER', onReceiveMessageByAPlayer);
    this._socket.on('SERVER_OTHER_PLAYER_DISCONNECTED', onReceiveOtherPlayerDisconnected);

    function onConnectedToServer() {
        that._socket.emit('CLIENT_REQUEST_ID');
        that._socket.emit('CLIENT_REQUEST_LIST_PLAYERS');
        chat.init(that._socket); 
    }

    function onDisconnectedToServer() {
        clearInterval(that._intervalReadyTime);
    }

    function onReceivePlayerId(data) {
        chat.displayRoom(data.room);

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

        var hexaColors = new HexaColors();
        textPlayer.fill = hexaColors.getHexa(data.player._color);
    }

    function onReceiveListPlayers(list) {
        chat.displayListPlayers(list);
    }

    function onReceiveOtherPlayerId(player) {
        chat.displayNewConnectedPlayer(player);
    }

    function onReceiveOtherPlayerDisconnected(player) {
        clearInterval(that._intervalReadyTime);
        that._btnPlay.destroy();
        chat.displayDisconnectedPlayer(player);
    }

    function onReceiveClickToStart() {
        that._btnPlay = phaser.add.button(phaser.world.centerX-110, phaser.world.centerY+50, 'btnReady', actionOnClick, this, 2, 1, 0);

        chat.displayAllPlayersConnected();

        // Compte à rebours
        var count = 10;
        that._intervalReadyTime = setInterval(function(){
            if(count==10) {
                var message = count+" secondes restantes";
            } else {
                var message = count;
            }
            
            chat.displaySimpleMessage(message);

            if(count == 0) {
                clearInterval(that._intervalReadyTime);
                that._socket.emit('END_OF_READY_TIME');
            }
            count--;
        }, 1000);
    }

    function actionOnClick() {
        that._btnPlay.destroy();
        that._socket.emit('CLIENT_IS_READY');
    }

    function onReceiveGoToPlay() {
        clearInterval(that._intervalReadyTime);
        // phaser.state.start('play');
        phaser.state.start('play', true, false, that._socket);

    }

    function onReceiveGoToMenu() {
        clearInterval(that._intervalReadyTime);
        that._socket.disconnect(true);
        chat.destroy();
        phaser.state.start('menu');
    }

    function onReceiveThatPlayerIsReady(player) {
        chat.displayReadyPlayer(player);
    }

    function onReceiveMessageByAPlayer(data) {
        chat.displayPlayerMessage(data.player, data.message);
    }
};

module.exports = RoomNetworkManagerClient;