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

  expose(procedureName, procedureFunction){
    /* Insert the procedure in the collection */
    this._procudures.push(
      {
        'name': procedureName,
        'fn': procedureFunction
      });
  }

  call(event) {

    /* This instance object reference */
    let self = this;

    /* Extracting arguments */
    let upperArgs = arguments;

    /* Promise to be returned */
    return new Promise((resolve, reject) => {
      /* Emit event on this socket */
      self._socket.emit.apply(upperArgs);

      let listener = () => {
        resolve.apply(null, arguments);
      };

      /* Await for response */
      self._socket.once('_'+event, () => {
          resolve.apply(null, arguments);
      });
    });
  }

  /**
   * Listen for connection at the assigned port or 8000 by default.
   */
  connect() {

    /* This instance object reference */
    let self = this;

    /* Listening for connections */
    this._socket = io(this._host+':'+this._port);

    return new Promise((resolve, reject) => {
      /* Set connection event handler */
      self._socket.on('connect', () => {

        /* Adding RPM functions */
        self._procudures.forEach((proc) => {
          /* Adding listener to each call */
          self._socket.on(proc.name, proc.fn);
        });
        /* resolving promise */
        resolve();
      });
    });
  }

}


/* exporting the module */
module.exports = RPC_client;