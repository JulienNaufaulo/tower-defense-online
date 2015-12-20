'use strict';

function Menu(){}

Menu.prototype = {

    create: function() {
        var bgMenu = this.game.add.tileSprite(0, 0, 800, 600, 'bgmenu');
        var btnPlay = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY, 'btnPlay', this.actionOnClick, this, 2, 1, 0);

        btnPlay.onInputOver.add(this.over, this);
        btnPlay.onInputOut.add(this.out, this);
    },

    over: function() {
        console.log('button over');
    },

    out: function() {
        console.log('button out');
    },

    actionOnClick: function() {
        this.game.state.start('room');
    }

};

module.exports = Menu;