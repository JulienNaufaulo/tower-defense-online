'use strict';

function Wave(id, map, owner){
	this._id = id;
	this._map = map;
	this._owner = owner;
	this._monsters = [];
	this._groupMonsters = map._game.add.group();
};

Wave.prototype.addMonster = function(monster, tileX, tileY) { 
		this._monsters.push(monster);
		this._groupMonsters.sort('y', Phaser.Group.SORT_ASCENDING);
};

Wave.prototype.move = function() { 

	for(var i=0; i < this._monsters.length; i++) {
		this._monsters[i].move();

		// Apparition/Disparition des sprites
		if( this._monsters[i]._currentIndex == 1 ) {
			if( this._monsters[i]._sprite.y >= 53 ) {
				this._monsters[i].reveal();
			}
		}
	}
	
};

Wave.prototype.getMonsterById = function(id) { 
	for(var i=0; i < this._monsters.length; i++) {
		if(this._monsters[i]._id == id)
			return this._monsters[i];
	}
};

Wave.prototype.removeAMonster = function(idMonster) {
	for(var i=0; i < this._monsters.length; i++) {
		if(this._monsters[i]._id == idMonster) {
			this._monsters[i]._healthBar.width = 0;
	        this._monsters[i]._healthBar.alpha = 0;
	        this._monsters[i]._sprite.alpha = 0;
			this._monsters.splice(i, 1);
		}    
	}	
};

module.exports = Wave;