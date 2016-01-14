'use strict';

function HexaColors(){
	this._hexaColors = {
	    "Bleu" : "#3498DB",
	    "Rouge" : "#E74C3C"
	};
}

HexaColors.prototype.getHexa = function(color) {
    return this._hexaColors[color];
};

module.exports = HexaColors;