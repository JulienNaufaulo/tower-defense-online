'use strict';

var NormalStateMonster = require('../StateMonster/NormalStateMonster');
var FrozenStateMonster = require('../StateMonster/FrozenStateMonster');

function Monster(id, type, tileX, tileY, path, map, wave, maxHp, currentHp, moveSpeed, price){
    this._id = id; 
    this._map = map;
    this._tileX = tileX;
    this._tileY = tileY;
    this._path = path;
    this._wave = wave;
    this._type = type;

    this._sprite = this._wave._groupMonsters.create(tileX*this._map._tileWidth, tileY*this._map._tileHeight, this._type);
    // this._map._game.physics.arcade.enable(this._sprite);
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;
    this._sprite.anchor.setTo(-0.2, 0.5);
    this._sprite.alpha = 0;
    this._tween = null;
    this._currentIndex = 1;

    this._healthBar = this._map._game.add.sprite(tileX*this._map._tileWidth, tileY*this._map._tileHeight, "healthbar");
    this._healthBar.width = 30;
    // this._map._game.physics.arcade.enable(this._healthBar);

    this._cropRect = new Phaser.Rectangle(0, 0, 0, this._healthBar.height);
    this._healthBar.alpha = 0;
    this._isDead = false;

    this._maxHP = maxHp;
    this._currentHP = currentHp;
    this._moveSpeed = moveSpeed;
    this._price = price;

    this._states = {
        "normal" : new NormalStateMonster(this),
        "frozen" : new FrozenStateMonster(this)
    }

    this._currentState = this._states.normal;
};

Monster.prototype.move = function() {
    if( this._tween == null || !this._tween.isRunning) {
 
        var that = this;

        var newTileX = this._path[this._currentIndex].x;
        var newTileY = this._path[this._currentIndex].y;

        var duree = this.getDuree(newTileX, newTileY);

        this.playAnimation(newTileX, newTileY);

        this._tween = this._map._game.add.tween(this._sprite).to({x:newTileX*this._map._tileWidth, y:newTileY*this._map._tileHeight}, duree);

        this._tween.onComplete.add(function(){

            that._currentState = that._states.normal;

            that._tileX = newTileX;
            that._tileY = newTileY;

            that._map._socket.emit('SPRITE_TWEEN_FINISHED', {"idMonster" : that._id, "currentIndex" : that._currentIndex, "tileX" : that._tileX, "tileY" : that._tileY, "idWave" : that._wave._id, "owner" : that._wave._owner});
            
            if( that._currentIndex+1 == that._path.length) {
                that._currentIndex=0;
                that.hide();
                that._map._socket.emit('LIFE_LOST', that._wave._owner);
               
            }
            else 
                that._currentIndex++;
        });

        this._tween.start();
    }

    this._healthBar.x = this._sprite.x+2;
    this._healthBar.y = this._sprite.y-25;
};

Monster.prototype.getDistance = function(newTileX , newTileY) {
    var tile = this._map._map.getTileWorldXY(this._sprite.x, this._sprite.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
    if( tile == null) {
        tile = {x: this._tileX, y: this._tileY};
    }
    var distance = Phaser.Math.distance(tile.x, tile.y, newTileX, newTileY);
    return distance;
};

Monster.prototype.getDuree = function(newTileX , newTileY) {
    var distance = this.getDistance(newTileX , newTileY);
    return this._currentState.getDuree(distance);
};

Monster.prototype.playAnimation = function(newX, newY) {
    if(this._tileX < newX)
        this._sprite.animations.play('right');
    else if(this._tileX > newX)
        this._sprite.animations.play('left');
    else if(this._tileY < newY)
        this._sprite.animations.play('bottom');
    else
        this._sprite.animations.play('top');
};

Monster.prototype.hide = function() {
    this._sprite.alpha = 0;
    this._healthBar.alpha = 0;
}

Monster.prototype.reveal = function() {
    this._sprite.alpha = 1;
    this._healthBar.alpha = 1;
}

Monster.prototype.die = function() {
    this._wave.removeAMonster(this._id);
}

module.exports = Monster;