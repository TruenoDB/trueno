"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
let Trueno = require('../../../lib/core/api/internal-driver');

var trueno = new Trueno();

trueno.connect((s)=> {

  /* Connected with id */
  console.log('connected', s.id);

  /* Get current connected instance status */
  trueno.getInstanceStatus().then((instance)=> {

    /* Log the message */
    console.log('instance',JSON.stringify(instance));

  });

  /* Get current connected instance status */
  trueno.getClusterStatus().then((instances)=> {

    /* Log the message */
    console.log('Cluster instances',JSON.stringify(instances));

  });

}, (s)=> {

  console.log('disconnected', s.id);

})