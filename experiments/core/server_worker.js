"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
let RPC = require('../../lib/core/communication/rpc');

/* Get new server instance */
let rpc = new RPC(8000);

/* Exposing methods */
rpc.expose('my_method_1',(reply, args) => {

  console.log("params: " + args);

  /* returning */
  reply({answer:'hello from my_method_1!'});
});

/* Exposing methods */
rpc.expose('my_method_2',(reply, args) => {

  console.log("params: " + args);

  /* returning */
  reply({answer:'NO no no from my_method_2!'});
});

/* Exposing methods */
rpc.expose('my_method_3',(reply, args) => {

  console.log("params: " + args);

  /* returning */
  reply({answer:'Again? from my_method_3!'});

});


/* Start listening */
rpc.listen((socket)=>{

  console.log(socket.id + ' have connect to worker ');

}, (socket)=>{

  console.log(socket.id  + ' disconnected!');

});
