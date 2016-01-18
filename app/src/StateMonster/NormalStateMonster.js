'use strict';

function NormalStateMonster(monster){
    this._monster = monster;
};

NormalStateMonster.prototype.getDuree = function(distance) {
    var duree = (750*distance)*(1-(this._monster._moveSpeed/10));
    return duree;
};

module.exports = NormalStateMonster;