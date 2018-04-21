# normalized-interaction-events

> Normalized events for desktop and mobile interactions

[![experimental][stability-experimental]][stability-url]
<!--[![Build Status][travis-image]][travis-url]-->
<!--[![npm version][npm-image]][npm-url]-->
<!--[![Dependency Status][david-dm-image]][david-dm-url]-->
<!--[![Semistandard Style][semistandard-image]][semistandard-url]-->


## Introduction

This module tells you in a consistent manner about the geometry of user interactions, which is perhaps what you really wanted to know when you set out to write a nice graphical interface.

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
//   x0: 638,
//   y0: 179,
//   x: 638,
//   y: 179,
//   dx: -1,
//   dy: 2,
//   dz: 0,
//   zoomx: 1,
//   zoomy: 1,
//   zoomz: 1,
//   radius: 0,
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
- `x`: current x position, relative to element offset. For wheel reflects current mouse position. For pinches, reflects average x position of touches.
- `y`: current y position, relative to element offset.
- `x0`: initial x position relative to corresponding start event (e.g. for a pinchmove event reflects the location of pinchstart)
- `y0`: initial y position relative to corresponding start event
- `dx`: change in x position from previous event. For wheel event returns wheel event deltaX.
- `dy`: change in y position. For wheel event returns wheel event deltaY.
- `dz`: change in z position. For wheel event returns wheel event deltaY. Is zero except for wheel events (where it's still almost certainly zero).
- `zoomx`: horizontal zoom factor relative to previous event. `1` reflects no change. For pinch events only. (Interpreting wheel events as a zoom is left to usage.)
- `zoomy`: vertical zoom factor relative to previous event. `1` reflects no change. For pinch events only.
- `theta`: angle of the second touch relative to the first. Nonzero for pinch events only.
- `dtheta`: change in angle from previous event.
- `radius`: distance between touch events. Nonzero fro pinch events only.
- `originalEvent`: A reference to the original event. Note that `preventDefault` is *not* called by default.

## License

&copy; 2018 Ricky Reusser. MIT License.


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

