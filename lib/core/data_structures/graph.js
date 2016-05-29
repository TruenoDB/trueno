"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph class data structure.
 * @module lib/core/data_structures/graph
 * @see module:core/worker
 */


/** The graph data structure class */
class Graph {

  /**
   * Create a Graph object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The internal id of the graph */
    this._id = null;
    /* The name of the graph */
    this._name = param.name;
    /* If true, graph is directed, if false is undirected(default) */
    this._directed = param.directed || false;
    /* True if the graph is dynamic, default static */
    this._dynamic = param.dynamic || false;
    /* True if the graph is a multigraph(parallel edges between same vertices */
    this._multi = param.multi || false;
    /* Graph custom attributes */
    this._attributes = param.attributes || {};
    /* Graph custom computed fields */
    this._computed = param.computed || {};
    /* Graph metadata */
    this._meta = param.meta || {};

  }


  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
  myfunction(myParam) {

  }
}


/* exporting the module */
module.exports = Graph;