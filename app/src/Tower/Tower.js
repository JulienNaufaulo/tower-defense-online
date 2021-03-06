'use strict';

var WeaponFactory = require('../Weapon/WeaponFactory');

function Tower(type, owner, map, listTowers, tile){
    this._id = listTowers.count()+1;
    this._type = type;
    this._owner = owner;
    this._map = map;
    
    this._listTowers = listTowers;

    this._tileX = tile.x;
    this._tileY = tile.y;

    var bmd = this._map._game.add.bitmapData(map._tileWidth, map._tileHeight);
    
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, map._tileWidth, map._tileHeight);
    bmd.ctx.fillStyle = map._hexa.getHexa(this._owner);
    bmd.ctx.fill();
    this._socle = this._listTowers._groupTowers.create(this._tileX*map._tileWidth, this._tileY*map._tileHeight, bmd);
    this._socle.alpha = 0.5;

    this._isShooting = false;
    this._monsterFocused = null;
    this._nextFire = 0;
};

Tower.prototype.displayRange = function() {
    if(this._graphicRange == undefined) {
        this._graphicRange = this._map._game.add.graphics();
        this._graphicRange.lineStyle(1, 0xFFCCCC, 1);
        this._graphicRange.drawRect(0, 0, (this._range*2*this._map._tileWidth)+this._map._tileWidth, (this._range*2*this._map._tileHeight)+this._map._tileHeight);
        this._graphicRange.y = this._tileY*this._map._tileHeight-(this._range*this._map._tileHeight);
        this._graphicRange.x = this._tileX*this._map._tileWidth-(this._range*this._map._tileWidth);
    } else {
        this._graphicRange.alpha = 1;
    }  
};

Tower.prototype.hideRange = function() {
    if(this._graphicRange != undefined) {
        this._graphicRange.alpha = 0;
    }
};

Tower.prototype.resetRange = function() {
    if(this._graphicRange != undefined) {
        this._graphicRange.destroy();
        this._graphicRange = null;
        this._graphicRange = this._map._game.add.graphics();
        this._graphicRange.lineStyle(1, 0xFFCCCC, 1);
        this._graphicRange.drawRect(0, 0, (this._range*2*this._map._tileWidth)+this._map._tileWidth, (this._range*2*this._map._tileHeight)+this._map._tileHeight);
        this._graphicRange.y = this._tileY*this._map._tileHeight-(this._range*this._map._tileHeight);
        this._graphicRange.x = this._tileX*this._map._tileWidth-(this._range*this._map._tileWidth);
    }
};

Tower.prototype.updateRange = function(marker) {
    this._graphicRange.drawRect(0, 0, (this._range*2*this._map._tileWidth)+this._map._tileWidth, (this._range*2*this._map._tileHeight)+this._map._tileHeight);
    this._graphicRange.x = marker.x-(this._range*this._map._tileWidth);
    this._graphicRange.y = marker.y-(this._range*this._map._tileHeight);
};

Tower.prototype.waitForEnemies = function(waves) {
    if(this._monsterFocused != null) {
        if(!this.isMonsterInRange(this._monsterFocused) || this._monsterFocused._isDead) {
            this._monsterFocused = null;
        }
    } else {
        for(var i=0, count=waves.length; i < count; i++) {
            for(var j=0, nbMonsters=waves[i]._monsters.length; j < nbMonsters; j++) {
                if(this._monsterFocused == null && waves[i]._monsters[j]._sprite.alpha == 1) {
                    if(this.isMonsterInRange(waves[i]._monsters[j])) {
                        this._monsterFocused = waves[i]._monsters[j];
                    }
                }
            }
        }
    }
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
        this._nextFire = this._map._game.time.now + (this._fireRate+(this._weapon._weight*100));
        this._anim.play('attack');
    }
};

Tower.prototype.hitEnemy = function() {
    if(this._map._player._color == this._owner) {
        if(this._monsterFocused != null && !this._monsterFocused._isDead) {
            this._monsterFocused._currentHP -= this._weapon._damage+this._strengh;
            if(this._monsterFocused._currentHP <= 0 ) {
                    this._map._socket.emit('MONSTER_DEAD', {
                        "idMonster" : this._monsterFocused._id, 
                        "idWave" : this._monsterFocused._wave._id, 
                        "idTower" : this._id, 
                        "ownerWave" : this._monsterFocused._wave._owner, 
                        "price" : this._monsterFocused._price
                    });
                
                this._monsterFocused.die();
                this._monsterFocused = null;
            } else {
                this._monsterFocused._healthBar.width = this._monsterFocused._currentHP*this._monsterFocused._healthBar.width/this._monsterFocused._maxHP;
                this._map._socket.emit('MONSTER_HIT', {
                    "idMonster" : this._monsterFocused._id, 
                    "newLifeMonster":this._monsterFocused._currentHP,
                    "idWave" : this._monsterFocused._wave._id,
                    "ownerWave" : this._monsterFocused._wave._owner
                });
            }
        }
    }
    this._anim.stop(1);
    this._isShooting = false;
}

Tower.prototype.setWeapon = function(weapon) {
    this._weapon = weapon;
    this._range = this._weapon._range;
    this.resetRange();
    this._sprite.loadTexture(this._type+"-"+this._weapon._name, 0, true);
    this._anim.speed = (this._fireRate/100)-(this._weapon._weight/2);
};

module.exports = Tower;