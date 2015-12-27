'use strict';

function Boot(){}

Boot.prototype = {

    preload: function(){
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#FFFFFF';
        
        // This event is dispatched when the final file in the load queue has been loaded
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

        this.showLoadingText();
        this.loadAssets();
    },

    onLoadComplete: function(){
        this.game.state.start('menu');
        // this.game.state.start('play');
    },

    loadAssets: function(){
        this.game.load.image('bgmenu', 'images/bg-menu.jpg');
        this.game.load.spritesheet('btnPlay', 'images/btn_play.jpg', 213, 52);
        this.game.load.spritesheet('btnReady', 'images/btn_ready.jpg', 213, 52);
        this.game.load.spritesheet('character', 'images/sprites-character.png', 27, 35);
        this.game.load.image('grille', 'images/grille.jpg');
    },

    showLoadingText: function(){
        var loadingText = "Loading...";
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, loadingText);

        //  Centers the text
        text.anchor.set(0.5);
        text.align = 'center';

        //  Our font + size
        text.font = 'Arial';
        text.fontWeight = 'bold';
        text.fontSize = 25;
        text.fill = '#000000';
    }

};

module.exports = Boot;