'use strict';

var express    = require('express');
var http       = require('http');
var Path       = require('path');
var GameServer = require('./gameServer');

exports.startServer = function startServer(port, path, callback) {

    var app = express();
    var httpServer = http.createServer(app);
    
    var io = require('socket.io')(httpServer);
    var gameServer = GameServer(io);

    app.use(express.static(Path.join(__dirname + "/../" + path)));

    app.get('/', function(req, res){
        res.sendFile('index.html', { root: "./" });
    });

    gameServer.start();

    var p = process.env.PORT || port;

    httpServer.listen(p, callback);
};