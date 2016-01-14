'use strict';

function Player(id, color, idRoom){
	this._id = id;
    this._color = color;
    this._idRoom = idRoom;
    this._ready = false;
    this._playing = false;
    this._life = 10;
    this._gold = 10;
}

Player.prototype.buy = function(tower) {
    this._gold -= tower._cost;
    this._goldTxt.setText(this._gold+" gold restant");
};

Player.prototype.toString = function() {
    return "Joueur "+this._color+", Room "+(this._idRoom);
};

module.exports = Player;