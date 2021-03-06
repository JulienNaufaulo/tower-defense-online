'use strict';

function ListTowers(game){
    this._towers = [];
    this._groupTowers = game.add.group();
};

ListTowers.prototype.add = function(tower) {
    this._towers.push(tower);
    this._groupTowers.sort('y', Phaser.Group.SORT_ASCENDING);
};

ListTowers.prototype.isEmptyTile = function(tileTower) {
    for(var i=0, count=this._towers.length; i < count; i++) {
        if(this._towers[i]._tileX == tileTower.x && this._towers[i]._tileY == tileTower.y) {
            return false;
        }
    }
    return true;
};

ListTowers.prototype.getTowerTile = function(tileTower) {
    for(var i=0, count=this._towers.length; i < count; i++) {
        if(this._towers[i]._tileX == tileTower.x && this._towers[i]._tileY == tileTower.y) {
            return this._towers[i];
        }
    }
};

ListTowers.prototype.count = function() {
    return this._towers.length;
};

ListTowers.prototype.hideRange = function() {
    for(var i=0, count=this._towers.length; i < count; i++) {
        this._towers[i].hideRange();
    }
};

ListTowers.prototype.waitForEnemies = function(waves) {
    for(var i=0, count=this._towers.length; i < count; i++) {
        this._towers[i].waitForEnemies(waves);
    }
};

ListTowers.prototype.shootEnemies = function() {
    for(var i=0, count=this._towers.length; i < count; i++) {
        if(this._towers[i]._monsterFocused != null)
            this._towers[i].shoot();
    }
};

module.exports = ListTowers;