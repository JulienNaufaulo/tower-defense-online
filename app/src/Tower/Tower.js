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
    for(var i=0, count=waves.length; i < count; i++) {
        for(var j=0, nbMonsters=waves[i]._monsters.length; j < nbMonsters; j++) {
            if(!waves[i]._monsters[j]._isDead && waves[i]._monsters[j]._sprite.alpha == 1) {
                if(this.isMonsterInRange(waves[i]._monsters[j])) {
                    this.shoot(waves[i]._monsters[j]);
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

Tower.prototype.shoot = function(monster) {

    if (this._map._game.time.now > this._nextFire) {

        var that = this;
        this._isShooting = true;
        this._nextFire = this._map._game.time.now + this._fireRate;
        this._anim.play('attack');

        this._anim.onComplete.add(function() {

            monster._currentHP -= that._damage;

            if(monster._currentHP <= 0 ) {
                monster._healthBar.width = 0;
                monster._healthBar.alpha = 0;
                monster._sprite.alpha = 0;
                monster._isDead = true;
                that._monsterFocused = null;
                
            } else {
                monster._healthBar.width = monster._currentHP*monster._healthBar.width/monster._maxHP;
            }
            console.log("attaque contre le monstre "+monster._id+" terminé !");
            that._anim.stop(1);
            that._isShooting = false;
        });
    }
};

module.exports = Tower;