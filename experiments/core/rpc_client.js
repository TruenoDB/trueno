"use strict";

/**
 * @author Victor O. Santos Uceta
 * RPC module with for WebSocket communication.
 * @module core/communication/rpc
 * @see module:core/worker
 */

/** Import modules */
const io = require('socket.io-client');
const Promise = require("bluebird");

/** Remote Procedure Call module for the database api workers */
class RPC_client {

  /**
   * Create a RCP object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* Server side functions */
    this._procudures = [];
    /* Connected sockets */
    this._socket = null;

  }

  expose(procedureName, procedureFunction) {
    /* Insert the procedure in the collection */
    this._procudures.push(
      {
        'name': procedureName,
        'fn': procedureFunction
      });
  }

  call() {

    /* This instance object reference */
    var self = this;

    /* Extracting arguments */
    var upperArgs = arguments;

    /* Promise to be returned */
    return new Promise((resolve, reject) => {

      /* Emit event on this socket */
      self._socket.emit.apply(self._socket, upperArgs);

      /* Await for response */
      self._socket.once('_'+upperArgs[0]+'_response', (args) => {
        resolve(args);
      });
    });
  }

  /**
   * Listen for connection at the assigned port or 8000 by default.
   */
  connect(connCallback, discCallback) {

    /* This instance object reference */
    var self = this;

    /* Listening for connections */
    this._socket = io.connect(this._host + ':' + this._port, {reconnect: true});

    /* Set connection event handler */
    this._socket.on('connect', () => {

      /* Adding RPM functions */

      /* resolving promise */
      connCallback();
    });

  }

}


/* exporting the module */
module.exports = RPC_client;