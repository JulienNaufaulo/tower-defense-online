"use strict";

var App = {

	init: function(gameContainerElementId){
		var config = {  width: 768,  height: 576,  renderer: Phaser.AUTO,  parent: 'game',  transparent: false,  antialias: true,  forceSetTimeOut: true}
        var game = new Phaser.Game(config);
        // var game = new Phaser.Game(768, 576, Phaser.AUTO, 'game');
        game.state.add('boot', require('./states/boot'));
        game.state.add('menu', require('./states/menu'));
        game.state.add('room', require('./states/room'));
        game.state.add('play', require('./states/play'));

        game.state.start('boot');
    }
};

module.exports = App;