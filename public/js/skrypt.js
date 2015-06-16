/* jshint browser: true, globalstrict: true, devel: true, jquery: true */
/* global io: false */

"use strict";

// Inicjalizacja
window.addEventListener("load", function (event) {

    var status = $('#status');
    var open = $('#open');
    var close = $('#close');
    var send = $('#send');
    var text = $('#text');
    var login = $('#login');
    var message = $('#message');
    var sendLogin = $('#sendLogin');

      
    var socket;

    status.textContent = "Brak połącznia";
    close.attr('disabled', true);
    send.attr('disabled', true);
    login.attr('disabled', false);

    
    // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
    open.on('click', function (event) {
        open.attr('disabled', true);
        if (!socket || !socket.connected) {
            socket = io({forceNew: true});
        }
        
        socket.on('connect', function () {
            close.attr('disabled', false);
            send.attr('disabled', false);
            status.attr("src", "img/bullet_green.png");
            console.log('Nawiązano połączenie przez Socket.io');
        });
        
        socket.on('disconnect', function () {
            open.attr('disabled', false);
            status.attr("src", "img/bullet_red.png");
            console.log('Połączenie przez Socket.io zostało zakończone');
        });
               
        socket.on("error", function (err) {
            message.text( "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'");
        });
               
        socket.on("echo", function (data) {
            if(typeof data == 'object'){
            message.append(data.date +"<br>"+ data.login +"<br>"+ data.text + "<br>");
            console.log(data.login); //"no tak, tak..."
            } else {console.log(data);}
        });
    });
    
    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.on("click", function (event) {
        close.attr('disabled', true);
        send.attr('disabled', true);
        open.attr('disabled', false);
        message.textContent = "";
        socket.io.disconnect();
        console.dir(socket);
    });

    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    send.on("click", function (event) {
        var msg = {text:text.val(), login:login.val(), date:Date()};
        socket.emit('message', msg);
        //console.log(message);
        console.log('Wysłałem wiadomość: ' + text.val());
        text.val("");
    });
    
    //wysyła login do serwera
    sendLogin.on("click", function (event) {
        login.attr('disabled', true);
        socket.emit('login', login.val());
        //console.log(message);
        console.log('Wysłałem login: ' + login.val());
        
        socket.on("echo2", function (data){
            message.text("Uzytkownik " + data + " juz istnieje");
            socket.io.disconnect();
        });
        
    });
    

    
});
