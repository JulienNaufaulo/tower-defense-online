'use strict';

var Shop = require('../Shop/Shop');

function Infos(player, map){
    var that = this;
    this._player = player;
    this._map = map;
    $('#menu').append('<div id="infos"></div>');
    $.get("infos.html", function(data){
        $('#infos').html(data);
        $('#circle').css("background", map._hexa.getHexa(player._color));
        $('#round').append("Round "+map._round);
    	$('#gold').append(player._gold);
        $('#life').append(player._life);
    });
};

module.exports = Infos;