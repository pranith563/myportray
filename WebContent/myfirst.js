var http = require('http');
var url = require('url');
var dt = require('./dateModule')
var path = require('path')
var fs = require('fs')

http.createServer(function (req, res) {
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	var filepath = path.join(__dirname, filename);
    fs.readFile(filepath, {encoding: 'utf-8'}, function(err,data)
    {
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(dt.myDateTime());
    	res.write(data);
    	return res.end();
    });
}).listen(8000);