var express = require('express');
var responseTime = require('response-time');
var bodyParser = require('body-parser');
var factorial = require('big-factorial');
var app = express();
var request = require('request');
var Pvis = require('./vis/pvis');
var pvis = new Pvis();

//pvis.start();

var influx = require('influx')
var kafka = require('kafka-node')

// InfluxDB client
var influxClient = influx({
  // single-host configuration
  host : '192.168.88.90',
  port : 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : 'admin',
  password : 'admin',
  database : 'pvis'
});

var timely = require('timely');
var label;
var t;
var controller = function(delays, total, cb){
//    consolGe.log(m);
  request('http://192.168.88.101:7777/sthcontrol', function(err, res, body){
    t = res.caseless.get('x-response-time');
    t = t.substring(0, t.length-2);
    t = parseFloat(t);
   label = "cController\ndelay: "+t+"ms";
    delays.push({data:{id: "cController", module: "#6272A3", delay: t, tag: label}});
    total += t;
    cb();
  });
};

var tController = timely.async(controller);

var dataExtractor = function(){
//  factorial(300);
  return 'DataExtractor';
};
var tDataExtractor = timely(dataExtractor);
app.use(responseTime());
app.use(bodyParser.json());
app.get('/v0.1/getdata', function(req, res){
  res.send("Hello World! This change is automatically integrated");
});

var delays;
var total;
var timestamp;
var edges = [
  {data:{source:"DataLoader", target:"DataExtractor"}},
  {data:{source:"DataExtractor", target:"oController"}},
  {data:{source:"oController", target:"cController"}}];

var done = function(err, res){
  if(err)
    console.log(err);
}

var dataLoader = function(){
  var consumer;
  var kafka = require('kafka-node'),
  Consumer = kafka.Consumer,
  client = new kafka.Client('192.168.88.91:2181'),
//    topics = [{topic: 'smart_energy160605', partition:topicn}];
  topics = [{topic: 'se'}];
  consumer = new Consumer(
    client, topics,
    {groupId: 'se_gw', autoCommit: true}
  );

  consumer.on('message', function (message) {
//      sleep.usleep(300000+Math.random()*50000); // 1초에 대충 3개
    var msg = message.value;
    msg = JSON.parse(msg);

    delays = [];

    timestamp = new Date();
    diff = timestamp.getTime() - parseInt(msg.when);
    label = "DataLoader\ndelay: "+diff+"ms";
    delays.push({data:{id: "DataLoader", module: "#B3767E", delay: diff, tag: label}});
    total = diff;

    tDataExtractor();
    label = "DataExtractor\ndelay: "+tDataExtractor.time+"ms";
    delays.push({data:{id: "DataExtractor", module: "#B3767E", delay: tDataExtractor.time, tag: label}});
    total += tDataExtractor.time;

    tController(delays, total, function(){
      label = "oController\ndelay: "+tController.time+"ms";
      delays.push({data:{id: "oController", module: "#B3767E", delay: tController.time, tag: label}});
      total += tController.time;

//      label = "Service Performance: "+total+"ms";
//      delays.push({data:{id: "Service Performance", module: "X", delay: total, tag: label}});
      var d = {time:timestamp, Total: total, DataLoader: diff, DataExtractor: tDataExtractor.time, oController: tController.time, cController:t};
//      console.log(d);
      influxClient.writePoint('pvis', d, null, done);
      var datas = {time:timestamp, nodes: delays, edges: edges};
      pvis.setData(datas, total);
/*
      console.log(datas);
      console.log('\nnodes');
      console.log(datas.nodes);
      console.log('\nedges');
      console.log(datas.edges);
      console.log(total+'ms\n');*/
    });
  });
}

dataLoader();

app.listen(5555);
