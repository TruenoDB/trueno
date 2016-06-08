"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Provides connection to the backend storage. Manages connection resources.
 * @module lib/backend/trueno-session-factory
 * @see module:path/referencedModuleName
 */

/** Import modules */
const connection = require('./cassandraConnection');
const config = require('./conf/trueno-cassandra.json'),
  hostnames  = config['hostnames'];

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

    conn = new connection({hosts: [hostnames]});
    conn.connect().then( result => {

      //console.log('=====connection!');
    }).catch( e => {
      //console.log('=====error on connection!')
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
      //console.log('=====try to get connection!');
      this.connect();
    }

    return conn;
  }
}


/* exporting the module */
module.exports = TruenoSessionFactory;
