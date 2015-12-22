'use strict';

function TimeUtils(){}

TimeUtils.prototype.getTime = function() {
    var now = new Date();
    var annee   = now.getFullYear();
    var mois    = ('0'+now.getMonth()+1).slice(-2);
    var jour    = ('0'+now.getDate()   ).slice(-2);
    var heure   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    var seconde = ('0'+now.getSeconds()).slice(-2);
     
    return jour+"/"+mois+"/"+annee+", "+heure+":"+minute+":"+seconde;
};

module.exports = TimeUtils;