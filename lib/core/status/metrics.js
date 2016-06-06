"use strict";

/**
 * @author Victor O. Santos Uceta
 * Metrics Collection class.
 * @module lib/core/status/metrics
 * @see module:lib/core/status/instance
 */

/** Import modules */
const Promise = require("bluebird");

/** Metrics collection class */
class Metrics {

  /**
   * Create a Metrics object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Create the system metrics object */
  }

  /**
   * Collect system metrics.
   * @return {boolean} A true hardcoded value.
   */
  collectSystemMetrics() {

    /* Return collection promise in case it becomes async in the future */
    return new Promise((resolve, reject) => {

      /* This instance object reference */
      let self = this;

      /* Use the platform  and OS module */
      var platform = require('platform');
      var os = require('os');

      /* Collect all metrics */
      self.arch = platform.os.architecture;
      self.cpu = os.cpus()[0];
      self.cpu.cores = os.cpus().length;
      self.network = null;
      self.freemem = os.freemem();
      self.hostname = os.hostname();
      self.platform = platform.name;
      self.totalmem = os.totalmem();
      self.uptime = os.uptime();
      self.osversion = os.release();
      self.version = platform.version;

      /* Humanize the platform */
      switch (os.platform()) {
        case "linux":
          self.os = "Linux";
          break;
        case "darwin":
          self.os = "OS X";
          break;
        case "win32":
          self.os = "Windows";
          break;
        case "sunos":
          self.os = "SunOS";
          break;
        default:
          self.os = os.platform();
          break;
      }
      /* resolve promise */
      resolve(self);
    });
  }
}


/* exporting the module */
module.exports = Metrics;