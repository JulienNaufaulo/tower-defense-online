'use strict';

function FrozenStateMonster(monster){
    this._monster = monster;
};

FrozenStateMonster.prototype.getDuree = function(distance) {
    var duree = ((750*distance)*(1-(this._monster._moveSpeed/10))*2);
    return duree;
};

module.exports = FrozenStateMonster;