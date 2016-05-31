"use strict";

/**
 * @author ebarsallo
 * Entity class that represent a graph.
 * @module dato/graph
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');



/** Description of the class */
class Graph {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._property = param.prop || 'someValue';
  }


}


/* exporting the module */
module.exports = Graph;
