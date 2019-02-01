var FlumeLog = require('./')

require('bench-flumelog')(function () {
  return FlumeLog('/tmp/bench-flumelog-level' + Date.now())()
}, null, null, function (obj) {
  return obj
//  return Buffer.from(JSON.stringify(obj))
})
