'use strict';

var Player = require('../Player/Player');

function Room(id){
	this._id = id;
	this._name = this.generateName();
	this._players = {
		"Bleu" : null,
		"Rouge" : null
	};
}

Room.prototype.generateName = function() {
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Room.prototype.addPlayer = function(client) {
	for(var color in this._players) {
		if( this._players[color] == null ) {
			var player = new Player(client.id, color, this._id);
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

Room.prototype.isEmpty = function() {
	return this.numberOfConnectedPlayers() == 0;
};

Room.prototype.isFull = function() {
	return this.numberOfConnectedPlayers() == this.maximumNumberOfPlayers();
};

Room.prototype.isReadyToPlay = function() {
	var countReadyPlayers = 0;
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._readyToPlay == true ) {
        	countReadyPlayers++
        }
    }

    return countReadyPlayers == this.maximumNumberOfPlayers();
};

Room.prototype.isReadyForNextRound = function() {
	var countReadyPlayers = 0;
	for (var color in this._players) 
    {
        if ( this._players[color] != null && this._players[color]._readyForNextRound == true ) {
        	countReadyPlayers++
        }
    }

    return countReadyPlayers == this.maximumNumberOfPlayers();
};

Room.prototype.resetReadyToPlay = function() {
	for (var color in this._players) 
    {
        if ( this._players[color] != null ) {
        	this._players[color]._readyToPlay = false;
        }
    }
};

Room.prototype.resetReadyForNextRound = function() {
	for (var color in this._players) 
    {
        if ( this._players[color] != null ) {
        	this._players[color]._readyForNextRound = false;
        }
    }
};

Room.prototype.setAllPlayersPlaying = function() {
	for (var color in this._players) 
    {
        if ( this._players[color] != null ) {
        	this._players[color]._playing = true;
        }
    }
};

module.exports = Room;