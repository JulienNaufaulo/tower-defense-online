'use strict';

var NetworkManager = require('utils/NetworkManager');
var Player = require('src/Player/Player');

function Room(){}

Room.prototype = {

    create: function() {
        var loadingText = "En attente des autres joueurs...";
        var text = this.game.add.text(this.game.world.centerX, 100, loadingText);

        //  Centers the text
        text.anchor.set(0.5);
        text.align = 'center';

        //  Our font + size
        text.font = 'Arial';
        text.fontWeight = 'bold';
        text.fontSize = 25;
        text.fill = '#000000';

        NetworkManager.connect(this.game);

        console.log();
    }

};

module.exports = Room;