'use strict';

var Monster = require('./Monster');
var Skeleton = require('./Skeleton');

function Wave(id, layer, path, game, nbMonsters, moveSpeed, socket){
	this._id = id;
	this._layer = layer;
	this._game = game;
	this._nbMonsters = nbMonsters;
	this._moveSpeed = moveSpeed;
	this._monsters = [];
	this._groupMonsters = game.add.group();
	this._path = path;
	this._socket = socket;
};

Wave.prototype.create = function() { 
	var posY=this._path[0].y;
	for(var i=1; i <= this._nbMonsters; i++) {
		var monster = new Skeleton(i, this._layer, this._game, this._moveSpeed, this._path, this._socket, this._id, "skeleton");
		// var monster = new Monster(i, this._game, this._moveSpeed, this._path, this._socket, this._id);
		posY -= 2;
		monster.create(this._path[0].x, posY);
		this._monsters.push(monster);
	}
};

Wave.prototype.move = function() { 
	for(var i=0; i < this._monsters.length; i++) {
		this._monsters[i].move();
		if( this._monsters[i]._currentIndex == (this._monsters[i]._path.length-1) ) {
			if( this._monsters[i]._sprite.y <= 90 ) {
				this._monsters[i].hide();
			} else {
				this._monsters[i].reveal();
			}
		}
		if( this._monsters[i]._currentIndex == 1 ) {
			if( this._monsters[i]._sprite.y < 53 ) {
				this._monsters[i].hide();
			} else {
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

Wave.prototype.removeAMonster = function(idWave, idMonster) {
	if(this._id == idWave) {
		for(var i=0; i < this._monsters.length; i++) {
			if(this._monsters[i]._id == idMonster) {
				this._monsters[i].die();
				this._monsters[i] = null;
				this._monsters.splice(i, 1);
			}
			    
		}
	}
};

module.exports = Wave;