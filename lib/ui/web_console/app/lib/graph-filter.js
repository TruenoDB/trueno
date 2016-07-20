"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: remote-computer.js
 * Author: victor
 * Description:
 *
 */
function GraphFilter(options) {

  this._data = options.data;
  this._vis = options.vis;
  this._snapshot = null;
  this._filters = {};

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
    /* Apply the filter upon the visualization */
    this._applyFilter(res, type);
    /* Adding the filter to the collection */
    this._filters.push({
      id: (new Date()).getTime(),
      q: xpathQuery,
      data: res,
      type: type
    });
    /* return this element filter id */
    return this._filters[this._filters.length -1].id;
  }

  /* return null if there where no results */
  return null;
}

GraphFilter.prototype._applyFilter = function (res, type) {

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