'use strict';

var Stick = require('./Stick');
var Fists = require('./Fists');
var Bow = require('./Bow');
var MagicStick = require('./MagicStick');

var WeaponFactory = {

   	getInstance: function(name) {
   		switch(name) {
	        case "Fists":
	            return new Fists();
	            break;
	        case "Stick":
	            return new Stick();
	            break;
	        case "Bow":
	            return new Bow();
	            break;
	        case "MagicStick":
	            return new MagicStick();
	            break;
	    }
   	}

}

module.exports = WeaponFactory;