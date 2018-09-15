var fs = require('fs');
var Fabric_Client = require('fabric-client');

//creat a Client
Fabric_Client.newDefaultKeyValueStore({ path: '/tmp/xx/' }).then((state_store) => {
    client=new Fabric_Client();
    client.setStateStore(state_store)

    //configure the user's information    
    var userOpt = {
        username: 'Admin@member1.example.com',
        mspid: 'peers.member1.example.com',
        cryptoContent: { 
            privateKey: './msp/keystore/6928e27dd859394139687087fe093432f795a62a64c78b93d914609c8a56f493_sk',
            signedCert: './msp/signcerts/Admin@member1.example.com-cert.pem'
        }
    }

    return client.createUser(userOpt)

}).then((user)=>{

    //setting connected Channel
    var channel = client.newChannel('mychannel');

    //setting connected Peer
    var peer = client.newPeer(
        'grpcs://peer0.member1.example.com:7051',
        {
            pem: fs.readFileSync('./tls/ca.crt', { encoding: 'utf8' }),
            clientKey: fs.readFileSync('./tls/client.key', { encoding: 'utf8' }),
            clientCert: fs.readFileSync('./tls/client.crt', { encoding: 'utf8' }),
            'ssl-target-name-override': 'peer0.member1.example.com'
        }
    );

    channel.addPeer(peer);

    //call chaincode
    const request = {
        chaincodeId: 'mycc',   //name of chaincode
        fcn: 'query',          //function name 
        args: ['key1']         //argument
    };

    // send the query proposal to the peer
    return channel.queryByChaincode(request);

}).then((response)=>{
    console.log('Response is', response.toString());
})
