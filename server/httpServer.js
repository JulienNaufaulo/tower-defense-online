'use strict';

var express    = require('express');
var http       = require('http');
var path       = require('path');
var GameServer = require('./gameServer');

exports.startServer = function startServer(port, path, callback) {

    var app = express();
    var httpServer = http.createServer(app);
    
    var io = require('socket.io')(httpServer);
    var gameServer = GameServer(io);

    process.env.PWD = process.cwd();

    app.use(express.static(process.env.PWD + '/public/'));

    app.get('/', function(req, res){
        res.sendFile(process.env.PWD+'/public/index.html');
    });

    gameServer.start();

    var p = process.env.PORT || port;

    httpServer.listen(p, callback);
};