'use strict';

function PlayNetworkManagerClient(socket, phaser, wave) {

    socket.on('START_GAME', onRequestStartGame);
    socket.on('CHECK_SPRITE_POSITION', onRequestCheckSpritePosition);

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
                // wave.move();
                phaser.time.reset();
                wave._started = true;
                clearInterval(countdown);
                text.destroy();
                
            }
            count--;

        }, 1000);
    }

    function onRequestCheckSpritePosition(data) {
        var monster = wave.getMonsterById(data.idMonster);
        if( monster._currentIndex == data.currentIndex ) {
            if( monster._sprite.x != data.posX || monster._sprite.y != data.posY ) {
                monster._tween.stop();
                monster._tween = phaser.add.tween(monster._sprite).to({x:data.posX,y:data.posY}, 0.1);
                monster._tween.onComplete.add(function(){
                    monster._x = data.posX;
                    monster._y = data.posY;
                    if( monster._currentIndex+1 == monster._path.length) {
                        monster._currentIndex=0;
                    }
                    else 
                        monster._currentIndex++;
                });

                monster._tween.start();
            }
        }
    }

};

module.exports = PlayNetworkManagerClient;