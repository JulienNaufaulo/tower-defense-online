'use strict';

function ListTowers(game){
    this._towers = [];
    this._groupTowers = game.add.group();
};

ListTowers.prototype.add = function(tower) {
    this._towers.push(tower);
};

ListTowers.prototype.isEmptyTile = function(posX, posY) {
    for(var i=0, count=this._towers.length; i < count; i++) {
        if(this._towers[i]._sprite.x == posX && this._towers[i]._sprite.y == posY) {
            console.log("Il y a déjà une tour construite ici !");
            return false;
        }
    }
    console.log("Aucune tour n'est construite ici ! OK");
    return true;
};

ListTowers.prototype.count = function() {
    return this._towers.length;
};

ListTowers.prototype.assault = function(waves) {
    for(var i=0, count=this._towers.length; i < count; i++) {
        this._towers[i].assault(waves);
    }
};

module.exports = ListTowers;