var frisby = require('frisby');
frisby.create('getdata')
  .get('http://116.89.190.134:5555/v0.1/getdata')
  .expectStatus(200)
  .toss();
