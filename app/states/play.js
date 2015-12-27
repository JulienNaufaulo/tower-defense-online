'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Wave = require('../src/Monster/Wave');

function Play(){
	this._socket;
	this._wave;
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
		console.log("socket id : "+socket.id);
	},

    create: function() {
    	var grille = this.game.add.tileSprite(0, 0, 800, 600, 'grille');
    	this._wave = new Wave(this.game, 2, 5);
    	this._wave.create();
    	this._socket.emit('READY_TO_START');
    	var playNetworkManagerClient = new PlayNetworkManagerClient(this._socket, this.game, this._wave);
    },

    update: function() {
    	if( this._wave._started )
    		this._wave.move();
    }

};

module.exports = Play;