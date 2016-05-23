"use strict";

/**
 * @author Victor O. Santos Uceta
 * RPC module with for WebSocket communication.
 * @module core/communication/rpc
 * @see module:core/worker
 */

/** Import modules */
var http = require('http');
var io = require('socket.io');
var Promise = require("bluebird");

/** Remote Procedure Call module for the database api workers */
class RPC {

  /**
   * Create a RCP object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Server side functions */
    this._procudures = [];
    /* Connected sockets */
    this._sockets = {};
    /* The connection http server */
    this._httpServer = null;

  }

  expose(procedureName, procedureFunction){
    /* Insert the procedure in the collection */
    this._procudures.push(
    {
      'name': procedureName,
      'fn': procedureFunction
    });
  }

  callAll(event) {

    /* This instance object reference */
    let self = this;

    /* Extracting arguments */
    let upperArgs = arguments;

    /* Promise to be returned */
    return new Promise(function (resolve, reject) {
      /* Emit event on every socket */
      self._sockets.forEach((s) => {
        /* Call the remote procedure for all sockets */
        s.emit.apply(null, upperArgs);
        /* Adding the response for the event */
        s.on('_'+event, () => {
          resolve.apply(null, arguments);
        })
      });

    });
  }

  /**
   * Listen for connection at the assigned port or 8000 by default.
   */
  listen() {

    /* This instance object reference */
    let self = this;

    /* Creating http server */
    this._httpServer = http.createServer((req, res) => {
    });

    /* Listening for connections */
    io = io.listen(this._httpServer);

    return new Promise((resolve, reject) => {
      /* Set basic handlers */
      io.on('connection', (socket) => {
        /* Creating new socket object */
        let obj = {
          'socket': socket
        };

        /* Adding RPM functions */
        self._procudures.forEach((proc) => {
          /* Adding listener to each call */
          obj.socket.on(proc.name, proc.fn);
        });

        /* Adding socket to the collection and setting up remote call proxy */
        self._sockets[socket.id] = obj;

        /* Adding calling connected promise */
        resolve(socket);
      });
    });
  }

  get server(){
    return this._httpServer;
  }

}


/* exporting the module */
module.exports = RPC;