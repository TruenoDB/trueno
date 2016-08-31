"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: remote-computer.js
 * Author: victor
 * Description:
 *
 */
function GraphFilter(options) {

  this._vis = options.vis;
  this._snapshot = null;
  this._filters = {};

  /* Define data property */
  Object.defineProperty(this, '_data', {
    get: function () {
      return {v: options.vis.graph.nodes(), e: options.vis.graph.edges()};
    }
  });
}

/* Apply new filter to the visualization */
GraphFilter.prototype.filter = function (xpathQuery, type) {
  /* If snapshot is not ready, throw error */
  if (!this._snapshot) {
    throw  new Error("Snapshot not ready to search");
  }
  /* perform the search */
  var res = JSON.search(this._snapshot, xpathQuery);
  /* if returns matched, filter visualization */
  if (res.length > 0) {
    /* The filter id */
    var id =  (new Date()).getTime();
    /* Adding the filter to the collection */
    this._filters[id] = {
      id: id,
      q: xpathQuery,
      data: res,
      type: type
    };
    /* return this element filter id */
    return this._filters[id];
  }

  /* return null if there where no results */
  return null;
}

GraphFilter.prototype.removeFilter = function (id) {

}

/* methods */
GraphFilter.prototype.computeSnapshot = function () {

  /* this object reference */
  var self = this;
  /* Computing the elapsed time */
  var start = Date.now();
  /* return promise when the snapshot is ready */
  return new Promise(function (resolve, reject) {

    Defiant.getSnapshot(self._data, function (snapshot) {
      /* logging snapshot time */
      console.log('Created snapshot in ' + (Date.now() - start) + ' ms');
      /* Assign new snapshot */
      self._snapshot = snapshot;
      /* resolving promise */
      resolve();
    }, function (err) {
      /* logging snapshot time */
      console.log('Snapshot creation failed: ' + err);
      /* resolving promise */
      reject(err);
    });
  });
}