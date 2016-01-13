'use strict';

var Stick = require('./Stick');
var Fists = require('./Fists');

var WeaponFactory = {

   	getInstance: function(name) {
   		switch(name) {
	        case "Fists":
	            return new Fists();
	            break;
	        case "Stick":
	            return new Stick();
	            break;
	    }
   	}

}

module.exports = WeaponFactory;