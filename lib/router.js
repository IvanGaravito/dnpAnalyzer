var paths = process.config.paths

function route(handle, pathname, request, response, postData) {
    console.log('ROUTER#  Looking handler for ' + pathname)
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response, postData)
    } else if (typeof handle[0] === 'function') {
        handle[0](request, response)
    } else {
        console.log('ROUTER# No handler found for ' + pathname)
        response.writeHead(404, {'Content-Type': 'text/html'})
        var dataStream = fs.createReadStream(paths.views + '/404.html')
        dataStream.pipe(response)
    }
}

exports.route = route