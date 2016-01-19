'use strict';

var Shop = require('../Shop/Shop');

function Infos(player, map){
    var that = this;
    this._player = player;
    this._map = map;
    $('#menu').append('<div id="infos"></div>');
};

Infos.prototype.init = function() {
    var that = this;
    $.get("infos.html", function(data){
        $('#infos').html(data);
        $('#circle').css("background", that._map._hexa.getHexa(that._player._color));
        $('#round').append("Round "+that._map._round);
        $('#gold').append(that._player._gold);
        $('#life').append(that._player._life);
    });
};

module.exports = Infos;