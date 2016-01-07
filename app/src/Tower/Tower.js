'use strict';

function Tower(id, owner, game, type, armor, weapon, socket, groupTowers){
    this._id = id;
    this._owner = owner;
    this._game = game;
    this._type = type;
    this._armor = armor;
    this._weapon = weapon;
    this._groupTowers = groupTowers;
    this._sprite = this._groupTowers.create(-50, -50, this._type+"-"+this._armor+"-"+this._weapon);
    this._sprite.alpha = 0;
    this._isActive = false;
};

Tower.prototype.create = function(posX, posY) {
    this._sprite.x = posX;
    this._sprite.y = posY;
    
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;

    this._sprite.anchor.x = 0.3;
    this._sprite.anchor.y = 0.4;

    this._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;

    this._sprite.alpha = 1;

    this._groupTowers.sort('y', Phaser.Group.SORT_ASCENDING);
};

module.exports = Tower;