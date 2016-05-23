"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
let RPC = require('../core/rpc_client');

/* New database rpc object */
let rpc = new RPC({host:'http://localhost', port:8000});
/* Connect the client library */
rpc.connect().then(()=>{

  console.log('client connected!');
});