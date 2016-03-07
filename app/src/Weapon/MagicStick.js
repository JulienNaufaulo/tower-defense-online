'use strict';

var Weapon = require('./Weapon');

function MagicStick(){
	Weapon.call();
	this._name = "MagicStick";
	this._damage = 0;
	this._weight = 2;
	this._range = 1;
	this._cost = 0;
};

MagicStick.prototype = Object.create(Weapon.prototype);
MagicStick.prototype.constructor = MagicStick;

module.exports = MagicStick;