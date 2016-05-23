"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
//let sticky = require('socketio-sticky-session');
//
sticky(() => {

  let RPC = require('../../lib/core/communication/rpc');
  /* Get new server instance */
  let rpc = new RPC();

  /* Start listening */
  rpc.listen().then((socket)=>{

    console.log(socket.id + 'have connect to worker ');

  });

  return rpc.server;

}).listen(8000, () => {
  console.log('server started on 8000 port');
});
