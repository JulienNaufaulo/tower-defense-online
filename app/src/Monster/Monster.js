'use strict';

function Monster(id, layer, game, moveSpeed, path, socket, wave, type){
    this._id = id; 
    this._layer = layer; 
    this._tileX = null;
    this._tileY = null;
    this._moveSpeed = moveSpeed;
    this._path = path;
    this._currentIndex = 1;
    this._game = game;
    this._sprite = null;
    this._tween = null;
    this._socket = socket;
    this._wave = wave;
    this._type = type;
};

Monster.prototype.create = function(posX, posY) {
    this._tileX = posX;
    this._tileY = posY;

    this._sprite = this._game.add.sprite(posX*32, posY*32, this._type);
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;
    this._sprite.anchor.setTo(0, 0.5);

    this._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;
};

Monster.prototype.move = function() {
    if( this._tween == null || !this._tween.isRunning) {
 
        var that = this;

        var newTileX = this._path[this._currentIndex].x;
        var newTileY = this._path[this._currentIndex].y;

        var duree = this.getDuree(newTileX, newTileY);

        this.playAnimation(newTileX, newTileY);

        this._tween = this._game.add.tween(this._sprite).to({x:newTileX*32,y:newTileY*32}, duree);
        this._tween.onComplete.add(function(){

            that._tileX = newTileX;
            that._tileY = newTileY;

            that._socket.emit('SPRITE_TWEEN_FINISHED', {"idMonster" : that._id, "currentIndex" : that._currentIndex, "tileX" : that._tileX, "tileY" : that._tileY, "idWave" : that._wave._id});
            
            if( that._currentIndex+1 == that._path.length) {
                that._currentIndex=0;
                that._socket.emit('LIFE_LOST', that._wave._id);
            }
            else 
                that._currentIndex++;
        });

        this._tween.start();
    }
    
};

Monster.prototype.getDuree = function(newTileX , newTileY) {
    var distance = Phaser.Math.distance(this._tileX , this._tileY , newTileX , newTileY);
    var duree = Math.round((300*distance)-(10*this._moveSpeed));
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
}

Monster.prototype.reveal = function() {
    this._sprite.alpha = 1;
}

Monster.prototype.die = function() {
    this._sprite.kill();
}


module.exports = Monster;