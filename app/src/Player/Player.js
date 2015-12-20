'use strict';

function Player(color){
    this._color = color;
}

Player.prototype.toString = function () {
    return "Joueur "+this._color;
};

module.exports = Player;