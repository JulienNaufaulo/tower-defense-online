'use strict';

var express    = require('express');
var http       = require('http');
var path       = require('path');
var GameServer = require('./gameServer');


var walk = require('walk')
    , fs = require('fs')
    , walker
    ;

exports.startServer = function startServer(port, path, callback) {

    var app = express();
    var httpServer = http.createServer(app);
    
    var io = require('socket.io')(httpServer);
    var gameServer = GameServer(io);

    process.env.PWD = process.cwd();

    // app.set('css', __dirname, '/../public/css/');
    console.log(__dirname);
    console.log(process.env.PWD);
    app.use(express.static(process.env.PWD + '/public/'));
    // app.use(express.static(process.env.PWD + '../public/'));

    // app.set('views', path.join(process.env.PWD, 'public'));

    app.get('/', function(req, res){
        res.sendFile(process.env.PWD+'/public/index.html');
        // res.sendFile('index.html', { root: __dirname+"/" });
    });





    var files   = [];

    // Walker options
    var walker  = walk.walk('./', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(root + '/' + stat.name);
        next();
    });

    walker.on('end', function() {
        console.log(files);
    });





    gameServer.start();

    var p = process.env.PORT || port;

    httpServer.listen(p, callback);
};