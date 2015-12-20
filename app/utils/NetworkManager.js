'use strict';

var serverSocket, mainPlayer;

var NetworkManager = {
    connected: false,
    connect: function (player) {
        mainPlayer = player;
        serverSocket = io.connect('http://localhost:3333');
        serverSocket.on('connect', onConnectedToServer);
    }
};

function onConnectedToServer() {
    NetworkManager.connected = true;
    console.log("connexion réussie");
}

module.exports = NetworkManager;