'use strict';

module.exports = normalizedInteractionEvents;

var mouseChange = require('mouse-change');
var eventOffset = require('mouse-event-offset');
var eventEmitter = require('event-emitter');

function normalizedInteractionEvents (opts) {
  var element = (opts && opts.element) ? opts.element : window

  var emitter = eventEmitter();
  var enabled = false;
  var previousPosition = [null, null];
  var currentPosition = [null, null];
  var fingers = [null, null];
  var activeTouchCount = 0;
  var ev = {};

  var buttons = 0, mods = {};
  var changeListener = mouseChange(element, function(pbuttons, px, py, pmods) {
    buttons = pbuttons;
    mods = pmods;
  });

  function onWheel (event) {
    eventOffset(event, element, currentPosition);

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = currentPosition[0];
    ev.y0 = currentPosition[1];
    ev.dx = event.deltaX;
    ev.dy = event.deltaY;
    ev.dz = event.deltaZ;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('wheel', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function onMouseUp (event) {
    eventOffset(event, element, currentPosition);

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = currentPosition[0];
    ev.y0 = currentPosition[1];
    ev.dx = 0;
    ev.dy = 0;
    ev.dz = 0;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.radius = 0;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mouseup', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function onMouseDown (event) {
    eventOffset(event, element, currentPosition);

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = currentPosition[0];
    ev.y0 = currentPosition[1];
    ev.dx = 0;
    ev.dy = 0;
    ev.dz = 0;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.radius = 0;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mousedown', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function onMouseMove (event) {
    eventOffset(event, element, currentPosition);

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = currentPosition[0];
    ev.y0 = currentPosition[1];
    ev.dx = currentPosition[0] - previousPosition[0];
    ev.dy = currentPosition[1] - previousPosition[1];
    ev.dz = 0;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.radius = 0;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mousemove', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function indexOfTouch (touch) {
    var id = touch.identifier
    for (var i = 0; i < fingers.length; i++) {
      if (fingers[i] &&
        fingers[i].touch &&
        fingers[i].touch.identifier === id) {
        return i
      }
    }
    return -1
  }

  function onTouchStart (event) {
    previousPosition[0] = null;
    previousPosition[1] = null;

    for (var i = 0; i < event.changedTouches.length; i++) {
      var newTouch = event.changedTouches[i]
      var id = newTouch.identifier
      var idx = indexOfTouch(id)

      if (idx === -1 && activeTouchCount < 2) {
        var first = activeTouchCount === 0

        // newest and previous finger (previous may be undefined)
        var newIndex = fingers[0] ? 1 : 0
        var oldIndex = fingers[0] ? 0 : 1
        var newFinger = {
          position: [0, 0],
          touch: null
        };

        // add to stack
        fingers[newIndex] = newFinger
        activeTouchCount++

        // update touch event & position
        newFinger.touch = newTouch
        eventOffset(newTouch, element, newFinger.position)

        var oldTouch = fingers[oldIndex] ? fingers[oldIndex].touch : undefined
      }
    }

    var x0avg = 0;
    var y0avg = 0;
    var fingerCount = 0;
    for (var i = 0; i < fingers.length; i++) {
      if (!fingers[i]) continue;
      x0avg += fingers[i].position[0];
      y0avg += fingers[i].position[1];
      fingerCount++;
    }


    if (activeTouchCount > 0) {
      ev.radius = ev.theta = 0;

      if (fingerCount > 1) {
        var dx = fingers[1].position[0] - fingers[0].position[0];
        var dy = fingers[1].position[1] - fingers[0].position[1];
        ev.radius = Math.sqrt(dx * dx + dy * dy) * 0.5;
        ev.theta = Math.atan2(dy, dx);
      }

      ev.buttons = 0;
      ev.mods = {};
      ev.x0 = x0avg / fingerCount;
      ev.y0 = y0avg / fingerCount;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.dsx = 1;
      ev.dsy = 1;
      ev.dsz = 1;
      ev.dtheta = 0;
      ev.originalEvent = event;
      emitter.emit(activeTouchCount === 1 ? 'touchstart' : 'pinchstart', ev);
    }
  }

  var px0 = null;
  var py0 = null;
  function onTouchMove (event) {
    var idx;
    var changed = false
    for (var i = 0; i < event.changedTouches.length; i++) {
      var movedTouch = event.changedTouches[i]
      idx = indexOfTouch(movedTouch)

      if (idx !== -1) {
        changed = true
        fingers[idx].touch = movedTouch // avoid caching touches
        eventOffset(movedTouch, element, fingers[idx].position)
      }
    }

    if (changed) {
      if (activeTouchCount === 1) {
        for (idx = 0; idx < fingers.length; idx++) {
          if (fingers[idx]) break;
        }

        if (fingers[idx] && previousPosition[idx]) {
          var x = fingers[idx].position[0];
          var y = fingers[idx].position[1];

          var dx = x - previousPosition[idx][0];
          var dy = y - previousPosition[idx][1];

          ev.buttons = 0;
          ev.mods = {};
          ev.x0 = x;
          ev.y0 = y;
          ev.dx = dx;
          ev.dy = dy;
          ev.dz = 0;
          ev.dsx = 1;
          ev.dsy = 1;
          ev.dsz = 1;
          ev.theta = 0;
          ev.dtheta = 0;
          ev.originalEvent = event;

          emitter.emit('touchmove', ev);
        }
      } else if (activeTouchCount === 2) {
        if (previousPosition[0] && previousPosition[1]) {
          // Previous two-finger vector:
          var pos0A = previousPosition[0];
          var pos0B = previousPosition[1];
          var dx0 = pos0B[0] - pos0A[0];
          var dy0 = pos0B[1] - pos0A[1];

          // Current two-finger vector:
          var pos1A = fingers[0].position;
          var pos1B = fingers[1].position;
          var dx1 = pos1B[0] - pos1A[0];
          var dy1 = pos1B[1] - pos1A[1];

          // r, theta for the previous two-finger touch:
          var r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) * 0.5;
          var theta0 = Math.atan2(dy0, dx0);

          // r, theta for the current two-finger touch:
          var r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) * 0.5;
          var theta1 = Math.atan2(dy1, dx1);

          var x0 = (pos0B[0] + pos0A[0]) * 0.5;
          var y0 = (pos0B[1] + pos0A[1]) * 0.5;
          var dx = 0.5 * (pos1B[0] + pos1A[0] - pos0A[0] - pos0B[0]);
          var dy = 0.5 * (pos1B[1] + pos1A[1] - pos0A[1] - pos0B[1]);
          var dr = r1 / r0;
          var dtheta = theta1 - theta0;

          ev.buttons = 0;
          ev.mods = mods;
          ev.x0 = x0;
          ev.y0 = y0;
          ev.dx = dx;
          ev.dy = dy;
          ev.dz = 0;
          ev.dsx = dr;
          ev.dsy = dr;
          ev.dsz = 1;
          ev.radius = r1;
          ev.theta = theta1;
          ev.dtheta = dtheta;
          ev.originalEvent = event;

          emitter.emit('pinchmove', ev);

          px0 = x0;
          py0 = y0;
        }
      }
    }

    if (fingers[0]) {
      previousPosition[0] = fingers[0].position.slice();
    }

    if (fingers[1]) {
      previousPosition[1] = fingers[1].position.slice();
    }
  }

  function onTouchRemoved (event) {
    var lastFinger;
    for (var i = 0; i < event.changedTouches.length; i++) {
      var removed = event.changedTouches[i]
      var idx = indexOfTouch(removed)

      if (idx !== -1) {
        lastFinger = fingers[idx];
        fingers[idx] = null
        activeTouchCount--
        var otherIdx = idx === 0 ? 1 : 0
        var otherTouch = fingers[otherIdx] ? fingers[otherIdx].touch : undefined
      }
    }

    var x0avg = 0;
    var y0avg = 0;
    if (activeTouchCount === 0) {
      if (lastFinger) {
        x0avg = lastFinger.position[0];
        y0avg = lastFinger.position[1];
      }
    } else {
      var fingerCount = 0;
      for (var i = 0; i < fingers.length; i++) {
        if (!fingers[i]) continue;
        x0avg += fingers[i].position[0];
        y0avg += fingers[i].position[1];
        fingerCount++;
      }
      x0avg /= fingerCount;
      y0avg /= fingerCount;
    }

    if (activeTouchCount < 2) {
      ev.buttons = 0;
      ev.mods = mods;
      ev.x0 = x0avg;
      ev.y0 = y0avg;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.dsx = 1;
      ev.dsy = 1;
      ev.dsz = 1;
      ev.theta = 0;
      ev.dtheta = 0;
      ev.originalEvent = event;
      emitter.emit(activeTouchCount === 0 ? 'touchend' : 'pinchend', ev);
    }
  }


  function enable () {
    if (enabled) return;
    enabled = true;
    changeListener.enabled = true;
    element.addEventListener('wheel', onWheel, false);
    element.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);

    element.addEventListener('touchstart', onTouchStart, false);
    window.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('touchend', onTouchRemoved, false)
    window.addEventListener('touchcancel', onTouchRemoved, false)
  }

  function disable () {
    if (!enabled) return;
    enabled = false;
    changeListener.enabled = false;
    element.removeEventListener('wheel', onWheel, false);
    element.removeEventListener('mousedown', onMouseDown, false);
    window.removeEventListener('mousemove', onMouseMove, false);
    window.removeEventListener('mouseup', onMouseUp, false);

    element.removeEventListener('touchstart', onTouchStart, false);
    window.removeEventListener('touchmove', onTouchMove, false);
    window.removeEventListener('touchend', onTouchRemoved, false)
    window.removeEventListener('touchcancel', onTouchRemoved, false)
  }

  enable();

  emitter.enable = enable;
  emitter.disable = disable;

  return emitter;
}
