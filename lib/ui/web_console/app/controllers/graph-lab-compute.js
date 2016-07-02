"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-compute.js
 * Author: victor
 * Description:
 *
 */

function GraphLabCompute(options) {

  this._scope = options.scope;
  /* Create local and remote computers */
  this._localComp = new LocalComputer();
  this._remoteComp = new RemoteComputer();

}

GraphLabCompute.prototype.init = function () {

  this._scope.algorithms = graphAlgorithms;
};

GraphLabCompute.prototype.getLocalComputer = function () {
  return this._localComp;
};

GraphLabCompute.prototype.getRemoteComputer = function () {
  return this._remoteComp;
};
