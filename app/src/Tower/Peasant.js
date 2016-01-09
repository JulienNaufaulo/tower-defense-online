'use strict';

var Tower = require('./Tower');

function Peasant(id, owner, game, type, weapon, socket, listTowers){

    //  Appel du constructeur de la Tower 
    Tower.call(this, id, owner, game, type, weapon, socket, listTowers);
    this._range = 1;
    this._fireRate = 900;
};

Peasant.prototype = Object.create(Tower.prototype);
Peasant.prototype.constructor = Peasant;

module.exports = Peasant;