"use strict";

var App = {

	init: function(gameContainerElementId){

        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
        game.state.add('boot', require('./states/boot'));
        game.state.add('menu', require('./states/menu'));
        game.state.add('room', require('./states/room'));
        game.state.add('play', require('./states/play'));

        game.state.start('boot');
    }
};

module.exports = App;