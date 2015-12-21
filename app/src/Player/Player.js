'use strict';

function Player(id, color){
	this._id = id;
    this._color = color;
}

Player.prototype.toString = function() {
    return "Joueur "+this._color;
};

module.exports = Player;