module.exports = ocafe

function ocafe (emitter, ...callbacks) {
  let i = 0
  let bench = {}
  let bench_cb = {}

  let finish = () => {
    finish = () => false
    const events = Object.keys (bench)
    let event ;
    let i = 0;
    while (i < events.length) {
      event = events[i]
      emitter.removeListener (event, bench[event])
      i += 1
    }
    return true
  }

  const invokeCb = event => (...args) => {
    finish ()
    bench_cb[event] (...args)
  }

  i = callbacks.length

  while (i--) {
    let event ;
    let callback ;

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

  return () => finish ()
}
