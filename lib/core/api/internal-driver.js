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

/** Trueno database driver class */
class InternalDriver {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8001;
    /* RPC object */
    this._rpc = null;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc = new RPC({host: this._host, port: this._port});
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

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

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