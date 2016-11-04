var timestamp = require('monotonic-timestamp')

//only allow one write operation at a time, so that expected sequence is gauranteed
module.exports = function (db) {

  var writing = false, queue = []

  function drain () {
    if(writing || !queue.length) return
    writing = true
    var _queue = queue
    queue = []
    var batch = [], max

    function add (value) {
      batch.push({key: timestamp(), value: value, type: 'put'})
    }

    _queue.forEach(function (op) {
      if(Array.isArray(op.value))
        op.value.forEach(add)
      else add(op.value)
    })

    max = batch[batch.length - 1].key

    db.batch(batch, function (err, value) {
      writing = false
      for(var i in _queue) _queue[i].cb(err, max)

      drain() //if there is more to write, write it.
    })
  }

  return function (value, cb) {
    queue.push({value: value, cb: cb})
    drain()
  }

}




