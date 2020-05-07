// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var fs = require('fs')

// Adjacent Files
var helper = require("./helper")
var Player = require("./player.js")
var Enemy = require("./enemy")
var Items = require("./items")

// Server
var app = express();
var server = http.Server(app);
var io = socketIO(server);

// Dynamic port setting for GCloud
const PORT = process.env.PORT || 8000;
app.set('port', PORT);

// Importing static files
app.use("/static", express.static(path.join(__dirname, '../client/static')))

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../client/static/index.html'));
});

initGame()

listenForEmitsFromClient()

setInterval(() => {
  secondlyProcesses()
}, 1000)

// Starts the server.
server.listen(PORT, function() {
  console.log('Starting server on port ' + PORT);
  console.log('Go to: http://localhost:' + PORT + '/ to play!')
});

function initGame() {
  Player.init()
  Enemy.init()
  Items.init()
  helper.init()
}

function emitDataForClient() {
  io.emit("quotes", helper.getQuotes())
  io.emit("player", Player.getPlayer())
  io.emit("enemy", Enemy.getEnemy())
}

function listenForEmitsFromClient() {
  io.on('connection', (socket) => {
    socket.on('levelUpPlayer', (stat) => {
      Player.levelUpStat(stat)
    })
    socket.on('dealDamage', (mult) => {
      console.log("damage: " + mult)
      Player.dealDamage(mult)
    })
  })
}

function secondlyProcesses() {
  emitDataForClient()

  // See if player or enemy need to be updates
  Player.completeChecks()
  Enemy.completeChecks()

  // Save current state to json
  // Player.updatePlayerJSON()
  // Enemy.updateEnemyJSON()
}