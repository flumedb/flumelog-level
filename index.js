var Level = require('level')
var mkdirp = require('mkdirp')
var Obv = require('obv')
var peek = require('level-peek')
var Double = require('varstruct/types/numbers').DoubleBE
var pull = require('pull-stream/pull')
var Map = require('pull-stream/throughs/map')
var Read = require('pull-level/read')

var createAppend = require('./append')

module.exports = function (dir) {

  var since = Obv()

  var db = Level(dir, {keyEncoding: Double, valueEncoding: 'json'})

  peek.last(db, {}, function (_, upto) {
    since.set(upto || -1)
  })

  db.on('batch', function (batch) {
    since.set(batch[batch.length - 1].key)
  })

  return {
    dir: dir,
    since: since,
    get: function (seq, cb) {
      db.get(seq, cb)
    },
    stream: function (opts) {
      opts.keys = null //don't accidentially support level api.
      opts.keys = opts.seqs //alias flume api to level api.
      var seqs = opts.seqs !== false, values = opts.values !== false

      function format(seq, value) {
        if(seqs && values) return {seq: seq, value: value}
        else if(seqs) return seq
        else return value
      }

      //since we are using timestamps inside BE
      if(opts.gt < 0) opts.gt = 0
      if(opts.gte < 0) opts.gte = 0

      opts.keys = true
      opts.values = true
      opts.sync = false
      return pull(
        Read(db, opts),
        Map(function (data) {
          console.log('flumelog-level', data)
          return format(data.key, data.value)
        })
      )
    },
    append: createAppend(db)
  }
}


