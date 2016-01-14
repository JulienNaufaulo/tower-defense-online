'use strict';

var MapCastle = require('./MapCastle');

function MapFactory(name, tileWidth, tileHeight, game, socket, player){
    this._name = name;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._game = game;
    this._socket = socket;
    this._player = player;
};

MapFactory.prototype.getInstance = function() {
    switch(this._name) {
        case "castle":
            return new MapCastle(this._name, this._tileWidth, this._tileHeight, this._game, this._socket, this._player);
            break;
    }
};

module.exports = MapFactory;