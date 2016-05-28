"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
let RPC = require('../../lib/core/communication/rpc');


/* New database rpc object */
var rpc = new RPC({host:'http://localhost', port:8000});

/* Connect the client library */
rpc.connect((socket)=>{

  console.log('client connected!');

  rpc.call('ex_createGraph',{name:'Victor', bool: true}).then((response)=>{

    console.log(response);

  });

  rpc.call('ex_updateGraph',{age:25, weights: [1,2,3,4]}).then((response)=>{

    console.log(response);

  });

  rpc.call('ex_deleteGraph',{classes:{cs580:'A', cs690: 'B+'}}).then((response)=>{

    console.log(response);

  });

  rpc.call('ex_getGraphList',{classes:{halo:'4 is the best', site: 'Reddit'}}).then((response)=>{

    console.log(response);

  });


}, (socket)=>{

  console.log('You disconnected! ' + socket.id);

});


///* Connect the client library */
//rpc.connect((socket)=>{
//
//  console.log('client connected!');
//
//  rpc.call('my_method_1',{name:'Victor', bool: true}).then((response)=>{
//
//    console.log(response);
//
//  });
//
//  rpc.call('my_method_2',{age:25, weights: [1,2,3,4]}).then((response)=>{
//
//    console.log(response);
//
//  });
//
//  rpc.call('my_method_3',{classes:{cs580:'A', cs690: 'B+'}}).then((response)=>{
//
//    console.log(response);
//
//  });
//
//}, (socket)=>{
//
//  console.log('You disconnected! ' + socket.id);
//
//});