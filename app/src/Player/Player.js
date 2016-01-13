'use strict';

function Player(id, color, idRoom){
	this._id = id;
    this._color = color;
    this.idRoom = idRoom;
    this._ready = false;
    this._playing = false;
    this._life = 10;
    this._gold = 10;
}

Player.prototype.init = function(game) {
    this._lifeTxt = game.add.text(100, 25, this._life);
    this._lifeTxt.anchor.set(0.5);
    this._lifeTxt.font = 'Arial';
    this._lifeTxt.fontWeight = 'bold';
    this._lifeTxt.fontSize = 20;
    this._lifeTxt.fill = "#000000";

    this._goldTxt = game.add.text(100, 65, this._gold);
    this._goldTxt.anchor.set(0.5);
    this._goldTxt.font = 'Arial';
    this._goldTxt.fontWeight = 'bold';
    this._goldTxt.fontSize = 20;
    this._goldTxt.fill = "#000000";
};

Player.prototype.buy = function(tower) {
    this._gold -= tower._cost;
    this._lifeTxt.setText(this._gold+" gold restant");
};

Player.prototype.toString = function() {
    return "Joueur "+this._color+", Room "+(this.idRoom);
};

module.exports = Player;