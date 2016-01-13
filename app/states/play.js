'use strict';

var PlayNetworkManagerClient = require('../src/NetworkManagerClient/PlayNetworkManagerClient');
var Player = require('../src/Player/Player');
var Shop = require('../src/Shop/Shop');
var Tower = require('../src/Tower/Tower');
var ListTowers = require('../src/Tower/ListTowers');
var MapFactory = require('../src/Map/MapFactory');
var TimeUtils = require('../../utils/TimeUtils');

function Play(){
	this._socket;
    this._playNetworkManagerClient;
    this._map;
    this._listTowers;
    this._timer;
    this._timeUtils = new TimeUtils();
    this._player = new Player();
    this._marker;
    this._shop;
}

Play.prototype = {

	init: function(socket) {
		this._socket = socket;
        this.game.forceSingleUpdate = true;
	},

    create: function() {

        // Création de la map
        var mapFactory = new MapFactory("castle", 32, 32, this.game, this._socket);
        this._map = mapFactory.getInstance();
        this._map.init();
        this._map.createWaves();

        // Initialisation du joueur
        this._player.init(this.game);

        this._listTowers = new ListTowers(this.game);
        this._shop = new Shop(this._listTowers, this._player, this._map);

        // Création du marker
        this._marker = this.game.add.graphics();
        this._marker.lineStyle(2, 0x000000, 1);
        this._marker.drawRect(0, 0, this._map._tileWidth, this._map._tileHeight);
        this._marker.endFill();

        this._timer = this.game.add.text(this.game.world.centerX-43, 0, "00:00:00", {
            font: "22px Arial",
            fill: "#ffffff"
        });

        this._playNetworkManagerClient = new PlayNetworkManagerClient(this._map, this._player, this._listTowers);

    	this._socket.emit('READY_TO_START');
    	
    },

    update: function() {

        if( this._player.ready ) {

            // Update de la position du curseur
            this._marker.x = this._map.getLayerByName("sol").getTileX(this.game.input.activePointer.worldX) * this._map._tileWidth;
            this._marker.y = this._map.getLayerByName("sol").getTileY(this.game.input.activePointer.worldY) * this._map._tileHeight;

            // Update du timer de jeu
            this._timeUtils.updateTimer(this.game, this._timer);

            // Lancement des vagues de creeps
            this._map.moveWaves();

            // Action dans le Shop
            if( this._shop._isATowerSelected ) {
                this._shop.updateGhostTower(this._marker);
                this.game.input.onDown.add(this.buildTower, this);
            } else {
                this.game.input.onDown.remove(this.buildTower, this);
            }  

            // Tours en attente d'ennemis
            this._listTowers.waitForEnemies(this._map._waves);

            // Tours tirent sur les ennemis en focus
            this._listTowers.shootEnemies();
        }
    },

    buildTower: function() {
        // on récupère la position de la souris
        var pos = this.game.input.activePointer.position;

        // on récupère la case cliquée sur le calque des cases interdites
        var tileForbidden = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("meta"), false);
        
        // Si la case n'est pas interdite 
        if( tileForbidden == null ) {

            // on récupère la case cliquée sur le calque de la map
            var tileTower = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);

            // S'il n'y a pas déjà de tour construite dessus
            if( this._listTowers.isEmptyTile(tileTower) ) {
                this._shop.buyTower(tileTower);
            }
        }
        console.log("nombre de tours : "+this._listTowers._towers.length);
    },

    render: function()
    {        
        // var pos = this.game.input.activePointer.position;
        // var tileTower = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
        // this.game.debug.text("x:" + tileTower.x + " y:" + tileTower.y, 180, 200);
    }

};

module.exports = Play;