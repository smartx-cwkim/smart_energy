var express = require('express');
var responseTime = require('response-time');
var bodyParser = require('body-parser');
var factorial = require('big-factorial');
var app = express();
var request = require('request');
var controller = function(){
//    console.log(m);
  request('http://210.114.90.3:7777/sthcontrol', function(err, res, body){
    console.time('Orchestration Module->SmartEnergy Controller');
    console.log('Response time of SmartEnergy Controller: '+res.caseless.get('x-response-time')+'\n');
    console.timeEnd('Orchestration Module->SmartEnergy Controller');
  });
};

var dataExtractor = function(){
  factorial(150);
};

app.use(responseTime());
app.use(bodyParser.json());
app.get('/v0.1/getdata', function(req, res){
  res.send("Hello World! This change is automaticall integrated");
});

var consumer;
var kafka = require('kafka-node'),
  Consumer = kafka.Consumer,
  client = new kafka.Client('203.237.53.78:2181'),
//    topics = [{topic: 'smart_energy160605', partition:topicn}];
  topics = [{topic: 'smart_energy160605'}];
  consumer = new Consumer(
    client, topics,
    {groupId: 'se_gw', autoCommit: true}
  );
var sleep = require('sleep');
consumer.on('message', function (message) {
//      sleep.usleep(300000+Math.random()*50000); // 1초에 대충 3개
  var msg = message.value;
  msg = JSON.parse(msg);
  diff = (new Date()).getTime() - parseInt(msg.when);
    console.log('Collector->Data Loader: ' + Math.abs(diff) + 'ms');
    console.time('Data Loader->Data Extractor');
    console.timeEnd('Data Loader->Data Extractor');
    console.time('Used time of Data Extractor');
    dataExtractor();
    console.timeEnd('Used time of Data Extractor');
    controller();
    }
);
app.listen(5555);
