'use strict';

var Room = require('./Room');

function ListRooms(){
	this._rooms = [];
}

ListRooms.prototype.addPlayer = function(client) {
	if(this._rooms.length == 0) {
		var idRoom = 0;
		var room = new Room(idRoom);

		// On inscrit le client dans cette room
		room.addPlayer(client, idRoom);

		// On ajoute la nouvelle room à la liste des rooms
		this._rooms.push(room);

	} else {
		var idRoom = 0;
		for(var count=this._rooms.length; idRoom < count; idRoom++) {
			if(!this._rooms[idRoom].isFull()) {
				this._rooms[idRoom].addPlayer(client, idRoom);
				return;
			}
		}
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

ListRooms.prototype.getRoom = function(idRoom) {
	return this._rooms[idRoom];	
};

module.exports = ListRooms;