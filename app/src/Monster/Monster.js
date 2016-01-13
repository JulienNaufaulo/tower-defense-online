'use strict';

function Monster(id, type, tileX, tileY, path, map, wave){
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

            that._tileX = newTileX;
            that._tileY = newTileY;

            that._map._socket.emit('SPRITE_TWEEN_FINISHED', {"idMonster" : that._id, "currentIndex" : that._currentIndex, "tileX" : that._tileX, "tileY" : that._tileY, "idWave" : that._wave._id, "owner" : that._wave._owner});
            
            if( that._currentIndex+1 == that._path.length) {
                that._currentIndex=0;
                that.hide();
                if(!that._isDead) {
                    that._map._socket.emit('LIFE_LOST', that._wave._owner);
                }
            }
            else 
                that._currentIndex++;
        });

        this._tween.start();
    }

    this._healthBar.x = this._sprite.x+2;
    this._healthBar.y = this._sprite.y-25;
};

Monster.prototype.getDuree = function(newTileX , newTileY) {
    var distance = Phaser.Math.distance(this._tileX , this._tileY , newTileX , newTileY);
    var duree = Math.round((350*distance)-(10*this._moveSpeed));
    return duree;
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
    if(!this._isDead) {
        this._sprite.alpha = 1;
        this._healthBar.alpha = 1;
    }  
}

Monster.prototype.die = function() {
    this._isDead = true;
    this._wave.removeAMonster(this._id);
}

module.exports = Monster;