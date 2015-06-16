/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var port = process.env.PORT || 3000;
var Login = [];


var oneDay = 86400000;

app.use('/img', static(__dirname + '/public/img', { maxAge: oneDay }));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(__dirname + '/public'));

io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        io.sockets.emit("echo", data);
        console.log(data.login);

    });
    
    socket.on("login", function(data) {
        var uniqueLogin = 1;
        for(var i = 0; i <= Login.length; i++){
            if(Login[i] == data){
               uniqueLogin = 0; 
            }
        } 
        
        if(uniqueLogin == 1){
            Login.push(data);
        }
        else
        {
            socket.emit("echo2", data);
            //console.log("Znalazłem dubla");
        }
            console.log(Login);        
        
    });
    
    socket.on("error", function (err) {
        console.dir(err);
    });
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
