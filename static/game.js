var socket = io();
var startTime = 0;
var lastCalledTime;
const times = [];
var fps;

var camX = 0;
var camY = 0;
var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  shooting: false
}

socket.on('pong', function() {
  latency = Date.now() - startTime;
  startTime = Date.now();
  //FPS AND PING COUNTER
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    document.getElementById('stats').innerHTML = "<b>FPS:</b>  " + fps + "<br><b>Ping:</b>  " + latency;
    });
  //FPS AND PING COUNTER
});

function showCoords(event) {
  var x = event.clientX;
  var y = event.clientY;
	console.log(Math.sin(Math.atan2(y, x)), Math.cos(Math.atan2(y, x)))
  return Math.atan2(y, x);
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
    case 32: //SPACE
      movement.shooting = true;
      break;
    case 37: // LEFT
      movement.left = true;
      break;
    case 38: // UP
      movement.up = true;
      break;
    case 39: // RIGHT
      movement.right = true;
      break;
    case 40: // DOWN
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
    case 32:  //SPACE
      movement.shooting = false;
      break;
    case 37: // LEFT
      movement.left = false;
      break;
    case 38: // UP
      movement.up = false;
      break;
    case 39: // RIGHT
      movement.right = false;
      break;
    case 40: // DOWN
      movement.down = false;
      break;
  }
});
document.addEventListener("mousedown", function() {
  movement.shooting = true;
	movement.direction = showCoords(event);
	console.log(showCoords(event));
});
document.addEventListener("mouseup", function() {
  movement.shooting = false;
});
document.addEventListener('click', function() {
  console.log("mousedownworking");
})
//Movement script done

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 1920;
canvas.height = 1080;
var context = canvas.getContext('2d');
socket.on('state', function(players, bullets) {
  context.clearRect(0, 0, 1920, 1080);
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.lineWidth = 10;
    context.arc(player.x - camX, player.y - camY, 15, 0, 2 * Math.PI);
    if (player.id == socket.id) {
      context.fillStyle = "#66ff7a";
      camY += (player.y - camY - 540) / 15;
      camX += (player.x - camX - 960) / 15;
    }

    else {
      context.fillStyle = "#ff6666";
    }
    //    console.log(player.shooting);
    //    console.log(player)
    context.fill();
  }
});