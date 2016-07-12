var express = require('express');
var bodyParser = require('body-parser');

var app = express();

console.log("start..");

app.use(bodyParser.json());

app.get('/v0.1/getdata', function(req, res){
  console.log("getdata");
  res.send("OK");
});


app.post('/v0.1/postdata', function(req, res){
//데이터는 JSON 형식으로 받는다.
//사실은 kafka broker 에서 consumer API를 써서 가져와야 옳으나, 빠른 프로토타이핑을 위해
//RPi에서 바로 데이터를 받게끔 했다.
//  var data = req.body.data;
  console.log("recv" + req.body);
//  console.log(data.when + " From : [" + data.where + "] ID : [" + data.id + "]");
// kafka consumer 인 이 서버에서 lag이 발생하여 토픽에 메시지가 많이 남게 되면,
// 스케일링을 해야한다.
// 분산된 웹 어플리케이션 상황이므로 일관성을 위해 zookeeper znode에 데이터를 보관한다.
// 즉,kafka에서 받아온 데이터들과 관련된 zookeeper znode 를 가져와서,
//  var a = zk_getdata(req.body.where);
//  var b = zk_getdata(req.body.id);
// 처리를 해준다
//  calc(req.body);

  res.send('ok');
//  res.send('ok ' + data.id);
});



var zk_getdata = function(){
};

var calc = function(data){
  var irregular = false;
//계산을 해주고

//이레귤러가 발생한거면 
  if(irregular === true){
//해당 노드에게 행동을 촉구하는 액션을 취하도록 한다.

  }
};

app.listen(80);
