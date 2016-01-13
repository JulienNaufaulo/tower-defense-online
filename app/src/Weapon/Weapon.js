'use strict';

function Weapon(){};

Weapon.prototype.toString = function() {
    return "Arme : "+this._name;
};

module.exports = Weapon;