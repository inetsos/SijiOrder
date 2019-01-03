var express = require('express');
var cors = require('cors');
var vhost = require('vhost');
var app     = express();
var path    = require('path');

app.use(express.static(path.resolve(__dirname, './dist/sijiorder')));
app.get('*', function (req, res) {
  var indexFile = path.resolve(__dirname,'./dist/sijiorder/index.html');
  res.sendFile(indexFile);
});

var server = express();
var hostname = 'sijiorder.orderfood.co.kr';
var port = 2021;

server.use(vhost(hostname, app));

//var port = process.env.PORT || 4000; //3
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});