'use strict';

var Weapon = require('./Weapon');

function Fists(){
	Weapon.call();
	this._name = "Fists";
	this._damage = 0;
	this._weight = 0;
	this._range = 1;
};

Fists.prototype = Object.create(Weapon.prototype);
Fists.prototype.constructor = Fists;

module.exports = Fists;