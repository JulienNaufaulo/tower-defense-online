'use strict';

function Tower(id, owner, game, type, weapon, socket, listTowers){
    this._id = id;
    this._owner = owner;
    this._game = game;
    this._type = type;
    this._weapon = weapon;
    this._listTowers = listTowers;
    this._sprite = this._listTowers._groupTowers.create(-50, -50, this._type+"-"+this._weapon);
    this._sprite.alpha = 0;
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;
    this._sprite.anchor.setTo(0.2, 0.5);
    this._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;
    this._isActive = false;
    this._graphicRange = this._game.add.graphics();
    this._graphicRange.lineStyle(1, 0xFFCCCC, 1);
    this._monsterFocused = null;
    this._fireRate = 1000;
    this._nextFire = 0;
};

Tower.prototype.create = function(posX, posY) {
    this._sprite.x = posX;
    this._sprite.y = posY;
    this._listTowers.add(this);
    this._listTowers._groupTowers.sort('y', Phaser.Group.SORT_ASCENDING);
    this._sprite.alpha = 1;
};

Tower.prototype.drawRange = function(marker, tileWidth, tileHeight, floorLayer) {
    this._graphicRange.drawRect(0, 0, (this._range*2*tileWidth)+tileWidth, (this._range*2*tileHeight)+tileHeight);
    this._graphicRange.x = marker.x-(this._range*tileWidth);
    this._graphicRange.y = marker.y-(this._range*tileHeight);
};

Tower.prototype.delete = function() {
    this._graphicRange.drawRect(0, 0, (this._range*2*tileWidth)+tileWidth, (this._range*2*tileHeight)+tileHeight);
    this._graphicRange.x = marker.x-(this._range*tileWidth);
    this._graphicRange.y = marker.y-(this._range*tileHeight);
};

Tower.prototype.assault = function(waves) {
    var test = false;
    for(var i=0, count=waves.length; i < count; i++) {
        for(var j=0, nbMonsters=waves[i]._monsters.length; j < nbMonsters; j++) {
            var monster = waves[i]._monsters[j];
            if(this._monsterFocused == null) {
                if(this.isMonsterInRange(monster)) {
                    // console.log(monster._id+" : "+this._game.physics.arcade.distanceBetween(this._sprite, monster._sprite));
                    this._monsterFocused = monster;
                    this.shoot(monster);
                }
            } else {
                if(this.isMonsterInRange(this._monsterFocused)) {
                    // console.log(monster._id+" : "+this._game.physics.arcade.distanceBetween(this._sprite, monster._sprite));
                    this.shoot(monster);
                } else {
                    this._monsterFocused == null;
                }
            }
            
        }
    }
};

Tower.prototype.isMonsterInRange = function(monster) {
    var distance = this._game.physics.arcade.distanceBetween(this._sprite, monster._sprite);
    return distance <= (this._range*32)+16;
};

Tower.prototype.shoot = function(monster) {
    if (this._game.time.now > this._nextFire) {
        this._nextFire = this._game.time.now + this._fireRate;
        console.log("ATTACK");
    }
    // console.log("tour "+this._id+" SHOOT !");
};

module.exports = Tower;