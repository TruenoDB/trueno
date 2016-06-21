"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Graph Management class.
 * @module lib/backend/trueno-graph-management
 * @see backend:lib/backend/trueno-session-factory
 */

/** Import modules */
const Promise = require("bluebird");
const Session = require('./trueno-session-factory');
const Enums = require('../core/enum/backend');

/* query builder */
const ROOT_KEYSPACE = Enums.Constant.ROOT_KEYSPACE;
const queryBuilder = require('./query-builder');
var q = new queryBuilder();

var Components = Enums.Components;
var Operations = Enums.Operations;

/** Description of the class */
class TruenoGraphManagement {

  /**
   * Init graph management class.
   */
  static init() {

    let conn = Session.getConnection();

    /* return promise */
    return new Promise((resolve, reject)=> {

      /* check for master graph table */
      conn.execute(`SELECT id FROM ${ROOT_KEYSPACE}.GRAPH;`).then(result => {

        resolve();
      }).catch(error => {

        /* create structure */
        let graphParams = {'name': ROOT_KEYSPACE, 'strategy': 'SimpleStrategy', 'replicationFactor': 3};
        return conn.execute(q.build(Components.GRAPH, Operations.CREATE, graphParams));
      }).then(result => {

        /* graph keyspace created, now use it */
        /* execute query and return promise */
        return conn.execute(q.build(Components.GENERAL, Operations.USE, {name: ROOT_KEYSPACE}));

      }).then(result => {

        /* create required data types */
        return conn.execute('CREATE TYPE trueno_tuple ( type TEXT, value TEXT)');

      }).then(result => {

        /* create graph table */
        return conn.execute(q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE, {keyspace: ROOT_KEYSPACE}));

      }).then(result => {

        /* resolve promise */
        resolve();

      }).catch(error => {

        //console.log(error);
        reject(error);
      });
    });

  };

}


/* exporting the module */
module.exports = TruenoGraphManagement;
