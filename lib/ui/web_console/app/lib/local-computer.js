"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: local-computer.js
 * Author: victor
 * Description:
 *
 */
function LocalComputer(options) {

  /* Set the web worker path */
  jsnx.workerPath = "bower_components/jsnetworkx/jsnetworkx.js";
  /* Instantiating default graph */
  this._g = new jsnx.Graph();
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
LocalComputer.prototype.compute = function (g) {

  /* This instance object reference */
  var self = this;


  //jsnx.genFindCliques(this._g).then(function(cliques) {
  //  console.log(cliques);
  //});

}

