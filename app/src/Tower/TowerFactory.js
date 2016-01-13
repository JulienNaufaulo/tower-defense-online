'use strict';

var Peasant = require('./Peasant');

var TowerFactory = {

   	getInstance: function(type, owner, map, listTowers, tile) {
   		switch(type) {
	        case "Peasant":
	            return new Peasant(type, owner, map, listTowers, tile);
	            break;
	    }
   	}

}

module.exports = TowerFactory;