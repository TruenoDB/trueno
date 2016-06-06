"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */
let RPC = require('./core/communication/rpc');
let Message = require('./core/communication/message');
let Graph = require('./core/data_structures/graph');
let Vertex = require('./core/data_structures/vertex');
let Edge = require('./core/data_structures/edge');

/** Trueno database driver class */
class ExternalDriver {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* RPC object */
    this._rpc = null;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc  = new RPC({host: this._host , port: this._port});
  }

  connect(cCallback, dCallback) {

    /* This instance object reference */
    let self = this;

    /* Set connection and disconnection callbacks */
    this._rpc.connect((s)=> {
      self._isConnected = true;
      cCallback(s);
    }, (s)=> {
      self._isConnected = false;
      dCallback(s);
    });
  }

  _checkConnectionAndValidate(obj, oClass){

    if (!this._isConnected) {
      throw new Error('Client driver not connected to database.')
    }

  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

  /**
   * Create Graph on remote trueno database.
   * @param {Graph} g - The Graph to be created.
   * @return {promise} The operation result promise.
   */
  createGraph(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_createGraph', g);
  }

  /**
   * Update Graph on remote trueno database.
   * @param {Graph} g - The Graph to be updated.
   */
  updateGraph(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateGraph', g);
  }

  /**
   * Delete Graph on remote trueno database.
   * @param {Graph} g - The Graph to be delete.
   */
  deleteGraph(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteGraph', g);
  }

  /**
   * Get Graph from remote trueno database.
   * @param {Graph} g - The Graph to be requested.
   */
  getGraph(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_getGraph', g);

  }

  /**
   * Get Graph list from remote trueno database.
   * @param {Graph} g - The graph to be requested, fields will be used
   * as filters. Filtered Graphs will be returned in a array collection.
   */
  getGraphList(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_getGraphList', g);
  }

  /********************************* VERTEX EXTERNAL API METHODS *********************************/

  /**
   * Create Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be created.
   */
  createVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_createVertex', v);
  }

  /**
   * Update Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be updated.
   */
  updateVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateVertex', v);
  }

  /**
   * Delete Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be delete.
   */
  deleteVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteVertex', v);
  }

  /**
   * Get Vertex from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested.
   */
  getVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_getVertex', v);
  }

  /**
   * Get Vertex list from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  getVertexList(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_getVertexList', v);
  }

  /********************************* EDGE EXTERNAL API METHODS *********************************/

  /**
   * Create Edge on remote trueno database.
   * @param {Edge} e - The Edge to be created.
   */
  createEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_createEdge', e);
  }

  /**
   * Update Edge on remote trueno database.
   * @param {Edge} e - The Edge to be updated.
   */
  updateEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateEdge', e);
  }

  /**
   * Delete Edge on remote trueno database.
   * @param {Edge} e - The Edge to be delete.
   */
  deleteEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteEdge', e);
  }

  /**
   * Get Edge from remote trueno database.
   * @param {Edge} e - The Edge to be requested.
   */
  getEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_getEdge', e);
  }

  /**
   * Get Edge list from remote trueno database.
   * @param {Edge} e - The Edge to be requested, fields will be used
   * as filters. Filtered Edges will be returned in a array collection.
   */
  getEdgeList(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_getEdgeList', e);
  }

}



/* exporting the module */
module.exports = ExternalDriver;