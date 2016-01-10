'use strict';

function PlayNetworkManagerClient(map, gameDatas) {

    map._socket.on('INIT_DATAS_GAME', onRequestInitDatasGame);
    map._socket.on('GET_MY_LIFE', onRequestGetMyLife);
    map._socket.on('START_GAME', onRequestStartGame);
    map._socket.on('CHECK_SPRITE_POSITION', onRequestCheckSpritePosition);

    function onRequestInitDatasGame(data) {
        onRequestGetMyLife(data.life);
        gameDatas.ready = data.ready;
        gameDatas.color = data.color;
        onRequestGetMyGold(data.gold);
    }

    function onRequestGetMyLife(life) {
        gameDatas.life.setText(life+" vies restantes");
    }

    function onRequestGetMyGold(gold) {
        gameDatas.gold.setText(gold+" gold restant");
    }

    function onRequestStartGame() {
        // Compte à rebours
        var count = 1;
        var text = "";
        var countdown = setInterval(function(){

            if(text != "")
                text.destroy();

            text = map._game.add.text(map._game.world.centerX, map._game.world.centerY, count);
            text.anchor.set(0.5);
            text.align = 'center';
            text.font = 'Arial';
            text.fontWeight = 'bold';
            text.fontSize = 30;
            text.fill = "#000000";

            if( count == 0 ) {
                map._game.time.reset();
                clearInterval(countdown);
                text.destroy();
                gameDatas.ready = true;
            }
            count--;

        }, 1000);
    }

    function onRequestCheckSpritePosition(data) {
        for(var i=0, count=map._waves.length; i < count; i++) {
            if( map._waves[i]._id == data.idWave ){
                var monster = map._waves[i].getMonsterById(data.idMonster);
                if( monster._currentIndex == data.currentIndex ) {
                    if( monster._tileX != data.tileX || monster._tileY != data.tileY ) {
                        monster._tween.stop();
                        monster._tween = map._game.add.tween(monster._sprite).to({x:data.tileX*map._tileWidth,y:data.tileY*map._tileHeight}, 0.1);
                        monster._tween.onComplete.add(function(){                            
                            monster._tileX = data.tileX;
                            monster._tileY = data.tileY;
                            monster._sprite.x = data.tileX*map._tileWidth;
                            monster._sprite.y = data.tileY*map._tileHeight;
                        });

                        if( monster._currentIndex+1 == monster._path.length) {
                            monster._currentIndex=0;
                            monster.hide();
                            map._socket.emit('LIFE_LOST', map._waves[i]._owner);
                        }
                        else 
                            monster._currentIndex++;

                        monster._tween.start();
                    }
                }
            }
        }
    }

};

module.exports = PlayNetworkManagerClient; 