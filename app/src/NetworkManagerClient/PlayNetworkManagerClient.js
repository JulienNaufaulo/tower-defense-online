'use strict';

function PlayNetworkManagerClient(socket, phaser, wave) {

    socket.on('START_GAME', onRequestStartGame);

    function onRequestStartGame() {
        var count = 5;
        var text = "";
        var countdown = setInterval(function(){
            if(text != "")
                text.destroy();
            text = phaser.add.text(phaser.world.centerX, phaser.world.centerY, count);
            text.anchor.set(0.5);
            text.align = 'center';
            text.font = 'Arial';
            text.fontWeight = 'bold';
            text.fontSize = 30;
            text.fill = "#000000";
            if( count == 0 ) {
                wave.move();
                wave._started = true;
                clearInterval(countdown);
                text.destroy();
                
            }
            count--;

        }, 1000);
    }

};

module.exports = PlayNetworkManagerClient;