'use strict';

var Map = require('./Map');

function MapCastle(name, tileWidth, tileHeight, game, socket, player){

    Map.call(this, name, tileWidth, tileHeight, game, socket, player);

    this._paths = [
        {
            "player" : "Bleu",
            "path" : [ {"x":2, "y":0}, {"x":2, "y":5}, {"x":6, "y":5}, {"x":6, "y":8}, {"x":1, "y":8}, {"x":1, "y":14}, {"x":8, "y":14}, {"x":8, "y":11}, {"x":11, "y":11}, {"x":11, "y":3} ]
        },
        {
            "player" : "Rouge",
            "path" : [ {"x":21, "y":0}, {"x":21, "y":5}, {"x":17, "y":5}, {"x":17, "y":8}, {"x":22, "y":8}, {"x":22, "y":14}, {"x":15, "y":14}, {"x":15, "y":11}, {"x":12, "y":11}, {"x":12, "y":3} ]
        }
    ];

    this._configurationWaves = [
    	{ 
    		"round" : 1, 
    		"monsters" : [
                { "type":"skeleton", "nb":5 },
    		]
    	},
        { 
            "round" : 2, 
            "monsters" : [
                { "type":"skeleton", "nb":10 }
            ]
        },
        { 
            "round" : 3, 
            "monsters" : [
                { "type":"skeleton", "nb":3 },
                { "type":"orc", "nb":3 },
                { "type":"skeleton", "nb":4 }
            ]
        },
        { 
            "round" : 4, 
            "monsters" : [
                { "type":"orc", "nb":2 },
                { "type":"skeleton", "nb":3 },
                { "type":"orc", "nb":5 }
            ]
        },
        { 
            "round" : 5, 
            "monsters" : [
                { "type":"orc", "nb":10 }
            ]
        }
    ];

};

MapCastle.prototype = Object.create(Map.prototype);
MapCastle.prototype.constructor = MapCastle;

MapCastle.prototype.init = function() {

	Map.prototype.init.call(this);

	this._map.addTilesetImage('Castle2', 'castle2');
    this._map.addTilesetImage('castle3', 'castle3');
    this._map.addTilesetImage('meta_tiles', 'metaTiles');

    this.addLayer("sol");
    this.addLayer("path");
    this.addLayer("murs");
    this.addLayer("bg porte");
    this.addLayer("cotes portes depart");
    this.addLayer("portes départ");
    this.addLayer("drapeaux");
    this.addLayer("portes fin");
    this.addLayer("objets decoratifs");
    this.addLayer("meta");
    this.addBlankLayer("monstersLayer");
    
    this.getLayerByName("meta").alpha = 0;

};

module.exports = MapCastle;