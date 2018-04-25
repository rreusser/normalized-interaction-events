# normalized-interaction-events

> Normalized events for desktop and mobile interactions

[![experimental][stability-experimental]][stability-url]
<!--[![Build Status][travis-image]][travis-url]-->
<!--[![npm version][npm-image]][npm-url]-->
<!--[![Dependency Status][david-dm-image]][david-dm-url]-->
<!--[![Semistandard Style][semistandard-image]][semistandard-url]-->


## Introduction

This module tells you in a consistent manner about the geometry of user interactions, which is perhaps what you really wanted to know when you set out to write a nice graphical interface. All positions are normlized to the inerval `[-1, 1]`, where the left bottom of the element is `[-1, -1]` and the top right is `[1, 1]`.

Mouse buttons and mods are output in the style of [mouse-change](https://github.com/mikolalysenko/mouse-change).

## Example

```javascript
var normalizedInteractionEvents = require('normalized-interaction-events');

normalizedInteractionsEvents({
  element: myel
}).on('wheel', function (event) {
  console.log(event);
});

// => 
// {
//   buttons: 0,
//   mods: {
//     shift: false,
//     alt: false,
//     control: false,
//     meta: false
//   },
//   x0: -0.0129,
//   y0: -0.923,
//   x1: -0.0129,
//   y1: -0.923,
//   x2: null,
//   y2: null,
//   x: -0.129,
//   y: -0.923,
//   dx: -0.0011,
//   dy: -0.0038,
//   dz: 0,
//   zoomx: 1,
//   zoomy: 1,
//   theta: 0,
//   dtheta: 0,
//   originalEvent: MouseEvent {isTrusted: true, screenX: 638, …}
// }
```

## Usage

#### `require('normalized-interaction-events')([element])`

Creates an [event-emitter](https://www.npmjs.com/package/event-emitter) to which you may subscribe. `element` defaults to `window`. Event emitter has the following additional methods:

#### `.disable()`
#### `.enable()`

Enable or disable the emitter by attaching/detaching event listeners. Enabled by default.

### Events

The emitter emits the following events:

- `wheel`
- `mousedown`
- `mousemove`
- `mouseup`
- `touchstart`
- `touchmove`
- `touchend`
- `pinchstart`
- `pinchmove`
- `pinchend`

The returned event has the following fields:

- `buttons`: mouse buttons pressed, in the return format of [mouse-change](https://github.com/mikolalysenko/mouse-change).
- `mods`: modifier keys presed, in the return format of [mouse-change](https://github.com/mikolalysenko/mouse-change).
- `x`: current x position. For wheel reflects current mouse position. For pinches, reflects average x position of touches.
- `y`: current y position.
- `x0`: x position of the corresponding start event (e.g. for a pinchmove event reflects the location of pinchstart)
- `y0`: y position of the corresponding start event
- `x1`: x position of the first event
- `y1`: y position of the first event
- `x2`: x position of the second event. `null` for mouse or wheel events of when only one touch is occuring.
- `y2`: y position of the second event. `null` for mouse or wheel events of when only one touch is occuring.
- `active`: Number of active touches. `0` for passive move events. `1` for dragging, wheel, and touch events, `2` for pinch events. Better than using the mouse depressed state for detecting when to assume a drag since you want to be sure that the drag *originated* within the window.
- `dx`: change in x position from previous event. For wheel event returns wheel event deltaX.
- `dy`: change in y position. For wheel event returns wheel event deltaY.
- `dz`: change in z position. For wheel event returns wheel event deltaY. Is zero except for wheel events (where it's still almost certainly zero).
- `zoomx`: horizontal zoom factor relative to previous event. `1` reflects no change. For pinch events only. (Interpreting wheel events as a zoom is left to usage.)
- `zoomy`: vertical zoom factor relative to previous event. `1` reflects no change. For pinch events only.
- `theta`: angle of the second touch relative to the first. Nonzero for pinch events only. View aspect ratio is taken into account when computing.
- `dtheta`: change in angle from previous event.
- `originalEvent`: A reference to the original event. Note that `preventDefault` is *not* called by default.

## License

&copy; 2018 Ricky Reusser. MIT License. Touch handling in this code inherits from [touch-pinch](https://github.com/Jam3/touch-pinch/). See [LICENSE.md](./LICENSE.md) for more details.


<!-- BADGES -->

[travis-image]: https://travis-ci.org/rreusser/interaction-events.svg?branch=master
[travis-url]: https://travis-ci.org//interaction-events

[npm-image]: https://badge.fury.io/js/interaction-events.svg
[npm-url]: https://npmjs.org/package/interaction-events

[david-dm-image]: https://david-dm.org/rreusser/interaction-events.svg?theme=shields.io
[david-dm-url]: https://david-dm.org/rreusser/interaction-events

[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[semistandard-url]: https://github.com/Flet/semistandard

<!-- see stability badges at: https://github.com/badges/stability-badges -->
[stability-url]: https://github.com/badges/stability-badges
[stability-deprecated]: http://badges.github.io/stability-badges/dist/deprecated.svg
[stability-experimental]: http://badges.github.io/stability-badges/dist/experimental.svg
[stability-unstable]: http://badges.github.io/stability-badges/dist/unstable.svg
[stability-stable]: http://badges.github.io/stability-badges/dist/stable.svg
[stability-frozen]: http://badges.github.io/stability-badges/dist/frozen.svg
[stability-locked]: http://badges.github.io/stability-badges/dist/locked.svg

