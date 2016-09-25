// This file will be included as an inline script tag by index.html. It
// also gets wrapped in a `window.onload = function() { ... }` wrapper
// so that the whole file doesn't need to be indented. This means things
// included in the bundle are available here.

'use strict';

var regl = window._regl = window.regl({});

var grid = regl({
  frag: `
    precision mediump float;
    varying vec2 xy;
    void main () {
      gl_FragColor = vec4(vec3(mix(1.0, 0.0,
        step(min(abs(fract(xy.x) - 0.5), abs(fract(xy.y) - 0.5)) * 2.0, 0.1)
      )), 1.0);
    }
  `,
  vert: `
    precision mediump float;
    attribute vec2 position;
    uniform mat4 view, projection;
    varying vec2 xy;
    void main () {
      xy = position * 10.0;
      gl_Position = projection * view * vec4(position, 0.0, 1.0);
    }
  `,
  attributes: {position: [[-1, -1], [1, -1], [0, 1]]},
  depth: {enable: false},
  count: 3,
});

function makeCamera2D (opts) {
  var dirty = true;
  var width, height;
  var mView = mat4.identity([]);
  var mProjection = mat4.identity([]);
  var mViewport = mat4.identity([]);
  var mViewporti = mat4.identity([]);

  var options = extend({
    element: opts.element || window,
  }, opts || {});

  var element = options.element;

  function computeViewport () {
    width = element === window ? element.innerWidth : element.offsetWidth;
    height = element === window ? element.innerHeight : element.offsetHeight;

    mat4.viewport(mViewport, 0, height, width, -height, 0, 1);
    mat4.invert(mViewporti, mViewport);
  }

  computeViewport();

  var dViewport = [];

  interactionEvents({
    element: element,
  }).on('interactionstart', function (ev) {
    ev.preventDefault();
  }).on('interactionend', function (ev) {
    ev.preventDefault();
  }).on('interaction', function (ev) {
    if (!ev.buttons && ['wheel', 'touch', 'pinch'].indexOf(ev.type) === -1) return;

    ev.preventDefault();

    //ev.dtheta = 0;
    var c = Math.cos(ev.dtheta);
    var s = Math.sin(ev.dtheta);

    switch (ev.type) {
      case 'wheel':
        ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
        ev.dx = ev.dy = 0;
        break;
    }

    dViewport[0] = ev.dsx * c;
    dViewport[1] = ev.dsx * s;
    dViewport[2] = 0;
    dViewport[3] = 0;
    dViewport[4] = -ev.dsy * s;
    dViewport[5] = ev.dsy * c;
    dViewport[6] = 0;
    dViewport[7] = 0;
    dViewport[8] = 0;
    dViewport[9] = 0;
    dViewport[10] = 1;
    dViewport[11] = 0;
    dViewport[12] = ev.dsx * s * ev.y0 - ev.dsx * c * ev.x0 + ev.x0 + ev.dx;
    dViewport[13] = -ev.dsy * c * ev.y0 - ev.dsy * s * ev.x0 + ev.y0 + ev.dy;
    dViewport[14] = 0;
    dViewport[15] = 1;

    mat4.multiply(dViewport, dViewport, mViewport);
    mat4.multiply(dViewport, mViewporti, dViewport);
    mat4.multiply(mView, dViewport, mView);
    dirty = true;
  });

  var setProps = regl({
    uniforms: {
      view: regl.prop('view'),
      projection: regl.prop('projection'),
    }
  });

  return {
    draw: function (cb) {
      setProps({
        view: mView,
        projection: mProjection
      }, function () {
        cb({
          dirty: dirty
        });
      });
      dirty = false;
    },
    taint: function () {
      dirty = true;
    },
    resize: computeViewport
  };
}

var camera = makeCamera2D({
  element: regl._gl.canvas,
  constrainZoom: false
});

window.addEventListener('resize', camera.resize);

regl.frame(function () {
  camera.draw(function(data) {
    if (!data.dirty) return;
    regl.clear({color: [0, 0, 0, 1]});
    grid();
  });
});
