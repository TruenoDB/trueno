"use strict";

/**
 * @author Victor O. Santos Uceta
 * RPC module with for WebSocket communication.
 * @module lib/core/communication/rpc
 * @see module:lib/core/worker
 */

/** Import modules */
const ioClient = require('socket.io-client');
const Status = require("./status");
const Promise = require("bluebird");

/** Remote Procedure Call module for the database api workers */
class RPC {

  /**
   * Create a RCP object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* http server app */
    this._app = param.app || null;
    /* Exposed procedure functions for remote calls */
    this._procedures = [];
    /* Connected sockets (for server mode) */
    this._sockets = {};
    /* Connected socket (for client mode) */
    this._socket = null;

  }

  expose(procedureName, procedureFunction) {
    /* Insert the procedure in the collection */
    this._procedures.push(
      {
        'name': procedureName,
        'fn': procedureFunction
      });
  }

  call() {

    /* This instance object reference */
    var self = this;

    /* Extracting arguments */
    var upperArgs = Array.prototype.slice.call(arguments);

    /* Promise to be returned */
    return new Promise((resolve, reject) => {

      /* Check if we must past null data, otherwise acknowledge callback won't work. */
      if(upperArgs.length < 2){
        upperArgs.push(null);
      }
      /* pushing acknowledge callback */
      upperArgs.push((args) => {

        switch(args._status){
          case Status.response.SUCCESS: resolve(args._payload);
            break;
          case Status.response.ERROR: reject(args._payload);
            break;
        }
      });

      /* Emit event on this socket */
      self._socket.emit.apply(self._socket, upperArgs);

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
        s.emit.apply(s, upperArgs);
        /* Adding the response for the event */
        s.on('_' + event, () => {
          resolve.apply(null, arguments);
        })
      });

    });
  }

  /**
   * Listen for connection at the assigned port or 8000 by default.
   */
  listen(connCallback, discCallback) {

    /* This instance object reference */
    let self = this;
    let io_conn;

    /* Listening for connections */
    if (this._app) {
      /* connecting with http server app */
      io_conn = require('socket.io')(this._app);
      /* Listening to port */
      this._app.listen(this._port);
    } else {
      /* listening with raw socket */
      io_conn = require('socket.io').listen(this._port);
    }

    /* Set connection */
    io_conn.on('connection', (socket)=> {
      self._connect(socket, connCallback, discCallback)
    });
  }

  /**
   * Connect to a remote server.
   */
  connect(connCallback, discCallback) {

    /* This instance object reference */
    var self = this;

    /* Listening for connections */
    this._socket = ioClient.connect(this._host + ':' + this._port, {reconnect: true});

    /* Set connection event handler */
    this._socket.on('connect', () => {
      /* connect callback */
      self._connect(self._socket, connCallback, discCallback)
    });

  }

  /**
   * The socket connection handler.
   */
  _connect(socket, connCallback, discCallback) {

    /* This instance object reference */
    let self = this;

    /* binding events */
    socket.on('disconnect', ()=> {
      self._disconnect(socket, discCallback)
    });

    /* Creating new socket object */
    let obj = {
      'socket': socket
    };

    /* Adding RPM functions */
    self._procedures.forEach((proc) => {

      /* Adding listener to each call */
      obj.socket.on(proc.name, (args, fn)=> {
        proc.fn(fn, args);
      });

    });

    /* Adding socket to the collection and setting up remote call proxy */
    self._sockets[socket.id] = obj;

    /* Calling connected socket event */
    connCallback(socket);
  }

  /**
   * The socket disconnection handler.
   */
  _disconnect(socket, discCallback) {
    /* Calling disconnect socket event */
    if (discCallback) {
      discCallback(socket);
    }
  }

}


/* exporting the module */
module.exports = RPC;