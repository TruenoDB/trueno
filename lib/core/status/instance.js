"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database Instance class.
 * @module lib/core/status/instance
 * @see module:lib/core/status/status
 */

/** Import modules */
const Metrics = require('./metrics');

/** Description of the class */
class Instance {

  /**
   * Create a Instance object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* The system metrics object */
    this._metrics = new Metrics();
  }

  /**
   * Collect this machine metrics.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
  collectMetrics() {
    return this._metrics.collectSystemMetrics();
  }

}

/* exporting the module */
module.exports = Instance;