'use strict';

var TowerFactory = require('../Tower/TowerFactory');
var WeaponFactory = require('../Weapon/WeaponFactory');

function PlayNetworkManagerClient(map, player, listTowers, menu) {

    map._socket.on('INIT_DATAS_GAME', onRequestInitDatasGame);
    map._socket.on('GET_MY_LIFE', onRequestGetMyLife);
    map._socket.on('GO_TO_NEXT_ROUND', onRequestGoToNextRound);
    map._socket.on('CHECK_SPRITE_POSITION', onRequestCheckSpritePosition);
    map._socket.on('A_MONSTER_IS_DEAD', onRequestAMonsterIsDead);
    map._socket.on('A_TOWER_HAS_BEEN_BUILT', onRequestATowerHasBeenBuilt);
    map._socket.on('GOLD_EARN', onRequestGoldEarn);
    map._socket.on('A_WEAPON_HAS_BEEN_BOUGHT', onRequestAWeaponHasBeenBought);

    function onRequestInitDatasGame(data) {
        player._readyForNextRound = data.ready;
        player._color = data.color;
        player._idRoom = data.idRoom;
        onRequestGetMyLife(data.life);
        onRequestGetMyGold(data.gold);
        menu._infos.init();
    }

    function onRequestGetMyLife(life) {
        $('#life').empty().append(life);
    }

    function onRequestGetMyGold(gold) {
        $('#gold').empty().append(player._gold);
    }

    function onRequestGoToNextRound() {

        map._round++;

        // Compte à rebours
        var count = 5;
        var text = "";
        var countdown = setInterval(function(){

            if(text != "")
                text.destroy();

            text = map._game.add.text(map._game.world.centerX, map._game.world.centerY, "Round "+map._round+" \n"+count);
            text.anchor.set(0.5);
            text.align = 'center';
            text.font = 'Arial';
            text.fontWeight = 'bold';
            text.fontSize = 30;
            text.fill = "#000000";

            if( count == 0 ) {
                if( map._round == 1 ) {
                    map._game.time.reset();
                    player._playing = true;
                }
                clearInterval(countdown);
                $('#round').empty().append("Round "+map._round);
                text.destroy();
                map.createWaves();
                player._readyForNextRound = false;
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
                        monster._currentState = monster._states.normal;                           
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

        if( data.owner == player._color ) {
            player._gold = data.gold;
            onRequestGetMyGold(data.gold);
        }
    }

    function onRequestGoldEarn(gold) {
        player._gold += gold;
        onRequestGetMyGold(player._gold);
    }

    function onRequestAWeaponHasBeenBought(data) {

        var tileTower = {"x" : data.tileX, "y" : data.tileY};
        var tower = listTowers.getTowerTile(tileTower);
        var weapon = WeaponFactory.getInstance(data.weaponName);

        tower._anim.stop(1);
        tower._isShooting = false;
        tower._monsterFocused = null;
        tower.setWeapon(weapon);
        menu.sendDataTowerToPanel(tower);

        if( data.owner == player._color ) {
            player._gold = data.gold;
            onRequestGetMyGold(data.gold);
        }
    }

};

module.exports = PlayNetworkManagerClient; 