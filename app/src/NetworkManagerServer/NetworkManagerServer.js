'use strict';

var RoomNetworkManagerServer = require('./RoomNetworkManagerServer');
var PlayNetworkManagerServer = require('./PlayNetworkManagerServer');

function NetworkManagerServer(client, rooms){
	this._roomNetworkManagerServer = new RoomNetworkManagerServer(client, rooms);
	this._playNetworkManagerServer = new PlayNetworkManagerServer(client, rooms);
};

module.exports = NetworkManagerServer;