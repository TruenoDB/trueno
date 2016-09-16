"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Graph Storage Management class.
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

/** Backend Storage Manager */
class TruenoStorageManager {

  /**
   * Create a Backend Storage Manager.
   */
  constructor() {

  }

  // FIXME: move promise to trueno-graph-simple.
  /**
   * Init graph management class. If needed, the init process will create the following structures in the storage
   * backend (C*):
   * <ul>
   *     <li><b>${ROOT_KEYSPACE}</b> keyspace, to store system configuration.</li>
   *     <li><b>TRUENO_TUPLE</b> tuple type, which describe the basic data type used by Trueno to store fields in the
   *     system.</li>
   *     <li><b>${ROOT_KEYPSACE}.GRAPH</b> to store info about graph managed by Trueno.</li>
   * </ul>
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

        /* reject */
        reject(error);
      });
    });

  };

  /**
   * FIXME: This is a temporal solution. Pending to uniform structures between backend and driver, and eliminates this non-sense cast.
   * Cast an obj structure received from the driver to a component structure needed by the backend.
   * @param o Object received from driver.
   * @returns {Object} - Component (@see lib/core/data_structures)
   */
  castObj(o) {

    let obj = {};
    obj['_property'] = {};
    Object.keys(o).map((k)=> {
      obj['_property']['_'.concat(k)] = o[k];
    });

    return obj;
  }

  /**
   * Persist graph in the storage backend (C*).
   * @param {Object} obj - Graph component.
   * @returns {Promise}
   */
  createGraph(obj, graph) {

    let g = this.castObj(obj);

    let G = new SimpleGraphAPI({graph: g._property._id});
    return G.addGraph(g);
  }

  /**
   * Persist a component (graph, vertice, edge) in the storage backend (C*). Component are stored using the Simple
   * Graph API, which does not support transactions.
   * @private
   * @param {Component} obj - Trueno component, either graph, vertex or edge.
   * @param {String} idx - Graph label.
   * @param {String }type - The component type, can be 'g', 'G', 'v', 'V', 'e', 'E'.
   * @returns {Promise} - Promise with the result.
   */
  persist(obj, idx, type) {

    /* This instance object reference */
    let self = this;

    /* casting obj to backend component */
    obj.graphid = idx;
    let o = this.castObj(obj);

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

  /**
   * Destroy or delete a component (graph, vertice, edge) in the storage backend (C*). Components are deleted using
   * Simple Graph API, which does not support transactions.
   * @param {Object} obj - Trueno component, either graph, vertex or edge.
   * @param {String} idx - Graph label.
   * @param {String} type - The component type, can be 'g', 'G', 'v', 'V', 'e', 'E'.
   * @returns {Promise} - Promise with the result.
   */
  destroy(obj, idx, type) {

    /* This instance object reference */
    let self = this;

    /* casting obj to backend component */
    obj.graphid = idx;
    let o = this.castObj(obj);

    /* backend */
    let G = new SimpleGraphAPI({graph: o._property._graphid});

    switch (type) {

      /* graph */
      case 'g':

        /* This returns a promise immediately */
        return G.removeGraph(o);
        break;

      /* edge */
      case 'e':

        /* This returns a promise immediately */
        return G.removeEdge(o);
        break;

      /* vertex */
      case 'v':

        /* This returns a promise immediately */
        return G.removeVertex(o);

        break;

      default:

        /* TODO: Report an error */
        break;
    }

  }

  /**
   * Retrieve a list or a single component (graph, vertice, edge) from the storage backend (C*). Components are
   * retrieved using the Simple Graph API.
   * @param {Object} obj - Trueno component, either graph, vertex or edge.
   * @param {String} idx - Graph label.
   * @param {String} type - The component type, can be 'g', 'G', 'v', 'V', 'e', 'E'.
   * @returns {Promise} - Promise with the result (list of component).
   */
  fetch(list, idx, type) {

    /* This instance object reference */
    let self = this;

    /* backend */
    let g = new SimpleGraphAPI({graph: idx});

    /* results */
    let result = [];

    /* return a promise with the async operation */
    return new Promise((resolve, reject) => {

      let promises = [];

      list.forEach((obj)=>{
        /* set values */
        obj._source.graphid = idx;
        let o = this.castObj(obj._source);
        /* call async*/
        promises.push(self.fetch_one(g, o, type));
      });

      Promise.all(promises).then((rows) => {
        /* insert your results here */
        /*resolve the outer promise */
        resolve(rows);
      }, (err) => {
        reject(err);
      })

    });
  }

  /**
   * Retrieve a single component (graph, vertice, edge) from the storage backend (C*). Components are retrieved using
   * Simple Graph API.
   * @param {Object} g - Trueno Simple Graph API instance
   * @param {Object} obj - Trueno component, either graph, vertex or edge.
   * @param {String} type - The component type, can be 'g', 'G', 'v', 'V', 'e', 'E'.
   * @returns {Promise} - Promise with result (retrieved component).
   */
  fetch_one(g, obj, type) {

    switch (type) {

      /* graph */
      case 'g':

        /* This returns a promise immediately */
        return g.getGraph(obj);
        break;

      /* edge */
      case 'e':

        /* This returns a promise immediately */
        return g.getEdge(obj);
        break;

      /* vertex */
      case 'v':

        /* This returns a promise immediately */
        return g.getVertex(obj);
        break;

      default:

        /* TODO: Report an error */
        break;
    };
  }

  bulk(b, idx) {

    /* the bulk operations array */
    let operations = [];

    /* backend */
    let g = new SimpleGraphAPI({graph: idx});

    /* for each operation build the bulk corresponding operation */
    b.forEach((e)=> {
      /* query to be executed against the storage backend */
      let query;
      /* object to update */
      let obj = e.content.obj;
      /* casting object */
      obj.graphid = idx;
      let ent = this.castObj(obj);

      // console.log('obj => ', obj);
      // console.log('end => ', ent);

      /* adding query */
      query = g.getCQL(ent, e.content.type, e.op);
      operations.push(query);
    });

    // console.log(operations);

    /* return a promise (of executing the queries on the storage) */
    //return g.batch(operations);

    return new Promise((resolve, reject) => {

      g.batch(operations).then((good) => {
          resolve(good)
        }, (err) => {
          console.log(operations);
          reject(err);
        }
      )
    });
  }

}


/* exporting the module */
module.exports = TruenoStorageManager;
