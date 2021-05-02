// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var cooldown = 10;
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
console.clear();
var players = {};
var bullets = [];

function shoot(x, y, dx, dy) {
  bullets.push([x,y,Math.sin(direction),Math.cos(direction)]);
  console.log(bullets)
}

io.on('connection', function(socket) {
  console.log("User joined: "+socket.id)
  socket.on('new player', function() {
    players[socket.id] = {
      x: 920,
      y: 540,
      shooting: 0,
      id: socket.id
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    cooldown = cooldown + 1;
    if (data.left) {
      player.x -= 7;
    }
    if (data.up) {
      player.y -= 7;
    }
    
    if (data.right) {
      player.x += 7;
    }
    if (data.down) {
      player.y += 7;
    }
    if (data.shooting) {
      if(cooldown > 250){
        player.shooting = true;
        shoot(player.x, player.y, player.direction);
        cooldown = 0;
      }
    }
    if (!data.shooting) {
      player.shooting = false;
    }
    socket.emit('pong');
  });
  socket.on('disconnect', () => {
    console.log('User left: '+socket.id)
    delete players[socket.id] 
  })
});

setInterval(function() {
  io.sockets.emit('state', players, bullets);
	console.log(bullets);
}, 1000/60);