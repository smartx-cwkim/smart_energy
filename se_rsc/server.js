var exec = require('child_process').exec;

setInterval(getAllStatus, 1000);

//getAllStatus();

function getAllStatus(){
  getStatus('influxdb', '210.125.84.13:2376', function(ret){console.log(ret);});
  getStatus('se_gw', '192.168.88.147:2376', function(ret){console.log(ret);});
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
  var ret = {'name':name, 'cpu': stdout[14], 'mem(MB)': stdout[15], 'mem(%)': stdout[20]};
  return ret;
}
