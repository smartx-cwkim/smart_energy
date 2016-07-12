var express = require('express');
var request = require('sync-request');
var responseTime = require('response-time');
var bigFactorial = require('big-factorial');
var app = express();
var period = 15000;

// should be..
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client('192.168.88.91:2181'),
    producer = new Producer(client);

var env, energy, data;
var payloads;
var volt = Math.random()*219;
var partitiona = (new Date()).getTime()%4;

app.use(responseTime());

producer.on('ready', function(){
  var sendData = function(){
    env = {"temp": 24+Math.random()*1, "humidity": 0.4+Math.random()*0.05};
    energy = {"volt": volt, "mampere": 0.5+Math.random()*0.05};
    data = {"when": (new Date()).getTime(), "where":"c208", "env":env, "energy":energy};
    var sdata = JSON.stringify(data);
//    payloads = [{topic:'smart_energy160605', messages: sdata, partition:partition}];
    payloads = [{topic:'se', messages: sdata, partition:0}];
    producer.send(payloads, function (err, d) {
//      console.log(d);
      console.log(data);
    });
    setTimeout(sendData, period);
  }
  sendData();
});

app.get('/sthcontrol', function(req, res){
  res.send('okay');
});

// polling rate
app.get('/period1000', function(req, res){
  period = 1000;
  var date = new Date();
  console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+'consumer is busy!!');
  res.send('Setted 1000 \n');
});
app.get('/period200', function(req, res){
  period = 200;
  var date = new Date();
  console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+'consumer is idle!');
  res.send('Setted 200 \n');
});

app.listen(7777);
