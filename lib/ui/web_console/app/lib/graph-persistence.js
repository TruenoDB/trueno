"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: remote-computer.js
 * Author: victor
 * Description:
 *
 */
function GraphPersistence(options) {
  /* exConn */
  this._exConn = options.exConn;
  /* batch size */
  this._batchSize = options.batchSize || 10;
}


/**
 * create a new graph.
 */
GraphPersistence.prototype.setBatchSize = function (size) {

  this._batchSize = size;
}


/**
 * create a new graph.
 */
GraphPersistence.prototype.createGraph = function (name, properties) {

  /* Create a new Graph */
  let g = this._exConn.Graph();

  /* Set label: very important */
  g.setLabel(name);

  /* adding properties to the graph */
  for (var p in properties) {
    g.setProperty(p, properties[p]);
  }

  return new Promise(function (resolve, reject) {
    /* persist g */
    g.create().then(function () {
      resolve(g);
    }, function (err) {
      reject(err);
    });
  });

}

/**
 * create a new graph.
 */
GraphPersistence.prototype.deleteGraph = function (name) {

  /* Create a new Graph */
  let g = this._exConn.Graph();

  /* Set label: very important */
  g.setLabel(name);

  /* delete g */
  return g.destroy();
}

/**
 * create a new graph.
 */
GraphPersistence.prototype.getGraphs = function () {

  let g = this._exConn.Graph();
  /* fetch graphs */
  return g.fetch('g');
}

/**
 * create a new graph.
 */
GraphPersistence.prototype.getAlgorithms = function () {

  let g = this._exConn.Graph();
  /* fetch graphs */
  return g.getCompute().getAlgorithms();
}

/**
 * Insert vertices batch.
 */
GraphPersistence.prototype.insertVerticesBatch = function (g, vertices, prCallback) {

  /* This instance object reference */
  var self = this;

  /* total size */
  var total = vertices.length;

  return new Promise(function (resolve, reject) {
    /* inserting all edges */
    self.insertComponents(g, vertices.splice(0, self._batchSize), vertices, 0, total, prCallback, resolve, reject);
  });
}

/**
 * Insert edges batch.
 */
GraphPersistence.prototype.insertEdgesBatch = function (g, edges, prCallback) {

  /* This instance object reference */
  var self = this;

  /* total size */
  var total = edges.length;

  return new Promise(function (resolve, reject) {
    /* inserting all edges */
    self.insertComponents(g, edges.splice(0, self._batchSize), edges, 0, total, prCallback, resolve, reject);
  });
}
/**
 * Insert components array in batch.
 */
GraphPersistence.prototype.insertComponents = function (g, arr, components, current, total, prCallback, resolve, reject) {

  /* This instance object reference */
  var self = this;

  /* persist everything into a batch */
  g.openBatch();

  /* Persist all components */
  arr.forEach((c)=> {
    c.persist();
  });

  /* insert batch */
  g.closeBatch().then((result) => {
    /* increasing total */
    current += self._batchSize;
    /* logging success */
    console.log("Batch created.", ((current / total) * 100) + '%');

    /* notify progress if callback present */
    if (prCallback) {
      prCallback(current, total);
    }

    /* Continue inserting */
    if (components.length) {
      self.insertComponents(g, components.splice(0, self._batchSize), components, 0, total, prCallback, resolve, reject);
    } else {
      /* if done resolve */
      resolve();
    }
  }, (error) => {
    /* logging error */
    console.log("Batch error:", error, ((current / total) * 100) + '%');
    /* reject if error */
    reject(error);
  });
}