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
    },

    loadAssets: function(){
        this.game.load.image('bgmenu', 'images/bg-menu.jpg');
        this.game.load.spritesheet('btnPlay', 'images/btn_play.jpg', 213, 52);
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