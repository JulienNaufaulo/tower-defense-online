'use strict';

var Shop = require('../Shop/Shop');
var Infos = require('./Infos');

function Menu(listTowers, player, map){
    var that = this;
    this._listTowers = listTowers;
    this._player = player;
    this._map = map;
    $('#app').append('<div id="menu"></div>');
    this._infos = new Infos(player, map); 
    this._shop = new Shop(listTowers, player, map); 
    $('#menu').slideDown();
};

Menu.prototype.createGhostTower = function() {
 
};

module.exports = Menu;