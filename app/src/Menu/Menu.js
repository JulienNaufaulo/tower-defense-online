'use strict';

var Shop = require('../Shop/Shop');
var Infos = require('./Infos');
var WeaponFactory = require('../Weapon/WeaponFactory');

function Menu(listTowers, player, map){
    var that = this;
    this._listTowers = listTowers;
    this._player = player;
    this._map = map;
    $('#app').append('<div id="menu"></div>');
    this._infos = new Infos(player, map); 
    this._shop = new Shop(listTowers, player, map); 
    $('#menu').slideDown();
};

Menu.prototype.displayInfoPanel = function() {

	function sendDataTowerToPanel(tower) {
    	$('#typeInfoTower').empty().append(tower._type);
	    $('#imgInfoTower').empty().append('<img src="images/shop/'+tower._type+'-'+tower._weapon._name+'.png" title="'+tower._type+'" />');
	    $('#ownerInfoTower').empty().append(tower._owner);
	    $('#ownerInfoTower').css("color",that._map._hexa.getHexa(tower._owner));
	    $('#positionXInfoTower').empty().append(tower._tileX);
	    $('#positionYInfoTower').empty().append(tower._tileY);
	    $('#strenghInfoTower').empty().append(tower._strengh +" (+"+tower._weapon._damage+")");
	    $('#weaponInfoTower').empty().append(tower._weapon._name);
	    $('#attackSpeedInfoTower').empty().append(tower._fireRate/1000+" (-"+tower._weapon._weight/100+")");
	    $('#rangeInfoTower').empty().append(tower._range);
	    $('#costInfoTower').empty().append(tower._cost);
    };

	var that = this;

    // on récupère la position de la souris
    var pos = this._map._game.input.activePointer.position;

    // on récupère la case cliquée sur le calque de la map
    var tileTower = this._map._map.getTileWorldXY(pos.x, pos.y, this._map._tileWidth, this._map._tileHeight, this._map.getLayerByName("sol"), false);

    if( !this._shop._isATowerSelected ) {

        if(!this._listTowers.isEmptyTile(tileTower)) {

            if (($("#infoTower").length == 0))
                $('#game').append('<div id="infoTower" style="position:absolute;"></div>');

            var tower = this._listTowers.getTowerTile(tileTower);

            $.get("infoTower.html", function(data){

                $('#infoTower').html(data);

                sendDataTowerToPanel(tower);

                if( tower._owner == that._player._color ) {
                    $('#infoTower').append('<div id="equipment"></div>');

                    $.get("infoTower/"+tower._type+"/equipment.html", function(data) {
                        $('#equipment').html(data);

                        $('#list-equipment > td').click(function() {
                            var weaponName = $(this).attr("id");
                            var weapon = WeaponFactory.getInstance(weaponName);
                            tower.setWeapon(weapon);
                            sendDataTowerToPanel(tower);
                        });
                    });
                }

                if( !$('#infoTower').is(":visible") ) {
                    $('#infoTower').show("slide", {
                        direction: "right" 
                    }, 800);
                    $(document).keyup(function(e) {
                        if (e.keyCode == 27){
                            $('#infoTower').hide("slide", {
                                direction: "right" 
                            }, 800);
                        }
                    });
                }
                
                document.getSelection().removeAllRanges();

            });

            
        }
    } 
};

module.exports = Menu;