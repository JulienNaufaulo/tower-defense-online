'use strict';

function Player(id, color, idRoom){
	this._id = id;
    this._color = color;
    this.idRoom = idRoom;
}

Player.prototype.toString = function() {
    return "Joueur "+this._color+", Room "+(this.idRoom+1);
};

module.exports = Player;