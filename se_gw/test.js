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
  database : 'nuc06'
});

var influxClient2 = influx({
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
    if(!err && res.body == 'ok'){
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

var buf = [];
var batchsize = 500;
var start = new Date();
var batchdelay = -1;
consumer.on('message', function (message) {
  var msg = message.value;
  msg = JSON.parse(msg);
  buf.push(msg);


  if(buf.length >= batchsize){
    var end = new Date();
    buf.sort(tempsort);
    batchdelay = end-start;
    console.log("Highest temp in recent " +batchsize+" data : "+buf[0].env.temp);
    influxClient.writePoint('nuc06', {time: new Date(), temp: buf[0].env.temp}, null, function(err, res){});
    influxClient2.writePoint('pvis', {time: new Date(), batchdelay:batchdelay}, null, function(err, res){});
    buf = [];
    start = new Date();
  }
});

function tempsort(a, b){
  if(a.env.temp == b.env.temp){return 0;}
  return a.env.temp > b.env.temp ? -1: 1;
}

app.listen(5555);
