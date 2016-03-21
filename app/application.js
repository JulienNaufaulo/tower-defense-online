"use strict";

var App = {

	init: function(gameContainerElementId){

        // Configuration du jeu
		var config = {  
            width: 768,
            height: 576,
            renderer: Phaser.AUTO,  // On laisse Phaser décider du rendu (Canvas ou WebGL)
            parent: 'game',  // l'id de la DIV qui va contenir le jeu
            transparent: false,
            antialias: true,  
            forceSetTimeOut: true // On force le jeu à tourner même quand l'onglet navigateur n'est plus actif
        }

        // Initialisation de phaser
        var game = new Phaser.Game(config);

        // Déclaration des différents états du jeu
        game.state.add('boot', require('./states/boot'));
        game.state.add('menu', require('./states/menu'));
        game.state.add('room', require('./states/room'));
        game.state.add('play', require('./states/play'));

        // Lancement du 1er état
        game.state.start('boot');

    }
};

module.exports = App;