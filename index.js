var config = require('./etc/config.default')
  , paths = require('extend')(process.config, config).paths

var server = require(paths.lib + '/server')
var router = require(paths.lib + '/router')
var requestHandlers = require(paths.lib + '/requestHandlers')

var handle = {}
handle['/'] = requestHandlers.home
handle['/datagram'] = requestHandlers.datagram
handle[0] = requestHandlers.publicFile  //Default handler

server.start(router.route, handle)