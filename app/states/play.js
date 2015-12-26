'use strict';

var Wave = require('../src/Monster/Wave');

var cursors, wave, character;

function Play(){}

Play.prototype = {

    create: function() {
    	var grille = this.game.add.tileSprite(0, 0, 800, 600, 'grille');

    	wave = new Wave(this.game, 10, 5);
    	wave.create();

        cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
    	wave.move();
    }

};

module.exports = Play;