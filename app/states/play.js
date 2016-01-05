'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Wave = require('../src/Monster/Wave');
var TimeUtils = require('../../utils/TimeUtils');

function Play(){
	this._socket;
    this._playNetworkManagerClient;

    this._map;
    this._floor;
    this._path;
    this._walls;
    this._bgDoors;
    this._sideDoors;
    this._doorsStart;
    this._flags;
    this._doorsEnd;
    this._objects;
    this._forbiddenTiles;

    this._waves = [];

    this._timer;
    this._timeUtils = new TimeUtils();
    this._playerDatas = {
        "ready" : false,
        "color" : null,
        "life" : null,
        "gold" : null
    };

    this._marker;
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
        this.game.forceSingleUpdate = true;
	},

    create: function() {
        this.createMap();

        // Création de la 1ère vague de creeps
        var path1 = [ {"x":67, "y":-50}, {"x":67, "y":150}, {"x":195, "y":150}, {"x":195, "y":245}, {"x":35, "y":245}, {"x":35, "y":432}, {"x":260, "y":432}, {"x":260, "y":338}, {"x":356, "y":338}, {"x":356, "y":-50} ];
    	var wave1 = new Wave("Bleu", path1, this.game, 10, 5, this._socket);
    	wave1.create();
        this._waves.push(wave1);

        // Création de la 2ème vague de creeps
        var path2 = [ {"x":675, "y":-50}, {"x":675, "y":150}, {"x":547, "y":150}, {"x":547, "y":245}, {"x":707, "y":245}, {"x":707, "y":432}, {"x":482, "y":432}, {"x":482, "y":338}, {"x":386, "y":338}, {"x":386, "y":-50} ];
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

        this._playNetworkManagerClient = new PlayNetworkManagerClient(this._socket, this.game, this._waves, this._playerDatas);

    	this._socket.emit('READY_TO_START');
    	
    },

    createMap: function() {
        this._map = this.game.add.tilemap('map');

        this._map.addTilesetImage('Castle2', 'castle2');
        this._map.addTilesetImage('castle3', 'castle3');
        this._map.addTilesetImage('meta_tiles', 'metaTiles');

        this._floor = this._map.createLayer('sol');
        this._path = this._map.createLayer('path');
        this._walls = this._map.createLayer('murs');
        this._bgDoors = this._map.createLayer('bg porte');
        this._sideDoors = this._map.createLayer('cotes portes depart');
        this._doorsStart = this._map.createLayer('portes départ');
        this._flags = this._map.createLayer('drapeaux');
        this._doorsEnd = this._map.createLayer('portes fin');
        this._objects = this._map.createLayer('objets decoratifs');
        this._forbiddenTiles = this._map.createLayer('meta');
        this._forbiddenTiles.alpha = 0;

        this._marker = this.game.add.graphics();
        this._marker.lineStyle(2, 0x000000, 1);
        this._marker.drawRect(0, 0, 32, 32);
    },

    update: function() {
        if( this._playerDatas.ready ) {
            this._timeUtils.updateTimer(this.game, this._timer);
            for(var i=0, count=this._waves.length; i < count; i++) {
                this._waves[i].move();

            }
        }
        this._marker.x = this._floor.getTileX(this.game.input.activePointer.worldX) * 32;
        this._marker.y = this._floor.getTileY(this.game.input.activePointer.worldY) * 32;
    },

    render: function()
    {        
        // this.game.debug.text(Phaser.VERSION, this.game.world.width - 55, 14, "#ffff00");
        // var pos = this.game.input.activePointer.position;
        // this.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 200);
    }

};

module.exports = Play;