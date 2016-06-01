"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database initialization and startup module.
 * @module lib/core/initialize/init
 * @see core/trueno-start
 */

/** Import modules */
const Promise = require("bluebird");
const Logger = require("../logging/logger");
const InternalAPI = require('../api/internal-api');
const ExternalAPI = require('../api/external-api');

/** Description of the class */
class Init {

  /**
   * Create init object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Create external API */
    this._extAPI = new ExternalAPI(param);
    /* Create internal API */
    this._intAPI = new InternalAPI(param);
  }

  initLogger(debug){
    global.logger = new Logger({'debug': debug});
  }

  /**
   * Check all components before running the main database process.
   * @return {promise} The promise with success or error.
   */
  check() {

    //TODO: check everything here, Spark, Cassandra, Elastic-search, the spark rest server, etc.
    return new Promise((resolve, reject)=> {

      /* some async execution simulation */
      setTimeout(() => {
        resolve();
      }, 1000);

    });
  }

  /**
   * Start database process.
   * @return {promise} The promise with success or error on the starting procss.
   */
  start() {

    /* This instance object reference */
    let self = this;

    return new Promise((resolve, reject)=> {

      self._extAPI.init().then((addrs)=>{
        logger.info('Client API awaiting for connections at: ' + addrs);
      },(error)=>{
        logger.error('Error while initializing Client API.', error);
      })
    });

  }
}


/* exporting the module */
module.exports = Init;