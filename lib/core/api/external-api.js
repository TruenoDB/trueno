"use strict";

/**
 * @author Your Name Goes Here
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const Promise = require("bluebird");
const RPC = require('../communication/rpc');

/** Description of the class */
class ExternalAPI {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Exposing host and port */
    this._host = param.host;
    this._port = param.port;
    this._rpc = null;

  }

  /**
   * Create and binds all external methods to the RPC object.
   */
  init() {

    /* This instance object reference */
    let self = this;

    return new Promise((resolve, reject)=> {

      /* Get new rpc socket server instance */
      let rpc = new RPC({port: this._port, host: this._host});

      /* Binding external methods extracting each prototype */
      Object.getOwnPropertyNames(Object.getPrototypeOf(self)).filter((p)=> {
        /* Filter all external method */
        return p.includes('ex_');
      }).forEach((p)=> {
        /* Binding each external method */
        rpc.expose(p, self[p].bind(self));
      });

      /* Start listening at the indicated host and port, resolve or reject promise
       * depending on outcome */
      rpc.listen((socket)=>{
        //TODO: Client connected
        console.log('Client ' + socket.id + ' connected!');
      }, (socket)=>{
        //TODO: Client connected
        console.log('Client ' + socket.id + ' disconnected!');
      });

      /* Assigning rpc to class */
      self._rpc = rpc;

      /* Resolve sync promise */
      resolve();
    });

  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

  /**
   * Get graph list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be created.
   */
  ex_createGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_createGraph invoked', g);
    reply('ex_createGraph response '+ this._port);

  }

  /**
   * Update graph method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be updated.
   */
  ex_updateGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_updateGraph invoked', g);
    reply('ex_updateGraph response '+ this._port);

  }

  /**
   * Delete graph method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The name of the graph to be deleted.
   */
  ex_deleteGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_deleteGraph invoked', g);
    reply('ex_deleteGraph response '+ this._port);

  }

  /**
   * Get graph API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The requested graph object, must contain name.
   */
  ex_getGraphList(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getGraphList invoked', g);
    reply('ex_getGraphList response ' + this._port);

  }

  /**
   * Get graph list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The requested graph object, fields will be used
   * as filters. Filtered graphs will be returned in a array collection.
   */
  ex_getGraphList(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getGraphList invoked', g);
    reply('ex_getGraphList response '+ this._port);

  }


}


/* exporting the module */
module.exports = ExternalAPI;