'use strict';

var Tower = require('../Tower/Tower');

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
    // this.deleteGhostTower();
    var pos = this._game.input.activePointer.position;

    this._tower = new Tower(this._listTowers.count()+1, this._playerDatas.color, this._game, this._typeOfTowerSelected, "stick", this._socket, this._listTowers);
    this._tower._sprite.alpha = 0.5;

    this._isATowerSelected = true;
};

Shop.prototype.deleteGhostTower = function() {
    this._isATowerSelected = false;
    if( this._tower != null ) {
        this._tower._sprite.destroy();
        this._tower._graphicRange.destroy();
        this._tower = null;
    }
}

Shop.prototype.buyTower = function() {
    var tower = new Tower(this._listTowers.count()+1, this._playerDatas.color, this._game, this._typeOfTowerSelected, "stick", this._socket, this._listTowers);;
    tower.create(this._tower._sprite.x, this._tower._sprite.y);
    //this.deleteGhostTower();
}

module.exports = Shop;