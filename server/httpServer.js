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

    app.set('css', process.env.PWD, '../public/css');
    app.use(express.static(__dirname + '/../public'));
    // app.use(express.static(process.env.PWD + '../public/'));

    // app.set('views', path.join(process.env.PWD, 'public'));

    app.get('/', function(req, res){
        res.sendFile('./public/index.html');
        // res.sendFile('index.html', { root: __dirname+"/" });
    });

    gameServer.start();

    var p = process.env.PORT || port;

    httpServer.listen(p, callback);
};