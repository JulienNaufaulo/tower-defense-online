"use strict";

var App = {

	init: function(gameContainerElementId){

        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

		function preload() {
		}

		function create() {
		}

		function update() {
		}

    }
};

module.exports = App;