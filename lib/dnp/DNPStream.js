var util = require('util')
  , Transform = require('stream').Transform
  , DNPInterpret = require('./DNPInterpret')


module.exports = DNPStream

util.inherits(DNPStream, Transform)
function DNPStream(options) {
    if (!(this instanceof DNPStream)) {
        return new DNPStream(options)
    }

    Transform.call(this, options)

    this._buffer = ''
}

DNPStream.prototype._transform = function (chunk, encoding, cb) {
console.log('DNPStream# _transform', chunk, encoding, cb)
    //TODO: Detect whether chunk is a buffer or a string
    this._buffer += chunk
    cb()
}

DNPStream.prototype._flush = function (cb) {
console.log('DNPStream# _flush', cb)
    var dnpi = new DNPInterpret
      , self = this

    dnpi.setDatagram(this._buffer.toString())
    dnpi.interpret(function (error, data) {
        self.push(data)
        self.push(null)
    })
}
