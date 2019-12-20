# Ocafe

Once a callback attached to the first emitted event

## Usage

```js
const cancel = ocafe (
    event_emitter
  , 'thisEvent'
  , thisEventCallback
  , { event: 'thatEvent' ,
      callback: thatEventCallback }
)
```

## Parameters

#### Event Emitter

The first parameter must be an object that inherits EventEmitter or implements the EventEmitter interface.

#### Event names and callbacks

Event names and callbacks may be passed as ordered arguments and/or objects having an `event` and `callback` property.

## Cancellation

```js
const cancel = ocafe (
  event_emitter
  // , [name], [callback]
  // , [name], [callback]
)
// cancelled is true if called before
// any of the events above emitted
const cancelled = cancel ()
```

`ocafe` returns a `cancel` function that, if called before one of the events is emitted, will prevent the callbacks passed as arguments from being run. 