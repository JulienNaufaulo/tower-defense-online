'use strict';

function Monster(id, game, moveSpeed, path, socket, idWave, type){
    this._id = id; 
    this._x = null;
    this._y = null;
    this._moveSpeed = moveSpeed;
    this._path = path;
    this._currentIndex = 1;
    this._game = game;
    this._sprite = null;
    this._tween = null;
    this._socket = socket;
    this._idWave = idWave;
    this._type = type;
};

Monster.prototype.create = function(posX, posY) {
    this._x = posX;
    this._y = posY;

    this._sprite = this._game.add.sprite(posX, posY, this._type);
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;

    this._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;

    // this._sprite.animations.add('top', [12, 13, 14, 15], 10, true);
    // this._sprite.animations.add('right', [4, 5, 6, 7], 10, true);
    // this._sprite.animations.add('bottom', [0, 1, 2, 3], 10, true);
    // this._sprite.animations.add('left', [8, 9, 10, 11], 10, true);
};

Monster.prototype.move = function() {
    if( this._tween == null || !this._tween.isRunning) {

        var that = this;

        var newX = this._path[this._currentIndex].x;
        var newY = this._path[this._currentIndex].y;

        var duree = this.getDuree(this._x, this._y, newX, newY);

        this.playAnimation(newX, newY);

        this._tween = this._game.add.tween(this._sprite).to({x:newX,y:newY}, duree);
        this._tween.onComplete.add(function(){

            that._socket.emit('SPRITE_TWEEN_FINISHED', {"idMonster" : that._id, "currentIndex" : that._currentIndex, "posX" : that._sprite.x, "posY" : that._sprite.y, "idWave" : that._idWave});
            
            that._x = newX; 
            that._y = newY;

            if( that._currentIndex+1 == that._path.length) {
                that._currentIndex=0;
                that._socket.emit('LIFE_LOST', that._idWave);
            }
            else 
                that._currentIndex++;
        });

        this._tween.start();
    }
    
};

Monster.prototype.getDistanceBetweenPoints = function(x, y, newX, newY) {
    var distance = 0;
    if(x > newX) {
        distance += x-newX;
    } else if(x < newX) {
        distance += newX-x;
    }
    if(y > newY) {
        distance += 1.1*(y-newY);
    } else if(y < newY) {
        distance += 1.1*(newY-y);
    }

    return distance;
};

Monster.prototype.getDuree = function(x, y, newX, newY) {
    var distance = this.getDistanceBetweenPoints(this._x, this._y, newX, newY);
    var duree = 20*(distance-(10*this._moveSpeed));
    return duree;
};

Monster.prototype.playAnimation = function(newX, newY) {
    if(this._x < newX)
        this._sprite.animations.play('right');
    else if(this._x > newX)
        this._sprite.animations.play('left');
    else if(this._y < newY)
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


module.exports = Monster;