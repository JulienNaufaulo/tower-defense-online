'use strict';

var Monster = require('./Monster');

function Skeleton(id, type, tileX, tileY, path, map, wave){

    Monster.call(this, id, type, tileX, tileY, path, map, wave); 

    this._sprite.animations.add('top', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
    this._sprite.animations.add('right', [25, 26, 27, 28, 29, 30, 31, 32, 33], 15, true);
    this._sprite.animations.add('bottom', [8, 9, 10, 11, 12, 13, 14, 15], 20, true);
    this._sprite.animations.add('left', [16, 17, 18, 19, 20, 21, 22, 23, 24], 15, true);

    this._maxHP = 10;
    this._currentHP = 10;

    this._moveSpeed = 1;
};

Skeleton.prototype = Object.create(Monster.prototype);
Skeleton.prototype.constructor = Skeleton;

// Skeleton.prototype.create = function(posX, posY) {

//     Monster.prototype.create.call(this, posX, posY);

    
// };


module.exports = Skeleton;