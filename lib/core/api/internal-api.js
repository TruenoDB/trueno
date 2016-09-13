"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database extertnal API class.
 * @module lib/core/api/internal-api
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const RPC = require('../communication/rpc');
const Message = require('../communication/message');
const HTTP = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

/** Description of the class */
class InternalAPI {

  /**
   * Create a internal API object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Exposing host and port */
    this._host = param.host || global.config.local.host;
    this._port = param.port || global.config.local.internalPort;
    this._serve = serveStatic(__dirname + '/../../ui/web_console/app/', {'index': ['index.html', 'index.htm']});
    this._app = HTTP.createServer(this._httpHandler.bind(this));
    this._status = param.status || null;
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
      let rpc = new RPC({port: this._port, host: this._host, app: this._app});

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
      rpc.listen((socket)=> {
        //TODO: Client connected
        logger.info('Internal Client ' + socket.id + ' connected!');
      }, (socket)=> {
        //TODO: Client connected
        logger.info('Internal Client ' + socket.id + ' disconnected!');
      });

      /* Assigning rpc to class */
      self._rpc = rpc;

      /* Resolve sync promise */
      resolve(self._host + ':' + self._port);
    });
  }

  /**
   * The HTTP Server handler.
   */
  _httpHandler(req, res) {

    /* Serve web console */
    var done = finalhandler(req, res);
    this._serve(req, res, done)
  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

  /**
   * Get cluster status.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - A message containing all the cluster status.
   */
  ex_getClusterStatus(reply) {

    /* This instance object reference */
    let self = this;

    /* build message */
    let msg = Message.buildMessage({payload: self._status.getClusterStatus()});
    /* reply to the client */
    reply(msg);
  }

  /**
   * Get particular instance status.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - A message containing the requested instance status.
   */
  ex_getInstanceStatus(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting instance status */
    let instanceId = msg.payload;
    /* build message */
    msg = Message.buildMessage({payload: self._status.getInstanceStatus(instanceId)});
    /* reply to the client */
    reply(msg);
  }

}


/* exporting the module */
module.exports = InternalAPI;