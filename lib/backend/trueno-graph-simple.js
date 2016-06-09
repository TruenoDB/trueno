"use strict";

/**
 * @author ebarsallo
 * Trueno Graph basic implementation, which is not intended to support transactions. Modifications on the graph are
 * persisted in C* as single operations on their components (eg. adding an edge, deleting an edge, creating a vertex,
 * etc)
 * @module lib/backend/TruenoGraphSimple
 * @see module:path/referencedModuleName
 */

/** Import modules */
var  SessionFactory = require('./trueno-session-factory');
//const fs = require('fs');

// FIXME: storage credential should not be here. Connection to storage need to be manage by trueno-session-factory
//const config = require('./conf/trueno-cassandra.json'),
//  hostnames = config['hostnames'];

//const connection = require('./cassandraConnection');
const Enums = require('../core/enum/backend');
//const utils = require('./util/conv');


// new
const SessionUtil = require('./trueno-session-util');
const VertexMap = require('./storage/vertex');
const EdgeMap = require('./storage/edge');
const GraphMap = require('./storage/graph');
const Graph = require('../core/data_structures/graph');


/* query builder */
const queryBuilder = require('./query-builder');
var q = new queryBuilder();
var Components = Enums.Components;
var Operations = Enums.Operations;


// FIXME: Oversimplification. ThrusterGraph is used as an interface to connect to the C* backend, which should not be the case
// FIXME: Avoid SQL inyection. Validate every value against the type expected.

/** Description of the class */
class TruenoGraphSimple {


  // FIXME: Callback style for function/class/methods.
  // FIXME: Connection has to be done on session-factory
  /**
   * Create a TruenoGraph object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    //let hosts = param.hostnames || hostnames;
    let name  = param.graph;
    //
    this._conn = SessionFactory.getConnection();
    //this._conn = new connection({hosts: [hosts]});
    //this._conn.connect().then( result => {
    //
    //}).catch( e => {
    //  console.log(e);
    //})

    this._name = name;

    // new
    this._session = new SessionUtil();

  };


  /**
   *
   */
  close() {
  //
  //  this._conn.disconnect().then ( result => {
  //
  //  }).catch( e => {
  //    console.log(e);
  //  });
  //
  }


  /**
   * Create a graph in Trueno backend storage
   * @param graph
   */
  addGraph(graph) {

    /* Graph params */
    let graphParams =  {'name': graph.id, 'strategy':'SimpleStrategy', 'replicationFactor': 3};
    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject)=>{
      /* Execute Create graph Query */
      self._conn.execute(q.build(Components.GRAPH, Operations.CREATE, graphParams)).then( result => {

        /* graph keyspace created, now use it */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name}));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_VERTEX_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_EDGE_TABLE));

      }).then( result => {

        let g = new GraphMap(param);
        let q = self._session.inserto(g);

        console.log('addGraph: [' + q + ']');

        return self._conn.execute(q);

      }).then( result => {

        /* try to disconnect */
        console.log("Creating graph successful");

        /* resolving main promise */
        resolve();

      }).catch( e => {
        console.log(e);

        /* rejecting promise */
        reject(e);
      });

    });

  };


  /**
   *
   * @param graph
   */
  updateGraph(graph) {

    let g = new GraphMap(graph);
    let q = this._session.updato(graph);

    this._conn.execute(q).then( result => {

    }).catch( e => {

      console.log(e);
    })
  };


  /**
   *
   * @param graph
   */
  removeGraph(graph) {

  };


  /**
   * Add a vertex to a graph G.
   * @param vertex
   */
  addVertex(vertex) {

    vertex.graphid = this._name;
    let v = new VertexMap(vertex);
    let q = this._session.inserto(v);

    console.log('addVertex: [' + q + ']');


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


    return new Promise((resolve, reject) => {

      /* Try to execute the query */
      this._conn.execute( (err) => {

        /* Reject the promise with error */
        if(err){
          reject(err);
        }
        /* Resolve the promise */
        resolve();
      });
    });

    this._conn.execute(q).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };

  /**
   *
   * @param vertex
   */
  removeVertex(vertex) {

    this._conn.execute(q.build(Components.VERTEX, Operations.DELETE, {node: vertex.id})).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };


  /**
   *
   * @param edge
   */
  addEdge(edge) {

    edge.graphid = this._name;
    let e = new EdgeMap(edge);
    let q = this._session.inserto(e);

    console.log('addEdge: [' + q + ']');

    this._conn.execute(q).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };


  // FIXME
  // It's a better idea to have this remove edge as part of edge entity
  /**
   *
   * @param edge
   */
  removeEdge(edge) {

  };


  import(myfile) {

  }


  listAllNodes() {

  }


  listNeighborsbyNode() {

  }

}


/* exporting the module */
module.exports = TruenoGraphSimple;
