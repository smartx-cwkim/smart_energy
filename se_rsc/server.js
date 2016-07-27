var exec = require('child_process').exec;

setInterval(getAllStatus, 2000);
//getAllStatus();
var latestDB, latestapp, latestbroker;

var edges = [
  {data:{source:"se_app", target:"influxdb"}},
  {data:{source:"influxdb", target:"se_app"}},
  {data:{source:"broker", target:"se_app"}};


function getAllStatus(){
  var topoData = [];
  getStatus('influxdb', '210.125.84.13:2376', function(ret){latestDB = ret;});
  getStatus('se_app', '192.168.88.147:2376', function(ret){latestapp = ret;});
  getStatus('broker', '192.168.88.147:2376', function(ret){latestbroker = ret;});
  if(latestDB != null && latestapp != null && latestbroker != null){
    topoData.push(latestDB); topoData.push(latestapp); topoData.push(latestbroker);
    console.log(topoData);
  }
}

//해당 머신에 있는 컨테이너의 상태값을 가져온다.
function getStatus(name, ip, cb){
  var cmd = 'docker -H '+ip+' stats --no-stream '+name;
  exec(cmd, function(err, stdout, stderr){
    var ret = parsing(name, stdout);
    cb(ret);
  });
}
//얻어온 컨테이너의 상태값에서 cpu와 memory 정보만을 파싱해온다.
function parsing(name, stdout){
  stdout = stdout.replace(/\s\s+/g, ' ').split(" ");
  if(stdout[16]=='GB')
    stdout[15]*=1024;
  var ret = {'id':name, 'cpu': stdout[14], 'mem(MB)': stdout[15], 'mem(%)': stdout[20]};
  return ret;
}
