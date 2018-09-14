var fs = require('fs');
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
var writableStream = fs.createWriteStream('file2.yaml');

client.on('connect', function () {
  //suscrib presence topic
  client.subscribe('presence');
  //send topic message
 // client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
  //send message to blockchain
  console.log(message.toString());
  writableStream.write(message.toString());
 var exec = require('child_process').exec;
 var cmdStr="cd  /home/ubuntu/cpy/blockchain;node 42-test.js";
 exec(cmdStr,function(err,stdout,stderr){
    if(err) {
        console.log('error');
    }
        else
        {
         console.log("success");
        }
}
);
  client.end();
});

