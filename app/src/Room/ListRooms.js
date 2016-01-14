'use strict';

var Room = require('./Room');

function ListRooms(){
	this._rooms = [];
}

ListRooms.prototype.addPlayer = function(client) {
	if(this._rooms.length == 0) {
		var idRoom = 1;
		var room = new Room(idRoom);

		// On inscrit le client dans cette room
		room.addPlayer(client);

		// On ajoute la nouvelle room à la liste des rooms
		this._rooms.push(room);

	} else {
		
		// On supprime les rooms vides
		this._rooms = this.removeEmptyRooms();

		// On assigne le joueur à une room de libre
		var start = 0;
		for(var count=this._rooms.length; start < count; start++) {
			if(!this._rooms[start].isFull()) {
				var idRoom = start+1;
				this._rooms[start].addPlayer(client, idRoom);
				return;
			}
		}
		var idRoom = start+1;
		var room = new Room(idRoom);
		room.addPlayer(client, idRoom);
		this._rooms.push(room);
	}	
};

ListRooms.prototype.getRoomOfPlayer = function(client) {
	for(var i=0, count=this._rooms.length; i < count; i++) {
		for(var color in this._rooms[i]._players) {
			if( this._rooms[i]._players[color] != null ) {
				if( this._rooms[i]._players[color]._id == client.id ) {
					return this._rooms[i];
				}	
			}
		}
	}
	return false;	
};

ListRooms.prototype.removeEmptyRooms = function() {
	var newRooms = [];
	for(var i=0, count=this._rooms.length; i < count; i++) {
		if(!this._rooms[i].isEmpty()) {
			newRooms.push(this._rooms[i]);
		}
	}
	return newRooms;
};

module.exports = ListRooms;