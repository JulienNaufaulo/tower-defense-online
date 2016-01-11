'use strict';

function Tower(owner, type, weapon, map, listTowers, tile){
    this._id = listTowers.count()+1;
    this._owner = owner;
    this._map = map;
    this._type = type;
    this._weapon = weapon;
    this._listTowers = listTowers;

    this._tileX = tile.x;
    this._tileY = tile.y;

    this._sprite = this._listTowers._groupTowers.create(this._tileX*map._tileWidth, this._tileY*map._tileHeight, this._type+"-"+this._weapon);
    this._sprite.alpha = 1;
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;
    this._sprite.anchor.setTo(0.2, 0.5);
    this._map._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;
    this._isActive = false;

    this._graphicRange = map._game.add.graphics();
    this._graphicRange.lineStyle(1, 0xFFCCCC, 1);

    this._isShooting = false;
    this._monsterFocused = null;
    this._nextFire = 0;
};

Tower.prototype.drawRange = function(marker, map) {
    this._graphicRange.drawRect(0, 0, (this._range*2*map._tileWidth)+map._tileWidth, (this._range*2*map._tileHeight)+map._tileHeight);
    this._graphicRange.x = marker.x-(this._range*map._tileWidth);
    this._graphicRange.y = marker.y-(this._range*map._tileHeight);
};

Tower.prototype.delete = function() {
    this._graphicRange.drawRect(0, 0, (this._range*2*tileWidth)+tileWidth, (this._range*2*tileHeight)+tileHeight);
    this._graphicRange.x = marker.x-(this._range*tileWidth);
    this._graphicRange.y = marker.y-(this._range*tileHeight);
};

Tower.prototype.waitForEnemies = function(waves) {
    if(this._monsterFocused != null) {
        if(!this.isMonsterInRange(this._monsterFocused)) {
            this._monsterFocused = null;
        }
    } else {
        for(var i=0, count=waves.length; i < count; i++) {
            for(var j=0, nbMonsters=waves[i]._monsters.length; j < nbMonsters; j++) {
                if(this._monsterFocused == null && waves[i]._monsters[j]._sprite.alpha == 1) {
                    if(this.isMonsterInRange(waves[i]._monsters[j])) {
                        this._monsterFocused = waves[i]._monsters[j];
                        console.log(this._monsterFocused._id);
                        console.log(waves[i]._monsters.length);
                    }
                }
            }
        }
    }
    

    
            // if(!this._isShooting) {
            //     if(this._monsterFocused == null && waves[i]._monsters[j]._sprite.alpha == 1) {
            //         if(this.isMonsterInRange(waves[i]._monsters[j])) {
            //             console.log("monstre "+waves[i]._monsters[j]._id+" est dans la range");
            //             this._monsterFocused = waves[i]._monsters[j];
            //             this.shoot(waves[i]._monsters[j], waves[i]);
            //         }
            //     }
            //     else if(this._monsterFocused != null && waves[i]._monsters[j]._sprite.alpha == 1) {
            //         if(waves[i]._monsters[j]._id == this._monsterFocused._id) {
            //             if(this.isMonsterInRange(waves[i]._monsters[j])) {
            //                 console.log("monstre "+waves[i]._monsters[j]._id+" est dans la range");
            //                 this._monsterFocused = waves[i]._monsters[j];
            //                 this.shoot(waves[i]._monsters[j], waves[i]);
            //             } else {
            //                 this._monsterFocused = null;
            //             }
            //         }
            //     }
            // }
  
};

Tower.prototype.isMonsterInRange = function(monster) {
    var tile = this._map._map.getTileWorldXY(monster._sprite.x, monster._sprite.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
    var distance = Math.round(Phaser.Math.distance(this._tileX, this._tileY, tile.x, tile.y));
    return distance <= this._range;
};

Tower.prototype.shoot = function() {
    if (this._map._game.time.now > this._nextFire && !this._isShooting && this._monsterFocused != null) {
        var that = this;
        this._isShooting = true;
        this._nextFire = this._map._game.time.now + this._fireRate;
        this._anim.play('attack');
    }
};

Tower.prototype.hitEnemy = function() {
    if(this._monsterFocused != null) {
        this._monsterFocused._currentHP -= this._damage;
        if(this._monsterFocused._currentHP <= 0 ) {
            console.log("monstre "+this._monsterFocused._id+" mort !");
            this._monsterFocused._healthBar.width = 0;
            this._monsterFocused._healthBar.alpha = 0;
            this._monsterFocused._sprite.alpha = 0;
            this._monsterFocused._wave.removeAMonster(this._monsterFocused._id);
            this._monsterFocused = null;
        } else {
            this._monsterFocused._healthBar.width = this._monsterFocused._currentHP*this._monsterFocused._healthBar.width/this._monsterFocused._maxHP;
        }
    }
    this._anim.stop(1);
    this._isShooting = false;
}

module.exports = Tower;