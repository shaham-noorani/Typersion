// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var fs = require('fs')

// Adjacent Files
var Player = require("./player.js")
var Enemy = require("./enemy.js")
var Items = require("./items.js")
var helper = require("./helper.js")

// Server
var app = express();
var server = http.Server(app);
var io = socketIO(server);

// Dynamic port setting for GCloud
const PORT = process.env.PORT || 8000;
app.set('port', PORT);

// Importing static files
app.use('../client', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../client/static/index.html'));
});

//Init game
initGame()

// All of the emits for the client

emitDataForClient()
listenForEmitsFromClient()

// Starts the server.
server.listen(PORT, function() {
    console.log('Starting server on port ' + PORT);
    console.log('Go to: http://localhost:' + PORT + '/ to play!')

  });

function initGame() {
  Player.init()
  Enemy.init()
  Items.init()
}

function emitDataForClient() {
  socket.emit("quotes", helper.readQuotesJSON())
  socket.emit("player", Player.getPlayer())
  socket.emit("enemy", Enemy.getEnemy())
}

function listenForEmitsFromClient() {
  io.on('connection', (socket) => {
    socket.on('levelUpPlayer', (stat) => {
      Player.levelUpStat(stat)
    })
    socket.on('dealDamage', (mult) => {
      Player.dealDamage(mult)
    })
  })
}