"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');

/** Description of the class */
class ThrusterGraph {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._property = param.prop || 'someValue';
  }


  import(myfile) {

  }


  listAllNodes() {

  }


  listNeighborsbyNode() {

  }


  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
  myfunction(myParam) {

    /* This instance object reference */
    var self = this;

    /* some async execution */
    setTimeout(() => {
      self._property = myParam;
    }, 1000);

    return true;
  }
}


/* exporting the module */
module.exports = ThrusterGraph;
