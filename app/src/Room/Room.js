'use strict';

var Player = require('../Player/Player');

function Room(id){
	this._id = id;
	this._name = "room"+id;
	this._players = {
		"Bleu" : null,
		"Rouge" : null
	};
}

Room.prototype.addPlayer = function(client, idRoom) {
	for(var color in this._players) {
		if( this._players[color] == null ) {
			var player = new Player(client.id, color, idRoom);
			client.join(this._name);
			this._players[color] = player;
			return;
		}
	}
};

Room.prototype.getListOtherPlayersInRoom = function(client) {
	var listOtherPlayersInRoom = [];
	for(var color in this._players) {
		if( this._players[color] != null && this._players[color]._id != client.id ) {
			listOtherPlayersInRoom.push(this._players[color]);
		}
	}
	return listOtherPlayersInRoom;
};

Room.prototype.numberOfConnectedPlayers = function() {
	var count = 0;
	for(var color in this._players) {
		if( this._players[color] != null ) {
			count++;
		}
	}
	return count;
};

Room.prototype.maximumNumberOfPlayers = function() {
	var size = 0;
    for (var color in this._players) 
    {
        if (this._players.hasOwnProperty(color)) size++;
    }
    return size;
};

Room.prototype.removePlayer = function(client) {
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._id == client.id ) {
        	client.leave(this._name);
        	this._players[color] = null;
        	break;
        }
    }
};

Room.prototype.getPlayerById = function(client) {
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._id == client.id ) {
        	return this._players[color];
        }
    }
};

Room.prototype.isFull = function() {
	return this.numberOfConnectedPlayers() == this.maximumNumberOfPlayers();
};

Room.prototype.isReady = function() {
	var countReadyPlayers = 0;
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._ready == true ) {
        	countReadyPlayers++
        }
    }

    return countReadyPlayers == this.maximumNumberOfPlayers();
};

Room.prototype.resetReady = function() {
	for(var color in this._players) {
		if( this._players[color] != null ) {
			this._players[color]._ready = false;
		}
	}
};

module.exports = Room;