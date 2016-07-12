module.exports = Pvis;

var express = require('express');
var path = require('path');
var app;
var da;
var to;
 

function Pvis(){
  this.app = express();

  this.app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  this.app.use(express.static(path.join(__dirname, 'public')));

  this.app.get('/data', function(req, res){
    res.json(da);
  });

  this.app.get('/total', function(req, res){
    res.send(to+"ms");
  });

  this.app.get('/', function(req, res){
    res.sendFile(__dirname + '/pvis.html');
  });

  this.app.get('/jquery', function(req, res){
    res.sendFile(__dirname + '/jquery.min.js');
  });

  this.app.get('/cytoscape', function(req, res){
    res.sendFile(__dirname + '/cytoscape.min.js');
  });

  this.app.listen(11111);
}

Pvis.prototype.setData = function(data, total){
  da = data;
  to = total;
}

