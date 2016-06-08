"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: monitor.js
 * Author: victor
 * Description:
 *
 */

function Monitor(options) {

  this._scope = options.scope;
  this._scope.metrics = {};
  this._scope.memmory = {};
  this._scope.cpu = {};

}

Monitor.prototype.init = function () {

  this._scope.metrics.instanceCount = 0;
  this._scope.metrics.graphsCount = 0;
  this._scope.metrics.vertexCount = 0;
  this._scope.metrics.edgeCount = 0;
  this._scope.metrics.connectionCount = 0;
  this._scope.metrics.coresCount = 0;
  this._scope.metrics.freqCount = 0;
  this._scope.metrics.memoryCount = 0;
  this._scope.metrics.storageCount = 0;
  this._scope.metrics.jobCount = 0;

  this._scope.memmory.labels = ["Used", "Free"];
  this._scope.memmory.data = [300, 500];
  this._scope.memmory.type = 'Pie';
  this._scope.toggle = function () {
    this._scope.memmory.type = this._scope.memmory.type === 'PolarArea' ?
      'Pie' : 'PolarArea';
  };

  this._scope.cpu.options = {showXLabels: 10};
  this._scope.cpu.labels = [60, "", "", "", "", 55, "", "", "", "", 50,
    "", "", "", "", 45, "", "", "", "", 40,
    "", "", "", "", 35, "", "", "", "", 30,
    "", "", "", "", 25, "", "", "", "", 20,
    "", "", "", "", 15, "", "", "", "", 10,
    "", "", "", 5, "", "", "", 1];
  this._scope.cpu.series = ['Frequency'];
  this._scope.cpu.data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
};

Monitor.prototype.setClusterStatus = function (instances) {

  var self = this;
  /* Status object */
  var statusObj = {
    instanceCount: 0,
    graphsCount: 0,
    vertexCount: 0,
    edgeCount: 0,
    connectionCount: 0,
    coresCount: 0,
    freqCount: 0,
    memoryCount: 0,
    storageCount: 0,
    jobCount: 0
  };

  /* For each instance, compute fields */
  Object.keys(instances).forEach(function (k) {
    /* Aggregating values */
    statusObj.instanceCount++;
    //statusObj.connectionCount += instances[k]._state.connections;
    statusObj.coresCount += instances[k]._metrics.cpu.cores;
    statusObj.freqCount += instances[k]._metrics.cpu.cores * instances[k]._metrics.cpu.speed;
    statusObj.memoryCount += instances[k]._metrics.totalmem;
    //statusObj.storageCount += instances[k]._metrics.storage;
    //statusObj.jobCount += instances[k]._state.jobCount;
  });

  this._scope.metrics.instanceCount = statusObj.instanceCount;
  this._scope.metrics.graphsCount = statusObj.graphsCount;
  this._scope.metrics.vertexCount = statusObj.vertexCount;
  this._scope.metrics.edgeCount = statusObj.edgeCount;
  this._scope.metrics.connectionCount = statusObj.connectionCount;
  this._scope.metrics.coresCount = statusObj.coresCount;
  this._scope.metrics.freqCount = statusObj.freqCount;
  this._scope.metrics.memoryCount = statusObj.memoryCount;
  this._scope.metrics.storageCount = statusObj.storageCount;
  this._scope.metrics.jobCount = statusObj.jobCount;

};