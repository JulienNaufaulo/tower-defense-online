'use strict';

var HexaColors = require('../../utils/HexaColors');

function RoomNetworkManagerClient(socket, phaser, chat) {

    this._intervalReadyTime;
    this._btnPlay;

    socket.on('connect', onConnectedToServer);
    socket.on('disconnect', onDisconnectedToServer);
    socket.on('SERVER_PLAYER_ID', onReceivePlayerId);
    socket.on('SERVER_LIST_PLAYERS', onReceiveListPlayers);
    socket.on('SERVER_OTHER_PLAYER_ID', onReceiveOtherPlayerId);
    socket.on('CLICK_TO_START_THE_GAME', onReceiveClickToStart);
    socket.on('SERVER_THAT_PLAYER_IS_READY', onReceiveThatPlayerIsReady);
    socket.on('GO_TO_PLAY', onReceiveGoToPlay);
    socket.on('GO_TO_MENU', onReceiveGoToMenu);
    socket.on('MESSAGE_SENT_BY_A_PLAYER', onReceiveMessageByAPlayer);
    socket.on('SERVER_OTHER_PLAYER_DISCONNECTED', onReceiveOtherPlayerDisconnected);

    function onConnectedToServer() {
        socket.emit('CLIENT_REQUEST_ID');
        socket.emit('CLIENT_REQUEST_LIST_PLAYERS');
        chat.init(socket); 
    }

    function onDisconnectedToServer() {
        clearInterval(this._intervalReadyTime);
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
        clearInterval(this._intervalReadyTime);
        this._btnPlay.destroy();
        chat.displayDisconnectedPlayer(player);
    }

    function onReceiveClickToStart() {
        this._btnPlay = phaser.add.button(phaser.world.centerX-110, phaser.world.centerY+50, 'btnReady', actionOnClick, this, 2, 1, 0);

        chat.displayAllPlayersConnected();

        // Compte à rebours
        var count = 10;
        this._intervalReadyTime = setInterval(function(){
            if(count==10) {
                var message = count+" secondes restantes";
            } else {
                var message = count;
            }
            
            chat.displaySimpleMessage(message);

            if(count == 0) {
                clearInterval(this._intervalReadyTime);
                socket.emit('END_OF_READY_TIME');
            }
            count--;
        }, 1000);
    }

    function actionOnClick() {
        this._btnPlay.destroy();
        socket.emit('CLIENT_IS_READY');
    }

    function onReceiveGoToPlay() {
        clearInterval(this._intervalReadyTime);
        phaser.state.start('play');
    }

    function onReceiveGoToMenu() {
        clearInterval(this._intervalReadyTime);
        socket.disconnect(true);
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