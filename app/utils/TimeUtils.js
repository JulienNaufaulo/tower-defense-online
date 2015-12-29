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

TimeUtils.prototype.updateTimer = function(game, timer) {
    var hours = Math.floor(game.time.totalElapsedSeconds() / 3600) % 24;
    var minutes = Math.floor(game.time.totalElapsedSeconds()/60) % 60;
    var seconds = Math.floor(game.time.totalElapsedSeconds()) % 60;
    // var milliseconds = Math.floor(game.time.time) % 100;

    //If any of the digits becomes a single digit number, pad it with a zero
    if (hours < 10)
        hours = '0' + hours;

    if (seconds < 10)
        seconds = '0' + seconds;

    if (minutes < 10)
        minutes = '0' + minutes;

    timer.setText(hours+':'+ minutes + ':'+ seconds); 
};

module.exports = TimeUtils;