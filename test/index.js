var assert = require ('assert')
var ocafe = require ('./../')
var EventEmitter = require ('events').EventEmitter
var error_count = 0

function assertWithInfo (value, message) {
  process.stdout.write (message)
  try {
    assert (value, message)
    console.log (' ... OK')
  }
  catch (error) {
    console.log (' ... FAIL')
    console.error (error)
    error_count += 1
  }
}

process.once ('exit', function (code) {
  process.exit (Math.min (1, error_count))
})

var emitter = new EventEmitter ()

var event = ''
var cancel ;
var cancelled ;

const args = [
    emitter
  , 'event'
  , function () { event += 'event' }
  , { event:    'an-event'
    , callback: function () { event += 'an-event' }
    }
  , 'an-other-event'
  , function () { event += 'an-other-event' }
  , { event:    'event'
    , callback: function () { event += 'event 2' }
    }
]

cancel = ocafe.apply (null, args.slice ())
cancelled = cancel ()
emitter.emit ('an-other-event')
emitter.emit ('event')
emitter.emit ('an-event')
assertWithInfo (
    event === ''
  , 'Callbacks should not run once cancelled'
)
assertWithInfo (
    cancelled === true
  , 'Return value of cancel should be true when run before events are emitted'
)

cancel = ocafe.apply (null, args.slice ())
emitter.emit ('event')
emitter.emit ('an-event')
emitter.emit ('an-other-event')
emitter.emit ('event')
cancelled = cancel ()
assertWithInfo (
    event === 'event 2'
  , 'Only the last once callback attached to first emitted event name should be run'
)
assertWithInfo (
    cancelled === false
  , 'Return value of cancel should be false when run after events are emitted'
)

