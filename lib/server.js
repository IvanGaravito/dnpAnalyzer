var http = require('http')
    , url = require('url')

function start(route, handle) {
    function onRequest(request, response) {
        var postData = ''
          , pathname = url.parse(request.url).pathname
        
        request.setEncoding('utf8')
        request.addListener('data', function (chunk) {
            postData += chunk
        })
        request.addListener('end', function () {
            route(handle, pathname, request, response, postData)
        })
    }

    var server = http.createServer(onRequest).listen(process.config.port, function () {
        console.log('SERVER# Server started at http://' + server._connectionKey.slice(2) + '/')
    })
    return server
}

exports.start = start;