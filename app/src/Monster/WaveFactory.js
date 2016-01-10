'use strict';

function WaveFactory(game, map){
    this._posX = null;
    this._posY = null;
};

MonsterFactory.prototype.getInstance = function(type) {
    switch(type) {
        case "skeleton":
            return new Skeleton(i, this._layer, this._game, this._path, this._socket, this, "skeleton");
            break;
    }
};

module.exports = MonsterFactory;