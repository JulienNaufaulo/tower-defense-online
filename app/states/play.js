'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Wave = require('../src/Monster/Wave');
var TimeUtils = require('../../utils/TimeUtils');

function Play(){
	this._socket;
	this._wave;
    this._timer;
    this._timeUtils = new TimeUtils();
    this._test = 0;
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
	},

    create: function() {
    	var grille = this.game.add.tileSprite(0, 0, 800, 600, 'grille');

    	this._wave = new Wave(this.game, 10, 5);
    	this._wave.create();

        this._timer = this.game.add.text(this.game.world.centerX-43, 0, "00:00:00", {
            font: "22px Arial",
            fill: "#000000"
        });

    	this._socket.emit('READY_TO_START');
    	var playNetworkManagerClient = new PlayNetworkManagerClient(this._socket, this.game, this._wave);
    },

    update: function() {
    	if( this._wave._started ) {
            this._timeUtils.updateTimer(this.game, this._timer);
    		this._wave.move(this._socket);
        }
    }

};

module.exports = Play;