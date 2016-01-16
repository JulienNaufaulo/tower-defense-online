'use strict';

var Peasant = require('./Peasant');
var Wizard = require('./Wizard');

var TowerFactory = {

   	getInstance: function(type, owner, map, listTowers, tile) {
   		switch(type) {
	        case "Peasant":
	            return new Peasant(type, owner, map, listTowers, tile);
	            break;
	        case "Wizard":
	            return new Wizard(type, owner, map, listTowers, tile);
	            break;
	    }
   	}

}

module.exports = TowerFactory;