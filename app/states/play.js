'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Shop = require('../src/Shop/Shop');
var Wave = require('../src/Monster/Wave');
var Tower = require('../src/Tower/Tower');
var ListTowers = require('../src/Tower/ListTowers');
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
    this._monstersLayer;

    this._waves = [];
    this._listTowers;

    this._timer;
    this._timeUtils = new TimeUtils();
    this._playerDatas = {
        "ready" : false,
        "color" : null,
        "life" : null,
        "gold" : null
    };

    this._marker;
    this._tileWidth = 32;
    this._tileHeight = 32;

    this._shop;
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
        this.game.forceSingleUpdate = true;
	},

    create: function() {

        this.createMap();
        this._listTowers = new ListTowers(this.game);
        this._shop = new Shop(this.game, this._listTowers, this._playerDatas, this._socket);
        


        // Création de la 1ère vague de creeps
        var path1 = [ {"x":2, "y":0}, {"x":2, "y":5}, {"x":6, "y":5}, {"x":6, "y":8}, {"x":1, "y":8}, {"x":1, "y":14}, {"x":8, "y":14}, {"x":8, "y":11}, {"x":11, "y":11}, {"x":11, "y":2} ];
        // var path1 = [ {"x":79, "y":-50}, {"x":79, "y":165}, {"x":208, "y":165}, {"x":208, "y":261}, {"x":48, "y":261}, {"x":48, "y":453}, {"x":272, "y":453}, {"x":272, "y":355}, {"x":368, "y":355}, {"x":368, "y":80} ];
    	var wave1 = new Wave("Bleu", this._floor, path1, this.game, 10, 2, this._socket);
    	wave1.create();
        this._waves.push(wave1);

        // Création de la 2ème vague de creeps
        // var path2 = [ {"x":675, "y":-50}, {"x":675, "y":150}, {"x":547, "y":150}, {"x":547, "y":245}, {"x":707, "y":245}, {"x":707, "y":432}, {"x":482, "y":432}, {"x":482, "y":338}, {"x":386, "y":338}, {"x":386, "y":70} ];
        // var wave2 = new Wave("Rouge", this._floor, path2, this.game, 10, 5, this._socket);
        // wave2.create();
        // this._waves.push(wave2);

        this._timer = this.game.add.text(this.game.world.centerX-43, 0, "00:00:00", {
            font: "22px Arial",
            fill: "#000000"
        });

        // Affichage du texte des vies restantes
        this._playerDatas.life = this.game.add.text(100, 25, "");
        this._playerDatas.life.anchor.set(0.5);
        this._playerDatas.life.font = 'Arial';
        this._playerDatas.life.fontWeight = 'bold';
        this._playerDatas.life.fontSize = 20;
        this._playerDatas.life.fill = "#000000";

        // Affichage du texte du gold restant
        this._playerDatas.gold = this.game.add.text(100, 65, "");
        this._playerDatas.gold.anchor.set(0.5);
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
        this._monstersLayer = this._map.createBlankLayer("monstersLayer", this.game.width, this.game.height, this._tileWidth, this._tileHeight);

        this._marker = this.game.add.graphics();
        this._marker.lineStyle(2, 0x000000, 1);
        this._marker.drawRect(0, 0, this._tileWidth, this._tileHeight);
        this._marker.endFill();
    },

    update: function() {

        if( this._playerDatas.ready ) {

            this._marker.x = this._floor.getTileX(this.game.input.activePointer.worldX) * this._tileWidth;
            this._marker.y = this._floor.getTileY(this.game.input.activePointer.worldY) * this._tileHeight;

            this._timeUtils.updateTimer(this.game, this._timer);

            for(var i=0, count=this._waves.length; i < count; i++) {
                this._waves[i].move();
            }

            if( this._shop._isATowerSelected ) {
                this._shop.updateGhostTower(this._marker, this._floor, this._tileWidth, this._tileHeight);
                this.game.input.onDown.add(this.buildTower, this);
            } else {
                this.game.input.onDown.remove(this.buildTower, this);
            }  

            this._listTowers.waitForEnemies(this._waves);
        }
    },

    buildTower: function() {
        // on récupère la position de la souris
        var pos = this.game.input.activePointer.position;

        // on récupère la case cliquée sur le calque des cases interdites
        var tileForbidden = this._map.getTileWorldXY(pos.x, pos.y, this._tileWidth, this._tileHeight, this._forbiddenTiles, false);
        
        // Si la case n'est pas interdite 
        if( tileForbidden == null ) {
            // on récupère la case cliquée sur le calque de la map
            var tileTower = this._map.getTileWorldXY(pos.x, pos.y, this._tileWidth, this._tileHeight, this._floor, false);
            var TowerposX = tileTower.x*this._tileWidth;
            var TowerposY = tileTower.y*this._tileHeight;

            // S'il n'y a pas déjà de tour construite dessus
            if( this._listTowers.isEmptyTile(TowerposX, TowerposY) ) {
                this._shop.buyTower(tileTower);
            }
        }
        console.log("nombre de tours : "+this._listTowers._towers.length);
    },

    render: function()
    {        
        this.game.debug.text(Phaser.VERSION, this.game.world.width - 55, 14, "#ffff00");
        var pos = this.game.input.activePointer.position;
        this.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 200);
    }

};

module.exports = Play;