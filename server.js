var express = require('express');
var cors = require('cors');
var vhost = require('vhost');
var app     = express();
var path    = require('path');

<<<<<<< HEAD
app.use(express.static(path.resolve(__dirname, './dist/SijiOrder-order')));
app.get('*', function (req, res) {
  var indexFile = path.resolve(__dirname,'./dist/SijiOrder-order/index.html');
=======
app.use(express.static(path.resolve(__dirname, './dist/SijiOrder-shop')));
app.get('*', function (req, res) {
  var indexFile = path.resolve(__dirname,'./dist/SijiOrder-shop/index.html');
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
  res.sendFile(indexFile);
});

var server = express();
<<<<<<< HEAD
var hostname = 'SijiOrder.orderfood.co.kr';
var port = 80;
=======
var hostname = 'SijiOrder-shop.orderfood.co.kr';
var port = 8090;
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab

server.use(vhost(hostname, app));

//var port = process.env.PORT || 4000; //3
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});