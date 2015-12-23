'use strict';

function Play(){}

Play.prototype = {

    create: function() {
        var btnPlay = this.game.add.text(this.game.world.centerX, this.game.world.centerY-25, "Bienvenue dans le jeu !");
    }

};

module.exports = Play;