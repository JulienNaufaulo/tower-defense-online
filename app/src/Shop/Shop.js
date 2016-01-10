'use strict';

var Tower = require('../Tower/Tower');
var Peasant = require('../Tower/Peasant');

function Shop(listTowers, playerDatas, map){
    var that = this;
    this._listTowers = listTowers;
    this._playerDatas = playerDatas;
    this._map = map;
    this._tower = null;
    this._isATowerSelected = false;
    this._typeOfTowerSelected = null;

    $('#app').append('<div id="shop"></div>');

    $.get("shop.html", function(data){
        $('#shop').html(data);
        $('.tower').click(function(){
            that.deleteGhostTower(); 
            that._typeOfTowerSelected = $(this).attr("id");
            that.createGhostTower();
        });
    });
    $('#shop').slideDown();

    // Si l'utilisateur clique sur ESC, il déselectionne l'unité choisie.
    $(document).keyup(function(e) {
        if (e.keyCode == 27){
            that.deleteGhostTower();
        }
    });
};

Shop.prototype.createGhostTower = function() {
    var pos = this._map._game.input.activePointer.position;
    var tile = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);
    this._tower = this.getInstance(tile);
    this._tower._sprite.alpha = 0.5;
    this._isATowerSelected = true;
};

Shop.prototype.deleteGhostTower = function() {
    this._isATowerSelected = false;
    if( this._tower != null ) {
        this._listTowers._groupTowers.remove(this._tower._sprite);
        this._tower._sprite.destroy();
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
    this._tower.drawRange(marker, this._map);
}

Shop.prototype.buyTower = function(tileTower) {
    var tower = this.getInstance(tileTower);
    this._listTowers.add(tower);
    tower._isActive = true;
    // tower.create(tileTower.x, tileTower.y);
}

Shop.prototype.getInstance = function(tile) {
    switch(this._typeOfTowerSelected) {
        case "peasant":
            return new Peasant(this._playerDatas.color, this._typeOfTowerSelected, "stick", this._map, this._listTowers, tile);
            break;
    }
}

module.exports = Shop;