'use strict';

var NetworkManager = require('utils/NetworkManager');
var Player = require('src/Player/Player');
var mainPlayer = new Player("Bleu");

function Room(){}

Room.prototype = {

    create: function() {
        var loadingText = "En attente d'un autre joueur...";
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, loadingText);

        //  Centers the text
        text.anchor.set(0.5);
        text.align = 'center';

        //  Our font + size
        text.font = 'Arial';
        text.fontWeight = 'bold';
        text.fontSize = 25;
        text.fill = '#000000';

        NetworkManager.connect(mainPlayer);
        console.log("coucou "+mainPlayer.toString());
    }

};

module.exports = Room;