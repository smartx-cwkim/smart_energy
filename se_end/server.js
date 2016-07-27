var express = require('express');
var request = require('sync-request');
var responseTime = require('response-time');
var os = require('os');

var app = express();
var period = 100;
var density = 1;

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
    if(address.family === 'IPv4' && !address.internal && address.address.includes("192.168.88")) {
      addresss.push(address.address);
    }
  }
}

app.use(responseTime());

producer.on('ready', function(){
  var sendData = function(){
    env = {"temp": 24+Math.random()*1, "humidity": 0.4+Math.random()*0.05};
    energy = {"volt": volt, "mampere": 0.5+Math.random()*0.05};
    data = {"ip": addresss[0], "when": new Date(), "where":"c208", "env":env, "energy":energy};
    var sdata = JSON.stringify(data);
    payloads = [{topic:'se', messages: sdata}];
    producer.send(payloads, function (err, d) {
      console.log(data);
    });
    setTimeout(sendData, period);
  }
  sendData();
});

app.get('/dataDensity/:density', function(req, res){
  density = req.params.density;
  period/=density;
  res.send("Data density: "+density+" data/sec \n");
});


app.get('/sthcontrol', function(req, res){
  console.log('req');
  res.send('ok');
});

app.listen(7777);
