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
   * Create graph API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be created.
   */
  ex_createGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_createGraph invoked', g);
    reply(g);

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
    reply(g);

  }

  /**
   * Delete graph method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be deleted.
   */
  ex_deleteGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_deleteGraph invoked', g);
    reply(g);

  }

  /**
   * Get graph API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The requested graph object, must contain name.
   */
  ex_getGraph(reply, g) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getGraph invoked', g);
    reply(g);

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
    reply(g);

  }

  /********************************* VERTEX EXTERNAL API METHODS *********************************/

  /**
   * Create vertex API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The vertex to be created.
   */
  ex_createVertex(reply, v) {

    /* This instance object reference */
    let self = this;

    console.log('ex_createVertex invoked', v);
    reply(v);

  }

  /**
   * Update vertex method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The vertex to be updated.
   */
  ex_updateVertex(reply, v) {

    /* This instance object reference */
    let self = this;

    console.log('ex_updateVertex invoked', v);
    reply(v);

  }

  /**
   * Delete vertex method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The vertex to be deleted.
   */
  ex_deleteVertex(reply, v) {

    /* This instance object reference */
    let self = this;

    console.log('ex_deleteVertex invoked', v);
    reply(v);

  }

  /**
   * Get vertex API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The requested vertex object, must contain id.
   */
  ex_getVertex(reply, v) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getVertex invoked', v);
    reply(v);

  }

  /**
   * Get vertex list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The requested vertex object, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  ex_getVertexList(reply, v) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getVertexList invoked', v);
    reply(v);

  }


  /********************************* EDGE EXTERNAL API METHODS *********************************/

  /**
   * Create edge API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be created.
   */
  ex_createEdge(reply, e) {

    /* This instance object reference */
    let self = this;

    console.log('ex_createEdge invoked', e);
    reply(e);

  }

  /**
   * Update edge method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be updated.
   */
  ex_updateEdge(reply, e) {

    /* This instance object reference */
    let self = this;

    console.log('ex_updateEdge invoked', e);
    reply(e);

  }

  /**
   * Delete edge method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be deleted, must contain id.
   */
  ex_deleteEdge(reply, e) {

    /* This instance object reference */
    let self = this;

    console.log('ex_deleteEdge invoked', e);
    reply(e);

  }

  /**
   * Get edge API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The requested edge object, must contain id.
   */
  ex_getEdge(reply, e) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getEdge invoked', e);
    reply(e);

  }

  /**
   * Get vertex list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The requested edge object, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  ex_getEdgeList(reply, e) {

    /* This instance object reference */
    let self = this;

    console.log('ex_getEdgeList invoked', e);
    reply(e);

  }

}


/* exporting the module */
module.exports = ExternalAPI;