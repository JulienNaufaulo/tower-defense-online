'use strict';

var Tower = require('../Tower/Tower');
var Peasant = require('../Tower/Peasant');
var TowerFactory = require('../Tower/TowerFactory');

function Shop(listTowers, player, map){
    var that = this;
    this._listTowers = listTowers;
    this._player = player;
    this._map = map;
    this._tower = null;
    this._isATowerSelected = false;
    this._typeOfTowerSelected = null;

    $('#menu').append('<div id="shop"></div>');

    $.get("shop.html", function(data){
        $('#shop').html(data);
        $('#towers > li').click(function(){
            that.deleteGhostTower(); 
            that._typeOfTowerSelected = $(this).children("figure").children("img").attr("id");
            that.createGhostTower();
        });
    });

    // Si l'utilisateur clique sur ESC, il désélectionne l'unité choisie.
    $(document).keyup(function(e) {
        if (e.keyCode == 27){
            that.deleteGhostTower();
        }
    });
};

Shop.prototype.createGhostTower = function() {
    var pos = this._map._game.input.activePointer.position;
    var tile = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
    this._tower = TowerFactory.getInstance(this._typeOfTowerSelected, this._player._color, this._map, this._listTowers, tile);
    this._tower._sprite.alpha = 0.5;
    this._isATowerSelected = true;
};

Shop.prototype.deleteGhostTower = function() {
    this._isATowerSelected = false;
    if( this._tower != null ) {
        this._listTowers._groupTowers.remove(this._tower._sprite);
        this._listTowers._groupTowers.remove(this._tower._socle);
        this._tower._sprite.destroy();
        this._tower._socle.destroy();
        this._tower._graphicRange.destroy();
        this._tower = null;
    }
}

Shop.prototype.updateGhostTower = function(marker) {
    var pos = this._map._game.input.activePointer.position;
    var tile = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
    this._tower._tileX = tile.x;
    this._tower._tileY = tile.y;
    this._tower._sprite.x = tile.x*this._map._tileWidth;
    this._tower._sprite.y = tile.y*this._map._tileHeight;
    this._tower._socle.x = tile.x*this._map._tileWidth;
    this._tower._socle.y = tile.y*this._map._tileHeight;
    this._tower.drawRange(marker, this._map);
}

Shop.prototype.buyTower = function(tileTower) {
    this._map._socket.emit('I_WANT_TO_BUY_A_TOWER', {"towerType" : this._typeOfTowerSelected, "cost" : this._tower._cost, "tileX" : tileTower.x, "tileY" : tileTower.y});
}

module.exports = Shop;