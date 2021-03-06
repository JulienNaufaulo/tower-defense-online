'use strict';

var Wave = require('../Monster/Wave');
var MonsterFactory = require('../Monster/MonsterFactory');
var HexaColors = require('../../utils/HexaColors');

function Map(name, tileWidth, tileHeight, game, socket, player){
    this._name = name;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._game = game;
    this._map;
    this._layers = [];
    this._waves = [];
    this._round = 0;
    this._socket = socket;
    this._player = player;
    this._monsterFactory = new MonsterFactory(this);
    this._hexa = new HexaColors();
};

Map.prototype.init = function() {
    this._map = this._game.add.tilemap('map-'+this._name);
};

Map.prototype.addLayer = function(name) {
    var layerObject = {};
    layerObject.name = name;
    layerObject.layer = this._map.createLayer(name);
    this._layers.push(layerObject);
};

Map.prototype.addBlankLayer = function(name) {
    var layerObject = {};
    layerObject.name = name;
    layerObject.layer = this._map.createBlankLayer(name, this._game.width, this._game.height, this._tileWidth, this._tileHeight);
    this._layers.push(layerObject);
};

Map.prototype.getLayerByName = function(name) {
    for(var i = 0; i < this._layers.length; i++) {
        if(this._layers[i].name == name) {
            return this._layers[i].layer;
        }
    }
}

Map.prototype.createWaves = function() {

    for(var p=0, countPlayers=this._paths.length; p < countPlayers; p++) {

        var TileYStartWave = this._paths[p].path[0].y;

        for(var i=0, nbRound = this._configurationWaves.length; i < nbRound; i++) {

            if(this._configurationWaves[i].round == this._round) {

                var wave = new Wave(this._round, this, this._paths[p].player);

                var idMonster = 1;

                for(var j=0, nbMonsters = this._configurationWaves[i].monsters.length; j < nbMonsters; j++) {

                    for(var k=0, nbMonstersType = this._configurationWaves[i].monsters[j].nb; k < nbMonstersType; k++) {

                        wave.addMonster(this._monsterFactory.getInstance(idMonster, this._configurationWaves[i].monsters[j].type, this._paths[p].path[0].x, TileYStartWave, this._paths[p].path, wave));
                        TileYStartWave -= 2;
                        idMonster++;

                    }   

                }

                this._waves.push(wave);

            }
        }
    }
}

Map.prototype.getWaveByIdAndOwner = function(idWave, owner) {
    for(var i=0, count=this._waves.length; i < count; i++) {
        if(this._waves[i]._id == idWave && this._waves[i]._owner == owner)
            return this._waves[i];
    }
}

Map.prototype.moveWaves = function() {
    for(var i=0, count=this._waves.length; i < count; i++) {
        this._waves[i].move();
    }
}

Map.prototype.goToNextRound = function() {
    if(this.areAllWavesEmpty()) {
        this._socket.emit('READY_FOR_NEXT_ROUND');
    }
}

Map.prototype.areAllWavesEmpty = function() {
    var nbEmptywaves = 0;
    for(var i=0, count=this._waves.length; i < count; i++) {
        if( this._waves[i].isEmpty() )
            nbEmptywaves++;
    }
    return nbEmptywaves == this._waves.length;
}

module.exports = Map;