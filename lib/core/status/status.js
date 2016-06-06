"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database Status class.
 * @module lib/core/status/status
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const Instance = require('./instance');
const Promise = require("bluebird");

/** Database Instance class */
class Status {

  /**
   * Create a Status object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* This instance metrics */
    this._id = null;
    this._instance = new Instance();

    /* Cluster Peer Instances metrics */
    this._peerInstances = {};
  }

  /**
   * Collect cluster status and metrics.
   * @return {promise} A promise with the metrics and status of the cluster.
   */
  collectStatus() {

    /* This instance object reference */
    var self = this;

    return new Promise((resolve, reject)=> {

      /* Collect this instance metrics and status */
      self._instance.collectMetrics().then((metrics) => {

        /* Set the id to the hostname */
        self._id = metrics.hostname;
        /* Adding to instance collection */
        self._peerInstances[self._id] = self._instance;
        /* Collect all other peer instances statuses */
        return self._collectPeersStatuses();
      }).then(()=> {
        /* After peer statuses collection is node, resolve the main promise(collectStatus) */
        resolve(self);
      });
    });
  }

  /**
   * Returns collection of all instances statuses in the cluster.
   * @return {Map<Instance>} A map of Instance objects.
   */
  getClusterStatus() {
    return this._peerInstances;
  }

  /**
   * Returns the particular instance status.
   * @return {Instance} A instance object.
   */
  getInstanceStatus(instanceId) {

    if (instanceId === undefined) {
      return this._instance;
    } else if (this._peerInstances[instanceId]) {
      return this._peerInstances[instanceId];
    } else {
      return new Error("No instance found for the provieded identifier");
    }
  }

  /**
   * Collect all peer instances(machines) status and metrics in the cluster.
   * @return {promise} A promise with the metrics collection from all peer instances in the cluster.
   */
  _collectPeersStatuses() {

    /* This instance object reference */
    var self = this;

    return new Promise((resolve, reject)=> {

      /* TODO:  Collect all other instances statuses here */
      resolve();
    });
  }
}


/* exporting the module */
module.exports = Status;