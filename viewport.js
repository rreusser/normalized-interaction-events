module.exports = viewport;

/**
 * Set a mat4 to a viewport matrix
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} x lower left corner of viewport
 * @param {Number} y lower left corner of viewport
 * @param {Number} w width of viewport
 * @param {Number} h height of viewport
 * @param {Number} n near value
 * @param {Number} f far value
 * @returns {mat4} out
 */
function viewport(out, x, y, w, h, n, f) {
  out[0] = w * 0.5;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = h * 0.5;
  out[6] = 0;
  out[7] = 0
  out[8] = 0;
  out[9] = 0;
  out[10] = (f - n) * 0.5;
  out[11] = 0;
  out[12] = x + w * 0.5;
  out[13] = y + h * 0.5;
  out[14] = (f + n) * 0.5;
  out[15] = 1;
  return out;
}
