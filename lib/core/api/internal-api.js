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
const Status = require('../communication/status');
const Message = require('../communication/message');
const InternalDriver = require('./internal-driver');

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
    this._status = param.status || null;
    this._rpc = null;

    /* Cluster specific variables */
    this._clusterHosts = param.clusterHosts;
    this._internalConnection = null;
    this._cluserReadyResolve = null;
    this._masterNode = param.masterNode;
    this._readyHosts = {};
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
        return p.includes('in_');
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

      /* If cluster mode, await peers for barrier */
      if (self._clusterHosts && self._clusterHosts[self._host].master) {
        /* Logging the message */
        logger.info(">> CLUSTER: Awaiting for cluster hosts ready signal");
        /* saving the promise resolve for later */
        this._cluserReadyResolve = resolve;

        /* if this is not the master */
      } else if (self._clusterHosts) {
        /* Connect to internal driver */
        self.__internalConnection = new InternalDriver({host: self._masterNode});
        /* Connect to master */
        logger.info(">> CLUSTER: Connecting to master: " + self._masterNode);
        /* calling connection */
        self.__internalConnection.connect((id)=> {
          /* Logging the message */
          logger.info(">> CLUSTER: Sending ready signal to master");
          self.__internalConnection.sentReadySignal({name: self._host, settings: self._clusterHosts[self._host]})
          .then((response)=> {
            /* log process */
            logger.info(">> CLUSTER: Master proceed signal received...");
            /* master response to continue, resolve the promise right away */
            resolve(self._host + ':' + self._port);
          });
        }, ()=> {
          logger.error(">> CLUSTER: Disconnected from master");
        });
        /* it is single instance mode */
      } else {
        /* Resolve sync promise */
        resolve(self._host + ':' + self._port);
      }
    });
  }

  /********************************* INTERNAL API METHODS *********************************/

  /**
   * Signal ready status for peer hosts. This serves as barrier for to complete the cluster startup.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - A message containing all the cluster status.
   */
  in_hostReadySignal(reply, msg) {

    /* This instance object reference */
    let self = this;

    /* build message */
    let host = msg._payload;

    /* reply all clients if all hosts are ready, otherwise save reply object */
    self._readyHosts[host.name] = {host: host, reply: reply};

    /* Host awaiting count */
    let total = Object.keys(self._clusterHosts).length - 1
    /* current ready hosts */
    let currentTotal = Object.keys(self._readyHosts).length;

    logger.info(">> CLUSTER(" + (currentTotal) + "/" + total + "): Host '" + host.name + "' ready signal received.");

    /* If all clients are ready */
    if (currentTotal == total) {
      /* signal all hosts to proceed with cluster */
      for (let h in self._readyHosts) {
        /* build message */
        let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: self._clusterHosts[host.name]});
        /* call back the peer host to proceed */
        self._readyHosts[h].reply(rsp);
      }
      /* Master continues */
      this._cluserReadyResolve(self._host + ':' + self._port);
    }
  }

  /**
   * Get cluster status.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - A message containing all the cluster status.
   */
  in_getClusterStatus(reply) {

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
  in_getInstanceStatus(reply, msg) {

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
module
  .exports = InternalAPI;