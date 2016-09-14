"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Provides connection to the backend storage. Manages connection resources.
 * @module lib/backend/trueno-session-factory
 * @see module:path/referencedModuleName
 */

/** Import modules */
const connection = require('./cassandra-connection');

/* Singleton variable */
let conn = null;

/** Description of the class */
class TruenoSessionFactory {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

  }

  /**
   * Establish connection with the backend storage.
   * @private
   * @param param
   */
  static connect(param = {}) {

    conn = new connection(
        {
          hosts : [global.config.components.cassandra.configFlags.listen_address],
          ports :  global.config.components.cassandra.configFlags.native_transport_port
        }
      );
    conn.connect().then( result => {
      logger.info('Cassandra instance connected on ', conn.hosts, ':', conn.ports)
    }).catch( e => {
      logger.error('Error while trying to connect to backend storage on ', conn.hosts, ':', conn.ports);
      console.log(e);
    })
  };

  /**
   * Disconnect from the backend storage.
   */
  static disconnect() {

    conn.disconnect().then ( result => {

    }).catch( e => {
      console.log(e);
    });

  };


  /**
   * Returns a connection to the backend storage.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
  static getConnection(myParam) {

    /* init singleton if null */
    if (!conn) {
      this.connect();
    }

    return conn;
  }
}


/* exporting the module */
module.exports = TruenoSessionFactory;
