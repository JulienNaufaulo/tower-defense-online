'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Wave = require('../src/Monster/Wave');
var TimeUtils = require('../../utils/TimeUtils');

function Play(){
	this._socket;
    this._waves = [];
    this._timer;
    this._timeUtils = new TimeUtils();
    this._playerDatas = {
        "ready" : false,
        "color" : null,
        "life" : null,
        "gold" : null
    }

    var playNetworkManagerClient;

    console.log(this._playerDatas.ready);
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
        this.game.forceSingleUpdate = true;
	},

    create: function() {
    	var grille = this.game.add.tileSprite(0, 0, 800, 600, 'grille');

        // Création de la 1ère vague de creeps
        var path1 = [ {"x":63, "y":-50}, {"x":63, "y":100}, {"x":263, "y":100}, {"x":263, "y":200}, {"x":20, "y":200}, {"x":20, "y":350}, {"x":305, "y":350}, {"x":305, "y":-50} ];
    	var wave1 = new Wave("Bleu", path1, this.game, 10, 5, this._socket);
    	wave1.create();
        this._waves.push(wave1);

        // Création de la 2ème vague de creeps
        var path2 = [ {"x":707, "y":-50}, {"x":707, "y":100}, {"x":507, "y":100}, {"x":507, "y":200}, {"x":750, "y":200}, {"x":750, "y":350}, {"x":465, "y":350}, {"x":465, "y":-50} ];
        var wave2 = new Wave("Rouge", path2, this.game, 10, 5, this._socket);
        wave2.create();
        this._waves.push(wave2);

        this._timer = this.game.add.text(this.game.world.centerX-43, 0, "00:00:00", {
            font: "22px Arial",
            fill: "#000000"
        });

        // Affichage du texte des vies restantes
        this._playerDatas.life = this.game.add.text(100, 25, "");
        this._playerDatas.life.anchor.set(0.5);
        // this._playerDatas.life.align = 'left';
        this._playerDatas.life.font = 'Arial';
        this._playerDatas.life.fontWeight = 'bold';
        this._playerDatas.life.fontSize = 20;
        this._playerDatas.life.fill = "#000000";

        // Affichage du texte du gold restant
        this._playerDatas.gold = this.game.add.text(100, 65, "");
        this._playerDatas.gold.anchor.set(0.5);
        // this._playerDatas.gold.align = 'left';
        this._playerDatas.gold.font = 'Arial';
        this._playerDatas.gold.fontWeight = 'bold';
        this._playerDatas.gold.fontSize = 20;
        this._playerDatas.gold.fill = "#000000";

        this.playNetworkManagerClient = new PlayNetworkManagerClient(this._socket, this.game, this._waves, this._playerDatas);

    	this._socket.emit('READY_TO_START');
    	
    },

    update: function() {
        if( this._playerDatas.ready ) {
            this._timeUtils.updateTimer(this.game, this._timer);
            for(var i=0, count=this._waves.length; i < count; i++) {
                this._waves[i].move();
            }
        }
    }

};

module.exports = Play;