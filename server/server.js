// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

// Adjacent Files
var helper = require("./helper")
var Player = require("./player")
var Enemy = require("./enemy")
var Items = require("./items");

// Server
var app = express();

// Dynamic port setting for GCloud
const PORT = process.env.PORT || 8000;
app.set('port', PORT);

// Importing static files
app.use("/static", express.static(path.join(__dirname, '../client/static')))

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../client/static/index.html'));
});

// Server
var server = http.Server(app);
var io = socketIO(server);

initGame()

listenForEmitsFromClient()

setInterval(() => {
  secondlyProcesses()
}, 10)

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
  // if (Enemy.getEnemy())
  if (Enemy.getEnemy() && Enemy.getEnemy().boss.isBoss) {
    io.emit("bossTimer", Enemy.getEnemy())
  }
}

function listenForEmitsFromClient() {
  io.on('connection', (socket) => {
    socket.on('player', (player) => {
      Player.setPlayer(player)
    })
    socket.on('enemy', (enemy) => {
      Enemy.setEnemy(enemy)
    })

    socket.on('dealDamage', function (mult, callback) {
      Player.dealDamage(mult)
      Enemy.completeChecks()
      Player.completeChecks()

      try { callback({ enemy: Enemy.getEnemy(), player: Player.getPlayer() }) }
      catch (err) { console.error(err) }
    })
    socket.on('levelUpPlayer', function (stat, callback) {
      Player.levelUpStat(stat)
      Player.completeChecks()

      try { callback({ player: Player.getPlayer() }) }
      catch (err) { console.error(err) }
    })
    socket.on('retryBoss', function (callback) {
      Player.retryBoss()
      Player.completeChecks()
      Enemy.completeChecks()

      try { callback({ player: Player.getPlayer(), enemy: Enemy.getEnemy() }) }
      catch (err) { console.error(err) }
    })
    socket.on('equip', function(item, callback) {
      Player.equipItem(item)
      Player.completeChecks()

      try { callback({ player: Player.getPlayer(), enemy: Enemy.getEnemy() }) }
      catch (err) { console.error(err) }
    })
  })
}

function secondlyProcesses() {
  // Passing around instances of objects
  Player.setEnemy(Enemy)
  Enemy.setPlayer(Player)
  Items.setPlayer(Player)
  
  // See if player or enemy need to be updated
  Player.completeChecks()
  Enemy.completeChecks()
  
  emitDataForClient()
}