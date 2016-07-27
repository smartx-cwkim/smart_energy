var express = require('express');
var bodyParser = require('body-parser');
var factorial = require('big-factorial');
var app = express();
var request = require('request');
//var Pvis = require('./vis/pvis');
//var pvis = new Pvis();

var influx = require('influx')
var kafka = require('kafka-node')

// InfluxDB client
var influxClient = influx({
  // single-host configuration
  host : 'K-BOX',
  port : 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : 'admin',
  password : 'admin',
  database : 'pvis'
});


var controller = function(ip, cb){
//    consolGe.log(m);
  request('http://'+ip+':7777/sthcontrol', function(err, res, body){
    if(res.body == 'ok'){
    }
  });
  cb();
};

app.use(bodyParser.json());
app.get('/v0.1/getdata', function(req, res){
  res.send("Hello World! This change is automatically integrated");
});

var total;
var timestamp;

var consumer;
var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client('192.168.88.147:2181'),
topics = [{topic: 'se'}];
consumer = new Consumer(
  client, topics,
  {groupId: 'se_gw', autoCommit: true}
);

consumer.on('message', function (message) {
//      sleep.usleep(300000+Math.random()*50000); // 1초에 대충 3개
  var msg = message.value;
  msg = JSON.parse(msg);
  console.log(msg);
  timestamp = new Date();

  controller(msg.ip, function(){
//    influxClient.writePoint('pvis', d, null, function(err, res){});
  });
});


app.listen(5555);
