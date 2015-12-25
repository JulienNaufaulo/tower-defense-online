'use strict';

var RoomNetworkManagerServer = require('./RoomNetworkManagerServer');

function NetworkManagerServer(client, rooms){
	this._roomNetworkManagerServer = new RoomNetworkManagerServer(client, rooms);
};

module.exports = NetworkManagerServer;