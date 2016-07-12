var sleep = require('sleep');
var request = require('sync-request');
var period = 1000000;
var nucaddr = "http://116.89.190.134:5555";

//1초 = 1000000마이크로초
var running = true;
console.log("Running...");

while(running == true){
  sleep.usleep(period);
  var watt = Math.random();
  var date1 = new Date().getTime();
  var datas = {"when":"now", "where":"c208", "id":"rpix", "watt": watt};
  var res = request('POST', nucaddr+'/v0.1/postdata', {
    json: datas
  });
  var date2 = new Date().getTime();
  var date3 = date2-date1;
  console.log("response time: " + date3);

}


/*
app.put('/v0.1/changeperiod?period=', function(req, res){
  console.log('?');
  period = req.period;
  console.log('changed period : ' + period);
  res.send('ok');
});

app.listen(4444);
*/
