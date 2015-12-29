'use strict';

var Monster = require('./Monster');

function Wave(game, nbMonsters, moveSpeed){
	console.log("constructor");
	this._game = game;
	this._nbMonsters = nbMonsters;
	this._moveSpeed = moveSpeed;
	this._monsters = [];

	this._path = [ {"x":63, "y":-50}, {"x":63, "y":100}, {"x":263, "y":100}, {"x":263, "y":200}, {"x":20, "y":200}, {"x":20, "y":350}, {"x":265, "y":350}, {"x":265, "y":-50} ];
	console.log(this._path[1]);
	this._currentIndex = 1;
	this._started = false;
};

Wave.prototype.create = function() { 
	console.log("creation de la wave");
	var posY=this._path[0].y;
	for(var i=1; i <= this._nbMonsters; i++) {
		var monster = new Monster(i, this._game, this._moveSpeed, this._path);
		posY -= 40;
		monster.create(this._path[0].x, posY);
		this._monsters.push(monster);
	}
};

Wave.prototype.move = function(socket) { 
	for(var i=0; i < this._monsters.length; i++) {
		this._monsters[i].move(socket);
	}
};

Wave.prototype.isWaveMoving = function() { 
	var countRunningMonsters = 0;
	for(var i=0; i < this._monsters.length; i++) {
		if( this._monsters[i]._tween != null ) {
			if( this._monsters[i]._tween.isRunning )
				countRunningMonsters++;
		}
	}
	if(countRunningMonsters > 0)
		return true;
	else 
		return false;
};

Wave.prototype.getMonsterById = function(id) { 
	for(var i=0; i < this._monsters.length; i++) {
		if(this._monsters[i]._id == id)
			return this._monsters[i];
	}
};

module.exports = Wave;