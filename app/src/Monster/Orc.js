'use strict';

var Monster = require('./Monster');

function Orc(id, type, tileX, tileY, path, map, wave){

    Monster.call(this, id, type, tileX, tileY, path, map, wave, 30, 2, 2); 

    this._sprite.animations.add('top', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
    this._sprite.animations.add('right', [27, 28, 29, 30, 31, 32, 33, 34], 15, true);
    this._sprite.animations.add('bottom', [17, 18, 19, 20, 21, 22, 23, 24, 25], 20, true);
    this._sprite.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15, 16], 15, true);
};

Orc.prototype = Object.create(Monster.prototype);
Orc.prototype.constructor = Orc;

module.exports = Orc;