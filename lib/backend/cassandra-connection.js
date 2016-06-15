"use strict";

/**
 * @author Victor O. Santos Uceta
 * Cassandra Connection Module.
 * @module backend/cassandraConnection
 * @see module:backend/query
 */

/** Import modules */
const Promise = require("bluebird");
const cassandra = require('cassandra-driver');

/** block level variable for singleton class */
let instance = null;

/** Wrapper Class for the Cassandra backend connection */
class CassandraConnection {


  /**
   * Create a connection object.
   * @param {object} [opts= {}] - The options object.
   * @return {CassandraConnection} A singleton CassandraConnection object.
   */
	constructor(opts = {}){

		/* check if already instantiated */
		if(!instance){
      instance = this;
    }

		this._hosts = opts.hosts || ["localhost"];
		this._client  = null;

		/* return singleton reference */
 		return instance;
	}

  /**
   * Connect to the provided Casssandra hosts backends.
   * @return {promise} A promise with the async result of the connection attempt.
   */
	connect() {

		/* This instance object reference */
		var self = this;

		return new Promise((resolve, reject) => {
			/* Create the client */
			self._client = new cassandra.Client({ contactPoints: self._hosts});
			/* Try to connect */
			self._client.connect((err) => {

			  /* Reject the promise with error */
			  if(err){
			  	reject(err);
			  }
			  /* Resolve the promise */
			  resolve();
			});
		});
	}

  /**
   * Disconect from the Casssandra backend.
   * @return {promise} A promise with the async result of the disconnection attempt.
   */
	disconnect() {

		/* This instance object reference */
		var self = this;

		/* Return the promise with the async execution */
		return new Promise((resolve, reject) => {
			/* Try to disconnect */
			self._client.shutdown( (err) => {

			  /* Reject the promise with error */
			  if(err){
			  	reject(err);
			  }
			  /* Resolve the promise */
			  resolve();
			});
		});
	}

  /**
   * Execute the provided query on the Casssandra backend.
   * @param {string} query - The query to be executed.
   * @return {promise} A promise with the async result of the query execution attempt.
   */
	execute(query) {

		/* This instance object reference */
		var self = this;

		/* Return the promise with the async execution */
		return new Promise((resolve, reject) => {

			/* Execute the query */
			self._client.execute(query, {}, (err, result) => {

			  /* Reject the promise with error */
			  if(err){
			  	reject(err);
			  }
			  /* Resolve the promise */
			  resolve(result);
			});
		});
	}

  eachRow(query) {

    ///* This instance object reference */
    //var self = this;
    //
    ///* return the promise with the async execution */
    //return new Promise((resolve, reject) => {
    //
    //  /* Execute the query */
    //  self._client.eachRow(query, (err, result) => {
    //
    //    /* Reject the promise with error */
    //    if(err) {
    //      reject(err);
    //    }
    //
    //    /* Resolve the promise*/
    //    resolve(result);
    //
    //  });
    //
    //});
  }

  stream(query) {

    /* This instance object reference */
    var self = this;

    /* Execute the query */
    return self._client.stream(query);
  }

  // TODO: implement prepare statement function.
  // Note. There are some benefits of using prepare statement over regular sql satement, but this
  // also will require some modifications to other classes (eg. query-builder).


}


/* exporting the module */
module.exports = CassandraConnection;
