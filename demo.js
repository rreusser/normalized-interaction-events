var normalizedInteractionEvents = require('./');

var canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
document.body.appendChild(canvas);
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
ctx.lineWidth = 5;

function clear() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
}

function circle (x, y, radius, color) {
  ctx.fillStyle = color || '#000';
  ctx.beginPath()
  ctx.arc(
    (x + 1) * 0.5 * window.innerWidth,
    (-y + 1) * 0.5 * window.innerHeight,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}
function line (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo((x1 + 1) * 0.5 * window.innerWidth, (-y1 + 1) * 0.5 * window.innerHeight);
  ctx.lineTo((x2 + 1) * 0.5 * window.innerWidth, (-y2 + 1) * 0.5 * window.innerHeight);
  ctx.stroke();
}

var wheelsize = 0;
normalizedInteractionEvents()
  .on('wheel', function (event) {
    clear();
    wheelsize = (wheelsize + event.dy * 10.0) % 40;
    function opacity (r) {
      return (0.5 - 0.5 * Math.cos(2.0 * Math.PI * (r - 20) / 80)) * 0.7;
    }
    var r0 = 20 + (wheelsize + 40) % 40
    var r1 = 60 + (wheelsize + 40) % 40
    circle(event.x, event.y, r0, 'rgba(0, 0, 0, '+opacity(r0)+')');
    circle(event.x, event.y, r1, 'rgba(0, 0, 0, '+opacity(r1)+')');
    event.originalEvent.preventDefault();
  })
  .on('mousedown', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(255, 0, 0, 0.5)');
    event.originalEvent.preventDefault();
  })
  .on('mousemove', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(0, 0, 0, 0.5)');
    if (event.active) {
      line(event.x0, event.y0, event.x, event.y);
    }
    event.originalEvent.preventDefault();
  })
  .on('mouseup', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(255, 0, 0, 0.5)');
    event.originalEvent.preventDefault();
    setTimeout(clear, 100);
  })
  .on('touchstart', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(255, 0, 0, 0.5)');
    event.originalEvent.preventDefault();
  })
  .on('touchmove', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(0, 0, 0, 0.5)');
    line(event.x0, event.y0, event.x, event.y);
    event.originalEvent.preventDefault();
  })
  .on('touchend', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(255, 0, 0, 0.5)');
    event.originalEvent.preventDefault();
    setTimeout(clear, 100);
  })
  .on('pinchstart', function (event) {
    clear();
    circle(event.x1, event.y1, 100, 'rgba(0, 0, 0, 0.5)');
    circle(event.x2, event.y2, 100, 'rgba(0, 0, 0, 0.5)');
    //line(event.x1, event.y1, event.x2, event.y2);

    var dx = 100 * Math.cos(event.theta);
    var dy = 100 * Math.sin(event.theta);
    line(event.x - dx, event.y - dy, event.x + dx, event.y + dy);
    event.originalEvent.preventDefault();
  })
  .on('pinchmove', function (event) {
    clear();
    circle(event.x1, event.y1, 100, 'rgba(0, 0, 0, 0.5)');
    circle(event.x2, event.y2, 100, 'rgba(0, 0, 0, 0.5)');
    line(event.x0, event.y0, event.x, event.y);
    //line(event.x1, event.y1, event.x2, event.y2);

    var dx = 100 * Math.cos(event.theta);
    var dy = 100 * Math.sin(event.theta);
    line(event.x - dx, event.y - dy, event.x + dx, event.y + dy);
    event.originalEvent.preventDefault();
  })
  .on('pinchend', function (event) {
    clear();
    circle(event.x, event.y, 50, 'rgba(0, 0, 0, 0.5)');
    event.originalEvent.preventDefault();
  });
