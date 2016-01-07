'use strict';

function Shop(game, groupTowers){
    var that = this;
    this._game = game;
    this._groupTowers = groupTowers;
    this._isATowerSelected = false;
    this._sprite = null;

    $('#app').append('<div id="shop"></div>');
    $.get("shop.html", function(data){
        $('#shop').html(data);
        $('.tower').click(function(){
            var type = $(this).attr("id");
            var pos = that._game.input.activePointer.position;

            if( that._sprite != null ) {
                that._sprite.destroy();
            }
            
            that._sprite = that._groupTowers.create(pos.x, pos.y, type);
            that._sprite.scale.x = 0.8;
            that._sprite.scale.y = 0.8;
            that._sprite.anchor.x = 0.3;
            that._sprite.anchor.y = 0.4;
            that._sprite.alpha = 0.5;
            that._isATowerSelected = true;
        });
    });
    $('#shop').slideDown();


};

module.exports = Shop;