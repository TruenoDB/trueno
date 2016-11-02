"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: local-computer.js
 * Author: victor
 * Description:
 *
 */
function LocalComputer(options, graphLabResultsCtrl, graphLabVisCtrl) {

  /* Set the web worker path */
  jsnx.workerPath = "bower_components/jsnetworkx/jsnetworkx.js";
  /* Instantiating default graph */
  this._g = new jsnx.Graph();
  /* results controller */
  this._graphLabResultsCtrl = graphLabResultsCtrl;
  /* visualization controller */
  this._graphLabVisCtrl = graphLabVisCtrl;
  /* toast */
  this._toast = options.toast;
}

/**
 * Add node to the graph.
 * @param {node} n - A graph node.
 */
LocalComputer.prototype.addNode = function (n) {
  this._g.addNode(n.id, n.properties);
}

/**
 * Add node to the graph.
 * @param {node} n - A graph node.
 */
LocalComputer.prototype.removeNode = function (n) {
  this._g.removeNode(n.id);
}

/**
 * Add edge to the graph.
 * @param {edge} e - A graph edge.
 */
LocalComputer.prototype.addEdge = function (e) {
  this._g.addEdge(e.source, e.target, e.properties);
}

/**
 * Remove edge from the graph.
 * @param {edge} e - A graph edge.
 */
LocalComputer.prototype.removeEdge = function (e) {
  this._g.removeEdge(e.source, e.target);
}

/**
 * Clear graph from all nodes and edges.
 */
LocalComputer.prototype.clearGraph = function () {
  /* Clear all graph content */
  this._g.clear();
}

/**
 * Clear graph from all nodes and edges.
 */
LocalComputer.prototype.setNewGraph = function (t) {
  /* Instantiate graph depending on the type */
  switch (t) {
    case 'directed':
      this._g = new jsnx.DiGraph();
      break;
    case 'multi_directed':
      this._g = new jsnx.MultiDiGraph();
      break;
    case 'undirected':
      this._g = new jsnx.Graph();
      break;
    case 'multi_undirected':
      this._g = new jsnx.MultiGraph();
      break;
    default:
      throw new Error('Unsupported graph type.');
  }
}


/**
 * Compute the incoming algorithm asynchronously and return the result.
 * @param {Graph} g - The graph to do the computation.
 */
LocalComputer.prototype.compute = function (algo, params) {

  /* validate that the graph contains data */
  if(this._g.nodes().length == 0 && this._g.edges().length == 0){
    this._toast.warning('Not Graph Data Present', 'Add vertices and edges before computing a job');
    return;
  }

  /* This instance object reference */
  var self = this;
  /* the result object */
  var resObj = {
    id: new Date().getTime(),
    graph: 'In Memory',
    local: true,
    label: algo.label,
    startTime: new Date(),
    json: {
      params: params,
      result: null
    }
  };

  /* computing algorithms */
  jsnx['gen' + algo.fn.charAt(0).toUpperCase() + algo.fn.slice(1)](this._g)
  .then(function (res) {

    /* setting results */
    resObj.endTime = new Date();
    resObj.elapsed = resObj.endTime - resObj.startTime;
    resObj.json.result = (res['_values']) ? Array.from(res.values()) : res;

    /* adding results */
    self._graphLabResultsCtrl.addResult(resObj);
    /* set blinker */
    self._graphLabVisCtrl.getBlinkers().results = true;
    /* show toast */
    self._toast.success(algo.label, 'Local compute job finish.');
  });

}

