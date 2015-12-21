'use strict';

var Player = require('./Player');

function ListPlayers(){
	this._players = {
		"Bleu" : null,
		"Rouge" : null
	};
}

ListPlayers.prototype.addPlayer = function(id) {
	for(var color in this._players) {
		if( this._players[color] == null ) {
			var player = new Player(id, color);
			this._players[color] = player;
    		return player;
		}
	}
};

ListPlayers.prototype.getList = function() {
	return this._players;
};

ListPlayers.prototype.numberOfConnectedPlayers = function() {
	var count = 0;
	for(var color in this._players) {
		if( this._players[color] != null ) {
			count++;
		}
	}
	return count;
};

ListPlayers.prototype.maximumNumberOfPlayers = function() {
	var size = 0;
    for (var color in this._players) 
    {
        if (this._players.hasOwnProperty(color)) size++;
    }
    return size;
};

ListPlayers.prototype.removePlayer = function(playerDisconnected) {
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._id == playerDisconnected._id ) {
        	this._players[color] = null;
        	break;
        }
    }
};

ListPlayers.prototype.getDisconnectedPlayer = function(id) {
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._id == id ) {
        	return this._players[color];
        }
    }
};

module.exports = ListPlayers;