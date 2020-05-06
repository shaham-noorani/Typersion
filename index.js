// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var fs = require('fs')

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var quotes = ""
var itemTierNames = ""
var rareItems = ""

const PORT = process.env.PORT || 8000;

app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

fs.readFile("static/quotes.json" , (err, data) => {
  if (err) { console.error(err) }
  quotes = JSON.parse(data).quotes
})

fs.readFile("static/items.json" , (err, data) => {
  if (err) { console.error(err) }
  itemTierNames = JSON.parse(data).itemTierNames.names
  rareItems = JSON.parse(data).rareItems
})

setInterval(() => {
  io.emit("quotes", quotes);
  io.emit("itemTierNames", itemTierNames)
  io.emit("rareItems", rareItems)
}, 1000);

// Starts the server.
server.listen(PORT, function() {
    console.log('Starting server on port ' + PORT);
    console.log('Go to: http://localhost:' + PORT + '/ to play!')

  });