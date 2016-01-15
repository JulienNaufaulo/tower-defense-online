'use strict';

var Weapon = require('./Weapon');

function Stick(){
	Weapon.call();
	this._name = "Stick";
	this._damage = 5;
	this._weight = 2;
	this._range = 1;
};

Stick.prototype = Object.create(Weapon.prototype);
Stick.prototype.constructor = Stick;

module.exports = Stick;