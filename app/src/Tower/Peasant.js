'use strict';

var Tower = require('./Tower');

function Peasant(type, owner, map, listTowers, tile){

    //  Appel du constructeur de la Tower 
    Tower.call(this, type, owner, map, listTowers, tile);
    
    this._range = 1;
    this._fireRate = 800;
    this._strengh = 5;
    this._cost = 5;

    this._anim = this._sprite.animations.add('attack', [0, 1, 2, 3, 4, 5], (this._fireRate/100)-this._weapon._weight/10, false);
    // this._anim = this._sprite.animations.add('attack', [0, 1, 2, 3, 4, 5], (this._fireRate+(this._weapon._weight*50))/100, false);
    this._anim.onComplete.add(this.hitEnemy, this);
};

Peasant.prototype = Object.create(Tower.prototype);
Peasant.prototype.constructor = Peasant;

module.exports = Peasant;