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
    this._sprite.anchor.x = 0.3;
    this._sprite.anchor.y = 0.4;
    this._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;
    this._isActive = false;
    this._range = 1;

    this._graphicRange = this._game.add.graphics();
    this._graphicRange.lineStyle(1, 0xFFCCCC, 1);
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

module.exports = Tower;