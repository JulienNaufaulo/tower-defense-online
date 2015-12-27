'use strict';

function Monster(game, moveSpeed, path){
    this._x = null;
    this._y = null;
    this._moveSpeed = moveSpeed;
    this._path = path;
    this._currentIndex = 1;
    this._game = game;
    this._sprite = null;
    this._tween = null;
};

Monster.prototype.create = function(posX, posY) {
    this._x = posX;
    this._y = posY;

    this._sprite = this._game.add.sprite(posX, posY, 'character');

    //  We need to enable physics on the player
    this._game.physics.arcade.enable(this._sprite);

    this._sprite.animations.add('top', [12, 13, 14, 15], 10, true);
    this._sprite.animations.add('right', [4, 5, 6, 7], 10, true);
    this._sprite.animations.add('bottom', [0, 1, 2, 3], 10, true);
    this._sprite.animations.add('left', [8, 9, 10, 11], 10, true);
};

Monster.prototype.move = function() {
    // this._game.physics.arcade.moveToXY(this._sprite, newX, newY);
    var that = this;

    var newX = this._path[this._currentIndex].x;
    var newY = this._path[this._currentIndex].y;

    var duree = this.getDuree(this._x, this._y, newX, newY);

    this.playAnimation(newX, newY);

    this._tween = this._game.add.tween(this._sprite).to({x:newX,y:newY}, duree);
    this._tween.onComplete.add(function(){
        that._x = newX; 
        that._y = newY;

        if( that._currentIndex+1 == that._path.length) {
            that._currentIndex=0;
        }
        else 
            that._currentIndex++;
    });

    this._tween.start();
    
};

Monster.prototype.getDistanceBetweenPoints = function(x, y, newX, newY) {
    var distance = 0;
    if(x > newX) {
        distance += x-newX;
    } else if(x < newX) {
        distance += newX-x;
    }
    if(y > newY) {
        distance += y-newY;
    } else if(y < newY) {
        distance += newY-y;
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


module.exports = Monster;