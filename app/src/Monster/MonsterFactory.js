'use strict';

var Skeleton = require('./Skeleton');
var Orc = require('./Orc');
var Quickos = require('./Quickos');

function MonsterFactory(map){
    this._map = map;
};

MonsterFactory.prototype.getInstance = function(i, type, tileX, tileY, path, wave) {
    switch(type) {
        case "skeleton":
            return new Skeleton(i, type, tileX, tileY, path, this._map, wave);
            break;
        case "orc":
            return new Orc(i, type, tileX, tileY, path, this._map, wave);
            break;
        case "quickos":
            return new Quickos(i, type, tileX, tileY, path, this._map, wave);
            break;
    }
};

module.exports = MonsterFactory;