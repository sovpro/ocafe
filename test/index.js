const assert = require ('assert')
const ocafe = require ('./../')
const {EventEmitter} = require ('events')

const emitter = new EventEmitter ()

let event = ''
let cancel ;
let cancelled ;

const args = [
    emitter
  , 'event'
  , () => event += 'event'
  , { event:    'an-event'
    , callback: () => event += 'an-event'
    }
  , 'an-other-event'
  , () => event += 'an-other-event'
  , { event:    'event'
    , callback: () => event += 'event 2'
    }
]

cancel = ocafe (...(args.slice ()))
cancelled = cancel ()
emitter.emit ('an-other-event')
emitter.emit ('event')
emitter.emit ('an-event')
assert (
    event === ''
  , 'Callbacks should not run once cancelled'
)
assert (
    cancelled === true
  , 'Return value of cancel should be true when run before events are emitted'
)

ocafe (...(args.slice ()))
emitter.emit ('event')
emitter.emit ('an-event')
emitter.emit ('an-other-event')
emitter.emit ('event')
cancelled = cancel ()
assert (
    event === 'event 2'
  , 'Only the last once callback attached to first emitted event name should be run'
)
assert (
    cancelled === false
  , 'Return value of cancel should be false when run after events are emitted'
)

