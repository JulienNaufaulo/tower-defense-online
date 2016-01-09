'use strict';

var Tower = require('../Tower/Tower');
var Peasant = require('../Tower/Peasant');

function Shop(game, listTowers, playerDatas, socket){
    var that = this;
    this._game = game;
    this._listTowers = listTowers;
    this._tower = null;
    this._isATowerSelected = false;
    this._typeOfTowerSelected = null;
    this._playerDatas = playerDatas;
    this._socket = socket;

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
    var pos = this._game.input.activePointer.position;
    this._tower = this.getInstance();
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

Shop.prototype.updateGhostTower = function(marker, floorLayer, tileWidth, tileHeight) {
    var pos = this._game.input.activePointer.position;
    this._tower._sprite.x = floorLayer.getTileX(this._game.input.activePointer.worldX) * tileWidth;
    this._tower._sprite.y = floorLayer.getTileY(this._game.input.activePointer.worldY) * tileHeight;
    this._tower.drawRange(marker, tileWidth, tileHeight, floorLayer);
}

Shop.prototype.buyTower = function(tileTower) {
    var tower = this.getInstance();
    tower.create(tileTower.x, tileTower.y);
}

Shop.prototype.getInstance = function() {
    switch(this._typeOfTowerSelected) {
        case "peasant":
            return new Peasant(this._listTowers.count()+1, this._playerDatas.color, this._game, this._typeOfTowerSelected, "stick", this._socket, this._listTowers);
            break;
    }
}

module.exports = Shop;