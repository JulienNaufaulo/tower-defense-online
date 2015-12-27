'use strict';

// var NetworkManagerClient = require('../src/NetworkManagerClient/NetworkManagerClient');
var RoomNetworkManagerClient = require('../src/NetworkManagerClient/RoomNetworkManagerClient');
var Chat = require('../src/Chat/Chat');

function Room(){}

Room.prototype = {

    create: function() {
        // Initialisation du chat
        var chat = new Chat("#chat", "content", "#inputchat");

        // Création de l'objet qui va gérer la communication avec le serveur
        // var networkManagerClient = new NetworkManagerClient(this.game, chat);

        var roomNetworkManagerClient = new RoomNetworkManagerClient(this.game, chat);

        // Affichage du texte de chargement
        this.displayLoadingText();

    },
    displayLoadingText: function() {
        var loadingText = "En attente des autres joueurs...";
        var text = this.game.add.text(this.game.world.centerX, 100, loadingText);
        text.anchor.set(0.5);
        text.align = 'center';
        text.font = 'Arial';
        text.fontWeight = 'bold';
        text.fontSize = 25;
        text.fill = '#000000';
    }

};

module.exports = Room;