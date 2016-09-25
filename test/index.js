'use strict';

var assert = require('chai').assert;
var interactionToMatrix = require('../');

describe('interaction-to-matrix', function () {
  it('passes a test', function () {
    assert(interactionToMatrix());
  });
});
