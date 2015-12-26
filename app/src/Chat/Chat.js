'use strict';

var TimeUtils = require('../../utils/TimeUtils');

function Chat(id, content, inputchat){
	this._id = id;
    this._txt = content;
	this._inputchat = inputchat;
	this._timeUtils = new TimeUtils();
};

Chat.prototype.init = function(socket) {
    // On affiche le chat à l'écran
    $(this._id).fadeIn( "slow" ).css("display","inline-block");

    $(this._inputchat).bind("keypress", onSendMessage);

    // Quand l'utilisateur valide son message avec la touche "Enter", il est envoyé au serveur
    function onSendMessage(e) {
        if(e.which == 13) {
            var message =  $(this).val();
            $(this).val("");
            message = message.trim();
            if(message != "") {
                socket.emit('SEND_CHAT_MESSAGE_TO_SERVER', message);
            }    
        }
    }

};

Chat.prototype.destroy = function() {
	$(this._id+' > h2').empty();
	$('#'+this._txt).empty();
    $(this._id).fadeOut( "slow" );
    $(this._inputchat).unbind( "keypress" );
};

Chat.prototype.displayRoom = function(room) {
    $(this._id+' > h2').append("Room "+(room._id));
};

Chat.prototype.displayListPlayers = function(list) {
    for(var i=0, count=list.length; i < count; i++) {
        this.displayMessage("<span class=\"txt-"+list[i]._color+"\">Joueur "+list[i]._color+" est déjà connecté.</span>");
    }
};

Chat.prototype.displayNewConnectedPlayer = function(player) {
    this.displayMessage("<span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est connecté.</span>");
};

Chat.prototype.displayDisconnectedPlayer = function(player) {
    this.displayMessage("<span class=\"txt-"+player._color+"\">Joueur "+player._color+" s'est déconnecté.</span>");
};

Chat.prototype.displayAllPlayersConnected = function() {
    this.displayMessage("<span>Tous les joueurs sont connectés.<br />Cliquez sur \"Prêt\" pour lancer la partie.</span>");
};

Chat.prototype.displayReadyPlayer = function(player) {
    this.displayMessage("<span class=\"txt-"+player._color+"\">Joueur "+player._color+" est prêt !</span>");
};

Chat.prototype.displayMessage = function(message) {
    $('#'+this._txt).append("<p><span>"+this._timeUtils.getTime()+"</span>"+message+"</p>");
	var elem = document.getElementById(this._txt);
	elem.scrollTop = elem.scrollHeight;
};

Chat.prototype.displayPlayerMessage = function(player, message) {
    this.displayMessage("<span class=\"txt-"+player._color+"\">"+message+"</span>");
    var elem = document.getElementById(this._txt);
    elem.scrollTop = elem.scrollHeight;
};

Chat.prototype.displaySimpleMessage = function(message) {
    $('#'+this._txt).append("<p><span>"+message+"</span></p>");
    var elem = document.getElementById(this._txt);
	elem.scrollTop = elem.scrollHeight;
};

module.exports = Chat;