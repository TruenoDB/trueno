"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */
let RPC = require('../communication/rpc');
let Message = require('../communication/message');
let Graph = require('../data_structures/graph');
let Vertex = require('../data_structures/vertex');
let Edge = require('../data_structures/edge');
let Gremlin = require('gremlin');

let utils = require('../../backend/util/conv');

/** Trueno database driver class */
class ExternalDriver {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* RPC object */
    this._rpc = null;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc = new RPC({host: 'http://' + this._host, port: this._port});
    /* New Gremlin Connector: external api port + 2(offset of the gremlin server port */
    this._gClient = Gremlin.createClient(this._port + 2, this._host, {session: true});  // comment for test with console
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

  _checkConnectionAndValidate(obj, oClass) {

    if (!this._isConnected) {
      throw new Error('Client driver not connected to database.')
    }

  }

  /*================================ GREMLIN SERVER API METHODS ================================*/
  /**
   * Create Graph on remote trueno database.
   * @param {Graph} g - The Graph to be created.
   * @return {promise} The operation result promise.
   */
  executeQuery(q) {

    /* This instance object reference */
    let self = this;

    /* Return promise with results */
    return new Promise(function (resolve, reject) {
      self._gClient.execute(q, (err, results) => {
        if (!err) {
          resolve(results)
        } else {
          reject(err);
        }
      });
    });
  }

  /*================================ GRAPH EXTERNAL API METHODS ================================*/

  /**
   * Create Graph on remote trueno database.
   * @param {Graph} g - The Graph to be created.
   * @return {promise} The operation result promise.
   */
  createGraph(g) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();

    msg.payload = g;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_createGraph', msg);
  }

  /**
   * Update Graph on remote trueno database.
   * @param {Graph} g - The Graph to be updated.
   */
  updateGraph(g) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = g;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateGraph', msg);
  }

  /**
   * Delete Graph on remote trueno database.
   * @param {Graph} g - The Graph to be delete.
   */
  deleteGraph(g) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = g;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteGraph', msg);
  }

  /**
   * Get Graph from remote trueno database.
   * @param {Graph} g - The Graph to be requested.
   */
  getGraph(g) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = g;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_getGraph', msg);

  }

  // TODO: Implement filter using graph's fields (eg. directed graphs)
  // FIXME: Don't use {Graph} g for filtering, since it could be limited
  /**
   * Get Graph list from remote trueno database.
   * @param {Graph} g - The graph to be requested, fields will be used
   * as filters. Filtered Graphs will be returned in a array collection.
   */
  getGraphList(g) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = g;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return new Promise((resolve, reject) => {

      this._rpc.call('ex_getGraphList', msg).then(msg => {

        let gl = [];
        if (msg._payload.code == 0) {

          let list = msg._payload.result;
          for (var i = 0; i < list.length; i++) {
            let g = new Graph();
            utils.datatoComponent(list[i], g);
            gl.push(g);
          }
          resolve(gl);
        }

      }).catch (e => {

        reject(e);
      });

    });
  }

  /*================================ VERTEX EXTERNAL API METHODS ================================*/

  /**
   * Create Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be created.
   */
  createVertex(v) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = v;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_createVertex', msg);
  }

  /**
   * Update Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be updated.
   */
  updateVertex(v) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = v;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateVertex', msg);
  }

  /**
   * Delete Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be delete.
   */
  deleteVertex(v) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = v;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteVertex', msg);
  }

  /**
   * Get Vertex from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested.
   */
  getVertex(v) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = v;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_getVertex', msg);
  }

  /**
   * Get Vertex list from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  getVertexList(v) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = v;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return new Promise((resolve, reject) => {

      this._rpc.call('ex_getVertexList', msg).then(msg => {

        let vl = [];
        if (msg._payload.code == 0) {

          let list = msg._payload.result;
          for (var i = 0; i < list.length; i++) {
            let v = new Vertex();
            utils.datatoComponent(list[i], v);
            vl.push(v);
          }
          resolve(vl);
        }

      }).catch (e => {

        reject(e);
      });

    });
  }

  /*================================ EDGE EXTERNAL API METHODS ================================*/

  /**
   * Create Edge on remote trueno database.
   * @param {Edge} e - The Edge to be created.
   */
  createEdge(e) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = e;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_createEdge', msg);
  }

  /**
   * Update Edge on remote trueno database.
   * @param {Edge} e - The Edge to be updated.
   */
  updateEdge(e) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = e;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateEdge', msg);
  }

  /**
   * Delete Edge on remote trueno database.
   * @param {Edge} e - The Edge to be delete.
   */
  deleteEdge(e) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = e;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteEdge', msg);
  }

  /**
   * Get Edge from remote trueno database.
   * @param {Edge} e - The Edge to be requested.
   */
  getEdge(e) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = e;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_getEdge', msg);
  }

  /**
   * Get Edge list from remote trueno database.
   * @param {Edge} e - The Edge to be requested, fields will be used
   * as filters. Filtered Edges will be returned in a array collection.
   */
  getEdgeList(e) {

    /* This instance object reference */
    let self = this;

    let msg = new Message();
    msg.payload = e;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return new Promise((resolve, reject) => {

      this._rpc.call('ex_getEdgeList', msg).then(msg => {

        let el = [];
        if (msg._payload.code == 0) {

          let list = msg._payload.result;
          for (var i = 0; i < list.length; i++) {
            let e = new Edge();
            utils.datatoComponent(list[i], e);
            el.push(e);
          }
          resolve(el);
        }

      }).catch (e => {

        reject(e);
      });

    });
  }

}


/* exporting the module */
module.exports = ExternalDriver;
