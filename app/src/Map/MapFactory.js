'use strict';

var MapCastle = require('./MapCastle');

function MapFactory(game, socket, player){
    this._game = game;
    this._socket = socket;
    this._player = player;
};

MapFactory.prototype.getInstance = function(name) {
    switch(name) {
        case "castle":
            return new MapCastle(name, 32, 32, this._game, this._socket, this._player);
            break;
    }
};

module.exports = MapFactory;