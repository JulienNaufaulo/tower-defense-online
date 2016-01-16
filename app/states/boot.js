'use strict';

function Boot(){}

Boot.prototype = {

    preload: function(){
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#FFFFFF';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.showLoadingText();
        this.loadMap();
        this.loadAssets();

        // This event is dispatched when the final file in the load queue has been loaded
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    },

    onLoadComplete: function(){
        this.game.state.start('menu');
        // this.game.state.start('play');
    },

    loadMap: function() {
        this.game.load.tilemap('map-castle', 'images/map/level-castle.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('castle2', 'images/map/Castle2.png');
        this.game.load.image('castle3', 'images/map/castle3.png');
        this.game.load.image('metaTiles', 'images/map/meta_tiles.png');
    },

    loadAssets: function(){
        this.game.load.image('healthbar', 'images/monsters/hp.jpg');
        this.game.load.image('bgmenu', 'images/bg-menu.jpg');
        this.game.load.spritesheet('btnPlay', 'images/btn_play.jpg', 213, 52);
        this.game.load.spritesheet('btnReady', 'images/btn_ready.jpg', 213, 52);
        this.game.load.spritesheet('skeleton', 'images/monsters/sprites-squelette.png', 31, 48);
        this.game.load.spritesheet('Peasant-Fists', 'images/towers/peasant/sprite-peasant-fists.png', 45, 49);
        this.game.load.spritesheet('Peasant-Stick', 'images/towers/peasant/sprite-peasant-stick.png', 45, 49);
        this.game.load.spritesheet('Peasant-Bow', 'images/towers/peasant/sprite-peasant-bow.png', 38, 54);
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