'use strict';

var NetworkManager = require('utils/NetworkManager');

function Room(){}

Room.prototype = {

    create: function() {

        this.displayLoadingText();
        NetworkManager.connect(this.game);

        window.setInterval(function() {
          var elem = document.getElementById('content');
          elem.scrollTop = elem.scrollHeight;
        }, 500);

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