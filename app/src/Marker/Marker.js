'use strict';

function Marker(game, map){
    this._game = game;
    this._cursor = this._game.add.graphics();
    this._marker.lineStyle(2, 0x000000, 1);
    this._marker.drawRect(0, 0, map._tileWidth, map._tileHeight);
    this._marker.endFill();
};

Marker.prototype.init = function() {
    this._game.add.graphics();
    this._marker.lineStyle(2, 0x000000, 1);
    this._marker.drawRect(0, 0, this._map._tileWidth, this._map._tileHeight);
    this._marker.endFill();
};

module.exports = Marker;