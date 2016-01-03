'use strict';

function Player(id, color, idRoom){
	this._id = id;
    this._color = color;
    this.idRoom = idRoom;
    this._ready = false;
    this._playing = false;
    this._life = 10;
    this._gold = 100;
}

Player.prototype.toString = function() {
    return "Joueur "+this._color+", Room "+(this.idRoom);
};

module.exports = Player;