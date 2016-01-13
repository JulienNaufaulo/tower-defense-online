'use strict';

var TowerFactory = require('../Tower/TowerFactory');

function PlayNetworkManagerClient(map, player, listTowers) {

    map._socket.on('INIT_DATAS_GAME', onRequestInitDatasGame);
    map._socket.on('GET_MY_LIFE', onRequestGetMyLife);
    map._socket.on('START_GAME', onRequestStartGame);
    map._socket.on('CHECK_SPRITE_POSITION', onRequestCheckSpritePosition);
    map._socket.on('A_MONSTER_IS_DEAD', onRequestAMonsterIsDead);
    map._socket.on('A_TOWER_HAS_BEEN_BUILT', onRequestATowerHasBeenBuilt);

    function onRequestInitDatasGame(data) {
        onRequestGetMyLife(data.life);
        player.ready = data.ready;
        player.color = data.color;
        onRequestGetMyGold(data.gold);
    }

    function onRequestGetMyLife(life) {
        player._lifeTxt.setText(life+" vies restantes");
    }

    function onRequestGetMyGold(gold) {
        player._goldTxt.setText(gold+" gold restant");
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
                player.ready = true;
            }
            count--;

        }, 1000);
    }

    function onRequestCheckSpritePosition(data) {
        var wave = map.getWaveByIdAndOwner(data.idWave, data.owner);
        var monster = wave.getMonsterById(data.idMonster);
        if( monster != undefined ) {
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
                        if(!monster._isDead) {
                            map._socket.emit('LIFE_LOST', wave._owner);
                        }
                    }
                    else 
                        monster._currentIndex++;

                    monster._tween.start();
                }
            }   
        }
    }

    function onRequestAMonsterIsDead(data) {
        var wave = map.getWaveByIdAndOwner(data.idWave, data.owner);
        var monster = wave.getMonsterById(data.idMonster);
        if( monster != undefined ) {
            wave.removeAMonster(monster._id);
        } 
    }

    function onRequestATowerHasBeenBuilt(data) {
        var tile = {"x" : data.tileX, "y" : data.tileY};
        var tower = TowerFactory.getInstance(data.towerType, data.owner, map, listTowers, tile);
        listTowers.add(tower);
        tower._isActive = true;
    }

};

module.exports = PlayNetworkManagerClient; 