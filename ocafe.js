module.exports = ocafe

var arrayProtoSlice = Array.prototype.slice

function ocafe () {
  var callbacks = arrayProtoSlice.call (arguments)
  var emitter = callbacks.splice (0, 1)[0]
  var i = 0
  var bench = {}
  var bench_cb = {}

  function finish () {
    finish = function () { return false }
    var events = Object.keys (bench)
    var event ;
    var i = 0;
    while (i < events.length) {
      event = events[i]
      emitter.removeListener (event, bench[event])
      i += 1
    }
    return true
  }

  function invokeCb (event) {
    return function () {
      var args = arrayProtoSlice.call (arguments)
      finish ()
      bench_cb[event].apply (null, args)
    }
  }

  i = callbacks.length

  while (i--) {
    var event ;
    var callback ;

    if (typeof callbacks[i] === 'function')  {
      event = callbacks[i - 1]
      callback = callbacks[i]
      i -= 1
    }
    else {
      event = callbacks[i].event
      callback = callbacks[i].callback
    }

    if (bench.hasOwnProperty (event) === false) {
      bench_cb[event] = callback
      bench[event] = invokeCb (event)
      emitter.once (event, bench[event])
    }
  }

  return function () { return finish () }
}
