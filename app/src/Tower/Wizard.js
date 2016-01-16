'use strict';

var Tower = require('./Tower');
var WeaponFactory = require('../Weapon/WeaponFactory');

function Wizard(type, owner, map, listTowers, tile){

    //  Appel du constructeur de la Tower 
    Tower.call(this, type, owner, map, listTowers, tile);
    
    this._weapon = WeaponFactory.getInstance("MagicStick");
    this._range = this._weapon._range;
    this._fireRate = 1000;
    this._strengh = 1;
    this._cost = 0;

    this._sprite = this._listTowers._groupTowers.create(this._tileX*map._tileWidth, this._tileY*map._tileHeight, this._type+"-"+this._weapon._name);
    this._sprite.alpha = 1;
    this._sprite.scale.x = 0.8;
    this._sprite.scale.y = 0.8;
    this._sprite.anchor.setTo(0.2, 0.5);
    this._map._game.physics.arcade.enable(this._sprite, Phaser.Physics.ARCADE);
    this._sprite.body.moves = false;
    this._isActive = false;

    this._anim = this._sprite.animations.add('attack', [0, 1, 2, 3, 4, 5], (this._fireRate/100)-this._weapon._weight/2, false);
    this._anim.onComplete.add(this.hitEnemy, this);
};

Wizard.prototype = Object.create(Tower.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.hitEnemy = function() {
    console.log("gelé !");
    Tower.prototype.hitEnemy.call(this);
}

module.exports = Wizard;