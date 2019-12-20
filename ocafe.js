module.exports = ocatfee

function ocatfee (emitter, ...callbacks) {
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
      emitter.off (event, bench[event])
      i += 1
    }
    return true
  }

  const invokeCb = event => (...args) => {
    finish ()
    bench_cb[event] (...args)
  }

  i = callbacks.length

  while (i-- > 0) {
    let event ;
    let callback ;

    if (typeof callbacks[i] === 'function')  {
      event = callbacks[i - 1]
      callback = callbacks[i]
      i -= 2
    }
    else {
      event = callbacks[i].event
      callback = callbacks[i].callback
      i -= 1
    }

    if (bench.hasOwnProperty (event) === false) {
      bench_cb[event] = callback
      bench[event] = invokeCb (event)
      emitter.once (event, bench[event])
    }
  }

  return () => finish ()
}
