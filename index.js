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

const PORT = process.env.PORT || 8000;

app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

fs.readFile("static/quotes.json" , (err, data) => {
  if (err) { console.error(err) }
  var json = JSON.parse(data)
  quotes = json.quotes
})


setInterval(() => {
  io.emit("quotes", quotes);
}, 1000);

// Starts the server.
server.listen(PORT, function() {
    console.log('Starting server on port ' + PORT);
    console.log('Go to: http://localhost:' + PORT + '/ to play!')

  });