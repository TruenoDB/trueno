"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Graph Management class.
 * @module lib/backend/trueno-graph-management
 * @see backend:lib/backend/trueno-session-factory
 */

/** Import modules */
const SimpleGraphAPI = require('./trueno-graph-simple');
const Session = require('./trueno-session-factory');
const Enums = require('../core/enum/backend');
const Promise = require("bluebird");

/* query builder */
const ROOT_KEYSPACE = Enums.Constant.ROOT_KEYSPACE;
const queryBuilder = require('./query-builder');
var q = new queryBuilder();

var Components = Enums.Components;
var Operations = Enums.Operations;

/** Description of the class */
class TruenoStorageManager {

  /**
   * Create a Backing Storage Manager.
   */
  constructor() {

  }

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


  /**
   * FIXME: This is a temporal solution. Pending to uniform structures between backend and driver, and eliminates this non-sense cast.
   * Cast an obj structure received from the driver to a component structure needed by the backend.
   * @param o Object reveiced from driver.
   * @returns {{}}
   */
  castObj(o) {

    // logger.info('======backend manager [1]')
    // console.log(o);

    let obj = {};
    obj['_property'] = {};
    Object.keys(o).map((k)=> {
      obj['_property']['_'.concat(k)] = o[k];
    });

    // logger.info('======backend manager [2]')
    // console.log(obj);

    return obj
  }

  /**
   * Persist graph in the backing storage (C*).
   * @param obj Graph
   * @returns {Promise}
     */
  createGraph(obj) {

    let g = this.castObj(obj);

    let G = new SimpleGraphAPI({graph: g._property._id});
    return G.addGraph(g);
  }

  /**
   * Persist an object in the backing storage (C*).
   * @private
   * @param obj Object
   * @param idx
   * @param type Object type (graph, vertex, edge)
   * @returns {Promise}
   */
  persist(obj, idx, type) {

    /* This instance object reference */
    let self = this;

    /* casting obj to backend component */
    let o = this.castObj(obj);
    /* logging */
    logger.debug('[storage-manager] persist', o);

    /* backend */
    let G = new SimpleGraphAPI({graph: o._property._graphid});

    switch (type) {

      /* graph */
      case 'g':

        /* This returns a promise immediately */
        return G.updateGraph(o);
        break;

      /* edge */
      case 'e':

        /* This returns a promise immediately */
        return G.updateEdge(o);
        break;

      /* vertex */
      case 'v':

        /* This returns a promise immediately */
        return G.updateVertex(o);

        break;

      default:
        break;
    }

  }
}


/* exporting the module */
module.exports = TruenoStorageManager;
