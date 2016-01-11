'use strict';

var Tower = require('./Tower');

function Peasant(id, owner, game, type, weapon, socket, listTowers){

    //  Appel du constructeur de la Tower 
    Tower.call(this, id, owner, game, type, weapon, socket, listTowers);
    
    this._range = 1;
    this._fireRate = 1000;
    this._damage = 5;

    this._anim = this._sprite.animations.add('attack', [0, 1, 2, 3, 4, 5], this._fireRate/100, false);
    this._anim.onComplete.add(this.hitEnemy, this);
};

Peasant.prototype = Object.create(Tower.prototype);
Peasant.prototype.constructor = Peasant;

module.exports = Peasant;