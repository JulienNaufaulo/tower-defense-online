'use strict';

var Tower = require('./Tower');
var WeaponFactory = require('../Weapon/WeaponFactory');

function Wizard(type, owner, map, listTowers, tile){

    //  Appel du constructeur de la Tower 
    Tower.call(this, type, owner, map, listTowers, tile);
    
    this._weapon = WeaponFactory.getInstance("MagicStick");
    this._range = this._weapon._range;
    this._fireRate = 1000;
    this._strengh = 3;
    this._cost = 3;

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

    if(this._monsterFocused != null && !this._monsterFocused._isDead) {

        // Si touché, le monstre est gelé
        if( this._monsterFocused._currentState != this._monsterFocused._states.frozen ) {
            this._monsterFocused._currentState = this._monsterFocused._states.frozen;
            this._monsterFocused._tween.stop();
        }


        if(this._map._player._color == this._owner) {
        
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

module.exports = Wizard;