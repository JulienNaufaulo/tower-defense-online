'use strict';

var Weapon = require('./Weapon');

function Bow(){
	Weapon.call();
	this._name = "Bow";
	this._damage = 7;
	this._weight = 2;
	this._range = 2;
	this._cost = 15;
};

Bow.prototype = Object.create(Weapon.prototype);
Bow.prototype.constructor = Bow;

module.exports = Bow;