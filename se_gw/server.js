var cluster = require('cluster');
var express = require('express');
var responseTime = require('response-time');
var bodyParser = require('body-parser');
var factorial = require('big-factorial');
var globalv = 0;
var numOfPartition = 1;
var diff = -1;
var absdiff = 0;
if(cluster.isMaster){
  cluster.setupMaster({
  execArgv: ['--debug-brk=6870']});
  var maxWorkers = 1;
  console.log('workers: '+maxWorkers);
// 노드는 싱글 쓰레드 기반이기 때문에, 멀티코어를 활용하려면
// 아무래도 멀티 프로세스로 구동해야 한다.
  var app = express();
  var k = maxWorkers;
  var pp;
  var prev = '';
  var request = require('request');
// 서브 프로세스를 만들고, 그 프로세스에게 어떤 파티션을 읽을지를 전달해준다.

  var controller = function(m){
//    console.log(m);
    request('http://210.114.90.3:7777/sthcontrol', function(err, res, body){
      console.log('Orchestration Module->SmartEnergy Controller: '+res.caseless.get('x-response-time')+'\n');
    });
  };
  for(var i = 0; i<maxWorkers; i++){
//    globalv++;
    pp = cluster.fork();
    pp.send([globalv, numOfPartition]);
    pp.on('message', controller);
  }

  cluster.on('online', function(worker){
    console.log('Worker ' + worker.process.pid + ' is spawnd and it is online');
  });

// 서브 프로세스가 모종의 일로 종료/사망하면 다시 생성해준다.
  cluster.on('exit', function(worker, code, signal){
    console.log('Process died due to connection loss!');
//      globalv++;
      pp = cluster.fork();
      pp.send([globalv, numOfPartition]);
      pp.on('message', controller);
//    }
  });
  app.listen(6666);
} else{
  var topicn;
  var app = express();
  app.use(responseTime());
  app.use(bodyParser.json());
// 부하 테스트를 위한 request
  app.get('/v0.1/getdata', function(req, res){
    res.send("Hello World! This change is automaticall integrated");
  });
  var consumer;
  app.get('/v0.1/killprocess', function(req, res){
    res.send("process will dead");
    consumer.close(true, function(){console.log("Consumer is dead");});
    process.exit(0);
  });
// 카프카 브로커에서 메시지를 가져와 읽는다.
  process.on('message', function(m, socket) {
    topicn = m[0]%m[1];
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
      console.log('Collector->Data Loader: ' + diff + 'ms');

      console.time('Data Loader->Data Extractor');
      console.timeEnd('Data Loader->Data Extractor');
      console.time('Used time of Data Extractor');
      sleep.usleep(50000);
      console.timeEnd('Used time of Data Extractor');
      process.send(msg.env);
      }
    );

  });
// post 요청을 흉내내기 위한 부분임.
  app.post('/v0.1/postdata', function(req, res){
    console.log("recv" + req.body);
    res.send('ok');
  });
  app.listen(5555);
}
