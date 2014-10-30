var exec = require('child_process').exec
  , querystring = require('querystring')
  , fs = require('fs')
  , url = require('url')
  , mime = require('mime')
  , paths = process.config.paths
  , dnp = require(paths.lib + '/dnp')

function home(request, response) {
    console.log('HANDLER# Handler "home" called')
    response.writeHead(200, {'Content-Type': 'text/html'})

    var dataStream = fs.createReadStream(paths.views + '/home.html')
    dataStream.pipe(response)
}

function datagram(request, response, postData) {
    console.log('HANDLER# Handler "datagram" called')
    response.writeHead(200, {'Content-Type': 'text/html'})

    var dnpStream = new dnp.DNPStream({objectMode: true})
    dnpStream.pipe(response)

    dnpStream.write(url.parse(request.url).query)
    dnpStream.end()
}

function publicFile(request, response) {
    var pathname = querystring.unescape(url.parse(request.url).pathname)
    console.log('HANDLER# Handler "' + request.url +'" called')
    fs.exists(paths.pub + pathname, function (exists) {
        var dataStream
        if (exists) {
            console.log('HANDLER# Public file handler "' + pathname + '" called')
            response.writeHead(200, {'Content-Type': mime.lookup(pathname)})
            dataStream = fs.createReadStream(paths.pub + pathname)
            dataStream.pipe(response)
        } else {
            console.log('ROUTER# No public file handler found for ' + pathname)
            response.writeHead(404, {'Content-Type': 'text/html'})
            dataStream = fs.createReadStream(paths.views + '/404.html')
            dataStream.pipe(response)
        }
    })
}

exports.home = home
exports.datagram = datagram
exports.publicFile = publicFile