'use strict';

var RoomNetworkManagerClient = require('./RoomNetworkManagerClient');

function NetworkManagerClient(phaser, chat){

	this._socket = io.connect('http://localhost:3333', {'force new connection': true});

    this._roomNetworkManagerClient = new RoomNetworkManagerClient(this._socket, phaser, chat);

};

module.exports = NetworkManagerClient;