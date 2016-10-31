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

/** Trueno database driver class */
class InternalDriver {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'localhost';
    /* The database port */
    this._port = param.port || 8001;
    /* RPC object */
    this._rpc = null;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc = new RPC({host: 'http://' + this._host, port: this._port});
    /* New Gremlin Connector: external api port + 1(offset of the gremlin server port) */
    this._gClient = Gremlin.createClient(this._port + 1, this._host, {session: false, path:'/gremlin'});

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

  _checkConnection() {

    if (!this._isConnected) {
      throw new Error('Internal client driver not connected to database.')
    }

  }

  /*================================ GREMLIN SERVER API METHODS ================================*/
  /**
   * Executes a query on the gremlin server.
   * @param {string} q - The query to be executed.
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

  /**
   * Executes a query on the gremlin server and return stream.
   * @param {string} q - The query to be executed.
   * @return {stream} A stream object with data, end, and error events.
   */
  executeQueryStream(q) {
    /* Execute query and return stream object */
    return this._gClient.stream(q);
  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/
  /**
   * Send the ready status to master.
   * @return {promise} The operation result promise.
   */
  sentReadySignal(host) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnection();

    /* Build message */
    let msg = Message.buildMessage({payload: host});

    /* return promise with the async operation */
    return this._rpc.call('in_hostReadySignal', msg).then((msg)=> {
      return msg._payload;
    });
  }


  /**
   * Get cluster status.
   * @return {promise} The operation result promise.
   */
  getClusterStatus() {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnection();

    /* return promise with the async operation */
    return this._rpc.call('ex_getClusterStatus').then((msg)=> {
      return msg._payload;
    });
  }

  /**
   * Get cluster status.
   * @param {Graph} g - The Graph to be created.
   * @return {promise} The operation result promise.
   */
  getInstanceStatus(instanceId) {

    /* validating connection */
    this._checkConnection();

    /* Build message */
    let msg = Message.buildMessage({payload: instanceId});

    /* return promise with the async operation */
    return this._rpc.call('ex_getInstanceStatus', msg).then((msg)=> {
      return msg._payload;
    });
  }

}


/* exporting the module */
module.exports = InternalDriver;