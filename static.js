'use strict';

window.interactionEvents = require('../../');
window.regl = require('regl');
window.mat4 = require('gl-mat4');
window.mat4.viewport = require('../../viewport');
window.ndarray = require('ndarray');
window.show = require('ndarray-show');
window.extend = require('util-extend');

window.logshow = function (str, mat4) {
  console.log(str + ' =\n' + show(ndarray(mat4, [4, 4])));
}
