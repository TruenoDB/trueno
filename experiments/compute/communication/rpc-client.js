"use strict";

/*
  ________                                                 _______   _______
 /        |                                               /       \ /       \
 $$$$$$$$/______   __    __   ______   _______    ______  $$$$$$$  |$$$$$$$  |
    $$ | /      \ /  |  /  | /      \ /       \  /      \ $$ |  $$ |$$ |__$$ |
    $$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$ |  $$ |$$    $$<
    $$ |$$ |  $$/ $$ |  $$ |$$    $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$$$$$$  |
    $$ |$$ |      $$ \__$$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |$$ |__$$ |$$ |__$$ |
    $$ |$$ |      $$    $$/ $$       |$$ |  $$ |$$    $$/ $$    $$/ $$    $$/
    $$/ $$/        $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$/  $$$$$$$/  $$$$$$$/
 */

/**
 * Created by: Victor.
 * Edited by: Servio.
 * Source: .js
 * Description: rpc test module for compute methods
 *
 */

//Local Libraries
var Enums = require("../../../lib/compute/enum/enums");
var config = require("../../../lib/compute/config/config.json");
let RPC = require('../../../lib/core/communication/rpc');


/* New database rpc object */
var rpc = new RPC({host: 'http://localhost', port: 8000});

/* Connect the client library */
rpc.connect((socket)=> {

  console.log('client connected!');

  /* Invoke everything each 10 milliseconds */
  setInterval(()=> {

    console.log('Client connected!');

    /* The API expects a job object */
    /* job.algorithm.type
    * job.algorithm.graph,
    * job.algorithm.TOL,
    * job.algorithm.alpha
    * job.algorithm.maxIterations
    */

    let job  = {
      algorithm: {
        type:  Enums.algorithmType.PAGE_RANK,
        graph: config.schema,
        TOL:   Enums.pageRank.TOL,
        alpha: Enums.pageRank.resetProb
      }
    };


    rpc.call('ex_compute', job).then((response)=> {

      console.log(response);

    });


  }, 1);

}, (socket)=> {

  console.log('Disconnected! ' + socket.id);

});
