var express = require('express');
var request = require('sync-request');
var responseTime = require('response-time');
var os = require('os');
var influx = require('influx');

var influxClient = influx({
  host : 'K-BOX',
  port : 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : 'admin',
  password : 'admin',
  database : 'pvis2'
});

var app = express();
var period = 100;
var density = 10;

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client('nuc06:2181'),
    producer = new Producer(client);

var env, energy, data;
var payloads;
var volt = Math.random()*219;

var interfaces = os.networkInterfaces();
var addresss = [];
for(var k in interfaces) {
  for(var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if(address.family === 'IPv4' && !address.internal && address.address[8]=='8') {
      addresss.push(address.address);
    }
  }
}

app.use(responseTime());

producer.on('ready', function(){
  var sendData = function(){
    var start = new Date();
    env = {"temp": 24+Math.random()*1, "humidity": 0.4+Math.random()*0.05};
    energy = {"volt": volt, "mampere": 0.5+Math.random()*0.05};
    data = {"ip": addresss[0], "when": new Date(), "where":"c208", "env":env, "energy":energy};
    var sdata = JSON.stringify(data);
    payloads = [{topic:'se', messages: sdata}];
    producer.send(payloads, function (err, d) {
      console.log(data);
      var end = new Date();
      var diff = end-start;
      influxClient.writePoint('pvis2', {time: new Date(), delay: diff}, null, function(err, res){console.log(err);});
    });
    setTimeout(sendData, period);
  }
  sendData();
});

app.get('/dataDensity/:density', function(req, res){
  density = req.params.density;
  period=1000/density;
  res.send("Data density: "+density+" data/sec \n");
});


app.get('/sthcontrol', function(req, res){
  console.log('req');
  res.send('ok');
});

app.listen(7777);
