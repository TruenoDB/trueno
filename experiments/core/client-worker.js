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
var rpc = new RPC({host: 'http://localhost', port: 8000});

/* Connect the client library */
rpc.connect((socket)=> {

  console.log('client connected!');

  /* Invoke everything each 10 milliseconds */
  setInterval(()=> {

    /************* Calling all GRAPH remote methods *************/

    rpc.call('ex_createGraph', {desc: 'ex_createGraph params'}).then((response)=> {

      console.log('ex_createGraph response ', response);

    });

    rpc.call('ex_updateGraph', {desc: 'ex_updateGraph params'}).then((response)=> {

      console.log('ex_updateGraph response ', response);

    });

    rpc.call('ex_deleteGraph', {desc: 'ex_deleteGraph params'}).then((response)=> {

      console.log('ex_deleteGraph response ', response);

    });

    rpc.call('ex_getGraph', {desc: 'ex_getGraph params'}).then((response)=> {

      console.log('ex_getGraph response ', response);

    });

    rpc.call('ex_getGraphList', {desc: 'ex_getGraphList params'}).then((response)=> {

      console.log('ex_getGraphList response ', response);

    });

    /************* Calling all VERTEX remote methods *************/

    rpc.call('ex_createVertex', {desc: 'ex_createVertex params'}).then((response)=> {

      console.log('ex_createVertex response ', response);

    });

    rpc.call('ex_updateVertex', {desc: 'ex_updateVertex params'}).then((response)=> {

      console.log('ex_updateVertex response ', response);

    });

    rpc.call('ex_deleteVertex', {desc: 'ex_deleteVertex params'}).then((response)=> {

      console.log('ex_deleteVertex response ', response);

    });

    rpc.call('ex_getVertex', {desc: 'ex_getVertex params'}).then((response)=> {

      console.log('ex_getVertex response ', response);

    });

    rpc.call('ex_getVertexList', {desc: 'ex_getVertexList params'}).then((response)=> {

      console.log('ex_getVertexList response ', response);

    });

    /************* Calling all EDGE remote methods *************/

    rpc.call('ex_createEdge', {desc: 'ex_createEdge params'}).then((response)=> {

      console.log('ex_createEdge response ', response);

    });

    rpc.call('ex_updateEdge', {desc: 'ex_updateEdge params'}).then((response)=> {

      console.log('ex_updateEdge response ', response);

    });

    rpc.call('ex_deleteEdge', {desc: 'ex_deleteEdge params'}).then((response)=> {

      console.log('ex_deleteEdge response ', response);

    });

    rpc.call('ex_getEdge', {desc: 'ex_getEdge params'}).then((response)=> {

      console.log('ex_getEdge response ', response);

    });

    rpc.call('ex_getEdgeList', {desc: 'ex_getEdgeList params'}).then((response)=> {

      console.log('ex_getEdgeList response ', response);

    });

  }, 1);

}, (socket)=> {

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